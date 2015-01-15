import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Calculates building face area', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('calculates metric area', function() {
  visit('/');

  click('label:contains(Metric) input');
  fillIn('.face-1 input[name=height]', 10);
  fillIn('.face-1 input[name=width]', 9);

  andThen(function() {
    var calculatedArea = find('.face-1 .calculated-area input').val();
    equal(calculatedArea, '90', 'should equal 90m²');
  });
});

test('calculates imperial area', function() {
  visit('/');

  click('label:contains(Imperial) input');
  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 9);

  andThen(function() {
    var calculatedArea = find('.face-1 .calculated-area input').val();
    equal(calculatedArea, '45', 'should equal 45ft²');
  });
});