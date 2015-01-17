Number.prototype.round = function(points)
{
  var p = Math.pow(10, points);
  var n = this*p;
  n = Math.round(n);
  return n/p;
}

Array.prototype.uniq = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.indexOf(this[i]) != -1) {
            arr.push(this[i]);
        }
    }
    return arr;
}

Array.prototype.first = function(){
    return this[0];
};

Array.prototype.last = function(){
    return this[this.length - 1];
};

String.prototype.blank = function() {
    return (this.length === 0 || !this.trim());
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.clone = function() {
	return this.slice(0);
};

Array.prototype.include = function(obj) {
  var i = this.length;
  while (i--) {
      if (this[i] === obj) {
          return true;
      }
  }
  return false;
}
