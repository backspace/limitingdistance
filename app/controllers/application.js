import Ember from 'ember';

import Face from '../models/face';

export default Ember.Controller.extend({
  faceCount: function() {
    return `faces-${this.get('faces.length')}`;
  }.property('faces'),

  faces: function() {
    return [Face.create({index: 1}), Face.create({index: 2}), Face.create({index: 3}), Face.create({index: 4})];
  }.property()
});
