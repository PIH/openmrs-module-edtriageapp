'use strict';

// // Declare app level module which depends on views, and components
angular.module('edTriageApp', [
    'pascalprecht.translate',
    'filters',
    'constants',
    'edTriagePatientController',
    'edTriageService'
]).config(function ($translateProvider) {
    var path = '/' + OPENMRS_CONTEXT_PATH + '/module/uicommons/messages/messages.json';
    console.log("Loading translations from - " + path) ;
    $translateProvider
        .useUrlLoader('/' + OPENMRS_CONTEXT_PATH + '/module/uicommons/messages/messages.json')
        .useSanitizeValueStrategy('escape');  // TODO is this the correct one to use http://angular-translate.github.io/docs/#/guide/19_security
});