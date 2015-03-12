import Ember from 'ember';

import LimitingDistanceCalculator from '../utils/limiting-distance-calculator';
import tables from '../utils/tables';

export default Ember.Object.extend({
  index: function() {
    return this.get('project.faces').indexOf(this) + 1;
  }.property('project.faces.length'),

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
    this.calculator = new LimitingDistanceCalculator(tables);
  }.on('init'),

  setUnprotectedOpeningArea: function() {
    var height = this.get('height');
    var width = this.get('width');
    var distance = this.get('distance');

    if (this.isValid(height) &&
        this.isValid(width) &&
        this.isValid(distance))
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

    if (this.isValid(height) &&
        this.isValid(width) &&
        this.isValid(unprotectedOpeningArea))
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
  },

  projectAttributesChanged: function() {
    this.setUnprotectedOpeningArea();
  }.observes('project.occupancyGroup', 'project.fireProtection'),

  isValid(number) {
    return Ember.isPresent(number) && !isNaN(number);
  }
});
