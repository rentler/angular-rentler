# Data

Models are RESTful business objects.

## Configuration

Use the `DataModelProvider` at configuration phase:

```js
angular
  .module('app', [])
  .config(Config);

Config.$inject = ['DataModelProvider'];

function Config(DataModelProvider) {
  // Set the API base url
  DataModelProvider.setBaseUrl('/api/v1');

  ...
}
```

#### setBaseUrl(string baseUrl)

Sets the base url for all api calls.

## Defining a model

Define your model the extend it with the `DataModel` service mixin:

```js
angular
  .module('app')
  .factory('User', UserFactory);
  
  UserFactory.$inject = ['DataModel'];
  
  function UserFactory(DataModel) {
    var model = {
      // API endpoint (required)
      url: 'users/:*userId',
      
      // Schema
      schema: {
        firstName: {},
        lastName: {}
      },
      
      // Relationships
      relations: {
        address: 'Address'
      },
    
      // Helper functions
      fullName: function () {
        return _.format('{0} {1}', this.firstName, this.lastName);
      },
      ...
    };
    
    // Extend
    _.assign(model, _.cloneDeep(DataModel));
    
    return model;
  }
```

#### Url

Each data model **must include a `url` field** that defines the resource API endpoint.

The `:*field` pattern defines a segment of the url that should be replaced by the appropriate field value on the model.

### Schema

The `schema` field defines what fields get sent on saves. Keys are field names and values are arbitrary.

#### Relationships

The `relations` field on models is a special object that denotes nested models. Keys are field names and values are model names. To resolve relationships call `relationalize()` on the data model.

#### Helper Functions

Functions defined on the model will be mixed into every instance of the model. This is useful for functions you want to reuse per model in multiple controllers/services.

## API Functions

The `DataModel` service mixin includes standard restful api functions. Each function returns a promise.

#### get(id)

Gets an existing entity.

```
// GET /api/v1/users/5
user.get(5).then(function (user) { ... });
```

#### list(params)

Gets a paged list of entities.

```
// GET /api/v1/users?page=2&orderBy=createDate
user.list({ page: 2, orderBy: 'createDate' }).then(function (list) { ... });
```

#### save()

Creates/updates an entity.

```
// POST api/v1/users
var user = User.create({ firstName: 'John' });
user.save().then(function (user) { ... });

// POST api/v1/users/5
user.get(5);
user.name = 'John';
user.save().then(function (user) { ... });
```

#### delete(id)

Deletes an entity.

```
// DELETE api/v1/users
user.remove(5).then(function (data) { ... });
```

## Getting Instances

It is very common that you won't want the same instance of your data model everywhere. Use the `Instantiable` service mixin in conjunction with the `DataModel` service mixin to get new instances.

```js
// Extend
_.assign(model, _.cloneDeep(Instantiable), _.cloneDeep(DataModel));
```

See the [Instantiable Docs](src/instantiable/instantiable.md) for indepth explanations and examples.