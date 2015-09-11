# Instantiable

Angular services are *singletons*. Sometimes you don't want the same object everytime. The `Instantiable` mixin service allows for new instances of an object to be created.

`Instantiable` has a single function `create(options...)` which creates a deep copy of itself with `options` also assigned to itself.

Extend your service with the mixin:

```js
angular
  .module('app')
  .factory('AppService', AppServiceFactory);
  
  AppServiceFactory.$inject = ['Instantiable'];
  
  function AppServiceFactory(Instantiable) {
    var service = {
	  name: 'Hi'
	};
	
	// Mixin Instantiable
	_.assign(service, _.cloneDeep(Instantiable));
	
	return service;
  }
```

Now you can get new instances of your service:

```js
angular
  .module('app')
  .controller('AppCtrl', AppCtrl);
  
  AppCtrl.$inject = ['AppService'];
  
  function AppCtrl(AppService) {
    var vm = this;
    
    vm.service = {};
    
    function init() {
      // Service now has a create({...}) function
      vm.service = AppService.create({ hello: 'world' });
    }
    
    init();
  }
```