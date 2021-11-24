import axios from 'axios';
import config from '../config/config';
import logger from '../config/logger';

export default class GoogleServices {
  constructor() {
    this.isAvailable = false;

    if (config.googleMapsKey) {
      this.apiKey = config.googleMapsKey;
      this.isAvailable = true;

      this.axios = axios.create({
        baseURL: 'https://maps.googleapis.com/maps/api',
        params: {
          key: config.googleMapsKey,
        },
      });
    }
  }

  async geocodeByAddress({ number, street, city, state, neighborhood }) {
    try {
      if (!this.isAvailable)
        throw new Error('Google Services não está disponível');

      const addressString = [street, number, neighborhood, city, state]
        .filter((v) => v)
        .join(',');
      const url = `geocode/json?&address=${encodeURI(addressString)}`;
      const {
        data: { results = [] },
      } = await this.axios.get(url);
      const [{ geometry = {} }] = results;
      return geometry;
    } catch (error) {
      logger.error('GoogleServices:geocodeByAddress:', error);
      return null;
    }
  }
}
