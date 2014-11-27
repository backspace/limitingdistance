class FaceWatcher
  update: ->
    faces = $(".face").length

    $(".faces").attr "class", "faces faces-#{faces}"

  add: (original) =>
    # FIXME cloned values are wrong
    cloned = $(original.element).clone()[0]
    new FormWatcher(cloned, original.tables, @)
    $(cloned).appendTo(".faces")
    @update()

window.FaceWatcher = FaceWatcher
