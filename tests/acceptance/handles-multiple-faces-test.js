import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Handles multiple faces', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('starts off with four faces', function() {
  visit('/');

  andThen(function() {
    equal(find('input[placeholder*="Building Face 1"]').length, 1, 'should have building face 1');
    equal(find('input[placeholder*="Building Face 2"]').length, 1, 'should have building face 2');
    equal(find('input[placeholder*="Building Face 3"]').length, 1, 'should have building face 3');
    equal(find('input[placeholder*="Building Face 4"]').length, 1, 'should have building face 4');
  });
});

test('clicking the plus adds faces', function() {
  visit('/');

  click('.face-1 .add');
  click('.face-1 .add');

  andThen(function() {
    equal(find('input[placeholder*="Building Face 5"]').length, 1, 'should have building face 5');
    equal(find('input[placeholder*="Building Face 6"]').length, 1, 'should have building face 6');
  });
});
