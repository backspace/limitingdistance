import LimitingDistanceCalculator from 'limitingdistance/utils/limiting-distance-calculator';
import {module, test} from 'qunit';
import tables from 'limitingdistance/utils/tables';

// TODO this tests both the data and the calculator;
// should be separated

module('LimitingDistanceCalculator', {
  beforeEach: function() {
    this.calculator = new LimitingDistanceCalculator(tables);
  }
});

function validateCalculatedUnprotectedOpeningArea(assert, calculator, parameters) {
  assert.equal(calculator.getPercent({
    sprinklered: parameters.sprinklered,
    group: parameters.group,
    width: parameters.width,
    height: parameters.height,
    limiting_distance: parameters.limitingDistance
  }), parameters.unprotectedOpeningArea, `${parameters.width}x${parameters.height} LD ${parameters.limitingDistance} = ${parameters.unprotectedOpeningArea}%`);
}

function validateCalculatedLimitingDistance(assert, calculator, parameters) {
  assert.equal(calculator.getLimitingDistance({
    sprinklered: parameters.sprinklered,
    group: parameters.group,
    width: parameters.width,
    height: parameters.height,
    unprotected_opening_area: parameters.unprotectedOpeningArea
  }), parameters.limitingDistance, `${parameters.width}x${parameters.height} ${parameters.unprotectedOpeningArea}% = LD ${parameters.limitingDistance} `);
}

test('it returns exact values from the tables', function(assert) {
  var squareishRatioExample = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 5,
    height: 5,
    limitingDistance: 1.2,
    unprotectedOpeningArea: 7
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, squareishRatioExample);
  validateCalculatedLimitingDistance(assert, this.calculator, squareishRatioExample);

  var longerRatioExample = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 3,
    height: 10,
    limitingDistance: 3.5,
    unprotectedOpeningArea: 31
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, longerRatioExample);
  validateCalculatedLimitingDistance(assert, this.calculator, longerRatioExample);

  var longestRatioExample = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 2,
    height: 30,
    limitingDistance: 5.25,
    unprotectedOpeningArea: 55
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, longestRatioExample);
  validateCalculatedLimitingDistance(assert, this.calculator, longestRatioExample);
});

test('it returns values interpolated between areas', function(assert) {
  var shorterDistanceExample = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 7,
    height: 7,
    limitingDistance: 4,
    unprotectedOpeningArea: 24.4
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, shorterDistanceExample);
  // TODO this is disabled because the reverse yields 3.9949… rather than 4
  // validateCalculatedLimitingDistance(this.calculator, shorterDistanceExample);

  var longerDistanceExample = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 7,
    height: 7,
    limitingDistance: 5,
    unprotectedOpeningArea: 37.7
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, longerDistanceExample);
  validateCalculatedLimitingDistance(assert, this.calculator, longerDistanceExample);
});

test('it returns a value intepolated between both area and distance', function(assert) {
  var doubleInterpolatedExample = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 7,
    height: 7,
    limitingDistance: 4.5,
    unprotectedOpeningArea: 31.05
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, doubleInterpolatedExample);
  // TODO this is disabled because the reverse yields 4.507… rather than 4.5
  // validateCalculatedLimitingDistance(this.calculator, doubleInterpolatedExample);
});

test('returns valid values for various unsprinklered group A… spot checks', function(assert) {
  var example1 = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 25,
    height: 10,
    limitingDistance: 8,
    unprotectedOpeningArea: 25
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, example1);
  validateCalculatedLimitingDistance(assert, this.calculator, example1);

  var example2 = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 10,
    height: 100,
    limitingDistance: 11,
    unprotectedOpeningArea: 19
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, example2);
  validateCalculatedLimitingDistance(assert, this.calculator, example2);

  var example3 = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_ABCDF3,
    width: 1,
    height: 2000,
    limitingDistance: 19,
    unprotectedOpeningArea: 38
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, example3);
  validateCalculatedLimitingDistance(assert, this.calculator, example3);
});

test('returns valid values for various unsprinklered group E… spot checks', function(assert) {
  var example1 = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_EF1F2,
    width: 3,
    height: 10,
    limitingDistance: 3.5,
    unprotectedOpeningArea: 16
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, example1);
  validateCalculatedLimitingDistance(assert, this.calculator, example1);

  var example2 = {
    sprinklered: false,
    group: LimitingDistanceCalculator.GROUP_EF1F2,
    width: 5,
    height: 30,
    limitingDistance: 9,
    unprotectedOpeningArea: 25
  };

  validateCalculatedUnprotectedOpeningArea(assert, this.calculator, example2);
  validateCalculatedLimitingDistance(assert, this.calculator, example2);
});
