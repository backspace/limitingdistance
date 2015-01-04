(function() {
  var FaceWatcher,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FaceWatcher = (function() {
    function FaceWatcher() {
      this.add = __bind(this.add, this);
    }

    FaceWatcher.prototype.update = function() {
      var faces;
      faces = $(".face").length;
      return $(".faces").attr("class", "faces faces-" + faces);
    };

    FaceWatcher.prototype.add = function(original) {
      var cloned;
      cloned = $(original.element).clone()[0];
      new FormWatcher(cloned, original.calculator, this);
      $(cloned).appendTo(".faces");
      return this.update();
    };

    return FaceWatcher;

  })();

  window.FaceWatcher = FaceWatcher;

}).call(this);
