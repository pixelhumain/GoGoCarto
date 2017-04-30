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
    ElementStatus[ElementStatus["Deleted"] = -2] = "Deleted";
    ElementStatus[ElementStatus["ModerationNeeded"] = -1] = "ModerationNeeded";
    ElementStatus[ElementStatus["Pending"] = 0] = "Pending";
    ElementStatus[ElementStatus["AdminValidate"] = 1] = "AdminValidate";
    ElementStatus[ElementStatus["CollaborativeValidate"] = 1] = "CollaborativeValidate";
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
        this.name = elementJson.name;
        this.position = L.latLng(elementJson.coordinates.lat, elementJson.coordinates.lng);
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
        for (var _i = 0, _a = elementJson.optionValues; _i < _a.length; _i++) {
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
        this.optionId = $optionValueJson.optionId;
        this.index = $optionValueJson.index;
        this.description = $optionValueJson.description || '';
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
        this.richMarker_ = L.marker(position_, { 'riseOnHover': true });
        this.richMarker_.on('click', function (ev) {
            App.handleMarkerClick(_this);
        });
        this.richMarker_.on('mouseover', function (ev) {
            if (_this.isAnimating_) {
                return;
            }
            //if (!this.isNearlyHidden_) // for constellation mode !
            _this.showBigSize();
        });
        this.richMarker_.on('mouseout', function (ev) {
            if (_this.isAnimating_) {
                return;
            }
            _this.showNormalSize();
        });
        // if (App.state == AppStates.Constellation)
        // {
        // 	google.maps.event.addListener(this.richMarker_, 'visible_changed', () => 
        // 	{ 
        // 		this.checkPolylineVisibility_(this); 
        // 	});
        // }
        this.isHalfHidden_ = false;
        //this.update();	
        this.richMarker_.setIcon(L.divIcon({ className: 'leaflet-marker-container', html: "<span id=\"marker-" + this.id_ + "\"></span>" }));
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
        this.richMarker_.setIcon(L.divIcon({ className: 'leaflet-marker-container', html: htmlMarker }));
        if (this.isDisplayedOnElementInfoBar()) this.showBigSize();
        if (this.inclination_ == "right") this.inclinateRight();
        if (this.inclination_ == "left") this.inclinateLeft();
    };
    ;
    BiopenMarker.prototype.addClassToRichMarker_ = function (classToAdd) {
        this.domMarker().addClass(classToAdd);
        this.domMarker().siblings('.marker-name').addClass(classToAdd);
    };
    ;
    BiopenMarker.prototype.removeClassToRichMarker_ = function (classToRemove) {
        this.domMarker().removeClass(classToRemove);
        this.domMarker().siblings('.marker-name').removeClass(classToRemove);
    };
    ;
    BiopenMarker.prototype.showBigSize = function () {
        this.addClassToRichMarker_("BigSize");
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
        this.removeClassToRichMarker_("BigSize");
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
        // 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.richMarker_.getPosition(), this.getElement().type, null, options);
        // }
        // else
        // {		
        // 	let map = this.polyline_.getMap();
        // 	this.polyline_.setMap(null);
        // 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.richMarker_.getPosition(), this.getElement().type, map, options);	
        // }
    };
    ;
    BiopenMarker.prototype.showHalfHidden = function ($force) {
        if ($force === void 0) {
            $force = false;
        }
        if (!$force && this.isDisplayedOnElementInfoBar()) return;
        this.addClassToRichMarker_("halfHidden");
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
        this.removeClassToRichMarker_("halfHidden");
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
        return this.richMarker_;
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
        if (context.richMarker_ === null) return;
        //window.console.log("checkPolylineVisibility_ " + context.richMarker_.getVisible());
        context.polyline_.setVisible(context.richMarker_.getVisible());
        context.polyline_.setMap(context.richMarker_.getMap());
        if (App.state == _app.AppStates.ShowDirections) {
            context.polyline_.setMap(null);
            context.polyline_.setVisible(false);
        }
    };
    ;
    BiopenMarker.prototype.show = function () {
        //App.mapComponent.addMarker(this.richMarker_);
        //this.richMarker_.addTo(App.map());
        if (App.state == _app.AppStates.Constellation) this.polyline_.setMap(App.map());
    };
    ;
    BiopenMarker.prototype.hide = function () {
        //App.mapComponent.removeMarker(this.richMarker_);
        //this.richMarker_.remove();
        if (App.state == _app.AppStates.Constellation) this.polyline_.setMap(null);
    };
    ;
    BiopenMarker.prototype.setVisible = function (bool) {
        //this.richMarker_.setVisible(bool);
        if (bool) this.show();else this.hide();
    };
    ;
    BiopenMarker.prototype.getPosition = function () {
        return this.richMarker_.getLatLng();
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
            spiderfyOnHover: true,
            spiderfyMaxCount: 4,
            spiderfyDistanceMultiplier: 1.1,
            chunkedLoading: true,
            maxClusterRadius: function maxClusterRadius(zoom) {
                if (zoom > 7) return 40;else return 100;
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
        //console.log("Ajax send elements request ", $request);
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
            method: "post",
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
                    console.log("receive " + response.data.length + " elements in " + (end - start) + " ms");
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
        //console.log("AddJsonElements in " + (end-start) + " ms");	
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvY29tbW9ucy9jb21tb25zLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2NvbW1vbnMvc2VhcmNoLWJhci5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2FwcC1pbnRlcmFjdGlvbnMudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2FwcC5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NsYXNzZXMvY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jYXRlZ29yeS12YWx1ZS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jYXRlZ29yeS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jbGFzc2VzLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jbGFzc2VzL2VsZW1lbnQuY2xhc3MudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NsYXNzZXMvb3B0aW9uLXZhbHVlLmNsYXNzLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jbGFzc2VzL29wdGlvbi5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9kaXJlY3RvcnktbWVudS5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvZWxlbWVudC1saXN0LmNvbXBvbmVudC50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9lbGVtZW50LW1lbnUuY29tcG9uZW50LnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jb21wb25lbnRzL2luZm8tYmFyLmNvbXBvbmVudC50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9tYXAvYmlvcGVuLW1hcmtlci5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvbWFwL21hcC5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvdm90ZS5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvYWpheC5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvYm91bmRzLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9jYXRlZ29yaWVzLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9kaXJlY3Rpb25zLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9kaXNwbGF5LWVsZW1lbnQtYWxvbmUubW9kdWxlLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9tb2R1bGVzL2VsZW1lbnRzLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9maWx0ZXIubW9kdWxlLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9tb2R1bGVzL2dlb2NvZGVyLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9oaXN0b3J5Lm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvdXRpbHMvY29va2llcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvdXRpbHMvZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7NkJDV29DLEFBQUssT0FBRSxBQUFnQyxTQUFFLEFBQVU7QUFBNUMsNEJBQUE7QUFBQSxrQkFBVSxBQUFDLEVBQUMsQUFBYSxBQUFDLGVBQUMsQUFBRyxBQUFFOztBQUFFLDBCQUFBO0FBQUEsZ0JBQVU7O0FBRW5GLEFBQUUsQUFBQyxRQUFDLENBQUMsQUFBSyxBQUFDLE9BQUMsQUFBTSxPQUFDLEFBQVEsU0FBQyxBQUFJLE9BQUcsQUFBTyxRQUFDLEFBQVEsU0FB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TSxXQUFDLEFBQUksQUFBQyxBQUNiO0FBQUMsQUFFRCxBQUFNO3FCQUFzQixBQUFJO0FBQy9CLEFBQVksaUJBQUMsQUFBSSxNQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ3ZCO0FBQUM7Ozs7Ozs7O0FDNUJEO0FBQUE7QUFDWSxhQUFRLFdBQTRCLEFBQUUsQUFBQyxBQWFuRDtBQUFDO0FBWFUsb0JBQUUsS0FBVCxVQUFVLEFBQTZCO0FBQ25DLEFBQUksYUFBQyxBQUFRLFNBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ2hDO0FBQUM7QUFFTSxvQkFBRyxNQUFWLFVBQVcsQUFBNkI7QUFDcEMsQUFBSSxhQUFDLEFBQVEsZ0JBQVEsQUFBUSxTQUFDLEFBQU0sT0FBQyxVQUFBLEFBQUM7QUFBSSxtQkFBQSxBQUFDLE1BQUQsQUFBTSxBQUFPO0FBQUEsQUFBQyxBQUFDLEFBQzdELFNBRG9CLEFBQUk7QUFDdkI7QUFFTSxvQkFBSSxPQUFYLFVBQVksQUFBUTtBQUNoQixBQUFJLGFBQUMsQUFBUSxTQUFDLEFBQUssTUFBQyxBQUFDLEFBQUMsR0FBQyxBQUFPLFFBQUMsVUFBQSxBQUFDO0FBQUksbUJBQUEsQUFBQyxFQUFELEFBQUUsQUFBSSxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQ2pEO0FBQUM7QUFDTCxXQUFBLEFBQUM7QUFkRCxBQWNDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0wOC0zMVxuICovXG5kZWNsYXJlIHZhciBSb3V0aW5nLCAkO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVkaXJlY3RUb0RpcmVjdG9yeShyb3V0ZSwgYWRkcmVzcyA9ICQoJyNzZWFyY2gtYmFyJykudmFsKCksIHJhbmdlID0gJycpXG57ICAgIFxuICAgIGlmICghcmFuZ2UpIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gUm91dGluZy5nZW5lcmF0ZShyb3V0ZSwgeyBzbHVnIDogc2x1Z2lmeShhZGRyZXNzKSB9KTtcbiAgICBlbHNlIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gUm91dGluZy5nZW5lcmF0ZShyb3V0ZSwgeyBzbHVnIDogc2x1Z2lmeShhZGRyZXNzKSwgZGlzdGFuY2UgOiByYW5nZX0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2x1Z2lmeSh0ZXh0KSA6IHN0cmluZ1xue1xuICBpZiAoIXRleHQpIHJldHVybiAnJztcbiAgcmV0dXJuIHRleHQudG9TdHJpbmcoKS8vLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxzKy9nLCAnLScpICAgICAgICAgICAvLyBSZXBsYWNlIHNwYWNlcyB3aXRoIC1cbiAgICAucmVwbGFjZSgvW15cXHdcXC1dKy9nLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xuICAgIC5yZXBsYWNlKC9cXC1cXC0rL2csICctJykgICAgICAgICAvLyBSZXBsYWNlIG11bHRpcGxlIC0gd2l0aCBzaW5nbGUgLVxuICAgIC5yZXBsYWNlKC9eLSsvLCAnJykgICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gc3RhcnQgb2YgdGV4dFxuICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuc2x1Z2lmeSh0ZXh0IDogc3RyaW5nKSA6IHN0cmluZ1xue1xuICBpZiAoIXRleHQpIHJldHVybiAnJztcbiAgcmV0dXJuIHRleHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXC0rL2csICcgJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHRleHQpXG57XG4gICAgcmV0dXJuIHRleHQuc3Vic3RyKDAsMSkudG9VcHBlckNhc2UoKSt0ZXh0LnN1YnN0cigxLHRleHQubGVuZ3RoKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UXVlcnlQYXJhbXMocXMpIFxue1xuICAgIHFzID0gcXMuc3BsaXQoXCIrXCIpLmpvaW4oXCIgXCIpO1xuICAgIHZhciBwYXJhbXMgPSB7fSxcbiAgICAgICAgdG9rZW5zLFxuICAgICAgICByZSA9IC9bPyZdPyhbXj1dKyk9KFteJl0qKS9nO1xuXG4gICAgd2hpbGUgKCh0b2tlbnMgPSByZS5leGVjKHFzKSkpIHtcbiAgICAgICAgcGFyYW1zW2RlY29kZVVSSUNvbXBvbmVudCh0b2tlbnNbMV0pXSA9IGRlY29kZVVSSUNvbXBvbmVudCh0b2tlbnNbMl0pO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUFycmF5TnVtYmVySW50b1N0cmluZyhhcnJheSA6IG51bWJlcltdKSA6IHN0cmluZ1xue1xuICAgIGxldCByZXN1bHQgID0gJyc7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgZm9yKGxldCBudW1iZXIgb2YgYXJyYXkpXG4gICAge1xuICAgICAgICBpZiAoaSAlIDIgPT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHBhcnNlTnVtYmVyVG9TdHJpbmcobnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGFyc2VOdW1iZXJUb1N0cmluZyhudW1iZXIgOiBudW1iZXIpIDogc3RyaW5nXG57ICAgIFxuICAgIGxldCBiYXNlMjYgPSBudW1iZXIudG9TdHJpbmcoMjYpO1xuICAgIGxldCBpID0gMDsgXG4gICAgbGV0IGxlbmd0aCA9IGJhc2UyNi5sZW5ndGg7XG5cbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIFxuICAgIHtcbiAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDk2ICsgcGFyc2VJbnQoYmFzZTI2W2ldLDI2KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmdUb051bWJlcihzdHJpbmcgOiBzdHJpbmcpIDogbnVtYmVyXG57ICAgIFxuICAgIGxldCBpID0gMDsgXG4gICAgbGV0IGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgICBsZXQgcmVzdWx0ID0gMDtcblxuICAgIGZvciAoaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBcbiAgICB7XG4gICAgICByZXN1bHQgKz0gKHN0cmluZy5jaGFyQ29kZUF0KGkpIC0gOTYpICogTWF0aC5wb3coMjYsIGxlbmd0aCAtIGkgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTdHJpbmdJbnRvQXJyYXlOdW1iZXIoc3RyaW5nIDogc3RyaW5nKSA6IG51bWJlcltdXG57XG4gICAgbGV0IHJlc3VsdCA6IG51bWJlcltdID0gW107XG5cbiAgICBpZiAoIXN0cmluZykgcmV0dXJuIHJlc3VsdDtcblxuICAgIGxldCBhcnJheSA9IHN0cmluZy5tYXRjaCgvW2Etel0rfFswLTldKy9nKTtcblxuICAgIGZvcihsZXQgZWxlbWVudCBvZiBhcnJheSlcbiAgICB7XG4gICAgICAgIGlmIChwYXJzZUludChlbGVtZW50KSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoZWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VTdHJpbmdUb051bWJlcihlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMDgtMzFcbiAqL1xuXG5kZWNsYXJlIHZhciBnb29nbGUsICQ7XG5cbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vZGlyZWN0b3J5L3V0aWxzL2V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBTZWFyY2hCYXJDb21wb25lbnRcbntcblx0ZG9tSWQ7XG5cblx0b25TZWFyY2ggPSBuZXcgRXZlbnQ8c3RyaW5nPigpO1xuXG5cdGRvbUVsZW1lbnQoKSB7IHJldHVybiAkKGAjJHt0aGlzLmRvbUlkfWApOyB9XG5cblx0Y29uc3RydWN0b3IoZG9tSWQgOiBzdHJpbmcpXG5cdHtcdFxuXHRcdHRoaXMuZG9tSWQgPSBkb21JZDtcblxuXHRcdC8vIGhhbmRsZSBhbGwgdmFsaWRhdGlvbiBieSB1c2VyIChlbnRlciBwcmVzcywgaWNvbiBjbGljay4uLilcblx0XHR0aGlzLmRvbUVsZW1lbnQoKS5rZXl1cCgoZSkgPT5cblx0XHR7ICAgIFxuXHRcdFx0aWYoZS5rZXlDb2RlID09IDEzKSAvLyB0b3VjaGUgZW50csOpZVxuXHRcdFx0eyBcdFx0XHQgXG5cdFx0XHRcdHRoaXMuaGFuZGxlU2VhcmNoQWN0aW9uKCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuZG9tSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5kb21FbGVtZW50KCkucGFyZW50cygpLmZpbmQoJyNzZWFyY2gtYmFyLWljb24nKS5jbGljaygoKSA9PlxuXHRcdHtcdFx0XHRcdFx0XG5cdFx0XHR0aGlzLmhhbmRsZVNlYXJjaEFjdGlvbigpO1xuXHRcdH0pO1x0XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQoKS5vbihcInBsYWNlX2NoYW5nZWRcIiwgdGhpcy5oYW5kbGVTZWFyY2hBY3Rpb24oKSk7XG5cdH1cblxuXG5cdHByaXZhdGUgaGFuZGxlU2VhcmNoQWN0aW9uKClcblx0e1xuXHRcdHRoaXMub25TZWFyY2guZW1pdCh0aGlzLmRvbUVsZW1lbnQoKS52YWwoKSk7XG5cdH1cblxuXHRzZXRWYWx1ZSgkdmFsdWUgOiBzdHJpbmcpXG5cdHtcblx0XHR0aGlzLmRvbUVsZW1lbnQoKS52YWwoJHZhbHVlKTtcblx0fSAgXG4gICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0QXV0b0NvbXBsZXRpb25Gb3JFbGVtZW50KGVsZW1lbnQpXG57XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBjb21wb25lbnRSZXN0cmljdGlvbnM6IHtjb3VudHJ5OiAnZnInfVxuICAgIH07XG4gICAgdmFyIGF1dG9jb21wbGV0ZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGVsZW1lbnQsIG9wdGlvbnMpOyAgIFxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGF1dG9jb21wbGV0ZSwgJ3BsYWNlX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdwbGFjZV9jaGFuZ2VkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn0iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi9hcHAubW9kdWxlXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5pbXBvcnQgeyByZWRpcmVjdFRvRGlyZWN0b3J5IH0gZnJvbSBcIi4uL2NvbW1vbnMvY29tbW9uc1wiO1xuXG4vL2RlY2xhcmUgdmFyICQ7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwcEludGVyYWN0aW9ucygpXG57XHRcblx0Ly9hbmltYXRpb24gcG91ciBsaWVuIGQnYW5jcmUgZGFucyBsYSBwYWdlXG4gICAvKiAkKCdhW2hyZWZePVwiI1wiXScpLmNsaWNrKGZ1bmN0aW9uKCl7ICBcblx0ICAgIGxldCB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xuXHQgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogJCh0YXJnZXQpLm9mZnNldCgpLnRvcH0sIDcwMCk7XG5cdCAgICByZXR1cm4gZmFsc2U7ICBcblx0fSk7ICovXHRcdFxuXG5cdC8qJCgnI21lbnUtYnV0dG9uJykuY2xpY2soYW5pbWF0ZV91cF9iYW5kZWF1X29wdGlvbnMpO1xuXHQkKCcjb3ZlcmxheScpLmNsaWNrKGFuaW1hdGVfZG93bl9iYW5kZWF1X29wdGlvbnMpOyovXG5cblx0dXBkYXRlQ29tcG9uZW50c1NpemUoKTtcblxuXHQkKCcjYnRuLWJhbmRlYXUtaGVscGVyLWNsb3NlJykuY2xpY2soaGlkZUJhbmRlYXVIZWxwZXIpO1xuXG5cdCQoJy5mbGFzaC1tZXNzYWdlIC5idG4tY2xvc2UnKS5jbGljayggZnVuY3Rpb24oKSB7ICQodGhpcykucGFyZW50KCkuc2xpZGVVcCgnZmFzdCcsIGZ1bmN0aW9uKCkgeyB1cGRhdGVDb21wb25lbnRzU2l6ZSgpOyB9KTsgfSk7XG5cblx0JCgnI2J0bi1jbG9zZS1kaXJlY3Rpb25zJykuY2xpY2soICgpID0+IFxuXHR7XG5cdFx0QXBwLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZCA6IEFwcC5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSB9KTtcblx0fSk7XG5cblx0bGV0IHJlcztcblx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSBcblx0e1xuXHQgICBpZiAocmVzKSB7Y2xlYXJUaW1lb3V0KHJlcyk7IH1cblx0ICAgcmVzID0gc2V0VGltZW91dCh1cGRhdGVDb21wb25lbnRzU2l6ZSwyMDApO1xuXHR9O1x0XG5cdFxuXHQvL01lbnUgQ0FSVEVcdFxuXHQkKCcjbWVudS1idXR0b24nKS5jbGljayhzaG93RGlyZWN0b3J5TWVudSk7XG5cdCQoJyNvdmVybGF5JykuY2xpY2soaGlkZURpcmVjdG9yeU1lbnUpO1xuXHQkKCcjZGlyZWN0b3J5LW1lbnUgLmJ0bi1jbG9zZS1tZW51JykuY2xpY2soaGlkZURpcmVjdG9yeU1lbnUpO1xuXG5cdCQoJyNkaXJlY3RvcnktY29udGVudC1tYXAgLnNob3ctYXMtbGlzdC1idXR0b24nKS5jbGljaygoZSA6IEV2ZW50KSA9PiB7XHRcdFxuXHRcdEFwcC5zZXRUaW1lb3V0Q2xpY2tpbmcoKTtcblx0XHRBcHAuc2V0TW9kZShBcHBNb2Rlcy5MaXN0KTtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCAuc2hvdy1hcy1tYXAtYnV0dG9uJykuY2xpY2soKCkgPT4ge1x0XHRcblx0XHRBcHAuc2V0TW9kZShBcHBNb2Rlcy5NYXApO1xuXHR9KTtcblx0XG5cdC8vIGlmIChvbmx5SW5wdXRBZHJlc3NNb2RlKVxuXHQvLyB7XG5cdC8vIFx0c2hvd09ubHlJbnB1dEFkcmVzcygpO1xuXHQvLyB9XG5cblx0Ly8gJCgnI2xpc3RfdGFiJykuY2xpY2soZnVuY3Rpb24oKXtcblx0Ly8gXHQkKFwiI2RpcmVjdG9yeS1jb250ZW50LWxpc3RcIikuc2hvdygpO1xuXHQvLyBcdCQoJyNkaXJlY3RvcnktY29udGFpbmVyJykuaGlkZSgpO1xuXHQvLyB9KTtcblx0Ly8gJCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcF90YWInKS5jbGljayhmdW5jdGlvbigpe1x0XHRcblx0Ly8gXHQkKCcjZGlyZWN0b3J5LWNvbnRhaW5lcicpLnNob3coKTtcblx0Ly8gXHQkKFwiI2RpcmVjdG9yeS1jb250ZW50LWxpc3RcIikuaGlkZSgpO1xuXHQvLyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dEaXJlY3RvcnlNZW51KClcbntcblx0QXBwLmluZm9CYXJDb21wb25lbnQuaGlkZSgpOyAgXG5cdCQoJyNvdmVybGF5JykuY3NzKCd6LWluZGV4JywnMTAnKTtcblx0JCgnI292ZXJsYXknKS5hbmltYXRlKHsnb3BhY2l0eSc6ICcuNid9LDcwMCk7XG5cdCQoJyNkaXJlY3RvcnktbWVudScpLnNob3coIFwic2xpZGVcIiwge2RpcmVjdGlvbjogJ2xlZnQnLCBlYXNpbmc6ICdzd2luZyd9ICwgMzUwLCAoKSA9PiB7IEFwcC5kaXJlY3RvcnlNZW51Q29tcG9uZW50LnVwZGF0ZU1haW5PcHRpb25CYWNrZ3JvdW5kKCkgfSApO1xuXHRcblx0Ly8kKCcjZGlyZWN0b3J5LW1lbnUnKS5jc3MoJ3dpZHRoJywnMHB4Jykuc2hvdygpLmFuaW1hdGUoeyd3aWR0aCc6ICcyNDBweCd9LDcwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlRGlyZWN0b3J5TWVudSgpXG57XG5cdCQoJyNvdmVybGF5JykuY3NzKCd6LWluZGV4JywnLTEnKTtcblx0JCgnI292ZXJsYXknKS5hbmltYXRlKHsnb3BhY2l0eSc6ICcuMCd9LDUwMCk7XG5cdCQoJyNkaXJlY3RvcnktbWVudScpLmhpZGUoIFwic2xpZGVcIiwge2RpcmVjdGlvbjogJ2xlZnQnLCBlYXNpbmc6ICdzd2luZyd9ICwgMjUwICk7XG5cdCQoJyNtZW51LXRpdGxlIC5zaGFkb3ctYm90dG9tJykuaGlkZSgpO1xuXHQvLyQoJyNkaXJlY3RvcnktbWVudScpLmFuaW1hdGUoeyd3aWR0aCc6ICcwcHgnfSw3MDApLmhpZGUoKTtcbn1cblxubGV0IHNsaWRlT3B0aW9ucyA9IHsgZHVyYXRpb246IDUwMCwgZWFzaW5nOiBcImVhc2VPdXRRdWFydFwiLCBxdWV1ZTogZmFsc2UsIGNvbXBsZXRlOiBmdW5jdGlvbigpIHt9fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVCYW5kZWF1SGVscGVyKClcbntcblx0JCgnI2JhbmRlYXVfaGVscGVyJykuc2xpZGVVcChzbGlkZU9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd09ubHlJbnB1dEFkcmVzcygpXG57XG5cdGhpZGVCYW5kZWF1SGVscGVyKCk7XG5cdCQoJyNkaXJlY3RvcnktY29udGVudCcpLmNzcygnbWFyZ2luLWxlZnQnLCcwJyk7XG5cdCQoJyNiYW5kZWF1X3RhYnMnKS5oaWRlKCk7XG5cdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0JykuaGlkZSgpO1xuXHR1cGRhdGVDb21wb25lbnRzU2l6ZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ29tcG9uZW50c1NpemUoKVxue1x0XG5cdC8vJChcIiNiYW5kZWF1X29wdGlvblwiKS5jc3MoJ2hlaWdodCcsJCggd2luZG93ICkuaGVpZ2h0KCktJCgnaGVhZGVyJykuaGVpZ2h0KCkpO1xuXHQvL2NvbnNvbGUubG9nKFwiVXBkYXRlIGNvbXBvbmVudCBzaXplXCIpO1xuXHQkKCcjcGFnZS1jb250ZW50JykuY3NzKCdoZWlnaHQnLCdhdXRvJyk7XG5cblx0bGV0IGNvbnRlbnRfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gJCgnaGVhZGVyJykuaGVpZ2h0KCk7XG5cdGNvbnRlbnRfaGVpZ2h0IC09ICQoJy5mbGFzaC1tZXNzYWdlcy1jb250YWluZXInKS5vdXRlckhlaWdodCh0cnVlKTtcblx0JChcIiNkaXJlY3RvcnktY29udGFpbmVyXCIpLmNzcygnaGVpZ2h0Jyxjb250ZW50X2hlaWdodCk7XG5cdCQoXCIjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdFwiKS5jc3MoJ2hlaWdodCcsY29udGVudF9oZWlnaHQpO1xuXG5cdGlmIChBcHApIHNldFRpbWVvdXQoQXBwLnVwZGF0ZU1heEVsZW1lbnRzLCA1MDApO1xuXG5cdHVwZGF0ZUluZm9CYXJTaXplKCk7XHRcblx0dXBkYXRlTWFwU2l6ZSgpO1xufVxuXG5cbmxldCBtYXRjaE1lZGlhQmlnU2l6ZV9vbGQ7XG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTWFwU2l6ZShlbGVtZW50SW5mb0Jhcl9oZWlnaHQgPSAkKCcjZWxlbWVudC1pbmZvLWJhcicpLm91dGVySGVpZ2h0KHRydWUpKVxue1x0XHRcblx0Ly9jb25zb2xlLmxvZyhcInVwZGF0ZU1hcFNpemVcIiwgZWxlbWVudEluZm9CYXJfaGVpZ2h0KTtcblx0aWYoXCJtYXRjaE1lZGlhXCIgaW4gd2luZG93KSBcblx0e1x0XG5cdFx0aWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNjAwcHgpXCIpLm1hdGNoZXMpIFxuXHQgIFx0e1xuXHQgIFx0XHQkKFwiI2RpcmVjdG9yeS1tZW51XCIpLmNzcygnaGVpZ2h0JywkKFwiI2RpcmVjdG9yeS1jb250ZW50XCIpLmhlaWdodCgpLWVsZW1lbnRJbmZvQmFyX2hlaWdodCk7XHRcblx0ICBcdH1cblx0ICBcdGVsc2Vcblx0ICBcdHtcblx0ICBcdFx0JChcIiNkaXJlY3RvcnktbWVudVwiKS5jc3MoJ2hlaWdodCcsJzEwMCUnKTtcblx0ICBcdH1cblxuXHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDEyMDBweClcIikubWF0Y2hlcykgXG5cdFx0e1xuXHRcdCAgXHRpZiAobWF0Y2hNZWRpYUJpZ1NpemVfb2xkKSBlbGVtZW50SW5mb0Jhcl9oZWlnaHQgPSAwO1xuXG5cdFx0ICBcdC8vY29uc29sZS5sb2coXCJyZXNpemUgbWFwIGhlaWdodCB0b1wiLCAkKFwiI2RpcmVjdG9yeS1jb250ZW50XCIpLm91dGVySGVpZ2h0KCktZWxlbWVudEluZm9CYXJfaGVpZ2h0KTtcblx0XHQgIFx0JChcIiNkaXJlY3RvcnktY29udGVudC1tYXBcIikuY3NzKCdoZWlnaHQnLCQoXCIjZGlyZWN0b3J5LWNvbnRlbnRcIikub3V0ZXJIZWlnaHQoKS1lbGVtZW50SW5mb0Jhcl9oZWlnaHQpO1x0XG5cdFx0ICBcdFxuXG5cdFx0ICBcdG1hdGNoTWVkaWFCaWdTaXplX29sZCA9IGZhbHNlO1xuXHQgIFx0fSBcblx0XHRlbHNlIFxuXHRcdHtcdFx0XHRcblx0XHQgIFx0JChcIiNkaXJlY3RvcnktY29udGVudC1tYXBcIikuY3NzKCdoZWlnaHQnLCQoXCIjZGlyZWN0b3J5LWNvbnRlbnRcIikuaGVpZ2h0KCkpO1x0XG5cdFx0ICBcdGlmICgkKCcjZWxlbWVudC1pbmZvLWJhcicpLmlzKFwiOnZpc2libGVcIikpIFxuXHQgIFx0XHR7XG5cdCAgXHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLmNzcygnbWFyZ2luLXJpZ2h0JywnNDgwcHgnKTtcblx0ICBcdFx0XHQkKCcjYmFuZGVhdV9oZWxwZXInKS5jc3MoJ21hcmdpbi1yaWdodCcsJzQ4MHB4Jyk7XG5cdCAgXHRcdFx0XG5cdCAgXHRcdH1cblx0XHQgIFx0ZWxzZSBcblx0ICBcdFx0e1xuXHQgIFx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1tYXAnKS5jc3MoJ21hcmdpbi1yaWdodCcsJzBweCcpO1xuXHQgIFx0XHRcdCQoJyNiYW5kZWF1X2hlbHBlcicpLmNzcygnbWFyZ2luLXJpZ2h0JywnMHB4Jyk7XG5cdCAgXHRcdH1cblx0XHQgIFx0bWF0Y2hNZWRpYUJpZ1NpemVfb2xkID0gdHJ1ZTsgXHRcblx0XHR9XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0Y29uc29sZS5lcnJvcihcIk1hdGNoIE1lZGlhIG5vdCBhdmFpbGFibGVcIik7XG5cdH1cblxuXHQvLyBhcHLDqHMgNTAwbXMgbCdhbmltYXRpb24gZGUgcmVkaW1lbnNpb25uZW1lbnQgZXN0IHRlcm1pbsOpXG5cdC8vIG9uIHRyaWdnZXIgY2V0IMOpdmVuZW1lbnQgcG91ciBxdWUgbGEgY2FydGUgc2UgcmVkaW1lbnNpb25uZSB2cmFpbWVudFxuXHRpZiAoQXBwLm1hcENvbXBvbmVudCkgc2V0VGltZW91dChmdW5jdGlvbigpIHsgQXBwLm1hcENvbXBvbmVudC5yZXNpemUoKTsgfSw1MDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlSW5mb0JhclNpemUoKVxue1xuXHRpZiAoJCgnI2VsZW1lbnQtaW5mby1iYXInKS53aWR0aCgpIDwgNjAwKVxuXHR7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5yZW1vdmVDbGFzcyhcImxhcmdlV2lkdGhcIik7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5hZGRDbGFzcyhcInNtYWxsV2lkdGhcIik7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5hZGRDbGFzcyhcImxhcmdlV2lkdGhcIik7XG5cdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5yZW1vdmVDbGFzcyhcInNtYWxsV2lkdGhcIik7XG5cdH1cblxuXHRpZihcIm1hdGNoTWVkaWFcIiBpbiB3aW5kb3cpIFxuXHR7XHRcblx0XHRpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiAxMjAwcHgpXCIpLm1hdGNoZXMpIFxuXHRcdHtcblx0XHQgIFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVEZXRhaWxzJykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAuY29sbGFwc2libGUtYm9keScpLmNzcygnbWFyZ2luLXRvcCcsJzBweCcpO1xuXHQgIFx0fSBcblx0XHRlbHNlIFxuXHRcdHtcdFx0XHRcblx0XHQgIFx0bGV0IGVsZW1lbnRJbmZvQmFyID0gJChcIiNlbGVtZW50LWluZm8tYmFyXCIpO1xuXHRcdCAgXHRsZXQgaGVpZ2h0ID0gZWxlbWVudEluZm9CYXIub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRoZWlnaHQgLT0gZWxlbWVudEluZm9CYXIuZmluZCgnLmNvbGxhcHNpYmxlLWhlYWRlcicpLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0aGVpZ2h0IC09IGVsZW1lbnRJbmZvQmFyLmZpbmQoJy5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2UtaGVscGVyOnZpc2libGUnKS5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdGhlaWdodCAtPSBlbGVtZW50SW5mb0Jhci5maW5kKFwiLm1lbnUtZWxlbWVudFwiKS5vdXRlckhlaWdodCh0cnVlKTtcblxuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAuY29sbGFwc2libGUtYm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcblx0XHQgIFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLmNvbGxhcHNpYmxlLWJvZHknKS5jc3MoJ21hcmdpbi10b3AnLCBlbGVtZW50SW5mb0Jhci5maW5kKCcuY29sbGFwc2libGUtaGVhZGVyJykub3V0ZXJIZWlnaHQodHJ1ZSkrZWxlbWVudEluZm9CYXIuZmluZCgnLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZS1oZWxwZXI6dmlzaWJsZScpLm91dGVySGVpZ2h0KHRydWUpKTtcblx0XHR9XG5cdH1cbn1cblxuXG5cblxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJsZWFmbGV0XCIgLz5cblxuZGVjbGFyZSBsZXQgd2luZG93LCBSb3V0aW5nIDogYW55O1xuZGVjbGFyZSBsZXQgQ09ORklHLCBNQUlOX0NBVEVHT1JZLCBPUEVOSE9VUlNfQ0FURUdPUlk7XG5kZWNsYXJlIHZhciAkO1xuXG5pbXBvcnQgeyBHZW9jb2Rlck1vZHVsZSwgR2VvY29kZVJlc3VsdCB9IGZyb20gXCIuL21vZHVsZXMvZ2VvY29kZXIubW9kdWxlXCI7XG5pbXBvcnQgeyBGaWx0ZXJNb2R1bGUgfSBmcm9tIFwiLi9tb2R1bGVzL2ZpbHRlci5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnRzTW9kdWxlLCBFbGVtZW50c0NoYW5nZWQgfSBmcm9tIFwiLi9tb2R1bGVzL2VsZW1lbnRzLm1vZHVsZVwiO1xuaW1wb3J0IHsgRGlzcGxheUVsZW1lbnRBbG9uZU1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZGlzcGxheS1lbGVtZW50LWFsb25lLm1vZHVsZVwiO1xuaW1wb3J0IHsgQWpheE1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvYWpheC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3JpZXNNb2R1bGUgfSBmcm9tICcuL21vZHVsZXMvY2F0ZWdvcmllcy5tb2R1bGUnO1xuaW1wb3J0IHsgRGlyZWN0aW9uc01vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZGlyZWN0aW9ucy5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnRMaXN0Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9lbGVtZW50LWxpc3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbmZvQmFyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmZvLWJhci5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNlYXJjaEJhckNvbXBvbmVudCB9IGZyb20gXCIuLi9jb21tb25zL3NlYXJjaC1iYXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXJlY3RvcnlNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9kaXJlY3RvcnktbWVudS5jb21wb25lbnRcIjtcbmltcG9ydCB7IE1hcENvbXBvbmVudCwgVmlld1BvcnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL21hcC9tYXAuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBCaW9wZW5NYXJrZXIgfSBmcm9tIFwiLi9jb21wb25lbnRzL21hcC9iaW9wZW4tbWFya2VyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSGlzdG9yeU1vZHVsZSwgSGlzdG9yeVN0YXRlIH0gZnJvbSAnLi9tb2R1bGVzL2hpc3RvcnkubW9kdWxlJztcbmltcG9ydCB7IEJvdW5kc01vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy9ib3VuZHMubW9kdWxlJztcblxuXG5pbXBvcnQgeyBpbml0aWFsaXplQXBwSW50ZXJhY3Rpb25zIH0gZnJvbSBcIi4vYXBwLWludGVyYWN0aW9uc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUVsZW1lbnRNZW51IH0gZnJvbSBcIi4vY29tcG9uZW50cy9lbGVtZW50LW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBpbml0aWFsaXplVm90aW5nIH0gZnJvbSBcIi4vY29tcG9uZW50cy92b3RlLmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBnZXRRdWVyeVBhcmFtcywgY2FwaXRhbGl6ZSB9IGZyb20gXCIuLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmRlY2xhcmUgdmFyIEFwcCA6IEFwcE1vZHVsZTtcblxuLyoqXG4qIEFwcCBpbml0aWFsaXNhdGlvbiB3aGVuIGRvY3VtZW50IHJlYWR5XG4qL1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKVxue1x0XG4gICBBcHAgPSBuZXcgQXBwTW9kdWxlKCk7ICAgICAgXG5cbiAgIEFwcC5jYXRlZ29yeU1vZHVsZS5jcmVhdGVDYXRlZ29yaWVzRnJvbUpzb24oTUFJTl9DQVRFR09SWSwgT1BFTkhPVVJTX0NBVEVHT1JZKTtcblxuICAgQXBwLmVsZW1lbnRNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuICBcbiAgIEFwcC5ib3VuZHNNb2R1bGUuaW5pdGlhbGl6ZSgpO1xuXG4gICBBcHAubG9hZEhpc3RvcnlTdGF0ZSgpO1xuXG4gICBpbml0aWFsaXplQXBwSW50ZXJhY3Rpb25zKCk7XG4gICBpbml0aWFsaXplRWxlbWVudE1lbnUoKTtcbiAgIGluaXRpYWxpemVWb3RpbmcoKTtcbn0pO1xuXG4vKlxuKiBBcHAgc3RhdGVzIG5hbWVzXG4qL1xuZXhwb3J0IGVudW0gQXBwU3RhdGVzIFxue1xuXHROb3JtYWwsXG5cdFNob3dFbGVtZW50LFxuXHRTaG93RWxlbWVudEFsb25lLFxuXHRTaG93RGlyZWN0aW9ucyxcblx0Q29uc3RlbGxhdGlvbixcblx0U3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlICAgIFxufVxuXG5leHBvcnQgZW51bSBBcHBNb2Rlc1xue1xuXHRNYXAsXG5cdExpc3Rcbn1cblxuLypcbiogQXBwIE1vZHVsZS4gTWFpbiBtb2R1bGUgb2YgdGhlIEFwcFxuKlxuKiBBcHBNb2R1bGUgY3JlYXRlcyBhbGwgb3RoZXJzIG1vZHVsZXMsIGFuZCBkZWFscyB3aXRoIHRoZWlycyBldmVudHNcbiovXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlXG57XHRcdFxuXHRnZW9jb2Rlck1vZHVsZV8gPSBuZXcgR2VvY29kZXJNb2R1bGUoKTtcblx0ZmlsdGVyTW9kdWxlXyA9IG5ldyBGaWx0ZXJNb2R1bGUoKTtcblx0ZWxlbWVudHNNb2R1bGVfID0gbmV3IEVsZW1lbnRzTW9kdWxlKCk7XG5cdGRpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGVfID0gbmV3IERpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGUoKTtcblx0ZGlyZWN0aW9uc01vZHVsZV8gOiBEaXJlY3Rpb25zTW9kdWxlID0gbmV3IERpcmVjdGlvbnNNb2R1bGUoKTtcblx0YWpheE1vZHVsZV8gPSBuZXcgQWpheE1vZHVsZSgpO1xuXHRpbmZvQmFyQ29tcG9uZW50XyA9IG5ldyBJbmZvQmFyQ29tcG9uZW50KCk7XG5cdG1hcENvbXBvbmVudF8gID0gbmV3IE1hcENvbXBvbmVudCgpO1xuXHRzZWFyY2hCYXJDb21wb25lbnQgPSBuZXcgU2VhcmNoQmFyQ29tcG9uZW50KCdzZWFyY2gtYmFyJyk7XG5cdGVsZW1lbnRMaXN0Q29tcG9uZW50ID0gbmV3IEVsZW1lbnRMaXN0Q29tcG9uZW50KCk7XG5cdGhpc3RvcnlNb2R1bGUgPSBuZXcgSGlzdG9yeU1vZHVsZSgpO1xuXHRjYXRlZ29yeU1vZHVsZSA9IG5ldyBDYXRlZ29yaWVzTW9kdWxlKCk7XG5cdGRpcmVjdG9yeU1lbnVDb21wb25lbnQgPSBuZXcgRGlyZWN0b3J5TWVudUNvbXBvbmVudCgpO1xuXHRib3VuZHNNb2R1bGUgPSBuZXcgQm91bmRzTW9kdWxlKCk7XG5cblx0Ly9zdGFyUmVwcmVzZW50YXRpb25DaG9pY2VNb2R1bGVfID0gY29uc3RlbGxhdGlvbk1vZGUgPyBuZXcgU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlTW9kdWxlKCkgOiBudWxsO1xuXHRcblx0Ly8gY3VyciBzdGF0ZSBvZiB0aGUgYXBwXG5cdHByaXZhdGUgc3RhdGVfIDogQXBwU3RhdGVzID0gbnVsbDtcdFxuXHRwcml2YXRlIG1vZGVfIDogQXBwTW9kZXMgPSBudWxsO1xuXG5cdC8vIHNvbWVzIHN0YXRlcyBuZWVkIGEgZWxlbWVudCBpZCwgd2Ugc3RvcmUgaXQgaW4gdGhpcyBwcm9wZXJ0eVxuXHRwcml2YXRlIHN0YXRlRWxlbWVudElkIDogbnVtYmVyID0gbnVsbDtcblxuXG5cdC8vIHdoZW4gY2xpY2sgb24gbWFya2VyIGl0IGFsc28gdHJpZ2VyIGNsaWNrIG9uIG1hcFxuXHQvLyB3aGVuIGNsaWNrIG9uIG1hcmtlciB3ZSBwdXQgaXNDbGlja2luZyB0byB0cnVlIGR1cmluZ1xuXHQvLyBmZXcgbWlsbGlzZWNvbmRzIHNvIHRoZSBtYXAgZG9uJ3QgZG8gYW55dGhpbmcgaXMgY2xpY2sgZXZlbnRcblx0aXNDbGlja2luZ18gPSBmYWxzZTtcblxuXHQvLyBwcmV2ZW50IHVwZGF0ZWRpcmVjdG9yeS1jb250ZW50LWxpc3Qgd2hpbGUgdGhlIGFjdGlvbiBpcyBqdXN0XG5cdC8vIHNob3dpbmcgZWxlbWVudCBkZXRhaWxzXG5cdGlzU2hvd2luZ0luZm9CYXJDb21wb25lbnRfID0gZmFsc2U7XG5cblx0Ly8gUHV0IGEgbGltaXQgb2YgbWFya2VycyBzaG93ZWQgb24gbWFwIChtYXJrZXJzIG5vdCBjbHVzdGVyZWQpXG5cdC8vIEJlY2F1c2UgaWYgdG9vIG1hbnkgbWFya2VycyBhcmUgc2hvd24sIGJyb3dzZXIgc2xvdyBkb3duXG5cdG1heEVsZW1lbnRzVG9TaG93T25NYXBfID0gMTAwMDtcdFxuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuaW5mb0JhckNvbXBvbmVudF8ub25TaG93LmRvKCAoZWxlbWVudElkKSA9PiB7IHRoaXMuaGFuZGxlSW5mb0JhclNob3coZWxlbWVudElkKTsgfSk7XG4gIFx0dGhpcy5pbmZvQmFyQ29tcG9uZW50Xy5vbkhpZGUuZG8oICgpPT4geyB0aGlzLmhhbmRsZUluZm9CYXJIaWRlKCk7IH0pO1xuXHRcblx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25NYXBSZWFkeS5kbyggKCkgPT4geyB0aGlzLmluaXRpYWxpemVNYXBGZWF0dXJlcygpOyB9KTtcblxuXHRcdC8vdGhpcy5nZW9jb2Rlck1vZHVsZV8ub25SZXN1bHQuZG8oIChhcnJheSkgPT4geyB0aGlzLmhhbmRsZUdlb2NvZGluZyhhcnJheSk7IH0pO1xuXHRcdHRoaXMuYWpheE1vZHVsZV8ub25OZXdFbGVtZW50cy5kbyggKGVsZW1lbnRzKSA9PiB7IHRoaXMuaGFuZGxlTmV3RWxlbWVudHNSZWNlaXZlZEZyb21TZXJ2ZXIoZWxlbWVudHMpOyB9KTtcblx0XG5cdFx0dGhpcy5lbGVtZW50c01vZHVsZV8ub25FbGVtZW50c0NoYW5nZWQuZG8oIChlbGVtZW50c0NoYW5nZWQpPT4geyB0aGlzLmhhbmRsZUVsZW1lbnRzQ2hhbmdlZChlbGVtZW50c0NoYW5nZWQpOyB9KTtcblx0XG5cdFx0dGhpcy5zZWFyY2hCYXJDb21wb25lbnQub25TZWFyY2guZG8oIChhZGRyZXNzIDogc3RyaW5nKSA9PiB7IHRoaXMuaGFuZGxlU2VhcmNoQWN0aW9uKGFkZHJlc3MpOyB9KTtcblxuXHRcdHRoaXMubWFwQ29tcG9uZW50Xy5vbklkbGUuZG8oICgpID0+IHsgdGhpcy5oYW5kbGVNYXBJZGxlKCk7ICB9KTtcblx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25DbGljay5kbyggKCkgPT4geyB0aGlzLmhhbmRsZU1hcENsaWNrKCk7IH0pO1x0XHRcblx0fVxuXG5cdGluaXRpYWxpemVNYXBGZWF0dXJlcygpXG5cdHtcdFxuXHRcdFxuXHR9O1xuXG5cdC8qXG5cdCogTG9hZCBpbml0aWFsIHN0YXRlIHdpdGggQ09ORklHIHByb3ZpZGVkIGJ5IHN5bWZvbnkgY29udHJvbGxlciBvclxuXHQgIHdpdGggc3RhdGUgcG9wZWQgYnkgd2luZG93IGhpc3RvcnkgbWFuYWdlclxuXHQqL1xuXHRsb2FkSGlzdG9yeVN0YXRlKGhpc3RvcnlzdGF0ZSA6IEhpc3RvcnlTdGF0ZSA9IENPTkZJRywgJGJhY2tGcm9tSGlzdG9yeSA9IGZhbHNlKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImxvYWRIaXN0b3J5c3RhdGUgZmlsdGVyc2RcIiwgaGlzdG9yeXN0YXRlLmZpbHRlcnMpXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5maWx0ZXJzKVxuXHRcdHtcblx0XHRcdHRoaXMuZmlsdGVyTW9kdWxlLmxvYWRGaWx0ZXJzRnJvbVN0cmluZyhoaXN0b3J5c3RhdGUuZmlsdGVycyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLmRpcmVjdG9yeU1lbnVDb21wb25lbnQuc2V0TWFpbk9wdGlvbignYWxsJyk7XG5cdFx0fVxuXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZSA9PT0gbnVsbCkgcmV0dXJuO1xuXG5cdFx0Ly8gaWYgbm8gYmFja2Zyb21oaXN0b3J5IHRoYXQgbWVhbnMgaGlzdG9yeXN0YXRlIGlzIGFjdHVhbGx5IHRoZSBDT05GSUdcblx0XHQvLyBnaXZlbiBieSBzeW1mb255LCBzbyB3ZSBuZWVkIHRvIGNvbnZlcnQgdGhpcyBvYmVjdCBpbiByZWFsIEhpc3RvcnlzdGF0ZSBjbGFzc1xuXHRcdGlmICghJGJhY2tGcm9tSGlzdG9yeSlcblx0XHRcdGhpc3RvcnlzdGF0ZSA9IG5ldyBIaXN0b3J5U3RhdGUoKS5wYXJzZShoaXN0b3J5c3RhdGUpO1x0XHRcblxuXHRcdGlmIChoaXN0b3J5c3RhdGUudmlld3BvcnQpXG5cdFx0e1x0XHRcdFxuXHRcdFx0Ly8gaWYgbWFwIG5vdCBsb2FkZWQgd2UganVzdCBzZXQgdGhlIG1hcENvbXBvbmVudCB2aWV3cG9ydCB3aXRob3V0IGNoYW5naW5nIHRoZVxuXHRcdFx0Ly8gYWN0dWFsIHZpZXdwb3J0IG9mIHRoZSBtYXAsIGJlY2F1c2UgaXQgd2lsbCBiZSBkb25lIGluXG5cdFx0XHQvLyBtYXAgaW5pdGlhbGlzYXRpb25cblx0XHRcdHRoaXMubWFwQ29tcG9uZW50LnNldFZpZXdQb3J0KGhpc3RvcnlzdGF0ZS52aWV3cG9ydCwgdGhpcy5tYXBDb21wb25lbnQuaXNNYXBMb2FkZWQpO1xuXG5cdFx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XG5cblx0XHRcdGlmIChoaXN0b3J5c3RhdGUubW9kZSA9PSBBcHBNb2Rlcy5MaXN0IClcblx0XHRcdHtcblx0XHRcdFx0bGV0IGxvY2F0aW9uID0gTC5sYXRMbmcoaGlzdG9yeXN0YXRlLnZpZXdwb3J0LmxhdCwgaGlzdG9yeXN0YXRlLnZpZXdwb3J0LmxuZyk7XG5cdFx0XHR9XHRcblx0XHR9XHRcblxuXHRcdHRoaXMuc2V0TW9kZShoaXN0b3J5c3RhdGUubW9kZSwgJGJhY2tGcm9tSGlzdG9yeSwgZmFsc2UpO1xuXG5cdFx0Ly8gaWYgYWRkcmVzcyBpcyBwcm92aWRlZCB3ZSBnZW9sb2NhbGl6ZVxuXHRcdC8vIGlmIG5vIHZpZXdwb3J0IGFuZCBzdGF0ZSBub3JtYWwgd2UgZ2VvY29kZSBvbiBkZWZhdWx0IGxvY2F0aW9uXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5hZGRyZXNzIHx8ICghaGlzdG9yeXN0YXRlLnZpZXdwb3J0ICYmIGhpc3RvcnlzdGF0ZS5zdGF0ZSA9PT0gQXBwU3RhdGVzLk5vcm1hbCkpIFxuXHRcdHtcblx0XHRcdHRoaXMuZ2VvY29kZXJNb2R1bGVfLmdlb2NvZGVBZGRyZXNzKFxuXHRcdFx0XHRoaXN0b3J5c3RhdGUuYWRkcmVzcywgXG5cdFx0XHRcdChyZXN1bHRzKSA9PiBcblx0XHRcdFx0eyBcblx0XHRcdFx0XHQvLyBpZiB2aWV3cG9ydCBpcyBnaXZlbiwgbm90aGluZyB0byBkbywgd2UgYWxyZWFkeSBkaWQgaW5pdGlhbGl6YXRpb25cblx0XHRcdFx0XHQvLyB3aXRoIHZpZXdwb3J0XG5cdFx0XHRcdFx0aWYgKGhpc3RvcnlzdGF0ZS52aWV3cG9ydCAmJiBoaXN0b3J5c3RhdGUubW9kZSA9PSBBcHBNb2Rlcy5NYXApIHJldHVybjtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZUdlb2NvZGVSZXN1bHQocmVzdWx0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHQvLyBmYWlsdXJlIGNhbGxiYWNrXG5cdFx0XHRcdFx0dGhpcy5zZWFyY2hCYXJDb21wb25lbnQuc2V0VmFsdWUoXCJFcnJldXIgZGUgbG9jYWxpc2F0aW9uIDogXCIgKyBoaXN0b3J5c3RhdGUuYWRkcmVzcyk7XG5cdFx0XHRcdFx0aWYgKCFoaXN0b3J5c3RhdGUudmlld3BvcnQpIFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIGdlb2NvZGUgZGVmYXVsdCBsb2NhdGlvblxuXHRcdFx0XHRcdFx0dGhpcy5nZW9jb2Rlck1vZHVsZV8uZ2VvY29kZUFkZHJlc3MoJycsIChyKSA9PiB7IHRoaXMuaGFuZGxlR2VvY29kZVJlc3VsdChyKTsgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XHRcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5pZCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShcblx0XHRcdFx0aGlzdG9yeXN0YXRlLnN0YXRlLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQ6IGhpc3RvcnlzdGF0ZS5pZCwgXG5cdFx0XHRcdFx0cGFuVG9Mb2NhdGlvbjogKGhpc3RvcnlzdGF0ZS52aWV3cG9ydCA9PT0gbnVsbClcblx0XHRcdFx0fSxcblx0XHRcdFx0JGJhY2tGcm9tSGlzdG9yeSk7XG5cdFx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShoaXN0b3J5c3RhdGUuc3RhdGUsIG51bGwsICRiYWNrRnJvbUhpc3RvcnkpO1x0XHRcblx0XHR9XHRcdFxuXHR9O1x0XG5cblx0c2V0TW9kZSgkbW9kZSA6IEFwcE1vZGVzLCAkYmFja0Zyb21IaXN0b3J5IDogYm9vbGVhbiA9IGZhbHNlLCAkdXBkYXRlVGl0bGVBbmRTdGF0ZSA9IHRydWUpXG5cdHtcblx0XHRpZiAoJG1vZGUgIT0gdGhpcy5tb2RlXylcblx0XHR7XHRcdFx0XG5cdFx0XHRpZiAoJG1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuc2hvdygpO1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCcpLmhpZGUoKTtcdFx0XHRcdFxuXG5cdFx0XHRcdHRoaXMubWFwQ29tcG9uZW50LmluaXQoKTtcblxuXHRcdFx0XHRpZiAodGhpcy5tYXBDb21wb25lbnRfLmlzTWFwTG9hZGVkKSB0aGlzLmJvdW5kc01vZHVsZS5leHRlbmRCb3VuZHMoMCwgdGhpcy5tYXBDb21wb25lbnQuZ2V0Qm91bmRzKCkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuaGlkZSgpO1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCcpLnNob3coKTtcblxuXHRcdFx0XHRpZiAoQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpIFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMuYm91bmRzTW9kdWxlLmNyZWF0ZUJvdW5kc0Zyb21Mb2NhdGlvbihBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKSk7XG5cdFx0XHRcdFx0XHR0aGlzLmNoZWNrRm9yTmV3RWxlbWVudHNUb1JldHJpZXZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiBwcmV2aW91cyBtb2RlIHdhc24ndCBudWxsIFxuXHRcdFx0bGV0IG9sZE1vZGUgPSB0aGlzLm1vZGVfO1xuXHRcdFx0dGhpcy5tb2RlXyA9ICRtb2RlO1xuXG5cdFx0XHQvLyB1cGRhdGUgaGlzdG9yeSBpZiB3ZSBuZWVkIHRvXG5cdFx0XHRpZiAob2xkTW9kZSAhPSBudWxsICYmICEkYmFja0Zyb21IaXN0b3J5KSB0aGlzLmhpc3RvcnlNb2R1bGUucHVzaE5ld1N0YXRlKCk7XG5cblxuXHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmNsZWFyQ3VycmVudHNFbGVtZW50KCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSwgdHJ1ZSk7XG5cblx0XHRcdGlmICgkdXBkYXRlVGl0bGVBbmRTdGF0ZSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy51cGRhdGVEb2N1bWVudFRpdGxlKCk7XHRcdFx0XG5cblx0XHRcdFx0Ly8gYWZ0ZXIgY2xlYXJpbmcsIHdlIHNldCB0aGUgY3VycmVudCBzdGF0ZSBhZ2FpblxuXHRcdFx0XHRpZiAoJG1vZGUgPT0gQXBwTW9kZXMuTWFwKSB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUsIHtpZCA6IHRoaXMuc3RhdGVFbGVtZW50SWR9KTtcdFxuXHRcdFx0fVx0XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHQvKlxuXHQqIENoYW5nZSBBcHAgc3RhdGVcblx0Ki9cblx0c2V0U3RhdGUoJG5ld1N0YXRlIDogQXBwU3RhdGVzLCBvcHRpb25zIDogYW55ID0ge30sICRiYWNrRnJvbUhpc3RvcnkgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7IFx0XG5cdFx0Ly9jb25zb2xlLmxvZyhcIkFwcE1vZHVsZSBzZXQgU3RhdGUgOiBcIiArIEFwcFN0YXRlc1skbmV3U3RhdGVdICArICAnLCBvcHRpb25zID0gJyxvcHRpb25zKTtcblx0XHRcblx0XHRsZXQgZWxlbWVudDtcblxuXHRcdGxldCBvbGRTdGF0ZU5hbWUgPSB0aGlzLnN0YXRlXztcblx0XHR0aGlzLnN0YXRlXyA9ICRuZXdTdGF0ZTtcdFx0XHRcblxuXHRcdGlmIChvbGRTdGF0ZU5hbWUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zICYmIHRoaXMuZGlyZWN0aW9uc01vZHVsZV8pIFxuXHRcdFx0dGhpcy5kaXJlY3Rpb25zTW9kdWxlXy5jbGVhcigpO1xuXG5cdFx0aWYgKG9sZFN0YXRlTmFtZSA9PSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSlcdFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudE1vZHVsZS5jbGVhckN1cnJlbnRzRWxlbWVudCgpO1xuXHRcdFx0dGhpcy5kaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXy5lbmQoKTtcdFxuXHRcdH1cdFxuXG5cdFx0dGhpcy5zdGF0ZUVsZW1lbnRJZCA9IG9wdGlvbnMgPyBvcHRpb25zLmlkIDogbnVsbDtcblx0XHRcblx0XHRzd2l0Y2ggKCRuZXdTdGF0ZSlcblx0XHR7XG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5Ob3JtYWw6XHRcdFx0XG5cdFx0XHRcdC8vIGlmICh0aGlzLnN0YXRlXyA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbikgXG5cdFx0XHRcdC8vIHtcblx0XHRcdFx0Ly8gXHRjbGVhckRpcmVjdG9yeU1lbnUoKTtcblx0XHRcdFx0Ly8gXHR0aGlzLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZU1vZHVsZV8uZW5kKCk7XG5cdFx0XHRcdC8vIH1cdFxuXHRcdFx0XHRpZiAoJGJhY2tGcm9tSGlzdG9yeSkgdGhpcy5pbmZvQmFyQ29tcG9uZW50LmhpZGUoKTtcdFx0XHRcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudDpcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSByZXR1cm47XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmVsZW1lbnRCeUlkKG9wdGlvbnMuaWQpLm1hcmtlci5zaG93Tm9ybWFsSGlkZGVuKCk7XG5cdFx0XHRcdHRoaXMuZWxlbWVudEJ5SWQob3B0aW9ucy5pZCkubWFya2VyLnNob3dCaWdTaXplKCk7XG5cdFx0XHRcdHRoaXMuaW5mb0JhckNvbXBvbmVudC5zaG93RWxlbWVudChvcHRpb25zLmlkKTtcblxuXHRcdFx0XHRicmVhaztcdFxuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudEFsb25lOlxuXHRcdFx0XHRpZiAoIW9wdGlvbnMuaWQpIHJldHVybjtcblxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5lbGVtZW50QnlJZChvcHRpb25zLmlkKTtcblx0XHRcdFx0aWYgKGVsZW1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLkRFQU1vZHVsZS5iZWdpbihlbGVtZW50LmlkLCBvcHRpb25zLnBhblRvTG9jYXRpb24pO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFqYXhNb2R1bGVfLmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQsXG5cdFx0XHRcdFx0XHQoZWxlbWVudEpzb24pID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhbZWxlbWVudEpzb25dLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5ERUFNb2R1bGUuYmVnaW4oZWxlbWVudEpzb24uaWQsIG9wdGlvbnMucGFuVG9Mb2NhdGlvbik7XG5cdFx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZShvcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0Ly8gd2UgZ2V0IGVsZW1lbnQgYXJvdW5kIHNvIGlmIHRoZSB1c2VyIGVuZCB0aGUgRFBBTWRvdWxlXG5cdFx0XHRcdFx0XHRcdC8vIHRoZSBlbGVtZW50cyB3aWxsIGFscmVhZHkgYmUgYXZhaWxhYmxlIHRvIGRpc3BsYXlcblx0XHRcdFx0XHRcdFx0Ly90aGlzLmFqYXhNb2R1bGUuZ2V0RWxlbWVudHNJbkJvdW5kcyhbdGhpcy5tYXBDb21wb25lbnQuZ2V0Qm91bmRzKCldKTtcdCBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQoZXJyb3IpID0+IHsgLypUT0RPKi8gYWxlcnQoXCJObyBlbGVtZW50IHdpdGggdGhpcyBpZFwiKTsgfVxuXHRcdFx0XHRcdCk7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSByZXR1cm47XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5lbGVtZW50QnlJZChvcHRpb25zLmlkKTtcblx0XHRcdFx0bGV0IG9yaWdpbjtcblxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZV8gPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcmlnaW4gPSB0aGlzLmNvbnN0ZWxsYXRpb24uZ2V0T3JpZ2luKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3JpZ2luID0gdGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbG9jYWwgZnVuY3Rpb25cblx0XHRcdFx0bGV0IGNhbGN1bGF0ZVJvdXRlID0gZnVuY3Rpb24gKG9yaWdpbiA6IEwuTGF0TG5nLCBlbGVtZW50IDogRWxlbWVudClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdEFwcC5kaXJlY3Rpb25zTW9kdWxlLmNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7IFxuXHRcdFx0XHRcdEFwcC5ERUFNb2R1bGUuYmVnaW4oZWxlbWVudC5pZCwgZmFsc2UpO1x0XHRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBpZiBubyBlbGVtZW50LCB3ZSBnZXQgaXQgZnJvbSBhamF4IFxuXHRcdFx0XHRpZiAoIWVsZW1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFqYXhNb2R1bGVfLmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQsIChlbGVtZW50SnNvbikgPT4gXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhbZWxlbWVudEpzb25dLCB0cnVlKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRCeUlkKGVsZW1lbnRKc29uLmlkKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcbiAgICAgICAgICAgIFxuXHRcdFx0XHRcdFx0b3JpZ2luID0gdGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpO1xuXHRcdFx0XHRcdFx0Ly8gd2UgZ2VvbG9jYWxpemVkIG9yaWdpbiBpbiBsb2FkSGlzdG9yeSBmdW5jdGlvblxuXHRcdFx0XHRcdFx0Ly8gbWF5YmUgdGhlIGdlb2NvZGluZyBpcyBub3QgYWxyZWFkeSBkb25lIHNvIHdlIHdhaXQgYSBsaXR0bGUgYml0IGZvciBpdFxuXHRcdFx0XHRcdFx0aWYgKCFvcmlnaW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdG9yaWdpbiA9IHRoaXMuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIW9yaWdpbilcblx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW4gPSB0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsY3VsYXRlUm91dGUob3JpZ2luLCBlbGVtZW50KTtcdFx0XG5cdFx0XHRcdFx0XHRcdH0sIDUwMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0KGVycm9yKSA9PiB7IC8qVE9ETyovIGFsZXJ0KFwiTm8gZWxlbWVudCB3aXRoIHRoaXMgaWRcIik7IH1cblx0XHRcdFx0XHQpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBSZWFkeS5kbygoKSA9PiBcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2FsY3VsYXRlUm91dGUob3JpZ2luLCBlbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBSZWFkeS5vZmYoKCkgPT4geyBjYWxjdWxhdGVSb3V0ZShvcmlnaW4sIGVsZW1lbnQpOyB9KTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR0aGlzLnNldE1vZGUoQXBwTW9kZXMuTWFwLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH1cdFx0XHRcdFx0XG5cblx0XHRcdFx0YnJlYWs7XHRcdFx0XG5cdFx0fVxuXG5cdFx0aWYgKCEkYmFja0Zyb21IaXN0b3J5ICYmXG5cdFx0XHQgKCBvbGRTdGF0ZU5hbWUgIT09ICRuZXdTdGF0ZSBcblx0XHRcdFx0fHwgJG5ld1N0YXRlID09IEFwcFN0YXRlcy5TaG93RWxlbWVudFxuXHRcdFx0XHR8fCAkbmV3U3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmVcblx0XHRcdFx0fHwgJG5ld1N0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucykgKVxuXHRcdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZShvcHRpb25zKTtcblxuXHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcblx0fTtcblxuXHRoYW5kbGVHZW9jb2RlUmVzdWx0KHJlc3VsdHMpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiaGFuZGxlR2VvY29kZVJlc3VsdFwiLCByZXN1bHRzKTtcblx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XHRcdFxuXG5cdFx0Ly8gaWYganVzdCBhZGRyZXNzIHdhcyBnaXZlblxuXHRcdGlmICh0aGlzLm1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoQXBwU3RhdGVzLk5vcm1hbCk7XHRcblx0XHRcdHRoaXMubWFwQ29tcG9uZW50LmZpdEJvdW5kcyh0aGlzLmdlb2NvZGVyLmdldEJvdW5kcygpKTtcdFx0XHRcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuYm91bmRzTW9kdWxlLmNyZWF0ZUJvdW5kc0Zyb21Mb2NhdGlvbih0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpO1xuXHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmNsZWFyQ3VycmVudHNFbGVtZW50KCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSx0cnVlKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNYXJrZXJDbGljayhtYXJrZXIgOiBCaW9wZW5NYXJrZXIpXG5cdHtcblx0XHRpZiAoIHRoaXMubW9kZSAhPSBBcHBNb2Rlcy5NYXApIHJldHVybjtcblxuXHRcdHRoaXMuc2V0VGltZW91dENsaWNraW5nKCk7XG5cblx0XHRpZiAobWFya2VyLmlzSGFsZkhpZGRlbigpKSB0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5Ob3JtYWwpO1x0XG5cblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZDogbWFya2VyLmdldElkKCkgfSk7XHRcdFxuXG5cdFx0aWYgKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlKVxuXHRcdHtcblx0XHRcdC8vQXBwLlNSQ01vZHVsZSgpLnNlbGVjdEVsZW1lbnRCeUlkKHRoaXMuaWRfKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNYXBJZGxlKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKFwiQXBwIGhhbmRsZSBtYXAgaWRsZSwgbWFwTG9hZGVkIDogXCIgLCB0aGlzLm1hcENvbXBvbmVudC5pc01hcExvYWRlZCk7XG5cblx0XHQvLyBzaG93aW5nIEluZm9CYXJDb21wb25lbnQgbWFrZSB0aGUgbWFwIHJlc2l6ZWQgYW5kIHNvIGlkbGUgaXMgdHJpZ2dlcmVkLCBcblx0XHQvLyBidXQgd2UncmUgbm90IGludGVyZXNzZWQgaW4gdGhpcyBpZGxpbmdcblx0XHQvL2lmICh0aGlzLmlzU2hvd2luZ0luZm9CYXJDb21wb25lbnQpIHJldHVybjtcblx0XHRcblx0XHRpZiAodGhpcy5tb2RlICE9IEFwcE1vZGVzLk1hcCkgICAgIHJldHVybjtcblx0XHQvL2lmICh0aGlzLnN0YXRlICAhPSBBcHBTdGF0ZXMuTm9ybWFsKSAgICAgcmV0dXJuO1xuXG5cdFx0Ly8gd2UgbmVlZCBtYXAgdG8gYmUgbG9hZGVkIHRvIGdldCB0aGUgcmFkaXVzIG9mIHRoZSB2aWV3cG9ydFxuXHRcdC8vIGFuZCBnZXQgdGhlIGVsZW1lbnRzIGluc2lkZVxuXHRcdGlmICghdGhpcy5tYXBDb21wb25lbnQuaXNNYXBMb2FkZWQpXG5cdFx0e1xuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBMb2FkZWQuZG8oKCkgPT4ge3RoaXMuaGFuZGxlTWFwSWRsZSgpOyB9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMubWFwQ29tcG9uZW50Lm9uTWFwTG9hZGVkLm9mZigoKSA9PiB7dGhpcy5oYW5kbGVNYXBJZGxlKCk7IH0pO1xuXHRcdH1cblxuXHRcdGxldCB1cGRhdGVJbkFsbEVsZW1lbnRMaXN0ID0gdHJ1ZTtcblx0XHRsZXQgZm9yY2VSZXBhaW50ID0gZmFsc2U7XG5cblx0XHRsZXQgem9vbSA9IHRoaXMubWFwQ29tcG9uZW50Xy5nZXRab29tKCk7XG5cdFx0bGV0IG9sZF96b29tID0gdGhpcy5tYXBDb21wb25lbnRfLmdldE9sZFpvb20oKTtcblxuXHRcdGlmICh6b29tICE9IG9sZF96b29tICYmIG9sZF96b29tICE9IC0xKSAgXG5cdFx0e1xuXHRcdFx0aWYgKHpvb20gPiBvbGRfem9vbSkgdXBkYXRlSW5BbGxFbGVtZW50TGlzdCA9IGZhbHNlO1x0ICAgXHRcdFxuXHRcdFx0Zm9yY2VSZXBhaW50ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodXBkYXRlSW5BbGxFbGVtZW50TGlzdCwgZm9yY2VSZXBhaW50KTtcblx0XHQvL3RoaXMuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c0ljb25zKGZhbHNlKTtcblxuXHRcdHRoaXMuY2hlY2tGb3JOZXdFbGVtZW50c1RvUmV0cmlldmUoKTtcblxuXHRcdHRoaXMuaGlzdG9yeU1vZHVsZS51cGRhdGVDdXJyU3RhdGUoKTtcblx0fTtcblxuXHRjaGVja0Zvck5ld0VsZW1lbnRzVG9SZXRyaWV2ZSgpXG5cdHtcblx0XHRsZXQgZnJlZUJvdW5kcyA9IHRoaXMuYm91bmRzTW9kdWxlLmNhbGN1bGF0ZUZyZWVCb3VuZHMoKTtcblx0XHRpZiAoZnJlZUJvdW5kcyAmJiBmcmVlQm91bmRzLmxlbmd0aCA+IDApIHRoaXMuYWpheE1vZHVsZS5nZXRFbGVtZW50c0luQm91bmRzKGZyZWVCb3VuZHMpOyBcblx0fVxuXG5cdGhhbmRsZU1hcENsaWNrKClcblx0e1xuXHRcdGlmICh0aGlzLmlzQ2xpY2tpbmcpIHJldHVybjtcblxuXHRcdC8vY29uc29sZS5sb2coXCJoYW5kbGUgTWFwIENsaWNrXCIsIEFwcFN0YXRlc1t0aGlzLnN0YXRlXSk7XG5cdFx0XG5cdFx0aWYgKHRoaXMuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50IHx8IHRoaXMuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUpXG5cdFx0XHR0aGlzLmluZm9CYXJDb21wb25lbnQuaGlkZSgpOyBcdFx0XG5cdFx0ZWxzZSBpZiAodGhpcy5zdGF0ZSA9PSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMpXG5cdFx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZCA6IEFwcC5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSB9KTtcdFx0XHRcdFxuXHR9O1xuICAgIFxuXG5cdGhhbmRsZVNlYXJjaEFjdGlvbihhZGRyZXNzIDogc3RyaW5nKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coXCJoYW5kbGUgc2VhcmNoIGFjdGlvblwiLCBhZGRyZXNzKTtcblx0XHRcblx0XHRcdHRoaXMuZ2VvY29kZXJNb2R1bGVfLmdlb2NvZGVBZGRyZXNzKFxuXHRcdFx0YWRkcmVzcywgXG5cdFx0XHQocmVzdWx0cyA6IEdlb2NvZGVSZXN1bHRbXSkgPT4gXG5cdFx0XHR7IFxuXHRcdFx0XHRzd2l0Y2ggKEFwcC5zdGF0ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLk5vcm1hbDpcdFxuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50Olx0XG5cdFx0XHRcdFx0XHR0aGlzLmhhbmRsZUdlb2NvZGVSZXN1bHQocmVzdWx0cyk7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZURvY3VtZW50VGl0bGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmU6XG5cdFx0XHRcdFx0XHR0aGlzLmluZm9CYXJDb21wb25lbnQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5oYW5kbGVHZW9jb2RlUmVzdWx0KHJlc3VsdHMpO1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVEb2N1bWVudFRpdGxlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcdFxuXHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMse2lkOiB0aGlzLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpIH0pO1xuXHRcdFx0XHRcdFx0YnJlYWs7XHRcdFxuXHRcdFx0XHR9XHRcdFx0XHRcdFxuXHRcdFx0fVx0XG5cdFx0KTtcdFxuXHR9O1xuXHRcblxuXHRoYW5kbGVOZXdFbGVtZW50c1JlY2VpdmVkRnJvbVNlcnZlcihlbGVtZW50c0pzb24pXG5cdHtcdFx0XG5cdFx0aWYgKCFlbGVtZW50c0pzb24gfHwgZWxlbWVudHNKc29uLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdC8vY29uc29sZS5sb2coXCJoYW5kbGVOZXdNYXJrZXJzRnJvbVNlcnZlclwiLCBlbGVtZW50c0pzb24ubGVuZ3RoKTtcblx0XHRsZXQgbmV3RWxlbWVudHMgOiBFbGVtZW50W10gPSB0aGlzLmVsZW1lbnRNb2R1bGUuYWRkSnNvbkVsZW1lbnRzKGVsZW1lbnRzSnNvbiwgdHJ1ZSk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIm5ldyBFbGVtZW50cyBsZW5ndGhcIiwgbmV3RWxlbWVudHMubGVuZ3RoKTtcblx0XHRcblx0XHQvLyBvbiBhZGQgbWFya2VyQ2x1c3Rlckdyb3VwIGFmdGVyIGZpcnN0IGVsZW1lbnRzIHJlY2VpdmVkXG5cdFx0aWYgKG5ld0VsZW1lbnRzLmxlbmd0aCA+IDApIFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c1RvRGlzcGxheSh0cnVlLHRydWUpO1x0XG5cdFx0fVxuXHR9OyBcblxuXHRoYW5kbGVFbGVtZW50c0NoYW5nZWQocmVzdWx0IDogRWxlbWVudHNDaGFuZ2VkKVxuXHR7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJoYW5kbGVFbGVtZW50c0NoYW5nZWQgdG9EaXNwbGF5IDogXCIscmVzdWx0LmVsZW1lbnRzVG9EaXNwbGF5Lmxlbmd0aCk7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJoYW5kbGVFbGVtZW50c0NoYW5nZWQgbmV3IDogXCIscmVzdWx0Lm5ld0VsZW1lbnRzLmxlbmd0aCk7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJoYW5kbGVFbGVtZW50c0NoYW5nZWQgcmVtb3ZlIDogXCIscmVzdWx0LmVsZW1lbnRzVG9SZW1vdmUubGVuZ3RoKTtcblx0XHRsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVfID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0e1xuXHRcdFx0dGhpcy5lbGVtZW50TGlzdENvbXBvbmVudC51cGRhdGUocmVzdWx0KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodGhpcy5zdGF0ZSAhPSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSlcblx0XHR7XG5cdFx0XHRsZXQgbmV3TWFya2VycyA9IHJlc3VsdC5uZXdFbGVtZW50cy5tYXAoIChlKSA9PiBlLm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXHRcdFx0bGV0IG1hcmtlcnNUb1JlbW92ZSA9IHJlc3VsdC5lbGVtZW50c1RvUmVtb3ZlLmZpbHRlcigoZSkgPT4gIWUuaXNTaG93bkFsb25lKS5tYXAoIChlKSA9PiBlLm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXG5cdFx0XHR0aGlzLm1hcENvbXBvbmVudC5hZGRNYXJrZXJzKG5ld01hcmtlcnMpO1xuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQucmVtb3ZlTWFya2VycyhtYXJrZXJzVG9SZW1vdmUpO1xuXHRcdH1cdFx0XHRcblxuXHRcdGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHQvL2NvbnNvbGUubG9nKFwiRWxlbWVudHNDaGFuZ2VkIGluIFwiICsgKGVuZC1zdGFydCkgKyBcIiBtc1wiKTtcdFxuXHR9OyBcblxuXHRoYW5kbGVJbmZvQmFySGlkZSgpXG5cdHtcblx0XHRpZiAodGhpcy5zdGF0ZSAhPSBBcHBTdGF0ZXMuU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlICYmIHRoaXMubW9kZV8gIT0gQXBwTW9kZXMuTGlzdCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuTm9ybWFsKTtcblx0XHR9XG5cdH07XG5cblx0aGFuZGxlSW5mb0JhclNob3coZWxlbWVudElkKVxuXHR7XG5cdFx0Ly9sZXQgc3RhdGVzVG9Bdm9pZCA9IFtBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMsQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUsQXBwU3RhdGVzLlN0YXJSZXByZXNlbnRhdGlvbkNob2ljZV07XG5cdFx0Ly9pZiAoJC5pbkFycmF5KHRoaXMuc3RhdGUsIHN0YXRlc1RvQXZvaWQpID09IC0xICkgdGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuU2hvd0VsZW1lbnQsIHtpZDogZWxlbWVudElkfSk7XHRcdFxuXHR9O1xuXG5cdHVwZGF0ZU1heEVsZW1lbnRzKCkgXG5cdHsgXG5cdFx0dGhpcy5tYXhFbGVtZW50c1RvU2hvd09uTWFwXyA9IE1hdGgubWluKE1hdGguZmxvb3IoJCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLndpZHRoKCkgKiAkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuaGVpZ2h0KCkgLyAxMDAwKSwgMTAwMCk7XG5cdFx0Ly93aW5kb3cuY29uc29sZS5sb2coXCJzZXR0aW5nIG1heCBlbGVtZW50cyBcIiArIHRoaXMubWF4RWxlbWVudHNUb1Nob3dPbk1hcF8pO1xuXHR9O1xuXG5cdHNldFRpbWVvdXRDbGlja2luZygpIFxuXHR7IFxuXHRcdHRoaXMuaXNDbGlja2luZ18gPSB0cnVlO1xuXHRcdGxldCB0aGF0ID0gdGhpcztcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aGF0LmlzQ2xpY2tpbmdfID0gZmFsc2U7IH0sIDEwMCk7IFxuXHR9O1xuXG5cdHNldFRpbWVvdXRJbmZvQmFyQ29tcG9uZW50KCkgXG5cdHsgXG5cdFx0dGhpcy5pc1Nob3dpbmdJbmZvQmFyQ29tcG9uZW50XyA9IHRydWU7XG5cdFx0bGV0IHRoYXQgPSB0aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRoYXQuaXNTaG93aW5nSW5mb0JhckNvbXBvbmVudF8gPSBmYWxzZTsgfSwgMTMwMCk7IFxuXHR9XG5cblx0dXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zIDogYW55ID0ge30pXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlRG9jdW1lbnRUaXRsZVwiLCB0aGlzLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpKTtcblxuXHRcdGxldCB0aXRsZSA6IHN0cmluZztcblx0XHRsZXQgZWxlbWVudE5hbWUgOiBzdHJpbmc7XG5cblx0XHRpZiAoIChvcHRpb25zICYmIG9wdGlvbnMuaWQpIHx8IHRoaXMuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkpIFxuXHRcdHtcblx0XHRcdFxuXHRcdFx0bGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRCeUlkKHRoaXMuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkpO1xuXHRcdFx0ZWxlbWVudE5hbWUgPSBjYXBpdGFsaXplKGVsZW1lbnQgPyBlbGVtZW50Lm5hbWUgOiAnJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubW9kZV8gPT0gQXBwTW9kZXMuTGlzdClcblx0XHR7XHRcdFxuXHRcdFx0dGl0bGUgPSAnTGlzdGUgZGVzIGFjdGV1cnMgJyArIHRoaXMuZ2V0TG9jYXRpb25BZGRyZXNzRm9yVGl0bGUoKTtcdFx0XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzd2l0Y2ggKHRoaXMuc3RhdGVfKVxuXHRcdFx0e1xuXHRcdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudDpcdFx0XHRcdFxuXHRcdFx0XHRcdHRpdGxlID0gJ0FjdGV1ciAtICcgKyBlbGVtZW50TmFtZTtcblx0XHRcdFx0XHRicmVhaztcdFxuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmU6XG5cdFx0XHRcdFx0dGl0bGUgPSAnQWN0ZXVyIC0gJyArIGVsZW1lbnROYW1lO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zOlxuXHRcdFx0XHRcdHRpdGxlID0gJ0l0aW7DqXJhaXJlIC0gJyArIGVsZW1lbnROYW1lO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLk5vcm1hbDpcdFx0XHRcblx0XHRcdFx0XHR0aXRsZSA9ICdDYXJ0ZSBkZXMgYWN0ZXVycyAnICsgdGhpcy5nZXRMb2NhdGlvbkFkZHJlc3NGb3JUaXRsZSgpO1x0XHRcdFxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHRcblx0fTtcblxuXHRwcml2YXRlIGdldExvY2F0aW9uQWRkcmVzc0ZvclRpdGxlKClcblx0e1xuXHRcdGlmICh0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uQWRkcmVzcygpKVxuXHRcdHtcblx0XHRcdHJldHVybiBcIi0gXCIgKyB0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uQWRkcmVzcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gXCItIEZyYW5jZVwiO1xuXHR9XG5cblxuXHQvLyBHZXR0ZXJzIHNob3J0Y3V0c1xuXHRtYXAoKSA6IEwuTWFwIHsgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50Xz8gdGhpcy5tYXBDb21wb25lbnRfLmdldE1hcCgpIDogbnVsbDsgfTtcblx0ZWxlbWVudHMoKSB7IHJldHVybiB0aGlzLmVsZW1lbnRzTW9kdWxlXy5jdXJyVmlzaWJsZUVsZW1lbnRzKCk7ICB9O1xuXHRlbGVtZW50QnlJZChpZCkgeyByZXR1cm4gdGhpcy5lbGVtZW50c01vZHVsZV8uZ2V0RWxlbWVudEJ5SWQoaWQpOyAgfTtcblxuXHRnZXQgY29uc3RlbGxhdGlvbigpIHsgcmV0dXJuIG51bGw7IH1cblxuXHRnZXQgY3Vyck1haW5JZCgpIHsgcmV0dXJuIHRoaXMuZGlyZWN0b3J5TWVudUNvbXBvbmVudC5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkOyB9XG5cblx0Z2V0IGlzQ2xpY2tpbmcoKSB7IHJldHVybiB0aGlzLmlzQ2xpY2tpbmdfOyB9O1xuXHRnZXQgaXNTaG93aW5nSW5mb0JhckNvbXBvbmVudCgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzU2hvd2luZ0luZm9CYXJDb21wb25lbnRfOyB9O1xuXHRnZXQgbWF4RWxlbWVudHMoKSB7IHJldHVybiB0aGlzLm1heEVsZW1lbnRzVG9TaG93T25NYXBfOyB9O1xuXG5cdC8vIE1vZHVsZXMgYW5kIGNvbXBvbmVudHNcblx0Z2V0IG1hcENvbXBvbmVudCgpIHsgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50XzsgfTtcblx0Z2V0IGluZm9CYXJDb21wb25lbnQoKSB7IHJldHVybiB0aGlzLmluZm9CYXJDb21wb25lbnRfOyB9O1xuXHRnZXQgZ2VvY29kZXIoKSB7IHJldHVybiB0aGlzLmdlb2NvZGVyTW9kdWxlXzsgfTtcblx0Z2V0IGFqYXhNb2R1bGUoKSB7IHJldHVybiB0aGlzLmFqYXhNb2R1bGVfOyB9O1xuXHRnZXQgZWxlbWVudE1vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudHNNb2R1bGVfOyB9O1xuXHRnZXQgZGlyZWN0aW9uc01vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZGlyZWN0aW9uc01vZHVsZV87IH07XG5cdC8vZ2V0IG1hcmtlck1vZHVsZSgpIHsgcmV0dXJuIHRoaXMubWFya2VyTW9kdWxlXzsgfTtcblx0Z2V0IGZpbHRlck1vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZmlsdGVyTW9kdWxlXzsgfTtcblx0Ly9nZXQgU1JDTW9kdWxlKCkgeyByZXR1cm4gdGhpcy5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2VNb2R1bGVfOyB9O1xuXHRnZXQgREVBTW9kdWxlKCkgeyByZXR1cm4gdGhpcy5kaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXzsgfTtcblx0Ly9nZXQgbGlzdEVsZW1lbnRNb2R1bGUoKSB7IHJldHVybiB0aGlzLmxpc3RFbGVtZW50TW9kdWxlXzsgfTtcblx0Z2V0IHN0YXRlKCkgeyByZXR1cm4gdGhpcy5zdGF0ZV87IH07XG5cdGdldCBtb2RlKCkgeyByZXR1cm4gdGhpcy5tb2RlXzsgfTtcblxufSIsImltcG9ydCB7IEFwcE1vZHVsZSwgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9uLmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgbGV0ICQgOiBhbnk7XG5cbmV4cG9ydCBlbnVtIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlXG57XG5cdE9wdGlvbixcblx0Q2F0ZWdvcnlcbn1cblxuLyoqXG4qIENsYXNzIHJlcHJlc2VudGF0aW5nIGEgTm9kZSBpbiB0aGUgRGlyZWN0b3J5IE1lbnUgVHJlZVxuKlxuKiBBIENhdGVnb3J5T3B0aW9uVHJlZU5vZGUgY2FuIGJlIGEgQ2F0ZWdvcnkgb3IgYW4gT3B0aW9uXG4qL1xuZXhwb3J0IGNsYXNzIENhdGVnb3J5T3B0aW9uVHJlZU5vZGUgXG57XG5cdGlkIDogbnVtYmVyO1xuXG5cdGNoaWxkcmVuIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVtdID0gW107XG5cblx0b3duZXJJZCA6IG51bWJlciA9IG51bGw7XG5cdC8vIGwnaWQgZGUgbGEgbWFpbk9wdGlvbiwgb3UgXCJhbGxcIiBwb3VyIHVuZSBtYWluT3B0aW9uXG5cdG1haW5Pd25lcklkIDogYW55ID0gbnVsbDtcblxuXHRpc0NoZWNrZWQgOiBib29sZWFuID0gdHJ1ZTtcblx0aXNEaXNhYmxlZCA6IGJvb2xlYW4gPSBmYWxzZTtcdFxuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgVFlQRSA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLCBwcml2YXRlIERPTV9JRCA6IHN0cmluZyxwcml2YXRlIERPTV9DSEVDS0JPWF9JRCA6IHN0cmluZyxwcml2YXRlIERPTV9DSElMRFJFTl9DTEFTUyA6IHN0cmluZykge307XG5cblx0Z2V0RG9tKCkgeyByZXR1cm4gJCh0aGlzLkRPTV9JRCArIHRoaXMuaWQpOyB9XG5cblx0Z2V0RG9tQ2hlY2tib3goKSB7IHJldHVybiAkKHRoaXMuRE9NX0NIRUNLQk9YX0lEICsgdGhpcy5pZCk7IH1cblxuXHRnZXREb21DaGlsZHJlbigpIHsgcmV0dXJuIHRoaXMuZ2V0RG9tKCkubmV4dCh0aGlzLkRPTV9DSElMRFJFTl9DTEFTUyk7fVxuXG5cdGdldE93bmVyKCkgOiBDYXRlZ29yeU9wdGlvblRyZWVOb2RlIFxuXHR7IFxuXHRcdGlmICh0aGlzLlRZUEUgPT0gQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUuT3B0aW9uKVxuXHRcdFx0cmV0dXJuIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRDYXRlZ29yeUJ5SWQodGhpcy5vd25lcklkKTsgXG5cblx0XHRpZiAodGhpcy5UWVBFID09IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLkNhdGVnb3J5KVxuXHRcdFx0cmV0dXJuIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRPcHRpb25CeUlkKHRoaXMub3duZXJJZCk7IFxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZGlzYWJsZWRDaGlsZHJlbigpIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVtdIHsgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKCBjaGlsZCA9PiBjaGlsZC5pc0Rpc2FibGVkKTsgfVxuXG5cdHByb3RlY3RlZCBjaGVja2VkQ2hpbGRyZW4oKSA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVbXSB7IHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlciggY2hpbGQgPT4gY2hpbGQuaXNDaGVja2VkKTsgfVxuXG5cdGlzT3B0aW9uKCkgeyByZXR1cm4gdGhpcy5UWVBFID09IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLk9wdGlvbiB9XG5cblx0aXNNYWluT3B0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRzZXRDaGVja2VkKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5pc0NoZWNrZWQgPSBib29sO1xuXHRcdHRoaXMuZ2V0RG9tQ2hlY2tib3goKS5wcm9wKFwiY2hlY2tlZFwiLCBib29sKTtcblx0fVxuXG5cdHNldERpc2FibGVkKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5pc0Rpc2FibGVkID0gYm9vbDtcblx0XHRpZiAoYm9vbClcblx0XHR7XG5cdFx0XHRpZiAoIXRoaXMuZ2V0RG9tKCkuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHRoaXMuZ2V0RG9tKCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHR0aGlzLnNldENoZWNrZWQoZmFsc2UpO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5nZXREb20oKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHR9XG5cdH1cblxuXHR0b2dnbGUodmFsdWUgOiBib29sZWFuID0gbnVsbCwgaHVtYW5BY3Rpb24gOiBib29sZWFuID0gdHJ1ZSlcblx0e1x0XHRcblx0XHRcdGxldCBjaGVjaztcblx0XHRcdGlmICh2YWx1ZSAhPSBudWxsKSBjaGVjayA9IHZhbHVlO1xuXHRcdFx0ZWxzZSBjaGVjayA9ICF0aGlzLmlzQ2hlY2tlZDtcblxuXHRcdFx0dGhpcy5zZXRDaGVja2VkKGNoZWNrKTtcblx0XHRcdHRoaXMuc2V0RGlzYWJsZWQoIWNoZWNrKTtcblxuXHRcdFx0Ly8gaW4gQWxsIG1vZGUsIHdlIGNsaWNrcyBkaXJlY3RseSBvbiB0aGUgbWFpbk9wdGlvbiwgYnV0IGRvbid0IHdhbnQgdG8gYWxsIGNoZWNrYm94IGluIE1haW5PcHRpb25GaWx0ZXIgdG8gZGlzYWJsZVxuXHRcdFx0aWYgKCF0aGlzLmlzTWFpbk9wdGlvbigpKSBcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikgY2hpbGQudG9nZ2xlKGNoZWNrLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLm1haW5Pd25lcklkID09ICdvcGVuaG91cnMnKSBBcHAuY2F0ZWdvcnlNb2R1bGUudXBkYXRlT3BlbkhvdXJzRmlsdGVyKCk7XG5cblx0XHRcdGlmKGh1bWFuQWN0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5nZXRPd25lcigpKSB0aGlzLmdldE93bmVyKCkudXBkYXRlU3RhdGUoKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vaWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCkgQXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNJY29ucyh0cnVlKTtcblx0XHRcdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkoY2hlY2ssIGZhbHNlLCB0cnVlKTtcblx0XHRcdFx0QXBwLmhpc3RvcnlNb2R1bGUudXBkYXRlQ3VyclN0YXRlKCk7XG5cdFx0XHR9XG5cdH1cblxuXHR1cGRhdGVTdGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5pc01haW5PcHRpb24oKSkgcmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDApIFxuXHRcdFx0dGhpcy5zZXREaXNhYmxlZCghdGhpcy5pc0NoZWNrZWQpO1xuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgZGlzYWJsZWRDaGlsZHJlbkNvdW50ID0gdGhpcy5jaGlsZHJlbi5maWx0ZXIoIChjaGlsZCA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUpID0+IGNoaWxkLmlzRGlzYWJsZWQpLmxlbmd0aDtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIk9wdGlvbiBcIiArIHRoaXMubmFtZSArIFwiIHVwZGF0ZSBzdGF0ZSwgbmJyZSBjaGlsZHJlbiBkaXNhYmxlZCA9IFwiLCBkaXNhYmxlZENoaWxkcmVuQ291bnQpO1xuXG5cdFx0XHRpZiAoZGlzYWJsZWRDaGlsZHJlbkNvdW50ID09IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxuXHRcdFx0XHR0aGlzLnNldERpc2FibGVkKHRydWUpO1x0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuc2V0RGlzYWJsZWQoZmFsc2UpO1xuXG5cdFx0XHRsZXQgY2hlY2tlZENoaWxkcmVuQ291bnQgPSB0aGlzLmNoaWxkcmVuLmZpbHRlciggKGNoaWxkIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSkgPT4gY2hpbGQuaXNDaGVja2VkKS5sZW5ndGg7XG5cblx0XHRcdGlmIChjaGVja2VkQ2hpbGRyZW5Db3VudCA9PSB0aGlzLmNoaWxkcmVuLmxlbmd0aClcblx0XHRcdFx0dGhpcy5zZXRDaGVja2VkKHRydWUpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLnNldENoZWNrZWQoZmFsc2UpXG5cdFx0fVx0XHRcblxuXHRcdGlmICh0aGlzLmdldE93bmVyKCkpICB0aGlzLmdldE93bmVyKCkudXBkYXRlU3RhdGUoKTtcdFxuXHR9XG5cblx0cmVjdXJzaXZlbHlVcGRhdGVTdGF0ZXMoKVxuXHR7XG5cdFx0Zm9yKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGNoaWxkLnJlY3Vyc2l2ZWx5VXBkYXRlU3RhdGVzKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVTdGF0ZSgpO1xuXHR9XG5cblx0aXNFeHBhbmRlZCgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldERvbSgpLmhhc0NsYXNzKCdleHBhbmRlZCcpOyB9XG5cblx0dG9nZ2xlQ2hpbGRyZW5EZXRhaWwoKVxuXHR7XG5cdFx0aWYgKHRoaXMuaXNFeHBhbmRlZCgpKVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tQ2hpbGRyZW4oKS5zdG9wKHRydWUsZmFsc2UpLnNsaWRlVXAoeyBkdXJhdGlvbjogMzUwLCBlYXNpbmc6IFwiZWFzZU91dFF1YXJ0XCIsIHF1ZXVlOiBmYWxzZSwgY29tcGxldGU6IGZ1bmN0aW9uKCkgeyQodGhpcykuY3NzKCdoZWlnaHQnLCAnJyk7fX0pO1xuXHRcdFx0dGhpcy5nZXREb20oKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tQ2hpbGRyZW4oKS5zdG9wKHRydWUsZmFsc2UpLnNsaWRlRG93bih7IGR1cmF0aW9uOiAzNTAsIGVhc2luZzogXCJlYXNlT3V0UXVhcnRcIiwgcXVldWU6IGZhbHNlLCBjb21wbGV0ZTogZnVuY3Rpb24oKSB7JCh0aGlzKS5jc3MoJ2hlaWdodCcsICcnKTt9fSk7XG5cdFx0XHR0aGlzLmdldERvbSgpLmFkZENsYXNzKCdleHBhbmRlZCcpO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IENhdGVnb3J5LCBPcHRpb24sIE9wdGlvblZhbHVlfSBmcm9tIFwiLi9jbGFzc2VzXCI7XG5cbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVZhbHVlXG57XG5cdGNhdGVnb3J5IDogQ2F0ZWdvcnk7XG5cdGNoaWxkcmVuIDogT3B0aW9uVmFsdWVbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGNhdGVnb3J5IDogQ2F0ZWdvcnkpXG5cdHtcblx0XHR0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHRcblx0fVxuXG5cdGFkZE9wdGlvblZhbHVlKG9wdGlvblZhbHVlIDogT3B0aW9uVmFsdWUpXG5cdHtcblx0XHR0aGlzLmNoaWxkcmVuLnB1c2gob3B0aW9uVmFsdWUpO1xuXHR9XG5cblx0Z2V0IGlzTGFzdENhdGVnb3J5RGVwdGgoKSA6IGJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLmNoaWxkcmVuLmV2ZXJ5KCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbi5zdWJjYXRlZ29yaWVzLmxlbmd0aCA9PSAwKTtcblx0fVxufSIsImltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi4vY2xhc3Nlcy9vcHRpb24uY2xhc3NcIjtcbmltcG9ydCB7IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUsIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlIH0gZnJvbSBcIi4vY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnkgZXh0ZW5kcyBDYXRlZ29yeU9wdGlvblRyZWVOb2RlXG57IFxuXHRuYW1lIDogc3RyaW5nO1xuXHRpbmRleDogbnVtYmVyO1xuXHRzaW5nbGVPcHRpb24gOiBib29sZWFuO1xuXHRlbmFibGVEZXNjcmlwdGlvbiA6IGJvb2xlYW47XG5cdGRpc3BsYXlDYXRlZ29yeU5hbWUgOiBib29sZWFuO1xuXHRkZXB0aCA6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcigkY2F0ZWdvcnlKc29uIDogYW55KVxuXHR7XG5cdFx0c3VwZXIoQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUuQ2F0ZWdvcnksICcjY2F0ZWdvcnktJywgJyNzdWJjYXRlZ29yaWUtY2hlY2tib3gtJywgJy5vcHRpb25zLXdyYXBwZXInKTtcblxuXHRcdHRoaXMuaWQgPSAkY2F0ZWdvcnlKc29uLmlkO1xuXHRcdHRoaXMubmFtZSA9ICRjYXRlZ29yeUpzb24ubmFtZTtcblx0XHR0aGlzLmluZGV4ID0gJGNhdGVnb3J5SnNvbi5pbmRleDtcblx0XHR0aGlzLnNpbmdsZU9wdGlvbiA9ICRjYXRlZ29yeUpzb24uc2luZ2xlX29wdGlvbjtcblx0XHR0aGlzLmVuYWJsZURlc2NyaXB0aW9uID0gJGNhdGVnb3J5SnNvbi5lbmFibGVfZGVzY3JpcHRpb247XG5cdFx0dGhpcy5kaXNwbGF5Q2F0ZWdvcnlOYW1lID0gJGNhdGVnb3J5SnNvbi5kaXNwbGF5X2NhdGVnb3J5X25hbWU7XG5cdFx0dGhpcy5kZXB0aCA9ICRjYXRlZ29yeUpzb24uZGVwdGg7XG5cdFx0dGhpcy5tYWluT3duZXJJZCA9ICRjYXRlZ29yeUpzb24ubWFpbk93bmVySWQ7XG5cdH1cblxuXHRhZGRPcHRpb24oJG9wdGlvbiA6IE9wdGlvbikgeyB0aGlzLmNoaWxkcmVuLnB1c2goJG9wdGlvbik7IH1cblxuXHRnZXQgb3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmNoaWxkcmVuOyB9XG5cblx0Z2V0IGRpc2FibGVkT3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmRpc2FibGVkQ2hpbGRyZW4oKTsgfVxuXG5cdGdldCBjaGVja2VkT3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmNoZWNrZWRDaGlsZHJlbigpOyB9XG59XG4iLCJleHBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuL2NhdGVnb3J5LmNsYXNzXCI7XG5leHBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC5jbGFzc1wiO1xuZXhwb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9uLmNsYXNzXCI7XG5leHBvcnQgeyBPcHRpb25WYWx1ZSB9IGZyb20gXCIuL29wdGlvbi12YWx1ZS5jbGFzc1wiO1xuZXhwb3J0IHsgQ2F0ZWdvcnlWYWx1ZSB9IGZyb20gXCIuL2NhdGVnb3J5LXZhbHVlLmNsYXNzXCI7IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBCaW9wZW5NYXJrZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tYXAvYmlvcGVuLW1hcmtlci5jb21wb25lbnRcIjtcbmltcG9ydCB7IE9wdGlvblZhbHVlLCBDYXRlZ29yeVZhbHVlLCBPcHRpb24sIENhdGVnb3J5IH0gZnJvbSBcIi4vY2xhc3Nlc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIHZhciAkO1xuZGVjbGFyZSBsZXQgVHdpZyA6IGFueTtcbmRlY2xhcmUgbGV0IGJpb3Blbl90d2lnSnNfZWxlbWVudEluZm8gOiBhbnk7XG5cblxuZXhwb3J0IGVudW0gRWxlbWVudFN0YXR1cyBcbntcblx0RGVsZXRlZCA9IC0yLFxuICBNb2RlcmF0aW9uTmVlZGVkID0gLTEsXG4gIFBlbmRpbmcgPSAwLFxuICBBZG1pblZhbGlkYXRlID0gMSxcbiAgQ29sbGFib3JhdGl2ZVZhbGlkYXRlID0gMVxufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBcbntcdFxuXHRyZWFkb25seSBpZCA6IHN0cmluZztcblx0cmVhZG9ubHkgc3RhdHVzIDogRWxlbWVudFN0YXR1cztcblx0cmVhZG9ubHkgbmFtZSA6IHN0cmluZztcblx0cmVhZG9ubHkgcG9zaXRpb24gOiBMLkxhdExuZztcblx0cmVhZG9ubHkgYWRkcmVzcyA6IHN0cmluZztcblx0cmVhZG9ubHkgZGVzY3JpcHRpb24gOiBzdHJpbmc7XG5cdHJlYWRvbmx5IHRlbCA6IHN0cmluZztcblx0cmVhZG9ubHkgd2ViU2l0ZSA6IHN0cmluZztcblx0cmVhZG9ubHkgbWFpbCA6IHN0cmluZztcblx0cmVhZG9ubHkgb3BlbkhvdXJzIDogYW55O1xuXHRyZWFkb25seSBvcGVuSG91cnNEYXlzIDogc3RyaW5nW10gPSBbXTtcblx0cmVhZG9ubHkgb3BlbkhvdXJzTW9yZUluZm9zIDogYW55O1xuXHRyZWFkb25seSBtYWluT3B0aW9uT3duZXJJZHMgOiBudW1iZXJbXSA9IFtdO1xuXG5cdG9wdGlvbnNWYWx1ZXMgOiBPcHRpb25WYWx1ZVtdID0gW107XG5cdG9wdGlvblZhbHVlc0J5Q2F0Z2VvcnkgOiBPcHRpb25WYWx1ZVtdW10gPSBbXTtcblxuXHRjb2xvck9wdGlvbklkIDogbnVtYmVyO1xuXHRwcml2YXRlIGljb25zVG9EaXNwbGF5IDogT3B0aW9uVmFsdWVbXSA9IFtdO1xuXHRwcml2YXRlIG9wdGlvblRyZWUgOiBPcHRpb25WYWx1ZTtcblxuXHRmb3JtYXRlZE9wZW5Ib3Vyc18gPSBudWxsO1xuXG5cdGRpc3RhbmNlIDogbnVtYmVyO1xuXG5cdGlzSW5pdGlhbGl6ZWRfIDpib29sZWFuID0gZmFsc2U7XG5cblx0Ly8gZm9yIGVsZW1lbnRzIG1vZHVsZSBhbGdvcml0aG1zXG5cdGlzRGlzcGxheWVkIDpib29sZWFuID0gZmFsc2U7XG5cblx0aXNWaXNpYmxlXyA6IGJvb2xlYW4gPSBmYWxzZTtcblx0aXNJbkVsZW1lbnRMaXN0IDogYm9vbGVhbj0gZmFsc2U7XG5cblx0Ly9UT0RPXG5cdGJpb3Blbk1hcmtlcl8gOiBCaW9wZW5NYXJrZXIgPSBudWxsO1xuXHRodG1sUmVwcmVzZW50YXRpb25fID0gJyc7XG5cblx0cHJvZHVjdHNUb0Rpc3BsYXlfIDogYW55ID0ge307XG5cblx0c3RhckNob2ljZUZvclJlcHJlc2VudGF0aW9uID0gJyc7XG5cdGlzU2hvd25BbG9uZSA6IGJvb2xlYW49IGZhbHNlO1xuXG5cdGlzRmF2b3JpdGUgOiBib29sZWFuPSBmYWxzZTtcblxuXHRuZWVkVG9CZVVwZGF0ZWRXaGVuU2hvd24gOiBib29sZWFuID0gdHJ1ZTtcblxuXHRjb25zdHJ1Y3RvcihlbGVtZW50SnNvbiA6IGFueSlcblx0e1xuXHRcdHRoaXMuaWQgPSBlbGVtZW50SnNvbi5pZDtcblx0XHR0aGlzLnN0YXR1cyA9IGVsZW1lbnRKc29uLnN0YXR1cztcblx0XHR0aGlzLm5hbWUgPSBlbGVtZW50SnNvbi5uYW1lO1xuXHRcdHRoaXMucG9zaXRpb24gPSBMLmxhdExuZyhlbGVtZW50SnNvbi5jb29yZGluYXRlcy5sYXQsIGVsZW1lbnRKc29uLmNvb3JkaW5hdGVzLmxuZyk7XG5cdFx0dGhpcy5hZGRyZXNzID0gZWxlbWVudEpzb24uYWRkcmVzcztcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZWxlbWVudEpzb24uZGVzY3JpcHRpb24gfHwgJyc7XG5cdFx0dGhpcy50ZWwgPSBlbGVtZW50SnNvbi50ZWwgPyBlbGVtZW50SnNvbi50ZWwucmVwbGFjZSgvKC57Mn0pKD8hJCkvZyxcIiQxIFwiKSA6ICcnO1x0XG5cdFx0dGhpcy53ZWJTaXRlID0gZWxlbWVudEpzb24ud2ViU2l0ZTtcblx0XHR0aGlzLm1haWwgPSBlbGVtZW50SnNvbi5tYWlsO1xuXHRcdHRoaXMub3BlbkhvdXJzID0gZWxlbWVudEpzb24ub3BlbkhvdXJzO1xuXHRcdHRoaXMub3BlbkhvdXJzTW9yZUluZm9zID0gIGVsZW1lbnRKc29uLm9wZW5Ib3Vyc01vcmVJbmZvcztcblxuXHRcdC8vIGluaXRpYWxpemUgZm9ybWF0ZWQgb3BlbiBob3Vyc1xuXHRcdHRoaXMuZ2V0Rm9ybWF0ZWRPcGVuSG91cnMoKTtcblxuXHRcdGxldCBuZXdPcHRpb24gOiBPcHRpb25WYWx1ZSwgb3duZXJJZCA6IG51bWJlcjtcblx0XHRmb3IgKGxldCBvcHRpb25WYWx1ZUpzb24gb2YgZWxlbWVudEpzb24ub3B0aW9uVmFsdWVzKVxuXHRcdHtcblx0XHRcdG5ld09wdGlvbiA9IG5ldyBPcHRpb25WYWx1ZShvcHRpb25WYWx1ZUpzb24pO1xuXG5cdFx0XHQvL293bmVySWQgPSBuZXdPcHRpb24ub3B0aW9uLm1haW5Pd25lcklkO1xuXHRcdFx0aWYgKG5ld09wdGlvbi5vcHRpb24uaXNNYWluT3B0aW9uKCkpIHRoaXMubWFpbk9wdGlvbk93bmVySWRzLnB1c2gobmV3T3B0aW9uLm9wdGlvbklkKTtcblx0XHRcdC8vaWYgKHRoaXMubWFpbk9wdGlvbk93bmVySWRzLmluZGV4T2Yob3duZXJJZCkgPT0gLTEpIFxuXG5cdFx0XHR0aGlzLm9wdGlvbnNWYWx1ZXMucHVzaChuZXdPcHRpb24pO1xuXG5cdFx0XHQvLyBwdXQgb3B0aW9ucyB2YWx1ZSBpbiBzcGVjaWZpYyBlYXN5IGFjY2Vzc2libGUgYXJyYXkgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxuXHRcdFx0aWYgKCF0aGlzLm9wdGlvblZhbHVlc0J5Q2F0Z2VvcnlbbmV3T3B0aW9uLm9wdGlvbi5vd25lcklkXSkgdGhpcy5vcHRpb25WYWx1ZXNCeUNhdGdlb3J5W25ld09wdGlvbi5vcHRpb24ub3duZXJJZF0gPSBbXTtcblx0XHRcdHRoaXMub3B0aW9uVmFsdWVzQnlDYXRnZW9yeVtuZXdPcHRpb24ub3B0aW9uLm93bmVySWRdLnB1c2gobmV3T3B0aW9uKTtcblx0XHR9XG5cblx0XHR0aGlzLmRpc3RhbmNlID0gZWxlbWVudEpzb24uZGlzdGFuY2UgPyBNYXRoLnJvdW5kKGVsZW1lbnRKc29uLmRpc3RhbmNlKSA6IG51bGw7XHRcblxuXHR9XHRcblxuXHRnZXRPcHRpb25WYWx1ZUJ5Q2F0ZWdvcnlJZCgkY2F0ZWdvcnlJZClcblx0e1xuXHRcdHJldHVybiB0aGlzLm9wdGlvblZhbHVlc0J5Q2F0Z2VvcnlbJGNhdGVnb3J5SWRdIHx8IFtdO1xuXHR9XHRcblxuXHRpbml0aWFsaXplKCkgXG5cdHtcdFx0XG5cdFx0dGhpcy5jcmVhdGVPcHRpb25zVHJlZSgpO1xuXHRcdHRoaXMudXBkYXRlSWNvbnNUb0Rpc3BsYXkoKTtcblxuXHRcdHRoaXMuYmlvcGVuTWFya2VyXyA9IG5ldyBCaW9wZW5NYXJrZXIodGhpcy5pZCwgdGhpcy5wb3NpdGlvbik7XG5cdFx0dGhpcy5pc0luaXRpYWxpemVkXyA9IHRydWU7XHRcblx0fVxuXG5cdHNob3coKSBcblx0e1x0XHRcblx0XHRpZiAoIXRoaXMuaXNJbml0aWFsaXplZF8pIHRoaXMuaW5pdGlhbGl6ZSgpO1x0XG5cdFx0Ly90aGlzLnVwZGF0ZSgpO1xuXHRcdC8vdGhpcy5iaW9wZW5NYXJrZXJfLnVwZGF0ZSgpO1xuXHRcdHRoaXMuYmlvcGVuTWFya2VyXy5zaG93KCk7XG5cdFx0dGhpcy5pc1Zpc2libGVfID0gdHJ1ZTtcdFx0XG5cdH07XG5cblx0aGlkZSgpIFxuXHR7XHRcdFxuXHRcdGlmICh0aGlzLmJpb3Blbk1hcmtlcl8gJiYgQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKSB0aGlzLmJpb3Blbk1hcmtlcl8uaGlkZSgpO1xuXHRcdHRoaXMuaXNWaXNpYmxlXyA9IGZhbHNlO1xuXHRcdC8vIHVuYm91bmQgZXZlbnRzIChjbGljayBldGMuLi4pP1xuXHRcdC8vaWYgKGNvbnN0ZWxsYXRpb25Nb2RlKSAkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCAjZWxlbWVudC1pbmZvLScrdGhpcy5pZCkuaGlkZSgpO1xuXHR9O1xuXG5cdHVwZGF0ZSgkZm9yY2UgOiBib29sZWFuID0gZmFsc2UpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwibWFya2VyIHVwZGF0ZSBuZWVkVG9CZVVwZGF0ZWRcIiwgdGhpcy5uZWVkVG9CZVVwZGF0ZWRXaGVuU2hvd24pO1xuXHRcdGlmICh0aGlzLm5lZWRUb0JlVXBkYXRlZFdoZW5TaG93biB8fCBBcHAubW9kZSA9PSBBcHBNb2Rlcy5MaXN0IHx8ICRmb3JjZSlcblx0XHR7XG5cdFx0XHR0aGlzLnVwZGF0ZUljb25zVG9EaXNwbGF5KCk7XG5cblx0XHRcdGxldCBvcHRpb25WYWx1ZXNUb1VwZGF0ZSA9IHRoaXMuZ2V0Q3Vyck9wdGlvbnNWYWx1ZXMoKS5maWx0ZXIoIChvcHRpb25WYWx1ZSkgPT4gb3B0aW9uVmFsdWUuaXNGaWxsZWRCeUZpbHRlcnMpO1xuXHRcdFx0b3B0aW9uVmFsdWVzVG9VcGRhdGUucHVzaCh0aGlzLmdldEN1cnJNYWluT3B0aW9uVmFsdWUoKSk7XG5cdFx0XHRmb3IobGV0IG9wdGlvblZhbHVlIG9mIG9wdGlvblZhbHVlc1RvVXBkYXRlKSB0aGlzLnVwZGF0ZU93bmVyQ29sb3Iob3B0aW9uVmFsdWUpO1xuXG5cdFx0XHR0aGlzLmNvbG9yT3B0aW9uSWQgPSB0aGlzLmljb25zVG9EaXNwbGF5Lmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRJY29uc1RvRGlzcGxheSgpWzBdID8gdGhpcy5nZXRJY29uc1RvRGlzcGxheSgpWzBdLmNvbG9yT3B0aW9uSWQgOiBudWxsO1x0XG5cblx0XHRcdGlmICh0aGlzLm1hcmtlcikgdGhpcy5tYXJrZXIudXBkYXRlKCk7XG5cdFx0XHR0aGlzLm5lZWRUb0JlVXBkYXRlZFdoZW5TaG93biA9IGZhbHNlO1xuXHRcdH1cdFx0XG5cdH1cblxuXHR1cGRhdGVPd25lckNvbG9yKCRvcHRpb25WYWx1ZSA6IE9wdGlvblZhbHVlKVxuXHR7XG5cdFx0aWYgKCEkb3B0aW9uVmFsdWUpIHJldHVybjtcblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlT3duZXJDb2xvclwiLCAkb3B0aW9uVmFsdWUub3B0aW9uLm5hbWUpO1xuXHRcdGlmICgkb3B0aW9uVmFsdWUub3B0aW9uLnVzZUNvbG9yRm9yTWFya2VyKVxuXHRcdHtcblx0XHRcdCRvcHRpb25WYWx1ZS5jb2xvck9wdGlvbklkID0gJG9wdGlvblZhbHVlLm9wdGlvbklkO1xuXHRcdH1cdFx0XG5cdFx0ZWxzZSBcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uIDogT3B0aW9uO1xuXHRcdFx0bGV0IGNhdGVnb3J5IDogQ2F0ZWdvcnk7XG5cdFx0XHRsZXQgY29sb3JJZCA6IG51bWJlciA9IG51bGw7XG5cblx0XHRcdGxldCBzaWJsaW5nc09wdGlvbnNGb3JDb2xvcmluZyA6IE9wdGlvblZhbHVlW10gPSB0aGlzLmdldEN1cnJPcHRpb25zVmFsdWVzKCkuZmlsdGVyKCBcblx0XHRcdFx0KG9wdGlvblZhbHVlKSA9PiBcblx0XHRcdFx0XHRvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycyBcblx0XHRcdFx0XHQmJiBvcHRpb25WYWx1ZS5vcHRpb24udXNlQ29sb3JGb3JNYXJrZXJcblx0XHRcdFx0XHQmJiBvcHRpb25WYWx1ZS5vcHRpb24ub3duZXJJZCAhPT0gJG9wdGlvblZhbHVlLm9wdGlvbi5vd25lcklkIFxuXHRcdFx0XHRcdCYmIG9wdGlvblZhbHVlLmNhdGVnb3J5T3duZXIub3duZXJJZCA9PSAkb3B0aW9uVmFsdWUuY2F0ZWdvcnlPd25lci5vd25lcklkXG5cdFx0XHQpO1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKFwic2libGluZ3NPcHRpb25zRm9yQ29sb3JpbmdcIiwgc2libGluZ3NPcHRpb25zRm9yQ29sb3JpbmcubWFwKCAob3ApID0+IG9wLm9wdGlvbi5uYW1lKSk7XG5cdFx0XHRpZiAoc2libGluZ3NPcHRpb25zRm9yQ29sb3JpbmcubGVuZ3RoID4gMClcblx0XHRcdHtcblx0XHRcdFx0b3B0aW9uID0gPE9wdGlvbj4gc2libGluZ3NPcHRpb25zRm9yQ29sb3Jpbmcuc2hpZnQoKS5vcHRpb247XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCItPiBzaWJsaW5nIGZvdW5kIDogXCIsIG9wdGlvbi5uYW1lKTtcblx0XHRcdFx0Y29sb3JJZCA9IG9wdGlvbi5pZDtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0b3B0aW9uID0gJG9wdGlvblZhbHVlLm9wdGlvbjtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIm5vIHNpYmxpbmdzLCBsb29raW5nIGZvciBwYXJlbnRcIik7XG5cdFx0XHRcdHdoaWxlKGNvbG9ySWQgPT0gbnVsbCAmJiBvcHRpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYXRlZ29yeSA9IDxDYXRlZ29yeT4gb3B0aW9uLmdldE93bmVyKCk7XG5cdFx0XHRcdFx0aWYgKGNhdGVnb3J5KVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG9wdGlvbiA9IDxPcHRpb24+IGNhdGVnb3J5LmdldE93bmVyKCk7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIi0+cGFyZW50IG9wdGlvblwiICsgb3B0aW9uLm5hbWUgKyBcIiB1c2Vjb2xvckZvck1hcmtlclwiLCBvcHRpb24udXNlQ29sb3JGb3JNYXJrZXIpO1xuXHRcdFx0XHRcdFx0Y29sb3JJZCA9IG9wdGlvbi51c2VDb2xvckZvck1hcmtlciA/IG9wdGlvbi5pZCA6IG51bGw7XG5cdFx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQkb3B0aW9uVmFsdWUuY29sb3JPcHRpb25JZCA9IGNvbG9ySWQ7XG5cdFx0fVxuXHR9XG5cblx0Z2V0Q3Vyck9wdGlvbnNWYWx1ZXMoKSA6IE9wdGlvblZhbHVlW11cblx0e1xuXHRcdHJldHVybiB0aGlzLm9wdGlvbnNWYWx1ZXMuZmlsdGVyKCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbi5tYWluT3duZXJJZCA9PSBBcHAuY3Vyck1haW5JZCk7XG5cdH1cblxuXHRnZXRDdXJyTWFpbk9wdGlvblZhbHVlKCkgOiBPcHRpb25WYWx1ZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9uc1ZhbHVlcy5maWx0ZXIoIChvcHRpb25WYWx1ZSkgPT4gb3B0aW9uVmFsdWUub3B0aW9uLmlkID09IEFwcC5jdXJyTWFpbklkKS5zaGlmdCgpO1xuXHR9XG5cblx0Z2V0Q2F0ZWdvcmllc0lkcygpIDogbnVtYmVyW11cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldEN1cnJPcHRpb25zVmFsdWVzKCkubWFwKCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLmNhdGVnb3J5T3duZXIuaWQpLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleCk7XG5cdH1cblxuXHRnZXRPcHRpb25zSWRzSW5DYXRlZ29yaWVJZChjYXRlZ29yeUlkKSA6IG51bWJlcltdXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXRDdXJyT3B0aW9uc1ZhbHVlcygpLmZpbHRlciggKG9wdGlvblZhbHVlKSA9PiBvcHRpb25WYWx1ZS5vcHRpb24ub3duZXJJZCA9PSBjYXRlZ29yeUlkKS5tYXAoIChvcHRpb25WYWx1ZSkgPT4gb3B0aW9uVmFsdWUub3B0aW9uSWQpO1xuXHR9XG5cblx0Y3JlYXRlT3B0aW9uc1RyZWUoKVxuXHR7XG5cdFx0dGhpcy5vcHRpb25UcmVlID0gbmV3IE9wdGlvblZhbHVlKHt9KTtcblx0XHRsZXQgbWFpbkNhdGVnb3J5ID0gQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeTtcblxuXHRcdHRoaXMucmVjdXNpdmVseUNyZWF0ZU9wdGlvblRyZWUobWFpbkNhdGVnb3J5LCB0aGlzLm9wdGlvblRyZWUpO1xuXHR9XG5cblx0Z2V0T3B0aW9uVHJlZSgpXG5cdHtcblx0XHRpZiAodGhpcy5vcHRpb25UcmVlKSByZXR1cm4gdGhpcy5vcHRpb25UcmVlO1xuXHRcdHRoaXMuY3JlYXRlT3B0aW9uc1RyZWUoKTtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25UcmVlO1xuXHR9XG5cblx0cHJpdmF0ZSByZWN1c2l2ZWx5Q3JlYXRlT3B0aW9uVHJlZShjYXRlZ29yeSA6IENhdGVnb3J5LCBvcHRpb25WYWx1ZSA6IE9wdGlvblZhbHVlKVxuXHR7XG5cdFx0bGV0IGNhdGVnb3J5VmFsdWUgPSBuZXcgQ2F0ZWdvcnlWYWx1ZShjYXRlZ29yeSk7XG5cblx0XHRmb3IobGV0IG9wdGlvbiBvZiBjYXRlZ29yeS5vcHRpb25zKVxuXHRcdHtcblx0XHRcdGxldCBjaGlsZE9wdGlvblZhbHVlID0gdGhpcy5maWxsT3B0aW9uSWQob3B0aW9uLmlkKTtcblx0XHRcdGlmIChjaGlsZE9wdGlvblZhbHVlKVxuXHRcdFx0e1xuXHRcdFx0XHRjYXRlZ29yeVZhbHVlLmFkZE9wdGlvblZhbHVlKGNoaWxkT3B0aW9uVmFsdWUpO1xuXHRcdFx0XHRmb3IobGV0IHN1YmNhdGVnb3J5IG9mIG9wdGlvbi5zdWJjYXRlZ29yaWVzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5yZWN1c2l2ZWx5Q3JlYXRlT3B0aW9uVHJlZShzdWJjYXRlZ29yeSwgY2hpbGRPcHRpb25WYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblx0XHR9XG5cblx0XHRpZiAoY2F0ZWdvcnlWYWx1ZS5jaGlsZHJlbi5sZW5ndGggPiAwKVxuXHRcdHtcblx0XHRcdGNhdGVnb3J5VmFsdWUuY2hpbGRyZW4uc29ydCggKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpO1xuXHRcdFx0b3B0aW9uVmFsdWUuYWRkQ2F0ZWdvcnlWYWx1ZShjYXRlZ29yeVZhbHVlKTtcblx0XHR9IFxuXHR9XG5cblx0ZmlsbE9wdGlvbklkKCRvcHRpb25JZCA6IG51bWJlcikgOiBPcHRpb25WYWx1ZVxuXHR7XG5cdFx0bGV0IGluZGV4ID0gdGhpcy5vcHRpb25zVmFsdWVzLm1hcCgodmFsdWUpID0+IHZhbHVlLm9wdGlvbklkKS5pbmRleE9mKCRvcHRpb25JZCk7XG5cdFx0aWYgKGluZGV4ID09IC0xKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zVmFsdWVzW2luZGV4XTtcblx0fVxuXG5cdGdldEljb25zVG9EaXNwbGF5KCkgOiBPcHRpb25WYWx1ZVtdXG5cdHtcblx0XHRsZXQgcmVzdWx0ID0gdGhpcy5pY29uc1RvRGlzcGxheTtcblx0XHRyZXR1cm4gcmVzdWx0LnNvcnQoIChhLGIpID0+IGEuaXNGaWxsZWRCeUZpbHRlcnMgPyAtMSA6IDEpO1xuXHR9XG5cblx0dXBkYXRlSWNvbnNUb0Rpc3BsYXkoKSBcblx0e1x0XHRcblx0XHR0aGlzLmNoZWNrRm9yRGlzYWJsZWRPcHRpb25WYWx1ZXMoKTtcblxuXHRcdGlmIChBcHAuY3Vyck1haW5JZCA9PSAnYWxsJylcblx0XHRcdHRoaXMuaWNvbnNUb0Rpc3BsYXkgPSB0aGlzLnJlY3Vyc2l2ZWx5U2VhcmNoSWNvbnNUb0Rpc3BsYXkodGhpcy5nZXRPcHRpb25UcmVlKCksIGZhbHNlKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmljb25zVG9EaXNwbGF5ID0gdGhpcy5yZWN1cnNpdmVseVNlYXJjaEljb25zVG9EaXNwbGF5KHRoaXMuZ2V0Q3Vyck1haW5PcHRpb25WYWx1ZSgpKTtcblxuXHRcdC8vIGluIGNhc2Ugb2Ygbm8gT3B0aW9uVmFsdWUgaW4gdGhpcyBtYWluT3B0aW9uLCB3ZSBkaXNwbGF5IHRoZSBtYWluT3B0aW9uIEljb25cblx0XHRpZiAodGhpcy5pY29uc1RvRGlzcGxheS5sZW5ndGggPT0gMClcblx0XHR7XG5cdFx0XHR0aGlzLmljb25zVG9EaXNwbGF5LnB1c2godGhpcy5nZXRDdXJyTWFpbk9wdGlvblZhbHVlKCkpO1xuXHRcdH1cblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKFwiSWNvbnMgdG8gZGlzcGxheSBzb3J0ZWRcIiwgdGhpcy5nZXRJY29uc1RvRGlzcGxheSgpKTtcblx0fVxuXG5cdHByaXZhdGUgcmVjdXJzaXZlbHlTZWFyY2hJY29uc1RvRGlzcGxheShwYXJlbnRPcHRpb25WYWx1ZSA6IE9wdGlvblZhbHVlLCByZWN1cnNpdmUgOiBib29sZWFuID0gdHJ1ZSkgOiBPcHRpb25WYWx1ZVtdXG5cdHtcblx0XHRpZiAoIXBhcmVudE9wdGlvblZhbHVlKSByZXR1cm4gW107XG5cblx0XHRsZXQgcmVzdWx0T3B0aW9ucyA6IE9wdGlvblZhbHVlW10gPSBbXTtcdFx0XG5cblx0XHRmb3IobGV0IGNhdGVnb3J5VmFsdWUgb2YgcGFyZW50T3B0aW9uVmFsdWUuY2hpbGRyZW4pXG5cdFx0e1xuXHRcdFx0Zm9yKGxldCBvcHRpb25WYWx1ZSBvZiBjYXRlZ29yeVZhbHVlLmNoaWxkcmVuKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcmVzdWx0ID0gW107XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAocmVjdXJzaXZlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmVzdWx0ID0gdGhpcy5yZWN1cnNpdmVseVNlYXJjaEljb25zVG9EaXNwbGF5KG9wdGlvblZhbHVlKSB8fCBbXTtcblx0XHRcdFx0XHRyZXN1bHRPcHRpb25zID0gcmVzdWx0T3B0aW9ucy5jb25jYXQocmVzdWx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDAgJiYgb3B0aW9uVmFsdWUub3B0aW9uLnVzZUljb25Gb3JNYXJrZXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXN1bHRPcHRpb25zLnB1c2gob3B0aW9uVmFsdWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdE9wdGlvbnM7XG5cdH1cblxuXHRjaGVja0ZvckRpc2FibGVkT3B0aW9uVmFsdWVzKClcblx0e1xuXHRcdHRoaXMucmVjdXJzaXZlbHlDaGVja0ZvckRpc2FibGVkT3B0aW9uVmFsdWVzKHRoaXMuZ2V0T3B0aW9uVHJlZSgpLCBBcHAuY3Vyck1haW5JZCA9PSAnYWxsJyk7XG5cdH1cblxuXHRwcml2YXRlIHJlY3Vyc2l2ZWx5Q2hlY2tGb3JEaXNhYmxlZE9wdGlvblZhbHVlcyhvcHRpb25WYWx1ZSA6IE9wdGlvblZhbHVlLCBub1JlY3Vyc2l2ZSA6IGJvb2xlYW4gPSB0cnVlKVxuXHR7XG5cdFx0bGV0IGlzRXZlcnlDYXRlZ29yeUNvbnRhaW5zT25lT3B0aW9uTm90ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdC8vY29uc29sZS5sb2coXCJjaGVja0ZvckRpc2FibGVkT3B0aW9uVmFsdWUgTm9yZWN1cnNpdmUgOiBcIiArIG5vUmVjdXJzaXZlLCBvcHRpb25WYWx1ZSk7XG5cblx0XHRmb3IobGV0IGNhdGVnb3J5VmFsdWUgb2Ygb3B0aW9uVmFsdWUuY2hpbGRyZW4pXG5cdFx0e1xuXHRcdFx0bGV0IGlzU29tZU9wdGlvbk5vdGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHRmb3IgKGxldCBzdWJvcHRpb25WYWx1ZSBvZiBjYXRlZ29yeVZhbHVlLmNoaWxkcmVuKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoc3Vib3B0aW9uVmFsdWUuY2hpbGRyZW4ubGVuZ3RoID09IDAgfHwgbm9SZWN1cnNpdmUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYm90dG9tIG9wdGlvbiBcIiArIHN1Ym9wdGlvblZhbHVlLm9wdGlvbi5uYW1lLHN1Ym9wdGlvblZhbHVlLm9wdGlvbi5pc0NoZWNrZWQgKTtcblx0XHRcdFx0XHRzdWJvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycyA9IHN1Ym9wdGlvblZhbHVlLm9wdGlvbi5pc0NoZWNrZWQ7XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMucmVjdXJzaXZlbHlDaGVja0ZvckRpc2FibGVkT3B0aW9uVmFsdWVzKHN1Ym9wdGlvblZhbHVlLCBub1JlY3Vyc2l2ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN1Ym9wdGlvblZhbHVlLmlzRmlsbGVkQnlGaWx0ZXJzKSBpc1NvbWVPcHRpb25Ob3RkaXNhYmxlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWlzU29tZU9wdGlvbk5vdGRpc2FibGVkKSBpc0V2ZXJ5Q2F0ZWdvcnlDb250YWluc09uZU9wdGlvbk5vdGRpc2FibGVkID0gZmFsc2U7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiQ2F0ZWdvcnlWYWx1ZSBcIiArIGNhdGVnb3J5VmFsdWUuY2F0ZWdvcnkubmFtZSArIFwiaXNTb21lT3B0aW9uTm90ZGlzYWJsZWRcIiwgaXNTb21lT3B0aW9uTm90ZGlzYWJsZWQpO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25WYWx1ZS5vcHRpb24pXG5cdFx0e1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIk9wdGlvblZhbHVlIFwiICsgb3B0aW9uVmFsdWUub3B0aW9uLm5hbWUgKyBcIiA6IGlzRXZlcnlDYXRlZ295ckNvbnRhaW5Pbk9wdGlvblwiLCBpc0V2ZXJ5Q2F0ZWdvcnlDb250YWluc09uZU9wdGlvbk5vdGRpc2FibGVkICk7XG5cdFx0XHRvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycyA9IGlzRXZlcnlDYXRlZ29yeUNvbnRhaW5zT25lT3B0aW9uTm90ZGlzYWJsZWQ7XG5cdFx0XHRpZiAoIW9wdGlvblZhbHVlLmlzRmlsbGVkQnlGaWx0ZXJzKSBvcHRpb25WYWx1ZS5zZXRSZWN1cnNpdmVseUZpbGxlZEJ5RmlsdGVycyhvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycyk7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlUHJvZHVjdHNSZXByZXNlbnRhdGlvbigpIFxuXHR7XHRcdFxuXHRcdC8vIGlmIChBcHAuc3RhdGUgIT09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSByZXR1cm47XG5cblx0XHQvLyBsZXQgc3Rhck5hbWVzID0gQXBwLmNvbnN0ZWxsYXRpb24uZ2V0U3Rhck5hbWVzUmVwcmVzZW50ZWRCeUVsZW1lbnRJZCh0aGlzLmlkKTtcblx0XHQvLyBpZiAodGhpcy5pc1Byb2R1Y3RldXJPckFtYXAoKSlcblx0XHQvLyB7XG5cdFx0Ly8gXHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9kdWN0cy5sZW5ndGg7aSsrKVxuXHRcdC8vIFx0e1xuXHRcdC8vIFx0XHRwcm9kdWN0TmFtZSA9IHRoaXMucHJvZHVjdHNbaV0ubmFtZUZvcm1hdGU7XHRcdFx0XG5cblx0XHQvLyBcdFx0aWYgKCQuaW5BcnJheShwcm9kdWN0TmFtZSwgc3Rhck5hbWVzKSA9PSAtMSlcblx0XHQvLyBcdFx0e1xuXHRcdC8vIFx0XHRcdHRoaXMucHJvZHVjdHNbaV0uZGlzYWJsZWQgPSB0cnVlO1x0XHRcdFx0XG5cdFx0Ly8gXHRcdFx0aWYgKHByb2R1Y3ROYW1lID09IHRoaXMubWFpblByb2R1Y3QpIHRoaXMubWFpblByb2R1Y3RJc0Rpc2FibGVkID0gdHJ1ZTtcdFx0XHRcdFxuXHRcdC8vIFx0XHR9XHRcblx0XHQvLyBcdFx0ZWxzZVxuXHRcdC8vIFx0XHR7XG5cdFx0Ly8gXHRcdFx0dGhpcy5wcm9kdWN0c1tpXS5kaXNhYmxlZCA9IGZhbHNlO1x0XHRcdFx0XG5cdFx0Ly8gXHRcdFx0aWYgKHByb2R1Y3ROYW1lID09IHRoaXMubWFpblByb2R1Y3QpIHRoaXMubWFpblByb2R1Y3RJc0Rpc2FibGVkID0gZmFsc2U7XHRcdFxuXHRcdC8vIFx0XHR9XHRcdFxuXHRcdC8vIFx0fVxuXHRcdC8vIH1cblx0XHQvLyBlbHNlXG5cdFx0Ly8ge1xuXHRcdC8vIFx0aWYgKHN0YXJOYW1lcy5sZW5ndGggPT09IDApIHRoaXMubWFpblByb2R1Y3RJc0Rpc2FibGVkID0gdHJ1ZTtcdFxuXHRcdC8vIFx0ZWxzZSB0aGlzLm1haW5Qcm9kdWN0SXNEaXNhYmxlZCA9IGZhbHNlO1x0XG5cdFx0Ly8gfVxuXHR9O1xuXG5cdHVwZGF0ZURpc3RhbmNlKClcblx0e1xuXHRcdHRoaXMuZGlzdGFuY2UgPSBudWxsO1xuXHRcdGlmIChBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKSkgXG5cdFx0XHR0aGlzLmRpc3RhbmNlID0gQXBwLm1hcENvbXBvbmVudC5kaXN0YW5jZUZyb21Mb2NhdGlvblRvKHRoaXMucG9zaXRpb24pO1xuXHRcdGVsc2UgaWYgKEFwcC5tYXBDb21wb25lbnQuZ2V0Q2VudGVyKCkpXG5cdFx0XHR0aGlzLmRpc3RhbmNlID0gQXBwLm1hcENvbXBvbmVudC5nZXRDZW50ZXIoKS5kaXN0YW5jZVRvKHRoaXMucG9zaXRpb24pO1xuXHRcdC8vIGRpc3RhbmNlIHZvbCBkJ29pc2VhdSwgb24gYXJyb25kaSBldCBvbiBsJ2F1Z21lbnRlIHVuIHBldVxuXHRcdHRoaXMuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlID8gTWF0aC5yb3VuZCgxLjIqdGhpcy5kaXN0YW5jZSkgOiBudWxsO1xuXHR9XG5cblx0aXNQZW5kaW5nKCkgeyByZXR1cm4gdGhpcy5zdGF0dXMgPT09IEVsZW1lbnRTdGF0dXMuUGVuZGluZzsgfVxuXG5cdGdldEh0bWxSZXByZXNlbnRhdGlvbigpIFxuXHR7XHRcblx0XHR0aGlzLnVwZGF0ZSgpO1x0XG5cdFx0Ly9sZXQgc3Rhck5hbWVzID0gQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uID8gQXBwLmNvbnN0ZWxsYXRpb24uZ2V0U3Rhck5hbWVzUmVwcmVzZW50ZWRCeUVsZW1lbnRJZCh0aGlzLmlkKSA6IFtdO1xuXHRcdGxldCBzdGFyTmFtZXMgOiBhbnlbXSA9IFtdO1xuXG5cdFx0bGV0IG9wdGlvbnN0b0Rpc3BsYXkgPSB0aGlzLmdldEljb25zVG9EaXNwbGF5KCk7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiR2V0SHRtbFJlcHJlc2VudGF0aW9uIFwiICsgdGhpcy5kaXN0YW5jZSArIFwiIGttXCIsIHRoaXMuZ2V0T3B0aW9uVHJlZSgpLmNoaWxkcmVuWzBdKTtcblxuXHRcdGxldCBodG1sID0gVHdpZy5yZW5kZXIoYmlvcGVuX3R3aWdKc19lbGVtZW50SW5mbywgXG5cdFx0e1xuXHRcdFx0ZWxlbWVudCA6IHRoaXMsIFxuXHRcdFx0c2hvd0Rpc3RhbmNlOiBBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKSA/IHRydWUgOiBmYWxzZSxcblx0XHRcdGxpc3RpbmdNb2RlOiBBcHAubW9kZSA9PSBBcHBNb2Rlcy5MaXN0LCBcblx0XHRcdG9wdGlvbnNUb0Rpc3BsYXk6IG9wdGlvbnN0b0Rpc3BsYXksXG5cdFx0XHRhbGxPcHRpb25zVmFsdWVzOiB0aGlzLmdldEN1cnJPcHRpb25zVmFsdWVzKCkuZmlsdGVyKCAob1YpID0+IG9WLm9wdGlvbi5kaXNwbGF5T3B0aW9uKS5zb3J0KCAoYSxiKSA9PiBhLmlzRmlsbGVkQnlGaWx0ZXJzID8gLTEgOiAxKSxcblx0XHRcdG1haW5PcHRpb25WYWx1ZVRvRGlzcGxheTogb3B0aW9uc3RvRGlzcGxheVswXSwgXG5cdFx0XHRvdGhlck9wdGlvbnNWYWx1ZXNUb0Rpc3BsYXk6IG9wdGlvbnN0b0Rpc3BsYXkuc2xpY2UoMSksICBcblx0XHRcdHN0YXJOYW1lcyA6IHN0YXJOYW1lcyxcblx0XHRcdG1haW5DYXRlZ29yeVZhbHVlIDogdGhpcy5nZXRPcHRpb25UcmVlKCkuY2hpbGRyZW5bMF0sXG5cdFx0XHRwZW5kaW5nQ2xhc3MgOiB0aGlzLmlzUGVuZGluZygpID8gJ3BlbmRpbmcnIDogJydcblx0XHR9KTtcblxuXHRcdFxuXHRcdHRoaXMuaHRtbFJlcHJlc2VudGF0aW9uXyA9IGh0bWw7XHRcdFx0XHRcblx0XHRyZXR1cm4gaHRtbDtcblx0fTtcblxuXHRnZXRGb3JtYXRlZE9wZW5Ib3VycygpIFxuXHR7XHRcdFxuXHRcdGlmICh0aGlzLmZvcm1hdGVkT3BlbkhvdXJzXyA9PT0gbnVsbCApXG5cdFx0e1x0XHRcblx0XHRcdHRoaXMuZm9ybWF0ZWRPcGVuSG91cnNfID0ge307XG5cdFx0XHRsZXQgbmV3X2tleSwgbmV3X2tleV90cmFuc2xhdGVkLCBuZXdEYWlseVNsb3Q7XG5cdFx0XHRmb3IobGV0IGtleSBpbiB0aGlzLm9wZW5Ib3Vycylcblx0XHRcdHtcblx0XHRcdFx0bmV3X2tleSA9IGtleS5zcGxpdCgnXycpWzFdO1xuXHRcdFx0XHRuZXdfa2V5X3RyYW5zbGF0ZWQgPSB0aGlzLnRyYW5zbGF0ZURheUtleShuZXdfa2V5KTtcdFx0XHRcdFxuXHRcdFx0XHRuZXdEYWlseVNsb3QgPSB0aGlzLmZvcm1hdGVEYWlseVRpbWVTbG90KHRoaXMub3BlbkhvdXJzW2tleV0pO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKG5ld0RhaWx5U2xvdClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuZm9ybWF0ZWRPcGVuSG91cnNfW25ld19rZXlfdHJhbnNsYXRlZF0gPSBuZXdEYWlseVNsb3Q7XG5cdFx0XHRcdFx0dGhpcy5vcGVuSG91cnNEYXlzLnB1c2gobmV3X2tleV90cmFuc2xhdGVkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5mb3JtYXRlZE9wZW5Ib3Vyc187XG5cdH07XG5cblx0cHJpdmF0ZSB0cmFuc2xhdGVEYXlLZXkoZGF5S2V5KVxuXHR7XG5cdFx0c3dpdGNoKGRheUtleSlcblx0XHR7XG5cdFx0XHRjYXNlICdtb25kYXknOiByZXR1cm4gJ2x1bmRpJztcblx0XHRcdGNhc2UgJ3R1ZXNkYXknOiByZXR1cm4gJ21hcmRpJztcblx0XHRcdGNhc2UgJ3dlZG5lc2RheSc6IHJldHVybiAnbWVyY3JlZGknO1xuXHRcdFx0Y2FzZSAndGh1cnNkYXknOiByZXR1cm4gJ2pldWRpJztcblx0XHRcdGNhc2UgJ2ZyaWRheSc6IHJldHVybiAndmVuZHJlZGknO1xuXHRcdFx0Y2FzZSAnc2F0dXJkYXknOiByZXR1cm4gJ3NhbWVkaSc7XG5cdFx0XHRjYXNlICdzdW5kYXknOiByZXR1cm4gJ2RpbWFuY2hlJztcblx0XHR9XG5cblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRwcml2YXRlIGZvcm1hdGVEYWlseVRpbWVTbG90KGRhaWx5U2xvdCkgXG5cdHtcdFx0XG5cdFx0aWYgKGRhaWx5U2xvdCA9PT0gbnVsbClcblx0XHR7XHRcdFxuXHRcdFx0cmV0dXJuICdmZXJtw6knO1xuXHRcdH1cblx0XHRsZXQgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKGRhaWx5U2xvdC5zbG90MXN0YXJ0KVxuXHRcdHtcblx0XHRcdHJlc3VsdCs9IHRoaXMuZm9ybWF0ZURhdGUoZGFpbHlTbG90LnNsb3Qxc3RhcnQpO1xuXHRcdFx0cmVzdWx0Kz0gJyAtICc7XG5cdFx0XHRyZXN1bHQrPSB0aGlzLmZvcm1hdGVEYXRlKGRhaWx5U2xvdC5zbG90MWVuZCk7XG5cdFx0fVxuXHRcdGlmIChkYWlseVNsb3Quc2xvdDJzdGFydClcblx0XHR7XG5cdFx0XHRyZXN1bHQrPSAnIGV0ICc7XG5cdFx0XHRyZXN1bHQrPSB0aGlzLmZvcm1hdGVEYXRlKGRhaWx5U2xvdC5zbG90MnN0YXJ0KTtcblx0XHRcdHJlc3VsdCs9ICcgLSAnO1xuXHRcdFx0cmVzdWx0Kz0gdGhpcy5mb3JtYXRlRGF0ZShkYWlseVNsb3Quc2xvdDJlbmQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGZvcm1hdGVEYXRlKGRhdGUpIFxuXHR7XHRcdFxuXHRcdGlmICghZGF0ZSkgcmV0dXJuO1xuXHRcdHJldHVybiBkYXRlLnNwbGl0KCdUJylbMV0uc3BsaXQoJzowMCswMTAwJylbMF07XG5cdH07XG5cblx0aXNDdXJyZW50U3RhckNob2ljZVJlcHJlc2VudGFudCgpIFxuXHR7XHRcdFxuXHRcdGlmICggdGhpcy5zdGFyQ2hvaWNlRm9yUmVwcmVzZW50YXRpb24gIT09ICcnKVxuXHRcdHtcblx0XHRcdGxldCBlbGVtZW50U3RhcklkID0gQXBwLmNvbnN0ZWxsYXRpb24uZ2V0U3RhckZyb21OYW1lKHRoaXMuc3RhckNob2ljZUZvclJlcHJlc2VudGF0aW9uKS5nZXRFbGVtZW50SWQoKTtcblx0XHRcdHJldHVybiAodGhpcy5pZCA9PSBlbGVtZW50U3RhcklkKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1x0XG5cdH07XG5cblxuXG5cblxuXG5cblxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vICAgICAgICAgICAgU0VUVEVSUyBHRVRURVJTXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRnZXQgbWFya2VyKCkgIDogQmlvcGVuTWFya2VyXG5cdHtcdFx0XG5cdFx0Ly8gaW5pdGlhbGl6ZSA9IGluaXRpYWxpemUgfHwgZmFsc2U7XG5cdFx0Ly8gaWYgKGluaXRpYWxpemUpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXHRcdHJldHVybiB0aGlzLmJpb3Blbk1hcmtlcl87XG5cdH07XG5cblx0Z2V0IGlzVmlzaWJsZSgpIFxuXHR7XHRcdFxuXHRcdHJldHVybiB0aGlzLmlzVmlzaWJsZV87XG5cdH07XG5cblx0Z2V0IGlzSW5pdGlhbGl6ZWQoKSBcblx0e1x0XHRcblx0XHRyZXR1cm4gdGhpcy5pc0luaXRpYWxpemVkXztcblx0fTtcblxufVxuXG4iLCJpbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgQ2F0ZWdvcnksIE9wdGlvbiwgQ2F0ZWdvcnlWYWx1ZX0gZnJvbSBcIi4vY2xhc3Nlc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmV4cG9ydCBjbGFzcyBPcHRpb25WYWx1ZVxue1xuXHRvcHRpb25JZCA6IG51bWJlcjtcblx0aW5kZXggOiBudW1iZXI7XG5cdGRlc2NyaXB0aW9uIDogc3RyaW5nO1xuXHRvcHRpb25fIDogT3B0aW9uID0gbnVsbDtcblx0aXNGaWxsZWRCeUZpbHRlcnMgOiBib29sZWFuID0gdHJ1ZTtcblxuXHRjaGlsZHJlbiA6IENhdGVnb3J5VmFsdWVbXSA9IFtdO1xuXHRjb2xvck9wdGlvbklkIDogbnVtYmVyID0gbnVsbDtcblxuXHRjb25zdHJ1Y3RvciggJG9wdGlvblZhbHVlSnNvbiApXG5cdHtcblx0XHR0aGlzLm9wdGlvbklkID0gJG9wdGlvblZhbHVlSnNvbi5vcHRpb25JZDtcblx0XHR0aGlzLmluZGV4ID0gJG9wdGlvblZhbHVlSnNvbi5pbmRleDtcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gJG9wdGlvblZhbHVlSnNvbi5kZXNjcmlwdGlvbiB8fCAnJztcblx0fVxuXG5cdGdldCBvcHRpb24oKSA6IE9wdGlvblxuXHR7XG5cdFx0aWYgKHRoaXMub3B0aW9uXykgcmV0dXJuIHRoaXMub3B0aW9uXztcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25fID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE9wdGlvbkJ5SWQodGhpcy5vcHRpb25JZCk7XG5cdH1cblxuXHRzZXRSZWN1cnNpdmVseUZpbGxlZEJ5RmlsdGVycyhib29sIDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMuaXNGaWxsZWRCeUZpbHRlcnMgPSBib29sO1xuXHRcdGZvcihsZXQgY2F0ZWdvcnlWYWx1ZSBvZiB0aGlzLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGZvciAobGV0IHN1Ym9wdGlvblZhbHVlIG9mIGNhdGVnb3J5VmFsdWUuY2hpbGRyZW4pXG5cdFx0XHR7XG5cdFx0XHRcdHN1Ym9wdGlvblZhbHVlLnNldFJlY3Vyc2l2ZWx5RmlsbGVkQnlGaWx0ZXJzKGJvb2wpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGdldCBjYXRlZ29yeU93bmVyKCkgOiBDYXRlZ29yeVxuXHR7XG5cdFx0cmV0dXJuIDxDYXRlZ29yeT4gdGhpcy5vcHRpb24uZ2V0T3duZXIoKTtcblx0fVxuXG5cdGFkZENhdGVnb3J5VmFsdWUoY2F0ZWdvcnlWYWx1ZSA6IENhdGVnb3J5VmFsdWUpXG5cdHtcblx0XHR0aGlzLmNoaWxkcmVuLnB1c2goY2F0ZWdvcnlWYWx1ZSk7XG5cdH1cbn1cblxuIiwiaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uL2NsYXNzZXMvY2F0ZWdvcnkuY2xhc3NcIjtcbmltcG9ydCB7IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUsIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlIH0gZnJvbSBcIi4vY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uIGV4dGVuZHMgQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVxueyBcblx0aWQgOiBudW1iZXI7XG5cdG5hbWUgOiBzdHJpbmc7XG5cdG5hbWVTaG9ydDogc3RyaW5nO1xuXHRpbmRleCA6IG51bWJlcjtcblx0Y29sb3IgOiBzdHJpbmc7XG5cdGljb24gOiBzdHJpbmc7XG5cdHVzZUljb25Gb3JNYXJrZXI6IGJvb2xlYW47XG5cdHVzZUNvbG9yRm9yTWFya2VyIDogYm9vbGVhbjtcblx0c2hvd09wZW5Ib3VycyA6IGJvb2xlYW47XG5cdGRlcHRoIDogbnVtYmVyO1xuXHRkaXNwbGF5T3B0aW9uIDogbnVtYmVyO1xuXHRcblx0cHJpdmF0ZSBteU93bmVyQ29sb3JJZCA6IG51bWJlciA9IG51bGw7XG5cblxuXHRjb25zdHJ1Y3Rvcigkb3B0aW9uSnNvbiA6IGFueSlcblx0e1xuXHRcdHN1cGVyKENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLk9wdGlvbiwgJyNvcHRpb24tJywgJyNvcHRpb24tY2hlY2tib3gtJywgJy5zdWJjYXRlZ29yaWVzLXdyYXBwZXInKTtcblxuXHRcdHRoaXMuaWQgPSAkb3B0aW9uSnNvbi5pZDtcblx0XHR0aGlzLm5hbWUgPSAkb3B0aW9uSnNvbi5uYW1lO1xuXHRcdHRoaXMuaW5kZXggPSAkb3B0aW9uSnNvbi5pbmRleDtcblx0XHR0aGlzLm5hbWVTaG9ydCA9ICRvcHRpb25Kc29uLm5hbWVfc2hvcnQ7XG5cdFx0dGhpcy5jb2xvciA9ICRvcHRpb25Kc29uLmNvbG9yO1xuXHRcdHRoaXMuaWNvbiA9ICRvcHRpb25Kc29uLmljb247XG5cdFx0dGhpcy51c2VJY29uRm9yTWFya2VyID0gJG9wdGlvbkpzb24udXNlX2ljb25fZm9yX21hcmtlcjtcblx0XHR0aGlzLnVzZUNvbG9yRm9yTWFya2VyID0gJG9wdGlvbkpzb24udXNlX2NvbG9yX2Zvcl9tYXJrZXI7XG5cdFx0dGhpcy5zaG93T3BlbkhvdXJzID0gJG9wdGlvbkpzb24uc2hvd19vcGVuX2hvdXJzO1xuXHRcdHRoaXMuZGlzcGxheU9wdGlvbiA9ICRvcHRpb25Kc29uLmRpc3BsYXlfb3B0aW9uO1xuXHR9XG5cblx0YWRkQ2F0ZWdvcnkoJGNhdGVnb3J5IDogQ2F0ZWdvcnkpIHsgdGhpcy5jaGlsZHJlbi5wdXNoKCRjYXRlZ29yeSk7ICB9XG5cblx0aXNNYWluT3B0aW9uKCkgeyByZXR1cm4gdGhpcy5nZXRPd25lcigpID8gKDxDYXRlZ29yeT50aGlzLmdldE93bmVyKCkpLmRlcHRoID09IDAgOiBmYWxzZTsgfVxuXG5cdGlzQ29sbGFwc2libGUoKSA6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5nZXREb20oKS5oYXNDbGFzcygnb3B0aW9uLWNvbGxhcHNpYmxlJyk7IH1cblxuXHRnZXQgc3ViY2F0ZWdvcmllcygpIDogQ2F0ZWdvcnlbXSB7IHJldHVybiA8Q2F0ZWdvcnlbXT4gdGhpcy5jaGlsZHJlbjsgfVxuXG5cdGdldCBhbGxDaGlsZHJlbk9wdGlvbnMoKSA6IE9wdGlvbltdXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5yZWN1cnNpdmVseUdldENoaWxkcmVuT3B0aW9uKHRoaXMpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWN1cnNpdmVseUdldENoaWxkcmVuT3B0aW9uKHBhcmVudE9wdGlvbiA6IE9wdGlvbikgOiBPcHRpb25bXVxuXHR7XG5cdFx0bGV0IHJlc3VsdE9wdGlvbnMgOiBPcHRpb25bXSA9IFtdO1xuXHRcdGZvcihsZXQgY2F0IG9mIHBhcmVudE9wdGlvbi5zdWJjYXRlZ29yaWVzKVxuXHRcdHtcblx0XHRcdHJlc3VsdE9wdGlvbnMgPSByZXN1bHRPcHRpb25zLmNvbmNhdChjYXQub3B0aW9ucyk7XG5cdFx0XHRmb3IobGV0IG9wdGlvbiBvZiBjYXQub3B0aW9ucylcblx0XHRcdHtcblx0XHRcdFx0cmVzdWx0T3B0aW9ucyA9IHJlc3VsdE9wdGlvbnMuY29uY2F0KHRoaXMucmVjdXJzaXZlbHlHZXRDaGlsZHJlbk9wdGlvbihvcHRpb24pKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdE9wdGlvbnM7XG5cdH1cbn0iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuZGVjbGFyZSBsZXQgJCwgalF1ZXJ5IDogYW55O1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgQ2F0ZWdvcnksIE9wdGlvbiB9IGZyb20gXCIuLi9tb2R1bGVzL2NhdGVnb3JpZXMubW9kdWxlXCI7XG5pbXBvcnQgeyBoaWRlRGlyZWN0b3J5TWVudSB9IGZyb20gXCIuLi9hcHAtaW50ZXJhY3Rpb25zXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmV4cG9ydCBjbGFzcyBEaXJlY3RvcnlNZW51Q29tcG9uZW50XG57XHRcblx0Y3VycmVudEFjdGl2ZU1haW5PcHRpb25JZCA9IG51bGw7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cdH1cblxuXHRpbml0aWFsaXplKClcblx0e1x0XG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLSBTRUFSQ0ggQkFSIC0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0JCgnI3NlYXJjaC1iYXInKS5vbihcInNlYXJjaFwiLCBmdW5jdGlvbihldmVudCwgYWRkcmVzcylcblx0XHR7XG5cdFx0XHQvLyBpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSByZWRpcmVjdFRvRGlyZWN0b3J5KCdiaW9wZW5fY29uc3RlbGxhdGlvbicsIGFkZHJlc3MsICQoJyNzZWFyY2gtZGlzdGFuY2UtaW5wdXQnKS52YWwoKSk7XG5cdFx0XHQvLyBlbHNlIFxuXHRcdFx0QXBwLmdlb2NvZGVyLmdlb2NvZGVBZGRyZXNzKFxuXHRcdFx0XHRhZGRyZXNzLCBcblx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0cykgXG5cdFx0XHRcdHsgXG5cdFx0XHRcdFx0Ly9BcHAuaGFuZGxlR2VvY29kaW5nKHJlc3VsdHMpO1xuXHRcdFx0XHRcdCQoJyNzZWFyY2gtYmFyJykudmFsKHJlc3VsdHNbMF0uZ2V0Rm9ybWF0dGVkQWRkcmVzcygpKTsgXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdHMpIHsgJCgnI3NlYXJjaC1iYXInKS5hZGRDbGFzcygnaW52YWxpZCcpOyB9IFxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gSWYgTWVudSB0YWtlIGFsbCBhdmFpbGFibGUgd2lkdGggKGluIGNhc2Ugb2Ygc21hbGwgbW9iaWxlKVxuXHRcdFx0aWYgKCQoJyNkaXJlY3RvcnktbWVudScpLm91dGVyV2lkdGgoKSA9PSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyB0aGVuIHdlIGhpZGUgbWVudSB0byBzaG93IHNlYXJjaCByZXN1bHRcblx0XHRcdFx0aGlkZURpcmVjdG9yeU1lbnUoKTtcblx0XHRcdH1cblx0XHR9KTtcdFxuXG5cdFx0Ly8gYWZmaWNoZSB1bmUgcGV0aXRlIG9tYnJlIHNvdXMgbGUgdGl0cmUgbWVudSBxdWFuZCBvbiBzY3JvbGxcblx0XHQvLyAodW5pcXVlbWVudCB2aXNpYmxlIHN1ciBwZXR0cyDDqWNyYW5zKVxuXHRcdC8vICQoXCIjZGlyZWN0b3J5LW1lbnUtbWFpbi1jb250YWluZXJcIikuc2Nyb2xsKGZ1bmN0aW9uKCkgXG5cdFx0Ly8ge1xuXHRcdC8vICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiAwKSB7XG5cdFx0Ly8gICAgICQoJyNtZW51LXRpdGxlIC5zaGFkb3ctYm90dG9tJykuc2hvdygpO1xuXHRcdC8vICAgfSBlbHNlIHtcblx0XHQvLyAgICAgJCgnI21lbnUtdGl0bGUgLnNoYWRvdy1ib3R0b20nKS5oaWRlKCk7XG5cdFx0Ly8gICB9XG5cdFx0Ly8gfSk7XG5cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tIEZBVk9SSVRFLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQkKCcjZmlsdGVyLWZhdm9yaXRlJykuY2xpY2soZnVuY3Rpb24oZSA6IEV2ZW50KVxuXHRcdHtcblx0XHRcdFxuXHRcdFx0bGV0IGZhdm9yaXRlQ2hlY2tib3ggPSAkKCcjZmF2b3JpdGUtY2hlY2tib3gnKTtcblxuXHRcdFx0bGV0IGNoZWNrVmFsdWUgPSAhZmF2b3JpdGVDaGVja2JveC5pcygnOmNoZWNrZWQnKTtcblxuXHRcdFx0QXBwLmZpbHRlck1vZHVsZS5zaG93T25seUZhdm9yaXRlKGNoZWNrVmFsdWUpO1xuXHRcdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkoIWNoZWNrVmFsdWUpO1xuXG5cdFx0XHRmYXZvcml0ZUNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLGNoZWNrVmFsdWUpO1xuXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblxuXHRcdCQoJyNmaWx0ZXItZmF2b3JpdGUnKS50b29sdGlwKCk7XG5cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tIFBFTkRJTkctLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdCQoJyNmaWx0ZXItcGVuZGluZycpLmNsaWNrKGZ1bmN0aW9uKGUgOiBFdmVudClcblx0XHR7XG5cdFx0XHRcblx0XHRcdGxldCBwZW5kaW5nQ2hlY2tib3ggPSAkKCcjcGVuZGluZy1jaGVja2JveCcpO1xuXG5cdFx0XHRsZXQgY2hlY2tWYWx1ZSA9ICFwZW5kaW5nQ2hlY2tib3guaXMoJzpjaGVja2VkJyk7XG5cblx0XHRcdEFwcC5maWx0ZXJNb2R1bGUuc2hvd1BlbmRpbmcoY2hlY2tWYWx1ZSk7XG5cdFx0XHRBcHAuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c1RvRGlzcGxheShjaGVja1ZhbHVlKTtcblxuXHRcdFx0cGVuZGluZ0NoZWNrYm94LnByb3AoJ2NoZWNrZWQnLGNoZWNrVmFsdWUpO1xuXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblxuXHRcdCQoJyNmaWx0ZXItcGVuZGluZycpLnRvb2x0aXAoKTtcblxuXG5cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tIE1BSU4gT1BUSU9OUyAtLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHQkKCcubWFpbi1jYXRlZ29yaWVzIC5tYWluLWljb24nKS5jbGljayggZnVuY3Rpb24oZSlcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uSWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3B0aW9uLWlkJyk7XG5cdFx0XHR0aGF0LnNldE1haW5PcHRpb24ob3B0aW9uSWQpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLSBDQVRFR09SSUVTIC0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0JCgnLnN1YmNhdGVnb3J5LWl0ZW0gLm5hbWUtd3JhcHBlcicpLmNsaWNrKGZ1bmN0aW9uKClcblx0XHR7XHRcdFxuXHRcdFx0bGV0IGNhdGVnb3J5SWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtY2F0ZWdvcnktaWQnKTtcblx0XHRcdEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRDYXRlZ29yeUJ5SWQoY2F0ZWdvcnlJZCkudG9nZ2xlQ2hpbGRyZW5EZXRhaWwoKTtcblx0XHR9KTtcdFxuXG5cdFx0JCgnLnN1YmNhdGVnb3J5LWl0ZW0gLmNoZWNrYm94LXdyYXBwZXInKS5jbGljayhmdW5jdGlvbihlKVxuXHRcdHtcdFx0XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0bGV0IGNhdGVnb3J5SWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtY2F0ZWdvcnktaWQnKTtcblx0XHRcdEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRDYXRlZ29yeUJ5SWQoY2F0ZWdvcnlJZCkudG9nZ2xlKCk7XG5cdFx0XHRcblx0XHR9KTtcdFx0XHRcblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0gU1VCIE9QVElPTlMgLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdCQoJy5zdWJjYXRlZ29yaWUtb3B0aW9uLWl0ZW06bm90KCNmaWx0ZXItZmF2b3JpdGUpOm5vdCgjZmlsdGVyLXBlbmRpbmcpIC5pY29uLW5hbWUtd3JhcHBlcicpLmNsaWNrKGZ1bmN0aW9uKGUgOiBFdmVudClcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uSWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3B0aW9uLWlkJyk7XG5cdFx0XHRsZXQgb3B0aW9uID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE9wdGlvbkJ5SWQob3B0aW9uSWQpO1xuXG5cdFx0XHRvcHRpb24uaXNDb2xsYXBzaWJsZSgpID8gb3B0aW9uLnRvZ2dsZUNoaWxkcmVuRGV0YWlsKCkgOiBvcHRpb24udG9nZ2xlKCk7XG5cdFx0fSk7XG5cblx0XHQkKCcuc3ViY2F0ZWdvcmllLW9wdGlvbi1pdGVtOm5vdCgjZmlsdGVyLWZhdm9yaXRlKTpub3QoI2ZpbHRlci1wZW5kaW5nKSAuY2hlY2tib3gtd3JhcHBlcicpLmNsaWNrKGZ1bmN0aW9uKGUpXG5cdFx0e1x0XHRcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRsZXQgb3B0aW9uSWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3B0aW9uLWlkJyk7XG5cdFx0XHRBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0T3B0aW9uQnlJZChvcHRpb25JZCkudG9nZ2xlKCk7XG5cdFx0fSk7XG5cblx0fVxuXG5cdHNldE1haW5PcHRpb24ob3B0aW9uSWQpXG5cdHtcblx0XHRpZiAodGhpcy5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkID09IG9wdGlvbklkKSByZXR1cm47XG5cblx0XHRpZiAodGhpcy5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkICE9IG51bGwpIEFwcC5lbGVtZW50TW9kdWxlLmNsZWFyQ3VycmVudHNFbGVtZW50KCk7XG5cblx0XHRsZXQgb2xkSWQgPSB0aGlzLmN1cnJlbnRBY3RpdmVNYWluT3B0aW9uSWQ7XG5cdFx0dGhpcy5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkID0gb3B0aW9uSWQ7XG5cblx0XHRpZiAob3B0aW9uSWQgPT0gJ2FsbCcpXG5cdFx0e1xuXHRcdFx0JCgnI21lbnUtc3ViY2F0ZWdvcmllcy10aXRsZScpLnRleHQoXCJUb3VzIGxlcyBhY3RldXJzXCIpO1xuXHRcdFx0JCgnI29wZW4taG91cnMtZmlsdGVyJykuaGlkZSgpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bGV0IG1haW5PcHRpb24gPSBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbkJ5SWQob3B0aW9uSWQpO1x0XHRcdFx0XG5cblx0XHRcdCQoJyNtZW51LXN1YmNhdGVnb3JpZXMtdGl0bGUnKS50ZXh0KG1haW5PcHRpb24ubmFtZSk7XG5cdFx0XHRpZiAobWFpbk9wdGlvbi5zaG93T3BlbkhvdXJzKSAkKCcjb3Blbi1ob3Vycy1maWx0ZXInKS5zaG93KCk7XG5cdFx0XHRlbHNlICQoJyNvcGVuLWhvdXJzLWZpbHRlcicpLmhpZGUoKTtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZU1haW5PcHRpb25CYWNrZ3JvdW5kKCk7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwic2V0TWFpbk9wdGlvbklkIFwiICsgb3B0aW9uSWQgKyBcIiAvIG9sZE9wdGlvbiA6IFwiICsgb2xkSWQpO1xuXHRcdGlmIChvbGRJZCAhPSBudWxsKSBBcHAuaGlzdG9yeU1vZHVsZS51cGRhdGVDdXJyU3RhdGUoKTtcblxuXHRcdEFwcC5lbGVtZW50TGlzdENvbXBvbmVudC5yZUluaXRpYWxpemVFbGVtZW50VG9EaXNwbGF5TGVuZ3RoKCk7XG5cdFx0XG5cdFx0QXBwLmJvdW5kc01vZHVsZS51cGRhdGVGaWxsZWRCb3VuZHNBY2NvcmRpbmdUb05ld01haW5PcHRpb25JZCgpO1xuXHRcdEFwcC5jaGVja0Zvck5ld0VsZW1lbnRzVG9SZXRyaWV2ZSgpO1xuXHRcdEFwcC5lbGVtZW50TW9kdWxlLnVwZGF0ZUVsZW1lbnRzVG9EaXNwbGF5KHRydWUsdHJ1ZSx0cnVlKTtcblx0fVxuXG5cdHVwZGF0ZU1haW5PcHRpb25CYWNrZ3JvdW5kKClcblx0e1xuXHRcdGxldCBvcHRpb25JZCA9IHRoaXMuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZDtcblxuXHRcdGlmKCEkKCcjZGlyZWN0b3J5LW1lbnUnKS5pcygnOnZpc2libGUnKSkgeyBjb25zb2xlLmxvZyhcImRpcmVjdG9yeSBub3QgdmlzaWJsZVwiKTtyZXR1cm47IH1cblxuXHRcdCQoJyNhY3RpdmUtbWFpbi1vcHRpb24tYmFja2dyb3VuZCcpLmFuaW1hdGUoe3RvcDogJCgnI21haW4tb3B0aW9uLWljb24tJyArIG9wdGlvbklkKS5wb3NpdGlvbigpLnRvcH0sIDUwMCwgJ2Vhc2VPdXRRdWFydCcpO1xuXG5cdFx0JCgnLm1haW4tb3B0aW9uLXN1YmNhdGVnb3JpZXMtY29udGFpbmVyJykuaGlkZSgpO1xuXHRcdCQoJyNtYWluLW9wdGlvbi0nICsgb3B0aW9uSWQpLmZhZGVJbig2MDApO1xuXG5cdFx0JCgnLm1haW4tY2F0ZWdvcmllcyAubWFpbi1pY29uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoJyNtYWluLW9wdGlvbi1pY29uLScgKyBvcHRpb25JZCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9XG59XG5cblxuXG5cblxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuaW1wb3J0IHsgRWxlbWVudHNDaGFuZ2VkIH0gZnJvbSBcIi4uL21vZHVsZXMvZWxlbWVudHMubW9kdWxlXCI7XG5pbXBvcnQgeyBzbHVnaWZ5LCBjYXBpdGFsaXplLCB1bnNsdWdpZnkgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5cbmltcG9ydCB7IGNyZWF0ZUxpc3RlbmVyc0ZvckVsZW1lbnRNZW51LCB1cGRhdGVGYXZvcml0ZUljb24gfSBmcm9tIFwiLi9lbGVtZW50LW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuXG5pbXBvcnQgeyBjcmVhdGVMaXN0ZW5lcnNGb3JWb3RpbmcgfSBmcm9tIFwiLi4vY29tcG9uZW50cy92b3RlLmNvbXBvbmVudFwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudExpc3RDb21wb25lbnRcbntcblx0Ly9vblNob3cgPSBuZXcgRXZlbnQ8bnVtYmVyPigpO1xuXG5cdC8vIE51bWJlciBvZiBlbGVtZW50IGluIG9uZSBsaXN0XG5cdEVMRU1FTlRfTElTVF9TSVpFX1NURVAgOiBudW1iZXIgPSAxNTtcblx0Ly8gQmFzaWNseSB3ZSBkaXNwbGF5IDEgRUxFTUVOVF9MSVNUX1NJWkVfU1RFUCwgYnV0IGlmIHVzZXIgbmVlZFxuXHQvLyBmb3IsIHdlIGRpc3BsYXkgYW4gb3RoZXJzIEVMRU1FTlRfTElTVF9TSVpFX1NURVAgbW9yZVxuXHRzdGVwc0NvdW50IDogbnVtYmVyID0gMTtcblx0aXNMaXN0RnVsbCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHQvLyBsYXN0IHJlcXVlc3Qgd2FzIHNlbmQgd2l0aCB0aGlzIGRpc3RhbmNlXG5cdGxhc3REaXN0YW5jZVJlcXVlc3QgPSAxMDtcblxuXHRpc0luaXRpYWxpemVkIDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdC8vIGRldGVjdCB3aGVuIHVzZXIgcmVhY2ggYm90dG9tIG9mIGxpc3Rcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgdWwnKS5vbignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoJCh0aGlzKS5zY3JvbGxUb3AoKSArICQodGhpcykuaW5uZXJIZWlnaHQoKSA+PSAkKHRoaXMpWzBdLnNjcm9sbEhlaWdodCkgeyAgICAgICAgICAgIFxuXHRcdCAgICBcdHRoYXQuaGFuZGxlQm90dG9tKCk7XG5cdFx0ICB9XG5cdFx0fSk7XG5cdH1cblxuXHR1cGRhdGUoJGVsZW1lbnRzUmVzdWx0IDogRWxlbWVudHNDaGFuZ2VkKSBcblx0e1xuXHRcdGlmICgkZWxlbWVudHNSZXN1bHQuZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoID09IDApIHRoaXMuc3RlcHNDb3VudCA9IDE7XG5cblx0XHR0aGlzLmNsZWFyKCk7XHRcdFxuXG5cdFx0dGhpcy5kcmF3KCRlbGVtZW50c1Jlc3VsdC5lbGVtZW50c1RvRGlzcGxheSwgZmFsc2UpO1xuXHRcdFxuXHRcdGxldCBhZGRyZXNzID0gQXBwLmdlb2NvZGVyLmxhc3RBZGRyZXNzUmVxdWVzdDtcblx0XHRpZiAoYWRkcmVzcylcblx0XHRcdHRoaXMuc2V0VGl0bGUoJyBhdXRvdXIgZGUgPGk+JyArIGNhcGl0YWxpemUodW5zbHVnaWZ5KGFkZHJlc3MpKSkgKyAnPC9pPic7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5zZXRUaXRsZSgnIGF1dG91ciBkdSBjZW50cmUgZGUgbGEgY2FydGUnKTtcblx0fVxuXG5cdHNldFRpdGxlKCR2YWx1ZSA6IHN0cmluZylcblx0e1xuXHRcdCQoJy5lbGVtZW50LWxpc3QtdGl0bGUtdGV4dCcpLmh0bWwoJHZhbHVlKTtcblx0fVxuXG5cdGNsZWFyKClcblx0e1xuXHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IGxpJykucmVtb3ZlKCk7XG5cdH1cblxuXHRjdXJyRWxlbWVudHNEaXNwbGF5ZWQoKSA6IG51bWJlclxuXHR7XG5cdFx0cmV0dXJuICQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IGxpJykubGVuZ3RoO1xuXHR9XG5cblx0cmVJbml0aWFsaXplRWxlbWVudFRvRGlzcGxheUxlbmd0aCgpXG5cdHtcblx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgdWwnKS5hbmltYXRlKHtzY3JvbGxUb3A6ICcwJ30sIDApO1xuXHRcdHRoaXMuc3RlcHNDb3VudCA9IDE7XG5cdH1cblxuXHRwcml2YXRlIGRyYXcoJGVsZW1lbnRMaXN0IDogRWxlbWVudFtdLCAkYW5pbWF0ZSA9IGZhbHNlKSBcblx0e1xuXHRcdC8vY29uc29sZS5sb2coJ0VsZW1lbnRMaXN0IGRyYXcnLCAkZWxlbWVudExpc3QubGVuZ3RoKTtcblxuXHRcdGxldCBlbGVtZW50IDogRWxlbWVudDtcblx0XHRsZXQgZWxlbWVudHNUb0Rpc3BsYXkgOiBFbGVtZW50W10gPSAkZWxlbWVudExpc3Q7IFxuXG5cdFx0Zm9yKGVsZW1lbnQgb2YgZWxlbWVudHNUb0Rpc3BsYXkpXG5cdFx0e1xuXHRcdFx0ZWxlbWVudC51cGRhdGVEaXN0YW5jZSgpO1xuXHRcdH1cblx0XHRlbGVtZW50c1RvRGlzcGxheS5zb3J0KHRoaXMuY29tcGFyZURpc3RhbmNlKTtcblxuXHRcdGxldCBtYXhFbGVtZW50c1RvRGlzcGxheSA9IHRoaXMuRUxFTUVOVF9MSVNUX1NJWkVfU1RFUCAqIHRoaXMuc3RlcHNDb3VudDtcblx0XHRsZXQgZW5kSW5kZXggPSBNYXRoLm1pbihtYXhFbGVtZW50c1RvRGlzcGxheSwgZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoKTsgIFxuXHRcdFxuXHRcdC8vIGlmIHRoZSBsaXN0IGlzIG5vdCBmdWxsLCB3ZSBzZW5kIGFqYXggcmVxdWVzdFxuXHRcdGlmICggZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoIDwgbWF4RWxlbWVudHNUb0Rpc3BsYXkpXG5cdFx0e1xuXHRcdFx0Ly8gZXhwYW5kIGJvdW5kc1xuXHRcdFx0QXBwLmJvdW5kc01vZHVsZS5leHRlbmRCb3VuZHMoMC41KTtcblx0XHRcdEFwcC5jaGVja0Zvck5ld0VsZW1lbnRzVG9SZXRyaWV2ZSgpO1x0XHRcblx0XHR9XHRcblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImxpc3QgaXMgZnVsbFwiKTtcblx0XHRcdHRoaXMuaXNMaXN0RnVsbCA9IHRydWU7XG5cdFx0XHQvLyB3YWl0aW5nIGZvciBzY3JvbGwgYm90dG9tIHRvIGFkZCBtb3JlIGVsZW1lbnRzIHRvIHRoZSBsaXN0XG5cdFx0fVxuXHRcdFxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBlbmRJbmRleDsgaSsrKVxuXHRcdHtcblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50c1RvRGlzcGxheVtpXTtcblx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IHVsJykuYXBwZW5kKGVsZW1lbnQuZ2V0SHRtbFJlcHJlc2VudGF0aW9uKCkpO1xuXHRcdFx0bGV0IGRvbU1lbnUgPSAkKCcjZWxlbWVudC1pbmZvLScrZWxlbWVudC5pZCArJyAubWVudS1lbGVtZW50Jyk7XG5cdFx0XHRjcmVhdGVMaXN0ZW5lcnNGb3JFbGVtZW50TWVudShkb21NZW51KTtcdFxuXHRcdFx0dXBkYXRlRmF2b3JpdGVJY29uKGRvbU1lbnUsIGVsZW1lbnQpXHRcdFxuXHRcdH1cblxuXHRcdGNyZWF0ZUxpc3RlbmVyc0ZvclZvdGluZygpO1xuXG5cdFx0aWYgKCRhbmltYXRlKVxuXHRcdHtcblx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IHVsJykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAnMCd9LCA1MDApO1xuXHRcdH1cdFx0XG5cblx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCB1bCcpLmNvbGxhcHNpYmxlKHtcbiAgICAgIFx0YWNjb3JkaW9uIDogdHJ1ZSBcbiAgIFx0fSk7XG5cbiAgIFx0JCgnLmVsZW1lbnQtbGlzdC10aXRsZS1udW1iZXItcmVzdWx0cycpLnRleHQoJygnICsgZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoICsgJyknKTtcblx0fVxuXG5cdHByaXZhdGUgaGFuZGxlQm90dG9tKClcblx0e1xuXHRcdGlmICh0aGlzLmlzTGlzdEZ1bGwpIFxuXHRcdHtcblx0XHRcdHRoaXMuc3RlcHNDb3VudCsrO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvdHRvbSByZWFjaGVkXCIpO1xuXHRcdFx0dGhpcy5pc0xpc3RGdWxsID0gZmFsc2U7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLmRyYXcoQXBwLmVsZW1lbnRzKCkpO1xuXHRcdH1cdFx0XG5cdH1cblxuXHRwcml2YXRlIGNvbXBhcmVEaXN0YW5jZShhLGIpIFxuXHR7ICBcblx0ICBpZiAoYS5kaXN0YW5jZSA9PSBiLmRpc3RhbmNlKSByZXR1cm4gMDtcblx0ICByZXR1cm4gYS5kaXN0YW5jZSA8IGIuZGlzdGFuY2UgPyAtMSA6IDE7XG5cdH1cbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuZGVjbGFyZSBsZXQgZ3JlY2FwdGNoYTtcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5kZWNsYXJlIGxldCBSb3V0aW5nIDogYW55O1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgc2x1Z2lmeSB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUVsZW1lbnRNZW51KClcbntcdFxuXHQvLyAgIE1FTlUgUFJPVklERVJcblx0bGV0IG1lbnVfZWxlbWVudCA9ICQoJyNlbGVtZW50LWluZm8tYmFyIC5tZW51LWVsZW1lbnQnKTtcblx0Y3JlYXRlTGlzdGVuZXJzRm9yRWxlbWVudE1lbnUobWVudV9lbGVtZW50KTtcdFxuXG5cdCQoJyNwb3B1cC1kZWxldGUtZWxlbWVudCAjc2VsZWN0LXJlYXNvbicpLm1hdGVyaWFsX3NlbGVjdCgpO1xuXHQkKCcjbW9kYWwtdm90ZSAjc2VsZWN0LXZvdGUnKS5tYXRlcmlhbF9zZWxlY3QoKTtcblxuXHQvLyBidXR0b24gdG8gY29uZmlybSBjYWxjdWxhdGUgaWRyZWN0aW9ucyBpbiBtb2RhbCBwaWNrIGFkZHJlc3MgZm9yIGRpcmVjdGlvbnNcblx0JCgnI21vZGFsLXBpY2stYWRkcmVzcyAjYnRuLWNhbGN1bGF0ZS1kaXJlY3Rpb25zJykuY2xpY2soKCkgPT4gXG5cdHtcblx0XHRsZXQgYWRkcmVzcyA9ICQoJyNtb2RhbC1waWNrLWFkZHJlc3MgaW5wdXQnKS52YWwoKTtcblx0XHRcblx0XHRpZiAoYWRkcmVzcylcblx0XHR7XHRcdFx0XG5cdFx0XHRBcHAuZ2VvY29kZXIuZ2VvY29kZUFkZHJlc3MoYWRkcmVzcyxcblx0XHRcdCgpID0+IHtcblx0XHRcdFx0JChcIiNtb2RhbC1waWNrLWFkZHJlc3MgLm1vZGFsLWVycm9yLW1zZ1wiKS5oaWRlKCk7XG5cdFx0XHRcdCQoJyNtb2RhbC1waWNrLWFkZHJlc3MnKS5jbG9zZU1vZGFsKCk7XG5cdFx0XHRcdEFwcC5zZWFyY2hCYXJDb21wb25lbnQuc2V0VmFsdWUoYWRkcmVzcyk7XG5cblx0XHRcdFx0QXBwLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucyx7aWQ6IGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpfSk7XG5cdFx0XHR9LFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHQkKFwiI21vZGFsLXBpY2stYWRkcmVzcyAubW9kYWwtZXJyb3ItbXNnXCIpLnNob3coKTtcblx0XHRcdH0pO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0JCgnI21vZGFsLXBpY2stYWRkcmVzcyBpbnB1dCcpLmFkZENsYXNzKCdpbnZhbGlkJyk7XG5cdFx0fVxuXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVFbGVtZW50KClcbntcblx0aWYgKGdyZWNhcHRjaGEuZ2V0UmVzcG9uc2UoKS5sZW5ndGggPT09IDApXG5cdHtcblx0XHQkKCcjY2FwdGNoYS1lcnJvci1tZXNzYWdlJykuc2hvdygpO1xuXHRcdGdyZWNhcHRjaGEucmVzZXQoKTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHQkKCcjY2FwdGNoYS1lcnJvci1tZXNzYWdlJykuaGlkZSgpO1xuXHRcdCQoJyNwb3B1cC1kZWxldGUtZWxlbWVudCcpLmNsb3NlTW9kYWwoKTtcblx0fVx0XG59XG5cbmZ1bmN0aW9uIG9ubG9hZENhcHRjaGEoKSBcbntcbiAgICBncmVjYXB0Y2hhLnJlbmRlcignY2FwdGNoYScsIHtcbiAgICAgICdzaXRla2V5JyA6ICc2TGNFVmlVVEFBQUFBT0VNcEZDeUxId1BHMXZKcUV4dXlENG4xTGJ3J1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRmF2b3JpdGVJY29uKG9iamVjdCwgZWxlbWVudCA6IEVsZW1lbnQpXG57XG5cdGlmICghZWxlbWVudC5pc0Zhdm9yaXRlKSBcblx0e1xuXHRcdG9iamVjdC5maW5kKCcuaXRlbS1hZGQtZmF2b3JpdGUnKS5zaG93KCk7XG5cdFx0b2JqZWN0LmZpbmQoJy5pdGVtLXJlbW92ZS1mYXZvcml0ZScpLmhpZGUoKTtcblx0fVx0XG5cdGVsc2UgXG5cdHtcblx0XHRvYmplY3QuZmluZCgnLml0ZW0tYWRkLWZhdm9yaXRlJykuaGlkZSgpO1xuXHRcdG9iamVjdC5maW5kKCcuaXRlbS1yZW1vdmUtZmF2b3JpdGUnKS5zaG93KCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dGdWxsVGV4dE1lbnUob2JqZWN0LCBib29sIDogYm9vbGVhbilcbntcblx0aWYgKGJvb2wpXG5cdHtcblx0XHRvYmplY3QuYWRkQ2xhc3MoXCJmdWxsLXRleHRcIik7XG5cdFx0b2JqZWN0LmZpbmQoJy50b29sdGlwcGVkJykudG9vbHRpcCgncmVtb3ZlJyk7XHRcblx0fVxuXHRlbHNlXG5cdHtcblx0XHRvYmplY3QucmVtb3ZlQ2xhc3MoXCJmdWxsLXRleHRcIik7XG5cdFx0b2JqZWN0LmZpbmQoJy50b29sdGlwcGVkJykudG9vbHRpcCgpO1x0XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxpc3RlbmVyc0ZvckVsZW1lbnRNZW51KG9iamVjdClcbntcblx0b2JqZWN0LmZpbmQoJy50b29sdGlwcGVkJykudG9vbHRpcCgpO1xuXG5cdG9iamVjdC5maW5kKCcuaXRlbS1lZGl0JykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fZWxlbWVudF9lZGl0JywgeyBpZCA6IGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpIH0pOyBcblx0fSk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLWRlbGV0ZScpLmNsaWNrKGZ1bmN0aW9uKCkgXG5cdHtcdFx0XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0Ly93aW5kb3cuY29uc29sZS5sb2coZWxlbWVudC5uYW1lKTtcblx0XHQkKCcjcG9wdXAtZGVsZXRlLWVsZW1lbnQgLmVsZW1lbnROYW1lJykudGV4dChjYXBpdGFsaXplKGVsZW1lbnQubmFtZSkpO1xuXHRcdCQoJyNwb3B1cC1kZWxldGUtZWxlbWVudCcpLm9wZW5Nb2RhbCh7XG5cdFx0ICAgICAgZGlzbWlzc2libGU6IHRydWUsIFxuXHRcdCAgICAgIG9wYWNpdHk6IDAuNSwgXG5cdFx0ICAgICAgaW5fZHVyYXRpb246IDMwMCwgXG5cdFx0ICAgICAgb3V0X2R1cmF0aW9uOiAyMDBcbiAgICBcdFx0fSk7XG5cdH0pO1xuXG5cdG9iamVjdC5maW5kKCcuaXRlbS1kaXJlY3Rpb25zJykuY2xpY2soZnVuY3Rpb24oKSBcblx0e1xuXHRcdGxldCBlbGVtZW50ID0gQXBwLmVsZW1lbnRNb2R1bGUuZ2V0RWxlbWVudEJ5SWQoZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkpO1xuXG5cdFx0aWYgKEFwcC5zdGF0ZSAhPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24gJiYgIUFwcC5nZW9jb2Rlci5nZXRMb2NhdGlvbigpKVxuXHRcdHtcblx0XHRcdGxldCBtb2RhbCA9ICQoJyNtb2RhbC1waWNrLWFkZHJlc3MnKTtcblx0XHRcdG1vZGFsLmZpbmQoXCIubW9kYWwtZm9vdGVyXCIpLmF0dHIoJ29wdGlvbi1pZCcsZWxlbWVudC5jb2xvck9wdGlvbklkKTtcdFx0XHRcblx0XHRcdFxuXHRcdFx0bW9kYWwub3Blbk1vZGFsKHtcblx0ICAgICAgZGlzbWlzc2libGU6IHRydWUsIFxuXHQgICAgICBvcGFjaXR5OiAwLjUsIFxuXHQgICAgICBpbl9kdXJhdGlvbjogMzAwLCBcblx0ICAgICAgb3V0X2R1cmF0aW9uOiAyMDAsXG4gICBcdFx0fSk7XG5cdFx0fVxuXHRcdGVsc2UgQXBwLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucyx7aWQ6IGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpfSk7XG5cdH0pO1xuXG5cdG9iamVjdC5maW5kKCcuaXRlbS1zaGFyZScpLmNsaWNrKGZ1bmN0aW9uKClcblx0e1xuXHRcdGxldCBlbGVtZW50ID0gQXBwLmVsZW1lbnRNb2R1bGUuZ2V0RWxlbWVudEJ5SWQoZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkpO1xuXHRcdFxuXHRcdGxldCBtb2RhbCA9ICQoJyNtb2RhbC1zaGFyZS1lbGVtZW50Jyk7XG5cblx0XHRtb2RhbC5maW5kKFwiLm1vZGFsLWZvb3RlclwiKS5hdHRyKCdvcHRpb24taWQnLGVsZW1lbnQuY29sb3JPcHRpb25JZCk7XG5cdFx0Ly9tb2RhbC5maW5kKFwiLmlucHV0LXNpbXBsZS1tb2RhbFwiKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKFwiaW5wdXQtc2ltcGxlLW1vZGFsIFwiICsgZWxlbWVudC5jb2xvck9wdGlvbklkKTtcblxuXHRcdGxldCB1cmw7XG5cdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcClcblx0XHR7XG5cdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHVybCA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9kaXJlY3Rvcnlfc2hvd0VsZW1lbnQnLCB7IG5hbWUgOiAgY2FwaXRhbGl6ZShzbHVnaWZ5KGVsZW1lbnQubmFtZSkpLCBpZCA6IGVsZW1lbnQuaWQgfSwgdHJ1ZSk7XHRcblx0XHR9XG5cblx0XHRtb2RhbC5maW5kKCcuaW5wdXQtc2ltcGxlLW1vZGFsJykudmFsKHVybCk7XG5cdFx0bW9kYWwub3Blbk1vZGFsKHtcblx0ICAgICAgZGlzbWlzc2libGU6IHRydWUsIFxuXHQgICAgICBvcGFjaXR5OiAwLjUsIFxuXHQgICAgICBpbl9kdXJhdGlvbjogMzAwLCBcblx0ICAgICAgb3V0X2R1cmF0aW9uOiAyMDBcbiAgIFx0fSk7XG5cdH0pO1x0XG5cdFxuXHRvYmplY3QuZmluZCgnLml0ZW0tYWRkLWZhdm9yaXRlJykuY2xpY2soZnVuY3Rpb24oKSBcblx0e1xuXHRcdGxldCBlbGVtZW50ID0gQXBwLmVsZW1lbnRNb2R1bGUuZ2V0RWxlbWVudEJ5SWQoZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkpO1xuXHRcdEFwcC5lbGVtZW50TW9kdWxlLmFkZEZhdm9yaXRlKGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpKTtcblxuXHRcdHVwZGF0ZUZhdm9yaXRlSWNvbihvYmplY3QsIGVsZW1lbnQpO1xuXG5cdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcClcblx0XHR7XG5cdFx0XHRlbGVtZW50Lm1hcmtlci51cGRhdGUoKTtcblx0XHRcdGVsZW1lbnQubWFya2VyLmFuaW1hdGVEcm9wKCk7XG5cdFx0fVxuXHRcdFxuXHR9KTtcblx0XG5cdG9iamVjdC5maW5kKCcuaXRlbS1yZW1vdmUtZmF2b3JpdGUnKS5jbGljayhmdW5jdGlvbigpIFxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUucmVtb3ZlRmF2b3JpdGUoZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkpO1xuXHRcdFxuXHRcdHVwZGF0ZUZhdm9yaXRlSWNvbihvYmplY3QsIGVsZW1lbnQpO1xuXG5cdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCkgZWxlbWVudC5tYXJrZXIudXBkYXRlKCk7XG5cdH0pO1x0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSA6IG51bWJlclxue1xuXHRyZXR1cm4gZ2V0Q3VycmVudEVsZW1lbnRJbmZvQmFyU2hvd24oKS5hdHRyKCdkYXRhLWVsZW1lbnQtaWQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRFbGVtZW50SW5mb0JhclNob3duKClcbntcblx0aWYgKCBBcHAubW9kZSA9PSBBcHBNb2Rlcy5NYXAgKSBcblx0e1xuXHRcdHJldHVybiAkKCcjZWxlbWVudC1pbmZvLWJhcicpLmZpbmQoJy5lbGVtZW50LWl0ZW0nKTtcblx0fVxuXHRyZXR1cm4gJCgnLmVsZW1lbnQtaXRlbS5hY3RpdmUnKTtcbn1cblxuXG4vKmZ1bmN0aW9uIGJvb2tNYXJrTWUoKVxue1xuXHRpZiAod2luZG93LnNpZGViYXIpIHsgLy8gTW96aWxsYSBGaXJlZm94IEJvb2ttYXJrXG4gICAgICB3aW5kb3cuc2lkZWJhci5hZGRQYW5lbChsb2NhdGlvbi5ocmVmLGRvY3VtZW50LnRpdGxlLFwiXCIpO1xuICAgIH0gZWxzZSBpZih3aW5kb3cuZXh0ZXJuYWwpIHsgLy8gSUUgRmF2b3JpdGVcbiAgICAgIHdpbmRvdy5leHRlcm5hbC5BZGRGYXZvcml0ZShsb2NhdGlvbi5ocmVmLGRvY3VtZW50LnRpdGxlKTsgfVxuICAgIGVsc2UgaWYod2luZG93Lm9wZXJhICYmIHdpbmRvdy5wcmludCkgeyAvLyBPcGVyYSBIb3RsaXN0XG4gICAgICB0aGlzLnRpdGxlPWRvY3VtZW50LnRpdGxlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSovXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgdXBkYXRlTWFwU2l6ZSwgdXBkYXRlSW5mb0JhclNpemUgfSBmcm9tIFwiLi4vYXBwLWludGVyYWN0aW9uc1wiO1xuaW1wb3J0IHsgdXBkYXRlRmF2b3JpdGVJY29uLCBzaG93RnVsbFRleHRNZW51IH0gZnJvbSBcIi4vZWxlbWVudC1tZW51LmNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBjcmVhdGVMaXN0ZW5lcnNGb3JWb3RpbmcgfSBmcm9tIFwiLi4vY29tcG9uZW50cy92b3RlLmNvbXBvbmVudFwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5leHBvcnQgY2xhc3MgSW5mb0JhckNvbXBvbmVudFxue1xuXHRpc1Zpc2libGUgOiBib29sZWFuID0gZmFsc2U7XG5cdGlzRGV0YWlsc1Zpc2libGUgPSBmYWxzZTtcblxuXHRlbGVtZW50VmlzaWJsZSA6IEVsZW1lbnQgPSBudWxsO1xuXG5cdG9uU2hvdyA9IG5ldyBFdmVudDxudW1iZXI+KCk7XG5cdG9uSGlkZSA9IG5ldyBFdmVudDxib29sZWFuPigpO1xuXG5cdGdldEN1cnJFbGVtZW50SWQoKSA6IHN0cmluZyB7IHJldHVybiB0aGlzLmVsZW1lbnRWaXNpYmxlID8gdGhpcy5lbGVtZW50VmlzaWJsZS5pZCA6IG51bGx9XG5cblx0cHJpdmF0ZSBpc0Rpc3BsYXllZEFzaWRlKClcblx0e1xuXHRcdHJldHVybiAkKCcjZWxlbWVudC1pbmZvLWJhcicpLmNzcygncG9zaXRpb24nKSA9PSAnYWJzb2x1dGUnO1xuXHR9XG5cblx0Ly8gQXBwLmluZm9CYXJDb21wb25lbnQuc2hvd0VsZW1lbnQ7XG5cdHNob3dFbGVtZW50KGVsZW1lbnRJZCkgXG5cdHtcblx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XG5cblx0XHRjb25zb2xlLmxvZyhcInNob3dFbGVtZW50XCIsIGVsZW1lbnQpO1xuXHRcdFxuXHRcdC8vIGlmIGVsZW1lbnQgYWxyZWFkeSB2aXNpYmxlXG5cdFx0aWYgKHRoaXMuZWxlbWVudFZpc2libGUpXG5cdFx0e1xuXHRcdFx0dGhpcy5lbGVtZW50VmlzaWJsZS5tYXJrZXIuc2hvd05vcm1hbFNpemUodHJ1ZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50VmlzaWJsZSA9IGVsZW1lbnQ7XHRcdFx0XHRcblxuXHRcdGVsZW1lbnQudXBkYXRlRGlzdGFuY2UoKTtcblxuXHRcdCQoJyNlbGVtZW50LWluZm8nKS5odG1sKGVsZW1lbnQuZ2V0SHRtbFJlcHJlc2VudGF0aW9uKCkpO1xuXG5cdFx0bGV0IGRvbU1lbnUgPSAkKCcjZWxlbWVudC1pbmZvLWJhciAubWVudS1lbGVtZW50Jyk7XG5cdFx0ZG9tTWVudS5hdHRyKCdvcHRpb24taWQnLCBlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1xuXG5cdFx0aWYgKGVsZW1lbnQuaXNQZW5kaW5nKCkpIFxuXHRcdHtcblx0XHRcdGRvbU1lbnUuYWRkQ2xhc3MoXCJwZW5kaW5nXCIpO1xuXHRcdFx0Y3JlYXRlTGlzdGVuZXJzRm9yVm90aW5nKCk7XG5cdFx0fVxuXHRcdGVsc2UgZG9tTWVudS5yZW1vdmVDbGFzcyhcInBlbmRpbmdcIik7XG5cblx0XHR1cGRhdGVGYXZvcml0ZUljb24oZG9tTWVudSwgZWxlbWVudCk7XG5cblx0XHQvLyBvbiBsYXJnZSBzY3JlZW4gaW5mbyBiYXIgaXMgZGlzcGxheWVkIGFzaWRlIGFuZCBzbyB3ZSBoYXZlIGVub3VnaCBzcGFjZVxuXHRcdC8vIHRvIHNob3cgbWVudSBhY3Rpb25zIGRldGFpbHMgaW4gZnVsbCB0ZXh0XG5cdFx0c2hvd0Z1bGxUZXh0TWVudShkb21NZW51LCB0aGlzLmlzRGlzcGxheWVkQXNpZGUoKSk7XG5cblxuXHRcdCQoJyNidG4tY2xvc2UtYmFuZGVhdS1kZXRhaWwnKS5jbGljaygoKSA9PlxuXHRcdHsgIFx0XHRcblx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHRcdFxuXHRcdCQoJyNlbGVtZW50LWluZm8gLmNvbGxhcHNpYmxlLWhlYWRlcicpLmNsaWNrKCgpID0+IHt0aGlzLnRvZ2dsZURldGFpbHMoKTsgfSk7XG5cdFx0XG5cdFx0dGhpcy5zaG93KCk7XG5cblx0XHQvLyBhZnRlciBpbmZvYmFyIGFuaW1hdGlvbiwgd2UgY2hlY2sgaWYgdGhlIG1hcmtlciBcblx0XHQvLyBpcyBub3QgaGlkZGVkIGJ5IHRoZSBpbmZvIGJhclxuXHRcdHNldFRpbWVvdXQoKCk9PiB7XG5cdFx0XHRpZiAoIUFwcC5tYXBDb21wb25lbnQuY29udGFpbnMoZWxlbWVudC5wb3NpdGlvbikpXG5cdFx0XHR7XG5cdFx0XHRcdEFwcC5tYXBDb21wb25lbnQucGFuVG9Mb2NhdGlvbihlbGVtZW50LnBvc2l0aW9uKTtcblx0XHRcdFx0c2V0VGltZW91dCggKCkgPT4geyB0aGlzLmVsZW1lbnRWaXNpYmxlLm1hcmtlci5zaG93QmlnU2l6ZSgpOyB9LCAxMDAwKTtcblx0XHRcdFx0Ly9BcHAuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50c1RvRGlzcGxheSgpXG5cdFx0XHR9XHRcdFx0XG5cdFx0fSwgMTAwMCk7XG5cblx0XHR0aGlzLm9uU2hvdy5lbWl0KGVsZW1lbnRJZCk7XG5cdH07XG5cblx0c2hvdygpXG5cdHtcblx0XHQvL0FwcC5zZXRUaW1lb3V0SW5mb0JhckNvbXBvbmVudCgpO1xuXG5cdFx0aWYgKCF0aGlzLmlzRGlzcGxheWVkQXNpZGUoKSlcblx0XHR7XG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLnNob3coKTtcblxuXHRcdFx0bGV0IGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCA9ICQoJyNlbGVtZW50LWluZm8nKS5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCArPSAkKCcjZWxlbWVudC1pbmZvLWJhciAuc3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlLWhlbHBlcjp2aXNpYmxlJykuaGVpZ2h0KCk7XG5cblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuY3NzKCdoZWlnaHQnLCBlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQpO1xuXHRcdFx0dXBkYXRlSW5mb0JhclNpemUoKTtcblx0XHRcdHVwZGF0ZU1hcFNpemUoZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0KTtcblx0XHR9XHRcblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0LyokKCcjZWxlbWVudC1pbmZvLWJhcicpLnNob3coKTtcblx0XHRcdHVwZGF0ZUluZm9CYXJTaXplKCk7Ki9cdFx0XG5cblx0XHRcdGlmICghJCgnI2VsZW1lbnQtaW5mby1iYXInKS5pcygnOnZpc2libGUnKSlcblx0XHRcdHtcblx0XHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5jc3MoJ3JpZ2h0JywnLTUwMHB4Jyk7XHRcdFx0XG5cdFx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuc2hvdygpLmFuaW1hdGUoeydyaWdodCc6JzAnfSwzNTAsJ3N3aW5nJyxmdW5jdGlvbigpeyB1cGRhdGVNYXBTaXplKDApOyB9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dXBkYXRlSW5mb0JhclNpemUoKTtcblx0XHRcdC8vJCgnI2VsZW1lbnQtaW5mby1iYXInKS5zaG93KFwic2xpZGVcIiwge2RpcmVjdGlvbjogJ3JpZ3RoJywgZWFzaW5nOiAnc3dpbmcnfSAsIDM1MCApO1xuXHRcdH1cblxuXHRcdHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcblx0fTtcblxuXHRoaWRlKClcblx0e1xuXHRcdGlmICgkKCcjZWxlbWVudC1pbmZvLWJhcicpLmlzKCc6dmlzaWJsZScpKVxuXHRcdHtcblx0XHRcdGlmICghdGhpcy5pc0Rpc3BsYXllZEFzaWRlKCkpXG5cdFx0XHR7XHRcdFx0XG5cdFx0XHRcdHRoaXMuaGlkZURldGFpbHMoKTtcblx0XHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5jc3MoJ2hlaWdodCcsJzAnKTtcblx0XHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5oaWRlKCk7XG5cdFx0XHRcdHVwZGF0ZU1hcFNpemUoMCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1tYXAnKS5jc3MoJ21hcmdpbi1yaWdodCcsJzBweCcpO1xuXHRcdFx0XHQkKCcjYmFuZGVhdV9oZWxwZXInKS5jc3MoJ21hcmdpbi1yaWdodCcsJzBweCcpO1xuXG5cdFx0XHRcdGlmICgkKCcjZWxlbWVudC1pbmZvLWJhcicpLmlzKCc6dmlzaWJsZScpKVxuXHRcdFx0XHR7XHRcdFxuXHRcdFx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuYW5pbWF0ZSh7J3JpZ2h0JzonLTUwMHB4J30sMzUwLCdzd2luZycsZnVuY3Rpb24oKXsgJCh0aGlzKS5oaWRlKCk7dXBkYXRlTWFwU2l6ZSgwKTsgIH0pO1xuXHRcdFx0XHR9XHRcdFxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm9uSGlkZS5lbWl0KHRydWUpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmVsZW1lbnRWaXNpYmxlICYmIHRoaXMuZWxlbWVudFZpc2libGUubWFya2VyKSB0aGlzLmVsZW1lbnRWaXNpYmxlLm1hcmtlci5zaG93Tm9ybWFsU2l6ZSh0cnVlKTtcblxuXHRcdHRoaXMuZWxlbWVudFZpc2libGUgPSBudWxsO1xuXHRcdHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XHRcdFxuXHR9O1xuXG5cdHRvZ2dsZURldGFpbHMoKVxuXHR7XHRcblx0XHQvL0FwcC5zZXRUaW1lb3V0SW5mb0JhckNvbXBvbmVudCgpO1xuXG5cdFx0aWYgKCAkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZURldGFpbHMnKS5pcygnOnZpc2libGUnKSApXG5cdFx0e1xuXHRcdFx0dGhpcy5oaWRlRGV0YWlscygpO1xuXHRcdFx0JCgnI2JhbmRlYXVfaGVscGVyJykuY3NzKCd6LWluZGV4JywyMCkuYW5pbWF0ZSh7J29wYWNpdHknOiAnMSd9LDUwMCk7XG5cdFx0XHQkKCcjbWVudS1idXR0b24nKS5mYWRlSW4oKTtcdFx0XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQkKCcjYmFuZGVhdV9oZWxwZXInKS5hbmltYXRlKHsnb3BhY2l0eSc6ICcwJ30sNTAwKS5jc3MoJ3otaW5kZXgnLC0xKTtcblx0XHRcdCQoJyNtZW51LWJ1dHRvbicpLmZhZGVPdXQoKTtcblxuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVJbmZvcycpLmhpZGUoKTtcblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5sZXNzSW5mb3MnKS5zaG93KCk7XHRcblx0XHRcdFxuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVEZXRhaWxzJykuc2hvdygpO1x0XHRcblxuXHRcdFx0bGV0IGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCA9ICAkKCB3aW5kb3cgKS5oZWlnaHQoKTtcblx0XHRcdGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCAtPSAkKCdoZWFkZXInKS5oZWlnaHQoKTtcblx0XHRcdGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCAtPSQoJyNiYW5kZWF1X2dvVG9kaXJlY3RvcnktY29udGVudC1saXN0Jykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuXG5cdFx0XHRsZXQgZWxlbWVudEluZm9CYXIgPSAkKFwiI2VsZW1lbnQtaW5mby1iYXJcIik7XG5cdFx0ICBcdGxldCBoZWlnaHQgPSAgZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0O1xuXHRcdFx0aGVpZ2h0IC09IGVsZW1lbnRJbmZvQmFyLmZpbmQoJy5jb2xsYXBzaWJsZS1oZWFkZXInKS5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdGhlaWdodCAtPSBlbGVtZW50SW5mb0Jhci5maW5kKCcuc3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlLWhlbHBlcjp2aXNpYmxlJykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRoZWlnaHQgLT0gZWxlbWVudEluZm9CYXIuZmluZChcIi5tZW51LWVsZW1lbnRcIikub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cblx0XHQgIFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLmNvbGxhcHNpYmxlLWJvZHknKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG5cdFx0XHRcblx0XHRcdHVwZGF0ZU1hcFNpemUoZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0KTtcdFx0XHRcblx0XHR9XHRcblx0fTtcblxuXHRoaWRlRGV0YWlscygpXG5cdHtcblx0XHQvL0FwcC5zZXRUaW1lb3V0SW5mb0JhckNvbXBvbmVudCgpO1xuXG5cdFx0aWYgKCQoJyNlbGVtZW50LWluZm8tYmFyIC5tb3JlRGV0YWlscycpLmlzKCc6dmlzaWJsZScpKVxuXHRcdHtcblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5tb3JlRGV0YWlscycpLmhpZGUoKTtcblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5tb3JlSW5mb3MnKS5zaG93KCk7XG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhciAubGVzc0luZm9zJykuaGlkZSgpO1xuXG5cdFx0XHRsZXQgZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0ID0gJCgnI2VsZW1lbnQtaW5mbycpLm91dGVySGVpZ2h0KHRydWUpICsgJCgnI2VsZW1lbnQtaW5mby1iYXIgLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZS1oZWxwZXI6dmlzaWJsZScpLmhlaWdodCgpO1xuXG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmNzcygnaGVpZ2h0JywgZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0KTtcblxuXHRcdFx0dXBkYXRlTWFwU2l6ZShlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQpO1x0XG5cdFx0fVx0XG5cdH07XG59XG5cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcyB9IGZyb20gXCIuLi8uLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBkcmF3TGluZUJldHdlZW5Qb2ludHMgfSBmcm9tIFwiLi9tYXAtZHJhd2luZ1wiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi8uLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSBsZXQgJDtcblxuZGVjbGFyZSBsZXQgVHdpZyA6IGFueTtcbmRlY2xhcmUgbGV0IGJpb3Blbl90d2lnSnNfbWFya2VyIDogYW55O1xuXG5leHBvcnQgY2xhc3MgQmlvcGVuTWFya2VyXG57XG5cdGlkXyA6IHN0cmluZztcblx0aXNBbmltYXRpbmdfIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRyaWNoTWFya2VyXyA6IEwuTWFya2VyO1xuXHRpc0hhbGZIaWRkZW5fIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRpbmNsaW5hdGlvbl8gPSBcIm5vcm1hbFwiO1xuXHRwb2x5bGluZV87XG5cblx0Y29uc3RydWN0b3IoaWRfIDogc3RyaW5nLCBwb3NpdGlvbl8gOiBMLkxhdExuZykgXG5cdHtcblx0XHR0aGlzLmlkXyA9IGlkXztcblxuXHRcdGlmICghcG9zaXRpb25fKVxuXHRcdHtcblx0XHRcdGxldCBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50KCk7XG5cdFx0XHRpZiAoZWxlbWVudCA9PT0gbnVsbCkgd2luZG93LmNvbnNvbGUubG9nKFwiZWxlbWVudCBudWxsIGlkID0gXCIrIHRoaXMuaWRfKTtcblx0XHRcdGVsc2UgcG9zaXRpb25fID0gZWxlbWVudC5wb3NpdGlvbjtcblx0XHR9IFxuXG5cdFx0dGhpcy5yaWNoTWFya2VyXyA9IEwubWFya2VyKHBvc2l0aW9uXywgeyAncmlzZU9uSG92ZXInIDogdHJ1ZX0pO1x0XG5cdFx0XHRcblx0XHR0aGlzLnJpY2hNYXJrZXJfLm9uKCdjbGljaycsIChldikgPT5cblx0XHR7XG5cdFx0XHRBcHAuaGFuZGxlTWFya2VyQ2xpY2sodGhpcyk7XHRcbiAgXHR9KTtcblx0XG5cdFx0dGhpcy5yaWNoTWFya2VyXy5vbignbW91c2VvdmVyJywgKGV2KSA9PlxuXHRcdHtcblx0XHRcdGlmICh0aGlzLmlzQW5pbWF0aW5nXykgeyByZXR1cm47IH1cblx0XHRcdC8vaWYgKCF0aGlzLmlzTmVhcmx5SGlkZGVuXykgLy8gZm9yIGNvbnN0ZWxsYXRpb24gbW9kZSAhXG5cdFx0XHRcdHRoaXMuc2hvd0JpZ1NpemUoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMucmljaE1hcmtlcl8ub24oJ21vdXNlb3V0JywgKGV2KSA9PlxuXHRcdHtcblx0XHRcdGlmICh0aGlzLmlzQW5pbWF0aW5nXykgeyByZXR1cm47IH1cdFx0XHRcblx0XHRcdHRoaXMuc2hvd05vcm1hbFNpemUoKTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pXG5cdFx0Ly8ge1xuXHRcdC8vIFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIodGhpcy5yaWNoTWFya2VyXywgJ3Zpc2libGVfY2hhbmdlZCcsICgpID0+IFxuXHRcdC8vIFx0eyBcblx0XHQvLyBcdFx0dGhpcy5jaGVja1BvbHlsaW5lVmlzaWJpbGl0eV8odGhpcyk7IFxuXHRcdC8vIFx0fSk7XG5cdFx0Ly8gfVxuXG5cdFx0dGhpcy5pc0hhbGZIaWRkZW5fID0gZmFsc2U7XHRcdFx0XG5cblxuXHRcdC8vdGhpcy51cGRhdGUoKTtcdFxuXHRcdHRoaXMucmljaE1hcmtlcl8uc2V0SWNvbihMLmRpdkljb24oe2NsYXNzTmFtZTogJ2xlYWZsZXQtbWFya2VyLWNvbnRhaW5lcicsIGh0bWw6IFwiPHNwYW4gaWQ9XFxcIm1hcmtlci1cIisgdGhpcy5pZF8gKyBcIlxcXCI+PC9zcGFuPlwifSkpO1xuXHR9O1x0XG5cblx0aXNEaXNwbGF5ZWRPbkVsZW1lbnRJbmZvQmFyKClcblx0e1xuXHRcdHJldHVybiBBcHAuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkgPT0gdGhpcy5pZF87XG5cdH1cblxuXHRkb21NYXJrZXIoKVxuXHR7XG5cdFx0cmV0dXJuICQoJyNtYXJrZXItJysgdGhpcy5pZF8pO1xuXHR9XG5cblx0YW5pbWF0ZURyb3AoKSBcblx0e1xuXHRcdHRoaXMuaXNBbmltYXRpbmdfID0gdHJ1ZTtcblx0XHR0aGlzLmRvbU1hcmtlcigpLmFuaW1hdGUoe3RvcDogJy09MjVweCd9LCAzMDAsICdlYXNlSW5PdXRDdWJpYycpO1xuXHRcdHRoaXMuZG9tTWFya2VyKCkuYW5pbWF0ZSh7dG9wOiAnKz0yNXB4J30sIDI1MCwgJ2Vhc2VJbk91dEN1YmljJywgXG5cdFx0XHQoKSA9PiB7dGhpcy5pc0FuaW1hdGluZ18gPSBmYWxzZTt9ICk7XG5cdH07XG5cblx0dXBkYXRlKCkgXG5cdHtcdFx0XG5cdFx0bGV0IGVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnQoKTtcblxuXHRcdGxldCBkaXNhYmxlTWFya2VyID0gZmFsc2U7XG5cdFx0bGV0IHNob3dNb3JlSWNvbiA9IHRydWU7XG5cblx0XHRpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKVxuXHRcdHtcblx0XHRcdC8vIFBPTFlMSU5FIFRZUEVcblx0XHRcdGxldCBsaW5lVHlwZTtcblxuXHRcdFx0aWYgKGVsZW1lbnQuc3RhckNob2ljZUZvclJlcHJlc2VudGF0aW9uID09PSAnJylcblx0XHRcdHtcblx0XHRcdFx0bGluZVR5cGUgPSBBcHBTdGF0ZXMuTm9ybWFsO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XHRcdFx0XG5cdFx0XHRcdGxpbmVUeXBlID0gZWxlbWVudC5pc0N1cnJlbnRTdGFyQ2hvaWNlUmVwcmVzZW50YW50KCkgPyBBcHBTdGF0ZXMuTm9ybWFsIDogJ2Rhc2hlZCc7XG5cdFx0XHRcdC8vIGVuIG1vZGUgU0NSLCB0b3V0IGxlc21hcmtlcnMgc29udCBkaXNhYmxlZCBzYXVmIGxlIHJlcHLDqXNlbnRhbnQgZGUgbCfDqXRvaWxlXG5cdFx0XHRcdGRpc2FibGVNYXJrZXIgPSAhZWxlbWVudC5pc0N1cnJlbnRTdGFyQ2hvaWNlUmVwcmVzZW50YW50KCk7XG5cdFx0XHR9XHRcdFxuXG5cdFx0XHR0aGlzLnVwZGF0ZVBvbHlsaW5lKHtsaW5lVHlwZTogbGluZVR5cGV9KTtcblx0XHR9XG5cblx0XHRsZXQgb3B0aW9uc3RvRGlzcGxheSA9IGVsZW1lbnQuZ2V0SWNvbnNUb0Rpc3BsYXkoKTtcblxuXHRcdC8vIElmIHVzZWNvbG9yIGFuZCB1c2VJY29uLCB3ZSBkb24ndCBzaG93IG90aGVycyBpY29uc1xuXHRcdC8vIGlmIChvcHRpb25zdG9EaXNwbGF5WzBdKVxuXHRcdC8vIFx0c2hvd01vcmVJY29uID0gIW9wdGlvbnN0b0Rpc3BsYXlbMF0udXNlQ29sb3JGb3JNYXJrZXIgfHwgIW9wdGlvbnN0b0Rpc3BsYXlbMF0udXNlSWNvbkZvck1hcmtlcjtcblxuXHRcdGxldCBodG1sTWFya2VyID0gVHdpZy5yZW5kZXIoYmlvcGVuX3R3aWdKc19tYXJrZXIsIFxuXHRcdHtcblx0XHRcdGVsZW1lbnQgOiBlbGVtZW50LCBcblx0XHRcdG1haW5PcHRpb25WYWx1ZVRvRGlzcGxheTogb3B0aW9uc3RvRGlzcGxheVswXSxcblx0XHRcdG90aGVyT3B0aW9uc1ZhbHVlc1RvRGlzcGxheTogb3B0aW9uc3RvRGlzcGxheS5zbGljZSgxKSwgXG5cdFx0XHRzaG93TW9yZUljb24gOiBzaG93TW9yZUljb24sXG5cdFx0XHRkaXNhYmxlTWFya2VyIDogZGlzYWJsZU1hcmtlcixcblx0XHRcdHBlbmRpbmdDbGFzcyA6IGVsZW1lbnQuaXNQZW5kaW5nKCkgPyAncGVuZGluZycgOiAnJ1xuXHRcdH0pO1xuXG4gIFx0dGhpcy5yaWNoTWFya2VyXy5zZXRJY29uKEwuZGl2SWNvbih7Y2xhc3NOYW1lOiAnbGVhZmxldC1tYXJrZXItY29udGFpbmVyJywgaHRtbDogaHRtbE1hcmtlcn0pKTtcdFxuXG4gIFx0aWYgKHRoaXMuaXNEaXNwbGF5ZWRPbkVsZW1lbnRJbmZvQmFyKCkpIHRoaXMuc2hvd0JpZ1NpemUoKTtcblxuICBcdGlmICh0aGlzLmluY2xpbmF0aW9uXyA9PSBcInJpZ2h0XCIpIHRoaXMuaW5jbGluYXRlUmlnaHQoKTtcbiAgXHRpZiAodGhpcy5pbmNsaW5hdGlvbl8gPT0gXCJsZWZ0XCIpIHRoaXMuaW5jbGluYXRlTGVmdCgpO1xuXHR9O1xuXG5cdGFkZENsYXNzVG9SaWNoTWFya2VyXyAoY2xhc3NUb0FkZCkgXG5cdHtcdFx0XG5cdFx0dGhpcy5kb21NYXJrZXIoKS5hZGRDbGFzcyhjbGFzc1RvQWRkKTtcblx0XHR0aGlzLmRvbU1hcmtlcigpLnNpYmxpbmdzKCcubWFya2VyLW5hbWUnKS5hZGRDbGFzcyhjbGFzc1RvQWRkKTsgXG5cdH07XG5cblx0cmVtb3ZlQ2xhc3NUb1JpY2hNYXJrZXJfIChjbGFzc1RvUmVtb3ZlKSBcblx0e1x0XHRcblx0XHR0aGlzLmRvbU1hcmtlcigpLnJlbW92ZUNsYXNzKGNsYXNzVG9SZW1vdmUpO1xuXHRcdHRoaXMuZG9tTWFya2VyKCkuc2libGluZ3MoJy5tYXJrZXItbmFtZScpLnJlbW92ZUNsYXNzKGNsYXNzVG9SZW1vdmUpOyAgICAgIFxuXHR9O1xuXG5cdHNob3dCaWdTaXplICgpIFxuXHR7XHRcdFx0XG5cdFx0dGhpcy5hZGRDbGFzc1RvUmljaE1hcmtlcl8oXCJCaWdTaXplXCIpO1xuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5wYXJlbnQoKS5maW5kKCcubWFya2VyLW5hbWUnKS5zaG93KCk7XG5cdFx0ZG9tTWFya2VyLmZpbmQoJy5tb3JlSWNvbkNvbnRhaW5lcicpLnNob3coKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLmljb24tcGx1cy1jaXJjbGUnKS5oaWRlKCk7XG5cdFx0XG5cdFx0aWYgKCF0aGlzLmlzSGFsZkhpZGRlbl8gJiYgdGhpcy5wb2x5bGluZV8pXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRQb2x5bGluZU9wdGlvbnMoe1xuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiAxLFxuXHRcdFx0XHRzdHJva2VXZWlnaHQ6IDNcblx0XHRcdH0pO1xuXHRcdH1cdFxuXHR9O1xuXG5cdHNob3dOb3JtYWxTaXplICgkZm9yY2UgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7XHRcblx0XHRpZiAoISRmb3JjZSAmJiB0aGlzLmlzRGlzcGxheWVkT25FbGVtZW50SW5mb0JhcigpKSByZXR1cm47XG5cblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHR0aGlzLnJlbW92ZUNsYXNzVG9SaWNoTWFya2VyXyhcIkJpZ1NpemVcIik7XG5cdFx0ZG9tTWFya2VyLnBhcmVudCgpLmZpbmQoJy5tYXJrZXItbmFtZScpLmhpZGUoKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLm1vcmVJY29uQ29udGFpbmVyJykuaGlkZSgpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcuaWNvbi1wbHVzLWNpcmNsZScpLnNob3coKTtcblx0XHRcblx0XHRpZiAoIXRoaXMuaXNIYWxmSGlkZGVuXyAmJiB0aGlzLnBvbHlsaW5lXylcblx0XHR7XG5cdFx0XHR0aGlzLnNldFBvbHlsaW5lT3B0aW9ucyh7XG5cdFx0XHRcdHN0cm9rZU9wYWNpdHk6IDAuNSxcblx0XHRcdFx0c3Ryb2tlV2VpZ2h0OiAzXG5cdFx0XHR9KTtcblx0XHR9XHRcblx0fTtcblxuXHRpbml0aWFsaXplSW5jbGluYXRpb24gKCkgXG5cdHtcdFxuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5jc3MoXCJ6LWluZGV4XCIsXCIxXCIpO1xuXHRcdGRvbU1hcmtlci5maW5kKFwiLnJvdGF0ZVwiKS5yZW1vdmVDbGFzcyhcInJvdGF0ZUxlZnRcIikucmVtb3ZlQ2xhc3MoXCJyb3RhdGVSaWdodFwiKTtcblx0XHRkb21NYXJrZXIucmVtb3ZlQ2xhc3MoXCJyb3RhdGVMZWZ0XCIpLnJlbW92ZUNsYXNzKFwicm90YXRlUmlnaHRcIik7XG5cdFx0dGhpcy5pbmNsaW5hdGlvbl8gPSBcIm5vcm1hbFwiO1xuXHR9O1xuXG5cdGluY2xpbmF0ZVJpZ2h0ICgpIFxuXHR7XHRcblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHRkb21NYXJrZXIuZmluZChcIi5yb3RhdGVcIikuYWRkQ2xhc3MoXCJyb3RhdGVSaWdodFwiKTtcblx0ICAgZG9tTWFya2VyLmFkZENsYXNzKFwicm90YXRlUmlnaHRcIik7XG5cdCAgIHRoaXMuaW5jbGluYXRpb25fID0gXCJyaWdodFwiO1xuXHR9O1xuXG5cdGluY2xpbmF0ZUxlZnQgKCkgXG5cdHtcdFxuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5maW5kKFwiLnJvdGF0ZVwiKS5hZGRDbGFzcyhcInJvdGF0ZUxlZnRcIik7XG5cdCAgIGRvbU1hcmtlci5hZGRDbGFzcyhcInJvdGF0ZUxlZnRcIik7XG5cdCAgIHRoaXMuaW5jbGluYXRpb25fID0gXCJsZWZ0XCI7XG5cdH07XG5cblxuXHRzZXRQb2x5bGluZU9wdGlvbnMgKG9wdGlvbnMpXG5cdHtcblx0XHRpZiAoIXRoaXMucG9seWxpbmVfLmlzRGFzaGVkKVxuXHRcdHtcblx0XHRcdHRoaXMucG9seWxpbmVfLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLnVwZGF0ZVBvbHlsaW5lKHtcblx0XHRcdFx0bGluZVR5cGUgOiAnZGFzaGVkJyAsIFxuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiBvcHRpb25zLnN0cm9rZU9wYWNpdHksXG5cdFx0XHRcdHN0cm9rZVdlaWdodDogb3B0aW9ucy5zdHJva2VXZWlnaHRcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0XHRcblx0dXBkYXRlUG9seWxpbmUgKG9wdGlvbnMpIFxuXHR7XG5cdFx0Ly8gaWYgKCF0aGlzLnBvbHlsaW5lXylcblx0XHQvLyB7XG5cdFx0Ly8gXHR0aGlzLnBvbHlsaW5lXyA9IGRyYXdMaW5lQmV0d2VlblBvaW50cyhBcHAuY29uc3RlbGxhdGlvbi5nZXRPcmlnaW4oKSwgdGhpcy5yaWNoTWFya2VyXy5nZXRQb3NpdGlvbigpLCB0aGlzLmdldEVsZW1lbnQoKS50eXBlLCBudWxsLCBvcHRpb25zKTtcblx0XHQvLyB9XG5cdFx0Ly8gZWxzZVxuXHRcdC8vIHtcdFx0XG5cdFx0Ly8gXHRsZXQgbWFwID0gdGhpcy5wb2x5bGluZV8uZ2V0TWFwKCk7XG5cdFx0Ly8gXHR0aGlzLnBvbHlsaW5lXy5zZXRNYXAobnVsbCk7XG5cdFx0Ly8gXHR0aGlzLnBvbHlsaW5lXyA9IGRyYXdMaW5lQmV0d2VlblBvaW50cyhBcHAuY29uc3RlbGxhdGlvbi5nZXRPcmlnaW4oKSwgdGhpcy5yaWNoTWFya2VyXy5nZXRQb3NpdGlvbigpLCB0aGlzLmdldEVsZW1lbnQoKS50eXBlLCBtYXAsIG9wdGlvbnMpO1x0XG5cdFx0Ly8gfVxuXHR9O1xuXG5cdHNob3dIYWxmSGlkZGVuICgkZm9yY2UgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7XHRcdFxuXHRcdGlmICghJGZvcmNlICYmIHRoaXMuaXNEaXNwbGF5ZWRPbkVsZW1lbnRJbmZvQmFyKCkpIHJldHVybjtcblxuXHRcdHRoaXMuYWRkQ2xhc3NUb1JpY2hNYXJrZXJfKFwiaGFsZkhpZGRlblwiKTtcblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHRkb21NYXJrZXIuY3NzKCd6LWluZGV4JywnMScpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcuaWNvbi1wbHVzLWNpcmNsZScpLmFkZENsYXNzKFwiaGFsZkhpZGRlblwiKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLm1vcmVJY29uQ29udGFpbmVyJykuYWRkQ2xhc3MoXCJoYWxmSGlkZGVuXCIpO1xuXHRcdGlmICh0aGlzLnBvbHlsaW5lXykgdGhpcy5zZXRQb2x5bGluZU9wdGlvbnMoe1xuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiAwLjEsXG5cdFx0XHRcdHN0cm9rZVdlaWdodDogMlxuXHRcdH0pO1xuXG5cdFx0dGhpcy5pc0hhbGZIaWRkZW5fID0gdHJ1ZTtcblx0fTtcblxuXHRzaG93Tm9ybWFsSGlkZGVuICgpIFxuXHR7XHRcdFxuXHRcdHRoaXMucmVtb3ZlQ2xhc3NUb1JpY2hNYXJrZXJfKFwiaGFsZkhpZGRlblwiKTtcblx0XHRsZXQgZG9tTWFya2VyID0gdGhpcy5kb21NYXJrZXIoKTtcblx0XHRkb21NYXJrZXIuY3NzKCd6LWluZGV4JywnMTAnKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLmljb24tcGx1cy1jaXJjbGUnKS5yZW1vdmVDbGFzcyhcImhhbGZIaWRkZW5cIik7XG5cdFx0ZG9tTWFya2VyLmZpbmQoJy5tb3JlSWNvbkNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKFwiaGFsZkhpZGRlblwiKTtcblx0XHRcblx0XHRpZiAodGhpcy5wb2x5bGluZV8pIHRoaXMuc2V0UG9seWxpbmVPcHRpb25zKHtcblx0XHRcdFx0c3Ryb2tlT3BhY2l0eTogMC43LFxuXHRcdFx0XHRzdHJva2VXZWlnaHQ6IDNcblx0XHR9KTtcblxuXHRcdHRoaXMuaXNIYWxmSGlkZGVuXyA9IGZhbHNlO1xuXHR9O1xuXG5cdGdldElkICgpIDogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWRfOyB9O1xuXG5cdGdldExlYWZsZXRNYXJrZXIgKCkgOiBMLk1hcmtlciB7IHJldHVybiB0aGlzLnJpY2hNYXJrZXJfOyB9O1xuXG5cdGlzSGFsZkhpZGRlbigpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzSGFsZkhpZGRlbl87IH1cblxuXHRnZXRFbGVtZW50ICgpIDogRWxlbWVudCB7IHJldHVybiBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZCh0aGlzLmlkXyk7IH07XG5cblx0Y2hlY2tQb2x5bGluZVZpc2liaWxpdHlfIChjb250ZXh0KSBcblx0e1x0XHRcblx0XHRpZiAoY29udGV4dC5yaWNoTWFya2VyXyA9PT0gbnVsbCkgcmV0dXJuO1xuXHRcdC8vd2luZG93LmNvbnNvbGUubG9nKFwiY2hlY2tQb2x5bGluZVZpc2liaWxpdHlfIFwiICsgY29udGV4dC5yaWNoTWFya2VyXy5nZXRWaXNpYmxlKCkpO1xuXHRcdGNvbnRleHQucG9seWxpbmVfLnNldFZpc2libGUoY29udGV4dC5yaWNoTWFya2VyXy5nZXRWaXNpYmxlKCkpO1x0XG5cdFx0Y29udGV4dC5wb2x5bGluZV8uc2V0TWFwKGNvbnRleHQucmljaE1hcmtlcl8uZ2V0TWFwKCkpO1x0XG5cblx0XHRpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucykgXG5cdFx0e1xuXHRcdFx0Y29udGV4dC5wb2x5bGluZV8uc2V0TWFwKG51bGwpO1x0XG5cdFx0XHRjb250ZXh0LnBvbHlsaW5lXy5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHR9XHRcblx0fTtcblxuXHRzaG93ICgpIFxuXHR7XHRcblx0XHQvL0FwcC5tYXBDb21wb25lbnQuYWRkTWFya2VyKHRoaXMucmljaE1hcmtlcl8pO1xuXHRcdC8vdGhpcy5yaWNoTWFya2VyXy5hZGRUbyhBcHAubWFwKCkpO1xuXHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIHRoaXMucG9seWxpbmVfLnNldE1hcChBcHAubWFwKCkpO1xuXHR9O1xuXG5cdGhpZGUgKCkgXG5cdHtcdFx0XHRcblx0XHQvL0FwcC5tYXBDb21wb25lbnQucmVtb3ZlTWFya2VyKHRoaXMucmljaE1hcmtlcl8pO1xuXHRcdC8vdGhpcy5yaWNoTWFya2VyXy5yZW1vdmUoKTtcblx0XHRpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSB0aGlzLnBvbHlsaW5lXy5zZXRNYXAobnVsbCk7XG5cdH07XG5cblx0c2V0VmlzaWJsZSAoYm9vbCA6IGJvb2xlYW4pIFxuXHR7XHRcblx0XHQvL3RoaXMucmljaE1hcmtlcl8uc2V0VmlzaWJsZShib29sKTtcblx0XHRpZiAoYm9vbCkgdGhpcy5zaG93KCk7XG5cdFx0ZWxzZSB0aGlzLmhpZGUoKTtcblx0fTtcblxuXHRnZXRQb3NpdGlvbiAoKSA6IEwuTGF0TG5nXG5cdHtcdFxuXHRcdHJldHVybiB0aGlzLnJpY2hNYXJrZXJfLmdldExhdExuZygpO1xuXHR9O1xufVxuXG4iLCJcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uLy4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZXZlbnRcIjtcbmltcG9ydCB7IGluaXRBdXRvQ29tcGxldGlvbkZvckVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vLi4vY29tbW9ucy9zZWFyY2gtYmFyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgaW5pdENsdXN0ZXIgfSBmcm9tIFwiLi9jbHVzdGVyL2luaXQtY2x1c3RlclwiO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgc2x1Z2lmeSB9IGZyb20gXCIuLi8uLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IEdlb2NvZGVSZXN1bHQsIFJhd0JvdW5kcyB9IGZyb20gXCIuLi8uLi9tb2R1bGVzL2dlb2NvZGVyLm1vZHVsZVwiO1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJsZWFmbGV0XCIgLz5cblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSB2YXIgJCwgTCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIFZpZXdQb3J0XG57XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBsYXQgOiBudW1iZXIgPSAwLCBcblx0XHRcdFx0XHRwdWJsaWMgbG5nIDpudW1iZXIgPSAwLCBcblx0XHRcdFx0XHRwdWJsaWMgem9vbSA6IG51bWJlciA9IDApXG5cdHtcblx0XHR0aGlzLmxhdCA9IGxhdCB8fCAwO1xuXHRcdHRoaXMubG5nID0gbG5nIHx8IDA7XG5cdFx0dGhpcy56b29tID0gem9vbSB8fCAwO1xuXHR9XG5cblx0dG9TdHJpbmcoKVxuXHR7XG5cdFx0bGV0IGRpZ2l0cyA9IHRoaXMuem9vbSA+IDE0ID8gNCA6IDI7XG5cdFx0cmV0dXJuIGBAJHt0aGlzLmxhdC50b0ZpeGVkKGRpZ2l0cyl9LCR7dGhpcy5sbmcudG9GaXhlZChkaWdpdHMpfSwke3RoaXMuem9vbX16YDtcblx0fVxuXG5cdGZyb21TdHJpbmcoc3RyaW5nIDogc3RyaW5nKVxuXHR7XG5cdFx0aWYgKCFzdHJpbmcpIHJldHVybiBudWxsO1xuXG5cdFx0bGV0IGRlY29kZSA9IHN0cmluZy5zcGxpdCgnQCcpLnBvcCgpLnNwbGl0KCcsJyk7XG5cdFx0aWYgKGRlY29kZS5sZW5ndGggIT0gMykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJWaWV3UG9ydCBmcm9tU3RyaW5nIGVycmV1clwiLCBzdHJpbmcpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdHRoaXMubGF0ID0gcGFyc2VGbG9hdChkZWNvZGVbMF0pO1xuXHRcdHRoaXMubG5nID0gcGFyc2VGbG9hdChkZWNvZGVbMV0pO1xuXHRcdHRoaXMuem9vbSA9IHBhcnNlSW50KGRlY29kZVsyXS5zbGljZSgwLC0xKSk7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiVmlld1BvcnQgZnJvbVN0cmluZyBEb25lXCIsIHRoaXMpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuXG4vKipcbiogVGhlIE1hcCBDb21wb25lbnQgd2hvIGVuY2Fwc3VsYXRlIHRoZSBtYXBcbipcbiogTWFwQ29tcG9uZW50IHB1YmxpY3MgbWV0aG9kcyBtdXN0IGJlIGFzIGluZGVwZW5kYW50IGFzIHBvc3NpYmxlXG4qIGZyb20gdGVjaG5vbG9neSB1c2VkIGZvciB0aGUgbWFwIChnb29nbGUsIGxlYWZsZXQgLi4uKVxuKlxuKiBNYXAgY29tcG9uZW50IGlzIGxpa2UgYW4gaW50ZXJmYWNlIGJldHdlZW4gdGhlIG1hcCBhbmQgdGhlIHJlc3Qgb2YgdGhlIEFwcFxuKi9cbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnRcbntcblx0b25NYXBSZWFkeSA9IG5ldyBFdmVudDxhbnk+KCk7XG5cdG9uTWFwTG9hZGVkID0gbmV3IEV2ZW50PGFueT4oKTtcblx0b25DbGljayA9IG5ldyBFdmVudDxhbnk+KCk7XG5cdG9uSWRsZSA9IG5ldyBFdmVudDxhbnk+KCk7XG5cblx0Ly9MZWFmbGV0IG1hcFxuXHRtYXBfIDogTC5NYXAgPSBudWxsO1xuXG5cdG1hcmtlckNsdXN0ZXJlckdyb3VwO1xuXHRpc0luaXRpYWxpemVkIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRpc01hcExvYWRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcblx0b2xkWm9vbSA9IC0xO1xuXHR2aWV3cG9ydCA6IFZpZXdQb3J0ID0gbnVsbDtcblxuXHRnZXRNYXAoKXsgcmV0dXJuIHRoaXMubWFwXzsgfTsgXG5cdGdldENlbnRlcigpIDogTC5MYXRMbmcgeyByZXR1cm4gdGhpcy52aWV3cG9ydCA/IEwubGF0TG5nKHRoaXMudmlld3BvcnQubGF0LCB0aGlzLnZpZXdwb3J0LmxuZykgOiBudWxsOyB9XG5cdGdldEJvdW5kcygpIDogTC5MYXRMbmdCb3VuZHMgeyByZXR1cm4gdGhpcy5pc01hcExvYWRlZCA/IHRoaXMubWFwXy5nZXRCb3VuZHMoKSA6IG51bGw7IH1cblx0Z2V0Wm9vbSgpIHsgcmV0dXJuIHRoaXMubWFwXy5nZXRab29tKCk7IH1cblx0Z2V0T2xkWm9vbSgpIHsgcmV0dXJuIHRoaXMub2xkWm9vbTsgfVxuXG5cdGluaXQoKSBcblx0e1x0XG5cdFx0Ly9pbml0QXV0b0NvbXBsZXRpb25Gb3JFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtYmFyJykpO1xuXHRcdGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIFxuXHRcdHtcblx0XHRcdHRoaXMucmVzaXplKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5tYXBfID0gTC5tYXAoJ2RpcmVjdG9yeS1jb250ZW50LW1hcCcsIHtcblx0XHQgICAgem9vbUNvbnRyb2w6IGZhbHNlXG5cdFx0fSk7XG5cblx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlckdyb3VwID0gTC5tYXJrZXJDbHVzdGVyR3JvdXAoe1xuXHRcdCAgICBzcGlkZXJmeU9uTWF4Wm9vbTogdHJ1ZSxcblx0XHQgICAgc2hvd0NvdmVyYWdlT25Ib3ZlcjogZmFsc2UsXG5cdFx0ICAgIHpvb21Ub0JvdW5kc09uQ2xpY2s6IHRydWUsXG5cdFx0ICAgIHNwaWRlcmZ5T25Ib3ZlcjogdHJ1ZSxcblx0XHQgICAgc3BpZGVyZnlNYXhDb3VudDogNCxcblx0XHQgICAgc3BpZGVyZnlEaXN0YW5jZU11bHRpcGxpZXI6IDEuMSxcblx0XHQgICAgY2h1bmtlZExvYWRpbmc6IHRydWUsXG5cdFx0ICAgIG1heENsdXN0ZXJSYWRpdXM6ICh6b29tKSA9PlxuXHRcdCAgICB7XG5cdFx0ICAgIFx0aWYgKHpvb20gPiA3KSByZXR1cm4gNDA7XG5cdFx0ICAgIFx0ZWxzZSByZXR1cm4gMTAwO1xuXHRcdCAgICB9XG5cdFx0fSk7XG5cblx0XHR0aGlzLmFkZE1hcmtlckNsdXN0ZXJHcm91cCgpO1x0XHRcblxuXHRcdEwuY29udHJvbC56b29tKHtcblx0XHQgICBwb3NpdGlvbjondG9wcmlnaHQnXG5cdFx0fSkuYWRkVG8odGhpcy5tYXBfKTtcblxuXHRcdEwudGlsZUxheWVyKCdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS9tYXBib3gvc3RyZWV0cy12MTAvdGlsZXMvMjU2L3t6fS97eH0ve3l9P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWMyVmlZV3hzYjNRaUxDSmhJam9pWTJsNE1HdG5lR1ZqTURGMGFESjZjV050ZFdGdmMyWTNZU0o5Lm5JWnI2RzJ0MDhldE16ZnRfQkhIVVEnKS5hZGRUbyh0aGlzLm1hcF8pO1xuXG5cdFx0dGhpcy5tYXBfLm9uKCdjbGljaycsIChlKSA9PiB7IHRoaXMub25DbGljay5lbWl0KCk7IH0pO1xuXHRcdHRoaXMubWFwXy5vbignbW92ZWVuZCcsIChlKSA9PiBcblx0XHR7IFxuXHRcdFx0dGhpcy5vbGRab29tID0gdGhpcy5tYXBfLmdldFpvb20oKTtcblx0XHRcdHRoaXMudXBkYXRlVmlld1BvcnQoKTtcblx0XHRcdEFwcC5ib3VuZHNNb2R1bGUuZXh0ZW5kQm91bmRzKDAuMiwgdGhpcy5tYXBfLmdldEJvdW5kcygpKTtcblx0XHRcdHRoaXMub25JZGxlLmVtaXQoKTsgXG5cdFx0fSk7XG5cdFx0dGhpcy5tYXBfLm9uKCdsb2FkJywgKGUpID0+IHsgdGhpcy5pc01hcExvYWRlZCA9IHRydWU7IHRoaXMub25NYXBMb2FkZWQuZW1pdCgpOyB9KTtcblxuXHRcdHRoaXMucmVzaXplKCk7XG5cblx0XHQvLyBpZiB3ZSBiZWdhbiB3aXRoIExpc3QgTW9kZSwgd2hlbiB3ZSBpbml0aWFsaXplIG1hcFxuXHRcdC8vIHRoZXJlIGlzIGFscmVhZHkgYW4gYWRkcmVzcyBnZW9jb2RlZCBvciBhIHZpZXdwb3J0IGRlZmluZWRcblx0XHRpZiAoQXBwICYmIEFwcC5nZW9jb2Rlci5nZXRCb3VuZHMoKSlcblx0XHR7XG5cdFx0XHR0aGlzLmZpdEJvdW5kcyhBcHAuZ2VvY29kZXIuZ2V0Qm91bmRzKCksIGZhbHNlKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodGhpcy52aWV3cG9ydClcblx0XHR7XG5cdFx0XHQvLyBzZXRUaW1lb3V0IHdhaXRpbmcgZm9yIHRoZSBtYXAgdG8gYmUgcmVzaXplZFxuXHRcdFx0c2V0VGltZW91dCggKCkgPT4geyB0aGlzLnNldFZpZXdQb3J0KHRoaXMudmlld3BvcnQpOyB9LDIwMCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcblx0XHQvL2NvbnNvbGUubG9nKFwibWFwIGluaXQgZG9uZVwiKTtcblx0XHR0aGlzLm9uTWFwUmVhZHkuZW1pdCgpO1xuXHR9O1xuXG5cdGFkZE1hcmtlckNsdXN0ZXJHcm91cCgpIHsgdGhpcy5tYXBfLmFkZExheWVyKHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXApOyB9XG5cblx0cmVzaXplKClcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJSZXNpemUsIGN1cnIgdmlld3BvcnQgOlwiKTtcblx0XHQvLyBXYXJuaW5nICFJIGNoYW5nZWQgdGhlIGxlYWZsZXQuanMgZmlsZSBsaWJyYXJ5IG15c2VsZlxuXHRcdC8vIGJlY2F1c2UgdGhlIG9wdGlvbnMgZG9lc24ndCB3b3JrIHByb3Blcmx5XG5cdFx0Ly8gSSBjaGFuZ2VkIGl0IHRvIGF2b2kgcGFubmluZyB3aGVuIHJlc2l6aW5nIHRoZSBtYXBcblx0XHQvLyBiZSBjYXJlZnVsIGlmIHVwZGF0aW5nIHRoZSBsZWFmbGV0IGxpYnJhcnkgdGhpcyB3aWxsXG5cdFx0Ly8gbm90IHdvcmsgYW55bW9yZVxuXHRcdGlmICh0aGlzLm1hcF8pIHRoaXMubWFwXy5pbnZhbGlkYXRlU2l6ZShmYWxzZSk7XG5cblx0fVxuXG5cdGFkZE1hcmtlcihtYXJrZXIgOiBMLk1hcmtlcilcblx0e1xuXHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXAuYWRkTGF5ZXIobWFya2VyKTtcblx0fVxuXG5cdGFkZE1hcmtlcnMobWFya2VycyA6IEwuTWFya2VyW10pXG5cdHtcblx0XHRpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cCkgdGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cC5hZGRMYXllcnMobWFya2Vycyk7XG5cdH1cblxuXHRyZW1vdmVNYXJrZXIobWFya2VyIDogTC5NYXJrZXIpXG5cdHtcblx0XHR0aGlzLm1hcmtlckNsdXN0ZXJlckdyb3VwLnJlbW92ZUxheWVyKG1hcmtlcik7XG5cdH1cblxuXHRyZW1vdmVNYXJrZXJzKG1hcmtlcnMgOiBMLk1hcmtlcltdKVxuXHR7XG5cdFx0aWYgKHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXApIHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXAucmVtb3ZlTGF5ZXJzKG1hcmtlcnMpO1xuXHR9XG5cblx0Ly8gZml0IG1hcCB2aWV3IHRvIGJvdW5kc1xuXHRmaXRCb3VuZHMoYm91bmRzIDogTC5MYXRMbmdCb3VuZHMsIGFuaW1hdGUgOiBib29sZWFuID0gdHJ1ZSlcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJmaXRib3VuZHNcIiwgYm91bmRzKTtcblx0XHRcblx0XHRpZiAodGhpcy5pc01hcExvYWRlZCAmJiBhbmltYXRlKSBBcHAubWFwKCkuZmx5VG9Cb3VuZHMoYm91bmRzKTtcblx0XHRlbHNlIEFwcC5tYXAoKS5maXRCb3VuZHMoYm91bmRzKTtcblx0fVx0XHRcblxuXHRwYW5Ub0xvY2F0aW9uKGxvY2F0aW9uIDogTC5MYXRMbmcsIHpvb20/LCBhbmltYXRlIDogYm9vbGVhbiA9IHRydWUpXG5cdHtcblx0XHR6b29tID0gem9vbSB8fCB0aGlzLmdldFpvb20oKSB8fCAxMjtcblx0XHRjb25zb2xlLmxvZyhcInBhblRvbG9jYXRpb25cIiwgbG9jYXRpb24pO1xuXG5cdFx0aWYgKHRoaXMuaXNNYXBMb2FkZWQgJiYgYW5pbWF0ZSkgdGhpcy5tYXBfLmZseVRvKGxvY2F0aW9uLCB6b29tKTtcblx0XHRlbHNlIHRoaXMubWFwXy5zZXRWaWV3KGxvY2F0aW9uLCB6b29tKTtcblx0fTtcblxuXHQvLyB0aGUgYWN0dWFsIGRpc3BsYXllZCBtYXAgcmFkaXVzIChkaXN0YW5jZSBmcm9tIGNyb25lciB0byBjZW50ZXIpXG5cdG1hcFJhZGl1c0luS20oKSA6IG51bWJlclxuXHR7XG5cdFx0aWYgKCF0aGlzLmlzTWFwTG9hZGVkKSByZXR1cm4gMDtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLm1hcF8uZ2V0Qm91bmRzKCkuZ2V0Tm9ydGhFYXN0KCkuZGlzdGFuY2VUbyh0aGlzLm1hcF8uZ2V0Q2VudGVyKCkpIC8gMTAwMCk7XG5cdH1cblxuXHQvLyBkaXN0YW5jZSBmcm9tIGxhc3Qgc2F2ZWQgbG9jYXRpb24gdG8gYSBwb3NpdGlvblxuXHRkaXN0YW5jZUZyb21Mb2NhdGlvblRvKHBvc2l0aW9uIDogTC5MYXRMbmcpXG5cdHtcblx0XHRpZiAoIUFwcC5nZW9jb2Rlci5nZXRMb2NhdGlvbigpKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkuZGlzdGFuY2VUbyhwb3NpdGlvbikgLyAxMDAwO1xuXHR9XG5cblx0Y29udGFpbnMocG9zaXRpb24gOiBMLkxhdExuZ0V4cHJlc3Npb24pIDogYm9vbGVhblxuXHR7XG5cdFx0aWYgKHBvc2l0aW9uKVxuXHRcdHtcblx0XHRcdCByZXR1cm4gdGhpcy5tYXBfLmdldEJvdW5kcygpLmNvbnRhaW5zKHBvc2l0aW9uKTtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coXCJNYXBDb21wb25lbnQtPmNvbnRhaW5zIDogbWFwIG5vdCBsb2FkZWQgb3IgZWxlbWVudCBwb3NpdGlvbiB1bmRlZmluZWRcIik7XG5cdFx0cmV0dXJuIGZhbHNlO1x0XHRcblx0fVxuXG5cdGV4dGVuZGVkQ29udGFpbnMocG9zaXRpb24gOiBMLkxhdExuZ0V4cHJlc3Npb24pIDogYm9vbGVhblxuXHR7XG5cdFx0aWYgKHRoaXMuaXNNYXBMb2FkZWQgJiYgcG9zaXRpb24pXG5cdFx0e1xuXHRcdFx0IHJldHVybiBBcHAuYm91bmRzTW9kdWxlLmV4dGVuZGVkQm91bmRzLmNvbnRhaW5zKHBvc2l0aW9uKTtcblx0XHR9XG5cdFx0Ly9jb25zb2xlLmxvZyhcIk1hcENvbXBvbmVudC0+Y29udGFpbnMgOiBtYXAgbm90IGxvYWRlZCBvciBlbGVtZW50IHBvc2l0aW9uIHVuZGVmaW5lZFwiKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR1cGRhdGVWaWV3UG9ydCgpXG5cdHtcblx0XHRpZiAoIXRoaXMudmlld3BvcnQpIHRoaXMudmlld3BvcnQgPSBuZXcgVmlld1BvcnQoKTtcblx0XHR0aGlzLnZpZXdwb3J0LmxhdCA9ICB0aGlzLm1hcF8uZ2V0Q2VudGVyKCkubGF0O1xuXHRcdHRoaXMudmlld3BvcnQubG5nID0gIHRoaXMubWFwXy5nZXRDZW50ZXIoKS5sbmc7XG5cdFx0dGhpcy52aWV3cG9ydC56b29tID0gdGhpcy5nZXRab29tKCk7XG5cdH1cdFxuXG5cdHNldFZpZXdQb3J0KCR2aWV3cG9ydCA6IFZpZXdQb3J0LCAkcGFuTWFwVG9WaWV3cG9ydCA6IGJvb2xlYW4gPSB0cnVlKVxuXHR7XHRcdFxuXHRcdGlmICh0aGlzLm1hcF8gJiYgJHZpZXdwb3J0ICYmICRwYW5NYXBUb1ZpZXdwb3J0KVxuXHRcdHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJzZXRWaWV3UG9ydFwiLCAkdmlld3BvcnQpO1xuXHRcdFx0bGV0IHRpbWVvdXQgPSBBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUgPyA1MDAgOiAwO1xuXHRcdFx0c2V0VGltZW91dCggKCkgPT4geyB0aGlzLm1hcF8uc2V0VmlldyhMLmxhdExuZygkdmlld3BvcnQubGF0LCAkdmlld3BvcnQubG5nKSwgJHZpZXdwb3J0Lnpvb20pIH0sIHRpbWVvdXQpO1xuXHRcdH1cblx0XHR0aGlzLnZpZXdwb3J0ID0gJHZpZXdwb3J0O1xuXHR9XG5cblx0aGlkZVBhcnRpYWxseUNsdXN0ZXJzKClcblx0e1xuXHRcdCQoJy5tYXJrZXItY2x1c3RlcicpLmFkZENsYXNzKCdoYWxmSGlkZGVuJyk7XG5cdH1cblxuXHRzaG93Tm9ybWFsSGlkZGVuQ2x1c3RlcnMoKVxuXHR7XG5cdFx0JCgnLm1hcmtlci1jbHVzdGVyJykucmVtb3ZlQ2xhc3MoJ2hhbGZIaWRkZW4nKTtcblx0fVxufVxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuZGVjbGFyZSBsZXQgZ3JlY2FwdGNoYTtcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5kZWNsYXJlIGxldCBSb3V0aW5nIDogYW55O1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duLCBnZXRDdXJyZW50RWxlbWVudEluZm9CYXJTaG93biB9IGZyb20gXCIuL2VsZW1lbnQtbWVudS5jb21wb25lbnRcIjtcbmltcG9ydCB7IEFqYXhNb2R1bGUgfSBmcm9tIFwiLi4vbW9kdWxlcy9hamF4Lm1vZHVsZVwiO1xuaW1wb3J0IHsgdXBkYXRlSW5mb0JhclNpemUgfSBmcm9tIFwiLi4vYXBwLWludGVyYWN0aW9uc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmltcG9ydCB7IGNhcGl0YWxpemUsIHNsdWdpZnkgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplVm90aW5nKClcbntcdFxuXHQvL2NvbnNvbGUubG9nKFwiaW5pdGlhbGl6ZSB2b3RlXCIpO1x0XG5cblx0JChcIi52YWxpZGF0aW9uLXByb2Nlc3MtaW5mb1wiKS5jbGljayggKGUpID0+IFxuXHR7XG5cdFx0JChcIiNwb3B1cC12b3RlXCIpLm9wZW5Nb2RhbCgpO1x0XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgXHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICBcdGUucHJldmVudERlZmF1bHQoKTtcblx0fSk7XHRcblxuXHQkKCcjbW9kYWwtdm90ZSAjc3VibWl0LXZvdGUnKS5jbGljaygoKSA9PiBcblx0e1xuXHRcdGxldCB2b3RlVmFsdWUgPSAkKCcudm90ZS1vcHRpb24tcmFkaW8tYnRuOmNoZWNrZWQnKS5hdHRyKCd2YWx1ZScpO1xuXG5cdFx0JCgnI21vZGFsLXZvdGUgI3NlbGVjdC1lcnJvcicpLmhpZGUoKTtcblx0XHRcblx0XHRpZiAodm90ZVZhbHVlKVxuXHRcdHtcdFx0XHRcblx0XHRcdGxldCBlbGVtZW50SWQgPSBnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKTtcdFxuXHRcdFx0bGV0IGNvbW1lbnQgPSAkKCcjbW9kYWwtdm90ZSAuaW5wdXQtY29tbWVudCcpLnZhbCgpO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhcInNlbmQgdm90ZSBcIiArdm90ZVZhbHVlICsgXCIgdG8gZWxlbWVudCBpZCBcIiwgZWxlbWVudElkKTtcblxuXHRcdFx0QXBwLmFqYXhNb2R1bGUudm90ZShlbGVtZW50SWQsIHZvdGVWYWx1ZSwgY29tbWVudCwgKHN1Y2Nlc3NNZXNzYWdlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIiwgc3VjY2Vzc01lc3NhZ2UpO1xuXHRcdFx0XHQkKCcjbW9kYWwtdm90ZScpLmNsb3NlTW9kYWwoKTtcblx0XHRcdFx0bGV0IGVsZW1lbnRJbmZvID0gZ2V0Q3VycmVudEVsZW1lbnRJbmZvQmFyU2hvd24oKTtcblx0XHRcdFx0ZWxlbWVudEluZm8uZmluZChcIi52b3RlLXNlY3Rpb25cIikuZmluZCgnLmJhc2ljLW1lc3NhZ2UnKS5oaWRlKCk7XHRcdFx0XHRcblx0XHRcdFx0ZWxlbWVudEluZm8uZmluZCgnLnJlc3VsdC1tZXNzYWdlJykudGV4dChzdWNjZXNzTWVzc2FnZSkuc2hvdygpO1xuXHRcdFx0XHR1cGRhdGVJbmZvQmFyU2l6ZSgpO1xuXG5cdFx0XHR9LFxuXHRcdFx0KGVycm9yTWVzc2FnZSkgPT4gXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3JcIiwgZXJyb3JNZXNzYWdlKTtcblx0XHRcdFx0JCgnI21vZGFsLXZvdGUgI3NlbGVjdC1lcnJvcicpLnRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XG5cdFx0XHR9KTtcdFx0XHRcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdCQoJyNtb2RhbC12b3RlICNzZWxlY3QtZXJyb3InKS5zaG93KCk7XG5cdFx0fVxuXG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGlzdGVuZXJzRm9yVm90aW5nKClcbntcblx0JChcIi52b3RlLWJ1dHRvblwiKS5jbGljayggZnVuY3Rpb24oZSlcblx0e1xuXHRcdGlmICgkKCcjYnRuLWxvZ2luJykuaXMoJzp2aXNpYmxlJykpIFxuXHRcdHtcblx0XHRcdCQoJyNwb3B1cC1sb2dpbicpLm9wZW5Nb2RhbCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cblx0XHRcdCQoJy52b3RlLW9wdGlvbi1yYWRpby1idG46Y2hlY2tlZCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG5cdFx0XHQkKCcjbW9kYWwtdm90ZSAuaW5wdXQtY29tbWVudCcpLnZhbChcIlwiKTtcblx0XHRcdCQoJyNtb2RhbC12b3RlICNzZWxlY3QtZXJyb3InKS5oaWRlKCk7XG5cdFx0XHQkKCcjbW9kYWwtdm90ZSAuZWxlbWVudE5hbWUnKS50ZXh0KGNhcGl0YWxpemUoZWxlbWVudC5uYW1lKSk7XG5cblx0XHRcdCQoJyNtb2RhbC12b3RlJykub3Blbk1vZGFsKHtcblx0XHQgICAgZGlzbWlzc2libGU6IHRydWUsIFxuXHRcdCAgICBvcGFjaXR5OiAwLjUsIFxuXHRcdCAgICBpbl9kdXJhdGlvbjogMzAwLCBcblx0XHQgICAgb3V0X2R1cmF0aW9uOiAyMDBcblx0XHRcdH0pO1x0XG5cdFx0fVx0XHRcdFxuXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICBcdGUucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG59XG5cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vdXRpbHMvZXZlbnRcIjtcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5kZWNsYXJlIGxldCBSb3V0aW5nO1xuXG5leHBvcnQgY2xhc3MgUmVxdWVzdFxue1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgcm91dGUgOiBzdHJpbmcsIHB1YmxpYyBkYXRhIDogYW55KVxuXHR7XG5cdH07XG59XG5cbmV4cG9ydCBjbGFzcyBEYXRhQXJvdW5kUmVxdWVzdFxue1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgb3JpZ2luTGF0IDogbnVtYmVyLCBwdWJsaWMgb3JpZ2luTG5nIDogbnVtYmVyLCBwdWJsaWMgZGlzdGFuY2UgOm51bWJlciwgcHVibGljIG1heFJlc3VsdHMgOiBudW1iZXIsIHB1YmxpYyBtYWluT3B0aW9uSWQgOiBudW1iZXIpXG5cdHtcblx0fTtcbn1cblxuZXhwb3J0IGNsYXNzIEFqYXhNb2R1bGVcbntcblx0b25OZXdFbGVtZW50cyA9IG5ldyBFdmVudDxhbnlbXT4oKTtcblxuXHRpc1JldHJpZXZpbmdFbGVtZW50cyA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRyZXF1ZXN0V2FpdGluZ1RvQmVFeGVjdXRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcblx0d2FpdGluZ1JlcXVlc3QgOiBSZXF1ZXN0ID0gbnVsbDtcblxuXHRjdXJyUmVxdWVzdCA6IFJlcXVlc3QgPSBudWxsO1xuXG5cdGxvYWRlclRpbWVyID0gbnVsbDtcblxuXHRhbGxFbGVtZW50c1JlY2VpdmVkID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3IoKSB7IH0gIFxuXG5cdGdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24oJGxvY2F0aW9uLCAkZGlzdGFuY2UsICRtYXhSZXN1bHRzID0gMClcblx0e1xuXHRcdC8vIGlmIGludmFsaWQgbG9jYXRpb24gd2UgYWJvcnRcblx0XHRpZiAoISRsb2NhdGlvbiB8fCAhJGxvY2F0aW9uLmxhdCkgXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJBamF4IGludmFsaWQgcmVxdWVzdFwiLCAkbG9jYXRpb24pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhUmVxdWVzdCA9IG5ldyBEYXRhQXJvdW5kUmVxdWVzdCgkbG9jYXRpb24ubGF0LCAkbG9jYXRpb24ubG5nLCAkZGlzdGFuY2UsICRtYXhSZXN1bHRzLCBBcHAuY3Vyck1haW5JZCk7XG5cdFx0bGV0IHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2FwaV9lbGVtZW50c19hcm91bmRfbG9jYXRpb24nKTtcdFxuXHRcdFxuXHRcdHRoaXMuc2VuZEFqYXhFbGVtZW50UmVxdWVzdChuZXcgUmVxdWVzdChyb3V0ZSwgZGF0YVJlcXVlc3QpKTtcblx0fVxuXG5cdGdldEVsZW1lbnRzSW5Cb3VuZHMoJGJvdW5kcyA6IEwuTGF0TG5nQm91bmRzW10pXG5cdHtcblx0XHQvLyBpZiBpbnZhbGlkIGxvY2F0aW9uIHdlIGFib3J0XG5cdFx0aWYgKCEkYm91bmRzIHx8ICRib3VuZHMubGVuZ3RoID09IDAgfHwgISRib3VuZHNbMF0pIFxuXHRcdHtcblx0XHRcdGNvbnNvbGUubG9nKFwiQWpheCBpbnZhbGlkIHJlcXVlc3RcIiwgJGJvdW5kcyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vY29uc29sZS5sb2coJGJvdW5kcyk7XG5cblx0XHRsZXQgc3RyaW5naWZpZWRCb3VuZHMgPSBcIlwiO1xuXG5cdFx0Zm9yIChsZXQgYm91bmQgb2YgJGJvdW5kcykgXG5cdFx0e1xuXHRcdFx0c3RyaW5naWZpZWRCb3VuZHMgKz0gYm91bmQudG9CQm94U3RyaW5nKCkgKyBcIjtcIjtcblx0XHR9XG5cblx0XHRsZXQgZGF0YVJlcXVlc3QgOiBhbnkgPSB7IGJvdW5kcyA6IHN0cmluZ2lmaWVkQm91bmRzLCBtYWluT3B0aW9uSWQgOiBBcHAuY3Vyck1haW5JZCB9O1xuXHRcdGxldCByb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9hcGlfZWxlbWVudHNfaW5fYm91bmRzJyk7XG5cdFx0XG5cdFx0dGhpcy5zZW5kQWpheEVsZW1lbnRSZXF1ZXN0KG5ldyBSZXF1ZXN0KHJvdXRlLCBkYXRhUmVxdWVzdCkpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZW5kQWpheEVsZW1lbnRSZXF1ZXN0KCRyZXF1ZXN0IDogUmVxdWVzdClcblx0e1xuXHRcdGlmICh0aGlzLmFsbEVsZW1lbnRzUmVjZWl2ZWQpIHsgY29uc29sZS5sb2coXCJBbGwgZWxlbWVudHMgYWxyZWFkeSByZWNlaXZlZFwiKTsgcmV0dXJuOyB9XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiQWpheCBzZW5kIGVsZW1lbnRzIHJlcXVlc3QgXCIsICRyZXF1ZXN0KTtcblxuXHRcdGlmICh0aGlzLmlzUmV0cmlldmluZ0VsZW1lbnRzKVxuXHRcdHtcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhcIkFqYXggaXNSZXRyaWV2aW5nXCIpO1xuXHRcdFx0dGhpcy5yZXF1ZXN0V2FpdGluZ1RvQmVFeGVjdXRlZCA9IHRydWU7XG5cdFx0XHR0aGlzLndhaXRpbmdSZXF1ZXN0ID0gJHJlcXVlc3Q7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuaXNSZXRyaWV2aW5nRWxlbWVudHMgPSB0cnVlO1xuXG5cdFx0dGhpcy5jdXJyUmVxdWVzdCA9ICRyZXF1ZXN0O1xuXG5cdFx0bGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHRcdFx0XG5cdFx0XG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogJHJlcXVlc3Qucm91dGUsXG5cdFx0XHRtZXRob2Q6IFwicG9zdFwiLFxuXHRcdFx0ZGF0YTogJHJlcXVlc3QuZGF0YSxcblx0XHRcdGJlZm9yZVNlbmQ6ICgpID0+XG5cdFx0XHR7IFx0XHRcdFx0XG5cdFx0XHRcdHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAkKCcjZGlyZWN0b3J5LWxvYWRpbmcnKS5zaG93KCk7IH0sIDE1MDApOyBcblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiByZXNwb25zZSA9PlxuXHRcdFx0e1x0XG5cdFx0XHRcdC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG5cdFx0XHRcdGlmIChyZXNwb25zZS5kYXRhICE9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1x0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInJlY2VpdmUgXCIgKyByZXNwb25zZS5kYXRhLmxlbmd0aCArIFwiIGVsZW1lbnRzIGluIFwiICsgKGVuZC1zdGFydCkgKyBcIiBtc1wiKTtcdFx0XHRcdFxuXG5cdFx0XHRcdFx0dGhpcy5vbk5ld0VsZW1lbnRzLmVtaXQocmVzcG9uc2UuZGF0YSk7XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0ICBcblx0XHRcdCAgaWYgKHJlc3BvbnNlLmFsbEVsZW1lbnRzU2VuZHMpIHRoaXMuYWxsRWxlbWVudHNSZWNlaXZlZCA9IHRydWU7XG5cblx0XHRcdFx0Ly9pZiAocmVzcG9uc2UuZXhjZWVkTWF4UmVzdWx0ICYmICF0aGlzLnJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkKSB0aGlzLnNlbmRBamF4RWxlbWVudFJlcXVlc3QodGhpcy5jdXJyUmVxdWVzdCk7ICAgICBcblx0XHRcdH0sXG5cdFx0XHRjb21wbGV0ZTogKCkgPT5cblx0XHRcdHtcblx0XHRcdCAgdGhpcy5pc1JldHJpZXZpbmdFbGVtZW50cyA9IGZhbHNlO1xuXHRcdFx0ICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcik7XG5cdFx0XHQgIGlmICh0aGlzLnJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkKVxuXHRcdFx0ICB7XG5cdFx0XHQgIFx0IC8vY29uc29sZS5sb2coXCIgICAgcmVxdWVzdFdhaXRpbmdUb0JlRXhlY3V0ZWQgc3RvcmVkXCIsIHRoaXMud2FpdGluZ1JlcXVlc3QpO1xuXHRcdFx0ICBcdCB0aGlzLnNlbmRBamF4RWxlbWVudFJlcXVlc3QodGhpcy53YWl0aW5nUmVxdWVzdCk7XG5cdFx0XHQgIFx0IHRoaXMucmVxdWVzdFdhaXRpbmdUb0JlRXhlY3V0ZWQgPSBmYWxzZTtcblx0XHRcdCAgfVxuXHRcdFx0ICBlbHNlXG5cdFx0XHQgIHtcblx0XHRcdCAgXHQgLy9jb25zb2xlLmxvZyhcIkFqYXggcmVxdWVzdCBjb21wbGV0ZVwiKTtcdFx0XHQgIFx0IFxuXHRcdFx0XHQgJCgnI2RpcmVjdG9yeS1sb2FkaW5nJykuaGlkZSgpO1xuXHRcdFx0ICB9XG5cdFx0XHR9LFxuXHRcdH0pO1xuXHR9O1xuXG5cdGdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCwgY2FsbGJhY2tTdWNjZXNzPywgY2FsbGJhY2tGYWlsdXJlPylcblx0e1xuXHRcdGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGxldCByb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9hcGlfZWxlbWVudF9ieV9pZCcpO1xuXG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogcm91dGUsXG5cdFx0XHRtZXRob2Q6IFwicG9zdFwiLFxuXHRcdFx0ZGF0YTogeyBlbGVtZW50SWQ6IGVsZW1lbnRJZCB9LFxuXHRcdFx0c3VjY2VzczogcmVzcG9uc2UgPT4gXG5cdFx0XHR7XHQgICAgICAgIFxuXHRcdFx0XHRpZiAocmVzcG9uc2UpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0d2luZG93LmNvbnNvbGUubG9nKFwicmVjZWl2ZSBlbGVtZW50QnlJZCBpbiBcIiArIChlbmQtc3RhcnQpICsgXCIgbXNcIiwgcmVzcG9uc2UpO1x0XHRcdFxuXG5cdFx0XHRcdFx0aWYgKGNhbGxiYWNrU3VjY2VzcykgY2FsbGJhY2tTdWNjZXNzKHJlc3BvbnNlKTsgXG5cdFx0XHRcdFx0Ly90aGlzLm9uTmV3RWxlbWVudC5lbWl0KHJlc3BvbnNlKTtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHR9XHRcblx0XHRcdFx0ZWxzZSBpZiAoY2FsbGJhY2tGYWlsdXJlKSBjYWxsYmFja0ZhaWx1cmUocmVzcG9uc2UpOyBcdFx0XHRcdCAgICAgICBcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogcmVzcG9uc2UgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGNhbGxiYWNrRmFpbHVyZSkgY2FsbGJhY2tGYWlsdXJlKHJlc3BvbnNlKTsgXHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdHZvdGUoZWxlbWVudElkIDpudW1iZXIsIHZvdGVWYWx1ZSA6IG51bWJlciwgY29tbWVudCA6IHN0cmluZywgY2FsbGJhY2tTdWNjZXNzPywgY2FsbGJhY2tGYWlsdXJlPylcblx0e1xuXHRcdGxldCByb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl92b3RlX2Zvcl9lbGVtZW50Jyk7XG5cblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsOiByb3V0ZSxcblx0XHRcdG1ldGhvZDogXCJwb3N0XCIsXG5cdFx0XHRkYXRhOiB7IGVsZW1lbnRJZDogZWxlbWVudElkLCB2b3RlVmFsdWU6IHZvdGVWYWx1ZSwgY29tbWVudDogY29tbWVudCB9LFxuXHRcdFx0c3VjY2VzczogcmVzcG9uc2UgPT4gXG5cdFx0XHR7XHQgICAgICAgIFxuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzKVxuXHRcdFx0XHR7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChjYWxsYmFja1N1Y2Nlc3MpIGNhbGxiYWNrU3VjY2VzcyhyZXNwb25zZS5kYXRhKTsgXHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlIGlmIChjYWxsYmFja0ZhaWx1cmUpIGNhbGxiYWNrRmFpbHVyZShyZXNwb25zZS5kYXRhKTsgXHRcdFx0XHQgICAgICAgXG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IHJlc3BvbnNlID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmIChjYWxsYmFja0ZhaWx1cmUpIGNhbGxiYWNrRmFpbHVyZShyZXNwb25zZS5kYXRhKTsgXHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cbn0iLCJpbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmV4cG9ydCBjbGFzcyBCb3VuZHNNb2R1bGVcbntcblx0Ly8gd2UgZXh0ZW5kIHZpc2libGUgdmlleHBvcnQgdG8gbG9hZCBlbGVtZW50cyBvbiB0aGlzIGFyZWEsIHNvIHRoZSB1c2VyIHNlZSB0aGVtIGRpcmVjdGx5IHdoZW4gcGFubmluZyBvciB6b29tIG91dFxuXHRleHRlbmRlZEJvdW5kcyA6IEwuTGF0TG5nQm91bmRzO1xuXG5cdC8vIHRoZSBib3VuZHMgd2hlcmUgZWxlbWVudHMgaGFzIGFscmVhZHkgYmVlbiByZXRyaWV2ZWRcblx0Ly8gd2Ugc2F2ZSBvbmUgZmlsbGVkQm91bmQgcGVyIG1haW5PcHRpb25JZFxuXHRmaWxsZWRCb3VuZCA6IEwuTGF0TG5nQm91bmRzW10gPSBbXTtcblxuXHRpbml0aWFsaXplKClcblx0e1xuXHRcdGZvcihsZXQgbWFpbk9wdGlvbklkIG9mIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9uc0lkc1dpdGhBbGwoKSlcblx0XHR7XG5cdFx0XHR0aGlzLmZpbGxlZEJvdW5kW21haW5PcHRpb25JZF0gPSBudWxsO1xuXHRcdH1cblx0fVx0XG5cblx0Y3JlYXRlQm91bmRzRnJvbUxvY2F0aW9uKCRsb2NhdGlvbiA6IEwuTGF0TG5nLCAkcmFkaXVzID0gMzApXG5cdHtcblx0XHRsZXQgZGVncmVlID0gJHJhZGl1cyAvIDExMCAvIDI7XG5cdFx0dGhpcy5leHRlbmRlZEJvdW5kcyA9IEwubGF0TG5nQm91bmRzKEwubGF0TG5nKCRsb2NhdGlvbi5sYXQgLSBkZWdyZWUsICRsb2NhdGlvbi5sbmcgLSBkZWdyZWUpLCBMLmxhdExuZygkbG9jYXRpb24ubGF0ICsgZGVncmVlLCAkbG9jYXRpb24ubG5nICsgZGVncmVlKSApO1xuXHR9XG5cblx0ZXh0ZW5kQm91bmRzKCRyYXRpbyA6IG51bWJlciwgJGJvdW5kcyA6IEwuTGF0TG5nQm91bmRzID0gdGhpcy5leHRlbmRlZEJvdW5kcylcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJleHRlbmQgYm91bmRzXCIsICRib3VuZHMpO1xuXHRcdGlmICghJGJvdW5kcykgeyBjb25zb2xlLmxvZyhcImJvdW5kcyB1bmNvcnJlY3RcIiwgJGJvdW5kcyk7IHJldHVybjt9XG5cdFx0dGhpcy5leHRlbmRlZEJvdW5kcyA9ICRib3VuZHMucGFkKCRyYXRpbyk7XG5cdH1cblxuXHR1cGRhdGVGaWxsZWRCb3VuZHNBY2NvcmRpbmdUb05ld01haW5PcHRpb25JZCgpXG5cdHtcblx0XHRpZiAoQXBwLmN1cnJNYWluSWQgPT0gJ2FsbCcpXG5cdFx0e1xuXHRcdFx0Ly8gbGV0IG90aGVyc2ZpbGxlZEJvdW5kc05vdEVtcHR5ID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25zSWRzKCkubWFwKCAoaWQpID0+IHRoaXMuZmlsbGVkQm91bmRbaWRdKS5maWx0ZXIoIChib3VuZCkgPT4gYm91bmQgIT0gbnVsbCk7XG5cblx0XHRcdC8vIC8vIGdldHRpbmcgdGhlIHNtYWxsZXN0XG5cdFx0XHQvLyBsZXQgd2VzdCA9ICBNYXRoLm1heC5hcHBseShNYXRoLCBvdGhlcnNmaWxsZWRCb3VuZHNOb3RFbXB0eS5tYXAoIChib3VuZCkgPT4gYm91bmQuZ2V0V2VzdCgpKSk7XG5cdFx0XHQvLyBsZXQgc291dGggPSBNYXRoLm1heC5hcHBseShNYXRoLCBvdGhlcnNmaWxsZWRCb3VuZHNOb3RFbXB0eS5tYXAoIChib3VuZCkgPT4gYm91bmQuZ2V0U291dGgoKSkpO1xuXHRcdFx0Ly8gbGV0IGVhc3QgPSAgTWF0aC5taW4uYXBwbHkoTWF0aCwgb3RoZXJzZmlsbGVkQm91bmRzTm90RW1wdHkubWFwKCAoYm91bmQpID0+IGJvdW5kLmdldEVhc3QoKSkpO1xuXHRcdFx0Ly8gbGV0IG5vcnRoID0gTWF0aC5taW4uYXBwbHkoTWF0aCwgb3RoZXJzZmlsbGVkQm91bmRzTm90RW1wdHkubWFwKCAoYm91bmQpID0+IGJvdW5kLmdldE5vcnRoKCkpKTtcblxuXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRoaXMuZmlsbGVkQm91bmRbJ2FsbCddKVxuXHRcdHtcblx0XHRcdGlmICghdGhpcy5jdXJyRmlsbGVkQm91bmQgfHwgdGhpcy5maWxsZWRCb3VuZFsnYWxsJ10uY29udGFpbnModGhpcy5maWxsZWRCb3VuZFtBcHAuY3Vyck1haW5JZF0pKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmZpbGxlZEJvdW5kW0FwcC5jdXJyTWFpbklkXSA9IHRoaXMuZmlsbGVkQm91bmRbJ2FsbCddXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gaW1wbGVtZW50cyB0aGlzIGZ1bmN0aW9uIHRvIHdhaXQgZnJvbSBhamF4IHJlc3BvbnNlIHRvIHVwZGF0ZSBuZXcgZmlsbGVkQm91bmRzLCBpbnN0ZWFkIG9mXG5cdC8vIHVwZGF0aW5nIGl0IGJlZm9yZSBhamF4IHNlbmQgKHBvc3NpYmx5IHdyb25nIGlmIGFqYXggZmFpbClcblx0Ly8gdXBkYXRlRmlsbGVkQm91bmRzV2l0aEJvdW5kc1JlY2VpdmVkKGJvdW5kIDogTC5MYXRMbmdCb3VuZHNFeHByZXNzaW9uLCBtYWluT3B0aW9uSWQgOiBudW1iZXIpXG5cdC8vIHtcblx0Ly8gXHR0aGlzLmZpbGxlZEJvdW5kW21haW5PcHRpb25JZF0gPSBuZXcgTC5sYXRMbmdCb3VuZHMoYm91bmQpO1xuXHQvLyB9XG5cblx0Z2V0IGN1cnJGaWxsZWRCb3VuZCgpIHsgcmV0dXJuIHRoaXMuZmlsbGVkQm91bmRbQXBwLmN1cnJNYWluSWRdOyB9XG5cblx0Y2FsY3VsYXRlRnJlZUJvdW5kcygpXG5cdHtcblx0XHRsZXQgZnJlZUJvdW5kcyA9IFtdO1xuXG5cdFx0bGV0IGN1cnJGaWxsZWRCb3VuZCA9IHRoaXMuY3VyckZpbGxlZEJvdW5kO1xuXG5cdFx0bGV0IGZyZWVCb3VuZDEsIGZyZWVCb3VuZDIsIGZyZWVCb3VuZDMsIGZyZWVCb3VuZDQ7XG5cblx0XHRpZiAoY3VyckZpbGxlZEJvdW5kKVxuXHRcdHtcblx0XHRcdGlmICghY3VyckZpbGxlZEJvdW5kLmNvbnRhaW5zKHRoaXMuZXh0ZW5kZWRCb3VuZHMpKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5jb250YWlucyhjdXJyRmlsbGVkQm91bmQpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gZXh0ZW5kZWQgY29udGFpbnMgZmlsbGVkYm91bmRzXHRcdFxuXG5cdFx0XHRcdFx0ZnJlZUJvdW5kMSA9IEwubGF0TG5nQm91bmRzKCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldE5vcnRoV2VzdCgpLCBjdXJyRmlsbGVkQm91bmQuZ2V0Tm9ydGhFYXN0KCkgKTtcblx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGZyZWVCb3VuZDEuZ2V0Tm9ydGhFYXN0KClcdFx0XHRcdCAsIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGhFYXN0KCkgKTtcblx0XHRcdFx0XHRmcmVlQm91bmQzID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aEVhc3QoKVx0ICwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aFdlc3QoKSApO1xuXHRcdFx0XHRcdGZyZWVCb3VuZDQgPSBMLmxhdExuZ0JvdW5kcyggZnJlZUJvdW5kMS5nZXRTb3V0aFdlc3QoKVx0XHRcdFx0ICwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoV2VzdCgpICk7XG5cblx0XHRcdFx0XHRjdXJyRmlsbGVkQm91bmQgPSB0aGlzLmV4dGVuZGVkQm91bmRzO1xuXG5cdFx0XHRcdFx0ZnJlZUJvdW5kcy5wdXNoKGZyZWVCb3VuZDEsZnJlZUJvdW5kMiwgZnJlZUJvdW5kMywgZnJlZUJvdW5kNCk7XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIGV4dGVuZGVkIGNyb3NzIG92ZXIgZmlsbGVkXG5cblx0XHRcdFx0XHRpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5nZXRXZXN0KCkgPiBjdXJyRmlsbGVkQm91bmQuZ2V0V2VzdCgpICYmIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0RWFzdCgpIDwgY3VyckZpbGxlZEJvdW5kLmdldEVhc3QoKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aCgpIDwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoKCkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkIGNlbnRlcmVkIHNvdXRoIGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggdGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aFdlc3QoKSwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoRWFzdCgpICk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBleHRlbmRlZCBjZW50ZXJlZCBzb3V0aCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0Tm9ydGhXZXN0KCksIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh0aGlzLmV4dGVuZGVkQm91bmRzLmdldFdlc3QoKSA8IGN1cnJGaWxsZWRCb3VuZC5nZXRXZXN0KCkpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGgoKSA+IGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aCgpICYmIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0Tm9ydGgoKSA8IGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aCgpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBleHRlbmRlZCBjZW50ZXJlZCBlYXN0IGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggdGhpcy5leHRlbmRlZEJvdW5kcy5nZXROb3J0aFdlc3QoKSwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoV2VzdCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICh0aGlzLmV4dGVuZGVkQm91bmRzLmdldFNvdXRoKCkgPCBjdXJyRmlsbGVkQm91bmQuZ2V0U291dGgoKSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ly8gZXh0ZW5kZWRib3VuZHMgc291dGhXZXN0IGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoRWFzdCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldFNvdXRoV2VzdCgpICk7XG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDIgPSBMLmxhdExuZ0JvdW5kcyggY3VyckZpbGxlZEJvdW5kLmdldE5vcnRoV2VzdCgpLCBmcmVlQm91bmQxLmdldE5vcnRoV2VzdCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkYm91bmRzIG5vcnRoV2VzdCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aEVhc3QoKSwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXROb3J0aFdlc3QoKSApO1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aFdlc3QoKSwgZnJlZUJvdW5kMS5nZXRTb3V0aFdlc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGgoKSA+IGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aCgpICYmIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0Tm9ydGgoKSA8IGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aCgpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyBleHRlbmRlZCBjZW50ZXJlZCB3ZXN0IGZyb20gZmlsbGVkQm91bmRzXG5cdFx0XHRcdFx0XHRcdGZyZWVCb3VuZDEgPSBMLmxhdExuZ0JvdW5kcyggY3VyckZpbGxlZEJvdW5kLmdldE5vcnRoRWFzdCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldFNvdXRoRWFzdCgpICk7IFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aCgpIDwgY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoKCkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkYm91bmRzIHNvdXRoZWFzdCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aFdlc3QoKSwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXRTb3V0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aEVhc3QoKSwgZnJlZUJvdW5kMS5nZXROb3J0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1x0XG5cdFx0XHRcdFx0XHRcdC8vIGV4dGVuZGVkYm91bmRzIG5vcnRoRWFzdCBmcm9tIGZpbGxlZEJvdW5kc1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQxID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aFdlc3QoKSwgdGhpcy5leHRlbmRlZEJvdW5kcy5nZXROb3J0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0XHRmcmVlQm91bmQyID0gTC5sYXRMbmdCb3VuZHMoIGN1cnJGaWxsZWRCb3VuZC5nZXRTb3V0aEVhc3QoKSwgZnJlZUJvdW5kMS5nZXRTb3V0aEVhc3QoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vTC5yZWN0YW5nbGUoZnJlZUJvdW5kMSwge2NvbG9yOiBcInJlZFwiLCB3ZWlnaHQ6IDN9KS5hZGRUbyh0aGlzLm1hcF8pOyBcblx0XHRcdFx0XHQvL0wucmVjdGFuZ2xlKGZyZWVCb3VuZDIsIHtjb2xvcjogXCJibHVlXCIsIHdlaWdodDogM30pLmFkZFRvKHRoaXMubWFwXyk7IFxuXG5cdFx0XHRcdFx0ZnJlZUJvdW5kcy5wdXNoKGZyZWVCb3VuZDEpO1xuXHRcdFx0XHRcdGlmIChmcmVlQm91bmQyKSBmcmVlQm91bmRzLnB1c2goZnJlZUJvdW5kMik7XHRcdFxuXG5cdFx0XHRcdFx0Y3VyckZpbGxlZEJvdW5kID0gTC5sYXRMbmdCb3VuZHMoIFxuXHRcdFx0XHRcdFx0TC5sYXRMbmcoXG5cdFx0XHRcdFx0XHRcdE1hdGgubWF4KGN1cnJGaWxsZWRCb3VuZC5nZXROb3J0aCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldE5vcnRoKCkpLFxuXHRcdFx0XHRcdFx0XHRNYXRoLm1heChjdXJyRmlsbGVkQm91bmQuZ2V0RWFzdCgpLCB0aGlzLmV4dGVuZGVkQm91bmRzLmdldEVhc3QoKSlcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRMLmxhdExuZyhcblx0XHRcdFx0XHRcdFx0TWF0aC5taW4oY3VyckZpbGxlZEJvdW5kLmdldFNvdXRoKCksIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0U291dGgoKSksXG5cdFx0XHRcdFx0XHRcdE1hdGgubWluKGN1cnJGaWxsZWRCb3VuZC5nZXRXZXN0KCksIHRoaXMuZXh0ZW5kZWRCb3VuZHMuZ2V0V2VzdCgpKSBcblx0XHRcdFx0XHRcdClcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHQpO1x0XHRcblx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gZXh0ZW5kZWQgYm91bmRzIGluY2x1ZGVkIGluIGZpbGxlZGJvdW5kc1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdC8vIGZpcnN0IGluaXRpYWxpemF0aW9uXG5cdFx0XHRmcmVlQm91bmRzLnB1c2godGhpcy5leHRlbmRlZEJvdW5kcyk7XG5cdFx0XHRjdXJyRmlsbGVkQm91bmQgPSB0aGlzLmV4dGVuZGVkQm91bmRzO1xuXHRcdH1cdFx0XG5cblx0XHR0aGlzLmZpbGxlZEJvdW5kW0FwcC5jdXJyTWFpbklkXSA9IGN1cnJGaWxsZWRCb3VuZDtcblxuXHRcdHJldHVybiBmcmVlQm91bmRzO1xuXHR9XG59IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uL2NsYXNzZXMvY2F0ZWdvcnkuY2xhc3NcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuLi9jbGFzc2VzL29wdGlvbi5jbGFzc1wiO1xuXG5leHBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LmNsYXNzXCI7XG5leHBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi4vY2xhc3Nlcy9vcHRpb24uY2xhc3NcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSBsZXQgJCA6IGFueTtcblxuXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcmllc01vZHVsZVxue1xuXHRjYXRlZ29yaWVzIDogQ2F0ZWdvcnlbXSA9IFtdO1xuXHRvcHRpb25zIDogT3B0aW9uW10gPSBbXTtcblxuXHRtYWluQ2F0ZWdvcnkgOiBDYXRlZ29yeTtcblx0b3BlbkhvdXJzQ2F0ZWdvcnkgOiBDYXRlZ29yeTtcblxuXHRvcGVuSG91cnNGaWx0ZXJzRGF5cyA6IHN0cmluZ1tdID0gW107XG5cblx0Y29uc3RydWN0b3IoKSBcblx0e1xuXHRcdHRoaXMub3B0aW9ucyA9IFtdO1xuXHRcdHRoaXMuY2F0ZWdvcmllcyA9IFtdO1xuXHR9XG5cblx0Y3JlYXRlQ2F0ZWdvcmllc0Zyb21Kc29uKG1haW5DYXRnZW9yeUpzb24sIG9wZW5Ib3Vyc0NhdGVnb3J5SnNvbilcblx0e1xuXHRcdHRoaXMubWFpbkNhdGVnb3J5ID0gdGhpcy5yZWN1cnNpdmVseUNyZWF0ZUNhdGVnb3J5QW5kT3B0aW9ucyhtYWluQ2F0Z2VvcnlKc29uKTtcblx0XHR0aGlzLm9wZW5Ib3Vyc0NhdGVnb3J5ID0gdGhpcy5yZWN1cnNpdmVseUNyZWF0ZUNhdGVnb3J5QW5kT3B0aW9ucyhvcGVuSG91cnNDYXRlZ29yeUpzb24pO1xuXG5cdFx0dGhpcy51cGRhdGVPcGVuSG91cnNGaWx0ZXIoKTtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMubWFpbkNhdGVnb3J5KTtcblx0fVxuXG5cdHByaXZhdGUgcmVjdXJzaXZlbHlDcmVhdGVDYXRlZ29yeUFuZE9wdGlvbnMoY2F0ZWdvcnlKc29uIDogYW55KSA6IENhdGVnb3J5XG5cdHtcblx0XHRsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcnlKc29uKTtcblxuXHRcdGZvcihsZXQgb3B0aW9uSnNvbiBvZiBjYXRlZ29yeUpzb24ub3B0aW9ucylcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uID0gbmV3IE9wdGlvbihvcHRpb25Kc29uKTtcblx0XHRcdG9wdGlvbi5vd25lcklkID0gY2F0ZWdvcnlKc29uLmlkO1xuXHRcdFx0b3B0aW9uLmRlcHRoID0gY2F0ZWdvcnkuZGVwdGg7XG5cblx0XHRcdGlmIChjYXRlZ29yeS5kZXB0aCA9PSAwKSBvcHRpb24ubWFpbk93bmVySWQgPSBcImFsbFwiO1xuXHRcdFx0ZWxzZSBpZiAoY2F0ZWdvcnkuZGVwdGggPT0gLTEpIG9wdGlvbi5tYWluT3duZXJJZCA9IFwib3BlbmhvdXJzXCI7XG5cdFx0XHRlbHNlIG9wdGlvbi5tYWluT3duZXJJZCA9IGNhdGVnb3J5Lm1haW5Pd25lcklkO1xuXG5cdFx0XHRmb3IobGV0IHN1YmNhdGVnb3J5SnNvbiBvZiBvcHRpb25Kc29uLnN1YmNhdGVnb3JpZXMpXG5cdFx0XHR7XHRcdFx0XHRcblx0XHRcdFx0aWYgKGNhdGVnb3J5LmRlcHRoIDw9IDApIHN1YmNhdGVnb3J5SnNvbi5tYWluT3duZXJJZCA9IG9wdGlvbi5pZDtcblx0XHRcdFx0ZWxzZSBzdWJjYXRlZ29yeUpzb24ubWFpbk93bmVySWQgPSBvcHRpb24ubWFpbk93bmVySWQ7XG5cblx0XHRcdFx0bGV0IHN1YmNhdGVnb3J5ID0gdGhpcy5yZWN1cnNpdmVseUNyZWF0ZUNhdGVnb3J5QW5kT3B0aW9ucyhzdWJjYXRlZ29yeUpzb24pO1xuXHRcdFx0XHRzdWJjYXRlZ29yeS5vd25lcklkID0gb3B0aW9uLmlkO1x0XHRcdFx0XG5cblx0XHRcdFx0b3B0aW9uLmFkZENhdGVnb3J5KHN1YmNhdGVnb3J5KTtcblx0XHRcdH1cblxuXHRcdFx0Y2F0ZWdvcnkuYWRkT3B0aW9uKG9wdGlvbik7XHRcblx0XHRcdHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XHRcblx0XHR9XG5cblx0XHR0aGlzLmNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG5cblx0XHRyZXR1cm4gY2F0ZWdvcnk7XG5cdH1cblxuXHR1cGRhdGVPcGVuSG91cnNGaWx0ZXIoKVxuXHR7XG5cdFx0dGhpcy5vcGVuSG91cnNGaWx0ZXJzRGF5cyA9IFtdO1xuXHRcdGxldCBvcHRpb24gOiBhbnk7XG5cdFx0Zm9yKG9wdGlvbiBvZiB0aGlzLm9wZW5Ib3Vyc0NhdGVnb3J5LmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGlmIChvcHRpb24uaXNDaGVja2VkKSB0aGlzLm9wZW5Ib3Vyc0ZpbHRlcnNEYXlzLnB1c2goIG9wdGlvbi5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH1cblx0XHQvL2NvbnNvbGUubG9nKFwidXBkYXRlT3BlbkhvdXJzZmlsdGVyc1wiLCB0aGlzLm9wZW5Ib3Vyc0ZpbHRlcnNEYXlzKTtcblx0fVxuXG5cdGdldE1haW5PcHRpb25zKCkgOiBPcHRpb25bXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMubWFpbkNhdGVnb3J5Lm9wdGlvbnM7XG5cdH1cblxuXHRnZXRNYWluT3B0aW9uc0lkc1dpdGhBbGwoKSA6IGFueVtdXG5cdHtcblx0XHRsZXQgb3B0aW9uSWRzIDogYW55W10gPSB0aGlzLmdldE1haW5PcHRpb25zSWRzKCk7XG5cdFx0b3B0aW9uSWRzLnB1c2goXCJhbGxcIik7XG5cdFx0cmV0dXJuIG9wdGlvbklkcztcblx0fVxuXG5cdGdldE1haW5PcHRpb25zSWRzKCkgOiBudW1iZXJbXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMubWFpbkNhdGVnb3J5Lm9wdGlvbnMubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXHR9XG5cblx0Z2V0Q3Vyck1haW5PcHRpb24oKSA6IE9wdGlvblxuXHR7XG5cdFx0cmV0dXJuIEFwcC5jdXJyTWFpbklkID09ICdhbGwnID8gbnVsbCA6IHRoaXMuZ2V0TWFpbk9wdGlvbkJ5SWQoQXBwLmN1cnJNYWluSWQpO1xuXHR9XG5cblx0Z2V0TWFpbk9wdGlvbkJ5U2x1Zygkc2x1ZykgOiBPcHRpb25cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldE1haW5PcHRpb25zKCkuZmlsdGVyKCAob3B0aW9uIDogT3B0aW9uKSA9PiBvcHRpb24ubmFtZVNob3J0ID09ICRzbHVnKS5zaGlmdCgpO1xuXHR9XG5cblx0Z2V0TWFpbk9wdGlvbkJ5SWQgKCRpZCkgOiBPcHRpb25cblx0e1xuXHRcdHJldHVybiB0aGlzLm1haW5DYXRlZ29yeS5vcHRpb25zLmZpbHRlciggKG9wdGlvbiA6IE9wdGlvbikgPT4gb3B0aW9uLmlkID09ICRpZCkuc2hpZnQoKTtcblx0fTtcblxuXHRnZXRDYXRlZ29yeUJ5SWQgKCRpZCkgOiBDYXRlZ29yeVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuY2F0ZWdvcmllcy5maWx0ZXIoIChjYXRlZ29yeSA6IENhdGVnb3J5KSA9PiBjYXRlZ29yeS5pZCA9PSAkaWQpLnNoaWZ0KCk7XG5cdH07XG5cblx0Z2V0T3B0aW9uQnlJZCAoJGlkKSA6IE9wdGlvblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIoIChvcHRpb24gOiBPcHRpb24pID0+IG9wdGlvbi5pZCA9PSAkaWQpLnNoaWZ0KCk7XG5cdH07XG5cblx0Z2V0Q3Vyck9wdGlvbnMoKSA6IE9wdGlvbltdXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlciggKG9wdGlvbiA6IE9wdGlvbikgPT4gb3B0aW9uLm1haW5Pd25lcklkID09IEFwcC5jdXJyTWFpbklkKTtcblx0fVxufSIsImRlY2xhcmUgbGV0IGdvb2dsZTtcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkLCBMOiBhbnk7XG5cbmRlY2xhcmUgbGV0IHdpbmRvdyA6IGFueTtcblxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbnNNb2R1bGVcbntcblx0bWFya2VyRGlyZWN0aW9uUmVzdWx0ID0gbnVsbDtcblxuXHRyb3V0aW5nQ29udHJvbCA6IGFueTtcblx0XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIFx0d2luZG93LmxybUNvbmZpZyA9IHtcblx0XHRcdC8vIFRPRE8gY2hhbmdlIHRoaXMgZGVtbyBzZXJ2aWNlVXJsXG5cdFx0XHQvLyBcdFx0c2VydmljZVVybDogJy8vcm91dGVyLnByb2plY3Qtb3NybS5vcmcvdmlhcm91dGUnLFxuXHRcdFx0Ly8gICAgcHJvZmlsZTogJ21hcGJveC9kcml2aW5nJyxcblx0XHR9O1xuXG4gIH1cblxuXHRjbGVhcigpXG5cdHtcblx0XHRpZiAoIXRoaXMucm91dGluZ0NvbnRyb2wpIHJldHVybjtcblxuXHRcdHRoaXMuY2xlYXJSb3V0ZSgpO1xuXHRcdC8vdGhpcy5jbGVhckRpcmVjdGlvbk1hcmtlcigpO1xuXHRcdHRoaXMuaGlkZUl0aW5lcmFyeVBhbmVsKCk7XG5cblx0XHRBcHAuREVBTW9kdWxlLmVuZCgpO1xuXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbCA9IG51bGw7XG5cdH07XG5cblx0Y2xlYXJSb3V0ZSgpXG5cdHtcblx0XHRjb25zb2xlLmxvZyhcImNsZWFyaW5nIHJvdXRlXCIpO1xuXHRcdGlmICh0aGlzLnJvdXRpbmdDb250cm9sKSBcblx0XHR7XG5cdFx0XHR0aGlzLnJvdXRpbmdDb250cm9sLnNwbGljZVdheXBvaW50cygwLDIpO1x0XHRcblx0XHRcdEFwcC5tYXAoKS5yZW1vdmVDb250cm9sKHRoaXMucm91dGluZ0NvbnRyb2wpO1x0XG5cdFx0fVxuXHR9O1xuXG5cdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiA6IEwuTGF0TG5nLCBlbGVtZW50IDogRWxlbWVudCkgXG5cdHtcblx0XHR0aGlzLmNsZWFyKCk7XG5cblx0XHRsZXQgd2F5cG9pbnRzID0gW1xuXHRcdCAgICBvcmlnaW4sXG5cdFx0ICAgIGVsZW1lbnQucG9zaXRpb24sXG5cdFx0XTtcblxuXHRcdC8vY29uc29sZS5sb2coXCJjYWxjdWxhdGUgcm91dGVcIiwgd2F5cG9pbnRzKTtcblxuXHRcdHRoaXMucm91dGluZ0NvbnRyb2wgPSBMLlJvdXRpbmcuY29udHJvbCh7XG5cdFx0XHRwbGFuOiBMLlJvdXRpbmcucGxhbihcblx0XHRcdFx0d2F5cG9pbnRzLCBcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIGRlbGV0ZWluZyBzdGFydCBhbmQgZW5kIG1hcmtlcnNcblx0XHRcdFx0XHRjcmVhdGVNYXJrZXI6IGZ1bmN0aW9uKGksIHdwKSB7IHJldHVybiBudWxsOyB9LFxuXHRcdFx0XHRcdHJvdXRlV2hpbGVEcmFnZ2luZzogZmFsc2UsXG5cdFx0XHRcdFx0c2hvd0FsdGVybmF0aXZlczogZmFsc2Vcblx0XHRcdFx0fVxuXHRcdFx0KSxcblx0XHRcdGxhbmd1YWdlOiAnZnInLFxuXHRcdFx0cm91dGVXaGlsZURyYWdnaW5nOiBmYWxzZSxcblx0XHRcdHNob3dBbHRlcm5hdGl2ZXM6IGZhbHNlLFxuXHRcdFx0YWx0TGluZU9wdGlvbnM6IHtcblx0XHRcdFx0c3R5bGVzOiBbXG5cdFx0XHRcdFx0e2NvbG9yOiAnYmxhY2snLCBvcGFjaXR5OiAwLjE1LCB3ZWlnaHQ6IDl9LFxuXHRcdFx0XHRcdHtjb2xvcjogJ3doaXRlJywgb3BhY2l0eTogMC44LCB3ZWlnaHQ6IDZ9LFxuXHRcdFx0XHRcdHtjb2xvcjogJyMwMGIzZmQnLCBvcGFjaXR5OiAwLjUsIHdlaWdodDogMn1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0pLmFkZFRvKEFwcC5tYXAoKSk7XG5cblx0XHQvLyBzaG93IEl0aW5lcmFyeSBwYW5lbCB3aXRob3V0IGl0aW5lcmFyeSwganVzdCB0byBzaG93IHVzZXJcblx0XHQvLyBzb21ldGhpbmdpcyBoYXBwZW5uaW5nIGFuIGRpc3BsYXkgc3Bpbm5lciBsb2FkZXJcblx0XHR0aGlzLnNob3dJdGluZXJhcnlQYW5lbChlbGVtZW50KTtcblxuXHRcdHRoaXMucm91dGluZ0NvbnRyb2wub24oJ3JvdXRlc2ZvdW5kJywgKGV2KSA9PiBcblx0XHR7XG5cdFx0XHR0aGlzLnNob3dJdGluZXJhcnlQYW5lbChlbGVtZW50KTtcblx0XHR9KTtcblxuXHRcdC8vIGZpdCBib3VuZHMgXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbC5vbigncm91dGVzZWxlY3RlZCcsIGZ1bmN0aW9uKGUpIFxuXHRcdHtcdCAgICBcblx0ICAgIHZhciByID0gZS5yb3V0ZTtcblx0ICAgIHZhciBsaW5lID0gTC5Sb3V0aW5nLmxpbmUocik7XG5cdCAgICB2YXIgYm91bmRzID0gbGluZS5nZXRCb3VuZHMoKTtcblx0ICAgIEFwcC5tYXAoKS5maXRCb3VuZHMoYm91bmRzKTtcblx0XHR9KTtcblxuXHRcdHRoaXMucm91dGluZ0NvbnRyb2wub24oJ3JvdXRpbmdlcnJvcicsIChldikgPT4gXG5cdFx0e1xuXHRcdFx0JCgnI21vZGFsLWRpcmVjdGlvbnMtZmFpbCcpLm9wZW5Nb2RhbCgpO1xuXHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdH0pO1xuXHRcdFx0XG5cdH07XG5cblx0aGlkZUl0aW5lcmFyeVBhbmVsKClcblx0e1xuXHRcdC8vdGhpcy5yb3V0aW5nQ29udHJvbC5oaWRlKCk7XG5cdFx0Ly9BcHAubWFwKCkucmVtb3ZlQ29udHJvbCh0aGlzLnJvdXRpbmdDb250cm9sKTtcblxuXHRcdC8vJCgnLmxlYWZsZXQtcm91dGluZy1jb250YWluZXInKS5oaWRlKCk7XG5cdFx0Ly8kKCcubGVhZmxldC1yb3V0aW5nLWNvbnRhaW5lcicpLnByZXBlbmRUbygnLmRpcmVjdG9yeS1tZW51LWNvbnRlbnQnKTtcblx0XHQkKCcjZGlyZWN0b3J5LW1lbnUtbWFpbi1jb250YWluZXInKS5yZW1vdmVDbGFzcygpO1xuXHRcdCQoJy5kaXJlY3RvcnktbWVudS1oZWFkZXInKTtcblx0XHQkKCcjc2VhcmNoLWJhcicpLnJlbW92ZUNsYXNzKCk7XHRcdFxuXHR9XG5cblx0c2hvd0l0aW5lcmFyeVBhbmVsKGVsZW1lbnQgOiBFbGVtZW50KVxuXHR7XG5cdFx0Ly90aGlzLnJvdXRpbmdDb250cm9sLnNob3coKTtcblx0XHQvL0FwcC5tYXAoKS5hZGRDb250cm9sKHRoaXMucm91dGluZ0NvbnRyb2wpO1x0XG5cblx0XHQvLyQoJy5sZWFmbGV0LXJvdXRpbmctY29udGFpbmVyJykuc2hvdygpO1xuXG5cdFx0Y29uc29sZS5sb2coXCJzaG93IGl0aW5lcmFyeVwiKTtcblxuXHRcdCQoJyNkaXJlY3RvcnktbWVudS1tYWluLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoXCJkaXJlY3Rpb25zXCIpO1x0XG5cdFx0JCgnLmRpcmVjdG9yeS1tZW51LWhlYWRlcicpLmF0dHIoJ29wdGlvbi1pZCcsZWxlbWVudC5jb2xvck9wdGlvbklkKTtcblx0XHQvLyQoJyNzZWFyY2gtYmFyJykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyhlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1x0XG5cblx0XHQkKCcubGVhZmxldC1yb3V0aW5nLWNvbnRhaW5lcicpLnByZXBlbmRUbygnLmRpcmVjdG9yeS1tZW51LWNvbnRlbnQnKTtcblx0XHRcdFxuXG5cdFx0XG5cdH1cblxuXHRjbGVhckRpcmVjdGlvbk1hcmtlcigpXG5cdHtcblx0XHRpZiAodGhpcy5tYXJrZXJEaXJlY3Rpb25SZXN1bHQgIT09IG51bGwpXG5cdFx0e1xuXHRcdFx0dGhpcy5tYXJrZXJEaXJlY3Rpb25SZXN1bHQuc2V0VmlzaWJsZShmYWxzZSk7XG5cdFx0XHR0aGlzLm1hcmtlckRpcmVjdGlvblJlc3VsdC5zZXRNYXAobnVsbCk7XG5cdFx0XHR0aGlzLm1hcmtlckRpcmVjdGlvblJlc3VsdCA9IG51bGw7XG5cdFx0fVxuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmV4cG9ydCBjbGFzcyBEaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXG57XG5cdGVsZW1lbnRTaG93bkFsb25lXyA9IG51bGw7XG5cblx0Y29uc3RydWN0b3IoKSB7fVxuXG5cdGdldEVsZW1lbnQoKSA6IEVsZW1lbnQgeyByZXR1cm4gdGhpcy5lbGVtZW50U2hvd25BbG9uZV87IH1cblxuXHRiZWdpbihlbGVtZW50SWQgOiBzdHJpbmcsIHBhblRvRWxlbWVudExvY2F0aW9uIDogYm9vbGVhbiA9IHRydWUpIFxuXHR7XHRcblx0XHRjb25zb2xlLmxvZyhcIkRpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGUgYmVnaW5cIiwgcGFuVG9FbGVtZW50TG9jYXRpb24pO1xuXG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudEJ5SWQoZWxlbWVudElkKTtcblx0XHR0aGlzLmVsZW1lbnRTaG93bkFsb25lXyA9IGVsZW1lbnQ7XHRcdFx0XG5cblx0XHRpZiAodGhpcy5lbGVtZW50U2hvd25BbG9uZV8gIT09IG51bGwpIFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmhpZGUoKTtcblx0XHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmlzU2hvd25BbG9uZSA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIEFwcC5lbGVtZW50TW9kdWxlLmZvY3VzT25UaGVzZXNFbGVtZW50cyhbZWxlbWVudC5pZF0pO1xuXHRcdC8vIGVsc2UgXG5cdFx0Ly8ge1xuXHRcdC8vQXBwLmVsZW1lbnRNb2R1bGUuY2xlYXJNYXJrZXJzKCk7XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUuY2xlYXJDdXJyZW50c0VsZW1lbnQoKTtcblx0XHQvL31cdFx0XHRcblx0XHRBcHAuZWxlbWVudE1vZHVsZS5zaG93RWxlbWVudChlbGVtZW50KTtcblx0XHRBcHAubWFwQ29tcG9uZW50LmFkZE1hcmtlcihlbGVtZW50Lm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXHRcdGVsZW1lbnQuaXNTaG93bkFsb25lID0gdHJ1ZTtcblxuXHRcdEFwcC5pbmZvQmFyQ29tcG9uZW50LnNob3dFbGVtZW50KGVsZW1lbnQuaWQpO1xuXG5cdFx0aWYgKHBhblRvRWxlbWVudExvY2F0aW9uKVxuXHRcdHtcblx0XHRcdC8vIHdlIHNldCBhIHRpbWVvdXQgdG8gbGV0IHRoZSBpbmZvYmFyIHNob3cgdXBcblx0XHRcdC8vIGlmIHdlIG5vdCBkbyBzbywgdGhlIG1hcCB3aWxsIG5vdCBiZSBjZW50ZXJlZCBpbiB0aGUgZWxlbWVudC5wb3NpdGlvblxuXHRcdFx0c2V0VGltZW91dCggKCkgPT4ge0FwcC5tYXBDb21wb25lbnQucGFuVG9Mb2NhdGlvbihlbGVtZW50LnBvc2l0aW9uLCAxMiwgZmFsc2UpO30sIDUwMCk7XG5cdFx0fVxuXHR9O1xuXG5cdGVuZCAoKSBcblx0e1xuXG5cdFx0aWYgKHRoaXMuZWxlbWVudFNob3duQWxvbmVfID09PSBudWxsKSByZXR1cm47XG5cblx0XHQvLyBpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSBBcHAuZWxlbWVudE1vZHVsZS5jbGVhckZvY3VzT25UaGVzZXNFbGVtZW50cyhbdGhpcy5lbGVtZW50U2hvd25BbG9uZV8uZ2V0SWQoKV0pO1xuXHRcdC8vIGVsc2UgXG5cdFx0Ly8ge1xuXHRcdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSx0cnVlKTtcblx0XHQvL31cblxuXHRcdEFwcC5tYXBDb21wb25lbnQucmVtb3ZlTWFya2VyKHRoaXMuZWxlbWVudFNob3duQWxvbmVfLm1hcmtlci5nZXRMZWFmbGV0TWFya2VyKCkpO1xuXHRcdFxuXHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmlzU2hvd25BbG9uZSA9IGZhbHNlO1x0XG5cblx0XHR0aGlzLmVsZW1lbnRTaG93bkFsb25lXyA9IG51bGw7XHRcblx0fTtcbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyICQ7XHRcblxuaW1wb3J0ICogYXMgQ29va2llcyBmcm9tIFwiLi4vdXRpbHMvY29va2llc1wiO1xuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmltcG9ydCB7IEJpb3Blbk1hcmtlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL21hcC9iaW9wZW4tbWFya2VyLmNvbXBvbmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRzQ2hhbmdlZFxueyBcblx0ZWxlbWVudHNUb0Rpc3BsYXkgOiBFbGVtZW50W107XG5cdG5ld0VsZW1lbnRzIDogRWxlbWVudFtdO1xuXHRlbGVtZW50c1RvUmVtb3ZlIDogRWxlbWVudFtdO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudHNNb2R1bGVcbntcblx0b25FbGVtZW50c0NoYW5nZWQgPSBuZXcgRXZlbnQ8RWxlbWVudHNDaGFuZ2VkPigpO1xuXG5cdGV2ZXJ5RWxlbWVudHNfIDogRWxlbWVudFtdW10gPSBbXTtcblx0ZXZlcnlFbGVtZW50c0lkXyA6IHN0cmluZ1tdID0gW107XG5cdFxuXHQvLyBjdXJyZW50IHZpc2libGUgZWxlbWVudHNcblx0dmlzaWJsZUVsZW1lbnRzXyA6IEVsZW1lbnRbXVtdID0gW107XG5cblx0ZmF2b3JpdGVJZHNfIDogbnVtYmVyW10gPSBbXTtcblx0aXNTaG93aW5nSGFsZkhpZGRlbiA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRsZXQgY29va2llcyA9IENvb2tpZXMucmVhZENvb2tpZSgnRmF2b3JpdGVJZHMnKTtcblx0XHRpZiAoY29va2llcyAhPT0gbnVsbClcblx0XHR7XG5cdFx0XHR0aGlzLmZhdm9yaXRlSWRzXyA9IEpTT04ucGFyc2UoY29va2llcyk7XHRcdFxuXHRcdH0gICBcblx0XHRlbHNlIHRoaXMuZmF2b3JpdGVJZHNfID0gW107XHRcdFxuXHR9XG5cblx0aW5pdGlhbGl6ZSgpXG5cdHtcblx0XHR0aGlzLmV2ZXJ5RWxlbWVudHNfWydhbGwnXSA9IFtdO1xuXHRcdHRoaXMudmlzaWJsZUVsZW1lbnRzX1snYWxsJ10gPSBbXTtcblx0XHRmb3IobGV0IG9wdGlvbiBvZiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbnMoKSlcblx0XHR7XG5cdFx0XHR0aGlzLmV2ZXJ5RWxlbWVudHNfW29wdGlvbi5pZF0gPSBbXTtcblx0XHRcdHRoaXMudmlzaWJsZUVsZW1lbnRzX1tvcHRpb24uaWRdID0gW107XG5cdFx0fVx0XG5cdH1cblxuXHRjaGVja0Nvb2tpZXMoKVxuXHR7XG5cdFx0Zm9yKGxldCBqID0gMDsgaiA8IHRoaXMuZmF2b3JpdGVJZHNfLmxlbmd0aDsgaisrKVxuXHQgIFx0e1xuXHQgIFx0XHR0aGlzLmFkZEZhdm9yaXRlKHRoaXMuZmF2b3JpdGVJZHNfW2pdLCBmYWxzZSk7XG5cdCAgXHR9XG5cdH07XG5cblx0YWRkSnNvbkVsZW1lbnRzIChlbGVtZW50TGlzdCwgY2hlY2tJZkFscmVhZHlFeGlzdCA9IHRydWUpIDogRWxlbWVudFtdXG5cdHtcblx0XHRsZXQgZWxlbWVudCA6IEVsZW1lbnQsIGVsZW1lbnRKc29uO1xuXHRcdGxldCBuZXdFbGVtZW50cyA6IEVsZW1lbnRbXSA9IFtdO1xuXHRcdGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5cdFx0bGV0IGVsZW1lbnRzSWRzUmVjZWl2ZWQgPSBlbGVtZW50TGlzdC5tYXAoIChlLCBpbmRleCkgPT4gIHsgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGUuaWQsXG4gICAgICAgIGluZGV4OiBpbmRleFxuICAgIH19KTtcblx0XHRcblx0XHRsZXQgbmV3SWRzID0gZWxlbWVudHNJZHNSZWNlaXZlZC5maWx0ZXIoKG9iaikgPT4ge3JldHVybiB0aGlzLmV2ZXJ5RWxlbWVudHNJZF8uaW5kZXhPZihvYmouaWQpIDwgMDt9KTtcblxuXHRcdC8vIGlmIChuZXdJZHMubGVuZ3RoICE9IGVsZW1lbnRMaXN0Lmxlbmd0aClcblx0XHQvLyBcdGNvbnNvbGUubG9nKFwiREVTIEFDVEVVUlMgRVhJU1RBSUVOVCBERUpBXCIsIGVsZW1lbnRMaXN0Lmxlbmd0aCAtIG5ld0lkcy5sZW5ndGgpXG5cblx0XHRsZXQgaSA9IG5ld0lkcy5sZW5ndGg7XG5cblx0XHR3aGlsZShpLS0pXG5cdFx0e1xuXHRcdFx0ZWxlbWVudEpzb24gPSBlbGVtZW50TGlzdFtuZXdJZHNbaV0uaW5kZXhdO1xuXG5cdFx0XHRlbGVtZW50ID0gbmV3IEVsZW1lbnQoZWxlbWVudEpzb24pO1xuXHRcdFx0ZWxlbWVudC5pbml0aWFsaXplKCk7XG5cblx0XHRcdGZvciAobGV0IG1haW5JZCBvZiBlbGVtZW50Lm1haW5PcHRpb25Pd25lcklkcylcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5ldmVyeUVsZW1lbnRzX1ttYWluSWRdLnB1c2goZWxlbWVudCk7XG5cdFx0XHR9XHRcdFx0XHRcblx0XHRcdHRoaXMuZXZlcnlFbGVtZW50c19bJ2FsbCddLnB1c2goZWxlbWVudCk7XG5cdFx0XHR0aGlzLmV2ZXJ5RWxlbWVudHNJZF8ucHVzaChlbGVtZW50LmlkKTtcblx0XHRcdG5ld0VsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0fVxuXHRcdHRoaXMuY2hlY2tDb29raWVzKCk7XG5cdFx0bGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdC8vY29uc29sZS5sb2coXCJBZGRKc29uRWxlbWVudHMgaW4gXCIgKyAoZW5kLXN0YXJ0KSArIFwiIG1zXCIpO1x0XG5cdFx0cmV0dXJuIG5ld0VsZW1lbnRzO1xuXHR9O1xuXG5cdHNob3dFbGVtZW50KGVsZW1lbnQgOiBFbGVtZW50KVxuXHR7XG5cdFx0ZWxlbWVudC5zaG93KCk7XG5cdFx0Ly9pZiAoIWVsZW1lbnQuaXNEaXNwbGF5ZWQpIEFwcC5tYXBDb21wb25lbnQuYWRkTWFya2VyKGVsZW1lbnQubWFya2VyLmdldExlYWZsZXRNYXJrZXIoKSk7XG5cdFx0dGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkucHVzaChlbGVtZW50KTtcblx0fVxuXG5cdGFkZEZhdm9yaXRlIChmYXZvcml0ZUlkIDogbnVtYmVyLCBtb2RpZnlDb29raWVzID0gdHJ1ZSlcblx0e1xuXHRcdGxldCBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChmYXZvcml0ZUlkKTtcblx0XHRpZiAoZWxlbWVudCAhPT0gbnVsbCkgZWxlbWVudC5pc0Zhdm9yaXRlID0gdHJ1ZTtcblx0XHRlbHNlIHJldHVybjtcblx0XHRcblx0XHRpZiAobW9kaWZ5Q29va2llcylcblx0XHR7XG5cdFx0XHR0aGlzLmZhdm9yaXRlSWRzXy5wdXNoKGZhdm9yaXRlSWQpO1xuXHRcdFx0Q29va2llcy5jcmVhdGVDb29raWUoJ0Zhdm9yaXRlSWRzJyxKU09OLnN0cmluZ2lmeSh0aGlzLmZhdm9yaXRlSWRzXykpO1x0XHRcblx0XHR9XG5cdH07XG5cblx0cmVtb3ZlRmF2b3JpdGUgKGZhdm9yaXRlSWQgOiBudW1iZXIsIG1vZGlmeUNvb2tpZXMgPSB0cnVlKVxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKGZhdm9yaXRlSWQpO1xuXHRcdGlmIChlbGVtZW50ICE9PSBudWxsKSBlbGVtZW50LmlzRmF2b3JpdGUgPSBmYWxzZTtcblx0XHRcblx0XHRpZiAobW9kaWZ5Q29va2llcylcblx0XHR7XG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmZhdm9yaXRlSWRzXy5pbmRleE9mKGZhdm9yaXRlSWQpO1xuXHRcdFx0aWYgKGluZGV4ID4gLTEpIHRoaXMuZmF2b3JpdGVJZHNfLnNwbGljZShpbmRleCwgMSk7XG5cblx0XHRcdENvb2tpZXMuY3JlYXRlQ29va2llKCdGYXZvcml0ZUlkcycsSlNPTi5zdHJpbmdpZnkodGhpcy5mYXZvcml0ZUlkc18pKTtcblx0XHR9XG5cdH07XG5cblx0Y2xlYXJDdXJyZW50c0VsZW1lbnQoKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImNsZWFyQ3VyckVsZW1lbnRzXCIpO1xuXHRcdGxldCBsID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubGVuZ3RoO1xuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHR0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5oaWRlKCk7XG5cdFx0XHR0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5pc0Rpc3BsYXllZCA9IGZhbHNlO1xuXHRcdH1cblx0XHRsZXQgbWFya2VycyA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLm1hcCggKGUpID0+IGUubWFya2VyLmdldExlYWZsZXRNYXJrZXIoKSk7XG5cdFx0QXBwLm1hcENvbXBvbmVudC5yZW1vdmVNYXJrZXJzKG1hcmtlcnMpO1xuXG5cdFx0dGhpcy5jbGVhckN1cnJWaXNpYmxlRWxlbWVudHMoKTtcblx0fVxuXG5cdHVwZGF0ZUVsZW1lbnRzSWNvbnMoc29tZXRoaW5nQ2hhbmdlZCA6IGJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJVcGRhdGVDdXJyRWxlbWVudHMgc29tZXRoaW5nQ2hhbmdlZFwiLCBzb21ldGhpbmdDaGFuZ2VkKTtcblx0XHRsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRsZXQgbCA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLmxlbmd0aDtcblx0XHRsZXQgZWxlbWVudCA6IEVsZW1lbnQ7XG5cdFx0d2hpbGUobC0tKVxuXHRcdHtcblx0XHRcdGVsZW1lbnQgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXTtcblx0XHRcdGlmIChzb21ldGhpbmdDaGFuZ2VkKSBlbGVtZW50Lm5lZWRUb0JlVXBkYXRlZFdoZW5TaG93biA9IHRydWU7XG5cblx0XHRcdC8vIGlmIGRvbU1hcmtlciBub3QgdmlzaWJsZSB0aGF0J3MgbWVhbiB0aGF0IG1hcmtlciBpcyBpbiBhIGNsdXN0ZXJcblx0XHRcdGlmIChlbGVtZW50Lm1hcmtlci5kb21NYXJrZXIoKS5pcygnOnZpc2libGUnKSkgZWxlbWVudC51cGRhdGUoKTtcblx0XHR9XG5cdFx0bGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGxldCB0aW1lID0gZW5kIC0gc3RhcnQ7XG5cdFx0Ly93aW5kb3cuY29uc29sZS5sb2coXCJ1cGRhdGVFbGVtZW50c0ljb25zIFwiICsgdGltZSArIFwiIG1zXCIpO1xuXHR9XG5cblx0Ly8gY2hlY2sgZWxlbWVudHMgaW4gYm91bmRzIGFuZCB3aG8gYXJlIG5vdCBmaWx0ZXJlZFxuXHR1cGRhdGVFbGVtZW50c1RvRGlzcGxheSAoY2hlY2tJbkFsbEVsZW1lbnRzID0gdHJ1ZSwgZm9yY2VSZXBhaW50ID0gZmFsc2UsIGZpbHRlckhhc0NoYW5nZWQgPSBmYWxzZSkgXG5cdHtcdFxuXHRcdC8vIGluIHRoZXNlIHN0YXRlLHRoZXJlIGlzIG5vIG5lZWQgdG8gdXBkYXRlIGVsZW1lbnRzIHRvIGRpc3BsYXlcblx0XHRpZiAoIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUgfHwgQXBwLnN0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucyApIFxuXHRcdFx0XHRcdCYmIEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCkgXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdGlmIChBcHAubW9kZSA9PSBBcHBNb2Rlcy5NYXAgJiYgIUFwcC5tYXBDb21wb25lbnQuaXNNYXBMb2FkZWQpIHJldHVybjtcblxuXHRcdGxldCBlbGVtZW50cyA6IEVsZW1lbnRbXSA9IG51bGw7XG5cdFx0aWYgKGNoZWNrSW5BbGxFbGVtZW50cyB8fCB0aGlzLnZpc2libGVFbGVtZW50c18ubGVuZ3RoID09PSAwKSBlbGVtZW50cyA9IHRoaXMuY3VyckV2ZXJ5RWxlbWVudHMoKTtcblx0XHRlbHNlIGVsZW1lbnRzID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCk7XG5cblx0XHQvL2VsZW1lbnRzID0gdGhpcy5jdXJyRXZlcnlFbGVtZW50cygpO1x0XHRcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKFwiVVBEQVRFIEVMRU1FTlRTIFwiLCBlbGVtZW50cy5sZW5ndGgpO1xuXG5cdFx0bGV0IGkgOiBudW1iZXIsIGVsZW1lbnQgOiBFbGVtZW50O1xuXHRcdGxldCBib3VuZHM7XG5cblx0IFx0bGV0IG5ld0VsZW1lbnRzIDogRWxlbWVudFtdID0gW107XG5cdCBcdGxldCBlbGVtZW50c1RvUmVtb3ZlIDogRWxlbWVudFtdID0gW107XG5cdCBcdGxldCBlbGVtZW50c0NoYW5nZWQgPSBmYWxzZTtcblxuXHRcdGxldCBmaWx0ZXJNb2R1bGUgPSBBcHAuZmlsdGVyTW9kdWxlO1x0XG5cblx0XHRpID0gZWxlbWVudHMubGVuZ3RoO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyhcInVwZGF0ZUVsZW1lbnRzVG9EaXNwbGF5LiBOYnJlIGVsZW1lbnQgw6AgdHJhaXRlciA6IFwiICsgaSwgY2hlY2tJbkFsbEVsZW1lbnRzKTtcblx0XHRcblx0XHRsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRcdHdoaWxlKGktLSAvKiYmIHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGggPCBBcHAuZ2V0TWF4RWxlbWVudHMoKSovKVxuXHRcdHtcblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcblxuXHRcdFx0Ly8gaW4gTGlzdCBtb2RlIHdlIGRvbid0IG5lZWQgdG8gY2hlY2sgYm91bmRzO1xuXHRcdFx0bGV0IGVsZW1lbnRJbkJvdW5kcyA9IChBcHAubW9kZSA9PSBBcHBNb2Rlcy5MaXN0KSB8fCBBcHAubWFwQ29tcG9uZW50LmV4dGVuZGVkQ29udGFpbnMoZWxlbWVudC5wb3NpdGlvbik7XG5cblx0XHRcdGlmICggZWxlbWVudEluQm91bmRzICYmIGZpbHRlck1vZHVsZS5jaGVja0lmRWxlbWVudFBhc3NGaWx0ZXJzKGVsZW1lbnQpKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoIWVsZW1lbnQuaXNEaXNwbGF5ZWQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlbGVtZW50LmlzRGlzcGxheWVkID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHRcdG5ld0VsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0ZWxlbWVudHNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoZWxlbWVudC5pc0Rpc3BsYXllZCkgXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlbGVtZW50LmlzRGlzcGxheWVkID0gZmFsc2U7XG5cdFx0XHRcdFx0ZWxlbWVudHNUb1JlbW92ZS5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGVsZW1lbnRzQ2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0bGV0IGluZGV4ID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkuaW5kZXhPZihlbGVtZW50KTtcblx0XHRcdFx0XHRpZiAoaW5kZXggPiAtMSkgdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGlmICh0aGlzLnZpc2libGVFbGVtZW50c18ubGVuZ3RoID49IEFwcC5nZXRNYXhFbGVtZW50cygpKVxuXHRcdC8vIHtcblx0XHQvLyBcdC8qJCgnI3Rvby1tYW55LW1hcmtlcnMtbW9kYWwnKS5zaG93KCkuZmFkZVRvKCA1MDAgLCAxKTtcblx0XHQvLyBcdHRoaXMuY2xlYXJNYXJrZXJzKCk7XHRcdFxuXHRcdC8vIFx0cmV0dXJuOyovXG5cdFx0Ly8gXHQvL2NvbnNvbGUubG9nKFwiVG9vbWFueSBtYXJrZXJzLiBOYnJlIG1hcmtlcnMgOiBcIiArIHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGggKyBcIiAvLyBNYXhNYXJrZXJzID0gXCIgKyBBcHAuZ2V0TWF4RWxlbWVudHMoKSk7XG5cdFx0Ly8gfVxuXHRcdC8vIGVsc2Vcblx0XHQvLyB7XG5cdFx0Ly8gXHQkKCcjdG9vLW1hbnktbWFya2Vycy1tb2RhbDp2aXNpYmxlJykuZmFkZVRvKDYwMCwwLCBmdW5jdGlvbigpeyAkKHRoaXMpLmhpZGUoKTsgfSk7XG5cdFx0Ly8gfVxuXG5cblx0XHRsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0bGV0IHRpbWUgPSBlbmQgLSBzdGFydDtcblx0XHQvL3dpbmRvdy5jb25zb2xlLmxvZyhcIlVwZGF0ZUVsZW1lbnRzVG9EaXNwbGF5IGVuIFwiICsgdGltZSArIFwiIG1zXCIpO1x0XHRcblxuXHRcdGlmIChlbGVtZW50c0NoYW5nZWQgfHwgZm9yY2VSZXBhaW50KVxuXHRcdHtcdFx0XG5cdFx0XHR0aGlzLm9uRWxlbWVudHNDaGFuZ2VkLmVtaXQoe1xuXHRcdFx0XHRlbGVtZW50c1RvRGlzcGxheTogdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCksIFxuXHRcdFx0XHRuZXdFbGVtZW50cyA6IG5ld0VsZW1lbnRzLCBcblx0XHRcdFx0ZWxlbWVudHNUb1JlbW92ZSA6IGVsZW1lbnRzVG9SZW1vdmVcblx0XHRcdH0pO1x0XHRcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZUVsZW1lbnRzSWNvbnMoZmlsdGVySGFzQ2hhbmdlZCk7XHRcdFxuXHR9O1xuXG5cdGN1cnJWaXNpYmxlRWxlbWVudHMoKSBcblx0e1xuXHRcdHJldHVybiB0aGlzLnZpc2libGVFbGVtZW50c19bQXBwLmN1cnJNYWluSWRdO1xuXHR9O1xuXG5cdGN1cnJFdmVyeUVsZW1lbnRzKCkgXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5ldmVyeUVsZW1lbnRzX1tBcHAuY3Vyck1haW5JZF07XG5cdH07XG5cblx0cHJpdmF0ZSBjbGVhckN1cnJWaXNpYmxlRWxlbWVudHMoKSBcblx0e1xuXHRcdHRoaXMudmlzaWJsZUVsZW1lbnRzX1tBcHAuY3Vyck1haW5JZF0gPSBbXTtcblx0fTtcblxuXHRhbGxFbGVtZW50cygpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5ldmVyeUVsZW1lbnRzX1snYWxsJ107XG5cdH1cblxuXHRjbGVhck1hcmtlcnMoKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coXCJjbGVhck1hcmtlcnNcIik7XG5cdFx0dGhpcy5oaWRlQWxsTWFya2VycygpO1xuXHRcdHRoaXMuY2xlYXJDdXJyVmlzaWJsZUVsZW1lbnRzKCk7XG5cdH07XG5cblx0Z2V0TWFya2VycyAoKSBcblx0e1xuXHRcdGxldCBtYXJrZXJzID0gW107XG5cdFx0bGV0IGwgPSB0aGlzLnZpc2libGVFbGVtZW50c18ubGVuZ3RoO1xuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHRtYXJrZXJzLnB1c2godGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1hcmtlcnM7XG5cdH07XG5cblx0aGlkZVBhcnRpYWxseUFsbE1hcmtlcnMgKCkgXG5cdHtcblx0XHR0aGlzLmlzU2hvd2luZ0hhbGZIaWRkZW4gPSB0cnVlO1xuXHRcdGxldCBsID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubGVuZ3RoO1x0XHRcblx0XHR3aGlsZShsLS0pXG5cdFx0e1xuXHRcdFx0aWYgKHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdLm1hcmtlcikgdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyLnNob3dIYWxmSGlkZGVuKCk7XG5cdFx0fVx0XHRcblx0fTtcblxuXHRoaWRlQWxsTWFya2VycyAoKSBcblx0e1xuXHRcdGxldCBsID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubGVuZ3RoO1xuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHR0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5oaWRlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdHNob3dOb3JtYWxIaWRkZW5BbGxNYXJrZXJzICgpIFxuXHR7XG5cdFx0dGhpcy5pc1Nob3dpbmdIYWxmSGlkZGVuID0gZmFsc2U7XG5cdFx0JCgnLm1hcmtlci1jbHVzdGVyJykucmVtb3ZlQ2xhc3MoJ2hhbGZIaWRkZW4nKTtcblx0XHRcblx0XHRsZXQgbCA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLmxlbmd0aDtcblx0XHR3aGlsZShsLS0pXG5cdFx0e1xuXHRcdFx0aWYgKHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdLm1hcmtlcikgdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyLnNob3dOb3JtYWxIaWRkZW4oKTtcblx0XHR9XG5cdH07XG5cblx0Z2V0RWxlbWVudEJ5SWQgKGVsZW1lbnRJZCkgOiBFbGVtZW50XG5cdHtcblx0XHQvL3JldHVybiB0aGlzLmV2ZXJ5RWxlbWVudHNfW2VsZW1lbnRJZF07XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFsbEVsZW1lbnRzKCkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLmFsbEVsZW1lbnRzKClbaV0uaWQgPT0gZWxlbWVudElkKSByZXR1cm4gdGhpcy5hbGxFbGVtZW50cygpW2ldO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcbn0iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuXG5cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBzbHVnaWZ5LCBjYXBpdGFsaXplLCBwYXJzZUFycmF5TnVtYmVySW50b1N0cmluZywgcGFyc2VTdHJpbmdJbnRvQXJyYXlOdW1iZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5pbXBvcnQgeyBPcHRpb259IGZyb20gXCIuLi9jbGFzc2VzL29wdGlvbi5jbGFzc1wiO1xuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vY2xhc3Nlcy9jYXRlZ29yeS5jbGFzc1wiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmltcG9ydCB7IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUgfSBmcm9tIFwiLi4vY2xhc3Nlcy9jYXRlZ29yeS1vcHRpb24tdHJlZS1ub2RlLmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuZXhwb3J0IGNsYXNzIEZpbHRlck1vZHVsZVxue1xuXHRzaG93T25seUZhdm9yaXRlXyA6IGJvb2xlYW4gPSBmYWxzZTtcblx0c2hvd1BlbmRpbmdfIDogYm9vbGVhbiA9IHRydWU7XG5cblx0Y29uc3RydWN0b3IoKSB7XHR9XG5cblx0c2hvd09ubHlGYXZvcml0ZShib29sIDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMuc2hvd09ubHlGYXZvcml0ZV8gPSBib29sO1xuXHR9O1xuXG5cdHNob3dQZW5kaW5nKGJvb2wgOiBib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5zaG93UGVuZGluZ18gPSBib29sO1xuXHR9O1xuXG5cdGNoZWNrSWZFbGVtZW50UGFzc0ZpbHRlcnMgKGVsZW1lbnQgOiBFbGVtZW50KSA6IGJvb2xlYW5cblx0e1xuXHRcdGlmICh0aGlzLnNob3dPbmx5RmF2b3JpdGVfKSByZXR1cm4gZWxlbWVudC5pc0Zhdm9yaXRlO1xuXG5cdFx0aWYoIXRoaXMuc2hvd1BlbmRpbmdfICYmIGVsZW1lbnQuaXNQZW5kaW5nKCkpIHJldHVybiBmYWxzZTtcblxuXHRcdGlmIChBcHAuY3Vyck1haW5JZCA9PSAnYWxsJylcblx0XHR7XG5cdFx0XHRsZXQgZWxlbWVudE9wdGlvbnMgPSBlbGVtZW50LmdldE9wdGlvblZhbHVlQnlDYXRlZ29yeUlkKCBBcHAuY2F0ZWdvcnlNb2R1bGUubWFpbkNhdGVnb3J5LmlkKTtcblx0XHRcdGxldCBjaGVja2VkT3B0aW9ucyA9IEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkuY2hlY2tlZE9wdGlvbnM7XG5cblx0XHRcdC8vY29uc29sZS5sb2coXCJcXG5lbGVtZW50c09wdGlvbnNcIiwgZWxlbWVudE9wdGlvbnMubWFwKCAodmFsdWUpID0+IHZhbHVlLm9wdGlvbi5uYW1lKSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiY2hlY2tlZE9wdGlvbnNcIiwgY2hlY2tlZE9wdGlvbnMubWFwKCAodmFsdWUpID0+IHZhbHVlLm5hbWUpKTtcblxuXHRcdFx0bGV0IHJlc3VsdCA9IGVsZW1lbnRPcHRpb25zLnNvbWUob3B0aW9uVmFsdWUgPT4gY2hlY2tlZE9wdGlvbnMuaW5kZXhPZihvcHRpb25WYWx1ZS5vcHRpb24pID4gLTEpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInJldHVyblwiLCByZXN1bHQpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdCA7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgbWFpbk9wdGlvbiA9IEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRDdXJyTWFpbk9wdGlvbigpO1x0XHRcdFxuXHRcdFx0bGV0IGlzUGFzc2luZ0ZpbHRlcnMgPSB0aGlzLnJlY3Vyc2l2ZWx5Q2hlY2tlZEluT3B0aW9uKG1haW5PcHRpb24sIGVsZW1lbnQpO1xuXHRcdFx0XG5cdFx0XHRpZiAoaXNQYXNzaW5nRmlsdGVycyAmJiBlbGVtZW50Lm9wZW5Ib3Vycylcblx0XHRcdHtcblx0XHRcdFx0aXNQYXNzaW5nRmlsdGVycyA9IGVsZW1lbnQub3BlbkhvdXJzRGF5cy5zb21lKCAoZGF5IDogYW55KSA9PiBBcHAuY2F0ZWdvcnlNb2R1bGUub3BlbkhvdXJzRmlsdGVyc0RheXMuaW5kZXhPZihkYXkpID4gLTEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaXNQYXNzaW5nRmlsdGVycztcblx0XHR9XHRcdFxuXHR9XG5cblx0cHJpdmF0ZSByZWN1cnNpdmVseUNoZWNrZWRJbk9wdGlvbihvcHRpb24gOiBPcHRpb24sIGVsZW1lbnQgOiBFbGVtZW50KSA6IGJvb2xlYW5cblx0e1xuXHRcdGxldCBlY2FydCA9IFwiXCI7XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IG9wdGlvbi5kZXB0aDsgaSsrKSBlY2FydCs9IFwiLS1cIjtcblxuXHRcdGxldCBsb2cgPSBmYWxzZTtcblxuXHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKGVjYXJ0ICsgXCJDaGVjayBmb3Igb3B0aW9uIFwiLCBvcHRpb24ubmFtZSk7XG5cblx0XHRsZXQgcmVzdWx0O1xuXHRcdGlmIChvcHRpb24uc3ViY2F0ZWdvcmllcy5sZW5ndGggPT0gMCB8fCAob3B0aW9uLmlzRGlzYWJsZWQgJiYgIW9wdGlvbi5pc01haW5PcHRpb24pIClcblx0XHR7XG5cdFx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhlY2FydCArIFwiTm8gc3ViY2F0ZWdvcmllcyBcIik7XG5cdFx0XHRyZXN1bHQgPSBvcHRpb24uaXNDaGVja2VkO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmVzdWx0ID0gb3B0aW9uLnN1YmNhdGVnb3JpZXMuZXZlcnkoIChjYXRlZ29yeSkgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGxvZykgY29uc29sZS5sb2coXCItLVwiICsgZWNhcnQgKyBcIkNhdGVnb3J5XCIsIGNhdGVnb3J5Lm5hbWUpO1xuXG5cdFx0XHRcdGxldCBjaGVja2VkT3B0aW9ucyA9IGNhdGVnb3J5LmNoZWNrZWRPcHRpb25zO1xuXHRcdFx0XHRsZXQgZWxlbWVudE9wdGlvbnMgPSBlbGVtZW50LmdldE9wdGlvblZhbHVlQnlDYXRlZ29yeUlkKGNhdGVnb3J5LmlkKTtcblxuXHRcdFx0XHRsZXQgaXNTb21lT3B0aW9uSW5DYXRlZ29yeUNoZWNrZWRPcHRpb25zID0gZWxlbWVudE9wdGlvbnMuc29tZShvcHRpb25WYWx1ZSA9PiBjaGVja2VkT3B0aW9ucy5pbmRleE9mKG9wdGlvblZhbHVlLm9wdGlvbikgPiAtMSk7IFxuXG5cdFx0XHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKFwiLS1cIiArIGVjYXJ0ICsgXCJpc1NvbWVPcHRpb25JbkNhdGVnb3J5Q2hlY2tlZE9wdGlvbnNcIiwgaXNTb21lT3B0aW9uSW5DYXRlZ29yeUNoZWNrZWRPcHRpb25zKTtcblx0XHRcdFx0aWYgKGlzU29tZU9wdGlvbkluQ2F0ZWdvcnlDaGVja2VkT3B0aW9ucylcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhcIi0tXCIgKyBlY2FydCArIFwiU28gd2UgY2hlY2tlZCBpbiBzdWJvcHRpb25zXCIsIGNhdGVnb3J5Lm5hbWUpO1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50T3B0aW9ucy5zb21lKCAob3B0aW9uVmFsdWUpID0+IHRoaXMucmVjdXJzaXZlbHlDaGVja2VkSW5PcHRpb24ob3B0aW9uVmFsdWUub3B0aW9uLCBlbGVtZW50KSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhlY2FydCArIFwiUmV0dXJuIFwiLCByZXN1bHQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRsb2FkRmlsdGVyc0Zyb21TdHJpbmcoc3RyaW5nIDogc3RyaW5nKVxuXHR7XG5cdFx0bGV0IHNwbGl0ZWQgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHRsZXQgbWFpbk9wdGlvblNsdWcgPSBzcGxpdGVkWzBdO1xuXG5cdFx0bGV0IG1haW5PcHRpb25JZCA9IG1haW5PcHRpb25TbHVnID09ICdhbGwnID8gJ2FsbCcgOiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbkJ5U2x1ZyhtYWluT3B0aW9uU2x1ZykuaWQ7XG5cdFx0QXBwLmRpcmVjdG9yeU1lbnVDb21wb25lbnQuc2V0TWFpbk9wdGlvbihtYWluT3B0aW9uSWQpO1x0XHRcblxuXHRcdGxldCBmaWx0ZXJzU3RyaW5nIDogc3RyaW5nO1xuXHRcdGxldCBhZGRpbmdNb2RlIDogYm9vbGVhbjtcblxuXHRcdGlmICggc3BsaXRlZC5sZW5ndGggPT0gMilcblx0XHR7XG5cdFx0XHRmaWx0ZXJzU3RyaW5nID0gc3BsaXRlZFsxXTtcblxuXHRcdFx0aWYgKGZpbHRlcnNTdHJpbmdbMF0gPT0gJyEnKSBhZGRpbmdNb2RlID0gZmFsc2U7XG5cdFx0XHRlbHNlIGFkZGluZ01vZGUgPSB0cnVlO1xuXG5cdFx0XHRmaWx0ZXJzU3RyaW5nID0gZmlsdGVyc1N0cmluZy5zdWJzdHJpbmcoMSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBzcGxpdGVkLmxlbmd0aCA+IDIpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIHNwbGl0aW5nIGluIGxvYWRGaWx0ZXJGcm9tU3RyaW5nXCIpO1xuXHRcdH1cblxuXHRcdGxldCBmaWx0ZXJzID0gcGFyc2VTdHJpbmdJbnRvQXJyYXlOdW1iZXIoZmlsdGVyc1N0cmluZyk7XG5cblx0XHQvL2NvbnNvbGUubG9nKCdmaWx0ZXJzJywgZmlsdGVycyk7XG5cdFx0Ly9jb25zb2xlLmxvZygnYWRkaW5nTW9kZScsIGFkZGluZ01vZGUpO1xuXG5cdFx0Ly8gaWYgYWRkaW5nTW9kZSwgd2UgZmlyc3QgcHV0IGFsbCB0aGUgZmlsdGVyIHRvIGZhbHNlXG5cdFx0aWYgKGFkZGluZ01vZGUpXG5cdFx0e1xuXHRcdFx0aWYgKG1haW5PcHRpb25TbHVnID09ICdhbGwnKVxuXHRcdFx0XHRBcHAuY2F0ZWdvcnlNb2R1bGUubWFpbkNhdGVnb3J5LnRvZ2dsZShmYWxzZSwgZmFsc2UpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBjYXQgb2YgQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25CeVNsdWcobWFpbk9wdGlvblNsdWcpLnN1YmNhdGVnb3JpZXMpXG5cdFx0XHRcdFx0Zm9yKGxldCBvcHRpb24gb2YgY2F0Lm9wdGlvbnMpIG9wdGlvbi50b2dnbGUoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdFx0QXBwLmNhdGVnb3J5TW9kdWxlLm9wZW5Ib3Vyc0NhdGVnb3J5LnRvZ2dsZShmYWxzZSwgZmFsc2UpO1xuXHRcdH1cblxuXHRcdGZvcihsZXQgZmlsdGVySWQgb2YgZmlsdGVycylcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE9wdGlvbkJ5SWQoZmlsdGVySWQpO1xuXHRcdFx0aWYgKCFvcHRpb24pIGNvbnNvbGUubG9nKFwiRXJyb3IgbG9hZGluZ3MgZmlsdGVycyA6IFwiICsgZmlsdGVySWQpO1xuXHRcdFx0ZWxzZSBvcHRpb24udG9nZ2xlKGFkZGluZ01vZGUsIGZhbHNlKTtcblx0XHR9XG5cblx0XHRpZiAobWFpbk9wdGlvblNsdWcgPT0gJ2FsbCcpIEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkudXBkYXRlU3RhdGUoKTtcblx0XHRlbHNlIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9uQnlTbHVnKG1haW5PcHRpb25TbHVnKS5yZWN1cnNpdmVseVVwZGF0ZVN0YXRlcygpO1xuXG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudHNUb0Rpc3BsYXkodHJ1ZSk7XG5cdFx0Ly9BcHAuaGlzdG9yeU1vZHVsZS51cGRhdGVDdXJyU3RhdGUoKTtcblxuXHR9XG5cblx0Z2V0RmlsdGVyc1RvU3RyaW5nKCkgOiBzdHJpbmdcblx0e1xuXHRcdGxldCBtYWluT3B0aW9uSWQgPSBBcHAuY3Vyck1haW5JZDtcblxuXHRcdGxldCBtYWluT3B0aW9uTmFtZTtcblx0XHRsZXQgY2hlY2tBcnJheVRvUGFyc2UsIHVuY2hlY2tBcnJheVRvUGFyc2U7XG5cdFx0XG5cdFx0aWYgKG1haW5PcHRpb25JZCA9PSAnYWxsJylcblx0XHR7XHRcdFx0XG5cdFx0XHRtYWluT3B0aW9uTmFtZSA9IFwiYWxsXCI7XG5cdFx0XHRjaGVja0FycmF5VG9QYXJzZSA9IEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkuY2hlY2tlZE9wdGlvbnMubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXHRcdFx0dW5jaGVja0FycmF5VG9QYXJzZSA9IEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkuZGlzYWJsZWRPcHRpb25zLm1hcCggKG9wdGlvbikgPT4gb3B0aW9uLmlkKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGxldCBtYWluT3B0aW9uID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25CeUlkKG1haW5PcHRpb25JZCk7XG5cdFx0XHRtYWluT3B0aW9uTmFtZSA9IG1haW5PcHRpb24ubmFtZVNob3J0O1xuXG5cdFx0XHRsZXQgYWxsT3B0aW9ucyA9IG1haW5PcHRpb24uYWxsQ2hpbGRyZW5PcHRpb25zO1xuXG5cdFx0XHRjaGVja0FycmF5VG9QYXJzZSA9IGFsbE9wdGlvbnMuZmlsdGVyKCAob3B0aW9uKSA9PiBvcHRpb24uaXNDaGVja2VkICkubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXHRcdFx0dW5jaGVja0FycmF5VG9QYXJzZSA9IGFsbE9wdGlvbnMuZmlsdGVyKCAob3B0aW9uKSA9PiBvcHRpb24uaXNEaXNhYmxlZCApLm1hcCggKG9wdGlvbikgPT4gb3B0aW9uLmlkKTtcblxuXHRcdFx0aWYgKG1haW5PcHRpb24uc2hvd09wZW5Ib3VycykgXG5cdFx0XHR7XG5cdFx0XHRcdGNoZWNrQXJyYXlUb1BhcnNlID0gY2hlY2tBcnJheVRvUGFyc2UuY29uY2F0KEFwcC5jYXRlZ29yeU1vZHVsZS5vcGVuSG91cnNDYXRlZ29yeS5jaGVja2VkT3B0aW9ucy5tYXAoIChvcHRpb24pID0+IG9wdGlvbi5pZCkpO1xuXHRcdFx0XHR1bmNoZWNrQXJyYXlUb1BhcnNlID0gdW5jaGVja0FycmF5VG9QYXJzZS5jb25jYXQoQXBwLmNhdGVnb3J5TW9kdWxlLm9wZW5Ib3Vyc0NhdGVnb3J5LmRpc2FibGVkT3B0aW9ucy5tYXAoIChvcHRpb24pID0+IG9wdGlvbi5pZCkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBjaGVja2VkSWRzUGFyc2VkID0gcGFyc2VBcnJheU51bWJlckludG9TdHJpbmcoY2hlY2tBcnJheVRvUGFyc2UpO1xuXHRcdGxldCB1bmNoZWNrZWRJZHNQYXJzZWQgPSBwYXJzZUFycmF5TnVtYmVySW50b1N0cmluZyh1bmNoZWNrQXJyYXlUb1BhcnNlKTtcblxuXHRcdGxldCBhZGRpbmdNb2RlID0gKGNoZWNrZWRJZHNQYXJzZWQubGVuZ3RoIDwgdW5jaGVja2VkSWRzUGFyc2VkLmxlbmd0aCk7XG5cblx0XHRsZXQgYWRkaW5nU3ltYm9sID0gYWRkaW5nTW9kZSA/ICcrJyA6ICchJztcblxuXHRcdGxldCBmaWx0ZXJzU3RyaW5nID0gYWRkaW5nTW9kZSA/IGNoZWNrZWRJZHNQYXJzZWQgOiB1bmNoZWNrZWRJZHNQYXJzZWQ7XG5cblx0XHRpZiAoIWFkZGluZ01vZGUgJiYgZmlsdGVyc1N0cmluZyA9PSBcIlwiICkgcmV0dXJuIG1haW5PcHRpb25OYW1lO1xuXG5cdFx0cmV0dXJuIG1haW5PcHRpb25OYW1lICsgJ0AnICsgYWRkaW5nU3ltYm9sICsgZmlsdGVyc1N0cmluZztcblx0fVxufSIsImRlY2xhcmUgbGV0IEdlb2NvZGVySlM7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIHZhciBMLCAkO1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgc2x1Z2lmeSwgY2FwaXRhbGl6ZSwgdW5zbHVnaWZ5IH0gZnJvbSBcIi4uLy4uL2NvbW1vbnMvY29tbW9uc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdlb2NvZGVSZXN1bHRcbntcblx0Z2V0Q29vcmRpbmF0ZXMoKSA6IEwuTGF0TG5nVHVwbGU7XG5cdGdldEZvcm1hdHRlZEFkZHJlc3MoKSA6IHN0cmluZztcdFxuXHRnZXRCb3VuZHMoKSA6IFJhd0JvdW5kcztcbn1cblxuLy8gc291dGgsIHdlc3QsIG5vcnRoLCBlYXN0XG5leHBvcnQgdHlwZSBSYXdCb3VuZHMgPSBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcblxuLyoqXG4qIEludGVyZmFjZSBiZXR3ZWVuIEdlb2NvZGVySlMgYW5kIHRoZSBBcHBcbiogQWxsb3cgdG8gY2hhbmdlIGdlb2NvZGUgdGVjaG5vbG9neSB3aXRob3V0IGNoYW5naW5nIGNvZGUgaW4gdGhlIEFwcFxuKi9cbmV4cG9ydCBjbGFzcyBHZW9jb2Rlck1vZHVsZVxue1xuXHRnZW9jb2RlciA6IGFueSA9IG51bGw7XG5cdGxhc3RBZGRyZXNzUmVxdWVzdCA6IHN0cmluZyA9ICcnO1xuXHRsYXN0UmVzdWx0cyA6IEdlb2NvZGVSZXN1bHRbXSA9IG51bGw7XG5cdGxhc3RSZXN1bHRCb3VuZHMgOiBMLkxhdExuZ0JvdW5kcyA9IG51bGw7XG5cblx0Z2V0TG9jYXRpb24oKSA6IEwuTGF0TG5nXG5cdHtcblx0XHRpZiAoIXRoaXMubGFzdFJlc3VsdHMgfHwgIXRoaXMubGFzdFJlc3VsdHNbMF0pIHJldHVybiBudWxsO1xuXHRcdHJldHVybiBMLmxhdExuZyh0aGlzLmxhc3RSZXN1bHRzWzBdLmdldENvb3JkaW5hdGVzKCkpO1xuXHR9XG5cblx0Z2V0Qm91bmRzKCkgOiBMLkxhdExuZ0JvdW5kc1xuXHR7XG5cdFx0aWYgKCF0aGlzLmxhc3RSZXN1bHRCb3VuZHMpIHJldHVybiBudWxsO1xuXHRcdHJldHVybiB0aGlzLmxhc3RSZXN1bHRCb3VuZHM7XG5cdH1cblxuXHRwcml2YXRlIGxhdExuZ0JvdW5kc0Zyb21SYXdCb3VuZHMocmF3Ym91bmRzIDogUmF3Qm91bmRzKSA6IEwuTGF0TG5nQm91bmRzXG5cdHtcblx0XHRsZXQgY29ybmVyMSA9IEwubGF0TG5nKHJhd2JvdW5kc1swXSwgcmF3Ym91bmRzWzFdKTtcblx0XHRsZXQgY29ybmVyMiA9IEwubGF0TG5nKHJhd2JvdW5kc1syXSwgcmF3Ym91bmRzWzNdKTtcblx0XHRyZXR1cm4gTC5sYXRMbmdCb3VuZHMoY29ybmVyMSwgY29ybmVyMik7XG5cdH1cblxuXHRnZXRMb2NhdGlvblNsdWcoKSA6IHN0cmluZyB7IHJldHVybiBzbHVnaWZ5KHRoaXMubGFzdEFkZHJlc3NSZXF1ZXN0KTsgfVxuXHRnZXRMb2NhdGlvbkFkZHJlc3MoKSA6IHN0cmluZyB7IHJldHVybiB0aGlzLmxhc3RBZGRyZXNzUmVxdWVzdDsgfVxuXG5cdHNldExvY2F0aW9uQWRkcmVzcygkYWRkcmVzcyA6IHN0cmluZykgeyB0aGlzLmxhc3RBZGRyZXNzUmVxdWVzdCA9ICRhZGRyZXNzOyB9XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5nZW9jb2RlciA9IEdlb2NvZGVySlMuY3JlYXRlR2VvY29kZXIoeyAncHJvdmlkZXInOiAnb3BlbnN0cmVldG1hcCcsICdjb3VudHJ5Y29kZXMnIDogJ2ZyJ30pO1xuXHRcdC8vdGhpcy5nZW9jb2RlciA9IEdlb2NvZGVySlMuY3JlYXRlR2VvY29kZXIoeydwcm92aWRlcic6ICdnb29nbGUnfSk7XG5cdH1cblxuXHRnZW9jb2RlQWRkcmVzcyggYWRkcmVzcywgY2FsbGJhY2tDb21wbGV0ZT8sIGNhbGxiYWNrRmFpbD8gKSB7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiZ2VvY29kZSBhZGRyZXNzIDogXCIsIGFkZHJlc3MpO1xuXHRcdHRoaXMubGFzdEFkZHJlc3NSZXF1ZXN0ID0gYWRkcmVzcztcblxuXHRcdC8vIGlmIG5vIGFkZHJlc3MsIHdlIHNob3cgZnJhbmNlXG5cdFx0aWYgKGFkZHJlc3MgPT0gJycpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJkZWZhdWx0IGxvY2F0aW9uXCIpO1xuXHRcdFx0dGhpcy5sYXN0UmVzdWx0cyA9IFtdO1xuXHRcdFx0dGhpcy5sYXN0UmVzdWx0Qm91bmRzID0gdGhpcy5sYXRMbmdCb3VuZHNGcm9tUmF3Qm91bmRzKFs1MS42ODYxNzk1NDg1NTYyNCw4LjgzMzAwNzgxMjUwMDAwMiw0Mi4zMDk4MTU0MTU2ODY2NjQsIC01LjMzOTM1NTQ2ODc1MDAwMV0pO1xuXG5cdFx0XHQvLyBsZWF2ZSB0aW1lIGZvciBtYXAgdG8gbG9hZFxuXHRcdFx0c2V0VGltZW91dCggKCkgPT4geyBjYWxsYmFja0NvbXBsZXRlKHRoaXMubGFzdFJlc3VsdHMpOyB9LCAyMDApO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Ly8gZmFrZSBnZW9jb2RlciB3aGVuIG5vIGludGVybmV0IGNvbm5leGlvblxuXHRcdFx0bGV0IGZha2UgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCFmYWtlKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmdlb2NvZGVyLmdlb2NvZGUoIGFkZHJlc3MsIChyZXN1bHRzIDogR2VvY29kZVJlc3VsdFtdKSA9PlxuXHRcdFx0XHR7XHRcdFx0XG5cdFx0XHRcdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIFxuXHRcdFx0XHRcdHtcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dGhpcy5sYXN0UmVzdWx0cyA9IHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR0aGlzLmxhc3RSZXN1bHRCb3VuZHMgPSB0aGlzLmxhdExuZ0JvdW5kc0Zyb21SYXdCb3VuZHModGhpcy5sYXN0UmVzdWx0c1swXS5nZXRCb3VuZHMoKSk7XG5cblx0XHRcdFx0XHRcdGlmIChjYWxsYmFja0NvbXBsZXRlKSBjYWxsYmFja0NvbXBsZXRlKHJlc3VsdHMpO1x0XG5cdFx0XHRcdFx0fSBcdFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tGYWlsKSBjYWxsYmFja0ZhaWwoKTtcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcmVzdWx0ID0ge1xuXHRcdFx0XHRcdGJvdW5kczogWy4wNjkxODUsLTAuNjQxNDE1LDQ0LjE4NDczNTEsLTAuNDY5OTgzNV0sXG5cdFx0XHRcdFx0Y2l0eTogJ0xhYnJpdCcsXG5cdFx0XHRcdFx0Zm9ybWF0dGVkQWRkcmVzczogXCJMYWJyaXQgNDA0MjBcIixcblx0XHRcdFx0XHRsYXRpdHVkZTo0NC4xMDQ5NTY3LFxuXHRcdFx0XHRcdGxvbmdpdHVkZTotMC41NDQ1Mjk2LFxuXHRcdFx0XHRcdHBvc3RhbF9jb2RlOlwiNDA0MjBcIixcblx0XHRcdFx0XHRyZWdpb246XCJOb3V2ZWxsZS1BcXVpdGFpbmVcIixcblx0XHRcdFx0XHRnZXRCb3VuZHMoKSB7IHJldHVybiB0aGlzLmJvdW5kczsgfSxcblx0XHRcdFx0XHRnZXRDb29yZGluYXRlcygpIHsgcmV0dXJuIFt0aGlzLmxhdGl0dWRlLCB0aGlzLmxvbmdpdHVkZV07IH0sXG5cdFx0XHRcdFx0Z2V0Rm9ybWF0dGVkQWRkcmVzcygpIHsgcmV0dXJuIHRoaXMuZm9ybWF0dGVkQWRkcmVzczsgfVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHJlc3VsdHMgPSBbXTtcblx0XHRcdFx0cmVzdWx0cy5wdXNoKHJlc3VsdCk7XG5cblx0XHRcdFx0dGhpcy5sYXN0UmVzdWx0cyA9IHJlc3VsdHM7XG5cdFx0XHRcdHRoaXMubGFzdFJlc3VsdEJvdW5kcyA9IHRoaXMubGF0TG5nQm91bmRzRnJvbVJhd0JvdW5kcyh0aGlzLmxhc3RSZXN1bHRzWzBdLmdldEJvdW5kcygpKTtcblxuXHRcdFx0XHRjYWxsYmFja0NvbXBsZXRlKHJlc3VsdHMpO1xuXHRcdFx0fVx0XG5cdFx0fVx0XHRcdFxuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vdXRpbHMvZXZlbnRcIjtcbmltcG9ydCB7IHNsdWdpZnksIGNhcGl0YWxpemUgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmltcG9ydCB7IFZpZXdQb3J0IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvbWFwL21hcC5jb21wb25lbnRcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSBsZXQgJDtcbmRlY2xhcmUgbGV0IFJvdXRpbmc7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKClcbntcdFxuICAgLy8gR2V0cyBoaXN0b3J5IHN0YXRlIGZyb20gYnJvd3NlclxuICAgd2luZG93Lm9ucG9wc3RhdGUgPSAoZXZlbnQgOiBQb3BTdGF0ZUV2ZW50KSA9PlxuICAge1xuXHQgIC8vY29uc29sZS5sb2coXCJcXG5cXG5PbnBvcFN0YXRlIFwiLCBldmVudC5zdGF0ZS5maWx0ZXJzKTtcblx0ICBsZXQgaGlzdG9yeXN0YXRlIDogSGlzdG9yeVN0YXRlID0gZXZlbnQuc3RhdGU7XG5cdCAgLy8gdHJhbnNmb3JtIGpzb25WaWV3cG9ydCBpbnRvIFZpZXdQb3J0IG9iamVjdCAoaWYgd2UgZG9uJ3QgZG8gc28sXG5cdCAgLy8gdGhlIFZpZXdQb3J0IG1ldGhvZHMgd2lsbCBub3QgYmUgYWNjZXNzaWJsZSlcblx0ICBoaXN0b3J5c3RhdGUudmlld3BvcnQgPSAkLmV4dGVuZChuZXcgVmlld1BvcnQoKSwgZXZlbnQuc3RhdGUudmlld3BvcnQpO1xuXHQgIEFwcC5sb2FkSGlzdG9yeVN0YXRlKGV2ZW50LnN0YXRlLCB0cnVlKTtcblx0fTtcbn0pO1xuXG5leHBvcnQgY2xhc3MgSGlzdG9yeVN0YXRlXG57XG5cdG1vZGU6IEFwcE1vZGVzO1xuXHRzdGF0ZSA6IEFwcFN0YXRlcztcblx0YWRkcmVzcyA6IHN0cmluZztcblx0dmlld3BvcnQgOiBWaWV3UG9ydDtcblx0aWQgOiBudW1iZXI7XG5cdGZpbHRlcnMgOiBzdHJpbmc7XG5cblx0cGFyc2UoJGhpc3RvcnlTdGF0ZSA6IGFueSkgOiBIaXN0b3J5U3RhdGVcblx0e1xuXHRcdHRoaXMubW9kZSA9ICRoaXN0b3J5U3RhdGUubW9kZSA9PSAnTWFwJyA/IEFwcE1vZGVzLk1hcCA6IEFwcE1vZGVzLkxpc3Q7XG5cdFx0dGhpcy5zdGF0ZSA9IHBhcnNlSW50KEFwcFN0YXRlc1skaGlzdG9yeVN0YXRlLnN0YXRlXSk7XG5cdFx0dGhpcy5hZGRyZXNzID0gJGhpc3RvcnlTdGF0ZS5hZGRyZXNzO1xuXHRcdHRoaXMudmlld3BvcnQgPSBuZXcgVmlld1BvcnQoKS5mcm9tU3RyaW5nKCRoaXN0b3J5U3RhdGUudmlld3BvcnQpO1xuXHRcdHRoaXMuaWQgPSAkaGlzdG9yeVN0YXRlLmlkO1xuXHRcdHRoaXMuZmlsdGVycyA9ICRoaXN0b3J5U3RhdGUuZmlsdGVycztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgSGlzdG9yeU1vZHVsZVxue1xuXG5cdGNvbnN0cnVjdG9yKCkgeyB9ICBcblxuXHR1cGRhdGVDdXJyU3RhdGUob3B0aW9ucz8pXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiVXBkYXRlIEN1cnIgU3RhdGVcIik7XG5cdFx0aWYgKCFoaXN0b3J5LnN0YXRlKSB7IGNvbnNvbGUubG9nKFwiY3VyciBzdGF0ZSBudWxsXCIpO3RoaXMucHVzaE5ld1N0YXRlKCk7fVxuXHRcdHRoaXMudXBkYXRlSGlzdG9yeShmYWxzZSwgb3B0aW9ucyk7XG5cdH07XG5cblx0cHVzaE5ld1N0YXRlKG9wdGlvbnM/KVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIlB1c2ggTmV3IFN0YXRlXCIpO1xuXG5cdFx0aWYgKGhpc3Rvcnkuc3RhdGUgPT09IG51bGwpIHRoaXMudXBkYXRlSGlzdG9yeShmYWxzZSwgb3B0aW9ucyk7XG5cdFx0ZWxzZSB0aGlzLnVwZGF0ZUhpc3RvcnkodHJ1ZSwgb3B0aW9ucyk7XG5cdFx0XG5cdH07XG5cblx0cHJpdmF0ZSB1cGRhdGVIaXN0b3J5KCRwdXNoU3RhdGUgOiBib29sZWFuLCAkb3B0aW9ucz8gOiBhbnkpXG5cdHtcblx0XHRpZiAoQXBwLm1vZGUgPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cblx0XHQkb3B0aW9ucyA9ICRvcHRpb25zIHx8IHt9O1xuXHRcdGxldCBoaXN0b3J5U3RhdGUgPSBuZXcgSGlzdG9yeVN0YXRlO1xuXHRcdGhpc3RvcnlTdGF0ZS5tb2RlID0gQXBwLm1vZGU7XG5cdFx0aGlzdG9yeVN0YXRlLnN0YXRlID0gQXBwLnN0YXRlO1xuXHRcdGhpc3RvcnlTdGF0ZS5hZGRyZXNzID0gQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uU2x1ZygpO1xuXHRcdGhpc3RvcnlTdGF0ZS52aWV3cG9ydCA9IEFwcC5tYXBDb21wb25lbnQudmlld3BvcnQ7XG5cdFx0aGlzdG9yeVN0YXRlLmlkID0gQXBwLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpIHx8ICRvcHRpb25zLmlkO1xuXHRcdGhpc3RvcnlTdGF0ZS5maWx0ZXJzID0gQXBwLmZpbHRlck1vZHVsZS5nZXRGaWx0ZXJzVG9TdHJpbmcoKTtcblxuXHRcdC8vIGlmICgkcHVzaFN0YXRlKSBjb25zb2xlLmxvZyhcIk5FVyBTYXRlXCIsIGhpc3RvcnlTdGF0ZS5maWx0ZXJzKTtcblx0XHQvLyBlbHNlIGNvbnNvbGUubG9nKFwiVVBEQVRFIFN0YXRlXCIsIGhpc3RvcnlTdGF0ZS5maWx0ZXJzKTtcblxuXHRcdGxldCByb3V0ZSA9IHRoaXMuZ2VuZXJhdGVSb3V0ZShoaXN0b3J5U3RhdGUpO1xuXG5cdFx0aWYgKCFyb3V0ZSkgcmV0dXJuO1xuXG5cdFx0aWYgKCRwdXNoU3RhdGUpXG5cdFx0e1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgcm91dGUpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIlB1c2hpbmcgbmV3IHN0YXRlXCIsIGhpc3RvcnlTdGF0ZSk7XG5cdFx0fVxuXHRcdGVsc2UgXG5cdFx0e1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIlJlcGxhY2Ugc3RhdGVcIiwgaGlzdG9yeVN0YXRlKTtcblx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKGhpc3RvcnlTdGF0ZSwgJycsIHJvdXRlKTtcblx0XHR9XG5cdH07XG5cblx0cHJpdmF0ZSBnZW5lcmF0ZVJvdXRlKGhpc3RvcnlTdGF0ZSA6IEhpc3RvcnlTdGF0ZSlcblx0e1xuXHRcdGxldCByb3V0ZTtcblx0XHRsZXQgbW9kZSA9IEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCA/ICdjYXJ0ZScgOiAnbGlzdGUnO1xuXHRcdGxldCBhZGRyZXNzID0gaGlzdG9yeVN0YXRlLmFkZHJlc3M7XG5cdFx0bGV0IHZpZXdwb3J0ID0gaGlzdG9yeVN0YXRlLnZpZXdwb3J0O1xuXHRcdGxldCBhZGRyZXNzQW5kVmlld3BvcnQgPSAnJztcblx0XHRpZiAoYWRkcmVzcykgYWRkcmVzc0FuZFZpZXdwb3J0ICs9IGFkZHJlc3M7XG5cdFx0Ly8gaW4gTWFwIE1vZGUgd2UgYWRkIHZpZXdwb3J0XG5cdFx0Ly8gaW4gTGlzdCBtb2RlIHdlIGFkZCB2aWV3cG9ydCBvbmx5IHdoZW4gbm8gYWRkcmVzcyBwcm92aWRlZFxuXHRcdGlmICh2aWV3cG9ydCAmJiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwIHx8ICFhZGRyZXNzKSkgYWRkcmVzc0FuZFZpZXdwb3J0ICs9IHZpZXdwb3J0LnRvU3RyaW5nKCk7XG5cblx0XHQvLyBpbiBsaXN0IG1vZGUgd2UgZG9uJ3QgY2FyZSBhYm91dCBzdGF0ZVxuXHRcdGlmIChBcHAubW9kZSA9PSBBcHBNb2Rlcy5MaXN0KVxuXHRcdHtcblx0XHRcdHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2RpcmVjdG9yeV9ub3JtYWwnLCB7IG1vZGUgOiAgbW9kZSB9KTtcdFxuXHRcdFx0aWYgKGFkZHJlc3NBbmRWaWV3cG9ydCkgcm91dGUgKz0gJy8nICsgYWRkcmVzc0FuZFZpZXdwb3J0O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0c3dpdGNoIChBcHAuc3RhdGUpXG5cdFx0XHR7XG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLk5vcm1hbDpcdFxuXHRcdFx0XHRcdHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2RpcmVjdG9yeV9ub3JtYWwnLCB7IG1vZGUgOiAgbW9kZSB9KTtcdFxuXHRcdFx0XHRcdC8vIGZvcmpzcm91dGluZyBkb2Vzbid0IHN1cHBvcnQgc3BlYWNpYWwgY2hhcmFjdHMgbGlrZSBpbiB2aWV3cG9ydFxuXHRcdFx0XHRcdC8vIHNvIHdlIGFkZCB0aGVtIG1hbnVhbGx5XG5cdFx0XHRcdFx0aWYgKGFkZHJlc3NBbmRWaWV3cG9ydCkgcm91dGUgKz0gJy8nICsgYWRkcmVzc0FuZFZpZXdwb3J0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50Olx0XG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmU6XG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zOlxuXHRcdFx0XHRcdGlmICghaGlzdG9yeVN0YXRlLmlkKSByZXR1cm47XG5cdFx0XHRcdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudEJ5SWQoaGlzdG9yeVN0YXRlLmlkKTtcblx0XHRcdFx0XHRpZiAoIWVsZW1lbnQpIHJldHVybjtcdFx0XG5cblx0XHRcdFx0XHRpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9kaXJlY3Rvcnlfc2hvd0RpcmVjdGlvbnMnLCB7IG5hbWUgOiAgY2FwaXRhbGl6ZShzbHVnaWZ5KGVsZW1lbnQubmFtZSkpLCBpZCA6IGVsZW1lbnQuaWQgfSk7XHRcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fZGlyZWN0b3J5X3Nob3dFbGVtZW50JywgeyBuYW1lIDogIGNhcGl0YWxpemUoc2x1Z2lmeShlbGVtZW50Lm5hbWUpKSwgaWQgOiBlbGVtZW50LmlkIH0pO1x0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGZvcmpzcm91dGluZyBkb2Vzbid0IHN1cHBvcnQgc3BlYWNpYWwgY2hhcmFjdHMgbGlrZSBpbiB2aWV3cG9ydFxuXHRcdFx0XHRcdC8vIHNvIHdlIGFkZCB0aGVtIG1hbnVhbGx5XG5cdFx0XHRcdFx0aWYgKGFkZHJlc3NBbmRWaWV3cG9ydCkgcm91dGUgKz0gJy8nICsgYWRkcmVzc0FuZFZpZXdwb3J0O1x0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Ly8gY2FzZSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHQvLyBcdGJyZWFrO1x0XHRcdFxuXHRcdFx0fVx0XHRcblx0XHR9XG5cblx0XHRpZiAoaGlzdG9yeVN0YXRlLmZpbHRlcnMpIHJvdXRlICs9ICc/Y2F0PScgKyBoaXN0b3J5U3RhdGUuZmlsdGVycztcblx0XHRcblx0XHRcblx0XHRcblx0XHQvLyBmb3IgKGxldCBrZXkgaW4gb3B0aW9ucylcblx0XHQvLyB7XG5cdFx0Ly8gXHRyb3V0ZSArPSAnPycgKyBrZXkgKyAnPScgKyBvcHRpb25zW2tleV07XG5cdFx0Ly8gXHQvL3JvdXRlICs9ICcvJyArIGtleSArICcvJyArIG9wdGlvbnNba2V5XTtcblx0XHQvLyB9XG5cblx0XHQvL2NvbnNvbGUubG9nKFwicm91dGUgZ2VuZXJhdGVkXCIsIHJvdXRlKTtcblxuXHRcdHJldHVybiByb3V0ZTtcblx0fTtcbn0iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMDgtMzFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvb2tpZShuYW1lLHZhbHVlKSBcbntcblx0bGV0IGRheXMgPSAxMDA7XG5cblx0bGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkrKGRheXMqMjQqNjAqNjAqMTAwMCkpO1xuXHRsZXQgZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiK2RhdGUudG9VVENTdHJpbmcoKTtcblx0XG5cdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUrXCI9XCIrdmFsdWUrZXhwaXJlcytcIjsgcGF0aD0vXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkQ29va2llKG5hbWUpIHtcblx0bGV0IG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcblx0bGV0IGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG5cdGZvcihsZXQgaT0wO2kgPCBjYS5sZW5ndGg7aSsrKSB7XG5cdFx0bGV0IGMgPSBjYVtpXTtcblx0XHR3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSxjLmxlbmd0aCk7XG5cdFx0aWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCxjLmxlbmd0aCk7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG5cdGNyZWF0ZUNvb2tpZShuYW1lLFwiXCIpO1xufSIsImV4cG9ydCBpbnRlcmZhY2UgSUV2ZW50PFQ+IHtcbiAgICBkbyhoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkgOiB2b2lkO1xuICAgIG9mZihoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkgOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgRXZlbnQ8VD4gaW1wbGVtZW50cyBJRXZlbnQ8VD4ge1xuICAgIHByaXZhdGUgaGFuZGxlcnM6IHsgKGRhdGE/OiBUKTogdm9pZDsgfVtdID0gW107XG5cbiAgICBwdWJsaWMgZG8oaGFuZGxlcjogeyAoZGF0YT86IFQpOiB2b2lkIH0pIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvZmYoaGFuZGxlcjogeyAoZGF0YT86IFQpOiB2b2lkIH0pIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHRoaXMuaGFuZGxlcnMuZmlsdGVyKGggPT4gaCAhPT0gaGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIGVtaXQoZGF0YT86IFQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zbGljZSgwKS5mb3JFYWNoKGggPT4gaChkYXRhKSk7XG4gICAgfVxufSJdfQ==
