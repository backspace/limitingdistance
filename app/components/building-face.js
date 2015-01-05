import Ember from 'ember';

export default Ember.Component.extend({
  width: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.width', parseFloat(value));
    }

    return this.get('face.width');
  }.property('face.width'),

  height: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.height', parseFloat(value));
    }

    return this.get('face.height');
  }.property('face.height'),

  area: Ember.computed.alias('face.area'),

  indexClass: function() {
    return `face-${this.get('face.index')}`;
  }.property('face.index'),

  labelPlaceholder: function() {
    return `Building Face ${this.get('face.index')}`;
  }.property('face.index'),

  watchForm: function() {
    new window.FormWatcher(this.$(), new window.LimitingDistanceCalculator(window.tables));
  }.on('didInsertElement')
});
