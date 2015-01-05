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
  }.property('width', 'height')
});
