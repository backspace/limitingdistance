import Ember from 'ember';

import Project from '../models/project';

export default Ember.Controller.extend({
  faceCount: function() {
    return `faces-${this.get('faces.length')}`;
  }.property('faces.length'),

  faces: Ember.computed.alias('project.faces'),

  project: Project.create()
});
