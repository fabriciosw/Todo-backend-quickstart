import Mixpanel from 'mixpanel';
import flatten from 'flat';
import config from '../config/config';
import logger from '../config/logger';

function convertObjectToMixPanel(data) {
  if (!data || Object.keys(data).length <= 0) return {};
  const flattenData = flatten(data);
  const newData = {};
  Object.keys(flattenData).forEach((key) => {
    if (
      key.includes('_bsontype') ||
      key.includes('id') ||
      key.includes('password') ||
      key.includes('senha')
    )
      return;

    newData[`$${key}`] = flattenData[key];
  });
  return newData;
}

export default class MixPanel {
  constructor() {
    this.isAvailable = false;

    if (config.mixPanelKey) {
      this.apiKey = config.mixPanelKey;
      this.isAvailable = true;
      this.mixpanel = Mixpanel.init(config.mixPanelKey);
    }
  }

  async trackEvent(eventName, data = null) {
    try {
      if (!this.isAvailable) return null;
      let parsedData = {};

      if (data) {
        parsedData = convertObjectToMixPanel(data);
      }

      this.mixpanel.track(eventName, parsedData);
      return true;
    } catch (error) {
      logger.error('MixPanel:trackEvent:', error);
      return false;
    }
  }
}
