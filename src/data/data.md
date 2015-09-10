# Data Modeling

Models are RESTful business objects.

## Configuration

Use the `DataModelProvider` at configuration phase:

```
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

## Defining a model

Define your model the extend it with the `DataModel` service mixin:

```
angular
  .module('app')
  .factory('User', UserFactory);
  
  UserFactory.$inject = ['DataModel'];
  
  function UserFactory(DataModel) {
    var model = {
      // API endpoint
      url: 'users/:*userId',
      
      // Relationships
      relations: {
        
      },
    
      // Helper functions
      fullName: function () {
        return _.format('{0} {1}', this.firstName, this.lastName);
      },
      ...
    };
    
    _.assignClone(model, DataModel);
    
    return model;
  }
```

### Url
**Each model must include a `url` field** that defines the base resource API endpoint.

The `:*field` pattern defines a segment of the url that should be replaced by the appropriate field value on the model.

### TODO: Relationships

### Helper Functions
Functions defined on the model will be mixed into every instance of the model. This is useful for functions you want to reuse per model in multiple controllers/services.




## Getting an Instance

**Always call `create({...})` to get a model instance.** Never use the factory directly as it is a *singleton*.

```
angular
  .module('app')
  .controller('UserCreateCtrl', UserCreateCtrl);
  
  UserCreateCtrl.$inject = ['User'];
  
  function UserCreateCtrl(User) {
    var vm = this;
    
    vm.user = {};
    
    function init() {
      // Create a new user instance
      vm.user = User.create();
    }
    
    init();
  }
```

## API Methods

DataModels come with standard restful api methods.

### Get

```
// Get user
user.get(5).then(function (user) { ... });
```

### List

```
// Get a paged list of users
user.list({ query: 'john', orderBy: 'createDate', page: 2, pageSize: 10 }).then(function (list) { ... });
```

### Save

```
// Save a new user
var user = User.create({ firstName: 'John' });
user.save();

// Update an existing user
user.get(5);
...
user.save();
```

### Delete
```
// Delete user
user.remove(5);
```