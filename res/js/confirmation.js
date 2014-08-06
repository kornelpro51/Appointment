"use strict" /* ========================================================================================================

 Afford A Scan: Angular and client-side functionality for 'reservation-confirmation.html' page
 ==================================================================================================================== */


/* Page services
 ==================================================================================================================== */

// 'reservation-confirmation.html' page services namespace
pav.services.confirmation = {

    // Implementation of search service ('getListing.do')
    GetConfirmationService : pavModule.factory('GetConfirmationService', ['JsonRequestService', function (JsonRequestService) {
        return {
            get : function(parameters) {
                // Prompt search parameters
                console.log('GetReservationConfirmationContent > Searching with parameters:');
                console.log(parameters);
                // Query result
                JsonRequestService.get(
                    // Request relative URL
                    pav.services.relativeUrl + pav.services.booking.getReservationDetails,
                    // Request parameters
                    parameters,
                    // OnSuccess handler
                    function(data) {
                        // Set data
                        console.log('GetReservationConfirmationContent > Got results:');
                        console.log(data);
                        pav.pages.confirmation.model.confirmation.content = data.bookings[0];
                    },
                    // On fail handler
                    function(data) { console.error('GetReservationConfirmationContent > Fail: '); console.log(data); }
                );
            }
        }
    }])

}


/* Controller function providing mappings from AngularJS context
 ==================================================================================================================== */
pav.ng.reservationConfirmationController = pavModule.controller('pav.ng.reservationConfirmationController', ['$scope', '$location', '$route', function($scope, $location, $route) {
    // Map main application namespace
    $scope.PAV = $scope.Pav = $scope.pav = pav;
    // Map page's model
    $scope.model = pav.pages.confirmation.model;
    // Map services
    $scope.services = {
    }
    // Bind location / URL
    $scope.$watch(function() { return JSON.stringify(pav.pages.confirmation.model.location.parameters.params); }, function(path) {
        pav.pages.confirmation.model.location.setPath($location, path);
    });
    $scope.$watch( function() { return $location.path(); }, function(path) {
        pav.pages.confirmation.model.location.getPath($location, path);
    });
}]).controller;


/* Page namepsace
 ==================================================================================================================== */
// Holds 'reservation-confirmation.html' page's data model
pav.pages.confirmation.model = {

    // Location namespace
    location : {

        // Holds current URL path
        path : null,

        // Sets path to model
        setPath : function($location, path) {
            if (pav.pages.confirmation.model.location.parameters.query) {
                // Set path to model
                pav.location.updatePath($location, pav.location.filterQueryParameters(pav.pages.confirmation.model.location.parameters.query, pav.pages.confirmation.allowedParameters), pav.pages.confirmation.model.location.parameters.params);
            }
        },
        // Gets path from model
        getPath : function($location, path) {
            if (!pav.pages.confirmation.model.location.path) {
                // Get path from model
                pav.pages.confirmation.model.location.path = path;
                // Update model from path
                var pathParsed = path.split('/');
                if ((pathParsed.length > 1) && (pathParsed[1].length > 0)) {
                    pav.pages.confirmation.model.location.parameters.query = pav.location.decodeFromList( pathParsed[1] );
                    // Set search strings
                    pav.pages.index.model.search.medServiceSearch = pav.pages.confirmation.model.location.parameters.query.medServicesSearchString;
                    pav.pages.index.model.search.cityZipCodeSearch = pav.pages.confirmation.model.location.parameters.query.cityZipCodeSearchString;
                    // Get search type-ahead
                    if (pav.pages.confirmation.config.showSearchBar) {
                        angular.element(document.body).injector().get('TypeAheadService').medService(pav.pages.index.model.search.medServiceSearch);
                        angular.element(document.body).injector().get('TypeAheadService').cityZipCode(pav.pages.index.model.search.cityZipCodeSearch);
                    }
                    // Get search query
                    pav.pages.index.model.search.validatedParameters = pav.pages.confirmation.model.location.parameters.query;
                    // Get reservation confirmation details
                    if (!pav.pages.confirmation.model.confirmation.content) {
                        angular.element(document.body).injector().get('GetConfirmationService').get(pav.pages.confirmation.model.location.parameters.query);
                    }
                }
                if ((pathParsed.length > 2) && (pathParsed[2].length > 0)) {
                    pav.pages.confirmation.model.location.parameters.params = pav.location.decodeBase64( pathParsed[2] );
                }
            }
        },

        // Location's parameters namespace
        parameters : {
            // Holds query parameters
            query : null,
            // Holds other parameters
            params : null
        }

    },

    // Authentication namespace
    auth : {

        // Logs out user and sends to main page
        logout : function() {

            // Do logout
            pav.auth.authenticate.logout(function() {
                // Return to main page
                pav.location.updateUrl(pav.pages.index.url);
            });
        }

    },

    // Confirmation namespace
    confirmation : {

        // Holds content
        content : null,

        // Returns to 'index.html'
        backToDetails : function() {
            pav.location.updateUrl(pav.pages.index.url);
        },

        // Opens print dialog
        print : function() {
            window.print();
        }

    }

}