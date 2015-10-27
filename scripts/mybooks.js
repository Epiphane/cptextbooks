angular.module('cpslobooks').controller('MyBooksCtrl', function($scope, account, books) {
  $scope.mybooks = account.getUserBooks();
  $scope.account = account.getUser();

  $scope.deleteBook = function deleteBook(hash) {
    books.deleteBook(hash);
  };

  $scope.sellBook = function sellBook(hash) {
    books.markAsSold(hash);
    $scope.mybooks[hash].sold = true;
  };

  $scope.$on('account.change', function() {
    $scope.account = account.getUser();
    $scope.$apply();
  });

  $scope.$on('account.books.change', function() {
    $scope.mybooks = account.getUserBooks();
    $scope.safeApply();
  });

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase === '$apply' || phase === '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
});
