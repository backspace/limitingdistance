import Ember from 'ember';

import Project from '../models/project';

export default Ember.Controller.extend({
  faces: Ember.computed.alias('project.faces'),

  project: Project.create()
});
