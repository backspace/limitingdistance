class FaceWatcher
  update: ->
    faces = $(".face").length

    $(".faces").attr "class", "faces faces-#{faces}"

window.FaceWatcher = FaceWatcher
