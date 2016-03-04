import Ember from 'ember';

var FTM = 0.3048;

export default Ember.Component.extend({
  width: Ember.computed('face.width', 'isImperial', {
    get() {
      return this.convertFromMetric(this.get('face.width'));
    },

    set(key, value) {
      this.set('face.width', this.convertToMetric(parseFloat(value)));
      this.get('face').setUnprotectedOpeningArea();
    }
  }),

  height: Ember.computed('face.height', 'isImperial', {
    get() {
      return this.convertFromMetric(this.get('face.height'));
    },

    set(key, value) {
      this.set('face.height', this.convertToMetric(parseFloat(value)));
      this.get('face').setUnprotectedOpeningArea();
    }
  }),

  distance: Ember.computed('face.distance', 'isImperial', {
    get() {
      return this.convertFromMetric(this.get('face.distance'));
    },

    set(key, value) {
      this.set('face.distance', this.convertToMetric(parseFloat(value)));
      this.get('face').setUnprotectedOpeningArea();
    }
  }),

  unprotectedOpeningArea: Ember.computed('face.unprotectedOpeningArea', {
    get() {
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
    },

    set(key, value) {
      this.set('face.unprotectedOpeningArea', parseFloat(value));
      this.get('face').setLimitingDistance();
    }
  }),

  constructionRating: Ember.computed('face.combustibleConstruction', function() {
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
  }),

  claddingRating: Ember.computed('face.combustibleCladding', function() {
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
  }),

  fireResistanceRating: Ember.computed('face.fireResistanceMinutes', function() {
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
  }),

  ratings: Ember.computed(
    'constructionRating',
    'claddingRating',
    'fireResistanceRating',
    function() {
      var construction = this.get('constructionRating');
      var cladding = this.get('claddingRating');
      var fireResistance = this.get('fireResistanceRating');

      var ratings = [];

      if (construction) { ratings.push(construction); }
      if (cladding) { ratings.push(cladding); }
      if (fireResistance) { ratings.push(fireResistance); }

      return ratings;
    }
  ),

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

  area: Ember.computed('face.width', 'face.height', 'isImperial', function() {
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
  }),

  project: Ember.computed.alias('face.project'),

  isImperial: Ember.computed.alias('project.isImperial'),

  units: Ember.computed('project.isImperial', function() {
    if (this.get('project.isImperial')) {
      return 'ft';
    }
    else {
      return 'm';
    }
  }),

  makeNumbersDraggable: Ember.on('didInsertElement', function() {
    this.$('input[step]').draggableNumber();
  }),

  actions: {
    addFace() {
      this.get('project').addFace();
    },

    removeFace() {
      this.get('project').removeFace(this.get('face'));
    }
  }
});
