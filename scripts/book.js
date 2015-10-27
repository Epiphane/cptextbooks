angular.module('cpslobooks').controller('BookCtrl', function($scope, $stateParams, $sce, $filter, $timeout, account, books, courses) {
  $scope.account = account.getUser();
  $scope.courses = courses.getCourses();
  $scope.depNames = courses.getDepartmentNames();

  $scope.$on('account.change', function() {
    $scope.account = account.getUser();
    $scope.$apply();
  });

  books.getBook($stateParams.hash).then(function(book) {
    $scope.book = book.val();
    account.getAccount($scope.book.user_id).then(function(user) {
      $scope.seller = user.val();
    });
  });

  // Not loaded error
  $timeout(function() {
    // Try again
    if(!$scope.book) {
      $scope.retryConnection();
    }
  }, 1500);

  $scope.retryConnection = function retryConnection() {
    $scope.error = false;
    books.getBook($stateParams.hash).then(function(book) {
      $scope.book = book.val();
      account.getAccount($scope.book.user_id).then(function(user) {
        $scope.seller = user.val();
      });

      if($scope.account.uid === $scope.book.user_id) {
        $scope.courses = courses.getCourses();
        $scope.depNames = courses.getDepartmentNames();
      }
    });

    $timeout(function() {
      if(!$scope.book) {
        $scope.error = true;
      }
    }, 2000);
  };

  $scope.sendBuyMessage = function sendBuyMessage() {
    FB.ui({
      method: 'send',
      link: 'http://calpolytextbooks.com/buy.html?' + $stateParams.hash,
      to: $filter('noFBID')($scope.book.user_id),
    });
  };

  $scope.$on('courses.changed', function() {
    $scope.courses = courses.getCourses();
    $scope.depNames = courses.getDepartmentNames();
    $scope.$apply();
  });

  $scope.trustAsHtml = function(input) {
    return $sce.trustAsHtml(input);
  };

  $scope.updateInfo = function() {
    if(!$scope.edit) {
      books.updateBook($stateParams.hash, $scope.book);
      account.loadBook($stateParams.hash);
    }
  };
});
