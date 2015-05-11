import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Converts units', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('converts metric to imperial', function() {
  visit('/');

  click('label:contains(Metric) input');
  fillIn('.face-1 input[name=height]', 3048);
  click('label:contains(Imperial) input');

  andThen(function() {
    var imperialHeight = find('.face-1 input[name=height]').val();
    equal(imperialHeight, '10000.0', 'should equal 10000 feet');
  });
});

test('converts imperial to metric', function() {
  visit('/');

  click('label:contains(Imperial) input');
  fillIn('.face-1 input[name=height]', 10000);
  click('label:contains(Metric) input');

  andThen(function() {
    var metricHeight = find('.face-1 input[name=height]').val();
    equal(metricHeight, '3048', 'should equal 3048 metres');
  });
});

test('rounds imperial areas', function() {
  visit('/');

  click('label:contains(Imperial) input');
  fillIn('.face-1 input[name=height]', 7);
  fillIn('.face-1 input[name=width]', 10);

  andThen(function() {
    var imperialArea = find('.face-1 .calculated-area input').val();
    equal(imperialArea, '70', 'should equal 70 feet squared');
  });
});

