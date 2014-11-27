(function() {
  var FormWatcher,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FormWatcher = (function() {
    function FormWatcher(element, tables) {
      this.element = element;
      this.tables = tables;
      this.imperial = __bind(this.imperial, this);
      this.areaChange = __bind(this.areaChange, this);
      this.setRating = __bind(this.setRating, this);
      this.setCalculatedArea = __bind(this.setCalculatedArea, this);
      this.change = __bind(this.change, this);
      this.$ = __bind(this.$, this);
      this.unitChange = __bind(this.unitChange, this);
      this.$el = $(this.element);
      this.$("#height, #width, #distance, #group1, #group2, #sprinklered, #unsprinklered").change(this.change).keyup(this.change);
      this.$("#imperial, #metric").change(this.unitChange);
      this.$("#area").change(this.areaChange).keyup(this.areaChange);
      this.unitChange();
    }

    FormWatcher.prototype.unitFactor = function() {
      var _ref;
      return (_ref = this.$("#imperial").prop('checked')) != null ? _ref : 1 / {
        FTM: FTM
      };
    };

    FormWatcher.prototype.unitChange = function() {
      var factor, unit;
      factor = this.unitFactor();
      this.$("#width, #height, #distance").each(function(index, field) {
        field = $(field);
        if (field.val()) {
          return field.val((field.val() * factor).round(4));
        }
      });
      unit = this.imperial() ? "ft" : "m";
      return this.$(".units").html(unit);
    };

    FormWatcher.prototype.ready = function() {
      return !(this.$("#height").val().blank() || this.$("#width").val().blank() || (this.$("#distance").val().blank() && $("#area").val().blank()));
    };

    FormWatcher.prototype.$ = function(selector) {
      return this.$el.find(selector);
    };

    FormWatcher.prototype.change = function() {
      var percent, table;
      this.setCalculatedArea();
      if (this.ready()) {
        table = this.tables[this.sprinklers()][this.group()];
        percent = table.getPercent(this.width(), this.height(), this.distance()).toFixed(1);
        this.$("#area").val(percent);
        return this.setRating();
      }
    };

    FormWatcher.prototype.setCalculatedArea = function() {
      var area, h, w;
      if (this.width() && this.height()) {
        w = parseFloat(this.$("#width").val());
        h = parseFloat(this.$("#height").val());
        area = w * h;
        if (area) {
          area = area.round(4);
        }
        return this.$("#calculated-area input").val(area);
      } else {
        return this.$("#calculated-area input").val("");
      }
    };

    FormWatcher.prototype.setRating = function() {
      var area, g1, notes, rating;
      area = this.$("#area").val();
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
      return this.$("#rating").html(notes.join("<br>"));
    };

    FormWatcher.prototype.areaChange = function() {
      var distance, table;
      if (this.ready()) {
        table = this.tables[this.sprinklers()][this.group()];
        distance = table.getLD(this.width(), this.height(), this.$("#area").val());
        this.$("#distance").val(distance.round(4));
        return this.setRating();
      }
    };

    FormWatcher.prototype.imperial = function() {
      return this.$("#imperial").prop("checked");
    };

    FormWatcher.prototype.imperialMultiplier = function() {
      if (this.imperial()) {
        return 1 / FTM;
      } else {
        return 1;
      }
    };

    FormWatcher.prototype.height = function() {
      return this.$("#height").val() * this.imperialMultiplier();
    };

    FormWatcher.prototype.width = function() {
      return this.$("#width").val() * this.imperialMultiplier();
    };

    FormWatcher.prototype.sprinklers = function() {
      return this.$("#sprinklered").prop("checked");
    };

    FormWatcher.prototype.distance = function() {
      return this.$("#distance").val() * this.imperialMultiplier();
    };

    FormWatcher.prototype.group = function() {
      if (this.$("#group1").prop("checked")) {
        return this.$("#group1").val();
      } else {
        return this.$("#group2").val();
      }
    };

    return FormWatcher;

  })();

  window.FormWatcher = FormWatcher;

}).call(this);
