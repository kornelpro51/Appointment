"use strict" /* ========================================================================================================

 Afford A Scan: Parameters and configuration script
 ==================================================================================================================== */


/* Pages URLs
 ==================================================================================================================== */
                                        
//Holds 'locappreq.html' page's URL
pav.pages.locappreq.url = 'locappreq.html';
// Holds list of allowed parameters to pass to the 'searchdetail.html' page
pav.pages.locappreq.allowedParameters = [ 'imgcptcodeId','medServiceId', 'type', 'city', 'state', 'zipCode', 'latitude', 'longitude','locationId'];



/* Service URLs
 ==================================================================================================================== */

// Common services relative URL
pav.services.relativeUrl                            = 'https://demo.affordascan.com/svc/';

// Authentication session check status service URL
pav.services.auth.checkAuthenticationUrl            = 'checkConsumerSession.do';
// Login service URL
pav.services.auth.loginUrl                          = 'loginConsumer.do';
// Logout service URL
pav.services.auth.logoutUrl                         = 'logoutConsumer.do';
// Register service URL
pav.services.auth.registerUrl                       = 'registerConsumer.do';

// Med service type ahead relative URL
pav.services.typeahead.medServiceTypeAheadUrl       = 'imgservicelooukp.do';        // 'medservicelooukp.do';
// City Zip code type ahead relative URL
pav.services.typeahead.cityZipCodeTypeAheadUrl      = 'cityzip.do';                 // 'cityzipcode.do';
// Search terms validation relative URL
pav.services.typeahead.searchValidationService      = 'validateFields.do';          // 'validateSearchFields.do';

// Get listing service relative URL
pav.services.search.getListingUrl                   = 'getListing2.do';
//Email Results service relative URL
pav.services.search.emailResults                    = 'referLink.do';
// Get content service relative URL
pav.services.search.getContentUrl                   = 'getContent.do';
//Get location content ( white label)
pav.services.search.getLocContentUrl                = 'getLocContent.do';
//Get Org content ( white label)
pav.services.search.getOrgContentUrl                = 'getOrgContent.do';
//Get Org valid locations ( white label)
pav.services.search.getOrgLocationsUrl              = 'getOrgValidLocs.do';
// Get appointments service relative URL
pav.services.search.getAppointmentsUrl              = 'getAppointments.do';
// Get reservation content service relative URL
pav.services.booking.getReservationContent          = 'getResvFormContent.do';
// Get reservation service relative URL
pav.services.booking.getReservation                 = 'reserveAppt.do';
// Get reservation details service relative URL
pav.services.booking.getReservationDetails          = 'getApptDetail.do';
// Get insurance companies service relative URL
pav.services.booking.getInsuranceCompanies          = 'getInsProviderList.do';
// Get insurance plans service relative URL
pav.services.booking.getInsurancePlans              = 'getInsPlanList.do';
//req Appointments URL
pav.services.booking.reqAppUrl              			= 'reqApp.do';


// Invite friend service relative URL
pav.services.account.inviteFriend                   = 'referFriends.do';
// Update email service relative URL
pav.services.account.updateEmail                    = 'changeEmail.do';
// Update phone number service relative URL
pav.services.account.updateProfile                  = 'updateConProfile.do';
// Update password service relative URL
pav.services.account.updatePassword                 = 'changePasswd.do';
// Forgot password service relative URL
pav.services.account.forgotPassword                 = 'forgotPasswordConsumer.do';
// Reset password service relative URL
pav.services.account.resetPassword                  = 'resetConPasswd.do';




/* Other URLs
 ==================================================================================================================== */

// Relative URL of images path
pav.pages.all.config.imagesRelativeURL = '.'

/* Outside services' links
 ==================================================================================================================== */

// Holds Facebook URL link
pav.pages.all.config.facebookLink = 'https://www.facebook.com/AffordAScan';
// Holds Google+ URL link
pav.pages.all.config.googlePlusLink = null;
// Holds Twitter URL link
pav.pages.all.config.twitterLink = null;

// Toggles loading facebook SDK - needed for Facebook widgets
pav.pages.all.config.loadFacebookSDK                    = true;
// Show Facebook like widget on main page
pav.pages.index.config.showFacebookLikeWidget           = true;
// Show Facebook like widget on results page
pav.pages.results.config.showFacebookLikeWidget         = true;
// Show Facebook like widget on result details page
pav.pages.details.config.showFacebookLikeWidget         = true;
// Show Facebook like widget on reservation page
pav.pages.reservation.config.showFacebookLikeWidget     = true;
// Show Facebook like widget on reservation confirmation page
pav.pages.confirmation.config.showFacebookLikeWidget    = true;
// Show Facebook like widget on my account page
pav.pages.myaccount.config.showFacebookLikeWidget       = true;


/* Authentication configuration
 ==================================================================================================================== */

// Sets default value for the username box (for quick testing only, should be '' for production)
// Default testing value: 'joecon1@gmail.com'
// pav.auth.authenticate.username = 'ofzza@ofzza.com';
// Sets default value for the password box (for quick testing only, should be '' for production)
// Default testing value: abcd1234
// pav.auth.authenticate.password = pav.auth.authenticate.password2 = 'tralala';


/* Type-ahead and validation configuration
 ==================================================================================================================== */

// Toggles quick validation functionality for 'index.html' page (changes search button color based on results drill-down)
pav.pages.index.config.quickValidation = false;
// Toggles quick validation functionality for 'searchdetail.html' page (changes search button color based on selected appointment)
pav.pages.details.config.quickValidation = true;
// Toggles quick validation functionality for 'reservation.html' page (changes search button color based on user inputs)
pav.pages.reservation.config.quickValidation = true;

// Timeout value for validation error messages (in [ms])
pav.pages.index.config.validationErrorTimeout = 2000;

// Holds max number of Med services type-ahead suggestions shown
pav.pages.index.config.medServicesTypeaheadCount = 18;
// Holds max number of City Zip code type-ahead suggestions shown
pav.pages.index.config.cityZipCodeTypeaheadCount = 12;

// Holds state if displaying select notification for suggested service groups
pav.pages.index.config.showNotificationForSelectServiceGroup = true;
// Holds state if displaying select notification for suggested services
pav.pages.index.config.showNotificationForSelectService = true;


/* Search results configuration
 ==================================================================================================================== */

// Array of selectable sorting criteria
pav.pages.results.config.resultSortingCriteria = [
    { id : 0, value : { cash : 'cashPrice', insurance : 'insRangeRank' },                   descending : false, display : 'Price: Low to High' },
    { id : 1, value : { cash : 'cashPrice', insurance : 'insRangeRank' },                   descending : true,  display : 'Price: High to Low' },
    { id : 2, value : { cash : 'distanceFromSearch', insurance : 'distanceFromSearch' },    descending : false, display : 'Distance' }
];
// Index of preselected sorting criteria
pav.pages.results.config.preselectedResultSortingCriteriaIndex = 0;
// Array of selectable filtering criteria
pav.pages.results.config.resultFilteringCriteria = [
    { id : 0, filter : { noOfDays : 1 },  display : 'Appt: Next day' },
    { id : 1, filter : { noOfDays : 7 },  display : 'Appt: Next 7 days' },
    { id : 2, filter : { noOfDays : 14 }, display : 'Appt: Next 14 days' },
    { id : 3, filter : { noOfDays : 30 }, display : 'Appt: Next 30 days' }
]
// Index of preselected filtering criteria
pav.pages.results.config.preselectedResultFilteringCriteriaIndex = 1;

// Pagination functionality: Number of results shown in page
pav.pages.results.config.resultsPerPage = 8;
// Defines number of highlights displayed for each result
pav.pages.results.config.highlightsPerResult = 4;

// Toggles panning on selected result's map icon functionality
pav.pages.results.config.panSelectedResultOnMap = false;
// Toggles showing info for selected result's map icon functionality
pav.pages.results.config.infoSelectedResultOnMap = true;
// Toggles highlighting selected result's map icon functionality
pav.pages.results.config.highlightSelectedResultOnMap = true;
// Holds URL of selected (highlighted) result's map icon
pav.pages.results.config.highlightSelectedResultOnMap_selectedIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
// Holds URL of unselected (non-highlighted) result's map icon
pav.pages.results.config.highlightSelectedResultOnMap_unselectedIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
// Toggles display of beside map list of results in cash and insurance views
pav.pages.results.config.showMapListForCash = pav.pages.results.config.showMapListForInsurance = false;


/* Search details configuration
 ==================================================================================================================== */

// Holds value indicating if '$' char is displayed on calendar dates
pav.pages.details.config.showDollarOnCalendar = false;


/* Search bar on pages
 ==================================================================================================================== */

// Show search bar on results page
pav.pages.results.config.showSearchBar      = true;
// Show search bar on details page
pav.pages.details.config.showSearchBar      = true;
// Show search bar on reservation page
pav.pages.reservation.config.showSearchBar  = false;
// Show search bar on reservation confirmation page
pav.pages.confirmation.config.showSearchBar = false;
// Show search bar on static pages
pav.pages.static.config.showSearchBar       = false;


/* Reservation configuration
 ==================================================================================================================== */

// Array of selectable reservation holders
pav.pages.locappreq.config.reservationHolders = [
	{ id : 0, name : 'On behalf of patient (adult)',     value : 'OTHER_ADULT' },
    { id : 1, name : 'On behalf of patient (child under 18)',  value : 'CHILD_UNDER_18' },
    { id : 2, name : 'Self',            value : 'SELF' }
];

pav.pages.locappreq.config.requesters = [
 { id : 0, name : 'Doctors Office',  	        value : 'DOCOFF' },
 { id : 1, name : 'Patient',                    value : 'PATIENT' }
];
