class FormWatcher
  constructor: (@element, @calculator, @faceWatcher) ->
    @$el = $(@element)

    @$(".height, .width, .distance").keyup(@change, @nonTabChange)
    # TODO now that common fields are extracted this is questionable
    $(".group1, .group2, .sprinklered, .unsprinklered").change(@change)

    $(".imperial, .metric").change(@unitChange)

    @$el.find('input[step]').draggableNumber()

    @$(".area").keyup(@areaChange, @nonTabChange)

    @$(".remove").click @remove
    @$(".add").click @add

    @unitChange(false)

  remove: =>
    @$el.remove()
    @faceWatcher.update()

  add: =>
    @faceWatcher.add(@)

  unitFactor: ->
    if $(".imperial").prop('checked') then 1/FTM else FTM

  unitChange: (convert) =>
    factor = @unitFactor()

    if convert
      @$(".width, .height, .distance").each (index, field) ->
        field = $(field)
        field.val((field.val()*factor).round(4)) if field.val()

    unit = if @imperial() then "ft" else "m"
    @$(".units").html unit

  ready: ->
    !(@$(".height").val().blank() || @$(".width").val().blank() || (@$(".distance").val().blank() && $(".area").val().blank()))

  $: (selector) =>
    @$el.find(selector)

  change: =>
    @setCalculatedArea()

    if @ready()
      percent = @calculator.getPercent
        sprinklered: @sprinklers()
        group: @group()
        width: @width()
        height: @height()
        limiting_distance: @distance()

      @$(".area").val percent.toFixed(1)
      @setRating()

  nonTabChange: (event) =>
    event.data() unless event.which in [9, 16]

  setCalculatedArea: =>
    if @width() && @height()
      w = parseFloat(@$(".width").val())
      h = parseFloat(@$(".height").val())

      area = w*h
      area = area.round(4) if area
      @$(".calculated-area input").val area
    else
      @$(".calculated-area input").val ""

  setRating: =>
    area = @area()

    g1 = @group() == '1'
    notes = []

    if area <= 10
      rating = if g1 then "1h" else "2h"
      notes.push "Non-combustible construction"
      notes.push "Non-combustible cladding"
    else if area > 10 && area < 25
      rating = if g1 then "1h" else "2h"
      notes.push "Combustible construction"
      notes.push "Non-combustible cladding"
    else
      rating = if g1 then "45min" else "1h"
      notes.push "Combustible construction"
      notes.push "Combustible cladding"

    notes.push "#{rating} fire-resistance rating" if area < 100
    @$(".rating").html notes.join("<br>")

  areaChange: =>
    if @ready()
      $(".distance").val ""

      distance = @calculator.getLimitingDistance
        sprinklered: @sprinklers()
        group: @group()
        width: @width()
        height: @height()
        unprotected_opening_area: @area()

      @$(".distance").val(distance.round(4))
      @setRating()

  imperial: =>
    $(".imperial").prop "checked"

  imperialMultiplier: ->
    if @imperial() then 1/FTM else 1

  height: ->
    @$(".height").val()*@imperialMultiplier()

  width: ->
    @$(".width").val()*@imperialMultiplier()

  sprinklers: ->
    $(".sprinklered").prop "checked"

  distance: ->
    @$(".distance").val()*@imperialMultiplier()

  area: ->
    @$(".area").val()

  group: ->
    if $(".group1").prop "checked" then $(".group1").val() else $(".group2").val()

window.FormWatcher = FormWatcher
