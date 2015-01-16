(function() {
  var FormWatcher,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  FormWatcher = (function() {
    function FormWatcher(element, calculator, face, project) {
      this.element = element;
      this.face = face;
      this.project = project;
      this.$ = __bind(this.$, this);
      this.add = __bind(this.add, this);
      this.remove = __bind(this.remove, this);
      this.$el = $(this.element);
      this.$(".remove").click(this.remove);
      this.$(".add").click(this.add);
    }

    FormWatcher.prototype.remove = function() {
      this.$el.remove();
      return this.faceWatcher.update();
    };

    FormWatcher.prototype.add = function() {
      return this.faceWatcher.add(this);
    };

    FormWatcher.prototype.unitFactor = function() {
      if (this.project.get('isImperial')) {
        return 1 / FTM;
      } else {
        return FTM;
      }
    };

    FormWatcher.prototype.$ = function(selector) {
      return this.$el.find(selector);
    };

    FormWatcher.prototype.imperial = function() {
      return this.project.get('isImperial');
    };

    FormWatcher.prototype.imperialMultiplier = function() {
      if (this.imperial()) {
        return 1 / FTM;
      } else {
        return 1;
      }
    };

    FormWatcher.prototype.height = function() {
      return this.face.get('height');
    };

    FormWatcher.prototype.width = function() {
      return this.face.get('width');
    };

    FormWatcher.prototype.sprinklers = function() {
      return this.project.get('isSprinklered');
    };

    FormWatcher.prototype.distance = function() {
      return this.face.get('distance');
    };

    FormWatcher.prototype.area = function() {
      return this.$(".area").val();
    };

    FormWatcher.prototype.group = function() {
      return this.project.get('occupancyGroup');
    };

    return FormWatcher;

  })();

  window.FormWatcher = FormWatcher;

}).call(this);
