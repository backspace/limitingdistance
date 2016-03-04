import Ember from 'ember';

var FTM = 0.3048;

export default Ember.Component.extend({
  width: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.width', this.convertToMetric(parseFloat(value)));
      this.get('face').setUnprotectedOpeningArea();
    } else {
      return this.convertFromMetric(this.get('face.width'));
    }
  }.property('face.width', 'isImperial'),

  height: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.height', this.convertToMetric(parseFloat(value)));
      this.get('face').setUnprotectedOpeningArea();
    } else {
      return this.convertFromMetric(this.get('face.height'));
    }
  }.property('face.height', 'isImperial'),

  distance: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.distance', this.convertToMetric(parseFloat(value)));
      this.get('face').setUnprotectedOpeningArea();
    } else {
      return this.convertFromMetric(this.get('face.distance'));
    }
  }.property('face.distance', 'isImperial'),

  unprotectedOpeningArea: function(key, value) {
    if (arguments.length > 1) {
      this.set('face.unprotectedOpeningArea', parseFloat(value));
      this.get('face').setLimitingDistance();
    }

    var area = this.get('face.unprotectedOpeningArea');

    if (isNaN(area)) {
      return '';
    }
    else if (Ember.isPresent(area)) {
      if (arguments.length > 1) { return area; }
      else { return area.toFixed(1); }
    }
    else {
      return undefined;
    }
  }.property('face.unprotectedOpeningArea'),

  constructionRating: function() {
    var combustibleConstruction = this.get('face.combustibleConstruction');

    if (typeof combustibleConstruction === 'undefined') {
      return undefined;
    }
    else if (combustibleConstruction) {
      return 'Combustible construction';
    }
    else {
      return 'Non-combustible construction';
    }
  }.property('face.combustibleConstruction'),

  claddingRating: function() {
    var combustibleCladding = this.get('face.combustibleCladding');

    if (typeof combustibleCladding === 'undefined') {
      return undefined;
    }
    else if (combustibleCladding) {
      return 'Combustible cladding';
    }
    else {
      return 'Non-combustible cladding';
    }
  }.property('face.combustibleCladding'),

  fireResistanceRating: function() {
    var minutes = this.get('face.fireResistanceMinutes');

    if (typeof minutes === 'undefined') {
      return undefined;
    }
    else if (minutes < 60) {
      return `${minutes}min fire-resistance rating`;
    }
    else {
      return `${minutes/60}h fire-resistance rating`;
    }
  }.property('face.fireResistanceMinutes'),

  ratings: function() {
    var construction = this.get('constructionRating');
    var cladding = this.get('claddingRating');
    var fireResistance = this.get('fireResistanceRating');

    var ratings = [];

    if (construction) { ratings.push(construction); }
    if (cladding) { ratings.push(cladding); }
    if (fireResistance) { ratings.push(fireResistance); }

    return ratings;
  }.property('constructionRating', 'claddingRating', 'fireResistanceRating'),

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
    if (!value) {
      return undefined;
    }
    else if (this.get('isImperial')) {
      return (value/FTM).toFixed(1);
    }
    else
    {
      return value;
    }
  },

  area: function() {
    var width = this.get('face.width');
    var height = this.get('face.height');

    if (width && height) {
      if (this.get('isImperial')) {
        return (width/FTM).toFixed(1)*(height/FTM).toFixed(1);
      }
      else {
        return width*height;
      }
    }
    else
    {
      return undefined;
    }
  }.property('face.width', 'face.height', 'isImperial'),

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

  makeNumbersDraggable: function() {
    this.$('input[step]').draggableNumber();
  }.on('didInsertElement'),

  actions: {
    addFace() {
      this.get('project').addFace();
    },

    removeFace() {
      this.get('project').removeFace(this.get('face'));
    }
  }
});
