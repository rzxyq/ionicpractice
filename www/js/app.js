// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services','mlz.backbutton'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  .factory('OpenUrlService', ['$log', '$location', '$rootScope', '$ionicHistory', function ($log, $location, $rootScope, $ionicHistory) {

    var openUrl = function (url) {

      $log.debug('Handling open URL ' + url);

      // Stop it from caching the first view as one to return when the app opens
      $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true,
        disableAnimation: true
      });

      if (url) {
        window.location.hash = url.substr(5);
        $rootScope.$broadcast('handleopenurl', url);

        window.cordova.removeDocumentEventHandler('handleopenurl');
        window.cordova.addStickyDocumentEventHandler('handleopenurl');
        document.removeEventListener('handleopenurl', handleOpenUrl);
      }
    };

    var handleOpenUrl = function (e) {
      console.log("event fired handle openurl!");
      openUrl(e.url);
    };

    var onResume = function () {
      document.addEventListener('handleopenurl', handleOpenUrl, false);
    };

    return {
      handleOpenUrl: handleOpenUrl,
      onResume: onResume
    };

  }])
  .run(['OpenUrlService', function (OpenUrlService) {
    if (OpenUrlService) {
      document.addEventListener('handleopenurl', OpenUrlService.handleOpenUrl, false);
      document.addEventListener('resume', OpenUrlService.onResume, false);
    }
  }])


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'ShareCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.share', {
      url: '/share',
      views: {
        'tab-share': {
          templateUrl: 'templates/tab-share.html',
          controller: 'ShareCtrl'
        }
      }
    })

    .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});



//=======================================custom url======================

if ('cordova' in window) {
  // Create a sticky event for handling the app being opened via a custom URL
  cordova.addStickyDocumentEventHandler('handleopenurl');
}


function handleOpenURL(url) {
  setTimeout(function() {
    alert("received url3: " + url);
    window.localStorage.setItem("external_load", url);
    cordova.fireDocumentEvent('handleopenurl', { url: url });

  }, 0);
}


var BackButtonCtrl = function ($scope, $log, $state, $ionicHistory, $ionicViewSwitcher) {

  var ctrl = this;

  /**
   * Checks to see if there is a view to navigate back to
   * if we have no current back view.
   *
   * @param  {string} state The current view state
   * @return {boolean}      If there is a view we should navigate back to
   */
  this.canGoBack = function (state) {

    if (!state) {
      state = $ionicHistory.currentStateName();
    }

    var states = state.split('/');

    if (states.length > 1 && !$ionicHistory.backView())  {
      states.pop();
      ctrl.toState = states.join('/');
      return true;
    }
    return false;
  };

  $scope.state = {
    show: true,
    previousState: ''
  };

  $scope.goBack = function () {

    // check we can go back first
    if (!ctrl.canGoBack()) {
      return false;
    }

    // Switch this animation around so it looks like we're navigating backwards
    $ionicViewSwitcher.nextDirection('back');

    // Stop it from caching this view as one to return to
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
    });

    // Switch to our new previous state
    $state.go(ctrl.toState, $state.params);
  };

  $scope.state.show = ctrl.canGoBack();

  $scope.$on('$stateChangeStart', function (e, to) {
    $scope.state.show = ctrl.canGoBack(to.name);
  });
};

var BackButtonDirective = function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'MlzBackButtonCtrl',
    template: [
      '<ion-nav-buttons> ',
      '<button class="button back-button mlz-back-button buttons button-clear header-item" ng-if="state.show" ng-click="goBack()">',
      '<i class="icon ion-ios7-arrow-back"></i>',
      '<span class="back-text">',
      '<span class="default-title">Back</span>',
      '</span>',
      '</button>',
      '</ion-nav-buttons>'
    ].join('')
  };
};



angular.module('mlz.backbutton', ['ionic'])
  .controller('BackButtonCtrl', ['$scope', '$log', '$state', '$ionicHistory', '$ionicViewSwitcher', BackButtonCtrl])
  .directive('mlzBackButton', [BackButtonDirective]);

angular.module('mlz.openurl', [])
  .factory('OpenUrlService', ['$log', '$location', '$rootScope', '$ionicHistory', function ($log, $location, $rootScope, $ionicHistory) {

    var openUrl = function (url) {

      $log.debug('Handling open URL ' + url);

      // Stop it from caching the first view as one to return when the app opens
      $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true,
        disableAnimation: true
      });

      if (url) {
        window.location.hash = url.substr(5);
        $rootScope.$broadcast('handleopenurl', url);

        window.cordova.removeDocumentEventHandler('handleopenurl');
        window.cordova.addStickyDocumentEventHandler('handleopenurl');
        document.removeEventListener('handleopenurl', handleOpenUrl);
      }
    };

    var handleOpenUrl = function (e) {
      console.log("event fired handle openurl!");
      openUrl(e.url);
    };

    var onResume = function () {
      document.addEventListener('handleopenurl', handleOpenUrl, false);
    };

    return {
      handleOpenUrl: handleOpenUrl,
      onResume: onResume
    };

  }]).run(['OpenUrlService', function (OpenUrlService) {
  if (OpenUrlService) {
    document.addEventListener('handleopenurl', OpenUrlService.handleOpenUrl, false);
    document.addEventListener('resume', OpenUrlService.onResume, false);
  }
}]);
