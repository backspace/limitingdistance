import Ember from 'ember';

export default Ember.Object.extend({
  area: function() {
    var width = this.get('width');
    var height = this.get('height');

    if (width && height) {
      return this.get('width') * this.get('height');
    }
    else {
      return undefined;
    }
  }.property('width', 'height'),

  combustibleConstruction: function() {
    var unprotectedOpeningArea = this.get('unprotectedOpeningArea');

    if (typeof unprotectedOpeningArea === 'undefined') {
      return undefined;
    }
    else if (unprotectedOpeningArea <= 10) {
      return false;
    }
    else {
      return true;
    }
  }.property('unprotectedOpeningArea'),

  combustibleCladding: function() {
    var unprotectedOpeningArea = this.get('unprotectedOpeningArea');

    if (typeof unprotectedOpeningArea === 'undefined') {
      return undefined;
    }
    else if (unprotectedOpeningArea < 25) {
      return false;
    }
    else {
      return true;
    }
  }.property('unprotectedOpeningArea'),

  fireResistanceMinutes: function() {
    var unprotectedOpeningArea = this.get('unprotectedOpeningArea');
    var groupABCDF3 = this.get('project.occupancyGroup') === '1';

    if (unprotectedOpeningArea < 25) {
      return groupABCDF3 ? 60 : 120;
    }
    else if (unprotectedOpeningArea < 100) {
      return groupABCDF3 ? 45 : 60;
    }
    else {
      return undefined;
    }
  }.property('unprotectedOpeningArea'),

  setCalculator: function() {
    this.calculator = new window.LimitingDistanceCalculator(window.tables);
  }.on('init'),

  setUnprotectedOpeningArea: function() {
    var height = this.get('height');
    var width = this.get('width');
    var distance = this.get('distance');

    if (Ember.isPresent(height) &&
        Ember.isPresent(width) &&
        Ember.isPresent(distance))
    {
      var project = this.get('project');
      var percent = this.calculator.getPercent({
        sprinklered: project.get('isSprinklered'),
        group: project.get('occupancyGroup'),
        width: width,
        height: height,
        limiting_distance: distance
      });

      this.set('unprotectedOpeningArea', percent);
    }
  },

  setLimitingDistance: function() {
    var height = this.get('height');
    var width = this.get('width');
    var unprotectedOpeningArea = this.get('unprotectedOpeningArea');

    if (Ember.isPresent(height) &&
        Ember.isPresent(width) &&
        Ember.isPresent(unprotectedOpeningArea))
    {
      var project = this.get('project');
      var distance = this.calculator.getLimitingDistance({
        sprinklered: project.get('isSprinklered'),
        group: project.get('occupancyGroup'),
        width: width,
        height: height,
        unprotected_opening_area: unprotectedOpeningArea
      });

      this.set('distance', distance);
    }
  }
});
