import Ember from 'ember';

export default Ember.Controller.extend({
  faceCount: function() {
    return `faces-${this.get('faces.length')}`;
  }.property('faces'),

  faces: function() {
    return [Ember.Object.create({index: 1}), Ember.Object.create({index: 2}), Ember.Object.create({index: 3}), Ember.Object.create({index: 4})];
  }.property()
});
