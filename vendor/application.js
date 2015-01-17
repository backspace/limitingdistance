Number.prototype.round = function(points)
{
  var p = Math.pow(10, points);
  var n = this*p;
  n = Math.round(n);
  return n/p;
}

Array.prototype.uniq = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.indexOf(this[i]) != -1) {
            arr.push(this[i]);
        }
    }
    return arr;
}

Array.prototype.first = function(){
    return this[0];
};

Array.prototype.last = function(){
    return this[this.length - 1];
};

String.prototype.blank = function() {
    return (this.length === 0 || !this.trim());
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.clone = function() {
	return this.slice(0);
};

Array.prototype.include = function(obj) {
  var i = this.length;
  while (i--) {
      if (this[i] === obj) {
          return true;
      }
  }
  return false;
}

function test() {
  // sprinklered, group, width, height, limiting_distance

  GA = LimitingDistanceCalculator.GROUP_ABCDF3;
  GE = LimitingDistanceCalculator.GROUP_EF1F2;

  percentExamples = [
    [false, GA, 5, 5, 1.2, 7],     //        Ratio < 3:1
    [false, GA, 3, 10, 3.5, 31],   // 10:1 < Ratio > 3:1
    [false, GA, 2, 30, 5.25, 55],  // 10:1 > Ratio

    // Interpolating between areas
    [false, GA, 7, 7, 4, 24.4],
    [false, GA, 7, 7, 5, 37.7],

    // Interpolating both area and distance
    [false, GA, 7, 7, 4.5, 31.05],

    // Spot checks in the rest of the table
    [false, GA, 25, 10, 8, 25],
    [false, GA, 10, 100, 11, 19],
    [false, GA, 1, 2000, 19, 38],


    [false, GE, 3, 10, 3.5, 16],
    [false, GE, 5, 30, 9, 25],
  ];

  calculator = new LimitingDistanceCalculator(tables);

  var errors = 0;

  for (var i = 0; i < percentExamples.length; i++) {
    e = percentExamples[i];

    percentParameters = {
      sprinklered: e[0],
      group: e[1],
      width: e[2],
      height: e[3],
      limiting_distance: e[4]
    };

    percentGot = calculator.getPercent(percentParameters);

    percentExpected = e[5];

    if (percentGot == percentExpected) {
      console.log(percentGot + " == " + percentExpected);

      distanceParameters = percentParameters;
      distanceParameters.unprotected_opening_area = percentGot;

      distanceGot = calculator.getLimitingDistance(distanceParameters);
      distanceExpected = percentParameters.limiting_distance;
      delete distanceParameters.limiting_distance;

      if (distanceGot == distanceExpected) {
        console.log(" and " + distanceGot + " == " + distanceExpected);
      }
      else
      {
        errors++;
        console.log("  Mismatch testing this distance calculation:", distanceParameters);
        console.log("  Expected " + distanceExpected + ", got " + distanceGot);
      }
    }
    else {
      errors++;
      console.log("Mismatch testing this percent calculation:", percentParameters);
      console.log("Expected " + percentExpected + ", got " + percentGot);
    }
  }

  console.log("Errors: " + errors);
}

var FTM = 0.3048;

