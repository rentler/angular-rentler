'use strict';

describe('DataModel', function () {
  var $httpBackend, DataModelProvider, User, Address;

  beforeEach(module('rentler.core', function (_DataModelProvider_, $provide) {
    DataModelProvider = _DataModelProvider_;
    DataModelProvider.setBaseUrl('/api/v1');

    $provide.factory('User', UserFactory);

    $provide.factory.$inject = ['DataModel'];
    
    function assignClone(dest) {
      var args = arguments;
  
      _.forEach(args, function (src) {
        _.assign(dest, _.cloneDeep(src));
      });
  
      return dest;
    }

    function UserFactory(DataModel) {
      var model = {
        // API endpoint
        url: '/accounts/:accountId/users/:*userId',

        // Relationships
        relations: {
          'address': 'Address',
        },

        // Helper functions
        accountId: function () {
          return 10;
        },
        fullName: function () {
          var _this = this;
          return _this.firstName + ' ' + _this.lastName;
        }
      };
      
      // FIX: This mixin needs to be global somehow
      // FIX: When passing DataModel functions as callbacks context gets lost
      assignClone(model, DataModel);

      return model;
    }

    $provide.factory('Address', AddressFactory);

    $provide.factory.$inject = ['DataModel'];

    function AddressFactory(DataModel) {
      var model = {
        // API endpoint
        url: '/addresses/:*addressId',

        // Helper functions
        simple: function () {
          var _this = this;
          return _this.address1;
        }
      };

      assignClone(model, DataModel);

      return model;
    }
  }));

  beforeEach(inject(function (_$httpBackend_, _User_) {
    $httpBackend = _$httpBackend_;
    User = _User_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be able to create instances', function () {
    var user = User.create({
      firstName: 'John',
      lastName: 'Doe'
    });

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
  });

  it('should mixin helper functions', function () {
    var user = User.create();

    expect(user.fullName).toBeDefined();
  });
  
  it('should bind functions correctly for callbacks', function () {
    var user = User.create({ firstName: 'John', lastName: 'Doe' });
    
    function test(cb) {
      return cb();
    }
    
    expect(test(user.fullName)).toBe('John Doe');
  });

  it('should be able to get an entity', function () {
    $httpBackend.expectGET('/api/v1/accounts/10/users/5').respond(200, { userId: 5 });
    User.get(5);
    $httpBackend.flush();
  });

  it('should be able to get a paginated list of entities', function () {
    $httpBackend.expectGET('/api/v1/accounts/10/users?query=john&order=createDate&page=1&pageSize=10').respond(200, {});
    User.list({ query: 'john', order: 'createDate', page: 1, pageSize: 10 });
    $httpBackend.flush();
  });

  it('should be able to save an entity', function () {
    $httpBackend.expectPOST('/api/v1/accounts/10/users').respond(200, {});
    var user = User.create({});
    user.save();
    $httpBackend.flush();
  });

  it('should be able to delete an entity', function () {
    $httpBackend.expectDELETE('/api/v1/accounts/10/users/10').respond(200, {});
    User.remove(10);
    $httpBackend.flush();
  });

  it('should be able to delete an entity from an existing instance', function () {
    $httpBackend.expectGET('/api/v1/accounts/10/users/15').respond(200, { userId: 15 });

    User.get(15).then(function (user) {
      $httpBackend.expectDELETE('/api/v1/accounts/10/users/15').respond(200, {});
      user.remove();
    });

    $httpBackend.flush();
  });

  it('should bridge relationships', function () {
    var user = User.create({ address: { address1: '1234 Sugar Lane' } });

    expect(user.address.url).toBeDefined();
    expect(user.address.simple).toBeDefined();
  });

});