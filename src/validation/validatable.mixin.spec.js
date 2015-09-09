'use strict';

describe('Validatable', function () {
  var Validatable, user;

  beforeEach(module('rentler.core'));

  beforeEach(inject(function (_Validatable_) {
    Validatable = _Validatable_;
  }));

  beforeEach(function () {
    user = {
      schema: {
        userId: {
          required: {
			required: true,
            message: 'Custom error'
          }
        },
        firstName: {
          required: true,
          alphanumeric: {
            message: function () {
              return 'Custom function error';
            }
          }
        },
        lastName: {
          required: true,
          alphanumeric: true
        }
      }
    };

    _.assign(user, Validatable);
  });

  it('should validate', function () {
    expect(user.validate()).toBe(false);

    user.userId = 1;
    user.firstName = 'John';
    user.lastName = 'Doe';

    expect(user.validate()).toBe(true);
    expect(user.validation.isValid).toBe(true);
  });

  it('should validate all fields', function () {
    user.validate();
    expect(user.validation.errors).not.toBeUndefined();
    expect(user.validation.errors.firstName).not.toBeUndefined();
    expect(user.validation.errors.lastName).not.toBeUndefined();
    expect(user.validation.errors.userId).not.toBeUndefined();
  });

  it('should validate a single field', function () {
    user.validate('firstName');
    expect(user.validation.errors.firstName).not.toBeUndefined();
    expect(user.validation.errors.lastName).toBeUndefined();
    expect(user.validation.errors.userId).toBeUndefined();
  });

  it('should validate an array of fields', function () {
    user.validate(['firstName', 'lastName']);
    expect(user.validation.errors.firstName).not.toBeUndefined();
    expect(user.validation.errors.lastName).not.toBeUndefined();
    expect(user.validation.errors.userId).toBeUndefined();
  });

  it('should add to validation rather than replacing previous validation', function () {
    user.validate(['firstName']);
    user.validate(['lastName']);

    expect(user.validation.errors.firstName).not.toBeUndefined();
    expect(user.validation.errors.lastName).not.toBeUndefined();
    expect(user.validation.isValid).toBe(false);
  });

  it('should use custom error messages', function () {
    user.userId = null;
    user.validate();

    expect(user.validation.errors.userId).toContain('Custom error');
    expect(user.validation.errors.firstName).toContain('Custom function error');
  });
});