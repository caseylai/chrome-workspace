require.config({
    baseUrl: 'js',

    paths: {
        jquery: 'lib/jquery-1.10.2.min',
        angular: 'lib/angular.min'
    },

    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        }
    }
});

require(['jquery',
    'angular',
    'filters/filters',
    'services/services',
    'controllers/WorkspaceController',
    'controllers/BackgroundImageController',
    'controllers/BookmarkController',
    'controllers/TodoController',
    'controllers/PomorodoController',
    'controllers/ButtonListController',
    'directives/DraggableDirective',
    'directives/SettingDirective',
    'directives/FileDirective'], function($, angular) {

        angular.module('newTab', ['controllers', 'directives', 'filters', 'services']);

        $(function() {
            angular.bootstrap(document, ['newTab']);
        });

    });
