angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('ShareCtrl', function($scope, $cordovaSocialSharing, $cordovaCamera) {
  console.log("share ctrl");
  var message = "Hey hey hey! I think you might be interested in this:";
  var subject = "Introduction from Agnes";
  var number = "12347827346";
  var toArr = ['to@person1.com', 'to@person2.com'];
  var ccArr = null;
  var bccArr = null;
  var image = 'https://www.google.nl/images/srpr/logo4w.png';
  var link = 'https://www.google.nl/images/srpr/logo4w.png';
  var file = ['https://www.google.nl/images/srpr/logo4w.png','www/localimage.png'];

  $scope.shareAnywhere = function() {
      $cordovaSocialSharing
    .share(message, subject, file, link) // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $scope.shareEmail = function() {
      //toArr, ccArr and bccArr must be an array, file can be either null, string or array
    $cordovaSocialSharing
      .shareViaEmail(message, subject, toArr, ccArr, bccArr, file)
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
  }

  $scope.shareText = function() {
    // access multiple numbers in a string like: '0612345678,0687654321'
    $cordovaSocialSharing
      .shareViaSMS({'message':message, 'subject':subject, 'image':image}, number)
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
  }

  $scope.shareFB = function() {
    $cordovaSocialSharing
      .shareViaFacebook(message, image, link)
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
  };
//   $cordovaSocialSharing
//     .canShareVia(socialType, message, image, link)
//     .then(function(result) {
//       // Success!
//     }, function(err) {
//       // An error occurred. Show a message to the user
//     });
//
//   $cordovaSocialSharing
//     .canShareViaEmail()
//     .then(function(result) {
//       // Yes we can
//     }, function(err) {
//       // Nope
//     });


  //=================================camera================
  //http://ngcordova.com/docs/plugins/camera/
  $scope.takephoto = function(){
    console.log("take photo!");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      console.log("error");
      // error
    });
  }

  // $scope.getphoto = function() {
  //   var options = {
  //     destinationType: Camera.DestinationType.FILE_URI,
  //     sourceType: Camera.PictureSourceType.CAMERA,
  //   };
  //
  //   $cordovaCamera.getPicture(options).then(function(imageURI) {
  //     var image = document.getElementById('myImage');
  //     image.src = imageURI;
  //   }, function(err) {
  //     // error
  //   });
  //   // $cordovaCamera.cleanup().then(...); // only for FILE_URI
  // }
});
