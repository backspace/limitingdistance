import Ember from 'ember';

export default Ember.Component.extend({
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
