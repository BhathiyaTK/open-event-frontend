import Controller from '@ember/controller';
import { computed } from '@ember/object';
import ENV from 'open-event-frontend/config/environment';

export default Controller.extend({

  isLoading: false,

  paymentDescription: 'Please fill your card details to proceed',

  isStripe: computed('model.order.paymentMode', function() {
    return this.get('model.order.paymentMode') === 'stripe';
  }),

  isPaypal: computed('model.order.paymentMode', function() {
    return this.get('model.order.paymentMode') === 'paypal';
  }),

  isOmise: computed('model.order.paymentMode', function() {
    return this.get('model.order.paymentMode') === 'omise';
  }),

  isAliPay: computed('model.order', function() {
    return this.get('model.order.paymentMode') === 'alipay';
  }),

  paymentAmount: computed('model.order', function() {
    return this.get('model.order.amount') * 100;
  }),

  publicKeyOmise: computed('settings.omiseLivePublic', 'settings.omiseLivePublic', function() {
    return this.get('settings.omiseLivePublic') || this.get('settings.omiseTestPublic');
  }),

  omiseFormAction: computed('model.order.identifier', function() {
    let identifier = this.get('model.order.identifier');
    return `${ENV.APP.apiHost}/v1/orders/${identifier}/omise-checkout`;
  }),

  actions: {
    aliPayCheckout(order_identifier) {
      this.loader.post(`/create_source/${order_identifier}`)
        .then(charge => {
          if (charge.status) {
            this.notify.success('Payment has succeeded');
            this.transitionToRoute('orders.view', order_identifier);
          } else {
            this.notify.error('Payment has failed');
          }
        });

    },
    processStripeToken(token) {
      // Send this token to server to process payment
      this.set('isLoading', true);
      let order = this.get('model.order');
      let chargePayload = {
        'data': {
          'attributes': {
            'stripe'            : token.id,
            'paypal_payer_id'   : null,
            'paypal_payment_id' : null
          },
          'type': 'charge'
        }
      };
      let config = {
        skipDataTransform: true
      };
      chargePayload = JSON.stringify(chargePayload);
      return this.loader.post(`orders/${order.identifier}/charge`, chargePayload, config)
        .then(charge => {
          if (charge.data.attributes.status) {
            this.notify.success(charge.data.attributes.message);
            this.transitionToRoute('orders.view', order.identifier);
          } else {
            this.notify.error(charge.data.attributes.message);
          }
        })
        .catch(e => {
          console.warn(e);
          this.notify.error(this.l10n.t('An unexpected error has occurred'));
        })
        .finally(() => {
          this.set('isLoading', false);
        });
    },
    checkoutClosed() {
      // The callback invoked when stripe Checkout is closed.
    },

    checkoutOpened() {
      // The callback invoked when stripe Checkout is opened.
    }
  }
});
