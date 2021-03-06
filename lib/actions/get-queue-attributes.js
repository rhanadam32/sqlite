'use strict';

const { getQueueAttributes } = require('../sqs');
const { toXml, toXmlError } = require('../utils/xml-helper');

/**
 * Retrieve attributes of the queue.
 *
 * @param {Object.<string, string>} body - Request body.
 * @returns {string} GetQueueAttributesResponse in XML format.
 * @throws ErrorResponse in XML format, based on `getQueueAttributes` errors.
 */
module.exports = (body) => {
  const { QueueUrl } = body;
  const keys = Object.keys(body);

  const attributes = [];
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].startsWith('AttributeName')) attributes.push(body[keys[i]]);
  }

  try {
    /** @type {Object.<string, any>} */
    const res = getQueueAttributes(QueueUrl, attributes);
    return toXml('GetQueueAttributesResponse', {
      GetQueueAttributesResult: {
        Attribute: Object.keys(res).map((key) => ({
          Name: key,
          Value: res[key]
        }))
      }
    });
  } catch (err) {
    throw toXmlError(err);
  }
};
