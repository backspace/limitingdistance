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
  }.property('unprotectedOpeningArea')

});
