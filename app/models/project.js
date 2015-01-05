import Ember from 'ember';

import Face from './face';

export default Ember.Object.extend({
  units: 'metric',
  occupancyGroup: '1',
  fireProtection: 'unsprinklered',

  isImperial: Ember.computed.equal('units', 'imperial'),
  isSprinklered: Ember.computed.equal('fireProtection', 'sprinklered'),

  faces: function() {
    return [Face.create({index: 1, project: this}), Face.create({index: 2, project: this}), Face.create({index: 3, project: this}), Face.create({index: 4, project: this})];
  }.property()
});
