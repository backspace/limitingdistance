class FormWatcher
  constructor: (@element, @tables) ->
    @$el = $(@element)

    @$("#height, #width, #distance, #group1, #group2, #sprinklered, #unsprinklered").change(@change).keyup(@change)

    @$("#imperial, #metric").change(@unitChange)

    @$("#area").change(@areaChange).keyup(@areaChange)

    @unitChange()

  unitFactor: ->
    @$("#imperial").prop('checked') ? 1/FTM : FTM

  unitChange: =>
    factor = @unitFactor()

    @$("#width, #height, #distance").each (index, field) ->
      field = $(field)
      field.val((field.val()*factor).round(4)) if field.val()

    unit = if @imperial() then "ft" else "m"
    @$(".units").html unit

  ready: ->
    !(@$("#height").val().blank() || @$("#width").val().blank() || (@$("#distance").val().blank() && $("#area").val().blank()))

  $: (selector) =>
    @$el.find(selector)

  change: =>
    @setCalculatedArea()

    if @ready()
      table = @tables[@sprinklers()][@group()]
      percent = table.getPercent(@width(), @height(), @distance()).toFixed(1)
      @$("#area").val percent
      @setRating()

  setCalculatedArea: =>
    if @width() && @height()
      w = parseFloat(@$("#width").val())
      h = parseFloat(@$("#height").val())

      area = w*h
      area = area.round(4) if area
      @$("#calculated-area input").val area
    else
      @$("#calculated-area input").val ""

  setRating: =>
    area = @$("#area").val()

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
    @$("#rating").html notes.join("<br>")

  areaChange: =>
    if @ready()
      table = @tables[@sprinklers()][@group()]
      distance = table.getLD(@width(), @height(), @$("#area").val())
      @$("#distance").val(distance.round(4))
      @setRating()

  imperial: =>
    @$("#imperial").prop "checked"

  imperialMultiplier: ->
    if @imperial() then 1/FTM else 1

  height: ->
    @$("#height").val()*@imperialMultiplier()

  width: ->
    @$("#width").val()*@imperialMultiplier()

  sprinklers: ->
    @$("#sprinklered").prop "checked"

  distance: ->
    @$("#distance").val()*@imperialMultiplier()

  group: ->
    if @$("#group1").prop "checked" then @$("#group1").val() else @$("#group2").val()

window.FormWatcher = FormWatcher