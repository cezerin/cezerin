'use strict';

var mongo = require('../../lib/mongo');
var parse = require('../../lib/parse');

class EmailTemplatesService {
  constructor() {}

  getEmailTemplate(name) {
    return mongo.db.collection('emailTemplates').findOne({name: name}).then(template => {
      return this.renameDocumentFields(template);
    });
  }

  updateEmailTemplate(name, data) {
    const template = this.getDocumentForUpdate(data);
    return mongo.db.collection('emailTemplates').updateOne({name: name}, {
      $set: template
    }, {upsert: true}).then(res => this.getEmailTemplate(name));
  }

  getDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let template = {}

    if (data.subject !== undefined) {
      template.subject = parse.getString(data.subject);
    }

    if (data.body !== undefined) {
      template.body = parse.getString(data.body);
    }

    return template;
  }

  renameDocumentFields(template) {
    if (template) {
      delete template._id;
      delete template.name;
    }

    return template;
  }
}

module.exports = new EmailTemplatesService();
