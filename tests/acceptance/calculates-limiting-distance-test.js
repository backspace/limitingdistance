import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Calculates limiting distance', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('supports entering the unprotected area to calculate the limiting distance', function() {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 5);
  fillIn('.face-1 input[name=area]', 7);

  andThen(function() {
    // FIXME currently required to trigger area calculation
    find('.face-1 input[name=area]').trigger('keyup');
    var limitingDistance = find('.face-1 input[name=distance]').val();
    equal(limitingDistance, '1.2', 'should have limiting distance of 1.2');
  });
});
