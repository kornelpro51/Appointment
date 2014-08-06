"use strict" /*
				 * ========================================================================================================
				 * 
				 * Afford A Scan: Angular and client-side functionality for
				 * 'locappreq.html' page
				 * ====================================================================================================================
				 */
// 'locappreq.html' page services namespace
pav.services.locappreq = {
	GetDetailsService : pavModule.factory('GetDetailsService', [ 'JsonRequestService', function(JsonRequestService) {
		return {
			getContent : function(parameters,url) {
				// Prompt search parameters
				// console.log('GetDetails > Searching with parameters:');
				// Query result
				JsonRequestService.get(url, parameters,
				// OnSuccess handler
				function(data) {
					// Set data
					// console.log('GetDetails > Got results:');
					pav.pages.locappreq.model.details.content = data;
				},
				// On fail handler
				function(data) {
					// console.error('GetDetails > Fail: ');
					// console.log(data);
				});
			},
			findValidLocations : function(parameters) {
				pav.pages.locappreq.model.details.validLocations = [];
				JsonRequestService.get(pav.services.relativeUrl + pav.services.search.getOrgLocationsUrl, parameters,
				// OnSuccess handler
				function(data) {
					// Set data
					// console.log('getValidLocations > Got results:');
					pav.pages.locappreq.model.details.validLocations =  data.data;
					pav.pages.locappreq.model.details.info.locationCountStr = pav.pages.locappreq.model.details.validLocations.length + " locations";
				},
				// On fail handler
				function(data) {
					// console.error('getValidLocations > Fail: ');
					// console.log(data);
				});
			},
			reqAppointment : function (parameters) {
				// console.log('Req App > calling  with parameters:');
				// Query result
				JsonRequestService.get(pav.services.relativeUrl + pav.services.booking.reqAppUrl, parameters,
				// OnSuccess handler
				function(data) {
					// Set data
					if (data.success) {
						// Set validated parameters
						pav.pages.locappreq.model.details.apptreqresult = data;
						//onSuccess(data);
						$( "#request-button" ).prop('disabled', true);
						 $("#success_popup").show();
					} else {
						//onFail(data);
						 $("#error_popup").show();
					}
				},
				// On fail handler
				function(data) {
					// console.error('Req App > Fail: ');
					// console.log(data);
					 $("#error_popup").show();
				});
			}
		};
	} ]),
	TypeAheadService : pavModule.factory('TypeAheadService', [ 'JsonRequestService', function(JsonRequestService) {
		return {
			// Gets type-ahead suggestions for Med Services
			medService : function(query) {
				JsonRequestService.get(pav.services.relativeUrl + pav.services.typeahead.medServiceTypeAheadUrl, {
					query : query
				},
				// OnSuccess handler
				function(data) {
					// Set data
					pav.pages.locappreq.model.search.medServiceResults = data.data;
					// Check if drilled down to single result
					if ((data.data) && (data.data.length == 1)) {
						if (pav.pages.locappreq.model.search.medServiceValidateResults(data.data[0])) {
							pav.pages.locappreq.model.search.medServiceSelectedResult = data.data[0];
						} else {
							pav.pages.locappreq.model.search.medServiceSelectedResult = null;
						}
					} else if ((pav.pages.locappreq.model.search.medServiceSelectedResult) && (pav.pages.locappreq.model.search.medServiceSelectedResult.servDesc != pav.pages.locappreq.model.search.medServiceSearch)) {
						pav.pages.locappreq.model.search.medServiceSelectedResult = null;
					}
					pav.pages.locappreq.model.search.activeIndex = null;
				},
				// On fail handler
				function(data) {
					// console.error('MedService_TypeAhead Fail: ');
					// console.log(data);
				});
			}
		}
	}]),
	
	ImgValidationService : pavModule.factory('ImgValidationService', [ 'JsonRequestService', function(JsonRequestService) {
		return {
			validate : function(onSuccess, onFail) {
				JsonRequestService.get(pav.services.relativeUrl + pav.services.typeahead.searchValidationService, {
					imgService : pav.pages.locappreq.model.search.medServiceSearch,
					cityZipCode : '',
					checkCityZipCode : "false"
				},
				// OnSuccess handler
				function(data) {
					// Check if successfull
					pav.pages.locappreq.model.search.validatedParameters = data;
					if (data.success) {
						// Set validated parameters
						onSuccess(data);
					} else {
						pav.pages.locappreq.model.details.info.locationCountStr = "0 locations";
						onFail(data);
					}
				},
				// On fail handler
				function(data) {
					// console.error('ImgValidationService Fail: ');
					// console.log(data);
					 $("#error_popup").show();
				});
			}
		}
	} ])
}

/*
 * Controller function providing mappings from AngularJS context
 * ====================================================================================================================
 */
pav.ng.locappreqController = pavModule.controller('pav.ng.locappreqController', [ '$scope', 'TypeAheadService', '$location',  function($scope, TypeAheadService,  $location) {
	 //$locationProvider.html5Mode(true);
	// Map main application namespace
	$scope.PAV = $scope.Pav = $scope.pav = pav;
	// Map page's model
	$scope.model = pav.pages.locappreq.model;
	// Map services
	$scope.services = {
		medService : function(forceSearch) {
			// Check search string
			if ((forceSearch != null) || (pav.pages.locappreq.model.search.medServiceSearch)) {
				// Force search string
				if (forceSearch != null)
					pav.pages.locappreq.model.search.medServiceSearch = forceSearch;
				// Get search results
				TypeAheadService.medService((forceSearch != null ? forceSearch : pav.pages.locappreq.model.search.medServiceSearch));
			} else {
				// Clear results for empty search string
				pav.pages.locappreq.model.search.medServiceResults = [];
			}
		}
	},
	// Bind location / URL
/*	$scope.$watch(function() {
		return JSON.stringify(pav.pages.locappreq.model.location.parameters.params);
	}, function(path) {
		pav.pages.locappreq.model.location.setPath($location, path);
	});*/
	$scope.$watch(function() {
		return $location.path();
	}, function(path) {
		pav.pages.locappreq.model.location.getPath($location, path);
	});
	$scope.$watch(pav.pages.locappreq.model.search.medServiceShow, function(oldVal, newVal) {
		if (oldVal != newVal && newVal) {
			$('#' + pav.pages.locappreq.model.search.searchResultContainerId + ' tr').scrollTop(0);
		}
	});
/*	
	$scope.$watch("model.search.medServiceSearch", function() {
		  pav.pages.locappreq.model.search.validateImgServiceTerms(pav.pages.locappreq.model.details.getValidLocations,pav.pages.locappreq.model.search.dummy,true);
	});*/
} ]).controller;

/*
 * Page namepsace
 * ====================================================================================================================
 */
// Holds 'locappreq.html' page's data model
pav.pages.locappreq.model = {
	search : {
		aggregateProperties : function(results) {
			// Reset unique values
			var aggregateResult = {};
			// Check for unique values
			for ( var i in results) {
				// Get each result
				var result = results[i];
				// Check all properties
				for ( var key in result) {
					if ((aggregateResult[key] == null) || (aggregateResult[key] == result[key])) {
						// Keep / Add aggregate result
						aggregateResult[key] = {
							isUnique : true,
							value : result[key]
						};
					} else {
						// Mark property as non-unique
						if (aggregateResult[key] == null) {
							// Set as non-unique property
							aggregateResult[key] = {
								isUnique : false,
								value : [ result[key] ]
							};
						} else if (aggregateResult[key].isUnique == true) {
							// Convert to non-unique property
							aggregateResult[key] = {
								isUnique : false,
								value : [ aggregateResult[key].value, result[key] ]
							};
						} else {
							// Add a non-unique property
							aggregateResult[key].value.push(result[key]);
						}
					}
				}
			}
			// Return aggregate result
			return aggregateResult;
		},

		// Holds Med service search show toggle value
		medServiceShow : false,
		// Resolves weather to show Med services type-ahead
		isMedServiceShow : function() {
			return (pav.pages.locappreq.model.search.medServiceShow && pav.pages.locappreq.model.search.medServiceResults && (pav.pages.locappreq.model.search.medServiceResults.length > 0));
		},
		// Maps to Med service search string value
		medServiceSearch : '',
		// Maps to Med service search results
		medServiceResults : [],
		// Checks if Med service group select notification is shown
		medServiceGroupShowNotification : function() {
			// Check if any of results is group
			var hasGroups = false;
			for ( var i = 0; i < (pav.pages.locappreq.model.search.medServiceResults.length < pav.pages.locappreq.config.medServicesTypeaheadCount ? pav.pages.locappreq.model.search.medServiceResults.length : pav.pages.locappreq.config.medServicesTypeaheadCount); i++) {
				if (!pav.pages.locappreq.model.search.medServiceValidateResults(pav.pages.locappreq.model.search.medServiceResults[i])) {
					hasGroups = true;
					break;
				}
			}
			// Return notification status
			return (pav.pages.locappreq.config.showNotificationForSelectServiceGroup && hasGroups);
		},
		// Checks if Med service select notification is shown
		medServiceShowNotification : function() {
			// Check if any of results is service
			var hasServices = false;
			for ( var i = 0; i < (pav.pages.locappreq.model.search.medServiceResults.length < pav.pages.locappreq.config.medServicesTypeaheadCount ? pav.pages.locappreq.model.search.medServiceResults.length : pav.pages.locappreq.config.medServicesTypeaheadCount); i++) {
				if (pav.pages.locappreq.model.search.medServiceValidateResults(pav.pages.locappreq.model.search.medServiceResults[i])) {
					hasServices = true;
					break;
				}
			}
			// Return notification status
			return (pav.pages.locappreq.config.showNotificationForSelectServiceGroup && hasServices);
		},
		// Validates Med service search results
		medServiceValidateResults : function(result) {
			return ((result.procedureCode != null) && (result.procedureCode.length > 0));
		},
		// Selects a suggested med service
		medServiceSelect : function(result) {
			// Select result
			if ((result) && (pav.pages.locappreq.model.search.medServiceValidateResults(result))) {
				pav.pages.locappreq.model.search.medServiceSelectedResult = result;
				pav.pages.locappreq.model.search.medServiceShow = false;
			} else {
				pav.pages.locappreq.model.search.medServiceSelectedResult = null;
			}
			// Set search term
			pav.pages.locappreq.model.search.medServiceSearch = result.servDesc;
			// Get suggestions
			angular.element(document.body).injector().get('TypeAheadService').medService(pav.pages.locappreq.model.search.medServiceSearch);
		},
		// Holds user selected Med service result
		medServiceSelectedResult : null,

		// Validates type-ahead search terms
		validateTypeAhead : function() {
			return ((pav.pages.locappreq.config.quickValidation) && (pav.pages.locappreq.model.search.medServiceSelectedResult) && (pav.pages.locappreq.model.search.medServiceValidateResults(pav.pages.locappreq.model.search.medServiceSelectedResult)));
		},

		validateImgServiceTerms : function(onSuccess, onFail, clearLocs) {
			// Clear error messages
			if(clearLocs){
				pav.pages.locappreq.model.details.info.selectedLocation = null;
				pav.pages.locappreq.model.details.validLocations = [];
				pav.pages.locappreq.model.details.info.locationCountStr = "";
			}
			pav.pages.locappreq.model.search.clearErrors();
			// Validate on server
			angular.element(document.body).injector().get('ImgValidationService').validate(onSuccess, onFail);
		},
		
		dummy : function(){
			
		},

		// Holds search parameters passed from validation service
		validatedParameters : null,

		// Compiles search parameters
		searchParameters : function(data) {
			// Initialize parameters
			var parameters = {medServicesSearchString : pav.pages.locappreq.model.search.medServiceSearch}
			if (data.data) {
				// Get Med services parameters
				var medServicesParameters = data.data.IMGSERVICE[0];
				for ( var i in medServicesParameters)
					if ((medServicesParameters[i]) && (!angular.isObject(medServicesParameters[i])) && (!angular.isArray(medServicesParameters[i])) && ((!medServicesParameters[i].indexOf) || (medServicesParameters[i].indexOf('/') < 0)))
						parameters[i] = medServicesParameters[i];
			} else {
				// Get all parameters
				for ( var i in data)
					if ((data[i]) && (!angular.isObject(data[i])) && (!angular.isArray(data[i])) && ((!data[i].indexOf) || (data[i].indexOf('/') < 0)))
						parameters[i] = data[i];
			}
			// Return parameters
			return parameters
		},
		// Shows search errors
		showErrors : function(data) {
			pav.pages.locappreq.model.search.medServiceSearchTooltip
			   = (data.data.IMGSERVICE_ERRMSG ? {	content : data.data.IMGSERVICE_ERRMSG,cssclass : 'pav_tooltip_red',position : {my : "left bottom",	at : "left top+4"},	open : true	} : null);
			pav.pages.locappreq.model.search.cityZipCodeSearchTooltip
			   = (data.data.CITYZIPCODE_ERRMSG ? {content : data.data.CITYZIPCODE_ERRMSG,cssclass : 'pav_tooltip_red',	position : {my : "left bottom",	at : "left top+4"},	open : true} : null);
			
			pav.pages.locappreq.model.search.medServiceValidationError = data.data.IMGSERVICE_ERRMSG;
			pav.pages.locappreq.model.search.cityZipCodeValidationError = data.data.CITYZIPCODE_ERRMSG;
		},
		clearErrors : function() {
			// Clear error messages
			// console.log (" Clear error called")
			pav.pages.locappreq.model.search.medServiceSearchTooltip = "";
			pav.pages.locappreq.model.search.medServiceValidationError = "";
			pav.pages.locappreq.model.details.info.reqDateTooltip = "";
			pav.pages.locappreq.model.details.info.reqEmailAddrTooltip =  "";
			pav.pages.locappreq.model.details.info.reqPhoneNumberTooltip = "";
			pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = "";
			pav.pages.locappreq.model.details.info.reqDOBDayTooltip = "";
			pav.pages.locappreq.model.details.info.reqDOBYearTooltip = "";
			pav.pages.locappreq.model.details.info.reqForFirstNameTooltip = "";
			pav.pages.locappreq.model.details.info.reqForLastNameTooltip = "";
			pav.pages.locappreq.model.details.info.selectedLocationTooltip = "";

		},
		// Holds validation error for Med services
		medServiceValidationError : null,
		medResultHoverActivated : true,
		medResultHoverProc : function(idx) {
			if(pav.pages.locappreq.model.search.medResultHoverActivated) { 
				pav.pages.locappreq.model.search.activeIndex = idx; 
			} else { 
				pav.pages.locappreq.model.search.medResultHoverActivated = true; 
			}
		}
	},

	// Location namespace
	location : {
		// Holds current URL path
		path : null,
		//is it an organization or location
		isOrg : false,
		// Sets path to model
		setPath : function($location, path) {
		},
		
		// Gets path from model
		getPath : function($location, path) {
			if (!pav.pages.locappreq.model.location.path) {
				// Get path from model
				var locationIdvalue = $location.search().locationId;
				var progOrgIdvalue = $location.search().provOrgId;
				if(locationIdvalue == null){
					pav.pages.locappreq.model.location.parameters.query = {
							provOrgId:progOrgIdvalue
					}
					pav.pages.locappreq.model.location.isOrg = true;
					var url = pav.services.relativeUrl + pav.services.search.getOrgContentUrl;
					angular.element(document.body).injector().get('GetDetailsService').getContent(pav.pages.locappreq.model.location.parameters.query,url);
				}else{
					pav.pages.locappreq.model.location.parameters.query = {
							locationId:locationIdvalue
					}
					pav.pages.locappreq.model.location.isOrg = false;
					var url = pav.services.relativeUrl + pav.services.search.getLocContentUrl;
					angular.element(document.body).injector().get('GetDetailsService').getContent(pav.pages.locappreq.model.location.parameters.query,url);
				}
			}
		},

		// Location's parameters namespace
		parameters : {
			// Holds query parameters
			query : null,
			// Holds other parameters
			params : {}
		}
	},

	// locappreq namespace
	details : {
		backURL : document.referrer, 
		// Holds content
		content : null,
		//Holds locations for provOrg and selected service
		validLocations : [ ],
		//Hold result of app request
		apptreqresult : null,
		//Holds req app response
		reqAppResponse : null,
		// Holds locappreq error description
		error : 'null',
		// Holds registration info entered by user
		info : {
			procCode : null,
			procConDesc : null,
			requirements : true,
			reqEmailAddr : null,
			reqPhoneNumber : null,
			reqPhoneExtn: null,
			reqDate : null,
			reqFor : pav.pages.locappreq.config.reservationHolders[0],
			reqForFirstName : null,
			reqForLastName : null,
			msgToLoc : null,
			referDoc : null,
			reqDOBMonth : null,
			reqDOBDay  : null,
			reqDOBYear  : null,
			referDocEmail : null,
			reqDateTooltip : null,
			reqEmailAddrTooltip  : null,
			reqPhoneNumberTooltip  : null,
			reqDOBMonthTooltip  : null,
			reqDOBDayTooltip  : null,
			reqDOBYearTooltip  : null,
			reqForFirstNameTooltip  : null,
			reqForLastNameTooltip  : null,
			requester : pav.pages.locappreq.config.requesters[0],
			selectedLocation : null,
			reqDateDisplay : null,
			selectedLocationAddr : null,
			locationCountStr : null,
		},

		// Validates locappreq info
		validate : function(forceValidation) {
		   // var dateTypeVar = $( "#reqDate" ).datepicker('getDate');
			 //pav.pages.locappreq.model.details.info.reqDate = $.datepicker.formatDate('yy-mm-dd', dateTypeVar);
			 
			// Check if quick validation
			/*if ((!forceValidation) && (!pav.pages.locappreq.config.quickValidation))
				return true;*/
			
			if (forceValidation) {
				var success = true;
				var reqDateVal = $( "#reqDate" ).val();
				if(reqDateVal == null || reqDateVal == ''){
					pav.pages.locappreq.model.details.info.reqDateTooltip = {content : 'Date required!',position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
					success = false;
				}else if(moment(reqDateVal, 'MM/DD/YYYY', true).isValid()){
					var enteredDate = moment(reqDateVal, 'MM-DD-YYYY', true).toDate();
					var month = enteredDate.getMonth() + 1 ;
					var today = new Date();
					today.setHours(0);
					today.setMinutes(0);
					today.setSeconds(0);
					today.setMilliseconds(0);
					if(enteredDate < today){
						pav.pages.locappreq.model.details.info.reqDateTooltip = {content : 'Select date from today onwards (MM/DD/YYYY)',position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
						success = false;	
					}else{
						//pav.pages.locappreq.model.details.info.reqDate =  enteredDate.getFullYear() + "-" +  month + "-" + enteredDate.getDate();
						pav.pages.locappreq.model.details.info.reqDateDisplay = $.datepicker.formatDate('DD, d MM, yy', enteredDate);
						pav.pages.locappreq.model.details.info.reqDate = $.datepicker.formatDate('yy-mm-dd', enteredDate);
					}
				}else{
					pav.pages.locappreq.model.details.info.reqDateTooltip = {content : 'Enter Valid Date (MM/DD/YYYY)',position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
					success = false;
				}
				if(pav.pages.locappreq.model.details.info.reqEmailAddr != null && pav.pages.locappreq.model.details.info.reqEmailAddr != ""){
					if(pav.validation.ifEmail(pav.pages.locappreq.model.details.info.reqEmailAddr) == false){
						pav.pages.locappreq.model.details.info.reqEmailAddrTooltip = {content: 'Not a well formed email address', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
						success = false;
					}
				}
				if(pav.pages.locappreq.model.details.info.reqPhoneNumber == null){
					pav.pages.locappreq.model.details.info.reqPhoneNumberTooltip = {content: 'Phone Number Needed!', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
					success = false;
				}else if(pav.validation.ifPhoneNo(pav.pages.locappreq.model.details.info.reqPhoneNumber) == false){
					pav.pages.locappreq.model.details.info.reqPhoneNumberTooltip = {content: 'Enter 10-digit phone number in xxx-xxx-xxxx format', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
					success = false;
				}else{
					pav.pages.locappreq.model.details.info.reqPhoneNumber = pav.validation.formatPhoneNo(pav.pages.locappreq.model.details.info.reqPhoneNumber);
				}
				
				

				if(pav.pages.locappreq.model.details.info.reqFor == null){
					pav.pages.locappreq.model.details.info.reqForTooltip ={content : 'Please select one of the options!',	position :{my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
					success = false;
				}
				
				if(pav.pages.locappreq.model.details.info.reqForFirstName == null || pav.pages.locappreq.model.details.info.reqForFirstName == ""){
					pav.pages.locappreq.model.details.info.reqForFirstNameTooltip = {content : 'First Name Needed!',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
					success = false;
				}
			
				if(pav.pages.locappreq.model.details.info.reqForLastName == null || pav.pages.locappreq.model.details.info.reqForLastName == ""){
					pav.pages.locappreq.model.details.info.reqForLastNameTooltip = {content : 'Last Name Needed!',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
					success = false;
				}
				pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = null;
			/*	if((pav.pages.locappreq.model.details.info.reqDOBDay == null ||  pav.pages.locappreq.model.details.info.reqDOBDay  == "") 
						&& (pav.pages.locappreq.model.details.info.reqDOBMonth == null ||  pav.pages.locappreq.model.details.info.reqDOBMonth  == "")
						&& (pav.pages.locappreq.model.details.info.reqDOBYear == null ||  pav.pages.locappreq.model.details.info.reqDOBYear  == "")){
					// Do nothing
				}else */if((pav.pages.locappreq.model.details.info.reqDOBMonth != null ||  pav.pages.locappreq.model.details.info.reqDOBMonth  != "") 
						&& ( (pav.pages.locappreq.model.details.info.reqDOBDay == null ||  pav.pages.locappreq.model.details.info.reqDOBDay  == "")
						|| ( pav.pages.locappreq.model.details.info.reqDOBYear == null ||  pav.pages.locappreq.model.details.info.reqDOBYear  == ""))){
						pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = {content : 'Month,Day,Year Needed ',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
						success = false;
				}else if((pav.pages.locappreq.model.details.info.reqDOBDay != null ||  pav.pages.locappreq.model.details.info.reqDOBDay  != "") 
						&& ( (pav.pages.locappreq.model.details.info.reqDOBMonth == null ||  pav.pages.locappreq.model.details.info.reqDOBMonth  == "")
						|| ( pav.pages.locappreq.model.details.info.reqDOBYear == null ||  pav.pages.locappreq.model.details.info.reqDOBYear  == ""))){
						pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = {content : 'Month,Day,Year Needed ',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
						success = false;
				}else if((pav.pages.locappreq.model.details.info.reqDOBYear != null ||  pav.pages.locappreq.model.details.info.reqDOBYear  != "") 
						&& ( (pav.pages.locappreq.model.details.info.reqDOBDay == null ||  pav.pages.locappreq.model.details.info.reqDOBDay  == "")
						|| ( pav.pages.locappreq.model.details.info.reqDOBMonth == null ||  pav.pages.locappreq.model.details.info.reqDOBMonth  == ""))){
						pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = {content : 'Month,Day,Year Needed ',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
						success = false;
				}
				if(success && pav.pages.locappreq.model.details.info.reqDOBDay != null){
					
					//Month Check
					if(pav.pages.locappreq.model.details.info.reqDOBMonth.length > 2){
						pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = {content : 'Month (1 to 12)',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
						success = false;
					}else{
						pav.pages.locappreq.model.details.info.reqDOBMonth = pav.pages.locappreq.model.details.info.reqDOBMonth.replace(/[^0-9]/g, "");
						if(pav.pages.locappreq.model.details.info.reqDOBMonth < 1 || pav.pages.locappreq.model.details.info.reqDOBMonth > 12){
							pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = {content : 'Month (1 to 12)',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
							success = false;
						}
					}
					//Day Check
					if(pav.pages.locappreq.model.details.info.reqDOBDay.length > 2){
							pav.pages.locappreq.model.details.info.reqDOBDayTooltip = {content : 'Day (1 to 31)',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
							success = false;
					}else{
						pav.pages.locappreq.model.details.info.reqDOBDay = pav.pages.locappreq.model.details.info.reqDOBDay.replace(/[^0-9]/g, "");
						if(pav.pages.locappreq.model.details.info.reqDOBDay < 1 || pav.pages.locappreq.model.details.info.reqDOBDay > 31){
							pav.pages.locappreq.model.details.info.reqDOBDayTooltip = {content : 'Day (1 to 31)',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
							success = false;
						}
					}
						
					if(pav.pages.locappreq.model.details.info.reqDOBYear.length != 4){
							pav.pages.locappreq.model.details.info.reqDOBYearTooltip = {content : 'Year (YYYY)',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
							success = false;
					}else{	
						pav.pages.locappreq.model.details.info.reqDOBYear = pav.pages.locappreq.model.details.info.reqDOBYear.replace(/[^0-9]/g, "");
						if(pav.pages.locappreq.model.details.info.reqDOBYear < 1900){
							pav.pages.locappreq.model.details.info.reqDOBYearTooltip = {content : 'Not a valid year',	position : {my : "right bottom",at : "right top+12"},cssclass : 'pav_tooltip_red',	open : true	};
							success = false;
						}
					}
				}
				
				if(pav.pages.locappreq.model.details.info.referDocEmail != null && pav.pages.locappreq.model.details.info.referDocEmail != ""){
					if(pav.validation.ifEmail(pav.pages.locappreq.model.details.info.referDocEmail) == false){
						pav.pages.locappreq.model.details.info.referDocEmailTooltip = {content: 'Not a well formed email address', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
						success = false;
					}
				}
				
				if(pav.pages.locappreq.model.details.info.msgToLoc != null && pav.pages.locappreq.model.details.info.msgToLoc != ""){
					if(pav.pages.locappreq.model.details.info.msgToLoc.length > 256){
						pav.pages.locappreq.model.details.info.msgToLocTooltip = {content: ' Max 256 characters allowed', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
						success = false;
					}
				}
				if(pav.pages.locappreq.model.location.isOrg){
					//Check for selected location
					if(pav.pages.locappreq.model.details.info.selectedLocation == null || pav.pages.locappreq.model.details.info.selectedLocation == ""){
						pav.pages.locappreq.model.details.info.selectedLocationTooltip = {content: ' Please select a Location', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
						success = false;
					}
				}

			}
			// Validate
			return success; 
		},

		checkError : function(){
			pav.pages.locappreq.model.search.showErrors(pav.pages.locappreq.model.search.validatedParameters);
/*			if(pav.pages.locappreq.model.details.validLocations.length < 1){
				//pav.pages.locappreq.model.details.info.selectedLocationTooltip =  {content: ' No location offer this service', cssclass: 'pav_tooltip_red', position: { my: "right bottom", at: "right top+12" }, open: true};
				pav.pages.locappreq.model.details.info.locationCountStr = "0 locations";
			}
*/		},
		
		// Returns to previous page
		backToReferrer : function() {
			if(document.referrer){
				//// console.log ('referra is ' + document.referrer);
				window.location.replace(document.referrer);
			}else{
				window.location.replace('http://' + pav.pages.locappreq.model.details.content.referralURL);
			}
			
		},
		// Returns to previous page
		getValidLocations : function() {
			if(pav.pages.locappreq.model.location.isOrg){
				//reset the selected location
			pav.pages.locappreq.model.details.info.selectedLocation = null;
			pav.pages.locappreq.model.details.info.selectedLocationTooltip = "";
			 var parameters = {
					procCode : pav.pages.locappreq.model.search.validatedParameters.data.IMGSERVICE[0].procedureCode,
					medServiceId : pav.pages.locappreq.model.search.validatedParameters.data.IMGSERVICE[0].medServiceId
				};
				var query = pav.pages.locappreq.model.location.parameters.query;
				for ( var i in query)
					if ((query[i]) && (!angular.isObject(query[i])) && (!angular.isArray(query[i])) && ((!query[i].indexOf) || (query[i].indexOf('/') < 0)))
						parameters[i] = query[i];
				angular.element(document.body).injector().get('GetDetailsService').findValidLocations(parameters);
			}
		},
		
		getLocDisStr : function(location,noLocName) {
			var disStr = "";
			if(location.addrLine2 != null){
				if(noLocName) disStr =  location.addrLine1 + ", " + location.addrLine2 + " " + location.city + "," + location.state ;
				else disStr = location.locBusName + " [" + location.addrLine1 + ", " + location.addrLine2 + " " + location.city + "," + location.state + "]";   
			}else{
				if(noLocName) disStr =  location.addrLine1 + " " + location.city + "," + location.state ; 
				else disStr = location.locBusName + " [" + location.addrLine1 +  " " + location.city + "," + location.state + "]";
			}
			return disStr;
		},
		
		getContentAddressStr : function(content) {
			var disStr = "";
			if(content.addrLine2 != null){
				 disStr =  content.addrLine1 + ", " + content.addrLine2 + " " + content.city + "," + content.state ;
			}else{
				 disStr =  content.addrLine1 + " " + content.city + "," + location.state ; 
			}
			return disStr;
		},
		
		closePopup : function() {
             // Close popup
			$( "#reqDate" ).val("");
			pav.pages.locappreq.model.search.medServiceSearch = null;
			pav.pages.locappreq.model.search.medServiceSelectedResult = null;
			pav.pages.locappreq.model.search.medServiceResults = null;
			pav.pages.locappreq.model.search.validatedParameters = null;
			pav.pages.locappreq.model.details.info.procCode = null;
			pav.pages.locappreq.model.details.info.procConDesc= null;
			pav.pages.locappreq.model.details.info.requirements = null;
			pav.pages.locappreq.model.details.info.reqEmailAddr = null;
			pav.pages.locappreq.model.details.info.reqPhoneNumber = null;
			pav.pages.locappreq.model.details.info.reqPhoneExtn= null;
			pav.pages.locappreq.model.details.info.reqDate = null;
			pav.pages.locappreq.model.details.info.reqFor = pav.pages.locappreq.config.reservationHolders[0];
			pav.pages.locappreq.model.details.info.reqForFirstName = null;
			pav.pages.locappreq.model.details.info.reqForLastName = null;
			pav.pages.locappreq.model.details.info.msgToLoc = null;
			pav.pages.locappreq.model.details.info.referDoc = null;
			pav.pages.locappreq.model.details.info.reqDOBMonth = null;
			pav.pages.locappreq.model.details.info.reqDOBDay  = null;
			pav.pages.locappreq.model.details.info.reqDOBYear  = null;
			pav.pages.locappreq.model.details.info.referDocEmail = null;
			pav.pages.locappreq.model.details.info.reqPhoneNumberTooltip = null;
			pav.pages.locappreq.model.details.info.reqDOBMonthTooltip = null;
			pav.pages.locappreq.model.details.info.reqDOBDayTooltip = null;
			pav.pages.locappreq.model.details.info.reqDOBYearTooltip = null;
			pav.pages.locappreq.model.details.info.selectedLocation = null;
			pav.pages.locappreq.model.details.validLocations = [];
			pav.pages.locappreq.model.details.info.locationCountStr = "";
			pav.pages.locappreq.model.details.info.requester = pav.pages.locappreq.config.requesters[0];
             $("#success_popup").hide();
             $("#error_popup").hide();
             $("#request-button" ).prop('disabled', false);
         },
		
		reqLocAppointment : function(data) {
				 // Validate req app info
	            if (pav.pages.locappreq.model.details.validate(true)) {
	                // Compose reservation parameters
	            	if(pav.pages.locappreq.model.location.isOrg){
	            		pav.pages.locappreq.model.details.info.selectedLocationAddr = pav.pages.locappreq.model.details.getLocDisStr(pav.pages.locappreq.model.details.info.selectedLocation,true);
		                var parameters = {
			                    reqFor : pav.pages.locappreq.model.details.info.reqFor.value,
			                    requester : pav.pages.locappreq.model.details.info.requester.value,
			                    procCode : pav.pages.locappreq.model.search.validatedParameters.data.IMGSERVICE[0].procedureCode,
			                    procConDesc : pav.pages.locappreq.model.search.validatedParameters.data.IMGSERVICE[0].servDesc,
			                    locationId : pav.pages.locappreq.model.details.info.selectedLocation.locationId
			                };
	            	}else{
	            		pav.pages.locappreq.model.details.info.selectedLocationAddr = pav.pages.locappreq.model.details.getContentAddressStr( pav.pages.locappreq.model.details.content);
		                var parameters = {
			                    reqFor : pav.pages.locappreq.model.details.info.reqFor.value,
			                    requester : pav.pages.locappreq.model.details.info.requester.value,
			                    procCode : pav.pages.locappreq.model.search.validatedParameters.data.IMGSERVICE[0].procedureCode,
			                    procConDesc : pav.pages.locappreq.model.search.validatedParameters.data.IMGSERVICE[0].servDesc
			                };
	            	}
	                var query = pav.pages.locappreq.model.location.parameters.query;
	                for (var i in query) if ((query[i]) && (!angular.isObject(query[i])) && (!angular.isArray(query[i])) && ((!query[i].indexOf) || (query[i].indexOf('/') < 0))) parameters[i] = query[i];
/*	                var content = pav.pages.locappreq.model.details.content;
	                for (var i in content) if ((content[i]) && (!angular.isObject(content[i])) && (!angular.isArray(content[i])) && ((!content[i].indexOf) || (content[i].indexOf('/') < 0))) parameters[i] = content[i];
*/	                var info = pav.pages.locappreq.model.details.info;
	                for (var i in info) if ((info[i]) && (!angular.isObject(info[i])) && (!angular.isArray(info[i])) && ((!info[i].indexOf) || (info[i].indexOf('/') < 0))) parameters[i] = info[i];
	                // Get reservation
	                angular.element(document.body).injector().get('GetDetailsService').reqAppointment(parameters);
	            }
	        }
	},

	// Tabs manipulations namespace
	tabs : {

		// Holds id of currently selected tab
		currentTab : null,

		// Selects tab by id
		select : function(id) {
			// Initialize tabs if not initialized
			$("#tabs").tabs();
			// Set currently selected tab and view
			pav.pages.locappreq.model.tabs.currentTab = id;
			// Update location
			if (!pav.pages.locappreq.model.location.parameters.params)
				pav.pages.locappreq.model.location.parameters.params = {};
			pav.pages.locappreq.model.location.parameters.params.currentTab = id;
			// Select tab by id
			$("#tabs").tabs("option", "active", $('#tabs a[href="#' + id + '"]').parent().index());
			// Check if maps tab
			if (id == 'map_tab') {
				pav.pages.locappreq.model.googleMaps.initialize();
			}
		}

	},

	// GoogleMaps namespace
	googleMaps : {

		// Holds reference to the GoogleMaps map object
		map : null,

		// Initializes GoogleMaps API
		initialize : function() {
			if (pav.pages.locappreq.model.googleMaps.map == null) {
				// Instantiate GoogleMaps map object
				google.maps.visualRefresh = true;
				pav.pages.locappreq.model.googleMaps.map = new google.maps.Map(document.getElementById('map-canvas'), {
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});
				// Update results to map
				setTimeout(function() {
					pav.pages.locappreq.model.googleMaps.update();
				}, 200);
			}
			// Check size
			if (pav.pages.locappreq.model.googleMaps.map) {
				google.maps.event.trigger(pav.pages.locappreq.model.googleMaps.map, "resize");
				pav.pages.locappreq.model.googleMaps.center();
			}
		},

		// Updates results to map
		update : function() {
			if (pav.pages.locappreq.model.googleMaps.map != null) {
				// Create marker
				var latlng = new google.maps.LatLng(pav.pages.locappreq.model.location.parameters.query.latitude, pav.pages.locappreq.model.location.parameters.query.longitude);
				var marker = new google.maps.Marker({
					position : latlng,
					map : pav.pages.locappreq.model.googleMaps.map
				});
				pav.pages.locappreq.model.googleMaps.marker = marker;
				// Add info window
				var infoWindowTemplate = $('#google_maps_info');
				if (infoWindowTemplate.length > 0) {
					infoWindowTemplate = infoWindowTemplate[0];
					marker._resultInfoWindow = new google.maps.InfoWindow({
						content : infoWindowTemplate.innerHTML
					});
					google.maps.event.addListener(marker, 'click', function() {
						// Show info window
						this._resultInfoWindow.open(pav.pages.locappreq.model.googleMaps.map, this);
					});
				}
				// Center on all markers
				pav.pages.locappreq.model.googleMaps.center();
			}
		},

		// Holds reference to marker on the map
		marker : {},

		// Centers on result (if index passed) or all results
		center : function() {
			// Pan to marker
			if ((pav.pages.locappreq.model.googleMaps.marker) && (pav.pages.locappreq.model.googleMaps.marker.getPosition)) {
				pav.pages.locappreq.model.googleMaps.map.panTo(pav.pages.locappreq.model.googleMaps.marker.getPosition());
			}
			// Zoom to marker
			pav.pages.locappreq.model.googleMaps.map.setZoom(14);
		}

	}

}

/*
 * Initialization functionalities - fired on load
 * ====================================================================================================================
 */
pavModule.run([ function() {
	// Initialize jQuery Tabs UI
	$("#tabs").tabs();
} ]);