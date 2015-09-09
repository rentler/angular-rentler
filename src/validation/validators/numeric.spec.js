(function () {
  'use strict';

  describe('NumericValidator', function () {
    var NumericValidator;

    beforeEach(module('rentler.core'));

    beforeEach(inject(function (_NumericValidator_) {
      NumericValidator = _NumericValidator_;
    }));

    //it('should validate to true when given a number', function () {
    //  expect(NumericValidator.validate(1, {}, true)).toBe(true);
    //});

    //it('should validate to true when given a string number', function () {
    //  expect(NumericValidator.validate('1', {}, true)).toBe(true);
    //});

    //it('should validate to false when given anything but a number', function () {
    //  expect(NumericValidator.validate('yo', {}, true)).toBe(false);
    //  expect(NumericValidator.validate(true, {}, true)).toBe(false);
    //  expect(NumericValidator.validate([], {}, true)).toBe(false);
    //});

    //it('should validate to false when given null', function () {
    //  expect(NumericValidator.validate(null, {}, true)).toBe(false);
    //});

    //it('should validate to false when given undefined', function () {
    //  expect(NumericValidator.validate(undefined, {}, true)).toBe(false);
    //});

    //it('should validate to true when options are false', function () {
    //  expect(NumericValidator.validate(null, {}, false)).toBe(true);
    //});
  });

})();
