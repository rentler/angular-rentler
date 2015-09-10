(function () {
  'use strict';
  
  describe('Model', function () {
    var User;
    
    beforeEach(module('rentler.core', function ($provide) {
    
    $provide.factory('User', UserFactory);
    
    $provide.factory.$inject = ['Instantiable'];
    
    function UserFactory(Instantiable) {
      var model = {
        fullName: function () {
            var _this = this;
            return _this.firstName + ' ' + _this.lastName;
          }
        };
        
        _.assign(model, _.cloneDeep(Instantiable));
        
        return model;
      }
    }));
    
    beforeEach(inject(function (_User_) {
    User = _User_;
    }));
    
    it('should be able to create instances', function () {
    var user = User.create({ firstName: 'John', lastName: 'Doe' });
  
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
    });
    
    it('should bind function correctly for callbacks', function () {
    var user = User.create({ firstName: 'John', lastName: 'Doe' });
    
    function test(cb) {
      return cb();
    }
    
    expect(test(user.fullName)).toBe('John Doe');
    });
  });
}());
