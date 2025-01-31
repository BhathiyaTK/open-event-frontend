import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import moment from 'moment';
import attr from 'ember-data/attr';
import ModelBase from 'open-event-frontend/models/base';
import { hasMany, belongsTo } from 'ember-data/relationships';
import {
  computedDateTimeSplit,
  computedSegmentedLink
} from 'open-event-frontend/utils/computed-helpers';
import CustomPrimaryKeyMixin from 'open-event-frontend/mixins/custom-primary-key';
import { groupBy } from 'lodash-es';

const detectedTimezone = moment.tz.guess();

export default ModelBase.extend(CustomPrimaryKeyMixin, {

  /**
   * Service Injection
   */

  router   : service(),
  fastboot : service(),

  /**
   * Attributes
   */

  identifier             : attr('string', { readOnly: true }),
  name                   : attr('string'),
  description            : attr('string'),
  startsAt               : attr('moment', { defaultValue: () => moment.tz(detectedTimezone).add(1, 'months').startOf('day') }),
  endsAt                 : attr('moment', { defaultValue: () => moment.tz(detectedTimezone).add(1, 'months').hour(17).minute(0) }),
  timezone               : attr('string', { defaultValue: detectedTimezone }),
  locationName           : attr('string'),
  searchableLocationName : attr('string'),

  longitude : attr('number', { defaultValue: 0.0 }),
  latitude  : attr('number', { defaultValue: 0.0 }),

  logoUrl           : attr('string'),
  thumbnailImageUrl : attr('string', { readOnly: true }),
  largeImageUrl     : attr('string', { readOnly: true }),
  originalImageUrl  : attr('string'),
  iconImageUrl      : attr('string', { readOnly: true }),

  isMapShown                : attr('boolean', { defaultValue: true }),
  isSponsorsEnabled         : attr('boolean', { defaultValue: false }),
  isTicketingEnabled        : attr('boolean', { defaultValue: true }),
  isSessionsSpeakersEnabled : attr('boolean', { defaultValue: false }),
  isFeatured                : attr('boolean', { defaultValue: false }),

  isTaxEnabled    : attr('boolean', { defaultValue: false }),
  canPayByPaypal  : attr('boolean', { defaultValue: false }),
  canPayByStripe  : attr('boolean', { defaultValue: false }),
  isStripeLinked  : attr('boolean'),
  canPayByCheque  : attr('boolean', { defaultValue: false }),
  canPayByBank    : attr('boolean', { defaultValue: false }),
  canPayByOmise   : attr('boolean', { defaultValue: false }),
  canPayByAliPay  : attr('boolean', { defaultValue: false }),
  canPayOnsite    : attr('boolean', { defaultValue: false }),
  paymentCountry  : attr('string'),
  paymentCurrency : attr('string', { defaultValue: 'USD' }),
  paypalEmail     : attr('string'),
  chequeDetails   : attr('string'),
  bankDetails     : attr('string'),
  onsiteDetails   : attr('string'),
  orderExpiryTime : attr('number', { defaultValue: 10 }),

  schedulePublishedOn: attr('moment', { defaultValue: () => moment(0) }),

  hasOrganizerInfo: attr('boolean',  { defaultValue: false }),

  organizerName        : attr('string'),
  organizerDescription : attr('string'),

  externalEventUrl : attr('string'),
  ticketUrl        : attr('string'),
  codeOfConduct    : attr('string'),

  state   : attr('string', { defaultValue: 'draft' }),
  privacy : attr('string', { defaultValue: 'public' }),

  pentabarfUrl : attr('string', { readOnly: true }),
  xcalUrl      : attr('string', { readOnly: true }),
  icalUrl      : attr('string', { readOnly: true }),

  createdAt : attr('moment', { readOnly: true }),
  deletedAt : attr('moment'),

  /**
   * Relationships
   */
  type                   : belongsTo('event-type'),
  topic                  : belongsTo('event-topic'),
  subTopic               : belongsTo('event-sub-topic'),
  location               : belongsTo('event-location'),
  sessions               : hasMany('session'),
  sponsors               : hasMany('sponsor'),
  microlocations         : hasMany('microlocation'),
  tracks                 : hasMany('track'),
  tickets                : hasMany('ticket'),
  orders                 : hasMany('order'),
  socialLinks            : hasMany('social-link'),
  emailNotifications     : hasMany('email-notification'),
  speakers               : hasMany('speaker'),
  invoice                : hasMany('event-invoice'),
  speakersCall           : belongsTo('speakers-call'),
  stripeAuthorization    : belongsTo('stripe-authorization'),
  eventStatisticsGeneral : belongsTo('event-statistics-general'),
  tax                    : belongsTo('tax'),
  copyright              : belongsTo('event-copyright'),
  sessionTypes           : hasMany('session-type'),
  user                   : belongsTo('user', { inverse: 'events' }),

  customForms     : hasMany('custom-form'),
  attendees       : hasMany('attendee'),
  orderStatistics : belongsTo('order-statistics-event'),
  roleInvites     : hasMany('role-invite'),

  organizers      : hasMany('user', { inverse: null }),
  coorganizers    : hasMany('user', { inverse: null }),
  trackOrganizers : hasMany('user', { inverse: null }),
  registrars      : hasMany('user', { inverse: null }),
  moderators      : hasMany('user', { inverse: null }),

  /**
   * The discount code applied to this event [Form(1) discount code]
   *
   * @see app/models/discount-code.js
   */
  discountCode: belongsTo('discount-code'),

  /**
   * The discount codes created for this event's tickets [Form(2) discount code]
   *
   * @see app/models/discount-code.js
   */
  discountCodes: hasMany('discount-code'),

  accessCodes: hasMany('access-code'),

  /**
   * Computed properties
   */

  startsAtDate : computedDateTimeSplit.bind(this)('startsAt', 'date'),
  startsAtTime : computedDateTimeSplit.bind(this)('startsAt', 'time'),
  endsAtDate   : computedDateTimeSplit.bind(this)('endsAt', 'date'),
  endsAtTime   : computedDateTimeSplit.bind(this)('endsAt', 'time'),

  segmentedExternalEventUrl : computedSegmentedLink.bind(this)('externalEventUrl'),
  segmentedTicketUrl        : computedSegmentedLink.bind(this)('ticketUrl'),

  shortLocationName: computed('locationName', function() {
    if (!this.locationName) {
      return '';
    }
    let splitLocations = this.locationName.split(',');
    if (splitLocations.length <= 3) {
      return this.locationName;
    } else {
      return splitLocations.splice(1, splitLocations.length).join();
    }
  }),

  url: computed('identifier', function() {
    const origin = this.get('fastboot.isFastBoot') ? `${this.get('fastboot.request.protocol')}//${this.get('fastboot.request.host')}` : location.origin;
    return origin + this.router.urlFor('public', this.id);
  }),

  sessionsByState: computed('sessions', function() {
    return groupBy(this.sessions.toArray(), 'data.state');
  }),

  _ready: on('ready', function() {

  })
});
