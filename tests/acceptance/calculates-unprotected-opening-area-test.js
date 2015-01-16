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

function expectRating(text) {
  equal(find(`.rating:contains("${text}")`).length, 1, `should have rating ${text}`);
}

test('displays the correct calculation result for the first group', function() {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 5);
  fillIn('.face-1 input[name=distance]', 1.2);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    equal(unprotectedOpeningArea, '7.0', 'should have unprotected opening area of 7.0%');

    expectRating('Non-combustible construction');
    expectRating('Non-combustible cladding');
    expectRating('1h fire-resistance rating');
  });
});

test('displays the correct calculation result for the second group', function() {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F1) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 3);
  fillIn('.face-1 input[name=width]', 10);
  fillIn('.face-1 input[name=distance]', 3.5);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    equal(unprotectedOpeningArea, '16.0', 'should have unprotected opening area of 16.0%');

    expectRating('Combustible construction');
    expectRating('Non-combustible cladding');
    expectRating('2h fire-resistance rating');
  });
});

test('displays the correct imperial calculation result', function() {
  visit('/');

  click('label:contains(Imperial) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 30);
  fillIn('.face-1 input[name=width]', 30);
  fillIn('.face-1 input[name=distance]', 9);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    equal(unprotectedOpeningArea, '10.8', 'should have unprotected opening area of 10.8%');

    expectRating('Combustible construction');
    expectRating('Non-combustible cladding');
    expectRating('1h fire-resistance rating');
  });
});
