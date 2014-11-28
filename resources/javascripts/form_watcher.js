(function() {
  var FormWatcher,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FormWatcher = (function() {
    function FormWatcher(element, calculator, faceWatcher) {
      this.element = element;
      this.calculator = calculator;
      this.faceWatcher = faceWatcher;
      this.imperial = __bind(this.imperial, this);
      this.areaChange = __bind(this.areaChange, this);
      this.setRating = __bind(this.setRating, this);
      this.setCalculatedArea = __bind(this.setCalculatedArea, this);
      this.nonTabChange = __bind(this.nonTabChange, this);
      this.change = __bind(this.change, this);
      this.$ = __bind(this.$, this);
      this.unitChange = __bind(this.unitChange, this);
      this.add = __bind(this.add, this);
      this.remove = __bind(this.remove, this);
      this.$el = $(this.element);
      this.$(".height, .width, .distance").keyup(this.change, this.nonTabChange);
      $(".group1, .group2, .sprinklered, .unsprinklered").change(this.change);
      $(".imperial, .metric").change(this.unitChange);
      this.$(".area").keyup(this.areaChange, this.nonTabChange);
      this.$(".remove").click(this.remove);
      this.$(".add").click(this.add);
      this.unitChange(false);
    }

    FormWatcher.prototype.remove = function() {
      this.$el.remove();
      return this.faceWatcher.update();
    };

    FormWatcher.prototype.add = function() {
      return this.faceWatcher.add(this);
    };

    FormWatcher.prototype.unitFactor = function() {
      if ($(".imperial").prop('checked')) {
        return 1 / FTM;
      } else {
        return FTM;
      }
    };

    FormWatcher.prototype.unitChange = function(convert) {
      var factor, unit;
      factor = this.unitFactor();
      if (convert) {
        this.$(".width, .height, .distance").each(function(index, field) {
          field = $(field);
          if (field.val()) {
            return field.val((field.val() * factor).round(4));
          }
        });
      }
      unit = this.imperial() ? "ft" : "m";
      return this.$(".units").html(unit);
    };

    FormWatcher.prototype.ready = function() {
      return !(this.$(".height").val().blank() || this.$(".width").val().blank() || (this.$(".distance").val().blank() && $(".area").val().blank()));
    };

    FormWatcher.prototype.$ = function(selector) {
      return this.$el.find(selector);
    };

    FormWatcher.prototype.change = function() {
      var percent;
      this.setCalculatedArea();
      if (this.ready()) {
        percent = this.calculator.getPercent({
          sprinklered: this.sprinklers(),
          group: this.group(),
          width: this.width(),
          height: this.height(),
          limiting_distance: this.distance()
        });
        this.$(".area").val(percent.toFixed(1));
        return this.setRating();
      }
    };

    FormWatcher.prototype.nonTabChange = function(event) {
      var _ref;
      if ((_ref = event.which) !== 9 && _ref !== 16) {
        return event.data();
      }
    };

    FormWatcher.prototype.setCalculatedArea = function() {
      var area, h, w;
      if (this.width() && this.height()) {
        w = parseFloat(this.$(".width").val());
        h = parseFloat(this.$(".height").val());
        area = w * h;
        if (area) {
          area = area.round(4);
        }
        return this.$(".calculated-area input").val(area);
      } else {
        return this.$(".calculated-area input").val("");
      }
    };

    FormWatcher.prototype.setRating = function() {
      var area, g1, notes, rating;
      area = this.area();
      g1 = this.group() === '1';
      notes = [];
      if (area <= 10) {
        rating = g1 ? "1h" : "2h";
        notes.push("Non-combustible construction");
        notes.push("Non-combustible cladding");
      } else if (area > 10 && area < 25) {
        rating = g1 ? "1h" : "2h";
        notes.push("Combustible construction");
        notes.push("Non-combustible cladding");
      } else {
        rating = g1 ? "45min" : "1h";
        notes.push("Combustible construction");
        notes.push("Combustible cladding");
      }
      if (area < 100) {
        notes.push("" + rating + " fire-resistance rating");
      }
      return this.$(".rating").html(notes.join("<br>"));
    };

    FormWatcher.prototype.areaChange = function() {
      var distance;
      if (this.ready()) {
        $(".distance").val("");
        distance = this.calculator.getLimitingDistance({
          sprinklered: this.sprinklers(),
          group: this.group(),
          width: this.width(),
          height: this.height(),
          unprotected_opening_area: this.area()
        });
        this.$(".distance").val(distance.round(4));
        return this.setRating();
      }
    };

    FormWatcher.prototype.imperial = function() {
      return $(".imperial").prop("checked");
    };

    FormWatcher.prototype.imperialMultiplier = function() {
      if (this.imperial()) {
        return 1 / FTM;
      } else {
        return 1;
      }
    };

    FormWatcher.prototype.height = function() {
      return this.$(".height").val() * this.imperialMultiplier();
    };

    FormWatcher.prototype.width = function() {
      return this.$(".width").val() * this.imperialMultiplier();
    };

    FormWatcher.prototype.sprinklers = function() {
      return $(".sprinklered").prop("checked");
    };

    FormWatcher.prototype.distance = function() {
      return this.$(".distance").val() * this.imperialMultiplier();
    };

    FormWatcher.prototype.area = function() {
      return this.$(".area").val();
    };

    FormWatcher.prototype.group = function() {
      if ($(".group1").prop("checked")) {
        return $(".group1").val();
      } else {
        return $(".group2").val();
      }
    };

    return FormWatcher;

  })();

  window.FormWatcher = FormWatcher;

}).call(this);
