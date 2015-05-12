import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Calculates unprotected opening area', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function expectRating(assert, text) {
  assert.equal(find(`.rating:contains("${text}")`).length, 1, `should have rating ${text}`);
}

test('displays the correct calculation result for the first group', function(assert) {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 5);
  fillIn('.face-1 input[name=width]', 5);
  fillIn('.face-1 input[name=distance]', 1.2);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    assert.equal(unprotectedOpeningArea, '7.0', 'should have unprotected opening area of 7.0%');

    expectRating(assert, 'Non-combustible construction');
    expectRating(assert, 'Non-combustible cladding');
    expectRating(assert, '1h fire-resistance rating');
  });
});

test('displays the correct calculation result for the second group', function(assert) {
  visit('/');

  click('label:contains(Metric) input');
  click('label:contains(F1) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 3);
  fillIn('.face-1 input[name=width]', 10);
  fillIn('.face-1 input[name=distance]', 3.5);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    assert.equal(unprotectedOpeningArea, '16.0', 'should have unprotected opening area of 16.0%');

    expectRating(assert, 'Combustible construction');
    expectRating(assert, 'Non-combustible cladding');
    expectRating(assert, '2h fire-resistance rating');
  });

  fillIn('.face-1 input[name=height]', 10);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    assert.equal(unprotectedOpeningArea, '6.5', 'should have updated the opening area to 6.5%');
  });
});

test('displays the correct imperial calculation result', function(assert) {
  visit('/');

  click('label:contains(Imperial) input');
  click('label:contains(F3) input');
  click('label:contains(Unsprinklered) input');

  fillIn('.face-1 input[name=height]', 30);
  fillIn('.face-1 input[name=width]', 30);
  fillIn('.face-1 input[name=distance]', 9);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    assert.equal(unprotectedOpeningArea, '10.8', 'should have unprotected opening area of 10.8%');

    expectRating(assert, 'Combustible construction');
    expectRating(assert, 'Non-combustible cladding');
    expectRating(assert, '1h fire-resistance rating');
  });

  fillIn('.face-1 input[name=height]', 60);

  andThen(function() {
    var unprotectedOpeningArea = find('.face-1 input[name=area]').val();
    assert.equal(unprotectedOpeningArea, '9.3', 'should updated the opening area to 9.3%');
  });
});
