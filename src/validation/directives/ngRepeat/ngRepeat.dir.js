(function () {
  'use strict';
  
  angular
    .module('rentler.core')
    .directive('ngRepeat', Directive);
  
  Directive.$inject = [];
  
  function Directive() {
    var directive = {
      restrict: 'EA',
      controller: controller
    };
    
    return directive;
  }
  
  controller.$inject = ['$scope', '$element', '$attrs'];
  
  function controller($scope, $element, $attrs) {
    var _this = this;
    
    _this.index = $scope.$index;
    _this.collectionName = null;
    _this.itemName = null;
    _this.ngRepeat = $element.parent().controller('ngRepeat');
    _this.listeners = [];
    
    function init() {
      // Deconstruct expression
      var exp = $attrs.ngRepeat;
      var match = exp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
      
      // Get collection name
      _this.collectionName = match[2].split('|')[0];
      _this.collectionName = _.trim(_this.collectionName);
      
      // Get item name
      match = match[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
      _this.itemName = match[3] || match[1];
      
      // Watch for index changes
      $scope.$watch('$index', function (newIndex) {
        _this.index = newIndex;

        // Fire listeners
        _.forEach(_this.listeners, function (listener) {
          listener();
        });
      });
    }
    
    init();
  }
  
})();