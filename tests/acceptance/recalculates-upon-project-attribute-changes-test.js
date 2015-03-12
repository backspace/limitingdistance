import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Recalculates upon project attribute changes', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('changing the occupancy group or sprinklers triggers recalculation', function() {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 5);
  fillIn('.face-1 input[name=distance]', 5);

  andThen(function() {
    var area = find('.face-1 input[name=area]').val();
    equal(area, '66.0', 'should have an unprotected opening area of 66.0%');
  });

  click('label:contains(F1) input');

  andThen(function() {
    var area = find('.face-1 input[name=area]').val();
    equal(area, '33.0', 'should have an unprotected opening area of 33.0%');
  });

  click('label:contains(Sprinklered) input');

  andThen(function() {
    var area = find('.face-1 input[name=area]').val();
    equal(area, '70.0', 'should have an unprotected opening area of 70.0%');
  });
});
