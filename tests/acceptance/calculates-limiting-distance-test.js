import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Calculates limiting distance', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('supports entering the unprotected area to calculate the limiting distance', function(assert) {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 5);
  fillIn('.face-1 input[name=area]', 7);

  andThen(function() {
    var limitingDistance = find('.face-1 input[name=distance]').val();
    assert.equal(limitingDistance, '1.2', 'should have limiting distance of 1.2');
  });
});
