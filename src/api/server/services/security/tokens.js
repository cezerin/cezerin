'use strict';

const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');
const settings = require('../../lib/settings');
const emailSender = require('../../lib/email');
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

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

    const email = parse.getString(params.email);
    if (email && email.length > 0) {
      filter.email = email;
    }

    return mongo.db.collection('tokens').find(filter).toArray().then(items => items.map(item => this.renameDocumentFields(item)))
  }

  getTokensBlacklist() {
    return mongo.db.collection('tokens').find({
      is_revoked: true
    }, {_id: 1}).toArray().then(items => items.map(item => item._id))
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
    return this.getDocumentForInsert(data).then(tokenData => mongo.db.collection('tokens').insertMany([tokenData])).then(res => this.getSingleToken(res.ops[0]._id.toString())).then(token => this.getSignedToken(token).then(signedToken => {
      token.token = signedToken;
      return token;
    }))
  }

  updateToken(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const tokenObjectID = new ObjectID(id);
    const token = this.getDocumentForUpdate(id, data);

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
    });
  }

  checkTokenEmailUnique(email) {
    return mongo.db.collection('tokens').count({email: email, is_revoked: false}).then(count => count === 0
      ? email
      : Promise.reject('Token email must be unique'));
  }

  getDocumentForInsert(data) {
    const email = parse.getString(data.email);
    return this.checkTokenEmailUnique(email).then(email => {
      let token = {
        is_revoked: false,
        date_created: new Date()
      }

      token.name = parse.getString(data.name);
      token.email = email;
      token.scopes = parse.getArrayIfValid(data.scopes);
      token.expiration = parse.getNumberIfPositive(data.expiration);

      return token;
    })
  }

  getDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let token = {
      'date_updated': new Date()
    }

    if (data.name !== undefined) {
      token.name = parse.getString(data.name);
    }

    return token;
  }

  renameDocumentFields(item) {
    if (item) {
      item.id = item._id.toString();
      delete item._id;
      delete item.is_revoked;

      if (item.expiration) {
        const tokenExpiration = new Date(item.expiration * 1000);
        item.is_expired = Date.now() >= tokenExpiration;
      } else {
        item.is_expired = false;
      }
    }

    return item;
  }

  getSignedToken(token) {
    return new Promise((resolve, reject) => {
      let payload = {
        email: token.email,
        scopes: token.scopes,
        jti: token.id
      }

      if (token.expiration) {
        payload.exp = token.expiration;
      }

      jwt.sign(payload, settings.security.jwtSecret, {
        noTimestamp: true
      }, (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      });
    })
  }

  getDashboardSigninUrl(email) {
    return this.getSingleTokenByEmail(email).then(token => {
      if(token && !token.is_expired) {
        return this.getSignedToken(token).then(signedToken => {
          return `${settings.adminLoginUrl}?token=${signedToken}`;
        })
      } else {
        return null;
      }
    })
  }

  sendDashboardSigninUrl(email) {
    return this.getDashboardSigninUrl(email).then(linkUrl => {
      if(linkUrl) {
        const message = {
          to: email,
          subject: `Sign-in URL`,
          html: `<p><a href='${linkUrl}'>Sign-in</a></p>`
        };
        return emailSender.send(message).then(info => {return { sent: true, error: null }}).catch(err => {return { sent: false, error: err }});
      } else {
        return { sent: false, error: 'Access Denied' };
      }
    });
  }

}

module.exports = new SecurityTokensService();
