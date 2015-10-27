angular.module('cpslobooks').factory('books', function($rootScope) {
  var booksRef = new Firebase('https://blistering-inferno-5850.firebaseio.com/books');
  var bookshelf = {};
  booksRef.on('value', function (snapshot) {
    bookshelf = snapshot.val();

    $rootScope.$broadcast('bookshelfChanged', bookshelf);
  });

  var books = {};

  books.getBooks = function getBooks() {
    return bookshelf;
  };

  books.getBook = function getBook(hash) {
    var bookRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/books/" + hash);

    return {
      then: function(callback) {
        bookRef.on('value', function(book) {
          callback(book);

          bookRef.off('value');
        });
      }
    };
  };

  books.addBook = function addBook(book, user_id) {
    if(typeof(user_id) === 'undefined') {
      // Needs authentication
      return false;
    }

    var newBook = booksRef.push();

    newBook.set({
      name: book.name || '',
      dep: book.dep || '',
      course: book.course || '',
      professor: book.professor || '',
      price: book.price || '',
      user_id: user_id
    });

    return newBook.name();
  };

  books.updateBook = function updateBook(hash, book) {
    var bookRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/books/" + hash);
    bookRef.set(book);
  };

  books.deleteBook = function deleteBook(hash) {
    var bookRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/books/" + hash);
    bookRef.on('value', function(book) {
      var bookInfo = book.val();

      var accountBookRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/users/" + bookInfo.user_id + "/books/" + hash);
      accountBookRef.remove();//.set(false);
      bookRef.off('value');
      bookRef.remove();
    });
  };

  books.markAsSold = function markAsSold(hash) {
    var bookRef = new Firebase("https://blistering-inferno-5850.firebaseio.com/books/" + hash + "/sold");
    bookRef.set(true);
  };

  return books;
});
