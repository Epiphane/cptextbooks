angular.module('cpslobooks').controller('SellCtrl', function($scope, $sce, $state, courses, account) {
  $scope.courses = courses.getCourses();
  $scope.depNames = courses.getDepartmentNames();

  $scope.account = account.getUser();
  if($scope.account) {
    $scope.displayName = account.displayName;
    $scope.profilePic = account.profilePic;
    $scope.postToFacebook = true;
  }

  $scope.books = [{}];

  $scope.$watch(function() {
    return $scope.book;
  },
  function(newValue, oldValue) {
    if(newValue) {
      $scope.book.courseNumbers = $scope.courses[newValue];
      $scope.book.course = '';
    }
  });

  $scope.$on('courses.changed', function() {
    $scope.courses = courses.getCourses();
    $scope.depNames = courses.getDepartmentNames();
    $scope.$apply();
  });

  $scope.trustAsHtml = function(input) {
    return $sce.trustAsHtml(input);
  };

  $scope.noBooks = function() {
    for(var book = 0; book < $scope.books.length; book ++) {
      if($scope.books[book].name || $scope.books[book].dep) {
        return false;
      }
    }
    return true;
  };

  $scope.formatBookMessage = function formatBookMessage(book) {
    var message = '';
    if(book.dep) {
      message += book.dep;

      if(book.course) {
        message += ' ' + book.course;
      }

      message += ' ';
    }
    if(book.professor) {
      if(book.dep) {
        message += '(';
      }
      message += book.professor;
      if(book.dep) {
        message += ')';
      }

      message += ' ';
    }
    if((book.dep || book.professor) && (book.name || book.price)) {
      message += '- ';
    }
    if(book.name) {
      message += book.name + ' ';
    }
    if(book.price) {
      message += '$' + book.price;
    }

    return message;
  };

  $scope.submitBooks = function submitBooks() {
    // Require login
    var user = account.getUser();

    if(user) {
      var message = "Selling:\n\n";

      for(var book = 0; book < $scope.books.length; book ++) {
        if($scope.books[book].name || $scope.books[book].dep) {
          var thisBook = $scope.books[book];
          account.addBook(thisBook);
          message += $scope.formatBookMessage(thisBook) + '\n';
        }
      }

      // Post it to facebook!
      if($scope.postToFacebook) {
        account.postToFacebook(message);//.then(function() {
          $state.go('pages.mybooks');
        //});
      }
      else {
        $state.go('pages.mybooks');
      }
    }
    else { // Set up Async
      var unListen = $scope.$on('account.change', function() {
        $scope.submitBooks();
        unListen();
      });
    }
  };

  $scope.$on('account.change', function() {
    $scope.account = account.getUser();

    $scope.displayName = account.displayName;
    $scope.profilePic = account.profilePic;
    $scope.postToFacebook = true;

    $scope.$apply();
  });

  $scope.setToPreview = function() {
    $scope.preview = true;
  };
});
