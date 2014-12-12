$ = jQuery

$.fn.extend
  draggableNumber: (options) ->
    getY = (event) ->
      if event.touches
        event.touches[0].pageY
      else
        event.pageY

    @each () ->
      startValue = undefined
      startY = undefined
      started = false

      numberField = $(this)
      labelField = $(this).siblings "label, .units"

      labelField.addClass 'draggable'

      divisor = 10.0
      fraction = 1/parseFloat(numberField.attr('step'))
      max = parseFloat(numberField.attr('max')) || Number.MAX_VALUE
      min = parseFloat(numberField.attr('min'))

      labelField.bind 'mousedown', (event) =>
        $(document.body).addClass 'draglessness'
        started = true
        startY = getY(event.originalEvent)
        value = numberField.val()
        startValue = if value == NaN || value == "" then 0 else parseFloat(value)


      $('body').bind 'mousemove', (event) =>
        if started
          y = getY(event.originalEvent)
          dy = y - startY
          rounded = Math.round(dy/divisor)/fraction
          numberField.val Math.min(Math.max(min, startValue - rounded), max)
          numberField.trigger 'keyup'

      $('body').bind 'mouseup', (event) =>
        $(document.body).removeClass 'draglessness'
        started = false
        event.preventDefault()
