const axios = require('axios');
const pagarme = require('pagarme');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Código -	Significado
 * 200 - Tudo ocorreu como deveria e sua requisição foi processada com sucesso.
 * 400 - Algum parâmetro obrigatório não foi passado, ou os parâmetros passados não estão corretos.
 * 401 - Falta de autorização para acessar este endpoint.
 * 404 - Endpoint não encontrado, revise a URL passada.
 * 500 - Erro interno do Pagar.me, tente sua requisição novamente. Caso o erro continue, entre em contato com suporte@pagar.me

 * Tipo do erro - Significado
 * invalid_parameter -	Quando algum parâmetro passado está incorreto/faltando.
 * action_forbidden - Quando o usuário não tem permissão para fazer determinada ação.
 * internal_error -Quando algum erro interno em nosso servidor ocorreu.
 * not_found - Quando o recurso procurado não foi encontrado/não existe.
 */

function handleException(errorResponse) {
  logger.error(
    `Pagarme:handleException: ${JSON.stringify(errorResponse.data)}`
  );
  switch (errorResponse.status) {
    case 400:
    case 404:
      throw new Error('Não encontrado.');
    case 500:
      throw new Error('Erro com API de pagamento.');
    default:
      throw errorResponse.data.errors[0];
  }
}

export default class Pagarme {
  constructor() {
    this.isAvailable = false;

    if (config.pagarme.key) {
      this.apiKey = config.pagarme.key;
      this.isAvailable = true;

      this.axios = axios.create({
        baseURL: 'https://api.pagar.me/1/',
        auth: {
          username: config.pagarme.key,
          password: 'x',
        },
      });
    }
  }

  async getCardById(cardId) {
    try {
      if (!this.isAvailable) return null;

      const { data: card } = await this.axios.get(`cards/${cardId}`);
      return card;
    } catch ({ response }) {
      logger.error('Pagarme:getCardById:', response);
      return handleException(response);
    }
  }

  async getCards() {
    try {
      if (!this.isAvailable) return null;

      const { data: cards } = await this.axios.get(`cards`);

      return cards;
    } catch ({ response }) {
      logger.error('Pagarme:getAll:', response);
      return handleException(response);
    }
  }

  async encryptCard(card) {
    try {
      if (!this.isAvailable) return null;
      const client = await pagarme.client.connect({
        api_key: config.pagarme.key,
        encryption_key: config.pagarme.criptoKey,
      });

      return client.security.encrypt(card);
    } catch ({ response }) {
      logger.error('Pagarme:encryptCard:', response);
      return handleException(response);
    }
  }

  async saveCard(card_hash) {
    try {
      if (!this.isAvailable) return null;
      const newCard = { card_hash };
      const { data: createdCard } = await this.axios.post(`cards`, newCard);
      return createdCard;
    } catch ({ response }) {
      logger.error('Pagarme:saveCard:', response);
      return handleException(response);
    }
  }

  async createRecipient(newRecipient) {
    try {
      if (!this.isAvailable) return null;

      const { data: created } = await this.axios.post(
        `recipients`,
        newRecipient
      );

      return created;
    } catch ({ response }) {
      logger.error('Pagarme:createRecipient:', response);
      return handleException(response);
    }
  }

  async updateRecipient(recipientId, data) {
    try {
      if (!this.isAvailable) return null;
      const url = `recipients/${recipientId}`;
      const { data: updated } = await this.axios.put(url, data);
      return updated;
    } catch ({ response }) {
      logger.error('Pagarme:updateRecipient:', response);
      return handleException(response);
    }
  }

  async getRecipients({ count = 1000, page = 1, name = '' }) {
    try {
      if (!this.isAvailable) return null;
      const { data: recipients } = await this.axios.get(`recipients`, {
        params: {
          count,
          page,
          name,
        },
      });
      return recipients;
    } catch ({ response }) {
      logger.error('Pagarme:getRecipients:', response);
      return handleException(response);
    }
  }

  async getRecipient(recipientId) {
    try {
      if (!this.isAvailable) return null;
      const { data: recipient } = await this.axios.get(
        `recipients/${recipientId}`
      );
      return recipient;
    } catch ({ response }) {
      logger.error('Pagarme:getRecipient:', response);
      return handleException(response);
    }
  }

  async createTransaction(transaction) {
    try {
      if (!this.isAvailable) return null;
      const { data: created } = await this.axios.post(
        `transactions`,
        transaction
      );
      return created;
    } catch (error) {
      const { response } = error;
      logger.error('Pagarme:createTransaction:', response.data.errors);
      return handleException(response);
    }
  }

  async refundTransaction(transactionId) {
    try {
      if (!this.isAvailable) return null;
      const url = `transactions/${transactionId}/refund`;
      const { data: created } = await this.axios.post(url);
      return created;
    } catch (error) {
      const { response } = error;
      logger.error('Pagarme:refundTransaction:', response.data.errors);
      return handleException(response);
    }
  }

  async getTransaction(transactionId) {
    try {
      if (!this.isAvailable) return null;
      const url = `transactions/${transactionId}`;
      const { data: created } = await this.axios.get(url);
      return created;
    } catch (error) {
      const { response } = error;
      logger.error('Pagarme:refundTransaction:', response.data.errors);
      return handleException(response);
    }
  }

  async getMainRecipient() {
    try {
      if (!this.isAvailable) return null;
      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        data: { default_recipient_id },
      } = await this.axios.get(`company`);

      if (config.env === config.environments.PRODUCTION) {
        return default_recipient_id.live;
      }

      return default_recipient_id.test;
    } catch ({ response }) {
      logger.error('Pagarme:getRecipient:', response);
      return handleException(response);
    }
  }

  async createPlan({ name, amount }) {
    try {
      if (!this.isAvailable) return null;

      const newPlan = {
        name,
        amount: Number(amount) * 100,
        days: 365,
        installments: 12,
        charges: 1,
        payment_methods: ['boleto', 'credit_card'],
      };
      const { data: created } = await this.axios.post(`plans`, newPlan);
      return created;
    } catch (error) {
      if (!error.response) throw error;
      const { response } = error;
      logger.error('Pagarme:createPlan:', response);
      return handleException(response);
    }
  }

  async updatePlan(id, name) {
    try {
      if (!this.isAvailable) return null;
      const { data: plan } = await this.axios.put(`plans/${id}`, { name });
      return plan;
    } catch (error) {
      if (!error.response) throw error;
      const { response } = error;
      logger.error('Pagarme:updatePlan:', response);
      return handleException(response);
    }
  }

  async getPlan(id) {
    try {
      if (!this.isAvailable) return null;
      const { data: plan } = await this.axios.get(`plans/${id}`);
      return plan;
    } catch ({ response }) {
      logger.error('Pagarme:getPlan:', response);
      return handleException(response);
    }
  }
}

module.exports = new Pagarme();
