'use strict';

// // Declare app level module which depends on views, and components
angular.module('edTriageApp', [
    'filters',
    'session',
    'edTriagePatientFactory',
    'edTriageConceptFactory',
    'edTriageViewQueueController',
    'edTriagePatientController',
    'edTriageDataService'
]);
