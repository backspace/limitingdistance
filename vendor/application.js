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

function loaded()
{
  $(".title").focus();
  faceWatcher = new FaceWatcher();
  calculator = new LimitingDistanceCalculator(tables);

  for (var i = 1; i <= 4; i++) {
    new FormWatcher($(".face-" + i), calculator, faceWatcher);
  }
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

$(window).load(loaded);

var Table = function(lds) {
  this.areaToPercents = {};
  this.lds = lds;
};

Table.prototype.area = function(area, percents)
  {
    if (!percents.map(function(value, index) { return index == 0 ? true : value >= percents[index - 1]}).uniq().last())
    {
      console.log("Non-increasing data! Area: " + area + ", Percents:");
      console.log(percents);
    }
    this.areaToPercents[area] = percents;
  };

Table.prototype.getAreas = function(area)
  {
    var areaKeys = Object.keys(this.areaToPercents).map(function(i) { return parseInt(i); }).sort(function(a,b) { return parseInt(a)-parseInt(b); });
    var minKey = areaKeys.min();
    var maxKey = areaKeys.max();

    if (area < minKey)
    {
      return minKey;
    }
    else if (area > maxKey)
    {
      return maxKey;
    }
    else if (areaKeys.include(area))
    {
      return area;
    }
    else
    {
      var lowerKey = areaKeys.clone().reverse().filter(function(key) { return key < area; })[0];
      var higherKey = areaKeys.filter(function(key) { return key > area; })[0];
      return [lowerKey, higherKey];
    }
  };

Table.prototype.getLD = function(width, height, percent)
  {
    var area = width*height;

    var areas = this.getAreas(area);


    if (areas instanceof Array)
    {
      var lowerArea = areas.first();
      var upperArea = areas.last();

      var lowerLD = this.interpolateLD(lowerArea, percent);
      var higherLD = this.interpolateLD(upperArea, percent);

      return lowerLD + (higherLD - lowerLD)*(area - lowerArea)/(upperArea - lowerArea);
    }
    else
    {
      return this.interpolateLD(areas, percent);
    }
  };

Table.prototype.getPercent = function(width, height, limitingDistance)
  {
    var area = width*height;

    var areaKeys = Object.keys(this.areaToPercents).map(function(i) { return parseInt(i); }).sort(function(a,b) { return parseInt(a)-parseInt(b); });
    var minKey = areaKeys.min();
    var maxKey = areaKeys.max();

    if (area < minKey)
    {
      return this.interpolatePercent(minKey, limitingDistance);
    }
    else if (area > maxKey)
    {
      return this.interpolatePercent(maxKey, limitingDistance);
    }
    else if (areaKeys.include(area))
    {
      return this.interpolatePercent(area, limitingDistance);
    }
    else
    {
      // must interpolate the interpolation
      var lowerKey = areaKeys.clone().reverse().filter(function(key) { return key < area; })[0];
      var higherKey = areaKeys.filter(function(key) { return key > area; })[0];

      var lowerPercent = this.interpolatePercent(lowerKey, limitingDistance);
      var higherPercent = this.interpolatePercent(higherKey, limitingDistance);

      return lowerPercent + (higherPercent - lowerPercent)*(area - lowerKey)/(higherKey - lowerKey);
    }

  };

Table.prototype.interpolateLD = function(area, percent)
  {
    // area is a key
    return this.interpolate(percent, this.areaToPercents[area], this.lds);
  };

Table.prototype.interpolatePercent = function(area, limitingDistance)
  {
    // area is a key
    return this.interpolate(limitingDistance, this.lds, this.areaToPercents[area]);
  };

Table.prototype.interpolate = function(key, keys, values)
  {
    // Could be LD=2.25, lds=0,1.2.., percents=0,16,24...
    // Could be percent=20, percents=0,16,24.., lds=0,1.2,1.5...

    key = parseFloat(key);

    if (keys.include(key))
    {
      var index = keys.indexOf(key);

      return index < values.length ? values[index] : values.last();
    }
    else
    {
      var lowerKey = keys.clone().reverse().filter(function(ok) { return ok < key; })[0];
      var upperKey = keys.filter(function(ok) { return ok > key; })[0];

      var lowerKeyIndex = keys.indexOf(lowerKey);
      var upperKeyIndex = keys.indexOf(upperKey);

      var lowerValue = lowerKeyIndex < values.length ? values[lowerKeyIndex] : values.last();
      var upperValue = upperKeyIndex < values.length ? values[upperKeyIndex] : values.last();

      // If there is no higher key, return the lower value
      if (typeof upperKey === 'undefined') return lowerValue;
      return lowerValue + (upperValue - lowerValue)*(key - lowerKey)/(upperKey - lowerKey);
    }

    //area is known to be a key
    // this was added after interpolatePercent, would be better merged with it somehow as it's similar, but oh well

    var percents = this.areaToPercents[area];

    if (percents.include(area))
    {
      var index = percents.indexOf(area);
      return this.lds[index];
    }
  };

var RatioTable = function(lds) {
    this.lds = lds;
    this.lows = new Table(lds);
    this.mids = new Table(lds);
    this.highs = new Table(lds);

    this.ratios = {};
    this.ratios[RatioTable.LOW] = this.lows;
    this.ratios[RatioTable.MID] = this.mids;
    this.ratios[RatioTable.HIGH] = this.highs;
  };

RatioTable.prototype.determineRatio = function(width, height)
  {
    var short = Math.min(width, height);
    var long = Math.max(width, height);

    var ratio = long/short;

    if (ratio < 3) return RatioTable.LOW;
    else if (ratio >= 3 && ratio <= 10) return RatioTable.MID;
    else return RatioTable.HIGH;
  };

RatioTable.prototype.getPercent = function(width, height, limitingDistance)
  {
    var percent = this.ratios[(this.determineRatio(width, height))].getPercent(width, height, limitingDistance);

    if (isNaN(percent)) return 100;
    else return percent;
  };

RatioTable.prototype.getLD = function(width, height, percent)
  {
    return this.ratios[(this.determineRatio(width, height))].getLD(width, height, percent);
  };

RatioTable.prototype.area = function(area, lows, mids, highs)
  {
    this.lows.area(area, lows);
    this.mids.area(area, mids);
    this.highs.area(area, highs);
  };

RatioTable.LOW = '0';
RatioTable.MID = '1';
RatioTable.HIGH = '2';
