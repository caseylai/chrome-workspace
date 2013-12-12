require.config({
    baseUrl: 'js',

    paths: {
        jquery: 'lib/jquery-1.10.2.min',
        angular: 'lib/angular.min',
        xml2json: 'lib/xml2json.min'
    },

    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        },
        xml2json: {
            exports: 'X2JS'
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
    'controllers/NeteaseNewsController',
    'controllers/ButtonListController',
    'controllers/SearchController',
    'directives/DraggableDirective',
    'directives/SettingDirective',
    'directives/FileDirective'], function($, angular) {

        angular.module('newTab', ['controllers', 'directives', 'filters', 'services']);

        $(function() {
            angular.bootstrap(document, ['newTab']);
        });

    });
