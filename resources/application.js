Number.prototype.round = function(points)
{
  var p = Math.pow(10, points);
  var n = this*p;
  n = Math.round(n);
  return n/p;
}

function loaded()
{
  $("height").focus();

  $w("height width distance group1 group2 sprinklered unsprinklered").each(function(field) {
    $(field).observe("change", change);
  });

  $("imperial").observe("change", unitChange);
  $("metric").observe("change", unitChange);

  $("area").observe("change", areaChange);

  unitChange();
}

function unitFactor()
{
  return $("imperial").checked ? 1/FTM : FTM;
}

function unitChange()
{
  var factor = unitFactor();
  $w("width height distance").each(function(field) {
    if ($F(field)) $(field).value =($(field).value*factor).round(4);
  });

  var unit = imperial() ? "ft" : "m";

  $$(".units").each(function(e) {
    e.innerHTML = unit;
  });
}

function ready()
{
  return !($F("height").blank() || $F("width").blank() || ($F("distance").blank() && $F("area").blank()))
}

function change()
{
  if (ready())
  {
    $("area").value = tables.get(sprinklers()).get(group()).getPercent(width(), height(), distance()).toFixed(1);
    setRating();
  }
}

function setRating()
{
  var area = $("area").value;
  var rating;
  var g1 = group() == 1;
   notes = $A();

  if (area <= 10)
  {
    rating = g1 ? "1h" : "2h"
    notes.push("Non-combustible construction");
    notes.push("Non-combustible cladding");
  }
  else if (area > 10 && area < 25)
  {
    rating = g1 ? "1h" : "2h";
    notes.push("Combustible construction");
    notes.push("Non-combustible cladding");
  }
  else
  {
    notes.push("Combustible construction");
    notes.push("Combustible cladding");
    rating = g1 ? "45min" : "1h";
  }

  notes.push(rating + " fire-resistance rating");
  $("rating").innerHTML = (notes.join("<br/>"));
}

function areaChange()
{
  if (ready())
  {
    $("distance").value = (tables.get(sprinklers()).get(group()).getLD(width(), height(), $("area").value)*(imperial() ? 1/FTM : 1)).round(4);
    setRating();
  }
}

function imperial()
{
  return $("imperial").checked;
}

var FTM = 0.3048;

function height()
{
  return $F("height")*(imperial() ? FTM : 1);
}

function width()
{
  return $F("width")*(imperial() ? FTM : 1);
}

function sprinklers()
{
  return $("sprinklered").checked;
}

function distance()
{
  return $F("distance")*(imperial() ? FTM : 1);
}

function group()
{
  return $("group1").checked ? $("group1").value : $("group2").value;
}

Event.observe(window, "load", loaded);

var Table = Class.create({
  initialize: function(lds)
  {
    this.areaToPercents = $H();
    this.lds = lds;
  },

  area: function(area, percents)
  {
    if (!percents.collect(function(value, index) { return index == 0 ? true : value >= percents[index - 1]}).uniq().last())
    {
      console.log("Non-increasing data! Area: " + area + ", Percents:");
      console.log(percents);
    }
    this.areaToPercents.set(area, percents);
  },

  getAreas: function(area)
  {
    var areaKeys = this.areaToPercents.keys().collect(function(i) { return parseInt(i); }).sortBy(function(i) { return parseInt(i); });
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
      var lowerKey = areaKeys.reverse(false).find(function(key) { return key < area; });
      var higherKey = areaKeys.find(function(key) { return key > area; });
      return [lowerKey, higherKey];
    }
  },

  getLD: function(width, height, percent)
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
  },

  getPercent: function(width, height, limitingDistance)
  {
    var area = width*height;

    var areaKeys = this.areaToPercents.keys().collect(function(i) { return parseInt(i); }).sortBy(function(i) { return parseInt(i); });
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
      var lowerKey = areaKeys.reverse(false).find(function(key) { return key < area; });
      var higherKey = areaKeys.find(function(key) { return key > area; });

      var lowerPercent = this.interpolatePercent(lowerKey, limitingDistance);
      var higherPercent = this.interpolatePercent(higherKey, limitingDistance);

      return lowerPercent + (higherPercent - lowerPercent)*(area - lowerKey)/(higherKey - lowerKey);
    }

  },

  interpolateLD: function(area, percent)
  {
    // area is a key
    return this.interpolate(percent, this.areaToPercents.get(area), this.lds);
  },

  interpolatePercent: function(area, limitingDistance)
  {
    // area is a key
    return this.interpolate(limitingDistance, this.lds, this.areaToPercents.get(area));
  },

  interpolate: function(key, keys, values)
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
      var lowerKey = keys.reverse(false).find(function(ok) { return ok < key; });
      var upperKey = keys.find(function(ok) { return ok > key; });

      var lowerKeyIndex = keys.indexOf(lowerKey);
      var upperKeyIndex = keys.indexOf(upperKey);

      var lowerValue = lowerKeyIndex < values.length ? values[lowerKeyIndex] : values.last();
      var upperValue = upperKeyIndex < values.length ? values[upperKeyIndex] : values.last();

      return lowerValue + (upperValue - lowerValue)*(key - lowerKey)/(upperKey - lowerKey);
    }

    //area is known to be a key
    // this was added after interpolatePercent, would be better merged with it somehow as it's similar, but oh well

    var percents = this.areaToPercents.get(area);

    if (percents.include(area))
    {
      var index = percents.indexOf(area);
      return this.lds[index];
    }
  },

  interpolatePercentx: function(area, limitingDistance)
  {
    // area is known to be a key
    var percents = this.areaToPercents.get(area);

    if (this.lds.include(limitingDistance))
    {
      var index = this.lds.indexOf(limitingDistance);
      return percents[index < percents.length ? index : percents.length - 1];
    }
    else
    {
      var lowerLD = this.lds.reverse(false).find(function(key) { return key < limitingDistance; });
      var higherLD = this.lds.find(function(key) { return key > limitingDistance; });

      var lowerIndex = this.lds.indexOf(lowerLD);
      var higherIndex = this.lds.indexOf(higherLD);


      var lowerPercent = percents[lowerIndex < percents.length ? lowerIndex : percents.length - 1];
      var higherPercent = percents[higherIndex < percents.length ? higherIndex : percents.length - 1];


      return lowerPercent + (higherPercent - lowerPercent)*(limitingDistance - lowerLD)/(higherLD - lowerLD);
    }
  }
});

var RatioTable = Class.create({
  initialize: function(lds)
  {
    this.lds = lds;
    this.lows = new Table(lds);
    this.mids = new Table(lds);
    this.highs = new Table(lds);

    this.ratios = $H();
    this.ratios.set(RatioTable.LOW, this.lows);
    this.ratios.set(RatioTable.MID, this.mids);
    this.ratios.set(RatioTable.HIGH, this.highs);
  },

  determineRatio: function(width, height)
  {
    var short = Math.min(width, height);
    var long = Math.max(width, height);

    var ratio = long/short;

    if (ratio < 3) return RatioTable.LOW;
    else if (ratio >= 3 && ratio <= 10) return RatioTable.MID;
    else return RatioTable.HIGH;
  },

  getPercent: function(width, height, limitingDistance)
  {
    return this.ratios.get(this.determineRatio(width, height)).getPercent(width, height, limitingDistance);
  },

  getLD: function(width, height, percent)
  {
    return this.ratios.get(this.determineRatio(width, height)).getLD(width, height, percent);
  },

  area: function(area, lows, mids, highs) 
  {
    this.lows.area(area, lows);
    this.mids.area(area, mids);
    this.highs.area(area, highs);
  }
});

RatioTable.LOW = 0; 
RatioTable.MID = 1; 
RatioTable.HIGH = 2;
