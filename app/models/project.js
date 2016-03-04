import Ember from 'ember';

import Face from './face';

export default Ember.Object.extend({
  units: 'imperial',
  occupancyGroup: '1',
  fireProtection: 'unsprinklered',

  isImperial: Ember.computed.equal('units', 'imperial'),
  isSprinklered: Ember.computed.equal('fireProtection', 'sprinklered'),

  setInitialFaces: Ember.on('init', function() {
    this.set('faces', [Face.create({project: this}), Face.create({project: this}), Face.create({project: this}), Face.create({project: this})]);
  }),

  addFace() {
    this.get('faces').addObject(Face.create({project: this}));
  },

  removeFace(face) {
    this.get('faces').removeObject(face);
  }
});
