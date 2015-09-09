# Validation

Validation should be defined once and only once per model.

## Creating a Validatable

Define your schema, then extend it with the `Validatable` service:

```
angular
  .module('app')
  .factory('User', UserFactory);

UserFactory.$inject = ['Validatable'];

function UserFactory(Validatable) {

  var model = {
    // The schema definition
    schema: {
      userId: {
        numeric: true,
      },
      age: {
        required: true,
        range: [null, 18]
      }
    }
  };

  // Extend
  _.assign(model, Validatable);

  return model;
}
```

## Validating

```
// Validate all fields
model.validate(); // => true | false

// Validate a single field
model.validate('userId'); // => true | false

// Validate multiple fields
model.validate(['userId', 'age']); // => true | false
```

## Validating via ngModel

Validation automatically works with ngModel. When the value of ngModel changes `validate()` is called on the model and classes `ng-valid`/`ng-invalid` are added to the form control as well as the form.

## Validation Results

Calling `validate()` adds the following fields to the model:

```
// Overall validation result
model.validation.isValid // => true | false

// Validation error messages
model.validation.errors.userId // => ['Error 1', 'Error 2', ...]
model.validation.errors.age // => []
```

## TODO: Reset Validation

```
// Reset all validation
model.validation.reset();

// Reset validation for a single field
model.validation.reset('userId');

// Reset validation for multiple fields
model.validation.reset(['userId', 'age']);
```

## Custom Error Messages

Each validator comes with a default validation message which you can override with your own.

Custom validation messages can be strings:

```
var model = {
  schema: {
    firstName: {
      alphanumeric: {
        message: 'This is my custom error message.'
      }
    },
    ...
  }
};
```

Or functions that return strings:

```
var model = {
  schema: {
    lastName: {
      alphanumeric: {
        message: function (field, opts) {
          return 'This is my custom error message from a function.'
        }
      }
    },
    ...
  }
};
```

## Custom Validators

When creating a custom validator the *service name* must be capitalized and end with 'Validator'.

```
// Bad
.factory('CheckForNulls', CheckForNulls);

// Bad
.factory('nullValidator', nullValidator);

// Good
.factory('NullValidator', NullValidator);
```

Validators are simply services that return objects that include a `validate` and `message` field:

```
.factory('MyValidator', MyValidator);

MyValidator.$inject = [];

function MyValidator() {
  function validate(value, instance, opts) {
    if (!opts)
      return true;

    return true || false;
  }

  var myvalidator = {
    validate: validate,
    message: 'Error'
  };

  return myvalidator;
}
```