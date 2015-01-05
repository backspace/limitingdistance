import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Calculates unprotected opening area', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('displays the correct calculation result for the first group', function() {
  visit('/');

  // FIXME currently required to activate observers
  andThen(function() {
    window.loaded();
  });

  click('label:contains(Metric) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 5);
  fillIn('.face-1 input[name=distance]', 1.2);

  andThen(function() {
    // FIXME currently required to trigger area calculation
    find('.face-1 input[name=width]').trigger('keyup');
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    ok(unprotectedOpeningArea === '7.0');
  });
});

test('displays the correct calculation result for the second group', function() {
  visit('/');

  // FIXME currently required to activate observers
  andThen(function() {
    window.loaded();
  });

  click('label:contains(Metric) input');
  click('label:contains(F1) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 3);
  fillIn('.face-1 input[name=width]', 10);
  fillIn('.face-1 input[name=distance]', 3.5);

  andThen(function() {
    // FIXME currently required to trigger area calculation
    find('.face-1 input[name=width]').trigger('keyup');
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    ok(unprotectedOpeningArea === '16.0');
  });
});

test('displays the correct imperial calculation result', function() {
  visit('/');

  // FIXME currently required to activate observers
  andThen(function() {
    window.loaded();
  });

  click('label:contains(Imperial) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 30);
  fillIn('.face-1 input[name=width]', 30);
  fillIn('.face-1 input[name=distance]', 9);

  andThen(function() {
    // FIXME currently required to trigger area calculation
    find('.face-1 input[name=width]').trigger('keyup');
    // return pauseTest();
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    ok(unprotectedOpeningArea === '43.0');
  });
});
