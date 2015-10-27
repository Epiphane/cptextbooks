angular.module('cpslobooks').factory('account', function($rootScope, $state, $sce, books) {
  var account = {};

  // Test: 844023512296439
  // Real: 261266090571763
  var textbookPage = $rootScope.textbookPage = '261266090571763';
  var textbookPageBackup = '844023512296439';

  var databaseRef = new Firebase("https://blistering-inferno-5850.firebaseio.com");
  var accountRef;

  account.getAccount = function getBook(uid) {
    var accRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/users/" + uid);

    return {
      then: function(callback) {
        accRef.on('value', function(acc) {
          callback(acc);

          accRef.off('value');
        });
      }
    };
  };

  var handleUserLogin = function handleUserLogin(error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      account.user = user;
      account.uid = user.uid;
      account.accessToken = user.accessToken;
      accountRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/users/" + account.uid);
      accountRef.on('value', function(user) {
        account.books = user.val().books;
        account.loadBooks();
        $rootScope.$broadcast('account.books.change');
      });

      if(!user.facebook) {
        user.facebook = user.thirdPartyUserData;
        user.facebook.displayName = user.displayName;
      }
      if(user.facebook) {
        account.displayName = user.facebook.displayName;
        account.profilePic = "http://graph.facebook.com/v2.1/" + user.id + "/picture";
        accountRef.update({
          displayName: account.displayName,
          profilePic: account.profilePic
        });
      }

      $rootScope.account = account;
      $rootScope.$broadcast('account.change');
    } else {
      // Logged out
      $rootScope.$broadcast('account.change');
    }
  };

  var authClient = new FirebaseSimpleLogin(databaseRef, handleUserLogin);

  $rootScope.login = function requireUser() {
    if(!account.uid) {
      // Need to log in
      authClient.login('facebook', {
        rememberMe: true,
        scope: 'publish_actions'
      });
    }
  };

  $rootScope.logout = function logout() {
    authClient.logout();
    delete account.user;
    delete account.uid;
    delete account.accessToken;
    delete $rootScope.account;
    accountRef.off('value');
  };

  account.getUser = function getUser() {
    return account.user;
  };

  account.getUserBooks = function getUserBooks() {
    return account.books;
  };

  account.loadBooks = function loadBooks() {
    for(var key in account.books) {
      account.loadBook(key);
    }
  };

  account.loadBook = function loadBook(key) {
    if(!account.books[key]) {
      delete account.books[key];
      return;
    }

    books.getBook(key).then(function(book) {
      account.books[key] = book.val();
    });
  };

  account.addBook = function addBook(book) {
    var hash = books.addBook(book, account.uid);
    var obj = {};
    obj[hash] = true;

    new Firebase("https://blistering-inferno-5850.firebaseio.com/users/" + account.uid + "/books").update(obj);
  };

  $rootScope.postToFacebook = account.postToFacebook = function postToFacebook(message) {
    $rootScope.error = false;
    FB.api('/' + textbookPage + '/feed', "POST",
    {
        "message": message
    },
    function (response) {
      if(response.error) {
        console.log(response.error);

        if(response.error.error_subcode === 1376025 || response.error.type === "OAuthException") {
          $rootScope.error = {
            message: message
          };
          $rootScope.$apply();
        }
      }
      else {
        console.log(response);
      }
    });
  };

  return account;
});

angular.module('cpslobooks').filter('noFBID', function() {
  return function(input) {
    if(!input) {
      return input;
    }

    return input.substring(input.indexOf(':') + 1);
  };
});
