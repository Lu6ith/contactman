'use strict';
function ListCtrl($scope, $modal, contactFactory) {
  $scope.headers = ["nazwisko", "imię", "komórka", "telefon", "email", "tags",""];
  $scope.columnSort = { sortColumn: 'tags', reverse: true };

  contactFactory.getContacts().success(function(contacts) {
    $scope.contacts = contacts;
  });
  //Add contact modal
  $scope.add = function() {
    var modalInstance = $modal.open({
      //templateUrl: 'addContactModal',
      templateUrl: 'p/add-contact',
      controller: addContactModalCtrl
    });
  };

  $scope.view = function(c) {
    var id = c._id;
    var modalInstance = $modal.open({
      templateUrl: 'p/view-contact',    //'viewContactModal',
      controller: viewContactModalCtrl,
      resolve: {
        contact: function() {
          return contactFactory.getContact(id);
        }
      }
    });
  };

  $scope.edit = function(c) {
    var id = c._id;
    var modalInstance = $modal.open({
      templateUrl: 'p/edit-contact',    //'editContactModal',
      controller: editContactModalCtrl,
      resolve: {
        contact: function() {
          return contactFactory.getContact(id);
        }
      }
    });
  };

  $scope.delete = function(c) {
     var id = c._id;
    var modalInstance = $modal.open({
      templateUrl: 'p/delete-contact',  //'deleteContactModal',
      controller: deleteContactModalCtrl,
      resolve: {
        contact: function() {
          return contactFactory.getContact(id);
        }
      }
    });
  };

  $scope.searchFilter = function (c) {
     var keyword = new RegExp($scope.query, 'i');
     return !$scope.query || keyword.test(c.lastName) || keyword.test(c.firstName);
  };

  $scope.searchStaff = function (c) {
      var keyword = new RegExp("PSEC - ZT", 'i');
      return "PSEC - ZT" || keyword.test(c.tags);
  };

    $scope.workspaces =
        [
            { id: 1, name: "Kontakty", active:true, filtr: {tags: '!PSEC - ZT'} },
            { id: 2, name: "Pracownicy", active:false, filtr: {tags : 'PSEC - ZT'} }
        ];

};

var addContactModalCtrl = function($scope, $http, $modalInstance, $window, contactFactory) {
  $scope.form = {};

  $scope.addContact = function() {
    contactFactory.addContact($scope.form.add).success(function() {
      $modalInstance.close($window.location.reload());
      });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
};

var viewContactModalCtrl = function($scope, $modalInstance, contact) {
  $scope.allheaders = ["nazwisko", "imię", "komórka", "telefon", "email", "twitter", "tagi"];
  $scope.contact = contact.data.contact;

  $scope.close = function() {
    $modalInstance.dismiss('cancel');
  };
};

var editContactModalCtrl = function($scope, $modalInstance, $window, contact, contactFactory) {
  $scope.form = {};
  $scope.allheaders = ["nazwisko", "imię", "komórka", "telefon", "email", "twitter", "tagi"];
  $scope.form.edit = contact.data.contact;
  $scope.name = contact.data.contact.lastName;

  $scope.editContact = function() {
    contactFactory.updateContact(contact.data.contact._id, $scope.form.edit).success(function() {
      $modalInstance.close($window.location.reload());
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  }
};

var deleteContactModalCtrl = function($scope, $route, $modalInstance, $window, contact, contactFactory) {
  $scope.name = contact.data.contact.name;

  $scope.deleteContact = function() {
    contactFactory.deleteContact(contact.data.contact._id).success(function() {
      $modalInstance.close();
      contactFactory.getContacts().success(function(contacts) {
        return $scope.contacts = contacts;
      });
      $window.location.reload();
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel')
  };
};

var TabsParentController = function ($scope) {

    var setAllInactive = function() {
        angular.forEach($scope.workspaces, function(workspace) {
            workspace.active = false;
        });
    };

    var addNewWorkspace = function() {
        var id = $scope.workspaces.length + 1;
        $scope.workspaces.push({
            id: id,
            name: "Workspace " + id,
            active: true
        });
    };

    $scope.workspaces =
        [
            { id: 1, name: "Kontakty", active:true, filtr: $scope.searchFilter() },
            { id: 2, name: "Pracownicy", active:false, filtr: {tags : 'PSEC - ZT'} }
        ];

    $scope.addWorkspace = function () {
        setAllInactive();
        //addNewWorkspace();
    };

};