import attr from 'ember-data/attr';
import ModelBase from 'open-event-frontend/models/base';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computedSegmentedLink } from 'open-event-frontend/utils/computed-helpers';

export default ModelBase.extend({

  /**
   * Attributes
   */

  name               : attr('string'),
  email              : attr('string'),
  photoUrl           : attr('string'),
  thumbnailImageUrl  : attr('string'),
  iconImageUrl       : attr('string'),
  smallImageUrl      : attr('string'),
  shortBiography     : attr('string'),
  longBiography      : attr('string'),
  speakingExperience : attr('string'),
  mobile             : attr('string'),
  location           : attr('string'),
  website            : attr('string'),
  twitter            : attr('string'),
  facebook           : attr('string'),
  github             : attr('string'),
  linkedin           : attr('string'),
  organisation       : attr('string'),
  isFeatured         : attr('boolean', { default: false }),
  position           : attr('string'),
  country            : attr('string'),
  city               : attr('string'),
  gender             : attr('string'),
  heardFrom          : attr('string'),

  segmentedLinkWebsite : computedSegmentedLink.bind(this)('website'),
  segmentedLinkTwitter : computedSegmentedLink.bind(this)('twitter'),

  /**
   * Relationships
   */

  user     : belongsTo('user'),
  event    : belongsTo('event'),
  sessions : hasMany('session')

});
