angular.module('cpslobooks').factory('courses', function($rootScope) {
  var courses = {};

  var coursesRef = new Firebase('https://blistering-inferno-5850.firebaseio.com/courses');
  coursesRef.on('value', function(courseVals) {
    courses.courses = courseVals.val();
    $rootScope.$broadcast('courses.changed');
  });

  courses.getCourses = function getCourses() {
    return courses.courses;
  };

  courses.getDepartmentNames = function getDepartmentNames() {
    var depNames = [];
    for(var course in courses.courses) {
      depNames.push(course);
    }
    return depNames;
  };

  return courses;
});
