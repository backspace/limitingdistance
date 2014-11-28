class LimitingDistanceCalculator
  constructor: (@tables) ->

  getPercent: (options) ->
    sprinklered = options.sprinklered
    group = options.group

    width = options.width
    height = options.height
    limiting_distance = options.limiting_distance

    @tables[sprinklered][group].getPercent(width, height, limiting_distance)

  getLimitingDistance: (options) ->
    sprinklered = options.sprinklered
    group = options.group

    width = options.width
    height = options.height
    unprotected_opening_area = options.unprotected_opening_area

    @tables[sprinklered][group].getLD(width, height, unprotected_opening_area)

window.LimitingDistanceCalculator = LimitingDistanceCalculator
