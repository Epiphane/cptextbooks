angular.module('cpslobooks').controller('BuyCtrl', function($scope, books, $filter) {
  $scope.bookshelf = books.getBooks();

  $scope.$on('bookshelfChanged', function(event, books) {
    $scope.bookshelf = books;

    $scope.$apply();
  });

  $scope.sendBuyMessage = function sendBuyMessage(hash, uid) {
    FB.ui({
      method: 'send',
      link: 'http://calpolytextbooks.com/buy.html?' + hash,
      to: $filter('noFBID')(uid),
    });
  };
});
