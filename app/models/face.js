import Ember from 'ember';

import LimitingDistanceCalculator from '../utils/limiting-distance-calculator';
import tables from '../utils/tables';

export default Ember.Object.extend({
  index: Ember.computed('project.faces.length', function() {
    return this.get('project.faces').indexOf(this) + 1;
  }),

  area: Ember.computed('width', 'height', function() {
    var width = this.get('width');
    var height = this.get('height');

    if (width && height) {
      return width*height;
    }
    else {
      return undefined;
    }
  }),

  combustibleConstruction: Ember.computed('unprotectedOpeningArea', function() {
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
  }),

  combustibleCladding: Ember.computed('unprotectedOpeningArea', function() {
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
  }),

  fireResistanceMinutes: Ember.computed('unprotectedOpeningArea', function() {
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
  }),

  setCalculator: Ember.on('init', function() {
    this.calculator = new LimitingDistanceCalculator(tables);
  }),

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

  projectAttributesChanged: Ember.observer('project.occupancyGroup', 'project.fireProtection', function() {
    this.setUnprotectedOpeningArea();
  }),

  isValid(number) {
    return Ember.isPresent(number) && !isNaN(number);
  }
});
