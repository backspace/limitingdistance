import Ember from 'ember';

var FTM = 0.3048;

export default Ember.Component.extend({
  width: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.width', this.convertToMetric(parseFloat(value)));
    }

    return this.convertFromMetric(this.get('face.width'));
  }.property('face.width'),

  height: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.height', this.convertToMetric(parseFloat(value)));
    }

    return this.convertFromMetric(this.get('face.height'));
  }.property('face.height'),

  distance: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.distance', this.convertToMetric(parseFloat(value)));
    }

    return this.convertFromMetric(this.get('face.distance'));
  }.property('face.distance'),

  convertToMetric: function(value) {
    if (this.get('isImperial')) {
      return value*FTM;
    }
    else
    {
      return value;
    }
  },

  convertFromMetric: function(value) {
    if (this.get('isImperial')) {
      return value/FTM;
    }
    else
    {
      return value;
    }
  },

  area: function() {
    var width = this.get('width');
    var height = this.get('height');

    if (width && height) {
      return width*height;
    }
    else
    {
      return undefined;
    }
  }.property('width', 'height'),

  project: Ember.computed.alias('face.project'),

  isImperial: Ember.computed.alias('project.isImperial'),

  units: function() {
    if (this.get('project.isImperial')) {
      return 'ft';
    }
    else {
      return 'm';
    }
  }.property('project.isImperial'),

  indexClass: function() {
    return `face-${this.get('face.index')}`;
  }.property('face.index'),

  labelPlaceholder: function() {
    return `Building Face ${this.get('face.index')}`;
  }.property('face.index'),

  watchForm: function() {
    new window.FormWatcher(this.$(), new window.LimitingDistanceCalculator(window.tables), this.get('face.project'));
  }.on('didInsertElement')
});
