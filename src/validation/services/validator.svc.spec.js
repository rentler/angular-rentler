(function () {
  'use strict';
  
  describe('Validator', function () {
    var Validator, schema, model, modelValidator;
    
    beforeEach(module('rentler.core'));
    
    beforeEach(inject(function (_Validator_) {
      Validator = _Validator_;
    }));
    
    beforeEach(function () {
      schema = {
        firstName: {
          required: {
            required: true,
            message: 'Custom error'
          }
        },
        lastName: {
          validateIf: function (instance) {
            return instance.hasLastName;
          },
          required: {
            required: true,
            message: function () {
              return 'Custom function error';
            }
          }
        },
        friends: {
          range: [1, null],
          collection: {
            firstName: {
              required: true
            }
          }
        }
      };
      
      model = {
        firstName: 'John',
        hasLastName: true,
        lastName: 'Doe',
        friends: []
      };
      
      modelValidator = Validator.create(schema, model);
    });
    
    it('should validate', function () {
      expect(modelValidator.validate()).toBe(false);
      expect(modelValidator.isValid).toBe(false);
    });
    
    it('should validate all fields when passed empty args', function () {
      modelValidator.validate();
      expect(modelValidator.errors).not.toBeUndefined();
      expect(modelValidator.errors.firstName).not.toBeUndefined();
      expect(modelValidator.errors.lastName).not.toBeUndefined();
    });
    
    it('should be able to validate a single field', function () {
      expect(modelValidator.validate('firstName')).toBe(true);
      expect(modelValidator.errors.firstName).not.toBeUndefined();
      expect(modelValidator.errors.lastName).toBeUndefined();
    });
    
    it('should be able to validate an array of fields', function () {
      expect(modelValidator.validate(['firstName', 'lastName'])).toBe(true);
      expect(modelValidator.errors.firstName).not.toBeUndefined();
      expect(modelValidator.errors.lastName).not.toBeUndefined();
    });
    
    it('should incrementally add validation errors on consecutive validate calls', function () {
      modelValidator.validate('firstName');
      modelValidator.validate('lastName');
      
      expect(modelValidator.errors.firstName).not.toBeUndefined();
      expect(modelValidator.errors.lastName).not.toBeUndefined();
    });
    
    it('should use custom error messages', function () {
      model.firstName = null;
      model.lastName = null;
      modelValidator.validate();
      
      expect(modelValidator.errors.firstName).toContain('Custom error');
      expect(modelValidator.errors.lastName).toContain('Custom function error');
    });
    
    it('should skip validation for fields that have a validateIf function that results in falsey', function () {
      model.hasLastName = false;
      modelValidator.validate();
      
      expect(modelValidator.errors.lastName).toBeUndefined();
    });
    
    it('should be able to validate collections', function () {
      model.friends = [
        { firstName: 'John' },
        { firstName: '' }
      ];
      modelValidator.validate();

      expect(modelValidator.errors['friends[0].firstName']).toBeDefined();
      expect(modelValidator.errors['friends[1].firstName']).toBeDefined();
      expect(modelValidator.errors['friends[1].firstName'].length).toBe(1);
    });
    
  });
  
})();