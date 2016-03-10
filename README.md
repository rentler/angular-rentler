# angular-rentler
Tools to help streamline angular applications. Includes data services and validation.

[![Build Status](https://travis-ci.org/rentler/angular-rentler.svg)](https://travis-ci.org/rentler/angular-rentler)

## Installation

```
bower install angular-rentler --save
```

## Usage

Reference `rentler.core` as a dependency:

```js
angular
  .module('app', ['rentler.core'])
  .run(...);
```

## Getting Started

### Validation

This library allows much cleaner validation within the angular framework designed for cleaner html and easier extensibility. First things first, define a model.

```js
angular
  .model('app')
  .factory('UserSchema', SchemaFactory);
  
SchemaFactory.$inject = [];

function SchemaFactory() {
  var schema = {
    firstName: {
      required: true,
      length: [0, 10]
    }
  };
  return schema;
}
```

Any model that is being bound in a controller can now be quickly configured for validation.

```js
angular
  .model('app')
  .factory('MyCtrl', MyCtrl);
  
MyCtrl.$inject = ['UserSchema', 'Validator'];

function MyCtrl(UserSchema, Validator) {
  var vm = this;
  vm.model = {}; // standard binding
  vm.validator = Validator.create(UserSchema, vm.model);
}
```

The model being bound to now validates against the custom validation rules defined! Next just simply implement much cleaner html.

```html
<form r-validator="vm.validator">
  <div r-validate-class="vm.model.firstName">
    <input type="text" ng-model="vm.model.firstName" />
    <div r-validate-message="vm.model.firstName" />
  </div>
  <button type="submit">Submit me, bro!</button>
</form>
```

Done! Now if the form is submitted with no first name the form is invalid, the wrapper class has the default bootstrap has-error class attached (configurable of course), and the r-validate-message div now contains the message "required." Easy peasy!

#### Checking for validation

The validator can check the model validation for you in case you want to do it in code:

```js
...
function MyCtrl(UserSchema, Validator) {
  var vm = this;
  vm.model = {}; // standard binding
  vm.validator = Validator.create(UserSchema, vm.model);
  
  function submit() {
    if(vm.validator.validate()) {
      // do something really cool on submit
      // like hit server-side apis, galore
    }
  }
}
...
```

Or you can pass in the fields you want to check for:

```js
...
if(vm.validator.validate(['firstName', 'lastName'])) {
  // do something really cool on submit
  // like hit server-side apis, galore
}
...
```

#### Default Validators

Out of the box this bad lad supports a number of validators:

**alphanumeric**

type: Boolean

Validates if field contains only letters and numbers.

```js
alphanumeric: true
// or
alphanumeric: {
  alphanumeric: true,
  message: 'My Message'
}
```

**compare: fieldName**

Validates if field is equal to another field.

```js
compare: firstName
// or
compare: {
  compare: firstName,
  message: 'My Message'
}
```

**email true|false**

Validates if field is an email.

```js
email: true
// or
email: {
  email: true,
  message: 'My Message'
}
```

**equals object|string|number|boolean**

Validates if field equals value.

```js
equals: 'bacon'
// or
equals: {
  equals: 'bacon',
  message: 'My Message'
}
```

**length [min,max]**

Validates if field length is in range.

```js
length: [0, 10]
// or
length: {
  length: [0, 10],
  message: 'My Message'
}
```

**mandatory true|false**

Validates if field is true.

```js
mandatory: true
// or
mandatory: {
  mandatory: true,
  message: 'My Message'
}
```

**numeric true|false**

```js
numeric: true
// or
numeric: {
  numeric: true,
  message: 'My Message'
}
```

**pattern regex**

Validates if field follows regex pattern.

```js
pattern: 'regex'
// or
pattern: {
  pattern: 'regex',
  message: 'My Message'
}
```

**range [min, max]**

Validates if field is in range.

```js
range: [1, 10]
// or
range: {
  range: [1, 10],
  message: 'My Message'
}
```

**required true|false**

Validates if field has value.

```js
required: true
// or
required: {
  required: true,
  message: 'My Message'
}
```

#### Custom Validation Messages

Each validator comes with a default validation message which you can override with your own.

Custom validation messages can be strings:

```js
...
var schema = {
  firstName: {
    alphanumeric: {
      message: 'This is my custom error message.'
    }
  }
};
...
```

Or functions that return strings:

```js
...
var schema = {
  lastName: {
    alphanumeric: {
      message: function (field, opts) {
        return 'This is my custom error message from a function.'
      }
    }
  }
};
...
```

#### Creating Custom Validators

It's as easy as creating a factory that returns a couple things. When creating a custom validator the *service name* must be capitalized and end with 'Validator'.

```js
// Bad
.factory('CheckForNulls', CheckForNulls);

// Bad
.factory('nullValidator', nullValidator);

// Good
.factory('NullValidator', NullValidator);
```

Validators are simply services that return objects that include a `validate` and `message` field:

```js
.factory('FunValidator', FunValidator);

FunValidator.$inject = [];

function FunValidator() {
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

Now you can go ahead and implement!

```js
...
var schema = {
  firstName: {
    fun: true
  }
};
...
```

## Contributing

Please read through the [Javascript Style Guide](https://github.com/rentler/javascript-styleguide) and [Angular Style Guide](https://github.com/rentler/angular-styleguide).
