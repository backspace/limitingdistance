import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('model:face', 'Face', {
});

test('it determines its construction rating', function() {
  var model = this.subject();

  equal(model.get('combustibleConstruction'), undefined, 'should have no defined construction rating for no defined unprotected opening area');

  model.set('unprotectedOpeningArea', 10);
  equal(model.get('combustibleConstruction'), false, 'should have non-combustible construction for unprotected opening area of 10m² or less');

  model.set('unprotectedOpeningArea', 10.1);
  equal(model.get('combustibleConstruction'), true, 'should have combustible construction for unprotected opening area of more than 10m²');
});

test('it determines its cladding rating', function() {
  var model = this.subject();

  equal(model.get('combustibleCladding'), undefined, 'should have no defined cladding rating for no defined unprotected opening area');

  model.set('unprotectedOpeningArea', 24);
  equal(model.get('combustibleCladding'), false, 'should have non-combustible cladding for unprotected opening area of less than 25m²');

  model.set('unprotectedOpeningArea', 25);
  equal(model.get('combustibleCladding'), true, 'should have combustible cladding for unprotected opening area of 25m² or more');
});

moduleFor('model:face', 'Face in group A, C, D, or F3', {
  setup: function() {
    var project = {occupancyGroup: '1'};
    this.model = this.subject({project: project});
  }
});

test('it deterimines its fire-resistance rating', function() {
  var model = this.model;

  equal(model.get('fireResistanceMinutes'), undefined, 'should have no defined fire-resistance rating for no defined unprotected opening area');

  model.set('unprotectedOpeningArea', 20);
  equal(model.get('fireResistanceMinutes'), 60, 'should have a 60-minute fire-resistance rating for unprotected opening area less than 25m²');

  model.set('unprotectedOpeningArea', 25);
  equal(model.get('fireResistanceMinutes'), 45, 'should have a 45-minute fire-resistance rating for unprotected opening area of 25 to 100m²');

  model.set('unprotectedOpeningArea', 100);
  equal(model.get('fireResistanceMinutes'), undefined, 'should have no defined fire-resistance rating for unprotected opening area of 100m² or more');
});


moduleFor('model:face', 'Face in group E, F1, or F2', {
  setup: function() {
    var project = {occupancyGroup: '2'};
    this.model = this.subject({project: project});
  }
});

test('it deterimines its fire-resistance rating', function() {
  var model = this.model;

  model.set('unprotectedOpeningArea', 20);
  equal(model.get('fireResistanceMinutes'), 120, 'should have a 120-minute fire-resistance rating for unprotected opening area less than 25m²');

  model.set('unprotectedOpeningArea', 25);
  equal(model.get('fireResistanceMinutes'), 60, 'should have a 60-minute fire-resistance rating for unprotected opening area of 25 to 100m²');

  model.set('unprotectedOpeningArea', 100);
  equal(model.get('fireResistanceMinutes'), undefined, 'should have no defined fire-resistance rating for unprotected opening area of 100m² or more');
});

