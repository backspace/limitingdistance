import Ember from 'ember';

import Face from './face';

export default Ember.Object.extend({
  faces: function() {
    return [Face.create({index: 1}), Face.create({index: 2}), Face.create({index: 3}), Face.create({index: 4})];
  }.property()
});
