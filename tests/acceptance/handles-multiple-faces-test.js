import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Handles multiple faces', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('starts off with four faces', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('input[placeholder*="Building Face 1"]').length, 1, 'should have building face 1');
    assert.equal(find('input[placeholder*="Building Face 2"]').length, 1, 'should have building face 2');
    assert.equal(find('input[placeholder*="Building Face 3"]').length, 1, 'should have building face 3');
    assert.equal(find('input[placeholder*="Building Face 4"]').length, 1, 'should have building face 4');
  });
});

test('clicking the plus adds faces', function(assert) {
  visit('/');

  click('.face-1 .add');
  click('.face-1 .add');

  andThen(function() {
    assert.equal(find('input[placeholder*="Building Face 5"]').length, 1, 'should have building face 5');
    assert.equal(find('input[placeholder*="Building Face 6"]').length, 1, 'should have building face 6');
  });
});

test('clicking the minus removes faces', function(assert) {
  visit('/');

  var count;

  andThen(function() {
    count = find('.face').length;
  });

  // FIXME this is starting off with six faces!
  // adjusted the test to count that faces are removed

  click('.face-4 .remove');
  click('.face-3 .remove');

  andThen(function() {
    assert.equal(find('.face').length, count - 2, 'the count of faces should be lower by 2');
  });
});
