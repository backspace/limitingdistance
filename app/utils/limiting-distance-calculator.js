export default function() {
  LimitingDistanceCalculator.GROUP_ABCDF3 = "1";

  LimitingDistanceCalculator.GROUP_EF1F2 = "2";

  function LimitingDistanceCalculator(tables) {
    this.tables = tables;
  }

  LimitingDistanceCalculator.prototype.getPercent = function(options) {
    var group, height, limiting_distance, sprinklered, width;
    sprinklered = options.sprinklered;
    group = options.group;
    width = options.width;
    height = options.height;
    limiting_distance = options.limiting_distance;
    return this.tables[sprinklered][group].getPercent(width, height, limiting_distance);
  };

  LimitingDistanceCalculator.prototype.getLimitingDistance = function(options) {
    var group, height, sprinklered, unprotected_opening_area, width;
    sprinklered = options.sprinklered;
    group = options.group;
    width = options.width;
    height = options.height;
    unprotected_opening_area = options.unprotected_opening_area;
    return this.tables[sprinklered][group].getLD(width, height, unprotected_opening_area);
  };

  return LimitingDistanceCalculator;
}()
