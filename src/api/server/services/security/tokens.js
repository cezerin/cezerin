'use strict';

const url = require('url');
const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');
const settings = require('../../lib/settings');
const emailSender = require('../../lib/email');
const SettingsService = require('../settings/settings');
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const uaParser = require('ua-parser-js');
const cache = require('lru-cache')({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24 // 24h
});
const BLACKLIST_CACHE_KEY = 'blacklist';

class SecurityTokensService {
  constructor() {}

  getTokens(params = {}) {
    let filter = {
      is_revoked: false
    };
    const id = parse.getObjectIDIfValid(params.id);
    if (id) {
      filter._id = new ObjectID(id);
    }

    const email = parse.getString(params.email).toLowerCase();
    if (email && email.length > 0) {
      filter.email = email;
    }

    return mongo.db.collection('tokens').find(filter).toArray().then(items => items.map(item => this.changeProperties(item)))
  }

  getTokensBlacklist() {
    const blacklistFromCache = cache.get(BLACKLIST_CACHE_KEY);

    if (blacklistFromCache) {
      return Promise.resolve(blacklistFromCache);
    } else {
      return mongo.db.collection('tokens').find({
        is_revoked: true
      }, {_id: 1}).toArray().then(items => {
        const blacklistFromDB = items.map(item => item._id.toString());
        cache.set(BLACKLIST_CACHE_KEY, blacklistFromDB);
        return blacklistFromDB;
      })
    }
  }

  getSingleToken(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    return this.getTokens({id: id}).then(items => {
      return items.length > 0
        ? items[0]
        : null;
    })
  }

  getSingleTokenByEmail(email) {
    return this.getTokens({email}).then(items => {
      return items.length > 0
        ? items[0]
        : null;
    })
  }

  addToken(data) {
    return this.getValidDocumentForInsert(data).then(tokenData => mongo.db.collection('tokens').insertMany([tokenData])).then(res => this.getSingleToken(res.ops[0]._id.toString())).then(token => this.getSignedToken(token).then(signedToken => {
      token.token = signedToken;
      return token;
    }))
  }

  updateToken(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const tokenObjectID = new ObjectID(id);
    const token = this.getValidDocumentForUpdate(id, data);

    return mongo.db.collection('tokens').updateOne({
      _id: tokenObjectID
    }, {$set: token}).then(res => this.getSingleToken(id));
  }

  deleteToken(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const tokenObjectID = new ObjectID(id);
    return mongo.db.collection('tokens').updateOne({
      _id: tokenObjectID
    }, {
      $set: {
        is_revoked: true,
        date_created: new Date()
      }
    }).then(res => {
      cache.del(BLACKLIST_CACHE_KEY);
    });
  }

  checkTokenEmailUnique(email) {
    if(email && email.length > 0){
      return mongo.db.collection('tokens').count({email: email, is_revoked: false}).then(count => count === 0
        ? email
        : Promise.reject('Token email must be unique'));
    } else {
      return Promise.resolve(email);
    }
  }

  getValidDocumentForInsert(data) {
    const email = parse.getString(data.email);
    return this.checkTokenEmailUnique(email).then(email => {
      let token = {
        is_revoked: false,
        date_created: new Date()
      }

      token.name = parse.getString(data.name);
      if(email && email.length > 0){
        token.email = email.toLowerCase();
      }
      token.scopes = parse.getArrayIfValid(data.scopes);
      token.expiration = parse.getNumberIfPositive(data.expiration);

      return token;
    })
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let token = {
      'date_updated': new Date()
    }

    if (data.name !== undefined) {
      token.name = parse.getString(data.name);
    }

    if (data.expiration !== undefined) {
      token.expiration = parse.getNumberIfPositive(data.expiration);
    }

    return token;
  }

  changeProperties(item) {
    if (item) {
      item.id = item._id.toString();
      delete item._id;
      delete item.is_revoked;
    }

    return item;
  }

  getSignedToken(token) {
    return new Promise((resolve, reject) => {
      const jwtOptions = {};

      let payload = {
        scopes: token.scopes,
        jti: token.id
      }

      if (token.email && token.email.length > 0) {
        payload.email = token.email.toLowerCase()
      }

      if (token.expiration) {
        // convert hour to sec
        jwtOptions.expiresIn = token.expiration * 60 * 60;
      }

      jwt.sign(payload, settings.jwtSecretKey, jwtOptions, (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      });
    })
  }

  getDashboardSigninUrl(email) {
    return SettingsService.getSettings().then(generalSettings =>
      this.getSingleTokenByEmail(email).then(token => {
        if(token) {
          return this.getSignedToken(token).then(signedToken => {
            const loginUrl = url.resolve(generalSettings.domain, settings.adminLoginUrl);
            return `${loginUrl}?token=${signedToken}`;
          })
        } else {
          return null;
        }
      })
    )
  }

  sendDashboardSigninUrl(req) {
    const email = req.body.email;
    const userAgent = uaParser(req.get('user-agent'));
    const cloudFlareCountry = req.get('cf-ipcountry') || '';
    let ip = req.get('x-forwarded-for') || req.ip;

    if(ip && ip.includes(', ')) {
      ip = ip.split(', ')[0];
    }

    if(ip && ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    const dateEmail = moment(new Date()).format('dddd, MMMM DD, YYYY h:mm A');

    return this.getDashboardSigninUrl(email).then(linkUrl => {
      if(linkUrl) {
        const message = {
          to: email,
          subject: `New sign-in from ${userAgent.os.name}`,
          html: `Your email address was just used to request a Sign In email to Cezerin Dashboard.<br /><br />
<b>If this was you</b>, <a href='${linkUrl}'>click here to Sign In</a><br />
<b>If this was not you</b>, you can safely ignore this email.<br /><br />
<b>Request from</b>:<br />
${userAgent.os.name}<br />
${dateEmail}<br />
${ip}<br />
${cloudFlareCountry}<br /><br />
Best,<br />
Cezerin Robot`
        };
        return emailSender.send(message).then(info => {return { sent: true, error: null }}).catch(err => {return { sent: false, error: err }});
      } else {
        return { sent: false, error: 'Access Denied' };
      }
    });
  }
}

module.exports = new SecurityTokensService();
