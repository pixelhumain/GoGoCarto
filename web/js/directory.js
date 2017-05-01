(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.redirectToDirectory = redirectToDirectory;
exports.slugify = slugify;
exports.unslugify = unslugify;
exports.capitalize = capitalize;
exports.getQueryParams = getQueryParams;
exports.parseArrayNumberIntoString = parseArrayNumberIntoString;
exports.parseStringIntoArrayNumber = parseStringIntoArrayNumber;
function redirectToDirectory(route, address, range) {
    if (address === void 0) {
        address = $('#search-bar').val();
    }
    if (range === void 0) {
        range = '';
    }
    if (!range) window.location.href = Routing.generate(route, { slug: slugify(address) });else window.location.href = Routing.generate(route, { slug: slugify(address), distance: range });
}
function slugify(text) {
    if (!text) return '';
    return text.toString() //.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
function unslugify(text) {
    if (!text) return '';
    return text.toString().replace(/\-+/g, ' ');
}
function capitalize(text) {
    return text.substr(0, 1).toUpperCase() + text.substr(1, text.length).toLowerCase();
}
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}
function parseArrayNumberIntoString(array) {
    var result = '';
    var i = 0;
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var number = array_1[_i];
        if (i % 2 == 0) {
            result += parseNumberToString(number);
        } else {
            result += number.toString();
        }
        i++;
    }
    return result;
}
function parseNumberToString(number) {
    var base26 = number.toString(26);
    var i = 0;
    var length = base26.length;
    var result = '';
    for (i = 0; i < length; i++) {
        result += String.fromCharCode(96 + parseInt(base26[i], 26));
    }
    return result;
}
function parseStringToNumber(string) {
    var i = 0;
    var length = string.length;
    var result = 0;
    for (i = length - 1; i >= 0; i--) {
        result += (string.charCodeAt(i) - 96) * Math.pow(26, length - i - 1);
    }
    return result;
}
function parseStringIntoArrayNumber(string) {
    var result = [];
    if (!string) return result;
    var array = string.match(/[a-z]+|[0-9]+/g);
    for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
        var element = array_2[_i];
        if (parseInt(element)) {
            result.push(parseInt(element));
        } else {
            result.push(parseStringToNumber(element));
        }
    }
    return result;
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SearchBarComponent = undefined;
exports.initAutoCompletionForElement = initAutoCompletionForElement;

var _event = require("../directory/utils/event");

var SearchBarComponent = function () {
    function SearchBarComponent(domId) {
        var _this = this;
        this.onSearch = new _event.Event();
        this.domId = domId;
        // handle all validation by user (enter press, icon click...)
        this.domElement().keyup(function (e) {
            if (e.keyCode == 13) {
                _this.handleSearchAction();
                console.log(_this.domId);
            }
        });
        this.domElement().parents().find('#search-bar-icon').click(function () {
            _this.handleSearchAction();
        });
        this.domElement().on("place_changed", this.handleSearchAction());
    }
    SearchBarComponent.prototype.domElement = function () {
        return $("#" + this.domId);
    };
    SearchBarComponent.prototype.handleSearchAction = function () {
        this.onSearch.emit(this.domElement().val());
    };
    SearchBarComponent.prototype.setValue = function ($value) {
        this.domElement().val($value);
    };
    return SearchBarComponent;
}(); /**
      * This file is part of the MonVoisinFaitDuBio project.
      * For the full copyright and license information, please view the LICENSE
      * file that was distributed with this source code.
      *
      * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
      * @license    MIT License
      * @Last Modified time: 2016-08-31
      */
exports.SearchBarComponent = SearchBarComponent;
function initAutoCompletionForElement(element) {
    var options = {
        componentRestrictions: { country: 'fr' }
    };
    var autocomplete = new google.maps.places.Autocomplete(element, options);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        $(element).trigger('place_changed');
        return false;
    });
}

},{"../directory/utils/event":29}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeAppInteractions = initializeAppInteractions;
exports.showDirectoryMenu = showDirectoryMenu;
exports.hideDirectoryMenu = hideDirectoryMenu;
exports.hideBandeauHelper = hideBandeauHelper;
exports.showOnlyInputAdress = showOnlyInputAdress;
exports.updateComponentsSize = updateComponentsSize;
exports.updateMapSize = updateMapSize;
exports.updateInfoBarSize = updateInfoBarSize;

var _app = require('./app.module');

function initializeAppInteractions() {
    //animation pour lien d'ancre dans la page
    /* $('a[href^="#"]').click(function(){
         let target = $(this).attr("href");
         $('html, body').animate({scrollTop: $(target).offset().top}, 700);
         return false;
     }); */
    /*$('#menu-button').click(animate_up_bandeau_options);
    $('#overlay').click(animate_down_bandeau_options);*/
    updateComponentsSize();
    $('#btn-bandeau-helper-close').click(hideBandeauHelper);
    $('.flash-message .btn-close').click(function () {
        $(this).parent().slideUp('fast', function () {
            updateComponentsSize();
        });
    });
    $('#btn-close-directions').click(function () {
        App.setState(_app.AppStates.ShowElement, { id: App.infoBarComponent.getCurrElementId() });
    });
    var res;
    window.onresize = function () {
        if (res) {
            clearTimeout(res);
        }
        res = setTimeout(updateComponentsSize, 200);
    };
    //Menu CARTE	
    $('#menu-button').click(showDirectoryMenu);
    $('#overlay').click(hideDirectoryMenu);
    $('#directory-menu .btn-close-menu').click(hideDirectoryMenu);
    $('#directory-content-map .show-as-list-button').click(function (e) {
        App.setTimeoutClicking();
        App.setMode(_app.AppModes.List);
        e.preventDefault();
        e.stopPropagation();
    });
    $('#directory-content-list .show-as-map-button').click(function () {
        App.setMode(_app.AppModes.Map);
    });
    // if (onlyInputAdressMode)
    // {
    // 	showOnlyInputAdress();
    // }
    // $('#list_tab').click(function(){
    // 	$("#directory-content-list").show();
    // 	$('#directory-container').hide();
    // });
    // $('#directory-content-map_tab').click(function(){		
    // 	$('#directory-container').show();
    // 	$("#directory-content-list").hide();
    // });
} /**
   * This file is part of the MonVoisinFaitDuBio project.
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   *
   * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
   * @license    MIT License
   * @Last Modified time: 2016-12-13
   */
function showDirectoryMenu() {
    App.infoBarComponent.hide();
    $('#overlay').css('z-index', '10');
    $('#overlay').animate({ 'opacity': '.6' }, 700);
    $('#directory-menu').show("slide", { direction: 'left', easing: 'swing' }, 350, function () {
        App.directoryMenuComponent.updateMainOptionBackground();
    });
    //$('#directory-menu').css('width','0px').show().animate({'width': '240px'},700);
}
function hideDirectoryMenu() {
    $('#overlay').css('z-index', '-1');
    $('#overlay').animate({ 'opacity': '.0' }, 500);
    $('#directory-menu').hide("slide", { direction: 'left', easing: 'swing' }, 250);
    $('#menu-title .shadow-bottom').hide();
    //$('#directory-menu').animate({'width': '0px'},700).hide();
}
var slideOptions = { duration: 500, easing: "easeOutQuart", queue: false, complete: function complete() {} };
function hideBandeauHelper() {
    $('#bandeau_helper').slideUp(slideOptions);
}
function showOnlyInputAdress() {
    hideBandeauHelper();
    $('#directory-content').css('margin-left', '0');
    $('#bandeau_tabs').hide();
    $('#directory-content-list').hide();
    updateComponentsSize();
}
function updateComponentsSize() {
    //$("#bandeau_option").css('height',$( window ).height()-$('header').height());
    //console.log("Update component size");
    $('#page-content').css('height', 'auto');
    var content_height = $(window).height() - $('header').height();
    content_height -= $('.flash-messages-container').outerHeight(true);
    $("#directory-container").css('height', content_height);
    $("#directory-content-list").css('height', content_height);
    if (App) setTimeout(App.updateMaxElements, 500);
    updateInfoBarSize();
    updateMapSize();
}
var matchMediaBigSize_old;
function updateMapSize(elementInfoBar_height) {
    if (elementInfoBar_height === void 0) {
        elementInfoBar_height = $('#element-info-bar').outerHeight(true);
    }
    //console.log("updateMapSize", elementInfoBar_height);
    if ("matchMedia" in window) {
        if (window.matchMedia("(max-width: 600px)").matches) {
            $("#directory-menu").css('height', $("#directory-content").height() - elementInfoBar_height);
        } else {
            $("#directory-menu").css('height', '100%');
        }
        if (window.matchMedia("(max-width: 1200px)").matches) {
            if (matchMediaBigSize_old) elementInfoBar_height = 0;
            //console.log("resize map height to", $("#directory-content").outerHeight()-elementInfoBar_height);
            $("#directory-content-map").css('height', $("#directory-content").outerHeight() - elementInfoBar_height);
            matchMediaBigSize_old = false;
        } else {
            $("#directory-content-map").css('height', $("#directory-content").height());
            if ($('#element-info-bar').is(":visible")) {
                $('#directory-content-map').css('margin-right', '480px');
                $('#bandeau_helper').css('margin-right', '480px');
            } else {
                $('#directory-content-map').css('margin-right', '0px');
                $('#bandeau_helper').css('margin-right', '0px');
            }
            matchMediaBigSize_old = true;
        }
    } else {
        console.error("Match Media not available");
    }
    // après 500ms l'animation de redimensionnement est terminé
    // on trigger cet évenement pour que la carte se redimensionne vraiment
    if (App.mapComponent) setTimeout(function () {
        App.mapComponent.resize();
    }, 500);
}
function updateInfoBarSize() {
    if ($('#element-info-bar').width() < 600) {
        $('#element-info-bar').removeClass("largeWidth");
        $('#element-info-bar').addClass("smallWidth");
    } else {
        $('#element-info-bar').addClass("largeWidth");
        $('#element-info-bar').removeClass("smallWidth");
    }
    if ("matchMedia" in window) {
        if (window.matchMedia("(max-width: 1200px)").matches) {
            $('#element-info-bar .moreDetails').css('height', 'auto');
            $('#element-info-bar .collapsible-body').css('margin-top', '0px');
        } else {
            var elementInfoBar = $("#element-info-bar");
            var height = elementInfoBar.outerHeight(true);
            height -= elementInfoBar.find('.collapsible-header').outerHeight(true);
            height -= elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
            height -= elementInfoBar.find(".menu-element").outerHeight(true);
            $('#element-info-bar .collapsible-body').css('height', height);
            $('#element-info-bar .collapsible-body').css('margin-top', elementInfoBar.find('.collapsible-header').outerHeight(true) + elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true));
        }
    }
}

},{"./app.module":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppModule = exports.AppModes = exports.AppStates = undefined;

var _geocoder = require("./modules/geocoder.module");

var _filter = require("./modules/filter.module");

var _elements = require("./modules/elements.module");

var _displayElementAlone = require("./modules/display-element-alone.module");

var _ajax = require("./modules/ajax.module");

var _categories = require("./modules/categories.module");

var _directions = require("./modules/directions.module");

var _elementList = require("./components/element-list.component");

var _infoBar = require("./components/info-bar.component");

var _searchBar = require("../commons/search-bar.component");

var _directoryMenu = require("./components/directory-menu.component");

var _map = require("./components/map/map.component");

var _history = require("./modules/history.module");

var _bounds = require("./modules/bounds.module");

var _appInteractions = require("./app-interactions");

var _elementMenu = require("./components/element-menu.component");

var _vote = require("./components/vote.component");

var _commons = require("../commons/commons");

/**
* App initialisation when document ready
*/
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
/// <reference types="leaflet" />
$(document).ready(function () {
    App = new AppModule();
    App.categoryModule.createCategoriesFromJson(MAIN_CATEGORY, OPENHOURS_CATEGORY);
    App.elementModule.initialize();
    App.boundsModule.initialize();
    App.loadHistoryState();
    (0, _appInteractions.initializeAppInteractions)();
    (0, _elementMenu.initializeElementMenu)();
    (0, _vote.initializeVoting)();
});
/*
* App states names
*/
var AppStates = exports.AppStates = undefined;
(function (AppStates) {
    AppStates[AppStates["Normal"] = 0] = "Normal";
    AppStates[AppStates["ShowElement"] = 1] = "ShowElement";
    AppStates[AppStates["ShowElementAlone"] = 2] = "ShowElementAlone";
    AppStates[AppStates["ShowDirections"] = 3] = "ShowDirections";
    AppStates[AppStates["Constellation"] = 4] = "Constellation";
    AppStates[AppStates["StarRepresentationChoice"] = 5] = "StarRepresentationChoice";
})(AppStates || (exports.AppStates = AppStates = {}));
var AppModes = exports.AppModes = undefined;
(function (AppModes) {
    AppModes[AppModes["Map"] = 0] = "Map";
    AppModes[AppModes["List"] = 1] = "List";
})(AppModes || (exports.AppModes = AppModes = {}));
/*
* App Module. Main module of the App
*
* AppModule creates all others modules, and deals with theirs events
*/
var AppModule = function () {
    function AppModule() {
        var _this = this;
        this.geocoderModule_ = new _geocoder.GeocoderModule();
        this.filterModule_ = new _filter.FilterModule();
        this.elementsModule_ = new _elements.ElementsModule();
        this.displayElementAloneModule_ = new _displayElementAlone.DisplayElementAloneModule();
        this.directionsModule_ = new _directions.DirectionsModule();
        this.ajaxModule_ = new _ajax.AjaxModule();
        this.infoBarComponent_ = new _infoBar.InfoBarComponent();
        this.mapComponent_ = new _map.MapComponent();
        this.searchBarComponent = new _searchBar.SearchBarComponent('search-bar');
        this.elementListComponent = new _elementList.ElementListComponent();
        this.historyModule = new _history.HistoryModule();
        this.categoryModule = new _categories.CategoriesModule();
        this.directoryMenuComponent = new _directoryMenu.DirectoryMenuComponent();
        this.boundsModule = new _bounds.BoundsModule();
        //starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
        // curr state of the app
        this.state_ = null;
        this.mode_ = null;
        // somes states need a element id, we store it in this property
        this.stateElementId = null;
        // when click on marker it also triger click on map
        // when click on marker we put isClicking to true during
        // few milliseconds so the map don't do anything is click event
        this.isClicking_ = false;
        // prevent updatedirectory-content-list while the action is just
        // showing element details
        this.isShowingInfoBarComponent_ = false;
        // Put a limit of markers showed on map (markers not clustered)
        // Because if too many markers are shown, browser slow down
        this.maxElementsToShowOnMap_ = 1000;
        this.infoBarComponent_.onShow.do(function (elementId) {
            _this.handleInfoBarShow(elementId);
        });
        this.infoBarComponent_.onHide.do(function () {
            _this.handleInfoBarHide();
        });
        this.mapComponent_.onMapReady.do(function () {
            _this.initializeMapFeatures();
        });
        //this.geocoderModule_.onResult.do( (array) => { this.handleGeocoding(array); });
        this.ajaxModule_.onNewElements.do(function (elements) {
            _this.handleNewElementsReceivedFromServer(elements);
        });
        this.elementsModule_.onElementsChanged.do(function (elementsChanged) {
            _this.handleElementsChanged(elementsChanged);
        });
        this.searchBarComponent.onSearch.do(function (address) {
            _this.handleSearchAction(address);
        });
        this.mapComponent_.onIdle.do(function () {
            _this.handleMapIdle();
        });
        this.mapComponent_.onClick.do(function () {
            _this.handleMapClick();
        });
    }
    AppModule.prototype.initializeMapFeatures = function () {};
    ;
    /*
    * Load initial state with CONFIG provided by symfony controller or
      with state poped by window history manager
    */
    AppModule.prototype.loadHistoryState = function (historystate, $backFromHistory) {
        var _this = this;
        if (historystate === void 0) {
            historystate = CONFIG;
        }
        if ($backFromHistory === void 0) {
            $backFromHistory = false;
        }
        //console.log("loadHistorystate filtersd", historystate.filters)
        if (historystate.filters) {
            this.filterModule.loadFiltersFromString(historystate.filters);
        } else {
            this.directoryMenuComponent.setMainOption('all');
        }
        if (historystate === null) return;
        // if no backfromhistory that means historystate is actually the CONFIG
        // given by symfony, so we need to convert this obect in real Historystate class
        if (!$backFromHistory) historystate = new _history.HistoryState().parse(historystate);
        if (historystate.viewport) {
            // if map not loaded we just set the mapComponent viewport without changing the
            // actual viewport of the map, because it will be done in
            // map initialisation
            this.mapComponent.setViewPort(historystate.viewport, this.mapComponent.isMapLoaded);
            $('#directory-spinner-loader').hide();
            if (historystate.mode == AppModes.List) {
                var location_1 = L.latLng(historystate.viewport.lat, historystate.viewport.lng);
            }
        }
        this.setMode(historystate.mode, $backFromHistory, false);
        // if address is provided we geolocalize
        // if no viewport and state normal we geocode on default location
        if (historystate.address || !historystate.viewport && historystate.state === AppStates.Normal) {
            this.geocoderModule_.geocodeAddress(historystate.address, function (results) {
                // if viewport is given, nothing to do, we already did initialization
                // with viewport
                if (historystate.viewport && historystate.mode == AppModes.Map) return;
                _this.handleGeocodeResult(results);
            }, function () {
                // failure callback
                _this.searchBarComponent.setValue("Erreur de localisation : " + historystate.address);
                if (!historystate.viewport) {
                    // geocode default location
                    _this.geocoderModule_.geocodeAddress('', function (r) {
                        _this.handleGeocodeResult(r);
                    });
                }
            });
        }
        if (historystate.id) {
            this.setState(historystate.state, {
                id: historystate.id,
                panToLocation: historystate.viewport === null
            }, $backFromHistory);
            $('#directory-spinner-loader').hide();
        } else {
            this.setState(historystate.state, null, $backFromHistory);
        }
    };
    ;
    AppModule.prototype.setMode = function ($mode, $backFromHistory, $updateTitleAndState) {
        if ($backFromHistory === void 0) {
            $backFromHistory = false;
        }
        if ($updateTitleAndState === void 0) {
            $updateTitleAndState = true;
        }
        if ($mode != this.mode_) {
            if ($mode == AppModes.Map) {
                $('#directory-content-map').show();
                $('#directory-content-list').hide();
                this.mapComponent.init();
                if (this.mapComponent_.isMapLoaded) this.boundsModule.extendBounds(0, this.mapComponent.getBounds());
            } else {
                $('#directory-content-map').hide();
                $('#directory-content-list').show();
                if (App.geocoder.getLocation()) {
                    this.boundsModule.createBoundsFromLocation(App.geocoder.getLocation());
                    this.checkForNewElementsToRetrieve();
                }
            }
            // if previous mode wasn't null 
            var oldMode = this.mode_;
            this.mode_ = $mode;
            // update history if we need to
            if (oldMode != null && !$backFromHistory) this.historyModule.pushNewState();
            this.elementModule.clearCurrentsElement();
            this.elementModule.updateElementsToDisplay(true, true);
            if ($updateTitleAndState) {
                this.updateDocumentTitle();
                // after clearing, we set the current state again
                if ($mode == AppModes.Map) this.setState(this.state, { id: this.stateElementId });
            }
        }
    };
    /*
    * Change App state
    */
    AppModule.prototype.setState = function ($newState, options, $backFromHistory) {
        //console.log("AppModule set State : " + AppStates[$newState]  +  ', options = ',options);
        var _this = this;
        if (options === void 0) {
            options = {};
        }
        if ($backFromHistory === void 0) {
            $backFromHistory = false;
        }
        var element;
        var oldStateName = this.state_;
        this.state_ = $newState;
        if (oldStateName == AppStates.ShowDirections && this.directionsModule_) this.directionsModule_.clear();
        if (oldStateName == AppStates.ShowElementAlone) {
            this.elementModule.clearCurrentsElement();
            this.displayElementAloneModule_.end();
        }
        this.stateElementId = options ? options.id : null;
        switch ($newState) {
            case AppStates.Normal:
                // if (this.state_ == AppStates.Constellation) 
                // {
                // 	clearDirectoryMenu();
                // 	this.starRepresentationChoiceModule_.end();
                // }	
                if ($backFromHistory) this.infoBarComponent.hide();
                break;
            case AppStates.ShowElement:
                if (!options.id) return;
                this.elementById(options.id).marker.showNormalHidden();
                this.elementById(options.id).marker.showBigSize();
                this.infoBarComponent.showElement(options.id);
                break;
            case AppStates.ShowElementAlone:
                if (!options.id) return;
                element = this.elementById(options.id);
                if (element) {
                    this.DEAModule.begin(element.id, options.panToLocation);
                } else {
                    this.ajaxModule_.getElementById(options.id, function (elementJson) {
                        _this.elementModule.addJsonElements([elementJson], true);
                        _this.DEAModule.begin(elementJson.id, options.panToLocation);
                        _this.updateDocumentTitle(options);
                        _this.historyModule.pushNewState(options);
                        // we get element around so if the user end the DPAMdoule
                        // the elements will already be available to display
                        //this.ajaxModule.getElementsInBounds([this.mapComponent.getBounds()]);	 
                    }, function (error) {
                        /*TODO*/alert("No element with this id");
                    });
                }
                break;
            case AppStates.ShowDirections:
                if (!options.id) return;
                element = this.elementById(options.id);
                var origin_1;
                if (this.state_ == AppStates.Constellation) {
                    origin_1 = this.constellation.getOrigin();
                } else {
                    origin_1 = this.geocoder.getLocation();
                }
                // local function
                var calculateRoute_1 = function calculateRoute_1(origin, element) {
                    App.directionsModule.calculateRoute(origin, element);
                    App.DEAModule.begin(element.id, false);
                };
                // if no element, we get it from ajax 
                if (!element) {
                    this.ajaxModule_.getElementById(options.id, function (elementJson) {
                        _this.elementModule.addJsonElements([elementJson], true);
                        element = _this.elementById(elementJson.id);
                        _this.updateDocumentTitle(options);
                        origin_1 = _this.geocoder.getLocation();
                        // we geolocalized origin in loadHistory function
                        // maybe the geocoding is not already done so we wait a little bit for it
                        if (!origin_1) {
                            setTimeout(function () {
                                origin_1 = _this.geocoder.getLocation();
                                if (!origin_1) setTimeout(function () {
                                    origin_1 = _this.geocoder.getLocation();
                                    calculateRoute_1(origin_1, element);
                                }, 1000);else calculateRoute_1(origin_1, element);
                            }, 500);
                        } else calculateRoute_1(origin_1, element);
                    }, function (error) {
                        /*TODO*/alert("No element with this id");
                    });
                } else {
                    if (this.mode == AppModes.List) {
                        this.mapComponent.onMapReady.do(function () {
                            calculateRoute_1(origin_1, element);
                            _this.mapComponent.onMapReady.off(function () {
                                calculateRoute_1(origin_1, element);
                            });
                        });
                        this.setMode(AppModes.Map, false, false);
                    } else {
                        calculateRoute_1(origin_1, element);
                    }
                }
                break;
        }
        if (!$backFromHistory && (oldStateName !== $newState || $newState == AppStates.ShowElement || $newState == AppStates.ShowElementAlone || $newState == AppStates.ShowDirections)) this.historyModule.pushNewState(options);
        this.updateDocumentTitle(options);
    };
    ;
    AppModule.prototype.handleGeocodeResult = function (results) {
        //console.log("handleGeocodeResult", results);
        $('#directory-spinner-loader').hide();
        // if just address was given
        if (this.mode == AppModes.Map) {
            this.setState(AppStates.Normal);
            this.mapComponent.fitBounds(this.geocoder.getBounds());
        } else {
            this.boundsModule.createBoundsFromLocation(this.geocoder.getLocation());
            this.elementModule.clearCurrentsElement();
            this.elementModule.updateElementsToDisplay(true, true);
        }
    };
    AppModule.prototype.handleMarkerClick = function (marker) {
        if (this.mode != AppModes.Map) return;
        this.setTimeoutClicking();
        if (marker.isHalfHidden()) this.setState(AppStates.Normal);
        this.setState(AppStates.ShowElement, { id: marker.getId() });
        if (App.state == AppStates.StarRepresentationChoice) {}
    };
    AppModule.prototype.handleMapIdle = function () {
        var _this = this;
        console.log("App handle map idle, mapLoaded : ", this.mapComponent.isMapLoaded);
        // showing InfoBarComponent make the map resized and so idle is triggered, 
        // but we're not interessed in this idling
        //if (this.isShowingInfoBarComponent) return;
        if (this.mode != AppModes.Map) return;
        //if (this.state  != AppStates.Normal)     return;
        // we need map to be loaded to get the radius of the viewport
        // and get the elements inside
        if (!this.mapComponent.isMapLoaded) {
            this.mapComponent.onMapLoaded.do(function () {
                _this.handleMapIdle();
            });
            return;
        } else {
            this.mapComponent.onMapLoaded.off(function () {
                _this.handleMapIdle();
            });
        }
        var updateInAllElementList = true;
        var forceRepaint = false;
        var zoom = this.mapComponent_.getZoom();
        var old_zoom = this.mapComponent_.getOldZoom();
        if (zoom != old_zoom && old_zoom != -1) {
            if (zoom > old_zoom) updateInAllElementList = false;
            forceRepaint = true;
        }
        this.elementModule.updateElementsToDisplay(updateInAllElementList, forceRepaint);
        //this.elementModule.updateElementsIcons(false);
        this.checkForNewElementsToRetrieve();
        this.historyModule.updateCurrState();
    };
    ;
    AppModule.prototype.checkForNewElementsToRetrieve = function () {
        var freeBounds = this.boundsModule.calculateFreeBounds();
        if (freeBounds && freeBounds.length > 0) this.ajaxModule.getElementsInBounds(freeBounds);
    };
    AppModule.prototype.handleMapClick = function () {
        if (this.isClicking) return;
        //console.log("handle Map Click", AppStates[this.state]);
        if (this.state == AppStates.ShowElement || this.state == AppStates.ShowElementAlone) this.infoBarComponent.hide();else if (this.state == AppStates.ShowDirections) this.setState(AppStates.ShowElement, { id: App.infoBarComponent.getCurrElementId() });
    };
    ;
    AppModule.prototype.handleSearchAction = function (address) {
        var _this = this;
        console.log("handle search action", address);
        this.geocoderModule_.geocodeAddress(address, function (results) {
            switch (App.state) {
                case AppStates.Normal:
                case AppStates.ShowElement:
                    _this.handleGeocodeResult(results);
                    _this.updateDocumentTitle();
                    break;
                case AppStates.ShowElementAlone:
                    _this.infoBarComponent.hide();
                    _this.handleGeocodeResult(results);
                    _this.updateDocumentTitle();
                    break;
                case AppStates.ShowDirections:
                    _this.setState(AppStates.ShowDirections, { id: _this.infoBarComponent.getCurrElementId() });
                    break;
            }
        });
    };
    ;
    AppModule.prototype.handleNewElementsReceivedFromServer = function (elementsJson) {
        if (!elementsJson || elementsJson.length === 0) return;
        //console.log("handleNewMarkersFromServer", elementsJson.length);
        var newElements = this.elementModule.addJsonElements(elementsJson, true);
        //console.log("new Elements length", newElements.length);
        // on add markerClusterGroup after first elements received
        if (newElements.length > 0) {
            this.elementModule.updateElementsToDisplay(true, true);
        }
    };
    ;
    AppModule.prototype.handleElementsChanged = function (result) {
        // console.log("handleElementsChanged toDisplay : ",result.elementsToDisplay.length);
        // console.log("handleElementsChanged new : ",result.newElements.length);
        // console.log("handleElementsChanged remove : ",result.elementsToRemove.length);
        var start = new Date().getTime();
        if (this.mode_ == AppModes.List) {
            this.elementListComponent.update(result);
        } else if (this.state != AppStates.ShowElementAlone) {
            var newMarkers = result.newElements.map(function (e) {
                return e.marker.getLeafletMarker();
            });
            var markersToRemove = result.elementsToRemove.filter(function (e) {
                return !e.isShownAlone;
            }).map(function (e) {
                return e.marker.getLeafletMarker();
            });
            this.mapComponent.addMarkers(newMarkers);
            this.mapComponent.removeMarkers(markersToRemove);
        }
        var end = new Date().getTime();
        //console.log("ElementsChanged in " + (end-start) + " ms");	
    };
    ;
    AppModule.prototype.handleInfoBarHide = function () {
        if (this.state != AppStates.StarRepresentationChoice && this.mode_ != AppModes.List) {
            this.setState(AppStates.Normal);
        }
    };
    ;
    AppModule.prototype.handleInfoBarShow = function (elementId) {
        //let statesToAvoid = [AppStates.ShowDirections,AppStates.ShowElementAlone,AppStates.StarRepresentationChoice];
        //if ($.inArray(this.state, statesToAvoid) == -1 ) this.setState(AppStates.ShowElement, {id: elementId});		
    };
    ;
    AppModule.prototype.updateMaxElements = function () {
        this.maxElementsToShowOnMap_ = Math.min(Math.floor($('#directory-content-map').width() * $('#directory-content-map').height() / 1000), 1000);
        //window.console.log("setting max elements " + this.maxElementsToShowOnMap_);
    };
    ;
    AppModule.prototype.setTimeoutClicking = function () {
        this.isClicking_ = true;
        var that = this;
        setTimeout(function () {
            that.isClicking_ = false;
        }, 100);
    };
    ;
    AppModule.prototype.setTimeoutInfoBarComponent = function () {
        this.isShowingInfoBarComponent_ = true;
        var that = this;
        setTimeout(function () {
            that.isShowingInfoBarComponent_ = false;
        }, 1300);
    };
    AppModule.prototype.updateDocumentTitle = function (options) {
        //console.log("updateDocumentTitle", this.infoBarComponent.getCurrElementId());
        if (options === void 0) {
            options = {};
        }
        var title;
        var elementName;
        if (options && options.id || this.infoBarComponent.getCurrElementId()) {
            var element = this.elementById(this.infoBarComponent.getCurrElementId());
            elementName = (0, _commons.capitalize)(element ? element.name : '');
        }
        if (this.mode_ == AppModes.List) {
            title = 'Liste des acteurs ' + this.getLocationAddressForTitle();
        } else {
            switch (this.state_) {
                case AppStates.ShowElement:
                    title = 'Acteur - ' + elementName;
                    break;
                case AppStates.ShowElementAlone:
                    title = 'Acteur - ' + elementName;
                    break;
                case AppStates.ShowDirections:
                    title = 'Itinéraire - ' + elementName;
                    break;
                case AppStates.Normal:
                    title = 'Carte des acteurs ' + this.getLocationAddressForTitle();
                    break;
            }
        }
        document.title = title;
    };
    ;
    AppModule.prototype.getLocationAddressForTitle = function () {
        if (this.geocoder.getLocationAddress()) {
            return "- " + this.geocoder.getLocationAddress();
        }
        return "- France";
    };
    // Getters shortcuts
    AppModule.prototype.map = function () {
        return this.mapComponent_ ? this.mapComponent_.getMap() : null;
    };
    ;
    AppModule.prototype.elements = function () {
        return this.elementsModule_.currVisibleElements();
    };
    ;
    AppModule.prototype.elementById = function (id) {
        return this.elementsModule_.getElementById(id);
    };
    ;
    Object.defineProperty(AppModule.prototype, "constellation", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModule.prototype, "currMainId", {
        get: function get() {
            return this.directoryMenuComponent.currentActiveMainOptionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModule.prototype, "isClicking", {
        get: function get() {
            return this.isClicking_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "isShowingInfoBarComponent", {
        get: function get() {
            return this.isShowingInfoBarComponent_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "maxElements", {
        get: function get() {
            return this.maxElementsToShowOnMap_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "mapComponent", {
        // Modules and components
        get: function get() {
            return this.mapComponent_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "infoBarComponent", {
        get: function get() {
            return this.infoBarComponent_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "geocoder", {
        get: function get() {
            return this.geocoderModule_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "ajaxModule", {
        get: function get() {
            return this.ajaxModule_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "elementModule", {
        get: function get() {
            return this.elementsModule_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "directionsModule", {
        get: function get() {
            return this.directionsModule_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "filterModule", {
        //get markerModule() { return this.markerModule_; };
        get: function get() {
            return this.filterModule_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "DEAModule", {
        //get SRCModule() { return this.starRepresentationChoiceModule_; };
        get: function get() {
            return this.displayElementAloneModule_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "state", {
        //get listElementModule() { return this.listElementModule_; };
        get: function get() {
            return this.state_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AppModule.prototype, "mode", {
        get: function get() {
            return this.mode_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return AppModule;
}();
exports.AppModule = AppModule;

},{"../commons/commons":1,"../commons/search-bar.component":2,"./app-interactions":3,"./components/directory-menu.component":12,"./components/element-list.component":13,"./components/element-menu.component":14,"./components/info-bar.component":15,"./components/map/map.component":17,"./components/vote.component":18,"./modules/ajax.module":19,"./modules/bounds.module":20,"./modules/categories.module":21,"./modules/directions.module":22,"./modules/display-element-alone.module":23,"./modules/elements.module":24,"./modules/filter.module":25,"./modules/geocoder.module":26,"./modules/history.module":27}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CategoryOptionTreeNodeType = exports.CategoryOptionTreeNodeType = undefined;
(function (CategoryOptionTreeNodeType) {
    CategoryOptionTreeNodeType[CategoryOptionTreeNodeType["Option"] = 0] = "Option";
    CategoryOptionTreeNodeType[CategoryOptionTreeNodeType["Category"] = 1] = "Category";
})(CategoryOptionTreeNodeType || (exports.CategoryOptionTreeNodeType = CategoryOptionTreeNodeType = {}));
/**
* Class representating a Node in the Directory Menu Tree
*
* A CategoryOptionTreeNode can be a Category or an Option
*/
var CategoryOptionTreeNode = function () {
    function CategoryOptionTreeNode(TYPE, DOM_ID, DOM_CHECKBOX_ID, DOM_CHILDREN_CLASS) {
        this.TYPE = TYPE;
        this.DOM_ID = DOM_ID;
        this.DOM_CHECKBOX_ID = DOM_CHECKBOX_ID;
        this.DOM_CHILDREN_CLASS = DOM_CHILDREN_CLASS;
        this.children = [];
        this.ownerId = null;
        // l'id de la mainOption, ou "all" pour une mainOption
        this.mainOwnerId = null;
        this.isChecked = true;
        this.isDisabled = false;
    }
    ;
    CategoryOptionTreeNode.prototype.getDom = function () {
        return $(this.DOM_ID + this.id);
    };
    CategoryOptionTreeNode.prototype.getDomCheckbox = function () {
        return $(this.DOM_CHECKBOX_ID + this.id);
    };
    CategoryOptionTreeNode.prototype.getDomChildren = function () {
        return this.getDom().next(this.DOM_CHILDREN_CLASS);
    };
    CategoryOptionTreeNode.prototype.getOwner = function () {
        if (this.TYPE == CategoryOptionTreeNodeType.Option) return App.categoryModule.getCategoryById(this.ownerId);
        if (this.TYPE == CategoryOptionTreeNodeType.Category) return App.categoryModule.getOptionById(this.ownerId);
        return null;
    };
    CategoryOptionTreeNode.prototype.disabledChildren = function () {
        return this.children.filter(function (child) {
            return child.isDisabled;
        });
    };
    CategoryOptionTreeNode.prototype.checkedChildren = function () {
        return this.children.filter(function (child) {
            return child.isChecked;
        });
    };
    CategoryOptionTreeNode.prototype.isOption = function () {
        return this.TYPE == CategoryOptionTreeNodeType.Option;
    };
    CategoryOptionTreeNode.prototype.isMainOption = function () {
        return false;
    };
    CategoryOptionTreeNode.prototype.setChecked = function (bool) {
        this.isChecked = bool;
        this.getDomCheckbox().prop("checked", bool);
    };
    CategoryOptionTreeNode.prototype.setDisabled = function (bool) {
        this.isDisabled = bool;
        if (bool) {
            if (!this.getDom().hasClass('disabled')) this.getDom().addClass('disabled');
            this.setChecked(false);
        } else {
            this.getDom().removeClass('disabled');
        }
    };
    CategoryOptionTreeNode.prototype.toggle = function (value, humanAction) {
        if (value === void 0) {
            value = null;
        }
        if (humanAction === void 0) {
            humanAction = true;
        }
        var check;
        if (value != null) check = value;else check = !this.isChecked;
        this.setChecked(check);
        this.setDisabled(!check);
        // in All mode, we clicks directly on the mainOption, but don't want to all checkbox in MainOptionFilter to disable
        if (!this.isMainOption()) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.toggle(check, false);
            }
        }
        if (this.mainOwnerId == 'openhours') App.categoryModule.updateOpenHoursFilter();
        if (humanAction) {
            if (this.getOwner()) this.getOwner().updateState();
            //if (App.mode == AppModes.Map) App.elementModule.updateElementsIcons(true);
            App.elementModule.updateElementsToDisplay(check, false, true);
            App.historyModule.updateCurrState();
        }
    };
    CategoryOptionTreeNode.prototype.updateState = function () {
        if (this.isMainOption()) return;
        if (this.children.length == 0) this.setDisabled(!this.isChecked);else {
            var disabledChildrenCount = this.children.filter(function (child) {
                return child.isDisabled;
            }).length;
            //console.log("Option " + this.name + " update state, nbre children disabled = ", disabledChildrenCount);
            if (disabledChildrenCount == this.children.length) this.setDisabled(true);else this.setDisabled(false);
            var checkedChildrenCount = this.children.filter(function (child) {
                return child.isChecked;
            }).length;
            if (checkedChildrenCount == this.children.length) this.setChecked(true);else this.setChecked(false);
        }
        if (this.getOwner()) this.getOwner().updateState();
    };
    CategoryOptionTreeNode.prototype.recursivelyUpdateStates = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.recursivelyUpdateStates();
        }
        this.updateState();
    };
    CategoryOptionTreeNode.prototype.isExpanded = function () {
        return this.getDom().hasClass('expanded');
    };
    CategoryOptionTreeNode.prototype.toggleChildrenDetail = function () {
        if (this.isExpanded()) {
            this.getDomChildren().stop(true, false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function complete() {
                    $(this).css('height', '');
                } });
            this.getDom().removeClass('expanded');
        } else {
            this.getDomChildren().stop(true, false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function complete() {
                    $(this).css('height', '');
                } });
            this.getDom().addClass('expanded');
        }
    };
    return CategoryOptionTreeNode;
}();
exports.CategoryOptionTreeNode = CategoryOptionTreeNode;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CategoryValue = function () {
    function CategoryValue(category) {
        this.children = [];
        this.category = category;
    }
    CategoryValue.prototype.addOptionValue = function (optionValue) {
        this.children.push(optionValue);
    };
    Object.defineProperty(CategoryValue.prototype, "isLastCategoryDepth", {
        get: function get() {
            return this.children.every(function (optionValue) {
                return optionValue.option.subcategories.length == 0;
            });
        },
        enumerable: true,
        configurable: true
    });
    return CategoryValue;
}();
exports.CategoryValue = CategoryValue;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Category = undefined;

var _categoryOptionTreeNode = require('./category-option-tree-node.class');

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Category = function (_super) {
    __extends(Category, _super);
    function Category($categoryJson) {
        var _this = _super.call(this, _categoryOptionTreeNode.CategoryOptionTreeNodeType.Category, '#category-', '#subcategorie-checkbox-', '.options-wrapper') || this;
        _this.id = $categoryJson.id;
        _this.name = $categoryJson.name;
        _this.index = $categoryJson.index;
        _this.singleOption = $categoryJson.single_option;
        _this.enableDescription = $categoryJson.enable_description;
        _this.displayCategoryName = $categoryJson.display_category_name;
        _this.depth = $categoryJson.depth;
        _this.mainOwnerId = $categoryJson.mainOwnerId;
        return _this;
    }
    Category.prototype.addOption = function ($option) {
        this.children.push($option);
    };
    Object.defineProperty(Category.prototype, "options", {
        get: function get() {
            return this.children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "disabledOptions", {
        get: function get() {
            return this.disabledChildren();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "checkedOptions", {
        get: function get() {
            return this.checkedChildren();
        },
        enumerable: true,
        configurable: true
    });
    return Category;
}(_categoryOptionTreeNode.CategoryOptionTreeNode);
exports.Category = Category;

},{"./category-option-tree-node.class":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _category = require("./category.class");

Object.defineProperty(exports, "Category", {
  enumerable: true,
  get: function get() {
    return _category.Category;
  }
});

var _element = require("./element.class");

Object.defineProperty(exports, "Element", {
  enumerable: true,
  get: function get() {
    return _element.Element;
  }
});

var _option = require("./option.class");

Object.defineProperty(exports, "Option", {
  enumerable: true,
  get: function get() {
    return _option.Option;
  }
});

var _optionValue = require("./option-value.class");

Object.defineProperty(exports, "OptionValue", {
  enumerable: true,
  get: function get() {
    return _optionValue.OptionValue;
  }
});

var _categoryValue = require("./category-value.class");

Object.defineProperty(exports, "CategoryValue", {
  enumerable: true,
  get: function get() {
    return _categoryValue.CategoryValue;
  }
});

},{"./category-value.class":6,"./category.class":7,"./element.class":9,"./option-value.class":10,"./option.class":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Element = exports.ElementStatus = undefined;

var _app = require("../app.module");

var _biopenMarker = require("../components/map/biopen-marker.component");

var _classes = require("./classes");

var ElementStatus = exports.ElementStatus = undefined; /**
                                                        * This file is part of the MonVoisinFaitDuBio project.
                                                        * For the full copyright and license information, please view the LICENSE
                                                        * file that was distributed with this source code.
                                                        *
                                                        * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
                                                        * @license    MIT License
                                                        * @Last Modified time: 2016-12-13
                                                        */

(function (ElementStatus) {
    ElementStatus[ElementStatus["ModerationNeeded"] = -1] = "ModerationNeeded";
    ElementStatus[ElementStatus["Pending"] = 0] = "Pending";
    ElementStatus[ElementStatus["AdminValidate"] = 1] = "AdminValidate";
    ElementStatus[ElementStatus["CollaborativeValidate"] = 2] = "CollaborativeValidate";
})(ElementStatus || (exports.ElementStatus = ElementStatus = {}));
var Element = function () {
    function Element(elementJson) {
        this.openHoursDays = [];
        this.mainOptionOwnerIds = [];
        this.optionsValues = [];
        this.optionValuesByCatgeory = [];
        this.iconsToDisplay = [];
        this.formatedOpenHours_ = null;
        this.isInitialized_ = false;
        // for elements module algorithms
        this.isDisplayed = false;
        this.isVisible_ = false;
        this.isInElementList = false;
        //TODO
        this.biopenMarker_ = null;
        this.htmlRepresentation_ = '';
        this.productsToDisplay_ = {};
        this.starChoiceForRepresentation = '';
        this.isShownAlone = false;
        this.isFavorite = false;
        this.needToBeUpdatedWhenShown = true;
        this.id = elementJson.id;
        this.status = elementJson.status;
        this.name = elementJson.o[0];
        this.position = L.latLng(elementJson.o[1], elementJson.o[2]);
        this.address = elementJson.address;
        this.description = elementJson.description || '';
        this.tel = elementJson.tel ? elementJson.tel.replace(/(.{2})(?!$)/g, "$1 ") : '';
        this.webSite = elementJson.webSite;
        this.mail = elementJson.mail;
        this.openHours = elementJson.openHours;
        this.openHoursMoreInfos = elementJson.openHoursMoreInfos;
        // initialize formated open hours
        this.getFormatedOpenHours();
        var newOption, ownerId;
        for (var _i = 0, _a = elementJson.v; _i < _a.length; _i++) {
            var optionValueJson = _a[_i];
            newOption = new _classes.OptionValue(optionValueJson);
            //ownerId = newOption.option.mainOwnerId;
            if (newOption.option.isMainOption()) this.mainOptionOwnerIds.push(newOption.optionId);
            //if (this.mainOptionOwnerIds.indexOf(ownerId) == -1) 
            this.optionsValues.push(newOption);
            // put options value in specific easy accessible array for better performance
            if (!this.optionValuesByCatgeory[newOption.option.ownerId]) this.optionValuesByCatgeory[newOption.option.ownerId] = [];
            this.optionValuesByCatgeory[newOption.option.ownerId].push(newOption);
        }
        this.distance = elementJson.distance ? Math.round(elementJson.distance) : null;
    }
    Element.prototype.getOptionValueByCategoryId = function ($categoryId) {
        return this.optionValuesByCatgeory[$categoryId] || [];
    };
    Element.prototype.initialize = function () {
        this.createOptionsTree();
        this.updateIconsToDisplay();
        this.biopenMarker_ = new _biopenMarker.BiopenMarker(this.id, this.position);
        this.isInitialized_ = true;
    };
    Element.prototype.show = function () {
        if (!this.isInitialized_) this.initialize();
        //this.update();
        //this.biopenMarker_.update();
        this.biopenMarker_.show();
        this.isVisible_ = true;
    };
    ;
    Element.prototype.hide = function () {
        if (this.biopenMarker_ && App.mode == _app.AppModes.Map) this.biopenMarker_.hide();
        this.isVisible_ = false;
        // unbound events (click etc...)?
        //if (constellationMode) $('#directory-content-list #element-info-'+this.id).hide();
    };
    ;
    Element.prototype.update = function ($force) {
        if ($force === void 0) {
            $force = false;
        }
        //console.log("marker update needToBeUpdated", this.needToBeUpdatedWhenShown);
        if (this.needToBeUpdatedWhenShown || App.mode == _app.AppModes.List || $force) {
            this.updateIconsToDisplay();
            var optionValuesToUpdate = this.getCurrOptionsValues().filter(function (optionValue) {
                return optionValue.isFilledByFilters;
            });
            optionValuesToUpdate.push(this.getCurrMainOptionValue());
            for (var _i = 0, optionValuesToUpdate_1 = optionValuesToUpdate; _i < optionValuesToUpdate_1.length; _i++) {
                var optionValue = optionValuesToUpdate_1[_i];
                this.updateOwnerColor(optionValue);
            }
            this.colorOptionId = this.iconsToDisplay.length > 0 && this.getIconsToDisplay()[0] ? this.getIconsToDisplay()[0].colorOptionId : null;
            if (this.marker) this.marker.update();
            this.needToBeUpdatedWhenShown = false;
        }
    };
    Element.prototype.updateOwnerColor = function ($optionValue) {
        if (!$optionValue) return;
        //console.log("updateOwnerColor", $optionValue.option.name);
        if ($optionValue.option.useColorForMarker) {
            $optionValue.colorOptionId = $optionValue.optionId;
        } else {
            var option = void 0;
            var category = void 0;
            var colorId = null;
            var siblingsOptionsForColoring = this.getCurrOptionsValues().filter(function (optionValue) {
                return optionValue.isFilledByFilters && optionValue.option.useColorForMarker && optionValue.option.ownerId !== $optionValue.option.ownerId && optionValue.categoryOwner.ownerId == $optionValue.categoryOwner.ownerId;
            });
            //console.log("siblingsOptionsForColoring", siblingsOptionsForColoring.map( (op) => op.option.name));
            if (siblingsOptionsForColoring.length > 0) {
                option = siblingsOptionsForColoring.shift().option;
                //console.log("-> sibling found : ", option.name);
                colorId = option.id;
            } else {
                option = $optionValue.option;
                //console.log("no siblings, looking for parent");
                while (colorId == null && option) {
                    category = option.getOwner();
                    if (category) {
                        option = category.getOwner();
                        //console.log("->parent option" + option.name + " usecolorForMarker", option.useColorForMarker);
                        colorId = option.useColorForMarker ? option.id : null;
                    }
                }
            }
            $optionValue.colorOptionId = colorId;
        }
    };
    Element.prototype.getCurrOptionsValues = function () {
        return this.optionsValues.filter(function (optionValue) {
            return optionValue.option.mainOwnerId == App.currMainId;
        });
    };
    Element.prototype.getCurrMainOptionValue = function () {
        return this.optionsValues.filter(function (optionValue) {
            return optionValue.option.id == App.currMainId;
        }).shift();
    };
    Element.prototype.getCategoriesIds = function () {
        return this.getCurrOptionsValues().map(function (optionValue) {
            return optionValue.categoryOwner.id;
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    };
    Element.prototype.getOptionsIdsInCategorieId = function (categoryId) {
        return this.getCurrOptionsValues().filter(function (optionValue) {
            return optionValue.option.ownerId == categoryId;
        }).map(function (optionValue) {
            return optionValue.optionId;
        });
    };
    Element.prototype.createOptionsTree = function () {
        this.optionTree = new _classes.OptionValue({});
        var mainCategory = App.categoryModule.mainCategory;
        this.recusivelyCreateOptionTree(mainCategory, this.optionTree);
    };
    Element.prototype.getOptionTree = function () {
        if (this.optionTree) return this.optionTree;
        this.createOptionsTree();
        return this.optionTree;
    };
    Element.prototype.recusivelyCreateOptionTree = function (category, optionValue) {
        var categoryValue = new _classes.CategoryValue(category);
        for (var _i = 0, _a = category.options; _i < _a.length; _i++) {
            var option = _a[_i];
            var childOptionValue = this.fillOptionId(option.id);
            if (childOptionValue) {
                categoryValue.addOptionValue(childOptionValue);
                for (var _b = 0, _c = option.subcategories; _b < _c.length; _b++) {
                    var subcategory = _c[_b];
                    this.recusivelyCreateOptionTree(subcategory, childOptionValue);
                }
            }
        }
        if (categoryValue.children.length > 0) {
            categoryValue.children.sort(function (a, b) {
                return a.index - b.index;
            });
            optionValue.addCategoryValue(categoryValue);
        }
    };
    Element.prototype.fillOptionId = function ($optionId) {
        var index = this.optionsValues.map(function (value) {
            return value.optionId;
        }).indexOf($optionId);
        if (index == -1) return null;
        return this.optionsValues[index];
    };
    Element.prototype.getIconsToDisplay = function () {
        var result = this.iconsToDisplay;
        return result.sort(function (a, b) {
            return a.isFilledByFilters ? -1 : 1;
        });
    };
    Element.prototype.updateIconsToDisplay = function () {
        this.checkForDisabledOptionValues();
        if (App.currMainId == 'all') this.iconsToDisplay = this.recursivelySearchIconsToDisplay(this.getOptionTree(), false);else this.iconsToDisplay = this.recursivelySearchIconsToDisplay(this.getCurrMainOptionValue());
        // in case of no OptionValue in this mainOption, we display the mainOption Icon
        if (this.iconsToDisplay.length == 0) {
            this.iconsToDisplay.push(this.getCurrMainOptionValue());
        }
        //console.log("Icons to display sorted", this.getIconsToDisplay());
    };
    Element.prototype.recursivelySearchIconsToDisplay = function (parentOptionValue, recursive) {
        if (recursive === void 0) {
            recursive = true;
        }
        if (!parentOptionValue) return [];
        var resultOptions = [];
        for (var _i = 0, _a = parentOptionValue.children; _i < _a.length; _i++) {
            var categoryValue = _a[_i];
            for (var _b = 0, _c = categoryValue.children; _b < _c.length; _b++) {
                var optionValue = _c[_b];
                var result = [];
                if (recursive) {
                    result = this.recursivelySearchIconsToDisplay(optionValue) || [];
                    resultOptions = resultOptions.concat(result);
                }
                if (result.length == 0 && optionValue.option.useIconForMarker) {
                    resultOptions.push(optionValue);
                }
            }
        }
        return resultOptions;
    };
    Element.prototype.checkForDisabledOptionValues = function () {
        this.recursivelyCheckForDisabledOptionValues(this.getOptionTree(), App.currMainId == 'all');
    };
    Element.prototype.recursivelyCheckForDisabledOptionValues = function (optionValue, noRecursive) {
        if (noRecursive === void 0) {
            noRecursive = true;
        }
        var isEveryCategoryContainsOneOptionNotdisabled = true;
        //console.log("checkForDisabledOptionValue Norecursive : " + noRecursive, optionValue);
        for (var _i = 0, _a = optionValue.children; _i < _a.length; _i++) {
            var categoryValue = _a[_i];
            var isSomeOptionNotdisabled = false;
            for (var _b = 0, _c = categoryValue.children; _b < _c.length; _b++) {
                var suboptionValue = _c[_b];
                if (suboptionValue.children.length == 0 || noRecursive) {
                    //console.log("bottom option " + suboptionValue.option.name,suboptionValue.option.isChecked );
                    suboptionValue.isFilledByFilters = suboptionValue.option.isChecked;
                } else {
                    this.recursivelyCheckForDisabledOptionValues(suboptionValue, noRecursive);
                }
                if (suboptionValue.isFilledByFilters) isSomeOptionNotdisabled = true;
            }
            if (!isSomeOptionNotdisabled) isEveryCategoryContainsOneOptionNotdisabled = false;
        }
        if (optionValue.option) {
            //console.log("OptionValue " + optionValue.option.name + " : isEveryCategoyrContainOnOption", isEveryCategoryContainsOneOptionNotdisabled );
            optionValue.isFilledByFilters = isEveryCategoryContainsOneOptionNotdisabled;
            if (!optionValue.isFilledByFilters) optionValue.setRecursivelyFilledByFilters(optionValue.isFilledByFilters);
        }
    };
    Element.prototype.updateProductsRepresentation = function () {
        // if (App.state !== AppStates.Constellation) return;
        // let starNames = App.constellation.getStarNamesRepresentedByElementId(this.id);
        // if (this.isProducteurOrAmap())
        // {
        // 	for(let i = 0; i < this.products.length;i++)
        // 	{
        // 		productName = this.products[i].nameFormate;			
        // 		if ($.inArray(productName, starNames) == -1)
        // 		{
        // 			this.products[i].disabled = true;				
        // 			if (productName == this.mainProduct) this.mainProductIsDisabled = true;				
        // 		}	
        // 		else
        // 		{
        // 			this.products[i].disabled = false;				
        // 			if (productName == this.mainProduct) this.mainProductIsDisabled = false;		
        // 		}		
        // 	}
        // }
        // else
        // {
        // 	if (starNames.length === 0) this.mainProductIsDisabled = true;	
        // 	else this.mainProductIsDisabled = false;	
        // }
    };
    ;
    Element.prototype.updateDistance = function () {
        this.distance = null;
        if (App.geocoder.getLocation()) this.distance = App.mapComponent.distanceFromLocationTo(this.position);else if (App.mapComponent.getCenter()) this.distance = App.mapComponent.getCenter().distanceTo(this.position);
        // distance vol d'oiseau, on arrondi et on l'augmente un peu
        this.distance = this.distance ? Math.round(1.2 * this.distance) : null;
    };
    Element.prototype.isPending = function () {
        return this.status === ElementStatus.Pending;
    };
    Element.prototype.getHtmlRepresentation = function () {
        this.update();
        //let starNames = App.state == AppStates.Constellation ? App.constellation.getStarNamesRepresentedByElementId(this.id) : [];
        var starNames = [];
        var optionstoDisplay = this.getIconsToDisplay();
        //console.log("GetHtmlRepresentation " + this.distance + " km", this.getOptionTree().children[0]);
        var html = Twig.render(biopen_twigJs_elementInfo, {
            element: this,
            showDistance: App.geocoder.getLocation() ? true : false,
            listingMode: App.mode == _app.AppModes.List,
            optionsToDisplay: optionstoDisplay,
            allOptionsValues: this.getCurrOptionsValues().filter(function (oV) {
                return oV.option.displayOption;
            }).sort(function (a, b) {
                return a.isFilledByFilters ? -1 : 1;
            }),
            mainOptionValueToDisplay: optionstoDisplay[0],
            otherOptionsValuesToDisplay: optionstoDisplay.slice(1),
            starNames: starNames,
            mainCategoryValue: this.getOptionTree().children[0],
            pendingClass: this.isPending() ? 'pending' : ''
        });
        this.htmlRepresentation_ = html;
        return html;
    };
    ;
    Element.prototype.getFormatedOpenHours = function () {
        if (this.formatedOpenHours_ === null) {
            this.formatedOpenHours_ = {};
            var new_key = void 0,
                new_key_translated = void 0,
                newDailySlot = void 0;
            for (var key in this.openHours) {
                new_key = key.split('_')[1];
                new_key_translated = this.translateDayKey(new_key);
                newDailySlot = this.formateDailyTimeSlot(this.openHours[key]);
                if (newDailySlot) {
                    this.formatedOpenHours_[new_key_translated] = newDailySlot;
                    this.openHoursDays.push(new_key_translated);
                }
            }
        }
        return this.formatedOpenHours_;
    };
    ;
    Element.prototype.translateDayKey = function (dayKey) {
        switch (dayKey) {
            case 'monday':
                return 'lundi';
            case 'tuesday':
                return 'mardi';
            case 'wednesday':
                return 'mercredi';
            case 'thursday':
                return 'jeudi';
            case 'friday':
                return 'vendredi';
            case 'saturday':
                return 'samedi';
            case 'sunday':
                return 'dimanche';
        }
        return '';
    };
    Element.prototype.formateDailyTimeSlot = function (dailySlot) {
        if (dailySlot === null) {
            return 'fermé';
        }
        var result = '';
        if (dailySlot.slot1start) {
            result += this.formateDate(dailySlot.slot1start);
            result += ' - ';
            result += this.formateDate(dailySlot.slot1end);
        }
        if (dailySlot.slot2start) {
            result += ' et ';
            result += this.formateDate(dailySlot.slot2start);
            result += ' - ';
            result += this.formateDate(dailySlot.slot2end);
        }
        return result;
    };
    ;
    Element.prototype.formateDate = function (date) {
        if (!date) return;
        return date.split('T')[1].split(':00+0100')[0];
    };
    ;
    Element.prototype.isCurrentStarChoiceRepresentant = function () {
        if (this.starChoiceForRepresentation !== '') {
            var elementStarId = App.constellation.getStarFromName(this.starChoiceForRepresentation).getElementId();
            return this.id == elementStarId;
        }
        return false;
    };
    ;
    Object.defineProperty(Element.prototype, "marker", {
        // --------------------------------------------
        //            SETTERS GETTERS
        // ---------------------------------------------
        get: function get() {
            // initialize = initialize || false;
            // if (initialize) this.initialize();
            return this.biopenMarker_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Element.prototype, "isVisible", {
        get: function get() {
            return this.isVisible_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Element.prototype, "isInitialized", {
        get: function get() {
            return this.isInitialized_;
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Element;
}();
exports.Element = Element;

},{"../app.module":4,"../components/map/biopen-marker.component":16,"./classes":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var OptionValue = function () {
    function OptionValue($optionValueJson) {
        this.option_ = null;
        this.isFilledByFilters = true;
        this.children = [];
        this.colorOptionId = null;
        this.optionId = $optionValueJson[0];
        this.index = $optionValueJson[1];
        this.description = $optionValueJson.length == 3 ? $optionValueJson[2] : '';
    }
    Object.defineProperty(OptionValue.prototype, "option", {
        get: function get() {
            if (this.option_) return this.option_;
            return this.option_ = App.categoryModule.getOptionById(this.optionId);
        },
        enumerable: true,
        configurable: true
    });
    OptionValue.prototype.setRecursivelyFilledByFilters = function (bool) {
        this.isFilledByFilters = bool;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var categoryValue = _a[_i];
            for (var _b = 0, _c = categoryValue.children; _b < _c.length; _b++) {
                var suboptionValue = _c[_b];
                suboptionValue.setRecursivelyFilledByFilters(bool);
            }
        }
    };
    Object.defineProperty(OptionValue.prototype, "categoryOwner", {
        get: function get() {
            return this.option.getOwner();
        },
        enumerable: true,
        configurable: true
    });
    OptionValue.prototype.addCategoryValue = function (categoryValue) {
        this.children.push(categoryValue);
    };
    return OptionValue;
}();
exports.OptionValue = OptionValue;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Option = undefined;

var _categoryOptionTreeNode = require('./category-option-tree-node.class');

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Option = function (_super) {
    __extends(Option, _super);
    function Option($optionJson) {
        var _this = _super.call(this, _categoryOptionTreeNode.CategoryOptionTreeNodeType.Option, '#option-', '#option-checkbox-', '.subcategories-wrapper') || this;
        _this.myOwnerColorId = null;
        _this.id = $optionJson.id;
        _this.name = $optionJson.name;
        _this.index = $optionJson.index;
        _this.nameShort = $optionJson.name_short;
        _this.color = $optionJson.color;
        _this.icon = $optionJson.icon;
        _this.useIconForMarker = $optionJson.use_icon_for_marker;
        _this.useColorForMarker = $optionJson.use_color_for_marker;
        _this.showOpenHours = $optionJson.show_open_hours;
        _this.displayOption = $optionJson.display_option;
        return _this;
    }
    Option.prototype.addCategory = function ($category) {
        this.children.push($category);
    };
    Option.prototype.isMainOption = function () {
        return this.getOwner() ? this.getOwner().depth == 0 : false;
    };
    Option.prototype.isCollapsible = function () {
        return this.getDom().hasClass('option-collapsible');
    };
    Object.defineProperty(Option.prototype, "subcategories", {
        get: function get() {
            return this.children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "allChildrenOptions", {
        get: function get() {
            return this.recursivelyGetChildrenOption(this);
        },
        enumerable: true,
        configurable: true
    });
    Option.prototype.recursivelyGetChildrenOption = function (parentOption) {
        var resultOptions = [];
        for (var _i = 0, _a = parentOption.subcategories; _i < _a.length; _i++) {
            var cat = _a[_i];
            resultOptions = resultOptions.concat(cat.options);
            for (var _b = 0, _c = cat.options; _b < _c.length; _b++) {
                var option = _c[_b];
                resultOptions = resultOptions.concat(this.recursivelyGetChildrenOption(option));
            }
        }
        return resultOptions;
    };
    return Option;
}(_categoryOptionTreeNode.CategoryOptionTreeNode);
exports.Option = Option;

},{"./category-option-tree-node.class":5}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DirectoryMenuComponent = undefined;

var _appInteractions = require("../app-interactions");

var DirectoryMenuComponent = function () {
    function DirectoryMenuComponent() {
        this.currentActiveMainOptionId = null;
        this.initialize();
    }
    DirectoryMenuComponent.prototype.initialize = function () {
        // -------------------------------
        // ------ SEARCH BAR -------------
        // -------------------------------
        $('#search-bar').on("search", function (event, address) {
            // if (App.state == AppStates.Constellation) redirectToDirectory('biopen_constellation', address, $('#search-distance-input').val());
            // else 
            App.geocoder.geocodeAddress(address, function (results) {
                //App.handleGeocoding(results);
                $('#search-bar').val(results[0].getFormattedAddress());
            }, function (results) {
                $('#search-bar').addClass('invalid');
            });
            // If Menu take all available width (in case of small mobile)
            if ($('#directory-menu').outerWidth() == $(window).outerWidth()) {
                // then we hide menu to show search result
                (0, _appInteractions.hideDirectoryMenu)();
            }
        });
        // affiche une petite ombre sous le titre menu quand on scroll
        // (uniquement visible sur petts écrans)
        // $("#directory-menu-main-container").scroll(function() 
        // {
        //   if ($(this).scrollTop() > 0) {
        //     $('#menu-title .shadow-bottom').show();
        //   } else {
        //     $('#menu-title .shadow-bottom').hide();
        //   }
        // });
        // -------------------------------
        // --------- FAVORITE-------------
        // -------------------------------
        $('#filter-favorite').click(function (e) {
            var favoriteCheckbox = $('#favorite-checkbox');
            var checkValue = !favoriteCheckbox.is(':checked');
            App.filterModule.showOnlyFavorite(checkValue);
            App.elementModule.updateElementsToDisplay(!checkValue);
            favoriteCheckbox.prop('checked', checkValue);
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        $('#filter-favorite').tooltip();
        // -------------------------------
        // --------- PENDING-------------
        // -------------------------------
        $('#filter-pending').click(function (e) {
            var pendingCheckbox = $('#pending-checkbox');
            var checkValue = !pendingCheckbox.is(':checked');
            App.filterModule.showPending(checkValue);
            App.elementModule.updateElementsToDisplay(checkValue);
            pendingCheckbox.prop('checked', checkValue);
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        $('#filter-pending').tooltip();
        // -------------------------------
        // ------ MAIN OPTIONS -----------
        // -------------------------------
        var that = this;
        $('.main-categories .main-icon').click(function (e) {
            var optionId = $(this).attr('data-option-id');
            that.setMainOption(optionId);
        });
        // ----------------------------------
        // ------ CATEGORIES ----------------
        // ----------------------------------
        $('.subcategory-item .name-wrapper').click(function () {
            var categoryId = $(this).attr('data-category-id');
            App.categoryModule.getCategoryById(categoryId).toggleChildrenDetail();
        });
        $('.subcategory-item .checkbox-wrapper').click(function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            var categoryId = $(this).attr('data-category-id');
            App.categoryModule.getCategoryById(categoryId).toggle();
        });
        // -------------------------------
        // ------ SUB OPTIONS ------------
        // -------------------------------
        $('.subcategorie-option-item:not(#filter-favorite):not(#filter-pending) .icon-name-wrapper').click(function (e) {
            var optionId = $(this).attr('data-option-id');
            var option = App.categoryModule.getOptionById(optionId);
            option.isCollapsible() ? option.toggleChildrenDetail() : option.toggle();
        });
        $('.subcategorie-option-item:not(#filter-favorite):not(#filter-pending) .checkbox-wrapper').click(function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            var optionId = $(this).attr('data-option-id');
            App.categoryModule.getOptionById(optionId).toggle();
        });
    };
    DirectoryMenuComponent.prototype.setMainOption = function (optionId) {
        if (this.currentActiveMainOptionId == optionId) return;
        if (this.currentActiveMainOptionId != null) App.elementModule.clearCurrentsElement();
        var oldId = this.currentActiveMainOptionId;
        this.currentActiveMainOptionId = optionId;
        if (optionId == 'all') {
            $('#menu-subcategories-title').text("Tous les acteurs");
            $('#open-hours-filter').hide();
        } else {
            var mainOption = App.categoryModule.getMainOptionById(optionId);
            $('#menu-subcategories-title').text(mainOption.name);
            if (mainOption.showOpenHours) $('#open-hours-filter').show();else $('#open-hours-filter').hide();
        }
        this.updateMainOptionBackground();
        //console.log("setMainOptionId " + optionId + " / oldOption : " + oldId);
        if (oldId != null) App.historyModule.updateCurrState();
        App.elementListComponent.reInitializeElementToDisplayLength();
        App.boundsModule.updateFilledBoundsAccordingToNewMainOptionId();
        App.checkForNewElementsToRetrieve();
        App.elementModule.updateElementsToDisplay(true, true, true);
    };
    DirectoryMenuComponent.prototype.updateMainOptionBackground = function () {
        var optionId = this.currentActiveMainOptionId;
        if (!$('#directory-menu').is(':visible')) {
            console.log("directory not visible");
            return;
        }
        $('#active-main-option-background').animate({ top: $('#main-option-icon-' + optionId).position().top }, 500, 'easeOutQuart');
        $('.main-option-subcategories-container').hide();
        $('#main-option-' + optionId).fadeIn(600);
        $('.main-categories .main-icon').removeClass('active');
        $('#main-option-icon-' + optionId).addClass('active');
    };
    return DirectoryMenuComponent;
}();
exports.DirectoryMenuComponent = DirectoryMenuComponent;

},{"../app-interactions":3}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ElementListComponent = undefined;

var _commons = require("../../commons/commons");

var _elementMenu = require("./element-menu.component");

var _vote = require("../components/vote.component");

var ElementListComponent = function () {
    function ElementListComponent() {
        //onShow = new Event<number>();
        // Number of element in one list
        this.ELEMENT_LIST_SIZE_STEP = 15;
        // Basicly we display 1 ELEMENT_LIST_SIZE_STEP, but if user need
        // for, we display an others ELEMENT_LIST_SIZE_STEP more
        this.stepsCount = 1;
        this.isListFull = false;
        // last request was send with this distance
        this.lastDistanceRequest = 10;
        this.isInitialized = false;
        // detect when user reach bottom of list
        var that = this;
        $('#directory-content-list ul').on('scroll', function (e) {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                that.handleBottom();
            }
        });
    }
    ElementListComponent.prototype.update = function ($elementsResult) {
        if ($elementsResult.elementsToDisplay.length == 0) this.stepsCount = 1;
        this.clear();
        this.draw($elementsResult.elementsToDisplay, false);
        var address = App.geocoder.lastAddressRequest;
        if (address) this.setTitle(' autour de <i>' + (0, _commons.capitalize)((0, _commons.unslugify)(address))) + '</i>';else this.setTitle(' autour du centre de la carte');
    };
    ElementListComponent.prototype.setTitle = function ($value) {
        $('.element-list-title-text').html($value);
    };
    ElementListComponent.prototype.clear = function () {
        $('#directory-content-list li').remove();
    };
    ElementListComponent.prototype.currElementsDisplayed = function () {
        return $('#directory-content-list li').length;
    };
    ElementListComponent.prototype.reInitializeElementToDisplayLength = function () {
        this.clear();
        $('#directory-content-list ul').animate({ scrollTop: '0' }, 0);
        this.stepsCount = 1;
    };
    ElementListComponent.prototype.draw = function ($elementList, $animate) {
        //console.log('ElementList draw', $elementList.length);
        if ($animate === void 0) {
            $animate = false;
        }
        var element;
        var elementsToDisplay = $elementList;
        for (var _i = 0, elementsToDisplay_1 = elementsToDisplay; _i < elementsToDisplay_1.length; _i++) {
            element = elementsToDisplay_1[_i];
            element.updateDistance();
        }
        elementsToDisplay.sort(this.compareDistance);
        var maxElementsToDisplay = this.ELEMENT_LIST_SIZE_STEP * this.stepsCount;
        var endIndex = Math.min(maxElementsToDisplay, elementsToDisplay.length);
        // if the list is not full, we send ajax request
        if (elementsToDisplay.length < maxElementsToDisplay) {
            // expand bounds
            App.boundsModule.extendBounds(0.5);
            App.checkForNewElementsToRetrieve();
        } else {
            //console.log("list is full");
            this.isListFull = true;
        }
        for (var i = 0; i < endIndex; i++) {
            element = elementsToDisplay[i];
            $('#directory-content-list ul').append(element.getHtmlRepresentation());
            var domMenu = $('#element-info-' + element.id + ' .menu-element');
            (0, _elementMenu.createListenersForElementMenu)(domMenu);
            (0, _elementMenu.updateFavoriteIcon)(domMenu, element);
        }
        (0, _vote.createListenersForVoting)();
        if ($animate) {
            $('#directory-content-list ul').animate({ scrollTop: '0' }, 500);
        }
        $('#directory-content-list ul').collapsible({
            accordion: true
        });
        $('.element-list-title-number-results').text('(' + elementsToDisplay.length + ')');
    };
    ElementListComponent.prototype.handleBottom = function () {
        if (this.isListFull) {
            this.stepsCount++;
            //console.log("bottom reached");
            this.isListFull = false;
            this.clear();
            this.draw(App.elements());
        }
    };
    ElementListComponent.prototype.compareDistance = function (a, b) {
        if (a.distance == b.distance) return 0;
        return a.distance < b.distance ? -1 : 1;
    };
    return ElementListComponent;
}();
exports.ElementListComponent = ElementListComponent;

},{"../../commons/commons":1,"../components/vote.component":18,"./element-menu.component":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeElementMenu = initializeElementMenu;
exports.updateFavoriteIcon = updateFavoriteIcon;
exports.showFullTextMenu = showFullTextMenu;
exports.createListenersForElementMenu = createListenersForElementMenu;
exports.getCurrentElementIdShown = getCurrentElementIdShown;
exports.getCurrentElementInfoBarShown = getCurrentElementInfoBarShown;

var _app = require("../app.module");

var _commons = require("../../commons/commons");

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function initializeElementMenu() {
    //   MENU PROVIDER
    var menu_element = $('#element-info-bar .menu-element');
    createListenersForElementMenu(menu_element);
    $('#popup-delete-element #select-reason').material_select();
    $('#modal-vote #select-vote').material_select();
    // button to confirm calculate idrections in modal pick address for directions
    $('#modal-pick-address #btn-calculate-directions').click(function () {
        var address = $('#modal-pick-address input').val();
        if (address) {
            App.geocoder.geocodeAddress(address, function () {
                $("#modal-pick-address .modal-error-msg").hide();
                $('#modal-pick-address').closeModal();
                App.searchBarComponent.setValue(address);
                App.setState(_app.AppStates.ShowDirections, { id: getCurrentElementIdShown() });
            }, function () {
                $("#modal-pick-address .modal-error-msg").show();
            });
        } else {
            $('#modal-pick-address input').addClass('invalid');
        }
    });
}
function deleteElement() {
    if (grecaptcha.getResponse().length === 0) {
        $('#captcha-error-message').show();
        grecaptcha.reset();
    } else {
        $('#captcha-error-message').hide();
        $('#popup-delete-element').closeModal();
    }
}
function onloadCaptcha() {
    grecaptcha.render('captcha', {
        'sitekey': '6LcEViUTAAAAAOEMpFCyLHwPG1vJqExuyD4n1Lbw'
    });
}
function updateFavoriteIcon(object, element) {
    if (!element.isFavorite) {
        object.find('.item-add-favorite').show();
        object.find('.item-remove-favorite').hide();
    } else {
        object.find('.item-add-favorite').hide();
        object.find('.item-remove-favorite').show();
    }
}
function showFullTextMenu(object, bool) {
    if (bool) {
        object.addClass("full-text");
        object.find('.tooltipped').tooltip('remove');
    } else {
        object.removeClass("full-text");
        object.find('.tooltipped').tooltip();
    }
}
function createListenersForElementMenu(object) {
    object.find('.tooltipped').tooltip();
    object.find('.item-edit').click(function () {
        window.location.href = Routing.generate('biopen_element_edit', { id: getCurrentElementIdShown() });
    });
    object.find('.item-delete').click(function () {
        var element = App.elementModule.getElementById(getCurrentElementIdShown());
        //window.console.log(element.name);
        $('#popup-delete-element .elementName').text((0, _commons.capitalize)(element.name));
        $('#popup-delete-element').openModal({
            dismissible: true,
            opacity: 0.5,
            in_duration: 300,
            out_duration: 200
        });
    });
    object.find('.item-directions').click(function () {
        var element = App.elementModule.getElementById(getCurrentElementIdShown());
        if (App.state !== _app.AppStates.Constellation && !App.geocoder.getLocation()) {
            var modal = $('#modal-pick-address');
            modal.find(".modal-footer").attr('option-id', element.colorOptionId);
            modal.openModal({
                dismissible: true,
                opacity: 0.5,
                in_duration: 300,
                out_duration: 200
            });
        } else App.setState(_app.AppStates.ShowDirections, { id: getCurrentElementIdShown() });
    });
    object.find('.item-share').click(function () {
        var element = App.elementModule.getElementById(getCurrentElementIdShown());
        var modal = $('#modal-share-element');
        modal.find(".modal-footer").attr('option-id', element.colorOptionId);
        //modal.find(".input-simple-modal").removeClass().addClass("input-simple-modal " + element.colorOptionId);
        var url;
        if (App.mode == _app.AppModes.Map) {
            url = window.location.href;
        } else {
            url = Routing.generate('biopen_directory_showElement', { name: (0, _commons.capitalize)((0, _commons.slugify)(element.name)), id: element.id }, true);
        }
        modal.find('.input-simple-modal').val(url);
        modal.openModal({
            dismissible: true,
            opacity: 0.5,
            in_duration: 300,
            out_duration: 200
        });
    });
    object.find('.item-add-favorite').click(function () {
        var element = App.elementModule.getElementById(getCurrentElementIdShown());
        App.elementModule.addFavorite(getCurrentElementIdShown());
        updateFavoriteIcon(object, element);
        if (App.mode == _app.AppModes.Map) {
            element.marker.update();
            element.marker.animateDrop();
        }
    });
    object.find('.item-remove-favorite').click(function () {
        var element = App.elementModule.getElementById(getCurrentElementIdShown());
        App.elementModule.removeFavorite(getCurrentElementIdShown());
        updateFavoriteIcon(object, element);
        if (App.mode == _app.AppModes.Map) element.marker.update();
    });
}
function getCurrentElementIdShown() {
    return getCurrentElementInfoBarShown().attr('data-element-id');
}
function getCurrentElementInfoBarShown() {
    if (App.mode == _app.AppModes.Map) {
        return $('#element-info-bar').find('.element-item');
    }
    return $('.element-item.active');
}
/*function bookMarkMe()
{
    if (window.sidebar) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(location.href,document.title,"");
    } else if(window.external) { // IE Favorite
      window.external.AddFavorite(location.href,document.title); }
    else if(window.opera && window.print) { // Opera Hotlist
      this.title=document.title;
      return true;
    }
}*/

},{"../../commons/commons":1,"../app.module":4}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InfoBarComponent = undefined;

var _event = require("../utils/event");

var _appInteractions = require("../app-interactions");

var _elementMenu = require("./element-menu.component");

var _vote = require("../components/vote.component");

var InfoBarComponent = function () {
    function InfoBarComponent() {
        this.isVisible = false;
        this.isDetailsVisible = false;
        this.elementVisible = null;
        this.onShow = new _event.Event();
        this.onHide = new _event.Event();
    }
    InfoBarComponent.prototype.getCurrElementId = function () {
        return this.elementVisible ? this.elementVisible.id : null;
    };
    InfoBarComponent.prototype.isDisplayedAside = function () {
        return $('#element-info-bar').css('position') == 'absolute';
    };
    // App.infoBarComponent.showElement;
    InfoBarComponent.prototype.showElement = function (elementId) {
        var _this = this;
        var element = App.elementModule.getElementById(elementId);
        console.log("showElement", element);
        // if element already visible
        if (this.elementVisible) {
            this.elementVisible.marker.showNormalSize(true);
        }
        this.elementVisible = element;
        element.updateDistance();
        $('#element-info').html(element.getHtmlRepresentation());
        var domMenu = $('#element-info-bar .menu-element');
        domMenu.attr('option-id', element.colorOptionId);
        if (element.isPending()) {
            domMenu.addClass("pending");
            (0, _vote.createListenersForVoting)();
        } else domMenu.removeClass("pending");
        (0, _elementMenu.updateFavoriteIcon)(domMenu, element);
        // on large screen info bar is displayed aside and so we have enough space
        // to show menu actions details in full text
        (0, _elementMenu.showFullTextMenu)(domMenu, this.isDisplayedAside());
        $('#btn-close-bandeau-detail').click(function () {
            _this.hide();
            return false;
        });
        $('#element-info .collapsible-header').click(function () {
            _this.toggleDetails();
        });
        this.show();
        // after infobar animation, we check if the marker 
        // is not hidded by the info bar
        setTimeout(function () {
            if (!App.mapComponent.contains(element.position)) {
                App.mapComponent.panToLocation(element.position);
                setTimeout(function () {
                    _this.elementVisible.marker.showBigSize();
                }, 1000);
            }
        }, 1000);
        this.onShow.emit(elementId);
    };
    ;
    InfoBarComponent.prototype.show = function () {
        //App.setTimeoutInfoBarComponent();
        if (!this.isDisplayedAside()) {
            $('#element-info-bar').show();
            var elementInfoBar_newHeight = $('#element-info').outerHeight(true);
            elementInfoBar_newHeight += $('#element-info-bar .starRepresentationChoice-helper:visible').height();
            $('#element-info-bar').css('height', elementInfoBar_newHeight);
            (0, _appInteractions.updateInfoBarSize)();
            (0, _appInteractions.updateMapSize)(elementInfoBar_newHeight);
        } else {
            /*$('#element-info-bar').show();
            updateInfoBarSize();*/
            if (!$('#element-info-bar').is(':visible')) {
                $('#element-info-bar').css('right', '-500px');
                $('#element-info-bar').show().animate({ 'right': '0' }, 350, 'swing', function () {
                    (0, _appInteractions.updateMapSize)(0);
                });
            }
            (0, _appInteractions.updateInfoBarSize)();
        }
        this.isVisible = true;
    };
    ;
    InfoBarComponent.prototype.hide = function () {
        if ($('#element-info-bar').is(':visible')) {
            if (!this.isDisplayedAside()) {
                this.hideDetails();
                $('#element-info-bar').css('height', '0');
                $('#element-info-bar').hide();
                (0, _appInteractions.updateMapSize)(0);
            } else {
                $('#directory-content-map').css('margin-right', '0px');
                $('#bandeau_helper').css('margin-right', '0px');
                if ($('#element-info-bar').is(':visible')) {
                    $('#element-info-bar').animate({ 'right': '-500px' }, 350, 'swing', function () {
                        $(this).hide();(0, _appInteractions.updateMapSize)(0);
                    });
                }
            }
            this.onHide.emit(true);
        }
        if (this.elementVisible && this.elementVisible.marker) this.elementVisible.marker.showNormalSize(true);
        this.elementVisible = null;
        this.isVisible = false;
    };
    ;
    InfoBarComponent.prototype.toggleDetails = function () {
        //App.setTimeoutInfoBarComponent();
        if ($('#element-info-bar .moreDetails').is(':visible')) {
            this.hideDetails();
            $('#bandeau_helper').css('z-index', 20).animate({ 'opacity': '1' }, 500);
            $('#menu-button').fadeIn();
        } else {
            $('#bandeau_helper').animate({ 'opacity': '0' }, 500).css('z-index', -1);
            $('#menu-button').fadeOut();
            $('#element-info-bar .moreInfos').hide();
            $('#element-info-bar .lessInfos').show();
            $('#element-info-bar .moreDetails').show();
            var elementInfoBar_newHeight = $(window).height();
            elementInfoBar_newHeight -= $('header').height();
            elementInfoBar_newHeight -= $('#bandeau_goTodirectory-content-list').outerHeight(true);
            $('#element-info-bar').css('height', '100%');
            var elementInfoBar = $("#element-info-bar");
            var height = elementInfoBar_newHeight;
            height -= elementInfoBar.find('.collapsible-header').outerHeight(true);
            height -= elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
            height -= elementInfoBar.find(".menu-element").outerHeight(true);
            $('#element-info-bar .collapsible-body').css('height', height);
            (0, _appInteractions.updateMapSize)(elementInfoBar_newHeight);
        }
    };
    ;
    InfoBarComponent.prototype.hideDetails = function () {
        //App.setTimeoutInfoBarComponent();
        if ($('#element-info-bar .moreDetails').is(':visible')) {
            $('#element-info-bar .moreDetails').hide();
            $('#element-info-bar .moreInfos').show();
            $('#element-info-bar .lessInfos').hide();
            var elementInfoBar_newHeight = $('#element-info').outerHeight(true) + $('#element-info-bar .starRepresentationChoice-helper:visible').height();
            $('#element-info-bar').css('height', elementInfoBar_newHeight);
            (0, _appInteractions.updateMapSize)(elementInfoBar_newHeight);
        }
    };
    ;
    return InfoBarComponent;
}();
exports.InfoBarComponent = InfoBarComponent;

},{"../app-interactions":3,"../components/vote.component":18,"../utils/event":29,"./element-menu.component":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BiopenMarker = undefined;

var _app = require("../../app.module");

var BiopenMarker = function () {
    function BiopenMarker(id_, position_) {
        var _this = this;
        this.isAnimating_ = false;
        this.isHalfHidden_ = false;
        this.inclination_ = "normal";
        this.id_ = id_;
        if (!position_) {
            var element = this.getElement();
            if (element === null) window.console.log("element null id = " + this.id_);else position_ = element.position;
        }
        this.leafletMarker_ = L.marker(position_, { 'riseOnHover': true });
        this.leafletMarker_.on('click', function (ev) {
            App.handleMarkerClick(_this);
        });
        this.leafletMarker_.on('mouseover', function (ev) {
            if (_this.isAnimating_) {
                return;
            }
            //if (!this.isNearlyHidden_) // for constellation mode !
            _this.showBigSize();
        });
        this.leafletMarker_.on('mouseout', function (ev) {
            if (_this.isAnimating_) {
                return;
            }
            _this.showNormalSize();
        });
        // if (App.state == AppStates.Constellation)
        // {
        // 	google.maps.event.addListener(this.leafletMarker_, 'visible_changed', () => 
        // 	{ 
        // 		this.checkPolylineVisibility_(this); 
        // 	});
        // }
        this.isHalfHidden_ = false;
        //this.update();	
        this.leafletMarker_.setIcon(L.divIcon({ className: 'leaflet-marker-container', html: "<span id=\"marker-" + this.id_ + "\"></span>" }));
    }
    ;
    BiopenMarker.prototype.isDisplayedOnElementInfoBar = function () {
        return App.infoBarComponent.getCurrElementId() == this.id_;
    };
    BiopenMarker.prototype.domMarker = function () {
        return $('#marker-' + this.id_);
    };
    BiopenMarker.prototype.animateDrop = function () {
        var _this = this;
        this.isAnimating_ = true;
        this.domMarker().animate({ top: '-=25px' }, 300, 'easeInOutCubic');
        this.domMarker().animate({ top: '+=25px' }, 250, 'easeInOutCubic', function () {
            _this.isAnimating_ = false;
        });
    };
    ;
    BiopenMarker.prototype.update = function () {
        var element = this.getElement();
        var disableMarker = false;
        var showMoreIcon = true;
        if (App.state == _app.AppStates.Constellation) {
            // POLYLINE TYPE
            var lineType = void 0;
            if (element.starChoiceForRepresentation === '') {
                lineType = _app.AppStates.Normal;
            } else {
                lineType = element.isCurrentStarChoiceRepresentant() ? _app.AppStates.Normal : 'dashed';
                // en mode SCR, tout lesmarkers sont disabled sauf le représentant de l'étoile
                disableMarker = !element.isCurrentStarChoiceRepresentant();
            }
            this.updatePolyline({ lineType: lineType });
        }
        var optionstoDisplay = element.getIconsToDisplay();
        // If usecolor and useIcon, we don't show others icons
        // if (optionstoDisplay[0])
        // 	showMoreIcon = !optionstoDisplay[0].useColorForMarker || !optionstoDisplay[0].useIconForMarker;
        var htmlMarker = Twig.render(biopen_twigJs_marker, {
            element: element,
            mainOptionValueToDisplay: optionstoDisplay[0],
            otherOptionsValuesToDisplay: optionstoDisplay.slice(1),
            showMoreIcon: showMoreIcon,
            disableMarker: disableMarker,
            pendingClass: element.isPending() ? 'pending' : ''
        });
        this.leafletMarker_.setIcon(L.divIcon({ className: 'leaflet-marker-container', html: htmlMarker }));
        if (this.isDisplayedOnElementInfoBar()) this.showBigSize();
        if (this.inclination_ == "right") this.inclinateRight();
        if (this.inclination_ == "left") this.inclinateLeft();
    };
    ;
    BiopenMarker.prototype.addClassToLeafletMarker_ = function (classToAdd) {
        this.domMarker().addClass(classToAdd);
        this.domMarker().siblings('.marker-name').addClass(classToAdd);
    };
    ;
    BiopenMarker.prototype.removeClassToLeafletMarker_ = function (classToRemove) {
        this.domMarker().removeClass(classToRemove);
        this.domMarker().siblings('.marker-name').removeClass(classToRemove);
    };
    ;
    BiopenMarker.prototype.showBigSize = function () {
        this.addClassToLeafletMarker_("BigSize");
        var domMarker = this.domMarker();
        domMarker.parent().find('.marker-name').show();
        domMarker.find('.moreIconContainer').show();
        domMarker.find('.icon-plus-circle').hide();
        if (!this.isHalfHidden_ && this.polyline_) {
            this.setPolylineOptions({
                strokeOpacity: 1,
                strokeWeight: 3
            });
        }
    };
    ;
    BiopenMarker.prototype.showNormalSize = function ($force) {
        if ($force === void 0) {
            $force = false;
        }
        if (!$force && this.isDisplayedOnElementInfoBar()) return;
        var domMarker = this.domMarker();
        this.removeClassToLeafletMarker_("BigSize");
        domMarker.parent().find('.marker-name').hide();
        domMarker.find('.moreIconContainer').hide();
        domMarker.find('.icon-plus-circle').show();
        if (!this.isHalfHidden_ && this.polyline_) {
            this.setPolylineOptions({
                strokeOpacity: 0.5,
                strokeWeight: 3
            });
        }
    };
    ;
    BiopenMarker.prototype.initializeInclination = function () {
        var domMarker = this.domMarker();
        domMarker.css("z-index", "1");
        domMarker.find(".rotate").removeClass("rotateLeft").removeClass("rotateRight");
        domMarker.removeClass("rotateLeft").removeClass("rotateRight");
        this.inclination_ = "normal";
    };
    ;
    BiopenMarker.prototype.inclinateRight = function () {
        var domMarker = this.domMarker();
        domMarker.find(".rotate").addClass("rotateRight");
        domMarker.addClass("rotateRight");
        this.inclination_ = "right";
    };
    ;
    BiopenMarker.prototype.inclinateLeft = function () {
        var domMarker = this.domMarker();
        domMarker.find(".rotate").addClass("rotateLeft");
        domMarker.addClass("rotateLeft");
        this.inclination_ = "left";
    };
    ;
    BiopenMarker.prototype.setPolylineOptions = function (options) {
        if (!this.polyline_.isDashed) {
            this.polyline_.setOptions(options);
        } else {
            this.updatePolyline({
                lineType: 'dashed',
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
            });
        }
    };
    ;
    BiopenMarker.prototype.updatePolyline = function (options) {
        // if (!this.polyline_)
        // {
        // 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.leafletMarker_.getPosition(), this.getElement().type, null, options);
        // }
        // else
        // {		
        // 	let map = this.polyline_.getMap();
        // 	this.polyline_.setMap(null);
        // 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.leafletMarker_.getPosition(), this.getElement().type, map, options);	
        // }
    };
    ;
    BiopenMarker.prototype.showHalfHidden = function ($force) {
        if ($force === void 0) {
            $force = false;
        }
        if (!$force && this.isDisplayedOnElementInfoBar()) return;
        this.addClassToLeafletMarker_("halfHidden");
        var domMarker = this.domMarker();
        domMarker.css('z-index', '1');
        domMarker.find('.icon-plus-circle').addClass("halfHidden");
        domMarker.find('.moreIconContainer').addClass("halfHidden");
        if (this.polyline_) this.setPolylineOptions({
            strokeOpacity: 0.1,
            strokeWeight: 2
        });
        this.isHalfHidden_ = true;
    };
    ;
    BiopenMarker.prototype.showNormalHidden = function () {
        this.removeClassToLeafletMarker_("halfHidden");
        var domMarker = this.domMarker();
        domMarker.css('z-index', '10');
        domMarker.find('.icon-plus-circle').removeClass("halfHidden");
        domMarker.find('.moreIconContainer').removeClass("halfHidden");
        if (this.polyline_) this.setPolylineOptions({
            strokeOpacity: 0.7,
            strokeWeight: 3
        });
        this.isHalfHidden_ = false;
    };
    ;
    BiopenMarker.prototype.getId = function () {
        return this.id_;
    };
    ;
    BiopenMarker.prototype.getLeafletMarker = function () {
        return this.leafletMarker_;
    };
    ;
    BiopenMarker.prototype.isHalfHidden = function () {
        return this.isHalfHidden_;
    };
    BiopenMarker.prototype.getElement = function () {
        return App.elementModule.getElementById(this.id_);
    };
    ;
    BiopenMarker.prototype.checkPolylineVisibility_ = function (context) {
        if (context.leafletMarker_ === null) return;
        //window.console.log("checkPolylineVisibility_ " + context.leafletMarker_.getVisible());
        context.polyline_.setVisible(context.leafletMarker_.getVisible());
        context.polyline_.setMap(context.leafletMarker_.getMap());
        if (App.state == _app.AppStates.ShowDirections) {
            context.polyline_.setMap(null);
            context.polyline_.setVisible(false);
        }
    };
    ;
    BiopenMarker.prototype.show = function () {
        //App.mapComponent.addMarker(this.leafletMarker_);
        //this.leafletMarker_.addTo(App.map());
        if (App.state == _app.AppStates.Constellation) this.polyline_.setMap(App.map());
    };
    ;
    BiopenMarker.prototype.hide = function () {
        //App.mapComponent.removeMarker(this.leafletMarker_);
        //this.leafletMarker_.remove();
        if (App.state == _app.AppStates.Constellation) this.polyline_.setMap(null);
    };
    ;
    BiopenMarker.prototype.setVisible = function (bool) {
        //this.leafletMarker_.setVisible(bool);
        if (bool) this.show();else this.hide();
    };
    ;
    BiopenMarker.prototype.getPosition = function () {
        return this.leafletMarker_.getLatLng();
    };
    ;
    return BiopenMarker;
}(); /**
      * This file is part of the MonVoisinFaitDuBio project.
      * For the full copyright and license information, please view the LICENSE
      * file that was distributed with this source code.
      *
      * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
      * @license    MIT License
      * @Last Modified time: 2016-12-13
      */
exports.BiopenMarker = BiopenMarker;

},{"../../app.module":4}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapComponent = exports.ViewPort = undefined;

var _app = require("../../app.module");

var _event = require("../../utils/event");

var ViewPort = function () {
    function ViewPort(lat, lng, zoom) {
        if (lat === void 0) {
            lat = 0;
        }
        if (lng === void 0) {
            lng = 0;
        }
        if (zoom === void 0) {
            zoom = 0;
        }
        this.lat = lat;
        this.lng = lng;
        this.zoom = zoom;
        this.lat = lat || 0;
        this.lng = lng || 0;
        this.zoom = zoom || 0;
    }
    ViewPort.prototype.toString = function () {
        var digits = this.zoom > 14 ? 4 : 2;
        return "@" + this.lat.toFixed(digits) + "," + this.lng.toFixed(digits) + "," + this.zoom + "z";
    };
    ViewPort.prototype.fromString = function (string) {
        if (!string) return null;
        var decode = string.split('@').pop().split(',');
        if (decode.length != 3) {
            console.log("ViewPort fromString erreur", string);
            return null;
        }
        this.lat = parseFloat(decode[0]);
        this.lng = parseFloat(decode[1]);
        this.zoom = parseInt(decode[2].slice(0, -1));
        //console.log("ViewPort fromString Done", this);
        return this;
    };
    return ViewPort;
}();
exports.ViewPort = ViewPort;
/**
* The Map Component who encapsulate the map
*
* MapComponent publics methods must be as independant as possible
* from technology used for the map (google, leaflet ...)
*
* Map component is like an interface between the map and the rest of the App
*/

var MapComponent = function () {
    function MapComponent() {
        this.onMapReady = new _event.Event();
        this.onMapLoaded = new _event.Event();
        this.onClick = new _event.Event();
        this.onIdle = new _event.Event();
        //Leaflet map
        this.map_ = null;
        this.isInitialized = false;
        this.isMapLoaded = false;
        this.oldZoom = -1;
        this.viewport = null;
    }
    MapComponent.prototype.getMap = function () {
        return this.map_;
    };
    ;
    MapComponent.prototype.getCenter = function () {
        return this.viewport ? L.latLng(this.viewport.lat, this.viewport.lng) : null;
    };
    MapComponent.prototype.getBounds = function () {
        return this.isMapLoaded ? this.map_.getBounds() : null;
    };
    MapComponent.prototype.getZoom = function () {
        return this.map_.getZoom();
    };
    MapComponent.prototype.getOldZoom = function () {
        return this.oldZoom;
    };
    MapComponent.prototype.init = function () {
        var _this = this;
        //initAutoCompletionForElement(document.getElementById('search-bar'));
        if (this.isInitialized) {
            this.resize();
            return;
        }
        this.map_ = L.map('directory-content-map', {
            zoomControl: false
        });
        this.markerClustererGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            spiderfyOnHover: false,
            spiderfyMaxCount: 4,
            spiderfyDistanceMultiplier: 1.1,
            chunkedLoading: true,
            maxClusterRadius: function maxClusterRadius(zoom) {
                if (zoom > 10) return 40;
                if (zoom > 7) return 75;else return 100;
            }
        });
        this.addMarkerClusterGroup();
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map_);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(this.map_);
        this.map_.on('click', function (e) {
            _this.onClick.emit();
        });
        this.map_.on('moveend', function (e) {
            _this.oldZoom = _this.map_.getZoom();
            _this.updateViewPort();
            App.boundsModule.extendBounds(0.2, _this.map_.getBounds());
            _this.onIdle.emit();
        });
        this.map_.on('load', function (e) {
            _this.isMapLoaded = true;_this.onMapLoaded.emit();
        });
        this.resize();
        // if we began with List Mode, when we initialize map
        // there is already an address geocoded or a viewport defined
        if (App && App.geocoder.getBounds()) {
            this.fitBounds(App.geocoder.getBounds(), false);
        } else if (this.viewport) {
            // setTimeout waiting for the map to be resized
            setTimeout(function () {
                _this.setViewPort(_this.viewport);
            }, 200);
        }
        this.isInitialized = true;
        //console.log("map init done");
        this.onMapReady.emit();
    };
    ;
    MapComponent.prototype.addMarkerClusterGroup = function () {
        this.map_.addLayer(this.markerClustererGroup);
    };
    MapComponent.prototype.resize = function () {
        //console.log("Resize, curr viewport :");
        // Warning !I changed the leaflet.js file library myself
        // because the options doesn't work properly
        // I changed it to avoi panning when resizing the map
        // be careful if updating the leaflet library this will
        // not work anymore
        if (this.map_) this.map_.invalidateSize(false);
    };
    MapComponent.prototype.addMarker = function (marker) {
        this.markerClustererGroup.addLayer(marker);
    };
    MapComponent.prototype.addMarkers = function (markers) {
        if (this.markerClustererGroup) this.markerClustererGroup.addLayers(markers);
    };
    MapComponent.prototype.removeMarker = function (marker) {
        this.markerClustererGroup.removeLayer(marker);
    };
    MapComponent.prototype.removeMarkers = function (markers) {
        if (this.markerClustererGroup) this.markerClustererGroup.removeLayers(markers);
    };
    // fit map view to bounds
    MapComponent.prototype.fitBounds = function (bounds, animate) {
        //console.log("fitbounds", bounds);
        if (animate === void 0) {
            animate = true;
        }
        if (this.isMapLoaded && animate) App.map().flyToBounds(bounds);else App.map().fitBounds(bounds);
    };
    MapComponent.prototype.panToLocation = function (location, zoom, animate) {
        if (animate === void 0) {
            animate = true;
        }
        zoom = zoom || this.getZoom() || 12;
        console.log("panTolocation", location);
        if (this.isMapLoaded && animate) this.map_.flyTo(location, zoom);else this.map_.setView(location, zoom);
    };
    ;
    // the actual displayed map radius (distance from croner to center)
    MapComponent.prototype.mapRadiusInKm = function () {
        if (!this.isMapLoaded) return 0;
        return Math.floor(this.map_.getBounds().getNorthEast().distanceTo(this.map_.getCenter()) / 1000);
    };
    // distance from last saved location to a position
    MapComponent.prototype.distanceFromLocationTo = function (position) {
        if (!App.geocoder.getLocation()) return null;
        return App.geocoder.getLocation().distanceTo(position) / 1000;
    };
    MapComponent.prototype.contains = function (position) {
        if (position) {
            return this.map_.getBounds().contains(position);
        }
        console.log("MapComponent->contains : map not loaded or element position undefined");
        return false;
    };
    MapComponent.prototype.extendedContains = function (position) {
        if (this.isMapLoaded && position) {
            return App.boundsModule.extendedBounds.contains(position);
        }
        //console.log("MapComponent->contains : map not loaded or element position undefined");
        return false;
    };
    MapComponent.prototype.updateViewPort = function () {
        if (!this.viewport) this.viewport = new ViewPort();
        this.viewport.lat = this.map_.getCenter().lat;
        this.viewport.lng = this.map_.getCenter().lng;
        this.viewport.zoom = this.getZoom();
    };
    MapComponent.prototype.setViewPort = function ($viewport, $panMapToViewport) {
        var _this = this;
        if ($panMapToViewport === void 0) {
            $panMapToViewport = true;
        }
        if (this.map_ && $viewport && $panMapToViewport) {
            //console.log("setViewPort", $viewport);
            var timeout = App.state == _app.AppStates.ShowElementAlone ? 500 : 0;
            setTimeout(function () {
                _this.map_.setView(L.latLng($viewport.lat, $viewport.lng), $viewport.zoom);
            }, timeout);
        }
        this.viewport = $viewport;
    };
    MapComponent.prototype.hidePartiallyClusters = function () {
        $('.marker-cluster').addClass('halfHidden');
    };
    MapComponent.prototype.showNormalHiddenClusters = function () {
        $('.marker-cluster').removeClass('halfHidden');
    };
    return MapComponent;
}();
exports.MapComponent = MapComponent;

},{"../../app.module":4,"../../utils/event":29}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeVoting = initializeVoting;
exports.createListenersForVoting = createListenersForVoting;

var _elementMenu = require("./element-menu.component");

var _appInteractions = require("../app-interactions");

var _commons = require("../../commons/commons");

function initializeVoting() {
    //console.log("initialize vote");	
    $(".validation-process-info").click(function (e) {
        $("#popup-vote").openModal();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
    });
    $('#modal-vote #submit-vote').click(function () {
        var voteValue = $('.vote-option-radio-btn:checked').attr('value');
        $('#modal-vote #select-error').hide();
        if (voteValue) {
            var elementId = (0, _elementMenu.getCurrentElementIdShown)();
            var comment = $('#modal-vote .input-comment').val();
            console.log("send vote " + voteValue + " to element id ", elementId);
            App.ajaxModule.vote(elementId, voteValue, comment, function (successMessage) {
                console.log("success", successMessage);
                $('#modal-vote').closeModal();
                var elementInfo = (0, _elementMenu.getCurrentElementInfoBarShown)();
                elementInfo.find(".vote-section").find('.basic-message').hide();
                elementInfo.find('.result-message').text(successMessage).show();
                (0, _appInteractions.updateInfoBarSize)();
            }, function (errorMessage) {
                console.log("error", errorMessage);
                $('#modal-vote #select-error').text(errorMessage).show();
            });
        } else {
            $('#modal-vote #select-error').show();
        }
    });
} /**
   * This file is part of the MonVoisinFaitDuBio project.
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   *
   * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
   * @license    MIT License
   * @Last Modified time: 2016-12-13
   */
function createListenersForVoting() {
    $(".vote-button").click(function (e) {
        if ($('#btn-login').is(':visible')) {
            $('#popup-login').openModal();
            return;
        } else {
            var element = App.elementModule.getElementById((0, _elementMenu.getCurrentElementIdShown)());
            $('.vote-option-radio-btn:checked').prop('checked', false);
            $('#modal-vote .input-comment').val("");
            $('#modal-vote #select-error').hide();
            $('#modal-vote .elementName').text((0, _commons.capitalize)(element.name));
            $('#modal-vote').openModal({
                dismissible: true,
                opacity: 0.5,
                in_duration: 300,
                out_duration: 200
            });
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
    });
}

},{"../../commons/commons":1,"../app-interactions":3,"./element-menu.component":14}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AjaxModule = exports.DataAroundRequest = exports.Request = undefined;

var _event = require("../utils/event");

var Request = function () {
    function Request(route, data) {
        this.route = route;
        this.data = data;
    }
    ;
    return Request;
}(); /**
      * This file is part of the MonVoisinFaitDuBio project.
      * For the full copyright and license information, please view the LICENSE
      * file that was distributed with this source code.
      *
      * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
      * @license    MIT License
      * @Last Modified time: 2016-12-13
      */
exports.Request = Request;

var DataAroundRequest = function () {
    function DataAroundRequest(originLat, originLng, distance, maxResults, mainOptionId) {
        this.originLat = originLat;
        this.originLng = originLng;
        this.distance = distance;
        this.maxResults = maxResults;
        this.mainOptionId = mainOptionId;
    }
    ;
    return DataAroundRequest;
}();
exports.DataAroundRequest = DataAroundRequest;

var AjaxModule = function () {
    function AjaxModule() {
        this.onNewElements = new _event.Event();
        this.isRetrievingElements = false;
        this.requestWaitingToBeExecuted = false;
        this.waitingRequest = null;
        this.currRequest = null;
        this.loaderTimer = null;
        this.allElementsReceived = false;
    }
    AjaxModule.prototype.getElementsAroundLocation = function ($location, $distance, $maxResults) {
        if ($maxResults === void 0) {
            $maxResults = 0;
        }
        // if invalid location we abort
        if (!$location || !$location.lat) {
            console.log("Ajax invalid request", $location);
            return;
        }
        var dataRequest = new DataAroundRequest($location.lat, $location.lng, $distance, $maxResults, App.currMainId);
        var route = Routing.generate('biopen_api_elements_around_location');
        this.sendAjaxElementRequest(new Request(route, dataRequest));
    };
    AjaxModule.prototype.getElementsInBounds = function ($bounds) {
        // if invalid location we abort
        if (!$bounds || $bounds.length == 0 || !$bounds[0]) {
            console.log("Ajax invalid request", $bounds);
            return;
        }
        //console.log($bounds);
        var stringifiedBounds = "";
        for (var _i = 0, $bounds_1 = $bounds; _i < $bounds_1.length; _i++) {
            var bound = $bounds_1[_i];
            stringifiedBounds += bound.toBBoxString() + ";";
        }
        var dataRequest = { bounds: stringifiedBounds, mainOptionId: App.currMainId };
        var route = Routing.generate('biopen_api_elements_in_bounds');
        this.sendAjaxElementRequest(new Request(route, dataRequest));
    };
    AjaxModule.prototype.sendAjaxElementRequest = function ($request) {
        var _this = this;
        if (this.allElementsReceived) {
            console.log("All elements already received");
            return;
        }
        console.log("Ajax send elements request ", $request);
        if (this.isRetrievingElements) {
            console.log("Ajax isRetrieving");
            this.requestWaitingToBeExecuted = true;
            this.waitingRequest = $request;
            return;
        }
        this.isRetrievingElements = true;
        this.currRequest = $request;
        var start = new Date().getTime();
        $.ajax({
            url: $request.route,
            method: "get",
            data: $request.data,
            beforeSend: function beforeSend() {
                _this.loaderTimer = setTimeout(function () {
                    $('#directory-loading').show();
                }, 1500);
            },
            success: function success(response) {
                //console.log(response);
                if (response.data !== null) {
                    var end = new Date().getTime();
                    console.log("receive " + response.data.length + " elements in " + (end - start) + " ms. Memory size : ", response.size);
                    _this.onNewElements.emit(response.data);
                }
                if (response.allElementsSends) _this.allElementsReceived = true;
                //if (response.exceedMaxResult && !this.requestWaitingToBeExecuted) this.sendAjaxElementRequest(this.currRequest);     
            },
            complete: function complete() {
                _this.isRetrievingElements = false;
                clearTimeout(_this.loaderTimer);
                if (_this.requestWaitingToBeExecuted) {
                    //console.log("    requestWaitingToBeExecuted stored", this.waitingRequest);
                    _this.sendAjaxElementRequest(_this.waitingRequest);
                    _this.requestWaitingToBeExecuted = false;
                } else {
                    //console.log("Ajax request complete");			  	 
                    $('#directory-loading').hide();
                }
            }
        });
    };
    ;
    AjaxModule.prototype.getElementById = function (elementId, callbackSuccess, callbackFailure) {
        var start = new Date().getTime();
        var route = Routing.generate('biopen_api_element_by_id');
        $.ajax({
            url: route,
            method: "post",
            data: { elementId: elementId },
            success: function success(response) {
                if (response) {
                    var end = new Date().getTime();
                    window.console.log("receive elementById in " + (end - start) + " ms", response);
                    if (callbackSuccess) callbackSuccess(response);
                } else if (callbackFailure) callbackFailure(response);
            },
            error: function error(response) {
                if (callbackFailure) callbackFailure(response);
            }
        });
    };
    ;
    AjaxModule.prototype.vote = function (elementId, voteValue, comment, callbackSuccess, callbackFailure) {
        var route = Routing.generate('biopen_vote_for_element');
        $.ajax({
            url: route,
            method: "post",
            data: { elementId: elementId, voteValue: voteValue, comment: comment },
            success: function success(response) {
                if (response.status) {
                    if (callbackSuccess) callbackSuccess(response.data);
                } else if (callbackFailure) callbackFailure(response.data);
            },
            error: function error(response) {
                if (callbackFailure) callbackFailure(response.data);
            }
        });
    };
    return AjaxModule;
}();
exports.AjaxModule = AjaxModule;

},{"../utils/event":29}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var BoundsModule = function () {
    function BoundsModule() {
        // the bounds where elements has already been retrieved
        // we save one filledBound per mainOptionId
        this.filledBound = [];
    }
    BoundsModule.prototype.initialize = function () {
        for (var _i = 0, _a = App.categoryModule.getMainOptionsIdsWithAll(); _i < _a.length; _i++) {
            var mainOptionId = _a[_i];
            this.filledBound[mainOptionId] = null;
        }
    };
    BoundsModule.prototype.createBoundsFromLocation = function ($location, $radius) {
        if ($radius === void 0) {
            $radius = 30;
        }
        var degree = $radius / 110 / 2;
        this.extendedBounds = L.latLngBounds(L.latLng($location.lat - degree, $location.lng - degree), L.latLng($location.lat + degree, $location.lng + degree));
    };
    BoundsModule.prototype.extendBounds = function ($ratio, $bounds) {
        if ($bounds === void 0) {
            $bounds = this.extendedBounds;
        }
        //console.log("extend bounds", $bounds);
        if (!$bounds) {
            console.log("bounds uncorrect", $bounds);
            return;
        }
        this.extendedBounds = $bounds.pad($ratio);
    };
    BoundsModule.prototype.updateFilledBoundsAccordingToNewMainOptionId = function () {
        if (App.currMainId == 'all') {} else if (this.filledBound['all']) {
            if (!this.currFilledBound || this.filledBound['all'].contains(this.filledBound[App.currMainId])) {
                this.filledBound[App.currMainId] = this.filledBound['all'];
            }
        }
    };
    Object.defineProperty(BoundsModule.prototype, "currFilledBound", {
        // implements this function to wait from ajax response to update new filledBounds, instead of
        // updating it before ajax send (possibly wrong if ajax fail)
        // updateFilledBoundsWithBoundsReceived(bound : L.LatLngBoundsExpression, mainOptionId : number)
        // {
        // 	this.filledBound[mainOptionId] = new L.latLngBounds(bound);
        // }
        get: function get() {
            return this.filledBound[App.currMainId];
        },
        enumerable: true,
        configurable: true
    });
    BoundsModule.prototype.calculateFreeBounds = function () {
        var freeBounds = [];
        var currFilledBound = this.currFilledBound;
        var freeBound1, freeBound2, freeBound3, freeBound4;
        if (currFilledBound) {
            if (!currFilledBound.contains(this.extendedBounds)) {
                if (this.extendedBounds.contains(currFilledBound)) {
                    // extended contains filledbounds		
                    freeBound1 = L.latLngBounds(this.extendedBounds.getNorthWest(), currFilledBound.getNorthEast());
                    freeBound2 = L.latLngBounds(freeBound1.getNorthEast(), this.extendedBounds.getSouthEast());
                    freeBound3 = L.latLngBounds(currFilledBound.getSouthEast(), this.extendedBounds.getSouthWest());
                    freeBound4 = L.latLngBounds(freeBound1.getSouthWest(), currFilledBound.getSouthWest());
                    currFilledBound = this.extendedBounds;
                    freeBounds.push(freeBound1, freeBound2, freeBound3, freeBound4);
                } else {
                    // extended cross over filled
                    if (this.extendedBounds.getWest() > currFilledBound.getWest() && this.extendedBounds.getEast() < currFilledBound.getEast()) {
                        if (this.extendedBounds.getSouth() < currFilledBound.getSouth()) {
                            // extended centered south from filledBounds
                            freeBound1 = L.latLngBounds(this.extendedBounds.getSouthWest(), currFilledBound.getSouthEast());
                        } else {
                            // extended centered south from filledBounds
                            freeBound1 = L.latLngBounds(this.extendedBounds.getNorthWest(), currFilledBound.getNorthEast());
                        }
                    } else if (this.extendedBounds.getWest() < currFilledBound.getWest()) {
                        if (this.extendedBounds.getSouth() > currFilledBound.getSouth() && this.extendedBounds.getNorth() < currFilledBound.getNorth()) {
                            // extended centered east from filledBounds
                            freeBound1 = L.latLngBounds(this.extendedBounds.getNorthWest(), currFilledBound.getSouthWest());
                        } else if (this.extendedBounds.getSouth() < currFilledBound.getSouth()) {
                            // extendedbounds southWest from filledBounds
                            freeBound1 = L.latLngBounds(currFilledBound.getSouthEast(), this.extendedBounds.getSouthWest());
                            freeBound2 = L.latLngBounds(currFilledBound.getNorthWest(), freeBound1.getNorthWest());
                        } else {
                            // extendedbounds northWest from filledBounds
                            freeBound1 = L.latLngBounds(currFilledBound.getNorthEast(), this.extendedBounds.getNorthWest());
                            freeBound2 = L.latLngBounds(currFilledBound.getSouthWest(), freeBound1.getSouthWest());
                        }
                    } else {
                        if (this.extendedBounds.getSouth() > currFilledBound.getSouth() && this.extendedBounds.getNorth() < currFilledBound.getNorth()) {
                            // extended centered west from filledBounds
                            freeBound1 = L.latLngBounds(currFilledBound.getNorthEast(), this.extendedBounds.getSouthEast());
                        } else if (this.extendedBounds.getSouth() < currFilledBound.getSouth()) {
                            // extendedbounds southeast from filledBounds
                            freeBound1 = L.latLngBounds(currFilledBound.getSouthWest(), this.extendedBounds.getSouthEast());
                            freeBound2 = L.latLngBounds(currFilledBound.getNorthEast(), freeBound1.getNorthEast());
                        } else {
                            // extendedbounds northEast from filledBounds
                            freeBound1 = L.latLngBounds(currFilledBound.getNorthWest(), this.extendedBounds.getNorthEast());
                            freeBound2 = L.latLngBounds(currFilledBound.getSouthEast(), freeBound1.getSouthEast());
                        }
                    }
                    //L.rectangle(freeBound1, {color: "red", weight: 3}).addTo(this.map_); 
                    //L.rectangle(freeBound2, {color: "blue", weight: 3}).addTo(this.map_); 
                    freeBounds.push(freeBound1);
                    if (freeBound2) freeBounds.push(freeBound2);
                    currFilledBound = L.latLngBounds(L.latLng(Math.max(currFilledBound.getNorth(), this.extendedBounds.getNorth()), Math.max(currFilledBound.getEast(), this.extendedBounds.getEast())), L.latLng(Math.min(currFilledBound.getSouth(), this.extendedBounds.getSouth()), Math.min(currFilledBound.getWest(), this.extendedBounds.getWest())));
                }
            } else {
                // extended bounds included in filledbounds
                return null;
            }
        } else {
            // first initialization
            freeBounds.push(this.extendedBounds);
            currFilledBound = this.extendedBounds;
        }
        this.filledBound[App.currMainId] = currFilledBound;
        return freeBounds;
    };
    return BoundsModule;
}();
exports.BoundsModule = BoundsModule;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CategoriesModule = exports.Option = exports.Category = undefined;

var _category = require("../classes/category.class");

Object.defineProperty(exports, "Category", {
    enumerable: true,
    get: function get() {
        return _category.Category;
    }
});

var _option = require("../classes/option.class");

Object.defineProperty(exports, "Option", {
    enumerable: true,
    get: function get() {
        return _option.Option;
    }
});

var CategoriesModule = function () {
    function CategoriesModule() {
        this.categories = [];
        this.options = [];
        this.openHoursFiltersDays = [];
        this.options = [];
        this.categories = [];
    }
    CategoriesModule.prototype.createCategoriesFromJson = function (mainCatgeoryJson, openHoursCategoryJson) {
        this.mainCategory = this.recursivelyCreateCategoryAndOptions(mainCatgeoryJson);
        this.openHoursCategory = this.recursivelyCreateCategoryAndOptions(openHoursCategoryJson);
        this.updateOpenHoursFilter();
        //console.log(this.mainCategory);
    };
    CategoriesModule.prototype.recursivelyCreateCategoryAndOptions = function (categoryJson) {
        var category = new _category.Category(categoryJson);
        for (var _i = 0, _a = categoryJson.options; _i < _a.length; _i++) {
            var optionJson = _a[_i];
            var option = new _option.Option(optionJson);
            option.ownerId = categoryJson.id;
            option.depth = category.depth;
            if (category.depth == 0) option.mainOwnerId = "all";else if (category.depth == -1) option.mainOwnerId = "openhours";else option.mainOwnerId = category.mainOwnerId;
            for (var _b = 0, _c = optionJson.subcategories; _b < _c.length; _b++) {
                var subcategoryJson = _c[_b];
                if (category.depth <= 0) subcategoryJson.mainOwnerId = option.id;else subcategoryJson.mainOwnerId = option.mainOwnerId;
                var subcategory = this.recursivelyCreateCategoryAndOptions(subcategoryJson);
                subcategory.ownerId = option.id;
                option.addCategory(subcategory);
            }
            category.addOption(option);
            this.options.push(option);
        }
        this.categories.push(category);
        return category;
    };
    CategoriesModule.prototype.updateOpenHoursFilter = function () {
        this.openHoursFiltersDays = [];
        var option;
        for (var _i = 0, _a = this.openHoursCategory.children; _i < _a.length; _i++) {
            option = _a[_i];
            if (option.isChecked) this.openHoursFiltersDays.push(option.name.toLowerCase());
        }
        //console.log("updateOpenHoursfilters", this.openHoursFiltersDays);
    };
    CategoriesModule.prototype.getMainOptions = function () {
        return this.mainCategory.options;
    };
    CategoriesModule.prototype.getMainOptionsIdsWithAll = function () {
        var optionIds = this.getMainOptionsIds();
        optionIds.push("all");
        return optionIds;
    };
    CategoriesModule.prototype.getMainOptionsIds = function () {
        return this.mainCategory.options.map(function (option) {
            return option.id;
        });
    };
    CategoriesModule.prototype.getCurrMainOption = function () {
        return App.currMainId == 'all' ? null : this.getMainOptionById(App.currMainId);
    };
    CategoriesModule.prototype.getMainOptionBySlug = function ($slug) {
        return this.getMainOptions().filter(function (option) {
            return option.nameShort == $slug;
        }).shift();
    };
    CategoriesModule.prototype.getMainOptionById = function ($id) {
        return this.mainCategory.options.filter(function (option) {
            return option.id == $id;
        }).shift();
    };
    ;
    CategoriesModule.prototype.getCategoryById = function ($id) {
        return this.categories.filter(function (category) {
            return category.id == $id;
        }).shift();
    };
    ;
    CategoriesModule.prototype.getOptionById = function ($id) {
        return this.options.filter(function (option) {
            return option.id == $id;
        }).shift();
    };
    ;
    CategoriesModule.prototype.getCurrOptions = function () {
        return this.options.filter(function (option) {
            return option.mainOwnerId == App.currMainId;
        });
    };
    return CategoriesModule;
}();
exports.CategoriesModule = CategoriesModule;

},{"../classes/category.class":7,"../classes/option.class":11}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DirectionsModule = function () {
    function DirectionsModule() {
        this.markerDirectionResult = null;
        window.lrmConfig = {};
    }
    DirectionsModule.prototype.clear = function () {
        if (!this.routingControl) return;
        this.clearRoute();
        //this.clearDirectionMarker();
        this.hideItineraryPanel();
        App.DEAModule.end();
        this.routingControl = null;
    };
    ;
    DirectionsModule.prototype.clearRoute = function () {
        console.log("clearing route");
        if (this.routingControl) {
            this.routingControl.spliceWaypoints(0, 2);
            App.map().removeControl(this.routingControl);
        }
    };
    ;
    DirectionsModule.prototype.calculateRoute = function (origin, element) {
        var _this = this;
        this.clear();
        var waypoints = [origin, element.position];
        //console.log("calculate route", waypoints);
        this.routingControl = L.Routing.control({
            plan: L.Routing.plan(waypoints, {
                // deleteing start and end markers
                createMarker: function createMarker(i, wp) {
                    return null;
                },
                routeWhileDragging: false,
                showAlternatives: false
            }),
            language: 'fr',
            routeWhileDragging: false,
            showAlternatives: false,
            altLineOptions: {
                styles: [{ color: 'black', opacity: 0.15, weight: 9 }, { color: 'white', opacity: 0.8, weight: 6 }, { color: '#00b3fd', opacity: 0.5, weight: 2 }]
            }
        }).addTo(App.map());
        // show Itinerary panel without itinerary, just to show user
        // somethingis happenning an display spinner loader
        this.showItineraryPanel(element);
        this.routingControl.on('routesfound', function (ev) {
            _this.showItineraryPanel(element);
        });
        // fit bounds 
        this.routingControl.on('routeselected', function (e) {
            var r = e.route;
            var line = L.Routing.line(r);
            var bounds = line.getBounds();
            App.map().fitBounds(bounds);
        });
        this.routingControl.on('routingerror', function (ev) {
            $('#modal-directions-fail').openModal();
            _this.clear();
        });
    };
    ;
    DirectionsModule.prototype.hideItineraryPanel = function () {
        //this.routingControl.hide();
        //App.map().removeControl(this.routingControl);
        //$('.leaflet-routing-container').hide();
        //$('.leaflet-routing-container').prependTo('.directory-menu-content');
        $('#directory-menu-main-container').removeClass();
        $('.directory-menu-header');
        $('#search-bar').removeClass();
    };
    DirectionsModule.prototype.showItineraryPanel = function (element) {
        //this.routingControl.show();
        //App.map().addControl(this.routingControl);	
        //$('.leaflet-routing-container').show();
        console.log("show itinerary");
        $('#directory-menu-main-container').removeClass().addClass("directions");
        $('.directory-menu-header').attr('option-id', element.colorOptionId);
        //$('#search-bar').removeClass().addClass(element.colorOptionId);	
        $('.leaflet-routing-container').prependTo('.directory-menu-content');
    };
    DirectionsModule.prototype.clearDirectionMarker = function () {
        if (this.markerDirectionResult !== null) {
            this.markerDirectionResult.setVisible(false);
            this.markerDirectionResult.setMap(null);
            this.markerDirectionResult = null;
        }
    };
    ;
    return DirectionsModule;
}();
exports.DirectionsModule = DirectionsModule;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
var DisplayElementAloneModule = function () {
    function DisplayElementAloneModule() {
        this.elementShownAlone_ = null;
    }
    DisplayElementAloneModule.prototype.getElement = function () {
        return this.elementShownAlone_;
    };
    DisplayElementAloneModule.prototype.begin = function (elementId, panToElementLocation) {
        if (panToElementLocation === void 0) {
            panToElementLocation = true;
        }
        console.log("DisplayElementAloneModule begin", panToElementLocation);
        var element = App.elementById(elementId);
        this.elementShownAlone_ = element;
        if (this.elementShownAlone_ !== null) {
            this.elementShownAlone_.hide();
            this.elementShownAlone_.isShownAlone = false;
        }
        // if (App.state == AppStates.Constellation) App.elementModule.focusOnThesesElements([element.id]);
        // else 
        // {
        //App.elementModule.clearMarkers();
        App.elementModule.clearCurrentsElement();
        //}			
        App.elementModule.showElement(element);
        App.mapComponent.addMarker(element.marker.getLeafletMarker());
        element.isShownAlone = true;
        App.infoBarComponent.showElement(element.id);
        if (panToElementLocation) {
            // we set a timeout to let the infobar show up
            // if we not do so, the map will not be centered in the element.position
            setTimeout(function () {
                App.mapComponent.panToLocation(element.position, 12, false);
            }, 500);
        }
    };
    ;
    DisplayElementAloneModule.prototype.end = function () {
        if (this.elementShownAlone_ === null) return;
        // if (App.state == AppStates.Constellation) App.elementModule.clearFocusOnThesesElements([this.elementShownAlone_.getId()]);
        // else 
        // {
        App.elementModule.updateElementsToDisplay(true, true);
        //}
        App.mapComponent.removeMarker(this.elementShownAlone_.marker.getLeafletMarker());
        this.elementShownAlone_.isShownAlone = false;
        this.elementShownAlone_ = null;
    };
    ;
    return DisplayElementAloneModule;
}();
exports.DisplayElementAloneModule = DisplayElementAloneModule;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ElementsModule = undefined;

var _app = require("../app.module");

var _cookies = require("../utils/cookies");

var Cookies = _interopRequireWildcard(_cookies);

var _event = require("../utils/event");

var _element = require("../classes/element.class");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
var ElementsModule = function () {
    function ElementsModule() {
        this.onElementsChanged = new _event.Event();
        this.everyElements_ = [];
        this.everyElementsId_ = [];
        // current visible elements
        this.visibleElements_ = [];
        this.favoriteIds_ = [];
        this.isShowingHalfHidden = false;
        var cookies = Cookies.readCookie('FavoriteIds');
        if (cookies !== null) {
            this.favoriteIds_ = JSON.parse(cookies);
        } else this.favoriteIds_ = [];
    }
    ElementsModule.prototype.initialize = function () {
        this.everyElements_['all'] = [];
        this.visibleElements_['all'] = [];
        for (var _i = 0, _a = App.categoryModule.getMainOptions(); _i < _a.length; _i++) {
            var option = _a[_i];
            this.everyElements_[option.id] = [];
            this.visibleElements_[option.id] = [];
        }
    };
    ElementsModule.prototype.checkCookies = function () {
        for (var j = 0; j < this.favoriteIds_.length; j++) {
            this.addFavorite(this.favoriteIds_[j], false);
        }
    };
    ;
    ElementsModule.prototype.addJsonElements = function (elementList, checkIfAlreadyExist) {
        var _this = this;
        if (checkIfAlreadyExist === void 0) {
            checkIfAlreadyExist = true;
        }
        var element, elementJson;
        var newElements = [];
        var start = new Date().getTime();
        var elementsIdsReceived = elementList.map(function (e, index) {
            return {
                id: e.id,
                index: index
            };
        });
        var newIds = elementsIdsReceived.filter(function (obj) {
            return _this.everyElementsId_.indexOf(obj.id) < 0;
        });
        // if (newIds.length != elementList.length)
        // 	console.log("DES ACTEURS EXISTAIENT DEJA", elementList.length - newIds.length)
        var i = newIds.length;
        while (i--) {
            elementJson = elementList[newIds[i].index];
            element = new _element.Element(elementJson);
            element.initialize();
            for (var _i = 0, _a = element.mainOptionOwnerIds; _i < _a.length; _i++) {
                var mainId = _a[_i];
                this.everyElements_[mainId].push(element);
            }
            this.everyElements_['all'].push(element);
            this.everyElementsId_.push(element.id);
            newElements.push(element);
        }
        this.checkCookies();
        var end = new Date().getTime();
        console.log("AddJsonElements in " + (end - start) + " ms", elementJson);
        return newElements;
    };
    ;
    ElementsModule.prototype.showElement = function (element) {
        element.show();
        //if (!element.isDisplayed) App.mapComponent.addMarker(element.marker.getLeafletMarker());
        this.currVisibleElements().push(element);
    };
    ElementsModule.prototype.addFavorite = function (favoriteId, modifyCookies) {
        if (modifyCookies === void 0) {
            modifyCookies = true;
        }
        var element = this.getElementById(favoriteId);
        if (element !== null) element.isFavorite = true;else return;
        if (modifyCookies) {
            this.favoriteIds_.push(favoriteId);
            Cookies.createCookie('FavoriteIds', JSON.stringify(this.favoriteIds_));
        }
    };
    ;
    ElementsModule.prototype.removeFavorite = function (favoriteId, modifyCookies) {
        if (modifyCookies === void 0) {
            modifyCookies = true;
        }
        var element = this.getElementById(favoriteId);
        if (element !== null) element.isFavorite = false;
        if (modifyCookies) {
            var index = this.favoriteIds_.indexOf(favoriteId);
            if (index > -1) this.favoriteIds_.splice(index, 1);
            Cookies.createCookie('FavoriteIds', JSON.stringify(this.favoriteIds_));
        }
    };
    ;
    ElementsModule.prototype.clearCurrentsElement = function () {
        //console.log("clearCurrElements");
        var l = this.currVisibleElements().length;
        while (l--) {
            this.currVisibleElements()[l].hide();
            this.currVisibleElements()[l].isDisplayed = false;
        }
        var markers = this.currVisibleElements().map(function (e) {
            return e.marker.getLeafletMarker();
        });
        App.mapComponent.removeMarkers(markers);
        this.clearCurrVisibleElements();
    };
    ElementsModule.prototype.updateElementsIcons = function (somethingChanged) {
        if (somethingChanged === void 0) {
            somethingChanged = false;
        }
        //console.log("UpdateCurrElements somethingChanged", somethingChanged);
        var start = new Date().getTime();
        var l = this.currVisibleElements().length;
        var element;
        while (l--) {
            element = this.currVisibleElements()[l];
            if (somethingChanged) element.needToBeUpdatedWhenShown = true;
            // if domMarker not visible that's mean that marker is in a cluster
            if (element.marker.domMarker().is(':visible')) element.update();
        }
        var end = new Date().getTime();
        var time = end - start;
        //window.console.log("updateElementsIcons " + time + " ms");
    };
    // check elements in bounds and who are not filtered
    ElementsModule.prototype.updateElementsToDisplay = function (checkInAllElements, forceRepaint, filterHasChanged) {
        if (checkInAllElements === void 0) {
            checkInAllElements = true;
        }
        if (forceRepaint === void 0) {
            forceRepaint = false;
        }
        if (filterHasChanged === void 0) {
            filterHasChanged = false;
        }
        // in these state,there is no need to update elements to display
        if ((App.state == _app.AppStates.ShowElementAlone || App.state == _app.AppStates.ShowDirections) && App.mode == _app.AppModes.Map) return;
        if (App.mode == _app.AppModes.Map && !App.mapComponent.isMapLoaded) return;
        var elements = null;
        if (checkInAllElements || this.visibleElements_.length === 0) elements = this.currEveryElements();else elements = this.currVisibleElements();
        //elements = this.currEveryElements();		
        //console.log("UPDATE ELEMENTS ", elements.length);
        var i, element;
        var bounds;
        var newElements = [];
        var elementsToRemove = [];
        var elementsChanged = false;
        var filterModule = App.filterModule;
        i = elements.length;
        //console.log("updateElementsToDisplay. Nbre element à traiter : " + i, checkInAllElements);
        var start = new Date().getTime();
        while (i-- /*&& this.visibleElements_.length < App.getMaxElements()*/) {
            element = elements[i];
            // in List mode we don't need to check bounds;
            var elementInBounds = App.mode == _app.AppModes.List || App.mapComponent.extendedContains(element.position);
            if (elementInBounds && filterModule.checkIfElementPassFilters(element)) {
                if (!element.isDisplayed) {
                    element.isDisplayed = true;
                    this.currVisibleElements().push(element);
                    newElements.push(element);
                    elementsChanged = true;
                }
            } else {
                if (element.isDisplayed) {
                    element.isDisplayed = false;
                    elementsToRemove.push(element);
                    elementsChanged = true;
                    var index = this.currVisibleElements().indexOf(element);
                    if (index > -1) this.currVisibleElements().splice(index, 1);
                }
            }
        }
        // if (this.visibleElements_.length >= App.getMaxElements())
        // {
        // 	/*$('#too-many-markers-modal').show().fadeTo( 500 , 1);
        // 	this.clearMarkers();		
        // 	return;*/
        // 	//console.log("Toomany markers. Nbre markers : " + this.visibleElements_.length + " // MaxMarkers = " + App.getMaxElements());
        // }
        // else
        // {
        // 	$('#too-many-markers-modal:visible').fadeTo(600,0, function(){ $(this).hide(); });
        // }
        var end = new Date().getTime();
        var time = end - start;
        //window.console.log("UpdateElementsToDisplay en " + time + " ms");		
        if (elementsChanged || forceRepaint) {
            this.onElementsChanged.emit({
                elementsToDisplay: this.currVisibleElements(),
                newElements: newElements,
                elementsToRemove: elementsToRemove
            });
        }
        this.updateElementsIcons(filterHasChanged);
    };
    ;
    ElementsModule.prototype.currVisibleElements = function () {
        return this.visibleElements_[App.currMainId];
    };
    ;
    ElementsModule.prototype.currEveryElements = function () {
        return this.everyElements_[App.currMainId];
    };
    ;
    ElementsModule.prototype.clearCurrVisibleElements = function () {
        this.visibleElements_[App.currMainId] = [];
    };
    ;
    ElementsModule.prototype.allElements = function () {
        return this.everyElements_['all'];
    };
    ElementsModule.prototype.clearMarkers = function () {
        console.log("clearMarkers");
        this.hideAllMarkers();
        this.clearCurrVisibleElements();
    };
    ;
    ElementsModule.prototype.getMarkers = function () {
        var markers = [];
        var l = this.visibleElements_.length;
        while (l--) {
            markers.push(this.currVisibleElements()[l].marker);
        }
        return markers;
    };
    ;
    ElementsModule.prototype.hidePartiallyAllMarkers = function () {
        this.isShowingHalfHidden = true;
        var l = this.currVisibleElements().length;
        while (l--) {
            if (this.currVisibleElements()[l].marker) this.currVisibleElements()[l].marker.showHalfHidden();
        }
    };
    ;
    ElementsModule.prototype.hideAllMarkers = function () {
        var l = this.currVisibleElements().length;
        while (l--) {
            this.currVisibleElements()[l].hide();
        }
    };
    ;
    ElementsModule.prototype.showNormalHiddenAllMarkers = function () {
        this.isShowingHalfHidden = false;
        $('.marker-cluster').removeClass('halfHidden');
        var l = this.currVisibleElements().length;
        while (l--) {
            if (this.currVisibleElements()[l].marker) this.currVisibleElements()[l].marker.showNormalHidden();
        }
    };
    ;
    ElementsModule.prototype.getElementById = function (elementId) {
        //return this.everyElements_[elementId];
        for (var i = 0; i < this.allElements().length; i++) {
            if (this.allElements()[i].id == elementId) return this.allElements()[i];
        }
        return null;
    };
    ;
    return ElementsModule;
}();
exports.ElementsModule = ElementsModule;

},{"../app.module":4,"../classes/element.class":9,"../utils/cookies":28,"../utils/event":29}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterModule = undefined;

var _commons = require("../../commons/commons");

var FilterModule = function () {
    function FilterModule() {
        this.showOnlyFavorite_ = false;
        this.showPending_ = true;
    }
    FilterModule.prototype.showOnlyFavorite = function (bool) {
        this.showOnlyFavorite_ = bool;
    };
    ;
    FilterModule.prototype.showPending = function (bool) {
        this.showPending_ = bool;
    };
    ;
    FilterModule.prototype.checkIfElementPassFilters = function (element) {
        if (this.showOnlyFavorite_) return element.isFavorite;
        if (!this.showPending_ && element.isPending()) return false;
        if (App.currMainId == 'all') {
            var elementOptions = element.getOptionValueByCategoryId(App.categoryModule.mainCategory.id);
            var checkedOptions_1 = App.categoryModule.mainCategory.checkedOptions;
            //console.log("\nelementsOptions", elementOptions.map( (value) => value.option.name));
            //console.log("checkedOptions", checkedOptions.map( (value) => value.name));
            var result = elementOptions.some(function (optionValue) {
                return checkedOptions_1.indexOf(optionValue.option) > -1;
            });
            //console.log("return", result);
            return result;
        } else {
            var mainOption = App.categoryModule.getCurrMainOption();
            var isPassingFilters = this.recursivelyCheckedInOption(mainOption, element);
            if (isPassingFilters && element.openHours) {
                isPassingFilters = element.openHoursDays.some(function (day) {
                    return App.categoryModule.openHoursFiltersDays.indexOf(day) > -1;
                });
            }
            return isPassingFilters;
        }
    };
    FilterModule.prototype.recursivelyCheckedInOption = function (option, element) {
        var _this = this;
        var ecart = "";
        for (var i = 0; i < option.depth; i++) {
            ecart += "--";
        }var log = false;
        if (log) console.log(ecart + "Check for option ", option.name);
        var result;
        if (option.subcategories.length == 0 || option.isDisabled && !option.isMainOption) {
            if (log) console.log(ecart + "No subcategories ");
            result = option.isChecked;
        } else {
            result = option.subcategories.every(function (category) {
                if (log) console.log("--" + ecart + "Category", category.name);
                var checkedOptions = category.checkedOptions;
                var elementOptions = element.getOptionValueByCategoryId(category.id);
                var isSomeOptionInCategoryCheckedOptions = elementOptions.some(function (optionValue) {
                    return checkedOptions.indexOf(optionValue.option) > -1;
                });
                if (log) console.log("--" + ecart + "isSomeOptionInCategoryCheckedOptions", isSomeOptionInCategoryCheckedOptions);
                if (isSomeOptionInCategoryCheckedOptions) return true;else {
                    if (log) console.log("--" + ecart + "So we checked in suboptions", category.name);
                    return elementOptions.some(function (optionValue) {
                        return _this.recursivelyCheckedInOption(optionValue.option, element);
                    });
                }
            });
        }
        if (log) console.log(ecart + "Return ", result);
        return result;
    };
    FilterModule.prototype.loadFiltersFromString = function (string) {
        var splited = string.split('@');
        var mainOptionSlug = splited[0];
        var mainOptionId = mainOptionSlug == 'all' ? 'all' : App.categoryModule.getMainOptionBySlug(mainOptionSlug).id;
        App.directoryMenuComponent.setMainOption(mainOptionId);
        var filtersString;
        var addingMode;
        if (splited.length == 2) {
            filtersString = splited[1];
            if (filtersString[0] == '!') addingMode = false;else addingMode = true;
            filtersString = filtersString.substring(1);
        } else if (splited.length > 2) {
            console.error("Error spliting in loadFilterFromString");
        }
        var filters = (0, _commons.parseStringIntoArrayNumber)(filtersString);
        //console.log('filters', filters);
        //console.log('addingMode', addingMode);
        // if addingMode, we first put all the filter to false
        if (addingMode) {
            if (mainOptionSlug == 'all') App.categoryModule.mainCategory.toggle(false, false);else {
                for (var _i = 0, _a = App.categoryModule.getMainOptionBySlug(mainOptionSlug).subcategories; _i < _a.length; _i++) {
                    var cat = _a[_i];
                    for (var _b = 0, _c = cat.options; _b < _c.length; _b++) {
                        var option = _c[_b];
                        option.toggle(false, false);
                    }
                }
            }
            App.categoryModule.openHoursCategory.toggle(false, false);
        }
        for (var _d = 0, filters_1 = filters; _d < filters_1.length; _d++) {
            var filterId = filters_1[_d];
            var option = App.categoryModule.getOptionById(filterId);
            if (!option) console.log("Error loadings filters : " + filterId);else option.toggle(addingMode, false);
        }
        if (mainOptionSlug == 'all') App.categoryModule.mainCategory.updateState();else App.categoryModule.getMainOptionBySlug(mainOptionSlug).recursivelyUpdateStates();
        App.elementModule.updateElementsToDisplay(true);
        //App.historyModule.updateCurrState();
    };
    FilterModule.prototype.getFiltersToString = function () {
        var mainOptionId = App.currMainId;
        var mainOptionName;
        var checkArrayToParse, uncheckArrayToParse;
        if (mainOptionId == 'all') {
            mainOptionName = "all";
            checkArrayToParse = App.categoryModule.mainCategory.checkedOptions.map(function (option) {
                return option.id;
            });
            uncheckArrayToParse = App.categoryModule.mainCategory.disabledOptions.map(function (option) {
                return option.id;
            });
        } else {
            var mainOption = App.categoryModule.getMainOptionById(mainOptionId);
            mainOptionName = mainOption.nameShort;
            var allOptions = mainOption.allChildrenOptions;
            checkArrayToParse = allOptions.filter(function (option) {
                return option.isChecked;
            }).map(function (option) {
                return option.id;
            });
            uncheckArrayToParse = allOptions.filter(function (option) {
                return option.isDisabled;
            }).map(function (option) {
                return option.id;
            });
            if (mainOption.showOpenHours) {
                checkArrayToParse = checkArrayToParse.concat(App.categoryModule.openHoursCategory.checkedOptions.map(function (option) {
                    return option.id;
                }));
                uncheckArrayToParse = uncheckArrayToParse.concat(App.categoryModule.openHoursCategory.disabledOptions.map(function (option) {
                    return option.id;
                }));
            }
        }
        var checkedIdsParsed = (0, _commons.parseArrayNumberIntoString)(checkArrayToParse);
        var uncheckedIdsParsed = (0, _commons.parseArrayNumberIntoString)(uncheckArrayToParse);
        var addingMode = checkedIdsParsed.length < uncheckedIdsParsed.length;
        var addingSymbol = addingMode ? '+' : '!';
        var filtersString = addingMode ? checkedIdsParsed : uncheckedIdsParsed;
        if (!addingMode && filtersString == "") return mainOptionName;
        return mainOptionName + '@' + addingSymbol + filtersString;
    };
    return FilterModule;
}(); /**
      * This file is part of the MonVoisinFaitDuBio project.
      * For the full copyright and license information, please view the LICENSE
      * file that was distributed with this source code.
      *
      * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
      * @license    MIT License
      * @Last Modified time: 2016-12-13
      */
exports.FilterModule = FilterModule;

},{"../../commons/commons":1}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GeocoderModule = undefined;

var _commons = require('../../commons/commons');

/**
* Interface between GeocoderJS and the App
* Allow to change geocode technology without changing code in the App
*/
var GeocoderModule = function () {
    function GeocoderModule() {
        this.geocoder = null;
        this.lastAddressRequest = '';
        this.lastResults = null;
        this.lastResultBounds = null;
        this.geocoder = GeocoderJS.createGeocoder({ 'provider': 'openstreetmap', 'countrycodes': 'fr' });
        //this.geocoder = GeocoderJS.createGeocoder({'provider': 'google'});
    }
    GeocoderModule.prototype.getLocation = function () {
        if (!this.lastResults || !this.lastResults[0]) return null;
        return L.latLng(this.lastResults[0].getCoordinates());
    };
    GeocoderModule.prototype.getBounds = function () {
        if (!this.lastResultBounds) return null;
        return this.lastResultBounds;
    };
    GeocoderModule.prototype.latLngBoundsFromRawBounds = function (rawbounds) {
        var corner1 = L.latLng(rawbounds[0], rawbounds[1]);
        var corner2 = L.latLng(rawbounds[2], rawbounds[3]);
        return L.latLngBounds(corner1, corner2);
    };
    GeocoderModule.prototype.getLocationSlug = function () {
        return (0, _commons.slugify)(this.lastAddressRequest);
    };
    GeocoderModule.prototype.getLocationAddress = function () {
        return this.lastAddressRequest;
    };
    GeocoderModule.prototype.setLocationAddress = function ($address) {
        this.lastAddressRequest = $address;
    };
    GeocoderModule.prototype.geocodeAddress = function (address, callbackComplete, callbackFail) {
        var _this = this;
        //console.log("geocode address : ", address);
        this.lastAddressRequest = address;
        // if no address, we show france
        if (address == '') {
            console.log("default location");
            this.lastResults = [];
            this.lastResultBounds = this.latLngBoundsFromRawBounds([51.68617954855624, 8.833007812500002, 42.309815415686664, -5.339355468750001]);
            // leave time for map to load
            setTimeout(function () {
                callbackComplete(_this.lastResults);
            }, 200);
        } else {
            // fake geocoder when no internet connexion
            var fake = false;
            if (!fake) {
                this.geocoder.geocode(address, function (results) {
                    if (results !== null) {
                        _this.lastResults = results;
                        _this.lastResultBounds = _this.latLngBoundsFromRawBounds(_this.lastResults[0].getBounds());
                        if (callbackComplete) callbackComplete(results);
                    } else {
                        if (callbackFail) callbackFail();
                    }
                });
            } else {
                var result = {
                    bounds: [.069185, -0.641415, 44.1847351, -0.4699835],
                    city: 'Labrit',
                    formattedAddress: "Labrit 40420",
                    latitude: 44.1049567,
                    longitude: -0.5445296,
                    postal_code: "40420",
                    region: "Nouvelle-Aquitaine",
                    getBounds: function getBounds() {
                        return this.bounds;
                    },
                    getCoordinates: function getCoordinates() {
                        return [this.latitude, this.longitude];
                    },
                    getFormattedAddress: function getFormattedAddress() {
                        return this.formattedAddress;
                    }
                };
                var results = [];
                results.push(result);
                this.lastResults = results;
                this.lastResultBounds = this.latLngBoundsFromRawBounds(this.lastResults[0].getBounds());
                callbackComplete(results);
            }
        }
    };
    ;
    return GeocoderModule;
}();
exports.GeocoderModule = GeocoderModule;

},{"../../commons/commons":1}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HistoryModule = exports.HistoryState = undefined;

var _commons = require("../../commons/commons");

var _app = require("../app.module");

var _map = require("../components/map/map.component");

$(document).ready(function () {
    // Gets history state from browser
    window.onpopstate = function (event) {
        //console.log("\n\nOnpopState ", event.state.filters);
        var historystate = event.state;
        // transform jsonViewport into ViewPort object (if we don't do so,
        // the ViewPort methods will not be accessible)
        historystate.viewport = $.extend(new _map.ViewPort(), event.state.viewport);
        App.loadHistoryState(event.state, true);
    };
}); /**
     * This file is part of the MonVoisinFaitDuBio project.
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     *
     * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
     * @license    MIT License
     * @Last Modified time: 2016-12-13
     */

var HistoryState = function () {
    function HistoryState() {}
    HistoryState.prototype.parse = function ($historyState) {
        this.mode = $historyState.mode == 'Map' ? _app.AppModes.Map : _app.AppModes.List;
        this.state = parseInt(_app.AppStates[$historyState.state]);
        this.address = $historyState.address;
        this.viewport = new _map.ViewPort().fromString($historyState.viewport);
        this.id = $historyState.id;
        this.filters = $historyState.filters;
        return this;
    };
    return HistoryState;
}();
exports.HistoryState = HistoryState;

var HistoryModule = function () {
    function HistoryModule() {}
    HistoryModule.prototype.updateCurrState = function (options) {
        //console.log("Update Curr State");
        if (!history.state) {
            console.log("curr state null");
            this.pushNewState();
        }
        this.updateHistory(false, options);
    };
    ;
    HistoryModule.prototype.pushNewState = function (options) {
        //console.log("Push New State");
        if (history.state === null) this.updateHistory(false, options);else this.updateHistory(true, options);
    };
    ;
    HistoryModule.prototype.updateHistory = function ($pushState, $options) {
        if (App.mode == undefined) return;
        $options = $options || {};
        var historyState = new HistoryState();
        historyState.mode = App.mode;
        historyState.state = App.state;
        historyState.address = App.geocoder.getLocationSlug();
        historyState.viewport = App.mapComponent.viewport;
        historyState.id = App.infoBarComponent.getCurrElementId() || $options.id;
        historyState.filters = App.filterModule.getFiltersToString();
        // if ($pushState) console.log("NEW Sate", historyState.filters);
        // else console.log("UPDATE State", historyState.filters);
        var route = this.generateRoute(historyState);
        if (!route) return;
        if ($pushState) {
            history.pushState(historyState, '', route);
        } else {
            //console.log("Replace state", historyState);
            history.replaceState(historyState, '', route);
        }
    };
    ;
    HistoryModule.prototype.generateRoute = function (historyState) {
        var route;
        var mode = App.mode == _app.AppModes.Map ? 'carte' : 'liste';
        var address = historyState.address;
        var viewport = historyState.viewport;
        var addressAndViewport = '';
        if (address) addressAndViewport += address;
        // in Map Mode we add viewport
        // in List mode we add viewport only when no address provided
        if (viewport && (App.mode == _app.AppModes.Map || !address)) addressAndViewport += viewport.toString();
        // in list mode we don't care about state
        if (App.mode == _app.AppModes.List) {
            route = Routing.generate('biopen_directory_normal', { mode: mode });
            if (addressAndViewport) route += '/' + addressAndViewport;
        } else {
            switch (App.state) {
                case _app.AppStates.Normal:
                    route = Routing.generate('biopen_directory_normal', { mode: mode });
                    // forjsrouting doesn't support speacial characts like in viewport
                    // so we add them manually
                    if (addressAndViewport) route += '/' + addressAndViewport;
                    break;
                case _app.AppStates.ShowElement:
                case _app.AppStates.ShowElementAlone:
                case _app.AppStates.ShowDirections:
                    if (!historyState.id) return;
                    var element = App.elementById(historyState.id);
                    if (!element) return;
                    if (App.state == _app.AppStates.ShowDirections) {
                        route = Routing.generate('biopen_directory_showDirections', { name: (0, _commons.capitalize)((0, _commons.slugify)(element.name)), id: element.id });
                    } else {
                        route = Routing.generate('biopen_directory_showElement', { name: (0, _commons.capitalize)((0, _commons.slugify)(element.name)), id: element.id });
                    }
                    // forjsrouting doesn't support speacial characts like in viewport
                    // so we add them manually
                    if (addressAndViewport) route += '/' + addressAndViewport;
                    break;
            }
        }
        if (historyState.filters) route += '?cat=' + historyState.filters;
        // for (let key in options)
        // {
        // 	route += '?' + key + '=' + options[key];
        // 	//route += '/' + key + '/' + options[key];
        // }
        //console.log("route generated", route);
        return route;
    };
    ;
    return HistoryModule;
}();
exports.HistoryModule = HistoryModule;

},{"../../commons/commons":1,"../app.module":4,"../components/map/map.component":17}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createCookie = createCookie;
exports.readCookie = readCookie;
exports.eraseCookie = eraseCookie;
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */function createCookie(name, value) {
    var days = 100;
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name, "");
}

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Event = function () {
    function Event() {
        this.handlers = [];
    }
    Event.prototype.do = function (handler) {
        this.handlers.push(handler);
    };
    Event.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) {
            return h !== handler;
        });
    };
    Event.prototype.emit = function (data) {
        this.handlers.slice(0).forEach(function (h) {
            return h(data);
        });
    };
    return Event;
}();
exports.Event = Event;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvY29tbW9ucy9jb21tb25zLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2NvbW1vbnMvc2VhcmNoLWJhci5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2FwcC1pbnRlcmFjdGlvbnMudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2FwcC5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NsYXNzZXMvY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jYXRlZ29yeS12YWx1ZS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jYXRlZ29yeS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jbGFzc2VzLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jbGFzc2VzL2VsZW1lbnQuY2xhc3MudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NsYXNzZXMvb3B0aW9uLXZhbHVlLmNsYXNzLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jbGFzc2VzL29wdGlvbi5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9kaXJlY3RvcnktbWVudS5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvZWxlbWVudC1saXN0LmNvbXBvbmVudC50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9lbGVtZW50LW1lbnUuY29tcG9uZW50LnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jb21wb25lbnRzL2luZm8tYmFyLmNvbXBvbmVudC50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9tYXAvYmlvcGVuLW1hcmtlci5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvbWFwL21hcC5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvdm90ZS5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvYWpheC5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvYm91bmRzLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9jYXRlZ29yaWVzLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9kaXJlY3Rpb25zLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9kaXNwbGF5LWVsZW1lbnQtYWxvbmUubW9kdWxlLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9tb2R1bGVzL2VsZW1lbnRzLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9maWx0ZXIubW9kdWxlLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9tb2R1bGVzL2dlb2NvZGVyLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9oaXN0b3J5Lm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvdXRpbHMvY29va2llcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvdXRpbHMvZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7NkJDV29DLEFBQUssT0FBRSxBQUFnQyxTQUFFLEFBQVU7QUFBNUMsNEJBQUE7QUFBQSxrQkFBVSxBQUFDLEVBQUMsQUFBYSxBQUFDLGVBQUMsQUFBRyxBQUFFOztBQUFFLDBCQUFBO0FBQUEsZ0JBQVU7O0FBRW5GLEFBQUUsQUFBQyxRQUFDLENBQUMsQUFBSyxBQUFDLE9BQUMsQUFBTSxPQUFDLEFBQVEsU0FBQyxBQUFJLE9BQUcsQUFBTyxRQUFDLEFBQVEsU0FB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Q29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0wOC0zMVxuICovXG5kZWNsYXJlIHZhciBSb3V0aW5nLCAkO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkaXJlY3RUb0RpcmVjdG9yeShyb3V0ZSwgYWRkcmVzcyA9ICQoJyNzZWFyY2gtYmFyJykudmFsKCksIHJhbmdlID0gJycpXG57ICAgIFxuICAgIGlmICghcmFuZ2UpIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gUm91dGluZy5nZW5lcmF0ZShyb3V0ZSwgeyBzbHVnIDogc2x1Z2lmeShhZGRyZXNzKSB9KTtcbiAgICBlbHNlIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gUm91dGluZy5nZW5lcmF0ZShyb3V0ZSwgeyBzbHVnIDogc2x1Z2lmeShhZGRyZXNzKSwgZGlzdGFuY2UgOiByYW5nZX0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2x1Z2lmeSh0ZXh0KSA6IHN0cmluZ1xue1xuICBpZiAoIXRleHQpIHJldHVybiAnJztcbiAgcmV0dXJuIHRleHQudG9TdHJpbmcoKS8vLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxzKy9nLCAnLScpICAgICAgICAgICAvLyBSZXBsYWNlIHNwYWNlcyB3aXRoIC1cbiAgICAucmVwbGFjZSgvW15cXHdcXC1dKy9nLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xuICAgIC5yZXBsYWNlKC9cXC1cXC0rL2csICctJykgICAgICAgICAvLyBSZXBsYWNlIG11bHRpcGxlIC0gd2l0aCBzaW5nbGUgLVxuICAgIC5yZXBsYWNlKC9eLSsvLCAnJykgICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gc3RhcnQgb2YgdGV4dFxuICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuc2x1Z2lmeSh0ZXh0IDogc3RyaW5nKSA6IHN0cmluZ1xue1xuICBpZiAoIXRleHQpIHJldHVybiAnJztcbiAgcmV0dXJuIHRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXC0rL2csICcgJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHRleHQpXG57XG4gICAgcmV0dXJuIHRleHQuc3Vic3RyKDAsMSkudG9VcHBlckNhc2UoKSt0ZXh0LnN1YnN0cigxLHRleHQubGVuZ3RoKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UXVlcnlQYXJhbXMocXMpIFxue1xuICAgIHFzID0gcXMuc3BsaXQoXCIrXCIpLmpvaW4oXCIgXCIpO1xuICAgIHZhciBwYXJhbXMgPSB7fSxcbiAgICAgICAgdG9rZW5zLFxuICAgICAgICByZSA9IC9bPyZdPyhbXj1dKyk9KFteJl0qKS9nO1xuXG4gICAgd2hpbGUgKCh0b2tlbnMgPSByZS5leGVjKHFzKSkpIHtcbiAgICAgICAgcGFyYW1zW2RlY29kZVVSSUNvbXBvbmVudCh0b2tlbnNbMV0pXSA9IGRlY29kZVVSSUNvbXBvbmVudCh0b2tlbnNbMl0pO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUFycmF5TnVtYmVySW50b1N0cmluZyhhcnJheSA6IG51bWJlcltdKSA6IHN0cmluZ1xue1xuICAgIGxldCByZXN1bHQgID0gJyc7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgZm9yKGxldCBudW1iZXIgb2YgYXJyYXkpXG4gICAge1xuICAgICAgICBpZiAoaSAlIDIgPT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHBhcnNlTnVtYmVyVG9TdHJpbmcobnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGFyc2VOdW1iZXJUb1N0cmluZyhudW1iZXIgOiBudW1iZXIpIDogc3RyaW5nXG57ICAgIFxuICAgIGxldCBiYXNlMjYgPSBudW1iZXIudG9TdHJpbmcoMjYpO1xuICAgIGxldCBpID0gMDsgXG4gICAgbGV0IGxlbmd0aCA9IGJhc2UyNi5sZW5ndGg7XG5cbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIFxuICAgIHtcbiAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDk2ICsgcGFyc2VJbnQoYmFzZTI2W2ldLDI2KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmdUb051bWJlcihzdHJpbmcgOiBzdHJpbmcpIDogbnVtYmVyXG57ICAgIFxuICAgIGxldCBpID0gMDsgXG4gICAgbGV0IGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgICBsZXQgcmVzdWx0ID0gMDtcblxuICAgIGZvciAoaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBcbiAgICB7XG4gICAgICByZXN1bHQgKz0gKHN0cmluZy5jaGFyQ29kZUF0KGkpIC0gOTYpICogTWF0aC5wb3coMjYsIGxlbmd0aCAtIGkgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTdHJpbmdJbnRvQXJyYXlOdW1iZXIoc3RyaW5nIDogc3RyaW5nKSA6IG51bWJlcltdXG57XG4gICAgbGV0IHJlc3VsdCA6IG51bWJlcltdID0gW107XG5cbiAgICBpZiAoIXN0cmluZykgcmV0dXJuIHJlc3VsdDtcblxuICAgIGxldCBhcnJheSA9IHN0cmluZy5tYXRjaCgvW2Etel0rfFswLTldKy9nKTtcblxuICAgIGZvcihsZXQgZWxlbWVudCBvZiBhcnJheSlcbiAgICB7XG4gICAgICAgIGlmIChwYXJzZUludChlbGVtZW50KSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoZWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VTdHJpbmdUb051bWJlcihlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMDgtMzFcbiAqL1xuXG5kZWNsYXJlIHZhciBnb29nbGUsICQ7XG5cbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vZGlyZWN0b3J5L3V0aWxzL2V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBTZWFyY2hCYXJDb21wb25lbnRcbntcblx0ZG9tSWQ7XG5cblx0b25TZWFyY2ggPSBuZXcgRXZlbnQ8c3RyaW5nPigpO1xuXG5cdGRvbUVsZW1lbnQoKSB7IHJldHVybiAkKGAjJHt0aGlzLmRvbUlkfWApOyB9XG5cblx0Y29uc3RydWN0b3IoZG9tSWQgOiBzdHJpbmcpXG5cdHtcdFxuXHRcdHRoaXMuZG9tSWQgPSBkb21JZDtcblxuXHRcdC8vIGhhbmRsZSBhbGwgdmFsaWRhdGlvbiBieSB1c2VyIChlbnRlciBwcmVzcywgaWNvbiBjbGljay4uLilcblx0XHR0aGlzLmRvbUVsZW1lbnQoKS5rZXl1cCgoZSkgPT5cblx0XHR7ICAgIFxuXHRcdFx0aWYoZS5rZXlDb2RlID09IDEzKSAvLyB0b3VjaGUgZW50csOpZVxuXHRcdFx0eyBcdFx0XHQgXG5cdFx0XHRcdHRoaXMuaGFuZGxlU2VhcmNoQWN0aW9uKCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuZG9tSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5kb21FbGVtZW50KCkucGFyZW50cygpLmZpbmQoJyNzZWFyY2gtYmFyLWljb24nKS5jbGljaygoKSA9PlxuXHRcdHtcdFx0XHRcdFx0XG5cdFx0XHR0aGlzLmhhbmRsZVNlYXJjaEFjdGlvbigpO1xuXHRcdH0pO1x0XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQoKS5vbihcInBsYWNlX2NoYW5nZWRcIiwgdGhpcy5oYW5kbGVTZWFyY2hBY3Rpb24oKSk7XG5cdH1cblxuXG5cdHByaXZhdGUgaGFuZGxlU2VhcmNoQWN0aW9uKClcblx0e1xuXHRcdHRoaXMub25TZWFyY2guZW1pdCh0aGlzLmRvbUVsZW1lbnQoKS52YWwoKSk7XG5cdH1cblxuXHRzZXRWYWx1ZSgkdmFsdWUgOiBzdHJpbmcpXG5cdHtcblx0XHR0aGlzLmRvbUVsZW1lbnQoKS52YWwoJHZhbHVlKTtcblx0fSAgXG4gICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0QXV0b0NvbXBsZXRpb25Gb3JFbGVtZW50KGVsZW1lbnQpXG57XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBjb21wb25lbnRSZXN0cmljdGlvbnM6IHtjb3VudHJ5OiAnZnInfVxuICAgIH07XG4gICAgdmFyIGF1dG9jb21wbGV0ZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGVsZW1lbnQsIG9wdGlvbnMpOyAgIFxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGF1dG9jb21wbGV0ZSwgJ3BsYWNlX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdwbGFjZV9jaGFuZ2VkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn0iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi9hcHAubW9kdWxlXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5pbXBvcnQgeyByZWRpcmVjdFRvRGlyZWN0b3J5IH0gZnJvbSBcIi4uL2NvbW1vbnMvY29tbW9uc1wiO1xuXG4vL2RlY2xhcmUgdmFyICQ7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcEludGVyYWN0aW9ucygpXG57XHRcblx0Ly9hbmltYXRpb24gcG91ciBsaWVuIGQnYW5jcmUgZGFucyBsYSBwYWdlXG4gICAvKiAkKCdhW2hyZWZePVwiI1wiXScpLmNsaWNrKGZ1bmN0aW9uKCl7ICBcblx0ICAgIGxldCB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xuXHQgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogJCh0YXJnZXQpLm9mZnNldCgpLnRvcH0sIDcwMCk7XG5cdCAgICByZXR1cm4gZmFsc2U7ICBcblx0fSk7ICovXHRcdFxuXG5cdC8qJCgnI21lbnUtYnV0dG9uJykuY2xpY2soYW5pbWF0ZV91cF9iYW5kZWF1X29wdGlvbnMpO1xuXHQkKCcjb3ZlcmxheScpLmNsaWNrKGFuaW1hdGVfZG93bl9iYW5kZWF1X29wdGlvbnMpOyovXG5cblx0dXBkYXRlQ29tcG9uZW50c1NpemUoKTtcblxuXHQkKCcjYnRuLWJhbmRlYXUtaGVscGVyLWNsb3NlJykuY2xpY2soaGlkZUJhbmRlYXVIZWxwZXIpO1xuXG5cdCQoJy5mbGFzaC1tZXNzYWdlIC5idG4tY2xvc2UnKS5jbGljayggZnVuY3Rpb24oKSB7ICQodGhpcykucGFyZW50KCkuc2xpZGVVcCgnZmFzdCcsIGZ1bmN0aW9uKCkgeyB1cGRhdGVDb21wb25lbnRzU2l6ZSgpOyB9KTsgfSk7XG5cblx0JCgnI2J0bi1jbG9zZS1kaXJlY3Rpb25zJykuY2xpY2soICgpID0+IFxuXHR7XG5cdFx0QXBwLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZCA6IEFwcC5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSB9KTtcblx0fSk7XG5cblx0bGV0IHJlcztcblx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSBcblx0e1xuXHQgICBpZiAocmVzKSB7Y2xlYXJUaW1lb3V0KHJlcyk7IH1cblx0ICAgcmVzID0gc2V0VGltZW91dCh1cGRhdGVDb21wb25lbnRzU2l6ZSwyMDApO1xuXHR9O1x0XG5cdFxuXHQvL01lbnUgQ0FSVEVcdFxuXHQkKCcjbWVudS1idXR0b24nKS5jbGljayhzaG93RGlyZWN0b3J5TWVudSk7XG5cdCQoJyNvdmVybGF5JykuY2xpY2soaGlkZURpcmVjdG9yeU1lbnUpO1xuXHQkKCcjZGlyZWN0b3J5LW1lbnUgLmJ0bi1jbG9zZS1tZW51JykuY2xpY2soaGlkZURpcmVjdG9yeU1lbnUpO1xuXG5cdCQoJyNkaXJlY3RvcnktY29udGVudC1tYXAgLnNob3ctYXMtbGlzdC1idXR0b24nKS5jbGljaygoZSA6IEV2ZW50KSA9PiB7XHRcdFxuXHRcdEFwcC5zZXRUaW1lb3V0Q2xpY2tpbmcoKTtcblx0XHRBcHAuc2V0TW9kZShBcHBNb2Rlcy5MaXN0KTtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCAuc2hvdy1hcy1tYXAtYnV0dG9uJykuY2xpY2soKCkgPT4ge1x0XHRcblx0XHRBcHAuc2V0TW9kZShBcHBNb2Rlcy5NYXApO1xuXHR9KTtcblx0XG5cdC8vIGlmIChvbmx5SW5wdXRBZHJlc3NNb2RlKVxuXHQvLyB7XG5cdC8vIFx0c2hvd09ubHlJbnB1dEFkcmVzcygpO1xuXHQvLyB9XG5cblx0Ly8gJCgnI2xpc3RfdGFiJykuY2xpY2soZnVuY3Rpb24oKXtcblx0Ly8gXHQkKFwiI2RpcmVjdG9yeS1jb250ZW50LWxpc3RcIikuc2hvdygpO1xuXHQvLyBcdCQoJyNkaXJlY3RvcnktY29udGFpbmVyJykuaGlkZSgpO1xuXHQvLyB9KTtcblx0Ly8gJCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcF90YWInKS5jbGljayhmdW5jdGlvbigpe1x0XHRcblx0Ly8gXHQkKCcjZGlyZWN0b3J5LWNvbnRhaW5lcicpLnNob3coKTtcblx0Ly8gXHQkKFwiI2RpcmVjdG9yeS1jb250ZW50LWxpc3RcIikuaGlkZSgpO1xuXHQvLyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dEaXJlY3RvcnlNZW51KClcbntcblx0QXBwLmluZm9CYXJDb21wb25lbnQuaGlkZSgpOyAgXG5cdCQoJyNvdmVybGF5JykuY3NzKCd6LWluZGV4JywnMTAnKTtcblx0JCgnI292ZXJsYXknKS5hbmltYXRlKHsnb3BhY2l0eSc6ICcuNid9LDcwMCk7XG5cdCQoJyNkaXJlY3RvcnktbWVudScpLnNob3coIFwic2xpZGVcIiwge2RpcmVjdGlvbjogJ2xlZnQnLCBlYXNpbmc6ICdzd2luZyd9ICwgMzUwLCAoKSA9PiB7IEFwcC5kaXJlY3RvcnlNZW51Q29tcG9uZW50LnVwZGF0ZU1haW5PcHRpb25CYWNrZ3JvdW5kKCkgfSApO1xuXHRcblx0Ly8kKCcjZGlyZWN0b3J5LW1lbnUnKS5jc3MoJ3dpZHRoJywnMHB4Jykuc2hvdygpLmFuaW1hdGUoeyd3aWR0aCc6ICcyNDBweCd9LDcwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlRGlyZWN0b3J5TWVudSgpXG57XG5cdCQoJyNvdmVybGF5JykuY3NzKCd6LWluZGV4JywnLTEnKTtcblx0JCgnI292ZXJsYXknKS5hbmltYXRlKHsnb3BhY2l0eSc6ICcuMCd9LDUwMCk7XG5cdCQoJyNkaXJlY3RvcnktbWVudScpLmhpZGUoIFwic2xpZGVcIiwge2RpcmVjdGlvbjogJ2xlZnQnLCBlYXNpbmc6ICdzd2luZyd9ICwgMjUwICk7XG5cdCQoJyNtZW51LXRpdGxlIC5zaGFkb3ctYm90dG9tJykuaGlkZSgpO1xuXHQvLyQoJyNkaXJlY3RvcnktbWVudScpLmFuaW1hdGUoeyd3aWR0aCc6ICcwcHgnfSw3MDApLmhpZGUoKTtcbn1cblxubGV0IHNsaWRlT3B0aW9ucyA9IHsgZHVyYXRpb246IDUwMCwgZWFzaW5nOiBcImVhc2VPdXRRdWFydFwiLCBxdWV1ZTogZmFsc2UsIGNvbXBsZXRlOiBmdW5jdGlvbigpIHt9fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVCYW5kZWF1SGVscGVyKClcbntcblx0JCgnI2JhbmRlYXVfaGVscGVyJykuc2xpZGVVcChzbGlkZU9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd09ubHlJbnB1dEFkcmVzcygpXG57XG5cdGhpZGVCYW5kZWF1SGVscGVyKCk7XG5cdCQoJyNkaXJlY3RvcnktY29udGVudCcpLmNzcygnbWFyZ2luLWxlZnQnLCcwJyk7XG5cdCQoJyNiYW5kZWF1X3RhYnMnKS5oaWRlKCk7XG5cdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0JykuaGlkZSgpO1xuXHR1cGRhdGVDb21wb25lbnRzU2l6ZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50c1NpemUoKVxue1x0XG5cdC8vJChcIiNiYW5kZWF1X29wdGlvblwiKS5jc3MoJ2hlaWdodCcsJCggd2luZG93ICkuaGVpZ2h0KCktJCgnaGVhZGVyJykuaGVpZ2h0KCkpO1xuXHQvL2NvbnNvbGUubG9nKFwiVXBkYXRlIGNvbXBvbmVudCBzaXplXCIpO1xuXHQkKCcjcGFnZS1jb250ZW50JykuY3NzKCdoZWlnaHQnLCdhdXRvJyk7XG5cblx0bGV0IGNvbnRlbnRfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gJCgnaGVhZGVyJykuaGVpZ2h0KCk7XG5cdGNvbnRlbnRfaGVpZ2h0IC09ICQoJy5mbGFzaC1tZXNzYWdlcy1jb250YWluZXInKS5vdXRlckhlaWdodCh0cnVlKTtcblx0JChcIiNkaXJlY3RvcnktY29udGFpbmVyXCIpLmNzcygnaGVpZ2h0Jyxjb250ZW50X2hlaWdodCk7XG5cdCQoXCIjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdFwiKS5jc3MoJ2hlaWdodCcsY29udGVudF9oZWlnaHQpO1xuXG5cdGlmIChBcHApIHNldFRpbWVvdXQoQXBwLnVwZGF0ZU1heEVsZW1lbnRzLCA1MDApO1xuXG5cdHVwZGF0ZUluZm9CYXJTaXplKCk7XHRcblx0dXBkYXRlTWFwU2l6ZSgpO1xufVxuXG5cbmxldCBtYXRjaE1lZGlhQmlnU2l6ZV9vbGQ7XG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTWFwU2l6ZShlbGVtZW50SW5mb0Jhcl9oZWlnaHQgPSAkKCcjZWxlbWVudC1pbmZvLWJhcicpLm91dGVySGVpZ2h0KHRydWUpKVxue1x0XHRcblx0Ly9jb25zb2xlLmxvZyhcInVwZGF0ZU1hcFNpemVcIiwgZWxlbWVudEluZm9CYXJfaGVpZ2h0KTtcblx0aWYoXCJtYXRjaE1lZGlhXCIgaW4gd2luZG93KSBcblx0e1x0XG5cdFx0aWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNjAwcHgpXCIpLm1hdGNoZXMpIFxuXHQgIFx0e1xuXHQgIFx0XHQkKFwiI2RpcmVjdG9yeS1tZW51XCIpLmNzcygnaGVpZ2h0JywkKFwiI2RpcmVjdG9yeS1jb250ZW50XCIpLmhlaWdodCgpLWVsZW1lbnRJbmZvQmFyX2hlaWdodCk7XHRcblx0ICBcdH1cblx0ICBcdGVsc2Vcblx0ICBcdHtcblx0ICBcdFx0JChcIiNkaXJlY3RvcnktbWVudVwiKS5jc3MoJ2hlaWdodCcsJzEwMCUnKTtcblx0ICBcdH1cblxuXHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDEyMDBweClcIikubWF0Y2hlcykgXG5cdFx0e1xuXHRcdCAgXHRpZiAobWF0Y2hNZWRpYUJpZ1NpemVfb2xkKSBlbGVtZW50SW5mb0Jhcl9oZWlnaHQgPSAwO1xuXG5cdFx0ICBcdC8vY29uc29sZS5sb2coXCJyZXNpemUgbWFwIGhlaWdodCB0b1wiLCAkKFwiI2RpcmVjdG9yeS1jb250ZW50XCIpLm91dGVySGVpZ2h0KCktZWxlbWVudEluZm9CYXJfaGVpZ2h0KTtcblx0XHQgIFx0JChcIiNkaXJlY3RvcnktY29udGVudC1tYXBcIikuY3NzKCdoZWlnaHQnLCQoXCIjZGlyZWN0b3J5LWNvbnRlbnRcIikub3V0ZXJIZWlnaHQoKS1lbGVtZW50SW5mb0Jhcl9oZWlnaHQpO1x0XG5cdFx0ICBcdFxuXG5cdFx0ICBcdG1hdGNoTWVkaWFCaWdTaXplX29sZCA9IGZhbHNlO1xuXHQgIFx0fSBcblx0XHRlbHNlIFxuXHRcdHtcdFx0XHRcblx0XHQgIFx0JChcIiNkaXJlY3RvcnktY29udGVudC1tYXBcIikuY3NzKCdoZWlnaHQnLCQoXCIjZGlyZWN0b3J5LWNvbnRlbnRcIikuaGVpZ2h0KCkpO1x0XG5cdFx0ICBcdGlmICgkKCcjZWxlbWVudC1pbmZvLWJhcicpLmlzKFwiOnZpc2libGVcIikpIFxuXHQgIFx0XHR7XG5cdCAgXHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLmNzcygnbWFyZ2luLXJpZ2h0JywnNDgwcHgnKTtcblx0ICBcdFx0XHQkKCcjYmFuZGVhdV9oZWxwZXInKS5jc3MoJ21hcmdpbi1yaWdodCcsJzQ4MHB4Jyk7XG5cdCAgXHRcdFx0XG5cdCAgXHRcdH1cblx0XHQgIFx0ZWxzZSBcblx0ICBcdFx0e1xuXHQgIFx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1tYXAnKS5jc3MoJ21hcmdpbi1yaWdodCcsJzBweCcpO1xuXHQgIFx0XHRcdCQoJyNiYW5kZWF1X2hlbHBlcicpLmNzcygnbWFyZ2luLXJpZ2h0JywnMHB4Jyk7XG5cdCAgXHRcdH1cblx0XHQgIFx0bWF0Y2hNZWRpYUJpZ1NpemVfb2xkID0gdHJ1ZTsgXHRcblx0XHR9XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0Y29uc29sZS5lcnJvcihcIk1hdGNoIE1lZGlhIG5vdCBhdmFpbGFibGVcIik7XG5cdH1cblxuXHQvLyBhcHLDqHMgNTAwbXMgbCdhbmltYXRpb24gZGUgcmVkaW1lbnNpb25uZW1lbnQgZXN0IHRlcm1pbsOpXG5cdC8vIG9uIHRyaWdnZXIgY2V0IMOpdmVuZW1lbnQgcG91ciBxdWUgbGEgY2FydGUgc2UgcmVkaW1lbnNpb25uZSB2cmFpbWVudFxuXHRpZiAoQXBwLm1hcENvbXBvbmVudCkgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQXBwLm1hcENvbXBvbmVudC5yZXNpemUoKTsgfSw1MDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlSW5mb0JhclNpemUoKVxue1xuXHRpZiAoJCgnI2VsZW1lbnQtaW5mby1iYXInKS53aWR0aCgpIDwgNjAwKVxuXHR7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5yZW1vdmVDbGFzcyhcImxhcmdlV2lkdGhcIik7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5hZGRDbGFzcyhcInNtYWxsV2lkdGhcIik7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5hZGRDbGFzcyhcImxhcmdlV2lkdGhcIik7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5yZW1vdmVDbGFzcyhcInNtYWxsV2lkdGhcIik7XG5cdH1cblxuXHRpZihcIm1hdGNoTWVkaWFcIiBpbiB3aW5kb3cpIFxuXHR7XHRcblx0XHRpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiAxMjAwcHgpXCIpLm1hdGNoZXMpIFxuXHRcdHtcblx0XHQgIFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVEZXRhaWxzJykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAuY29sbGFwc2libGUtYm9keScpLmNzcygnbWFyZ2luLXRvcCcsJzBweCcpO1xuXHQgIFx0fSBcblx0XHRlbHNlIFxuXHRcdHtcdFx0XHRcblx0XHQgIFx0bGV0IGVsZW1lbnRJbmZvQmFyID0gJChcIiNlbGVtZW50LWluZm8tYmFyXCIpO1xuXHRcdCAgXHRsZXQgaGVpZ2h0ID0gZWxlbWVudEluZm9CYXIub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRoZWlnaHQgLT0gZWxlbWVudEluZm9CYXIuZmluZCgnLmNvbGxhcHNpYmxlLWhlYWRlcicpLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0aGVpZ2h0IC09IGVsZW1lbnRJbmZvQmFyLmZpbmQoJy5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2UtaGVscGVyOnZpc2libGUnKS5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdGhlaWdodCAtPSBlbGVtZW50SW5mb0Jhci5maW5kKFwiLm1lbnUtZWxlbWVudFwiKS5vdXRlckhlaWdodCh0cnVlKTtcblxuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAuY29sbGFwc2libGUtYm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHQgIFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLmNvbGxhcHNpYmxlLWJvZHknKS5jc3MoJ21hcmdpbi10b3AnLCBlbGVtZW50SW5mb0Jhci5maW5kKCcuY29sbGFwc2libGUtaGVhZGVyJykub3V0ZXJIZWlnaHQodHJ1ZSkrZWxlbWVudEluZm9CYXIuZmluZCgnLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZS1oZWxwZXI6dmlzaWJsZScpLm91dGVySGVpZ2h0KHRydWUpKTtcblx0XHR9XG5cdH1cbn1cblxuXG5cblxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJsZWFmbGV0XCIgLz5cblxuZGVjbGFyZSBsZXQgd2luZG93LCBSb3V0aW5nIDogYW55O1xuZGVjbGFyZSBsZXQgQ09ORklHLCBNQUlOX0NBVEVHT1JZLCBPUEVOSE9VUlNfQ0FURUdPUlk7XG5kZWNsYXJlIHZhciAkO1xuXG5pbXBvcnQgeyBHZW9jb2Rlck1vZHVsZSwgR2VvY29kZVJlc3VsdCB9IGZyb20gXCIuL21vZHVsZXMvZ2VvY29kZXIubW9kdWxlXCI7XG5pbXBvcnQgeyBGaWx0ZXJNb2R1bGUgfSBmcm9tIFwiLi9tb2R1bGVzL2ZpbHRlci5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnRzTW9kdWxlLCBFbGVtZW50c0NoYW5nZWQgfSBmcm9tIFwiLi9tb2R1bGVzL2VsZW1lbnRzLm1vZHVsZVwiO1xuaW1wb3J0IHsgRGlzcGxheUVsZW1lbnRBbG9uZU1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS1lbGVtZW50LWFsb25lLm1vZHVsZVwiO1xuaW1wb3J0IHsgQWpheE1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvYWpheC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3JpZXNNb2R1bGUgfSBmcm9tICcuL21vZHVsZXMvY2F0ZWdvcmllcy5tb2R1bGUnO1xuaW1wb3J0IHsgRGlyZWN0aW9uc01vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZGlyZWN0aW9ucy5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnRMaXN0Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9lbGVtZW50LWxpc3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbmZvQmFyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmZvLWJhci5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNlYXJjaEJhckNvbXBvbmVudCB9IGZyb20gXCIuLi9jb21tb25zL3NlYXJjaC1iYXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXJlY3RvcnlNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9kaXJlY3RvcnktbWVudS5jb21wb25lbnRcIjtcbmltcG9ydCB7IE1hcENvbXBvbmVudCwgVmlld1BvcnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL21hcC9tYXAuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBCaW9wZW5NYXJrZXIgfSBmcm9tIFwiLi9jb21wb25lbnRzL21hcC9iaW9wZW4tbWFya2VyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSGlzdG9yeU1vZHVsZSwgSGlzdG9yeVN0YXRlIH0gZnJvbSAnLi9tb2R1bGVzL2hpc3RvcnkubW9kdWxlJztcbmltcG9ydCB7IEJvdW5kc01vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy9ib3VuZHMubW9kdWxlJztcblxuXG5pbXBvcnQgeyBpbml0aWFsaXplQXBwSW50ZXJhY3Rpb25zIH0gZnJvbSBcIi4vYXBwLWludGVyYWN0aW9uc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUVsZW1lbnRNZW51IH0gZnJvbSBcIi4vY29tcG9uZW50cy9lbGVtZW50LW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBpbml0aWFsaXplVm90aW5nIH0gZnJvbSBcIi4vY29tcG9uZW50cy92b3RlLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBnZXRRdWVyeVBhcmFtcywgY2FwaXRhbGl6ZSB9IGZyb20gXCIuLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmRlY2xhcmUgdmFyIEFwcCA6IEFwcE1vZHVsZTtcblxuLyoqXG4qIEFwcCBpbml0aWFsaXNhdGlvbiB3aGVuIGRvY3VtZW50IHJlYWR5XG4qL1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKVxue1x0XG4gICBBcHAgPSBuZXcgQXBwTW9kdWxlKCk7ICAgICAgXG5cbiAgIEFwcC5jYXRlZ29yeU1vZHVsZS5jcmVhdGVDYXRlZ29yaWVzRnJvbUpzb24oTUFJTl9DQVRFR09SWSwgT1BFTkhPVVJTX0NBVEVHT1JZKTtcblxuICAgQXBwLmVsZW1lbnRNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuICBcbiAgIEFwcC5ib3VuZHNNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuXG4gICBBcHAubG9hZEhpc3RvcnlTdGF0ZSgpO1xuXG4gICBpbml0aWFsaXplQXBwSW50ZXJhY3Rpb25zKCk7XG4gICBpbml0aWFsaXplRWxlbWVudE1lbnUoKTtcbiAgIGluaXRpYWxpemVWb3RpbmcoKTtcbn0pO1xuXG4vKlxuKiBBcHAgc3RhdGVzIG5hbWVzXG4qL1xuZXhwb3J0IGVudW0gQXBwU3RhdGVzIFxue1xuXHROb3JtYWwsXG5cdFNob3dFbGVtZW50LFxuXHRTaG93RWxlbWVudEFsb25lLFxuXHRTaG93RGlyZWN0aW9ucyxcblx0Q29uc3RlbGxhdGlvbixcblx0U3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlICAgIFxufVxuXG5leHBvcnQgZW51bSBBcHBNb2Rlc1xue1xuXHRNYXAsXG5cdExpc3Rcbn1cblxuLypcbiogQXBwIE1vZHVsZS4gTWFpbiBtb2R1bGUgb2YgdGhlIEFwcFxuKlxuKiBBcHBNb2R1bGUgY3JlYXRlcyBhbGwgb3RoZXJzIG1vZHVsZXMsIGFuZCBkZWFscyB3aXRoIHRoZWlycyBldmVudHNcbiovXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlXG57XHRcdFxuXHRnZW9jb2Rlck1vZHVsZV8gPSBuZXcgR2VvY29kZXJNb2R1bGUoKTtcblx0ZmlsdGVyTW9kdWxlXyA9IG5ldyBGaWx0ZXJNb2R1bGUoKTtcblx0ZWxlbWVudHNNb2R1bGVfID0gbmV3IEVsZW1lbnRzTW9kdWxlKCk7XG5cdGRpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGVfID0gbmV3IERpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGUoKTtcblx0ZGlyZWN0aW9uc01vZHVsZV8gOiBEaXJlY3Rpb25zTW9kdWxlID0gbmV3IERpcmVjdGlvbnNNb2R1bGUoKTtcblx0YWpheE1vZHVsZV8gPSBuZXcgQWpheE1vZHVsZSgpO1xuXHRpbmZvQmFyQ29tcG9uZW50XyA9IG5ldyBJbmZvQmFyQ29tcG9uZW50KCk7XG5cdG1hcENvbXBvbmVudF8gID0gbmV3IE1hcENvbXBvbmVudCgpO1xuXHRzZWFyY2hCYXJDb21wb25lbnQgPSBuZXcgU2VhcmNoQmFyQ29tcG9uZW50KCdzZWFyY2gtYmFyJyk7XG5cdGVsZW1lbnRMaXN0Q29tcG9uZW50ID0gbmV3IEVsZW1lbnRMaXN0Q29tcG9uZW50KCk7XG5cdGhpc3RvcnlNb2R1bGUgPSBuZXcgSGlzdG9yeU1vZHVsZSgpO1xuXHRjYXRlZ29yeU1vZHVsZSA9IG5ldyBDYXRlZ29yaWVzTW9kdWxlKCk7XG5cdGRpcmVjdG9yeU1lbnVDb21wb25lbnQgPSBuZXcgRGlyZWN0b3J5TWVudUNvbXBvbmVudCgpO1xuXHRib3VuZHNNb2R1bGUgPSBuZXcgQm91bmRzTW9kdWxlKCk7XG5cblx0Ly9zdGFyUmVwcmVzZW50YXRpb25DaG9pY2VNb2R1bGVfID0gY29uc3RlbGxhdGlvbk1vZGUgPyBuZXcgU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlTW9kdWxlKCkgOiBudWxsO1xuXHRcblx0Ly8gY3VyciBzdGF0ZSBvZiB0aGUgYXBwXG5cdHByaXZhdGUgc3RhdGVfIDogQXBwU3RhdGVzID0gbnVsbDtcdFxuXHRwcml2YXRlIG1vZGVfIDogQXBwTW9kZXMgPSBudWxsO1xuXG5cdC8vIHNvbWVzIHN0YXRlcyBuZWVkIGEgZWxlbWVudCBpZCwgd2Ugc3RvcmUgaXQgaW4gdGhpcyBwcm9wZXJ0eVxuXHRwcml2YXRlIHN0YXRlRWxlbWVudElkIDogbnVtYmVyID0gbnVsbDtcblxuXG5cdC8vIHdoZW4gY2xpY2sgb24gbWFya2VyIGl0IGFsc28gdHJpZ2VyIGNsaWNrIG9uIG1hcFxuXHQvLyB3aGVuIGNsaWNrIG9uIG1hcmtlciB3ZSBwdXQgaXNDbGlja2luZyB0byB0cnVlIGR1cmluZ1xuXHQvLyBmZXcgbWlsbGlzZWNvbmRzIHNvIHRoZSBtYXAgZG9uJ3QgZG8gYW55dGhpbmcgaXMgY2xpY2sgZXZlbnRcblx0aXNDbGlja2luZ18gPSBmYWxzZTtcblxuXHQvLyBwcmV2ZW50IHVwZGF0ZWRpcmVjdG9yeS1jb250ZW50LWxpc3Qgd2hpbGUgdGhlIGFjdGlvbiBpcyBqdXN0XG5cdC8vIHNob3dpbmcgZWxlbWVudCBkZXRhaWxzXG5cdGlzU2hvd2luZ0luZm9CYXJDb21wb25lbnRfID0gZmFsc2U7XG5cblx0Ly8gUHV0IGEgbGltaXQgb2YgbWFya2VycyBzaG93ZWQgb24gbWFwIChtYXJrZXJzIG5vdCBjbHVzdGVyZWQpXG5cdC8vIEJlY2F1c2UgaWYgdG9vIG1hbnkgbWFya2VycyBhcmUgc2hvd24sIGJyb3dzZXIgc2xvdyBkb3duXG5cdG1heEVsZW1lbnRzVG9TaG93T25NYXBfID0gMTAwMDtcdFxuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuaW5mb0JhckNvbXBvbmVudF8ub25TaG93LmRvKCAoZWxlbWVudElkKSA9PiB7IHRoaXMuaGFuZGxlSW5mb0JhclNob3coZWxlbWVudElkKTsgfSk7XG4gIFx0dGhpcy5pbmZvQmFyQ29tcG9uZW50Xy5vbkhpZGUuZG8oICgpPT4geyB0aGlzLmhhbmRsZUluZm9CYXJIaWRlKCk7IH0pO1xuXHRcblx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25NYXBSZWFkeS5kbyggKCkgPT4geyB0aGlzLmluaXRpYWxpemVNYXBGZWF0dXJlcygpOyB9KTtcblxuXHRcdC8vdGhpcy5nZW9jb2Rlck1vZHVsZV8ub25SZXN1bHQuZG8oIChhcnJheSkgPT4geyB0aGlzLmhhbmRsZUdlb2NvZGluZyhhcnJheSk7IH0pO1xuXHRcdHRoaXMuYWpheE1vZHVsZV8ub25OZXdFbGVtZW50cy5kbyggKGVsZW1lbnRzKSA9PiB7IHRoaXMuaGFuZGxlTmV3RWxlbWVudHNSZWNlaXZlZEZyb21TZXJ2ZXIoZWxlbWVudHMpOyB9KTtcblx0XG5cdFx0dGhpcy5lbGVtZW50c01vZHVsZV8ub25FbGVtZW50c0NoYW5nZWQuZG8oIChlbGVtZW50c0NoYW5nZWQpPT4geyB0aGlzLmhhbmRsZUVsZW1lbnRzQ2hhbmdlZChlbGVtZW50c0NoYW5nZWQpOyB9KTtcblx0XG5cdFx0dGhpcy5zZWFyY2hCYXJDb21wb25lbnQub25TZWFyY2guZG8oIChhZGRyZXNzIDogc3RyaW5nKSA9PiB7IHRoaXMuaGFuZGxlU2VhcmNoQWN0aW9uKGFkZHJlc3MpOyB9KTtcblxuXHRcdHRoaXMubWFwQ29tcG9uZW50Xy5vbklkbGUuZG8oICgpID0+IHsgdGhpcy5oYW5kbGVNYXBJZGxlKCk7ICB9KTtcblx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25DbGljay5kbyggKCkgPT4geyB0aGlzLmhhbmRsZU1hcENsaWNrKCk7IH0pO1x0XHRcblx0fVxuXG5cdGluaXRpYWxpemVNYXBGZWF0dXJlcygpXG5cdHtcdFxuXHRcdFxuXHR9O1xuXG5cdC8qXG5cdCogTG9hZCBpbml0aWFsIHN0YXRlIHdpdGggQ09ORklHIHByb3ZpZGVkIGJ5IHN5bWZvbnkgY29udHJvbGxlciBvclxuXHQgIHdpdGggc3RhdGUgcG9wZWQgYnkgd2luZG93IGhpc3RvcnkgbWFuYWdlclxuXHQqL1xuXHRsb2FkSGlzdG9yeVN0YXRlKGhpc3RvcnlzdGF0ZSA6IEhpc3RvcnlTdGF0ZSA9IENPTkZJRywgJGJhY2tGcm9tSGlzdG9yeSA9IGZhbHNlKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImxvYWRIaXN0b3J5c3RhdGUgZmlsdGVyc2RcIiwgaGlzdG9yeXN0YXRlLmZpbHRlcnMpXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5maWx0ZXJzKVxuXHRcdHtcblx0XHRcdHRoaXMuZmlsdGVyTW9kdWxlLmxvYWRGaWx0ZXJzRnJvbVN0cmluZyhoaXN0b3J5c3RhdGUuZmlsdGVycyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLmRpcmVjdG9yeU1lbnVDb21wb25lbnQuc2V0TWFpbk9wdGlvbignYWxsJyk7XG5cdFx0fVxuXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZSA9PT0gbnVsbCkgcmV0dXJuO1xuXG5cdFx0Ly8gaWYgbm8gYmFja2Zyb21oaXN0b3J5IHRoYXQgbWVhbnMgaGlzdG9yeXN0YXRlIGlzIGFjdHVhbGx5IHRoZSBDT05GSUdcblx0XHQvLyBnaXZlbiBieSBzeW1mb255LCBzbyB3ZSBuZWVkIHRvIGNvbnZlcnQgdGhpcyBvYmVjdCBpbiByZWFsIEhpc3RvcnlzdGF0ZSBjbGFzc1xuXHRcdGlmICghJGJhY2tGcm9tSGlzdG9yeSlcblx0XHRcdGhpc3RvcnlzdGF0ZSA9IG5ldyBIaXN0b3J5U3RhdGUoKS5wYXJzZShoaXN0b3J5c3RhdGUpO1x0XHRcblxuXHRcdGlmIChoaXN0b3J5c3RhdGUudmlld3BvcnQpXG5cdFx0e1x0XHRcdFxuXHRcdFx0Ly8gaWYgbWFwIG5vdCBsb2FkZWQgd2UganVzdCBzZXQgdGhlIG1hcENvbXBvbmVudCB2aWV3cG9ydCB3aXRob3V0IGNoYW5naW5nIHRoZVxuXHRcdFx0Ly8gYWN0dWFsIHZpZXdwb3J0IG9mIHRoZSBtYXAsIGJlY2F1c2UgaXQgd2lsbCBiZSBkb25lIGluXG5cdFx0XHQvLyBtYXAgaW5pdGlhbGlzYXRpb25cblx0XHRcdHRoaXMubWFwQ29tcG9uZW50LnNldFZpZXdQb3J0KGhpc3RvcnlzdGF0ZS52aWV3cG9ydCwgdGhpcy5tYXBDb21wb25lbnQuaXNNYXBMb2FkZWQpO1xuXG5cdFx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XG5cblx0XHRcdGlmIChoaXN0b3J5c3RhdGUubW9kZSA9PSBBcHBNb2Rlcy5MaXN0IClcblx0XHRcdHtcblx0XHRcdFx0bGV0IGxvY2F0aW9uID0gTC5sYXRMbmcoaGlzdG9yeXN0YXRlLnZpZXdwb3J0LmxhdCwgaGlzdG9yeXN0YXRlLnZpZXdwb3J0LmxuZyk7XG5cdFx0XHR9XHRcblx0XHR9XHRcblxuXHRcdHRoaXMuc2V0TW9kZShoaXN0b3J5c3RhdGUubW9kZSwgJGJhY2tGcm9tSGlzdG9yeSwgZmFsc2UpO1xuXG5cdFx0Ly8gaWYgYWRkcmVzcyBpcyBwcm92aWRlZCB3ZSBnZW9sb2NhbGl6ZVxuXHRcdC8vIGlmIG5vIHZpZXdwb3J0IGFuZCBzdGF0ZSBub3JtYWwgd2UgZ2VvY29kZSBvbiBkZWZhdWx0IGxvY2F0aW9uXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5hZGRyZXNzIHx8ICghaGlzdG9yeXN0YXRlLnZpZXdwb3J0ICYmIGhpc3RvcnlzdGF0ZS5zdGF0ZSA9PT0gQXBwU3RhdGVzLk5vcm1hbCkpIFxuXHRcdHtcblx0XHRcdHRoaXMuZ2VvY29kZXJNb2R1bGVfLmdlb2NvZGVBZGRyZXNzKFxuXHRcdFx0XHRoaXN0b3J5c3RhdGUuYWRkcmVzcywgXG5cdFx0XHRcdChyZXN1bHRzKSA9PiBcblx0XHRcdFx0eyBcblx0XHRcdFx0XHQvLyBpZiB2aWV3cG9ydCBpcyBnaXZlbiwgbm90aGluZyB0byBkbywgd2UgYWxyZWFkeSBkaWQgaW5pdGlhbGl6YXRpb25cblx0XHRcdFx0XHQvLyB3aXRoIHZpZXdwb3J0XG5cdFx0XHRcdFx0aWYgKGhpc3RvcnlzdGF0ZS52aWV3cG9ydCAmJiBoaXN0b3J5c3RhdGUubW9kZSA9PSBBcHBNb2Rlcy5NYXApIHJldHVybjtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZUdlb2NvZGVSZXN1bHQocmVzdWx0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHQvLyBmYWlsdXJlIGNhbGxiYWNrXG5cdFx0XHRcdFx0dGhpcy5zZWFyY2hCYXJDb21wb25lbnQuc2V0VmFsdWUoXCJFcnJldXIgZGUgbG9jYWxpc2F0aW9uIDogXCIgKyBoaXN0b3J5c3RhdGUuYWRkcmVzcyk7XG5cdFx0XHRcdFx0aWYgKCFoaXN0b3J5c3RhdGUudmlld3BvcnQpIFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIGdlb2NvZGUgZGVmYXVsdCBsb2NhdGlvblxuXHRcdFx0XHRcdFx0dGhpcy5nZW9jb2Rlck1vZHVsZV8uZ2VvY29kZUFkZHJlc3MoJycsIChyKSA9PiB7IHRoaXMuaGFuZGxlR2VvY29kZVJlc3VsdChyKTsgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XHRcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5pZCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShcblx0XHRcdFx0aGlzdG9yeXN0YXRlLnN0YXRlLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQ6IGhpc3RvcnlzdGF0ZS5pZCwgXG5cdFx0XHRcdFx0cGFuVG9Mb2NhdGlvbjogKGhpc3RvcnlzdGF0ZS52aWV3cG9ydCA9PT0gbnVsbClcblx0XHRcdFx0fSxcblx0XHRcdFx0JGJhY2tGcm9tSGlzdG9yeSk7XG5cdFx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShoaXN0b3J5c3RhdGUuc3RhdGUsIG51bGwsICRiYWNrRnJvbUhpc3RvcnkpO1x0XHRcblx0XHR9XHRcdFxuXHR9O1x0XG5cblx0c2V0TW9kZSgkbW9kZSA6IEFwcE1vZGVzLCAkYmFja0Zyb21IaXN0b3J5IDogYm9vbGVhbiA9IGZhbHNlLCAkdXBkYXRlVGl0bGVBbmRTdGF0ZSA9IHRydWUpXG5cdHtcblx0XHRpZiAoJG1vZGUgIT0gdGhpcy5tb2RlXylcblx0XHR7XHRcdFx0XG5cdFx0XHRpZiAoJG1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuc2hvdygpO1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCcpLmhpZGUoKTtcdFx0XHRcdFxuXG5cdFx0XHRcdHRoaXMubWFwQ29tcG9uZW50LmluaXQoKTtcblxuXHRcdFx0XHRpZiAodGhpcy5tYXBDb21wb25lbnRfLmlzTWFwTG9hZGVkKSB0aGlzLmJvdW5kc01vZHVsZS5leHRlbmRCb3VuZHMoMCwgdGhpcy5tYXBDb21wb25lbnQuZ2V0Qm91bmRzKCkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuaGlkZSgpO1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCcpLnNob3coKTtcblxuXHRcdFx0XHRpZiAoQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpIFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMuYm91bmRzTW9kdWxlLmNyZWF0ZUJvdW5kc0Zyb21Mb2NhdGlvbihBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKSk7XG5cdFx0XHRcdFx0XHR0aGlzLmNoZWNrRm9yTmV3RWxlbWVudHNUb1JldHJpZXZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiBwcmV2aW91cyBtb2RlIHdhc24ndCBudWxsIFxuXHRcdFx0bGV0IG9sZE1vZGUgPSB0aGlzLm1vZGVfO1xuXHRcdFx0dGhpcy5tb2RlXyA9ICRtb2RlO1xuXG5cdFx0XHQvLyB1cGRhdGUgaGlzdG9yeSBpZiB3ZSBuZWVkIHRvXG5cdFx0XHRpZiAob2xkTW9kZSAhPSBudWxsICYmICEkYmFja0Zyb21IaXN0b3J5KSB0aGlzLmhpc3RvcnlNb2R1bGUucHVzaE5ld1N0YXRlKCk7XG5cblxuXHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmNsZWFyQ3VycmVudHNFbGVtZW50KCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSwgdHJ1ZSk7XG5cblx0XHRcdGlmICgkdXBkYXRlVGl0bGVBbmRTdGF0ZSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy51cGRhdGVEb2N1bWVudFRpdGxlKCk7XHRcdFx0XG5cblx0XHRcdFx0Ly8gYWZ0ZXIgY2xlYXJpbmcsIHdlIHNldCB0aGUgY3VycmVudCBzdGF0ZSBhZ2FpblxuXHRcdFx0XHRpZiAoJG1vZGUgPT0gQXBwTW9kZXMuTWFwKSB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUsIHtpZCA6IHRoaXMuc3RhdGVFbGVtZW50SWR9KTtcdFxuXHRcdFx0fVx0XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHQvKlxuXHQqIENoYW5nZSBBcHAgc3RhdGVcblx0Ki9cblx0c2V0U3RhdGUoJG5ld1N0YXRlIDogQXBwU3RhdGVzLCBvcHRpb25zIDogYW55ID0ge30sICRiYWNrRnJvbUhpc3RvcnkgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7IFx0XG5cdFx0Ly9jb25zb2xlLmxvZyhcIkFwcE1vZHVsZSBzZXQgU3RhdGUgOiBcIiArIEFwcFN0YXRlc1skbmV3U3RhdGVdICArICAnLCBvcHRpb25zID0gJyxvcHRpb25zKTtcblx0XHRcblx0XHRsZXQgZWxlbWVudDtcblxuXHRcdGxldCBvbGRTdGF0ZU5hbWUgPSB0aGlzLnN0YXRlXztcblx0XHR0aGlzLnN0YXRlXyA9ICRuZXdTdGF0ZTtcdFx0XHRcblxuXHRcdGlmIChvbGRTdGF0ZU5hbWUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zICYmIHRoaXMuZGlyZWN0aW9uc01vZHVsZV8pIFxuXHRcdFx0dGhpcy5kaXJlY3Rpb25zTW9kdWxlXy5jbGVhcigpO1xuXG5cdFx0aWYgKG9sZFN0YXRlTmFtZSA9PSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSlcdFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudE1vZHVsZS5jbGVhckN1cnJlbnRzRWxlbWVudCgpO1xuXHRcdFx0dGhpcy5kaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXy5lbmQoKTtcdFxuXHRcdH1cdFxuXG5cdFx0dGhpcy5zdGF0ZUVsZW1lbnRJZCA9IG9wdGlvbnMgPyBvcHRpb25zLmlkIDogbnVsbDtcblx0XHRcblx0XHRzd2l0Y2ggKCRuZXdTdGF0ZSlcblx0XHR7XG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5Ob3JtYWw6XHRcdFx0XG5cdFx0XHRcdC8vIGlmICh0aGlzLnN0YXRlXyA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbikgXG5cdFx0XHRcdC8vIHtcblx0XHRcdFx0Ly8gXHRjbGVhckRpcmVjdG9yeU1lbnUoKTtcblx0XHRcdFx0Ly8gXHR0aGlzLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZU1vZHVsZV8uZW5kKCk7XG5cdFx0XHRcdC8vIH1cdFxuXHRcdFx0XHRpZiAoJGJhY2tGcm9tSGlzdG9yeSkgdGhpcy5pbmZvQmFyQ29tcG9uZW50LmhpZGUoKTtcdFx0XHRcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudDpcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSByZXR1cm47XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmVsZW1lbnRCeUlkKG9wdGlvbnMuaWQpLm1hcmtlci5zaG93Tm9ybWFsSGlkZGVuKCk7XG5cdFx0XHRcdHRoaXMuZWxlbWVudEJ5SWQob3B0aW9ucy5pZCkubWFya2VyLnNob3dCaWdTaXplKCk7XG5cdFx0XHRcdHRoaXMuaW5mb0JhckNvbXBvbmVudC5zaG93RWxlbWVudChvcHRpb25zLmlkKTtcblxuXHRcdFx0XHRicmVhaztcdFxuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudEFsb25lOlxuXHRcdFx0XHRpZiAoIW9wdGlvbnMuaWQpIHJldHVybjtcblxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5lbGVtZW50QnlJZChvcHRpb25zLmlkKTtcblx0XHRcdFx0aWYgKGVsZW1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLkRFQU1vZHVsZS5iZWdpbihlbGVtZW50LmlkLCBvcHRpb25zLnBhblRvTG9jYXRpb24pO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFqYXhNb2R1bGVfLmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQsXG5cdFx0XHRcdFx0XHQoZWxlbWVudEpzb24pID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhbZWxlbWVudEpzb25dLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5ERUFNb2R1bGUuYmVnaW4oZWxlbWVudEpzb24uaWQsIG9wdGlvbnMucGFuVG9Mb2NhdGlvbik7XG5cdFx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZShvcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0Ly8gd2UgZ2V0IGVsZW1lbnQgYXJvdW5kIHNvIGlmIHRoZSB1c2VyIGVuZCB0aGUgRFBBTWRvdWxlXG5cdFx0XHRcdFx0XHRcdC8vIHRoZSBlbGVtZW50cyB3aWxsIGFscmVhZHkgYmUgYXZhaWxhYmxlIHRvIGRpc3BsYXlcblx0XHRcdFx0XHRcdFx0Ly90aGlzLmFqYXhNb2R1bGUuZ2V0RWxlbWVudHNJbkJvdW5kcyhbdGhpcy5tYXBDb21wb25lbnQuZ2V0Qm91bmRzKCldKTtcdCBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQoZXJyb3IpID0+IHsgLypUT0RPKi8gYWxlcnQoXCJObyBlbGVtZW50IHdpdGggdGhpcyBpZFwiKTsgfVxuXHRcdFx0XHRcdCk7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSByZXR1cm47XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5lbGVtZW50QnlJZChvcHRpb25zLmlkKTtcblx0XHRcdFx0bGV0IG9yaWdpbjtcblxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZV8gPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcmlnaW4gPSB0aGlzLmNvbnN0ZWxsYXRpb24uZ2V0T3JpZ2luKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3JpZ2luID0gdGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbG9jYWwgZnVuY3Rpb25cblx0XHRcdFx0bGV0IGNhbGN1bGF0ZVJvdXRlID0gZnVuY3Rpb24gKG9yaWdpbiA6IEwuTGF0TG5nLCBlbGVtZW50IDogRWxlbWVudClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdEFwcC5kaXJlY3Rpb25zTW9kdWxlLmNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7IFxuXHRcdFx0XHRcdEFwcC5ERUFNb2R1bGUuYmVnaW4oZWxlbWVudC5pZCwgZmFsc2UpO1x0XHRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBpZiBubyBlbGVtZW50LCB3ZSBnZXQgaXQgZnJvbSBhamF4IFxuXHRcdFx0XHRpZiAoIWVsZW1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFqYXhNb2R1bGVfLmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQsIChlbGVtZW50SnNvbikgPT4gXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhbZWxlbWVudEpzb25dLCB0cnVlKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRCeUlkKGVsZW1lbnRKc29uLmlkKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcbiAgICAgICAgICAgIFxuXHRcdFx0XHRcdFx0b3JpZ2luID0gdGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpO1xuXHRcdFx0XHRcdFx0Ly8gd2UgZ2VvbG9jYWxpemVkIG9yaWdpbiBpbiBsb2FkSGlzdG9yeSBmdW5jdGlvblxuXHRcdFx0XHRcdFx0Ly8gbWF5YmUgdGhlIGdlb2NvZGluZyBpcyBub3QgYWxyZWFkeSBkb25lIHNvIHdlIHdhaXQgYSBsaXR0bGUgYml0IGZvciBpdFxuXHRcdFx0XHRcdFx0aWYgKCFvcmlnaW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdG9yaWdpbiA9IHRoaXMuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIW9yaWdpbilcblx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW4gPSB0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsY3VsYXRlUm91dGUob3JpZ2luLCBlbGVtZW50KTtcdFx0XG5cdFx0XHRcdFx0XHRcdH0sIDUwMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0KGVycm9yKSA9PiB7IC8qVE9ETyovIGFsZXJ0KFwiTm8gZWxlbWVudCB3aXRoIHRoaXMgaWRcIik7IH1cblx0XHRcdFx0XHQpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBSZWFkeS5kbygoKSA9PiBcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2FsY3VsYXRlUm91dGUob3JpZ2luLCBlbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBSZWFkeS5vZmYoKCkgPT4geyBjYWxjdWxhdGVSb3V0ZShvcmlnaW4sIGVsZW1lbnQpOyB9KTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR0aGlzLnNldE1vZGUoQXBwTW9kZXMuTWFwLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH1cdFx0XHRcdFx0XG5cblx0XHRcdFx0YnJlYWs7XHRcdFx0XG5cdFx0fVxuXG5cdFx0aWYgKCEkYmFja0Zyb21IaXN0b3J5ICYmXG5cdFx0XHQgKCBvbGRTdGF0ZU5hbWUgIT09ICRuZXdTdGF0ZSBcblx0XHRcdFx0fHwgJG5ld1N0YXRlID09IEFwcFN0YXRlcy5TaG93RWxlbWVudFxuXHRcdFx0XHR8fCAkbmV3U3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmVcblx0XHRcdFx0fHwgJG5ld1N0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucykgKVxuXHRcdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZShvcHRpb25zKTtcblxuXHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcblx0fTtcblxuXHRoYW5kbGVHZW9jb2RlUmVzdWx0KHJlc3VsdHMpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiaGFuZGxlR2VvY29kZVJlc3VsdFwiLCByZXN1bHRzKTtcblx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XHRcdFxuXG5cdFx0Ly8gaWYganVzdCBhZGRyZXNzIHdhcyBnaXZlblxuXHRcdGlmICh0aGlzLm1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoQXBwU3RhdGVzLk5vcm1hbCk7XHRcblx0XHRcdHRoaXMubWFwQ29tcG9uZW50LmZpdEJvdW5kcyh0aGlzLmdlb2NvZGVyLmdldEJvdW5kcygpKTtcdFx0XHRcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuYm91bmRzTW9kdWxlLmNyZWF0ZUJvdW5kc0Zyb21Mb2NhdGlvbih0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpO1xuXHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmNsZWFyQ3VycmVudHNFbGVtZW50KCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSx0cnVlKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNYXJrZXJDbGljayhtYXJrZXIgOiBCaW9wZW5NYXJrZXIpXG5cdHtcblx0XHRpZiAoIHRoaXMubW9kZSAhPSBBcHBNb2Rlcy5NYXApIHJldHVybjtcblxuXHRcdHRoaXMuc2V0VGltZW91dENsaWNraW5nKCk7XG5cblx0XHRpZiAobWFya2VyLmlzSGFsZkhpZGRlbigpKSB0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5Ob3JtYWwpO1x0XG5cblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZDogbWFya2VyLmdldElkKCkgfSk7XHRcdFxuXG5cdFx0aWYgKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlKVxuXHRcdHtcblx0XHRcdC8vQXBwLlNSQ01vZHVsZSgpLnNlbGVjdEVsZW1lbnRCeUlkKHRoaXMuaWRfKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNYXBJZGxlKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKFwiQXBwIGhhbmRsZSBtYXAgaWRsZSwgbWFwTG9hZGVkIDogXCIgLCB0aGlzLm1hcENvbXBvbmVudC5pc01hcExvYWRlZCk7XG5cblx0XHQvLyBzaG93aW5nIEluZm9CYXJDb21wb25lbnQgbWFrZSB0aGUgbWFwIHJlc2l6ZWQgYW5kIHNvIGlkbGUgaXMgdHJpZ2dlcmVkLCBcblx0XHQvLyBidXQgd2UncmUgbm90IGludGVyZXNzZWQgaW4gdGhpcyBpZGxpbmdcblx0XHQvL2lmICh0aGlzLmlzU2hvd2luZ0luZm9CYXJDb21wb25lbnQpIHJldHVybjtcblx0XHRcblx0XHRpZiAodGhpcy5tb2RlICE9IEFwcE1vZGVzLk1hcCkgICAgIHJldHVybjtcblx0XHQvL2lmICh0aGlzLnN0YXRlICAhPSBBcHBTdGF0ZXMuTm9ybWFsKSAgICAgcmV0dXJuO1xuXG5cdFx0Ly8gd2UgbmVlZCBtYXAgdG8gYmUgbG9hZGVkIHRvIGdldCB0aGUgcmFkaXVzIG9mIHRoZSB2aWV3cG9ydFxuXHRcdC8vIGFuZCBnZXQgdGhlIGVsZW1lbnRzIGluc2lkZVxuXHRcdGlmICghdGhpcy5tYXBDb21wb25lbnQuaXNNYXBMb2FkZWQpXG5cdFx0e1xuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBMb2FkZWQuZG8oKCkgPT4ge3RoaXMuaGFuZGxlTWFwSWRsZSgpOyB9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMubWFwQ29tcG9uZW50Lm9uTWFwTG9hZGVkLm9mZigoKSA9PiB7dGhpcy5oYW5kbGVNYXBJZGxlKCk7IH0pO1xuXHRcdH1cblxuXHRcdGxldCB1cGRhdGVJbkFsbEVsZW1lbnRMaXN0ID0gdHJ1ZTtcblx0XHRsZXQgZm9yY2VSZXBhaW50ID0gZmFsc2U7XG5cblx0XHRsZXQgem9vbSA9IHRoaXMubWFwQ29tcG9uZW50Xy5nZXRab29tKCk7XG5cdFx0bGV0IG9sZF96b29tID0gdGhpcy5tYXBDb21wb25lbnRfLmdldE9sZFpvb20oKTtcblxuXHRcdGlmICh6b29tICE9IG9sZF96b29tICYmIG9sZF96b29tICE9IC0xKSAgXG5cdFx0e1xuXHRcdFx0aWYgKHpvb20gPiBvbGRfem9vbSkgdXBkYXRlSW5BbGxFbGVtZW50TGlzdCA9IGZhbHNlO1x0ICAgXHRcdFxuXHRcdFx0Zm9yY2VSZXBhaW50ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodXBkYXRlSW5BbGxFbGVtZW50TGlzdCwgZm9yY2VSZXBhaW50KTtcblx0XHQvL3RoaXMuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c0ljb25zKGZhbHNlKTtcblxuXHRcdHRoaXMuY2hlY2tGb3JOZXdFbGVtZW50c1RvUmV0cmlldmUoKTtcblxuXHRcdHRoaXMuaGlzdG9yeU1vZHVsZS51cGRhdGVDdXJyU3RhdGUoKTtcblx0fTtcblxuXHRjaGVja0Zvck5ld0VsZW1lbnRzVG9SZXRyaWV2ZSgpXG5cdHtcblx0XHRsZXQgZnJlZUJvdW5kcyA9IHRoaXMuYm91bmRzTW9kdWxlLmNhbGN1bGF0ZUZyZWVCb3VuZHMoKTtcblx0XHRpZiAoZnJlZUJvdW5kcyAmJiBmcmVlQm91bmRzLmxlbmd0aCA+IDApIHRoaXMuYWpheE1vZHVsZS5nZXRFbGVtZW50c0luQm91bmRzKGZyZWVCb3VuZHMpOyBcblx0fVxuXG5cdGhhbmRsZU1hcENsaWNrKClcblx0e1xuXHRcdGlmICh0aGlzLmlzQ2xpY2tpbmcpIHJldHVybjtcblxuXHRcdC8vY29uc29sZS5sb2coXCJoYW5kbGUgTWFwIENsaWNrXCIsIEFwcFN0YXRlc1t0aGlzLnN0YXRlXSk7XG5cdFx0XG5cdFx0aWYgKHRoaXMuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50IHx8IHRoaXMuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUpXG5cdFx0XHR0aGlzLmluZm9CYXJDb21wb25lbnQuaGlkZSgpOyBcdFx0XG5cdFx0ZWxzZSBpZiAodGhpcy5zdGF0ZSA9PSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMpXG5cdFx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZCA6IEFwcC5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSB9KTtcdFx0XHRcdFxuXHR9O1xuICAgIFxuXG5cdGhhbmRsZVNlYXJjaEFjdGlvbihhZGRyZXNzIDogc3RyaW5nKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coXCJoYW5kbGUgc2VhcmNoIGFjdGlvblwiLCBhZGRyZXNzKTtcblx0XHRcblx0XHRcdHRoaXMuZ2VvY29kZXJNb2R1bGVfLmdlb2NvZGVBZGRyZXNzKFxuXHRcdFx0YWRkcmVzcywgXG5cdFx0XHQocmVzdWx0cyA6IEdlb2NvZGVSZXN1bHRbXSkgPT4gXG5cdFx0XHR7IFxuXHRcdFx0XHRzd2l0Y2ggKEFwcC5zdGF0ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLk5vcm1hbDpcdFxuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50Olx0XG5cdFx0XHRcdFx0XHR0aGlzLmhhbmRsZUdlb2NvZGVSZXN1bHQocmVzdWx0cyk7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZURvY3VtZW50VGl0bGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmU6XG5cdFx0XHRcdFx0XHR0aGlzLmluZm9CYXJDb21wb25lbnQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5oYW5kbGVHZW9jb2RlUmVzdWx0KHJlc3VsdHMpO1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVEb2N1bWVudFRpdGxlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcdFxuXHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMse2lkOiB0aGlzLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpIH0pO1xuXHRcdFx0XHRcdFx0YnJlYWs7XHRcdFxuXHRcdFx0XHR9XHRcdFx0XHRcdFxuXHRcdFx0fVx0XG5cdFx0KTtcdFxuXHR9O1xuXHRcblxuXHRoYW5kbGVOZXdFbGVtZW50c1JlY2VpdmVkRnJvbVNlcnZlcihlbGVtZW50c0pzb24pXG5cdHtcdFx0XG5cdFx0aWYgKCFlbGVtZW50c0pzb24gfHwgZWxlbWVudHNKc29uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdC8vY29uc29sZS5sb2coXCJoYW5kbGVOZXdNYXJrZXJzRnJvbVNlcnZlclwiLCBlbGVtZW50c0pzb24ubGVuZ3RoKTtcblx0XHRsZXQgbmV3RWxlbWVudHMgOiBFbGVtZW50W10gPSB0aGlzLmVsZW1lbnRNb2R1bGUuYWRkSnNvbkVsZW1lbnRzKGVsZW1lbnRzSnNvbiwgdHJ1ZSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIm5ldyBFbGVtZW50cyBsZW5ndGhcIiwgbmV3RWxlbWVudHMubGVuZ3RoKTtcblx0XHRcblx0XHQvLyBvbiBhZGQgbWFya2VyQ2x1c3Rlckdyb3VwIGFmdGVyIGZpcnN0IGVsZW1lbnRzIHJlY2VpdmVkXG5cdFx0aWYgKG5ld0VsZW1lbnRzLmxlbmd0aCA+IDApIFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c1RvRGlzcGxheSh0cnVlLHRydWUpO1x0XG5cdFx0fVxuXHR9OyBcblxuXHRoYW5kbGVFbGVtZW50c0NoYW5nZWQocmVzdWx0IDogRWxlbWVudHNDaGFuZ2VkKVxuXHR7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJoYW5kbGVFbGVtZW50c0NoYW5nZWQgdG9EaXNwbGF5IDogXCIscmVzdWx0LmVsZW1lbnRzVG9EaXNwbGF5Lmxlbmd0aCk7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJoYW5kbGVFbGVtZW50c0NoYW5nZWQgbmV3IDogXCIscmVzdWx0Lm5ld0VsZW1lbnRzLmxlbmd0aCk7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJoYW5kbGVFbGVtZW50c0NoYW5nZWQgcmVtb3ZlIDogXCIscmVzdWx0LmVsZW1lbnRzVG9SZW1vdmUubGVuZ3RoKTtcblx0XHRsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVfID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0e1xuXHRcdFx0dGhpcy5lbGVtZW50TGlzdENvbXBvbmVudC51cGRhdGUocmVzdWx0KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodGhpcy5zdGF0ZSAhPSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSlcblx0XHR7XG5cdFx0XHRsZXQgbmV3TWFya2VycyA9IHJlc3VsdC5uZXdFbGVtZW50cy5tYXAoIChlKSA9PiBlLm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXHRcdFx0bGV0IG1hcmtlcnNUb1JlbW92ZSA9IHJlc3VsdC5lbGVtZW50c1RvUmVtb3ZlLmZpbHRlcigoZSkgPT4gIWUuaXNTaG93bkFsb25lKS5tYXAoIChlKSA9PiBlLm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXG5cdFx0XHR0aGlzLm1hcENvbXBvbmVudC5hZGRNYXJrZXJzKG5ld01hcmtlcnMpO1xuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQucmVtb3ZlTWFya2VycyhtYXJrZXJzVG9SZW1vdmUpO1xuXHRcdH1cdFx0XHRcblxuXHRcdGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHQvL2NvbnNvbGUubG9nKFwiRWxlbWVudHNDaGFuZ2VkIGluIFwiICsgKGVuZC1zdGFydCkgKyBcIiBtc1wiKTtcdFxuXHR9OyBcblxuXHRoYW5kbGVJbmZvQmFySGlkZSgpXG5cdHtcblx0XHRpZiAodGhpcy5zdGF0ZSAhPSBBcHBTdGF0ZXMuU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlICYmIHRoaXMubW9kZV8gIT0gQXBwTW9kZXMuTGlzdCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuTm9ybWFsKTtcblx0XHR9XG5cdH07XG5cblx0aGFuZGxlSW5mb0JhclNob3coZWxlbWVudElkKVxuXHR7XG5cdFx0Ly9sZXQgc3RhdGVzVG9Bdm9pZCA9IFtBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMsQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUsQXBwU3RhdGVzLlN0YXJSZXByZXNlbnRhdGlvbkNob2ljZV07XG5cdFx0Ly9pZiAoJC5pbkFycmF5KHRoaXMuc3RhdGUsIHN0YXRlc1RvQXZvaWQpID09IC0xICkgdGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuU2hvd0VsZW1lbnQsIHtpZDogZWxlbWVudElkfSk7XHRcdFxuXHR9O1xuXG5cdHVwZGF0ZU1heEVsZW1lbnRzKCkgXG5cdHsgXG5cdFx0dGhpcy5tYXhFbGVtZW50c1RvU2hvd09uTWFwXyA9IE1hdGgubWluKE1hdGguZmxvb3IoJCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLndpZHRoKCkgKiAkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuaGVpZ2h0KCkgLyAxMDAwKSwgMTAwMCk7XG5cdFx0Ly93aW5kb3cuY29uc29sZS5sb2coXCJzZXR0aW5nIG1heCBlbGVtZW50cyBcIiArIHRoaXMubWF4RWxlbWVudHNUb1Nob3dPbk1hcF8pO1xuXHR9O1xuXG5cdHNldFRpbWVvdXRDbGlja2luZygpIFxuXHR7IFxuXHRcdHRoaXMuaXNDbGlja2luZ18gPSB0cnVlO1xuXHRcdGxldCB0aGF0ID0gdGhpcztcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aGF0LmlzQ2xpY2tpbmdfID0gZmFsc2U7IH0sIDEwMCk7IFxuXHR9O1xuXG5cdHNldFRpbWVvdXRJbmZvQmFyQ29tcG9uZW50KCkgXG5cdHsgXG5cdFx0dGhpcy5pc1Nob3dpbmdJbmZvQmFyQ29tcG9uZW50XyA9IHRydWU7XG5cdFx0bGV0IHRoYXQgPSB0aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRoYXQuaXNTaG93aW5nSW5mb0JhckNvbXBvbmVudF8gPSBmYWxzZTsgfSwgMTMwMCk7IFxuXHR9XG5cblx0dXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zIDogYW55ID0ge30pXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlRG9jdW1lbnRUaXRsZVwiLCB0aGlzLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpKTtcblxuXHRcdGxldCB0aXRsZSA6IHN0cmluZztcblx0XHRsZXQgZWxlbWVudE5hbWUgOiBzdHJpbmc7XG5cblx0XHRpZiAoIChvcHRpb25zICYmIG9wdGlvbnMuaWQpIHx8IHRoaXMuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkpIFxuXHRcdHtcblx0XHRcdFxuXHRcdFx0bGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRCeUlkKHRoaXMuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkpO1xuXHRcdFx0ZWxlbWVudE5hbWUgPSBjYXBpdGFsaXplKGVsZW1lbnQgPyBlbGVtZW50Lm5hbWUgOiAnJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubW9kZV8gPT0gQXBwTW9kZXMuTGlzdClcblx0XHR7XHRcdFxuXHRcdFx0dGl0bGUgPSAnTGlzdGUgZGVzIGFjdGV1cnMgJyArIHRoaXMuZ2V0TG9jYXRpb25BZGRyZXNzRm9yVGl0bGUoKTtcdFx0XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzd2l0Y2ggKHRoaXMuc3RhdGVfKVxuXHRcdFx0e1xuXHRcdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudDpcdFx0XHRcdFxuXHRcdFx0XHRcdHRpdGxlID0gJ0FjdGV1ciAtICcgKyBlbGVtZW50TmFtZTtcblx0XHRcdFx0XHRicmVhaztcdFxuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmU6XG5cdFx0XHRcdFx0dGl0bGUgPSAnQWN0ZXVyIC0gJyArIGVsZW1lbnROYW1lO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zOlxuXHRcdFx0XHRcdHRpdGxlID0gJ0l0aW7DqXJhaXJlIC0gJyArIGVsZW1lbnROYW1lO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLk5vcm1hbDpcdFx0XHRcblx0XHRcdFx0XHR0aXRsZSA9ICdDYXJ0ZSBkZXMgYWN0ZXVycyAnICsgdGhpcy5nZXRMb2NhdGlvbkFkZHJlc3NGb3JUaXRsZSgpO1x0XHRcdFxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHRcblx0fTtcblxuXHRwcml2YXRlIGdldExvY2F0aW9uQWRkcmVzc0ZvclRpdGxlKClcblx0e1xuXHRcdGlmICh0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uQWRkcmVzcygpKVxuXHRcdHtcblx0XHRcdHJldHVybiBcIi0gXCIgKyB0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uQWRkcmVzcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gXCItIEZyYW5jZVwiO1xuXHR9XG5cblxuXHQvLyBHZXR0ZXJzIHNob3J0Y3V0c1xuXHRtYXAoKSA6IEwuTWFwIHsgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50Xz8gdGhpcy5tYXBDb21wb25lbnRfLmdldE1hcCgpIDogbnVsbDsgfTtcblx0ZWxlbWVudHMoKSB7IHJldHVybiB0aGlzLmVsZW1lbnRzTW9kdWxlXy5jdXJyVmlzaWJsZUVsZW1lbnRzKCk7ICB9O1xuXHRlbGVtZW50QnlJZChpZCkgeyByZXR1cm4gdGhpcy5lbGVtZW50c01vZHVsZV8uZ2V0RWxlbWVudEJ5SWQoaWQpOyAgfTtcblxuXHRnZXQgY29uc3RlbGxhdGlvbigpIHsgcmV0dXJuIG51bGw7IH1cblxuXHRnZXQgY3Vyck1haW5JZCgpIHsgcmV0dXJuIHRoaXMuZGlyZWN0b3J5TWVudUNvbXBvbmVudC5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkOyB9XG5cblx0Z2V0IGlzQ2xpY2tpbmcoKSB7IHJldHVybiB0aGlzLmlzQ2xpY2tpbmdfOyB9O1xuXHRnZXQgaXNTaG93aW5nSW5mb0JhckNvbXBvbmVudCgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzU2hvd2luZ0luZm9CYXJDb21wb25lbnRfOyB9O1xuXHRnZXQgbWF4RWxlbWVudHMoKSB7IHJldHVybiB0aGlzLm1heEVsZW1lbnRzVG9TaG93T25NYXBfOyB9O1xuXG5cdC8vIE1vZHVsZXMgYW5kIGNvbXBvbmVudHNcblx0Z2V0IG1hcENvbXBvbmVudCgpIHsgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50XzsgfTtcblx0Z2V0IGluZm9CYXJDb21wb25lbnQoKSB7IHJldHVybiB0aGlzLmluZm9CYXJDb21wb25lbnRfOyB9O1xuXHRnZXQgZ2VvY29kZXIoKSB7IHJldHVybiB0aGlzLmdlb2NvZGVyTW9kdWxlXzsgfTtcblx0Z2V0IGFqYXhNb2R1bGUoKSB7IHJldHVybiB0aGlzLmFqYXhNb2R1bGVfOyB9O1xuXHRnZXQgZWxlbWVudE1vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudHNNb2R1bGVfOyB9O1xuXHRnZXQgZGlyZWN0aW9uc01vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZGlyZWN0aW9uc01vZHVsZV87IH07XG5cdC8vZ2V0IG1hcmtlck1vZHVsZSgpIHsgcmV0dXJuIHRoaXMubWFya2VyTW9kdWxlXzsgfTtcblx0Z2V0IGZpbHRlck1vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZmlsdGVyTW9kdWxlXzsgfTtcblx0Ly9nZXQgU1JDTW9kdWxlKCkgeyByZXR1cm4gdGhpcy5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2VNb2R1bGVfOyB9O1xuXHRnZXQgREVBTW9kdWxlKCkgeyByZXR1cm4gdGhpcy5kaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXzsgfTtcblx0Ly9nZXQgbGlzdEVsZW1lbnRNb2R1bGUoKSB7IHJldHVybiB0aGlzLmxpc3RFbGVtZW50TW9kdWxlXzsgfTtcblx0Z2V0IHN0YXRlKCkgeyByZXR1cm4gdGhpcy5zdGF0ZV87IH07XG5cdGdldCBtb2RlKCkgeyByZXR1cm4gdGhpcy5tb2RlXzsgfTtcblxufSIsImltcG9ydCB7IEFwcE1vZHVsZSwgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9uLmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgbGV0ICQgOiBhbnk7XG5cbmV4cG9ydCBlbnVtIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlXG57XG5cdE9wdGlvbixcblx0Q2F0ZWdvcnlcbn1cblxuLyoqXG4qIENsYXNzIHJlcHJlc2VudGF0aW5nIGEgTm9kZSBpbiB0aGUgRGlyZWN0b3J5IE1lbnUgVHJlZVxuKlxuKiBBIENhdGVnb3J5T3B0aW9uVHJlZU5vZGUgY2FuIGJlIGEgQ2F0ZWdvcnkgb3IgYW4gT3B0aW9uXG4qL1xuZXhwb3J0IGNsYXNzIENhdGVnb3J5T3B0aW9uVHJlZU5vZGUgXG57XG5cdGlkIDogbnVtYmVyO1xuXG5cdGNoaWxkcmVuIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVtdID0gW107XG5cblx0b3duZXJJZCA6IG51bWJlciA9IG51bGw7XG5cdC8vIGwnaWQgZGUgbGEgbWFpbk9wdGlvbiwgb3UgXCJhbGxcIiBwb3VyIHVuZSBtYWluT3B0aW9uXG5cdG1haW5Pd25lcklkIDogYW55ID0gbnVsbDtcblxuXHRpc0NoZWNrZWQgOiBib29sZWFuID0gdHJ1ZTtcblx0aXNEaXNhYmxlZCA6IGJvb2xlYW4gPSBmYWxzZTtcdFxuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgVFlQRSA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLCBwcml2YXRlIERPTV9JRCA6IHN0cmluZyxwcml2YXRlIERPTV9DSEVDS0JPWF9JRCA6IHN0cmluZyxwcml2YXRlIERPTV9DSElMRFJFTl9DTEFTUyA6IHN0cmluZykge307XG5cblx0Z2V0RG9tKCkgeyByZXR1cm4gJCh0aGlzLkRPTV9JRCArIHRoaXMuaWQpOyB9XG5cblx0Z2V0RG9tQ2hlY2tib3goKSB7IHJldHVybiAkKHRoaXMuRE9NX0NIRUNLQk9YX0lEICsgdGhpcy5pZCk7IH1cblxuXHRnZXREb21DaGlsZHJlbigpIHsgcmV0dXJuIHRoaXMuZ2V0RG9tKCkubmV4dCh0aGlzLkRPTV9DSElMRFJFTl9DTEFTUyk7fVxuXG5cdGdldE93bmVyKCkgOiBDYXRlZ29yeU9wdGlvblRyZWVOb2RlIFxuXHR7IFxuXHRcdGlmICh0aGlzLlRZUEUgPT0gQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUuT3B0aW9uKVxuXHRcdFx0cmV0dXJuIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRDYXRlZ29yeUJ5SWQodGhpcy5vd25lcklkKTsgXG5cblx0XHRpZiAodGhpcy5UWVBFID09IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLkNhdGVnb3J5KVxuXHRcdFx0cmV0dXJuIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRPcHRpb25CeUlkKHRoaXMub3duZXJJZCk7IFxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZGlzYWJsZWRDaGlsZHJlbigpIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVtdIHsgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKCBjaGlsZCA9PiBjaGlsZC5pc0Rpc2FibGVkKTsgfVxuXG5cdHByb3RlY3RlZCBjaGVja2VkQ2hpbGRyZW4oKSA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVbXSB7IHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlciggY2hpbGQgPT4gY2hpbGQuaXNDaGVja2VkKTsgfVxuXG5cdGlzT3B0aW9uKCkgeyByZXR1cm4gdGhpcy5UWVBFID09IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLk9wdGlvbiB9XG5cblx0aXNNYWluT3B0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRzZXRDaGVja2VkKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5pc0NoZWNrZWQgPSBib29sO1xuXHRcdHRoaXMuZ2V0RG9tQ2hlY2tib3goKS5wcm9wKFwiY2hlY2tlZFwiLCBib29sKTtcblx0fVxuXG5cdHNldERpc2FibGVkKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5pc0Rpc2FibGVkID0gYm9vbDtcblx0XHRpZiAoYm9vbClcblx0XHR7XG5cdFx0XHRpZiAoIXRoaXMuZ2V0RG9tKCkuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHRoaXMuZ2V0RG9tKCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHR0aGlzLnNldENoZWNrZWQoZmFsc2UpO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5nZXREb20oKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHR9XG5cdH1cblxuXHR0b2dnbGUodmFsdWUgOiBib29sZWFuID0gbnVsbCwgaHVtYW5BY3Rpb24gOiBib29sZWFuID0gdHJ1ZSlcblx0e1x0XHRcblx0XHRcdGxldCBjaGVjaztcblx0XHRcdGlmICh2YWx1ZSAhPSBudWxsKSBjaGVjayA9IHZhbHVlO1xuXHRcdFx0ZWxzZSBjaGVjayA9ICF0aGlzLmlzQ2hlY2tlZDtcblxuXHRcdFx0dGhpcy5zZXRDaGVja2VkKGNoZWNrKTtcblx0XHRcdHRoaXMuc2V0RGlzYWJsZWQoIWNoZWNrKTtcblxuXHRcdFx0Ly8gaW4gQWxsIG1vZGUsIHdlIGNsaWNrcyBkaXJlY3RseSBvbiB0aGUgbWFpbk9wdGlvbiwgYnV0IGRvbid0IHdhbnQgdG8gYWxsIGNoZWNrYm94IGluIE1haW5PcHRpb25GaWx0ZXIgdG8gZGlzYWJsZVxuXHRcdFx0aWYgKCF0aGlzLmlzTWFpbk9wdGlvbigpKSBcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikgY2hpbGQudG9nZ2xlKGNoZWNrLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1haW5Pd25lcklkID09ICdvcGVuaG91cnMnKSBBcHAuY2F0ZWdvcnlNb2R1bGUudXBkYXRlT3BlbkhvdXJzRmlsdGVyKCk7XG5cblx0XHRcdGlmKGh1bWFuQWN0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5nZXRPd25lcigpKSB0aGlzLmdldE93bmVyKCkudXBkYXRlU3RhdGUoKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vaWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCkgQXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNJY29ucyh0cnVlKTtcblx0XHRcdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkoY2hlY2ssIGZhbHNlLCB0cnVlKTtcblx0XHRcdFx0QXBwLmhpc3RvcnlNb2R1bGUudXBkYXRlQ3VyclN0YXRlKCk7XG5cdFx0XHR9XG5cdH1cblxuXHR1cGRhdGVTdGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5pc01haW5PcHRpb24oKSkgcmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDApIFxuXHRcdFx0dGhpcy5zZXREaXNhYmxlZCghdGhpcy5pc0NoZWNrZWQpO1xuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgZGlzYWJsZWRDaGlsZHJlbkNvdW50ID0gdGhpcy5jaGlsZHJlbi5maWx0ZXIoIChjaGlsZCA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUpID0+IGNoaWxkLmlzRGlzYWJsZWQpLmxlbmd0aDtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIk9wdGlvbiBcIiArIHRoaXMubmFtZSArIFwiIHVwZGF0ZSBzdGF0ZSwgbmJyZSBjaGlsZHJlbiBkaXNhYmxlZCA9IFwiLCBkaXNhYmxlZENoaWxkcmVuQ291bnQpO1xuXG5cdFx0XHRpZiAoZGlzYWJsZWRDaGlsZHJlbkNvdW50ID09IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxuXHRcdFx0XHR0aGlzLnNldERpc2FibGVkKHRydWUpO1x0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuc2V0RGlzYWJsZWQoZmFsc2UpO1xuXG5cdFx0XHRsZXQgY2hlY2tlZENoaWxkcmVuQ291bnQgPSB0aGlzLmNoaWxkcmVuLmZpbHRlciggKGNoaWxkIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSkgPT4gY2hpbGQuaXNDaGVja2VkKS5sZW5ndGg7XG5cblx0XHRcdGlmIChjaGVja2VkQ2hpbGRyZW5Db3VudCA9PSB0aGlzLmNoaWxkcmVuLmxlbmd0aClcblx0XHRcdFx0dGhpcy5zZXRDaGVja2VkKHRydWUpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLnNldENoZWNrZWQoZmFsc2UpXG5cdFx0fVx0XHRcblxuXHRcdGlmICh0aGlzLmdldE93bmVyKCkpICB0aGlzLmdldE93bmVyKCkudXBkYXRlU3RhdGUoKTtcdFxuXHR9XG5cblx0cmVjdXJzaXZlbHlVcGRhdGVTdGF0ZXMoKVxuXHR7XG5cdFx0Zm9yKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGNoaWxkLnJlY3Vyc2l2ZWx5VXBkYXRlU3RhdGVzKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVTdGF0ZSgpO1xuXHR9XG5cblx0aXNFeHBhbmRlZCgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldERvbSgpLmhhc0NsYXNzKCdleHBhbmRlZCcpOyB9XG5cblx0dG9nZ2xlQ2hpbGRyZW5EZXRhaWwoKVxuXHR7XG5cdFx0aWYgKHRoaXMuaXNFeHBhbmRlZCgpKVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tQ2hpbGRyZW4oKS5zdG9wKHRydWUsZmFsc2UpLnNsaWRlVXAoeyBkdXJhdGlvbjogMzUwLCBlYXNpbmc6IFwiZWFzZU91dFF1YXJ0XCIsIHF1ZXVlOiBmYWxzZSwgY29tcGxldGU6IGZ1bmN0aW9uKCkgeyQodGhpcykuY3NzKCdoZWlnaHQnLCAnJyk7fX0pO1xuXHRcdFx0dGhpcy5nZXREb20oKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tQ2hpbGRyZW4oKS5zdG9wKHRydWUsZmFsc2UpLnNsaWRlRG93bih7IGR1cmF0aW9uOiAzNTAsIGVhc2luZzogXCJlYXNlT3V0UXVhcnRcIiwgcXVldWU6IGZhbHNlLCBjb21wbGV0ZTogZnVuY3Rpb24oKSB7JCh0aGlzKS5jc3MoJ2hlaWdodCcsICcnKTt9fSk7XG5cdFx0XHR0aGlzLmdldERvbSgpLmFkZENsYXNzKCdleHBhbmRlZCcpO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IENhdGVnb3J5LCBPcHRpb24sIE9wdGlvblZhbHVlfSBmcm9tIFwiLi9jbGFzc2VzXCI7XG5cbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVZhbHVlXG57XG5cdGNhdGVnb3J5IDogQ2F0ZWdvcnk7XG5cdGNoaWxkcmVuIDogT3B0aW9uVmFsdWVbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGNhdGVnb3J5IDogQ2F0ZWdvcnkpXG5cdHtcblx0XHR0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHRcblx0fVxuXG5cdGFkZE9wdGlvblZhbHVlKG9wdGlvblZhbHVlIDogT3B0aW9uVmFsdWUpXG5cdHtcblx0XHR0aGlzLmNoaWxkcmVuLnB1c2gob3B0aW9uVmFsdWUpO1xuXHR9XG5cblx0Z2V0IGlzTGFzdENhdGVnb3J5RGVwdGgoKSA6IGJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLmNoaWxkcmVuLmV2ZXJ5KCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbi5zdWJjYXRlZ29yaWVzLmxlbmd0aCA9PSAwKTtcblx0fVxufSIsImltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi4vY2xhc3Nlcy9vcHRpb24uY2xhc3NcIjtcbmltcG9ydCB7IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUsIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlIH0gZnJvbSBcIi4vY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnkgZXh0ZW5kcyBDYXRlZ29yeU9wdGlvblRyZWVOb2RlXG57IFxuXHRuYW1lIDogc3RyaW5nO1xuXHRpbmRleDogbnVtYmVyO1xuXHRzaW5nbGVPcHRpb24gOiBib29sZWFuO1xuXHRlbmFibGVEZXNjcmlwdGlvbiA6IGJvb2xlYW47XG5cdGRpc3BsYXlDYXRlZ29yeU5hbWUgOiBib29sZWFuO1xuXHRkZXB0aCA6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcigkY2F0ZWdvcnlKc29uIDogYW55KVxuXHR7XG5cdFx0c3VwZXIoQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUuQ2F0ZWdvcnksICcjY2F0ZWdvcnktJywgJyNzdWJjYXRlZ29yaWUtY2hlY2tib3gtJywgJy5vcHRpb25zLXdyYXBwZXInKTtcblxuXHRcdHRoaXMuaWQgPSAkY2F0ZWdvcnlKc29uLmlkO1xuXHRcdHRoaXMubmFtZSA9ICRjYXRlZ29yeUpzb24ubmFtZTtcblx0XHR0aGlzLmluZGV4ID0gJGNhdGVnb3J5SnNvbi5pbmRleDtcblx0XHR0aGlzLnNpbmdsZU9wdGlvbiA9ICRjYXRlZ29yeUpzb24uc2luZ2xlX29wdGlvbjtcblx0XHR0aGlzLmVuYWJsZURlc2NyaXB0aW9uID0gJGNhdGVnb3J5SnNvbi5lbmFibGVfZGVzY3JpcHRpb247XG5cdFx0dGhpcy5kaXNwbGF5Q2F0ZWdvcnlOYW1lID0gJGNhdGVnb3J5SnNvbi5kaXNwbGF5X2NhdGVnb3J5X25hbWU7XG5cdFx0dGhpcy5kZXB0aCA9ICRjYXRlZ29yeUpzb24uZGVwdGg7XG5cdFx0dGhpcy5tYWluT3duZXJJZCA9ICRjYXRlZ29yeUpzb24ubWFpbk93bmVySWQ7XG5cdH1cblxuXHRhZGRPcHRpb24oJG9wdGlvbiA6IE9wdGlvbikgeyB0aGlzLmNoaWxkcmVuLnB1c2goJG9wdGlvbik7IH1cblxuXHRnZXQgb3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmNoaWxkcmVuOyB9XG5cblx0Z2V0IGRpc2FibGVkT3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmRpc2FibGVkQ2hpbGRyZW4oKTsgfVxuXG5cdGdldCBjaGVja2VkT3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmNoZWNrZWRDaGlsZHJlbigpOyB9XG59XG4iLCJleHBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuL2NhdGVnb3J5LmNsYXNzXCI7XG5leHBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC5jbGFzc1wiO1xuZXhwb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9uLmNsYXNzXCI7XG5leHBvcnQgeyBPcHRpb25WYWx1ZSB9IGZyb20gXCIuL29wdGlvbi12YWx1ZS5jbGFzc1wiO1xuZXhwb3J0IHsgQ2F0ZWdvcnlWYWx1ZSB9IGZyb20gXCIuL2NhdGVnb3J5LXZhbHVlLmNsYXNzXCI7IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBCaW9wZW5NYXJrZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tYXAvYmlvcGVuLW1hcmtlci5jb21wb25lbnRcIjtcbmltcG9ydCB7IE9wdGlvblZhbHVlLCBDYXRlZ29yeVZhbHVlLCBPcHRpb24sIENhdGVnb3J5IH0gZnJvbSBcIi4vY2xhc3Nlc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIHZhciAkO1xuZGVjbGFyZSBsZXQgVHdpZyA6IGFueTtcbmRlY2xhcmUgbGV0IGJpb3Blbl90d2lnSnNfZWxlbWVudEluZm8gOiBhbnk7XG5cblxuZXhwb3J0IGVudW0gRWxlbWVudFN0YXR1cyBcbntcbiAgTW9kZXJhdGlvbk5lZWRlZCA9IC0xLFxuICBQZW5kaW5nID0gMCxcbiAgQWRtaW5WYWxpZGF0ZSA9IDEsXG4gIENvbGxhYm9yYXRpdmVWYWxpZGF0ZSA9IDJcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgXG57XHRcblx0cmVhZG9ubHkgaWQgOiBzdHJpbmc7XG5cdHJlYWRvbmx5IHN0YXR1cyA6IEVsZW1lbnRTdGF0dXM7XG5cdHJlYWRvbmx5IG5hbWUgOiBzdHJpbmc7XG5cdHJlYWRvbmx5IHBvc2l0aW9uIDogTC5MYXRMbmc7XG5cdHJlYWRvbmx5IGFkZHJlc3MgOiBzdHJpbmc7XG5cdHJlYWRvbmx5IGRlc2NyaXB0aW9uIDogc3RyaW5nO1xuXHRyZWFkb25seSB0ZWwgOiBzdHJpbmc7XG5cdHJlYWRvbmx5IHdlYlNpdGUgOiBzdHJpbmc7XG5cdHJlYWRvbmx5IG1haWwgOiBzdHJpbmc7XG5cdHJlYWRvbmx5IG9wZW5Ib3VycyA6IGFueTtcblx0cmVhZG9ubHkgb3BlbkhvdXJzRGF5cyA6IHN0cmluZ1tdID0gW107XG5cdHJlYWRvbmx5IG9wZW5Ib3Vyc01vcmVJbmZvcyA6IGFueTtcblx0cmVhZG9ubHkgbWFpbk9wdGlvbk93bmVySWRzIDogbnVtYmVyW10gPSBbXTtcblxuXHRvcHRpb25zVmFsdWVzIDogT3B0aW9uVmFsdWVbXSA9IFtdO1xuXHRvcHRpb25WYWx1ZXNCeUNhdGdlb3J5IDogT3B0aW9uVmFsdWVbXVtdID0gW107XG5cblx0Y29sb3JPcHRpb25JZCA6IG51bWJlcjtcblx0cHJpdmF0ZSBpY29uc1RvRGlzcGxheSA6IE9wdGlvblZhbHVlW10gPSBbXTtcblx0cHJpdmF0ZSBvcHRpb25UcmVlIDogT3B0aW9uVmFsdWU7XG5cblx0Zm9ybWF0ZWRPcGVuSG91cnNfID0gbnVsbDtcblxuXHRkaXN0YW5jZSA6IG51bWJlcjtcblxuXHRpc0luaXRpYWxpemVkXyA6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdC8vIGZvciBlbGVtZW50cyBtb2R1bGUgYWxnb3JpdGhtc1xuXHRpc0Rpc3BsYXllZCA6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdGlzVmlzaWJsZV8gOiBib29sZWFuID0gZmFsc2U7XG5cdGlzSW5FbGVtZW50TGlzdCA6IGJvb2xlYW49IGZhbHNlO1xuXG5cdC8vVE9ET1xuXHRiaW9wZW5NYXJrZXJfIDogQmlvcGVuTWFya2VyID0gbnVsbDtcblx0aHRtbFJlcHJlc2VudGF0aW9uXyA9ICcnO1xuXG5cdHByb2R1Y3RzVG9EaXNwbGF5XyA6IGFueSA9IHt9O1xuXG5cdHN0YXJDaG9pY2VGb3JSZXByZXNlbnRhdGlvbiA9ICcnO1xuXHRpc1Nob3duQWxvbmUgOiBib29sZWFuPSBmYWxzZTtcblxuXHRpc0Zhdm9yaXRlIDogYm9vbGVhbj0gZmFsc2U7XG5cblx0bmVlZFRvQmVVcGRhdGVkV2hlblNob3duIDogYm9vbGVhbiA9IHRydWU7XG5cblx0Y29uc3RydWN0b3IoZWxlbWVudEpzb24gOiBhbnkpXG5cdHtcblx0XHR0aGlzLmlkID0gZWxlbWVudEpzb24uaWQ7XG5cdFx0dGhpcy5zdGF0dXMgPSBlbGVtZW50SnNvbi5zdGF0dXM7XG5cdFx0dGhpcy5uYW1lID0gZWxlbWVudEpzb24ub1swXTtcblx0XHR0aGlzLnBvc2l0aW9uID0gTC5sYXRMbmcoZWxlbWVudEpzb24ub1sxXSwgZWxlbWVudEpzb24ub1syXSk7XG5cdFx0dGhpcy5hZGRyZXNzID0gZWxlbWVudEpzb24uYWRkcmVzcztcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZWxlbWVudEpzb24uZGVzY3JpcHRpb24gfHwgJyc7XG5cdFx0dGhpcy50ZWwgPSBlbGVtZW50SnNvbi50ZWwgPyBlbGVtZW50SnNvbi50ZWwucmVwbGFjZSgvKC57Mn0pKD8hJCkvZyxcIiQxIFwiKSA6ICcnO1x0XG5cdFx0dGhpcy53ZWJTaXRlID0gZWxlbWVudEpzb24ud2ViU2l0ZTtcblx0XHR0aGlzLm1haWwgPSBlbGVtZW50SnNvbi5tYWlsO1xuXHRcdHRoaXMub3BlbkhvdXJzID0gZWxlbWVudEpzb24ub3BlbkhvdXJzO1xuXHRcdHRoaXMub3BlbkhvdXJzTW9yZUluZm9zID0gIGVsZW1lbnRKc29uLm9wZW5Ib3Vyc01vcmVJbmZvcztcblxuXHRcdC8vIGluaXRpYWxpemUgZm9ybWF0ZWQgb3BlbiBob3Vyc1xuXHRcdHRoaXMuZ2V0Rm9ybWF0ZWRPcGVuSG91cnMoKTtcblxuXHRcdGxldCBuZXdPcHRpb24gOiBPcHRpb25WYWx1ZSwgb3duZXJJZCA6IG51bWJlcjtcblx0XHRmb3IgKGxldCBvcHRpb25WYWx1ZUpzb24gb2YgZWxlbWVudEpzb24udilcblx0XHR7XG5cdFx0XHRuZXdPcHRpb24gPSBuZXcgT3B0aW9uVmFsdWUob3B0aW9uVmFsdWVKc29uKTtcblxuXHRcdFx0Ly9vd25lcklkID0gbmV3T3B0aW9uLm9wdGlvbi5tYWluT3duZXJJZDtcblx0XHRcdGlmIChuZXdPcHRpb24ub3B0aW9uLmlzTWFpbk9wdGlvbigpKSB0aGlzLm1haW5PcHRpb25Pd25lcklkcy5wdXNoKG5ld09wdGlvbi5vcHRpb25JZCk7XG5cdFx0XHQvL2lmICh0aGlzLm1haW5PcHRpb25Pd25lcklkcy5pbmRleE9mKG93bmVySWQpID09IC0xKSBcblxuXHRcdFx0dGhpcy5vcHRpb25zVmFsdWVzLnB1c2gobmV3T3B0aW9uKTtcblxuXHRcdFx0Ly8gcHV0IG9wdGlvbnMgdmFsdWUgaW4gc3BlY2lmaWMgZWFzeSBhY2Nlc3NpYmxlIGFycmF5IGZvciBiZXR0ZXIgcGVyZm9ybWFuY2Vcblx0XHRcdGlmICghdGhpcy5vcHRpb25WYWx1ZXNCeUNhdGdlb3J5W25ld09wdGlvbi5vcHRpb24ub3duZXJJZF0pIHRoaXMub3B0aW9uVmFsdWVzQnlDYXRnZW9yeVtuZXdPcHRpb24ub3B0aW9uLm93bmVySWRdID0gW107XG5cdFx0XHR0aGlzLm9wdGlvblZhbHVlc0J5Q2F0Z2VvcnlbbmV3T3B0aW9uLm9wdGlvbi5vd25lcklkXS5wdXNoKG5ld09wdGlvbik7XG5cdFx0fVxuXG5cdFx0dGhpcy5kaXN0YW5jZSA9IGVsZW1lbnRKc29uLmRpc3RhbmNlID8gTWF0aC5yb3VuZChlbGVtZW50SnNvbi5kaXN0YW5jZSkgOiBudWxsO1x0XG5cblx0fVx0XG5cblx0Z2V0T3B0aW9uVmFsdWVCeUNhdGVnb3J5SWQoJGNhdGVnb3J5SWQpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25WYWx1ZXNCeUNhdGdlb3J5WyRjYXRlZ29yeUlkXSB8fCBbXTtcblx0fVx0XG5cblx0aW5pdGlhbGl6ZSgpIFxuXHR7XHRcdFxuXHRcdHRoaXMuY3JlYXRlT3B0aW9uc1RyZWUoKTtcblx0XHR0aGlzLnVwZGF0ZUljb25zVG9EaXNwbGF5KCk7XG5cblx0XHR0aGlzLmJpb3Blbk1hcmtlcl8gPSBuZXcgQmlvcGVuTWFya2VyKHRoaXMuaWQsIHRoaXMucG9zaXRpb24pO1xuXHRcdHRoaXMuaXNJbml0aWFsaXplZF8gPSB0cnVlO1x0XG5cdH1cblxuXHRzaG93KCkgXG5cdHtcdFx0XG5cdFx0aWYgKCF0aGlzLmlzSW5pdGlhbGl6ZWRfKSB0aGlzLmluaXRpYWxpemUoKTtcdFxuXHRcdC8vdGhpcy51cGRhdGUoKTtcblx0XHQvL3RoaXMuYmlvcGVuTWFya2VyXy51cGRhdGUoKTtcblx0XHR0aGlzLmJpb3Blbk1hcmtlcl8uc2hvdygpO1xuXHRcdHRoaXMuaXNWaXNpYmxlXyA9IHRydWU7XHRcdFxuXHR9O1xuXG5cdGhpZGUoKSBcblx0e1x0XHRcblx0XHRpZiAodGhpcy5iaW9wZW5NYXJrZXJfICYmIEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCkgdGhpcy5iaW9wZW5NYXJrZXJfLmhpZGUoKTtcblx0XHR0aGlzLmlzVmlzaWJsZV8gPSBmYWxzZTtcblx0XHQvLyB1bmJvdW5kIGV2ZW50cyAoY2xpY2sgZXRjLi4uKT9cblx0XHQvL2lmIChjb25zdGVsbGF0aW9uTW9kZSkgJCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgI2VsZW1lbnQtaW5mby0nK3RoaXMuaWQpLmhpZGUoKTtcblx0fTtcblxuXHR1cGRhdGUoJGZvcmNlIDogYm9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIm1hcmtlciB1cGRhdGUgbmVlZFRvQmVVcGRhdGVkXCIsIHRoaXMubmVlZFRvQmVVcGRhdGVkV2hlblNob3duKTtcblx0XHRpZiAodGhpcy5uZWVkVG9CZVVwZGF0ZWRXaGVuU2hvd24gfHwgQXBwLm1vZGUgPT0gQXBwTW9kZXMuTGlzdCB8fCAkZm9yY2UpXG5cdFx0e1xuXHRcdFx0dGhpcy51cGRhdGVJY29uc1RvRGlzcGxheSgpO1xuXG5cdFx0XHRsZXQgb3B0aW9uVmFsdWVzVG9VcGRhdGUgPSB0aGlzLmdldEN1cnJPcHRpb25zVmFsdWVzKCkuZmlsdGVyKCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLmlzRmlsbGVkQnlGaWx0ZXJzKTtcblx0XHRcdG9wdGlvblZhbHVlc1RvVXBkYXRlLnB1c2godGhpcy5nZXRDdXJyTWFpbk9wdGlvblZhbHVlKCkpO1xuXHRcdFx0Zm9yKGxldCBvcHRpb25WYWx1ZSBvZiBvcHRpb25WYWx1ZXNUb1VwZGF0ZSkgdGhpcy51cGRhdGVPd25lckNvbG9yKG9wdGlvblZhbHVlKTtcblxuXHRcdFx0dGhpcy5jb2xvck9wdGlvbklkID0gdGhpcy5pY29uc1RvRGlzcGxheS5sZW5ndGggPiAwICYmIHRoaXMuZ2V0SWNvbnNUb0Rpc3BsYXkoKVswXSA/IHRoaXMuZ2V0SWNvbnNUb0Rpc3BsYXkoKVswXS5jb2xvck9wdGlvbklkIDogbnVsbDtcdFxuXG5cdFx0XHRpZiAodGhpcy5tYXJrZXIpIHRoaXMubWFya2VyLnVwZGF0ZSgpO1xuXHRcdFx0dGhpcy5uZWVkVG9CZVVwZGF0ZWRXaGVuU2hvd24gPSBmYWxzZTtcblx0XHR9XHRcdFxuXHR9XG5cblx0dXBkYXRlT3duZXJDb2xvcigkb3B0aW9uVmFsdWUgOiBPcHRpb25WYWx1ZSlcblx0e1xuXHRcdGlmICghJG9wdGlvblZhbHVlKSByZXR1cm47XG5cdFx0Ly9jb25zb2xlLmxvZyhcInVwZGF0ZU93bmVyQ29sb3JcIiwgJG9wdGlvblZhbHVlLm9wdGlvbi5uYW1lKTtcblx0XHRpZiAoJG9wdGlvblZhbHVlLm9wdGlvbi51c2VDb2xvckZvck1hcmtlcilcblx0XHR7XG5cdFx0XHQkb3B0aW9uVmFsdWUuY29sb3JPcHRpb25JZCA9ICRvcHRpb25WYWx1ZS5vcHRpb25JZDtcblx0XHR9XHRcdFxuXHRcdGVsc2UgXG5cdFx0e1xuXHRcdFx0bGV0IG9wdGlvbiA6IE9wdGlvbjtcblx0XHRcdGxldCBjYXRlZ29yeSA6IENhdGVnb3J5O1xuXHRcdFx0bGV0IGNvbG9ySWQgOiBudW1iZXIgPSBudWxsO1xuXG5cdFx0XHRsZXQgc2libGluZ3NPcHRpb25zRm9yQ29sb3JpbmcgOiBPcHRpb25WYWx1ZVtdID0gdGhpcy5nZXRDdXJyT3B0aW9uc1ZhbHVlcygpLmZpbHRlciggXG5cdFx0XHRcdChvcHRpb25WYWx1ZSkgPT4gXG5cdFx0XHRcdFx0b3B0aW9uVmFsdWUuaXNGaWxsZWRCeUZpbHRlcnMgXG5cdFx0XHRcdFx0JiYgb3B0aW9uVmFsdWUub3B0aW9uLnVzZUNvbG9yRm9yTWFya2VyXG5cdFx0XHRcdFx0JiYgb3B0aW9uVmFsdWUub3B0aW9uLm93bmVySWQgIT09ICRvcHRpb25WYWx1ZS5vcHRpb24ub3duZXJJZCBcblx0XHRcdFx0XHQmJiBvcHRpb25WYWx1ZS5jYXRlZ29yeU93bmVyLm93bmVySWQgPT0gJG9wdGlvblZhbHVlLmNhdGVnb3J5T3duZXIub3duZXJJZFxuXHRcdFx0KTtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInNpYmxpbmdzT3B0aW9uc0ZvckNvbG9yaW5nXCIsIHNpYmxpbmdzT3B0aW9uc0ZvckNvbG9yaW5nLm1hcCggKG9wKSA9PiBvcC5vcHRpb24ubmFtZSkpO1xuXHRcdFx0aWYgKHNpYmxpbmdzT3B0aW9uc0ZvckNvbG9yaW5nLmxlbmd0aCA+IDApXG5cdFx0XHR7XG5cdFx0XHRcdG9wdGlvbiA9IDxPcHRpb24+IHNpYmxpbmdzT3B0aW9uc0ZvckNvbG9yaW5nLnNoaWZ0KCkub3B0aW9uO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiLT4gc2libGluZyBmb3VuZCA6IFwiLCBvcHRpb24ubmFtZSk7XG5cdFx0XHRcdGNvbG9ySWQgPSBvcHRpb24uaWQ7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdG9wdGlvbiA9ICRvcHRpb25WYWx1ZS5vcHRpb247XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJubyBzaWJsaW5ncywgbG9va2luZyBmb3IgcGFyZW50XCIpO1xuXHRcdFx0XHR3aGlsZShjb2xvcklkID09IG51bGwgJiYgb3B0aW9uKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y2F0ZWdvcnkgPSA8Q2F0ZWdvcnk+IG9wdGlvbi5nZXRPd25lcigpO1xuXHRcdFx0XHRcdGlmIChjYXRlZ29yeSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRvcHRpb24gPSA8T3B0aW9uPiBjYXRlZ29yeS5nZXRPd25lcigpO1x0XHRcdFx0XHRcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCItPnBhcmVudCBvcHRpb25cIiArIG9wdGlvbi5uYW1lICsgXCIgdXNlY29sb3JGb3JNYXJrZXJcIiwgb3B0aW9uLnVzZUNvbG9yRm9yTWFya2VyKTtcblx0XHRcdFx0XHRcdGNvbG9ySWQgPSBvcHRpb24udXNlQ29sb3JGb3JNYXJrZXIgPyBvcHRpb24uaWQgOiBudWxsO1xuXHRcdFx0XHRcdH1cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0JG9wdGlvblZhbHVlLmNvbG9yT3B0aW9uSWQgPSBjb2xvcklkO1xuXHRcdH1cblx0fVxuXG5cdGdldEN1cnJPcHRpb25zVmFsdWVzKCkgOiBPcHRpb25WYWx1ZVtdXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zVmFsdWVzLmZpbHRlciggKG9wdGlvblZhbHVlKSA9PiBvcHRpb25WYWx1ZS5vcHRpb24ubWFpbk93bmVySWQgPT0gQXBwLmN1cnJNYWluSWQpO1xuXHR9XG5cblx0Z2V0Q3Vyck1haW5PcHRpb25WYWx1ZSgpIDogT3B0aW9uVmFsdWVcblx0e1xuXHRcdHJldHVybiB0aGlzLm9wdGlvbnNWYWx1ZXMuZmlsdGVyKCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbi5pZCA9PSBBcHAuY3Vyck1haW5JZCkuc2hpZnQoKTtcblx0fVxuXG5cdGdldENhdGVnb3JpZXNJZHMoKSA6IG51bWJlcltdXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXRDdXJyT3B0aW9uc1ZhbHVlcygpLm1hcCggKG9wdGlvblZhbHVlKSA9PiBvcHRpb25WYWx1ZS5jYXRlZ29yeU93bmVyLmlkKS5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXgpO1xuXHR9XG5cblx0Z2V0T3B0aW9uc0lkc0luQ2F0ZWdvcmllSWQoY2F0ZWdvcnlJZCkgOiBudW1iZXJbXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0Q3Vyck9wdGlvbnNWYWx1ZXMoKS5maWx0ZXIoIChvcHRpb25WYWx1ZSkgPT4gb3B0aW9uVmFsdWUub3B0aW9uLm93bmVySWQgPT0gY2F0ZWdvcnlJZCkubWFwKCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbklkKTtcblx0fVxuXG5cdGNyZWF0ZU9wdGlvbnNUcmVlKClcblx0e1xuXHRcdHRoaXMub3B0aW9uVHJlZSA9IG5ldyBPcHRpb25WYWx1ZSh7fSk7XG5cdFx0bGV0IG1haW5DYXRlZ29yeSA9IEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnk7XG5cblx0XHR0aGlzLnJlY3VzaXZlbHlDcmVhdGVPcHRpb25UcmVlKG1haW5DYXRlZ29yeSwgdGhpcy5vcHRpb25UcmVlKTtcblx0fVxuXG5cdGdldE9wdGlvblRyZWUoKVxuXHR7XG5cdFx0aWYgKHRoaXMub3B0aW9uVHJlZSkgcmV0dXJuIHRoaXMub3B0aW9uVHJlZTtcblx0XHR0aGlzLmNyZWF0ZU9wdGlvbnNUcmVlKCk7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9uVHJlZTtcblx0fVxuXG5cdHByaXZhdGUgcmVjdXNpdmVseUNyZWF0ZU9wdGlvblRyZWUoY2F0ZWdvcnkgOiBDYXRlZ29yeSwgb3B0aW9uVmFsdWUgOiBPcHRpb25WYWx1ZSlcblx0e1xuXHRcdGxldCBjYXRlZ29yeVZhbHVlID0gbmV3IENhdGVnb3J5VmFsdWUoY2F0ZWdvcnkpO1xuXG5cdFx0Zm9yKGxldCBvcHRpb24gb2YgY2F0ZWdvcnkub3B0aW9ucylcblx0XHR7XG5cdFx0XHRsZXQgY2hpbGRPcHRpb25WYWx1ZSA9IHRoaXMuZmlsbE9wdGlvbklkKG9wdGlvbi5pZCk7XG5cdFx0XHRpZiAoY2hpbGRPcHRpb25WYWx1ZSlcblx0XHRcdHtcblx0XHRcdFx0Y2F0ZWdvcnlWYWx1ZS5hZGRPcHRpb25WYWx1ZShjaGlsZE9wdGlvblZhbHVlKTtcblx0XHRcdFx0Zm9yKGxldCBzdWJjYXRlZ29yeSBvZiBvcHRpb24uc3ViY2F0ZWdvcmllcylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMucmVjdXNpdmVseUNyZWF0ZU9wdGlvblRyZWUoc3ViY2F0ZWdvcnksIGNoaWxkT3B0aW9uVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cdFx0fVxuXG5cdFx0aWYgKGNhdGVnb3J5VmFsdWUuY2hpbGRyZW4ubGVuZ3RoID4gMClcblx0XHR7XG5cdFx0XHRjYXRlZ29yeVZhbHVlLmNoaWxkcmVuLnNvcnQoIChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcblx0XHRcdG9wdGlvblZhbHVlLmFkZENhdGVnb3J5VmFsdWUoY2F0ZWdvcnlWYWx1ZSk7XG5cdFx0fSBcblx0fVxuXG5cdGZpbGxPcHRpb25JZCgkb3B0aW9uSWQgOiBudW1iZXIpIDogT3B0aW9uVmFsdWVcblx0e1xuXHRcdGxldCBpbmRleCA9IHRoaXMub3B0aW9uc1ZhbHVlcy5tYXAoKHZhbHVlKSA9PiB2YWx1ZS5vcHRpb25JZCkuaW5kZXhPZigkb3B0aW9uSWQpO1xuXHRcdGlmIChpbmRleCA9PSAtMSkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9uc1ZhbHVlc1tpbmRleF07XG5cdH1cblxuXHRnZXRJY29uc1RvRGlzcGxheSgpIDogT3B0aW9uVmFsdWVbXVxuXHR7XG5cdFx0bGV0IHJlc3VsdCA9IHRoaXMuaWNvbnNUb0Rpc3BsYXk7XG5cdFx0cmV0dXJuIHJlc3VsdC5zb3J0KCAoYSxiKSA9PiBhLmlzRmlsbGVkQnlGaWx0ZXJzID8gLTEgOiAxKTtcblx0fVxuXG5cdHVwZGF0ZUljb25zVG9EaXNwbGF5KCkgXG5cdHtcdFx0XG5cdFx0dGhpcy5jaGVja0ZvckRpc2FibGVkT3B0aW9uVmFsdWVzKCk7XG5cblx0XHRpZiAoQXBwLmN1cnJNYWluSWQgPT0gJ2FsbCcpXG5cdFx0XHR0aGlzLmljb25zVG9EaXNwbGF5ID0gdGhpcy5yZWN1cnNpdmVseVNlYXJjaEljb25zVG9EaXNwbGF5KHRoaXMuZ2V0T3B0aW9uVHJlZSgpLCBmYWxzZSk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5pY29uc1RvRGlzcGxheSA9IHRoaXMucmVjdXJzaXZlbHlTZWFyY2hJY29uc1RvRGlzcGxheSh0aGlzLmdldEN1cnJNYWluT3B0aW9uVmFsdWUoKSk7XG5cblx0XHQvLyBpbiBjYXNlIG9mIG5vIE9wdGlvblZhbHVlIGluIHRoaXMgbWFpbk9wdGlvbiwgd2UgZGlzcGxheSB0aGUgbWFpbk9wdGlvbiBJY29uXG5cdFx0aWYgKHRoaXMuaWNvbnNUb0Rpc3BsYXkubGVuZ3RoID09IDApXG5cdFx0e1xuXHRcdFx0dGhpcy5pY29uc1RvRGlzcGxheS5wdXNoKHRoaXMuZ2V0Q3Vyck1haW5PcHRpb25WYWx1ZSgpKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZyhcIkljb25zIHRvIGRpc3BsYXkgc29ydGVkXCIsIHRoaXMuZ2V0SWNvbnNUb0Rpc3BsYXkoKSk7XG5cdH1cblxuXHRwcml2YXRlIHJlY3Vyc2l2ZWx5U2VhcmNoSWNvbnNUb0Rpc3BsYXkocGFyZW50T3B0aW9uVmFsdWUgOiBPcHRpb25WYWx1ZSwgcmVjdXJzaXZlIDogYm9vbGVhbiA9IHRydWUpIDogT3B0aW9uVmFsdWVbXVxuXHR7XG5cdFx0aWYgKCFwYXJlbnRPcHRpb25WYWx1ZSkgcmV0dXJuIFtdO1xuXG5cdFx0bGV0IHJlc3VsdE9wdGlvbnMgOiBPcHRpb25WYWx1ZVtdID0gW107XHRcdFxuXG5cdFx0Zm9yKGxldCBjYXRlZ29yeVZhbHVlIG9mIHBhcmVudE9wdGlvblZhbHVlLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGZvcihsZXQgb3B0aW9uVmFsdWUgb2YgY2F0ZWdvcnlWYWx1ZS5jaGlsZHJlbilcblx0XHRcdHtcblx0XHRcdFx0bGV0IHJlc3VsdCA9IFtdO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKHJlY3Vyc2l2ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlc3VsdCA9IHRoaXMucmVjdXJzaXZlbHlTZWFyY2hJY29uc1RvRGlzcGxheShvcHRpb25WYWx1ZSkgfHwgW107XG5cdFx0XHRcdFx0cmVzdWx0T3B0aW9ucyA9IHJlc3VsdE9wdGlvbnMuY29uY2F0KHJlc3VsdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAwICYmIG9wdGlvblZhbHVlLm9wdGlvbi51c2VJY29uRm9yTWFya2VyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVzdWx0T3B0aW9ucy5wdXNoKG9wdGlvblZhbHVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRPcHRpb25zO1xuXHR9XG5cblx0Y2hlY2tGb3JEaXNhYmxlZE9wdGlvblZhbHVlcygpXG5cdHtcblx0XHR0aGlzLnJlY3Vyc2l2ZWx5Q2hlY2tGb3JEaXNhYmxlZE9wdGlvblZhbHVlcyh0aGlzLmdldE9wdGlvblRyZWUoKSwgQXBwLmN1cnJNYWluSWQgPT0gJ2FsbCcpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWN1cnNpdmVseUNoZWNrRm9yRGlzYWJsZWRPcHRpb25WYWx1ZXMob3B0aW9uVmFsdWUgOiBPcHRpb25WYWx1ZSwgbm9SZWN1cnNpdmUgOiBib29sZWFuID0gdHJ1ZSlcblx0e1xuXHRcdGxldCBpc0V2ZXJ5Q2F0ZWdvcnlDb250YWluc09uZU9wdGlvbk5vdGRpc2FibGVkID0gdHJ1ZTtcblx0XHQvL2NvbnNvbGUubG9nKFwiY2hlY2tGb3JEaXNhYmxlZE9wdGlvblZhbHVlIE5vcmVjdXJzaXZlIDogXCIgKyBub1JlY3Vyc2l2ZSwgb3B0aW9uVmFsdWUpO1xuXG5cdFx0Zm9yKGxldCBjYXRlZ29yeVZhbHVlIG9mIG9wdGlvblZhbHVlLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGxldCBpc1NvbWVPcHRpb25Ob3RkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0Zm9yIChsZXQgc3Vib3B0aW9uVmFsdWUgb2YgY2F0ZWdvcnlWYWx1ZS5jaGlsZHJlbilcblx0XHRcdHtcblx0XHRcdFx0aWYgKHN1Ym9wdGlvblZhbHVlLmNoaWxkcmVuLmxlbmd0aCA9PSAwIHx8IG5vUmVjdXJzaXZlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvdHRvbSBvcHRpb24gXCIgKyBzdWJvcHRpb25WYWx1ZS5vcHRpb24ubmFtZSxzdWJvcHRpb25WYWx1ZS5vcHRpb24uaXNDaGVja2VkICk7XG5cdFx0XHRcdFx0c3Vib3B0aW9uVmFsdWUuaXNGaWxsZWRCeUZpbHRlcnMgPSBzdWJvcHRpb25WYWx1ZS5vcHRpb24uaXNDaGVja2VkO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnJlY3Vyc2l2ZWx5Q2hlY2tGb3JEaXNhYmxlZE9wdGlvblZhbHVlcyhzdWJvcHRpb25WYWx1ZSwgbm9SZWN1cnNpdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdWJvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycykgaXNTb21lT3B0aW9uTm90ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc1NvbWVPcHRpb25Ob3RkaXNhYmxlZCkgaXNFdmVyeUNhdGVnb3J5Q29udGFpbnNPbmVPcHRpb25Ob3RkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIkNhdGVnb3J5VmFsdWUgXCIgKyBjYXRlZ29yeVZhbHVlLmNhdGVnb3J5Lm5hbWUgKyBcImlzU29tZU9wdGlvbk5vdGRpc2FibGVkXCIsIGlzU29tZU9wdGlvbk5vdGRpc2FibGVkKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9uVmFsdWUub3B0aW9uKVxuXHRcdHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJPcHRpb25WYWx1ZSBcIiArIG9wdGlvblZhbHVlLm9wdGlvbi5uYW1lICsgXCIgOiBpc0V2ZXJ5Q2F0ZWdveXJDb250YWluT25PcHRpb25cIiwgaXNFdmVyeUNhdGVnb3J5Q29udGFpbnNPbmVPcHRpb25Ob3RkaXNhYmxlZCApO1xuXHRcdFx0b3B0aW9uVmFsdWUuaXNGaWxsZWRCeUZpbHRlcnMgPSBpc0V2ZXJ5Q2F0ZWdvcnlDb250YWluc09uZU9wdGlvbk5vdGRpc2FibGVkO1xuXHRcdFx0aWYgKCFvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycykgb3B0aW9uVmFsdWUuc2V0UmVjdXJzaXZlbHlGaWxsZWRCeUZpbHRlcnMob3B0aW9uVmFsdWUuaXNGaWxsZWRCeUZpbHRlcnMpO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZVByb2R1Y3RzUmVwcmVzZW50YXRpb24oKSBcblx0e1x0XHRcblx0XHQvLyBpZiAoQXBwLnN0YXRlICE9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbikgcmV0dXJuO1xuXG5cdFx0Ly8gbGV0IHN0YXJOYW1lcyA9IEFwcC5jb25zdGVsbGF0aW9uLmdldFN0YXJOYW1lc1JlcHJlc2VudGVkQnlFbGVtZW50SWQodGhpcy5pZCk7XG5cdFx0Ly8gaWYgKHRoaXMuaXNQcm9kdWN0ZXVyT3JBbWFwKCkpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMucHJvZHVjdHMubGVuZ3RoO2krKylcblx0XHQvLyBcdHtcblx0XHQvLyBcdFx0cHJvZHVjdE5hbWUgPSB0aGlzLnByb2R1Y3RzW2ldLm5hbWVGb3JtYXRlO1x0XHRcdFxuXG5cdFx0Ly8gXHRcdGlmICgkLmluQXJyYXkocHJvZHVjdE5hbWUsIHN0YXJOYW1lcykgPT0gLTEpXG5cdFx0Ly8gXHRcdHtcblx0XHQvLyBcdFx0XHR0aGlzLnByb2R1Y3RzW2ldLmRpc2FibGVkID0gdHJ1ZTtcdFx0XHRcdFxuXHRcdC8vIFx0XHRcdGlmIChwcm9kdWN0TmFtZSA9PSB0aGlzLm1haW5Qcm9kdWN0KSB0aGlzLm1haW5Qcm9kdWN0SXNEaXNhYmxlZCA9IHRydWU7XHRcdFx0XHRcblx0XHQvLyBcdFx0fVx0XG5cdFx0Ly8gXHRcdGVsc2Vcblx0XHQvLyBcdFx0e1xuXHRcdC8vIFx0XHRcdHRoaXMucHJvZHVjdHNbaV0uZGlzYWJsZWQgPSBmYWxzZTtcdFx0XHRcdFxuXHRcdC8vIFx0XHRcdGlmIChwcm9kdWN0TmFtZSA9PSB0aGlzLm1haW5Qcm9kdWN0KSB0aGlzLm1haW5Qcm9kdWN0SXNEaXNhYmxlZCA9IGZhbHNlO1x0XHRcblx0XHQvLyBcdFx0fVx0XHRcblx0XHQvLyBcdH1cblx0XHQvLyB9XG5cdFx0Ly8gZWxzZVxuXHRcdC8vIHtcblx0XHQvLyBcdGlmIChzdGFyTmFtZXMubGVuZ3RoID09PSAwKSB0aGlzLm1haW5Qcm9kdWN0SXNEaXNhYmxlZCA9IHRydWU7XHRcblx0XHQvLyBcdGVsc2UgdGhpcy5tYWluUHJvZHVjdElzRGlzYWJsZWQgPSBmYWxzZTtcdFxuXHRcdC8vIH1cblx0fTtcblxuXHR1cGRhdGVEaXN0YW5jZSgpXG5cdHtcblx0XHR0aGlzLmRpc3RhbmNlID0gbnVsbDtcblx0XHRpZiAoQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpIFxuXHRcdFx0dGhpcy5kaXN0YW5jZSA9IEFwcC5tYXBDb21wb25lbnQuZGlzdGFuY2VGcm9tTG9jYXRpb25Ubyh0aGlzLnBvc2l0aW9uKTtcblx0XHRlbHNlIGlmIChBcHAubWFwQ29tcG9uZW50LmdldENlbnRlcigpKVxuXHRcdFx0dGhpcy5kaXN0YW5jZSA9IEFwcC5tYXBDb21wb25lbnQuZ2V0Q2VudGVyKCkuZGlzdGFuY2VUbyh0aGlzLnBvc2l0aW9uKTtcblx0XHQvLyBkaXN0YW5jZSB2b2wgZCdvaXNlYXUsIG9uIGFycm9uZGkgZXQgb24gbCdhdWdtZW50ZSB1biBwZXVcblx0XHR0aGlzLmRpc3RhbmNlID0gdGhpcy5kaXN0YW5jZSA/IE1hdGgucm91bmQoMS4yKnRoaXMuZGlzdGFuY2UpIDogbnVsbDtcblx0fVxuXG5cdGlzUGVuZGluZygpIHsgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBFbGVtZW50U3RhdHVzLlBlbmRpbmc7IH1cblxuXHRnZXRIdG1sUmVwcmVzZW50YXRpb24oKSBcblx0e1x0XG5cdFx0dGhpcy51cGRhdGUoKTtcdFxuXHRcdC8vbGV0IHN0YXJOYW1lcyA9IEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbiA/IEFwcC5jb25zdGVsbGF0aW9uLmdldFN0YXJOYW1lc1JlcHJlc2VudGVkQnlFbGVtZW50SWQodGhpcy5pZCkgOiBbXTtcblx0XHRsZXQgc3Rhck5hbWVzIDogYW55W10gPSBbXTtcblxuXHRcdGxldCBvcHRpb25zdG9EaXNwbGF5ID0gdGhpcy5nZXRJY29uc1RvRGlzcGxheSgpO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyhcIkdldEh0bWxSZXByZXNlbnRhdGlvbiBcIiArIHRoaXMuZGlzdGFuY2UgKyBcIiBrbVwiLCB0aGlzLmdldE9wdGlvblRyZWUoKS5jaGlsZHJlblswXSk7XG5cblx0XHRsZXQgaHRtbCA9IFR3aWcucmVuZGVyKGJpb3Blbl90d2lnSnNfZWxlbWVudEluZm8sIFxuXHRcdHtcblx0XHRcdGVsZW1lbnQgOiB0aGlzLCBcblx0XHRcdHNob3dEaXN0YW5jZTogQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkgPyB0cnVlIDogZmFsc2UsXG5cdFx0XHRsaXN0aW5nTW9kZTogQXBwLm1vZGUgPT0gQXBwTW9kZXMuTGlzdCwgXG5cdFx0XHRvcHRpb25zVG9EaXNwbGF5OiBvcHRpb25zdG9EaXNwbGF5LFxuXHRcdFx0YWxsT3B0aW9uc1ZhbHVlczogdGhpcy5nZXRDdXJyT3B0aW9uc1ZhbHVlcygpLmZpbHRlciggKG9WKSA9PiBvVi5vcHRpb24uZGlzcGxheU9wdGlvbikuc29ydCggKGEsYikgPT4gYS5pc0ZpbGxlZEJ5RmlsdGVycyA/IC0xIDogMSksXG5cdFx0XHRtYWluT3B0aW9uVmFsdWVUb0Rpc3BsYXk6IG9wdGlvbnN0b0Rpc3BsYXlbMF0sIFxuXHRcdFx0b3RoZXJPcHRpb25zVmFsdWVzVG9EaXNwbGF5OiBvcHRpb25zdG9EaXNwbGF5LnNsaWNlKDEpLCAgXG5cdFx0XHRzdGFyTmFtZXMgOiBzdGFyTmFtZXMsXG5cdFx0XHRtYWluQ2F0ZWdvcnlWYWx1ZSA6IHRoaXMuZ2V0T3B0aW9uVHJlZSgpLmNoaWxkcmVuWzBdLFxuXHRcdFx0cGVuZGluZ0NsYXNzIDogdGhpcy5pc1BlbmRpbmcoKSA/ICdwZW5kaW5nJyA6ICcnXG5cdFx0fSk7XG5cblx0XHRcblx0XHR0aGlzLmh0bWxSZXByZXNlbnRhdGlvbl8gPSBodG1sO1x0XHRcdFx0XG5cdFx0cmV0dXJuIGh0bWw7XG5cdH07XG5cblx0Z2V0Rm9ybWF0ZWRPcGVuSG91cnMoKSBcblx0e1x0XHRcblx0XHRpZiAodGhpcy5mb3JtYXRlZE9wZW5Ib3Vyc18gPT09IG51bGwgKVxuXHRcdHtcdFx0XG5cdFx0XHR0aGlzLmZvcm1hdGVkT3BlbkhvdXJzXyA9IHt9O1xuXHRcdFx0bGV0IG5ld19rZXksIG5ld19rZXlfdHJhbnNsYXRlZCwgbmV3RGFpbHlTbG90O1xuXHRcdFx0Zm9yKGxldCBrZXkgaW4gdGhpcy5vcGVuSG91cnMpXG5cdFx0XHR7XG5cdFx0XHRcdG5ld19rZXkgPSBrZXkuc3BsaXQoJ18nKVsxXTtcblx0XHRcdFx0bmV3X2tleV90cmFuc2xhdGVkID0gdGhpcy50cmFuc2xhdGVEYXlLZXkobmV3X2tleSk7XHRcdFx0XHRcblx0XHRcdFx0bmV3RGFpbHlTbG90ID0gdGhpcy5mb3JtYXRlRGFpbHlUaW1lU2xvdCh0aGlzLm9wZW5Ib3Vyc1trZXldKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChuZXdEYWlseVNsb3QpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmZvcm1hdGVkT3BlbkhvdXJzX1tuZXdfa2V5X3RyYW5zbGF0ZWRdID0gbmV3RGFpbHlTbG90O1xuXHRcdFx0XHRcdHRoaXMub3BlbkhvdXJzRGF5cy5wdXNoKG5ld19rZXlfdHJhbnNsYXRlZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZm9ybWF0ZWRPcGVuSG91cnNfO1xuXHR9O1xuXG5cdHByaXZhdGUgdHJhbnNsYXRlRGF5S2V5KGRheUtleSlcblx0e1xuXHRcdHN3aXRjaChkYXlLZXkpXG5cdFx0e1xuXHRcdFx0Y2FzZSAnbW9uZGF5JzogcmV0dXJuICdsdW5kaSc7XG5cdFx0XHRjYXNlICd0dWVzZGF5JzogcmV0dXJuICdtYXJkaSc7XG5cdFx0XHRjYXNlICd3ZWRuZXNkYXknOiByZXR1cm4gJ21lcmNyZWRpJztcblx0XHRcdGNhc2UgJ3RodXJzZGF5JzogcmV0dXJuICdqZXVkaSc7XG5cdFx0XHRjYXNlICdmcmlkYXknOiByZXR1cm4gJ3ZlbmRyZWRpJztcblx0XHRcdGNhc2UgJ3NhdHVyZGF5JzogcmV0dXJuICdzYW1lZGknO1xuXHRcdFx0Y2FzZSAnc3VuZGF5JzogcmV0dXJuICdkaW1hbmNoZSc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cblx0cHJpdmF0ZSBmb3JtYXRlRGFpbHlUaW1lU2xvdChkYWlseVNsb3QpIFxuXHR7XHRcdFxuXHRcdGlmIChkYWlseVNsb3QgPT09IG51bGwpXG5cdFx0e1x0XHRcblx0XHRcdHJldHVybiAnZmVybcOpJztcblx0XHR9XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGlmIChkYWlseVNsb3Quc2xvdDFzdGFydClcblx0XHR7XG5cdFx0XHRyZXN1bHQrPSB0aGlzLmZvcm1hdGVEYXRlKGRhaWx5U2xvdC5zbG90MXN0YXJ0KTtcblx0XHRcdHJlc3VsdCs9ICcgLSAnO1xuXHRcdFx0cmVzdWx0Kz0gdGhpcy5mb3JtYXRlRGF0ZShkYWlseVNsb3Quc2xvdDFlbmQpO1xuXHRcdH1cblx0XHRpZiAoZGFpbHlTbG90LnNsb3Qyc3RhcnQpXG5cdFx0e1xuXHRcdFx0cmVzdWx0Kz0gJyBldCAnO1xuXHRcdFx0cmVzdWx0Kz0gdGhpcy5mb3JtYXRlRGF0ZShkYWlseVNsb3Quc2xvdDJzdGFydCk7XG5cdFx0XHRyZXN1bHQrPSAnIC0gJztcblx0XHRcdHJlc3VsdCs9IHRoaXMuZm9ybWF0ZURhdGUoZGFpbHlTbG90LnNsb3QyZW5kKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRmb3JtYXRlRGF0ZShkYXRlKSBcblx0e1x0XHRcblx0XHRpZiAoIWRhdGUpIHJldHVybjtcblx0XHRyZXR1cm4gZGF0ZS5zcGxpdCgnVCcpWzFdLnNwbGl0KCc6MDArMDEwMCcpWzBdO1xuXHR9O1xuXG5cdGlzQ3VycmVudFN0YXJDaG9pY2VSZXByZXNlbnRhbnQoKSBcblx0e1x0XHRcblx0XHRpZiAoIHRoaXMuc3RhckNob2ljZUZvclJlcHJlc2VudGF0aW9uICE9PSAnJylcblx0XHR7XG5cdFx0XHRsZXQgZWxlbWVudFN0YXJJZCA9IEFwcC5jb25zdGVsbGF0aW9uLmdldFN0YXJGcm9tTmFtZSh0aGlzLnN0YXJDaG9pY2VGb3JSZXByZXNlbnRhdGlvbikuZ2V0RWxlbWVudElkKCk7XG5cdFx0XHRyZXR1cm4gKHRoaXMuaWQgPT0gZWxlbWVudFN0YXJJZCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcdFxuXHR9O1xuXG5cblxuXG5cblxuXG5cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyAgICAgICAgICAgIFNFVFRFUlMgR0VUVEVSU1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Z2V0IG1hcmtlcigpICA6IEJpb3Blbk1hcmtlclxuXHR7XHRcdFxuXHRcdC8vIGluaXRpYWxpemUgPSBpbml0aWFsaXplIHx8IGZhbHNlO1xuXHRcdC8vIGlmIChpbml0aWFsaXplKSB0aGlzLmluaXRpYWxpemUoKTtcblx0XHRyZXR1cm4gdGhpcy5iaW9wZW5NYXJrZXJfO1xuXHR9O1xuXG5cdGdldCBpc1Zpc2libGUoKSBcblx0e1x0XHRcblx0XHRyZXR1cm4gdGhpcy5pc1Zpc2libGVfO1xuXHR9O1xuXG5cdGdldCBpc0luaXRpYWxpemVkKCkgXG5cdHtcdFx0XG5cdFx0cmV0dXJuIHRoaXMuaXNJbml0aWFsaXplZF87XG5cdH07XG5cbn1cblxuIiwiaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3J5LCBPcHRpb24sIENhdGVnb3J5VmFsdWV9IGZyb20gXCIuL2NsYXNzZXNcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uVmFsdWVcbntcblx0b3B0aW9uSWQgOiBudW1iZXI7XG5cdGluZGV4IDogbnVtYmVyO1xuXHRkZXNjcmlwdGlvbiA6IHN0cmluZztcblx0b3B0aW9uXyA6IE9wdGlvbiA9IG51bGw7XG5cdGlzRmlsbGVkQnlGaWx0ZXJzIDogYm9vbGVhbiA9IHRydWU7XG5cblx0Y2hpbGRyZW4gOiBDYXRlZ29yeVZhbHVlW10gPSBbXTtcblx0Y29sb3JPcHRpb25JZCA6IG51bWJlciA9IG51bGw7XG5cblx0Y29uc3RydWN0b3IoICRvcHRpb25WYWx1ZUpzb24gKVxuXHR7XG5cdFx0dGhpcy5vcHRpb25JZCA9ICRvcHRpb25WYWx1ZUpzb25bMF07XG5cdFx0dGhpcy5pbmRleCA9ICRvcHRpb25WYWx1ZUpzb25bMV07XG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9ICRvcHRpb25WYWx1ZUpzb24ubGVuZ3RoID09IDMgPyAgJG9wdGlvblZhbHVlSnNvblsyXSA6ICcnO1xuXHR9XG5cblx0Z2V0IG9wdGlvbigpIDogT3B0aW9uXG5cdHtcblx0XHRpZiAodGhpcy5vcHRpb25fKSByZXR1cm4gdGhpcy5vcHRpb25fO1xuXHRcdHJldHVybiB0aGlzLm9wdGlvbl8gPSBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0T3B0aW9uQnlJZCh0aGlzLm9wdGlvbklkKTtcblx0fVxuXG5cdHNldFJlY3Vyc2l2ZWx5RmlsbGVkQnlGaWx0ZXJzKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5pc0ZpbGxlZEJ5RmlsdGVycyA9IGJvb2w7XG5cdFx0Zm9yKGxldCBjYXRlZ29yeVZhbHVlIG9mIHRoaXMuY2hpbGRyZW4pXG5cdFx0e1xuXHRcdFx0Zm9yIChsZXQgc3Vib3B0aW9uVmFsdWUgb2YgY2F0ZWdvcnlWYWx1ZS5jaGlsZHJlbilcblx0XHRcdHtcblx0XHRcdFx0c3Vib3B0aW9uVmFsdWUuc2V0UmVjdXJzaXZlbHlGaWxsZWRCeUZpbHRlcnMoYm9vbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Z2V0IGNhdGVnb3J5T3duZXIoKSA6IENhdGVnb3J5XG5cdHtcblx0XHRyZXR1cm4gPENhdGVnb3J5PiB0aGlzLm9wdGlvbi5nZXRPd25lcigpO1xuXHR9XG5cblx0YWRkQ2F0ZWdvcnlWYWx1ZShjYXRlZ29yeVZhbHVlIDogQ2F0ZWdvcnlWYWx1ZSlcblx0e1xuXHRcdHRoaXMuY2hpbGRyZW4ucHVzaChjYXRlZ29yeVZhbHVlKTtcblx0fVxufVxuXG4iLCJpbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vY2xhc3Nlcy9jYXRlZ29yeS5jbGFzc1wiO1xuaW1wb3J0IHsgQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSwgQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUgfSBmcm9tIFwiLi9jYXRlZ29yeS1vcHRpb24tdHJlZS1ub2RlLmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgbGV0ICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBPcHRpb24gZXh0ZW5kcyBDYXRlZ29yeU9wdGlvblRyZWVOb2RlXG57IFxuXHRpZCA6IG51bWJlcjtcblx0bmFtZSA6IHN0cmluZztcblx0bmFtZVNob3J0OiBzdHJpbmc7XG5cdGluZGV4IDogbnVtYmVyO1xuXHRjb2xvciA6IHN0cmluZztcblx0aWNvbiA6IHN0cmluZztcblx0dXNlSWNvbkZvck1hcmtlcjogYm9vbGVhbjtcblx0dXNlQ29sb3JGb3JNYXJrZXIgOiBib29sZWFuO1xuXHRzaG93T3BlbkhvdXJzIDogYm9vbGVhbjtcblx0ZGVwdGggOiBudW1iZXI7XG5cdGRpc3BsYXlPcHRpb24gOiBudW1iZXI7XG5cdFxuXHRwcml2YXRlIG15T3duZXJDb2xvcklkIDogbnVtYmVyID0gbnVsbDtcblxuXG5cdGNvbnN0cnVjdG9yKCRvcHRpb25Kc29uIDogYW55KVxuXHR7XG5cdFx0c3VwZXIoQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUuT3B0aW9uLCAnI29wdGlvbi0nLCAnI29wdGlvbi1jaGVja2JveC0nLCAnLnN1YmNhdGVnb3JpZXMtd3JhcHBlcicpO1xuXG5cdFx0dGhpcy5pZCA9ICRvcHRpb25Kc29uLmlkO1xuXHRcdHRoaXMubmFtZSA9ICRvcHRpb25Kc29uLm5hbWU7XG5cdFx0dGhpcy5pbmRleCA9ICRvcHRpb25Kc29uLmluZGV4O1xuXHRcdHRoaXMubmFtZVNob3J0ID0gJG9wdGlvbkpzb24ubmFtZV9zaG9ydDtcblx0XHR0aGlzLmNvbG9yID0gJG9wdGlvbkpzb24uY29sb3I7XG5cdFx0dGhpcy5pY29uID0gJG9wdGlvbkpzb24uaWNvbjtcblx0XHR0aGlzLnVzZUljb25Gb3JNYXJrZXIgPSAkb3B0aW9uSnNvbi51c2VfaWNvbl9mb3JfbWFya2VyO1xuXHRcdHRoaXMudXNlQ29sb3JGb3JNYXJrZXIgPSAkb3B0aW9uSnNvbi51c2VfY29sb3JfZm9yX21hcmtlcjtcblx0XHR0aGlzLnNob3dPcGVuSG91cnMgPSAkb3B0aW9uSnNvbi5zaG93X29wZW5faG91cnM7XG5cdFx0dGhpcy5kaXNwbGF5T3B0aW9uID0gJG9wdGlvbkpzb24uZGlzcGxheV9vcHRpb247XG5cdH1cblxuXHRhZGRDYXRlZ29yeSgkY2F0ZWdvcnkgOiBDYXRlZ29yeSkgeyB0aGlzLmNoaWxkcmVuLnB1c2goJGNhdGVnb3J5KTsgIH1cblxuXHRpc01haW5PcHRpb24oKSB7IHJldHVybiB0aGlzLmdldE93bmVyKCkgPyAoPENhdGVnb3J5PnRoaXMuZ2V0T3duZXIoKSkuZGVwdGggPT0gMCA6IGZhbHNlOyB9XG5cblx0aXNDb2xsYXBzaWJsZSgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldERvbSgpLmhhc0NsYXNzKCdvcHRpb24tY29sbGFwc2libGUnKTsgfVxuXG5cdGdldCBzdWJjYXRlZ29yaWVzKCkgOiBDYXRlZ29yeVtdIHsgcmV0dXJuIDxDYXRlZ29yeVtdPiB0aGlzLmNoaWxkcmVuOyB9XG5cblx0Z2V0IGFsbENoaWxkcmVuT3B0aW9ucygpIDogT3B0aW9uW11cblx0e1xuXHRcdHJldHVybiB0aGlzLnJlY3Vyc2l2ZWx5R2V0Q2hpbGRyZW5PcHRpb24odGhpcyk7XG5cdH1cblxuXHRwcml2YXRlIHJlY3Vyc2l2ZWx5R2V0Q2hpbGRyZW5PcHRpb24ocGFyZW50T3B0aW9uIDogT3B0aW9uKSA6IE9wdGlvbltdXG5cdHtcblx0XHRsZXQgcmVzdWx0T3B0aW9ucyA6IE9wdGlvbltdID0gW107XG5cdFx0Zm9yKGxldCBjYXQgb2YgcGFyZW50T3B0aW9uLnN1YmNhdGVnb3JpZXMpXG5cdFx0e1xuXHRcdFx0cmVzdWx0T3B0aW9ucyA9IHJlc3VsdE9wdGlvbnMuY29uY2F0KGNhdC5vcHRpb25zKTtcblx0XHRcdGZvcihsZXQgb3B0aW9uIG9mIGNhdC5vcHRpb25zKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXN1bHRPcHRpb25zID0gcmVzdWx0T3B0aW9ucy5jb25jYXQodGhpcy5yZWN1cnNpdmVseUdldENoaWxkcmVuT3B0aW9uKG9wdGlvbikpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0T3B0aW9ucztcblx0fVxufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5kZWNsYXJlIGxldCAkLCBqUXVlcnkgOiBhbnk7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBDYXRlZ29yeSwgT3B0aW9uIH0gZnJvbSBcIi4uL21vZHVsZXMvY2F0ZWdvcmllcy5tb2R1bGVcIjtcbmltcG9ydCB7IGhpZGVEaXJlY3RvcnlNZW51IH0gZnJvbSBcIi4uL2FwcC1pbnRlcmFjdGlvbnNcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuZXhwb3J0IGNsYXNzIERpcmVjdG9yeU1lbnVDb21wb25lbnRcbntcdFxuXHRjdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkID0gbnVsbDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLmluaXRpYWxpemUoKTtcblx0fVxuXG5cdGluaXRpYWxpemUoKVxuXHR7XHRcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tIFNFQVJDSCBCQVIgLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQkKCcjc2VhcmNoLWJhcicpLm9uKFwic2VhcmNoXCIsIGZ1bmN0aW9uKGV2ZW50LCBhZGRyZXNzKVxuXHRcdHtcblx0XHRcdC8vIGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIHJlZGlyZWN0VG9EaXJlY3RvcnkoJ2Jpb3Blbl9jb25zdGVsbGF0aW9uJywgYWRkcmVzcywgJCgnI3NlYXJjaC1kaXN0YW5jZS1pbnB1dCcpLnZhbCgpKTtcblx0XHRcdC8vIGVsc2UgXG5cdFx0XHRBcHAuZ2VvY29kZXIuZ2VvY29kZUFkZHJlc3MoXG5cdFx0XHRcdGFkZHJlc3MsIFxuXHRcdFx0XHRmdW5jdGlvbihyZXN1bHRzKSBcblx0XHRcdFx0eyBcblx0XHRcdFx0XHQvL0FwcC5oYW5kbGVHZW9jb2RpbmcocmVzdWx0cyk7XG5cdFx0XHRcdFx0JCgnI3NlYXJjaC1iYXInKS52YWwocmVzdWx0c1swXS5nZXRGb3JtYXR0ZWRBZGRyZXNzKCkpOyBcblx0XHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0cykgeyAkKCcjc2VhcmNoLWJhcicpLmFkZENsYXNzKCdpbnZhbGlkJyk7IH0gXG5cdFx0XHQpO1xuXG5cdFx0XHQvLyBJZiBNZW51IHRha2UgYWxsIGF2YWlsYWJsZSB3aWR0aCAoaW4gY2FzZSBvZiBzbWFsbCBtb2JpbGUpXG5cdFx0XHRpZiAoJCgnI2RpcmVjdG9yeS1tZW51Jykub3V0ZXJXaWR0aCgpID09ICQod2luZG93KS5vdXRlcldpZHRoKCkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIHRoZW4gd2UgaGlkZSBtZW51IHRvIHNob3cgc2VhcmNoIHJlc3VsdFxuXHRcdFx0XHRoaWRlRGlyZWN0b3J5TWVudSgpO1xuXHRcdFx0fVxuXHRcdH0pO1x0XG5cblx0XHQvLyBhZmZpY2hlIHVuZSBwZXRpdGUgb21icmUgc291cyBsZSB0aXRyZSBtZW51IHF1YW5kIG9uIHNjcm9sbFxuXHRcdC8vICh1bmlxdWVtZW50IHZpc2libGUgc3VyIHBldHRzIMOpY3JhbnMpXG5cdFx0Ly8gJChcIiNkaXJlY3RvcnktbWVudS1tYWluLWNvbnRhaW5lclwiKS5zY3JvbGwoZnVuY3Rpb24oKSBcblx0XHQvLyB7XG5cdFx0Ly8gICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IDApIHtcblx0XHQvLyAgICAgJCgnI21lbnUtdGl0bGUgLnNoYWRvdy1ib3R0b20nKS5zaG93KCk7XG5cdFx0Ly8gICB9IGVsc2Uge1xuXHRcdC8vICAgICAkKCcjbWVudS10aXRsZSAuc2hhZG93LWJvdHRvbScpLmhpZGUoKTtcblx0XHQvLyAgIH1cblx0XHQvLyB9KTtcblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0gRkFWT1JJVEUtLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdCQoJyNmaWx0ZXItZmF2b3JpdGUnKS5jbGljayhmdW5jdGlvbihlIDogRXZlbnQpXG5cdFx0e1xuXHRcdFx0XG5cdFx0XHRsZXQgZmF2b3JpdGVDaGVja2JveCA9ICQoJyNmYXZvcml0ZS1jaGVja2JveCcpO1xuXG5cdFx0XHRsZXQgY2hlY2tWYWx1ZSA9ICFmYXZvcml0ZUNoZWNrYm94LmlzKCc6Y2hlY2tlZCcpO1xuXG5cdFx0XHRBcHAuZmlsdGVyTW9kdWxlLnNob3dPbmx5RmF2b3JpdGUoY2hlY2tWYWx1ZSk7XG5cdFx0XHRBcHAuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c1RvRGlzcGxheSghY2hlY2tWYWx1ZSk7XG5cblx0XHRcdGZhdm9yaXRlQ2hlY2tib3gucHJvcCgnY2hlY2tlZCcsY2hlY2tWYWx1ZSk7XG5cblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXG5cdFx0JCgnI2ZpbHRlci1mYXZvcml0ZScpLnRvb2x0aXAoKTtcblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0gUEVORElORy0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0JCgnI2ZpbHRlci1wZW5kaW5nJykuY2xpY2soZnVuY3Rpb24oZSA6IEV2ZW50KVxuXHRcdHtcblx0XHRcdFxuXHRcdFx0bGV0IHBlbmRpbmdDaGVja2JveCA9ICQoJyNwZW5kaW5nLWNoZWNrYm94Jyk7XG5cblx0XHRcdGxldCBjaGVja1ZhbHVlID0gIXBlbmRpbmdDaGVja2JveC5pcygnOmNoZWNrZWQnKTtcblxuXHRcdFx0QXBwLmZpbHRlck1vZHVsZS5zaG93UGVuZGluZyhjaGVja1ZhbHVlKTtcblx0XHRcdEFwcC5lbGVtZW50TW9kdWxlLnVwZGF0ZUVsZW1lbnRzVG9EaXNwbGF5KGNoZWNrVmFsdWUpO1xuXG5cdFx0XHRwZW5kaW5nQ2hlY2tib3gucHJvcCgnY2hlY2tlZCcsY2hlY2tWYWx1ZSk7XG5cblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXG5cdFx0JCgnI2ZpbHRlci1wZW5kaW5nJykudG9vbHRpcCgpO1xuXG5cblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0gTUFJTiBPUFRJT05TIC0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdHZhciB0aGF0ID0gdGhpcztcblxuXHRcdCQoJy5tYWluLWNhdGVnb3JpZXMgLm1haW4taWNvbicpLmNsaWNrKCBmdW5jdGlvbihlKVxuXHRcdHtcblx0XHRcdGxldCBvcHRpb25JZCA9ICQodGhpcykuYXR0cignZGF0YS1vcHRpb24taWQnKTtcblx0XHRcdHRoYXQuc2V0TWFpbk9wdGlvbihvcHRpb25JZCk7XG5cdFx0fSk7XG5cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tIENBVEVHT1JJRVMgLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQkKCcuc3ViY2F0ZWdvcnktaXRlbSAubmFtZS13cmFwcGVyJykuY2xpY2soZnVuY3Rpb24oKVxuXHRcdHtcdFx0XG5cdFx0XHRsZXQgY2F0ZWdvcnlJZCA9ICQodGhpcykuYXR0cignZGF0YS1jYXRlZ29yeS1pZCcpO1xuXHRcdFx0QXBwLmNhdGVnb3J5TW9kdWxlLmdldENhdGVnb3J5QnlJZChjYXRlZ29yeUlkKS50b2dnbGVDaGlsZHJlbkRldGFpbCgpO1xuXHRcdH0pO1x0XG5cblx0XHQkKCcuc3ViY2F0ZWdvcnktaXRlbSAuY2hlY2tib3gtd3JhcHBlcicpLmNsaWNrKGZ1bmN0aW9uKGUpXG5cdFx0e1x0XHRcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRsZXQgY2F0ZWdvcnlJZCA9ICQodGhpcykuYXR0cignZGF0YS1jYXRlZ29yeS1pZCcpO1xuXHRcdFx0QXBwLmNhdGVnb3J5TW9kdWxlLmdldENhdGVnb3J5QnlJZChjYXRlZ29yeUlkKS50b2dnbGUoKTtcblx0XHRcdFxuXHRcdH0pO1x0XHRcdFxuXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLSBTVUIgT1BUSU9OUyAtLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0JCgnLnN1YmNhdGVnb3JpZS1vcHRpb24taXRlbTpub3QoI2ZpbHRlci1mYXZvcml0ZSk6bm90KCNmaWx0ZXItcGVuZGluZykgLmljb24tbmFtZS13cmFwcGVyJykuY2xpY2soZnVuY3Rpb24oZSA6IEV2ZW50KVxuXHRcdHtcblx0XHRcdGxldCBvcHRpb25JZCA9ICQodGhpcykuYXR0cignZGF0YS1vcHRpb24taWQnKTtcblx0XHRcdGxldCBvcHRpb24gPSBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0T3B0aW9uQnlJZChvcHRpb25JZCk7XG5cblx0XHRcdG9wdGlvbi5pc0NvbGxhcHNpYmxlKCkgPyBvcHRpb24udG9nZ2xlQ2hpbGRyZW5EZXRhaWwoKSA6IG9wdGlvbi50b2dnbGUoKTtcblx0XHR9KTtcblxuXHRcdCQoJy5zdWJjYXRlZ29yaWUtb3B0aW9uLWl0ZW06bm90KCNmaWx0ZXItZmF2b3JpdGUpOm5vdCgjZmlsdGVyLXBlbmRpbmcpIC5jaGVja2JveC13cmFwcGVyJykuY2xpY2soZnVuY3Rpb24oZSlcblx0XHR7XHRcdFxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGxldCBvcHRpb25JZCA9ICQodGhpcykuYXR0cignZGF0YS1vcHRpb24taWQnKTtcblx0XHRcdEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRPcHRpb25CeUlkKG9wdGlvbklkKS50b2dnbGUoKTtcblx0XHR9KTtcblxuXHR9XG5cblx0c2V0TWFpbk9wdGlvbihvcHRpb25JZClcblx0e1xuXHRcdGlmICh0aGlzLmN1cnJlbnRBY3RpdmVNYWluT3B0aW9uSWQgPT0gb3B0aW9uSWQpIHJldHVybjtcblxuXHRcdGlmICh0aGlzLmN1cnJlbnRBY3RpdmVNYWluT3B0aW9uSWQgIT0gbnVsbCkgQXBwLmVsZW1lbnRNb2R1bGUuY2xlYXJDdXJyZW50c0VsZW1lbnQoKTtcblxuXHRcdGxldCBvbGRJZCA9IHRoaXMuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZDtcblx0XHR0aGlzLmN1cnJlbnRBY3RpdmVNYWluT3B0aW9uSWQgPSBvcHRpb25JZDtcblxuXHRcdGlmIChvcHRpb25JZCA9PSAnYWxsJylcblx0XHR7XG5cdFx0XHQkKCcjbWVudS1zdWJjYXRlZ29yaWVzLXRpdGxlJykudGV4dChcIlRvdXMgbGVzIGFjdGV1cnNcIik7XG5cdFx0XHQkKCcjb3Blbi1ob3Vycy1maWx0ZXInKS5oaWRlKCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgbWFpbk9wdGlvbiA9IEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9uQnlJZChvcHRpb25JZCk7XHRcdFx0XHRcblxuXHRcdFx0JCgnI21lbnUtc3ViY2F0ZWdvcmllcy10aXRsZScpLnRleHQobWFpbk9wdGlvbi5uYW1lKTtcblx0XHRcdGlmIChtYWluT3B0aW9uLnNob3dPcGVuSG91cnMpICQoJyNvcGVuLWhvdXJzLWZpbHRlcicpLnNob3coKTtcblx0XHRcdGVsc2UgJCgnI29wZW4taG91cnMtZmlsdGVyJykuaGlkZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlTWFpbk9wdGlvbkJhY2tncm91bmQoKTtcblxuXHRcdC8vY29uc29sZS5sb2coXCJzZXRNYWluT3B0aW9uSWQgXCIgKyBvcHRpb25JZCArIFwiIC8gb2xkT3B0aW9uIDogXCIgKyBvbGRJZCk7XG5cdFx0aWYgKG9sZElkICE9IG51bGwpIEFwcC5oaXN0b3J5TW9kdWxlLnVwZGF0ZUN1cnJTdGF0ZSgpO1xuXG5cdFx0QXBwLmVsZW1lbnRMaXN0Q29tcG9uZW50LnJlSW5pdGlhbGl6ZUVsZW1lbnRUb0Rpc3BsYXlMZW5ndGgoKTtcblx0XHRcblx0XHRBcHAuYm91bmRzTW9kdWxlLnVwZGF0ZUZpbGxlZEJvdW5kc0FjY29yZGluZ1RvTmV3TWFpbk9wdGlvbklkKCk7XG5cdFx0QXBwLmNoZWNrRm9yTmV3RWxlbWVudHNUb1JldHJpZXZlKCk7XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSx0cnVlLHRydWUpO1xuXHR9XG5cblx0dXBkYXRlTWFpbk9wdGlvbkJhY2tncm91bmQoKVxuXHR7XG5cdFx0bGV0IG9wdGlvbklkID0gdGhpcy5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkO1xuXG5cdFx0aWYoISQoJyNkaXJlY3RvcnktbWVudScpLmlzKCc6dmlzaWJsZScpKSB7IGNvbnNvbGUubG9nKFwiZGlyZWN0b3J5IG5vdCB2aXNpYmxlXCIpO3JldHVybjsgfVxuXG5cdFx0JCgnI2FjdGl2ZS1tYWluLW9wdGlvbi1iYWNrZ3JvdW5kJykuYW5pbWF0ZSh7dG9wOiAkKCcjbWFpbi1vcHRpb24taWNvbi0nICsgb3B0aW9uSWQpLnBvc2l0aW9uKCkudG9wfSwgNTAwLCAnZWFzZU91dFF1YXJ0Jyk7XG5cblx0XHQkKCcubWFpbi1vcHRpb24tc3ViY2F0ZWdvcmllcy1jb250YWluZXInKS5oaWRlKCk7XG5cdFx0JCgnI21haW4tb3B0aW9uLScgKyBvcHRpb25JZCkuZmFkZUluKDYwMCk7XG5cblx0XHQkKCcubWFpbi1jYXRlZ29yaWVzIC5tYWluLWljb24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JCgnI21haW4tb3B0aW9uLWljb24tJyArIG9wdGlvbklkKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdH1cbn1cblxuXG5cblxuXG5cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5pbXBvcnQgeyBFbGVtZW50c0NoYW5nZWQgfSBmcm9tIFwiLi4vbW9kdWxlcy9lbGVtZW50cy5tb2R1bGVcIjtcbmltcG9ydCB7IHNsdWdpZnksIGNhcGl0YWxpemUsIHVuc2x1Z2lmeSB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcblxuaW1wb3J0IHsgY3JlYXRlTGlzdGVuZXJzRm9yRWxlbWVudE1lbnUsIHVwZGF0ZUZhdm9yaXRlSWNvbiB9IGZyb20gXCIuL2VsZW1lbnQtbWVudS5jb21wb25lbnRcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5pbXBvcnQgeyBFdmVudCwgSUV2ZW50IH0gZnJvbSBcIi4uL3V0aWxzL2V2ZW50XCI7XG5cbmltcG9ydCB7IGNyZWF0ZUxpc3RlbmVyc0ZvclZvdGluZyB9IGZyb20gXCIuLi9jb21wb25lbnRzL3ZvdGUuY29tcG9uZW50XCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50TGlzdENvbXBvbmVudFxue1xuXHQvL29uU2hvdyA9IG5ldyBFdmVudDxudW1iZXI+KCk7XG5cblx0Ly8gTnVtYmVyIG9mIGVsZW1lbnQgaW4gb25lIGxpc3Rcblx0RUxFTUVOVF9MSVNUX1NJWkVfU1RFUCA6IG51bWJlciA9IDE1O1xuXHQvLyBCYXNpY2x5IHdlIGRpc3BsYXkgMSBFTEVNRU5UX0xJU1RfU0laRV9TVEVQLCBidXQgaWYgdXNlciBuZWVkXG5cdC8vIGZvciwgd2UgZGlzcGxheSBhbiBvdGhlcnMgRUxFTUVOVF9MSVNUX1NJWkVfU1RFUCBtb3JlXG5cdHN0ZXBzQ291bnQgOiBudW1iZXIgPSAxO1xuXHRpc0xpc3RGdWxsIDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8vIGxhc3QgcmVxdWVzdCB3YXMgc2VuZCB3aXRoIHRoaXMgZGlzdGFuY2Vcblx0bGFzdERpc3RhbmNlUmVxdWVzdCA9IDEwO1xuXG5cdGlzSW5pdGlhbGl6ZWQgOiBib29sZWFuID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0Ly8gZGV0ZWN0IHdoZW4gdXNlciByZWFjaCBib3R0b20gb2YgbGlzdFxuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCB1bCcpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZigkKHRoaXMpLnNjcm9sbFRvcCgpICsgJCh0aGlzKS5pbm5lckhlaWdodCgpID49ICQodGhpcylbMF0uc2Nyb2xsSGVpZ2h0KSB7ICAgICAgICAgICAgXG5cdFx0ICAgIFx0dGhhdC5oYW5kbGVCb3R0b20oKTtcblx0XHQgIH1cblx0XHR9KTtcblx0fVxuXG5cdHVwZGF0ZSgkZWxlbWVudHNSZXN1bHQgOiBFbGVtZW50c0NoYW5nZWQpIFxuXHR7XG5cdFx0aWYgKCRlbGVtZW50c1Jlc3VsdC5lbGVtZW50c1RvRGlzcGxheS5sZW5ndGggPT0gMCkgdGhpcy5zdGVwc0NvdW50ID0gMTtcblxuXHRcdHRoaXMuY2xlYXIoKTtcdFx0XG5cblx0XHR0aGlzLmRyYXcoJGVsZW1lbnRzUmVzdWx0LmVsZW1lbnRzVG9EaXNwbGF5LCBmYWxzZSk7XG5cdFx0XG5cdFx0bGV0IGFkZHJlc3MgPSBBcHAuZ2VvY29kZXIubGFzdEFkZHJlc3NSZXF1ZXN0O1xuXHRcdGlmIChhZGRyZXNzKVxuXHRcdFx0dGhpcy5zZXRUaXRsZSgnIGF1dG91ciBkZSA8aT4nICsgY2FwaXRhbGl6ZSh1bnNsdWdpZnkoYWRkcmVzcykpKSArICc8L2k+Jztcblx0XHRlbHNlXG5cdFx0XHR0aGlzLnNldFRpdGxlKCcgYXV0b3VyIGR1IGNlbnRyZSBkZSBsYSBjYXJ0ZScpO1xuXHR9XG5cblx0c2V0VGl0bGUoJHZhbHVlIDogc3RyaW5nKVxuXHR7XG5cdFx0JCgnLmVsZW1lbnQtbGlzdC10aXRsZS10ZXh0JykuaHRtbCgkdmFsdWUpO1xuXHR9XG5cblx0Y2xlYXIoKVxuXHR7XG5cdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgbGknKS5yZW1vdmUoKTtcblx0fVxuXG5cdGN1cnJFbGVtZW50c0Rpc3BsYXllZCgpIDogbnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gJCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgbGknKS5sZW5ndGg7XG5cdH1cblxuXHRyZUluaXRpYWxpemVFbGVtZW50VG9EaXNwbGF5TGVuZ3RoKClcblx0e1xuXHRcdHRoaXMuY2xlYXIoKTtcblx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCB1bCcpLmFuaW1hdGUoe3Njcm9sbFRvcDogJzAnfSwgMCk7XG5cdFx0dGhpcy5zdGVwc0NvdW50ID0gMTtcblx0fVxuXG5cdHByaXZhdGUgZHJhdygkZWxlbWVudExpc3QgOiBFbGVtZW50W10sICRhbmltYXRlID0gZmFsc2UpIFxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZygnRWxlbWVudExpc3QgZHJhdycsICRlbGVtZW50TGlzdC5sZW5ndGgpO1xuXG5cdFx0bGV0IGVsZW1lbnQgOiBFbGVtZW50O1xuXHRcdGxldCBlbGVtZW50c1RvRGlzcGxheSA6IEVsZW1lbnRbXSA9ICRlbGVtZW50TGlzdDsgXG5cblx0XHRmb3IoZWxlbWVudCBvZiBlbGVtZW50c1RvRGlzcGxheSlcblx0XHR7XG5cdFx0XHRlbGVtZW50LnVwZGF0ZURpc3RhbmNlKCk7XG5cdFx0fVxuXHRcdGVsZW1lbnRzVG9EaXNwbGF5LnNvcnQodGhpcy5jb21wYXJlRGlzdGFuY2UpO1xuXG5cdFx0bGV0IG1heEVsZW1lbnRzVG9EaXNwbGF5ID0gdGhpcy5FTEVNRU5UX0xJU1RfU0laRV9TVEVQICogdGhpcy5zdGVwc0NvdW50O1xuXHRcdGxldCBlbmRJbmRleCA9IE1hdGgubWluKG1heEVsZW1lbnRzVG9EaXNwbGF5LCBlbGVtZW50c1RvRGlzcGxheS5sZW5ndGgpOyAgXG5cdFx0XG5cdFx0Ly8gaWYgdGhlIGxpc3QgaXMgbm90IGZ1bGwsIHdlIHNlbmQgYWpheCByZXF1ZXN0XG5cdFx0aWYgKCBlbGVtZW50c1RvRGlzcGxheS5sZW5ndGggPCBtYXhFbGVtZW50c1RvRGlzcGxheSlcblx0XHR7XG5cdFx0XHQvLyBleHBhbmQgYm91bmRzXG5cdFx0XHRBcHAuYm91bmRzTW9kdWxlLmV4dGVuZEJvdW5kcygwLjUpO1xuXHRcdFx0QXBwLmNoZWNrRm9yTmV3RWxlbWVudHNUb1JldHJpZXZlKCk7XHRcdFxuXHRcdH1cdFxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwibGlzdCBpcyBmdWxsXCIpO1xuXHRcdFx0dGhpcy5pc0xpc3RGdWxsID0gdHJ1ZTtcblx0XHRcdC8vIHdhaXRpbmcgZm9yIHNjcm9sbCBib3R0b20gdG8gYWRkIG1vcmUgZWxlbWVudHMgdG8gdGhlIGxpc3Rcblx0XHR9XG5cdFx0XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGVuZEluZGV4OyBpKyspXG5cdFx0e1xuXHRcdFx0ZWxlbWVudCA9IGVsZW1lbnRzVG9EaXNwbGF5W2ldO1xuXHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgdWwnKS5hcHBlbmQoZWxlbWVudC5nZXRIdG1sUmVwcmVzZW50YXRpb24oKSk7XG5cdFx0XHRsZXQgZG9tTWVudSA9ICQoJyNlbGVtZW50LWluZm8tJytlbGVtZW50LmlkICsnIC5tZW51LWVsZW1lbnQnKTtcblx0XHRcdGNyZWF0ZUxpc3RlbmVyc0ZvckVsZW1lbnRNZW51KGRvbU1lbnUpO1x0XG5cdFx0XHR1cGRhdGVGYXZvcml0ZUljb24oZG9tTWVudSwgZWxlbWVudClcdFx0XG5cdFx0fVxuXG5cdFx0Y3JlYXRlTGlzdGVuZXJzRm9yVm90aW5nKCk7XG5cblx0XHRpZiAoJGFuaW1hdGUpXG5cdFx0e1xuXHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgdWwnKS5hbmltYXRlKHtzY3JvbGxUb3A6ICcwJ30sIDUwMCk7XG5cdFx0fVx0XHRcblxuXHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IHVsJykuY29sbGFwc2libGUoe1xuICAgICAgXHRhY2NvcmRpb24gOiB0cnVlIFxuICAgXHR9KTtcblxuICAgXHQkKCcuZWxlbWVudC1saXN0LXRpdGxlLW51bWJlci1yZXN1bHRzJykudGV4dCgnKCcgKyBlbGVtZW50c1RvRGlzcGxheS5sZW5ndGggKyAnKScpO1xuXHR9XG5cblx0cHJpdmF0ZSBoYW5kbGVCb3R0b20oKVxuXHR7XG5cdFx0aWYgKHRoaXMuaXNMaXN0RnVsbCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5zdGVwc0NvdW50Kys7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiYm90dG9tIHJlYWNoZWRcIik7XG5cdFx0XHR0aGlzLmlzTGlzdEZ1bGwgPSBmYWxzZTtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdHRoaXMuZHJhdyhBcHAuZWxlbWVudHMoKSk7XG5cdFx0fVx0XHRcblx0fVxuXG5cdHByaXZhdGUgY29tcGFyZURpc3RhbmNlKGEsYikgXG5cdHsgIFxuXHQgIGlmIChhLmRpc3RhbmNlID09IGIuZGlzdGFuY2UpIHJldHVybiAwO1xuXHQgIHJldHVybiBhLmRpc3RhbmNlIDwgYi5kaXN0YW5jZSA/IC0xIDogMTtcblx0fVxufVxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuXG5kZWNsYXJlIGxldCBncmVjYXB0Y2hhO1xuZGVjbGFyZSB2YXIgJCA6IGFueTtcbmRlY2xhcmUgbGV0IFJvdXRpbmcgOiBhbnk7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuXG5pbXBvcnQgeyBjYXBpdGFsaXplLCBzbHVnaWZ5IH0gZnJvbSBcIi4uLy4uL2NvbW1vbnMvY29tbW9uc1wiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplRWxlbWVudE1lbnUoKVxue1x0XG5cdC8vICAgTUVOVSBQUk9WSURFUlxuXHRsZXQgbWVudV9lbGVtZW50ID0gJCgnI2VsZW1lbnQtaW5mby1iYXIgLm1lbnUtZWxlbWVudCcpO1xuXHRjcmVhdGVMaXN0ZW5lcnNGb3JFbGVtZW50TWVudShtZW51X2VsZW1lbnQpO1x0XG5cblx0JCgnI3BvcHVwLWRlbGV0ZS1lbGVtZW50ICNzZWxlY3QtcmVhc29uJykubWF0ZXJpYWxfc2VsZWN0KCk7XG5cdCQoJyNtb2RhbC12b3RlICNzZWxlY3Qtdm90ZScpLm1hdGVyaWFsX3NlbGVjdCgpO1xuXG5cdC8vIGJ1dHRvbiB0byBjb25maXJtIGNhbGN1bGF0ZSBpZHJlY3Rpb25zIGluIG1vZGFsIHBpY2sgYWRkcmVzcyBmb3IgZGlyZWN0aW9uc1xuXHQkKCcjbW9kYWwtcGljay1hZGRyZXNzICNidG4tY2FsY3VsYXRlLWRpcmVjdGlvbnMnKS5jbGljaygoKSA9PiBcblx0e1xuXHRcdGxldCBhZGRyZXNzID0gJCgnI21vZGFsLXBpY2stYWRkcmVzcyBpbnB1dCcpLnZhbCgpO1xuXHRcdFxuXHRcdGlmIChhZGRyZXNzKVxuXHRcdHtcdFx0XHRcblx0XHRcdEFwcC5nZW9jb2Rlci5nZW9jb2RlQWRkcmVzcyhhZGRyZXNzLFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHQkKFwiI21vZGFsLXBpY2stYWRkcmVzcyAubW9kYWwtZXJyb3ItbXNnXCIpLmhpZGUoKTtcblx0XHRcdFx0JCgnI21vZGFsLXBpY2stYWRkcmVzcycpLmNsb3NlTW9kYWwoKTtcblx0XHRcdFx0QXBwLnNlYXJjaEJhckNvbXBvbmVudC5zZXRWYWx1ZShhZGRyZXNzKTtcblxuXHRcdFx0XHRBcHAuc2V0U3RhdGUoQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zLHtpZDogZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCl9KTtcblx0XHRcdH0sXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdCQoXCIjbW9kYWwtcGljay1hZGRyZXNzIC5tb2RhbC1lcnJvci1tc2dcIikuc2hvdygpO1xuXHRcdFx0fSk7XHRcdFx0XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQkKCcjbW9kYWwtcGljay1hZGRyZXNzIGlucHV0JykuYWRkQ2xhc3MoJ2ludmFsaWQnKTtcblx0XHR9XG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUVsZW1lbnQoKVxue1xuXHRpZiAoZ3JlY2FwdGNoYS5nZXRSZXNwb25zZSgpLmxlbmd0aCA9PT0gMClcblx0e1xuXHRcdCQoJyNjYXB0Y2hhLWVycm9yLW1lc3NhZ2UnKS5zaG93KCk7XG5cdFx0Z3JlY2FwdGNoYS5yZXNldCgpO1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdCQoJyNjYXB0Y2hhLWVycm9yLW1lc3NhZ2UnKS5oaWRlKCk7XG5cdFx0JCgnI3BvcHVwLWRlbGV0ZS1lbGVtZW50JykuY2xvc2VNb2RhbCgpO1xuXHR9XHRcbn1cblxuZnVuY3Rpb24gb25sb2FkQ2FwdGNoYSgpIFxue1xuICAgIGdyZWNhcHRjaGEucmVuZGVyKCdjYXB0Y2hhJywge1xuICAgICAgJ3NpdGVrZXknIDogJzZMY0VWaVVUQUFBQUFPRU1wRkN5TEh3UEcxdkpxRXh1eUQ0bjFMYncnXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGYXZvcml0ZUljb24ob2JqZWN0LCBlbGVtZW50IDogRWxlbWVudClcbntcblx0aWYgKCFlbGVtZW50LmlzRmF2b3JpdGUpIFxuXHR7XG5cdFx0b2JqZWN0LmZpbmQoJy5pdGVtLWFkZC1mYXZvcml0ZScpLnNob3coKTtcblx0XHRvYmplY3QuZmluZCgnLml0ZW0tcmVtb3ZlLWZhdm9yaXRlJykuaGlkZSgpO1xuXHR9XHRcblx0ZWxzZSBcblx0e1xuXHRcdG9iamVjdC5maW5kKCcuaXRlbS1hZGQtZmF2b3JpdGUnKS5oaWRlKCk7XG5cdFx0b2JqZWN0LmZpbmQoJy5pdGVtLXJlbW92ZS1mYXZvcml0ZScpLnNob3coKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0Z1bGxUZXh0TWVudShvYmplY3QsIGJvb2wgOiBib29sZWFuKVxue1xuXHRpZiAoYm9vbClcblx0e1xuXHRcdG9iamVjdC5hZGRDbGFzcyhcImZ1bGwtdGV4dFwiKTtcblx0XHRvYmplY3QuZmluZCgnLnRvb2x0aXBwZWQnKS50b29sdGlwKCdyZW1vdmUnKTtcdFxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdG9iamVjdC5yZW1vdmVDbGFzcyhcImZ1bGwtdGV4dFwiKTtcblx0XHRvYmplY3QuZmluZCgnLnRvb2x0aXBwZWQnKS50b29sdGlwKCk7XHRcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGlzdGVuZXJzRm9yRWxlbWVudE1lbnUob2JqZWN0KVxue1xuXHRvYmplY3QuZmluZCgnLnRvb2x0aXBwZWQnKS50b29sdGlwKCk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLWVkaXQnKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9lbGVtZW50X2VkaXQnLCB7IGlkIDogZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkgfSk7IFxuXHR9KTtcblxuXHRvYmplY3QuZmluZCgnLml0ZW0tZGVsZXRlJykuY2xpY2soZnVuY3Rpb24oKSBcblx0e1x0XHRcblx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpKTtcblx0XHQvL3dpbmRvdy5jb25zb2xlLmxvZyhlbGVtZW50Lm5hbWUpO1xuXHRcdCQoJyNwb3B1cC1kZWxldGUtZWxlbWVudCAuZWxlbWVudE5hbWUnKS50ZXh0KGNhcGl0YWxpemUoZWxlbWVudC5uYW1lKSk7XG5cdFx0JCgnI3BvcHVwLWRlbGV0ZS1lbGVtZW50Jykub3Blbk1vZGFsKHtcblx0XHQgICAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdFx0ICAgICAgb3BhY2l0eTogMC41LCBcblx0XHQgICAgICBpbl9kdXJhdGlvbjogMzAwLCBcblx0XHQgICAgICBvdXRfZHVyYXRpb246IDIwMFxuICAgIFx0XHR9KTtcblx0fSk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLWRpcmVjdGlvbnMnKS5jbGljayhmdW5jdGlvbigpIFxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cblx0XHRpZiAoQXBwLnN0YXRlICE9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbiAmJiAhQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpXG5cdFx0e1xuXHRcdFx0bGV0IG1vZGFsID0gJCgnI21vZGFsLXBpY2stYWRkcmVzcycpO1xuXHRcdFx0bW9kYWwuZmluZChcIi5tb2RhbC1mb290ZXJcIikuYXR0cignb3B0aW9uLWlkJyxlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1x0XHRcdFxuXHRcdFx0XG5cdFx0XHRtb2RhbC5vcGVuTW9kYWwoe1xuXHQgICAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdCAgICAgIG9wYWNpdHk6IDAuNSwgXG5cdCAgICAgIGluX2R1cmF0aW9uOiAzMDAsIFxuXHQgICAgICBvdXRfZHVyYXRpb246IDIwMCxcbiAgIFx0XHR9KTtcblx0XHR9XG5cdFx0ZWxzZSBBcHAuc2V0U3RhdGUoQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zLHtpZDogZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCl9KTtcblx0fSk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLXNoYXJlJykuY2xpY2soZnVuY3Rpb24oKVxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0XG5cdFx0bGV0IG1vZGFsID0gJCgnI21vZGFsLXNoYXJlLWVsZW1lbnQnKTtcblxuXHRcdG1vZGFsLmZpbmQoXCIubW9kYWwtZm9vdGVyXCIpLmF0dHIoJ29wdGlvbi1pZCcsZWxlbWVudC5jb2xvck9wdGlvbklkKTtcblx0XHQvL21vZGFsLmZpbmQoXCIuaW5wdXQtc2ltcGxlLW1vZGFsXCIpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoXCJpbnB1dC1zaW1wbGUtbW9kYWwgXCIgKyBlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1xuXG5cdFx0bGV0IHVybDtcblx0XHRpZiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdHtcblx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2RpcmVjdG9yeV9zaG93RWxlbWVudCcsIHsgbmFtZSA6ICBjYXBpdGFsaXplKHNsdWdpZnkoZWxlbWVudC5uYW1lKSksIGlkIDogZWxlbWVudC5pZCB9LCB0cnVlKTtcdFxuXHRcdH1cblxuXHRcdG1vZGFsLmZpbmQoJy5pbnB1dC1zaW1wbGUtbW9kYWwnKS52YWwodXJsKTtcblx0XHRtb2RhbC5vcGVuTW9kYWwoe1xuXHQgICAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdCAgICAgIG9wYWNpdHk6IDAuNSwgXG5cdCAgICAgIGluX2R1cmF0aW9uOiAzMDAsIFxuXHQgICAgICBvdXRfZHVyYXRpb246IDIwMFxuICAgXHR9KTtcblx0fSk7XHRcblx0XG5cdG9iamVjdC5maW5kKCcuaXRlbS1hZGQtZmF2b3JpdGUnKS5jbGljayhmdW5jdGlvbigpIFxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUuYWRkRmF2b3JpdGUoZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkpO1xuXG5cdFx0dXBkYXRlRmF2b3JpdGVJY29uKG9iamVjdCwgZWxlbWVudCk7XG5cblx0XHRpZiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdHtcblx0XHRcdGVsZW1lbnQubWFya2VyLnVwZGF0ZSgpO1xuXHRcdFx0ZWxlbWVudC5tYXJrZXIuYW5pbWF0ZURyb3AoKTtcblx0XHR9XG5cdFx0XG5cdH0pO1xuXHRcblx0b2JqZWN0LmZpbmQoJy5pdGVtLXJlbW92ZS1mYXZvcml0ZScpLmNsaWNrKGZ1bmN0aW9uKCkgXG5cdHtcblx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpKTtcblx0XHRBcHAuZWxlbWVudE1vZHVsZS5yZW1vdmVGYXZvcml0ZShnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0XG5cdFx0dXBkYXRlRmF2b3JpdGVJY29uKG9iamVjdCwgZWxlbWVudCk7XG5cblx0XHRpZiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKSBlbGVtZW50Lm1hcmtlci51cGRhdGUoKTtcblx0fSk7XHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpIDogbnVtYmVyXG57XG5cdHJldHVybiBnZXRDdXJyZW50RWxlbWVudEluZm9CYXJTaG93bigpLmF0dHIoJ2RhdGEtZWxlbWVudC1pZCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudEVsZW1lbnRJbmZvQmFyU2hvd24oKVxue1xuXHRpZiAoIEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCApIFxuXHR7XG5cdFx0cmV0dXJuICQoJyNlbGVtZW50LWluZm8tYmFyJykuZmluZCgnLmVsZW1lbnQtaXRlbScpO1xuXHR9XG5cdHJldHVybiAkKCcuZWxlbWVudC1pdGVtLmFjdGl2ZScpO1xufVxuXG5cbi8qZnVuY3Rpb24gYm9va01hcmtNZSgpXG57XG5cdGlmICh3aW5kb3cuc2lkZWJhcikgeyAvLyBNb3ppbGxhIEZpcmVmb3ggQm9va21hcmtcbiAgICAgIHdpbmRvdy5zaWRlYmFyLmFkZFBhbmVsKGxvY2F0aW9uLmhyZWYsZG9jdW1lbnQudGl0bGUsXCJcIik7XG4gICAgfSBlbHNlIGlmKHdpbmRvdy5leHRlcm5hbCkgeyAvLyBJRSBGYXZvcml0ZVxuICAgICAgd2luZG93LmV4dGVybmFsLkFkZEZhdm9yaXRlKGxvY2F0aW9uLmhyZWYsZG9jdW1lbnQudGl0bGUpOyB9XG4gICAgZWxzZSBpZih3aW5kb3cub3BlcmEgJiYgd2luZG93LnByaW50KSB7IC8vIE9wZXJhIEhvdGxpc3RcbiAgICAgIHRoaXMudGl0bGU9ZG9jdW1lbnQudGl0bGU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59Ki9cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuXG5pbXBvcnQgeyBFdmVudCwgSUV2ZW50IH0gZnJvbSBcIi4uL3V0aWxzL2V2ZW50XCI7XG5pbXBvcnQgeyB1cGRhdGVNYXBTaXplLCB1cGRhdGVJbmZvQmFyU2l6ZSB9IGZyb20gXCIuLi9hcHAtaW50ZXJhY3Rpb25zXCI7XG5pbXBvcnQgeyB1cGRhdGVGYXZvcml0ZUljb24sIHNob3dGdWxsVGV4dE1lbnUgfSBmcm9tIFwiLi9lbGVtZW50LW1lbnUuY29tcG9uZW50XCI7XG5cbmltcG9ydCB7IGNyZWF0ZUxpc3RlbmVyc0ZvclZvdGluZyB9IGZyb20gXCIuLi9jb21wb25lbnRzL3ZvdGUuY29tcG9uZW50XCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmV4cG9ydCBjbGFzcyBJbmZvQmFyQ29tcG9uZW50XG57XG5cdGlzVmlzaWJsZSA6IGJvb2xlYW4gPSBmYWxzZTtcblx0aXNEZXRhaWxzVmlzaWJsZSA9IGZhbHNlO1xuXG5cdGVsZW1lbnRWaXNpYmxlIDogRWxlbWVudCA9IG51bGw7XG5cblx0b25TaG93ID0gbmV3IEV2ZW50PG51bWJlcj4oKTtcblx0b25IaWRlID0gbmV3IEV2ZW50PGJvb2xlYW4+KCk7XG5cblx0Z2V0Q3VyckVsZW1lbnRJZCgpIDogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZWxlbWVudFZpc2libGUgPyB0aGlzLmVsZW1lbnRWaXNpYmxlLmlkIDogbnVsbH1cblxuXHRwcml2YXRlIGlzRGlzcGxheWVkQXNpZGUoKVxuXHR7XG5cdFx0cmV0dXJuICQoJyNlbGVtZW50LWluZm8tYmFyJykuY3NzKCdwb3NpdGlvbicpID09ICdhYnNvbHV0ZSc7XG5cdH1cblxuXHQvLyBBcHAuaW5mb0JhckNvbXBvbmVudC5zaG93RWxlbWVudDtcblx0c2hvd0VsZW1lbnQoZWxlbWVudElkKSBcblx0e1xuXHRcdGxldCBlbGVtZW50ID0gQXBwLmVsZW1lbnRNb2R1bGUuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcblxuXHRcdGNvbnNvbGUubG9nKFwic2hvd0VsZW1lbnRcIiwgZWxlbWVudCk7XG5cdFx0XG5cdFx0Ly8gaWYgZWxlbWVudCBhbHJlYWR5IHZpc2libGVcblx0XHRpZiAodGhpcy5lbGVtZW50VmlzaWJsZSlcblx0XHR7XG5cdFx0XHR0aGlzLmVsZW1lbnRWaXNpYmxlLm1hcmtlci5zaG93Tm9ybWFsU2l6ZSh0cnVlKTtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnRWaXNpYmxlID0gZWxlbWVudDtcdFx0XHRcdFxuXG5cdFx0ZWxlbWVudC51cGRhdGVEaXN0YW5jZSgpO1xuXG5cdFx0JCgnI2VsZW1lbnQtaW5mbycpLmh0bWwoZWxlbWVudC5nZXRIdG1sUmVwcmVzZW50YXRpb24oKSk7XG5cblx0XHRsZXQgZG9tTWVudSA9ICQoJyNlbGVtZW50LWluZm8tYmFyIC5tZW51LWVsZW1lbnQnKTtcblx0XHRkb21NZW51LmF0dHIoJ29wdGlvbi1pZCcsIGVsZW1lbnQuY29sb3JPcHRpb25JZCk7XG5cblx0XHRpZiAoZWxlbWVudC5pc1BlbmRpbmcoKSkgXG5cdFx0e1xuXHRcdFx0ZG9tTWVudS5hZGRDbGFzcyhcInBlbmRpbmdcIik7XG5cdFx0XHRjcmVhdGVMaXN0ZW5lcnNGb3JWb3RpbmcoKTtcblx0XHR9XG5cdFx0ZWxzZSBkb21NZW51LnJlbW92ZUNsYXNzKFwicGVuZGluZ1wiKTtcblxuXHRcdHVwZGF0ZUZhdm9yaXRlSWNvbihkb21NZW51LCBlbGVtZW50KTtcblxuXHRcdC8vIG9uIGxhcmdlIHNjcmVlbiBpbmZvIGJhciBpcyBkaXNwbGF5ZWQgYXNpZGUgYW5kIHNvIHdlIGhhdmUgZW5vdWdoIHNwYWNlXG5cdFx0Ly8gdG8gc2hvdyBtZW51IGFjdGlvbnMgZGV0YWlscyBpbiBmdWxsIHRleHRcblx0XHRzaG93RnVsbFRleHRNZW51KGRvbU1lbnUsIHRoaXMuaXNEaXNwbGF5ZWRBc2lkZSgpKTtcblxuXG5cdFx0JCgnI2J0bi1jbG9zZS1iYW5kZWF1LWRldGFpbCcpLmNsaWNrKCgpID0+XG5cdFx0eyAgXHRcdFxuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cdFx0XG5cdFx0JCgnI2VsZW1lbnQtaW5mbyAuY29sbGFwc2libGUtaGVhZGVyJykuY2xpY2soKCkgPT4ge3RoaXMudG9nZ2xlRGV0YWlscygpOyB9KTtcblx0XHRcblx0XHR0aGlzLnNob3coKTtcblxuXHRcdC8vIGFmdGVyIGluZm9iYXIgYW5pbWF0aW9uLCB3ZSBjaGVjayBpZiB0aGUgbWFya2VyIFxuXHRcdC8vIGlzIG5vdCBoaWRkZWQgYnkgdGhlIGluZm8gYmFyXG5cdFx0c2V0VGltZW91dCgoKT0+IHtcblx0XHRcdGlmICghQXBwLm1hcENvbXBvbmVudC5jb250YWlucyhlbGVtZW50LnBvc2l0aW9uKSlcblx0XHRcdHtcblx0XHRcdFx0QXBwLm1hcENvbXBvbmVudC5wYW5Ub0xvY2F0aW9uKGVsZW1lbnQucG9zaXRpb24pO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IHRoaXMuZWxlbWVudFZpc2libGUubWFya2VyLnNob3dCaWdTaXplKCk7IH0sIDEwMDApO1xuXHRcdFx0XHQvL0FwcC5lbGVtZW50TW9kdWxlLnVwZGF0ZUVsZW1lbnRzVG9EaXNwbGF5KClcblx0XHRcdH1cdFx0XHRcblx0XHR9LCAxMDAwKTtcblxuXHRcdHRoaXMub25TaG93LmVtaXQoZWxlbWVudElkKTtcblx0fTtcblxuXHRzaG93KClcblx0e1xuXHRcdC8vQXBwLnNldFRpbWVvdXRJbmZvQmFyQ29tcG9uZW50KCk7XG5cblx0XHRpZiAoIXRoaXMuaXNEaXNwbGF5ZWRBc2lkZSgpKVxuXHRcdHtcblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuc2hvdygpO1xuXG5cdFx0XHRsZXQgZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0ID0gJCgnI2VsZW1lbnQtaW5mbycpLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0ZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0ICs9ICQoJyNlbGVtZW50LWluZm8tYmFyIC5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2UtaGVscGVyOnZpc2libGUnKS5oZWlnaHQoKTtcblxuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5jc3MoJ2hlaWdodCcsIGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCk7XG5cdFx0XHR1cGRhdGVJbmZvQmFyU2l6ZSgpO1xuXHRcdFx0dXBkYXRlTWFwU2l6ZShlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQpO1xuXHRcdH1cdFxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQvKiQoJyNlbGVtZW50LWluZm8tYmFyJykuc2hvdygpO1xuXHRcdFx0dXBkYXRlSW5mb0JhclNpemUoKTsqL1x0XHRcblxuXHRcdFx0aWYgKCEkKCcjZWxlbWVudC1pbmZvLWJhcicpLmlzKCc6dmlzaWJsZScpKVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmNzcygncmlnaHQnLCctNTAwcHgnKTtcdFx0XHRcblx0XHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5zaG93KCkuYW5pbWF0ZSh7J3JpZ2h0JzonMCd9LDM1MCwnc3dpbmcnLGZ1bmN0aW9uKCl7IHVwZGF0ZU1hcFNpemUoMCk7IH0pO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR1cGRhdGVJbmZvQmFyU2l6ZSgpO1xuXHRcdFx0Ly8kKCcjZWxlbWVudC1pbmZvLWJhcicpLnNob3coXCJzbGlkZVwiLCB7ZGlyZWN0aW9uOiAncmlndGgnLCBlYXNpbmc6ICdzd2luZyd9ICwgMzUwICk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuXHR9O1xuXG5cdGhpZGUoKVxuXHR7XG5cdFx0aWYgKCQoJyNlbGVtZW50LWluZm8tYmFyJykuaXMoJzp2aXNpYmxlJykpXG5cdFx0e1xuXHRcdFx0aWYgKCF0aGlzLmlzRGlzcGxheWVkQXNpZGUoKSlcblx0XHRcdHtcdFx0XHRcblx0XHRcdFx0dGhpcy5oaWRlRGV0YWlscygpO1xuXHRcdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmNzcygnaGVpZ2h0JywnMCcpO1xuXHRcdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmhpZGUoKTtcblx0XHRcdFx0dXBkYXRlTWFwU2l6ZSgwKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLmNzcygnbWFyZ2luLXJpZ2h0JywnMHB4Jyk7XG5cdFx0XHRcdCQoJyNiYW5kZWF1X2hlbHBlcicpLmNzcygnbWFyZ2luLXJpZ2h0JywnMHB4Jyk7XG5cblx0XHRcdFx0aWYgKCQoJyNlbGVtZW50LWluZm8tYmFyJykuaXMoJzp2aXNpYmxlJykpXG5cdFx0XHRcdHtcdFx0XG5cdFx0XHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5hbmltYXRlKHsncmlnaHQnOictNTAwcHgnfSwzNTAsJ3N3aW5nJyxmdW5jdGlvbigpeyAkKHRoaXMpLmhpZGUoKTt1cGRhdGVNYXBTaXplKDApOyAgfSk7XG5cdFx0XHRcdH1cdFx0XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub25IaWRlLmVtaXQodHJ1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZWxlbWVudFZpc2libGUgJiYgdGhpcy5lbGVtZW50VmlzaWJsZS5tYXJrZXIpIHRoaXMuZWxlbWVudFZpc2libGUubWFya2VyLnNob3dOb3JtYWxTaXplKHRydWUpO1xuXG5cdFx0dGhpcy5lbGVtZW50VmlzaWJsZSA9IG51bGw7XG5cdFx0dGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcdFx0XG5cdH07XG5cblx0dG9nZ2xlRGV0YWlscygpXG5cdHtcdFxuXHRcdC8vQXBwLnNldFRpbWVvdXRJbmZvQmFyQ29tcG9uZW50KCk7XG5cblx0XHRpZiAoICQoJyNlbGVtZW50LWluZm8tYmFyIC5tb3JlRGV0YWlscycpLmlzKCc6dmlzaWJsZScpIClcblx0XHR7XG5cdFx0XHR0aGlzLmhpZGVEZXRhaWxzKCk7XG5cdFx0XHQkKCcjYmFuZGVhdV9oZWxwZXInKS5jc3MoJ3otaW5kZXgnLDIwKS5hbmltYXRlKHsnb3BhY2l0eSc6ICcxJ30sNTAwKTtcblx0XHRcdCQoJyNtZW51LWJ1dHRvbicpLmZhZGVJbigpO1x0XHRcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdCQoJyNiYW5kZWF1X2hlbHBlcicpLmFuaW1hdGUoeydvcGFjaXR5JzogJzAnfSw1MDApLmNzcygnei1pbmRleCcsLTEpO1xuXHRcdFx0JCgnI21lbnUtYnV0dG9uJykuZmFkZU91dCgpO1xuXG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZUluZm9zJykuaGlkZSgpO1xuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLmxlc3NJbmZvcycpLnNob3coKTtcdFxuXHRcdFx0XG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZURldGFpbHMnKS5zaG93KCk7XHRcdFxuXG5cdFx0XHRsZXQgZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0ID0gICQoIHdpbmRvdyApLmhlaWdodCgpO1xuXHRcdFx0ZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0IC09ICQoJ2hlYWRlcicpLmhlaWdodCgpO1xuXHRcdFx0ZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0IC09JCgnI2JhbmRlYXVfZ29Ub2RpcmVjdG9yeS1jb250ZW50LWxpc3QnKS5vdXRlckhlaWdodCh0cnVlKTtcblxuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG5cblx0XHRcdGxldCBlbGVtZW50SW5mb0JhciA9ICQoXCIjZWxlbWVudC1pbmZvLWJhclwiKTtcblx0XHQgIFx0bGV0IGhlaWdodCA9ICBlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQ7XG5cdFx0XHRoZWlnaHQgLT0gZWxlbWVudEluZm9CYXIuZmluZCgnLmNvbGxhcHNpYmxlLWhlYWRlcicpLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0aGVpZ2h0IC09IGVsZW1lbnRJbmZvQmFyLmZpbmQoJy5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2UtaGVscGVyOnZpc2libGUnKS5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdGhlaWdodCAtPSBlbGVtZW50SW5mb0Jhci5maW5kKFwiLm1lbnUtZWxlbWVudFwiKS5vdXRlckhlaWdodCh0cnVlKTtcblxuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAuY29sbGFwc2libGUtYm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHRcdFxuXHRcdFx0dXBkYXRlTWFwU2l6ZShlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQpO1x0XHRcdFxuXHRcdH1cdFxuXHR9O1xuXG5cdGhpZGVEZXRhaWxzKClcblx0e1xuXHRcdC8vQXBwLnNldFRpbWVvdXRJbmZvQmFyQ29tcG9uZW50KCk7XG5cblx0XHRpZiAoJCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVEZXRhaWxzJykuaXMoJzp2aXNpYmxlJykpXG5cdFx0e1xuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVEZXRhaWxzJykuaGlkZSgpO1xuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVJbmZvcycpLnNob3coKTtcblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5sZXNzSW5mb3MnKS5oaWRlKCk7XG5cblx0XHRcdGxldCBlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQgPSAkKCcjZWxlbWVudC1pbmZvJykub3V0ZXJIZWlnaHQodHJ1ZSkgKyAkKCcjZWxlbWVudC1pbmZvLWJhciAuc3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlLWhlbHBlcjp2aXNpYmxlJykuaGVpZ2h0KCk7XG5cblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuY3NzKCdoZWlnaHQnLCBlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQpO1xuXG5cdFx0XHR1cGRhdGVNYXBTaXplKGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCk7XHRcblx0XHR9XHRcblx0fTtcbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uLy4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IGRyYXdMaW5lQmV0d2VlblBvaW50cyB9IGZyb20gXCIuL21hcC1kcmF3aW5nXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uLy4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkO1xuXG5kZWNsYXJlIGxldCBUd2lnIDogYW55O1xuZGVjbGFyZSBsZXQgYmlvcGVuX3R3aWdKc19tYXJrZXIgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBCaW9wZW5NYXJrZXJcbntcblx0aWRfIDogc3RyaW5nO1xuXHRpc0FuaW1hdGluZ18gOiBib29sZWFuID0gZmFsc2U7XG5cdGxlYWZsZXRNYXJrZXJfIDogTC5NYXJrZXI7XG5cdGlzSGFsZkhpZGRlbl8gOiBib29sZWFuID0gZmFsc2U7XG5cdGluY2xpbmF0aW9uXyA9IFwibm9ybWFsXCI7XG5cdHBvbHlsaW5lXztcblxuXHRjb25zdHJ1Y3RvcihpZF8gOiBzdHJpbmcsIHBvc2l0aW9uXyA6IEwuTGF0TG5nKSBcblx0e1xuXHRcdHRoaXMuaWRfID0gaWRfO1xuXG5cdFx0aWYgKCFwb3NpdGlvbl8pXG5cdFx0e1xuXHRcdFx0bGV0IGVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnQoKTtcblx0XHRcdGlmIChlbGVtZW50ID09PSBudWxsKSB3aW5kb3cuY29uc29sZS5sb2coXCJlbGVtZW50IG51bGwgaWQgPSBcIisgdGhpcy5pZF8pO1xuXHRcdFx0ZWxzZSBwb3NpdGlvbl8gPSBlbGVtZW50LnBvc2l0aW9uO1xuXHRcdH0gXG5cblx0XHR0aGlzLmxlYWZsZXRNYXJrZXJfID0gTC5tYXJrZXIocG9zaXRpb25fLCB7ICdyaXNlT25Ib3ZlcicgOiB0cnVlfSk7XHRcblx0XHRcdFxuXHRcdHRoaXMubGVhZmxldE1hcmtlcl8ub24oJ2NsaWNrJywgKGV2KSA9PlxuXHRcdHtcblx0XHRcdEFwcC5oYW5kbGVNYXJrZXJDbGljayh0aGlzKTtcdFxuICBcdH0pO1xuXHRcblx0XHR0aGlzLmxlYWZsZXRNYXJrZXJfLm9uKCdtb3VzZW92ZXInLCAoZXYpID0+XG5cdFx0e1xuXHRcdFx0aWYgKHRoaXMuaXNBbmltYXRpbmdfKSB7IHJldHVybjsgfVxuXHRcdFx0Ly9pZiAoIXRoaXMuaXNOZWFybHlIaWRkZW5fKSAvLyBmb3IgY29uc3RlbGxhdGlvbiBtb2RlICFcblx0XHRcdFx0dGhpcy5zaG93QmlnU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5sZWFmbGV0TWFya2VyXy5vbignbW91c2VvdXQnLCAoZXYpID0+XG5cdFx0e1xuXHRcdFx0aWYgKHRoaXMuaXNBbmltYXRpbmdfKSB7IHJldHVybjsgfVx0XHRcdFxuXHRcdFx0dGhpcy5zaG93Tm9ybWFsU2l6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gaWYgKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbilcblx0XHQvLyB7XG5cdFx0Ly8gXHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLmxlYWZsZXRNYXJrZXJfLCAndmlzaWJsZV9jaGFuZ2VkJywgKCkgPT4gXG5cdFx0Ly8gXHR7IFxuXHRcdC8vIFx0XHR0aGlzLmNoZWNrUG9seWxpbmVWaXNpYmlsaXR5Xyh0aGlzKTsgXG5cdFx0Ly8gXHR9KTtcblx0XHQvLyB9XG5cblx0XHR0aGlzLmlzSGFsZkhpZGRlbl8gPSBmYWxzZTtcdFx0XHRcblxuXG5cdFx0Ly90aGlzLnVwZGF0ZSgpO1x0XG5cdFx0dGhpcy5sZWFmbGV0TWFya2VyXy5zZXRJY29uKEwuZGl2SWNvbih7Y2xhc3NOYW1lOiAnbGVhZmxldC1tYXJrZXItY29udGFpbmVyJywgaHRtbDogXCI8c3BhbiBpZD1cXFwibWFya2VyLVwiKyB0aGlzLmlkXyArIFwiXFxcIj48L3NwYW4+XCJ9KSk7XG5cdH07XHRcblxuXHRpc0Rpc3BsYXllZE9uRWxlbWVudEluZm9CYXIoKVxuXHR7XG5cdFx0cmV0dXJuIEFwcC5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSA9PSB0aGlzLmlkXztcblx0fVxuXG5cdGRvbU1hcmtlcigpXG5cdHtcblx0XHRyZXR1cm4gJCgnI21hcmtlci0nKyB0aGlzLmlkXyk7XG5cdH1cblxuXHRhbmltYXRlRHJvcCgpIFxuXHR7XG5cdFx0dGhpcy5pc0FuaW1hdGluZ18gPSB0cnVlO1xuXHRcdHRoaXMuZG9tTWFya2VyKCkuYW5pbWF0ZSh7dG9wOiAnLT0yNXB4J30sIDMwMCwgJ2Vhc2VJbk91dEN1YmljJyk7XG5cdFx0dGhpcy5kb21NYXJrZXIoKS5hbmltYXRlKHt0b3A6ICcrPTI1cHgnfSwgMjUwLCAnZWFzZUluT3V0Q3ViaWMnLCBcblx0XHRcdCgpID0+IHt0aGlzLmlzQW5pbWF0aW5nXyA9IGZhbHNlO30gKTtcblx0fTtcblxuXHR1cGRhdGUoKSBcblx0e1x0XHRcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuXG5cdFx0bGV0IGRpc2FibGVNYXJrZXIgPSBmYWxzZTtcblx0XHRsZXQgc2hvd01vcmVJY29uID0gdHJ1ZTtcblxuXHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pXG5cdFx0e1xuXHRcdFx0Ly8gUE9MWUxJTkUgVFlQRVxuXHRcdFx0bGV0IGxpbmVUeXBlO1xuXG5cdFx0XHRpZiAoZWxlbWVudC5zdGFyQ2hvaWNlRm9yUmVwcmVzZW50YXRpb24gPT09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRsaW5lVHlwZSA9IEFwcFN0YXRlcy5Ob3JtYWw7XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcdFx0XHRcblx0XHRcdFx0bGluZVR5cGUgPSBlbGVtZW50LmlzQ3VycmVudFN0YXJDaG9pY2VSZXByZXNlbnRhbnQoKSA/IEFwcFN0YXRlcy5Ob3JtYWwgOiAnZGFzaGVkJztcblx0XHRcdFx0Ly8gZW4gbW9kZSBTQ1IsIHRvdXQgbGVzbWFya2VycyBzb250IGRpc2FibGVkIHNhdWYgbGUgcmVwcsOpc2VudGFudCBkZSBsJ8OpdG9pbGVcblx0XHRcdFx0ZGlzYWJsZU1hcmtlciA9ICFlbGVtZW50LmlzQ3VycmVudFN0YXJDaG9pY2VSZXByZXNlbnRhbnQoKTtcblx0XHRcdH1cdFx0XG5cblx0XHRcdHRoaXMudXBkYXRlUG9seWxpbmUoe2xpbmVUeXBlOiBsaW5lVHlwZX0pO1xuXHRcdH1cblxuXHRcdGxldCBvcHRpb25zdG9EaXNwbGF5ID0gZWxlbWVudC5nZXRJY29uc1RvRGlzcGxheSgpO1xuXG5cdFx0Ly8gSWYgdXNlY29sb3IgYW5kIHVzZUljb24sIHdlIGRvbid0IHNob3cgb3RoZXJzIGljb25zXG5cdFx0Ly8gaWYgKG9wdGlvbnN0b0Rpc3BsYXlbMF0pXG5cdFx0Ly8gXHRzaG93TW9yZUljb24gPSAhb3B0aW9uc3RvRGlzcGxheVswXS51c2VDb2xvckZvck1hcmtlciB8fCAhb3B0aW9uc3RvRGlzcGxheVswXS51c2VJY29uRm9yTWFya2VyO1xuXG5cdFx0bGV0IGh0bWxNYXJrZXIgPSBUd2lnLnJlbmRlcihiaW9wZW5fdHdpZ0pzX21hcmtlciwgXG5cdFx0e1xuXHRcdFx0ZWxlbWVudCA6IGVsZW1lbnQsIFxuXHRcdFx0bWFpbk9wdGlvblZhbHVlVG9EaXNwbGF5OiBvcHRpb25zdG9EaXNwbGF5WzBdLFxuXHRcdFx0b3RoZXJPcHRpb25zVmFsdWVzVG9EaXNwbGF5OiBvcHRpb25zdG9EaXNwbGF5LnNsaWNlKDEpLCBcblx0XHRcdHNob3dNb3JlSWNvbiA6IHNob3dNb3JlSWNvbixcblx0XHRcdGRpc2FibGVNYXJrZXIgOiBkaXNhYmxlTWFya2VyLFxuXHRcdFx0cGVuZGluZ0NsYXNzIDogZWxlbWVudC5pc1BlbmRpbmcoKSA/ICdwZW5kaW5nJyA6ICcnXG5cdFx0fSk7XG5cbiAgXHR0aGlzLmxlYWZsZXRNYXJrZXJfLnNldEljb24oTC5kaXZJY29uKHtjbGFzc05hbWU6ICdsZWFmbGV0LW1hcmtlci1jb250YWluZXInLCBodG1sOiBodG1sTWFya2VyfSkpO1x0XG5cbiAgXHRpZiAodGhpcy5pc0Rpc3BsYXllZE9uRWxlbWVudEluZm9CYXIoKSkgdGhpcy5zaG93QmlnU2l6ZSgpO1xuXG4gIFx0aWYgKHRoaXMuaW5jbGluYXRpb25fID09IFwicmlnaHRcIikgdGhpcy5pbmNsaW5hdGVSaWdodCgpO1xuICBcdGlmICh0aGlzLmluY2xpbmF0aW9uXyA9PSBcImxlZnRcIikgdGhpcy5pbmNsaW5hdGVMZWZ0KCk7XG5cdH07XG5cblx0cHJpdmF0ZSBhZGRDbGFzc1RvTGVhZmxldE1hcmtlcl8gKGNsYXNzVG9BZGQpIFxuXHR7XHRcdFxuXHRcdHRoaXMuZG9tTWFya2VyKCkuYWRkQ2xhc3MoY2xhc3NUb0FkZCk7XG5cdFx0dGhpcy5kb21NYXJrZXIoKS5zaWJsaW5ncygnLm1hcmtlci1uYW1lJykuYWRkQ2xhc3MoY2xhc3NUb0FkZCk7IFxuXHR9O1xuXG5cdHByaXZhdGUgcmVtb3ZlQ2xhc3NUb0xlYWZsZXRNYXJrZXJfIChjbGFzc1RvUmVtb3ZlKSBcblx0e1x0XHRcblx0XHR0aGlzLmRvbU1hcmtlcigpLnJlbW92ZUNsYXNzKGNsYXNzVG9SZW1vdmUpO1xuXHRcdHRoaXMuZG9tTWFya2VyKCkuc2libGluZ3MoJy5tYXJrZXItbmFtZScpLnJlbW92ZUNsYXNzKGNsYXNzVG9SZW1vdmUpOyAgICAgIFxuXHR9O1xuXG5cdHNob3dCaWdTaXplICgpIFxuXHR7XHRcdFx0XG5cdFx0dGhpcy5hZGRDbGFzc1RvTGVhZmxldE1hcmtlcl8oXCJCaWdTaXplXCIpO1xuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5wYXJlbnQoKS5maW5kKCcubWFya2VyLW5hbWUnKS5zaG93KCk7XG5cdFx0ZG9tTWFya2VyLmZpbmQoJy5tb3JlSWNvbkNvbnRhaW5lcicpLnNob3coKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLmljb24tcGx1cy1jaXJjbGUnKS5oaWRlKCk7XG5cdFx0XG5cdFx0aWYgKCF0aGlzLmlzSGFsZkhpZGRlbl8gJiYgdGhpcy5wb2x5bGluZV8pXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRQb2x5bGluZU9wdGlvbnMoe1xuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiAxLFxuXHRcdFx0XHRzdHJva2VXZWlnaHQ6IDNcblx0XHRcdH0pO1xuXHRcdH1cdFxuXHR9O1xuXG5cdHNob3dOb3JtYWxTaXplICgkZm9yY2UgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7XHRcblx0XHRpZiAoISRmb3JjZSAmJiB0aGlzLmlzRGlzcGxheWVkT25FbGVtZW50SW5mb0JhcigpKSByZXR1cm47XG5cblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHR0aGlzLnJlbW92ZUNsYXNzVG9MZWFmbGV0TWFya2VyXyhcIkJpZ1NpemVcIik7XG5cdFx0ZG9tTWFya2VyLnBhcmVudCgpLmZpbmQoJy5tYXJrZXItbmFtZScpLmhpZGUoKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLm1vcmVJY29uQ29udGFpbmVyJykuaGlkZSgpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcuaWNvbi1wbHVzLWNpcmNsZScpLnNob3coKTtcblx0XHRcblx0XHRpZiAoIXRoaXMuaXNIYWxmSGlkZGVuXyAmJiB0aGlzLnBvbHlsaW5lXylcblx0XHR7XG5cdFx0XHR0aGlzLnNldFBvbHlsaW5lT3B0aW9ucyh7XG5cdFx0XHRcdHN0cm9rZU9wYWNpdHk6IDAuNSxcblx0XHRcdFx0c3Ryb2tlV2VpZ2h0OiAzXG5cdFx0XHR9KTtcblx0XHR9XHRcblx0fTtcblxuXHRpbml0aWFsaXplSW5jbGluYXRpb24gKCkgXG5cdHtcdFxuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5jc3MoXCJ6LWluZGV4XCIsXCIxXCIpO1xuXHRcdGRvbU1hcmtlci5maW5kKFwiLnJvdGF0ZVwiKS5yZW1vdmVDbGFzcyhcInJvdGF0ZUxlZnRcIikucmVtb3ZlQ2xhc3MoXCJyb3RhdGVSaWdodFwiKTtcblx0XHRkb21NYXJrZXIucmVtb3ZlQ2xhc3MoXCJyb3RhdGVMZWZ0XCIpLnJlbW92ZUNsYXNzKFwicm90YXRlUmlnaHRcIik7XG5cdFx0dGhpcy5pbmNsaW5hdGlvbl8gPSBcIm5vcm1hbFwiO1xuXHR9O1xuXG5cdGluY2xpbmF0ZVJpZ2h0ICgpIFxuXHR7XHRcblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHRkb21NYXJrZXIuZmluZChcIi5yb3RhdGVcIikuYWRkQ2xhc3MoXCJyb3RhdGVSaWdodFwiKTtcblx0ICAgZG9tTWFya2VyLmFkZENsYXNzKFwicm90YXRlUmlnaHRcIik7XG5cdCAgIHRoaXMuaW5jbGluYXRpb25fID0gXCJyaWdodFwiO1xuXHR9O1xuXG5cdGluY2xpbmF0ZUxlZnQgKCkgXG5cdHtcdFxuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5maW5kKFwiLnJvdGF0ZVwiKS5hZGRDbGFzcyhcInJvdGF0ZUxlZnRcIik7XG5cdCAgIGRvbU1hcmtlci5hZGRDbGFzcyhcInJvdGF0ZUxlZnRcIik7XG5cdCAgIHRoaXMuaW5jbGluYXRpb25fID0gXCJsZWZ0XCI7XG5cdH07XG5cblxuXHRzZXRQb2x5bGluZU9wdGlvbnMgKG9wdGlvbnMpXG5cdHtcblx0XHRpZiAoIXRoaXMucG9seWxpbmVfLmlzRGFzaGVkKVxuXHRcdHtcblx0XHRcdHRoaXMucG9seWxpbmVfLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLnVwZGF0ZVBvbHlsaW5lKHtcblx0XHRcdFx0bGluZVR5cGUgOiAnZGFzaGVkJyAsIFxuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiBvcHRpb25zLnN0cm9rZU9wYWNpdHksXG5cdFx0XHRcdHN0cm9rZVdlaWdodDogb3B0aW9ucy5zdHJva2VXZWlnaHRcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0XHRcblx0dXBkYXRlUG9seWxpbmUgKG9wdGlvbnMpIFxuXHR7XG5cdFx0Ly8gaWYgKCF0aGlzLnBvbHlsaW5lXylcblx0XHQvLyB7XG5cdFx0Ly8gXHR0aGlzLnBvbHlsaW5lXyA9IGRyYXdMaW5lQmV0d2VlblBvaW50cyhBcHAuY29uc3RlbGxhdGlvbi5nZXRPcmlnaW4oKSwgdGhpcy5sZWFmbGV0TWFya2VyXy5nZXRQb3NpdGlvbigpLCB0aGlzLmdldEVsZW1lbnQoKS50eXBlLCBudWxsLCBvcHRpb25zKTtcblx0XHQvLyB9XG5cdFx0Ly8gZWxzZVxuXHRcdC8vIHtcdFx0XG5cdFx0Ly8gXHRsZXQgbWFwID0gdGhpcy5wb2x5bGluZV8uZ2V0TWFwKCk7XG5cdFx0Ly8gXHR0aGlzLnBvbHlsaW5lXy5zZXRNYXAobnVsbCk7XG5cdFx0Ly8gXHR0aGlzLnBvbHlsaW5lXyA9IGRyYXdMaW5lQmV0d2VlblBvaW50cyhBcHAuY29uc3RlbGxhdGlvbi5nZXRPcmlnaW4oKSwgdGhpcy5sZWFmbGV0TWFya2VyXy5nZXRQb3NpdGlvbigpLCB0aGlzLmdldEVsZW1lbnQoKS50eXBlLCBtYXAsIG9wdGlvbnMpO1x0XG5cdFx0Ly8gfVxuXHR9O1xuXG5cdHNob3dIYWxmSGlkZGVuICgkZm9yY2UgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7XHRcdFxuXHRcdGlmICghJGZvcmNlICYmIHRoaXMuaXNEaXNwbGF5ZWRPbkVsZW1lbnRJbmZvQmFyKCkpIHJldHVybjtcblxuXHRcdHRoaXMuYWRkQ2xhc3NUb0xlYWZsZXRNYXJrZXJfKFwiaGFsZkhpZGRlblwiKTtcblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHRkb21NYXJrZXIuY3NzKCd6LWluZGV4JywnMScpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcuaWNvbi1wbHVzLWNpcmNsZScpLmFkZENsYXNzKFwiaGFsZkhpZGRlblwiKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLm1vcmVJY29uQ29udGFpbmVyJykuYWRkQ2xhc3MoXCJoYWxmSGlkZGVuXCIpO1xuXHRcdGlmICh0aGlzLnBvbHlsaW5lXykgdGhpcy5zZXRQb2x5bGluZU9wdGlvbnMoe1xuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiAwLjEsXG5cdFx0XHRcdHN0cm9rZVdlaWdodDogMlxuXHRcdH0pO1xuXG5cdFx0dGhpcy5pc0hhbGZIaWRkZW5fID0gdHJ1ZTtcblx0fTtcblxuXHRzaG93Tm9ybWFsSGlkZGVuICgpIFxuXHR7XHRcdFxuXHRcdHRoaXMucmVtb3ZlQ2xhc3NUb0xlYWZsZXRNYXJrZXJfKFwiaGFsZkhpZGRlblwiKTtcblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHRkb21NYXJrZXIuY3NzKCd6LWluZGV4JywnMTAnKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLmljb24tcGx1cy1jaXJjbGUnKS5yZW1vdmVDbGFzcyhcImhhbGZIaWRkZW5cIik7XG5cdFx0ZG9tTWFya2VyLmZpbmQoJy5tb3JlSWNvbkNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGFsZkhpZGRlblwiKTtcblx0XHRcblx0XHRpZiAodGhpcy5wb2x5bGluZV8pIHRoaXMuc2V0UG9seWxpbmVPcHRpb25zKHtcblx0XHRcdFx0c3Ryb2tlT3BhY2l0eTogMC43LFxuXHRcdFx0XHRzdHJva2VXZWlnaHQ6IDNcblx0XHR9KTtcblxuXHRcdHRoaXMuaXNIYWxmSGlkZGVuXyA9IGZhbHNlO1xuXHR9O1xuXG5cdGdldElkICgpIDogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWRfOyB9O1xuXG5cdGdldExlYWZsZXRNYXJrZXIgKCkgOiBMLk1hcmtlciB7IHJldHVybiB0aGlzLmxlYWZsZXRNYXJrZXJfOyB9O1xuXG5cdGlzSGFsZkhpZGRlbigpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzSGFsZkhpZGRlbl87IH1cblxuXHRnZXRFbGVtZW50ICgpIDogRWxlbWVudCB7IHJldHVybiBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZCh0aGlzLmlkXyk7IH07XG5cblx0Y2hlY2tQb2x5bGluZVZpc2liaWxpdHlfIChjb250ZXh0KSBcblx0e1x0XHRcblx0XHRpZiAoY29udGV4dC5sZWFmbGV0TWFya2VyXyA9PT0gbnVsbCkgcmV0dXJuO1xuXHRcdC8vd2luZG93LmNvbnNvbGUubG9nKFwiY2hlY2tQb2x5bGluZVZpc2liaWxpdHlfIFwiICsgY29udGV4dC5sZWFmbGV0TWFya2VyXy5nZXRWaXNpYmxlKCkpO1xuXHRcdGNvbnRleHQucG9seWxpbmVfLnNldFZpc2libGUoY29udGV4dC5sZWFmbGV0TWFya2VyXy5nZXRWaXNpYmxlKCkpO1x0XG5cdFx0Y29udGV4dC5wb2x5bGluZV8uc2V0TWFwKGNvbnRleHQubGVhZmxldE1hcmtlcl8uZ2V0TWFwKCkpO1x0XG5cblx0XHRpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucykgXG5cdFx0e1xuXHRcdFx0Y29udGV4dC5wb2x5bGluZV8uc2V0TWFwKG51bGwpO1x0XG5cdFx0XHRjb250ZXh0LnBvbHlsaW5lXy5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHR9XHRcblx0fTtcblxuXHRzaG93ICgpIFxuXHR7XHRcblx0XHQvL0FwcC5tYXBDb21wb25lbnQuYWRkTWFya2VyKHRoaXMubGVhZmxldE1hcmtlcl8pO1xuXHRcdC8vdGhpcy5sZWFmbGV0TWFya2VyXy5hZGRUbyhBcHAubWFwKCkpO1xuXHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIHRoaXMucG9seWxpbmVfLnNldE1hcChBcHAubWFwKCkpO1xuXHR9O1xuXG5cdGhpZGUgKCkgXG5cdHtcdFx0XHRcblx0XHQvL0FwcC5tYXBDb21wb25lbnQucmVtb3ZlTWFya2VyKHRoaXMubGVhZmxldE1hcmtlcl8pO1xuXHRcdC8vdGhpcy5sZWFmbGV0TWFya2VyXy5yZW1vdmUoKTtcblx0XHRpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSB0aGlzLnBvbHlsaW5lXy5zZXRNYXAobnVsbCk7XG5cdH07XG5cblx0c2V0VmlzaWJsZSAoYm9vbCA6IGJvb2xlYW4pIFxuXHR7XHRcblx0XHQvL3RoaXMubGVhZmxldE1hcmtlcl8uc2V0VmlzaWJsZShib29sKTtcblx0XHRpZiAoYm9vbCkgdGhpcy5zaG93KCk7XG5cdFx0ZWxzZSB0aGlzLmhpZGUoKTtcblx0fTtcblxuXHRnZXRQb3NpdGlvbiAoKSA6IEwuTGF0TG5nXG5cdHtcdFxuXHRcdHJldHVybiB0aGlzLmxlYWZsZXRNYXJrZXJfLmdldExhdExuZygpO1xuXHR9O1xufVxuXG4iLCJcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uLy4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZXZlbnRcIjtcbmltcG9ydCB7IGluaXRBdXRvQ29tcGxldGlvbkZvckVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vLi4vY29tbW9ucy9zZWFyY2gtYmFyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgaW5pdENsdXN0ZXIgfSBmcm9tIFwiLi9jbHVzdGVyL2luaXQtY2x1c3RlclwiO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgc2x1Z2lmeSB9IGZyb20gXCIuLi8uLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IEdlb2NvZGVSZXN1bHQsIFJhd0JvdW5kcyB9IGZyb20gXCIuLi8uLi9tb2R1bGVzL2dlb2NvZGVyLm1vZHVsZVwiO1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJsZWFmbGV0XCIgLz5cblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSB2YXIgJCwgTCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIFZpZXdQb3J0XG57XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBsYXQgOiBudW1iZXIgPSAwLCBcblx0XHRcdFx0XHRwdWJsaWMgbG5nIDpudW1iZXIgPSAwLCBcblx0XHRcdFx0XHRwdWJsaWMgem9vbSA6IG51bWJlciA9IDApXG5cdHtcblx0XHR0aGlzLmxhdCA9IGxhdCB8fCAwO1xuXHRcdHRoaXMubG5nID0gbG5nIHx8IDA7XG5cdFx0dGhpcy56b29tID0gem9vbSB8fCAwO1xuXHR9XG5cblx0dG9TdHJpbmcoKVxuXHR7XG5cdFx0bGV0IGRpZ2l0cyA9IHRoaXMuem9vbSA+IDE0ID8gNCA6IDI7XG5cdFx0cmV0dXJuIGBAJHt0aGlzLmxhdC50b0ZpeGVkKGRpZ2l0cyl9LCR7dGhpcy5sbmcudG9GaXhlZChkaWdpdHMpfSwke3RoaXMuem9vbX16YDtcblx0fVxuXG5cdGZyb21TdHJpbmcoc3RyaW5nIDogc3RyaW5nKVxuXHR7XG5cdFx0aWYgKCFzdHJpbmcpIHJldHVybiBudWxsO1xuXG5cdFx0bGV0IGRlY29kZSA9IHN0cmluZy5zcGxpdCgnQCcpLnBvcCgpLnNwbGl0KCcsJyk7XG5cdFx0aWYgKGRlY29kZS5sZW5ndGggIT0gMykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJWaWV3UG9ydCBmcm9tU3RyaW5nIGVycmV1clwiLCBzdHJpbmcpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdHRoaXMubGF0ID0gcGFyc2VGbG9hdChkZWNvZGVbMF0pO1xuXHRcdHRoaXMubG5nID0gcGFyc2VGbG9hdChkZWNvZGVbMV0pO1xuXHRcdHRoaXMuem9vbSA9IHBhcnNlSW50KGRlY29kZVsyXS5zbGljZSgwLC0xKSk7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiVmlld1BvcnQgZnJvbVN0cmluZyBEb25lXCIsIHRoaXMpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuXG4vKipcbiogVGhlIE1hcCBDb21wb25lbnQgd2hvIGVuY2Fwc3VsYXRlIHRoZSBtYXBcbipcbiogTWFwQ29tcG9uZW50IHB1YmxpY3MgbWV0aG9kcyBtdXN0IGJlIGFzIGluZGVwZW5kYW50IGFzIHBvc3NpYmxlXG4qIGZyb20gdGVjaG5vbG9neSB1c2VkIGZvciB0aGUgbWFwIChnb29nbGUsIGxlYWZsZXQgLi4uKVxuKlxuKiBNYXAgY29tcG9uZW50IGlzIGxpa2UgYW4gaW50ZXJmYWNlIGJldHdlZW4gdGhlIG1hcCBhbmQgdGhlIHJlc3Qgb2YgdGhlIEFwcFxuKi9cbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnRcbntcblx0b25NYXBSZWFkeSA9IG5ldyBFdmVudDxhbnk+KCk7XG5cdG9uTWFwTG9hZGVkID0gbmV3IEV2ZW50PGFueT4oKTtcblx0b25DbGljayA9IG5ldyBFdmVudDxhbnk+KCk7XG5cdG9uSWRsZSA9IG5ldyBFdmVudDxhbnk+KCk7XG5cblx0Ly9MZWFmbGV0IG1hcFxuXHRtYXBfIDogTC5NYXAgPSBudWxsO1xuXG5cdG1hcmtlckNsdXN0ZXJlckdyb3VwO1xuXHRpc0luaXRpYWxpemVkIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRpc01hcExvYWRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcblx0b2xkWm9vbSA9IC0xO1xuXHR2aWV3cG9ydCA6IFZpZXdQb3J0ID0gbnVsbDtcblxuXHRnZXRNYXAoKXsgcmV0dXJuIHRoaXMubWFwXzsgfTsgXG5cdGdldENlbnRlcigpIDogTC5MYXRMbmcgeyByZXR1cm4gdGhpcy52aWV3cG9ydCA/IEwubGF0TG5nKHRoaXMudmlld3BvcnQubGF0LCB0aGlzLnZpZXdwb3J0LmxuZykgOiBudWxsOyB9XG5cdGdldEJvdW5kcygpIDogTC5MYXRMbmdCb3VuZHMgeyByZXR1cm4gdGhpcy5pc01hcExvYWRlZCA/IHRoaXMubWFwXy5nZXRCb3VuZHMoKSA6IG51bGw7IH1cblx0Z2V0Wm9vbSgpIHsgcmV0dXJuIHRoaXMubWFwXy5nZXRab29tKCk7IH1cblx0Z2V0T2xkWm9vbSgpIHsgcmV0dXJuIHRoaXMub2xkWm9vbTsgfVxuXG5cdGluaXQoKSBcblx0e1x0XG5cdFx0Ly9pbml0QXV0b0NvbXBsZXRpb25Gb3JFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJykpO1xuXHRcdGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIFxuXHRcdHtcblx0XHRcdHRoaXMucmVzaXplKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5tYXBfID0gTC5tYXAoJ2RpcmVjdG9yeS1jb250ZW50LW1hcCcsIHtcblx0XHQgICAgem9vbUNvbnRyb2w6IGZhbHNlXG5cdFx0fSk7XG5cblx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlckdyb3VwID0gTC5tYXJrZXJDbHVzdGVyR3JvdXAoe1xuXHRcdCAgICBzcGlkZXJmeU9uTWF4Wm9vbTogdHJ1ZSxcblx0XHQgICAgc2hvd0NvdmVyYWdlT25Ib3ZlcjogZmFsc2UsXG5cdFx0ICAgIHpvb21Ub0JvdW5kc09uQ2xpY2s6IHRydWUsXG5cdFx0ICAgIHNwaWRlcmZ5T25Ib3ZlcjogZmFsc2UsXG5cdFx0ICAgIHNwaWRlcmZ5TWF4Q291bnQ6IDQsXG5cdFx0ICAgIHNwaWRlcmZ5RGlzdGFuY2VNdWx0aXBsaWVyOiAxLjEsXG5cdFx0ICAgIGNodW5rZWRMb2FkaW5nOiB0cnVlLFxuXHRcdCAgICBtYXhDbHVzdGVyUmFkaXVzOiAoem9vbSkgPT5cblx0XHQgICAge1xuXHRcdCAgICBcdGlmICh6b29tID4gMTApIHJldHVybiA0MDtcblx0XHQgICAgXHRpZiAoem9vbSA+IDcpIHJldHVybiA3NTtcblx0XHQgICAgXHRlbHNlIHJldHVybiAxMDA7XG5cdFx0ICAgIH1cblx0XHR9KTtcblxuXHRcdHRoaXMuYWRkTWFya2VyQ2x1c3Rlckdyb3VwKCk7XHRcdFxuXG5cdFx0TC5jb250cm9sLnpvb20oe1xuXHRcdCAgIHBvc2l0aW9uOid0b3ByaWdodCdcblx0XHR9KS5hZGRUbyh0aGlzLm1hcF8pO1xuXG5cdFx0TC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zdHJlZXRzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYzJWaVlXeHNiM1FpTENKaElqb2lZMmw0TUd0bmVHVmpNREYwYURKNmNXTnRkV0Z2YzJZM1lTSjkubklacjZHMnQwOGV0TXpmdF9CSEhVUScpLmFkZFRvKHRoaXMubWFwXyk7XG5cblx0XHR0aGlzLm1hcF8ub24oJ2NsaWNrJywgKGUpID0+IHsgdGhpcy5vbkNsaWNrLmVtaXQoKTsgfSk7XG5cdFx0dGhpcy5tYXBfLm9uKCdtb3ZlZW5kJywgKGUpID0+IFxuXHRcdHsgXG5cdFx0XHR0aGlzLm9sZFpvb20gPSB0aGlzLm1hcF8uZ2V0Wm9vbSgpO1xuXHRcdFx0dGhpcy51cGRhdGVWaWV3UG9ydCgpO1xuXHRcdFx0QXBwLmJvdW5kc01vZHVsZS5leHRlbmRCb3VuZHMoMC4yLCB0aGlzLm1hcF8uZ2V0Qm91bmRzKCkpO1xuXHRcdFx0dGhpcy5vbklkbGUuZW1pdCgpOyBcblx0XHR9KTtcblx0XHR0aGlzLm1hcF8ub24oJ2xvYWQnLCAoZSkgPT4geyB0aGlzLmlzTWFwTG9hZGVkID0gdHJ1ZTsgdGhpcy5vbk1hcExvYWRlZC5lbWl0KCk7IH0pO1xuXG5cdFx0dGhpcy5yZXNpemUoKTtcblxuXHRcdC8vIGlmIHdlIGJlZ2FuIHdpdGggTGlzdCBNb2RlLCB3aGVuIHdlIGluaXRpYWxpemUgbWFwXG5cdFx0Ly8gdGhlcmUgaXMgYWxyZWFkeSBhbiBhZGRyZXNzIGdlb2NvZGVkIG9yIGEgdmlld3BvcnQgZGVmaW5lZFxuXHRcdGlmIChBcHAgJiYgQXBwLmdlb2NvZGVyLmdldEJvdW5kcygpKVxuXHRcdHtcblx0XHRcdHRoaXMuZml0Qm91bmRzKEFwcC5nZW9jb2Rlci5nZXRCb3VuZHMoKSwgZmFsc2UpO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0aGlzLnZpZXdwb3J0KVxuXHRcdHtcblx0XHRcdC8vIHNldFRpbWVvdXQgd2FpdGluZyBmb3IgdGhlIG1hcCB0byBiZSByZXNpemVkXG5cdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IHRoaXMuc2V0Vmlld1BvcnQodGhpcy52aWV3cG9ydCk7IH0sMjAwKTtcblx0XHR9XG5cblx0XHR0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdC8vY29uc29sZS5sb2coXCJtYXAgaW5pdCBkb25lXCIpO1xuXHRcdHRoaXMub25NYXBSZWFkeS5lbWl0KCk7XG5cdH07XG5cblx0YWRkTWFya2VyQ2x1c3Rlckdyb3VwKCkgeyB0aGlzLm1hcF8uYWRkTGF5ZXIodGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cCk7IH1cblxuXHRyZXNpemUoKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIlJlc2l6ZSwgY3VyciB2aWV3cG9ydCA6XCIpO1xuXHRcdC8vIFdhcm5pbmcgIUkgY2hhbmdlZCB0aGUgbGVhZmxldC5qcyBmaWxlIGxpYnJhcnkgbXlzZWxmXG5cdFx0Ly8gYmVjYXVzZSB0aGUgb3B0aW9ucyBkb2Vzbid0IHdvcmsgcHJvcGVybHlcblx0XHQvLyBJIGNoYW5nZWQgaXQgdG8gYXZvaSBwYW5uaW5nIHdoZW4gcmVzaXppbmcgdGhlIG1hcFxuXHRcdC8vIGJlIGNhcmVmdWwgaWYgdXBkYXRpbmcgdGhlIGxlYWZsZXQgbGlicmFyeSB0aGlzIHdpbGxcblx0XHQvLyBub3Qgd29yayBhbnltb3JlXG5cdFx0aWYgKHRoaXMubWFwXykgdGhpcy5tYXBfLmludmFsaWRhdGVTaXplKGZhbHNlKTtcblxuXHR9XG5cblx0YWRkTWFya2VyKG1hcmtlciA6IEwuTWFya2VyKVxuXHR7XG5cdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cC5hZGRMYXllcihtYXJrZXIpO1xuXHR9XG5cblx0YWRkTWFya2VycyhtYXJrZXJzIDogTC5NYXJrZXJbXSlcblx0e1xuXHRcdGlmICh0aGlzLm1hcmtlckNsdXN0ZXJlckdyb3VwKSB0aGlzLm1hcmtlckNsdXN0ZXJlckdyb3VwLmFkZExheWVycyhtYXJrZXJzKTtcblx0fVxuXG5cdHJlbW92ZU1hcmtlcihtYXJrZXIgOiBMLk1hcmtlcilcblx0e1xuXHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXAucmVtb3ZlTGF5ZXIobWFya2VyKTtcblx0fVxuXG5cdHJlbW92ZU1hcmtlcnMobWFya2VycyA6IEwuTWFya2VyW10pXG5cdHtcblx0XHRpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cCkgdGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cC5yZW1vdmVMYXllcnMobWFya2Vycyk7XG5cdH1cblxuXHQvLyBmaXQgbWFwIHZpZXcgdG8gYm91bmRzXG5cdGZpdEJvdW5kcyhib3VuZHMgOiBMLkxhdExuZ0JvdW5kcywgYW5pbWF0ZSA6IGJvb2xlYW4gPSB0cnVlKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImZpdGJvdW5kc1wiLCBib3VuZHMpO1xuXHRcdFxuXHRcdGlmICh0aGlzLmlzTWFwTG9hZGVkICYmIGFuaW1hdGUpIEFwcC5tYXAoKS5mbHlUb0JvdW5kcyhib3VuZHMpO1xuXHRcdGVsc2UgQXBwLm1hcCgpLmZpdEJvdW5kcyhib3VuZHMpO1xuXHR9XHRcdFxuXG5cdHBhblRvTG9jYXRpb24obG9jYXRpb24gOiBMLkxhdExuZywgem9vbT8sIGFuaW1hdGUgOiBib29sZWFuID0gdHJ1ZSlcblx0e1xuXHRcdHpvb20gPSB6b29tIHx8IHRoaXMuZ2V0Wm9vbSgpIHx8IDEyO1xuXHRcdGNvbnNvbGUubG9nKFwicGFuVG9sb2NhdGlvblwiLCBsb2NhdGlvbik7XG5cblx0XHRpZiAodGhpcy5pc01hcExvYWRlZCAmJiBhbmltYXRlKSB0aGlzLm1hcF8uZmx5VG8obG9jYXRpb24sIHpvb20pO1xuXHRcdGVsc2UgdGhpcy5tYXBfLnNldFZpZXcobG9jYXRpb24sIHpvb20pO1xuXHR9O1xuXG5cdC8vIHRoZSBhY3R1YWwgZGlzcGxheWVkIG1hcCByYWRpdXMgKGRpc3RhbmNlIGZyb20gY3JvbmVyIHRvIGNlbnRlcilcblx0bWFwUmFkaXVzSW5LbSgpIDogbnVtYmVyXG5cdHtcblx0XHRpZiAoIXRoaXMuaXNNYXBMb2FkZWQpIHJldHVybiAwO1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMubWFwXy5nZXRCb3VuZHMoKS5nZXROb3J0aEVhc3QoKS5kaXN0YW5jZVRvKHRoaXMubWFwXy5nZXRDZW50ZXIoKSkgLyAxMDAwKTtcblx0fVxuXG5cdC8vIGRpc3RhbmNlIGZyb20gbGFzdCBzYXZlZCBsb2NhdGlvbiB0byBhIHBvc2l0aW9uXG5cdGRpc3RhbmNlRnJvbUxvY2F0aW9uVG8ocG9zaXRpb24gOiBMLkxhdExuZylcblx0e1xuXHRcdGlmICghQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpIHJldHVybiBudWxsO1xuXHRcdHJldHVybiBBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKS5kaXN0YW5jZVRvKHBvc2l0aW9uKSAvIDEwMDA7XG5cdH1cblxuXHRjb250YWlucyhwb3NpdGlvbiA6IEwuTGF0TG5nRXhwcmVzc2lvbikgOiBib29sZWFuXG5cdHtcblx0XHRpZiAocG9zaXRpb24pXG5cdFx0e1xuXHRcdFx0IHJldHVybiB0aGlzLm1hcF8uZ2V0Qm91bmRzKCkuY29udGFpbnMocG9zaXRpb24pO1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIk1hcENvbXBvbmVudC0+Y29udGFpbnMgOiBtYXAgbm90IGxvYWRlZCBvciBlbGVtZW50IHBvc2l0aW9uIHVuZGVmaW5lZFwiKTtcblx0XHRyZXR1cm4gZmFsc2U7XHRcdFxuXHR9XG5cblx0ZXh0ZW5kZWRDb250YWlucyhwb3NpdGlvbiA6IEwuTGF0TG5nRXhwcmVzc2lvbikgOiBib29sZWFuXG5cdHtcblx0XHRpZiAodGhpcy5pc01hcExvYWRlZCAmJiBwb3NpdGlvbilcblx0XHR7XG5cdFx0XHQgcmV0dXJuIEFwcC5ib3VuZHNNb2R1bGUuZXh0ZW5kZWRCb3VuZHMuY29udGFpbnMocG9zaXRpb24pO1xuXHRcdH1cblx0XHQvL2NvbnNvbGUubG9nKFwiTWFwQ29tcG9uZW50LT5jb250YWlucyA6IG1hcCBub3QgbG9hZGVkIG9yIGVsZW1lbnQgcG9zaXRpb24gdW5kZWZpbmVkXCIpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHVwZGF0ZVZpZXdQb3J0KClcblx0e1xuXHRcdGlmICghdGhpcy52aWV3cG9ydCkgdGhpcy52aWV3cG9ydCA9IG5ldyBWaWV3UG9ydCgpO1xuXHRcdHRoaXMudmlld3BvcnQubGF0ID0gIHRoaXMubWFwXy5nZXRDZW50ZXIoKS5sYXQ7XG5cdFx0dGhpcy52aWV3cG9ydC5sbmcgPSAgdGhpcy5tYXBfLmdldENlbnRlcigpLmxuZztcblx0XHR0aGlzLnZpZXdwb3J0Lnpvb20gPSB0aGlzLmdldFpvb20oKTtcblx0fVx0XG5cblx0c2V0Vmlld1BvcnQoJHZpZXdwb3J0IDogVmlld1BvcnQsICRwYW5NYXBUb1ZpZXdwb3J0IDogYm9vbGVhbiA9IHRydWUpXG5cdHtcdFx0XG5cdFx0aWYgKHRoaXMubWFwXyAmJiAkdmlld3BvcnQgJiYgJHBhbk1hcFRvVmlld3BvcnQpXG5cdFx0e1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInNldFZpZXdQb3J0XCIsICR2aWV3cG9ydCk7XG5cdFx0XHRsZXQgdGltZW91dCA9IEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSA/IDUwMCA6IDA7XG5cdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IHRoaXMubWFwXy5zZXRWaWV3KEwubGF0TG5nKCR2aWV3cG9ydC5sYXQsICR2aWV3cG9ydC5sbmcpLCAkdmlld3BvcnQuem9vbSkgfSwgdGltZW91dCk7XG5cdFx0fVxuXHRcdHRoaXMudmlld3BvcnQgPSAkdmlld3BvcnQ7XG5cdH1cblxuXHRoaWRlUGFydGlhbGx5Q2x1c3RlcnMoKVxuXHR7XG5cdFx0JCgnLm1hcmtlci1jbHVzdGVyJykuYWRkQ2xhc3MoJ2hhbGZIaWRkZW4nKTtcblx0fVxuXG5cdHNob3dOb3JtYWxIaWRkZW5DbHVzdGVycygpXG5cdHtcblx0XHQkKCcubWFya2VyLWNsdXN0ZXInKS5yZW1vdmVDbGFzcygnaGFsZkhpZGRlbicpO1xuXHR9XG59XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuXG5kZWNsYXJlIGxldCBncmVjYXB0Y2hhO1xuZGVjbGFyZSB2YXIgJCA6IGFueTtcbmRlY2xhcmUgbGV0IFJvdXRpbmcgOiBhbnk7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBnZXRDdXJyZW50RWxlbWVudElkU2hvd24sIGdldEN1cnJlbnRFbGVtZW50SW5mb0JhclNob3duIH0gZnJvbSBcIi4vZWxlbWVudC1tZW51LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQWpheE1vZHVsZSB9IGZyb20gXCIuLi9tb2R1bGVzL2FqYXgubW9kdWxlXCI7XG5pbXBvcnQgeyB1cGRhdGVJbmZvQmFyU2l6ZSB9IGZyb20gXCIuLi9hcHAtaW50ZXJhY3Rpb25zXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgc2x1Z2lmeSB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVWb3RpbmcoKVxue1x0XG5cdC8vY29uc29sZS5sb2coXCJpbml0aWFsaXplIHZvdGVcIik7XHRcblxuXHQkKFwiLnZhbGlkYXRpb24tcHJvY2Vzcy1pbmZvXCIpLmNsaWNrKCAoZSkgPT4gXG5cdHtcblx0XHQkKFwiI3BvcHVwLXZvdGVcIikub3Blbk1vZGFsKCk7XHRcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gIFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcdFxuXG5cdCQoJyNtb2RhbC12b3RlICNzdWJtaXQtdm90ZScpLmNsaWNrKCgpID0+IFxuXHR7XG5cdFx0bGV0IHZvdGVWYWx1ZSA9ICQoJy52b3RlLW9wdGlvbi1yYWRpby1idG46Y2hlY2tlZCcpLmF0dHIoJ3ZhbHVlJyk7XG5cblx0XHQkKCcjbW9kYWwtdm90ZSAjc2VsZWN0LWVycm9yJykuaGlkZSgpO1xuXHRcdFxuXHRcdGlmICh2b3RlVmFsdWUpXG5cdFx0e1x0XHRcdFxuXHRcdFx0bGV0IGVsZW1lbnRJZCA9IGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpO1x0XG5cdFx0XHRsZXQgY29tbWVudCA9ICQoJyNtb2RhbC12b3RlIC5pbnB1dC1jb21tZW50JykudmFsKCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZCB2b3RlIFwiICt2b3RlVmFsdWUgKyBcIiB0byBlbGVtZW50IGlkIFwiLCBlbGVtZW50SWQpO1xuXG5cdFx0XHRBcHAuYWpheE1vZHVsZS52b3RlKGVsZW1lbnRJZCwgdm90ZVZhbHVlLCBjb21tZW50LCAoc3VjY2Vzc01lc3NhZ2UpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiLCBzdWNjZXNzTWVzc2FnZSk7XG5cdFx0XHRcdCQoJyNtb2RhbC12b3RlJykuY2xvc2VNb2RhbCgpO1xuXHRcdFx0XHRsZXQgZWxlbWVudEluZm8gPSBnZXRDdXJyZW50RWxlbWVudEluZm9CYXJTaG93bigpO1xuXHRcdFx0XHRlbGVtZW50SW5mby5maW5kKFwiLnZvdGUtc2VjdGlvblwiKS5maW5kKCcuYmFzaWMtbWVzc2FnZScpLmhpZGUoKTtcdFx0XHRcdFxuXHRcdFx0XHRlbGVtZW50SW5mby5maW5kKCcucmVzdWx0LW1lc3NhZ2UnKS50ZXh0KHN1Y2Nlc3NNZXNzYWdlKS5zaG93KCk7XG5cdFx0XHRcdHVwZGF0ZUluZm9CYXJTaXplKCk7XG5cblx0XHRcdH0sXG5cdFx0XHQoZXJyb3JNZXNzYWdlKSA9PiBcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJlcnJvclwiLCBlcnJvck1lc3NhZ2UpO1xuXHRcdFx0XHQkKCcjbW9kYWwtdm90ZSAjc2VsZWN0LWVycm9yJykudGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcblx0XHRcdH0pO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0JCgnI21vZGFsLXZvdGUgI3NlbGVjdC1lcnJvcicpLnNob3coKTtcblx0XHR9XG5cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMaXN0ZW5lcnNGb3JWb3RpbmcoKVxue1xuXHQkKFwiLnZvdGUtYnV0dG9uXCIpLmNsaWNrKCBmdW5jdGlvbihlKVxuXHR7XG5cdFx0aWYgKCQoJyNidG4tbG9naW4nKS5pcygnOnZpc2libGUnKSkgXG5cdFx0e1xuXHRcdFx0JCgnI3BvcHVwLWxvZ2luJykub3Blbk1vZGFsKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpKTtcblxuXHRcdFx0JCgnLnZvdGUtb3B0aW9uLXJhZGlvLWJ0bjpjaGVja2VkJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcblx0XHRcdCQoJyNtb2RhbC12b3RlIC5pbnB1dC1jb21tZW50JykudmFsKFwiXCIpO1xuXHRcdFx0JCgnI21vZGFsLXZvdGUgI3NlbGVjdC1lcnJvcicpLmhpZGUoKTtcblx0XHRcdCQoJyNtb2RhbC12b3RlIC5lbGVtZW50TmFtZScpLnRleHQoY2FwaXRhbGl6ZShlbGVtZW50Lm5hbWUpKTtcblxuXHRcdFx0JCgnI21vZGFsLXZvdGUnKS5vcGVuTW9kYWwoe1xuXHRcdCAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdFx0ICAgIG9wYWNpdHk6IDAuNSwgXG5cdFx0ICAgIGluX2R1cmF0aW9uOiAzMDAsIFxuXHRcdCAgICBvdXRfZHVyYXRpb246IDIwMFxuXHRcdFx0fSk7XHRcblx0XHR9XHRcdFx0XG5cblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gIFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSB2YXIgJCA6IGFueTtcbmRlY2xhcmUgbGV0IFJvdXRpbmc7XG5cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0XG57XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyByb3V0ZSA6IHN0cmluZywgcHVibGljIGRhdGEgOiBhbnkpXG5cdHtcblx0fTtcbn1cblxuZXhwb3J0IGNsYXNzIERhdGFBcm91bmRSZXF1ZXN0XG57XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBvcmlnaW5MYXQgOiBudW1iZXIsIHB1YmxpYyBvcmlnaW5MbmcgOiBudW1iZXIsIHB1YmxpYyBkaXN0YW5jZSA6bnVtYmVyLCBwdWJsaWMgbWF4UmVzdWx0cyA6IG51bWJlciwgcHVibGljIG1haW5PcHRpb25JZCA6IG51bWJlcilcblx0e1xuXHR9O1xufVxuXG5leHBvcnQgY2xhc3MgQWpheE1vZHVsZVxue1xuXHRvbk5ld0VsZW1lbnRzID0gbmV3IEV2ZW50PGFueVtdPigpO1xuXG5cdGlzUmV0cmlldmluZ0VsZW1lbnRzIDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdHJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkIDogYm9vbGVhbiA9IGZhbHNlO1xuXHR3YWl0aW5nUmVxdWVzdCA6IFJlcXVlc3QgPSBudWxsO1xuXG5cdGN1cnJSZXF1ZXN0IDogUmVxdWVzdCA9IG51bGw7XG5cblx0bG9hZGVyVGltZXIgPSBudWxsO1xuXG5cdGFsbEVsZW1lbnRzUmVjZWl2ZWQgPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcigpIHsgfSAgXG5cblx0Z2V0RWxlbWVudHNBcm91bmRMb2NhdGlvbigkbG9jYXRpb24sICRkaXN0YW5jZSwgJG1heFJlc3VsdHMgPSAwKVxuXHR7XG5cdFx0Ly8gaWYgaW52YWxpZCBsb2NhdGlvbiB3ZSBhYm9ydFxuXHRcdGlmICghJGxvY2F0aW9uIHx8ICEkbG9jYXRpb24ubGF0KSBcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkFqYXggaW52YWxpZCByZXF1ZXN0XCIsICRsb2NhdGlvbik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGFSZXF1ZXN0ID0gbmV3IERhdGFBcm91bmRSZXF1ZXN0KCRsb2NhdGlvbi5sYXQsICRsb2NhdGlvbi5sbmcsICRkaXN0YW5jZSwgJG1heFJlc3VsdHMsIEFwcC5jdXJyTWFpbklkKTtcblx0XHRsZXQgcm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fYXBpX2VsZW1lbnRzX2Fyb3VuZF9sb2NhdGlvbicpO1x0XG5cdFx0XG5cdFx0dGhpcy5zZW5kQWpheEVsZW1lbnRSZXF1ZXN0KG5ldyBSZXF1ZXN0KHJvdXRlLCBkYXRhUmVxdWVzdCkpO1xuXHR9XG5cblx0Z2V0RWxlbWVudHNJbkJvdW5kcygkYm91bmRzIDogTC5MYXRMbmdCb3VuZHNbXSlcblx0e1xuXHRcdC8vIGlmIGludmFsaWQgbG9jYXRpb24gd2UgYWJvcnRcblx0XHRpZiAoISRib3VuZHMgfHwgJGJvdW5kcy5sZW5ndGggPT0gMCB8fCAhJGJvdW5kc1swXSkgXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJBamF4IGludmFsaWQgcmVxdWVzdFwiLCAkYm91bmRzKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly9jb25zb2xlLmxvZygkYm91bmRzKTtcblxuXHRcdGxldCBzdHJpbmdpZmllZEJvdW5kcyA9IFwiXCI7XG5cblx0XHRmb3IgKGxldCBib3VuZCBvZiAkYm91bmRzKSBcblx0XHR7XG5cdFx0XHRzdHJpbmdpZmllZEJvdW5kcyArPSBib3VuZC50b0JCb3hTdHJpbmcoKSArIFwiO1wiO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhUmVxdWVzdCA6IGFueSA9IHsgYm91bmRzIDogc3RyaW5naWZpZWRCb3VuZHMsIG1haW5PcHRpb25JZCA6IEFwcC5jdXJyTWFpbklkIH07XG5cdFx0bGV0IHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2FwaV9lbGVtZW50c19pbl9ib3VuZHMnKTtcblx0XHRcblx0XHR0aGlzLnNlbmRBamF4RWxlbWVudFJlcXVlc3QobmV3IFJlcXVlc3Qocm91dGUsIGRhdGFSZXF1ZXN0KSk7XG5cdH1cblxuXHRwcml2YXRlIHNlbmRBamF4RWxlbWVudFJlcXVlc3QoJHJlcXVlc3QgOiBSZXF1ZXN0KVxuXHR7XG5cdFx0aWYgKHRoaXMuYWxsRWxlbWVudHNSZWNlaXZlZCkgeyBjb25zb2xlLmxvZyhcIkFsbCBlbGVtZW50cyBhbHJlYWR5IHJlY2VpdmVkXCIpOyByZXR1cm47IH1cblxuXHRcdGNvbnNvbGUubG9nKFwiQWpheCBzZW5kIGVsZW1lbnRzIHJlcXVlc3QgXCIsICRyZXF1ZXN0KTtcblxuXHRcdGlmICh0aGlzLmlzUmV0cmlldmluZ0VsZW1lbnRzKVxuXHRcdHtcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhcIkFqYXggaXNSZXRyaWV2aW5nXCIpO1xuXHRcdFx0dGhpcy5yZXF1ZXN0V2FpdGluZ1RvQmVFeGVjdXRlZCA9IHRydWU7XG5cdFx0XHR0aGlzLndhaXRpbmdSZXF1ZXN0ID0gJHJlcXVlc3Q7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuaXNSZXRyaWV2aW5nRWxlbWVudHMgPSB0cnVlO1xuXG5cdFx0dGhpcy5jdXJyUmVxdWVzdCA9ICRyZXF1ZXN0O1xuXG5cdFx0bGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHRcdFx0XG5cdFx0XG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogJHJlcXVlc3Qucm91dGUsXG5cdFx0XHRtZXRob2Q6IFwiZ2V0XCIsXG5cdFx0XHRkYXRhOiAkcmVxdWVzdC5kYXRhLFxuXHRcdFx0YmVmb3JlU2VuZDogKCkgPT5cblx0XHRcdHsgXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5sb2FkZXJUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICQoJyNkaXJlY3RvcnktbG9hZGluZycpLnNob3coKTsgfSwgMTUwMCk7IFxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IHJlc3BvbnNlID0+XG5cdFx0XHR7XHRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEgIT09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwicmVjZWl2ZSBcIiArIHJlc3BvbnNlLmRhdGEubGVuZ3RoICsgXCIgZWxlbWVudHMgaW4gXCIgKyAoZW5kLXN0YXJ0KSArIFwiIG1zLiBNZW1vcnkgc2l6ZSA6IFwiLCByZXNwb25zZS5zaXplKTtcdFx0XHRcdFxuXG5cdFx0XHRcdFx0dGhpcy5vbk5ld0VsZW1lbnRzLmVtaXQocmVzcG9uc2UuZGF0YSk7XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0ICBcblx0XHRcdCAgaWYgKHJlc3BvbnNlLmFsbEVsZW1lbnRzU2VuZHMpIHRoaXMuYWxsRWxlbWVudHNSZWNlaXZlZCA9IHRydWU7XG5cblx0XHRcdFx0Ly9pZiAocmVzcG9uc2UuZXhjZWVkTWF4UmVzdWx0ICYmICF0aGlzLnJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkKSB0aGlzLnNlbmRBamF4RWxlbWVudFJlcXVlc3QodGhpcy5jdXJyUmVxdWVzdCk7ICAgICBcblx0XHRcdH0sXG5cdFx0XHRjb21wbGV0ZTogKCkgPT5cblx0XHRcdHtcblx0XHRcdCAgdGhpcy5pc1JldHJpZXZpbmdFbGVtZW50cyA9IGZhbHNlO1xuXHRcdFx0ICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcik7XG5cdFx0XHQgIGlmICh0aGlzLnJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkKVxuXHRcdFx0ICB7XG5cdFx0XHQgIFx0IC8vY29uc29sZS5sb2coXCIgICAgcmVxdWVzdFdhaXRpbmdUb0JlRXhlY3V0ZWQgc3RvcmVkXCIsIHRoaXMud2FpdGluZ1JlcXVlc3QpO1xuXHRcdFx0ICBcdCB0aGlzLnNlbmRBamF4RWxlbWVudFJlcXVlc3QodGhpcy53YWl0aW5nUmVxdWVzdCk7XG5cdFx0XHQgIFx0IHRoaXMucmVxdWVzdFdhaXRpbmdUb0JlRXhlY3V0ZWQgPSBmYWxzZTtcblx0XHRcdCAgfVxuXHRcdFx0ICBlbHNlXG5cdFx0XHQgIHtcblx0XHRcdCAgXHQgLy9jb25zb2xlLmxvZyhcIkFqYXggcmVxdWVzdCBjb21wbGV0ZVwiKTtcdFx0XHQgIFx0IFxuXHRcdFx0XHQgJCgnI2RpcmVjdG9yeS1sb2FkaW5nJykuaGlkZSgpO1xuXHRcdFx0ICB9XG5cdFx0XHR9LFxuXHRcdH0pO1xuXHR9O1xuXG5cdGdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCwgY2FsbGJhY2tTdWNjZXNzPywgY2FsbGJhY2tGYWlsdXJlPylcblx0e1xuXHRcdGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGxldCByb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9hcGlfZWxlbWVudF9ieV9pZCcpO1xuXG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogcm91dGUsXG5cdFx0XHRtZXRob2Q6IFwicG9zdFwiLFxuXHRcdFx0ZGF0YTogeyBlbGVtZW50SWQ6IGVsZW1lbnRJZCB9LFxuXHRcdFx0c3VjY2VzczogcmVzcG9uc2UgPT4gXG5cdFx0XHR7XHQgICAgICAgIFxuXHRcdFx0XHRpZiAocmVzcG9uc2UpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0d2luZG93LmNvbnNvbGUubG9nKFwicmVjZWl2ZSBlbGVtZW50QnlJZCBpbiBcIiArIChlbmQtc3RhcnQpICsgXCIgbXNcIiwgcmVzcG9uc2UpO1x0XHRcdFxuXG5cdFx0XHRcdFx0aWYgKGNhbGxiYWNrU3VjY2VzcykgY2FsbGJhY2tTdWNjZXNzKHJlc3BvbnNlKTsgXG5cdFx0XHRcdFx0Ly90aGlzLm9uTmV3RWxlbWVudC5lbWl0KHJlc3BvbnNlKTtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHR9XHRcblx0XHRcdFx0ZWxzZSBpZiAoY2FsbGJhY2tGYWlsdXJlKSBjYWxsYmFja0ZhaWx1cmUocmVzcG9uc2UpOyBcdFx0XHRcdCAgICAgICBcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogcmVzcG9uc2UgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGNhbGxiYWNrRmFpbHVyZSkgY2FsbGJhY2tGYWlsdXJlKHJlc3BvbnNlKTsgXHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdHZvdGUoZWxlbWVudElkIDpudW1iZXIsIHZvdGVWYWx1ZSA6IG51bWJlciwgY29tbWVudCA6IHN0cmluZywgY2FsbGJhY2tTdWNjZXNzPywgY2FsbGJhY2tGYWlsdXJlPylcblx0e1xuXHRcdGxldCByb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl92b3RlX2Zvcl9lbGVtZW50Jyk7XG5cblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsOiByb3V0ZSxcblx0XHRcdG1ldGhvZDogXCJwb3N0XCIsXG5cdFx0XHRkYXRhOiB7IGVsZW1lbnRJZDogZWxlbWVudElkLCB2b3RlVmFsdWU6IHZvdGVWYWx1ZSwgY29tbWVudDogY29tbWVudCB9LFxuXHRcdFx0c3VjY2VzczogcmVzcG9uc2UgPT4gXG5cdFx0XHR7XHQgICAgICAgIFxuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzKVxuXHRcdFx0XHR7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChjYWxsYmFja1N1Y2Nlc3MpIGNhbGxiYWNrU3VjY2VzcyhyZXNwb25zZS5kYXRhKTsgXHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlIGlmIChjYWxsYmFja0ZhaWx1cmUpIGNhbGxiYWNrRmFpbHVyZShyZXNwb25zZS5kYXRhKTsgXHRcdFx0XHQgICAgICAgXG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IHJlc3BvbnNlID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmIChjYWxsYmFja0ZhaWx1cmUpIGNhbGxiYWNrRmFpbHVyZShyZXNwb25zZS5kYXRhKTsgXHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cbn0iLCJpbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmV4cG9ydCBjbGFzcyBCb3VuZHNNb2R1bGVcbntcblx0Ly8gd2UgZXh0ZW5kIHZpc2libGUgdmlleHBvcnQgdG8gbG9hZCBlbGVtZW50cyBvbiB0aGlzIGFyZWEsIHNvIHRoZSB1c2VyIHNlZSB0aGVtIGRpcmVjdGx5IHdoZW4gcGFubmluZyBvciB6b29tIG91dFxuXHRleHRlbmRlZEJvdW5kcyA6IEwuTGF0TG5nQm91bmRzO1xuXG5cdC8vIHRoZSBib3VuZHMgd2hlcmUgZWxlbWVudHMgaGFzIGFscmVhZHkgYmVlbiByZXRyaWV2ZWRcblx0Ly8gd2Ugc2F2ZSBvbmUgZmlsbGVkQm91bmQgcGVyIG1haW5PcHRpb25JZFxuXHRmaWxsZWRCb3VuZCA6IEwuTGF0TG5nQm91bmRzW10gPSBbXTtcblxuXHRpbml0aWFsaXplKClcblx0e1xuXHRcdGZvcihsZXQgbWFpbk9wdGlvbklkIG9mIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9uc0lkc1dpdGhBbGwoKSlcblx0XHR7XG5cdFx0XHR0aGlzLmZpbGxlZEJvdW5kW21haW5PcHRpb25JZF0gPSBudWxsO1xuXHRcdH1cblx0fVx0XG5cblx0Y3JlYXRlQm91bmRzRnJvbUxvY2F0aW9uKCRsb2NhdGlvbiA6IEwuTGF0TG5nLCAkcmFkaXVzID0gMzApXG5cdHtcblx0XHRsZXQgZGVncmVlID0gJHJhZGl1cyAvIDExMCAvIDI7XG5cdFx0dGhpcy5leHRlbmRlZEJvdW5kcyA9IEwubGF0TG5nQm91bmRzKEwubGF0TG5nKCRsb2NhdGlvbi5sYXQgLSBkZWdyZWUsICRsb2NhdGlvbi5sbmcgLSBkZWdyZWUpLCBMLmxhdExuZygkbG9jYXRpb24ubGF0ICsgZGVncmVlLCAkbG9jYXRpb24ubG5nICsgZGVncmVlKSApO1xuXHR9XG5cblx0ZXh0ZW5kQm91bmRzKCRyYXRpbyA6IG51bWJlciwgJGJvdW5kcyA6IEwuTGF0TG5nQm91bmRzID0gdGhpcy5leHRlbmRlZEJvdW5kcylcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJleHRlbmQgYm91bmRzXCIsICRib3VuZHMpO1xuXHRcdGlmICghJGJvdW5kcykgeyBjb25zb2xlLmxvZyhcImJvdW5kcyB1bmNvcnJlY3RcIiwgJGJvdW5kcyk7IHJldHVybjt9XG5cdFx0dGhpcy5leHRlbmRlZEJvdW5kcyA9ICRib3VuZHMucGFkKCRyYXRpbyk7XG5cdH1cblxuXHR1cGRhdGVGaWxsZWRCb3VuZHNBY2NvcmRpbmdUb05ld01haW5PcHRpb25JZCgpXG5cdHtcblx0XHRpZiAoQXBwLmN1cnJNYWluSWQgPT0gJ2FsbCcpXG5cdFx0e1xuXHRcdFx0Ly8gbGV0IG90aGVyc2ZpbGxlZEJvdW5kc05vdEVtcHR5ID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25zSWRzKCkubWFwKCAoaWQpID0+IHRoaXMuZmlsbGVkQm91bmRbaWRdKS5maWx0ZXIoIChib3VuZCkgPT4gYm91bmQgIT0gbnVsbCk7XG5cblx0XHRcdC8vIC8vIGdldHRpbmcgdGhlIHNtYWxsZXN0XG5cdFx0XHQvLyBsZXQgd2VzdCA9ICBNYXRoLm1heC5hcHBseShNYXRoLCBvdGhlcnNmaWxsZWRCb3VuZHNOb3RFbXB0eS5tYXAoIChib3VuZCkgPT4gYm91bmQuZ2V0V2VzdCgpKSk7XG5cdFx0XHQvLyBsZXQgc291dGggPSBNYXRoLm1heC5hcHBseShNYXRoLCBvdGhlcnNmaWxsZWRCb3VuZHNOb3RFbXB0eS5tYXAoIChib3VuZCkgPT4gYm91bmQuZ2V0U291dGgoKSkpO1xuXHRcdFx0Ly8gbGV0IGVhc3QgPSAgTWF0aC5taW4uYXBwbHkoTWF0aCwgb3RoZXJzZmlsbGVkQm91bmRzTm90RW1wdHkubWFwKCAoYm91bmQpID0+IGJvdW5kLmdldEVhc3QoKSkpO1xuXHRcdFx0Ly8gbGV0IG5vcnRoID0gTWF0aC5taW4uYXBwbHkoTWF0aCwgb3RoZXJzZmlsbGVkQm91bmRzTm90RW1wdHkubWFwKCAoYm91bmQpID0+IGJvdW5kLmdldE5vcnRoKCkpKTtcblxuXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRoaXMuZmlsbGVkQm91bmRbJ2FsbCddKVxuXHRcdHtcblx0XHRcdGlmICghdGhpcy5jdXJyRmlsbGVkQm91bmQgfHwgdGhpcy5maWxsZWRCb3VuZFsnYWxsJ10uY29udGFpbnModGhpcy5maWxsZWRCb3VuZFtBcHAuY3Vyck1haW5JZF0pKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmZpbGxlZEJvdW5kW0FwcC5jdXJyTWFpbklkXSA9IHRoaXMuZmlsbGVkQm91bmRbJ2FsbCddXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gaW1wbGVtZW50cyB0aGlzIGZ1bmN0aW9uIHRvIHdhaXQgZnJvbSBhamF4IHJlc3BvbnNlIHRvIHVwZGF0ZSBuZXcgZmlsbGVkQm91bmRzLCBpbnN0ZWFkIG9mXG5cdC8vIHVwZGF0aW5nIGl0IGJlZm9yZSBhamF4IHNlbmQgKHBvc3NpYmx5IHdyb25nIGlmIGFqYXggZmFpbClcblx0Ly8gdXBkYXRlRmlsbGVkQm91bmRzV2l0aEJvdW5kc1JlY2VpdmVkKGJvdW5kIDogTC5MYXRMbmdCb3VuZHNFeHByZXNzaW9uLCBtYWluT3B0aW9uSWQgOiBudW1iZXIpXG5cdC8vIHtcblx0Ly8gXHR0aGlzLmZpbGxlZEJvdW5kW21haW5PcHRpb25JZF0gPSBuZXcgTC5sYXRMbmdCb3VuZHMoYm91bmQpO1xuXHQvLyB9XG5cblx0Z2V0IGN1cnJGaWxsZWRCb3VuZCgpIHsgcmV0dXJuIHRoaXMuZmlsbGVkQm91bmRbQXBwLmN1cnJNYWluSWRdOyB9XG5cblx0Y2FsY3VsYXRlRnJlZUJvdW5kcygpXG5cdHtcblx0XHRsZXQgZnJlZUJvdW5kcyA9IFtdO1xuXG5cdFx0bGV0IGN1cnJGaWxsZWRCb3VuZCA9IHRoaXMuY3VyckZpbGxlZEJvdW5kO1xuXG5cdFx0bGV0IGZyZWVCb3VuZDEsIGZyZWVCb3VuZDIsIGZyZWVCb3VuZDMsIGZyZWVCb3VuZDQ7XG5cblx0XHRpZiAoY3VyckZpbGxlZEJvdW5kKVxuXHRcdHtcblx0XHRcdGlmICghY3VyckZpbGxlZEJvdW5kLmNvbnRhaW5zKHRoaXMuZXh0ZW5kZWRCb3VuZHMpKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5jb250YWlucyhjdXJyRmlsbGVkQm91bmQpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gZXh0ZW5kZWQgY29udGFpbnMgZmlsbGVkYm91bmRzXHRcdFxuXG5cdFx0XHRcdFx0ZnJlZUJvdW5kMSA9IEwubGF0TG5nQm91bmRzKCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldE5vcnRoV2VzdCgpLCBjdXJyRmlsbGVkQm91bmQuZ2V0Tm9ydGhFYXN0KCkgKTtcblx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGZyZWVCb3VuZDEuZ2V0Tm9ydGhFYXN0KClcdFx0XHRcdCAsIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGhFYXN0KCkgKTtcblx0XHRcdFx0XHRmcmVlQm91bmQzID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aEVhc3QoKVx0ICwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aFdlc3QoKSApO1xuXHRcdFx0XHRcdGZyZWVCb3VuZDQgPSBMLmxhdExuZ0JvdW5kcyggZnJlZUJvdW5kMS5nZXRTb3V0aFdlc3QoKVx0XHRcdFx0ICwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoV2VzdCgpICk7XG5cblx0XHRcdFx0XHRjdXJyRmlsbGVkQm91bmQgPSB0aGlzLmV4dGVuZGVkQm91bmRzO1xuXG5cdFx0XHRcdFx0ZnJlZUJvdW5kcy5wdXNoKGZyZWVCb3VuZDEsZnJlZUJvdW5kMiwgZnJlZUJvdW5kMywgZnJlZUJvdW5kNCk7XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIGV4dGVuZGVkIGNyb3NzIG92ZXIgZmlsbGVkXG5cblx0XHRcdFx0XHRpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5nZXRXZXN0KCkgPiBjdXJyRmlsbGVkQm91bmQuZ2V0V2VzdCgpICYmIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0RWFzdCgpIDwgY3VyckZpbGxlZEJvdW5kLmdldEVhc3QoKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aCgpIDwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoKCkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkIGNlbnRlcmVkIHNvdXRoIGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggdGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aFdlc3QoKSwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoRWFzdCgpICk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBleHRlbmRlZCBjZW50ZXJlZCBzb3V0aCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0Tm9ydGhXZXN0KCksIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh0aGlzLmV4dGVuZGVkQm91bmRzLmdldFdlc3QoKSA8IGN1cnJGaWxsZWRCb3VuZC5nZXRXZXN0KCkpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGgoKSA+IGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aCgpICYmIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0Tm9ydGgoKSA8IGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aCgpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBleHRlbmRlZCBjZW50ZXJlZCBlYXN0IGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggdGhpcy5leHRlbmRlZEJvdW5kcy5nZXROb3J0aFdlc3QoKSwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoV2VzdCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICh0aGlzLmV4dGVuZGVkQm91bmRzLmdldFNvdXRoKCkgPCBjdXJyRmlsbGVkQm91bmQuZ2V0U291dGgoKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ly8gZXh0ZW5kZWRib3VuZHMgc291dGhXZXN0IGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoRWFzdCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldFNvdXRoV2VzdCgpICk7XG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDIgPSBMLmxhdExuZ0JvdW5kcyggY3VyckZpbGxlZEJvdW5kLmdldE5vcnRoV2VzdCgpLCBmcmVlQm91bmQxLmdldE5vcnRoV2VzdCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkYm91bmRzIG5vcnRoV2VzdCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aEVhc3QoKSwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXROb3J0aFdlc3QoKSApO1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aFdlc3QoKSwgZnJlZUJvdW5kMS5nZXRTb3V0aFdlc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGgoKSA+IGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aCgpICYmIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0Tm9ydGgoKSA8IGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aCgpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBleHRlbmRlZCBjZW50ZXJlZCB3ZXN0IGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggY3VyckZpbGxlZEJvdW5kLmdldE5vcnRoRWFzdCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldFNvdXRoRWFzdCgpICk7IFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aCgpIDwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoKCkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkYm91bmRzIHNvdXRoZWFzdCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aFdlc3QoKSwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aEVhc3QoKSwgZnJlZUJvdW5kMS5nZXROb3J0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1x0XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkYm91bmRzIG5vcnRoRWFzdCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aFdlc3QoKSwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXROb3J0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aEVhc3QoKSwgZnJlZUJvdW5kMS5nZXRTb3V0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vTC5yZWN0YW5nbGUoZnJlZUJvdW5kMSwge2NvbG9yOiBcInJlZFwiLCB3ZWlnaHQ6IDN9KS5hZGRUbyh0aGlzLm1hcF8pOyBcblx0XHRcdFx0XHQvL0wucmVjdGFuZ2xlKGZyZWVCb3VuZDIsIHtjb2xvcjogXCJibHVlXCIsIHdlaWdodDogM30pLmFkZFRvKHRoaXMubWFwXyk7IFxuXG5cdFx0XHRcdFx0ZnJlZUJvdW5kcy5wdXNoKGZyZWVCb3VuZDEpO1xuXHRcdFx0XHRcdGlmIChmcmVlQm91bmQyKSBmcmVlQm91bmRzLnB1c2goZnJlZUJvdW5kMik7XHRcdFxuXG5cdFx0XHRcdFx0Y3VyckZpbGxlZEJvdW5kID0gTC5sYXRMbmdCb3VuZHMoIFxuXHRcdFx0XHRcdFx0TC5sYXRMbmcoXG5cdFx0XHRcdFx0XHRcdE1hdGgubWF4KGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldE5vcnRoKCkpLFxuXHRcdFx0XHRcdFx0XHRNYXRoLm1heChjdXJyRmlsbGVkQm91bmQuZ2V0RWFzdCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldEVhc3QoKSlcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRMLmxhdExuZyhcblx0XHRcdFx0XHRcdFx0TWF0aC5taW4oY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoKCksIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGgoKSksXG5cdFx0XHRcdFx0XHRcdE1hdGgubWluKGN1cnJGaWxsZWRCb3VuZC5nZXRXZXN0KCksIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0V2VzdCgpKSBcblx0XHRcdFx0XHRcdClcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHQpO1x0XHRcblx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gZXh0ZW5kZWQgYm91bmRzIGluY2x1ZGVkIGluIGZpbGxlZGJvdW5kc1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdC8vIGZpcnN0IGluaXRpYWxpemF0aW9uXG5cdFx0XHRmcmVlQm91bmRzLnB1c2godGhpcy5leHRlbmRlZEJvdW5kcyk7XG5cdFx0XHRjdXJyRmlsbGVkQm91bmQgPSB0aGlzLmV4dGVuZGVkQm91bmRzO1xuXHRcdH1cdFx0XG5cblx0XHR0aGlzLmZpbGxlZEJvdW5kW0FwcC5jdXJyTWFpbklkXSA9IGN1cnJGaWxsZWRCb3VuZDtcblxuXHRcdHJldHVybiBmcmVlQm91bmRzO1xuXHR9XG59IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uL2NsYXNzZXMvY2F0ZWdvcnkuY2xhc3NcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuLi9jbGFzc2VzL29wdGlvbi5jbGFzc1wiO1xuXG5leHBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LmNsYXNzXCI7XG5leHBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi4vY2xhc3Nlcy9vcHRpb24uY2xhc3NcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSBsZXQgJCA6IGFueTtcblxuXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcmllc01vZHVsZVxue1xuXHRjYXRlZ29yaWVzIDogQ2F0ZWdvcnlbXSA9IFtdO1xuXHRvcHRpb25zIDogT3B0aW9uW10gPSBbXTtcblxuXHRtYWluQ2F0ZWdvcnkgOiBDYXRlZ29yeTtcblx0b3BlbkhvdXJzQ2F0ZWdvcnkgOiBDYXRlZ29yeTtcblxuXHRvcGVuSG91cnNGaWx0ZXJzRGF5cyA6IHN0cmluZ1tdID0gW107XG5cblx0Y29uc3RydWN0b3IoKSBcblx0e1xuXHRcdHRoaXMub3B0aW9ucyA9IFtdO1xuXHRcdHRoaXMuY2F0ZWdvcmllcyA9IFtdO1xuXHR9XG5cblx0Y3JlYXRlQ2F0ZWdvcmllc0Zyb21Kc29uKG1haW5DYXRnZW9yeUpzb24sIG9wZW5Ib3Vyc0NhdGVnb3J5SnNvbilcblx0e1xuXHRcdHRoaXMubWFpbkNhdGVnb3J5ID0gdGhpcy5yZWN1cnNpdmVseUNyZWF0ZUNhdGVnb3J5QW5kT3B0aW9ucyhtYWluQ2F0Z2VvcnlKc29uKTtcblx0XHR0aGlzLm9wZW5Ib3Vyc0NhdGVnb3J5ID0gdGhpcy5yZWN1cnNpdmVseUNyZWF0ZUNhdGVnb3J5QW5kT3B0aW9ucyhvcGVuSG91cnNDYXRlZ29yeUpzb24pO1xuXG5cdFx0dGhpcy51cGRhdGVPcGVuSG91cnNGaWx0ZXIoKTtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMubWFpbkNhdGVnb3J5KTtcblx0fVxuXG5cdHByaXZhdGUgcmVjdXJzaXZlbHlDcmVhdGVDYXRlZ29yeUFuZE9wdGlvbnMoY2F0ZWdvcnlKc29uIDogYW55KSA6IENhdGVnb3J5XG5cdHtcblx0XHRsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcnlKc29uKTtcblxuXHRcdGZvcihsZXQgb3B0aW9uSnNvbiBvZiBjYXRlZ29yeUpzb24ub3B0aW9ucylcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uID0gbmV3IE9wdGlvbihvcHRpb25Kc29uKTtcblx0XHRcdG9wdGlvbi5vd25lcklkID0gY2F0ZWdvcnlKc29uLmlkO1xuXHRcdFx0b3B0aW9uLmRlcHRoID0gY2F0ZWdvcnkuZGVwdGg7XG5cblx0XHRcdGlmIChjYXRlZ29yeS5kZXB0aCA9PSAwKSBvcHRpb24ubWFpbk93bmVySWQgPSBcImFsbFwiO1xuXHRcdFx0ZWxzZSBpZiAoY2F0ZWdvcnkuZGVwdGggPT0gLTEpIG9wdGlvbi5tYWluT3duZXJJZCA9IFwib3BlbmhvdXJzXCI7XG5cdFx0XHRlbHNlIG9wdGlvbi5tYWluT3duZXJJZCA9IGNhdGVnb3J5Lm1haW5Pd25lcklkO1xuXG5cdFx0XHRmb3IobGV0IHN1YmNhdGVnb3J5SnNvbiBvZiBvcHRpb25Kc29uLnN1YmNhdGVnb3JpZXMpXG5cdFx0XHR7XHRcdFx0XHRcblx0XHRcdFx0aWYgKGNhdGVnb3J5LmRlcHRoIDw9IDApIHN1YmNhdGVnb3J5SnNvbi5tYWluT3duZXJJZCA9IG9wdGlvbi5pZDtcblx0XHRcdFx0ZWxzZSBzdWJjYXRlZ29yeUpzb24ubWFpbk93bmVySWQgPSBvcHRpb24ubWFpbk93bmVySWQ7XG5cblx0XHRcdFx0bGV0IHN1YmNhdGVnb3J5ID0gdGhpcy5yZWN1cnNpdmVseUNyZWF0ZUNhdGVnb3J5QW5kT3B0aW9ucyhzdWJjYXRlZ29yeUpzb24pO1xuXHRcdFx0XHRzdWJjYXRlZ29yeS5vd25lcklkID0gb3B0aW9uLmlkO1x0XHRcdFx0XG5cblx0XHRcdFx0b3B0aW9uLmFkZENhdGVnb3J5KHN1YmNhdGVnb3J5KTtcblx0XHRcdH1cblxuXHRcdFx0Y2F0ZWdvcnkuYWRkT3B0aW9uKG9wdGlvbik7XHRcblx0XHRcdHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XHRcblx0XHR9XG5cblx0XHR0aGlzLmNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG5cblx0XHRyZXR1cm4gY2F0ZWdvcnk7XG5cdH1cblxuXHR1cGRhdGVPcGVuSG91cnNGaWx0ZXIoKVxuXHR7XG5cdFx0dGhpcy5vcGVuSG91cnNGaWx0ZXJzRGF5cyA9IFtdO1xuXHRcdGxldCBvcHRpb24gOiBhbnk7XG5cdFx0Zm9yKG9wdGlvbiBvZiB0aGlzLm9wZW5Ib3Vyc0NhdGVnb3J5LmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGlmIChvcHRpb24uaXNDaGVja2VkKSB0aGlzLm9wZW5Ib3Vyc0ZpbHRlcnNEYXlzLnB1c2goIG9wdGlvbi5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH1cblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlT3BlbkhvdXJzZmlsdGVyc1wiLCB0aGlzLm9wZW5Ib3Vyc0ZpbHRlcnNEYXlzKTtcblx0fVxuXG5cdGdldE1haW5PcHRpb25zKCkgOiBPcHRpb25bXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMubWFpbkNhdGVnb3J5Lm9wdGlvbnM7XG5cdH1cblxuXHRnZXRNYWluT3B0aW9uc0lkc1dpdGhBbGwoKSA6IGFueVtdXG5cdHtcblx0XHRsZXQgb3B0aW9uSWRzIDogYW55W10gPSB0aGlzLmdldE1haW5PcHRpb25zSWRzKCk7XG5cdFx0b3B0aW9uSWRzLnB1c2goXCJhbGxcIik7XG5cdFx0cmV0dXJuIG9wdGlvbklkcztcblx0fVxuXG5cdGdldE1haW5PcHRpb25zSWRzKCkgOiBudW1iZXJbXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMubWFpbkNhdGVnb3J5Lm9wdGlvbnMubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXHR9XG5cblx0Z2V0Q3Vyck1haW5PcHRpb24oKSA6IE9wdGlvblxuXHR7XG5cdFx0cmV0dXJuIEFwcC5jdXJyTWFpbklkID09ICdhbGwnID8gbnVsbCA6IHRoaXMuZ2V0TWFpbk9wdGlvbkJ5SWQoQXBwLmN1cnJNYWluSWQpO1xuXHR9XG5cblx0Z2V0TWFpbk9wdGlvbkJ5U2x1Zygkc2x1ZykgOiBPcHRpb25cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldE1haW5PcHRpb25zKCkuZmlsdGVyKCAob3B0aW9uIDogT3B0aW9uKSA9PiBvcHRpb24ubmFtZVNob3J0ID09ICRzbHVnKS5zaGlmdCgpO1xuXHR9XG5cblx0Z2V0TWFpbk9wdGlvbkJ5SWQgKCRpZCkgOiBPcHRpb25cblx0e1xuXHRcdHJldHVybiB0aGlzLm1haW5DYXRlZ29yeS5vcHRpb25zLmZpbHRlciggKG9wdGlvbiA6IE9wdGlvbikgPT4gb3B0aW9uLmlkID09ICRpZCkuc2hpZnQoKTtcblx0fTtcblxuXHRnZXRDYXRlZ29yeUJ5SWQgKCRpZCkgOiBDYXRlZ29yeVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuY2F0ZWdvcmllcy5maWx0ZXIoIChjYXRlZ29yeSA6IENhdGVnb3J5KSA9PiBjYXRlZ29yeS5pZCA9PSAkaWQpLnNoaWZ0KCk7XG5cdH07XG5cblx0Z2V0T3B0aW9uQnlJZCAoJGlkKSA6IE9wdGlvblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIoIChvcHRpb24gOiBPcHRpb24pID0+IG9wdGlvbi5pZCA9PSAkaWQpLnNoaWZ0KCk7XG5cdH07XG5cblx0Z2V0Q3Vyck9wdGlvbnMoKSA6IE9wdGlvbltdXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlciggKG9wdGlvbiA6IE9wdGlvbikgPT4gb3B0aW9uLm1haW5Pd25lcklkID09IEFwcC5jdXJyTWFpbklkKTtcblx0fVxufSIsImRlY2xhcmUgbGV0IGdvb2dsZTtcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkLCBMOiBhbnk7XG5cbmRlY2xhcmUgbGV0IHdpbmRvdyA6IGFueTtcblxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbnNNb2R1bGVcbntcblx0bWFya2VyRGlyZWN0aW9uUmVzdWx0ID0gbnVsbDtcblxuXHRyb3V0aW5nQ29udHJvbCA6IGFueTtcblx0XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIFx0d2luZG93LmxybUNvbmZpZyA9IHtcblx0XHRcdC8vIFRPRE8gY2hhbmdlIHRoaXMgZGVtbyBzZXJ2aWNlVXJsXG5cdFx0XHQvLyBcdFx0c2VydmljZVVybDogJy8vcm91dGVyLnByb2plY3Qtb3NybS5vcmcvdmlhcm91dGUnLFxuXHRcdFx0Ly8gICAgcHJvZmlsZTogJ21hcGJveC9kcml2aW5nJyxcblx0XHR9O1xuXG4gIH1cblxuXHRjbGVhcigpXG5cdHtcblx0XHRpZiAoIXRoaXMucm91dGluZ0NvbnRyb2wpIHJldHVybjtcblxuXHRcdHRoaXMuY2xlYXJSb3V0ZSgpO1xuXHRcdC8vdGhpcy5jbGVhckRpcmVjdGlvbk1hcmtlcigpO1xuXHRcdHRoaXMuaGlkZUl0aW5lcmFyeVBhbmVsKCk7XG5cblx0XHRBcHAuREVBTW9kdWxlLmVuZCgpO1xuXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbCA9IG51bGw7XG5cdH07XG5cblx0Y2xlYXJSb3V0ZSgpXG5cdHtcblx0XHRjb25zb2xlLmxvZyhcImNsZWFyaW5nIHJvdXRlXCIpO1xuXHRcdGlmICh0aGlzLnJvdXRpbmdDb250cm9sKSBcblx0XHR7XG5cdFx0XHR0aGlzLnJvdXRpbmdDb250cm9sLnNwbGljZVdheXBvaW50cygwLDIpO1x0XHRcblx0XHRcdEFwcC5tYXAoKS5yZW1vdmVDb250cm9sKHRoaXMucm91dGluZ0NvbnRyb2wpO1x0XG5cdFx0fVxuXHR9O1xuXG5cdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiA6IEwuTGF0TG5nLCBlbGVtZW50IDogRWxlbWVudCkgXG5cdHtcblx0XHR0aGlzLmNsZWFyKCk7XG5cblx0XHRsZXQgd2F5cG9pbnRzID0gW1xuXHRcdCAgICBvcmlnaW4sXG5cdFx0ICAgIGVsZW1lbnQucG9zaXRpb24sXG5cdFx0XTtcblxuXHRcdC8vY29uc29sZS5sb2coXCJjYWxjdWxhdGUgcm91dGVcIiwgd2F5cG9pbnRzKTtcblxuXHRcdHRoaXMucm91dGluZ0NvbnRyb2wgPSBMLlJvdXRpbmcuY29udHJvbCh7XG5cdFx0XHRwbGFuOiBMLlJvdXRpbmcucGxhbihcblx0XHRcdFx0d2F5cG9pbnRzLCBcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIGRlbGV0ZWluZyBzdGFydCBhbmQgZW5kIG1hcmtlcnNcblx0XHRcdFx0XHRjcmVhdGVNYXJrZXI6IGZ1bmN0aW9uKGksIHdwKSB7IHJldHVybiBudWxsOyB9LFxuXHRcdFx0XHRcdHJvdXRlV2hpbGVEcmFnZ2luZzogZmFsc2UsXG5cdFx0XHRcdFx0c2hvd0FsdGVybmF0aXZlczogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdFx0KSxcblx0XHRcdGxhbmd1YWdlOiAnZnInLFxuXHRcdFx0cm91dGVXaGlsZURyYWdnaW5nOiBmYWxzZSxcblx0XHRcdHNob3dBbHRlcm5hdGl2ZXM6IGZhbHNlLFxuXHRcdFx0YWx0TGluZU9wdGlvbnM6IHtcblx0XHRcdFx0c3R5bGVzOiBbXG5cdFx0XHRcdFx0e2NvbG9yOiAnYmxhY2snLCBvcGFjaXR5OiAwLjE1LCB3ZWlnaHQ6IDl9LFxuXHRcdFx0XHRcdHtjb2xvcjogJ3doaXRlJywgb3BhY2l0eTogMC44LCB3ZWlnaHQ6IDZ9LFxuXHRcdFx0XHRcdHtjb2xvcjogJyMwMGIzZmQnLCBvcGFjaXR5OiAwLjUsIHdlaWdodDogMn1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0pLmFkZFRvKEFwcC5tYXAoKSk7XG5cblx0XHQvLyBzaG93IEl0aW5lcmFyeSBwYW5lbCB3aXRob3V0IGl0aW5lcmFyeSwganVzdCB0byBzaG93IHVzZXJcblx0XHQvLyBzb21ldGhpbmdpcyBoYXBwZW5uaW5nIGFuIGRpc3BsYXkgc3Bpbm5lciBsb2FkZXJcblx0XHR0aGlzLnNob3dJdGluZXJhcnlQYW5lbChlbGVtZW50KTtcblxuXHRcdHRoaXMucm91dGluZ0NvbnRyb2wub24oJ3JvdXRlc2ZvdW5kJywgKGV2KSA9PiBcblx0XHR7XG5cdFx0XHR0aGlzLnNob3dJdGluZXJhcnlQYW5lbChlbGVtZW50KTtcblx0XHR9KTtcblxuXHRcdC8vIGZpdCBib3VuZHMgXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbC5vbigncm91dGVzZWxlY3RlZCcsIGZ1bmN0aW9uKGUpIFxuXHRcdHtcdCAgICBcblx0ICAgIHZhciByID0gZS5yb3V0ZTtcblx0ICAgIHZhciBsaW5lID0gTC5Sb3V0aW5nLmxpbmUocik7XG5cdCAgICB2YXIgYm91bmRzID0gbGluZS5nZXRCb3VuZHMoKTtcblx0ICAgIEFwcC5tYXAoKS5maXRCb3VuZHMoYm91bmRzKTtcblx0XHR9KTtcblxuXHRcdHRoaXMucm91dGluZ0NvbnRyb2wub24oJ3JvdXRpbmdlcnJvcicsIChldikgPT4gXG5cdFx0e1xuXHRcdFx0JCgnI21vZGFsLWRpcmVjdGlvbnMtZmFpbCcpLm9wZW5Nb2RhbCgpO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdH0pO1xuXHRcdFx0XG5cdH07XG5cblx0aGlkZUl0aW5lcmFyeVBhbmVsKClcblx0e1xuXHRcdC8vdGhpcy5yb3V0aW5nQ29udHJvbC5oaWRlKCk7XG5cdFx0Ly9BcHAubWFwKCkucmVtb3ZlQ29udHJvbCh0aGlzLnJvdXRpbmdDb250cm9sKTtcblxuXHRcdC8vJCgnLmxlYWZsZXQtcm91dGluZy1jb250YWluZXInKS5oaWRlKCk7XG5cdFx0Ly8kKCcubGVhZmxldC1yb3V0aW5nLWNvbnRhaW5lcicpLnByZXBlbmRUbygnLmRpcmVjdG9yeS1tZW51LWNvbnRlbnQnKTtcblx0XHQkKCcjZGlyZWN0b3J5LW1lbnUtbWFpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcygpO1xuXHRcdCQoJy5kaXJlY3RvcnktbWVudS1oZWFkZXInKTtcblx0XHQkKCcjc2VhcmNoLWJhcicpLnJlbW92ZUNsYXNzKCk7XHRcdFxuXHR9XG5cblx0c2hvd0l0aW5lcmFyeVBhbmVsKGVsZW1lbnQgOiBFbGVtZW50KVxuXHR7XG5cdFx0Ly90aGlzLnJvdXRpbmdDb250cm9sLnNob3coKTtcblx0XHQvL0FwcC5tYXAoKS5hZGRDb250cm9sKHRoaXMucm91dGluZ0NvbnRyb2wpO1x0XG5cblx0XHQvLyQoJy5sZWFmbGV0LXJvdXRpbmctY29udGFpbmVyJykuc2hvdygpO1xuXG5cdFx0Y29uc29sZS5sb2coXCJzaG93IGl0aW5lcmFyeVwiKTtcblxuXHRcdCQoJyNkaXJlY3RvcnktbWVudS1tYWluLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoXCJkaXJlY3Rpb25zXCIpO1x0XG5cdFx0JCgnLmRpcmVjdG9yeS1tZW51LWhlYWRlcicpLmF0dHIoJ29wdGlvbi1pZCcsZWxlbWVudC5jb2xvck9wdGlvbklkKTtcblx0XHQvLyQoJyNzZWFyY2gtYmFyJykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyhlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1x0XG5cblx0XHQkKCcubGVhZmxldC1yb3V0aW5nLWNvbnRhaW5lcicpLnByZXBlbmRUbygnLmRpcmVjdG9yeS1tZW51LWNvbnRlbnQnKTtcblx0XHRcdFxuXG5cdFx0XG5cdH1cblxuXHRjbGVhckRpcmVjdGlvbk1hcmtlcigpXG5cdHtcblx0XHRpZiAodGhpcy5tYXJrZXJEaXJlY3Rpb25SZXN1bHQgIT09IG51bGwpXG5cdFx0e1xuXHRcdFx0dGhpcy5tYXJrZXJEaXJlY3Rpb25SZXN1bHQuc2V0VmlzaWJsZShmYWxzZSk7XG5cdFx0XHR0aGlzLm1hcmtlckRpcmVjdGlvblJlc3VsdC5zZXRNYXAobnVsbCk7XG5cdFx0XHR0aGlzLm1hcmtlckRpcmVjdGlvblJlc3VsdCA9IG51bGw7XG5cdFx0fVxuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmV4cG9ydCBjbGFzcyBEaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXG57XG5cdGVsZW1lbnRTaG93bkFsb25lXyA9IG51bGw7XG5cblx0Y29uc3RydWN0b3IoKSB7fVxuXG5cdGdldEVsZW1lbnQoKSA6IEVsZW1lbnQgeyByZXR1cm4gdGhpcy5lbGVtZW50U2hvd25BbG9uZV87IH1cblxuXHRiZWdpbihlbGVtZW50SWQgOiBzdHJpbmcsIHBhblRvRWxlbWVudExvY2F0aW9uIDogYm9vbGVhbiA9IHRydWUpIFxuXHR7XHRcblx0XHRjb25zb2xlLmxvZyhcIkRpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGUgYmVnaW5cIiwgcGFuVG9FbGVtZW50TG9jYXRpb24pO1xuXG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudEJ5SWQoZWxlbWVudElkKTtcblx0XHR0aGlzLmVsZW1lbnRTaG93bkFsb25lXyA9IGVsZW1lbnQ7XHRcdFx0XG5cblx0XHRpZiAodGhpcy5lbGVtZW50U2hvd25BbG9uZV8gIT09IG51bGwpIFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmhpZGUoKTtcblx0XHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmlzU2hvd25BbG9uZSA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIEFwcC5lbGVtZW50TW9kdWxlLmZvY3VzT25UaGVzZXNFbGVtZW50cyhbZWxlbWVudC5pZF0pO1xuXHRcdC8vIGVsc2UgXG5cdFx0Ly8ge1xuXHRcdC8vQXBwLmVsZW1lbnRNb2R1bGUuY2xlYXJNYXJrZXJzKCk7XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUuY2xlYXJDdXJyZW50c0VsZW1lbnQoKTtcblx0XHQvL31cdFx0XHRcblx0XHRBcHAuZWxlbWVudE1vZHVsZS5zaG93RWxlbWVudChlbGVtZW50KTtcblx0XHRBcHAubWFwQ29tcG9uZW50LmFkZE1hcmtlcihlbGVtZW50Lm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXHRcdGVsZW1lbnQuaXNTaG93bkFsb25lID0gdHJ1ZTtcblxuXHRcdEFwcC5pbmZvQmFyQ29tcG9uZW50LnNob3dFbGVtZW50KGVsZW1lbnQuaWQpO1xuXG5cdFx0aWYgKHBhblRvRWxlbWVudExvY2F0aW9uKVxuXHRcdHtcblx0XHRcdC8vIHdlIHNldCBhIHRpbWVvdXQgdG8gbGV0IHRoZSBpbmZvYmFyIHNob3cgdXBcblx0XHRcdC8vIGlmIHdlIG5vdCBkbyBzbywgdGhlIG1hcCB3aWxsIG5vdCBiZSBjZW50ZXJlZCBpbiB0aGUgZWxlbWVudC5wb3NpdGlvblxuXHRcdFx0c2V0VGltZW91dCggKCkgPT4ge0FwcC5tYXBDb21wb25lbnQucGFuVG9Mb2NhdGlvbihlbGVtZW50LnBvc2l0aW9uLCAxMiwgZmFsc2UpO30sIDUwMCk7XG5cdFx0fVxuXHR9O1xuXG5cdGVuZCAoKSBcblx0e1xuXG5cdFx0aWYgKHRoaXMuZWxlbWVudFNob3duQWxvbmVfID09PSBudWxsKSByZXR1cm47XG5cblx0XHQvLyBpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSBBcHAuZWxlbWVudE1vZHVsZS5jbGVhckZvY3VzT25UaGVzZXNFbGVtZW50cyhbdGhpcy5lbGVtZW50U2hvd25BbG9uZV8uZ2V0SWQoKV0pO1xuXHRcdC8vIGVsc2UgXG5cdFx0Ly8ge1xuXHRcdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSx0cnVlKTtcblx0XHQvL31cblxuXHRcdEFwcC5tYXBDb21wb25lbnQucmVtb3ZlTWFya2VyKHRoaXMuZWxlbWVudFNob3duQWxvbmVfLm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXHRcdFxuXHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmlzU2hvd25BbG9uZSA9IGZhbHNlO1x0XG5cblx0XHR0aGlzLmVsZW1lbnRTaG93bkFsb25lXyA9IG51bGw7XHRcblx0fTtcbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyICQ7XHRcblxuaW1wb3J0ICogYXMgQ29va2llcyBmcm9tIFwiLi4vdXRpbHMvY29va2llc1wiO1xuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmltcG9ydCB7IEJpb3Blbk1hcmtlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL21hcC9iaW9wZW4tbWFya2VyLmNvbXBvbmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRzQ2hhbmdlZFxueyBcblx0ZWxlbWVudHNUb0Rpc3BsYXkgOiBFbGVtZW50W107XG5cdG5ld0VsZW1lbnRzIDogRWxlbWVudFtdO1xuXHRlbGVtZW50c1RvUmVtb3ZlIDogRWxlbWVudFtdO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudHNNb2R1bGVcbntcblx0b25FbGVtZW50c0NoYW5nZWQgPSBuZXcgRXZlbnQ8RWxlbWVudHNDaGFuZ2VkPigpO1xuXG5cdGV2ZXJ5RWxlbWVudHNfIDogRWxlbWVudFtdW10gPSBbXTtcblx0ZXZlcnlFbGVtZW50c0lkXyA6IHN0cmluZ1tdID0gW107XG5cdFxuXHQvLyBjdXJyZW50IHZpc2libGUgZWxlbWVudHNcblx0dmlzaWJsZUVsZW1lbnRzXyA6IEVsZW1lbnRbXVtdID0gW107XG5cblx0ZmF2b3JpdGVJZHNfIDogbnVtYmVyW10gPSBbXTtcblx0aXNTaG93aW5nSGFsZkhpZGRlbiA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRsZXQgY29va2llcyA9IENvb2tpZXMucmVhZENvb2tpZSgnRmF2b3JpdGVJZHMnKTtcblx0XHRpZiAoY29va2llcyAhPT0gbnVsbClcblx0XHR7XG5cdFx0XHR0aGlzLmZhdm9yaXRlSWRzXyA9IEpTT04ucGFyc2UoY29va2llcyk7XHRcdFxuXHRcdH0gICBcblx0XHRlbHNlIHRoaXMuZmF2b3JpdGVJZHNfID0gW107XHRcdFxuXHR9XG5cblx0aW5pdGlhbGl6ZSgpXG5cdHtcblx0XHR0aGlzLmV2ZXJ5RWxlbWVudHNfWydhbGwnXSA9IFtdO1xuXHRcdHRoaXMudmlzaWJsZUVsZW1lbnRzX1snYWxsJ10gPSBbXTtcblx0XHRmb3IobGV0IG9wdGlvbiBvZiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbnMoKSlcblx0XHR7XG5cdFx0XHR0aGlzLmV2ZXJ5RWxlbWVudHNfW29wdGlvbi5pZF0gPSBbXTtcblx0XHRcdHRoaXMudmlzaWJsZUVsZW1lbnRzX1tvcHRpb24uaWRdID0gW107XG5cdFx0fVx0XG5cdH1cblxuXHRjaGVja0Nvb2tpZXMoKVxuXHR7XG5cdFx0Zm9yKGxldCBqID0gMDsgaiA8IHRoaXMuZmF2b3JpdGVJZHNfLmxlbmd0aDsgaisrKVxuXHQgIFx0e1xuXHQgIFx0XHR0aGlzLmFkZEZhdm9yaXRlKHRoaXMuZmF2b3JpdGVJZHNfW2pdLCBmYWxzZSk7XG5cdCAgXHR9XG5cdH07XG5cblx0YWRkSnNvbkVsZW1lbnRzIChlbGVtZW50TGlzdCwgY2hlY2tJZkFscmVhZHlFeGlzdCA9IHRydWUpIDogRWxlbWVudFtdXG5cdHtcblx0XHRsZXQgZWxlbWVudCA6IEVsZW1lbnQsIGVsZW1lbnRKc29uO1xuXHRcdGxldCBuZXdFbGVtZW50cyA6IEVsZW1lbnRbXSA9IFtdO1xuXHRcdGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5cdFx0bGV0IGVsZW1lbnRzSWRzUmVjZWl2ZWQgPSBlbGVtZW50TGlzdC5tYXAoIChlLCBpbmRleCkgPT4gIHsgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGUuaWQsXG4gICAgICAgIGluZGV4OiBpbmRleFxuICAgIH19KTtcblx0XHRcblx0XHRsZXQgbmV3SWRzID0gZWxlbWVudHNJZHNSZWNlaXZlZC5maWx0ZXIoKG9iaikgPT4ge3JldHVybiB0aGlzLmV2ZXJ5RWxlbWVudHNJZF8uaW5kZXhPZihvYmouaWQpIDwgMDt9KTtcblxuXHRcdC8vIGlmIChuZXdJZHMubGVuZ3RoICE9IGVsZW1lbnRMaXN0Lmxlbmd0aClcblx0XHQvLyBcdGNvbnNvbGUubG9nKFwiREVTIEFDVEVVUlMgRVhJU1RBSUVOVCBERUpBXCIsIGVsZW1lbnRMaXN0Lmxlbmd0aCAtIG5ld0lkcy5sZW5ndGgpXG5cblx0XHRsZXQgaSA9IG5ld0lkcy5sZW5ndGg7XG5cblx0XHR3aGlsZShpLS0pXG5cdFx0e1xuXHRcdFx0ZWxlbWVudEpzb24gPSBlbGVtZW50TGlzdFtuZXdJZHNbaV0uaW5kZXhdO1xuXG5cdFx0XHRlbGVtZW50ID0gbmV3IEVsZW1lbnQoZWxlbWVudEpzb24pO1xuXHRcdFx0ZWxlbWVudC5pbml0aWFsaXplKCk7XG5cblx0XHRcdGZvciAobGV0IG1haW5JZCBvZiBlbGVtZW50Lm1haW5PcHRpb25Pd25lcklkcylcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5ldmVyeUVsZW1lbnRzX1ttYWluSWRdLnB1c2goZWxlbWVudCk7XG5cdFx0XHR9XHRcdFx0XHRcblx0XHRcdHRoaXMuZXZlcnlFbGVtZW50c19bJ2FsbCddLnB1c2goZWxlbWVudCk7XG5cdFx0XHR0aGlzLmV2ZXJ5RWxlbWVudHNJZF8ucHVzaChlbGVtZW50LmlkKTtcblx0XHRcdG5ld0VsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0fVxuXHRcdHRoaXMuY2hlY2tDb29raWVzKCk7XG5cdFx0bGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGNvbnNvbGUubG9nKFwiQWRkSnNvbkVsZW1lbnRzIGluIFwiICsgKGVuZC1zdGFydCkgKyBcIiBtc1wiLCBlbGVtZW50SnNvbik7XHRcblx0XHRyZXR1cm4gbmV3RWxlbWVudHM7XG5cdH07XG5cblx0c2hvd0VsZW1lbnQoZWxlbWVudCA6IEVsZW1lbnQpXG5cdHtcblx0XHRlbGVtZW50LnNob3coKTtcblx0XHQvL2lmICghZWxlbWVudC5pc0Rpc3BsYXllZCkgQXBwLm1hcENvbXBvbmVudC5hZGRNYXJrZXIoZWxlbWVudC5tYXJrZXIuZ2V0TGVhZmxldE1hcmtlcigpKTtcblx0XHR0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5wdXNoKGVsZW1lbnQpO1xuXHR9XG5cblx0YWRkRmF2b3JpdGUgKGZhdm9yaXRlSWQgOiBudW1iZXIsIG1vZGlmeUNvb2tpZXMgPSB0cnVlKVxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKGZhdm9yaXRlSWQpO1xuXHRcdGlmIChlbGVtZW50ICE9PSBudWxsKSBlbGVtZW50LmlzRmF2b3JpdGUgPSB0cnVlO1xuXHRcdGVsc2UgcmV0dXJuO1xuXHRcdFxuXHRcdGlmIChtb2RpZnlDb29raWVzKVxuXHRcdHtcblx0XHRcdHRoaXMuZmF2b3JpdGVJZHNfLnB1c2goZmF2b3JpdGVJZCk7XG5cdFx0XHRDb29raWVzLmNyZWF0ZUNvb2tpZSgnRmF2b3JpdGVJZHMnLEpTT04uc3RyaW5naWZ5KHRoaXMuZmF2b3JpdGVJZHNfKSk7XHRcdFxuXHRcdH1cblx0fTtcblxuXHRyZW1vdmVGYXZvcml0ZSAoZmF2b3JpdGVJZCA6IG51bWJlciwgbW9kaWZ5Q29va2llcyA9IHRydWUpXG5cdHtcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQoZmF2b3JpdGVJZCk7XG5cdFx0aWYgKGVsZW1lbnQgIT09IG51bGwpIGVsZW1lbnQuaXNGYXZvcml0ZSA9IGZhbHNlO1xuXHRcdFxuXHRcdGlmIChtb2RpZnlDb29raWVzKVxuXHRcdHtcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuZmF2b3JpdGVJZHNfLmluZGV4T2YoZmF2b3JpdGVJZCk7XG5cdFx0XHRpZiAoaW5kZXggPiAtMSkgdGhpcy5mYXZvcml0ZUlkc18uc3BsaWNlKGluZGV4LCAxKTtcblxuXHRcdFx0Q29va2llcy5jcmVhdGVDb29raWUoJ0Zhdm9yaXRlSWRzJyxKU09OLnN0cmluZ2lmeSh0aGlzLmZhdm9yaXRlSWRzXykpO1xuXHRcdH1cblx0fTtcblxuXHRjbGVhckN1cnJlbnRzRWxlbWVudCgpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiY2xlYXJDdXJyRWxlbWVudHNcIik7XG5cdFx0bGV0IGwgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5sZW5ndGg7XG5cdFx0d2hpbGUobC0tKVxuXHRcdHtcblx0XHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdLmhpZGUoKTtcblx0XHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdLmlzRGlzcGxheWVkID0gZmFsc2U7XG5cdFx0fVxuXHRcdGxldCBtYXJrZXJzID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubWFwKCAoZSkgPT4gZS5tYXJrZXIuZ2V0TGVhZmxldE1hcmtlcigpKTtcblx0XHRBcHAubWFwQ29tcG9uZW50LnJlbW92ZU1hcmtlcnMobWFya2Vycyk7XG5cblx0XHR0aGlzLmNsZWFyQ3VyclZpc2libGVFbGVtZW50cygpO1xuXHR9XG5cblx0dXBkYXRlRWxlbWVudHNJY29ucyhzb21ldGhpbmdDaGFuZ2VkIDogYm9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIlVwZGF0ZUN1cnJFbGVtZW50cyBzb21ldGhpbmdDaGFuZ2VkXCIsIHNvbWV0aGluZ0NoYW5nZWQpO1xuXHRcdGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGxldCBsID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubGVuZ3RoO1xuXHRcdGxldCBlbGVtZW50IDogRWxlbWVudDtcblx0XHR3aGlsZShsLS0pXG5cdFx0e1xuXHRcdFx0ZWxlbWVudCA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdO1xuXHRcdFx0aWYgKHNvbWV0aGluZ0NoYW5nZWQpIGVsZW1lbnQubmVlZFRvQmVVcGRhdGVkV2hlblNob3duID0gdHJ1ZTtcblxuXHRcdFx0Ly8gaWYgZG9tTWFya2VyIG5vdCB2aXNpYmxlIHRoYXQncyBtZWFuIHRoYXQgbWFya2VyIGlzIGluIGEgY2x1c3RlclxuXHRcdFx0aWYgKGVsZW1lbnQubWFya2VyLmRvbU1hcmtlcigpLmlzKCc6dmlzaWJsZScpKSBlbGVtZW50LnVwZGF0ZSgpO1xuXHRcdH1cblx0XHRsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0bGV0IHRpbWUgPSBlbmQgLSBzdGFydDtcblx0XHQvL3dpbmRvdy5jb25zb2xlLmxvZyhcInVwZGF0ZUVsZW1lbnRzSWNvbnMgXCIgKyB0aW1lICsgXCIgbXNcIik7XG5cdH1cblxuXHQvLyBjaGVjayBlbGVtZW50cyBpbiBib3VuZHMgYW5kIHdobyBhcmUgbm90IGZpbHRlcmVkXG5cdHVwZGF0ZUVsZW1lbnRzVG9EaXNwbGF5IChjaGVja0luQWxsRWxlbWVudHMgPSB0cnVlLCBmb3JjZVJlcGFpbnQgPSBmYWxzZSwgZmlsdGVySGFzQ2hhbmdlZCA9IGZhbHNlKSBcblx0e1x0XG5cdFx0Ly8gaW4gdGhlc2Ugc3RhdGUsdGhlcmUgaXMgbm8gbmVlZCB0byB1cGRhdGUgZWxlbWVudHMgdG8gZGlzcGxheVxuXHRcdGlmICggKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSB8fCBBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zICkgXG5cdFx0XHRcdFx0JiYgQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKSBcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCAmJiAhQXBwLm1hcENvbXBvbmVudC5pc01hcExvYWRlZCkgcmV0dXJuO1xuXG5cdFx0bGV0IGVsZW1lbnRzIDogRWxlbWVudFtdID0gbnVsbDtcblx0XHRpZiAoY2hlY2tJbkFsbEVsZW1lbnRzIHx8IHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGggPT09IDApIGVsZW1lbnRzID0gdGhpcy5jdXJyRXZlcnlFbGVtZW50cygpO1xuXHRcdGVsc2UgZWxlbWVudHMgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKTtcblxuXHRcdC8vZWxlbWVudHMgPSB0aGlzLmN1cnJFdmVyeUVsZW1lbnRzKCk7XHRcdFxuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coXCJVUERBVEUgRUxFTUVOVFMgXCIsIGVsZW1lbnRzLmxlbmd0aCk7XG5cblx0XHRsZXQgaSA6IG51bWJlciwgZWxlbWVudCA6IEVsZW1lbnQ7XG5cdFx0bGV0IGJvdW5kcztcblxuXHQgXHRsZXQgbmV3RWxlbWVudHMgOiBFbGVtZW50W10gPSBbXTtcblx0IFx0bGV0IGVsZW1lbnRzVG9SZW1vdmUgOiBFbGVtZW50W10gPSBbXTtcblx0IFx0bGV0IGVsZW1lbnRzQ2hhbmdlZCA9IGZhbHNlO1xuXG5cdFx0bGV0IGZpbHRlck1vZHVsZSA9IEFwcC5maWx0ZXJNb2R1bGU7XHRcblxuXHRcdGkgPSBlbGVtZW50cy5sZW5ndGg7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkuIE5icmUgZWxlbWVudCDDoCB0cmFpdGVyIDogXCIgKyBpLCBjaGVja0luQWxsRWxlbWVudHMpO1xuXHRcdFxuXHRcdGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5cdFx0d2hpbGUoaS0tIC8qJiYgdGhpcy52aXNpYmxlRWxlbWVudHNfLmxlbmd0aCA8IEFwcC5nZXRNYXhFbGVtZW50cygpKi8pXG5cdFx0e1xuXHRcdFx0ZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuXG5cdFx0XHQvLyBpbiBMaXN0IG1vZGUgd2UgZG9uJ3QgbmVlZCB0byBjaGVjayBib3VuZHM7XG5cdFx0XHRsZXQgZWxlbWVudEluQm91bmRzID0gKEFwcC5tb2RlID09IEFwcE1vZGVzLkxpc3QpIHx8IEFwcC5tYXBDb21wb25lbnQuZXh0ZW5kZWRDb250YWlucyhlbGVtZW50LnBvc2l0aW9uKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50SW5Cb3VuZHMgJiYgZmlsdGVyTW9kdWxlLmNoZWNrSWZFbGVtZW50UGFzc0ZpbHRlcnMoZWxlbWVudCkpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICghZWxlbWVudC5pc0Rpc3BsYXllZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVsZW1lbnQuaXNEaXNwbGF5ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0bmV3RWxlbWVudHMucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHRlbGVtZW50c0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChlbGVtZW50LmlzRGlzcGxheWVkKSBcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVsZW1lbnQuaXNEaXNwbGF5ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRlbGVtZW50c1RvUmVtb3ZlLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0ZWxlbWVudHNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5pbmRleE9mKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGlmIChpbmRleCA+IC0xKSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaWYgKHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGggPj0gQXBwLmdldE1heEVsZW1lbnRzKCkpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0LyokKCcjdG9vLW1hbnktbWFya2Vycy1tb2RhbCcpLnNob3coKS5mYWRlVG8oIDUwMCAsIDEpO1xuXHRcdC8vIFx0dGhpcy5jbGVhck1hcmtlcnMoKTtcdFx0XG5cdFx0Ly8gXHRyZXR1cm47Ki9cblx0XHQvLyBcdC8vY29uc29sZS5sb2coXCJUb29tYW55IG1hcmtlcnMuIE5icmUgbWFya2VycyA6IFwiICsgdGhpcy52aXNpYmxlRWxlbWVudHNfLmxlbmd0aCArIFwiIC8vIE1heE1hcmtlcnMgPSBcIiArIEFwcC5nZXRNYXhFbGVtZW50cygpKTtcblx0XHQvLyB9XG5cdFx0Ly8gZWxzZVxuXHRcdC8vIHtcblx0XHQvLyBcdCQoJyN0b28tbWFueS1tYXJrZXJzLW1vZGFsOnZpc2libGUnKS5mYWRlVG8oNjAwLDAsIGZ1bmN0aW9uKCl7ICQodGhpcykuaGlkZSgpOyB9KTtcblx0XHQvLyB9XG5cblxuXHRcdGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRsZXQgdGltZSA9IGVuZCAtIHN0YXJ0O1xuXHRcdC8vd2luZG93LmNvbnNvbGUubG9nKFwiVXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkgZW4gXCIgKyB0aW1lICsgXCIgbXNcIik7XHRcdFxuXG5cdFx0aWYgKGVsZW1lbnRzQ2hhbmdlZCB8fCBmb3JjZVJlcGFpbnQpXG5cdFx0e1x0XHRcblx0XHRcdHRoaXMub25FbGVtZW50c0NoYW5nZWQuZW1pdCh7XG5cdFx0XHRcdGVsZW1lbnRzVG9EaXNwbGF5OiB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKSwgXG5cdFx0XHRcdG5ld0VsZW1lbnRzIDogbmV3RWxlbWVudHMsIFxuXHRcdFx0XHRlbGVtZW50c1RvUmVtb3ZlIDogZWxlbWVudHNUb1JlbW92ZVxuXHRcdFx0fSk7XHRcdFxuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlRWxlbWVudHNJY29ucyhmaWx0ZXJIYXNDaGFuZ2VkKTtcdFx0XG5cdH07XG5cblx0Y3VyclZpc2libGVFbGVtZW50cygpIFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMudmlzaWJsZUVsZW1lbnRzX1tBcHAuY3Vyck1haW5JZF07XG5cdH07XG5cblx0Y3VyckV2ZXJ5RWxlbWVudHMoKSBcblx0e1xuXHRcdHJldHVybiB0aGlzLmV2ZXJ5RWxlbWVudHNfW0FwcC5jdXJyTWFpbklkXTtcblx0fTtcblxuXHRwcml2YXRlIGNsZWFyQ3VyclZpc2libGVFbGVtZW50cygpIFxuXHR7XG5cdFx0dGhpcy52aXNpYmxlRWxlbWVudHNfW0FwcC5jdXJyTWFpbklkXSA9IFtdO1xuXHR9O1xuXG5cdGFsbEVsZW1lbnRzKClcblx0e1xuXHRcdHJldHVybiB0aGlzLmV2ZXJ5RWxlbWVudHNfWydhbGwnXTtcblx0fVxuXG5cdGNsZWFyTWFya2VycygpXG5cdHtcblx0XHRjb25zb2xlLmxvZyhcImNsZWFyTWFya2Vyc1wiKTtcblx0XHR0aGlzLmhpZGVBbGxNYXJrZXJzKCk7XG5cdFx0dGhpcy5jbGVhckN1cnJWaXNpYmxlRWxlbWVudHMoKTtcblx0fTtcblxuXHRnZXRNYXJrZXJzICgpIFxuXHR7XG5cdFx0bGV0IG1hcmtlcnMgPSBbXTtcblx0XHRsZXQgbCA9IHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGg7XG5cdFx0d2hpbGUobC0tKVxuXHRcdHtcblx0XHRcdG1hcmtlcnMucHVzaCh0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5tYXJrZXIpO1xuXHRcdH1cblx0XHRyZXR1cm4gbWFya2Vycztcblx0fTtcblxuXHRoaWRlUGFydGlhbGx5QWxsTWFya2VycyAoKSBcblx0e1xuXHRcdHRoaXMuaXNTaG93aW5nSGFsZkhpZGRlbiA9IHRydWU7XG5cdFx0bGV0IGwgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5sZW5ndGg7XHRcdFxuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyKSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5tYXJrZXIuc2hvd0hhbGZIaWRkZW4oKTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdGhpZGVBbGxNYXJrZXJzICgpIFxuXHR7XG5cdFx0bGV0IGwgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5sZW5ndGg7XG5cdFx0d2hpbGUobC0tKVxuXHRcdHtcblx0XHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdLmhpZGUoKTtcblx0XHR9XG5cdH07XG5cblx0c2hvd05vcm1hbEhpZGRlbkFsbE1hcmtlcnMgKCkgXG5cdHtcblx0XHR0aGlzLmlzU2hvd2luZ0hhbGZIaWRkZW4gPSBmYWxzZTtcblx0XHQkKCcubWFya2VyLWNsdXN0ZXInKS5yZW1vdmVDbGFzcygnaGFsZkhpZGRlbicpO1xuXHRcdFxuXHRcdGxldCBsID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubGVuZ3RoO1xuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyKSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5tYXJrZXIuc2hvd05vcm1hbEhpZGRlbigpO1xuXHRcdH1cblx0fTtcblxuXHRnZXRFbGVtZW50QnlJZCAoZWxlbWVudElkKSA6IEVsZW1lbnRcblx0e1xuXHRcdC8vcmV0dXJuIHRoaXMuZXZlcnlFbGVtZW50c19bZWxlbWVudElkXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWxsRWxlbWVudHMoKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMuYWxsRWxlbWVudHMoKVtpXS5pZCA9PSBlbGVtZW50SWQpIHJldHVybiB0aGlzLmFsbEVsZW1lbnRzKClbaV07XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IHNsdWdpZnksIGNhcGl0YWxpemUsIHBhcnNlQXJyYXlOdW1iZXJJbnRvU3RyaW5nLCBwYXJzZVN0cmluZ0ludG9BcnJheU51bWJlciB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IE9wdGlvbn0gZnJvbSBcIi4uL2NsYXNzZXMvb3B0aW9uLmNsYXNzXCI7XG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LmNsYXNzXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuaW1wb3J0IHsgQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LW9wdGlvbi10cmVlLW5vZGUuY2xhc3NcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyTW9kdWxlXG57XG5cdHNob3dPbmx5RmF2b3JpdGVfIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRzaG93UGVuZGluZ18gOiBib29sZWFuID0gdHJ1ZTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcdH1cblxuXHRzaG93T25seUZhdm9yaXRlKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5zaG93T25seUZhdm9yaXRlXyA9IGJvb2w7XG5cdH07XG5cblx0c2hvd1BlbmRpbmcoYm9vbCA6IGJvb2xlYW4pXG5cdHtcblx0XHR0aGlzLnNob3dQZW5kaW5nXyA9IGJvb2w7XG5cdH07XG5cblx0Y2hlY2tJZkVsZW1lbnRQYXNzRmlsdGVycyAoZWxlbWVudCA6IEVsZW1lbnQpIDogYm9vbGVhblxuXHR7XG5cdFx0aWYgKHRoaXMuc2hvd09ubHlGYXZvcml0ZV8pIHJldHVybiBlbGVtZW50LmlzRmF2b3JpdGU7XG5cblx0XHRpZighdGhpcy5zaG93UGVuZGluZ18gJiYgZWxlbWVudC5pc1BlbmRpbmcoKSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0aWYgKEFwcC5jdXJyTWFpbklkID09ICdhbGwnKVxuXHRcdHtcblx0XHRcdGxldCBlbGVtZW50T3B0aW9ucyA9IGVsZW1lbnQuZ2V0T3B0aW9uVmFsdWVCeUNhdGVnb3J5SWQoIEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkuaWQpO1xuXHRcdFx0bGV0IGNoZWNrZWRPcHRpb25zID0gQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeS5jaGVja2VkT3B0aW9ucztcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIlxcbmVsZW1lbnRzT3B0aW9uc1wiLCBlbGVtZW50T3B0aW9ucy5tYXAoICh2YWx1ZSkgPT4gdmFsdWUub3B0aW9uLm5hbWUpKTtcblx0XHRcdC8vY29uc29sZS5sb2coXCJjaGVja2VkT3B0aW9uc1wiLCBjaGVja2VkT3B0aW9ucy5tYXAoICh2YWx1ZSkgPT4gdmFsdWUubmFtZSkpO1xuXG5cdFx0XHRsZXQgcmVzdWx0ID0gZWxlbWVudE9wdGlvbnMuc29tZShvcHRpb25WYWx1ZSA9PiBjaGVja2VkT3B0aW9ucy5pbmRleE9mKG9wdGlvblZhbHVlLm9wdGlvbikgPiAtMSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwicmV0dXJuXCIsIHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0IDtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGxldCBtYWluT3B0aW9uID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldEN1cnJNYWluT3B0aW9uKCk7XHRcdFx0XG5cdFx0XHRsZXQgaXNQYXNzaW5nRmlsdGVycyA9IHRoaXMucmVjdXJzaXZlbHlDaGVja2VkSW5PcHRpb24obWFpbk9wdGlvbiwgZWxlbWVudCk7XG5cdFx0XHRcblx0XHRcdGlmIChpc1Bhc3NpbmdGaWx0ZXJzICYmIGVsZW1lbnQub3BlbkhvdXJzKVxuXHRcdFx0e1xuXHRcdFx0XHRpc1Bhc3NpbmdGaWx0ZXJzID0gZWxlbWVudC5vcGVuSG91cnNEYXlzLnNvbWUoIChkYXkgOiBhbnkpID0+IEFwcC5jYXRlZ29yeU1vZHVsZS5vcGVuSG91cnNGaWx0ZXJzRGF5cy5pbmRleE9mKGRheSkgPiAtMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpc1Bhc3NpbmdGaWx0ZXJzO1xuXHRcdH1cdFx0XG5cdH1cblxuXHRwcml2YXRlIHJlY3Vyc2l2ZWx5Q2hlY2tlZEluT3B0aW9uKG9wdGlvbiA6IE9wdGlvbiwgZWxlbWVudCA6IEVsZW1lbnQpIDogYm9vbGVhblxuXHR7XG5cdFx0bGV0IGVjYXJ0ID0gXCJcIjtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgb3B0aW9uLmRlcHRoOyBpKyspIGVjYXJ0Kz0gXCItLVwiO1xuXG5cdFx0bGV0IGxvZyA9IGZhbHNlO1xuXG5cdFx0aWYgKGxvZykgY29uc29sZS5sb2coZWNhcnQgKyBcIkNoZWNrIGZvciBvcHRpb24gXCIsIG9wdGlvbi5uYW1lKTtcblxuXHRcdGxldCByZXN1bHQ7XG5cdFx0aWYgKG9wdGlvbi5zdWJjYXRlZ29yaWVzLmxlbmd0aCA9PSAwIHx8IChvcHRpb24uaXNEaXNhYmxlZCAmJiAhb3B0aW9uLmlzTWFpbk9wdGlvbikgKVxuXHRcdHtcblx0XHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKGVjYXJ0ICsgXCJObyBzdWJjYXRlZ29yaWVzIFwiKTtcblx0XHRcdHJlc3VsdCA9IG9wdGlvbi5pc0NoZWNrZWQ7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRyZXN1bHQgPSBvcHRpb24uc3ViY2F0ZWdvcmllcy5ldmVyeSggKGNhdGVnb3J5KSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhcIi0tXCIgKyBlY2FydCArIFwiQ2F0ZWdvcnlcIiwgY2F0ZWdvcnkubmFtZSk7XG5cblx0XHRcdFx0bGV0IGNoZWNrZWRPcHRpb25zID0gY2F0ZWdvcnkuY2hlY2tlZE9wdGlvbnM7XG5cdFx0XHRcdGxldCBlbGVtZW50T3B0aW9ucyA9IGVsZW1lbnQuZ2V0T3B0aW9uVmFsdWVCeUNhdGVnb3J5SWQoY2F0ZWdvcnkuaWQpO1xuXG5cdFx0XHRcdGxldCBpc1NvbWVPcHRpb25JbkNhdGVnb3J5Q2hlY2tlZE9wdGlvbnMgPSBlbGVtZW50T3B0aW9ucy5zb21lKG9wdGlvblZhbHVlID0+IGNoZWNrZWRPcHRpb25zLmluZGV4T2Yob3B0aW9uVmFsdWUub3B0aW9uKSA+IC0xKTsgXG5cblx0XHRcdFx0aWYgKGxvZykgY29uc29sZS5sb2coXCItLVwiICsgZWNhcnQgKyBcImlzU29tZU9wdGlvbkluQ2F0ZWdvcnlDaGVja2VkT3B0aW9uc1wiLCBpc1NvbWVPcHRpb25JbkNhdGVnb3J5Q2hlY2tlZE9wdGlvbnMpO1xuXHRcdFx0XHRpZiAoaXNTb21lT3B0aW9uSW5DYXRlZ29yeUNoZWNrZWRPcHRpb25zKVxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKFwiLS1cIiArIGVjYXJ0ICsgXCJTbyB3ZSBjaGVja2VkIGluIHN1Ym9wdGlvbnNcIiwgY2F0ZWdvcnkubmFtZSk7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnRPcHRpb25zLnNvbWUoIChvcHRpb25WYWx1ZSkgPT4gdGhpcy5yZWN1cnNpdmVseUNoZWNrZWRJbk9wdGlvbihvcHRpb25WYWx1ZS5vcHRpb24sIGVsZW1lbnQpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKGVjYXJ0ICsgXCJSZXR1cm4gXCIsIHJlc3VsdCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGxvYWRGaWx0ZXJzRnJvbVN0cmluZyhzdHJpbmcgOiBzdHJpbmcpXG5cdHtcblx0XHRsZXQgc3BsaXRlZCA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdGxldCBtYWluT3B0aW9uU2x1ZyA9IHNwbGl0ZWRbMF07XG5cblx0XHRsZXQgbWFpbk9wdGlvbklkID0gbWFpbk9wdGlvblNsdWcgPT0gJ2FsbCcgPyAnYWxsJyA6IEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9uQnlTbHVnKG1haW5PcHRpb25TbHVnKS5pZDtcblx0XHRBcHAuZGlyZWN0b3J5TWVudUNvbXBvbmVudC5zZXRNYWluT3B0aW9uKG1haW5PcHRpb25JZCk7XHRcdFxuXG5cdFx0bGV0IGZpbHRlcnNTdHJpbmcgOiBzdHJpbmc7XG5cdFx0bGV0IGFkZGluZ01vZGUgOiBib29sZWFuO1xuXG5cdFx0aWYgKCBzcGxpdGVkLmxlbmd0aCA9PSAyKVxuXHRcdHtcblx0XHRcdGZpbHRlcnNTdHJpbmcgPSBzcGxpdGVkWzFdO1xuXG5cdFx0XHRpZiAoZmlsdGVyc1N0cmluZ1swXSA9PSAnIScpIGFkZGluZ01vZGUgPSBmYWxzZTtcblx0XHRcdGVsc2UgYWRkaW5nTW9kZSA9IHRydWU7XG5cblx0XHRcdGZpbHRlcnNTdHJpbmcgPSBmaWx0ZXJzU3RyaW5nLnN1YnN0cmluZygxKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIHNwbGl0ZWQubGVuZ3RoID4gMilcblx0XHR7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3Igc3BsaXRpbmcgaW4gbG9hZEZpbHRlckZyb21TdHJpbmdcIik7XG5cdFx0fVxuXG5cdFx0bGV0IGZpbHRlcnMgPSBwYXJzZVN0cmluZ0ludG9BcnJheU51bWJlcihmaWx0ZXJzU3RyaW5nKTtcblxuXHRcdC8vY29uc29sZS5sb2coJ2ZpbHRlcnMnLCBmaWx0ZXJzKTtcblx0XHQvL2NvbnNvbGUubG9nKCdhZGRpbmdNb2RlJywgYWRkaW5nTW9kZSk7XG5cblx0XHQvLyBpZiBhZGRpbmdNb2RlLCB3ZSBmaXJzdCBwdXQgYWxsIHRoZSBmaWx0ZXIgdG8gZmFsc2Vcblx0XHRpZiAoYWRkaW5nTW9kZSlcblx0XHR7XG5cdFx0XHRpZiAobWFpbk9wdGlvblNsdWcgPT0gJ2FsbCcpXG5cdFx0XHRcdEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkudG9nZ2xlKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGZvciAobGV0IGNhdCBvZiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbkJ5U2x1ZyhtYWluT3B0aW9uU2x1Zykuc3ViY2F0ZWdvcmllcylcblx0XHRcdFx0XHRmb3IobGV0IG9wdGlvbiBvZiBjYXQub3B0aW9ucykgb3B0aW9uLnRvZ2dsZShmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXG5cdFx0XHRBcHAuY2F0ZWdvcnlNb2R1bGUub3BlbkhvdXJzQ2F0ZWdvcnkudG9nZ2xlKGZhbHNlLCBmYWxzZSk7XG5cdFx0fVxuXG5cdFx0Zm9yKGxldCBmaWx0ZXJJZCBvZiBmaWx0ZXJzKVxuXHRcdHtcblx0XHRcdGxldCBvcHRpb24gPSBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0T3B0aW9uQnlJZChmaWx0ZXJJZCk7XG5cdFx0XHRpZiAoIW9wdGlvbikgY29uc29sZS5sb2coXCJFcnJvciBsb2FkaW5ncyBmaWx0ZXJzIDogXCIgKyBmaWx0ZXJJZCk7XG5cdFx0XHRlbHNlIG9wdGlvbi50b2dnbGUoYWRkaW5nTW9kZSwgZmFsc2UpO1xuXHRcdH1cblxuXHRcdGlmIChtYWluT3B0aW9uU2x1ZyA9PSAnYWxsJykgQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeS51cGRhdGVTdGF0ZSgpO1xuXHRcdGVsc2UgQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25CeVNsdWcobWFpbk9wdGlvblNsdWcpLnJlY3Vyc2l2ZWx5VXBkYXRlU3RhdGVzKCk7XG5cblx0XHRBcHAuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c1RvRGlzcGxheSh0cnVlKTtcblx0XHQvL0FwcC5oaXN0b3J5TW9kdWxlLnVwZGF0ZUN1cnJTdGF0ZSgpO1xuXG5cdH1cblxuXHRnZXRGaWx0ZXJzVG9TdHJpbmcoKSA6IHN0cmluZ1xuXHR7XG5cdFx0bGV0IG1haW5PcHRpb25JZCA9IEFwcC5jdXJyTWFpbklkO1xuXG5cdFx0bGV0IG1haW5PcHRpb25OYW1lO1xuXHRcdGxldCBjaGVja0FycmF5VG9QYXJzZSwgdW5jaGVja0FycmF5VG9QYXJzZTtcblx0XHRcblx0XHRpZiAobWFpbk9wdGlvbklkID09ICdhbGwnKVxuXHRcdHtcdFx0XHRcblx0XHRcdG1haW5PcHRpb25OYW1lID0gXCJhbGxcIjtcblx0XHRcdGNoZWNrQXJyYXlUb1BhcnNlID0gQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeS5jaGVja2VkT3B0aW9ucy5tYXAoIChvcHRpb24pID0+IG9wdGlvbi5pZCk7XG5cdFx0XHR1bmNoZWNrQXJyYXlUb1BhcnNlID0gQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeS5kaXNhYmxlZE9wdGlvbnMubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bGV0IG1haW5PcHRpb24gPSBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbkJ5SWQobWFpbk9wdGlvbklkKTtcblx0XHRcdG1haW5PcHRpb25OYW1lID0gbWFpbk9wdGlvbi5uYW1lU2hvcnQ7XG5cblx0XHRcdGxldCBhbGxPcHRpb25zID0gbWFpbk9wdGlvbi5hbGxDaGlsZHJlbk9wdGlvbnM7XG5cblx0XHRcdGNoZWNrQXJyYXlUb1BhcnNlID0gYWxsT3B0aW9ucy5maWx0ZXIoIChvcHRpb24pID0+IG9wdGlvbi5pc0NoZWNrZWQgKS5tYXAoIChvcHRpb24pID0+IG9wdGlvbi5pZCk7XG5cdFx0XHR1bmNoZWNrQXJyYXlUb1BhcnNlID0gYWxsT3B0aW9ucy5maWx0ZXIoIChvcHRpb24pID0+IG9wdGlvbi5pc0Rpc2FibGVkICkubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXG5cdFx0XHRpZiAobWFpbk9wdGlvbi5zaG93T3BlbkhvdXJzKSBcblx0XHRcdHtcblx0XHRcdFx0Y2hlY2tBcnJheVRvUGFyc2UgPSBjaGVja0FycmF5VG9QYXJzZS5jb25jYXQoQXBwLmNhdGVnb3J5TW9kdWxlLm9wZW5Ib3Vyc0NhdGVnb3J5LmNoZWNrZWRPcHRpb25zLm1hcCggKG9wdGlvbikgPT4gb3B0aW9uLmlkKSk7XG5cdFx0XHRcdHVuY2hlY2tBcnJheVRvUGFyc2UgPSB1bmNoZWNrQXJyYXlUb1BhcnNlLmNvbmNhdChBcHAuY2F0ZWdvcnlNb2R1bGUub3BlbkhvdXJzQ2F0ZWdvcnkuZGlzYWJsZWRPcHRpb25zLm1hcCggKG9wdGlvbikgPT4gb3B0aW9uLmlkKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGNoZWNrZWRJZHNQYXJzZWQgPSBwYXJzZUFycmF5TnVtYmVySW50b1N0cmluZyhjaGVja0FycmF5VG9QYXJzZSk7XG5cdFx0bGV0IHVuY2hlY2tlZElkc1BhcnNlZCA9IHBhcnNlQXJyYXlOdW1iZXJJbnRvU3RyaW5nKHVuY2hlY2tBcnJheVRvUGFyc2UpO1xuXG5cdFx0bGV0IGFkZGluZ01vZGUgPSAoY2hlY2tlZElkc1BhcnNlZC5sZW5ndGggPCB1bmNoZWNrZWRJZHNQYXJzZWQubGVuZ3RoKTtcblxuXHRcdGxldCBhZGRpbmdTeW1ib2wgPSBhZGRpbmdNb2RlID8gJysnIDogJyEnO1xuXG5cdFx0bGV0IGZpbHRlcnNTdHJpbmcgPSBhZGRpbmdNb2RlID8gY2hlY2tlZElkc1BhcnNlZCA6IHVuY2hlY2tlZElkc1BhcnNlZDtcblxuXHRcdGlmICghYWRkaW5nTW9kZSAmJiBmaWx0ZXJzU3RyaW5nID09IFwiXCIgKSByZXR1cm4gbWFpbk9wdGlvbk5hbWU7XG5cblx0XHRyZXR1cm4gbWFpbk9wdGlvbk5hbWUgKyAnQCcgKyBhZGRpbmdTeW1ib2wgKyBmaWx0ZXJzU3RyaW5nO1xuXHR9XG59IiwiZGVjbGFyZSBsZXQgR2VvY29kZXJKUztcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyIEwsICQ7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBzbHVnaWZ5LCBjYXBpdGFsaXplLCB1bnNsdWdpZnkgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VvY29kZVJlc3VsdFxue1xuXHRnZXRDb29yZGluYXRlcygpIDogTC5MYXRMbmdUdXBsZTtcblx0Z2V0Rm9ybWF0dGVkQWRkcmVzcygpIDogc3RyaW5nO1x0XG5cdGdldEJvdW5kcygpIDogUmF3Qm91bmRzO1xufVxuXG4vLyBzb3V0aCwgd2VzdCwgbm9ydGgsIGVhc3RcbmV4cG9ydCB0eXBlIFJhd0JvdW5kcyA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuXG4vKipcbiogSW50ZXJmYWNlIGJldHdlZW4gR2VvY29kZXJKUyBhbmQgdGhlIEFwcFxuKiBBbGxvdyB0byBjaGFuZ2UgZ2VvY29kZSB0ZWNobm9sb2d5IHdpdGhvdXQgY2hhbmdpbmcgY29kZSBpbiB0aGUgQXBwXG4qL1xuZXhwb3J0IGNsYXNzIEdlb2NvZGVyTW9kdWxlXG57XG5cdGdlb2NvZGVyIDogYW55ID0gbnVsbDtcblx0bGFzdEFkZHJlc3NSZXF1ZXN0IDogc3RyaW5nID0gJyc7XG5cdGxhc3RSZXN1bHRzIDogR2VvY29kZVJlc3VsdFtdID0gbnVsbDtcblx0bGFzdFJlc3VsdEJvdW5kcyA6IEwuTGF0TG5nQm91bmRzID0gbnVsbDtcblxuXHRnZXRMb2NhdGlvbigpIDogTC5MYXRMbmdcblx0e1xuXHRcdGlmICghdGhpcy5sYXN0UmVzdWx0cyB8fCAhdGhpcy5sYXN0UmVzdWx0c1swXSkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIEwubGF0TG5nKHRoaXMubGFzdFJlc3VsdHNbMF0uZ2V0Q29vcmRpbmF0ZXMoKSk7XG5cdH1cblxuXHRnZXRCb3VuZHMoKSA6IEwuTGF0TG5nQm91bmRzXG5cdHtcblx0XHRpZiAoIXRoaXMubGFzdFJlc3VsdEJvdW5kcykgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIHRoaXMubGFzdFJlc3VsdEJvdW5kcztcblx0fVxuXG5cdHByaXZhdGUgbGF0TG5nQm91bmRzRnJvbVJhd0JvdW5kcyhyYXdib3VuZHMgOiBSYXdCb3VuZHMpIDogTC5MYXRMbmdCb3VuZHNcblx0e1xuXHRcdGxldCBjb3JuZXIxID0gTC5sYXRMbmcocmF3Ym91bmRzWzBdLCByYXdib3VuZHNbMV0pO1xuXHRcdGxldCBjb3JuZXIyID0gTC5sYXRMbmcocmF3Ym91bmRzWzJdLCByYXdib3VuZHNbM10pO1xuXHRcdHJldHVybiBMLmxhdExuZ0JvdW5kcyhjb3JuZXIxLCBjb3JuZXIyKTtcblx0fVxuXG5cdGdldExvY2F0aW9uU2x1ZygpIDogc3RyaW5nIHsgcmV0dXJuIHNsdWdpZnkodGhpcy5sYXN0QWRkcmVzc1JlcXVlc3QpOyB9XG5cdGdldExvY2F0aW9uQWRkcmVzcygpIDogc3RyaW5nIHsgcmV0dXJuIHRoaXMubGFzdEFkZHJlc3NSZXF1ZXN0OyB9XG5cblx0c2V0TG9jYXRpb25BZGRyZXNzKCRhZGRyZXNzIDogc3RyaW5nKSB7IHRoaXMubGFzdEFkZHJlc3NSZXF1ZXN0ID0gJGFkZHJlc3M7IH1cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLmdlb2NvZGVyID0gR2VvY29kZXJKUy5jcmVhdGVHZW9jb2Rlcih7ICdwcm92aWRlcic6ICdvcGVuc3RyZWV0bWFwJywgJ2NvdW50cnljb2RlcycgOiAnZnInfSk7XG5cdFx0Ly90aGlzLmdlb2NvZGVyID0gR2VvY29kZXJKUy5jcmVhdGVHZW9jb2Rlcih7J3Byb3ZpZGVyJzogJ2dvb2dsZSd9KTtcblx0fVxuXG5cdGdlb2NvZGVBZGRyZXNzKCBhZGRyZXNzLCBjYWxsYmFja0NvbXBsZXRlPywgY2FsbGJhY2tGYWlsPyApIHtcblxuXHRcdC8vY29uc29sZS5sb2coXCJnZW9jb2RlIGFkZHJlc3MgOiBcIiwgYWRkcmVzcyk7XG5cdFx0dGhpcy5sYXN0QWRkcmVzc1JlcXVlc3QgPSBhZGRyZXNzO1xuXG5cdFx0Ly8gaWYgbm8gYWRkcmVzcywgd2Ugc2hvdyBmcmFuY2Vcblx0XHRpZiAoYWRkcmVzcyA9PSAnJylcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhcImRlZmF1bHQgbG9jYXRpb25cIik7XG5cdFx0XHR0aGlzLmxhc3RSZXN1bHRzID0gW107XG5cdFx0XHR0aGlzLmxhc3RSZXN1bHRCb3VuZHMgPSB0aGlzLmxhdExuZ0JvdW5kc0Zyb21SYXdCb3VuZHMoWzUxLjY4NjE3OTU0ODU1NjI0LDguODMzMDA3ODEyNTAwMDAyLDQyLjMwOTgxNTQxNTY4NjY2NCwgLTUuMzM5MzU1NDY4NzUwMDAxXSk7XG5cblx0XHRcdC8vIGxlYXZlIHRpbWUgZm9yIG1hcCB0byBsb2FkXG5cdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IGNhbGxiYWNrQ29tcGxldGUodGhpcy5sYXN0UmVzdWx0cyk7IH0sIDIwMCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQvLyBmYWtlIGdlb2NvZGVyIHdoZW4gbm8gaW50ZXJuZXQgY29ubmV4aW9uXG5cdFx0XHRsZXQgZmFrZSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIWZha2UpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuZ2VvY29kZXIuZ2VvY29kZSggYWRkcmVzcywgKHJlc3VsdHMgOiBHZW9jb2RlUmVzdWx0W10pID0+XG5cdFx0XHRcdHtcdFx0XHRcblx0XHRcdFx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkgXG5cdFx0XHRcdFx0e1x0XHRcdFx0XG5cdFx0XHRcdFx0XHR0aGlzLmxhc3RSZXN1bHRzID0gcmVzdWx0cztcblx0XHRcdFx0XHRcdHRoaXMubGFzdFJlc3VsdEJvdW5kcyA9IHRoaXMubGF0TG5nQm91bmRzRnJvbVJhd0JvdW5kcyh0aGlzLmxhc3RSZXN1bHRzWzBdLmdldEJvdW5kcygpKTtcblxuXHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrQ29tcGxldGUpIGNhbGxiYWNrQ29tcGxldGUocmVzdWx0cyk7XHRcblx0XHRcdFx0XHR9IFx0XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmIChjYWxsYmFja0ZhaWwpIGNhbGxiYWNrRmFpbCgpO1x0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGxldCByZXN1bHQgPSB7XG5cdFx0XHRcdFx0Ym91bmRzOiBbLjA2OTE4NSwtMC42NDE0MTUsNDQuMTg0NzM1MSwtMC40Njk5ODM1XSxcblx0XHRcdFx0XHRjaXR5OiAnTGFicml0Jyxcblx0XHRcdFx0XHRmb3JtYXR0ZWRBZGRyZXNzOiBcIkxhYnJpdCA0MDQyMFwiLFxuXHRcdFx0XHRcdGxhdGl0dWRlOjQ0LjEwNDk1NjcsXG5cdFx0XHRcdFx0bG9uZ2l0dWRlOi0wLjU0NDUyOTYsXG5cdFx0XHRcdFx0cG9zdGFsX2NvZGU6XCI0MDQyMFwiLFxuXHRcdFx0XHRcdHJlZ2lvbjpcIk5vdXZlbGxlLUFxdWl0YWluZVwiLFxuXHRcdFx0XHRcdGdldEJvdW5kcygpIHsgcmV0dXJuIHRoaXMuYm91bmRzOyB9LFxuXHRcdFx0XHRcdGdldENvb3JkaW5hdGVzKCkgeyByZXR1cm4gW3RoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlXTsgfSxcblx0XHRcdFx0XHRnZXRGb3JtYXR0ZWRBZGRyZXNzKCkgeyByZXR1cm4gdGhpcy5mb3JtYXR0ZWRBZGRyZXNzOyB9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IFtdO1xuXHRcdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcblxuXHRcdFx0XHR0aGlzLmxhc3RSZXN1bHRzID0gcmVzdWx0cztcblx0XHRcdFx0dGhpcy5sYXN0UmVzdWx0Qm91bmRzID0gdGhpcy5sYXRMbmdCb3VuZHNGcm9tUmF3Qm91bmRzKHRoaXMubGFzdFJlc3VsdHNbMF0uZ2V0Qm91bmRzKCkpO1xuXG5cdFx0XHRcdGNhbGxiYWNrQ29tcGxldGUocmVzdWx0cyk7XG5cdFx0XHR9XHRcblx0XHR9XHRcdFx0XG5cdH07XG59IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgc2x1Z2lmeSwgY2FwaXRhbGl6ZSB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuaW1wb3J0IHsgVmlld1BvcnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tYXAvbWFwLmNvbXBvbmVudFwiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkO1xuZGVjbGFyZSBsZXQgUm91dGluZztcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKVxue1x0XG4gICAvLyBHZXRzIGhpc3Rvcnkgc3RhdGUgZnJvbSBicm93c2VyXG4gICB3aW5kb3cub25wb3BzdGF0ZSA9IChldmVudCA6IFBvcFN0YXRlRXZlbnQpID0+XG4gICB7XG5cdCAgLy9jb25zb2xlLmxvZyhcIlxcblxcbk9ucG9wU3RhdGUgXCIsIGV2ZW50LnN0YXRlLmZpbHRlcnMpO1xuXHQgIGxldCBoaXN0b3J5c3RhdGUgOiBIaXN0b3J5U3RhdGUgPSBldmVudC5zdGF0ZTtcblx0ICAvLyB0cmFuc2Zvcm0ganNvblZpZXdwb3J0IGludG8gVmlld1BvcnQgb2JqZWN0IChpZiB3ZSBkb24ndCBkbyBzbyxcblx0ICAvLyB0aGUgVmlld1BvcnQgbWV0aG9kcyB3aWxsIG5vdCBiZSBhY2Nlc3NpYmxlKVxuXHQgIGhpc3RvcnlzdGF0ZS52aWV3cG9ydCA9ICQuZXh0ZW5kKG5ldyBWaWV3UG9ydCgpLCBldmVudC5zdGF0ZS52aWV3cG9ydCk7XG5cdCAgQXBwLmxvYWRIaXN0b3J5U3RhdGUoZXZlbnQuc3RhdGUsIHRydWUpO1xuXHR9O1xufSk7XG5cbmV4cG9ydCBjbGFzcyBIaXN0b3J5U3RhdGVcbntcblx0bW9kZTogQXBwTW9kZXM7XG5cdHN0YXRlIDogQXBwU3RhdGVzO1xuXHRhZGRyZXNzIDogc3RyaW5nO1xuXHR2aWV3cG9ydCA6IFZpZXdQb3J0O1xuXHRpZCA6IG51bWJlcjtcblx0ZmlsdGVycyA6IHN0cmluZztcblxuXHRwYXJzZSgkaGlzdG9yeVN0YXRlIDogYW55KSA6IEhpc3RvcnlTdGF0ZVxuXHR7XG5cdFx0dGhpcy5tb2RlID0gJGhpc3RvcnlTdGF0ZS5tb2RlID09ICdNYXAnID8gQXBwTW9kZXMuTWFwIDogQXBwTW9kZXMuTGlzdDtcblx0XHR0aGlzLnN0YXRlID0gcGFyc2VJbnQoQXBwU3RhdGVzWyRoaXN0b3J5U3RhdGUuc3RhdGVdKTtcblx0XHR0aGlzLmFkZHJlc3MgPSAkaGlzdG9yeVN0YXRlLmFkZHJlc3M7XG5cdFx0dGhpcy52aWV3cG9ydCA9IG5ldyBWaWV3UG9ydCgpLmZyb21TdHJpbmcoJGhpc3RvcnlTdGF0ZS52aWV3cG9ydCk7XG5cdFx0dGhpcy5pZCA9ICRoaXN0b3J5U3RhdGUuaWQ7XG5cdFx0dGhpcy5maWx0ZXJzID0gJGhpc3RvcnlTdGF0ZS5maWx0ZXJzO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBIaXN0b3J5TW9kdWxlXG57XG5cblx0Y29uc3RydWN0b3IoKSB7IH0gIFxuXG5cdHVwZGF0ZUN1cnJTdGF0ZShvcHRpb25zPylcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJVcGRhdGUgQ3VyciBTdGF0ZVwiKTtcblx0XHRpZiAoIWhpc3Rvcnkuc3RhdGUpIHsgY29uc29sZS5sb2coXCJjdXJyIHN0YXRlIG51bGxcIik7dGhpcy5wdXNoTmV3U3RhdGUoKTt9XG5cdFx0dGhpcy51cGRhdGVIaXN0b3J5KGZhbHNlLCBvcHRpb25zKTtcblx0fTtcblxuXHRwdXNoTmV3U3RhdGUob3B0aW9ucz8pXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiUHVzaCBOZXcgU3RhdGVcIik7XG5cblx0XHRpZiAoaGlzdG9yeS5zdGF0ZSA9PT0gbnVsbCkgdGhpcy51cGRhdGVIaXN0b3J5KGZhbHNlLCBvcHRpb25zKTtcblx0XHRlbHNlIHRoaXMudXBkYXRlSGlzdG9yeSh0cnVlLCBvcHRpb25zKTtcblx0XHRcblx0fTtcblxuXHRwcml2YXRlIHVwZGF0ZUhpc3RvcnkoJHB1c2hTdGF0ZSA6IGJvb2xlYW4sICRvcHRpb25zPyA6IGFueSlcblx0e1xuXHRcdGlmIChBcHAubW9kZSA9PSB1bmRlZmluZWQpIHJldHVybjtcblxuXHRcdCRvcHRpb25zID0gJG9wdGlvbnMgfHwge307XG5cdFx0bGV0IGhpc3RvcnlTdGF0ZSA9IG5ldyBIaXN0b3J5U3RhdGU7XG5cdFx0aGlzdG9yeVN0YXRlLm1vZGUgPSBBcHAubW9kZTtcblx0XHRoaXN0b3J5U3RhdGUuc3RhdGUgPSBBcHAuc3RhdGU7XG5cdFx0aGlzdG9yeVN0YXRlLmFkZHJlc3MgPSBBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb25TbHVnKCk7XG5cdFx0aGlzdG9yeVN0YXRlLnZpZXdwb3J0ID0gQXBwLm1hcENvbXBvbmVudC52aWV3cG9ydDtcblx0XHRoaXN0b3J5U3RhdGUuaWQgPSBBcHAuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkgfHwgJG9wdGlvbnMuaWQ7XG5cdFx0aGlzdG9yeVN0YXRlLmZpbHRlcnMgPSBBcHAuZmlsdGVyTW9kdWxlLmdldEZpbHRlcnNUb1N0cmluZygpO1xuXG5cdFx0Ly8gaWYgKCRwdXNoU3RhdGUpIGNvbnNvbGUubG9nKFwiTkVXIFNhdGVcIiwgaGlzdG9yeVN0YXRlLmZpbHRlcnMpO1xuXHRcdC8vIGVsc2UgY29uc29sZS5sb2coXCJVUERBVEUgU3RhdGVcIiwgaGlzdG9yeVN0YXRlLmZpbHRlcnMpO1xuXG5cdFx0bGV0IHJvdXRlID0gdGhpcy5nZW5lcmF0ZVJvdXRlKGhpc3RvcnlTdGF0ZSk7XG5cblx0XHRpZiAoIXJvdXRlKSByZXR1cm47XG5cblx0XHRpZiAoJHB1c2hTdGF0ZSlcblx0XHR7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZShoaXN0b3J5U3RhdGUsICcnLCByb3V0ZSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiUHVzaGluZyBuZXcgc3RhdGVcIiwgaGlzdG9yeVN0YXRlKTtcblx0XHR9XG5cdFx0ZWxzZSBcblx0XHR7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiUmVwbGFjZSBzdGF0ZVwiLCBoaXN0b3J5U3RhdGUpO1xuXHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgcm91dGUpO1xuXHRcdH1cblx0fTtcblxuXHRwcml2YXRlIGdlbmVyYXRlUm91dGUoaGlzdG9yeVN0YXRlIDogSGlzdG9yeVN0YXRlKVxuXHR7XG5cdFx0bGV0IHJvdXRlO1xuXHRcdGxldCBtb2RlID0gQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwID8gJ2NhcnRlJyA6ICdsaXN0ZSc7XG5cdFx0bGV0IGFkZHJlc3MgPSBoaXN0b3J5U3RhdGUuYWRkcmVzcztcblx0XHRsZXQgdmlld3BvcnQgPSBoaXN0b3J5U3RhdGUudmlld3BvcnQ7XG5cdFx0bGV0IGFkZHJlc3NBbmRWaWV3cG9ydCA9ICcnO1xuXHRcdGlmIChhZGRyZXNzKSBhZGRyZXNzQW5kVmlld3BvcnQgKz0gYWRkcmVzcztcblx0XHQvLyBpbiBNYXAgTW9kZSB3ZSBhZGQgdmlld3BvcnRcblx0XHQvLyBpbiBMaXN0IG1vZGUgd2UgYWRkIHZpZXdwb3J0IG9ubHkgd2hlbiBubyBhZGRyZXNzIHByb3ZpZGVkXG5cdFx0aWYgKHZpZXdwb3J0ICYmIChBcHAubW9kZSA9PSBBcHBNb2Rlcy5NYXAgfHwgIWFkZHJlc3MpKSBhZGRyZXNzQW5kVmlld3BvcnQgKz0gdmlld3BvcnQudG9TdHJpbmcoKTtcblxuXHRcdC8vIGluIGxpc3QgbW9kZSB3ZSBkb24ndCBjYXJlIGFib3V0IHN0YXRlXG5cdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0e1xuXHRcdFx0cm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fZGlyZWN0b3J5X25vcm1hbCcsIHsgbW9kZSA6ICBtb2RlIH0pO1x0XG5cdFx0XHRpZiAoYWRkcmVzc0FuZFZpZXdwb3J0KSByb3V0ZSArPSAnLycgKyBhZGRyZXNzQW5kVmlld3BvcnQ7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzd2l0Y2ggKEFwcC5zdGF0ZSlcblx0XHRcdHtcblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuTm9ybWFsOlx0XG5cdFx0XHRcdFx0cm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fZGlyZWN0b3J5X25vcm1hbCcsIHsgbW9kZSA6ICBtb2RlIH0pO1x0XG5cdFx0XHRcdFx0Ly8gZm9yanNyb3V0aW5nIGRvZXNuJ3Qgc3VwcG9ydCBzcGVhY2lhbCBjaGFyYWN0cyBsaWtlIGluIHZpZXdwb3J0XG5cdFx0XHRcdFx0Ly8gc28gd2UgYWRkIHRoZW0gbWFudWFsbHlcblx0XHRcdFx0XHRpZiAoYWRkcmVzc0FuZFZpZXdwb3J0KSByb3V0ZSArPSAnLycgKyBhZGRyZXNzQW5kVmlld3BvcnQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnQ6XHRcblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZTpcblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnM6XG5cdFx0XHRcdFx0aWYgKCFoaXN0b3J5U3RhdGUuaWQpIHJldHVybjtcblx0XHRcdFx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50QnlJZChoaXN0b3J5U3RhdGUuaWQpO1xuXHRcdFx0XHRcdGlmICghZWxlbWVudCkgcmV0dXJuO1x0XHRcblxuXHRcdFx0XHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2RpcmVjdG9yeV9zaG93RGlyZWN0aW9ucycsIHsgbmFtZSA6ICBjYXBpdGFsaXplKHNsdWdpZnkoZWxlbWVudC5uYW1lKSksIGlkIDogZWxlbWVudC5pZCB9KTtcdFxuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9kaXJlY3Rvcnlfc2hvd0VsZW1lbnQnLCB7IG5hbWUgOiAgY2FwaXRhbGl6ZShzbHVnaWZ5KGVsZW1lbnQubmFtZSkpLCBpZCA6IGVsZW1lbnQuaWQgfSk7XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gZm9yanNyb3V0aW5nIGRvZXNuJ3Qgc3VwcG9ydCBzcGVhY2lhbCBjaGFyYWN0cyBsaWtlIGluIHZpZXdwb3J0XG5cdFx0XHRcdFx0Ly8gc28gd2UgYWRkIHRoZW0gbWFudWFsbHlcblx0XHRcdFx0XHRpZiAoYWRkcmVzc0FuZFZpZXdwb3J0KSByb3V0ZSArPSAnLycgKyBhZGRyZXNzQW5kVmlld3BvcnQ7XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHQvLyBjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdC8vIFx0YnJlYWs7XHRcdFx0XG5cdFx0XHR9XHRcdFxuXHRcdH1cblxuXHRcdGlmIChoaXN0b3J5U3RhdGUuZmlsdGVycykgcm91dGUgKz0gJz9jYXQ9JyArIGhpc3RvcnlTdGF0ZS5maWx0ZXJzO1xuXHRcdFxuXHRcdFxuXHRcdFxuXHRcdC8vIGZvciAobGV0IGtleSBpbiBvcHRpb25zKVxuXHRcdC8vIHtcblx0XHQvLyBcdHJvdXRlICs9ICc/JyArIGtleSArICc9JyArIG9wdGlvbnNba2V5XTtcblx0XHQvLyBcdC8vcm91dGUgKz0gJy8nICsga2V5ICsgJy8nICsgb3B0aW9uc1trZXldO1xuXHRcdC8vIH1cblxuXHRcdC8vY29uc29sZS5sb2coXCJyb3V0ZSBnZW5lcmF0ZWRcIiwgcm91dGUpO1xuXG5cdFx0cmV0dXJuIHJvdXRlO1xuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0wOC0zMVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29va2llKG5hbWUsdmFsdWUpIFxue1xuXHRsZXQgZGF5cyA9IDEwMDtcblxuXHRsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSsoZGF5cyoyNCo2MCo2MCoxMDAwKSk7XG5cdGxldCBleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIrZGF0ZS50b1VUQ1N0cmluZygpO1xuXHRcblx0ZG9jdW1lbnQuY29va2llID0gbmFtZStcIj1cIit2YWx1ZStleHBpcmVzK1wiOyBwYXRoPS9cIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRDb29raWUobmFtZSkge1xuXHRsZXQgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuXHRsZXQgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcblx0Zm9yKGxldCBpPTA7aSA8IGNhLmxlbmd0aDtpKyspIHtcblx0XHRsZXQgYyA9IGNhW2ldO1xuXHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLGMubGVuZ3RoKTtcblx0XHRpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLGMubGVuZ3RoKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcblx0Y3JlYXRlQ29va2llKG5hbWUsXCJcIik7XG59IiwiZXhwb3J0IGludGVyZmFjZSBJRXZlbnQ8VD4ge1xuICAgIGRvKGhhbmRsZXI6IHsgKGRhdGE/OiBUKTogdm9pZCB9KSA6IHZvaWQ7XG4gICAgb2ZmKGhhbmRsZXI6IHsgKGRhdGE/OiBUKTogdm9pZCB9KSA6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudDxUPiBpbXBsZW1lbnRzIElFdmVudDxUPiB7XG4gICAgcHJpdmF0ZSBoYW5kbGVyczogeyAoZGF0YT86IFQpOiB2b2lkOyB9W10gPSBbXTtcblxuICAgIHB1YmxpYyBkbyhoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIG9mZihoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5maWx0ZXIoaCA9PiBoICE9PSBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW1pdChkYXRhPzogVCkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnNsaWNlKDApLmZvckVhY2goaCA9PiBoKGRhdGEpKTtcbiAgICB9XG59Il19
