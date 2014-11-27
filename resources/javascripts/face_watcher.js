(function() {
  var FaceWatcher;

  FaceWatcher = (function() {
    function FaceWatcher() {}

    FaceWatcher.prototype.update = function() {
      var faces;
      faces = $(".face").length;
      return $(".faces").attr("class", "faces faces-" + faces);
    };

    return FaceWatcher;

  })();

  window.FaceWatcher = FaceWatcher;

}).call(this);
