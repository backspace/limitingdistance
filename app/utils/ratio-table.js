import Table from './table';

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

    if (ratio < 3) { return RatioTable.LOW; }
    else if (ratio >= 3 && ratio <= 10) { return RatioTable.MID; }
    else { return RatioTable.HIGH; }
  };

RatioTable.prototype.getPercent = function(width, height, limitingDistance)
  {
    var percent = this.ratios[(this.determineRatio(width, height))].getPercent(width, height, limitingDistance);

    if (isNaN(percent)) { return 100; }
    else { return percent; }
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

export default RatioTable;
