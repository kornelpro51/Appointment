"use strict" /* ========================================================================================================

    Afford A Scan: Angular and client-side functionality Bootstrapping script
 ==================================================================================================================== */


/* Main angular module
 ==================================================================================================================== */
var pavModule = angular.module('pav', [ ]);


/* Main application namespace
 ==================================================================================================================== */

var pav = {

    /* Angular components namespace
     ================================================================================================================ */
    ng : {

        // Generic controller function providing access to pav namespace from AngularJS context
        controller : pavModule.controller('pav.ng.controller', function($scope) {
            // Map main application namespace
            $scope.PAV = $scope.Pav = $scope.pav = pav;
        }).controller,

        // Generic purpose angular custom directives
        directives : {

            // Scrollpane - Executes start and stop actions on scroll-bar click start and end
            scrollPane : pavModule.directive('pavScrollpane', ['$timeout', function($timeout) {
                return function(scope, element, attr) {
                    $(element).on('mousedown', function(e) {
                        // Check action
                        if (attr['pavScrollpaneScrollStart']) scope.$eval(attr['pavScrollpaneScrollStart']);
                    });
                    $(element).on('mouseout', function(e) {
                        // Check action
                        if (attr['pavScrollpaneScrollStop']) scope.$eval(attr['pavScrollpaneScrollStop']);
                    });
                }
            }]),
            // Scrollpane content - Stops propagation of mousedown/mouseup event - allows scroll pane to detect scroll-bar click events
            scrollPaneContent : pavModule.directive('pavScrollpaneContent', [function() {
                return function(scope, element, attr) {
                    $(element).on('mousedown', function(e) {
                        e.stopPropagation();
                        e.cancelBubble = true;
                    });
                }
            }]),

            // 'pav-blur' directive: implements onBlur functionality
            focus : pavModule.directive('pavFocus', ['$parse', function($parse) {
                return function(scope, element, attr) {
                    var fn = $parse(attr['pavFocus']);
                    element.bind('focus', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                }
            }]),
            // 'pav-refocus' directive: focuses on element (by passed id)
            refocus : pavModule.directive('pavRefocus', ['$parse', '$timeout', function($parse, $timeout) {
                return function(scope, element, attr) {
                    $(element).on('mousedown', function(e) {
                        $timeout(function() {
                            if ($parse(attr.pavRefocus)(scope)) angular.element('#' + $parse(attr.pavRefocusId)(scope))[0].focus();
                        }, 200);
                    });
                }
            }]),
            // Holds toggle value signifying non focusable control clicked
            skipNextBlur : false,
            // 'pav-focus' directive: implements onFocus functionality
            blur : pavModule.directive('pavBlur', ['$parse', function($parse) {
                return function(scope, element, attr) {
                    var fn = $parse(attr['pavBlur']);
                    element.bind('blur', function(event) {
                        if ((!attr['pavBlurCondition']) || (scope.$eval(attr['pavBlurCondition']))) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });

                        }
                    });
                }
            }]),
			searchResultId :  pavModule.directive('pavSearchResultId', ['$parse', function($parse) {
				return function(scope, element, attr) {
					pav.pages.locappreq.model.search.searchResultContainerId = $parse(attr['pavKeypress'])(scope);
				};
			}]),
        	keypress :  pavModule.directive('pavKeypress', ['$parse', function($parse) {
                return function(scope, element, attr) {
                    var fn = $parse(attr['pavKeypress']);
                    element.bind('keydown', function(event) {
						if (pav.pages.locappreq.model.search.medServiceShow) {
							var scrollingTarget = null;
							var scrollPane = $('#' + $parse(attr.pavSearchResultId)(scope));
							if(event.keyCode == 38) {
								if(typeof pav.pages.locappreq.model.search.activeIndex == 'undefined' || pav.pages.locappreq.model.search.activeIndex == null) {
									scope.$apply(function() {
										pav.pages.locappreq.model.search.activeIndex = 0;
									});
								} else {
									scope.$apply(function() {
										if(pav.pages.locappreq.model.search.activeIndex > 0) {
											pav.pages.locappreq.model.search.activeIndex--;
										}
									});
								}
								scrollingTarget = $('#' + $parse(attr.pavSearchResultId)(scope) + ' tr').eq(pav.pages.locappreq.model.search.activeIndex);
							} else if(event.keyCode == 40) {
								if(typeof pav.pages.locappreq.model.search.activeIndex == 'undefined' || pav.pages.locappreq.model.search.activeIndex == null) {
									scope.$apply(function() {
										pav.pages.locappreq.model.search.activeIndex = 0;
									});
								} else {
									scope.$apply(function() {
										if( pav.pages.locappreq.model.search.activeIndex < pav.pages.locappreq.model.search.medServiceResults.length - 1 &&
											pav.pages.locappreq.model.search.activeIndex < pav.pages.index.config.medServicesTypeaheadCount - 1) {
											pav.pages.locappreq.model.search.activeIndex++;
										}
									});
								}
								scrollingTarget = $('#' + $parse(attr.pavSearchResultId)(scope) + ' tr').eq(pav.pages.locappreq.model.search.activeIndex);
							} else if (event.keyCode == 13) {
								if (pav.pages.locappreq.model.search.activeIndex != 'undefined' && pav.pages.locappreq.model.search.activeIndex != null  && pav.pages.locappreq.model.search.activeIndex >=0 && pav.pages.locappreq.model.search.activeIndex < pav.pages.locappreq.model.search.medServiceResults.length - 1)
								{
									if (event.preventDefault) {
										event.preventDefault();
									} else {
										event.returnValue = false;
									}
									if (event.stopPropagation) {
										event.stopPropagation();   // W3C model
									} 
									event.cancelBubble = true; // IE model
									scope.$apply(function() {
										pav.pages.locappreq.model.search.medServiceSelect(pav.pages.locappreq.model.search.medServiceResults[pav.pages.locappreq.model.search.activeIndex]);
										/*if(pav.pages.locappreq.model.search.medServiceValidateResults(pav.pages.locappreq.model.search.medServiceResults[pav.pages.locappreq.model.search.activeIndex])){
											pav.pages.locappreq.model.search.medServiceShow = false;	
										}*/
										scrollPane.scrollTop(0);
									});

								}
							}
							if (scrollingTarget)
							{
								scope.$apply(function() {
									fn(scope, {$event:event});
								});
								var scrollY = scrollPane.scrollTop() + scrollingTarget.offset().top - scrollPane.offset().top;
								if(scrollingTarget.offset().top - scrollPane.offset().top < 0 ) {
									scrollPane.scrollTop(scrollY);
								} else if (scrollingTarget.offset().top > scrollPane.offset().top + scrollPane.height() - scrollingTarget.height()){
									scrollPane.scrollTop( scrollPane.scrollTop() + scrollingTarget.height());
								}
							}
                        }
                    });
                }
            }]),
/*            keypress :  pavModule.directive('pavKeypress', ['$parse', function($parse) {
                return function(scope, element, attr) {
                    var fn = $parse(attr['pavKeypress']);
                    element.bind('keydown', function(event) {
                    	
						if ((!attr['pavBlurCondition']) || (scope.$eval(attr['pavBlurCondition']))) {
							if(event.keyCode == 38) {
								if(typeof pav.pages.locappreq.model.search.activeIndex == 'undefined' || pav.pages.locappreq.model.search.activeIndex == null) {
									scope.$apply(function() {
										pav.pages.locappreq.model.search.activeIndex = 0;
									});
								} else {
									scope.$apply(function() {
										if(pav.pages.locappreq.model.search.activeIndex > 0) {
											pav.pages.locappreq.model.search.activeIndex--;
										}
									});
								}
							} else if(event.keyCode == 40) {
								if(typeof pav.pages.locappreq.model.search.activeIndex == 'undefined' || pav.pages.locappreq.model.search.activeIndex == null) {
									scope.$apply(function() {
										pav.pages.locappreq.model.search.activeIndex = 0;
									});
								} else {
									scope.$apply(function() {
										if( pav.pages.locappreq.model.search.activeIndex < pav.pages.locappreq.model.search.medServiceResults.length) {
											pav.pages.locappreq.model.search.activeIndex++;
										}
									});
								}
							} else if (event.keyCode == 13) {
								if (event.preventDefault) {
		                    		event.preventDefault();
		                    	} else {
		                    		event.returnValue = false;
		                    	}
								if (event.stopPropagation) {
								      event.stopPropagation();   // W3C model
								 } 
								 event.cancelBubble = true; // IE model
								scope.$apply(function() {
									pav.pages.locappreq.model.search.medServiceSelect(pav.pages.locappreq.model.search.medServiceResults[pav.pages.locappreq.model.search.activeIndex]);
									if(pav.pages.locappreq.model.search.medServiceValidateResults(pav.pages.locappreq.model.search.medServiceResults[pav.pages.locappreq.model.search.activeIndex])){
										pav.pages.locappreq.model.search.medServiceShow = false;	
									}
								});
							}
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        }						
						if ((!attr['pavBlurCondition']) || (scope.$eval(attr['pavBlurCondition']))) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        }
                    });
                }
            }]),
*/
            
   /*             pavUpdateSelectbox : pavModule.directive("pavUpdateSelectbox", ['$parse', function($parse) {
                return function(scope, element, attr) {
                    // parse ngOptions just like ngOptions would
                    scope.$watch(function() { return element[0].innerHTML }, function(newVal) {
                        // Find selected option
                        var selectOptionValue = 0;
                        for (var index in element[0].options) {
                            if (element[0].options[index].selected) selectOptionValue = element[0].options[index].value;
                        }
                        $(element).selectbox("detach").val(selectOptionValue).selectbox("attach");
                    });
                };
            }]),*/
            
            // 'pav-update-selectbox' directive: updates jQuery Selectbox control when ng-options DOM is updated
              pavUpdateSelectbox : pavModule.directive("pavUpdateSelectbox", ['$parse', function($parse) {
                return function(scope, element, attr) {
                    // parse ngOptions just like ngOptions would
                    scope.$watch(function() { return element[0].innerHTML }, function(newVal) {
						element[0].parentNode.insertBefore(element[0], element[0]);
                    });
                };
            }]),
            
            ieSelectFix: pavModule.directive('ieSelectFix', [
				function() {
		 
					return {
						restrict: 'A',
						require: 'ngModel',
						link: function(scope, element, attributes, ngModelCtrl) {
							var isIE = document.attachEvent;
							if (!isIE) return;
							
							var control = element[0];
							//to fix IE8 issue with parent and detail controller, we need to depend on the parent controller
							scope.$watch(attributes.ieSelectFix, function() {
								//this will add and remove the options to trigger the rendering in IE8
								var option = document.createElement("option");
								control.add(option,null);
								control.remove(control.options.length-1);
							});
						}
					}
				}
			]),
            
            // 'pax-tooltip' directive: places tooltip functionality on DOM element
           pavTooltip : pavModule.directive("pavTooltip", ['$parse', '$timeout', function($parse, $timeout) {
                return function(scope, element, attr) {
                    // Get tooltip configuration
                    var validationAttr = $parse(attr.pavTooltip);
                    // Monitor tooltip configuration
                    scope.$watch(function() { return validationAttr(scope); }, function(newVal) {
                        // Get tooltip formatting
                        var tooltipConfig = newVal;
                        if (tooltipConfig) {
                            // Show tooltip
                            element.hasTooltip = true;
                            element[0].title = ((tooltipConfig && tooltipConfig.content) ? tooltipConfig.content : 'Default tooltip content!');
                            element.tooltip();
                            if (tooltipConfig.content) element.tooltip('option', 'content', tooltipConfig.content);
                            if (tooltipConfig.show) {
                                element.tooltip('option', 'show', tooltipConfig.show);
                            } else {
                                element.tooltip('option', 'show', true);
                            }
                            if (tooltipConfig.cssclass) element.tooltip('option', 'tooltipClass', tooltipConfig.cssclass);
                            if (tooltipConfig.position) {
                                element.tooltip('option', 'position', tooltipConfig.position);
                            } else {
                                element.tooltip('option', 'position', { my: "right top", at: "right bottom-4" });
                            }
                            if (tooltipConfig.open) $timeout(function() {
                                // Open tooltip
                                element.tooltip('open');
                                // Set input style
                                element.addClass('invalidated');
                                // Add click listener
                                document.body.addEventListener('click', function() {
                                    // Disable tooltip
                                    element.tooltip('disable');
                                    // Remove input style
                                    element.removeClass('invalidated');
                                })
                            }, 500);
                        } else if (element.hasTooltip) {
                            // Remove tooltip
                            element.hasTooltip = false;
                            element[0].title = null;
                            element.tooltip('destroy');
                            // Remove input style
                            element.removeClass('invalidated');
                        }
                    })
                };
            }])

        }

    },

    // Location (URL manipulation) namespace
    location : {

        // Holds reference to $location object
        $location : null,

        // Toggle value for allowing location change
        allowLocationChange : null,

        // Folters query parameters by list of allowed parameters
        filterQueryParameters : function(query, filter) {
            var filteredQuery = { };
            for (var key in query) {
                for (var i in filter) {
                    if (key == filter[i]) {
                        filteredQuery[key] = query[key];
                        break;
                    }
                }
            }
            return filteredQuery;
        },

        // Sets new location path
        updatePath : function($location, query, state) {
            /*var path = pav.location.encodeToList(query) + '/' + pav.location.encodeBase64(state);
            if ($location.path() != path) {
                // Compose URL
                var url = window.location.origin + window.location.pathname + '#/' + path;
                // Allow path change
                pav.location.allowLocationChange = url;
                // console.log('> updatePath URL > ' + pav.location.allowLocationChange);
                // Update path
                $location.path(path).replace();
            }*/
        },
        // Sets new location path
        updateUrl : function(url, query) {
          /*  console.clear();
            // Compose url
            var hash = pav.location.encodeToList(query);
            url += '#/' + hash;
            // Set path as allowed
            pav.location.allowLocationChange = url;
            // console.log('> updateUrl URL > ' + pav.location.allowLocationChange);
            // Update path
            var $timeout = angular.element(document.body).injector().get('$timeout');
            var $location = angular.element(document.body).injector().get('$location');
            // console.log('> Location HASH: ' + $location.hash());
            // console.log('> Current  HASH: ' + hash);
            // $location.hash(hash).replace();
            // console.log('> New loc. HASH: ' + $location.hash())
            var $window = angular.element(document.body).injector().get('$window');
            $window.location.href = url;*/
            // setTimeout(function() { window.location.href = url; }, 500);
        },
        // Handles location changed event
        handleLocationChange : function(event, newUrl, oldUrl) {
           /* console.log('> handleLocationChange:' + newUrl + ' / ' + oldUrl);
            if (pav.location.allowLocationChange != newUrl.replace(/%20/g, " ").replace(/%7C/g, "|")) {
                // Prevent location change
                event.preventDefault();
                // console.log('> handleLocationChange Refused > ' + pav.location.allowLocationChange);
            } else {
                // Prevent next location change
                pav.location.allowLocationChange = null;
                // console.log('> handleLocationChange Accepted > ' + pav.location.allowLocationChange);
            }*/
        },

        // Encodes object to list string
        encodeToList : function(obj) {
            if (obj == null) return 'null';
            var encoded = '';
            for (var key in obj) {
                encoded += (encoded.length > 0 ? '|' : '') + key + '=' + obj[key];
            }
            return (encoded.length > 0 ? encoded : 'empty');
        },
        // Decodes object from list string
        decodeFromList : function(str) {
            if (str == 'null') return null;
            if (str == 'empty') return { };
            var decoded = { };
            var properties = str.split('|');
            for (var i in properties) {
                var property = properties[i].split('=');
                decoded[property[0]] = property[1];
            }
            return decoded;
        },
        // Encodes object to Base64 encoding
        encodeBase64 : function(obj) {
            return pav.location._encodeBase64( JSON.stringify( obj ) );
        },
        // Decodes object from Base64 encoding
        decodeBase64 : function(str) {
            return JSON.parse( pav.location._decodeBase64( str ) );
        },
        _encodeBase64 : function(data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];
            if (!data) return data;
            do {
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);
                bits = o1 << 16 | o2 << 8 | o3;
                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);
            enc = tmp_arr.join('');
            var r = data.length % 3;
            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
        },
        _decodeBase64 : function(data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
            if (!data)  return data;
            data += '';
            do {
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));
                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;
                if (h3 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);
            dec = tmp_arr.join('');
            return dec;
        }

    },

    /* Services namespace
     ================================================================================================================ */
    services : {
        // Holds relative translation path from client-side to server-side services
        relativeUrl : 'svc/',

        // Holds authentication related services paths
        auth : {
            // Authentication session check status service URL
            checkAuthenticationUrl : 'checkConsumerSession.do',
            // Login service URL
            loginUrl : 'loginConsumer.do',
            // Logout service URL
            logoutUrl : 'logoutConsumer.do',
            // Register service URL
            registerUrl : 'registerConsumer.do'
        },

        // Holds type-ahead related services paths
        typeahead : {
            // Med service type ahead relative URL
            medServiceTypeAheadUrl : 'medservicelooukp.do',
            // City Zip code type ahead relative URL
            cityZipCodeTypeAheadUrl : 'cityzipcode.do',
            // Search terms validation relative URL
            searchValidationService : 'validateSearchFields.do'
        },

        // Holds search related service paths
        search : {
            // Get listing service relative URL
            getListingUrl : 'getListing.do',
            // Get content service relative URL
            getContentUrl : 'getContent.do',
            // Get appointments service relative URL
            getAppointmentsUrl : 'getAppointments.do'
        },

        // Holds reservation related service paths
        booking : {
            // Get reservation content service relative URL
            getReservationContent : 'getResvFormContent',
            // Get reservation service relative URL
            getReservation : 'reserveAppt.do',
            // Get reservation details service relative URL
            getReservationDetails : 'getApptDetail.do',
            // Get insurance companies service relative URL
            getInsuranceCompanies : 'getInsProviderList.do',
            // Get insurance plans service relative URL
            getInsurancePlans : 'getInsPlanList.do'
        },

        // Holds my account related service paths
        account : {
            // Invite friend service relative URL
            inviteFriend : 'referFriends.do',
            // Update phone number service relative URL
            updateProfile : 'updateConProfile.do',
            // Update password service relative URL
            updatePassword : 'changePasswd.do',
            // Forgot password service relative URL
            forgotPassword : 'forgotPasswordConsumer.do',
            // Reset password service relative URL
            resetPassword : 'resetConPasswd.do'
        }

    },

    /* Page perticular functionalities namespace
     ================================================================================================================ */
    pages : {

        // All pages namespace
        all : {

            // Configuration namespace
            config : {

                // Holds Facebook URL link
                facebookLink : 'https://www.facebook.com/AffordAScan',
                // Holds Google+ URL link
                googlePlusLink : null,
                // Holds Twitter URL link
                twitterLink : null,

                // Toggles display of facebook like button
                loadFacebookSDK : true,

                // Holds relative URL of images path
                imagesRelativeURL : '.'

            }

        },

        // 'index.html' page namespace
        index : {

            // Holds page's URL
            url : '/',
            // Holds list of allowed parameters to pass to the page
            allowedParameters : [ ],

            // Configuration namespace
            config : {

                // Toggles display of facebook like widget
                showFacebookLikeWidget : true,

                // Toggles quick validation functionality (changes search button color based on results drill-down)
                quickValidation : true,

                // Timeout value for validation error messages (in [ms])
                validationErrorTimeout : 2000,

                // Holds max number of Med services type-ahead suggestions shown
                medServicesTypeaheadCount : 8,
                // Holds max number of City Zip code type-ahead suggestions shown
                cityZipCodeTypeaheadCount : 8,

                // Holds state if displaying select notification for suggested service groups
                showNotificationForSelectServiceGroup : true,
                // Holds state if displaying select notification for suggested services
                showNotificationForSelectService : true

            }

        },

        // 'searchresults.html' page namespace
        results : {


            // Holds page's URL
            url : 'searchresult.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters : [ 'medServicesSearchString', 'cityZipCodeSearchString', 'medServiceId', 'type', 'city', 'state', 'cityZipCodeId', 'zipCode', 'latitude', 'longitude', 'noOfDays' ],

            // Configuration namespace
            config : {

                // Toggles display of facebook like widget
                showFacebookLikeWidget : true,

                // Toggle value for showing/hiding search bar
                showSearchBar : true,

                // Defines number of results in a single page
                resultsPerPage : 4,

                // Defines number of highlights displayed for each result
                highlightsPerResult : 2,

                // Holds list of available result sorting criteria
                resultSortingCriteria : [
                    { id : 0, value : 'cashPrice',          descending : false, display : 'Price: Low to High' },
                    { id : 1, value : 'cashPrice',          descending : true,  display : 'Price: High to Low' },
                    { id : 2, value : 'distanceFromSearch', descending : false, display : 'Distance' }
                ],
                // Holds index of preselected result sorting criteria
                preselectedResultSortingCriteriaIndex : 0,

                // Holds list of available result filtering criteria
                resultFilteringCriteria : [
                    { id : 0, filter : { noOfDays : 1 },  display : 'Date: Next day' },
                    { id : 1, filter : { noOfDays : 7 },  display : 'Date: Next 7 days' },
                    { id : 2, filter : { noOfDays : 14 }, display : 'Date: Next 14 days' },
                    { id:  3, filter : { noOfDays : 30 }, display : 'Date: Next 30 days' }
                ],
                // Holds index of preselected result filtering criteria
                preselectedResultFilteringCriteriaIndex : 1,

                // Toggles panning on selected result's map icon functionality
                panSelectedResultOnMap : false,
                // Toggles showing info for selected result's map icon functionality
                infoSelectedResultOnMap : true,
                // Toggles highlighting selected result's map icon functionality
                highlightSelectedResultOnMap : true,
                // Holds URL of selected (highlighted) result's map icon
                highlightSelectedResultOnMap_selectedIcon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                // Holds URL of unselected (non-highlighted) result's map icon
                highlightSelectedResultOnMap_unselectedIcon : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                // Toggles display of beside map list of results in cash view
                showMapListForCash : true,
                // Toggles display of beside map list of results in insurance view
                showMapListForInsurance : false

            }

        },

        // 'searchdetail.html' page namespace
        details : {

            // Holds page's URL
            url : 'searchdetail.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters : [ 'medServicesSearchString', 'cityZipCodeSearchString', 'medServiceId', 'type', 'city', 'state', 'cityZipCodeId', 'zipCode', 'latitude', 'longitude', 'noOfDays',
                                    'cashApptId', 'cashBookable', 'cashPriceId', 'insApptId', 'insBookable'],

            // Toggles display of facebook like widget
            showFacebookLikeWidget : true,

            // Toggle value for showing/hiding search bar
            showSearchBar : true,
            // Toggles quick validation functionality (changes search button color)
            quickValidation : true,

            // Configuration namespace
            config : {

                // Toggles if $ is displayed on calendar dates
                showDollarOnCalendar : true

            }
        },
        locappreq : {

            // Holds page's URL
            url : 'locpage.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters :[ 'imgcptcodeId','medServiceId', 'type', 'city', 'state', 'zipCode', 'latitude', 'longitude'],

            // Toggles display of facebook like widget
            showFacebookLikeWidget : false,

            // Toggle value for showing/hiding search bar
            showSearchBar : false,
            // Toggles quick validation functionality (changes search button color)
            quickValidation : false,

            // Configuration namespace
            config : {

                // Toggles if $ is displayed on calendar dates
                showDollarOnCalendar : false,
              
                // Toggles quick validation functionality (changes search button color based on results drill-down)
                quickValidation : true,

                // Timeout value for validation error messages (in [ms])
                validationErrorTimeout : 2000,

                // Holds max number of Med services type-ahead suggestions shown
                medServicesTypeaheadCount : 8,
                              // Holds state if displaying select notification for suggested service groups
                showNotificationForSelectServiceGroup : true,
                // Holds state if displaying select notification for suggested services
                showNotificationForSelectService : true


            }
        },
        locpage : {

            // Holds page's URL
            url : 'locpage.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters :[ 'imgcptcodeId','medServiceId', 'type', 'city', 'state', 'zipCode', 'latitude', 'longitude'],

            // Toggles display of facebook like widget
            showFacebookLikeWidget : false,

            // Toggle value for showing/hiding search bar
            showSearchBar : false,
            // Toggles quick validation functionality (changes search button color)
            quickValidation : false,

            // Configuration namespace
            config : {

                // Toggles if $ is displayed on calendar dates
                showDollarOnCalendar : false,
              
                // Toggles quick validation functionality (changes search button color based on results drill-down)
                quickValidation : true,

                // Timeout value for validation error messages (in [ms])
                validationErrorTimeout : 2000,

                // Holds max number of Med services type-ahead suggestions shown
                medServicesTypeaheadCount : 8,
                              // Holds state if displaying select notification for suggested service groups
                showNotificationForSelectServiceGroup : true,
                // Holds state if displaying select notification for suggested services
                showNotificationForSelectService : true


            }
        },

        // 'reservation.html' page namespace
        reservation : {

            // Holds page's URL
            url : 'reservation.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters : [ 'medServicesSearchString', 'cityZipCodeSearchString', 'medServiceId', 'type', 'city', 'state', 'cityZipCodeId', 'zipCode', 'latitude', 'longitude', 'noOfDays',
                                    'cashApptId', 'cashBookable', 'cashPriceId', 'insApptId', 'insBookable',
                                    'insBooking', 'apptId', 'appDate', 'appStartTime', 'appEndTime'],

            // Configuration namespace
            config : {

                // Toggles display of facebook like widget
                showFacebookLikeWidget : true,

                // Toggle value for showing/hiding search bar
                showSearchBar : true,
                // Toggles quick validation functionality (changes search button color)
                quickValidation : true,

                // Holds list of available reservation holders
                reservationHolders : [
                    { id : 0, name : 'self' }
                ]

            }

        },

        // Reservation confirmation namespace
        confirmation : {

            // Holds page's URL
            url : 'reservation-confirmation.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters : [ 'medServicesSearchString', 'cityZipCodeSearchString', 'medServiceId', 'type', 'city', 'state', 'cityZipCodeId', 'zipCode', 'latitude', 'longitude', 'noOfDays',
                                    'cashApptId', 'cashBookable', 'cashPriceId', 'insApptId', 'insBookable',
                                    'insBooking', 'apptId', 'appDate', 'appStartTime', 'appEndTime',
                                    'bookingId'],

            // Configuration namespace
            config : {

                // Toggles display of facebook like widget
                showFacebookLikeWidget : true,

                // Toggle value for showing/hiding search bar
                showSearchBar : true

            }

        },

        // 'myaccount.html' page namespace
        myaccount : {

            // Holds page's URL
            url : 'myaccount.html',
            // Holds list of allowed parameters to pass to the page
            allowedParameters : [ ],

            // Configuration namespace
            config : {

                // Toggles display of facebook like widget
                showFacebookLikeWidget : true

            }

        },

        // 'resetpassword.html' page namespace
        resetpassword : {

            // Configuration namespace
            config : { }

        },

        // Static pages namespace
        static : {

            // Configuration namespace
            config : {

                // Toggle value for showing/hiding search bar
                showSearchBar : true

            }

        }

    },

    /* User authentication namespace
     ================================================================================================================ */
    auth : {
        // Holds flag holding if auth services have been initialized
        isReady : false,

        // Authenticated user information namespace
        user : {
            // Holds status if user is authenticated
            isAuthenticated : false,
            // Holds status if user is currently authenticating
            isAuthenticating : false,
            // Holds status if user is currently signing up
            isSigning : false,
            // Holds status if user is currently resetting password
            isResetting : false,
            // Holds authenticated username
            username : null
        },

        // Login process information and hooks
        authenticate : {
            // Holds auth candidate username
            username : '',
            // Holds auth candidate password
            password : '',
            // Holds auth candidate retyped password
            password2 : '',
            // Holds auth candidate username
            email : null,
            // Holds auth candidate username
            phoneNo : null,
            // Prepares for login
            prepLogin : function() {
                // Show login fields
                pav.auth.user.isAuthenticating = true;
                // Scroll to login box
                $("html, body").animate({ scrollTop: 0 }, 1000);
            },

            openPopup : function() {
                // Show popup
                $("#login_popup").show();
                // Set status
                pav.auth.user.isAuthenticating = true;
            },

            closePopup : function() {
                // Show popup
                $("#login_popup").hide();
                // Set status
                pav.auth.user.isAuthenticating = false;
                pav.auth.user.isSigning = false;
                pav.auth.user.isResetting = false;
            },

            // Does login service call
            login : function(authenticatingStatusFirst) {
                // Check if authentication process started
                if ((authenticatingStatusFirst) && (!pav.auth.user.isAuthenticating)) {
                    // Set authenticating status
                    pav.auth.user.isAuthenticating = true;
                } else {
                    // Do login
                    angular.element(document.body).injector().get('AuthenticationService').login(pav.auth.authenticate.username, pav.auth.authenticate.password);
                }
                // Return no submit
                return false;
            },
            // Does logout service call
            logout : function(onSuccess, onFail) {
                // Do logout
                angular.element(document.body).injector().get('AuthenticationService').logout(onSuccess, onFail);
            },

            // Gets account management page
            manageAccount : function() {
                window.location = pav.pages.myaccount.url;
            },

            // Gets 'forgot password' email sent to user
            forgotPassword : function() {
                // Get username
                var email = pav.auth.authenticate.username;
                angular.element(document.body).injector().get('AuthenticationService').forgotPassword(email);
            }

        },

        // Sign Up process information and hooks
        signup : {

            // Holds auth candidate username
            // username : 'joecon1@gmail.com',
            // Holds auth candidate password
            // password : 'abcd1234',
            // Holds auth candidate retyped password
            // password2 : 'abcd1234',
            // Holds auth candidate username
            // email : null,
            // Holds auth candidate username
            // phoneNo : null,

            // Does signup service call
            signup : function() {
                // Validate passwords
                var validated = true;
                if ((!pav.auth.signup.username) || (!pav.validation.ifEmail(pav.auth.signup.username))) {
                    pav.auth.signup.usernameTooltip = { content: 'Invalid Email!', cssclass: 'pav_tooltip_red', open: true };
                    validated = false;
                } else {
                    pav.auth.signup.usernameTooltip = null;
                }
                if ((!pav.auth.signup.phoneNo) || (!pav.validation.ifPhoneNo(pav.auth.signup.phoneNo))) {
                    pav.auth.signup.phoneNoTooltip = { content: 'Invalid phone number!', cssclass: 'pav_tooltip_red', open: true };
                    validated = false;
                } else {
                    pav.auth.signup.phoneNoTooltip = null;
                }
                if ((!pav.auth.signup.password) || (pav.auth.signup.password != pav.auth.signup.password2)) {
                    pav.auth.signup.passwordTooltip = pav.auth.signup.password2Tooltip = { content: 'Passwords don\'t match!', cssclass: 'pav_tooltip_red', open: true };
                    validated = false;;
                } else {
                    pav.auth.signup.passwordTooltip = null;
                }

                if (validated) {
                    // Call registration service
                    angular.element(document.body).injector().get('AuthenticationService').register(pav.auth.signup.username, pav.auth.signup.phoneNo, pav.auth.signup.password);
                }
            }

        }

    },

    /* Data validation namespace
     ================================================================================================================ */
    validation : {

        // Checks email formating
        ifEmail : function(emails) {
            var emails = emails.split(',');
            for (var i in emails) {
            	  // var email = emails[i].trim();
            		var email = emails[i];
                   var atpos=email.indexOf("@");
                   var dotpos=email.lastIndexOf(".");
                   if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) return false;
            }
            return true;
        },

        // Check phone number formatting
        ifPhoneNo : function(number) {
         /*   var cleanNo = number.replace(/ /g, '').replace(/-/g, '').replace(/\//g, '').replace(/:/g, '').replace(/\./g, '').trim();
            return ((cleanNo.length == 10) && (parseInt(cleanNo)));*/
        	if (!number) return false;
            var count = number.replace(/[^0-9]/g, "").length;
            return count == 10;
        },
        
        formatPhoneNo : function(number) {
        	if (!number) return "";
        	var input = number.replace(/[^0-9]/g, "");
        	if(input.length == 11){
    			return input.substring(0,1) + "-" + input.substring(1,4) + "-" + input.substring(4,7) +  "-" + input.substring(7);
    		}else if(input.length ==10){
    			return  input.substring(0,3) + "-" + input.substring(3,6) +  "-" + input.substring(6);
    		}  	
         }
    }

}


/* Services
 ==================================================================================================================== */

// Generic HTTP JSON request service
pav.services.JsonRequestService = pavModule.factory('JsonRequestService', ['$http', function ($http) {
    return {
        // Fires a HTTP request (uses 'url' and 'params' variables to compose request url) and executes
        // onSuccess/onFail functions with response data
        get : function(url, params, onSuccess, onFail) {
            // Add a timestamp to parameters
           if (params) {
                params._timestamp = (new Date()).getTime();
            } else {
                params = { _timestamp : (new Date()).getTime() }
            }
            // Compose params into url
            var paramsUrl = ''; 
            
           for (var i in params){
            	paramsUrl += (paramsUrl.length ? '&' : '') + (encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
            }
           //console.log('POST params' + paramsUrl);
            $http( {
            	method: 'POST',
            	url: url,
            	data : paramsUrl,
            	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, headers, config) { onSuccess(data); })
                .error(function(data, status, headers, config) { onFail(data); });
        }
    };
}]);


