(function () {
  'use strict';
  
  angular
    .module('rentler.core')
    .directive('ngRepeat', Directive);
    
  var ctrl = null;
    
  Directive.$inject = [];
  
  function Directive() {
    var directive = {
      restrict: 'EA',
      require: '?^ngRepeat',
      controller: controller,
      link: link
    };
    
    return directive;
    
    function link(scope, element, attrs, ngRepeatCtrl) {
      ctrl = ngRepeatCtrl;
    }
  }
  
  controller.$inject = ['$scope', '$attrs'];
  
  function controller($scope, $attrs) {
    var _this = this;
    
    _this.index = $scope.$index;
    _this.collectionName = null;
    _this.itemName = null;
    _this.ngRepeat = ctrl;
    
    function init() {
      // Deconstruct expression
      var exp = $attrs.ngRepeat;
      var match = exp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
      
      // Get collection name
      _this.collectionName = match[2];
      
      // Get item name
      match = match[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
      _this.itemName = match[3] || match[1];
    }
    
    init();
  }
  
})();