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

},{"../directory/utils/event":27}],3:[function(require,module,exports){
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

var _appInteractions = require("./app-interactions");

var _elementMenu = require("./components/element-menu.component");

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
    App.loadHistoryState();
    (0, _appInteractions.initializeAppInteractions)();
    (0, _elementMenu.initializeElementMenu)();
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
                this.ajaxModule.getElementsAroundLocation(location_1, 30);
            }
        }
        this.setMode(historystate.mode, $backFromHistory, false);
        // if address is provided we geolocalize
        // if no viewport and state normal we geocode on default location
        if (historystate.address || !historystate.viewport && historystate.state === AppStates.Normal) {
            this.geocoderModule_.geocodeAddress(historystate.address, function (results) {
                // if viewport is given, nothing to do, we already did initialization
                // with viewport
                if (historystate.viewport) return;
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
        var _this = this;
        if ($backFromHistory === void 0) {
            $backFromHistory = false;
        }
        if ($updateTitleAndState === void 0) {
            $updateTitleAndState = true;
        }
        if ($mode != this.mode_) {
            if ($mode == AppModes.Map) {
                this.mapComponent_.onIdle.do(function () {
                    _this.handleMapIdle();
                });
                this.mapComponent_.onClick.do(function () {
                    _this.handleMapClick();
                });
                $('#directory-content-map').show();
                $('#directory-content-list').hide();
                this.mapComponent.init();
            } else {
                this.mapComponent_.onIdle.off(function () {
                    _this.handleMapIdle();
                });
                this.mapComponent_.onClick.off(function () {
                    _this.handleMapClick();
                });
                $('#directory-content-map').hide();
                $('#directory-content-list').show();
            }
            // if previous mode wasn't null 
            var oldMode = this.mode_;
            this.mode_ = $mode;
            // update history if we need to
            if (oldMode != null && !$backFromHistory && $mode == AppModes.List) this.historyModule.pushNewState();
            this.elementModule.clearCurrentsElement();
            this.elementModule.updateElementToDisplay(true, true);
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
                        _this.ajaxModule.getElementsAroundLocation(_this.mapComponent.getCenter(), _this.mapComponent.mapRadiusInKm() * 2);
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
            this.elementModule.clearCurrentsElement();
            this.elementModule.updateElementToDisplay(true, true);
            this.ajaxModule.getElementsAroundLocation(this.geocoder.getLocation(), 30);
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
        //console.log("App handle map idle, mapLoaded : " , this.mapComponent.isMapLoaded);
        var _this = this;
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
        // sometimes idle event is fired but map is not yet initialized (somes millisecond
        // after it will be)
        // let delay = this.mapComponent.isMapLoaded ? 0 : 100;
        // setTimeout(() => {
        // }, delay);	
        this.elementModule.updateElementToDisplay(updateInAllElementList, forceRepaint);
        this.ajaxModule.getElementsAroundLocation(this.mapComponent.getCenter(), this.mapComponent.mapRadiusInKm() * 2);
        this.historyModule.updateCurrState();
    };
    ;
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
        var newelements = this.elementModule.addJsonElements(elementsJson, true);
        if (newelements > 0) this.elementModule.updateElementToDisplay();
    };
    ;
    AppModule.prototype.handleElementsChanged = function (result) {
        //console.log("handleElementsChanged new : ", result);
        if (this.mode_ == AppModes.List) {
            this.elementListComponent.update(result);
        } else if (this.state != AppStates.ShowElementAlone) {
            for (var _i = 0, _a = result.newElements; _i < _a.length; _i++) {
                var element = _a[_i];
                element.show();
            }
            for (var _b = 0, _c = result.elementsToRemove; _b < _c.length; _b++) {
                var element = _c[_b];
                if (!element.isShownAlone) element.hide();
            }
        }
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
    AppModule.prototype.clusterer = function () {
        return this.mapComponent_ ? this.mapComponent_.getClusterer() : null;
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

},{"../commons/commons":1,"../commons/search-bar.component":2,"./app-interactions":3,"./components/directory-menu.component":12,"./components/element-list.component":13,"./components/element-menu.component":14,"./components/info-bar.component":15,"./components/map/map.component":17,"./modules/ajax.module":18,"./modules/categories.module":19,"./modules/directions.module":20,"./modules/display-element-alone.module":21,"./modules/elements.module":22,"./modules/filter.module":23,"./modules/geocoder.module":24,"./modules/history.module":25}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CategoryOptionTreeNode = exports.CategoryOptionTreeNodeType = undefined;

var _app = require("../app.module");

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
            if (App.mode == _app.AppModes.Map) App.elementModule.updateCurrentsElements();
            App.elementModule.updateElementToDisplay(check);
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

},{"../app.module":4}],6:[function(require,module,exports){
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
exports.Element = undefined;

var _app = require("../app.module");

var _biopenMarker = require("../components/map/biopen-marker.component");

var _classes = require("./classes");

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
        this.id = elementJson.id;
        this.name = elementJson.name;
        this.position = L.latLng(elementJson.lat, elementJson.lng);
        this.address = elementJson.address;
        this.description = elementJson.description || '';
        this.tel = elementJson.tel ? elementJson.tel.replace(/(.{2})(?!$)/g, "$1 ") : '';
        this.webSite = elementJson.web_site;
        this.mail = elementJson.mail;
        this.openHours = elementJson.open_hours;
        this.openHoursMoreInfos = elementJson.open_hours_more_infos;
        // initialize formated open hours
        this.getFormatedOpenHours();
        var newOption, ownerId;
        for (var _i = 0, _a = elementJson.option_values; _i < _a.length; _i++) {
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
        if (!this.isInitialized_) {
            this.createOptionsTree();
            this.updateIconsToDisplay();
            this.biopenMarker_ = new _biopenMarker.BiopenMarker(this.id, this.position);
            this.isInitialized_ = true;
        }
    };
    Element.prototype.show = function () {
        this.update();
        //this.biopenMarker_.update();
        this.biopenMarker_.show();
        this.isVisible_ = true;
    };
    ;
    Element.prototype.hide = function () {
        if (this.biopenMarker_) this.biopenMarker_.hide();
        this.isVisible_ = false;
        // unbound events (click etc...)?
        //if (constellationMode) $('#directory-content-list #element-info-'+this.id).hide();
    };
    ;
    Element.prototype.update = function () {
        if (!this.isInitialized_) this.initialize();else {
            this.updateIconsToDisplay();
            if (this.marker) this.marker.update();
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
        this.colorOptionId = this.iconsToDisplay.length > 0 ? this.getIconsToDisplay()[0].option.ownerColorId : null;
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
                optionValue;
            }
        }
        return resultOptions;
    };
    Element.prototype.checkForDisabledOptionValues = function () {
        this.recursivelyCheckForDisabledOptionValues(this.getOptionTree());
    };
    Element.prototype.recursivelyCheckForDisabledOptionValues = function (optionValue) {
        var isEveryCategoryContainsOneOptionNotdisabled = true;
        for (var _i = 0, _a = optionValue.children; _i < _a.length; _i++) {
            var categoryValue = _a[_i];
            var isSomeOptionNotdisabled = false;
            for (var _b = 0, _c = categoryValue.children; _b < _c.length; _b++) {
                var suboptionValue = _c[_b];
                if (suboptionValue.children.length == 0) {
                    //console.log("bottom option " + suboptionValue.option.name,suboptionValue.option.isChecked );
                    suboptionValue.isFilledByFilters = suboptionValue.option.isChecked;
                } else {
                    this.recursivelyCheckForDisabledOptionValues(suboptionValue);
                }
                if (suboptionValue.isFilledByFilters) isSomeOptionNotdisabled = true;
            }
            if (!isSomeOptionNotdisabled) isEveryCategoryContainsOneOptionNotdisabled = false;
        }
        if (optionValue.option) {
            //console.log("OptionValue " + optionValue.option.name + "isEveryCategoyrContainOnOption", isEveryCategoryContainsOneOptionNotdisabled );
            optionValue.isFilledByFilters = isEveryCategoryContainsOneOptionNotdisabled;
            if (!optionValue.isFilledByFilters) optionValue.setRecursivelyFilledByFilters(false);
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
            mainOptionValueToDisplay: optionstoDisplay[0],
            otherOptionsValuesToDisplay: optionstoDisplay.slice(1),
            starNames: starNames,
            mainCategoryValue: this.getOptionTree().children[0]
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
}(); /**
      * This file is part of the MonVoisinFaitDuBio project.
      * For the full copyright and license information, please view the LICENSE
      * file that was distributed with this source code.
      *
      * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
      * @license    MIT License
      * @Last Modified time: 2016-12-13
      */
exports.Element = Element;

},{"../app.module":4,"../components/map/biopen-marker.component":16,"./classes":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var OptionValue = function () {
    function OptionValue($optionValueJson) {
        this.option_ = null;
        this.children = [];
        this.optionId = $optionValueJson.option_id;
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
        return _this;
    }
    Object.defineProperty(Option.prototype, "ownerColorId", {
        get: function get() {
            if (this.myOwnerColorId !== null) return this.myOwnerColorId;
            if (!this.useColorForMarker) {
                var option = this;
                var colorId = null;
                while (colorId == null && option) {
                    option = option.getOwner();
                    if (option) {
                        option = option.getOwner();
                        colorId = option.useColorForMarker ? option.id : null;
                    }
                }
                this.myOwnerColorId = colorId;
            } else {
                this.myOwnerColorId = this.id;
            }
            return this.myOwnerColorId;
        },
        enumerable: true,
        configurable: true
    });
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
            App.elementModule.updateElementToDisplay(!checkValue);
            favoriteCheckbox.prop('checked', checkValue);
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        $('#filter-favorite').tooltip();
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
        $('.subcategorie-option-item:not(#filter-favorite) .icon-name-wrapper').click(function (e) {
            var optionId = $(this).attr('data-option-id');
            var option = App.categoryModule.getOptionById(optionId);
            option.isCollapsible() ? option.toggleChildrenDetail() : option.toggle();
        });
        $('.subcategorie-option-item:not(#filter-favorite) .checkbox-wrapper').click(function (e) {
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
        App.elementModule.updateElementToDisplay(true, true);
        App.elementModule.updateCurrentsElements();
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
            var location_1 = App.geocoder.getLocation();
            if (location_1) {
                var distance = this.lastDistanceRequest * 5;
                this.lastDistanceRequest = distance;
                //console.log("list isn't full -> Ajax request");
                //let maxResults = 20;
                App.ajaxModule.getElementsAroundLocation(location_1, distance);
            } else {
                // if location isn't available we diplay elements visible from the
                // current map view 
                App.ajaxModule.getElementsAroundLocation(App.mapComponent.getCenter(), App.mapComponent.mapRadiusInKm());
            }
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

},{"../../commons/commons":1,"./element-menu.component":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeElementMenu = initializeElementMenu;
exports.updateFavoriteIcon = updateFavoriteIcon;
exports.showFullTextMenu = showFullTextMenu;
exports.createListenersForElementMenu = createListenersForElementMenu;

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
    if (App.mode == _app.AppModes.Map) {
        return $('#element-info-bar').find('.element-item').attr('data-element-id');
    }
    return parseInt($('.element-item.active').attr('data-element-id'));
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
        //console.log("showElement", this.isDisplayedAside());
        // if element already visible
        if (this.elementVisible) {
            this.elementVisible.marker.showNormalSize(true);
        }
        this.elementVisible = element;
        element.updateDistance();
        $('#element-info').html(element.getHtmlRepresentation());
        var domMenu = $('#element-info-bar .menu-element');
        domMenu.attr('option-id', element.colorOptionId);
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

},{"../app-interactions":3,"../utils/event":27,"./element-menu.component":14}],16:[function(require,module,exports){
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
        this.update();
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
            disableMarker: disableMarker
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
    BiopenMarker.prototype.getRichMarker = function () {
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
        App.mapComponent.addMarker(this.richMarker_);
        //this.richMarker_.addTo(App.map());
        if (App.state == _app.AppStates.Constellation) this.polyline_.setMap(App.map());
    };
    ;
    BiopenMarker.prototype.hide = function () {
        App.mapComponent.removeMarker(this.richMarker_);
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
        this.clusterer_ = null;
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
        return this.map_ ? this.map_.getBounds() : null;
    };
    MapComponent.prototype.getClusterer = function () {
        return this.clusterer_;
    };
    ;
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
            spiderfyMaxCount: 8,
            spiderfyDistanceMultiplier: 1.1,
            maxClusterRadius: function maxClusterRadius(zoom) {
                if (zoom > 9) return 55;else return 100;
            }
        });
        this.map_.addLayer(this.markerClustererGroup);
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
    MapComponent.prototype.removeMarker = function (marker) {
        this.markerClustererGroup.removeLayer(marker);
    };
    // fit map view to bounds
    MapComponent.prototype.fitBounds = function (bounds, animate) {
        if (animate === void 0) {
            animate = true;
        }
        console.log("fitbounds", bounds);
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
        if (this.isMapLoaded && position) {
            return this.map_.getBounds().contains(position);
        }
        console.log("MapComponent->contains : map not loaded or element position undefined");
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

},{"../../app.module":4,"../../utils/event":27}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AjaxModule = exports.Request = undefined;

var _event = require("../utils/event");

var Request = function () {
    function Request(lat, lng, distance, maxResults) {
        this.originLat = lat;
        this.originLng = lng;
        this.distance = distance;
        this.maxResults = maxResults;
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

var AjaxModule = function () {
    function AjaxModule() {
        this.onNewElements = new _event.Event();
        this.isRetrievingElements = false;
        this.requestWaitingToBeExecuted = false;
        this.waitingRequest = null;
        this.currRequest = null;
        this.loaderTimer = null;
    }
    AjaxModule.prototype.getElementsAroundLocation = function ($location, $distance, $maxResults) {
        if ($maxResults === void 0) {
            $maxResults = 0;
        }
        // if invalid location we abort
        if (!$location || !$location.lat) {
            console.log("Ajax invalid request return", $location);
            return;
        }
        // there is a limit in ajax data, we can not send more thant a thousand ids
        // so for the moment is quite useless to send theses id. See if we manage to
        // change server config to send more thant 1000 ids;
        //let $allIds = App.elementModule.getAllElementsIds();
        this.getElements(new Request($location.lat, $location.lng, $distance, $maxResults));
    };
    AjaxModule.prototype.getElements = function ($request) {
        var _this = this;
        if (this.isRetrievingElements) {
            this.requestWaitingToBeExecuted = true;
            this.waitingRequest = $request;
            return;
        }
        this.currRequest = $request;
        var start = new Date().getTime();
        var route = Routing.generate('biopen_api_elements_around_location');
        //console.log("Ajax get elements request  elementsId = ", $request.elementIds.length);
        $.ajax({
            url: route,
            method: "post",
            data: {
                originLat: $request.originLat,
                originLng: $request.originLng,
                distance: $request.distance,
                maxResults: $request.maxResults
            },
            beforeSend: function beforeSend() {
                _this.isRetrievingElements = true;
                _this.loaderTimer = setTimeout(function () {
                    $('#directory-loading').show();
                }, 2000);
            },
            success: function success(response) {
                //console.log("Ajax response", response.data[0]);
                if (response.data !== null) {
                    var end = new Date().getTime();
                    //console.log("receive " + response.data.length + " elements in " + (end-start) + " ms");				
                    _this.onNewElements.emit(response.data);
                }
                if (response.exceedMaxResult) {
                    //console.log("   moreElementsToReceive");
                    if (!_this.requestWaitingToBeExecuted) {
                        _this.getElements(_this.currRequest);
                    }
                }
            },
            complete: function complete() {
                _this.isRetrievingElements = false;
                clearTimeout(_this.loaderTimer);
                if (_this.requestWaitingToBeExecuted) {
                    //console.log("    requestWaitingToBeExecuted stored", this.waitingRequest);
                    _this.getElements(_this.waitingRequest);
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
                if (response.data) {
                    var end = new Date().getTime();
                    //window.console.log("receive elementById in " + (end-start) + " ms", response.data);			
                    if (callbackSuccess) callbackSuccess(response.data);
                } else if (callbackFailure) callbackFailure(response.data);
            },
            error: function error(response) {
                if (callbackFailure) callbackFailure(response);
            }
        });
    };
    ;
    return AjaxModule;
}();
exports.AjaxModule = AjaxModule;

},{"../utils/event":27}],19:[function(require,module,exports){
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
    return CategoriesModule;
}();
exports.CategoriesModule = CategoriesModule;

},{"../classes/category.class":7,"../classes/option.class":11}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
        App.elementModule.updateElementToDisplay(true, true);
        //}
        this.elementShownAlone_.isShownAlone = false;
        this.elementShownAlone_ = null;
    };
    ;
    return DisplayElementAloneModule;
}();
exports.DisplayElementAloneModule = DisplayElementAloneModule;

},{}],22:[function(require,module,exports){
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
        if (checkIfAlreadyExist === void 0) {
            checkIfAlreadyExist = true;
        }
        var element, elementJson;
        var newElementsCount = 0;
        //console.log("ElementModule adds " + elementList.length);
        for (var i = 0; i < elementList.length; i++) {
            elementJson = elementList[i].Element ? elementList[i].Element : elementList[i];
            if (!checkIfAlreadyExist || !this.getElementById(elementJson.id)) {
                element = new _element.Element(elementJson);
                for (var _i = 0, _a = element.mainOptionOwnerIds; _i < _a.length; _i++) {
                    var mainId = _a[_i];
                    this.everyElements_[mainId].push(element);
                }
                this.everyElements_['all'].push(element);
                newElementsCount++;
            } else {}
        }
        this.checkCookies();
        //console.log("ElementModule really added " + newElementsCount);
        return newElementsCount;
    };
    ;
    ElementsModule.prototype.showElement = function (element) {
        element.show();
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
        this.clearCurrVisibleElements();
    };
    ElementsModule.prototype.updateCurrentsElements = function () {
        //console.log("UpdateCurrElements");
        var l = this.currVisibleElements().length;
        while (l--) {
            this.currVisibleElements()[l].update();
        }
    };
    // check elements in bounds and who are not filtered
    ElementsModule.prototype.updateElementToDisplay = function (checkInAllElements, forceRepaint) {
        if (checkInAllElements === void 0) {
            checkInAllElements = true;
        }
        if (forceRepaint === void 0) {
            forceRepaint = false;
        }
        // in these state,there is no need to update elements to display
        if ((App.state == _app.AppStates.ShowElementAlone || App.state == _app.AppStates.ShowDirections) && App.mode != _app.AppModes.List) return;
        var elements = null;
        if (checkInAllElements || this.visibleElements_.length === 0) elements = this.currEveryElements();else elements = this.currVisibleElements();
        //console.log("UPDATE ELEMENTS ", elements.length);
        var i, element;
        var bounds;
        var newElements = [];
        var elementsToRemove = [];
        var elementsChanged = false;
        var filterModule = App.filterModule;
        i = elements.length;
        //console.log("UpdateElementToDisplay. Nbre element à traiter : " + i, checkInAllElements);
        var start = new Date().getTime();
        while (i-- /*&& this.visibleElements_.length < App.getMaxElements()*/) {
            element = elements[i];
            // in List mode we don't need to check bounds;
            var elementInBounds = App.mode == _app.AppModes.List || App.mapComponent.contains(element.position);
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
        //window.console.log("    analyse elements en " + time + " ms");	
        if (elementsChanged || forceRepaint) {
            this.onElementsChanged.emit({
                elementsToDisplay: this.currVisibleElements(),
                newElements: newElements,
                elementsToRemove: elementsToRemove
            });
        }
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
        return this.visibleElements_[App.currMainId] = [];
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

},{"../app.module":4,"../classes/element.class":9,"../utils/cookies":26,"../utils/event":27}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterModule = undefined;

var _commons = require("../../commons/commons");

var FilterModule = function () {
    function FilterModule() {
        this.showOnlyFavorite_ = false;
    }
    FilterModule.prototype.showOnlyFavorite = function (bool) {
        this.showOnlyFavorite_ = bool;
    };
    ;
    FilterModule.prototype.checkIfElementPassFilters = function (element) {
        if (this.showOnlyFavorite_) return element.isFavorite;
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
        if (option.subcategories.length == 0 || option.isDisabled) {
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
        App.elementModule.updateElementToDisplay(true);
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

},{"../../commons/commons":1}],24:[function(require,module,exports){
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

},{"../../commons/commons":1}],25:[function(require,module,exports){
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

},{"../../commons/commons":1,"../app.module":4,"../components/map/map.component":17}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvY29tbW9ucy9jb21tb25zLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2NvbW1vbnMvc2VhcmNoLWJhci5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2FwcC1pbnRlcmFjdGlvbnMudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2FwcC5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NsYXNzZXMvY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jYXRlZ29yeS12YWx1ZS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jYXRlZ29yeS5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY2xhc3Nlcy9jbGFzc2VzLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jbGFzc2VzL2VsZW1lbnQuY2xhc3MudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NsYXNzZXMvb3B0aW9uLXZhbHVlLmNsYXNzLnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jbGFzc2VzL29wdGlvbi5jbGFzcy50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9kaXJlY3RvcnktbWVudS5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvZWxlbWVudC1saXN0LmNvbXBvbmVudC50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9lbGVtZW50LW1lbnUuY29tcG9uZW50LnRzIiwic3JjL0Jpb3Blbi9HZW9EaXJlY3RvcnlCdW5kbGUvUmVzb3VyY2VzL2pzL2RpcmVjdG9yeS9jb21wb25lbnRzL2luZm8tYmFyLmNvbXBvbmVudC50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvY29tcG9uZW50cy9tYXAvYmlvcGVuLW1hcmtlci5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L2NvbXBvbmVudHMvbWFwL21hcC5jb21wb25lbnQudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvYWpheC5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvY2F0ZWdvcmllcy5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvZGlyZWN0aW9ucy5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvZGlzcGxheS1lbGVtZW50LWFsb25lLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9lbGVtZW50cy5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvZmlsdGVyLm1vZHVsZS50cyIsInNyYy9CaW9wZW4vR2VvRGlyZWN0b3J5QnVuZGxlL1Jlc291cmNlcy9qcy9kaXJlY3RvcnkvbW9kdWxlcy9nZW9jb2Rlci5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L21vZHVsZXMvaGlzdG9yeS5tb2R1bGUudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L3V0aWxzL2Nvb2tpZXMudHMiLCJzcmMvQmlvcGVuL0dlb0RpcmVjdG9yeUJ1bmRsZS9SZXNvdXJjZXMvanMvZGlyZWN0b3J5L3V0aWxzL2V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OzZCQ1dvQyxBQUFLLE9BQUUsQUFBZ0MsU0FBRSxBQUFVO0FBQTVDLDRCQUFBO0FBQUEsa0JBQVUsQUFBQyxFQUFDLEFBQWEsQUFBQyxlQUFDLEFBQUcsQUFBRTs7QUFBRSwwQkFBQTtBQUFBLGdCQUFVOztBQUVuRixBQUFFLEFBQUMsUUFBQyxDQUFDLEFBQUssQUFBQyxPQUFDLEFBQU0sT0FBQyxBQUFRLFNBQUMsQUFBSSxPQUFHLEFBQU8sUUFBQyxBQUFRLFNBQUMsQUFBSyxPQUFFLEVBQUUsQUFBSSxNQUFHLEFBQU8sUUFBQyxBQUFPLEFBQUMsQUFBRSxBQUFDLEFBQUMsQUFDeEYsQUFBSSxpQkFBQyxBQUFNLE9BQUMsQUFBUSxTQUFDLEFBQUksT0FBRyxBQUFPLFFBQUMsQUFBUSxTQUFDLEFBQUssT0FBRSxFQUFFLEFBQUksTUFBRyxBQUFPLFFBQUMsQUFBTyxBQUFDLFVBQUUsQUFBUSxVQUFHLEFBQUssQUFBQyxBQUFDLEFBQUMsQUFDdEc7QUFBQyxBQUVELEFBQU07aUJBQWtCLEFBQUk7QUFFMUIsQUFBRSxBQUFDLFFBQUMsQ0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDO0FBQ3JCLEFBQU0sZ0JBQU0sQUFBUSxBQUFFLFdBQUEsQUFBZ0I7QUFBL0IsQUFBSSxLQUNSLEFBQU8sUUFBQyxBQUFNLFFBQUUsQUFBRyxBQUFDLEtBQVcsQUFBd0I7S0FDdkQsQUFBTyxRQUFDLEFBQVcsYUFBRSxBQUFFLEFBQUMsSUFBTyxBQUE0QjtLQUMzRCxBQUFPLFFBQUMsQUFBUSxVQUFFLEFBQUcsQUFBQyxLQUFTLEFBQW1DO0tBQ2xFLEFBQU8sUUFBQyxBQUFLLE9BQUUsQUFBRSxBQUFDLElBQWEsQUFBNEI7S0FDM0QsQUFBTyxRQUFDLEFBQUssT0FBRSxBQUFFLEFBQUMsQUFBQyxLQUFZLEFBQTBCLEFBQzlEO0FBQUMsQUFFRCxBQUFNO21CQUFvQixBQUFhO0FBRXJDLEFBQUUsQUFBQyxRQUFDLENBQUMsQUFBSSxBQUFDLE1BQUMsQUFBTSxPQUFDLEFBQUUsQUFBQztBQUNyQixBQUFNLFdBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxXQUFDLEFBQU8sUUFBQyxBQUFNLFFBQUUsQUFBRyxBQUFDLEFBQUMsQUFDOUM7QUFBQyxBQUVELEFBQU07b0JBQXFCLEFBQUk7QUFFM0IsQUFBTSxXQUFDLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBQyxHQUFDLEFBQUMsQUFBQyxHQUFDLEFBQVcsQUFBRSxnQkFBQyxBQUFJLEtBQUMsQUFBTSxPQUFDLEFBQUMsR0FBQyxBQUFJLEtBQUMsQUFBTSxBQUFDLFFBQUMsQUFBVyxBQUFFLEFBQUMsQUFDbkY7QUFBQyxBQUVELEFBQU07d0JBQXlCLEFBQUU7QUFFN0IsQUFBRSxTQUFHLEFBQUUsR0FBQyxBQUFLLE1BQUMsQUFBRyxBQUFDLEtBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDO0FBQzdCLFFBQUksQUFBTSxTQUFHLEFBQUU7UUFDWCxBQUFNO1FBQ04sQUFBRSxLQUFHLEFBQXVCLEFBQUM7QUFFakMsQUFBTyxXQUFDLEFBQU0sU0FBRyxBQUFFLEdBQUMsQUFBSSxLQUFDLEFBQUUsQUFBQyxBQUFDLEtBQUUsQUFBQztBQUM1QixBQUFNLGVBQUMsQUFBa0IsbUJBQUMsQUFBTSxPQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUMsT0FBRyxBQUFrQixtQkFBQyxBQUFNLE9BQUMsQUFBQyxBQUFDLEFBQUMsQUFBQyxBQUMxRTtBQUFDO0FBRUQsQUFBTSxXQUFDLEFBQU0sQUFBQyxBQUNsQjtBQUFDLEFBRUQsQUFBTTtvQ0FBcUMsQUFBZ0I7QUFFdkQsUUFBSSxBQUFNLFNBQUksQUFBRSxBQUFDO0FBQ2pCLFFBQUksQUFBQyxJQUFHLEFBQUMsQUFBQztBQUVWLEFBQUcsU0FBZSxTQUFLLEdBQUwsVUFBSyxPQUFMLGFBQUssUUFBTCxBQUFLO0FBQW5CLFlBQUksQUFBTSxpQkFBQTtBQUVWLEFBQUUsQUFBQyxZQUFDLEFBQUMsSUFBRyxBQUFDLEtBQUksQUFBQyxBQUFDLEdBQ2YsQUFBQztBQUNHLEFBQU0sc0JBQUksQUFBbUIsb0JBQUMsQUFBTSxBQUFDLEFBQUMsQUFDMUM7QUFBQyxBQUNELEFBQUksZUFDSixBQUFDO0FBQ0csQUFBTSxzQkFBSSxBQUFNLE9BQUMsQUFBUSxBQUFFLEFBQUMsQUFDaEM7QUFBQztBQUNELEFBQUMsQUFBRSxBQUFDO0FBQ1A7QUFFRCxBQUFNLFdBQUMsQUFBTSxBQUFDLEFBQ2xCO0FBQUM7QUFFRCw2QkFBNkIsQUFBZTtBQUV4QyxRQUFJLEFBQU0sU0FBRyxBQUFNLE9BQUMsQUFBUSxTQUFDLEFBQUUsQUFBQyxBQUFDO0FBQ2pDLFFBQUksQUFBQyxJQUFHLEFBQUMsQUFBQztBQUNWLFFBQUksQUFBTSxTQUFHLEFBQU0sT0FBQyxBQUFNLEFBQUM7QUFFM0IsUUFBSSxBQUFNLFNBQUcsQUFBRSxBQUFDO0FBRWhCLEFBQUcsQUFBQyxTQUFDLEFBQUMsSUFBRyxBQUFDLEdBQUUsQUFBQyxJQUFHLEFBQU0sUUFBRSxBQUFDLEFBQUUsS0FDM0IsQUFBQztBQUNDLEFBQU0sa0JBQUksQUFBTSxPQUFDLEFBQVksYUFBQyxBQUFFLEtBQUcsQUFBUSxTQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUMsSUFBQyxBQUFFLEFBQUMsQUFBQyxBQUFDLEFBQzdEO0FBQUM7QUFFRCxBQUFNLFdBQUMsQUFBTSxBQUFDLEFBQ2xCO0FBQUM7QUFFRCw2QkFBNkIsQUFBZTtBQUV4QyxRQUFJLEFBQUMsSUFBRyxBQUFDLEFBQUM7QUFDVixRQUFJLEFBQU0sU0FBRyxBQUFNLE9BQUMsQUFBTSxBQUFDO0FBRTNCLFFBQUksQUFBTSxTQUFHLEFBQUMsQUFBQztBQUVmLEFBQUcsQUFBQyxTQUFDLEFBQUMsSUFBRyxBQUFNLFNBQUcsQUFBQyxHQUFFLEFBQUMsS0FBSSxBQUFDLEdBQUUsQUFBQyxBQUFFLEtBQ2hDLEFBQUM7QUFDQyxBQUFNLGtCQUFJLENBQUMsQUFBTSxPQUFDLEFBQVUsV0FBQyxBQUFDLEFBQUMsS0FBRyxBQUFFLEFBQUMsTUFBRyxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQUUsSUFBRSxBQUFNLFNBQUcsQUFBQyxJQUFHLEFBQUMsQUFBQyxBQUFDLEFBQ3ZFO0FBQUM7QUFFRCxBQUFNLFdBQUMsQUFBTSxBQUFDLEFBQ2xCO0FBQUMsQUFFRCxBQUFNO29DQUFxQyxBQUFlO0FBRXRELFFBQUksQUFBTSxTQUFjLEFBQUUsQUFBQztBQUUzQixBQUFFLEFBQUMsUUFBQyxDQUFDLEFBQU0sQUFBQyxRQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUM7QUFFM0IsUUFBSSxBQUFLLFFBQUcsQUFBTSxPQUFDLEFBQUssTUFBQyxBQUFnQixBQUFDLEFBQUM7QUFFM0MsQUFBRyxTQUFnQixTQUFLLEdBQUwsVUFBSyxPQUFMLGFBQUssUUFBTCxBQUFLO0FBQXBCLFlBQUksQUFBTyxrQkFBQTtBQUVYLEFBQUUsQUFBQyxZQUFDLEFBQVEsU0FBQyxBQUFPLEFBQUMsQUFBQyxVQUN0QixBQUFDO0FBQ0csQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQU8sQUFBQyxBQUFDLEFBQUMsQUFDbkM7QUFBQyxBQUNELEFBQUksZUFDSixBQUFDO0FBQ0csQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBbUIsb0JBQUMsQUFBTyxBQUFDLEFBQUMsQUFBQyxBQUM5QztBQUFDO0FBQ0o7QUFFRCxBQUFNLFdBQUMsQUFBTSxBQUFDLEFBQ2xCO0FBQUM7Ozs7Ozs7Ozs7O0FDbEhELEFBQU8sQUFBRSxBQUFLLEFBQVUsQUFBTSxBQUEwQixBQUFDOztBQUV6RDtBQVFDLGdDQUFZLEFBQWM7QUFBMUIsb0JBb0JDO0FBeEJELGFBQVEsV0FBRyxBQUFJLEFBQUssQUFBVSxBQUFDO0FBTTlCLEFBQUksYUFBQyxBQUFLLFFBQUcsQUFBSyxBQUFDO0FBRW5CLEFBQTZEO0FBQzdELEFBQUksYUFBQyxBQUFVLEFBQUUsYUFBQyxBQUFLLE1BQUMsVUFBQyxBQUFDO0FBRXpCLEFBQUUsZ0JBQUMsQUFBQyxFQUFDLEFBQU8sV0FBSSxBQUFFLEFBQUMsSUFDbkIsQUFBQztBQUNBLEFBQUksc0JBQUMsQUFBa0IsQUFBRSxBQUFDO0FBQzFCLEFBQU8sd0JBQUMsQUFBRyxJQUFDLEFBQUksTUFBQyxBQUFLLEFBQUMsQUFBQyxBQUN6QjtBQUFDLEFBQ0Y7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFJLGFBQUMsQUFBVSxBQUFFLGFBQUMsQUFBTyxBQUFFLFVBQUMsQUFBSSxLQUFDLEFBQWtCLEFBQUMsb0JBQUMsQUFBSyxNQUFDO0FBRTFELEFBQUksa0JBQUMsQUFBa0IsQUFBRSxBQUFDLEFBQzNCO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBSSxhQUFDLEFBQVUsQUFBRSxhQUFDLEFBQUUsR0FBQyxBQUFlLGlCQUFFLEFBQUksS0FBQyxBQUFrQixBQUFFLEFBQUMsQUFBQyxBQUNsRTtBQUFDO0FBdEJELGlDQUFVLGFBQVY7QUFBZSxBQUFNLGVBQUMsQUFBQyxFQUFDLE1BQUksQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDLEFBQUM7QUFBQztBQXlCcEMsaUNBQWtCLHFCQUExQjtBQUVDLEFBQUksYUFBQyxBQUFRLFNBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFVLEFBQUUsYUFBQyxBQUFHLEFBQUUsQUFBQyxBQUFDLEFBQzdDO0FBQUM7QUFFRCxpQ0FBUSxXQUFSLFVBQVMsQUFBZTtBQUV2QixBQUFJLGFBQUMsQUFBVSxBQUFFLGFBQUMsQUFBRyxJQUFDLEFBQU0sQUFBQyxBQUFDLEFBQy9CO0FBQUM7QUFFRixXQUFBLEFBQUM7QUF6Q0QsQUF5Q0MsS0F2REQsQUFRRzs7Ozs7Ozs7O1FBaURILEFBQU07c0NBQXVDLEFBQU87QUFFaEQsUUFBSSxBQUFPO0FBQ1QsQUFBcUIsK0JBQUUsRUFBQyxBQUFPLFNBQUUsQUFBSSxBQUFDLEFBQ3ZDLEFBQUM7QUFGWTtBQUdkLFFBQUksQUFBWSxlQUFHLElBQUksQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBWSxhQUFDLEFBQU8sU0FBRSxBQUFPLEFBQUMsQUFBQztBQUN6RSxBQUFNLFdBQUMsQUFBSSxLQUFDLEFBQUssTUFBQyxBQUFXLFlBQUMsQUFBWSxjQUFFLEFBQWUsaUJBQUU7QUFDekQsQUFBQyxVQUFDLEFBQU8sQUFBQyxTQUFDLEFBQU8sUUFBQyxBQUFlLEFBQUMsQUFBQztBQUNwQyxBQUFNLGVBQUMsQUFBSyxBQUFDLEFBQ2pCO0FBQUMsQUFBQyxBQUFDLEFBQ1A7QUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6REQsQUFBTyxBQUFhLEFBQVMsQUFBRSxBQUFRLEFBQUUsQUFBTSxBQUFjLEFBQUMsQUFPOUQsQUFBTTs7O0FBRUwsQUFBMEM7QUFDeEMsQUFJSTs7Ozs7QUFFTixBQUNvRDs7QUFFcEQsQUFBb0IsQUFBRSxBQUFDO0FBRXZCLEFBQUMsTUFBQyxBQUEyQixBQUFDLDZCQUFDLEFBQUssTUFBQyxBQUFpQixBQUFDLEFBQUM7QUFFeEQsQUFBQyxNQUFDLEFBQTJCLEFBQUMsNkJBQUMsQUFBSyxNQUFFO0FBQWEsQUFBQyxVQUFDLEFBQUksQUFBQyxNQUFDLEFBQU0sQUFBRSxTQUFDLEFBQU8sUUFBQyxBQUFNLFFBQUU7QUFBYSxBQUFvQixBQUFFLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQUMsQUFBQyxBQUFDO0FBRWhJLEFBQUMsTUFBQyxBQUF1QixBQUFDLHlCQUFDLEFBQUssTUFBRTtBQUVqQyxBQUFHLFlBQUMsQUFBUSxTQUFDLEFBQVMsZUFBQyxBQUFXLGFBQUUsRUFBRSxBQUFFLElBQUcsQUFBRyxJQUFDLEFBQWdCLGlCQUFDLEFBQWdCLEFBQUUsQUFBRSxBQUFDLEFBQUMsQUFDdkY7QUFBQyxBQUFDLEFBQUM7QUFFSCxRQUFJLEFBQUcsQUFBQztBQUNSLEFBQU0sV0FBQyxBQUFRLFdBQUc7QUFFZixBQUFFLEFBQUMsWUFBQyxBQUFHLEFBQUMsS0FBQyxBQUFDO0FBQUEsQUFBWSx5QkFBQyxBQUFHLEFBQUMsQUFBQyxBQUFDO0FBQUM7QUFDOUIsQUFBRyxjQUFHLEFBQVUsV0FBQyxBQUFvQixzQkFBQyxBQUFHLEFBQUMsQUFBQyxBQUM5QztBQUFDLEFBQUM7QUFFRixBQUFhO0FBQ2IsQUFBQyxNQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFLLE1BQUMsQUFBaUIsQUFBQyxBQUFDO0FBQzNDLEFBQUMsTUFBQyxBQUFVLEFBQUMsWUFBQyxBQUFLLE1BQUMsQUFBaUIsQUFBQyxBQUFDO0FBQ3ZDLEFBQUMsTUFBQyxBQUFpQyxBQUFDLG1DQUFDLEFBQUssTUFBQyxBQUFpQixBQUFDLEFBQUM7QUFFOUQsQUFBQyxNQUFDLEFBQTZDLEFBQUMsK0NBQUMsQUFBSyxNQUFDLFVBQUMsQUFBUztBQUNoRSxBQUFHLFlBQUMsQUFBa0IsQUFBRSxBQUFDO0FBQ3pCLEFBQUcsWUFBQyxBQUFPLFFBQUMsQUFBUSxjQUFDLEFBQUksQUFBQyxBQUFDO0FBRTNCLEFBQUMsVUFBQyxBQUFjLEFBQUUsQUFBQztBQUNuQixBQUFDLFVBQUMsQUFBZSxBQUFFLEFBQUMsQUFDckI7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFDLE1BQUMsQUFBNkMsQUFBQywrQ0FBQyxBQUFLLE1BQUM7QUFDdEQsQUFBRyxZQUFDLEFBQU8sUUFBQyxBQUFRLGNBQUMsQUFBRyxBQUFDLEFBQUMsQUFDM0I7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUEyQjtBQUMzQixBQUFJO0FBQ0osQUFBMEI7QUFDMUIsQUFBSTtBQUVKLEFBQW1DO0FBQ25DLEFBQXdDO0FBQ3hDLEFBQXFDO0FBQ3JDLEFBQU07QUFDTixBQUFzRDtBQUN0RCxBQUFxQztBQUNyQyxBQUF3QztBQUN4QyxBQUFNLEFBQ1A7QUFBQyxBQUVELEFBQU0sRUEvRU4sQUFRRzs7Ozs7Ozs7OztBQXlFRixBQUFHLFFBQUMsQUFBZ0IsaUJBQUMsQUFBSSxBQUFFLEFBQUM7QUFDNUIsQUFBQyxNQUFDLEFBQVUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFTLFdBQUMsQUFBSSxBQUFDLEFBQUM7QUFDbEMsQUFBQyxNQUFDLEFBQVUsQUFBQyxZQUFDLEFBQU8sUUFBQyxFQUFDLEFBQVMsV0FBRSxBQUFJLEFBQUMsUUFBQyxBQUFHLEFBQUMsQUFBQztBQUM3QyxBQUFDLE1BQUMsQUFBaUIsQUFBQyxtQkFBQyxBQUFJLEtBQUUsQUFBTyxTQUFFLEVBQUMsQUFBUyxXQUFFLEFBQU0sUUFBRSxBQUFNLFFBQUUsQUFBTyxBQUFDLFdBQUcsQUFBRyxLQUFFO0FBQVEsQUFBRyxZQUFDLEFBQXNCLHVCQUFDLEFBQTBCLEFBQUUsQUFBQztBQUFDLEFBQUUsQUFBQztBQUVwSixBQUFpRixBQUNsRjtBQUFDLEFBRUQsQUFBTTs7QUFFTCxBQUFDLE1BQUMsQUFBVSxBQUFDLFlBQUMsQUFBRyxJQUFDLEFBQVMsV0FBQyxBQUFJLEFBQUMsQUFBQztBQUNsQyxBQUFDLE1BQUMsQUFBVSxBQUFDLFlBQUMsQUFBTyxRQUFDLEVBQUMsQUFBUyxXQUFFLEFBQUksQUFBQyxRQUFDLEFBQUcsQUFBQyxBQUFDO0FBQzdDLEFBQUMsTUFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUksS0FBRSxBQUFPLFNBQUUsRUFBQyxBQUFTLFdBQUUsQUFBTSxRQUFFLEFBQU0sUUFBRSxBQUFPLEFBQUMsV0FBRyxBQUFHLEFBQUUsQUFBQztBQUNqRixBQUFDLE1BQUMsQUFBNEIsQUFBQyw4QkFBQyxBQUFJLEFBQUUsQUFBQztBQUN2QyxBQUE0RCxBQUM3RDtBQUFDO0FBRUQsSUFBSSxBQUFZLGVBQUcsRUFBRSxBQUFRLFVBQUUsQUFBRyxLQUFFLEFBQU0sUUFBRSxBQUFjLGdCQUFFLEFBQUssT0FBRSxBQUFLLE9BQUUsQUFBUSxVQUFFLG9CQUFZLENBQUMsQUFBQyxBQUFDLEFBRW5HLEFBQU07O0FBRUwsQUFBQyxNQUFDLEFBQWlCLEFBQUMsbUJBQUMsQUFBTyxRQUFDLEFBQVksQUFBQyxBQUFDLEFBQzVDO0FBQUMsQUFFRCxBQUFNOztBQUVMLEFBQWlCLEFBQUUsQUFBQztBQUNwQixBQUFDLE1BQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFHLElBQUMsQUFBYSxlQUFDLEFBQUcsQUFBQyxBQUFDO0FBQy9DLEFBQUMsTUFBQyxBQUFlLEFBQUMsaUJBQUMsQUFBSSxBQUFFLEFBQUM7QUFDMUIsQUFBQyxNQUFDLEFBQXlCLEFBQUMsMkJBQUMsQUFBSSxBQUFFLEFBQUM7QUFDcEMsQUFBb0IsQUFBRSxBQUFDLEFBQ3hCO0FBQUMsQUFFRCxBQUFNOztBQUVMLEFBQStFO0FBQy9FLEFBQXVDO0FBQ3ZDLEFBQUMsTUFBQyxBQUFlLEFBQUMsaUJBQUMsQUFBRyxJQUFDLEFBQVEsVUFBQyxBQUFNLEFBQUMsQUFBQztBQUV4QyxRQUFJLEFBQWMsaUJBQUcsQUFBQyxFQUFDLEFBQU0sQUFBQyxRQUFDLEFBQU0sQUFBRSxXQUFHLEFBQUMsRUFBQyxBQUFRLEFBQUMsVUFBQyxBQUFNLEFBQUUsQUFBQztBQUMvRCxBQUFjLHNCQUFJLEFBQUMsRUFBQyxBQUEyQixBQUFDLDZCQUFDLEFBQVcsWUFBQyxBQUFJLEFBQUMsQUFBQztBQUNuRSxBQUFDLE1BQUMsQUFBc0IsQUFBQyx3QkFBQyxBQUFHLElBQUMsQUFBUSxVQUFDLEFBQWMsQUFBQyxBQUFDO0FBQ3ZELEFBQUMsTUFBQyxBQUF5QixBQUFDLDJCQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUMsQUFBYyxBQUFDLEFBQUM7QUFFMUQsQUFBRSxBQUFDLFFBQUMsQUFBRyxBQUFDLEtBQUMsQUFBVSxXQUFDLEFBQUcsSUFBQyxBQUFpQixtQkFBRSxBQUFHLEFBQUMsQUFBQztBQUVoRCxBQUFpQixBQUFFLEFBQUM7QUFDcEIsQUFBYSxBQUFFLEFBQUMsQUFDakI7QUFBQztBQUdELElBQUksQUFBcUIsQUFBQyxBQUMxQixBQUFNO3VCQUF3QixBQUFnRTtBQUFoRSwwQ0FBQTtBQUFBLGdDQUF3QixBQUFDLEVBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFXLFlBQUMsQUFBSSxBQUFDOztBQUU3RixBQUFzRDtBQUN0RCxBQUFFLFFBQUMsQUFBWSxnQkFBSSxBQUFNLEFBQUMsUUFDMUIsQUFBQztBQUNBLEFBQUUsQUFBQyxZQUFDLEFBQU0sT0FBQyxBQUFVLFdBQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFPLEFBQUMsU0FDbEQsQUFBQztBQUNBLEFBQUMsY0FBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUMsQUFBQyxFQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBTSxBQUFFLFdBQUMsQUFBcUIsQUFBQyxBQUFDLEFBQzNGO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUMsY0FBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDM0M7QUFBQztBQUVILEFBQUUsQUFBQyxZQUFDLEFBQU0sT0FBQyxBQUFVLFdBQUMsQUFBcUIsQUFBQyx1QkFBQyxBQUFPLEFBQUMsU0FDckQsQUFBQztBQUNFLEFBQUUsQUFBQyxnQkFBQyxBQUFxQixBQUFDLHVCQUFDLEFBQXFCLHdCQUFHLEFBQUMsQUFBQztBQUVyRCxBQUFtRztBQUNuRyxBQUFDLGNBQUMsQUFBd0IsQUFBQywwQkFBQyxBQUFHLElBQUMsQUFBUSxVQUFDLEFBQUMsRUFBQyxBQUFvQixBQUFDLHNCQUFDLEFBQVcsQUFBRSxnQkFBQyxBQUFxQixBQUFDLEFBQUM7QUFHdEcsQUFBcUIsb0NBQUcsQUFBSyxBQUFDLEFBQy9CO0FBQUMsQUFDSCxBQUFJLGVBQ0osQUFBQztBQUNFLEFBQUMsY0FBQyxBQUF3QixBQUFDLDBCQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUMsQUFBQyxFQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBTSxBQUFFLEFBQUMsQUFBQztBQUMzRSxBQUFFLEFBQUMsZ0JBQUMsQUFBQyxFQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRSxHQUFDLEFBQVUsQUFBQyxBQUFDLGFBQzFDLEFBQUM7QUFDQSxBQUFDLGtCQUFDLEFBQXdCLEFBQUMsMEJBQUMsQUFBRyxJQUFDLEFBQWMsZ0JBQUMsQUFBTyxBQUFDLEFBQUM7QUFDeEQsQUFBQyxrQkFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUcsSUFBQyxBQUFjLGdCQUFDLEFBQU8sQUFBQyxBQUFDLEFBRWxEO0FBQUMsQUFDRCxBQUFJLG1CQUNKLEFBQUM7QUFDQSxBQUFDLGtCQUFDLEFBQXdCLEFBQUMsMEJBQUMsQUFBRyxJQUFDLEFBQWMsZ0JBQUMsQUFBSyxBQUFDLEFBQUM7QUFDdEQsQUFBQyxrQkFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQUcsSUFBQyxBQUFjLGdCQUFDLEFBQUssQUFBQyxBQUFDLEFBQ2hEO0FBQUM7QUFDRCxBQUFxQixvQ0FBRyxBQUFJLEFBQUMsQUFDaEM7QUFBQyxBQUNGO0FBQUMsQUFDRCxBQUFJLFdBQ0osQUFBQztBQUNBLEFBQU8sZ0JBQUMsQUFBSyxNQUFDLEFBQTJCLEFBQUMsQUFBQyxBQUM1QztBQUFDO0FBRUQsQUFBMkQ7QUFDM0QsQUFBdUU7QUFDdkUsQUFBRSxBQUFDLFFBQUMsQUFBRyxJQUFDLEFBQVksQUFBQyx5QkFBWTtBQUFhLEFBQUcsWUFBQyxBQUFZLGFBQUMsQUFBTSxBQUFFLEFBQUMsQUFBQztBQUFDLEtBQXBELEFBQVUsRUFBMkMsQUFBRyxBQUFDLEFBQUMsQUFDakY7QUFBQyxBQUVELEFBQU07O0FBRUwsQUFBRSxBQUFDLFFBQUMsQUFBQyxFQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBSyxBQUFFLFVBQUcsQUFBRyxBQUFDLEtBQ3pDLEFBQUM7QUFDQSxBQUFDLFVBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFXLFlBQUMsQUFBWSxBQUFDLEFBQUM7QUFDakQsQUFBQyxVQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBUSxTQUFDLEFBQVksQUFBQyxBQUFDLEFBQy9DO0FBQUMsQUFDRCxBQUFJLFdBQ0osQUFBQztBQUNBLEFBQUMsVUFBQyxBQUFtQixBQUFDLHFCQUFDLEFBQVEsU0FBQyxBQUFZLEFBQUMsQUFBQztBQUM5QyxBQUFDLFVBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFXLFlBQUMsQUFBWSxBQUFDLEFBQUMsQUFDbEQ7QUFBQztBQUVELEFBQUUsUUFBQyxBQUFZLGdCQUFJLEFBQU0sQUFBQyxRQUMxQixBQUFDO0FBQ0EsQUFBRSxBQUFDLFlBQUMsQUFBTSxPQUFDLEFBQVUsV0FBQyxBQUFxQixBQUFDLHVCQUFDLEFBQU8sQUFBQyxTQUNyRCxBQUFDO0FBQ0UsQUFBQyxjQUFDLEFBQWdDLEFBQUMsa0NBQUMsQUFBRyxJQUFDLEFBQVEsVUFBRSxBQUFNLEFBQUMsQUFBQztBQUMxRCxBQUFDLGNBQUMsQUFBcUMsQUFBQyx1Q0FBQyxBQUFHLElBQUMsQUFBWSxjQUFDLEFBQUssQUFBQyxBQUFDLEFBQ2xFO0FBQUMsQUFDSCxBQUFJLGVBQ0osQUFBQztBQUNFLGdCQUFJLEFBQWMsaUJBQUcsQUFBQyxFQUFDLEFBQW1CLEFBQUMsQUFBQztBQUM1QyxnQkFBSSxBQUFNLFNBQUcsQUFBYyxlQUFDLEFBQVcsWUFBQyxBQUFJLEFBQUMsQUFBQztBQUNoRCxBQUFNLHNCQUFJLEFBQWMsZUFBQyxBQUFJLEtBQUMsQUFBcUIsQUFBQyx1QkFBQyxBQUFXLFlBQUMsQUFBSSxBQUFDLEFBQUM7QUFDdkUsQUFBTSxzQkFBSSxBQUFjLGVBQUMsQUFBSSxLQUFDLEFBQTBDLEFBQUMsNENBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBQzVGLEFBQU0sc0JBQUksQUFBYyxlQUFDLEFBQUksS0FBQyxBQUFlLEFBQUMsaUJBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBRS9ELEFBQUMsY0FBQyxBQUFxQyxBQUFDLHVDQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUUsQUFBTSxBQUFDLEFBQUM7QUFDL0QsQUFBQyxjQUFDLEFBQXFDLEFBQUMsdUNBQUMsQUFBRyxJQUFDLEFBQVksY0FBRSxBQUFjLGVBQUMsQUFBSSxLQUFDLEFBQXFCLEFBQUMsdUJBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxRQUFDLEFBQWMsZUFBQyxBQUFJLEtBQUMsQUFBMEMsQUFBQyw0Q0FBQyxBQUFXLFlBQUMsQUFBSSxBQUFDLEFBQUMsQUFBQyxBQUM5TTtBQUFDLEFBQ0Y7QUFBQyxBQUNGO0FBQUM7Ozs7Ozs7Ozs7QUN6TUQsQUFBTyxBQUFFLEFBQWMsQUFBaUIsQUFBTSxBQUEyQixBQUFDOztBQUMxRSxBQUFPLEFBQUUsQUFBWSxBQUFFLEFBQU0sQUFBeUIsQUFBQzs7QUFDdkQsQUFBTyxBQUFFLEFBQWMsQUFBbUIsQUFBTSxBQUEyQixBQUFDOztBQUM1RSxBQUFPLEFBQUUsQUFBeUIsQUFBRSxBQUFNLEFBQXdDLEFBQUM7O0FBQ25GLEFBQU8sQUFBRSxBQUFVLEFBQUUsQUFBTSxBQUF1QixBQUFDOztBQUNuRCxBQUFPLEFBQUUsQUFBZ0IsQUFBRSxBQUFNLEFBQTZCLEFBQUM7O0FBQy9ELEFBQU8sQUFBRSxBQUFnQixBQUFFLEFBQU0sQUFBNkIsQUFBQzs7QUFDL0QsQUFBTyxBQUFFLEFBQW9CLEFBQUUsQUFBTSxBQUFxQyxBQUFDOztBQUMzRSxBQUFPLEFBQUUsQUFBZ0IsQUFBRSxBQUFNLEFBQWlDLEFBQUM7O0FBQ25FLEFBQU8sQUFBRSxBQUFrQixBQUFFLEFBQU0sQUFBaUMsQUFBQzs7QUFDckUsQUFBTyxBQUFFLEFBQXNCLEFBQUUsQUFBTSxBQUF1QyxBQUFDOztBQUMvRSxBQUFPLEFBQUUsQUFBWSxBQUFZLEFBQU0sQUFBZ0MsQUFBQzs7QUFFeEUsQUFBTyxBQUFFLEFBQWEsQUFBRSxBQUFZLEFBQUUsQUFBTSxBQUEwQixBQUFDOztBQUd2RSxBQUFPLEFBQUUsQUFBeUIsQUFBRSxBQUFNLEFBQW9CLEFBQUM7O0FBQy9ELEFBQU8sQUFBRSxBQUFxQixBQUFFLEFBQU0sQUFBcUMsQUFBQzs7QUFFNUUsQUFBTyxBQUFrQixBQUFVLEFBQUUsQUFBTSxBQUFvQixBQUFDOztBQUloRSxBQUVFOzs7QUF4Q0YsQUFRRzs7Ozs7Ozs7O0FBQ0gsQUFBaUM7QUFnQ2pDLEFBQUMsRUFBQyxBQUFRLEFBQUMsVUFBQyxBQUFLLE1BQUM7QUFFZixBQUFHLFVBQUcsSUFBSSxBQUFTLEFBQUUsQUFBQztBQUV0QixBQUFHLFFBQUMsQUFBYyxlQUFDLEFBQXdCLHlCQUFDLEFBQWEsZUFBRSxBQUFrQixBQUFDLEFBQUM7QUFFL0UsQUFBRyxRQUFDLEFBQWEsY0FBQyxBQUFVLEFBQUUsQUFBQztBQUUvQixBQUFHLFFBQUMsQUFBZ0IsQUFBRSxBQUFDO0FBRXZCLEFBQXlCLEFBQUUsQUFBQztBQUM1QixBQUFxQixBQUFFLEFBQUMsQUFDM0I7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUVFLEFBQ0YsQUFBTTs7O0FBQU4sSUFBWSxBQVFYO0FBUkQsV0FBWSxBQUFTO0FBRXBCLHlDQUFNO0FBQ04sOENBQVc7QUFDWCxtREFBZ0I7QUFDaEIsaURBQWM7QUFDZCxnREFBYTtBQUNiLDJEQUF3QixBQUN6QjtBQUFDLEdBUlcsQUFBUyxrQ0FBVCxBQUFTLFlBUXBCLEFBRUQsQUFBTTtBQUFOLElBQVksQUFJWDtBQUpELFdBQVksQUFBUTtBQUVuQixvQ0FBRztBQUNILHFDQUFJLEFBQ0w7QUFBQyxHQUpXLEFBQVEsZ0NBQVIsQUFBUSxXQUluQjtBQUVELEFBSUU7Ozs7O0FBQ0Y7QUF1Q0M7QUFBQSxvQkFhQztBQWxERCxhQUFlLGtCQUFHLEFBQUksQUFBYyxBQUFFLEFBQUM7QUFDdkMsYUFBYSxnQkFBRyxBQUFJLEFBQVksQUFBRSxBQUFDO0FBQ25DLGFBQWUsa0JBQUcsQUFBSSxBQUFjLEFBQUUsQUFBQztBQUN2QyxhQUEwQiw2QkFBRyxBQUFJLEFBQXlCLEFBQUUsQUFBQztBQUM3RCxhQUFpQixvQkFBc0IsQUFBSSxBQUFnQixBQUFFLEFBQUM7QUFDOUQsYUFBVyxjQUFHLEFBQUksQUFBVSxBQUFFLEFBQUM7QUFDL0IsYUFBaUIsb0JBQUcsQUFBSSxBQUFnQixBQUFFLEFBQUM7QUFDM0MsYUFBYSxnQkFBSSxBQUFJLEFBQVksQUFBRSxBQUFDO0FBQ3BDLGFBQWtCLHFCQUFHLEFBQUksQUFBa0Isa0NBQUMsQUFBWSxBQUFDLEFBQUM7QUFDMUQsYUFBb0IsdUJBQUcsQUFBSSxBQUFvQixBQUFFLEFBQUM7QUFDbEQsYUFBYSxnQkFBRyxBQUFJLEFBQWEsQUFBRSxBQUFDO0FBQ3BDLGFBQWMsaUJBQUcsQUFBSSxBQUFnQixBQUFFLEFBQUM7QUFDeEMsYUFBc0IseUJBQUcsQUFBSSxBQUFzQixBQUFFLEFBQUM7QUFFdEQsQUFBb0c7QUFFcEcsQUFBd0I7QUFDaEIsYUFBTSxTQUFlLEFBQUksQUFBQztBQUMxQixhQUFLLFFBQWMsQUFBSSxBQUFDO0FBRWhDLEFBQStEO0FBQ3ZELGFBQWMsaUJBQVksQUFBSSxBQUFDO0FBR3ZDLEFBQW1EO0FBQ25ELEFBQXdEO0FBQ3hELEFBQStEO0FBQy9ELGFBQVcsY0FBRyxBQUFLLEFBQUM7QUFFcEIsQUFBZ0U7QUFDaEUsQUFBMEI7QUFDMUIsYUFBMEIsNkJBQUcsQUFBSyxBQUFDO0FBRW5DLEFBQStEO0FBQy9ELEFBQTJEO0FBQzNELGFBQXVCLDBCQUFHLEFBQUksQUFBQztBQUk5QixBQUFJLGFBQUMsQUFBaUIsa0JBQUMsQUFBTSxPQUFDLEFBQUUsR0FBRSxVQUFDLEFBQVM7QUFBTyxBQUFJLGtCQUFDLEFBQWlCLGtCQUFDLEFBQVMsQUFBQyxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUM7QUFDeEYsQUFBSSxhQUFDLEFBQWlCLGtCQUFDLEFBQU0sT0FBQyxBQUFFLEdBQUU7QUFBTyxBQUFJLGtCQUFDLEFBQWlCLEFBQUUsQUFBQyxBQUFDO0FBQUMsQUFBQyxBQUFDO0FBRXZFLEFBQUksYUFBQyxBQUFhLGNBQUMsQUFBVSxXQUFDLEFBQUUsR0FBRTtBQUFRLEFBQUksa0JBQUMsQUFBcUIsQUFBRSxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUM7QUFFM0UsQUFBaUY7QUFDakYsQUFBSSxhQUFDLEFBQVcsWUFBQyxBQUFhLGNBQUMsQUFBRSxHQUFFLFVBQUMsQUFBUTtBQUFPLEFBQUksa0JBQUMsQUFBbUMsb0NBQUMsQUFBUSxBQUFDLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQztBQUUxRyxBQUFJLGFBQUMsQUFBZSxnQkFBQyxBQUFpQixrQkFBQyxBQUFFLEdBQUUsVUFBQyxBQUFlO0FBQU0sQUFBSSxrQkFBQyxBQUFxQixzQkFBQyxBQUFlLEFBQUMsQUFBQyxBQUFDO0FBQUMsQUFBQyxBQUFDO0FBRWpILEFBQUksYUFBQyxBQUFrQixtQkFBQyxBQUFRLFNBQUMsQUFBRSxHQUFFLFVBQUMsQUFBZ0I7QUFBTyxBQUFJLGtCQUFDLEFBQWtCLG1CQUFDLEFBQU8sQUFBQyxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUMsQUFDbkc7QUFBQztBQUVELHdCQUFxQix3QkFBckIsWUFHQSxDQUFDO0FBQUEsQUFBQztBQUVGLEFBR0U7Ozs7QUFDRix3QkFBZ0IsbUJBQWhCLFVBQWlCLEFBQW9DLGNBQUUsQUFBd0I7QUFBL0Usb0JBNkVDO0FBN0VnQixxQ0FBQTtBQUFBLDJCQUFvQzs7QUFBRSx5Q0FBQTtBQUFBLCtCQUF3Qjs7QUFFOUUsQUFBZ0U7QUFDaEUsQUFBRSxBQUFDLFlBQUMsQUFBWSxhQUFDLEFBQU8sQUFBQyxTQUN6QixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFZLGFBQUMsQUFBcUIsc0JBQUMsQUFBWSxhQUFDLEFBQU8sQUFBQyxBQUFDLEFBQy9EO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBc0IsdUJBQUMsQUFBYSxjQUFDLEFBQUssQUFBQyxBQUFDLEFBQ2xEO0FBQUM7QUFFRCxBQUFFLEFBQUMsWUFBQyxBQUFZLGlCQUFLLEFBQUksQUFBQyxNQUFDLEFBQU0sQUFBQztBQUVsQyxBQUF1RTtBQUN2RSxBQUFnRjtBQUNoRixBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQWdCLEFBQUMsa0JBQ3JCLEFBQVksZUFBRyxBQUFJLEFBQVksQUFBRSw0QkFBQyxBQUFLLE1BQUMsQUFBWSxBQUFDLEFBQUM7QUFFdkQsQUFBRSxBQUFDLFlBQUMsQUFBWSxhQUFDLEFBQVEsQUFBQyxVQUMxQixBQUFDO0FBQ0EsQUFBK0U7QUFDL0UsQUFBeUQ7QUFDekQsQUFBcUI7QUFDckIsQUFBSSxpQkFBQyxBQUFZLGFBQUMsQUFBVyxZQUFDLEFBQVksYUFBQyxBQUFRLFVBQUUsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFXLEFBQUMsQUFBQztBQUVwRixBQUFDLGNBQUMsQUFBMkIsQUFBQyw2QkFBQyxBQUFJLEFBQUUsQUFBQztBQUV0QyxBQUFFLEFBQUMsZ0JBQUMsQUFBWSxhQUFDLEFBQUksUUFBSSxBQUFRLFNBQUMsQUFBSyxBQUFDLE1BQ3hDLEFBQUM7QUFDQSxvQkFBSSxBQUFRLGFBQUcsQUFBQyxFQUFDLEFBQU0sT0FBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQUcsS0FBRSxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQUcsQUFBQyxBQUFDO0FBQzlFLEFBQUkscUJBQUMsQUFBVSxXQUFDLEFBQXlCLDBCQUFDLEFBQVEsWUFBRSxBQUFFLEFBQUMsQUFBQyxBQUN6RDtBQUFDLEFBQ0Y7QUFBQztBQUVELEFBQUksYUFBQyxBQUFPLFFBQUMsQUFBWSxhQUFDLEFBQUksTUFBRSxBQUFnQixrQkFBRSxBQUFLLEFBQUMsQUFBQztBQUV6RCxBQUF3QztBQUN4QyxBQUFpRTtBQUNqRSxBQUFFLEFBQUMsWUFBQyxBQUFZLGFBQUMsQUFBTyxBQUFJLFdBQUMsQ0FBQyxBQUFZLGFBQUMsQUFBUSxZQUFJLEFBQVksYUFBQyxBQUFLLFVBQUssQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDLFFBQ2hHLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQWUsZ0JBQUMsQUFBYyxlQUNsQyxBQUFZLGFBQUMsQUFBTyxTQUNwQixVQUFDLEFBQU87QUFFUCxBQUFxRTtBQUNyRSxBQUFnQjtBQUNoQixBQUFFLEFBQUMsb0JBQUMsQUFBWSxhQUFDLEFBQVEsQUFBQyxVQUFDLEFBQU0sQUFBQztBQUNsQyxBQUFJLHNCQUFDLEFBQW1CLG9CQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ25DO0FBQUMsZUFDRDtBQUNDLEFBQW1CO0FBQ25CLEFBQUksc0JBQUMsQUFBa0IsbUJBQUMsQUFBUSxTQUFDLEFBQTJCLDhCQUFHLEFBQVksYUFBQyxBQUFPLEFBQUMsQUFBQztBQUNyRixBQUFFLEFBQUMsb0JBQUMsQ0FBQyxBQUFZLGFBQUMsQUFBUSxBQUFDLFVBQzNCLEFBQUM7QUFDQSxBQUEyQjtBQUMzQixBQUFJLDBCQUFDLEFBQWUsZ0JBQUMsQUFBYyxlQUFDLEFBQUUsSUFBRSxVQUFDLEFBQUM7QUFBTyxBQUFJLDhCQUFDLEFBQW1CLG9CQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUMsQUFDbEY7QUFBQyxBQUNGO0FBQUMsQUFDRCxBQUFDLEFBQ0g7QUFBQztBQUVELEFBQUUsQUFBQyxZQUFDLEFBQVksYUFBQyxBQUFFLEFBQUMsSUFDcEIsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBUSxTQUNaLEFBQVksYUFBQyxBQUFLO0FBRWpCLEFBQUUsb0JBQUUsQUFBWSxhQUFDLEFBQUU7QUFDbkIsQUFBYSxBQUFFLCtCQUFDLEFBQVksYUFBQyxBQUFRLGFBQUssQUFBSSxBQUFDLEFBQy9DO0FBSEQsZUFJQSxBQUFnQixBQUFDLEFBQUM7QUFDbkIsQUFBQyxjQUFDLEFBQTJCLEFBQUMsNkJBQUMsQUFBSSxBQUFFLEFBQUMsQUFDdkM7QUFBQyxBQUNELEFBQUksZUFDSixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFRLFNBQUMsQUFBWSxhQUFDLEFBQUssT0FBRSxBQUFJLE1BQUUsQUFBZ0IsQUFBQyxBQUFDLEFBQzNEO0FBQUMsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUVGLHdCQUFPLFVBQVAsVUFBUSxBQUFnQixPQUFFLEFBQWtDLGtCQUFFLEFBQTJCO0FBQXpGLG9CQTBDQztBQTFDeUIseUNBQUE7QUFBQSwrQkFBa0M7O0FBQUUsNkNBQUE7QUFBQSxtQ0FBMkI7O0FBRXhGLEFBQUUsQUFBQyxZQUFDLEFBQUssU0FBSSxBQUFJLEtBQUMsQUFBSyxBQUFDLE9BQ3hCLEFBQUM7QUFDQSxBQUFFLEFBQUMsZ0JBQUMsQUFBSyxTQUFJLEFBQVEsU0FBQyxBQUFHLEFBQUMsS0FDMUIsQUFBQztBQUNBLEFBQUkscUJBQUMsQUFBYSxjQUFDLEFBQU0sT0FBQyxBQUFFLEdBQUU7QUFBUSxBQUFJLDBCQUFDLEFBQWEsQUFBRSxBQUFDLEFBQUU7QUFBQyxBQUFDLEFBQUM7QUFDaEUsQUFBSSxxQkFBQyxBQUFhLGNBQUMsQUFBTyxRQUFDLEFBQUUsR0FBRTtBQUFRLEFBQUksMEJBQUMsQUFBYyxBQUFFLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQztBQUVqRSxBQUFDLGtCQUFDLEFBQXdCLEFBQUMsMEJBQUMsQUFBSSxBQUFFLEFBQUM7QUFDbkMsQUFBQyxrQkFBQyxBQUF5QixBQUFDLDJCQUFDLEFBQUksQUFBRSxBQUFDO0FBRXBDLEFBQUkscUJBQUMsQUFBWSxhQUFDLEFBQUksQUFBRSxBQUFDLEFBQzFCO0FBQUMsQUFDRCxBQUFJLG1CQUNKLEFBQUM7QUFDQSxBQUFJLHFCQUFDLEFBQWEsY0FBQyxBQUFNLE9BQUMsQUFBRyxJQUFFO0FBQVEsQUFBSSwwQkFBQyxBQUFhLEFBQUUsQUFBQyxBQUFFO0FBQUMsQUFBQyxBQUFDO0FBQ2pFLEFBQUkscUJBQUMsQUFBYSxjQUFDLEFBQU8sUUFBQyxBQUFHLElBQUU7QUFBUSxBQUFJLDBCQUFDLEFBQWMsQUFBRSxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUM7QUFFbEUsQUFBQyxrQkFBQyxBQUF3QixBQUFDLDBCQUFDLEFBQUksQUFBRSxBQUFDO0FBQ25DLEFBQUMsa0JBQUMsQUFBeUIsQUFBQywyQkFBQyxBQUFJLEFBQUUsQUFBQyxBQUNyQztBQUFDO0FBRUQsQUFBZ0M7QUFDaEMsZ0JBQUksQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFLLEFBQUM7QUFDekIsQUFBSSxpQkFBQyxBQUFLLFFBQUcsQUFBSyxBQUFDO0FBRW5CLEFBQStCO0FBQy9CLEFBQUUsQUFBQyxnQkFBQyxBQUFPLFdBQUksQUFBSSxRQUFJLENBQUMsQUFBZ0Isb0JBQUksQUFBSyxTQUFJLEFBQVEsU0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQVksQUFBRSxBQUFDO0FBRXRHLEFBQUksaUJBQUMsQUFBYSxjQUFDLEFBQW9CLEFBQUUsQUFBQztBQUMxQyxBQUFJLGlCQUFDLEFBQWEsY0FBQyxBQUFzQix1QkFBQyxBQUFJLE1BQUUsQUFBSSxBQUFDLEFBQUM7QUFFdEQsQUFBRSxBQUFDLGdCQUFDLEFBQW9CLEFBQUMsc0JBQ3pCLEFBQUM7QUFDQSxBQUFJLHFCQUFDLEFBQW1CLEFBQUUsQUFBQztBQUUzQixBQUFpRDtBQUNqRCxBQUFFLEFBQUMsb0JBQUMsQUFBSyxTQUFJLEFBQVEsU0FBQyxBQUFHLEFBQUMsS0FBQyxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQUksS0FBQyxBQUFLLE9BQUUsRUFBQyxBQUFFLElBQUcsQUFBSSxLQUFDLEFBQWMsQUFBQyxBQUFDLEFBQUMsQUFDbEY7QUFBQyxBQUVGO0FBQUMsQUFDRjtBQUFDO0FBRUQsQUFFRTs7O0FBQ0Ysd0JBQVEsV0FBUixVQUFTLEFBQXFCLFdBQUUsQUFBa0IsU0FBRSxBQUFrQztBQUVyRixBQUEwRjtBQUYzRixvQkF5SkM7QUF6SitCLGdDQUFBO0FBQUEsc0JBQWtCOztBQUFFLHlDQUFBO0FBQUEsK0JBQWtDOztBQUlyRixZQUFJLEFBQU8sQUFBQztBQUVaLFlBQUksQUFBWSxlQUFHLEFBQUksS0FBQyxBQUFNLEFBQUM7QUFDL0IsQUFBSSxhQUFDLEFBQU0sU0FBRyxBQUFTLEFBQUM7QUFFeEIsQUFBRSxBQUFDLFlBQUMsQUFBWSxnQkFBSSxBQUFTLFVBQUMsQUFBYyxrQkFBSSxBQUFJLEtBQUMsQUFBaUIsQUFBQyxtQkFDdEUsQUFBSSxLQUFDLEFBQWlCLGtCQUFDLEFBQUssQUFBRSxBQUFDO0FBRWhDLEFBQUUsQUFBQyxZQUFDLEFBQVksZ0JBQUksQUFBUyxVQUFDLEFBQWdCLEFBQUMsa0JBQy9DLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQWEsY0FBQyxBQUFvQixBQUFFLEFBQUM7QUFDMUMsQUFBSSxpQkFBQyxBQUEwQiwyQkFBQyxBQUFHLEFBQUUsQUFBQyxBQUN2QztBQUFDO0FBRUQsQUFBSSxhQUFDLEFBQWMsaUJBQUcsQUFBTyxVQUFHLEFBQU8sUUFBQyxBQUFFLEtBQUcsQUFBSSxBQUFDO0FBRWxELEFBQU0sQUFBQyxnQkFBQyxBQUFTLEFBQUMsQUFDbEIsQUFBQztBQUNBLGlCQUFLLEFBQVMsVUFBQyxBQUFNO0FBQ3BCLEFBQStDO0FBQy9DLEFBQUk7QUFDSixBQUF5QjtBQUN6QixBQUErQztBQUMvQyxBQUFLO0FBQ0wsQUFBRSxBQUFDLG9CQUFDLEFBQWdCLEFBQUMsa0JBQUMsQUFBSSxLQUFDLEFBQWdCLGlCQUFDLEFBQUksQUFBRSxBQUFDO0FBRW5ELEFBQUssQUFBQztBQUVQLGlCQUFLLEFBQVMsVUFBQyxBQUFXO0FBQ3pCLEFBQUUsQUFBQyxvQkFBQyxDQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFNLEFBQUM7QUFFeEIsQUFBSSxxQkFBQyxBQUFXLFlBQUMsQUFBTyxRQUFDLEFBQUUsQUFBQyxJQUFDLEFBQU0sT0FBQyxBQUFnQixBQUFFLEFBQUM7QUFDdkQsQUFBSSxxQkFBQyxBQUFXLFlBQUMsQUFBTyxRQUFDLEFBQUUsQUFBQyxJQUFDLEFBQU0sT0FBQyxBQUFXLEFBQUUsQUFBQztBQUNsRCxBQUFJLHFCQUFDLEFBQWdCLGlCQUFDLEFBQVcsWUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUM7QUFFOUMsQUFBSyxBQUFDO0FBRVAsaUJBQUssQUFBUyxVQUFDLEFBQWdCO0FBQzlCLEFBQUUsQUFBQyxvQkFBQyxDQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFNLEFBQUM7QUFFeEIsQUFBTywwQkFBRyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQztBQUN2QyxBQUFFLEFBQUMsb0JBQUMsQUFBTyxBQUFDLFNBQ1osQUFBQztBQUNBLEFBQUkseUJBQUMsQUFBUyxVQUFDLEFBQUssTUFBQyxBQUFPLFFBQUMsQUFBRSxJQUFFLEFBQU8sUUFBQyxBQUFhLEFBQUMsQUFBQyxBQUN6RDtBQUFDLEFBQ0QsQUFBSSx1QkFDSixBQUFDO0FBQ0EsQUFBSSx5QkFBQyxBQUFXLFlBQUMsQUFBYyxlQUFDLEFBQU8sUUFBQyxBQUFFLElBQ3pDLFVBQUMsQUFBVztBQUNYLEFBQUksOEJBQUMsQUFBYSxjQUFDLEFBQWUsZ0JBQUMsQ0FBQyxBQUFXLEFBQUMsY0FBRSxBQUFJLEFBQUMsQUFBQztBQUN4RCxBQUFJLDhCQUFDLEFBQVMsVUFBQyxBQUFLLE1BQUMsQUFBVyxZQUFDLEFBQUUsSUFBRSxBQUFPLFFBQUMsQUFBYSxBQUFDLEFBQUM7QUFDNUQsQUFBSSw4QkFBQyxBQUFtQixvQkFBQyxBQUFPLEFBQUMsQUFBQztBQUNsQyxBQUFJLDhCQUFDLEFBQWEsY0FBQyxBQUFZLGFBQUMsQUFBTyxBQUFDLEFBQUM7QUFDekMsQUFBeUQ7QUFDekQsQUFBb0Q7QUFDcEQsQUFBSSw4QkFBQyxBQUFVLFdBQUMsQUFBeUIsMEJBQ3hDLEFBQUksTUFBQyxBQUFZLGFBQUMsQUFBUyxBQUFFLGFBQzdCLEFBQUksTUFBQyxBQUFZLGFBQUMsQUFBYSxBQUFFLGtCQUFHLEFBQUMsQUFDckMsQUFBQyxBQUNIO0FBQUMsdUJBQ0QsVUFBQyxBQUFLO0FBQU8sQUFBUSxnQ0FBQyxBQUFLLE1BQUMsQUFBeUIsQUFBQyxBQUFDLEFBQUM7QUFBQyxBQUN6RCxBQUFDLEFBQ0g7QUFBQztBQUVELEFBQUssQUFBQztBQUVQLGlCQUFLLEFBQVMsVUFBQyxBQUFjO0FBQzVCLEFBQUUsQUFBQyxvQkFBQyxDQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFNLEFBQUM7QUFFeEIsQUFBTywwQkFBRyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQU8sUUFBQyxBQUFFLEFBQUMsQUFBQztBQUN2QyxvQkFBSSxBQUFNLEFBQUM7QUFFWCxBQUFFLEFBQUMsb0JBQUMsQUFBSSxLQUFDLEFBQU0sVUFBSSxBQUFTLFVBQUMsQUFBYSxBQUFDLGVBQzNDLEFBQUM7QUFDQSxBQUFNLCtCQUFHLEFBQUksS0FBQyxBQUFhLGNBQUMsQUFBUyxBQUFFLEFBQUMsQUFDekM7QUFBQyxBQUNELEFBQUksdUJBQ0osQUFBQztBQUNBLEFBQU0sK0JBQUcsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUUsQUFBQyxBQUN0QztBQUFDO0FBRUQsQUFBaUI7QUFDakIsb0JBQUksQUFBYyxtQkFBRywwQkFBVSxBQUFpQixRQUFFLEFBQWlCO0FBRWxFLEFBQUcsd0JBQUMsQUFBZ0IsaUJBQUMsQUFBYyxlQUFDLEFBQU0sUUFBRSxBQUFPLEFBQUMsQUFBQztBQUNyRCxBQUFHLHdCQUFDLEFBQVMsVUFBQyxBQUFLLE1BQUMsQUFBTyxRQUFDLEFBQUUsSUFBRSxBQUFLLEFBQUMsQUFBQyxBQUN4QztBQUFDLEFBQUM7QUFFRixBQUFzQztBQUN0QyxBQUFFLEFBQUMsb0JBQUMsQ0FBQyxBQUFPLEFBQUMsU0FDYixBQUFDO0FBQ0EsQUFBSSx5QkFBQyxBQUFXLFlBQUMsQUFBYyxlQUFDLEFBQU8sUUFBQyxBQUFFLElBQUUsVUFBQyxBQUFXO0FBRXZELEFBQUksOEJBQUMsQUFBYSxjQUFDLEFBQWUsZ0JBQUMsQ0FBQyxBQUFXLEFBQUMsY0FBRSxBQUFJLEFBQUMsQUFBQztBQUN4RCxBQUFPLGtDQUFHLEFBQUksTUFBQyxBQUFXLFlBQUMsQUFBVyxZQUFDLEFBQUUsQUFBQyxBQUFDO0FBQzNDLEFBQUksOEJBQUMsQUFBbUIsb0JBQUMsQUFBTyxBQUFDLEFBQUM7QUFFbEMsQUFBTSxtQ0FBRyxBQUFJLE1BQUMsQUFBUSxTQUFDLEFBQVcsQUFBRSxBQUFDO0FBQ3JDLEFBQWlEO0FBQ2pELEFBQXlFO0FBQ3pFLEFBQUUsQUFBQyw0QkFBQyxDQUFDLEFBQU0sQUFBQyxVQUNaLEFBQUM7QUFDQSxBQUFVLHVDQUFDO0FBQ1YsQUFBTSwyQ0FBRyxBQUFJLE1BQUMsQUFBUSxTQUFDLEFBQVcsQUFBRSxBQUFDO0FBQ3JDLEFBQUUsQUFBQyxvQ0FBQyxDQUFDLEFBQU0sQUFBQyxxQkFDQTtBQUNWLEFBQU0sK0NBQUcsQUFBSSxNQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUUsQUFBQztBQUNyQyxBQUFjLHFEQUFDLEFBQU0sVUFBRSxBQUFPLEFBQUMsQUFBQyxBQUNqQztBQUFDLGlDQUhELEFBQVUsRUFHUCxBQUFJLEFBQUMsQUFBQyxBQUNWLEFBQUksV0FDSCxBQUFjLGlCQUFDLEFBQU0sVUFBRSxBQUFPLEFBQUMsQUFBQyxBQUNsQztBQUFDLCtCQUFFLEFBQUcsQUFBQyxBQUFDLEFBQ1Q7QUFBQyxBQUNELEFBQUksK0JBQ0gsQUFBYyxpQkFBQyxBQUFNLFVBQUUsQUFBTyxBQUFDLEFBQUMsQUFFbEM7QUFBQyx1QkFDRCxVQUFDLEFBQUs7QUFBTyxBQUFRLGdDQUFDLEFBQUssTUFBQyxBQUF5QixBQUFDLEFBQUMsQUFBQztBQUFDLEFBQ3hELEFBQUMsQUFDSDtBQUFDLEFBQ0QsQUFBSSx1QkFDSixBQUFDO0FBQ0EsQUFBRSxBQUFDLHdCQUFDLEFBQUksS0FBQyxBQUFJLFFBQUksQUFBUSxTQUFDLEFBQUksQUFBQyxNQUMvQixBQUFDO0FBQ0EsQUFBSSw2QkFBQyxBQUFZLGFBQUMsQUFBVSxXQUFDLEFBQUUsR0FBQztBQUUvQixBQUFjLDZDQUFDLEFBQU0sVUFBRSxBQUFPLEFBQUMsQUFBQztBQUNoQyxBQUFJLGtDQUFDLEFBQVksYUFBQyxBQUFVLFdBQUMsQUFBRyxJQUFDO0FBQVEsQUFBYyxpREFBQyxBQUFNLFVBQUUsQUFBTyxBQUFDLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQyxBQUM5RTtBQUFDLEFBQUMsQUFBQztBQUVILEFBQUksNkJBQUMsQUFBTyxRQUFDLEFBQVEsU0FBQyxBQUFHLEtBQUUsQUFBSyxPQUFFLEFBQUssQUFBQyxBQUFDLEFBQzFDO0FBQUMsQUFDRCxBQUFJLDJCQUNKLEFBQUM7QUFDQSxBQUFjLHlDQUFDLEFBQU0sVUFBRSxBQUFPLEFBQUMsQUFBQyxBQUNqQztBQUFDLEFBQ0Y7QUFBQztBQUVELEFBQUssQUFBQyxBQUNSLEFBQUM7O0FBRUQsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFnQixBQUNuQixxQkFBRSxBQUFZLGlCQUFLLEFBQVMsYUFDekIsQUFBUyxhQUFJLEFBQVMsVUFBQyxBQUFXLGVBQ2xDLEFBQVMsYUFBSSxBQUFTLFVBQUMsQUFBZ0Isb0JBQ3ZDLEFBQVMsYUFBSSxBQUFTLFVBQUMsQUFBYyxBQUFFLEFBQUMsaUJBQzVDLEFBQUksS0FBQyxBQUFhLGNBQUMsQUFBWSxhQUFDLEFBQU8sQUFBQyxBQUFDO0FBRTFDLEFBQUksYUFBQyxBQUFtQixvQkFBQyxBQUFPLEFBQUMsQUFBQyxBQUNuQztBQUFDO0FBQUEsQUFBQztBQUVGLHdCQUFtQixzQkFBbkIsVUFBb0IsQUFBTztBQUUxQixBQUE4QztBQUM5QyxBQUFDLFVBQUMsQUFBMkIsQUFBQyw2QkFBQyxBQUFJLEFBQUUsQUFBQztBQUV0QyxBQUE0QjtBQUM1QixBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBSSxRQUFJLEFBQVEsU0FBQyxBQUFHLEFBQUMsS0FDOUIsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBUSxTQUFDLEFBQVMsVUFBQyxBQUFNLEFBQUMsQUFBQztBQUNoQyxBQUFJLGlCQUFDLEFBQVksYUFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFTLEFBQUUsQUFBQyxBQUFDLEFBQ3hEO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBYSxjQUFDLEFBQW9CLEFBQUUsQUFBQztBQUMxQyxBQUFJLGlCQUFDLEFBQWEsY0FBQyxBQUFzQix1QkFBQyxBQUFJLE1BQUMsQUFBSSxBQUFDLEFBQUM7QUFDckQsQUFBSSxpQkFBQyxBQUFVLFdBQUMsQUFBeUIsMEJBQUMsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUUsZUFBRSxBQUFFLEFBQUMsQUFBQyxBQUM1RTtBQUFDLEFBQ0Y7QUFBQztBQUVELHdCQUFpQixvQkFBakIsVUFBa0IsQUFBcUI7QUFFdEMsQUFBRSxBQUFDLFlBQUUsQUFBSSxLQUFDLEFBQUksUUFBSSxBQUFRLFNBQUMsQUFBRyxBQUFDLEtBQUMsQUFBTSxBQUFDO0FBRXZDLEFBQUksYUFBQyxBQUFrQixBQUFFLEFBQUM7QUFFMUIsQUFBRSxBQUFDLFlBQUMsQUFBTSxPQUFDLEFBQVksQUFBRSxBQUFDLGdCQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDO0FBRTNELEFBQUksYUFBQyxBQUFRLFNBQUMsQUFBUyxVQUFDLEFBQVcsYUFBRSxFQUFFLEFBQUUsSUFBRSxBQUFNLE9BQUMsQUFBSyxBQUFFLEFBQUUsQUFBQyxBQUFDO0FBRTdELEFBQUUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFLLFNBQUksQUFBUyxVQUFDLEFBQXdCLEFBQUMsMEJBQ3BELEFBQUMsQUFFRCxDQUFDLEFBQ0Y7QUFBQztBQUVELHdCQUFhLGdCQUFiO0FBRUMsQUFBbUY7QUFGcEYsb0JBaURDO0FBN0NBLEFBQTJFO0FBQzNFLEFBQTBDO0FBQzFDLEFBQTZDO0FBRTdDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFJLFFBQUksQUFBUSxTQUFDLEFBQUcsQUFBQyxLQUFLLEFBQU0sQUFBQztBQUMxQyxBQUFrRDtBQUVsRCxBQUE2RDtBQUM3RCxBQUE4QjtBQUM5QixBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBVyxBQUFDLGFBQ25DLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQVksYUFBQyxBQUFXLFlBQUMsQUFBRSxHQUFDO0FBQU8sQUFBSSxzQkFBQyxBQUFhLEFBQUUsQUFBQyxBQUFDO0FBQUMsQUFBQyxBQUFDO0FBQ2pFLEFBQU0sQUFBQyxBQUNSO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBWSxhQUFDLEFBQVcsWUFBQyxBQUFHLElBQUM7QUFBTyxBQUFJLHNCQUFDLEFBQWEsQUFBRSxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUMsQUFDbkU7QUFBQztBQUVELFlBQUksQUFBc0IseUJBQUcsQUFBSSxBQUFDO0FBQ2xDLFlBQUksQUFBWSxlQUFHLEFBQUssQUFBQztBQUV6QixZQUFJLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQU8sQUFBRSxBQUFDO0FBQ3hDLFlBQUksQUFBUSxXQUFHLEFBQUksS0FBQyxBQUFhLGNBQUMsQUFBVSxBQUFFLEFBQUM7QUFFL0MsQUFBRSxBQUFDLFlBQUMsQUFBSSxRQUFJLEFBQVEsWUFBSSxBQUFRLFlBQUksQ0FBQyxBQUFDLEFBQUMsR0FDdkMsQUFBQztBQUNBLEFBQUUsQUFBQyxnQkFBQyxBQUFJLE9BQUcsQUFBUSxBQUFDLFVBQUMsQUFBc0IseUJBQUcsQUFBSyxBQUFDO0FBQ3BELEFBQVksMkJBQUcsQUFBSSxBQUFDLEFBQ3JCO0FBQUM7QUFFRCxBQUFrRjtBQUNsRixBQUFvQjtBQUNwQixBQUF1RDtBQUN2RCxBQUFxQjtBQUVyQixBQUFjO0FBRWQsQUFBSSxhQUFDLEFBQWEsY0FBQyxBQUFzQix1QkFBQyxBQUFzQix3QkFBRSxBQUFZLEFBQUMsQUFBQztBQUNoRixBQUFJLGFBQUMsQUFBVSxXQUFDLEFBQXlCLDBCQUN4QyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQVMsQUFBRSxhQUM3QixBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQWEsQUFBRSxrQkFBRyxBQUFDLEFBQ3JDLEFBQUM7QUFFRixBQUFJLGFBQUMsQUFBYSxjQUFDLEFBQWUsQUFBRSxBQUFDLEFBQ3RDO0FBQUM7QUFBQSxBQUFDO0FBRUYsd0JBQWMsaUJBQWQ7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLFlBQUMsQUFBTSxBQUFDO0FBRTVCLEFBQXlEO0FBRXpELEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFLLFNBQUksQUFBUyxVQUFDLEFBQVcsZUFBSSxBQUFJLEtBQUMsQUFBSyxTQUFJLEFBQVMsVUFBQyxBQUFnQixBQUFDLGtCQUNuRixBQUFJLEtBQUMsQUFBZ0IsaUJBQUMsQUFBSSxBQUFFLEFBQUMsQUFDOUIsQUFBSSxZQUFDLEFBQUUsQUFBQyxJQUFDLEFBQUksS0FBQyxBQUFLLFNBQUksQUFBUyxVQUFDLEFBQWMsQUFBQyxnQkFDL0MsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFTLFVBQUMsQUFBVyxhQUFFLEVBQUUsQUFBRSxJQUFHLEFBQUcsSUFBQyxBQUFnQixpQkFBQyxBQUFnQixBQUFFLEFBQUUsQUFBQyxBQUFDLEFBQ3pGO0FBQUM7QUFBQSxBQUFDO0FBR0Ysd0JBQWtCLHFCQUFsQixVQUFtQixBQUFnQjtBQUFuQyxvQkEyQkM7QUF6QkEsQUFBTyxnQkFBQyxBQUFHLElBQUMsQUFBc0Isd0JBQUUsQUFBTyxBQUFDLEFBQUM7QUFFNUMsQUFBSSxhQUFDLEFBQWUsZ0JBQUMsQUFBYyxlQUNuQyxBQUFPLFNBQ1AsVUFBQyxBQUF5QjtBQUV6QixBQUFNLEFBQUMsb0JBQUMsQUFBRyxJQUFDLEFBQUssQUFBQyxBQUNsQixBQUFDO0FBQ0EscUJBQUssQUFBUyxVQUFDLEFBQU0sQUFBQztBQUN0QixxQkFBSyxBQUFTLFVBQUMsQUFBVztBQUN6QixBQUFJLDBCQUFDLEFBQW1CLG9CQUFDLEFBQU8sQUFBQyxBQUFDO0FBQ2xDLEFBQUksMEJBQUMsQUFBbUIsQUFBRSxBQUFDO0FBQzNCLEFBQUssQUFBQztBQUNQLHFCQUFLLEFBQVMsVUFBQyxBQUFnQjtBQUM5QixBQUFJLDBCQUFDLEFBQWdCLGlCQUFDLEFBQUksQUFBRSxBQUFDO0FBQzdCLEFBQUksMEJBQUMsQUFBbUIsb0JBQUMsQUFBTyxBQUFDLEFBQUM7QUFDbEMsQUFBSSwwQkFBQyxBQUFtQixBQUFFLEFBQUM7QUFDM0IsQUFBSyxBQUFDO0FBRVAscUJBQUssQUFBUyxVQUFDLEFBQWM7QUFDNUIsQUFBSSwwQkFBQyxBQUFRLFNBQUMsQUFBUyxVQUFDLEFBQWMsZ0JBQUMsRUFBQyxBQUFFLElBQUUsQUFBSSxNQUFDLEFBQWdCLGlCQUFDLEFBQWdCLEFBQUUsQUFBRSxBQUFDLEFBQUM7QUFDeEYsQUFBSyxBQUFDLEFBQ1IsQUFBQyxBQUNGOztBQUFDLEFBQ0QsQUFBQyxBQUNIO0FBQUM7QUFBQSxBQUFDO0FBR0Ysd0JBQW1DLHNDQUFuQyxVQUFvQyxBQUFZO0FBRS9DLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBWSxnQkFBSSxBQUFZLGFBQUMsQUFBTSxXQUFLLEFBQUMsQUFBQyxHQUFDLEFBQU0sQUFBQztBQUN2RCxZQUFJLEFBQVcsY0FBRyxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQWUsZ0JBQUMsQUFBWSxjQUFFLEFBQUksQUFBQyxBQUFDO0FBQ3pFLEFBQUUsQUFBQyxZQUFDLEFBQVcsY0FBRyxBQUFDLEFBQUMsR0FBQyxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQXNCLEFBQUUsQUFBQyxBQUNsRTtBQUFDO0FBQUEsQUFBQztBQUVGLHdCQUFxQix3QkFBckIsVUFBc0IsQUFBd0I7QUFFN0MsQUFBc0Q7QUFFdEQsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQUssU0FBSSxBQUFRLFNBQUMsQUFBSSxBQUFDLE1BQ2hDLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQW9CLHFCQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUMsQUFBQyxBQUMxQztBQUFDLEFBQ0QsQUFBSSxlQUFDLEFBQUUsQUFBQyxJQUFDLEFBQUksS0FBQyxBQUFLLFNBQUksQUFBUyxVQUFDLEFBQWdCLEFBQUMsa0JBQ2xELEFBQUM7QUFDQSxBQUFHLGlCQUFnQixTQUFrQixHQUFsQixLQUFBLEFBQU0sT0FBQyxBQUFXLGFBQWxCLFFBQWtCLFFBQWxCLEFBQWtCO0FBQWpDLG9CQUFJLEFBQU8sYUFBQTtBQUVkLEFBQU8sd0JBQUMsQUFBSSxBQUFFLEFBQUM7QUFDZjtBQUNELEFBQUcsaUJBQWdCLFNBQXVCLEdBQXZCLEtBQUEsQUFBTSxPQUFDLEFBQWdCLGtCQUF2QixRQUF1QixRQUF2QixBQUF1QjtBQUF0QyxvQkFBSSxBQUFPLGFBQUE7QUFFZCxBQUFFLEFBQUMsb0JBQUMsQ0FBQyxBQUFPLFFBQUMsQUFBWSxBQUFDLGNBQUMsQUFBTyxRQUFDLEFBQUksQUFBRSxBQUFDO0FBQzFDLEFBQ0Y7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBRUYsd0JBQWlCLG9CQUFqQjtBQUVDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFLLFNBQUksQUFBUyxVQUFDLEFBQXdCLDRCQUFJLEFBQUksS0FBQyxBQUFLLFNBQUksQUFBUSxTQUFDLEFBQUksQUFBQyxNQUNwRixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFRLFNBQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ2pDO0FBQUMsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUVGLHdCQUFpQixvQkFBakIsVUFBa0IsQUFBUztBQUUxQixBQUErRztBQUMvRyxBQUEyRyxBQUM1RztBQUFDO0FBQUEsQUFBQztBQUVGLHdCQUFpQixvQkFBakI7QUFFQyxBQUFJLGFBQUMsQUFBdUIsMEJBQUcsQUFBSSxLQUFDLEFBQUcsSUFBQyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUMsRUFBQyxBQUF3QixBQUFDLDBCQUFDLEFBQUssQUFBRSxVQUFHLEFBQUMsRUFBQyxBQUF3QixBQUFDLDBCQUFDLEFBQU0sQUFBRSxXQUFHLEFBQUksQUFBQyxPQUFFLEFBQUksQUFBQyxBQUFDO0FBQzdJLEFBQTZFLEFBQzlFO0FBQUM7QUFBQSxBQUFDO0FBRUYsd0JBQWtCLHFCQUFsQjtBQUVDLEFBQUksYUFBQyxBQUFXLGNBQUcsQUFBSSxBQUFDO0FBQ3hCLFlBQUksQUFBSSxPQUFHLEFBQUksQUFBQztBQUNoQixBQUFVLG1CQUFDO0FBQWEsQUFBSSxpQkFBQyxBQUFXLGNBQUcsQUFBSyxBQUFDLEFBQUM7QUFBQyxXQUFFLEFBQUcsQUFBQyxBQUFDLEFBQzNEO0FBQUM7QUFBQSxBQUFDO0FBRUYsd0JBQTBCLDZCQUExQjtBQUVDLEFBQUksYUFBQyxBQUEwQiw2QkFBRyxBQUFJLEFBQUM7QUFDdkMsWUFBSSxBQUFJLE9BQUcsQUFBSSxBQUFDO0FBQ2hCLEFBQVUsbUJBQUM7QUFBYSxBQUFJLGlCQUFDLEFBQTBCLDZCQUFHLEFBQUssQUFBQyxBQUFDO0FBQUMsV0FBRSxBQUFJLEFBQUMsQUFBQyxBQUMzRTtBQUFDO0FBRUQsd0JBQW1CLHNCQUFuQixVQUFvQixBQUFrQjtBQUVyQyxBQUErRTtBQUY1RCxnQ0FBQTtBQUFBLHNCQUFrQjs7QUFJckMsWUFBSSxBQUFjLEFBQUM7QUFDbkIsWUFBSSxBQUFvQixBQUFDO0FBRXpCLEFBQUUsQUFBQyxZQUFHLEFBQU8sV0FBSSxBQUFPLFFBQUMsQUFBRSxBQUFDLEVBQXZCLElBQTJCLEFBQUksS0FBQyxBQUFnQixpQkFBQyxBQUFnQixBQUFFLEFBQUMsb0JBQ3pFLEFBQUM7QUFFQSxnQkFBSSxBQUFPLFVBQUcsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFJLEtBQUMsQUFBZ0IsaUJBQUMsQUFBZ0IsQUFBRSxBQUFDLEFBQUM7QUFDekUsQUFBVywwQkFBRyxBQUFVLHlCQUFDLEFBQU8sVUFBRyxBQUFPLFFBQUMsQUFBSSxPQUFHLEFBQUUsQUFBQyxBQUFDLEFBQ3ZEO0FBQUM7QUFFRCxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBSyxTQUFJLEFBQVEsU0FBQyxBQUFJLEFBQUMsTUFDaEMsQUFBQztBQUNBLEFBQUssb0JBQUcsQUFBb0IsdUJBQUcsQUFBSSxLQUFDLEFBQTBCLEFBQUUsQUFBQyxBQUNsRTtBQUFDLEFBQ0QsQUFBSSxlQUNKLEFBQUM7QUFDQSxBQUFNLEFBQUMsb0JBQUMsQUFBSSxLQUFDLEFBQU0sQUFBQyxBQUNwQixBQUFDO0FBQ0EscUJBQUssQUFBUyxVQUFDLEFBQVc7QUFDekIsQUFBSyw0QkFBRyxBQUFXLGNBQUcsQUFBVyxBQUFDO0FBQ2xDLEFBQUssQUFBQztBQUVQLHFCQUFLLEFBQVMsVUFBQyxBQUFnQjtBQUM5QixBQUFLLDRCQUFHLEFBQVcsY0FBRyxBQUFXLEFBQUM7QUFDbEMsQUFBSyxBQUFDO0FBRVAscUJBQUssQUFBUyxVQUFDLEFBQWM7QUFDNUIsQUFBSyw0QkFBRyxBQUFlLGtCQUFHLEFBQVcsQUFBQztBQUN0QyxBQUFLLEFBQUM7QUFFUCxxQkFBSyxBQUFTLFVBQUMsQUFBTTtBQUNwQixBQUFLLDRCQUFHLEFBQW9CLHVCQUFHLEFBQUksS0FBQyxBQUEwQixBQUFFLEFBQUM7QUFDakUsQUFBSyxBQUFDLEFBQ1IsQUFBQyxBQUNGOztBQUFDO0FBRUQsQUFBUSxpQkFBQyxBQUFLLFFBQUcsQUFBSyxBQUFDLEFBQ3hCO0FBQUM7QUFBQSxBQUFDO0FBRU0sd0JBQTBCLDZCQUFsQztBQUVDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBa0IsQUFBRSxBQUFDLHNCQUN2QyxBQUFDO0FBQ0EsQUFBTSxtQkFBQyxBQUFJLE9BQUcsQUFBSSxLQUFDLEFBQVEsU0FBQyxBQUFrQixBQUFFLEFBQUMsQUFDbEQ7QUFBQztBQUNELEFBQU0sZUFBQyxBQUFVLEFBQUMsQUFDbkI7QUFBQztBQUdELEFBQW9CO0FBQ3BCLHdCQUFHLE1BQUg7QUFBZ0IsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFhLGdCQUFFLEFBQUksS0FBQyxBQUFhLGNBQUMsQUFBTSxBQUFFLFdBQUcsQUFBSSxBQUFDLEFBQUM7QUFBQztBQUFBLEFBQUM7QUFDakYsd0JBQVEsV0FBUjtBQUFhLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBZSxnQkFBQyxBQUFtQixBQUFFLEFBQUMsQUFBRTtBQUFDO0FBQUEsQUFBQztBQUNuRSx3QkFBVyxjQUFYLFVBQVksQUFBRTtBQUFJLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBZSxnQkFBQyxBQUFjLGVBQUMsQUFBRSxBQUFDLEFBQUMsQUFBRTtBQUFDO0FBQUEsQUFBQztBQUNyRSx3QkFBUyxZQUFUO0FBQW9CLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBYSxnQkFBRSxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQVksQUFBRSxpQkFBRyxBQUFJLEFBQUMsQUFBQztBQUFDO0FBQUEsQUFBQztBQUUzRiwwQkFBSSxxQkFBYTthQUFqQjtBQUFzQixBQUFNLG1CQUFDLEFBQUksQUFBQyxBQUFDO0FBQUM7O3NCQUFBOztBQUVwQywwQkFBSSxxQkFBVTthQUFkO0FBQW1CLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQXNCLHVCQUFDLEFBQXlCLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFFbEYsMEJBQUkscUJBQVU7YUFBZDtBQUFtQixBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFXLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBQzlDLDBCQUFJLHFCQUF5QjthQUE3QjtBQUE0QyxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUEwQixBQUFDLEFBQUM7QUFBQzs7c0JBQUE7O0FBQUEsQUFBQztBQUN0RiwwQkFBSSxxQkFBVzthQUFmO0FBQW9CLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQXVCLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBRzNELDBCQUFJLHFCQUFZO0FBRGhCLEFBQXlCO2FBQ3pCO0FBQXFCLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQWEsQUFBQyxBQUFDO0FBQUM7O3NCQUFBOztBQUFBLEFBQUM7QUFDbEQsMEJBQUkscUJBQWdCO2FBQXBCO0FBQXlCLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQWlCLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBQzFELDBCQUFJLHFCQUFRO2FBQVo7QUFBaUIsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBZSxBQUFDLEFBQUM7QUFBQzs7c0JBQUE7O0FBQUEsQUFBQztBQUNoRCwwQkFBSSxxQkFBVTthQUFkO0FBQW1CLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQVcsQUFBQyxBQUFDO0FBQUM7O3NCQUFBOztBQUFBLEFBQUM7QUFDOUMsMEJBQUkscUJBQWE7YUFBakI7QUFBc0IsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBZSxBQUFDLEFBQUM7QUFBQzs7c0JBQUE7O0FBQUEsQUFBQztBQUNyRCwwQkFBSSxxQkFBZ0I7YUFBcEI7QUFBeUIsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBaUIsQUFBQyxBQUFDO0FBQUM7O3NCQUFBOztBQUFBLEFBQUM7QUFFMUQsMEJBQUkscUJBQVk7QUFEaEIsQUFBb0Q7YUFDcEQ7QUFBcUIsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBYSxBQUFDLEFBQUM7QUFBQzs7c0JBQUE7O0FBQUEsQUFBQztBQUVsRCwwQkFBSSxxQkFBUztBQURiLEFBQW1FO2FBQ25FO0FBQWtCLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQTBCLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBRTVELDBCQUFJLHFCQUFLO0FBRFQsQUFBOEQ7YUFDOUQ7QUFBYyxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBQ3BDLDBCQUFJLHFCQUFJO2FBQVI7QUFBYSxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFLLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBRW5DLFdBQUEsQUFBQztBQXptQkQsQUF5bUJDOzs7Ozs7Ozs7OztBQ3hyQkQsQUFBTyxBQUFhLEFBQVEsQUFBRSxBQUFNLEFBQWUsQUFBQyxBQU1wRCxBQUFNOztBQUFOLElBQVksQUFJWDtBQUpELFdBQVksQUFBMEI7QUFFckMsMkVBQU07QUFDTiw2RUFBUSxBQUNUO0FBQUMsR0FKVyxBQUEwQixvRUFBMUIsQUFBMEIsNkJBSXJDO0FBRUQsQUFJRTs7Ozs7QUFDRjtBQWFDLG9DQUFvQixBQUFpQyxNQUFVLEFBQWUsUUFBUyxBQUF3QixpQkFBUyxBQUEyQjtBQUEvSCxhQUFJLE9BQUosQUFBSSxBQUE2QjtBQUFVLGFBQU0sU0FBTixBQUFNLEFBQVM7QUFBUyxhQUFlLGtCQUFmLEFBQWUsQUFBUztBQUFTLGFBQWtCLHFCQUFsQixBQUFrQixBQUFTO0FBVG5KLGFBQVEsV0FBOEIsQUFBRSxBQUFDO0FBRXpDLGFBQU8sVUFBWSxBQUFJLEFBQUM7QUFDeEIsQUFBc0Q7QUFDdEQsYUFBVyxjQUFTLEFBQUksQUFBQztBQUV6QixhQUFTLFlBQWEsQUFBSSxBQUFDO0FBQzNCLGFBQVUsYUFBYSxBQUFLLEFBQUMsQUFFeUg7QUFBQztBQUFBLEFBQUM7QUFFeEoscUNBQU0sU0FBTjtBQUFXLEFBQU0sZUFBQyxBQUFDLEVBQUMsQUFBSSxLQUFDLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBRSxBQUFDLEFBQUMsQUFBQztBQUFDO0FBRTdDLHFDQUFjLGlCQUFkO0FBQW1CLEFBQU0sZUFBQyxBQUFDLEVBQUMsQUFBSSxLQUFDLEFBQWUsa0JBQUcsQUFBSSxLQUFDLEFBQUUsQUFBQyxBQUFDLEFBQUM7QUFBQztBQUU5RCxxQ0FBYyxpQkFBZDtBQUFtQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQU0sQUFBRSxTQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBa0IsQUFBQyxBQUFDO0FBQUM7QUFFdkUscUNBQVEsV0FBUjtBQUVDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFJLFFBQUksQUFBMEIsMkJBQUMsQUFBTSxBQUFDLFFBQ2xELEFBQU0sT0FBQyxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQWUsZ0JBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDO0FBRXpELEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFJLFFBQUksQUFBMEIsMkJBQUMsQUFBUSxBQUFDLFVBQ3BELEFBQU0sT0FBQyxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQWEsY0FBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUM7QUFFdkQsQUFBTSxlQUFDLEFBQUksQUFBQyxBQUNiO0FBQUM7QUFFUyxxQ0FBZ0IsbUJBQTFCO0FBQTBELEFBQU0sb0JBQU0sQUFBUSxTQUFDLEFBQU0sT0FBRSxVQUFBLEFBQUs7QUFBSSxtQkFBQSxBQUFLLE1BQUwsQUFBTSxBQUFVO0FBQUEsQUFBQyxBQUFDLEFBQUMsU0FBbEQsQUFBSTtBQUErQztBQUUxRyxxQ0FBZSxrQkFBekI7QUFBeUQsQUFBTSxvQkFBTSxBQUFRLFNBQUMsQUFBTSxPQUFFLFVBQUEsQUFBSztBQUFJLG1CQUFBLEFBQUssTUFBTCxBQUFNLEFBQVM7QUFBQSxBQUFDLEFBQUMsQUFBQyxTQUFqRCxBQUFJO0FBQThDO0FBRWxILHFDQUFRLFdBQVI7QUFBYSxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUksUUFBSSxBQUEwQiwyQkFBQyxBQUFNLEFBQUM7QUFBQztBQUVwRSxxQ0FBWSxlQUFaO0FBQWlCLEFBQU0sZUFBQyxBQUFLLEFBQUMsQUFBQztBQUFDO0FBRWhDLHFDQUFVLGFBQVYsVUFBVyxBQUFjO0FBRXhCLEFBQUksYUFBQyxBQUFTLFlBQUcsQUFBSSxBQUFDO0FBQ3RCLEFBQUksYUFBQyxBQUFjLEFBQUUsaUJBQUMsQUFBSSxLQUFDLEFBQVMsV0FBRSxBQUFJLEFBQUMsQUFBQyxBQUM3QztBQUFDO0FBRUQscUNBQVcsY0FBWCxVQUFZLEFBQWM7QUFFekIsQUFBSSxhQUFDLEFBQVUsYUFBRyxBQUFJLEFBQUM7QUFDdkIsQUFBRSxBQUFDLFlBQUMsQUFBSSxBQUFDLE1BQ1QsQUFBQztBQUNBLEFBQUUsQUFBQyxnQkFBQyxDQUFDLEFBQUksS0FBQyxBQUFNLEFBQUUsU0FBQyxBQUFRLFNBQUMsQUFBVSxBQUFDLEFBQUMsYUFBQyxBQUFJLEtBQUMsQUFBTSxBQUFFLFNBQUMsQUFBUSxTQUFDLEFBQVUsQUFBQyxBQUFDO0FBQzVFLEFBQUksaUJBQUMsQUFBVSxXQUFDLEFBQUssQUFBQyxBQUFDLEFBQ3hCO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBTSxBQUFFLFNBQUMsQUFBVyxZQUFDLEFBQVUsQUFBQyxBQUFDLEFBQ3ZDO0FBQUMsQUFDRjtBQUFDO0FBRUQscUNBQU0sU0FBTixVQUFPLEFBQXNCLE9BQUUsQUFBNEI7QUFBcEQsOEJBQUE7QUFBQSxvQkFBc0I7O0FBQUUsb0NBQUE7QUFBQSwwQkFBNEI7O0FBRXpELFlBQUksQUFBSyxBQUFDO0FBQ1YsQUFBRSxBQUFDLFlBQUMsQUFBSyxTQUFJLEFBQUksQUFBQyxNQUFDLEFBQUssUUFBRyxBQUFLLEFBQUMsQUFDakMsQUFBSSxXQUFDLEFBQUssUUFBRyxDQUFDLEFBQUksS0FBQyxBQUFTLEFBQUM7QUFFN0IsQUFBSSxhQUFDLEFBQVUsV0FBQyxBQUFLLEFBQUMsQUFBQztBQUN2QixBQUFJLGFBQUMsQUFBVyxZQUFDLENBQUMsQUFBSyxBQUFDLEFBQUM7QUFFekIsQUFBbUg7QUFDbkgsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBWSxBQUFFLEFBQUMsZ0JBQ3pCLEFBQUM7QUFDQSxBQUFHLEFBQUMsaUJBQWMsU0FBYSxHQUFiLEtBQUEsQUFBSSxLQUFDLEFBQVEsVUFBYixRQUFhLFFBQWIsQUFBYTtBQUExQixvQkFBSSxBQUFLLFdBQUE7QUFBbUIsQUFBSyxzQkFBQyxBQUFNLE9BQUMsQUFBSyxPQUFFLEFBQUssQUFBQyxBQUFDO0FBQUEsQUFDN0Q7QUFBQztBQUVELEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFXLGVBQUksQUFBVyxBQUFDLGFBQUMsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFxQixBQUFFLEFBQUM7QUFFaEYsQUFBRSxZQUFDLEFBQVcsQUFBQyxhQUNmLEFBQUM7QUFDQSxBQUFFLEFBQUMsZ0JBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxXQUFDLEFBQVcsQUFBRSxBQUFDO0FBRW5ELEFBQUUsQUFBQyxnQkFBQyxBQUFHLElBQUMsQUFBSSxRQUFJLEFBQVEsY0FBQyxBQUFHLEFBQUMsS0FBQyxBQUFHLElBQUMsQUFBYSxjQUFDLEFBQXNCLEFBQUUsQUFBQztBQUN6RSxBQUFHLGdCQUFDLEFBQWEsY0FBQyxBQUFzQix1QkFBQyxBQUFLLEFBQUMsQUFBQztBQUNoRCxBQUFHLGdCQUFDLEFBQWEsY0FBQyxBQUFlLEFBQUUsQUFBQyxBQUNyQztBQUFDLEFBQ0g7QUFBQztBQUVELHFDQUFXLGNBQVg7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBWSxBQUFFLEFBQUMsZ0JBQUMsQUFBTSxBQUFDO0FBRWhDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBTSxVQUFJLEFBQUMsQUFBQyxHQUM3QixBQUFJLEtBQUMsQUFBVyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUFDLEFBQ25DLEFBQUksZ0JBQ0osQUFBQztBQUNBLGdCQUFJLEFBQXFCLDZCQUFRLEFBQVEsU0FBQyxBQUFNLE9BQUUsVUFBQyxBQUE4QjtBQUFLLHVCQUFBLEFBQUssTUFBTCxBQUFNLEFBQVU7QUFBQSxBQUFDLGFBQTNFLEFBQUksRUFBd0UsQUFBTSxBQUFDO0FBRS9HLEFBQXlHO0FBRXpHLEFBQUUsQUFBQyxnQkFBQyxBQUFxQix5QkFBSSxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxRQUNqRCxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3hCLEFBQUksV0FDSCxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQUssQUFBQyxBQUFDO0FBRXpCLGdCQUFJLEFBQW9CLDRCQUFRLEFBQVEsU0FBQyxBQUFNLE9BQUUsVUFBQyxBQUE4QjtBQUFLLHVCQUFBLEFBQUssTUFBTCxBQUFNLEFBQVM7QUFBQSxBQUFDLGFBQTFFLEFBQUksRUFBdUUsQUFBTSxBQUFDO0FBRTdHLEFBQUUsQUFBQyxnQkFBQyxBQUFvQix3QkFBSSxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxRQUNoRCxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3ZCLEFBQUksV0FDSCxBQUFJLEtBQUMsQUFBVSxXQUFDLEFBQUssQUFBQyxBQUN4QjtBQUFDO0FBRUQsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxBQUFDLFlBQUUsQUFBSSxLQUFDLEFBQVEsQUFBRSxXQUFDLEFBQVcsQUFBRSxBQUFDLEFBQ3JEO0FBQUM7QUFFRCxxQ0FBdUIsMEJBQXZCO0FBRUMsQUFBRyxhQUFjLFNBQWEsR0FBYixLQUFBLEFBQUksS0FBQyxBQUFRLFVBQWIsUUFBYSxRQUFiLEFBQWE7QUFBMUIsZ0JBQUksQUFBSyxXQUFBO0FBRVosQUFBSyxrQkFBQyxBQUF1QixBQUFFLEFBQUM7QUFDaEM7QUFFRCxBQUFJLGFBQUMsQUFBVyxBQUFFLEFBQUMsQUFDcEI7QUFBQztBQUVELHFDQUFVLGFBQVY7QUFBeUIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFNLEFBQUUsU0FBQyxBQUFRLFNBQUMsQUFBVSxBQUFDLEFBQUMsQUFBQztBQUFDO0FBRXJFLHFDQUFvQix1QkFBcEI7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBVSxBQUFFLEFBQUMsY0FDdEIsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBYyxBQUFFLGlCQUFDLEFBQUksS0FBQyxBQUFJLE1BQUMsQUFBSyxBQUFDLE9BQUMsQUFBTyxVQUFHLEFBQVEsVUFBRSxBQUFHLEtBQUUsQUFBTSxRQUFFLEFBQWMsZ0JBQUUsQUFBSyxPQUFFLEFBQUssT0FBRSxBQUFRLFVBQUU7QUFBWSxBQUFDLHNCQUFDLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUUsQUFBRSxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUMsQUFBQyxpQkFBM0c7QUFDL0MsQUFBSSxpQkFBQyxBQUFNLEFBQUUsU0FBQyxBQUFXLFlBQUMsQUFBVSxBQUFDLEFBQUMsQUFDdkM7QUFBQyxBQUNELEFBQUksZUFDSixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFjLEFBQUUsaUJBQUMsQUFBSSxLQUFDLEFBQUksTUFBQyxBQUFLLEFBQUMsT0FBQyxBQUFTLFlBQUcsQUFBUSxVQUFFLEFBQUcsS0FBRSxBQUFNLFFBQUUsQUFBYyxnQkFBRSxBQUFLLE9BQUUsQUFBSyxPQUFFLEFBQVEsVUFBRTtBQUFZLEFBQUMsc0JBQUMsQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQVEsVUFBRSxBQUFFLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQyxBQUFDLGlCQUEzRztBQUNqRCxBQUFJLGlCQUFDLEFBQU0sQUFBRSxTQUFDLEFBQVEsU0FBQyxBQUFVLEFBQUMsQUFBQyxBQUNwQztBQUFDLEFBQ0Y7QUFBQztBQUNGLFdBQUEsQUFBQztBQTVJRCxBQTRJQzs7Ozs7Ozs7O0FDM0pEO0FBS0MsMkJBQVksQUFBbUI7QUFGL0IsYUFBUSxXQUFtQixBQUFFLEFBQUM7QUFJN0IsQUFBSSxhQUFDLEFBQVEsV0FBRyxBQUFRLEFBQUMsQUFDMUI7QUFBQztBQUVELDRCQUFjLGlCQUFkLFVBQWUsQUFBeUI7QUFFdkMsQUFBSSxhQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBVyxBQUFDLEFBQUMsQUFDakM7QUFBQztBQUVELDBCQUFJLHlCQUFtQjthQUF2QjtBQUVDLEFBQU0sd0JBQU0sQUFBUSxTQUFDLEFBQUssTUFBRSxVQUFDLEFBQVc7QUFBSyx1QkFBQSxBQUFXLFlBQUMsQUFBTSxPQUFDLEFBQWEsY0FBQyxBQUFNLFVBQXZDLEFBQTJDLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDNUYsYUFEUSxBQUFJO0FBQ1g7O3NCQUFBOztBQUNGLFdBQUEsQUFBQztBQW5CRCxBQW1CQzs7Ozs7Ozs7Ozs7QUNuQkQsQUFBTyxBQUFFLEFBQXNCLEFBQUUsQUFBMEIsQUFBRSxBQUFNLEFBQW1DLEFBQUM7Ozs7Ozs7Ozs7O0FBS3ZHO0FBQThCLHdCQUFzQjtBQVNuRCxzQkFBWSxBQUFtQjtBQUEvQixvQkFFQyxrQkFBTSxBQUEwQixtREFBQyxBQUFRLFVBQUUsQUFBWSxjQUFFLEFBQXlCLDJCQUFFLEFBQWtCLEFBQUMsdUJBVXZHO0FBUkEsQUFBSSxjQUFDLEFBQUUsS0FBRyxBQUFhLGNBQUMsQUFBRSxBQUFDO0FBQzNCLEFBQUksY0FBQyxBQUFJLE9BQUcsQUFBYSxjQUFDLEFBQUksQUFBQztBQUMvQixBQUFJLGNBQUMsQUFBSyxRQUFHLEFBQWEsY0FBQyxBQUFLLEFBQUM7QUFDakMsQUFBSSxjQUFDLEFBQVksZUFBRyxBQUFhLGNBQUMsQUFBYSxBQUFDO0FBQ2hELEFBQUksY0FBQyxBQUFpQixvQkFBRyxBQUFhLGNBQUMsQUFBa0IsQUFBQztBQUMxRCxBQUFJLGNBQUMsQUFBbUIsc0JBQUcsQUFBYSxjQUFDLEFBQXFCLEFBQUM7QUFDL0QsQUFBSSxjQUFDLEFBQUssUUFBRyxBQUFhLGNBQUMsQUFBSyxBQUFDO0FBQ2pDLEFBQUksY0FBQyxBQUFXLGNBQUcsQUFBYSxjQUFDLEFBQVcsQUFBQztlQUM5QztBQUFDO0FBRUQsdUJBQVMsWUFBVCxVQUFVLEFBQWdCO0FBQUksQUFBSSxhQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUMsQUFBQztBQUFDO0FBRTVELDBCQUFJLG9CQUFPO2FBQVg7QUFBMkIsQUFBTSxtQkFBWSxBQUFJLEtBQUMsQUFBUSxBQUFDLEFBQUM7QUFBQzs7c0JBQUE7O0FBRTdELDBCQUFJLG9CQUFlO2FBQW5CO0FBQW1DLEFBQU0sbUJBQVksQUFBSSxLQUFDLEFBQWdCLEFBQUUsQUFBQyxBQUFDO0FBQUM7O3NCQUFBOztBQUUvRSwwQkFBSSxvQkFBYzthQUFsQjtBQUFrQyxBQUFNLG1CQUFZLEFBQUksS0FBQyxBQUFlLEFBQUUsQUFBQyxBQUFDO0FBQUM7O3NCQUFBOztBQUM5RSxXQUFBLEFBQUM7QUE5QkQsQUFBOEIsQUFBc0IsQUE4Qm5EOzs7Ozs7Ozs7Ozs7Ozs7cUJDckNRLEFBQVEsQUFBRSxBQUFNLEFBQWtCLEFBQUMsQUFDNUMsQUFBTzs7Ozs7Ozs7O29CQUFFLEFBQU8sQUFBRSxBQUFNLEFBQWlCLEFBQUMsQUFDMUMsQUFBTzs7Ozs7Ozs7O21CQUFFLEFBQU0sQUFBRSxBQUFNLEFBQWdCLEFBQUMsQUFDeEMsQUFBTzs7Ozs7Ozs7O3dCQUFFLEFBQVcsQUFBRSxBQUFNLEFBQXNCLEFBQUMsQUFDbkQsQUFBTzs7Ozs7Ozs7OzBCQUFFLEFBQWEsQUFBRSxBQUFNLEFBQXdCLEFBQUM7Ozs7Ozs7Ozs7OztBQ0t2RCxBQUFPLEFBQXdCLEFBQVEsQUFBRSxBQUFNLEFBQWUsQUFBQzs7QUFDL0QsQUFBTyxBQUFFLEFBQVksQUFBRSxBQUFNLEFBQTJDLEFBQUM7O0FBQ3pFLEFBQU8sQUFBRSxBQUFXLEFBQUUsQUFBYSxBQUFvQixBQUFNLEFBQVcsQUFBQzs7QUFTekU7QUE2Q0MscUJBQVksQUFBaUI7QUFsQ3BCLGFBQWEsZ0JBQWMsQUFBRSxBQUFDO0FBRTlCLGFBQWtCLHFCQUFjLEFBQUUsQUFBQztBQUU1QyxhQUFhLGdCQUFtQixBQUFFLEFBQUM7QUFDbkMsYUFBc0IseUJBQXFCLEFBQUUsQUFBQztBQUd0QyxhQUFjLGlCQUFtQixBQUFFLEFBQUM7QUFHNUMsYUFBa0IscUJBQUcsQUFBSSxBQUFDO0FBSTFCLGFBQWMsaUJBQVksQUFBSyxBQUFDO0FBRWhDLEFBQWlDO0FBQ2pDLGFBQVcsY0FBWSxBQUFLLEFBQUM7QUFFN0IsYUFBVSxhQUFhLEFBQUssQUFBQztBQUM3QixhQUFlLGtCQUFZLEFBQUssQUFBQztBQUVqQyxBQUFNO0FBQ04sYUFBYSxnQkFBa0IsQUFBSSxBQUFDO0FBQ3BDLGFBQW1CLHNCQUFHLEFBQUUsQUFBQztBQUV6QixhQUFrQixxQkFBUyxBQUFFLEFBQUM7QUFFOUIsYUFBMkIsOEJBQUcsQUFBRSxBQUFDO0FBQ2pDLGFBQVksZUFBWSxBQUFLLEFBQUM7QUFFOUIsYUFBVSxhQUFZLEFBQUssQUFBQztBQUkzQixBQUFJLGFBQUMsQUFBRSxLQUFHLEFBQVcsWUFBQyxBQUFFLEFBQUM7QUFDekIsQUFBSSxhQUFDLEFBQUksT0FBRyxBQUFXLFlBQUMsQUFBSSxBQUFDO0FBQzdCLEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBQyxFQUFDLEFBQU0sT0FBQyxBQUFXLFlBQUMsQUFBRyxLQUFFLEFBQVcsWUFBQyxBQUFHLEFBQUMsQUFBQztBQUMzRCxBQUFJLGFBQUMsQUFBTyxVQUFHLEFBQVcsWUFBQyxBQUFPLEFBQUM7QUFDbkMsQUFBSSxhQUFDLEFBQVcsY0FBRyxBQUFXLFlBQUMsQUFBVyxlQUFJLEFBQUUsQUFBQztBQUNqRCxBQUFJLGFBQUMsQUFBRyxNQUFHLEFBQVcsWUFBQyxBQUFHLE1BQUcsQUFBVyxZQUFDLEFBQUcsSUFBQyxBQUFPLFFBQUMsQUFBYyxnQkFBQyxBQUFLLEFBQUMsU0FBRyxBQUFFLEFBQUM7QUFDaEYsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFXLFlBQUMsQUFBUSxBQUFDO0FBQ3BDLEFBQUksYUFBQyxBQUFJLE9BQUcsQUFBVyxZQUFDLEFBQUksQUFBQztBQUM3QixBQUFJLGFBQUMsQUFBUyxZQUFHLEFBQVcsWUFBQyxBQUFVLEFBQUM7QUFDeEMsQUFBSSxhQUFDLEFBQWtCLHFCQUFJLEFBQVcsWUFBQyxBQUFxQixBQUFDO0FBRTdELEFBQWlDO0FBQ2pDLEFBQUksYUFBQyxBQUFvQixBQUFFLEFBQUM7QUFFNUIsWUFBSSxBQUF1QixXQUFFLEFBQWdCLEFBQUM7QUFDOUMsQUFBRyxBQUFDLGFBQXdCLFNBQXlCLEdBQXpCLEtBQUEsQUFBVyxZQUFDLEFBQWEsZUFBekIsUUFBeUIsUUFBekIsQUFBeUI7QUFBaEQsZ0JBQUksQUFBZSxxQkFBQTtBQUV2QixBQUFTLHdCQUFHLEFBQUksQUFBVyx5QkFBQyxBQUFlLEFBQUMsQUFBQztBQUU3QyxBQUF5QztBQUN6QyxBQUFFLEFBQUMsZ0JBQUMsQUFBUyxVQUFDLEFBQU0sT0FBQyxBQUFZLEFBQUUsQUFBQyxnQkFBQyxBQUFJLEtBQUMsQUFBa0IsbUJBQUMsQUFBSSxLQUFDLEFBQVMsVUFBQyxBQUFRLEFBQUMsQUFBQztBQUN0RixBQUFzRDtBQUV0RCxBQUFJLGlCQUFDLEFBQWEsY0FBQyxBQUFJLEtBQUMsQUFBUyxBQUFDLEFBQUM7QUFFbkMsQUFBNkU7QUFDN0UsQUFBRSxBQUFDLGdCQUFDLENBQUMsQUFBSSxLQUFDLEFBQXNCLHVCQUFDLEFBQVMsVUFBQyxBQUFNLE9BQUMsQUFBTyxBQUFDLEFBQUMsVUFBQyxBQUFJLEtBQUMsQUFBc0IsdUJBQUMsQUFBUyxVQUFDLEFBQU0sT0FBQyxBQUFPLEFBQUMsV0FBRyxBQUFFLEFBQUM7QUFDdkgsQUFBSSxpQkFBQyxBQUFzQix1QkFBQyxBQUFTLFVBQUMsQUFBTSxPQUFDLEFBQU8sQUFBQyxTQUFDLEFBQUksS0FBQyxBQUFTLEFBQUMsQUFBQztBQUN0RTtBQUVELEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBVyxZQUFDLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQVcsWUFBQyxBQUFRLEFBQUMsWUFBRyxBQUFJLEFBQUMsQUFFaEY7QUFBQztBQUVELHNCQUEwQiw2QkFBMUIsVUFBMkIsQUFBVztBQUVyQyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQXNCLHVCQUFDLEFBQVcsQUFBQyxnQkFBSSxBQUFFLEFBQUMsQUFDdkQ7QUFBQztBQUVELHNCQUFVLGFBQVY7QUFFQyxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQUksS0FBQyxBQUFjLEFBQUMsZ0JBQ3pCLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQWlCLEFBQUUsQUFBQztBQUN6QixBQUFJLGlCQUFDLEFBQW9CLEFBQUUsQUFBQztBQUU1QixBQUFJLGlCQUFDLEFBQWEsZ0JBQUcsQUFBSSxBQUFZLCtCQUFDLEFBQUksS0FBQyxBQUFFLElBQUUsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDO0FBQzlELEFBQUksaUJBQUMsQUFBYyxpQkFBRyxBQUFJLEFBQUMsQUFDNUI7QUFBQyxBQUNGO0FBQUM7QUFFRCxzQkFBSSxPQUFKO0FBRUMsQUFBSSxhQUFDLEFBQU0sQUFBRSxBQUFDO0FBQ2QsQUFBOEI7QUFDOUIsQUFBSSxhQUFDLEFBQWEsY0FBQyxBQUFJLEFBQUUsQUFBQztBQUMxQixBQUFJLGFBQUMsQUFBVSxhQUFHLEFBQUksQUFBQyxBQUN4QjtBQUFDO0FBQUEsQUFBQztBQUVGLHNCQUFJLE9BQUo7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBYSxBQUFDLGVBQUMsQUFBSSxLQUFDLEFBQWEsY0FBQyxBQUFJLEFBQUUsQUFBQztBQUNsRCxBQUFJLGFBQUMsQUFBVSxhQUFHLEFBQUssQUFBQztBQUN4QixBQUFpQztBQUNqQyxBQUFvRixBQUNyRjtBQUFDO0FBQUEsQUFBQztBQUVGLHNCQUFNLFNBQU47QUFFQyxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQUksS0FBQyxBQUFjLEFBQUMsZ0JBQUMsQUFBSSxLQUFDLEFBQVUsQUFBRSxBQUFDLEFBQzVDLEFBQUksa0JBQ0osQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBb0IsQUFBRSxBQUFDO0FBQzVCLEFBQUUsQUFBQyxnQkFBQyxBQUFJLEtBQUMsQUFBTSxBQUFDLFFBQUMsQUFBSSxLQUFDLEFBQU0sT0FBQyxBQUFNLEFBQUUsQUFBQyxBQUN2QztBQUFDLEFBQ0Y7QUFBQztBQUVELHNCQUFvQix1QkFBcEI7QUFFQyxBQUFNLG9CQUFNLEFBQWEsY0FBQyxBQUFNLE9BQUUsVUFBQyxBQUFXO0FBQUssbUJBQUEsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFXLGVBQUksQUFBRyxJQUFyQyxBQUFzQyxBQUFVO0FBQUEsQUFBQyxBQUFDLEFBQ3RHLFNBRFEsQUFBSTtBQUNYO0FBRUQsc0JBQXNCLHlCQUF0QjtBQUVDLEFBQU0sb0JBQU0sQUFBYSxjQUFDLEFBQU0sT0FBRSxVQUFDLEFBQVc7QUFBSyxtQkFBQSxBQUFXLFlBQUMsQUFBTSxPQUFDLEFBQUUsTUFBSSxBQUFHLElBQTVCLEFBQTZCLEFBQVU7QUFBQSxBQUFDLFNBQXBGLEFBQUksRUFBaUYsQUFBSyxBQUFFLEFBQUMsQUFDckc7QUFBQztBQUVELHNCQUFnQixtQkFBaEI7QUFFQyxBQUFNLG9CQUFNLEFBQW9CLEFBQUUsdUJBQUMsQUFBRyxJQUFFLFVBQUMsQUFBVztBQUFLLG1CQUFBLEFBQVcsWUFBQyxBQUFhLGNBQXpCLEFBQTBCLEFBQUU7QUFBQSxBQUFDLFNBQS9FLEFBQUksRUFBNEUsQUFBTSxPQUFDLFVBQUMsQUFBSyxPQUFFLEFBQUssT0FBRSxBQUFJO0FBQUssbUJBQUEsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFLLEFBQUMsV0FBbkIsQUFBd0IsQUFBSztBQUFBLEFBQUMsQUFBQyxBQUN0SjtBQUFDO0FBRUQsc0JBQTBCLDZCQUExQixVQUEyQixBQUFVO0FBRXBDLEFBQU0sb0JBQU0sQUFBb0IsQUFBRSx1QkFBQyxBQUFNLE9BQUUsVUFBQyxBQUFXO0FBQUssbUJBQUEsQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFPLFdBQTFCLEFBQThCLEFBQVU7QUFBQSxBQUFDLFNBQTlGLEFBQUksRUFBMkYsQUFBRyxJQUFFLFVBQUMsQUFBVztBQUFLLG1CQUFBLEFBQVcsWUFBWCxBQUFZLEFBQVE7QUFBQSxBQUFDLEFBQUMsQUFDbko7QUFBQztBQUVELHNCQUFpQixvQkFBakI7QUFFQyxBQUFJLGFBQUMsQUFBVSxhQUFHLEFBQUksQUFBVyx5QkFBQyxBQUFFLEFBQUMsQUFBQztBQUN0QyxZQUFJLEFBQVksZUFBRyxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQVksQUFBQztBQUVuRCxBQUFJLGFBQUMsQUFBMEIsMkJBQUMsQUFBWSxjQUFFLEFBQUksS0FBQyxBQUFVLEFBQUMsQUFBQyxBQUNoRTtBQUFDO0FBRUQsc0JBQWEsZ0JBQWI7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLFlBQUMsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFVLEFBQUM7QUFDNUMsQUFBSSxhQUFDLEFBQWlCLEFBQUUsQUFBQztBQUN6QixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUN4QjtBQUFDO0FBRU8sc0JBQTBCLDZCQUFsQyxVQUFtQyxBQUFtQixVQUFFLEFBQXlCO0FBRWhGLFlBQUksQUFBYSxnQkFBRyxBQUFJLEFBQWEsMkJBQUMsQUFBUSxBQUFDLEFBQUM7QUFFaEQsQUFBRyxhQUFlLFNBQWdCLEdBQWhCLEtBQUEsQUFBUSxTQUFDLEFBQU8sU0FBaEIsUUFBZ0IsUUFBaEIsQUFBZ0I7QUFBOUIsZ0JBQUksQUFBTSxZQUFBO0FBRWIsZ0JBQUksQUFBZ0IsbUJBQUcsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQUM7QUFDcEQsQUFBRSxBQUFDLGdCQUFDLEFBQWdCLEFBQUMsa0JBQ3JCLEFBQUM7QUFDQSxBQUFhLDhCQUFDLEFBQWMsZUFBQyxBQUFnQixBQUFDLEFBQUM7QUFDL0MsQUFBRyxxQkFBb0IsU0FBb0IsR0FBcEIsS0FBQSxBQUFNLE9BQUMsQUFBYSxlQUFwQixRQUFvQixRQUFwQixBQUFvQjtBQUF2Qyx3QkFBSSxBQUFXLGlCQUFBO0FBRWxCLEFBQUkseUJBQUMsQUFBMEIsMkJBQUMsQUFBVyxhQUFFLEFBQWdCLEFBQUMsQUFBQztBQUMvRCxBQUNGO0FBQUM7QUFDRDtBQUVELEFBQUUsQUFBQyxZQUFDLEFBQWEsY0FBQyxBQUFRLFNBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxHQUN0QyxBQUFDO0FBQ0EsQUFBYSwwQkFBQyxBQUFRLFNBQUMsQUFBSSxLQUFFLFVBQUMsQUFBQyxHQUFDLEFBQUM7QUFBSyx1QkFBQSxBQUFDLEVBQUMsQUFBSyxRQUFHLEFBQUMsRUFBWCxBQUFZLEFBQUs7QUFBQSxBQUFDLEFBQUM7QUFDekQsQUFBVyx3QkFBQyxBQUFnQixpQkFBQyxBQUFhLEFBQUMsQUFBQyxBQUM3QztBQUFDLEFBQ0Y7QUFBQztBQUVELHNCQUFZLGVBQVosVUFBYSxBQUFrQjtBQUU5QixZQUFJLEFBQUssYUFBUSxBQUFhLGNBQUMsQUFBRyxJQUFDLFVBQUMsQUFBSztBQUFLLG1CQUFBLEFBQUssTUFBTCxBQUFNLEFBQVE7QUFBQSxBQUFDLFNBQWpELEFBQUksRUFBOEMsQUFBTyxRQUFDLEFBQVMsQUFBQyxBQUFDO0FBQ2pGLEFBQUUsQUFBQyxZQUFDLEFBQUssU0FBSSxDQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUM7QUFDN0IsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFhLGNBQUMsQUFBSyxBQUFDLEFBQUMsQUFDbEM7QUFBQztBQUVELHNCQUFpQixvQkFBakI7QUFFQyxZQUFJLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBYyxBQUFDO0FBQ2pDLEFBQU0sc0JBQVEsQUFBSSxLQUFFLFVBQUMsQUFBQyxHQUFDLEFBQUM7QUFBSyxtQkFBQSxBQUFDLEVBQUMsQUFBaUIsb0JBQUcsQ0FBQyxBQUFDLElBQXhCLEFBQTJCLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDNUQsU0FEUSxBQUFNO0FBQ2I7QUFFRCxzQkFBb0IsdUJBQXBCO0FBRUMsQUFBSSxhQUFDLEFBQTRCLEFBQUUsQUFBQztBQUVwQyxBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBVSxjQUFJLEFBQUssQUFBQyxPQUMzQixBQUFJLEtBQUMsQUFBYyxpQkFBRyxBQUFJLEtBQUMsQUFBK0IsZ0NBQUMsQUFBSSxLQUFDLEFBQWEsQUFBRSxpQkFBRSxBQUFLLEFBQUMsQUFBQyxBQUN6RixBQUFJLFlBQ0gsQUFBSSxLQUFDLEFBQWMsaUJBQUcsQUFBSSxLQUFDLEFBQStCLGdDQUFDLEFBQUksS0FBQyxBQUFzQixBQUFFLEFBQUMsQUFBQztBQUUzRixBQUErRTtBQUMvRSxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sVUFBSSxBQUFDLEFBQUMsR0FDcEMsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBYyxlQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBc0IsQUFBRSxBQUFDLEFBQUMsQUFDekQ7QUFBQztBQUVELEFBQUksYUFBQyxBQUFhLGdCQUFHLEFBQUksS0FBQyxBQUFjLGVBQUMsQUFBTSxTQUFHLEFBQUMsSUFBRyxBQUFJLEtBQUMsQUFBaUIsQUFBRSxvQkFBQyxBQUFDLEFBQUMsR0FBQyxBQUFNLE9BQUMsQUFBWSxlQUFHLEFBQUksQUFBQztBQUU3RyxBQUFtRSxBQUNwRTtBQUFDO0FBRU8sc0JBQStCLGtDQUF2QyxVQUF3QyxBQUErQixtQkFBRSxBQUEwQjtBQUExQixrQ0FBQTtBQUFBLHdCQUEwQjs7QUFFbEcsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFpQixBQUFDLG1CQUFDLEFBQU0sT0FBQyxBQUFFLEFBQUM7QUFFbEMsWUFBSSxBQUFhLGdCQUFtQixBQUFFLEFBQUM7QUFFdkMsQUFBRyxhQUFzQixTQUEwQixHQUExQixLQUFBLEFBQWlCLGtCQUFDLEFBQVEsVUFBMUIsUUFBMEIsUUFBMUIsQUFBMEI7QUFBL0MsZ0JBQUksQUFBYSxtQkFBQTtBQUVwQixBQUFHLGlCQUFvQixTQUFzQixHQUF0QixLQUFBLEFBQWEsY0FBQyxBQUFRLFVBQXRCLFFBQXNCLFFBQXRCLEFBQXNCO0FBQXpDLG9CQUFJLEFBQVcsaUJBQUE7QUFFbEIsb0JBQUksQUFBTSxTQUFHLEFBQUUsQUFBQztBQUVoQixBQUFFLEFBQUMsb0JBQUMsQUFBUyxBQUFDLFdBQ2QsQUFBQztBQUNBLEFBQU0sNkJBQUcsQUFBSSxLQUFDLEFBQStCLGdDQUFDLEFBQVcsQUFBQyxnQkFBSSxBQUFFLEFBQUM7QUFDakUsQUFBYSxvQ0FBRyxBQUFhLGNBQUMsQUFBTSxPQUFDLEFBQU0sQUFBQyxBQUFDLEFBQzlDO0FBQUM7QUFFRCxBQUFFLEFBQUMsb0JBQUMsQUFBTSxPQUFDLEFBQU0sVUFBSSxBQUFDLEtBQUksQUFBVyxZQUFDLEFBQU0sT0FBQyxBQUFnQixBQUFDLGtCQUM5RCxBQUFDO0FBQ0EsQUFBYSxrQ0FBQyxBQUFJLEtBQUMsQUFBVyxBQUFDLEFBQUMsQUFDakM7QUFBQztBQUVELEFBQVc7QUFDWDtBQUNEO0FBQ0QsQUFBTSxlQUFDLEFBQWEsQUFBQyxBQUN0QjtBQUFDO0FBRUQsc0JBQTRCLCtCQUE1QjtBQUVDLEFBQUksYUFBQyxBQUF1Qyx3Q0FBQyxBQUFJLEtBQUMsQUFBYSxBQUFFLEFBQUMsQUFBQyxBQUNwRTtBQUFDO0FBRU8sc0JBQXVDLDBDQUEvQyxVQUFnRCxBQUF5QjtBQUV4RSxZQUFJLEFBQTJDLDhDQUFHLEFBQUksQUFBQztBQUV2RCxBQUFHLGFBQXNCLFNBQW9CLEdBQXBCLEtBQUEsQUFBVyxZQUFDLEFBQVEsVUFBcEIsUUFBb0IsUUFBcEIsQUFBb0I7QUFBekMsZ0JBQUksQUFBYSxtQkFBQTtBQUVwQixnQkFBSSxBQUF1QiwwQkFBRyxBQUFLLEFBQUM7QUFDcEMsQUFBRyxBQUFDLGlCQUF1QixTQUFzQixHQUF0QixLQUFBLEFBQWEsY0FBQyxBQUFRLFVBQXRCLFFBQXNCLFFBQXRCLEFBQXNCO0FBQTVDLG9CQUFJLEFBQWMsb0JBQUE7QUFFdEIsQUFBRSxBQUFDLG9CQUFDLEFBQWMsZUFBQyxBQUFRLFNBQUMsQUFBTSxVQUFJLEFBQUMsQUFBQyxHQUN4QyxBQUFDO0FBQ0EsQUFBOEY7QUFDOUYsQUFBYyxtQ0FBQyxBQUFpQixvQkFBRyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQVMsQUFBQyxBQUNwRTtBQUFDLEFBQ0QsQUFBSSx1QkFDSixBQUFDO0FBQ0EsQUFBSSx5QkFBQyxBQUF1Qyx3Q0FBQyxBQUFjLEFBQUMsQUFBQyxBQUM5RDtBQUFDO0FBQ0QsQUFBRSxBQUFDLG9CQUFDLEFBQWMsZUFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQXVCLDBCQUFHLEFBQUksQUFBQztBQUNyRTtBQUNELEFBQUUsQUFBQyxnQkFBQyxDQUFDLEFBQXVCLEFBQUMseUJBQUMsQUFBMkMsOENBQUcsQUFBSyxBQUFDO0FBQ2xGO0FBRUQsQUFBRSxBQUFDLFlBQUMsQUFBVyxZQUFDLEFBQU0sQUFBQyxRQUN2QixBQUFDO0FBQ0EsQUFBeUk7QUFDekksQUFBVyx3QkFBQyxBQUFpQixvQkFBRyxBQUEyQyxBQUFDO0FBQzVFLEFBQUUsQUFBQyxnQkFBQyxDQUFDLEFBQVcsWUFBQyxBQUFpQixBQUFDLG1CQUFDLEFBQVcsWUFBQyxBQUE2Qiw4QkFBQyxBQUFLLEFBQUMsQUFBQyxBQUN0RjtBQUFDLEFBQ0Y7QUFBQztBQUVELHNCQUE0QiwrQkFBNUI7QUFFQyxBQUFxRDtBQUVyRCxBQUFpRjtBQUNqRixBQUFpQztBQUNqQyxBQUFJO0FBQ0osQUFBZ0Q7QUFDaEQsQUFBSztBQUNMLEFBQW1EO0FBRW5ELEFBQWlEO0FBQ2pELEFBQU07QUFDTixBQUEyQztBQUMzQyxBQUFpRjtBQUNqRixBQUFPO0FBQ1AsQUFBUztBQUNULEFBQU07QUFDTixBQUE0QztBQUM1QyxBQUFnRjtBQUNoRixBQUFRO0FBQ1IsQUFBSztBQUNMLEFBQUk7QUFDSixBQUFPO0FBQ1AsQUFBSTtBQUNKLEFBQW1FO0FBQ25FLEFBQTZDO0FBQzdDLEFBQUksQUFDTDtBQUFDO0FBQUEsQUFBQztBQUVGLHNCQUFjLGlCQUFkO0FBRUMsQUFBSSxhQUFDLEFBQVEsV0FBRyxBQUFJLEFBQUM7QUFDckIsQUFBRSxBQUFDLFlBQUMsQUFBRyxJQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUUsQUFBQyxlQUM5QixBQUFJLEtBQUMsQUFBUSxXQUFHLEFBQUcsSUFBQyxBQUFZLGFBQUMsQUFBc0IsdUJBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDLEFBQ3hFLEFBQUksZUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFHLElBQUMsQUFBWSxhQUFDLEFBQVMsQUFBRSxBQUFDLGFBQ3JDLEFBQUksS0FBQyxBQUFRLFdBQUcsQUFBRyxJQUFDLEFBQVksYUFBQyxBQUFTLEFBQUUsWUFBQyxBQUFVLFdBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3hFLEFBQTREO0FBQzVELEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBSSxLQUFDLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQUcsTUFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLFlBQUcsQUFBSSxBQUFDLEFBQ3RFO0FBQUM7QUFFRCxzQkFBcUIsd0JBQXJCO0FBRUMsQUFBSSxhQUFDLEFBQU0sQUFBRSxBQUFDO0FBQ2QsQUFBNEg7QUFDNUgsWUFBSSxBQUFTLFlBQVcsQUFBRSxBQUFDO0FBRTNCLFlBQUksQUFBZ0IsbUJBQUcsQUFBSSxLQUFDLEFBQWlCLEFBQUUsQUFBQztBQUVoRCxBQUFrRztBQUVsRyxZQUFJLEFBQUksWUFBUSxBQUFNLE9BQUMsQUFBeUI7QUFFL0MsQUFBTyxxQkFBRyxBQUFJO0FBQ2QsQUFBWSwwQkFBRSxBQUFHLElBQUMsQUFBUSxTQUFDLEFBQVcsQUFBRSxnQkFBRyxBQUFJLE9BQUcsQUFBSztBQUN2RCxBQUFXLHlCQUFFLEFBQUcsSUFBQyxBQUFJLFFBQUksQUFBUSxjQUFDLEFBQUk7QUFDdEMsQUFBZ0IsOEJBQUUsQUFBZ0I7QUFDbEMsQUFBd0Isc0NBQUUsQUFBZ0IsaUJBQUMsQUFBQyxBQUFDO0FBQzdDLEFBQTJCLHlDQUFFLEFBQWdCLGlCQUFDLEFBQUssTUFBQyxBQUFDLEFBQUM7QUFDdEQsQUFBUyx1QkFBRyxBQUFTO0FBQ3JCLEFBQWlCLCtCQUFHLEFBQUksS0FBQyxBQUFhLEFBQUUsZ0JBQUMsQUFBUSxTQUFDLEFBQUMsQUFBQyxBQUNwRCxBQUFDLEFBQUM7QUFUSCxTQURXLEFBQUk7QUFhZixBQUFJLGFBQUMsQUFBbUIsc0JBQUcsQUFBSSxBQUFDO0FBQ2hDLEFBQU0sZUFBQyxBQUFJLEFBQUMsQUFDYjtBQUFDO0FBQUEsQUFBQztBQUVGLHNCQUFvQix1QkFBcEI7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBa0IsdUJBQUssQUFBSyxBQUFDLE1BQ3RDLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQWtCLHFCQUFHLEFBQUUsQUFBQztBQUM3QixnQkFBSSxBQUFPLGVBQUE7Z0JBQUUsQUFBa0IsMEJBQUE7Z0JBQUUsQUFBWSxvQkFBQSxBQUFDO0FBQzlDLEFBQUcsaUJBQUMsSUFBSSxBQUFHLE9BQUksQUFBSSxLQUFDLEFBQVMsQUFBQyxXQUM5QixBQUFDO0FBQ0EsQUFBTywwQkFBRyxBQUFHLElBQUMsQUFBSyxNQUFDLEFBQUcsQUFBQyxLQUFDLEFBQUMsQUFBQyxBQUFDO0FBQzVCLEFBQWtCLHFDQUFHLEFBQUksS0FBQyxBQUFlLGdCQUFDLEFBQU8sQUFBQyxBQUFDO0FBQ25ELEFBQVksK0JBQUcsQUFBSSxLQUFDLEFBQW9CLHFCQUFDLEFBQUksS0FBQyxBQUFTLFVBQUMsQUFBRyxBQUFDLEFBQUMsQUFBQztBQUU5RCxBQUFFLEFBQUMsb0JBQUMsQUFBWSxBQUFDLGNBQ2pCLEFBQUM7QUFDQSxBQUFJLHlCQUFDLEFBQWtCLG1CQUFDLEFBQWtCLEFBQUMsc0JBQUcsQUFBWSxBQUFDO0FBQzNELEFBQUkseUJBQUMsQUFBYSxjQUFDLEFBQUksS0FBQyxBQUFrQixBQUFDLEFBQUMsQUFDN0M7QUFBQyxBQUNGO0FBQUMsQUFDRjtBQUFDO0FBQ0QsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFrQixBQUFDLEFBQ2hDO0FBQUM7QUFBQSxBQUFDO0FBRU0sc0JBQWUsa0JBQXZCLFVBQXdCLEFBQU07QUFFN0IsQUFBTSxnQkFBQyxBQUFNLEFBQUMsQUFDZCxBQUFDO0FBQ0EsaUJBQUssQUFBUTtBQUFFLEFBQU0sdUJBQUMsQUFBTyxBQUFDO0FBQzlCLGlCQUFLLEFBQVM7QUFBRSxBQUFNLHVCQUFDLEFBQU8sQUFBQztBQUMvQixpQkFBSyxBQUFXO0FBQUUsQUFBTSx1QkFBQyxBQUFVLEFBQUM7QUFDcEMsaUJBQUssQUFBVTtBQUFFLEFBQU0sdUJBQUMsQUFBTyxBQUFDO0FBQ2hDLGlCQUFLLEFBQVE7QUFBRSxBQUFNLHVCQUFDLEFBQVUsQUFBQztBQUNqQyxpQkFBSyxBQUFVO0FBQUUsQUFBTSx1QkFBQyxBQUFRLEFBQUM7QUFDakMsaUJBQUssQUFBUTtBQUFFLEFBQU0sdUJBQUMsQUFBVSxBQUFDLEFBQ2xDLEFBQUM7O0FBRUQsQUFBTSxlQUFDLEFBQUUsQUFBQyxBQUNYO0FBQUM7QUFFTyxzQkFBb0IsdUJBQTVCLFVBQTZCLEFBQVM7QUFFckMsQUFBRSxBQUFDLFlBQUMsQUFBUyxjQUFLLEFBQUksQUFBQyxNQUN2QixBQUFDO0FBQ0EsQUFBTSxtQkFBQyxBQUFPLEFBQUMsQUFDaEI7QUFBQztBQUNELFlBQUksQUFBTSxTQUFHLEFBQUUsQUFBQztBQUNoQixBQUFFLEFBQUMsWUFBQyxBQUFTLFVBQUMsQUFBVSxBQUFDLFlBQ3pCLEFBQUM7QUFDQSxBQUFNLHNCQUFHLEFBQUksS0FBQyxBQUFXLFlBQUMsQUFBUyxVQUFDLEFBQVUsQUFBQyxBQUFDO0FBQ2hELEFBQU0sc0JBQUcsQUFBSyxBQUFDO0FBQ2YsQUFBTSxzQkFBRyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQVMsVUFBQyxBQUFRLEFBQUMsQUFBQyxBQUMvQztBQUFDO0FBQ0QsQUFBRSxBQUFDLFlBQUMsQUFBUyxVQUFDLEFBQVUsQUFBQyxZQUN6QixBQUFDO0FBQ0EsQUFBTSxzQkFBRyxBQUFNLEFBQUM7QUFDaEIsQUFBTSxzQkFBRyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQVMsVUFBQyxBQUFVLEFBQUMsQUFBQztBQUNoRCxBQUFNLHNCQUFHLEFBQUssQUFBQztBQUNmLEFBQU0sc0JBQUcsQUFBSSxLQUFDLEFBQVcsWUFBQyxBQUFTLFVBQUMsQUFBUSxBQUFDLEFBQUMsQUFDL0M7QUFBQztBQUNELEFBQU0sZUFBQyxBQUFNLEFBQUMsQUFDZjtBQUFDO0FBQUEsQUFBQztBQUVGLHNCQUFXLGNBQVgsVUFBWSxBQUFJO0FBRWYsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFJLEFBQUMsTUFBQyxBQUFNLEFBQUM7QUFDbEIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBRyxBQUFDLEtBQUMsQUFBQyxBQUFDLEdBQUMsQUFBSyxNQUFDLEFBQVUsQUFBQyxZQUFDLEFBQUMsQUFBQyxBQUFDLEFBQ2hEO0FBQUM7QUFBQSxBQUFDO0FBRUYsc0JBQStCLGtDQUEvQjtBQUVDLEFBQUUsQUFBQyxZQUFFLEFBQUksS0FBQyxBQUEyQixnQ0FBSyxBQUFFLEFBQUMsSUFDN0MsQUFBQztBQUNBLGdCQUFJLEFBQWEsZ0JBQUcsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFlLGdCQUFDLEFBQUksS0FBQyxBQUEyQixBQUFDLDZCQUFDLEFBQVksQUFBRSxBQUFDO0FBQ3ZHLEFBQU0sQUFBQyxtQkFBQyxBQUFJLEtBQUMsQUFBRSxNQUFJLEFBQWEsQUFBQyxBQUFDLEFBQ25DO0FBQUM7QUFDRCxBQUFNLGVBQUMsQUFBSyxBQUFDLEFBQ2Q7QUFBQztBQUFBLEFBQUM7QUFhRiwwQkFBSSxtQkFBTTtBQUhWLEFBQStDO0FBQy9DLEFBQTZCO0FBQzdCLEFBQWdEO2FBQ2hEO0FBRUMsQUFBb0M7QUFDcEMsQUFBcUM7QUFDckMsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBYSxBQUFDLEFBQzNCO0FBQUM7O3NCQUFBOztBQUFBLEFBQUM7QUFFRiwwQkFBSSxtQkFBUzthQUFiO0FBRUMsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQ3hCO0FBQUM7O3NCQUFBOztBQUFBLEFBQUM7QUFFRiwwQkFBSSxtQkFBYTthQUFqQjtBQUVDLEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQWMsQUFBQyxBQUM1QjtBQUFDOztzQkFBQTs7QUFBQSxBQUFDO0FBRUgsV0FBQSxBQUFDO0FBdGNELEFBc2NDLEtBMWRELEFBUUc7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEg7QUFVQyx5QkFBYSxBQUFnQjtBQUw3QixhQUFPLFVBQVksQUFBSSxBQUFDO0FBR3hCLGFBQVEsV0FBcUIsQUFBRSxBQUFDO0FBSS9CLEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBZ0IsaUJBQUMsQUFBUyxBQUFDO0FBQzNDLEFBQUksYUFBQyxBQUFLLFFBQUcsQUFBZ0IsaUJBQUMsQUFBSyxBQUFDO0FBQ3BDLEFBQUksYUFBQyxBQUFXLGNBQUcsQUFBZ0IsaUJBQUMsQUFBVyxlQUFJLEFBQUUsQUFBQyxBQUN2RDtBQUFDO0FBRUQsMEJBQUksdUJBQU07YUFBVjtBQUVDLEFBQUUsQUFBQyxnQkFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLFNBQUMsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFPLEFBQUM7QUFDdEMsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBTyxVQUFHLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBYSxjQUFDLEFBQUksS0FBQyxBQUFRLEFBQUMsQUFBQyxBQUN2RTtBQUFDOztzQkFBQTs7QUFFRCwwQkFBNkIsZ0NBQTdCLFVBQThCLEFBQWM7QUFFM0MsQUFBSSxhQUFDLEFBQWlCLG9CQUFHLEFBQUksQUFBQztBQUM5QixBQUFHLGFBQXNCLFNBQWEsR0FBYixLQUFBLEFBQUksS0FBQyxBQUFRLFVBQWIsUUFBYSxRQUFiLEFBQWE7QUFBbEMsZ0JBQUksQUFBYSxtQkFBQTtBQUVwQixBQUFHLEFBQUMsaUJBQXVCLFNBQXNCLEdBQXRCLEtBQUEsQUFBYSxjQUFDLEFBQVEsVUFBdEIsUUFBc0IsUUFBdEIsQUFBc0I7QUFBNUMsb0JBQUksQUFBYyxvQkFBQTtBQUV0QixBQUFjLCtCQUFDLEFBQTZCLDhCQUFDLEFBQUksQUFBQyxBQUFDO0FBQ25EO0FBQ0QsQUFDRjtBQUFDO0FBRUQsMEJBQUksdUJBQWE7YUFBakI7QUFFQyxBQUFNLG1CQUFZLEFBQUksS0FBQyxBQUFNLE9BQUMsQUFBUSxBQUFFLEFBQUMsQUFDMUM7QUFBQzs7c0JBQUE7O0FBRUQsMEJBQWdCLG1CQUFoQixVQUFpQixBQUE2QjtBQUU3QyxBQUFJLGFBQUMsQUFBUSxTQUFDLEFBQUksS0FBQyxBQUFhLEFBQUMsQUFBQyxBQUNuQztBQUFDO0FBQ0YsV0FBQSxBQUFDO0FBNUNELEFBNENDOzs7Ozs7Ozs7OztBQy9DRCxBQUFPLEFBQUUsQUFBc0IsQUFBRSxBQUEwQixBQUFFLEFBQU0sQUFBbUMsQUFBQzs7Ozs7Ozs7Ozs7QUFLdkc7QUFBNEIsc0JBQXNCO0FBZ0JqRCxvQkFBWSxBQUFpQjtBQUE3QixvQkFFQyxrQkFBTSxBQUEwQixtREFBQyxBQUFNLFFBQUUsQUFBVSxZQUFFLEFBQW1CLHFCQUFFLEFBQXdCLEFBQUMsNkJBV25HO0FBaEJPLGNBQWMsaUJBQVksQUFBSSxBQUFDO0FBT3RDLEFBQUksY0FBQyxBQUFFLEtBQUcsQUFBVyxZQUFDLEFBQUUsQUFBQztBQUN6QixBQUFJLGNBQUMsQUFBSSxPQUFHLEFBQVcsWUFBQyxBQUFJLEFBQUM7QUFDN0IsQUFBSSxjQUFDLEFBQUssUUFBRyxBQUFXLFlBQUMsQUFBSyxBQUFDO0FBQy9CLEFBQUksY0FBQyxBQUFTLFlBQUcsQUFBVyxZQUFDLEFBQVUsQUFBQztBQUN4QyxBQUFJLGNBQUMsQUFBSyxRQUFHLEFBQVcsWUFBQyxBQUFLLEFBQUM7QUFDL0IsQUFBSSxjQUFDLEFBQUksT0FBRyxBQUFXLFlBQUMsQUFBSSxBQUFDO0FBQzdCLEFBQUksY0FBQyxBQUFnQixtQkFBRyxBQUFXLFlBQUMsQUFBbUIsQUFBQztBQUN4RCxBQUFJLGNBQUMsQUFBaUIsb0JBQUcsQUFBVyxZQUFDLEFBQW9CLEFBQUM7QUFDMUQsQUFBSSxjQUFDLEFBQWEsZ0JBQUcsQUFBVyxZQUFDLEFBQWUsQUFBQztlQUNsRDtBQUFDO0FBRUQsMEJBQUksa0JBQVk7YUFBaEI7QUFFQyxBQUFFLEFBQUMsZ0JBQUMsQUFBSSxLQUFDLEFBQWMsbUJBQUssQUFBSSxBQUFDLE1BQUMsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFjLEFBQUM7QUFFN0QsQUFBRSxBQUFDLGdCQUFDLENBQUMsQUFBSSxLQUFDLEFBQWlCLEFBQUMsbUJBQzVCLEFBQUM7QUFDQSxvQkFBSSxBQUFNLFNBQVMsQUFBSSxBQUFDO0FBQ3hCLG9CQUFJLEFBQU8sVUFBWSxBQUFJLEFBQUM7QUFDNUIsdUJBQU0sQUFBTyxXQUFJLEFBQUksUUFBSSxBQUFNLFFBQy9CLEFBQUM7QUFDQSxBQUFNLDZCQUFHLEFBQU0sT0FBQyxBQUFRLEFBQUUsQUFBQztBQUMzQixBQUFFLEFBQUMsd0JBQUMsQUFBTSxBQUFDLFFBQ1gsQUFBQztBQUNBLEFBQU0saUNBQUcsQUFBTSxPQUFDLEFBQVEsQUFBRSxBQUFDO0FBQzNCLEFBQU8sa0NBQUcsQUFBTSxPQUFDLEFBQWlCLG9CQUFHLEFBQU0sT0FBQyxBQUFFLEtBQUcsQUFBSSxBQUFDLEFBQ3ZEO0FBQUMsQUFDRjtBQUFDO0FBQ0QsQUFBSSxxQkFBQyxBQUFjLGlCQUFHLEFBQU8sQUFBQyxBQUMvQjtBQUFDLEFBQ0QsQUFBSSxtQkFDSixBQUFDO0FBQ0EsQUFBSSxxQkFBQyxBQUFjLGlCQUFHLEFBQUksS0FBQyxBQUFFLEFBQUMsQUFDL0I7QUFBQztBQUVELEFBQU0sbUJBQUMsQUFBSSxLQUFDLEFBQWMsQUFBQyxBQUM1QjtBQUFDOztzQkFBQTs7QUFFRCxxQkFBVyxjQUFYLFVBQVksQUFBb0I7QUFBSSxBQUFJLGFBQUMsQUFBUSxTQUFDLEFBQUksS0FBQyxBQUFTLEFBQUMsQUFBQyxBQUFFO0FBQUM7QUFFckUscUJBQVksZUFBWjtBQUFpQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVEsQUFBRSxhQUFjLEFBQUksS0FBQyxBQUFRLEFBQUcsV0FBQyxBQUFLLFNBQUksQUFBQyxJQUFHLEFBQUssQUFBQyxBQUFDO0FBQUM7QUFFM0YscUJBQWEsZ0JBQWI7QUFBNEIsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFNLEFBQUUsU0FBQyxBQUFRLFNBQUMsQUFBb0IsQUFBQyxBQUFDLEFBQUM7QUFBQztBQUVsRiwwQkFBSSxrQkFBYTthQUFqQjtBQUFtQyxBQUFNLG1CQUFjLEFBQUksS0FBQyxBQUFRLEFBQUMsQUFBQztBQUFDOztzQkFBQTs7QUFFdkUsMEJBQUksa0JBQWtCO2FBQXRCO0FBRUMsQUFBTSxtQkFBQyxBQUFJLEtBQUMsQUFBNEIsNkJBQUMsQUFBSSxBQUFDLEFBQUMsQUFDaEQ7QUFBQzs7c0JBQUE7O0FBRU8scUJBQTRCLCtCQUFwQyxVQUFxQyxBQUFxQjtBQUV6RCxZQUFJLEFBQWEsZ0JBQWMsQUFBRSxBQUFDO0FBQ2xDLEFBQUcsYUFBWSxTQUEwQixHQUExQixLQUFBLEFBQVksYUFBQyxBQUFhLGVBQTFCLFFBQTBCLFFBQTFCLEFBQTBCO0FBQXJDLGdCQUFJLEFBQUcsU0FBQTtBQUVWLEFBQWEsNEJBQUcsQUFBYSxjQUFDLEFBQU0sT0FBQyxBQUFHLElBQUMsQUFBTyxBQUFDLEFBQUM7QUFDbEQsQUFBRyxpQkFBZSxTQUFXLEdBQVgsS0FBQSxBQUFHLElBQUMsQUFBTyxTQUFYLFFBQVcsUUFBWCxBQUFXO0FBQXpCLG9CQUFJLEFBQU0sWUFBQTtBQUViLEFBQWEsZ0NBQUcsQUFBYSxjQUFDLEFBQU0sT0FBQyxBQUFJLEtBQUMsQUFBNEIsNkJBQUMsQUFBTSxBQUFDLEFBQUMsQUFBQztBQUNoRjtBQUNEO0FBQ0QsQUFBTSxlQUFDLEFBQWEsQUFBQyxBQUN0QjtBQUFDO0FBQ0YsV0FBQSxBQUFDO0FBcEZELEFBQTRCLEFBQXNCLEFBb0ZqRDs7Ozs7Ozs7Ozs7QUM5RUQsQUFBTyxBQUFFLEFBQWlCLEFBQUUsQUFBTSxBQUFxQixBQUFDOztBQUd4RDtBQUlDO0FBRkEsYUFBeUIsNEJBQUcsQUFBSSxBQUFDO0FBSWhDLEFBQUksYUFBQyxBQUFVLEFBQUUsQUFBQyxBQUNuQjtBQUFDO0FBRUQscUNBQVUsYUFBVjtBQUVDLEFBQWtDO0FBQ2xDLEFBQWtDO0FBQ2xDLEFBQWtDO0FBQ2xDLEFBQUMsVUFBQyxBQUFhLEFBQUMsZUFBQyxBQUFFLEdBQUMsQUFBUSxVQUFFLFVBQVMsQUFBSyxPQUFFLEFBQU87QUFFcEQsQUFBcUk7QUFDckksQUFBUTtBQUNSLEFBQUcsZ0JBQUMsQUFBUSxTQUFDLEFBQWMsZUFDMUIsQUFBTyxTQUNQLFVBQVMsQUFBTztBQUVmLEFBQStCO0FBQy9CLEFBQUMsa0JBQUMsQUFBYSxBQUFDLGVBQUMsQUFBRyxJQUFDLEFBQU8sUUFBQyxBQUFDLEFBQUMsR0FBQyxBQUFtQixBQUFFLEFBQUMsQUFBQyxBQUN4RDtBQUFDLGVBQ0QsVUFBUyxBQUFPO0FBQUksQUFBQyxrQkFBQyxBQUFhLEFBQUMsZUFBQyxBQUFRLFNBQUMsQUFBUyxBQUFDLEFBQUMsQUFBQztBQUFDLEFBQzNELEFBQUM7QUFFRixBQUE2RDtBQUM3RCxBQUFFLEFBQUMsZ0JBQUMsQUFBQyxFQUFDLEFBQWlCLEFBQUMsbUJBQUMsQUFBVSxBQUFFLGdCQUFJLEFBQUMsRUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFVLEFBQUUsQUFBQyxjQUNoRSxBQUFDO0FBQ0EsQUFBMEM7QUFDMUMsQUFBaUIsQUFBRSxBQUFDLEFBQ3JCO0FBQUMsQUFDRjtBQUFDLEFBQUMsQUFBQztBQUVILEFBQThEO0FBQzlELEFBQXdDO0FBQ3hDLEFBQXlEO0FBQ3pELEFBQUk7QUFDSixBQUFtQztBQUNuQyxBQUE4QztBQUM5QyxBQUFhO0FBQ2IsQUFBOEM7QUFDOUMsQUFBTTtBQUNOLEFBQU07QUFFTixBQUFrQztBQUNsQyxBQUFrQztBQUNsQyxBQUFrQztBQUNsQyxBQUFDLFVBQUMsQUFBa0IsQUFBQyxvQkFBQyxBQUFLLE1BQUMsVUFBUyxBQUFTO0FBRzdDLGdCQUFJLEFBQWdCLG1CQUFHLEFBQUMsRUFBQyxBQUFvQixBQUFDLEFBQUM7QUFFL0MsZ0JBQUksQUFBVSxhQUFHLENBQUMsQUFBZ0IsaUJBQUMsQUFBRSxHQUFDLEFBQVUsQUFBQyxBQUFDO0FBRWxELEFBQUcsZ0JBQUMsQUFBWSxhQUFDLEFBQWdCLGlCQUFDLEFBQVUsQUFBQyxBQUFDO0FBQzlDLEFBQUcsZ0JBQUMsQUFBYSxjQUFDLEFBQXNCLHVCQUFDLENBQUMsQUFBVSxBQUFDLEFBQUM7QUFFdEQsQUFBZ0IsNkJBQUMsQUFBSSxLQUFDLEFBQVMsV0FBQyxBQUFVLEFBQUMsQUFBQztBQUU1QyxBQUFDLGNBQUMsQUFBZSxBQUFFLEFBQUM7QUFDcEIsQUFBQyxjQUFDLEFBQXdCLEFBQUUsQUFBQztBQUM3QixBQUFDLGNBQUMsQUFBYyxBQUFFLEFBQUMsQUFDcEI7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFDLFVBQUMsQUFBa0IsQUFBQyxvQkFBQyxBQUFPLEFBQUUsQUFBQztBQUVoQyxBQUFrQztBQUNsQyxBQUFrQztBQUNsQyxBQUFrQztBQUNsQyxZQUFJLEFBQUksT0FBRyxBQUFJLEFBQUM7QUFFaEIsQUFBQyxVQUFDLEFBQTZCLEFBQUMsK0JBQUMsQUFBSyxNQUFFLFVBQVMsQUFBQztBQUVqRCxnQkFBSSxBQUFRLFdBQUcsQUFBQyxFQUFDLEFBQUksQUFBQyxNQUFDLEFBQUksS0FBQyxBQUFnQixBQUFDLEFBQUM7QUFDOUMsQUFBSSxpQkFBQyxBQUFhLGNBQUMsQUFBUSxBQUFDLEFBQUMsQUFDOUI7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFxQztBQUNyQyxBQUFxQztBQUNyQyxBQUFxQztBQUNyQyxBQUFDLFVBQUMsQUFBaUMsQUFBQyxtQ0FBQyxBQUFLLE1BQUM7QUFFMUMsZ0JBQUksQUFBVSxhQUFHLEFBQUMsRUFBQyxBQUFJLEFBQUMsTUFBQyxBQUFJLEtBQUMsQUFBa0IsQUFBQyxBQUFDO0FBQ2xELEFBQUcsZ0JBQUMsQUFBYyxlQUFDLEFBQWUsZ0JBQUMsQUFBVSxBQUFDLFlBQUMsQUFBb0IsQUFBRSxBQUFDLEFBQ3ZFO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBQyxVQUFDLEFBQXFDLEFBQUMsdUNBQUMsQUFBSyxNQUFDLFVBQVMsQUFBQztBQUV4RCxBQUFDLGNBQUMsQUFBZSxBQUFFLEFBQUM7QUFDcEIsQUFBQyxjQUFDLEFBQXdCLEFBQUUsQUFBQztBQUM3QixBQUFDLGNBQUMsQUFBYyxBQUFFLEFBQUM7QUFFbkIsZ0JBQUksQUFBVSxhQUFHLEFBQUMsRUFBQyxBQUFJLEFBQUMsTUFBQyxBQUFJLEtBQUMsQUFBa0IsQUFBQyxBQUFDO0FBQ2xELEFBQUcsZ0JBQUMsQUFBYyxlQUFDLEFBQWUsZ0JBQUMsQUFBVSxBQUFDLFlBQUMsQUFBTSxBQUFFLEFBQUMsQUFFekQ7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFrQztBQUNsQyxBQUFrQztBQUNsQyxBQUFrQztBQUNsQyxBQUFDLFVBQUMsQUFBb0UsQUFBQyxzRUFBQyxBQUFLLE1BQUMsVUFBUyxBQUFTO0FBRS9GLGdCQUFJLEFBQVEsV0FBRyxBQUFDLEVBQUMsQUFBSSxBQUFDLE1BQUMsQUFBSSxLQUFDLEFBQWdCLEFBQUMsQUFBQztBQUM5QyxnQkFBSSxBQUFNLFNBQUcsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFhLGNBQUMsQUFBUSxBQUFDLEFBQUM7QUFFeEQsQUFBTSxtQkFBQyxBQUFhLEFBQUUsa0JBQUcsQUFBTSxPQUFDLEFBQW9CLEFBQUUseUJBQUcsQUFBTSxPQUFDLEFBQU0sQUFBRSxBQUFDLEFBQzFFO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBQyxVQUFDLEFBQW1FLEFBQUMscUVBQUMsQUFBSyxNQUFDLFVBQVMsQUFBQztBQUV0RixBQUFDLGNBQUMsQUFBZSxBQUFFLEFBQUM7QUFDcEIsQUFBQyxjQUFDLEFBQXdCLEFBQUUsQUFBQztBQUM3QixBQUFDLGNBQUMsQUFBYyxBQUFFLEFBQUM7QUFFbkIsZ0JBQUksQUFBUSxXQUFHLEFBQUMsRUFBQyxBQUFJLEFBQUMsTUFBQyxBQUFJLEtBQUMsQUFBZ0IsQUFBQyxBQUFDO0FBQzlDLEFBQUcsZ0JBQUMsQUFBYyxlQUFDLEFBQWEsY0FBQyxBQUFRLEFBQUMsVUFBQyxBQUFNLEFBQUUsQUFBQyxBQUNyRDtBQUFDLEFBQUMsQUFBQyxBQUVKO0FBQUM7QUFFRCxxQ0FBYSxnQkFBYixVQUFjLEFBQVE7QUFFckIsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQXlCLDZCQUFJLEFBQVEsQUFBQyxVQUFDLEFBQU0sQUFBQztBQUV2RCxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBeUIsNkJBQUksQUFBSSxBQUFDLE1BQUMsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFvQixBQUFFLEFBQUM7QUFFckYsWUFBSSxBQUFLLFFBQUcsQUFBSSxLQUFDLEFBQXlCLEFBQUM7QUFDM0MsQUFBSSxhQUFDLEFBQXlCLDRCQUFHLEFBQVEsQUFBQztBQUUxQyxBQUFFLEFBQUMsWUFBQyxBQUFRLFlBQUksQUFBSyxBQUFDLE9BQ3RCLEFBQUM7QUFDQSxBQUFDLGNBQUMsQUFBMkIsQUFBQyw2QkFBQyxBQUFJLEtBQUMsQUFBa0IsQUFBQyxBQUFDO0FBQ3hELEFBQUMsY0FBQyxBQUFvQixBQUFDLHNCQUFDLEFBQUksQUFBRSxBQUFDLEFBQ2hDO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLGdCQUFJLEFBQVUsYUFBRyxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQWlCLGtCQUFDLEFBQVEsQUFBQyxBQUFDO0FBRWhFLEFBQUMsY0FBQyxBQUEyQixBQUFDLDZCQUFDLEFBQUksS0FBQyxBQUFVLFdBQUMsQUFBSSxBQUFDLEFBQUM7QUFDckQsQUFBRSxBQUFDLGdCQUFDLEFBQVUsV0FBQyxBQUFhLEFBQUMsZUFBQyxBQUFDLEVBQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFJLEFBQUUsQUFBQyxBQUM3RCxBQUFJLFlBQUMsQUFBQyxFQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBSSxBQUFFLEFBQUMsQUFDckM7QUFBQztBQUVELEFBQUksYUFBQyxBQUEwQixBQUFFLEFBQUM7QUFFbEMsQUFBeUU7QUFDekUsQUFBRSxBQUFDLFlBQUMsQUFBSyxTQUFJLEFBQUksQUFBQyxNQUFDLEFBQUcsSUFBQyxBQUFhLGNBQUMsQUFBZSxBQUFFLEFBQUM7QUFFdkQsQUFBRyxZQUFDLEFBQWEsY0FBQyxBQUFzQix1QkFBQyxBQUFJLE1BQUMsQUFBSSxBQUFDLEFBQUM7QUFDcEQsQUFBRyxZQUFDLEFBQWEsY0FBQyxBQUFzQixBQUFFLEFBQUMsQUFDNUM7QUFBQztBQUVELHFDQUEwQiw2QkFBMUI7QUFFQyxZQUFJLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBeUIsQUFBQztBQUU5QyxBQUFFLFlBQUMsQ0FBQyxBQUFDLEVBQUMsQUFBaUIsQUFBQyxtQkFBQyxBQUFFLEdBQUMsQUFBVSxBQUFDLEFBQUMsYUFBQyxBQUFDO0FBQUMsQUFBTyxvQkFBQyxBQUFHLElBQUMsQUFBdUIsQUFBQyxBQUFDO0FBQUEsQUFBTSxBQUFDLEFBQUM7QUFBQztBQUV6RixBQUFDLFVBQUMsQUFBZ0MsQUFBQyxrQ0FBQyxBQUFPLFFBQUMsRUFBQyxBQUFHLEtBQUUsQUFBQyxFQUFDLEFBQW9CLHVCQUFHLEFBQVEsQUFBQyxVQUFDLEFBQVEsQUFBRSxXQUFDLEFBQUcsQUFBQyxPQUFFLEFBQUcsS0FBRSxBQUFjLEFBQUMsQUFBQztBQUUzSCxBQUFDLFVBQUMsQUFBc0MsQUFBQyx3Q0FBQyxBQUFJLEFBQUUsQUFBQztBQUNqRCxBQUFDLFVBQUMsQUFBZSxrQkFBRyxBQUFRLEFBQUMsVUFBQyxBQUFNLE9BQUMsQUFBRyxBQUFDLEFBQUM7QUFFMUMsQUFBQyxVQUFDLEFBQTZCLEFBQUMsK0JBQUMsQUFBVyxZQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3ZELEFBQUMsVUFBQyxBQUFvQix1QkFBRyxBQUFRLEFBQUMsVUFBQyxBQUFRLFNBQUMsQUFBUSxBQUFDLEFBQUMsQUFDdkQ7QUFBQztBQUNGLFdBQUEsQUFBQztBQXpLRCxBQXlLQzs7Ozs7Ozs7Ozs7QUM3S0QsQUFBTyxBQUFXLEFBQVUsQUFBRSxBQUFTLEFBQUUsQUFBTSxBQUF1QixBQUFDOztBQUV2RSxBQUFPLEFBQUUsQUFBNkIsQUFBRSxBQUFrQixBQUFFLEFBQU0sQUFBMEIsQUFBQzs7QUFNN0Y7QUFnQkM7QUFkQSxBQUErQjtBQUUvQixBQUFnQztBQUNoQyxhQUFzQix5QkFBWSxBQUFFLEFBQUM7QUFDckMsQUFBZ0U7QUFDaEUsQUFBd0Q7QUFDeEQsYUFBVSxhQUFZLEFBQUMsQUFBQztBQUN4QixhQUFVLGFBQWEsQUFBSyxBQUFDO0FBRTdCLEFBQTJDO0FBQzNDLGFBQW1CLHNCQUFHLEFBQUUsQUFBQztBQUV6QixhQUFhLGdCQUFhLEFBQUssQUFBQztBQUkvQixBQUF3QztBQUN4QyxZQUFJLEFBQUksT0FBRyxBQUFJLEFBQUM7QUFDaEIsQUFBQyxVQUFDLEFBQTRCLEFBQUMsOEJBQUMsQUFBRSxHQUFDLEFBQVEsVUFBRSxVQUFTLEFBQUM7QUFDdEQsQUFBRSxnQkFBQyxBQUFDLEVBQUMsQUFBSSxBQUFDLE1BQUMsQUFBUyxBQUFFLGNBQUcsQUFBQyxFQUFDLEFBQUksQUFBQyxNQUFDLEFBQVcsQUFBRSxpQkFBSSxBQUFDLEVBQUMsQUFBSSxBQUFDLE1BQUMsQUFBQyxBQUFDLEdBQUMsQUFBWSxBQUFDLGNBQUMsQUFBQztBQUN4RSxBQUFJLHFCQUFDLEFBQVksQUFBRSxBQUFDLEFBQ3ZCO0FBQUMsQUFDSDtBQUFDLEFBQUMsQUFBQyxBQUNKO0FBQUM7QUFFRCxtQ0FBTSxTQUFOLFVBQU8sQUFBaUM7QUFFdkMsQUFBSSxhQUFDLEFBQUssQUFBRSxBQUFDO0FBQ2IsQUFBSSxhQUFDLEFBQUksS0FBQyxBQUFlLGdCQUFDLEFBQWlCLG1CQUFFLEFBQUssQUFBQyxBQUFDO0FBRXBELFlBQUksQUFBTyxVQUFHLEFBQUcsSUFBQyxBQUFRLFNBQUMsQUFBa0IsQUFBQztBQUM5QyxBQUFFLEFBQUMsWUFBQyxBQUFPLEFBQUMsU0FDWCxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQWdCLG1CQUFHLEFBQVUseUJBQUMsQUFBUyx3QkFBQyxBQUFPLEFBQUMsQUFBQyxBQUFDLGFBQUcsQUFBTSxBQUFDLEFBQzNFLEFBQUksWUFDSCxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQStCLEFBQUMsQUFBQyxBQUNqRDtBQUFDO0FBRUQsbUNBQVEsV0FBUixVQUFTLEFBQWU7QUFFdkIsQUFBQyxVQUFDLEFBQTBCLEFBQUMsNEJBQUMsQUFBSSxLQUFDLEFBQU0sQUFBQyxBQUFDLEFBQzVDO0FBQUM7QUFFRCxtQ0FBSyxRQUFMO0FBRUMsQUFBQyxVQUFDLEFBQTRCLEFBQUMsOEJBQUMsQUFBTSxBQUFFLEFBQUMsQUFDMUM7QUFBQztBQUVELG1DQUFxQix3QkFBckI7QUFFQyxBQUFNLGVBQUMsQUFBQyxFQUFDLEFBQTRCLEFBQUMsOEJBQUMsQUFBTSxBQUFDLEFBQy9DO0FBQUM7QUFFTyxtQ0FBSSxPQUFaLFVBQWEsQUFBd0IsY0FBRSxBQUFnQjtBQUV0RCxBQUF1RDtBQUZqQixpQ0FBQTtBQUFBLHVCQUFnQjs7QUFJdEQsWUFBSSxBQUFpQixBQUFDO0FBQ3RCLFlBQUksQUFBaUIsb0JBQWUsQUFBWSxBQUFDO0FBRWpELEFBQUcsYUFBWSxTQUFpQixHQUFqQixzQkFBaUIsbUJBQWpCLHlCQUFpQixRQUFqQixBQUFpQjtBQUE1QixBQUFPLDBDQUFBO0FBRVYsQUFBTyxvQkFBQyxBQUFjLEFBQUUsQUFBQztBQUN6QjtBQUNELEFBQWlCLDBCQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBZSxBQUFDLEFBQUM7QUFFN0MsWUFBSSxBQUFvQix1QkFBRyxBQUFJLEtBQUMsQUFBc0IseUJBQUcsQUFBSSxLQUFDLEFBQVUsQUFBQztBQUN6RSxZQUFJLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQW9CLHNCQUFFLEFBQWlCLGtCQUFDLEFBQU0sQUFBQyxBQUFDO0FBRXhFLEFBQWdEO0FBQ2hELEFBQUUsQUFBQyxZQUFFLEFBQWlCLGtCQUFDLEFBQU0sU0FBRyxBQUFvQixBQUFDLHNCQUNyRCxBQUFDO0FBQ0EsZ0JBQUksQUFBUSxhQUFHLEFBQUcsSUFBQyxBQUFRLFNBQUMsQUFBVyxBQUFFLEFBQUM7QUFFMUMsQUFBRSxBQUFDLGdCQUFDLEFBQVEsQUFBQyxZQUNiLEFBQUM7QUFDQSxvQkFBSSxBQUFRLFdBQUcsQUFBSSxLQUFDLEFBQW1CLHNCQUFHLEFBQUMsQUFBQztBQUM1QyxBQUFJLHFCQUFDLEFBQW1CLHNCQUFHLEFBQVEsQUFBQztBQUNwQyxBQUFpRDtBQUNqRCxBQUFzQjtBQUN0QixBQUFHLG9CQUFDLEFBQVUsV0FBQyxBQUF5QiwwQkFBQyxBQUFRLFlBQUUsQUFBUSxBQUFDLEFBQUMsQUFDOUQ7QUFBQyxBQUNELEFBQUksbUJBQ0osQUFBQztBQUNBLEFBQWtFO0FBQ2xFLEFBQW9CO0FBQ3BCLEFBQUcsb0JBQUMsQUFBVSxXQUFDLEFBQXlCLDBCQUN2QyxBQUFHLElBQUMsQUFBWSxhQUFDLEFBQVMsQUFBRSxhQUM1QixBQUFHLElBQUMsQUFBWSxhQUFDLEFBQWEsQUFBRSxBQUNoQyxBQUFDLEFBQ0g7QUFBQyxBQUNGO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQThCO0FBQzlCLEFBQUksaUJBQUMsQUFBVSxhQUFHLEFBQUksQUFBQyxBQUV4QjtBQUFDO0FBRUQsQUFBRyxhQUFDLElBQUksQUFBQyxJQUFHLEFBQUMsR0FBRSxBQUFDLElBQUcsQUFBUSxVQUFFLEFBQUMsQUFBRSxLQUNoQyxBQUFDO0FBQ0EsQUFBTyxzQkFBRyxBQUFpQixrQkFBQyxBQUFDLEFBQUMsQUFBQztBQUMvQixBQUFDLGNBQUMsQUFBNEIsQUFBQyw4QkFBQyxBQUFNLE9BQUMsQUFBTyxRQUFDLEFBQXFCLEFBQUUsQUFBQyxBQUFDO0FBQ3hFLGdCQUFJLEFBQU8sVUFBRyxBQUFDLEVBQUMsQUFBZ0IsbUJBQUMsQUFBTyxRQUFDLEFBQUUsS0FBRSxBQUFnQixBQUFDLEFBQUM7QUFDL0QsQUFBNkIsNERBQUMsQUFBTyxBQUFDLEFBQUM7QUFDdkMsQUFBa0IsaURBQUMsQUFBTyxTQUFFLEFBQU8sQUFBQyxBQUNyQztBQUFDO0FBRUQsQUFBRSxBQUFDLFlBQUMsQUFBUSxBQUFDLFVBQ2IsQUFBQztBQUNBLEFBQUMsY0FBQyxBQUE0QixBQUFDLDhCQUFDLEFBQU8sUUFBQyxFQUFDLEFBQVMsV0FBRSxBQUFHLEFBQUMsT0FBRSxBQUFHLEFBQUMsQUFDL0Q7QUFBQztBQUVELEFBQUMsVUFBQyxBQUE0QixBQUFDLDhCQUFDLEFBQVc7QUFDdEMsQUFBUyx1QkFBRyxBQUFJLEFBQ2xCLEFBQUMsQUFBQztBQUZ1QztBQUkxQyxBQUFDLFVBQUMsQUFBb0MsQUFBQyxzQ0FBQyxBQUFJLEtBQUMsQUFBRyxNQUFHLEFBQWlCLGtCQUFDLEFBQU0sU0FBRyxBQUFHLEFBQUMsQUFBQyxBQUN0RjtBQUFDO0FBRU8sbUNBQVksZUFBcEI7QUFFQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLFlBQ3BCLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQVUsQUFBRSxBQUFDO0FBQ2xCLEFBQWdDO0FBQ2hDLEFBQUksaUJBQUMsQUFBVSxhQUFHLEFBQUssQUFBQztBQUN4QixBQUFJLGlCQUFDLEFBQUssQUFBRSxBQUFDO0FBQ2IsQUFBSSxpQkFBQyxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQVEsQUFBRSxBQUFDLEFBQUMsQUFDM0I7QUFBQyxBQUNGO0FBQUM7QUFFTyxtQ0FBZSxrQkFBdkIsVUFBd0IsQUFBQyxHQUFDLEFBQUM7QUFFekIsQUFBRSxBQUFDLFlBQUMsQUFBQyxFQUFDLEFBQVEsWUFBSSxBQUFDLEVBQUMsQUFBUSxBQUFDLFVBQUMsQUFBTSxPQUFDLEFBQUMsQUFBQztBQUN2QyxBQUFNLGVBQUMsQUFBQyxFQUFDLEFBQVEsV0FBRyxBQUFDLEVBQUMsQUFBUSxXQUFHLENBQUMsQUFBQyxJQUFHLEFBQUMsQUFBQyxBQUMxQztBQUFDO0FBQ0YsV0FBQSxBQUFDO0FBMUlELEFBMElDOzs7Ozs7Ozs7Ozs7OztBQ2hKRCxBQUFPLEFBQWEsQUFBUyxBQUFFLEFBQVEsQUFBRSxBQUFNLEFBQWUsQUFBQzs7QUFJL0QsQUFBTyxBQUFFLEFBQVUsQUFBRSxBQUFPLEFBQUUsQUFBTSxBQUF1QixBQUFDLEFBRzVELEFBQU07O0FBckJOLEFBUUc7Ozs7Ozs7Ozs7QUFlRixBQUFrQjtBQUNsQixRQUFJLEFBQVksZUFBRyxBQUFDLEVBQUMsQUFBaUMsQUFBQyxBQUFDO0FBQ3hELEFBQTZCLGtDQUFDLEFBQVksQUFBQyxBQUFDO0FBRTVDLEFBQUMsTUFBQyxBQUFzQyxBQUFDLHdDQUFDLEFBQWUsQUFBRSxBQUFDO0FBRTVELEFBQThFO0FBQzlFLEFBQUMsTUFBQyxBQUErQyxBQUFDLGlEQUFDLEFBQUssTUFBQztBQUV4RCxZQUFJLEFBQU8sVUFBRyxBQUFDLEVBQUMsQUFBMkIsQUFBQyw2QkFBQyxBQUFHLEFBQUUsQUFBQztBQUVuRCxBQUFFLEFBQUMsWUFBQyxBQUFPLEFBQUMsU0FDWixBQUFDO0FBQ0EsQUFBRyxnQkFBQyxBQUFRLFNBQUMsQUFBYyxlQUFDLEFBQU8sU0FDbkM7QUFDQyxBQUFDLGtCQUFDLEFBQXNDLEFBQUMsd0NBQUMsQUFBSSxBQUFFLEFBQUM7QUFDakQsQUFBQyxrQkFBQyxBQUFxQixBQUFDLHVCQUFDLEFBQVUsQUFBRSxBQUFDO0FBQ3RDLEFBQUcsb0JBQUMsQUFBa0IsbUJBQUMsQUFBUSxTQUFDLEFBQU8sQUFBQyxBQUFDO0FBRXpDLEFBQUcsb0JBQUMsQUFBUSxTQUFDLEFBQVMsZUFBQyxBQUFjLGdCQUFDLEVBQUMsQUFBRSxJQUFFLEFBQXdCLEFBQUUsQUFBQyxBQUFDLEFBQUMsQUFDekU7QUFBQyxlQUNEO0FBQ0MsQUFBQyxrQkFBQyxBQUFzQyxBQUFDLHdDQUFDLEFBQUksQUFBRSxBQUFDLEFBQ2xEO0FBQUMsQUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUNELEFBQUksZUFDSixBQUFDO0FBQ0EsQUFBQyxjQUFDLEFBQTJCLEFBQUMsNkJBQUMsQUFBUSxTQUFDLEFBQVMsQUFBQyxBQUFDLEFBQ3BEO0FBQUMsQUFFRjtBQUFDLEFBQUMsQUFBQyxBQUNKO0FBQUM7QUFFRDtBQUVDLEFBQUUsQUFBQyxRQUFDLEFBQVUsV0FBQyxBQUFXLEFBQUUsY0FBQyxBQUFNLFdBQUssQUFBQyxBQUFDLEdBQzFDLEFBQUM7QUFDQSxBQUFDLFVBQUMsQUFBd0IsQUFBQywwQkFBQyxBQUFJLEFBQUUsQUFBQztBQUNuQyxBQUFVLG1CQUFDLEFBQUssQUFBRSxBQUFDLEFBQ3BCO0FBQUMsQUFDRCxBQUFJLFdBQ0osQUFBQztBQUNBLEFBQUMsVUFBQyxBQUF3QixBQUFDLDBCQUFDLEFBQUksQUFBRSxBQUFDO0FBQ25DLEFBQUMsVUFBQyxBQUF1QixBQUFDLHlCQUFDLEFBQVUsQUFBRSxBQUFDLEFBQ3pDO0FBQUMsQUFDRjtBQUFDO0FBRUQ7QUFFSSxBQUFVLGVBQUMsQUFBTSxPQUFDLEFBQVM7QUFDekIsQUFBUyxtQkFBRyxBQUEwQyxBQUN2RCxBQUFDLEFBQUMsQUFDUDtBQUhpQztBQUdoQyxBQUVELEFBQU07NEJBQTZCLEFBQU0sUUFBRSxBQUFpQjtBQUUzRCxBQUFFLEFBQUMsUUFBQyxDQUFDLEFBQU8sUUFBQyxBQUFVLEFBQUMsWUFDeEIsQUFBQztBQUNBLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFJLEFBQUUsQUFBQztBQUN6QyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQXVCLEFBQUMseUJBQUMsQUFBSSxBQUFFLEFBQUMsQUFDN0M7QUFBQyxBQUNELEFBQUksV0FDSixBQUFDO0FBQ0EsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFvQixBQUFDLHNCQUFDLEFBQUksQUFBRSxBQUFDO0FBQ3pDLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBdUIsQUFBQyx5QkFBQyxBQUFJLEFBQUUsQUFBQyxBQUM3QztBQUFDLEFBQ0Y7QUFBQyxBQUVELEFBQU07MEJBQTJCLEFBQU0sUUFBRSxBQUFjO0FBRXRELEFBQUUsQUFBQyxRQUFDLEFBQUksQUFBQyxNQUNULEFBQUM7QUFDQSxBQUFNLGVBQUMsQUFBUSxTQUFDLEFBQVcsQUFBQyxBQUFDO0FBQzdCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBYSxBQUFDLGVBQUMsQUFBTyxRQUFDLEFBQVEsQUFBQyxBQUFDLEFBQzlDO0FBQUMsQUFDRCxBQUFJLFdBQ0osQUFBQztBQUNBLEFBQU0sZUFBQyxBQUFXLFlBQUMsQUFBVyxBQUFDLEFBQUM7QUFDaEMsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFhLEFBQUMsZUFBQyxBQUFPLEFBQUUsQUFBQyxBQUN0QztBQUFDLEFBQ0Y7QUFBQyxBQUVELEFBQU07dUNBQXdDLEFBQU07QUFFbkQsQUFBTSxXQUFDLEFBQUksS0FBQyxBQUFhLEFBQUMsZUFBQyxBQUFPLEFBQUUsQUFBQztBQUVyQyxBQUFNLFdBQUMsQUFBSSxLQUFDLEFBQVksQUFBQyxjQUFDLEFBQUssTUFBQztBQUMvQixBQUFNLGVBQUMsQUFBUSxTQUFDLEFBQUksT0FBRyxBQUFPLFFBQUMsQUFBUSxTQUFDLEFBQXFCLHVCQUFFLEVBQUUsQUFBRSxJQUFHLEFBQXdCLEFBQUUsQUFBRSxBQUFDLEFBQUMsQUFDckc7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFNLFdBQUMsQUFBSSxLQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFLLE1BQUM7QUFFakMsWUFBSSxBQUFPLFVBQUcsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFjLGVBQUMsQUFBd0IsQUFBRSxBQUFDLEFBQUM7QUFDM0UsQUFBbUM7QUFDbkMsQUFBQyxVQUFDLEFBQW9DLEFBQUMsc0NBQUMsQUFBSSxLQUFDLEFBQVUseUJBQUMsQUFBTyxRQUFDLEFBQUksQUFBQyxBQUFDLEFBQUM7QUFDdkUsQUFBQyxVQUFDLEFBQXVCLEFBQUMseUJBQUMsQUFBUztBQUM5QixBQUFXLHlCQUFFLEFBQUk7QUFDakIsQUFBTyxxQkFBRSxBQUFHO0FBQ1osQUFBVyx5QkFBRSxBQUFHO0FBQ2hCLEFBQVksMEJBQUUsQUFBRyxBQUNsQixBQUFDLEFBQUMsQUFDUjtBQU5zQztBQU1yQyxBQUFDLEFBQUM7QUFFSCxBQUFNLFdBQUMsQUFBSSxLQUFDLEFBQWtCLEFBQUMsb0JBQUMsQUFBSyxNQUFDO0FBRXJDLFlBQUksQUFBTyxVQUFHLEFBQUcsSUFBQyxBQUFhLGNBQUMsQUFBYyxlQUFDLEFBQXdCLEFBQUUsQUFBQyxBQUFDO0FBRTNFLEFBQUUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFLLFVBQUssQUFBUyxlQUFDLEFBQWEsaUJBQUksQ0FBQyxBQUFHLElBQUMsQUFBUSxTQUFDLEFBQVcsQUFBRSxBQUFDLGVBQ3pFLEFBQUM7QUFDQSxnQkFBSSxBQUFLLFFBQUcsQUFBQyxFQUFDLEFBQXFCLEFBQUMsQUFBQztBQUNyQyxBQUFLLGtCQUFDLEFBQUksS0FBQyxBQUFlLEFBQUMsaUJBQUMsQUFBSSxLQUFDLEFBQVcsYUFBQyxBQUFPLFFBQUMsQUFBYSxBQUFDLEFBQUM7QUFFcEUsQUFBSyxrQkFBQyxBQUFTO0FBQ1gsQUFBVyw2QkFBRSxBQUFJO0FBQ2pCLEFBQU8seUJBQUUsQUFBRztBQUNaLEFBQVcsNkJBQUUsQUFBRztBQUNoQixBQUFZLDhCQUFFLEFBQUcsQUFDbEIsQUFBQyxBQUFDLEFBQ047QUFOaUI7QUFNaEIsQUFDRCxBQUFJLGVBQUMsQUFBRyxJQUFDLEFBQVEsU0FBQyxBQUFTLGVBQUMsQUFBYyxnQkFBQyxFQUFDLEFBQUUsSUFBRSxBQUF3QixBQUFFLEFBQUMsQUFBQyxBQUFDLEFBQzlFO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBTSxXQUFDLEFBQUksS0FBQyxBQUFhLEFBQUMsZUFBQyxBQUFLLE1BQUM7QUFFaEMsWUFBSSxBQUFPLFVBQUcsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFjLGVBQUMsQUFBd0IsQUFBRSxBQUFDLEFBQUM7QUFFM0UsWUFBSSxBQUFLLFFBQUcsQUFBQyxFQUFDLEFBQXNCLEFBQUMsQUFBQztBQUV0QyxBQUFLLGNBQUMsQUFBSSxLQUFDLEFBQWUsQUFBQyxpQkFBQyxBQUFJLEtBQUMsQUFBVyxhQUFDLEFBQU8sUUFBQyxBQUFhLEFBQUMsQUFBQztBQUNwRSxBQUEwRztBQUUxRyxZQUFJLEFBQUcsQUFBQztBQUNSLEFBQUUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFJLFFBQUksQUFBUSxjQUFDLEFBQUcsQUFBQyxLQUM3QixBQUFDO0FBQ0EsQUFBRyxrQkFBRyxBQUFNLE9BQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUM1QjtBQUFDLEFBQ0QsQUFBSSxlQUNKLEFBQUM7QUFDQSxBQUFHLGtCQUFHLEFBQU8sUUFBQyxBQUFRLFNBQUMsQUFBOEIsZ0NBQUUsRUFBRSxBQUFJLE1BQUksQUFBVSx5QkFBQyxBQUFPLHNCQUFDLEFBQU8sUUFBQyxBQUFJLEFBQUMsQUFBQyxRQUFFLEFBQUUsSUFBRyxBQUFPLFFBQUMsQUFBRSxBQUFFLE1BQUUsQUFBSSxBQUFDLEFBQUMsQUFDOUg7QUFBQztBQUVELEFBQUssY0FBQyxBQUFJLEtBQUMsQUFBcUIsQUFBQyx1QkFBQyxBQUFHLElBQUMsQUFBRyxBQUFDLEFBQUM7QUFDM0MsQUFBSyxjQUFDLEFBQVM7QUFDVixBQUFXLHlCQUFFLEFBQUk7QUFDakIsQUFBTyxxQkFBRSxBQUFHO0FBQ1osQUFBVyx5QkFBRSxBQUFHO0FBQ2hCLEFBQVksMEJBQUUsQUFBRyxBQUNuQixBQUFDLEFBQUMsQUFDTjtBQU5pQjtBQU1oQixBQUFDLEFBQUM7QUFFSCxBQUFNLFdBQUMsQUFBSSxLQUFDLEFBQW9CLEFBQUMsc0JBQUMsQUFBSyxNQUFDO0FBRXZDLFlBQUksQUFBTyxVQUFHLEFBQUcsSUFBQyxBQUFhLGNBQUMsQUFBYyxlQUFDLEFBQXdCLEFBQUUsQUFBQyxBQUFDO0FBQzNFLEFBQUcsWUFBQyxBQUFhLGNBQUMsQUFBVyxZQUFDLEFBQXdCLEFBQUUsQUFBQyxBQUFDO0FBRTFELEFBQWtCLDJCQUFDLEFBQU0sUUFBRSxBQUFPLEFBQUMsQUFBQztBQUVwQyxBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBSSxRQUFJLEFBQVEsY0FBQyxBQUFHLEFBQUMsS0FDN0IsQUFBQztBQUNBLEFBQU8sb0JBQUMsQUFBTSxPQUFDLEFBQU0sQUFBRSxBQUFDO0FBQ3hCLEFBQU8sb0JBQUMsQUFBTSxPQUFDLEFBQVcsQUFBRSxBQUFDLEFBQzlCO0FBQUMsQUFFRjtBQUFDLEFBQUMsQUFBQztBQUVILEFBQU0sV0FBQyxBQUFJLEtBQUMsQUFBdUIsQUFBQyx5QkFBQyxBQUFLLE1BQUM7QUFFMUMsWUFBSSxBQUFPLFVBQUcsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFjLGVBQUMsQUFBd0IsQUFBRSxBQUFDLEFBQUM7QUFDM0UsQUFBRyxZQUFDLEFBQWEsY0FBQyxBQUFjLGVBQUMsQUFBd0IsQUFBRSxBQUFDLEFBQUM7QUFFN0QsQUFBa0IsMkJBQUMsQUFBTSxRQUFFLEFBQU8sQUFBQyxBQUFDO0FBRXBDLEFBQUUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFJLFFBQUksQUFBUSxjQUFDLEFBQUcsQUFBQyxLQUFDLEFBQU8sUUFBQyxBQUFNLE9BQUMsQUFBTSxBQUFFLEFBQUMsQUFDdkQ7QUFBQyxBQUFDLEFBQUMsQUFDSjtBQUFDO0FBRUQ7QUFFQyxBQUFFLEFBQUMsUUFBRSxBQUFHLElBQUMsQUFBSSxRQUFJLEFBQVEsY0FBQyxBQUFJLEFBQUMsS0FDL0IsQUFBQztBQUNBLEFBQU0sZUFBQyxBQUFDLEVBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFJLEtBQUMsQUFBZSxBQUFDLGlCQUFDLEFBQUksS0FBQyxBQUFpQixBQUFDLEFBQUMsQUFDN0U7QUFBQztBQUNELEFBQU0sV0FBQyxBQUFRLFNBQUMsQUFBQyxFQUFDLEFBQXNCLEFBQUMsd0JBQUMsQUFBSSxLQUFDLEFBQWlCLEFBQUMsQUFBQyxBQUFDLEFBQ3BFO0FBQUM7QUFHRCxBQVVHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlNSCxBQUFPLEFBQUUsQUFBSyxBQUFVLEFBQU0sQUFBZ0IsQUFBQzs7QUFDL0MsQUFBTyxBQUFFLEFBQWEsQUFBRSxBQUFpQixBQUFFLEFBQU0sQUFBcUIsQUFBQzs7QUFDdkUsQUFBTyxBQUFFLEFBQWtCLEFBQUUsQUFBZ0IsQUFBRSxBQUFNLEFBQTBCLEFBQUM7O0FBSWhGO0FBQUE7QUFFQyxhQUFTLFlBQWEsQUFBSyxBQUFDO0FBQzVCLGFBQWdCLG1CQUFHLEFBQUssQUFBQztBQUV6QixhQUFjLGlCQUFhLEFBQUksQUFBQztBQUVoQyxhQUFNLFNBQUcsQUFBSSxBQUFLLEFBQVUsQUFBQztBQUM3QixhQUFNLFNBQUcsQUFBSSxBQUFLLEFBQVcsQUFBQyxBQXFML0I7QUFBQztBQW5MQSwrQkFBZ0IsbUJBQWhCO0FBQThCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBYyxpQkFBRyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQUUsS0FBRyxBQUFJO0FBQUM7QUFFakYsK0JBQWdCLG1CQUF4QjtBQUVDLEFBQU0sZUFBQyxBQUFDLEVBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFHLElBQUMsQUFBVSxBQUFDLGVBQUksQUFBVSxBQUFDLEFBQzdEO0FBQUM7QUFFRCxBQUFvQztBQUNwQywrQkFBVyxjQUFYLFVBQVksQUFBUztBQUFyQixvQkFrREM7QUFoREEsWUFBSSxBQUFPLFVBQUcsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFjLGVBQUMsQUFBUyxBQUFDLEFBQUM7QUFFMUQsQUFBc0Q7QUFFdEQsQUFBNkI7QUFDN0IsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQWMsQUFBQyxnQkFDeEIsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFjLGVBQUMsQUFBSSxBQUFDLEFBQUMsQUFDakQ7QUFBQztBQUVELEFBQUksYUFBQyxBQUFjLGlCQUFHLEFBQU8sQUFBQztBQUU5QixBQUFPLGdCQUFDLEFBQWMsQUFBRSxBQUFDO0FBRXpCLEFBQUMsVUFBQyxBQUFlLEFBQUMsaUJBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFxQixBQUFFLEFBQUMsQUFBQztBQUV6RCxZQUFJLEFBQU8sVUFBRyxBQUFDLEVBQUMsQUFBaUMsQUFBQyxBQUFDO0FBQ25ELEFBQU8sZ0JBQUMsQUFBSSxLQUFDLEFBQVcsYUFBRSxBQUFPLFFBQUMsQUFBYSxBQUFDLEFBQUM7QUFFakQsQUFBa0IsNkNBQUMsQUFBTyxTQUFFLEFBQU8sQUFBQyxBQUFDO0FBRXJDLEFBQTBFO0FBQzFFLEFBQTRDO0FBQzVDLEFBQWdCLDJDQUFDLEFBQU8sU0FBRSxBQUFJLEtBQUMsQUFBZ0IsQUFBRSxBQUFDLEFBQUM7QUFHbkQsQUFBQyxVQUFDLEFBQTJCLEFBQUMsNkJBQUMsQUFBSyxNQUFDO0FBRXBDLEFBQUksa0JBQUMsQUFBSSxBQUFFLEFBQUM7QUFDWixBQUFNLG1CQUFDLEFBQUssQUFBQyxBQUNkO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBQyxVQUFDLEFBQW1DLEFBQUMscUNBQUMsQUFBSyxNQUFDO0FBQU8sQUFBSSxrQkFBQyxBQUFhLEFBQUUsQUFBQyxBQUFDO0FBQUMsQUFBQyxBQUFDO0FBRTdFLEFBQUksYUFBQyxBQUFJLEFBQUUsQUFBQztBQUVaLEFBQW1EO0FBQ25ELEFBQWdDO0FBQ2hDLEFBQVUsbUJBQUM7QUFDVixBQUFFLEFBQUMsZ0JBQUMsQ0FBQyxBQUFHLElBQUMsQUFBWSxhQUFDLEFBQVEsU0FBQyxBQUFPLFFBQUMsQUFBUSxBQUFDLEFBQUMsV0FDakQsQUFBQztBQUNBLEFBQUcsb0JBQUMsQUFBWSxhQUFDLEFBQWEsY0FBQyxBQUFPLFFBQUMsQUFBUSxBQUFDLEFBQUM7QUFDakQsQUFBVSwyQkFBRTtBQUFRLEFBQUksMEJBQUMsQUFBYyxlQUFDLEFBQU0sT0FBQyxBQUFXLEFBQUUsQUFBQyxBQUFDO0FBQUMsbUJBQUUsQUFBSSxBQUFDLEFBQUMsQUFFeEU7QUFBQyxBQUNGO0FBQUMsV0FBRSxBQUFJLEFBQUMsQUFBQztBQUVULEFBQUksYUFBQyxBQUFNLE9BQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUFDLEFBQzdCO0FBQUM7QUFBQSxBQUFDO0FBRUYsK0JBQUksT0FBSjtBQUVDLEFBQW1DO0FBRW5DLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQWdCLEFBQUUsQUFBQyxvQkFDN0IsQUFBQztBQUNBLEFBQUMsY0FBQyxBQUFtQixBQUFDLHFCQUFDLEFBQUksQUFBRSxBQUFDO0FBRTlCLGdCQUFJLEFBQXdCLDJCQUFHLEFBQUMsRUFBQyxBQUFlLEFBQUMsaUJBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBQ3BFLEFBQXdCLHdDQUFJLEFBQUMsRUFBQyxBQUE0RCxBQUFDLDhEQUFDLEFBQU0sQUFBRSxBQUFDO0FBRXJHLEFBQUMsY0FBQyxBQUFtQixBQUFDLHFCQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUUsQUFBd0IsQUFBQyxBQUFDO0FBQy9ELEFBQWlCLEFBQUUsQUFBQztBQUNwQixBQUFhLGdEQUFDLEFBQXdCLEFBQUMsQUFBQyxBQUN6QztBQUFDLEFBQ0QsQUFBSSxlQUNKLEFBQUM7QUFDQSxBQUNzQjs7QUFFdEIsQUFBRSxBQUFDLGdCQUFDLENBQUMsQUFBQyxFQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRSxHQUFDLEFBQVUsQUFBQyxBQUFDLGFBQzNDLEFBQUM7QUFDQSxBQUFDLGtCQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRyxJQUFDLEFBQU8sU0FBQyxBQUFRLEFBQUMsQUFBQztBQUM3QyxBQUFDLGtCQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBSSxBQUFFLE9BQUMsQUFBTyxRQUFDLEVBQUMsQUFBTyxTQUFDLEFBQUcsQUFBQyxPQUFDLEFBQUcsS0FBQyxBQUFPLFNBQUM7QUFBWSxBQUFhLHdEQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUMsQUFDbEc7QUFBQztBQUVELEFBQWlCLEFBQUUsQUFBQyxBQUVyQjtBQUFDO0FBRUQsQUFBSSxhQUFDLEFBQVMsWUFBRyxBQUFJLEFBQUMsQUFDdkI7QUFBQztBQUFBLEFBQUM7QUFFRiwrQkFBSSxPQUFKO0FBRUMsQUFBRSxBQUFDLFlBQUMsQUFBQyxFQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRSxHQUFDLEFBQVUsQUFBQyxBQUFDLGFBQzFDLEFBQUM7QUFDQSxBQUFFLEFBQUMsZ0JBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBZ0IsQUFBRSxBQUFDLG9CQUM3QixBQUFDO0FBQ0EsQUFBSSxxQkFBQyxBQUFXLEFBQUUsQUFBQztBQUNuQixBQUFDLGtCQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRyxJQUFDLEFBQVEsVUFBQyxBQUFHLEFBQUMsQUFBQztBQUN6QyxBQUFDLGtCQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBSSxBQUFFLEFBQUM7QUFDOUIsQUFBYSxvREFBQyxBQUFDLEFBQUMsQUFBQyxBQUNsQjtBQUFDLEFBQ0QsQUFBSSxtQkFDSixBQUFDO0FBQ0EsQUFBQyxrQkFBQyxBQUF3QixBQUFDLDBCQUFDLEFBQUcsSUFBQyxBQUFjLGdCQUFDLEFBQUssQUFBQyxBQUFDO0FBQ3RELEFBQUMsa0JBQUMsQUFBaUIsQUFBQyxtQkFBQyxBQUFHLElBQUMsQUFBYyxnQkFBQyxBQUFLLEFBQUMsQUFBQztBQUUvQyxBQUFFLEFBQUMsb0JBQUMsQUFBQyxFQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRSxHQUFDLEFBQVUsQUFBQyxBQUFDLGFBQzFDLEFBQUM7QUFDQSxBQUFDLHNCQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBTyxRQUFDLEVBQUMsQUFBTyxTQUFDLEFBQVEsQUFBQyxZQUFDLEFBQUcsS0FBQyxBQUFPLFNBQUM7QUFBWSxBQUFDLDBCQUFDLEFBQUksQUFBQyxNQUFDLEFBQUksQUFBRSxBQUFDLE9BQUEsQUFBYSxvQ0FBQyxBQUFDLEFBQUMsQUFBQyxBQUFFO0FBQUMsQUFBQyxBQUFDLEFBQ2hIO0FBQUMsQUFDRjtBQUFDO0FBRUQsQUFBSSxpQkFBQyxBQUFNLE9BQUMsQUFBSSxLQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3hCO0FBQUM7QUFFRCxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBYyxrQkFBSSxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUksS0FBQyxBQUFjLGVBQUMsQUFBTSxPQUFDLEFBQWMsZUFBQyxBQUFJLEFBQUMsQUFBQztBQUV2RyxBQUFJLGFBQUMsQUFBYyxpQkFBRyxBQUFJLEFBQUM7QUFDM0IsQUFBSSxhQUFDLEFBQVMsWUFBRyxBQUFLLEFBQUMsQUFDeEI7QUFBQztBQUFBLEFBQUM7QUFFRiwrQkFBYSxnQkFBYjtBQUVDLEFBQW1DO0FBRW5DLEFBQUUsQUFBQyxZQUFFLEFBQUMsRUFBQyxBQUFnQyxBQUFDLGtDQUFDLEFBQUUsR0FBQyxBQUFVLEFBQUUsQUFBQyxhQUN6RCxBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFXLEFBQUUsQUFBQztBQUNuQixBQUFDLGNBQUMsQUFBaUIsQUFBQyxtQkFBQyxBQUFHLElBQUMsQUFBUyxXQUFDLEFBQUUsQUFBQyxJQUFDLEFBQU8sUUFBQyxFQUFDLEFBQVMsV0FBRSxBQUFHLEFBQUMsT0FBQyxBQUFHLEFBQUMsQUFBQztBQUNyRSxBQUFDLGNBQUMsQUFBYyxBQUFDLGdCQUFDLEFBQU0sQUFBRSxBQUFDLEFBQzVCO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUMsY0FBQyxBQUFpQixBQUFDLG1CQUFDLEFBQU8sUUFBQyxFQUFDLEFBQVMsV0FBRSxBQUFHLEFBQUMsT0FBQyxBQUFHLEFBQUMsS0FBQyxBQUFHLElBQUMsQUFBUyxXQUFDLENBQUMsQUFBQyxBQUFDLEFBQUM7QUFDckUsQUFBQyxjQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFPLEFBQUUsQUFBQztBQUU1QixBQUFDLGNBQUMsQUFBOEIsQUFBQyxnQ0FBQyxBQUFJLEFBQUUsQUFBQztBQUN6QyxBQUFDLGNBQUMsQUFBOEIsQUFBQyxnQ0FBQyxBQUFJLEFBQUUsQUFBQztBQUV6QyxBQUFDLGNBQUMsQUFBZ0MsQUFBQyxrQ0FBQyxBQUFJLEFBQUUsQUFBQztBQUUzQyxnQkFBSSxBQUF3QiwyQkFBSSxBQUFDLEVBQUUsQUFBTSxBQUFFLFFBQUMsQUFBTSxBQUFFLEFBQUM7QUFDckQsQUFBd0Isd0NBQUksQUFBQyxFQUFDLEFBQVEsQUFBQyxVQUFDLEFBQU0sQUFBRSxBQUFDO0FBQ2pELEFBQXdCLHdDQUFHLEFBQUMsRUFBQyxBQUFxQyxBQUFDLHVDQUFDLEFBQVcsWUFBQyxBQUFJLEFBQUMsQUFBQztBQUV0RixBQUFDLGNBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFHLElBQUMsQUFBUSxVQUFFLEFBQU0sQUFBQyxBQUFDO0FBRTdDLGdCQUFJLEFBQWMsaUJBQUcsQUFBQyxFQUFDLEFBQW1CLEFBQUMsQUFBQztBQUMxQyxnQkFBSSxBQUFNLFNBQUksQUFBd0IsQUFBQztBQUN6QyxBQUFNLHNCQUFJLEFBQWMsZUFBQyxBQUFJLEtBQUMsQUFBcUIsQUFBQyx1QkFBQyxBQUFXLFlBQUMsQUFBSSxBQUFDLEFBQUM7QUFDdkUsQUFBTSxzQkFBSSxBQUFjLGVBQUMsQUFBSSxLQUFDLEFBQTBDLEFBQUMsNENBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBQzVGLEFBQU0sc0JBQUksQUFBYyxlQUFDLEFBQUksS0FBQyxBQUFlLEFBQUMsaUJBQUMsQUFBVyxZQUFDLEFBQUksQUFBQyxBQUFDO0FBRS9ELEFBQUMsY0FBQyxBQUFxQyxBQUFDLHVDQUFDLEFBQUcsSUFBQyxBQUFRLFVBQUUsQUFBTSxBQUFDLEFBQUM7QUFFakUsQUFBYSxnREFBQyxBQUF3QixBQUFDLEFBQUMsQUFDekM7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBRUYsK0JBQVcsY0FBWDtBQUVDLEFBQW1DO0FBRW5DLEFBQUUsQUFBQyxZQUFDLEFBQUMsRUFBQyxBQUFnQyxBQUFDLGtDQUFDLEFBQUUsR0FBQyxBQUFVLEFBQUMsQUFBQyxhQUN2RCxBQUFDO0FBQ0EsQUFBQyxjQUFDLEFBQWdDLEFBQUMsa0NBQUMsQUFBSSxBQUFFLEFBQUM7QUFDM0MsQUFBQyxjQUFDLEFBQThCLEFBQUMsZ0NBQUMsQUFBSSxBQUFFLEFBQUM7QUFDekMsQUFBQyxjQUFDLEFBQThCLEFBQUMsZ0NBQUMsQUFBSSxBQUFFLEFBQUM7QUFFekMsZ0JBQUksQUFBd0IsMkJBQUcsQUFBQyxFQUFDLEFBQWUsQUFBQyxpQkFBQyxBQUFXLFlBQUMsQUFBSSxBQUFDLFFBQUcsQUFBQyxFQUFDLEFBQTRELEFBQUMsOERBQUMsQUFBTSxBQUFFLEFBQUM7QUFFL0ksQUFBQyxjQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBRyxJQUFDLEFBQVEsVUFBRSxBQUF3QixBQUFDLEFBQUM7QUFFL0QsQUFBYSxnREFBQyxBQUF3QixBQUFDLEFBQUMsQUFDekM7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBN0xELEFBNkxDOzs7Ozs7Ozs7OztBQ3ZNRCxBQUFPLEFBQWEsQUFBUyxBQUFFLEFBQU0sQUFBa0IsQUFBQzs7QUFVeEQ7QUFTQywwQkFBWSxBQUFZLEtBQUUsQUFBb0I7QUFBOUMsb0JBMENDO0FBaERELGFBQVksZUFBYSxBQUFLLEFBQUM7QUFFL0IsYUFBYSxnQkFBYSxBQUFLLEFBQUM7QUFDaEMsYUFBWSxlQUFHLEFBQVEsQUFBQztBQUt2QixBQUFJLGFBQUMsQUFBRyxNQUFHLEFBQUcsQUFBQztBQUVmLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBUyxBQUFDLFdBQ2YsQUFBQztBQUNBLGdCQUFJLEFBQU8sVUFBRyxBQUFJLEtBQUMsQUFBVSxBQUFFLEFBQUM7QUFDaEMsQUFBRSxBQUFDLGdCQUFDLEFBQU8sWUFBSyxBQUFJLEFBQUMsTUFBQyxBQUFNLE9BQUMsQUFBTyxRQUFDLEFBQUcsSUFBQyxBQUFvQix1QkFBRSxBQUFJLEtBQUMsQUFBRyxBQUFDLEFBQUMsQUFDekUsQUFBSSxVQUFDLEFBQVMsWUFBRyxBQUFPLFFBQUMsQUFBUSxBQUFDLEFBQ25DO0FBQUM7QUFFRCxBQUFJLGFBQUMsQUFBVyxjQUFHLEFBQUMsRUFBQyxBQUFNLE9BQUMsQUFBUyxXQUFFLEVBQUUsQUFBYSxlQUFHLEFBQUksQUFBQyxBQUFDLEFBQUM7QUFFaEUsQUFBSSxhQUFDLEFBQVcsWUFBQyxBQUFFLEdBQUMsQUFBTyxTQUFFLFVBQUMsQUFBRTtBQUUvQixBQUFHLGdCQUFDLEFBQWlCLGtCQUFDLEFBQUksQUFBQyxBQUFDLEFBQzVCO0FBQUMsQUFBQyxBQUFDO0FBRUosQUFBSSxhQUFDLEFBQVcsWUFBQyxBQUFFLEdBQUMsQUFBVyxhQUFFLFVBQUMsQUFBRTtBQUVuQyxBQUFFLEFBQUMsZ0JBQUMsQUFBSSxNQUFDLEFBQVksQUFBQyxjQUFDLEFBQUM7QUFBQyxBQUFNLEFBQUMsQUFBQztBQUFDO0FBQ2xDLEFBQXdEO0FBQ3ZELEFBQUksa0JBQUMsQUFBVyxBQUFFLEFBQUMsQUFDckI7QUFBQyxBQUFDLEFBQUM7QUFFSCxBQUFJLGFBQUMsQUFBVyxZQUFDLEFBQUUsR0FBQyxBQUFVLFlBQUUsVUFBQyxBQUFFO0FBRWxDLEFBQUUsQUFBQyxnQkFBQyxBQUFJLE1BQUMsQUFBWSxBQUFDLGNBQUMsQUFBQztBQUFDLEFBQU0sQUFBQyxBQUFDO0FBQUM7QUFDbEMsQUFBSSxrQkFBQyxBQUFjLEFBQUUsQUFBQyxBQUN2QjtBQUFDLEFBQUMsQUFBQztBQUVILEFBQTRDO0FBQzVDLEFBQUk7QUFDSixBQUE2RTtBQUM3RSxBQUFNO0FBQ04sQUFBMEM7QUFDMUMsQUFBTztBQUNQLEFBQUk7QUFFSixBQUFJLGFBQUMsQUFBYSxnQkFBRyxBQUFLLEFBQUM7QUFFM0IsQUFBSSxhQUFDLEFBQU0sQUFBRSxBQUFDLEFBQ2Y7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBMkIsOEJBQTNCO0FBRUMsQUFBTSxlQUFDLEFBQUcsSUFBQyxBQUFnQixpQkFBQyxBQUFnQixBQUFFLHNCQUFJLEFBQUksS0FBQyxBQUFHLEFBQUMsQUFDNUQ7QUFBQztBQUVPLDJCQUFTLFlBQWpCO0FBRUMsQUFBTSxlQUFDLEFBQUMsRUFBQyxBQUFVLGFBQUUsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ2hDO0FBQUM7QUFFRCwyQkFBVyxjQUFYO0FBQUEsb0JBTUM7QUFKQSxBQUFJLGFBQUMsQUFBWSxlQUFHLEFBQUksQUFBQztBQUN6QixBQUFJLGFBQUMsQUFBUyxBQUFFLFlBQUMsQUFBTyxRQUFDLEVBQUMsQUFBRyxLQUFFLEFBQVEsQUFBQyxZQUFFLEFBQUcsS0FBRSxBQUFnQixBQUFDLEFBQUM7QUFDakUsQUFBSSxhQUFDLEFBQVMsQUFBRSxZQUFDLEFBQU8sUUFBQyxFQUFDLEFBQUcsS0FBRSxBQUFRLEFBQUMsWUFBRSxBQUFHLEtBQUUsQUFBZ0Isa0JBQzlEO0FBQU8sQUFBSSxrQkFBQyxBQUFZLGVBQUcsQUFBSyxBQUFDO0FBQUMsQUFBRSxBQUFDLEFBQ3ZDO0FBQUM7QUFBQSxBQUFDO0FBRUYsMkJBQU0sU0FBTjtBQUVDLFlBQUksQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFVLEFBQUUsQUFBQztBQUVoQyxZQUFJLEFBQWEsZ0JBQUcsQUFBSyxBQUFDO0FBQzFCLFlBQUksQUFBWSxlQUFHLEFBQUksQUFBQztBQUV4QixBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBSyxTQUFJLEFBQVMsZUFBQyxBQUFhLEFBQUMsZUFDekMsQUFBQztBQUNBLEFBQWdCO0FBQ2hCLGdCQUFJLEFBQVEsZ0JBQUEsQUFBQztBQUViLEFBQUUsQUFBQyxnQkFBQyxBQUFPLFFBQUMsQUFBMkIsZ0NBQUssQUFBRSxBQUFDLElBQy9DLEFBQUM7QUFDQSxBQUFRLDJCQUFHLEFBQVMsZUFBQyxBQUFNLEFBQUMsQUFDN0I7QUFBQyxBQUNELEFBQUksbUJBQ0osQUFBQztBQUNBLEFBQVEsMkJBQUcsQUFBTyxRQUFDLEFBQStCLEFBQUUsb0NBQUcsQUFBUyxlQUFDLEFBQU0sU0FBRyxBQUFRLEFBQUM7QUFDbkYsQUFBOEU7QUFDOUUsQUFBYSxnQ0FBRyxDQUFDLEFBQU8sUUFBQyxBQUErQixBQUFFLEFBQUMsQUFDNUQ7QUFBQztBQUVELEFBQUksaUJBQUMsQUFBYyxlQUFDLEVBQUMsQUFBUSxVQUFFLEFBQVEsQUFBQyxBQUFDLEFBQUMsQUFDM0M7QUFBQztBQUVELFlBQUksQUFBZ0IsbUJBQUcsQUFBTyxRQUFDLEFBQWlCLEFBQUUsQUFBQztBQUVuRCxBQUFzRDtBQUN0RCxBQUEyQjtBQUMzQixBQUFtRztBQUVuRyxZQUFJLEFBQVUsa0JBQVEsQUFBTSxPQUFDLEFBQW9CO0FBRWhELEFBQU8scUJBQUcsQUFBTztBQUNqQixBQUF3QixzQ0FBRSxBQUFnQixpQkFBQyxBQUFDLEFBQUM7QUFDN0MsQUFBMkIseUNBQUUsQUFBZ0IsaUJBQUMsQUFBSyxNQUFDLEFBQUMsQUFBQztBQUN0RCxBQUFZLDBCQUFHLEFBQVk7QUFDM0IsQUFBYSwyQkFBRyxBQUFhLEFBQzdCLEFBQUMsQUFBQztBQU5ILFNBRGlCLEFBQUk7QUFTcEIsQUFBSSxhQUFDLEFBQVcsWUFBQyxBQUFPLFFBQUMsQUFBQyxFQUFDLEFBQU8sUUFBQyxFQUFDLEFBQVMsV0FBRSxBQUEwQiw0QkFBRSxBQUFJLE1BQUUsQUFBVSxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBRS9GLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUEyQixBQUFFLEFBQUMsK0JBQUMsQUFBSSxLQUFDLEFBQVcsQUFBRSxBQUFDO0FBRTNELEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFZLGdCQUFJLEFBQU8sQUFBQyxTQUFDLEFBQUksS0FBQyxBQUFjLEFBQUUsQUFBQztBQUN4RCxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBWSxnQkFBSSxBQUFNLEFBQUMsUUFBQyxBQUFJLEtBQUMsQUFBYSxBQUFFLEFBQUMsQUFDeEQ7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBcUIsd0JBQXJCLFVBQXVCLEFBQVU7QUFFaEMsQUFBSSxhQUFDLEFBQVMsQUFBRSxZQUFDLEFBQVEsU0FBQyxBQUFVLEFBQUMsQUFBQztBQUN0QyxBQUFJLGFBQUMsQUFBUyxBQUFFLFlBQUMsQUFBUSxTQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFRLFNBQUMsQUFBVSxBQUFDLEFBQUMsQUFDaEU7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBd0IsMkJBQXhCLFVBQTBCLEFBQWE7QUFFdEMsQUFBSSxhQUFDLEFBQVMsQUFBRSxZQUFDLEFBQVcsWUFBQyxBQUFhLEFBQUMsQUFBQztBQUM1QyxBQUFJLGFBQUMsQUFBUyxBQUFFLFlBQUMsQUFBUSxTQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFXLFlBQUMsQUFBYSxBQUFDLEFBQUMsQUFDdEU7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBVyxjQUFYO0FBRUMsQUFBSSxhQUFDLEFBQXFCLHNCQUFDLEFBQVMsQUFBQyxBQUFDO0FBQ3RDLFlBQUksQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFTLEFBQUUsQUFBQztBQUNqQyxBQUFTLGtCQUFDLEFBQU0sQUFBRSxTQUFDLEFBQUksS0FBQyxBQUFjLEFBQUMsZ0JBQUMsQUFBSSxBQUFFLEFBQUM7QUFDL0MsQUFBUyxrQkFBQyxBQUFJLEtBQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFJLEFBQUUsQUFBQztBQUM1QyxBQUFTLGtCQUFDLEFBQUksS0FBQyxBQUFtQixBQUFDLHFCQUFDLEFBQUksQUFBRSxBQUFDO0FBRTNDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQWEsaUJBQUksQUFBSSxLQUFDLEFBQVMsQUFBQyxXQUMxQyxBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFrQjtBQUN0QixBQUFhLCtCQUFFLEFBQUM7QUFDaEIsQUFBWSw4QkFBRSxBQUFDLEFBQ2YsQUFBQyxBQUFDLEFBQ0o7QUFKeUI7QUFJeEIsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUVGLDJCQUFjLGlCQUFkLFVBQWdCLEFBQXdCO0FBQXhCLCtCQUFBO0FBQUEscUJBQXdCOztBQUV2QyxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQU0sVUFBSSxBQUFJLEtBQUMsQUFBMkIsQUFBRSxBQUFDLCtCQUFDLEFBQU0sQUFBQztBQUUxRCxZQUFJLEFBQVMsWUFBRyxBQUFJLEtBQUMsQUFBUyxBQUFFLEFBQUM7QUFDakMsQUFBSSxhQUFDLEFBQXdCLHlCQUFDLEFBQVMsQUFBQyxBQUFDO0FBQ3pDLEFBQVMsa0JBQUMsQUFBTSxBQUFFLFNBQUMsQUFBSSxLQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFJLEFBQUUsQUFBQztBQUMvQyxBQUFTLGtCQUFDLEFBQUksS0FBQyxBQUFvQixBQUFDLHNCQUFDLEFBQUksQUFBRSxBQUFDO0FBQzVDLEFBQVMsa0JBQUMsQUFBSSxLQUFDLEFBQW1CLEFBQUMscUJBQUMsQUFBSSxBQUFFLEFBQUM7QUFFM0MsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBYSxpQkFBSSxBQUFJLEtBQUMsQUFBUyxBQUFDLFdBQzFDLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQWtCO0FBQ3RCLEFBQWEsK0JBQUUsQUFBRztBQUNsQixBQUFZLDhCQUFFLEFBQUMsQUFDZixBQUFDLEFBQUMsQUFDSjtBQUp5QjtBQUl4QixBQUNGO0FBQUM7QUFBQSxBQUFDO0FBRUYsMkJBQXFCLHdCQUFyQjtBQUVDLFlBQUksQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFTLEFBQUUsQUFBQztBQUNqQyxBQUFTLGtCQUFDLEFBQUcsSUFBQyxBQUFTLFdBQUMsQUFBRyxBQUFDLEFBQUM7QUFDN0IsQUFBUyxrQkFBQyxBQUFJLEtBQUMsQUFBUyxBQUFDLFdBQUMsQUFBVyxZQUFDLEFBQVksQUFBQyxjQUFDLEFBQVcsWUFBQyxBQUFhLEFBQUMsQUFBQztBQUMvRSxBQUFTLGtCQUFDLEFBQVcsWUFBQyxBQUFZLEFBQUMsY0FBQyxBQUFXLFlBQUMsQUFBYSxBQUFDLEFBQUM7QUFDL0QsQUFBSSxhQUFDLEFBQVksZUFBRyxBQUFRLEFBQUMsQUFDOUI7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBYyxpQkFBZDtBQUVDLFlBQUksQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFTLEFBQUUsQUFBQztBQUNqQyxBQUFTLGtCQUFDLEFBQUksS0FBQyxBQUFTLEFBQUMsV0FBQyxBQUFRLFNBQUMsQUFBYSxBQUFDLEFBQUM7QUFDaEQsQUFBUyxrQkFBQyxBQUFRLFNBQUMsQUFBYSxBQUFDLEFBQUM7QUFDbEMsQUFBSSxhQUFDLEFBQVksZUFBRyxBQUFPLEFBQUMsQUFDL0I7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBYSxnQkFBYjtBQUVDLFlBQUksQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFTLEFBQUUsQUFBQztBQUNqQyxBQUFTLGtCQUFDLEFBQUksS0FBQyxBQUFTLEFBQUMsV0FBQyxBQUFRLFNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDL0MsQUFBUyxrQkFBQyxBQUFRLFNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDakMsQUFBSSxhQUFDLEFBQVksZUFBRyxBQUFNLEFBQUMsQUFDOUI7QUFBQztBQUFBLEFBQUM7QUFHRiwyQkFBa0IscUJBQWxCLFVBQW9CLEFBQU87QUFFMUIsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFJLEtBQUMsQUFBUyxVQUFDLEFBQVEsQUFBQyxVQUM3QixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFTLFVBQUMsQUFBVSxXQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3BDO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBYztBQUNsQixBQUFRLDBCQUFHLEFBQVE7QUFDbkIsQUFBYSwrQkFBRSxBQUFPLFFBQUMsQUFBYTtBQUNwQyxBQUFZLDhCQUFFLEFBQU8sUUFBQyxBQUFZLEFBQ2xDLEFBQUMsQUFBQyxBQUNKO0FBTHFCO0FBS3BCLEFBQ0Y7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBYyxpQkFBZCxVQUFnQixBQUFPO0FBRXRCLEFBQXVCO0FBQ3ZCLEFBQUk7QUFDSixBQUFpSjtBQUNqSixBQUFJO0FBQ0osQUFBTztBQUNQLEFBQU07QUFDTixBQUFzQztBQUN0QyxBQUFnQztBQUNoQyxBQUFpSjtBQUNqSixBQUFJLEFBQ0w7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBYyxpQkFBZCxVQUFnQixBQUF3QjtBQUF4QiwrQkFBQTtBQUFBLHFCQUF3Qjs7QUFFdkMsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFNLFVBQUksQUFBSSxLQUFDLEFBQTJCLEFBQUUsQUFBQywrQkFBQyxBQUFNLEFBQUM7QUFFMUQsQUFBSSxhQUFDLEFBQXFCLHNCQUFDLEFBQVksQUFBQyxBQUFDO0FBQ3pDLFlBQUksQUFBUyxZQUFHLEFBQUksS0FBQyxBQUFTLEFBQUUsQUFBQztBQUNqQyxBQUFTLGtCQUFDLEFBQUcsSUFBQyxBQUFTLFdBQUMsQUFBRyxBQUFDLEFBQUM7QUFDN0IsQUFBUyxrQkFBQyxBQUFJLEtBQUMsQUFBbUIsQUFBQyxxQkFBQyxBQUFRLFNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDM0QsQUFBUyxrQkFBQyxBQUFJLEtBQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFRLFNBQUMsQUFBWSxBQUFDLEFBQUM7QUFDNUQsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQVMsQUFBQyxnQkFBTSxBQUFrQjtBQUN6QyxBQUFhLDJCQUFFLEFBQUc7QUFDbEIsQUFBWSwwQkFBRSxBQUFDLEFBQ2hCLEFBQUMsQUFBQztBQUh5QyxTQUF4QixBQUFJO0FBS3hCLEFBQUksYUFBQyxBQUFhLGdCQUFHLEFBQUksQUFBQyxBQUMzQjtBQUFDO0FBQUEsQUFBQztBQUVGLDJCQUFnQixtQkFBaEI7QUFFQyxBQUFJLGFBQUMsQUFBd0IseUJBQUMsQUFBWSxBQUFDLEFBQUM7QUFDNUMsWUFBSSxBQUFTLFlBQUcsQUFBSSxLQUFDLEFBQVMsQUFBRSxBQUFDO0FBQ2pDLEFBQVMsa0JBQUMsQUFBRyxJQUFDLEFBQVMsV0FBQyxBQUFJLEFBQUMsQUFBQztBQUM5QixBQUFTLGtCQUFDLEFBQUksS0FBQyxBQUFtQixBQUFDLHFCQUFDLEFBQVcsWUFBQyxBQUFZLEFBQUMsQUFBQztBQUM5RCxBQUFTLGtCQUFDLEFBQUksS0FBQyxBQUFvQixBQUFDLHNCQUFDLEFBQVcsWUFBQyxBQUFZLEFBQUMsQUFBQztBQUUvRCxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBUyxBQUFDLGdCQUFNLEFBQWtCO0FBQ3pDLEFBQWEsMkJBQUUsQUFBRztBQUNsQixBQUFZLDBCQUFFLEFBQUMsQUFDaEIsQUFBQyxBQUFDO0FBSHlDLFNBQXhCLEFBQUk7QUFLeEIsQUFBSSxhQUFDLEFBQWEsZ0JBQUcsQUFBSyxBQUFDLEFBQzVCO0FBQUM7QUFBQSxBQUFDO0FBRUYsMkJBQUssUUFBTDtBQUFvQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDO0FBQUM7QUFBQSxBQUFDO0FBRXZDLDJCQUFhLGdCQUFiO0FBQThCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBVyxBQUFDLEFBQUM7QUFBQztBQUFBLEFBQUM7QUFFekQsMkJBQVksZUFBWjtBQUEyQixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQWEsQUFBQyxBQUFDO0FBQUM7QUFFdkQsMkJBQVUsYUFBVjtBQUEwQixBQUFNLGVBQUMsQUFBRyxJQUFDLEFBQWEsY0FBQyxBQUFjLGVBQUMsQUFBSSxLQUFDLEFBQUcsQUFBQyxBQUFDLEFBQUM7QUFBQztBQUFBLEFBQUM7QUFFL0UsMkJBQXdCLDJCQUF4QixVQUEwQixBQUFPO0FBRWhDLEFBQUUsQUFBQyxZQUFDLEFBQU8sUUFBQyxBQUFXLGdCQUFLLEFBQUksQUFBQyxNQUFDLEFBQU0sQUFBQztBQUN6QyxBQUFxRjtBQUNyRixBQUFPLGdCQUFDLEFBQVMsVUFBQyxBQUFVLFdBQUMsQUFBTyxRQUFDLEFBQVcsWUFBQyxBQUFVLEFBQUUsQUFBQyxBQUFDO0FBQy9ELEFBQU8sZ0JBQUMsQUFBUyxVQUFDLEFBQU0sT0FBQyxBQUFPLFFBQUMsQUFBVyxZQUFDLEFBQU0sQUFBRSxBQUFDLEFBQUM7QUFFdkQsQUFBRSxBQUFDLFlBQUMsQUFBRyxJQUFDLEFBQUssU0FBSSxBQUFTLGVBQUMsQUFBYyxBQUFDLGdCQUMxQyxBQUFDO0FBQ0EsQUFBTyxvQkFBQyxBQUFTLFVBQUMsQUFBTSxPQUFDLEFBQUksQUFBQyxBQUFDO0FBQy9CLEFBQU8sb0JBQUMsQUFBUyxVQUFDLEFBQVUsV0FBQyxBQUFLLEFBQUMsQUFBQyxBQUNyQztBQUFDLEFBQ0Y7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBSSxPQUFKO0FBRUMsQUFBRyxZQUFDLEFBQVksYUFBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQVcsQUFBQyxBQUFDO0FBQzdDLEFBQW9DO0FBQ3BDLEFBQUUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFLLFNBQUksQUFBUyxlQUFDLEFBQWEsQUFBQyxlQUFDLEFBQUksS0FBQyxBQUFTLFVBQUMsQUFBTSxPQUFDLEFBQUcsSUFBQyxBQUFHLEFBQUUsQUFBQyxBQUFDLEFBQzVFO0FBQUM7QUFBQSxBQUFDO0FBRUYsMkJBQUksT0FBSjtBQUVDLEFBQUcsWUFBQyxBQUFZLGFBQUMsQUFBWSxhQUFDLEFBQUksS0FBQyxBQUFXLEFBQUMsQUFBQztBQUNoRCxBQUE0QjtBQUM1QixBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBSyxTQUFJLEFBQVMsZUFBQyxBQUFhLEFBQUMsZUFBQyxBQUFJLEtBQUMsQUFBUyxVQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUN2RTtBQUFDO0FBQUEsQUFBQztBQUVGLDJCQUFVLGFBQVYsVUFBWSxBQUFjO0FBRXpCLEFBQW9DO0FBQ3BDLEFBQUUsQUFBQyxZQUFDLEFBQUksQUFBQyxNQUFDLEFBQUksS0FBQyxBQUFJLEFBQUUsQUFBQyxBQUN0QixBQUFJLFlBQUMsQUFBSSxLQUFDLEFBQUksQUFBRSxBQUFDLEFBQ2xCO0FBQUM7QUFBQSxBQUFDO0FBRUYsMkJBQVcsY0FBWDtBQUVDLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQVMsQUFBRSxBQUFDLEFBQ3JDO0FBQUM7QUFBQSxBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBaFRELEFBZ1RDLEtBblVELEFBUUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQSCxBQUFPLEFBQWEsQUFBUyxBQUFFLEFBQU0sQUFBa0IsQUFBQzs7QUFDeEQsQUFBTyxBQUFFLEFBQUssQUFBVSxBQUFNLEFBQW1CLEFBQUM7O0FBU2xEO0FBRUMsc0JBQW1CLEFBQWdCLEtBQ3hCLEFBQWUsS0FDZixBQUFpQjtBQUZULDRCQUFBO0FBQUEsa0JBQWdCOztBQUN4Qiw0QkFBQTtBQUFBLGtCQUFlOztBQUNmLDZCQUFBO0FBQUEsbUJBQWlCOztBQUZULGFBQUcsTUFBSCxBQUFHLEFBQWE7QUFDeEIsYUFBRyxNQUFILEFBQUcsQUFBWTtBQUNmLGFBQUksT0FBSixBQUFJLEFBQWE7QUFFM0IsQUFBSSxhQUFDLEFBQUcsTUFBRyxBQUFHLE9BQUksQUFBQyxBQUFDO0FBQ3BCLEFBQUksYUFBQyxBQUFHLE1BQUcsQUFBRyxPQUFJLEFBQUMsQUFBQztBQUNwQixBQUFJLGFBQUMsQUFBSSxPQUFHLEFBQUksUUFBSSxBQUFDLEFBQUMsQUFDdkI7QUFBQztBQUVELHVCQUFRLFdBQVI7QUFFQyxZQUFJLEFBQU0sU0FBRyxBQUFJLEtBQUMsQUFBSSxPQUFHLEFBQUUsS0FBRyxBQUFDLElBQUcsQUFBQyxBQUFDO0FBQ3BDLEFBQU0sZUFBQyxNQUFJLEFBQUksS0FBQyxBQUFHLElBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxnQkFBSSxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQU8sUUFBQyxBQUFNLEFBQUMsZ0JBQUksQUFBSSxLQUFDLEFBQUksT0FBRyxBQUFDLEFBQ2pGO0FBQUM7QUFFRCx1QkFBVSxhQUFWLFVBQVcsQUFBZTtBQUV6QixBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQU0sQUFBQyxRQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUM7QUFFekIsWUFBSSxBQUFNLFNBQUcsQUFBTSxPQUFDLEFBQUssTUFBQyxBQUFHLEFBQUMsS0FBQyxBQUFHLEFBQUUsTUFBQyxBQUFLLE1BQUMsQUFBRyxBQUFDLEFBQUM7QUFDaEQsQUFBRSxBQUFDLFlBQUMsQUFBTSxPQUFDLEFBQU0sVUFBSSxBQUFDLEFBQUMsR0FBQyxBQUFDO0FBQ3hCLEFBQU8sb0JBQUMsQUFBRyxJQUFDLEFBQTRCLDhCQUFFLEFBQU0sQUFBQyxBQUFDO0FBQ2xELEFBQU0sbUJBQUMsQUFBSSxBQUFDLEFBQ2I7QUFBQztBQUNELEFBQUksYUFBQyxBQUFHLE1BQUcsQUFBVSxXQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ2pDLEFBQUksYUFBQyxBQUFHLE1BQUcsQUFBVSxXQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ2pDLEFBQUksYUFBQyxBQUFJLE9BQUcsQUFBUSxTQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUMsR0FBQyxBQUFLLE1BQUMsQUFBQyxHQUFDLENBQUMsQUFBQyxBQUFDLEFBQUMsQUFBQztBQUU1QyxBQUFnRDtBQUVoRCxBQUFNLGVBQUMsQUFBSSxBQUFDLEFBQ2I7QUFBQztBQUNGLFdBQUEsQUFBQztBQWxDRCxBQWtDQzs7QUFHRCxBQU9FOzs7Ozs7Ozs7QUFDRjtBQUFBO0FBRUMsYUFBVSxhQUFHLEFBQUksQUFBSyxBQUFPLEFBQUM7QUFDOUIsYUFBVyxjQUFHLEFBQUksQUFBSyxBQUFPLEFBQUM7QUFDL0IsYUFBTyxVQUFHLEFBQUksQUFBSyxBQUFPLEFBQUM7QUFDM0IsYUFBTSxTQUFHLEFBQUksQUFBSyxBQUFPLEFBQUM7QUFFMUIsQUFBYTtBQUNiLGFBQUksT0FBVyxBQUFJLEFBQUM7QUFHcEIsYUFBYSxnQkFBYSxBQUFLLEFBQUM7QUFDaEMsYUFBVyxjQUFhLEFBQUssQUFBQztBQUM5QixhQUFVLGFBQUcsQUFBSSxBQUFDO0FBQ2xCLGFBQU8sVUFBRyxDQUFDLEFBQUMsQUFBQztBQUNiLGFBQVEsV0FBYyxBQUFJLEFBQUMsQUFvSzVCO0FBQUM7QUFqS0EsMkJBQU0sU0FBTjtBQUFVLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQUM7QUFBQztBQUFBLEFBQUM7QUFDOUIsMkJBQVMsWUFBVDtBQUF5QixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQVEsV0FBRyxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBRyxLQUFFLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBRyxBQUFDLE9BQUcsQUFBSSxBQUFDLEFBQUM7QUFBQztBQUN4RywyQkFBUyxZQUFUO0FBQStCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBSSxPQUFHLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBUyxBQUFFLGNBQUcsQUFBSSxBQUFDLEFBQUM7QUFBQztBQUNqRiwyQkFBWSxlQUFaO0FBQWlCLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBVSxBQUFDLEFBQUM7QUFBQztBQUFBLEFBQUM7QUFDM0MsMkJBQU8sVUFBUDtBQUFZLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQU8sQUFBRSxBQUFDLEFBQUM7QUFBQztBQUN6QywyQkFBVSxhQUFWO0FBQWUsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFPLEFBQUMsQUFBQztBQUFDO0FBRXJDLDJCQUFJLE9BQUo7QUFBQSxvQkE2REM7QUEzREEsQUFBc0U7QUFDdEUsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQWEsQUFBQyxlQUN2QixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFNLEFBQUUsQUFBQztBQUNkLEFBQU0sQUFBQyxBQUNSO0FBQUM7QUFFRCxBQUFJLGFBQUMsQUFBSSxTQUFLLEFBQUcsSUFBQyxBQUF1QjtBQUNyQyxBQUFXLHlCQUFFLEFBQUssQUFDckIsQUFBQyxBQUFDO0FBRndDLFNBQS9CLEFBQUM7QUFJYixBQUFJLGFBQUMsQUFBb0IseUJBQUssQUFBa0I7QUFDNUMsQUFBaUIsK0JBQUUsQUFBSTtBQUN2QixBQUFtQixpQ0FBRSxBQUFLO0FBQzFCLEFBQW1CLGlDQUFFLEFBQUk7QUFDekIsQUFBZSw2QkFBRSxBQUFLO0FBQ3RCLEFBQWdCLDhCQUFFLEFBQUM7QUFDbkIsQUFBMEIsd0NBQUUsQUFBRztBQUMvQixBQUFnQiw4QkFBRSwwQkFBQyxBQUFJO0FBRXRCLEFBQUUsQUFBQyxvQkFBQyxBQUFJLE9BQUcsQUFBQyxBQUFDLEdBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxBQUN4QixBQUFJLFFBQUMsQUFBTSxPQUFDLEFBQUcsQUFBQyxBQUNqQjtBQUFDLEFBQ0osQUFBQyxBQUFDO0FBWjhDLFNBQXJCLEFBQUM7QUFjN0IsQUFBSSxhQUFDLEFBQUksS0FBQyxBQUFRLFNBQUMsQUFBSSxLQUFDLEFBQW9CLEFBQUMsQUFBQztBQUU5QyxBQUFDLFVBQUMsQUFBTyxRQUFDLEFBQUk7QUFDWCxBQUFRLHNCQUFDLEFBQVUsQUFDckIsQUFBQztBQUZhLFdBRVosQUFBSyxNQUFDLEFBQUksS0FBQyxBQUFJLEFBQUMsQUFBQztBQUVwQixBQUFDLFVBQUMsQUFBUyxVQUFDLEFBQW1MLEFBQUMscUxBQUMsQUFBSyxNQUFDLEFBQUksS0FBQyxBQUFJLEFBQUMsQUFBQztBQUVsTixBQUFJLGFBQUMsQUFBSSxLQUFDLEFBQUUsR0FBQyxBQUFPLFNBQUUsVUFBQyxBQUFDO0FBQU8sQUFBSSxrQkFBQyxBQUFPLFFBQUMsQUFBSSxBQUFFLEFBQUMsQUFBQztBQUFDLEFBQUMsQUFBQztBQUN2RCxBQUFJLGFBQUMsQUFBSSxLQUFDLEFBQUUsR0FBQyxBQUFTLFdBQUUsVUFBQyxBQUFDO0FBRXpCLEFBQUksa0JBQUMsQUFBTyxVQUFHLEFBQUksTUFBQyxBQUFJLEtBQUMsQUFBTyxBQUFFLEFBQUM7QUFDbkMsQUFBSSxrQkFBQyxBQUFjLEFBQUUsQUFBQztBQUN0QixBQUFJLGtCQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUUsQUFBQyxBQUNwQjtBQUFDLEFBQUMsQUFBQztBQUNILEFBQUksYUFBQyxBQUFJLEtBQUMsQUFBRSxHQUFDLEFBQU0sUUFBRSxVQUFDLEFBQUM7QUFBTyxBQUFJLGtCQUFDLEFBQVcsY0FBRyxBQUFJLEFBQUMsS0FBQyxBQUFJLE1BQUMsQUFBVyxZQUFDLEFBQUksQUFBRSxBQUFDLEFBQUM7QUFBQyxBQUFDLEFBQUM7QUFFbkYsQUFBSSxhQUFDLEFBQU0sQUFBRSxBQUFDO0FBRWQsQUFBcUQ7QUFDckQsQUFBNkQ7QUFDN0QsQUFBRSxBQUFDLFlBQUMsQUFBRyxPQUFJLEFBQUcsSUFBQyxBQUFRLFNBQUMsQUFBUyxBQUFFLEFBQUMsYUFDbEMsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBUyxVQUFDLEFBQUcsSUFBQyxBQUFRLFNBQUMsQUFBUyxBQUFFLGFBQUUsQUFBSyxBQUFDLEFBQUMsQUFDakQ7QUFBQyxBQUNELEFBQUksZUFBQyxBQUFFLEFBQUMsSUFBQyxBQUFJLEtBQUMsQUFBUSxBQUFDLFVBQ3ZCLEFBQUM7QUFDQSxBQUErQztBQUMvQyxBQUFVLHVCQUFFO0FBQVEsQUFBSSxzQkFBQyxBQUFXLFlBQUMsQUFBSSxNQUFDLEFBQVEsQUFBQyxBQUFDLEFBQUM7QUFBQyxlQUFDLEFBQUcsQUFBQyxBQUFDLEFBQzdEO0FBQUM7QUFFSCxBQUFJLGFBQUMsQUFBYSxnQkFBRyxBQUFJLEFBQUM7QUFDMUIsQUFBK0I7QUFDL0IsQUFBSSxhQUFDLEFBQVUsV0FBQyxBQUFJLEFBQUUsQUFBQyxBQUN4QjtBQUFDO0FBQUEsQUFBQztBQUVGLDJCQUFNLFNBQU47QUFFQyxBQUF5QztBQUN6QyxBQUF3RDtBQUN4RCxBQUE0QztBQUM1QyxBQUFxRDtBQUNyRCxBQUF1RDtBQUN2RCxBQUFtQjtBQUNuQixBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLE1BQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFjLGVBQUMsQUFBSyxBQUFDLEFBQUMsQUFDaEQ7QUFBQztBQUVELDJCQUFTLFlBQVQsVUFBVSxBQUFpQjtBQUUxQixBQUFJLGFBQUMsQUFBb0IscUJBQUMsQUFBUSxTQUFDLEFBQU0sQUFBQyxBQUFDLEFBQzVDO0FBQUM7QUFFRCwyQkFBWSxlQUFaLFVBQWEsQUFBaUI7QUFFN0IsQUFBSSxhQUFDLEFBQW9CLHFCQUFDLEFBQVcsWUFBQyxBQUFNLEFBQUMsQUFBQyxBQUMvQztBQUFDO0FBRUQsQUFBeUI7QUFDekIsMkJBQVMsWUFBVCxVQUFVLEFBQXVCLFFBQUUsQUFBd0I7QUFBeEIsZ0NBQUE7QUFBQSxzQkFBd0I7O0FBRTFELEFBQU8sZ0JBQUMsQUFBRyxJQUFDLEFBQVcsYUFBRSxBQUFNLEFBQUMsQUFBQztBQUVqQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBVyxlQUFJLEFBQU8sQUFBQyxTQUFDLEFBQUcsSUFBQyxBQUFHLEFBQUUsTUFBQyxBQUFXLFlBQUMsQUFBTSxBQUFDLEFBQUMsQUFDL0QsQUFBSSxhQUFDLEFBQUcsSUFBQyxBQUFHLEFBQUUsTUFBQyxBQUFTLFVBQUMsQUFBTSxBQUFDLEFBQUMsQUFDbEM7QUFBQztBQUVELDJCQUFhLGdCQUFiLFVBQWMsQUFBbUIsVUFBRSxBQUFLLE1BQUUsQUFBd0I7QUFBeEIsZ0NBQUE7QUFBQSxzQkFBd0I7O0FBRWpFLEFBQUksZUFBRyxBQUFJLFFBQUksQUFBSSxLQUFDLEFBQU8sQUFBRSxhQUFJLEFBQUUsQUFBQztBQUNwQyxBQUFPLGdCQUFDLEFBQUcsSUFBQyxBQUFlLGlCQUFFLEFBQVEsQUFBQyxBQUFDO0FBRXZDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFXLGVBQUksQUFBTyxBQUFDLFNBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBUSxVQUFFLEFBQUksQUFBQyxBQUFDLEFBQ2pFLEFBQUksV0FBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFRLFVBQUUsQUFBSSxBQUFDLEFBQUMsQUFDeEM7QUFBQztBQUFBLEFBQUM7QUFFRixBQUFtRTtBQUNuRSwyQkFBYSxnQkFBYjtBQUVDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQVcsQUFBQyxhQUFDLEFBQU0sT0FBQyxBQUFDLEFBQUM7QUFDaEMsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFLLE1BQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFTLEFBQUUsWUFBQyxBQUFZLEFBQUUsZUFBQyxBQUFVLFdBQUMsQUFBSSxLQUFDLEFBQUksS0FBQyxBQUFTLEFBQUUsQUFBQyxlQUFHLEFBQUksQUFBQyxBQUFDLEFBQ2xHO0FBQUM7QUFFRCxBQUFrRDtBQUNsRCwyQkFBc0IseUJBQXRCLFVBQXVCLEFBQW1CO0FBRXpDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBRyxJQUFDLEFBQVEsU0FBQyxBQUFXLEFBQUUsQUFBQyxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUM7QUFDN0MsQUFBTSxlQUFDLEFBQUcsSUFBQyxBQUFRLFNBQUMsQUFBVyxBQUFFLGNBQUMsQUFBVSxXQUFDLEFBQVEsQUFBQyxZQUFHLEFBQUksQUFBQyxBQUMvRDtBQUFDO0FBRUQsMkJBQVEsV0FBUixVQUFTLEFBQTZCO0FBRXJDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFXLGVBQUksQUFBUSxBQUFDLFVBQ2pDLEFBQUM7QUFDQyxBQUFNLG1CQUFDLEFBQUksS0FBQyxBQUFJLEtBQUMsQUFBUyxBQUFFLFlBQUMsQUFBUSxTQUFDLEFBQVEsQUFBQyxBQUFDLEFBQ2xEO0FBQUM7QUFDRCxBQUFPLGdCQUFDLEFBQUcsSUFBQyxBQUF1RSxBQUFDLEFBQUM7QUFDckYsQUFBTSxlQUFDLEFBQUssQUFBQyxBQUNkO0FBQUM7QUFFRCwyQkFBYyxpQkFBZDtBQUVDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxVQUFDLEFBQUksS0FBQyxBQUFRLFdBQUcsSUFBSSxBQUFRLEFBQUUsQUFBQztBQUNuRCxBQUFJLGFBQUMsQUFBUSxTQUFDLEFBQUcsTUFBSSxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVMsQUFBRSxZQUFDLEFBQUcsQUFBQztBQUMvQyxBQUFJLGFBQUMsQUFBUSxTQUFDLEFBQUcsTUFBSSxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQVMsQUFBRSxZQUFDLEFBQUcsQUFBQztBQUMvQyxBQUFJLGFBQUMsQUFBUSxTQUFDLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBTyxBQUFFLEFBQUMsQUFDckM7QUFBQztBQUVELDJCQUFXLGNBQVgsVUFBWSxBQUFvQixXQUFFLEFBQWtDO0FBQXBFLG9CQVNDO0FBVGlDLDBDQUFBO0FBQUEsZ0NBQWtDOztBQUVuRSxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBSSxRQUFJLEFBQVMsYUFBSSxBQUFpQixBQUFDLG1CQUNoRCxBQUFDO0FBQ0EsQUFBd0M7QUFDeEMsZ0JBQUksQUFBTyxVQUFHLEFBQUcsSUFBQyxBQUFLLFNBQUksQUFBUyxlQUFDLEFBQWdCLG1CQUFHLEFBQUcsTUFBRyxBQUFDLEFBQUM7QUFDaEUsQUFBVSx1QkFBRTtBQUFRLEFBQUksc0JBQUMsQUFBSSxLQUFDLEFBQU8sUUFBQyxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQVMsVUFBQyxBQUFHLEtBQUUsQUFBUyxVQUFDLEFBQUcsQUFBQyxNQUFFLEFBQVMsVUFBQyxBQUFJLEFBQUMsQUFBQztBQUFDLGVBQUUsQUFBTyxBQUFDLEFBQUMsQUFDM0c7QUFBQztBQUNELEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBUyxBQUFDLEFBQzNCO0FBQUM7QUFFRCwyQkFBcUIsd0JBQXJCO0FBRUMsQUFBQyxVQUFDLEFBQWlCLEFBQUMsbUJBQUMsQUFBUSxTQUFDLEFBQVksQUFBQyxBQUFDLEFBQzdDO0FBQUM7QUFFRCwyQkFBd0IsMkJBQXhCO0FBRUMsQUFBQyxVQUFDLEFBQWlCLEFBQUMsbUJBQUMsQUFBVyxZQUFDLEFBQVksQUFBQyxBQUFDLEFBQ2hEO0FBQUM7QUFDRixXQUFBLEFBQUM7QUFuTEQsQUFtTEM7Ozs7Ozs7Ozs7O0FDak9ELEFBQU8sQUFBRSxBQUFLLEFBQVUsQUFBTSxBQUFnQixBQUFDOztBQVEvQztBQVFDLHFCQUFZLEFBQVksS0FBRSxBQUFZLEtBQUUsQUFBZ0IsVUFBRSxBQUFtQjtBQUU1RSxBQUFJLGFBQUMsQUFBUyxZQUFHLEFBQUcsQUFBQztBQUNyQixBQUFJLGFBQUMsQUFBUyxZQUFHLEFBQUcsQUFBQztBQUNyQixBQUFJLGFBQUMsQUFBUSxXQUFHLEFBQVEsQUFBQztBQUN6QixBQUFJLGFBQUMsQUFBVSxhQUFHLEFBQVUsQUFBQyxBQUM5QjtBQUFDO0FBQUEsQUFBQztBQUNILFdBQUEsQUFBQztBQWZELEFBZUMsS0FqQ0QsQUFRRzs7Ozs7Ozs7Ozs7QUEyQkg7QUFhQztBQVhBLGFBQWEsZ0JBQUcsQUFBSSxBQUFLLEFBQVMsQUFBQztBQUVuQyxhQUFvQix1QkFBYSxBQUFLLEFBQUM7QUFFdkMsYUFBMEIsNkJBQWEsQUFBSyxBQUFDO0FBQzdDLGFBQWMsaUJBQWEsQUFBSSxBQUFDO0FBRWhDLGFBQVcsY0FBYSxBQUFJLEFBQUM7QUFFN0IsYUFBVyxjQUFHLEFBQUksQUFBQyxBQUVIO0FBQUM7QUFFakIseUJBQXlCLDRCQUF6QixVQUEwQixBQUFTLFdBQUUsQUFBUyxXQUFFLEFBQWU7QUFBZixvQ0FBQTtBQUFBLDBCQUFlOztBQUU5RCxBQUErQjtBQUMvQixBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQVMsYUFBSSxDQUFDLEFBQVMsVUFBQyxBQUFHLEFBQUMsS0FDakMsQUFBQztBQUNBLEFBQU8sb0JBQUMsQUFBRyxJQUFDLEFBQTZCLCtCQUFFLEFBQVMsQUFBQyxBQUFDO0FBQ3RELEFBQU0sQUFBQyxBQUNSO0FBQUM7QUFFRCxBQUEyRTtBQUMzRSxBQUE0RTtBQUM1RSxBQUFvRDtBQUNwRCxBQUFzRDtBQUV0RCxBQUFJLGFBQUMsQUFBVyxZQUFDLElBQUksQUFBTyxRQUFDLEFBQVMsVUFBQyxBQUFHLEtBQUUsQUFBUyxVQUFDLEFBQUcsS0FBRSxBQUFTLFdBQUUsQUFBVyxBQUFDLEFBQUMsQUFBQyxBQUNyRjtBQUFDO0FBRU8seUJBQVcsY0FBbkIsVUFBb0IsQUFBa0I7QUFBdEMsb0JBb0VDO0FBbEVBLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFvQixBQUFDLHNCQUM5QixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUEwQiw2QkFBRyxBQUFJLEFBQUM7QUFDdkMsQUFBSSxpQkFBQyxBQUFjLGlCQUFHLEFBQVEsQUFBQztBQUMvQixBQUFNLEFBQUMsQUFDUjtBQUFDO0FBRUQsQUFBSSxhQUFDLEFBQVcsY0FBRyxBQUFRLEFBQUM7QUFFNUIsWUFBSSxBQUFLLFFBQUcsSUFBSSxBQUFJLEFBQUUsT0FBQyxBQUFPLEFBQUUsQUFBQztBQUNqQyxZQUFJLEFBQUssUUFBRyxBQUFPLFFBQUMsQUFBUSxTQUFDLEFBQXFDLEFBQUMsQUFBQztBQUVwRSxBQUFzRjtBQUV0RixBQUFDLFVBQUMsQUFBSTtBQUNMLEFBQUcsaUJBQUUsQUFBSztBQUNWLEFBQU0sb0JBQUUsQUFBTTtBQUNkLEFBQUk7QUFDSCxBQUFTLDJCQUFHLEFBQVEsU0FBQyxBQUFTO0FBQzlCLEFBQVMsMkJBQUcsQUFBUSxTQUFDLEFBQVM7QUFDOUIsQUFBUSwwQkFBSSxBQUFRLFNBQUMsQUFBUTtBQUM3QixBQUFVLDRCQUFHLEFBQVEsU0FBQyxBQUFVLEFBQ2hDO0FBTEs7QUFNTixBQUFVLHdCQUFFO0FBRVgsQUFBSSxzQkFBQyxBQUFvQix1QkFBRyxBQUFJLEFBQUM7QUFDakMsQUFBSSxzQkFBQyxBQUFXLHlCQUFjO0FBQWEsQUFBQyxzQkFBQyxBQUFvQixBQUFDLHNCQUFDLEFBQUksQUFBRSxBQUFDLEFBQUM7QUFBQyxpQkFBekQsQUFBVSxFQUFpRCxBQUFJLEFBQUMsQUFBQyxBQUNyRjtBQUFDO0FBQ0QsQUFBTyxxQkFBRSxpQkFBQSxBQUFRO0FBRWYsQUFBaUQ7QUFFakQsQUFBRSxBQUFDLG9CQUFDLEFBQVEsU0FBQyxBQUFJLFNBQUssQUFBSSxBQUFDLE1BQzVCLEFBQUM7QUFDQSx3QkFBSSxBQUFHLE1BQUcsSUFBSSxBQUFJLEFBQUUsT0FBQyxBQUFPLEFBQUUsQUFBQztBQUMvQixBQUE2RjtBQUU3RixBQUFJLDBCQUFDLEFBQWEsY0FBQyxBQUFJLEtBQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQ3hDO0FBQUM7QUFFRCxBQUFFLEFBQUMsb0JBQUMsQUFBUSxTQUFDLEFBQWUsQUFBQyxpQkFDN0IsQUFBQztBQUNBLEFBQTBDO0FBQzFDLEFBQUUsQUFBQyx3QkFBQyxDQUFDLEFBQUksTUFBQyxBQUEwQixBQUFDLDRCQUNyQyxBQUFDO0FBQ0EsQUFBSSw4QkFBQyxBQUFXLFlBQUMsQUFBSSxNQUFDLEFBQVcsQUFBQyxBQUFDLEFBQ3BDO0FBQUMsQUFDRjtBQUFDLEFBQ0Y7QUFBQztBQUNELEFBQVEsc0JBQUU7QUFFUixBQUFJLHNCQUFDLEFBQW9CLHVCQUFHLEFBQUssQUFBQztBQUNsQyxBQUFZLDZCQUFDLEFBQUksTUFBQyxBQUFXLEFBQUMsQUFBQztBQUMvQixBQUFFLEFBQUMsb0JBQUMsQUFBSSxNQUFDLEFBQTBCLEFBQUMsNEJBQ3BDLEFBQUM7QUFDQyxBQUE0RTtBQUM1RSxBQUFJLDBCQUFDLEFBQVcsWUFBQyxBQUFJLE1BQUMsQUFBYyxBQUFDLEFBQUM7QUFDdEMsQUFBSSwwQkFBQyxBQUEwQiw2QkFBRyxBQUFLLEFBQUMsQUFDMUM7QUFBQyxBQUNELEFBQUksdUJBQ0osQUFBQztBQUNDLEFBQThDO0FBQ2hELEFBQUMsc0JBQUMsQUFBb0IsQUFBQyxzQkFBQyxBQUFJLEFBQUUsQUFBQyxBQUMvQjtBQUFDLEFBQ0g7QUFBQyxBQUNELEFBQUMsQUFBQyxBQUNKO0FBcERRO0FBb0RQO0FBQUEsQUFBQztBQUVGLHlCQUFjLGlCQUFkLFVBQWUsQUFBUyxXQUFFLEFBQWdCLGlCQUFFLEFBQWdCO0FBRTNELFlBQUksQUFBSyxRQUFHLElBQUksQUFBSSxBQUFFLE9BQUMsQUFBTyxBQUFFLEFBQUM7QUFDakMsWUFBSSxBQUFLLFFBQUcsQUFBTyxRQUFDLEFBQVEsU0FBQyxBQUEwQixBQUFDLEFBQUM7QUFFekQsQUFBQyxVQUFDLEFBQUk7QUFDTCxBQUFHLGlCQUFFLEFBQUs7QUFDVixBQUFNLG9CQUFFLEFBQU07QUFDZCxBQUFJLGtCQUFFLEVBQUUsQUFBUyxXQUFFLEFBQVMsQUFBRTtBQUM5QixBQUFPLHFCQUFFLGlCQUFBLEFBQVE7QUFFaEIsQUFBRSxBQUFDLG9CQUFDLEFBQVEsU0FBQyxBQUFJLEFBQUMsTUFDbEIsQUFBQztBQUNBLHdCQUFJLEFBQUcsTUFBRyxJQUFJLEFBQUksQUFBRSxPQUFDLEFBQU8sQUFBRSxBQUFDO0FBQy9CLEFBQXdGO0FBRXhGLEFBQUUsQUFBQyx3QkFBQyxBQUFlLEFBQUMsaUJBQUMsQUFBZSxnQkFBQyxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQUMsQUFFckQ7QUFBQyxBQUNELEFBQUksdUJBQUMsQUFBRSxBQUFDLElBQUMsQUFBZSxBQUFDLGlCQUFDLEFBQWUsZ0JBQUMsQUFBUSxTQUFDLEFBQUksQUFBQyxBQUFDLEFBQzFEO0FBQUM7QUFDRCxBQUFLLG1CQUFFLGVBQUEsQUFBUTtBQUVkLEFBQUUsQUFBQyxvQkFBQyxBQUFlLEFBQUMsaUJBQUMsQUFBZSxnQkFBQyxBQUFRLEFBQUMsQUFBQyxBQUNoRDtBQUFDLEFBQ0QsQUFBQyxBQUFDLEFBQ0o7QUFyQlE7QUFxQlA7QUFBQSxBQUFDO0FBRUgsV0FBQSxBQUFDO0FBbElELEFBa0lDOzs7Ozs7Ozs7OztBQzFKRCxBQUFPLEFBQUUsQUFBUSxBQUFFLEFBQU0sQUFBMkIsQUFBQzs7Ozs7eUJBRzVDLEFBQVEsQUFBRSxBQUFNLEFBQTJCLEFBQUMsQUFDckQsQUFBTzs7OztBQUhQLEFBQU8sQUFBRSxBQUFNLEFBQUUsQUFBTSxBQUF5QixBQUFDLEFBRWpELEFBQU87Ozs7O3VCQUNFLEFBQU0sQUFBRSxBQUFNLEFBQXlCLEFBQUM7Ozs7QUFNakQ7QUFVQztBQVJBLGFBQVUsYUFBZ0IsQUFBRSxBQUFDO0FBQzdCLGFBQU8sVUFBYyxBQUFFLEFBQUM7QUFLeEIsYUFBb0IsdUJBQWMsQUFBRSxBQUFDO0FBSXBDLEFBQUksYUFBQyxBQUFPLFVBQUcsQUFBRSxBQUFDO0FBQ2xCLEFBQUksYUFBQyxBQUFVLGFBQUcsQUFBRSxBQUFDLEFBQ3RCO0FBQUM7QUFFRCwrQkFBd0IsMkJBQXhCLFVBQXlCLEFBQWdCLGtCQUFFLEFBQXFCO0FBRS9ELEFBQUksYUFBQyxBQUFZLGVBQUcsQUFBSSxLQUFDLEFBQW1DLG9DQUFDLEFBQWdCLEFBQUMsQUFBQztBQUMvRSxBQUFJLGFBQUMsQUFBaUIsb0JBQUcsQUFBSSxLQUFDLEFBQW1DLG9DQUFDLEFBQXFCLEFBQUMsQUFBQztBQUV6RixBQUFJLGFBQUMsQUFBcUIsQUFBRSxBQUFDO0FBQzdCLEFBQWlDLEFBQ2xDO0FBQUM7QUFFTywrQkFBbUMsc0NBQTNDLFVBQTRDLEFBQWtCO0FBRTdELFlBQUksQUFBUSxXQUFHLEFBQUksQUFBUSx1QkFBQyxBQUFZLEFBQUMsQUFBQztBQUUxQyxBQUFHLGFBQW1CLFNBQW9CLEdBQXBCLEtBQUEsQUFBWSxhQUFDLEFBQU8sU0FBcEIsUUFBb0IsUUFBcEIsQUFBb0I7QUFBdEMsZ0JBQUksQUFBVSxnQkFBQTtBQUVqQixnQkFBSSxBQUFNLFNBQUcsQUFBSSxBQUFNLG1CQUFDLEFBQVUsQUFBQyxBQUFDO0FBQ3BDLEFBQU0sbUJBQUMsQUFBTyxVQUFHLEFBQVksYUFBQyxBQUFFLEFBQUM7QUFDakMsQUFBTSxtQkFBQyxBQUFLLFFBQUcsQUFBUSxTQUFDLEFBQUssQUFBQztBQUU5QixBQUFFLEFBQUMsZ0JBQUMsQUFBUSxTQUFDLEFBQUssU0FBSSxBQUFDLEFBQUMsR0FBQyxBQUFNLE9BQUMsQUFBVyxjQUFHLEFBQUssQUFBQyxBQUNwRCxBQUFJLFdBQUMsQUFBRSxBQUFDLElBQUMsQUFBUSxTQUFDLEFBQUssU0FBSSxDQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU0sT0FBQyxBQUFXLGNBQUcsQUFBVyxBQUFDLEFBQ2hFLEFBQUksaUJBQUMsQUFBTSxPQUFDLEFBQVcsY0FBRyxBQUFRLFNBQUMsQUFBVyxBQUFDO0FBRS9DLEFBQUcsaUJBQXdCLFNBQXdCLEdBQXhCLEtBQUEsQUFBVSxXQUFDLEFBQWEsZUFBeEIsUUFBd0IsUUFBeEIsQUFBd0I7QUFBL0Msb0JBQUksQUFBZSxxQkFBQTtBQUV0QixBQUFFLEFBQUMsb0JBQUMsQUFBUSxTQUFDLEFBQUssU0FBSSxBQUFDLEFBQUMsR0FBQyxBQUFlLGdCQUFDLEFBQVcsY0FBRyxBQUFNLE9BQUMsQUFBRSxBQUFDLEFBQ2pFLEFBQUksUUFBQyxBQUFlLGdCQUFDLEFBQVcsY0FBRyxBQUFNLE9BQUMsQUFBVyxBQUFDO0FBRXRELG9CQUFJLEFBQVcsY0FBRyxBQUFJLEtBQUMsQUFBbUMsb0NBQUMsQUFBZSxBQUFDLEFBQUM7QUFDNUUsQUFBVyw0QkFBQyxBQUFPLFVBQUcsQUFBTSxPQUFDLEFBQUUsQUFBQztBQUVoQyxBQUFNLHVCQUFDLEFBQVcsWUFBQyxBQUFXLEFBQUMsQUFBQztBQUNoQztBQUVELEFBQVEscUJBQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDO0FBQzNCLEFBQUksaUJBQUMsQUFBTyxRQUFDLEFBQUksS0FBQyxBQUFNLEFBQUMsQUFBQztBQUMxQjtBQUVELEFBQUksYUFBQyxBQUFVLFdBQUMsQUFBSSxLQUFDLEFBQVEsQUFBQyxBQUFDO0FBRS9CLEFBQU0sZUFBQyxBQUFRLEFBQUMsQUFDakI7QUFBQztBQUVELCtCQUFxQix3QkFBckI7QUFFQyxBQUFJLGFBQUMsQUFBb0IsdUJBQUcsQUFBRSxBQUFDO0FBQy9CLFlBQUksQUFBWSxBQUFDO0FBQ2pCLEFBQUcsYUFBVyxTQUErQixHQUEvQixLQUFBLEFBQUksS0FBQyxBQUFpQixrQkFBQyxBQUFRLFVBQS9CLFFBQStCLFFBQS9CLEFBQStCO0FBQXpDLEFBQU0sd0JBQUE7QUFFVCxBQUFFLEFBQUMsZ0JBQUMsQUFBTSxPQUFDLEFBQVMsQUFBQyxXQUFDLEFBQUksS0FBQyxBQUFvQixxQkFBQyxBQUFJLEtBQUUsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFXLEFBQUUsQUFBQyxBQUFDO0FBQ2pGO0FBQ0QsQUFBbUUsQUFDcEU7QUFBQztBQUVELCtCQUFjLGlCQUFkO0FBRUMsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBTyxBQUFDLEFBQ2xDO0FBQUM7QUFFRCwrQkFBaUIsb0JBQWpCO0FBRUMsQUFBTSxlQUFDLEFBQUcsSUFBQyxBQUFVLGNBQUksQUFBSyxRQUFHLEFBQUksT0FBRyxBQUFJLEtBQUMsQUFBaUIsa0JBQUMsQUFBRyxJQUFDLEFBQVUsQUFBQyxBQUFDLEFBQ2hGO0FBQUM7QUFFRCwrQkFBbUIsc0JBQW5CLFVBQW9CLEFBQUs7QUFFeEIsQUFBTSxvQkFBTSxBQUFjLEFBQUUsaUJBQUMsQUFBTSxPQUFFLFVBQUMsQUFBZTtBQUFLLG1CQUFBLEFBQU0sT0FBQyxBQUFTLGFBQWhCLEFBQW9CLEFBQUs7QUFBQSxBQUFDLFNBQTdFLEFBQUksRUFBMEUsQUFBSyxBQUFFLEFBQUMsQUFDOUY7QUFBQztBQUVELCtCQUFpQixvQkFBakIsVUFBbUIsQUFBRztBQUVyQixBQUFNLG9CQUFNLEFBQVksYUFBQyxBQUFPLFFBQUMsQUFBTSxPQUFFLFVBQUMsQUFBZTtBQUFLLG1CQUFBLEFBQU0sT0FBQyxBQUFFLE1BQVQsQUFBYSxBQUFHO0FBQUEsQUFBQyxTQUF4RSxBQUFJLEVBQXFFLEFBQUssQUFBRSxBQUFDLEFBQ3pGO0FBQUM7QUFBQSxBQUFDO0FBRUYsK0JBQWUsa0JBQWYsVUFBaUIsQUFBRztBQUVuQixBQUFNLG9CQUFNLEFBQVUsV0FBQyxBQUFNLE9BQUUsVUFBQyxBQUFtQjtBQUFLLG1CQUFBLEFBQVEsU0FBQyxBQUFFLE1BQVgsQUFBZSxBQUFHO0FBQUEsQUFBQyxTQUFwRSxBQUFJLEVBQWlFLEFBQUssQUFBRSxBQUFDLEFBQ3JGO0FBQUM7QUFBQSxBQUFDO0FBRUYsK0JBQWEsZ0JBQWIsVUFBZSxBQUFHO0FBRWpCLEFBQU0sb0JBQU0sQUFBTyxRQUFDLEFBQU0sT0FBRSxVQUFDLEFBQWU7QUFBSyxtQkFBQSxBQUFNLE9BQUMsQUFBRSxNQUFULEFBQWEsQUFBRztBQUFBLEFBQUMsU0FBM0QsQUFBSSxFQUF3RCxBQUFLLEFBQUUsQUFBQyxBQUM1RTtBQUFDO0FBQUEsQUFBQztBQUNILFdBQUEsQUFBQztBQW5HRCxBQW1HQzs7Ozs7Ozs7O0FDaEhEO0FBT0U7QUFMRCxhQUFxQix3QkFBRyxBQUFJLEFBQUM7QUFNM0IsQUFBTSxlQUFDLEFBQVMsWUFBRyxBQUluQixBQUFDLEFBRUY7QUFBQztBQUVGLCtCQUFLLFFBQUw7QUFFQyxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQUksS0FBQyxBQUFjLEFBQUMsZ0JBQUMsQUFBTSxBQUFDO0FBRWpDLEFBQUksYUFBQyxBQUFVLEFBQUUsQUFBQztBQUNsQixBQUE4QjtBQUM5QixBQUFJLGFBQUMsQUFBa0IsQUFBRSxBQUFDO0FBRTFCLEFBQUcsWUFBQyxBQUFTLFVBQUMsQUFBRyxBQUFFLEFBQUM7QUFFcEIsQUFBSSxhQUFDLEFBQWMsaUJBQUcsQUFBSSxBQUFDLEFBQzVCO0FBQUM7QUFBQSxBQUFDO0FBRUYsK0JBQVUsYUFBVjtBQUVDLEFBQU8sZ0JBQUMsQUFBRyxJQUFDLEFBQWdCLEFBQUMsQUFBQztBQUM5QixBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBYyxBQUFDLGdCQUN4QixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFjLGVBQUMsQUFBZSxnQkFBQyxBQUFDLEdBQUMsQUFBQyxBQUFDLEFBQUM7QUFDekMsQUFBRyxnQkFBQyxBQUFHLEFBQUUsTUFBQyxBQUFhLGNBQUMsQUFBSSxLQUFDLEFBQWMsQUFBQyxBQUFDLEFBQzlDO0FBQUMsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUVGLCtCQUFjLGlCQUFkLFVBQWUsQUFBaUIsUUFBRSxBQUFpQjtBQUFuRCxvQkF5REM7QUF2REEsQUFBSSxhQUFDLEFBQUssQUFBRSxBQUFDO0FBRWIsWUFBSSxBQUFTLFlBQUcsQ0FDWixBQUFNLFFBQ04sQUFBTyxRQUFDLEFBQVEsQUFDbkIsQUFBQztBQUVGLEFBQTRDO0FBRTVDLEFBQUksYUFBQyxBQUFjLG1CQUFLLEFBQU8sUUFBQyxBQUFPO0FBQ3RDLEFBQUksb0JBQUksQUFBTyxRQUFDLEFBQUksS0FDbkIsQUFBUztBQUVSLEFBQWtDO0FBQ2xDLEFBQVksOEJBQUUsc0JBQVMsQUFBQyxHQUFFLEFBQUU7QUFBSSxBQUFNLDJCQUFDLEFBQUksQUFBQyxBQUFDO0FBQUM7QUFDOUMsQUFBa0Isb0NBQUUsQUFBSztBQUN6QixBQUFnQixrQ0FBRSxBQUFLLEFBQ3ZCLEFBQ0Q7QUFOQSxhQUZLLEFBQUM7QUFTUCxBQUFRLHNCQUFFLEFBQUk7QUFDZCxBQUFrQixnQ0FBRSxBQUFLO0FBQ3pCLEFBQWdCLDhCQUFFLEFBQUs7QUFDdkIsQUFBYztBQUNiLEFBQU0sd0JBQUUsQ0FDUCxFQUFDLEFBQUssT0FBRSxBQUFPLFNBQUUsQUFBTyxTQUFFLEFBQUksTUFBRSxBQUFNLFFBQUUsQUFBQyxBQUFDLEtBQzFDLEVBQUMsQUFBSyxPQUFFLEFBQU8sU0FBRSxBQUFPLFNBQUUsQUFBRyxLQUFFLEFBQU0sUUFBRSxBQUFDLEFBQUMsS0FDekMsRUFBQyxBQUFLLE9BQUUsQUFBUyxXQUFFLEFBQU8sU0FBRSxBQUFHLEtBQUUsQUFBTSxRQUFFLEFBQUMsQUFBQyxBQUMzQyxBQUNELEFBQ0QsQUFBQztBQVBlO0FBYnVCLFNBQWxCLEFBQUMsRUFvQnBCLEFBQUssTUFBQyxBQUFHLElBQUMsQUFBRyxBQUFFLEFBQUMsQUFBQztBQUVwQixBQUE0RDtBQUM1RCxBQUFtRDtBQUNuRCxBQUFJLGFBQUMsQUFBa0IsbUJBQUMsQUFBTyxBQUFDLEFBQUM7QUFFakMsQUFBSSxhQUFDLEFBQWMsZUFBQyxBQUFFLEdBQUMsQUFBYSxlQUFFLFVBQUMsQUFBRTtBQUV4QyxBQUFJLGtCQUFDLEFBQWtCLG1CQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ2xDO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBYztBQUNkLEFBQUksYUFBQyxBQUFjLGVBQUMsQUFBRSxHQUFDLEFBQWUsaUJBQUUsVUFBUyxBQUFDO0FBRS9DLGdCQUFJLEFBQUMsSUFBRyxBQUFDLEVBQUMsQUFBSyxBQUFDO0FBQ2hCLGdCQUFJLEFBQUksT0FBRyxBQUFDLEVBQUMsQUFBTyxRQUFDLEFBQUksS0FBQyxBQUFDLEFBQUMsQUFBQztBQUM3QixnQkFBSSxBQUFNLFNBQUcsQUFBSSxLQUFDLEFBQVMsQUFBRSxBQUFDO0FBQzlCLEFBQUcsZ0JBQUMsQUFBRyxBQUFFLE1BQUMsQUFBUyxVQUFDLEFBQU0sQUFBQyxBQUFDLEFBQy9CO0FBQUMsQUFBQyxBQUFDO0FBRUgsQUFBSSxhQUFDLEFBQWMsZUFBQyxBQUFFLEdBQUMsQUFBYyxnQkFBRSxVQUFDLEFBQUU7QUFFekMsQUFBQyxjQUFDLEFBQXdCLEFBQUMsMEJBQUMsQUFBUyxBQUFFLEFBQUM7QUFDeEMsQUFBSSxrQkFBQyxBQUFLLEFBQUUsQUFBQyxBQUNkO0FBQUMsQUFBQyxBQUFDLEFBRUo7QUFBQztBQUFBLEFBQUM7QUFFRiwrQkFBa0IscUJBQWxCO0FBRUMsQUFBNkI7QUFDN0IsQUFBK0M7QUFFL0MsQUFBeUM7QUFDekMsQUFBdUU7QUFDdkUsQUFBQyxVQUFDLEFBQWdDLEFBQUMsa0NBQUMsQUFBVyxBQUFFLEFBQUM7QUFDbEQsQUFBQyxVQUFDLEFBQXdCLEFBQUMsQUFBQztBQUM1QixBQUFDLFVBQUMsQUFBYSxBQUFDLGVBQUMsQUFBVyxBQUFFLEFBQUMsQUFDaEM7QUFBQztBQUVELCtCQUFrQixxQkFBbEIsVUFBbUIsQUFBaUI7QUFFbkMsQUFBNkI7QUFDN0IsQUFBNkM7QUFFN0MsQUFBeUM7QUFFekMsQUFBTyxnQkFBQyxBQUFHLElBQUMsQUFBZ0IsQUFBQyxBQUFDO0FBRTlCLEFBQUMsVUFBQyxBQUFnQyxBQUFDLGtDQUFDLEFBQVcsQUFBRSxjQUFDLEFBQVEsU0FBQyxBQUFZLEFBQUMsQUFBQztBQUN6RSxBQUFDLFVBQUMsQUFBd0IsQUFBQywwQkFBQyxBQUFJLEtBQUMsQUFBVyxhQUFDLEFBQU8sUUFBQyxBQUFhLEFBQUMsQUFBQztBQUNwRSxBQUFrRTtBQUVsRSxBQUFDLFVBQUMsQUFBNEIsQUFBQyw4QkFBQyxBQUFTLFVBQUMsQUFBeUIsQUFBQyxBQUFDLEFBSXRFO0FBQUM7QUFFRCwrQkFBb0IsdUJBQXBCO0FBRUMsQUFBRSxBQUFDLFlBQUMsQUFBSSxLQUFDLEFBQXFCLDBCQUFLLEFBQUksQUFBQyxNQUN4QyxBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFxQixzQkFBQyxBQUFVLFdBQUMsQUFBSyxBQUFDLEFBQUM7QUFDN0MsQUFBSSxpQkFBQyxBQUFxQixzQkFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDLEFBQUM7QUFDeEMsQUFBSSxpQkFBQyxBQUFxQix3QkFBRyxBQUFJLEFBQUMsQUFDbkM7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBMUlELEFBMElDOzs7Ozs7Ozs7QUNsSkQsQUFRRzs7Ozs7Ozs7O0FBT0g7QUFJQztBQUZBLGFBQWtCLHFCQUFHLEFBQUksQUFBQyxBQUVYO0FBQUM7QUFFaEIsd0NBQVUsYUFBVjtBQUF5QixBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQWtCLEFBQUMsQUFBQztBQUFDO0FBRTFELHdDQUFLLFFBQUwsVUFBTSxBQUFrQixXQUFFLEFBQXFDO0FBQXJDLDZDQUFBO0FBQUEsbUNBQXFDOztBQUU5RCxBQUFPLGdCQUFDLEFBQUcsSUFBQyxBQUFpQyxtQ0FBRSxBQUFvQixBQUFDLEFBQUM7QUFFckUsWUFBSSxBQUFPLFVBQUcsQUFBRyxJQUFDLEFBQVcsWUFBQyxBQUFTLEFBQUMsQUFBQztBQUN6QyxBQUFJLGFBQUMsQUFBa0IscUJBQUcsQUFBTyxBQUFDO0FBRWxDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFrQix1QkFBSyxBQUFJLEFBQUMsTUFDckMsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBa0IsbUJBQUMsQUFBSSxBQUFFLEFBQUM7QUFDL0IsQUFBSSxpQkFBQyxBQUFrQixtQkFBQyxBQUFZLGVBQUcsQUFBSyxBQUFDLEFBQzlDO0FBQUM7QUFFRCxBQUFtRztBQUNuRyxBQUFRO0FBQ1IsQUFBSTtBQUNKLEFBQW1DO0FBQ25DLEFBQUcsWUFBQyxBQUFhLGNBQUMsQUFBb0IsQUFBRSxBQUFDO0FBQ3pDLEFBQU07QUFDTixBQUFHLFlBQUMsQUFBYSxjQUFDLEFBQVcsWUFBQyxBQUFPLEFBQUMsQUFBQztBQUN2QyxBQUFPLGdCQUFDLEFBQVksZUFBRyxBQUFJLEFBQUM7QUFFNUIsQUFBRyxZQUFDLEFBQWdCLGlCQUFDLEFBQVcsWUFBQyxBQUFPLFFBQUMsQUFBRSxBQUFDLEFBQUM7QUFFN0MsQUFBRSxBQUFDLFlBQUMsQUFBb0IsQUFBQyxzQkFDekIsQUFBQztBQUNBLEFBQThDO0FBQzlDLEFBQXdFO0FBQ3hFLEFBQVUsdUJBQUU7QUFBTyxBQUFHLG9CQUFDLEFBQVksYUFBQyxBQUFhLGNBQUMsQUFBTyxRQUFDLEFBQVEsVUFBRSxBQUFFLElBQUUsQUFBSyxBQUFDLEFBQUM7QUFBQyxlQUFFLEFBQUcsQUFBQyxBQUFDLEFBQ3hGO0FBQUMsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUVGLHdDQUFHLE1BQUg7QUFHQyxBQUFFLEFBQUMsWUFBQyxBQUFJLEtBQUMsQUFBa0IsdUJBQUssQUFBSSxBQUFDLE1BQUMsQUFBTSxBQUFDO0FBRTdDLEFBQTZIO0FBQzdILEFBQVE7QUFDUixBQUFJO0FBQ0gsQUFBRyxZQUFDLEFBQWEsY0FBQyxBQUFzQix1QkFBQyxBQUFJLE1BQUMsQUFBSSxBQUFDLEFBQUM7QUFDckQsQUFBRztBQUVILEFBQUksYUFBQyxBQUFrQixtQkFBQyxBQUFZLGVBQUcsQUFBSyxBQUFDO0FBRTdDLEFBQUksYUFBQyxBQUFrQixxQkFBRyxBQUFJLEFBQUMsQUFDaEM7QUFBQztBQUFBLEFBQUM7QUFDSCxXQUFBLEFBQUM7QUF2REQsQUF1REM7Ozs7Ozs7Ozs7O0FDNURELEFBQU8sQUFBYSxBQUFTLEFBQUUsQUFBUSxBQUFFLEFBQU0sQUFBZSxBQUFDOztBQUkvRCxBQUFPOztJQUFLLEFBQU8sQUFBTSxBQUFrQixBQUFDOztBQUM1QyxBQUFPLEFBQUUsQUFBSyxBQUFVLEFBQU0sQUFBZ0IsQUFBQzs7QUFDL0MsQUFBTyxBQUFFLEFBQU8sQUFBRSxBQUFNLEFBQTBCLEFBQUM7Ozs7QUFoQm5ELEFBUUc7Ozs7Ozs7OztBQWtCSDtBQVlDO0FBVkEsYUFBaUIsb0JBQUcsQUFBSSxBQUFLLEFBQW1CLEFBQUM7QUFFakQsYUFBYyxpQkFBaUIsQUFBRSxBQUFDO0FBRWxDLEFBQTJCO0FBQzNCLGFBQWdCLG1CQUFpQixBQUFFLEFBQUM7QUFFcEMsYUFBWSxlQUFjLEFBQUUsQUFBQztBQUM3QixhQUFtQixzQkFBYSxBQUFLLEFBQUM7QUFJckMsWUFBSSxBQUFPLFVBQUcsQUFBTyxRQUFDLEFBQVUsV0FBQyxBQUFhLEFBQUMsQUFBQztBQUNoRCxBQUFFLEFBQUMsWUFBQyxBQUFPLFlBQUssQUFBSSxBQUFDLE1BQ3JCLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQVksZUFBRyxBQUFJLEtBQUMsQUFBSyxNQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ3pDO0FBQUMsQUFDRCxBQUFJLGVBQUMsQUFBSSxLQUFDLEFBQVksZUFBRyxBQUFFLEFBQUMsQUFDN0I7QUFBQztBQUVELDZCQUFVLGFBQVY7QUFFQyxBQUFJLGFBQUMsQUFBYyxlQUFDLEFBQUssQUFBQyxTQUFHLEFBQUUsQUFBQztBQUNoQyxBQUFJLGFBQUMsQUFBZ0IsaUJBQUMsQUFBSyxBQUFDLFNBQUcsQUFBRSxBQUFDO0FBQ2xDLEFBQUcsYUFBZSxTQUFtQyxHQUFuQyxLQUFBLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBYyxBQUFFLGtCQUFuQyxRQUFtQyxRQUFuQyxBQUFtQztBQUFqRCxnQkFBSSxBQUFNLFlBQUE7QUFFYixBQUFJLGlCQUFDLEFBQWMsZUFBQyxBQUFNLE9BQUMsQUFBRSxBQUFDLE1BQUcsQUFBRSxBQUFDO0FBQ3BDLEFBQUksaUJBQUMsQUFBZ0IsaUJBQUMsQUFBTSxPQUFDLEFBQUUsQUFBQyxNQUFHLEFBQUUsQUFBQztBQUN0QyxBQUNGO0FBQUM7QUFFRCw2QkFBWSxlQUFaO0FBRUMsQUFBRyxhQUFDLElBQUksQUFBQyxJQUFHLEFBQUMsR0FBRSxBQUFDLElBQUcsQUFBSSxLQUFDLEFBQVksYUFBQyxBQUFNLFFBQUUsQUFBQyxBQUFFLEtBQzlDLEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQVcsWUFBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQUMsQUFBQyxJQUFFLEFBQUssQUFBQyxBQUFDLEFBQy9DO0FBQUMsQUFDSjtBQUFDO0FBQUEsQUFBQztBQUVGLDZCQUFlLGtCQUFmLFVBQWlCLEFBQVcsYUFBRSxBQUEwQjtBQUExQiw0Q0FBQTtBQUFBLGtDQUEwQjs7QUFFdkQsWUFBSSxBQUFpQixTQUFFLEFBQVcsQUFBQztBQUNuQyxZQUFJLEFBQWdCLG1CQUFHLEFBQUMsQUFBQztBQUN6QixBQUEwRDtBQUMxRCxBQUFHLEFBQUMsYUFBQyxJQUFJLEFBQUMsSUFBRyxBQUFDLEdBQUUsQUFBQyxJQUFHLEFBQVcsWUFBQyxBQUFNLFFBQUUsQUFBQyxBQUFFLEtBQzNDLEFBQUM7QUFDQSxBQUFXLDBCQUFHLEFBQVcsWUFBQyxBQUFDLEFBQUMsR0FBQyxBQUFPLFVBQUcsQUFBVyxZQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU8sVUFBRyxBQUFXLFlBQUMsQUFBQyxBQUFDLEFBQUM7QUFFL0UsQUFBRSxBQUFDLGdCQUFDLENBQUMsQUFBbUIsdUJBQUksQ0FBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQVcsWUFBQyxBQUFFLEFBQUMsQUFBQyxLQUNqRSxBQUFDO0FBQ0EsQUFBTywwQkFBRyxBQUFJLEFBQU8scUJBQUMsQUFBVyxBQUFDLEFBQUM7QUFFbkMsQUFBRyxBQUFDLHFCQUFlLFNBQTBCLEdBQTFCLEtBQUEsQUFBTyxRQUFDLEFBQWtCLG9CQUExQixRQUEwQixRQUExQixBQUEwQjtBQUF4Qyx3QkFBSSxBQUFNLFlBQUE7QUFFZCxBQUFJLHlCQUFDLEFBQWMsZUFBQyxBQUFNLEFBQUMsUUFBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUM7QUFDMUM7QUFDRCxBQUFJLHFCQUFDLEFBQWMsZUFBQyxBQUFLLEFBQUMsT0FBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUM7QUFFekMsQUFBZ0IsQUFBRSxBQUFDLEFBQ3BCO0FBQUMsQUFDRCxBQUFJLG1CQUNKLEFBQUMsQUFFRCxDQUFDLEFBQ0Y7QUFBQztBQUNELEFBQUksYUFBQyxBQUFZLEFBQUUsQUFBQztBQUNwQixBQUFnRTtBQUNoRSxBQUFNLGVBQUMsQUFBZ0IsQUFBQyxBQUN6QjtBQUFDO0FBQUEsQUFBQztBQUVGLDZCQUFXLGNBQVgsVUFBWSxBQUFpQjtBQUU1QixBQUFPLGdCQUFDLEFBQUksQUFBRSxBQUFDO0FBQ2YsQUFBSSxhQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDLEFBQzFDO0FBQUM7QUFFRCw2QkFBVyxjQUFYLFVBQWEsQUFBbUIsWUFBRSxBQUFvQjtBQUFwQixzQ0FBQTtBQUFBLDRCQUFvQjs7QUFFckQsWUFBSSxBQUFPLFVBQUcsQUFBSSxLQUFDLEFBQWMsZUFBQyxBQUFVLEFBQUMsQUFBQztBQUM5QyxBQUFFLEFBQUMsWUFBQyxBQUFPLFlBQUssQUFBSSxBQUFDLE1BQUMsQUFBTyxRQUFDLEFBQVUsYUFBRyxBQUFJLEFBQUMsQUFDaEQsQUFBSSxVQUFDLEFBQU0sQUFBQztBQUVaLEFBQUUsQUFBQyxZQUFDLEFBQWEsQUFBQyxlQUNsQixBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFZLGFBQUMsQUFBSSxLQUFDLEFBQVUsQUFBQyxBQUFDO0FBQ25DLEFBQU8sb0JBQUMsQUFBWSxhQUFDLEFBQWEsZUFBQyxBQUFJLEtBQUMsQUFBUyxVQUFDLEFBQUksS0FBQyxBQUFZLEFBQUMsQUFBQyxBQUFDLEFBQ3ZFO0FBQUMsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUVGLDZCQUFjLGlCQUFkLFVBQWdCLEFBQW1CLFlBQUUsQUFBb0I7QUFBcEIsc0NBQUE7QUFBQSw0QkFBb0I7O0FBRXhELFlBQUksQUFBTyxVQUFHLEFBQUksS0FBQyxBQUFjLGVBQUMsQUFBVSxBQUFDLEFBQUM7QUFDOUMsQUFBRSxBQUFDLFlBQUMsQUFBTyxZQUFLLEFBQUksQUFBQyxNQUFDLEFBQU8sUUFBQyxBQUFVLGFBQUcsQUFBSyxBQUFDO0FBRWpELEFBQUUsQUFBQyxZQUFDLEFBQWEsQUFBQyxlQUNsQixBQUFDO0FBQ0EsZ0JBQUksQUFBSyxRQUFHLEFBQUksS0FBQyxBQUFZLGFBQUMsQUFBTyxRQUFDLEFBQVUsQUFBQyxBQUFDO0FBQ2xELEFBQUUsQUFBQyxnQkFBQyxBQUFLLFFBQUcsQ0FBQyxBQUFDLEFBQUMsR0FBQyxBQUFJLEtBQUMsQUFBWSxhQUFDLEFBQU0sT0FBQyxBQUFLLE9BQUUsQUFBQyxBQUFDLEFBQUM7QUFFbkQsQUFBTyxvQkFBQyxBQUFZLGFBQUMsQUFBYSxlQUFDLEFBQUksS0FBQyxBQUFTLFVBQUMsQUFBSSxLQUFDLEFBQVksQUFBQyxBQUFDLEFBQUMsQUFDdkU7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBRUYsNkJBQW9CLHVCQUFwQjtBQUVDLEFBQW1DO0FBQ25DLFlBQUksQUFBQyxJQUFHLEFBQUksS0FBQyxBQUFtQixBQUFFLHNCQUFDLEFBQU0sQUFBQztBQUMxQyxlQUFNLEFBQUMsQUFBRSxLQUNULEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBQyxBQUFDLEdBQUMsQUFBSSxBQUFFLEFBQUM7QUFDckMsQUFBSSxpQkFBQyxBQUFtQixBQUFFLHNCQUFDLEFBQUMsQUFBQyxHQUFDLEFBQVcsY0FBRyxBQUFLLEFBQUMsQUFDbkQ7QUFBQztBQUNELEFBQUksYUFBQyxBQUF3QixBQUFFLEFBQUMsQUFDakM7QUFBQztBQUVELDZCQUFzQix5QkFBdEI7QUFFQyxBQUFvQztBQUNwQyxZQUFJLEFBQUMsSUFBRyxBQUFJLEtBQUMsQUFBbUIsQUFBRSxzQkFBQyxBQUFNLEFBQUM7QUFDMUMsZUFBTSxBQUFDLEFBQUUsS0FDVCxBQUFDO0FBQ0EsQUFBSSxpQkFBQyxBQUFtQixBQUFFLHNCQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU0sQUFBRSxBQUFDLEFBQ3hDO0FBQUMsQUFDRjtBQUFDO0FBRUQsQUFBb0Q7QUFDcEQsNkJBQXNCLHlCQUF0QixVQUF3QixBQUF5QixvQkFBRSxBQUFvQjtBQUEvQywyQ0FBQTtBQUFBLGlDQUF5Qjs7QUFBRSxxQ0FBQTtBQUFBLDJCQUFvQjs7QUFFdEUsQUFBZ0U7QUFDaEUsQUFBRSxBQUFDLFlBQUUsQ0FBQyxBQUFHLElBQUMsQUFBSyxTQUFJLEFBQVMsZUFBQyxBQUFnQixvQkFBSSxBQUFHLElBQUMsQUFBSyxTQUFJLEFBQVMsZUFBQyxBQUFjLEFBQUUsbUJBQ2xGLEFBQUcsSUFBQyxBQUFJLFFBQUksQUFBUSxjQUFDLEFBQUksQUFBQyxNQUM5QixBQUFNLEFBQUM7QUFFVCxZQUFJLEFBQVEsV0FBZSxBQUFJLEFBQUM7QUFDaEMsQUFBRSxBQUFDLFlBQUMsQUFBa0Isc0JBQUksQUFBSSxLQUFDLEFBQWdCLGlCQUFDLEFBQU0sV0FBSyxBQUFDLEFBQUMsR0FBQyxBQUFRLFdBQUcsQUFBSSxLQUFDLEFBQWlCLEFBQUUsQUFBQyxBQUNsRyxBQUFJLHlCQUFDLEFBQVEsV0FBRyxBQUFJLEtBQUMsQUFBbUIsQUFBRSxBQUFDO0FBRzNDLEFBQW1EO0FBRW5ELFlBQUksQUFBVSxHQUFFLEFBQWlCLEFBQUM7QUFDbEMsWUFBSSxBQUFNLEFBQUM7QUFFVixZQUFJLEFBQVcsY0FBZSxBQUFFLEFBQUM7QUFDakMsWUFBSSxBQUFnQixtQkFBZSxBQUFFLEFBQUM7QUFDdEMsWUFBSSxBQUFlLGtCQUFHLEFBQUssQUFBQztBQUU3QixZQUFJLEFBQVksZUFBRyxBQUFHLElBQUMsQUFBWSxBQUFDO0FBRXBDLEFBQUMsWUFBRyxBQUFRLFNBQUMsQUFBTSxBQUFDO0FBRXBCLEFBQTJGO0FBRTNGLFlBQUksQUFBSyxRQUFHLElBQUksQUFBSSxBQUFFLE9BQUMsQUFBTyxBQUFFLEFBQUM7QUFFakMsZUFBTSxBQUFDLEFBQUUsSUFBQyxBQUEwRCw0REFDcEUsQUFBQztBQUNBLEFBQU8sc0JBQUcsQUFBUSxTQUFDLEFBQUMsQUFBQyxBQUFDO0FBRXRCLEFBQThDO0FBQzlDLGdCQUFJLEFBQWUsa0JBQUksQUFBRyxJQUFDLEFBQUksUUFBSSxBQUFRLGNBQUMsQUFBSSxBQUFDLElBQTNCLElBQStCLEFBQUcsSUFBQyxBQUFZLGFBQUMsQUFBUSxTQUFDLEFBQU8sUUFBQyxBQUFRLEFBQUMsQUFBQztBQUVqRyxBQUFFLEFBQUMsZ0JBQUUsQUFBZSxtQkFBSSxBQUFZLGFBQUMsQUFBeUIsMEJBQUMsQUFBTyxBQUFDLEFBQUMsVUFDeEUsQUFBQztBQUNBLEFBQUUsQUFBQyxvQkFBQyxDQUFDLEFBQU8sUUFBQyxBQUFXLEFBQUMsYUFDekIsQUFBQztBQUNBLEFBQU8sNEJBQUMsQUFBVyxjQUFHLEFBQUksQUFBQztBQUMzQixBQUFJLHlCQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDO0FBQ3pDLEFBQVcsZ0NBQUMsQUFBSSxLQUFDLEFBQU8sQUFBQyxBQUFDO0FBQzFCLEFBQWUsc0NBQUcsQUFBSSxBQUFDLEFBQ3hCO0FBQUMsQUFDRjtBQUFDLEFBQ0QsQUFBSSxtQkFDSixBQUFDO0FBQ0EsQUFBRSxBQUFDLG9CQUFDLEFBQU8sUUFBQyxBQUFXLEFBQUMsYUFDeEIsQUFBQztBQUNBLEFBQU8sNEJBQUMsQUFBVyxjQUFHLEFBQUssQUFBQztBQUM1QixBQUFnQixxQ0FBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUM7QUFDL0IsQUFBZSxzQ0FBRyxBQUFJLEFBQUM7QUFDdkIsd0JBQUksQUFBSyxRQUFHLEFBQUksS0FBQyxBQUFtQixBQUFFLHNCQUFDLEFBQU8sUUFBQyxBQUFPLEFBQUMsQUFBQztBQUN4RCxBQUFFLEFBQUMsd0JBQUMsQUFBSyxRQUFHLENBQUMsQUFBQyxBQUFDLEdBQUMsQUFBSSxLQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBTSxPQUFDLEFBQUssT0FBRSxBQUFDLEFBQUMsQUFBQyxBQUM3RDtBQUFDLEFBQ0Y7QUFBQyxBQUNGO0FBQUM7QUFFRCxBQUE0RDtBQUM1RCxBQUFJO0FBQ0osQUFBMkQ7QUFDM0QsQUFBMEI7QUFDMUIsQUFBYTtBQUNiLEFBQWtJO0FBQ2xJLEFBQUk7QUFDSixBQUFPO0FBQ1AsQUFBSTtBQUNKLEFBQXNGO0FBQ3RGLEFBQUk7QUFHSixZQUFJLEFBQUcsTUFBRyxJQUFJLEFBQUksQUFBRSxPQUFDLEFBQU8sQUFBRSxBQUFDO0FBQy9CLFlBQUksQUFBSSxPQUFHLEFBQUcsTUFBRyxBQUFLLEFBQUM7QUFDdkIsQUFBaUU7QUFFakUsQUFBRSxBQUFDLFlBQUMsQUFBZSxtQkFBSSxBQUFZLEFBQUMsY0FDcEMsQUFBQztBQUNBLEFBQUksaUJBQUMsQUFBaUIsa0JBQUMsQUFBSTtBQUMxQixBQUFpQixtQ0FBRSxBQUFJLEtBQUMsQUFBbUIsQUFBRTtBQUM3QyxBQUFXLDZCQUFHLEFBQVc7QUFDekIsQUFBZ0Isa0NBQUcsQUFBZ0IsQUFDbkMsQUFBQyxBQUFDLEFBQ0o7QUFMNkI7QUFLNUIsQUFHRjtBQUFDO0FBQUEsQUFBQztBQUVGLDZCQUFtQixzQkFBbkI7QUFFQyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQWdCLGlCQUFDLEFBQUcsSUFBQyxBQUFVLEFBQUMsQUFBQyxBQUM5QztBQUFDO0FBQUEsQUFBQztBQUVGLDZCQUFpQixvQkFBakI7QUFFQyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQWMsZUFBQyxBQUFHLElBQUMsQUFBVSxBQUFDLEFBQUMsQUFDNUM7QUFBQztBQUFBLEFBQUM7QUFFTSw2QkFBd0IsMkJBQWhDO0FBRUMsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFnQixpQkFBQyxBQUFHLElBQUMsQUFBVSxBQUFDLGNBQUcsQUFBRSxBQUFDLEFBQ25EO0FBQUM7QUFBQSxBQUFDO0FBRUYsNkJBQVcsY0FBWDtBQUVDLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBYyxlQUFDLEFBQUssQUFBQyxBQUFDLEFBQ25DO0FBQUM7QUFFRCw2QkFBWSxlQUFaO0FBRUMsQUFBTyxnQkFBQyxBQUFHLElBQUMsQUFBYyxBQUFDLEFBQUM7QUFDNUIsQUFBSSxhQUFDLEFBQWMsQUFBRSxBQUFDO0FBQ3RCLEFBQUksYUFBQyxBQUF3QixBQUFFLEFBQUMsQUFDakM7QUFBQztBQUFBLEFBQUM7QUFFRiw2QkFBVSxhQUFWO0FBRUMsWUFBSSxBQUFPLFVBQUcsQUFBRSxBQUFDO0FBQ2pCLFlBQUksQUFBQyxJQUFHLEFBQUksS0FBQyxBQUFnQixpQkFBQyxBQUFNLEFBQUM7QUFDckMsZUFBTSxBQUFDLEFBQUUsS0FDVCxBQUFDO0FBQ0EsQUFBTyxvQkFBQyxBQUFJLEtBQUMsQUFBSSxLQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBQyxBQUFDLEdBQUMsQUFBTSxBQUFDLEFBQUMsQUFDcEQ7QUFBQztBQUNELEFBQU0sZUFBQyxBQUFPLEFBQUMsQUFDaEI7QUFBQztBQUFBLEFBQUM7QUFFRiw2QkFBdUIsMEJBQXZCO0FBRUMsQUFBSSxhQUFDLEFBQW1CLHNCQUFHLEFBQUksQUFBQztBQUNoQyxZQUFJLEFBQUMsSUFBRyxBQUFJLEtBQUMsQUFBbUIsQUFBRSxzQkFBQyxBQUFNLEFBQUM7QUFDMUMsZUFBTSxBQUFDLEFBQUUsS0FDVCxBQUFDO0FBQ0EsQUFBRSxBQUFDLGdCQUFDLEFBQUksS0FBQyxBQUFtQixBQUFFLHNCQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU0sQUFBQyxRQUFDLEFBQUksS0FBQyxBQUFtQixBQUFFLHNCQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU0sT0FBQyxBQUFjLEFBQUUsQUFBQyxBQUNqRztBQUFDLEFBQ0Y7QUFBQztBQUFBLEFBQUM7QUFFRiw2QkFBYyxpQkFBZDtBQUVDLFlBQUksQUFBQyxJQUFHLEFBQUksS0FBQyxBQUFtQixBQUFFLHNCQUFDLEFBQU0sQUFBQztBQUMxQyxlQUFNLEFBQUMsQUFBRSxLQUNULEFBQUM7QUFDQSxBQUFJLGlCQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBQyxBQUFDLEdBQUMsQUFBSSxBQUFFLEFBQUMsQUFDdEM7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBRUYsNkJBQTBCLDZCQUExQjtBQUVDLEFBQUksYUFBQyxBQUFtQixzQkFBRyxBQUFLLEFBQUM7QUFDakMsQUFBQyxVQUFDLEFBQWlCLEFBQUMsbUJBQUMsQUFBVyxZQUFDLEFBQVksQUFBQyxBQUFDO0FBRS9DLFlBQUksQUFBQyxJQUFHLEFBQUksS0FBQyxBQUFtQixBQUFFLHNCQUFDLEFBQU0sQUFBQztBQUMxQyxlQUFNLEFBQUMsQUFBRSxLQUNULEFBQUM7QUFDQSxBQUFFLEFBQUMsZ0JBQUMsQUFBSSxLQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBQyxBQUFDLEdBQUMsQUFBTSxBQUFDLFFBQUMsQUFBSSxLQUFDLEFBQW1CLEFBQUUsc0JBQUMsQUFBQyxBQUFDLEdBQUMsQUFBTSxPQUFDLEFBQWdCLEFBQUUsQUFBQyxBQUNuRztBQUFDLEFBQ0Y7QUFBQztBQUFBLEFBQUM7QUFFRiw2QkFBYyxpQkFBZCxVQUFnQixBQUFTO0FBRXhCLEFBQXdDO0FBQ3hDLEFBQUcsQUFBQyxhQUFDLElBQUksQUFBQyxJQUFHLEFBQUMsR0FBRSxBQUFDLElBQUcsQUFBSSxLQUFDLEFBQVcsQUFBRSxjQUFDLEFBQU0sUUFBRSxBQUFDLEFBQUUsS0FBRSxBQUFDO0FBQ3BELEFBQUUsQUFBQyxnQkFBQyxBQUFJLEtBQUMsQUFBVyxBQUFFLGNBQUMsQUFBQyxBQUFDLEdBQUMsQUFBRSxNQUFJLEFBQVMsQUFBQyxXQUFDLEFBQU0sT0FBQyxBQUFJLEtBQUMsQUFBVyxBQUFFLGNBQUMsQUFBQyxBQUFDLEFBQUMsQUFDekU7QUFBQztBQUNELEFBQU0sZUFBQyxBQUFJLEFBQUMsQUFDYjtBQUFDO0FBQUEsQUFBQztBQUNILFdBQUEsQUFBQztBQXJTRCxBQXFTQzs7Ozs7Ozs7Ozs7QUNuVEQsQUFBTyxBQUF1QixBQUEwQixBQUFFLEFBQTBCLEFBQUUsQUFBTSxBQUF1QixBQUFDOztBQVFwSDtBQUlDO0FBRkEsYUFBaUIsb0JBQWEsQUFBSyxBQUFDLEFBRXBCO0FBQUM7QUFFakIsMkJBQWdCLG1CQUFoQixVQUFpQixBQUFjO0FBRTlCLEFBQUksYUFBQyxBQUFpQixvQkFBRyxBQUFJLEFBQUMsQUFDL0I7QUFBQztBQUFBLEFBQUM7QUFFRiwyQkFBeUIsNEJBQXpCLFVBQTJCLEFBQWlCO0FBRTNDLEFBQUUsQUFBQyxZQUFDLEFBQUksS0FBQyxBQUFpQixBQUFDLG1CQUFDLEFBQU0sT0FBQyxBQUFPLFFBQUMsQUFBVSxBQUFDO0FBRXRELEFBQUUsQUFBQyxZQUFDLEFBQUcsSUFBQyxBQUFVLGNBQUksQUFBSyxBQUFDLE9BQzVCLEFBQUM7QUFDQSxnQkFBSSxBQUFjLGlCQUFHLEFBQU8sUUFBQyxBQUEwQiwyQkFBRSxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQVksYUFBQyxBQUFFLEFBQUMsQUFBQztBQUM3RixnQkFBSSxBQUFjLG1CQUFHLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBWSxhQUFDLEFBQWMsQUFBQztBQUVwRSxBQUFzRjtBQUN0RixBQUE0RTtBQUU1RSxnQkFBSSxBQUFNLHdCQUFrQixBQUFJLEtBQUMsVUFBQSxBQUFXO0FBQUksdUJBQUEsQUFBYyxpQkFBQyxBQUFPLFFBQUMsQUFBVyxZQUFDLEFBQU0sQUFBQyxVQUFHLENBQTdDLEFBQThDLEFBQUM7QUFBQSxBQUFDLEFBQUMsYUFBcEYsQUFBYztBQUMzQixBQUFnQztBQUNoQyxBQUFNLG1CQUFDLEFBQU0sQUFBRSxBQUNoQjtBQUFDLEFBQ0QsQUFBSSxlQUNKLEFBQUM7QUFDQSxnQkFBSSxBQUFVLGFBQUcsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFpQixBQUFFLEFBQUM7QUFDeEQsZ0JBQUksQUFBZ0IsbUJBQUcsQUFBSSxLQUFDLEFBQTBCLDJCQUFDLEFBQVUsWUFBRSxBQUFPLEFBQUMsQUFBQztBQUU1RSxBQUFFLEFBQUMsZ0JBQUMsQUFBZ0Isb0JBQUksQUFBTyxRQUFDLEFBQVMsQUFBQyxXQUMxQyxBQUFDO0FBQ0EsQUFBZ0IsMkNBQVcsQUFBYSxjQUFDLEFBQUksS0FBRSxVQUFDLEFBQVM7QUFBSywyQkFBQSxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQW9CLHFCQUFDLEFBQU8sUUFBQyxBQUFHLEFBQUMsT0FBRyxDQUF2RCxBQUF3RCxBQUFDO0FBQUEsQUFBQyxBQUFDLEFBQzFILGlCQURvQixBQUFPO0FBQzFCO0FBRUQsQUFBTSxtQkFBQyxBQUFnQixBQUFDLEFBQ3pCO0FBQUMsQUFDRjtBQUFDO0FBRU8sMkJBQTBCLDZCQUFsQyxVQUFtQyxBQUFlLFFBQUUsQUFBaUI7QUFBckUsb0JBc0NDO0FBcENBLFlBQUksQUFBSyxRQUFHLEFBQUUsQUFBQztBQUNmLEFBQUcsYUFBQyxJQUFJLEFBQUMsSUFBRyxBQUFDLEdBQUUsQUFBQyxJQUFHLEFBQU0sT0FBQyxBQUFLLE9BQUUsQUFBQyxBQUFFO0FBQUUsQUFBSyxxQkFBRyxBQUFJLEFBQUM7U0FFbkQsSUFBSSxBQUFHLE1BQUcsQUFBSyxBQUFDO0FBRWhCLEFBQUUsQUFBQyxZQUFDLEFBQUcsQUFBQyxLQUFDLEFBQU8sUUFBQyxBQUFHLElBQUMsQUFBSyxRQUFHLEFBQW1CLHFCQUFFLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQztBQUUvRCxZQUFJLEFBQU0sQUFBQztBQUNYLEFBQUUsQUFBQyxZQUFDLEFBQU0sT0FBQyxBQUFhLGNBQUMsQUFBTSxVQUFJLEFBQUMsS0FBSSxBQUFNLE9BQUMsQUFBVSxBQUFDLFlBQzFELEFBQUM7QUFDQSxBQUFFLEFBQUMsZ0JBQUMsQUFBRyxBQUFDLEtBQUMsQUFBTyxRQUFDLEFBQUcsSUFBQyxBQUFLLFFBQUcsQUFBbUIsQUFBQyxBQUFDO0FBQ2xELEFBQU0scUJBQUcsQUFBTSxPQUFDLEFBQVMsQUFBQyxBQUMzQjtBQUFDLEFBQ0QsQUFBSSxlQUNKLEFBQUM7QUFDQSxBQUFNLDRCQUFVLEFBQWEsY0FBQyxBQUFLLE1BQUUsVUFBQyxBQUFRO0FBRTdDLEFBQUUsQUFBQyxvQkFBQyxBQUFHLEFBQUMsS0FBQyxBQUFPLFFBQUMsQUFBRyxJQUFDLEFBQUksT0FBRyxBQUFLLFFBQUcsQUFBVSxZQUFFLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQztBQUUvRCxvQkFBSSxBQUFjLGlCQUFHLEFBQVEsU0FBQyxBQUFjLEFBQUM7QUFDN0Msb0JBQUksQUFBYyxpQkFBRyxBQUFPLFFBQUMsQUFBMEIsMkJBQUMsQUFBUSxTQUFDLEFBQUUsQUFBQyxBQUFDO0FBRXJFLG9CQUFJLEFBQW9DLHNEQUFrQixBQUFJLEtBQUMsVUFBQSxBQUFXO0FBQUksMkJBQUEsQUFBYyxlQUFDLEFBQU8sUUFBQyxBQUFXLFlBQUMsQUFBTSxBQUFDLFVBQUcsQ0FBN0MsQUFBOEMsQUFBQztBQUFBLEFBQUMsQUFBQyxpQkFBcEYsQUFBYztBQUV6RCxBQUFFLEFBQUMsb0JBQUMsQUFBRyxBQUFDLEtBQUMsQUFBTyxRQUFDLEFBQUcsSUFBQyxBQUFJLE9BQUcsQUFBSyxRQUFHLEFBQXNDLHdDQUFFLEFBQW9DLEFBQUMsQUFBQztBQUNsSCxBQUFFLEFBQUMsb0JBQUMsQUFBb0MsQUFBQyxzQ0FDeEMsQUFBTSxPQUFDLEFBQUksQUFBQyxBQUNiLEFBQUksVUFDSixBQUFDO0FBQ0EsQUFBRSxBQUFDLHdCQUFDLEFBQUcsQUFBQyxLQUFDLEFBQU8sUUFBQyxBQUFHLElBQUMsQUFBSSxPQUFHLEFBQUssUUFBRyxBQUE2QiwrQkFBRSxBQUFRLFNBQUMsQUFBSSxBQUFDLEFBQUM7QUFDbEYsQUFBTSwwQ0FBZ0IsQUFBSSxLQUFFLFVBQUMsQUFBVztBQUFLLCtCQUFBLEFBQUksTUFBQyxBQUEwQiwyQkFBQyxBQUFXLFlBQUMsQUFBTSxRQUFsRCxBQUFvRCxBQUFPLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDNUcscUJBRFEsQUFBYztBQUNyQixBQUNGO0FBQUMsQUFBQyxBQUFDLEFBQ0osYUFsQlUsQUFBTTtBQWtCZjtBQUNELEFBQUUsQUFBQyxZQUFDLEFBQUcsQUFBQyxLQUFDLEFBQU8sUUFBQyxBQUFHLElBQUMsQUFBSyxRQUFHLEFBQVMsV0FBRSxBQUFNLEFBQUMsQUFBQztBQUNoRCxBQUFNLGVBQUMsQUFBTSxBQUFDLEFBQ2Y7QUFBQztBQUVELDJCQUFxQix3QkFBckIsVUFBc0IsQUFBZTtBQUVwQyxZQUFJLEFBQU8sVUFBRyxBQUFNLE9BQUMsQUFBSyxNQUFDLEFBQUcsQUFBQyxBQUFDO0FBQ2hDLFlBQUksQUFBYyxpQkFBRyxBQUFPLFFBQUMsQUFBQyxBQUFDLEFBQUM7QUFFaEMsWUFBSSxBQUFZLGVBQUcsQUFBYyxrQkFBSSxBQUFLLFFBQUcsQUFBSyxRQUFHLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBbUIsb0JBQUMsQUFBYyxBQUFDLGdCQUFDLEFBQUUsQUFBQztBQUMvRyxBQUFHLFlBQUMsQUFBc0IsdUJBQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBRXZELFlBQUksQUFBc0IsQUFBQztBQUMzQixZQUFJLEFBQW9CLEFBQUM7QUFFekIsQUFBRSxBQUFDLFlBQUUsQUFBTyxRQUFDLEFBQU0sVUFBSSxBQUFDLEFBQUMsR0FDekIsQUFBQztBQUNBLEFBQWEsNEJBQUcsQUFBTyxRQUFDLEFBQUMsQUFBQyxBQUFDO0FBRTNCLEFBQUUsQUFBQyxnQkFBQyxBQUFhLGNBQUMsQUFBQyxBQUFDLE1BQUksQUFBRyxBQUFDLEtBQUMsQUFBVSxhQUFHLEFBQUssQUFBQyxBQUNoRCxBQUFJLFdBQUMsQUFBVSxhQUFHLEFBQUksQUFBQztBQUV2QixBQUFhLDRCQUFHLEFBQWEsY0FBQyxBQUFTLFVBQUMsQUFBQyxBQUFDLEFBQUMsQUFDNUM7QUFBQyxBQUNELEFBQUksZUFBQyxBQUFFLEFBQUMsSUFBRSxBQUFPLFFBQUMsQUFBTSxTQUFHLEFBQUMsQUFBQyxHQUM3QixBQUFDO0FBQ0EsQUFBTyxvQkFBQyxBQUFLLE1BQUMsQUFBd0MsQUFBQyxBQUFDLEFBQ3pEO0FBQUM7QUFFRCxZQUFJLEFBQU8sVUFBRyxBQUEwQix5Q0FBQyxBQUFhLEFBQUMsQUFBQztBQUV4RCxBQUFrQztBQUNsQyxBQUF3QztBQUV4QyxBQUFzRDtBQUN0RCxBQUFFLEFBQUMsWUFBQyxBQUFVLEFBQUMsWUFDZixBQUFDO0FBQ0EsQUFBRSxBQUFDLGdCQUFDLEFBQWMsa0JBQUksQUFBSyxBQUFDLE9BQzNCLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBWSxhQUFDLEFBQU0sT0FBQyxBQUFLLE9BQUUsQUFBSyxBQUFDLEFBQUMsQUFDdEQsQUFBSSxZQUNKLEFBQUM7QUFDQSxBQUFHLEFBQUMscUJBQVksU0FBb0UsR0FBcEUsS0FBQSxBQUFHLElBQUMsQUFBYyxlQUFDLEFBQW1CLG9CQUFDLEFBQWMsQUFBQyxnQkFBQyxBQUFhLGVBQXBFLFFBQW9FLFFBQXBFLEFBQW9FO0FBQS9FLHdCQUFJLEFBQUcsU0FBQTtBQUNYLEFBQUcseUJBQWUsU0FBVyxHQUFYLEtBQUEsQUFBRyxJQUFDLEFBQU8sU0FBWCxRQUFXLFFBQVgsQUFBVztBQUF6Qiw0QkFBSSxBQUFNLFlBQUE7QUFBaUIsQUFBTSwrQkFBQyxBQUFNLE9BQUMsQUFBSyxPQUFFLEFBQUssQUFBQyxBQUFDO0FBQUE7QUFBQSxBQUM3RDtBQUFDO0FBRUQsQUFBRyxnQkFBQyxBQUFjLGVBQUMsQUFBaUIsa0JBQUMsQUFBTSxPQUFDLEFBQUssT0FBRSxBQUFLLEFBQUMsQUFBQyxBQUMzRDtBQUFDO0FBRUQsQUFBRyxhQUFpQixTQUFPLEdBQVAsWUFBTyxTQUFQLGVBQU8sUUFBUCxBQUFPO0FBQXZCLGdCQUFJLEFBQVEscUJBQUE7QUFFZixnQkFBSSxBQUFNLFNBQUcsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFhLGNBQUMsQUFBUSxBQUFDLEFBQUM7QUFDeEQsQUFBRSxBQUFDLGdCQUFDLENBQUMsQUFBTSxBQUFDLFFBQUMsQUFBTyxRQUFDLEFBQUcsSUFBQyxBQUEyQiw4QkFBRyxBQUFRLEFBQUMsQUFBQyxBQUNqRSxBQUFJLGVBQUMsQUFBTSxPQUFDLEFBQU0sT0FBQyxBQUFVLFlBQUUsQUFBSyxBQUFDLEFBQUM7QUFDdEM7QUFFRCxBQUFFLEFBQUMsWUFBQyxBQUFjLGtCQUFJLEFBQUssQUFBQyxPQUFDLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBWSxhQUFDLEFBQVcsQUFBRSxBQUFDLEFBQzNFLEFBQUksbUJBQUMsQUFBRyxJQUFDLEFBQWMsZUFBQyxBQUFtQixvQkFBQyxBQUFjLEFBQUMsZ0JBQUMsQUFBdUIsQUFBRSxBQUFDO0FBRXRGLEFBQUcsWUFBQyxBQUFhLGNBQUMsQUFBc0IsdUJBQUMsQUFBSSxBQUFDLEFBQUM7QUFDL0MsQUFBc0MsQUFFdkM7QUFBQztBQUVELDJCQUFrQixxQkFBbEI7QUFFQyxZQUFJLEFBQVksZUFBRyxBQUFHLElBQUMsQUFBVSxBQUFDO0FBRWxDLFlBQUksQUFBYyxBQUFDO0FBQ25CLFlBQUksQUFBaUIsbUJBQUUsQUFBbUIsQUFBQztBQUUzQyxBQUFFLEFBQUMsWUFBQyxBQUFZLGdCQUFJLEFBQUssQUFBQyxPQUMxQixBQUFDO0FBQ0EsQUFBYyw2QkFBRyxBQUFLLEFBQUM7QUFDdkIsQUFBaUIsb0NBQU8sQUFBYyxlQUFDLEFBQVksYUFBQyxBQUFjLGVBQUMsQUFBRyxJQUFFLFVBQUMsQUFBTTtBQUFLLHVCQUFBLEFBQU0sT0FBTixBQUFPLEFBQUU7QUFBQSxBQUFDLEFBQUMsYUFBM0UsQUFBRztBQUN2QixBQUFtQixzQ0FBTyxBQUFjLGVBQUMsQUFBWSxhQUFDLEFBQWUsZ0JBQUMsQUFBRyxJQUFFLFVBQUMsQUFBTTtBQUFLLHVCQUFBLEFBQU0sT0FBTixBQUFPLEFBQUU7QUFBQSxBQUFDLEFBQUMsQUFDbkcsYUFEdUIsQUFBRztBQUN6QixBQUNELEFBQUksZUFDSixBQUFDO0FBQ0EsZ0JBQUksQUFBVSxhQUFHLEFBQUcsSUFBQyxBQUFjLGVBQUMsQUFBaUIsa0JBQUMsQUFBWSxBQUFDLEFBQUM7QUFDcEUsQUFBYyw2QkFBRyxBQUFVLFdBQUMsQUFBUyxBQUFDO0FBRXRDLGdCQUFJLEFBQVUsYUFBRyxBQUFVLFdBQUMsQUFBa0IsQUFBQztBQUUvQyxBQUFpQiwyQ0FBYyxBQUFNLE9BQUUsVUFBQyxBQUFNO0FBQUssdUJBQUEsQUFBTSxPQUFOLEFBQU8sQUFBUztBQUFBLEFBQUUsYUFBakQsQUFBVSxFQUF3QyxBQUFHLElBQUUsVUFBQyxBQUFNO0FBQUssdUJBQUEsQUFBTSxPQUFOLEFBQU8sQUFBRTtBQUFBLEFBQUMsQUFBQztBQUNsRyxBQUFtQiw2Q0FBYyxBQUFNLE9BQUUsVUFBQyxBQUFNO0FBQUssdUJBQUEsQUFBTSxPQUFOLEFBQU8sQUFBVTtBQUFBLEFBQUUsYUFBbEQsQUFBVSxFQUF5QyxBQUFHLElBQUUsVUFBQyxBQUFNO0FBQUssdUJBQUEsQUFBTSxPQUFOLEFBQU8sQUFBRTtBQUFBLEFBQUMsQUFBQztBQUVyRyxBQUFFLEFBQUMsZ0JBQUMsQUFBVSxXQUFDLEFBQWEsQUFBQyxlQUM3QixBQUFDO0FBQ0EsQUFBaUIsc0RBQXFCLEFBQU0sV0FBSyxBQUFjLGVBQUMsQUFBaUIsa0JBQUMsQUFBYyxlQUFDLEFBQUcsSUFBRSxVQUFDLEFBQU07QUFBSywyQkFBQSxBQUFNLE9BQU4sQUFBTyxBQUFFO0FBQUEsQUFBQyxBQUFDLEFBQUMsaUJBQWpGLEFBQUcsQ0FBNUIsQUFBaUI7QUFDckMsQUFBbUIsMERBQXVCLEFBQU0sV0FBSyxBQUFjLGVBQUMsQUFBaUIsa0JBQUMsQUFBZSxnQkFBQyxBQUFHLElBQUUsVUFBQyxBQUFNO0FBQUssMkJBQUEsQUFBTSxPQUFOLEFBQU8sQUFBRTtBQUFBLEFBQUMsQUFBQyxBQUFDLEFBQ3BJLGlCQURrRCxBQUFHLENBQTlCLEFBQW1CO0FBQ3pDLEFBQ0Y7QUFBQztBQUVELFlBQUksQUFBZ0IsbUJBQUcsQUFBMEIseUNBQUMsQUFBaUIsQUFBQyxBQUFDO0FBQ3JFLFlBQUksQUFBa0IscUJBQUcsQUFBMEIseUNBQUMsQUFBbUIsQUFBQyxBQUFDO0FBRXpFLFlBQUksQUFBVSxBQUFHLGFBQUMsQUFBZ0IsaUJBQUMsQUFBTSxTQUFHLEFBQWtCLG1CQUFDLEFBQU0sQUFBQyxBQUFDO0FBRXZFLFlBQUksQUFBWSxlQUFHLEFBQVUsYUFBRyxBQUFHLE1BQUcsQUFBRyxBQUFDO0FBRTFDLFlBQUksQUFBYSxnQkFBRyxBQUFVLGFBQUcsQUFBZ0IsbUJBQUcsQUFBa0IsQUFBQztBQUV2RSxBQUFFLEFBQUMsWUFBQyxDQUFDLEFBQVUsY0FBSSxBQUFhLGlCQUFJLEFBQUcsQUFBQyxJQUFDLEFBQU0sT0FBQyxBQUFjLEFBQUM7QUFFL0QsQUFBTSxlQUFDLEFBQWMsaUJBQUcsQUFBRyxNQUFHLEFBQVksZUFBRyxBQUFhLEFBQUMsQUFDNUQ7QUFBQztBQUNGLFdBQUEsQUFBQztBQXZMRCxBQXVMQyxLQTNNRCxBQVFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEgsQUFBTyxBQUFFLEFBQU8sQUFBeUIsQUFBTSxBQUF1QixBQUFDOztBQVl2RSxBQUdFOzs7O0FBQ0Y7QUErQkM7QUE3QkEsYUFBUSxXQUFTLEFBQUksQUFBQztBQUN0QixhQUFrQixxQkFBWSxBQUFFLEFBQUM7QUFDakMsYUFBVyxjQUFxQixBQUFJLEFBQUM7QUFDckMsYUFBZ0IsbUJBQW9CLEFBQUksQUFBQztBQTRCeEMsQUFBSSxhQUFDLEFBQVEsV0FBRyxBQUFVLFdBQUMsQUFBYyxlQUFDLEVBQUUsQUFBVSxZQUFFLEFBQWUsaUJBQUUsQUFBYyxnQkFBRyxBQUFJLEFBQUMsQUFBQyxBQUFDO0FBQ2pHLEFBQW9FLEFBQ3JFO0FBQUM7QUE1QkQsNkJBQVcsY0FBWDtBQUVDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQVcsZUFBSSxDQUFDLEFBQUksS0FBQyxBQUFXLFlBQUMsQUFBQyxBQUFDLEFBQUMsSUFBQyxBQUFNLE9BQUMsQUFBSSxBQUFDO0FBQzNELEFBQU0sZUFBQyxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUksS0FBQyxBQUFXLFlBQUMsQUFBQyxBQUFDLEdBQUMsQUFBYyxBQUFFLEFBQUMsQUFBQyxBQUN2RDtBQUFDO0FBRUQsNkJBQVMsWUFBVDtBQUVDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSSxLQUFDLEFBQWdCLEFBQUMsa0JBQUMsQUFBTSxPQUFDLEFBQUksQUFBQztBQUN4QyxBQUFNLGVBQUMsQUFBSSxLQUFDLEFBQWdCLEFBQUMsQUFDOUI7QUFBQztBQUVPLDZCQUF5Qiw0QkFBakMsVUFBa0MsQUFBcUI7QUFFdEQsWUFBSSxBQUFPLFVBQUcsQUFBQyxFQUFDLEFBQU0sT0FBQyxBQUFTLFVBQUMsQUFBQyxBQUFDLElBQUUsQUFBUyxVQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFDbkQsWUFBSSxBQUFPLFVBQUcsQUFBQyxFQUFDLEFBQU0sT0FBQyxBQUFTLFVBQUMsQUFBQyxBQUFDLElBQUUsQUFBUyxVQUFDLEFBQUMsQUFBQyxBQUFDLEFBQUM7QUFDbkQsQUFBTSxlQUFDLEFBQUMsRUFBQyxBQUFZLGFBQUMsQUFBTyxTQUFFLEFBQU8sQUFBQyxBQUFDLEFBQ3pDO0FBQUM7QUFFRCw2QkFBZSxrQkFBZjtBQUE2QixBQUFNLGVBQUMsQUFBTyxzQkFBQyxBQUFJLEtBQUMsQUFBa0IsQUFBQyxBQUFDLEFBQUM7QUFBQztBQUN2RSw2QkFBa0IscUJBQWxCO0FBQWdDLEFBQU0sZUFBQyxBQUFJLEtBQUMsQUFBa0IsQUFBQyxBQUFDO0FBQUM7QUFFakUsNkJBQWtCLHFCQUFsQixVQUFtQixBQUFpQjtBQUFJLEFBQUksYUFBQyxBQUFrQixxQkFBRyxBQUFRLEFBQUMsQUFBQztBQUFDO0FBUTdFLDZCQUFjLGlCQUFkLFVBQWdCLEFBQU8sU0FBRSxBQUFpQixrQkFBRSxBQUFhO0FBQXpELG9CQTZEQztBQTNEQSxBQUE2QztBQUM3QyxBQUFJLGFBQUMsQUFBa0IscUJBQUcsQUFBTyxBQUFDO0FBRWxDLEFBQWdDO0FBQ2hDLEFBQUUsQUFBQyxZQUFDLEFBQU8sV0FBSSxBQUFFLEFBQUMsSUFDbEIsQUFBQztBQUNBLEFBQU8sb0JBQUMsQUFBRyxJQUFDLEFBQWtCLEFBQUMsQUFBQztBQUNoQyxBQUFJLGlCQUFDLEFBQVcsY0FBRyxBQUFFLEFBQUM7QUFDdEIsQUFBSSxpQkFBQyxBQUFnQixtQkFBRyxBQUFJLEtBQUMsQUFBeUIsMEJBQUMsQ0FBQyxBQUFpQixtQkFBQyxBQUFpQixtQkFBQyxBQUFrQixvQkFBRSxDQUFDLEFBQWlCLEFBQUMsQUFBQyxBQUFDO0FBRXJJLEFBQTZCO0FBQzdCLEFBQVUsdUJBQUU7QUFBUSxBQUFnQixpQ0FBQyxBQUFJLE1BQUMsQUFBVyxBQUFDLEFBQUMsQUFBQztBQUFDLGVBQUUsQUFBRyxBQUFDLEFBQUMsQUFDakU7QUFBQyxBQUNELEFBQUksZUFDSixBQUFDO0FBQ0EsQUFBMkM7QUFDM0MsZ0JBQUksQUFBSSxPQUFHLEFBQUssQUFBQztBQUVqQixBQUFFLEFBQUMsZ0JBQUMsQ0FBQyxBQUFJLEFBQUMsTUFDVixBQUFDO0FBQ0EsQUFBSSxxQkFBQyxBQUFRLFNBQUMsQUFBTyxRQUFFLEFBQU8sU0FBRSxVQUFDLEFBQXlCO0FBRXpELEFBQUUsQUFBQyx3QkFBQyxBQUFPLFlBQUssQUFBSSxBQUFDLE1BQ3JCLEFBQUM7QUFDQSxBQUFJLDhCQUFDLEFBQVcsY0FBRyxBQUFPLEFBQUM7QUFDM0IsQUFBSSw4QkFBQyxBQUFnQixtQkFBRyxBQUFJLE1BQUMsQUFBeUIsMEJBQUMsQUFBSSxNQUFDLEFBQVcsWUFBQyxBQUFDLEFBQUMsR0FBQyxBQUFTLEFBQUUsQUFBQyxBQUFDO0FBRXhGLEFBQUUsQUFBQyw0QkFBQyxBQUFnQixBQUFDLGtCQUFDLEFBQWdCLGlCQUFDLEFBQU8sQUFBQyxBQUFDLEFBQ2pEO0FBQUMsQUFDRCxBQUFJLDJCQUNKLEFBQUM7QUFDQSxBQUFFLEFBQUMsNEJBQUMsQUFBWSxBQUFDLGNBQUMsQUFBWSxBQUFFLEFBQUMsQUFDbEM7QUFBQyxBQUNGO0FBQUMsQUFBQyxBQUFDLEFBQ0o7QUFBQyxBQUNELEFBQUksbUJBQ0osQUFBQztBQUNBLG9CQUFJLEFBQU07QUFDVCxBQUFNLDRCQUFFLENBQUMsQUFBTyxTQUFDLENBQUMsQUFBUSxVQUFDLEFBQVUsWUFBQyxDQUFDLEFBQVMsQUFBQztBQUNqRCxBQUFJLDBCQUFFLEFBQVE7QUFDZCxBQUFnQixzQ0FBRSxBQUFjO0FBQ2hDLEFBQVEsOEJBQUMsQUFBVTtBQUNuQixBQUFTLCtCQUFDLENBQUMsQUFBUztBQUNwQixBQUFXLGlDQUFDLEFBQU87QUFDbkIsQUFBTSw0QkFBQyxBQUFvQjtBQUMzQixBQUFTO0FBQUssQUFBTSwrQkFBQyxBQUFJLEtBQUMsQUFBTSxBQUFDLEFBQUM7QUFBQztBQUNuQyxBQUFjO0FBQUssQUFBTSwrQkFBQyxDQUFDLEFBQUksS0FBQyxBQUFRLFVBQUUsQUFBSSxLQUFDLEFBQVMsQUFBQyxBQUFDLEFBQUM7QUFBQztBQUM1RCxBQUFtQjtBQUFLLEFBQU0sK0JBQUMsQUFBSSxLQUFDLEFBQWdCLEFBQUMsQUFBQztBQUFDLEFBQ3ZEO0FBWFk7QUFhYixvQkFBSSxBQUFPLFVBQUcsQUFBRSxBQUFDO0FBQ2pCLEFBQU8sd0JBQUMsQUFBSSxLQUFDLEFBQU0sQUFBQyxBQUFDO0FBRXJCLEFBQUkscUJBQUMsQUFBVyxjQUFHLEFBQU8sQUFBQztBQUMzQixBQUFJLHFCQUFDLEFBQWdCLG1CQUFHLEFBQUksS0FBQyxBQUF5QiwwQkFBQyxBQUFJLEtBQUMsQUFBVyxZQUFDLEFBQUMsQUFBQyxHQUFDLEFBQVMsQUFBRSxBQUFDLEFBQUM7QUFFeEYsQUFBZ0IsaUNBQUMsQUFBTyxBQUFDLEFBQUMsQUFDM0I7QUFBQyxBQUNGO0FBQUMsQUFDRjtBQUFDO0FBQUEsQUFBQztBQUNILFdBQUEsQUFBQztBQW5HRCxBQW1HQzs7Ozs7Ozs7Ozs7QUM3R0QsQUFBTyxBQUFFLEFBQU8sQUFBRSxBQUFVLEFBQUUsQUFBTSxBQUF1QixBQUFDOztBQUM1RCxBQUFPLEFBQWEsQUFBUyxBQUFFLEFBQVEsQUFBRSxBQUFNLEFBQWUsQUFBQzs7QUFFL0QsQUFBTyxBQUFFLEFBQVEsQUFBRSxBQUFNLEFBQWlDLEFBQUM7O0FBTTNELEFBQUMsRUFBQyxBQUFRLEFBQUMsVUFBQyxBQUFLLE1BQUM7QUFFZixBQUFrQztBQUNsQyxBQUFNLFdBQUMsQUFBVSxhQUFHLFVBQUMsQUFBcUI7QUFFMUMsQUFBc0Q7QUFDdEQsWUFBSSxBQUFZLGVBQWtCLEFBQUssTUFBQyxBQUFLLEFBQUM7QUFDOUMsQUFBa0U7QUFDbEUsQUFBK0M7QUFDL0MsQUFBWSxxQkFBQyxBQUFRLFdBQUcsQUFBQyxFQUFDLEFBQU0sT0FBQyxBQUFJLEFBQVEsQUFBRSxxQkFBRSxBQUFLLE1BQUMsQUFBSyxNQUFDLEFBQVEsQUFBQyxBQUFDO0FBQ3ZFLEFBQUcsWUFBQyxBQUFnQixpQkFBQyxBQUFLLE1BQUMsQUFBSyxPQUFFLEFBQUksQUFBQyxBQUFDLEFBQzFDO0FBQUMsQUFBQyxBQUNIO0FBQUMsQUFBQyxBQUFDLElBaENILEFBUUc7Ozs7Ozs7Ozs7QUEwQkg7QUFBQSw0QkFtQkEsQ0FBQztBQVZBLDJCQUFLLFFBQUwsVUFBTSxBQUFtQjtBQUV4QixBQUFJLGFBQUMsQUFBSSxPQUFHLEFBQWEsY0FBQyxBQUFJLFFBQUksQUFBSyxRQUFHLEFBQVEsY0FBQyxBQUFHLE1BQUcsQUFBUSxjQUFDLEFBQUksQUFBQztBQUN2RSxBQUFJLGFBQUMsQUFBSyxRQUFHLEFBQVEsU0FBQyxBQUFTLGVBQUMsQUFBYSxjQUFDLEFBQUssQUFBQyxBQUFDLEFBQUM7QUFDdEQsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFhLGNBQUMsQUFBTyxBQUFDO0FBQ3JDLEFBQUksYUFBQyxBQUFRLFdBQUcsQUFBSSxBQUFRLEFBQUUsb0JBQUMsQUFBVSxXQUFDLEFBQWEsY0FBQyxBQUFRLEFBQUMsQUFBQztBQUNsRSxBQUFJLGFBQUMsQUFBRSxLQUFHLEFBQWEsY0FBQyxBQUFFLEFBQUM7QUFDM0IsQUFBSSxhQUFDLEFBQU8sVUFBRyxBQUFhLGNBQUMsQUFBTyxBQUFDO0FBQ3JDLEFBQU0sZUFBQyxBQUFJLEFBQUMsQUFDYjtBQUFDO0FBQ0YsV0FBQSxBQUFDO0FBbkJELEFBbUJDOzs7QUFFRDtBQUdDLDZCQUFnQixDQUFDO0FBRWpCLDRCQUFlLGtCQUFmLFVBQWdCLEFBQVE7QUFFdkIsQUFBbUM7QUFDbkMsQUFBRSxBQUFDLFlBQUMsQ0FBQyxBQUFPLFFBQUMsQUFBSyxBQUFDLE9BQUMsQUFBQztBQUFDLEFBQU8sb0JBQUMsQUFBRyxJQUFDLEFBQWlCLEFBQUMsQUFBQztBQUFBLEFBQUksaUJBQUMsQUFBWSxBQUFFLEFBQUM7QUFBQztBQUMxRSxBQUFJLGFBQUMsQUFBYSxjQUFDLEFBQUssT0FBRSxBQUFPLEFBQUMsQUFBQyxBQUNwQztBQUFDO0FBQUEsQUFBQztBQUVGLDRCQUFZLGVBQVosVUFBYSxBQUFRO0FBRXBCLEFBQWdDO0FBRWhDLEFBQUUsQUFBQyxZQUFDLEFBQU8sUUFBQyxBQUFLLFVBQUssQUFBSSxBQUFDLE1BQUMsQUFBSSxLQUFDLEFBQWEsY0FBQyxBQUFLLE9BQUUsQUFBTyxBQUFDLEFBQUMsQUFDL0QsQUFBSSxjQUFDLEFBQUksS0FBQyxBQUFhLGNBQUMsQUFBSSxNQUFFLEFBQU8sQUFBQyxBQUFDLEFBRXhDO0FBQUM7QUFBQSxBQUFDO0FBRU0sNEJBQWEsZ0JBQXJCLFVBQXNCLEFBQW9CLFlBQUUsQUFBZTtBQUUxRCxBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBSSxRQUFJLEFBQVMsQUFBQyxXQUFDLEFBQU0sQUFBQztBQUVsQyxBQUFRLG1CQUFHLEFBQVEsWUFBSSxBQUFFLEFBQUM7QUFDMUIsWUFBSSxBQUFZLGVBQUcsSUFBSSxBQUFZLEFBQUM7QUFDcEMsQUFBWSxxQkFBQyxBQUFJLE9BQUcsQUFBRyxJQUFDLEFBQUksQUFBQztBQUM3QixBQUFZLHFCQUFDLEFBQUssUUFBRyxBQUFHLElBQUMsQUFBSyxBQUFDO0FBQy9CLEFBQVkscUJBQUMsQUFBTyxVQUFHLEFBQUcsSUFBQyxBQUFRLFNBQUMsQUFBZSxBQUFFLEFBQUM7QUFDdEQsQUFBWSxxQkFBQyxBQUFRLFdBQUcsQUFBRyxJQUFDLEFBQVksYUFBQyxBQUFRLEFBQUM7QUFDbEQsQUFBWSxxQkFBQyxBQUFFLEtBQUcsQUFBRyxJQUFDLEFBQWdCLGlCQUFDLEFBQWdCLEFBQUUsc0JBQUksQUFBUSxTQUFDLEFBQUUsQUFBQztBQUN6RSxBQUFZLHFCQUFDLEFBQU8sVUFBRyxBQUFHLElBQUMsQUFBWSxhQUFDLEFBQWtCLEFBQUUsQUFBQztBQUU3RCxBQUFpRTtBQUNqRSxBQUEwRDtBQUUxRCxZQUFJLEFBQUssUUFBRyxBQUFJLEtBQUMsQUFBYSxjQUFDLEFBQVksQUFBQyxBQUFDO0FBRTdDLEFBQUUsQUFBQyxZQUFDLENBQUMsQUFBSyxBQUFDLE9BQUMsQUFBTSxBQUFDO0FBRW5CLEFBQUUsQUFBQyxZQUFDLEFBQVUsQUFBQyxZQUNmLEFBQUM7QUFDQSxBQUFPLG9CQUFDLEFBQVMsVUFBQyxBQUFZLGNBQUUsQUFBRSxJQUFFLEFBQUssQUFBQyxBQUFDLEFBRTVDO0FBQUMsQUFDRCxBQUFJLGVBQ0osQUFBQztBQUNBLEFBQTZDO0FBQzdDLEFBQU8sb0JBQUMsQUFBWSxhQUFDLEFBQVksY0FBRSxBQUFFLElBQUUsQUFBSyxBQUFDLEFBQUMsQUFDL0M7QUFBQyxBQUNGO0FBQUM7QUFBQSxBQUFDO0FBRU0sNEJBQWEsZ0JBQXJCLFVBQXNCLEFBQTJCO0FBRWhELFlBQUksQUFBSyxBQUFDO0FBQ1YsWUFBSSxBQUFJLE9BQUcsQUFBRyxJQUFDLEFBQUksUUFBSSxBQUFRLGNBQUMsQUFBRyxNQUFHLEFBQU8sVUFBRyxBQUFPLEFBQUM7QUFDeEQsWUFBSSxBQUFPLFVBQUcsQUFBWSxhQUFDLEFBQU8sQUFBQztBQUNuQyxZQUFJLEFBQVEsV0FBRyxBQUFZLGFBQUMsQUFBUSxBQUFDO0FBQ3JDLFlBQUksQUFBa0IscUJBQUcsQUFBRSxBQUFDO0FBQzVCLEFBQUUsQUFBQyxZQUFDLEFBQU8sQUFBQyxTQUFDLEFBQWtCLHNCQUFJLEFBQU8sQUFBQztBQUMzQyxBQUE4QjtBQUM5QixBQUE2RDtBQUM3RCxBQUFFLEFBQUMsWUFBQyxBQUFRLEFBQUksYUFBQyxBQUFHLElBQUMsQUFBSSxRQUFJLEFBQVEsY0FBQyxBQUFHLE9BQUksQ0FBQyxBQUFPLEFBQUMsQUFBQyxVQUFDLEFBQWtCLHNCQUFJLEFBQVEsU0FBQyxBQUFRLEFBQUUsQUFBQztBQUVsRyxBQUF5QztBQUN6QyxBQUFFLEFBQUMsWUFBQyxBQUFHLElBQUMsQUFBSSxRQUFJLEFBQVEsY0FBQyxBQUFJLEFBQUMsTUFDOUIsQUFBQztBQUNBLEFBQUssb0JBQUcsQUFBTyxRQUFDLEFBQVEsU0FBQyxBQUF5QiwyQkFBRSxFQUFFLEFBQUksTUFBSSxBQUFJLEFBQUUsQUFBQyxBQUFDO0FBQ3RFLEFBQUUsQUFBQyxnQkFBQyxBQUFrQixBQUFDLG9CQUFDLEFBQUssU0FBSSxBQUFHLE1BQUcsQUFBa0IsQUFBQyxBQUMzRDtBQUFDLEFBQ0QsQUFBSSxlQUNKLEFBQUM7QUFDQSxBQUFNLEFBQUMsb0JBQUMsQUFBRyxJQUFDLEFBQUssQUFBQyxBQUNsQixBQUFDO0FBQ0EscUJBQUssQUFBUyxlQUFDLEFBQU07QUFDcEIsQUFBSyw0QkFBRyxBQUFPLFFBQUMsQUFBUSxTQUFDLEFBQXlCLDJCQUFFLEVBQUUsQUFBSSxNQUFJLEFBQUksQUFBRSxBQUFDLEFBQUM7QUFDdEUsQUFBa0U7QUFDbEUsQUFBMEI7QUFDMUIsQUFBRSxBQUFDLHdCQUFDLEFBQWtCLEFBQUMsb0JBQUMsQUFBSyxTQUFJLEFBQUcsTUFBRyxBQUFrQixBQUFDO0FBQzFELEFBQUssQUFBQztBQUVQLHFCQUFLLEFBQVMsZUFBQyxBQUFXLEFBQUM7QUFDM0IscUJBQUssQUFBUyxlQUFDLEFBQWdCLEFBQUM7QUFDaEMscUJBQUssQUFBUyxlQUFDLEFBQWM7QUFDNUIsQUFBRSxBQUFDLHdCQUFDLENBQUMsQUFBWSxhQUFDLEFBQUUsQUFBQyxJQUFDLEFBQU0sQUFBQztBQUM3Qix3QkFBSSxBQUFPLFVBQUcsQUFBRyxJQUFDLEFBQVcsWUFBQyxBQUFZLGFBQUMsQUFBRSxBQUFDLEFBQUM7QUFDL0MsQUFBRSxBQUFDLHdCQUFDLENBQUMsQUFBTyxBQUFDLFNBQUMsQUFBTSxBQUFDO0FBRXJCLEFBQUUsQUFBQyx3QkFBQyxBQUFHLElBQUMsQUFBSyxTQUFJLEFBQVMsZUFBQyxBQUFjLEFBQUMsZ0JBQzFDLEFBQUM7QUFDQSxBQUFLLGdDQUFHLEFBQU8sUUFBQyxBQUFRLFNBQUMsQUFBaUMsbUNBQUUsRUFBRSxBQUFJLE1BQUksQUFBVSx5QkFBQyxBQUFPLHNCQUFDLEFBQU8sUUFBQyxBQUFJLEFBQUMsQUFBQyxRQUFFLEFBQUUsSUFBRyxBQUFPLFFBQUMsQUFBRSxBQUFFLEFBQUMsQUFBQyxBQUM3SDtBQUFDLEFBQ0QsQUFBSSwyQkFDSixBQUFDO0FBQ0EsQUFBSyxnQ0FBRyxBQUFPLFFBQUMsQUFBUSxTQUFDLEFBQThCLGdDQUFFLEVBQUUsQUFBSSxNQUFJLEFBQVUseUJBQUMsQUFBTyxzQkFBQyxBQUFPLFFBQUMsQUFBSSxBQUFDLEFBQUMsUUFBRSxBQUFFLElBQUcsQUFBTyxRQUFDLEFBQUUsQUFBRSxBQUFDLEFBQUMsQUFDMUg7QUFBQztBQUNELEFBQWtFO0FBQ2xFLEFBQTBCO0FBQzFCLEFBQUUsQUFBQyx3QkFBQyxBQUFrQixBQUFDLG9CQUFDLEFBQUssU0FBSSxBQUFHLE1BQUcsQUFBa0IsQUFBQztBQUMxRCxBQUFLLEFBQUMsQUFLUixBQUFDLEFBQ0Y7O0FBQUM7QUFFRCxBQUFFLEFBQUMsWUFBQyxBQUFZLGFBQUMsQUFBTyxBQUFDLFNBQUMsQUFBSyxTQUFJLEFBQU8sVUFBRyxBQUFZLGFBQUMsQUFBTyxBQUFDO0FBSWxFLEFBQTJCO0FBQzNCLEFBQUk7QUFDSixBQUE0QztBQUM1QyxBQUE4QztBQUM5QyxBQUFJO0FBRUosQUFBd0M7QUFFeEMsQUFBTSxlQUFDLEFBQUssQUFBQyxBQUNkO0FBQUM7QUFBQSxBQUFDO0FBQ0gsV0FBQSxBQUFDO0FBMUhELEFBMEhDOzs7Ozs7Ozs7Ozs7QUNqTEQsQUFRRzs7Ozs7Ozs7O0FBUkgsQUFRRyxBQUNILEFBQU07Ozs7Ozs7O3lCQUF1QixBQUFJLE1BQUMsQUFBSztBQUV0QyxRQUFJLEFBQUksT0FBRyxBQUFHLEFBQUM7QUFFZixRQUFJLEFBQUksT0FBRyxJQUFJLEFBQUksQUFBRSxBQUFDO0FBQ3RCLEFBQUksU0FBQyxBQUFPLFFBQUMsQUFBSSxLQUFDLEFBQU8sQUFBRSxBQUFDLFlBQUMsQUFBSSxPQUFDLEFBQUUsS0FBQyxBQUFFLEtBQUMsQUFBRSxLQUFDLEFBQUksQUFBQyxBQUFDLEFBQUM7QUFDbEQsUUFBSSxBQUFPLFVBQUcsQUFBWSxlQUFDLEFBQUksS0FBQyxBQUFXLEFBQUUsQUFBQztBQUU5QyxBQUFRLGFBQUMsQUFBTSxTQUFHLEFBQUksT0FBQyxBQUFHLE1BQUMsQUFBSyxRQUFDLEFBQU8sVUFBQyxBQUFVLEFBQUMsQUFDckQ7QUFBQyxBQUVELEFBQU07b0JBQXFCLEFBQUk7QUFDOUIsUUFBSSxBQUFNLFNBQUcsQUFBSSxPQUFHLEFBQUcsQUFBQztBQUN4QixRQUFJLEFBQUUsS0FBRyxBQUFRLFNBQUMsQUFBTSxPQUFDLEFBQUssTUFBQyxBQUFHLEFBQUMsQUFBQztBQUNwQyxBQUFHLFNBQUMsSUFBSSxBQUFDLElBQUMsQUFBQyxHQUFDLEFBQUMsSUFBRyxBQUFFLEdBQUMsQUFBTSxRQUFDLEFBQUMsQUFBRSxLQUFFLEFBQUM7QUFDL0IsWUFBSSxBQUFDLElBQUcsQUFBRSxHQUFDLEFBQUMsQUFBQyxBQUFDO0FBQ2QsZUFBTyxBQUFDLEVBQUMsQUFBTSxPQUFDLEFBQUMsQUFBQyxNQUFJLEFBQUc7QUFBRSxBQUFDLGdCQUFHLEFBQUMsRUFBQyxBQUFTLFVBQUMsQUFBQyxHQUFDLEFBQUMsRUFBQyxBQUFNLEFBQUMsQUFBQztTQUN2RCxBQUFFLEFBQUMsSUFBQyxBQUFDLEVBQUMsQUFBTyxRQUFDLEFBQU0sQUFBQyxZQUFLLEFBQUMsQUFBQyxHQUFDLEFBQU0sT0FBQyxBQUFDLEVBQUMsQUFBUyxVQUFDLEFBQU0sT0FBQyxBQUFNLFFBQUMsQUFBQyxFQUFDLEFBQU0sQUFBQyxBQUFDLEFBQ3pFO0FBQUM7QUFDRCxBQUFNLFdBQUMsQUFBSSxBQUFDLEFBQ2I7QUFBQyxBQUVELEFBQU07cUJBQXNCLEFBQUk7QUFDL0IsQUFBWSxpQkFBQyxBQUFJLE1BQUMsQUFBRSxBQUFDLEFBQUMsQUFDdkI7QUFBQzs7Ozs7Ozs7QUM1QkQ7QUFBQTtBQUNZLGFBQVEsV0FBNEIsQUFBRSxBQUFDLEFBYW5EO0FBQUM7QUFYVSxvQkFBRSxLQUFULFVBQVUsQUFBNkI7QUFDbkMsQUFBSSxhQUFDLEFBQVEsU0FBQyxBQUFJLEtBQUMsQUFBTyxBQUFDLEFBQUMsQUFDaEM7QUFBQztBQUVNLG9CQUFHLE1BQVYsVUFBVyxBQUE2QjtBQUNwQyxBQUFJLGFBQUMsQUFBUSxnQkFBUSxBQUFRLFNBQUMsQUFBTSxPQUFDLFVBQUEsQUFBQztBQUFJLG1CQUFBLEFBQUMsTUFBRCxBQUFNLEFBQU87QUFBQSxBQUFDLEFBQUMsQUFDN0QsU0FEb0IsQUFBSTtBQUN2QjtBQUVNLG9CQUFJLE9BQVgsVUFBWSxBQUFRO0FBQ2hCLEFBQUksYUFBQyxBQUFRLFNBQUMsQUFBSyxNQUFDLEFBQUMsQUFBQyxHQUFDLEFBQU8sUUFBQyxVQUFBLEFBQUM7QUFBSSxtQkFBQSxBQUFDLEVBQUQsQUFBRSxBQUFJLEFBQUM7QUFBQSxBQUFDLEFBQUMsQUFDakQ7QUFBQztBQUNMLFdBQUEsQUFBQztBQWRELEFBY0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTA4LTMxXG4gKi9cbmRlY2xhcmUgdmFyIFJvdXRpbmcsICQ7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWRpcmVjdFRvRGlyZWN0b3J5KHJvdXRlLCBhZGRyZXNzID0gJCgnI3NlYXJjaC1iYXInKS52YWwoKSwgcmFuZ2UgPSAnJylcbnsgICAgXG4gICAgaWYgKCFyYW5nZSkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBSb3V0aW5nLmdlbmVyYXRlKHJvdXRlLCB7IHNsdWcgOiBzbHVnaWZ5KGFkZHJlc3MpIH0pO1xuICAgIGVsc2Ugd2luZG93LmxvY2F0aW9uLmhyZWYgPSBSb3V0aW5nLmdlbmVyYXRlKHJvdXRlLCB7IHNsdWcgOiBzbHVnaWZ5KGFkZHJlc3MpLCBkaXN0YW5jZSA6IHJhbmdlfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbHVnaWZ5KHRleHQpIDogc3RyaW5nXG57XG4gIGlmICghdGV4dCkgcmV0dXJuICcnO1xuICByZXR1cm4gdGV4dC50b1N0cmluZygpLy8udG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9cXHMrL2csICctJykgICAgICAgICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggLVxuICAgIC5yZXBsYWNlKC9bXlxcd1xcLV0rL2csICcnKSAgICAgICAvLyBSZW1vdmUgYWxsIG5vbi13b3JkIGNoYXJzXG4gICAgLnJlcGxhY2UoL1xcLVxcLSsvZywgJy0nKSAgICAgICAgIC8vIFJlcGxhY2UgbXVsdGlwbGUgLSB3aXRoIHNpbmdsZSAtXG4gICAgLnJlcGxhY2UoL14tKy8sICcnKSAgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XG4gICAgLnJlcGxhY2UoLy0rJC8sICcnKTsgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBlbmQgb2YgdGV4dFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5zbHVnaWZ5KHRleHQgOiBzdHJpbmcpIDogc3RyaW5nXG57XG4gIGlmICghdGV4dCkgcmV0dXJuICcnO1xuICByZXR1cm4gdGV4dC50b1N0cmluZygpLnJlcGxhY2UoL1xcLSsvZywgJyAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUodGV4dClcbntcbiAgICByZXR1cm4gdGV4dC5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpK3RleHQuc3Vic3RyKDEsdGV4dC5sZW5ndGgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRRdWVyeVBhcmFtcyhxcykgXG57XG4gICAgcXMgPSBxcy5zcGxpdChcIitcIikuam9pbihcIiBcIik7XG4gICAgdmFyIHBhcmFtcyA9IHt9LFxuICAgICAgICB0b2tlbnMsXG4gICAgICAgIHJlID0gL1s/Jl0/KFtePV0rKT0oW14mXSopL2c7XG5cbiAgICB3aGlsZSAoKHRva2VucyA9IHJlLmV4ZWMocXMpKSkge1xuICAgICAgICBwYXJhbXNbZGVjb2RlVVJJQ29tcG9uZW50KHRva2Vuc1sxXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHRva2Vuc1syXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXJyYXlOdW1iZXJJbnRvU3RyaW5nKGFycmF5IDogbnVtYmVyW10pIDogc3RyaW5nXG57XG4gICAgbGV0IHJlc3VsdCAgPSAnJztcbiAgICBsZXQgaSA9IDA7XG5cbiAgICBmb3IobGV0IG51bWJlciBvZiBhcnJheSlcbiAgICB7XG4gICAgICAgIGlmIChpICUgMiA9PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQgKz0gcGFyc2VOdW1iZXJUb1N0cmluZyhudW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ICs9IG51bWJlci50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwYXJzZU51bWJlclRvU3RyaW5nKG51bWJlciA6IG51bWJlcikgOiBzdHJpbmdcbnsgICAgXG4gICAgbGV0IGJhc2UyNiA9IG51bWJlci50b1N0cmluZygyNik7XG4gICAgbGV0IGkgPSAwOyBcbiAgICBsZXQgbGVuZ3RoID0gYmFzZTI2Lmxlbmd0aDtcblxuICAgIGxldCByZXN1bHQgPSAnJztcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykgXG4gICAge1xuICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoOTYgKyBwYXJzZUludChiYXNlMjZbaV0sMjYpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwYXJzZVN0cmluZ1RvTnVtYmVyKHN0cmluZyA6IHN0cmluZykgOiBudW1iZXJcbnsgICAgXG4gICAgbGV0IGkgPSAwOyBcbiAgICBsZXQgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICAgIGxldCByZXN1bHQgPSAwO1xuXG4gICAgZm9yIChpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIFxuICAgIHtcbiAgICAgIHJlc3VsdCArPSAoc3RyaW5nLmNoYXJDb2RlQXQoaSkgLSA5NikgKiBNYXRoLnBvdygyNiwgbGVuZ3RoIC0gaSAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVN0cmluZ0ludG9BcnJheU51bWJlcihzdHJpbmcgOiBzdHJpbmcpIDogbnVtYmVyW11cbntcbiAgICBsZXQgcmVzdWx0IDogbnVtYmVyW10gPSBbXTtcblxuICAgIGlmICghc3RyaW5nKSByZXR1cm4gcmVzdWx0O1xuXG4gICAgbGV0IGFycmF5ID0gc3RyaW5nLm1hdGNoKC9bYS16XSt8WzAtOV0rL2cpO1xuXG4gICAgZm9yKGxldCBlbGVtZW50IG9mIGFycmF5KVxuICAgIHtcbiAgICAgICAgaWYgKHBhcnNlSW50KGVsZW1lbnQpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludChlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZVN0cmluZ1RvTnVtYmVyKGVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0wOC0zMVxuICovXG5cbmRlY2xhcmUgdmFyIGdvb2dsZSwgJDtcblxuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi9kaXJlY3RvcnkvdXRpbHMvZXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIFNlYXJjaEJhckNvbXBvbmVudFxue1xuXHRkb21JZDtcblxuXHRvblNlYXJjaCA9IG5ldyBFdmVudDxzdHJpbmc+KCk7XG5cblx0ZG9tRWxlbWVudCgpIHsgcmV0dXJuICQoYCMke3RoaXMuZG9tSWR9YCk7IH1cblxuXHRjb25zdHJ1Y3Rvcihkb21JZCA6IHN0cmluZylcblx0e1x0XG5cdFx0dGhpcy5kb21JZCA9IGRvbUlkO1xuXG5cdFx0Ly8gaGFuZGxlIGFsbCB2YWxpZGF0aW9uIGJ5IHVzZXIgKGVudGVyIHByZXNzLCBpY29uIGNsaWNrLi4uKVxuXHRcdHRoaXMuZG9tRWxlbWVudCgpLmtleXVwKChlKSA9PlxuXHRcdHsgICAgXG5cdFx0XHRpZihlLmtleUNvZGUgPT0gMTMpIC8vIHRvdWNoZSBlbnRyw6llXG5cdFx0XHR7IFx0XHRcdCBcblx0XHRcdFx0dGhpcy5oYW5kbGVTZWFyY2hBY3Rpb24oKTtcblx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5kb21JZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLmRvbUVsZW1lbnQoKS5wYXJlbnRzKCkuZmluZCgnI3NlYXJjaC1iYXItaWNvbicpLmNsaWNrKCgpID0+XG5cdFx0e1x0XHRcdFx0XHRcblx0XHRcdHRoaXMuaGFuZGxlU2VhcmNoQWN0aW9uKCk7XG5cdFx0fSk7XHRcblxuXHRcdHRoaXMuZG9tRWxlbWVudCgpLm9uKFwicGxhY2VfY2hhbmdlZFwiLCB0aGlzLmhhbmRsZVNlYXJjaEFjdGlvbigpKTtcblx0fVxuXG5cblx0cHJpdmF0ZSBoYW5kbGVTZWFyY2hBY3Rpb24oKVxuXHR7XG5cdFx0dGhpcy5vblNlYXJjaC5lbWl0KHRoaXMuZG9tRWxlbWVudCgpLnZhbCgpKTtcblx0fVxuXG5cdHNldFZhbHVlKCR2YWx1ZSA6IHN0cmluZylcblx0e1xuXHRcdHRoaXMuZG9tRWxlbWVudCgpLnZhbCgkdmFsdWUpO1xuXHR9ICBcbiAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRBdXRvQ29tcGxldGlvbkZvckVsZW1lbnQoZWxlbWVudClcbntcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGNvbXBvbmVudFJlc3RyaWN0aW9uczoge2NvdW50cnk6ICdmcid9XG4gICAgfTtcbiAgICB2YXIgYXV0b2NvbXBsZXRlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5BdXRvY29tcGxldGUoZWxlbWVudCwgb3B0aW9ucyk7ICAgXG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoYXV0b2NvbXBsZXRlLCAncGxhY2VfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKGVsZW1lbnQpLnRyaWdnZXIoJ3BsYWNlX2NoYW5nZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuL2FwcC5tb2R1bGVcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmltcG9ydCB7IHJlZGlyZWN0VG9EaXJlY3RvcnkgfSBmcm9tIFwiLi4vY29tbW9ucy9jb21tb25zXCI7XG5cbi8vZGVjbGFyZSB2YXIgJDtcbmRlY2xhcmUgbGV0ICQgOiBhbnk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQXBwSW50ZXJhY3Rpb25zKClcbntcdFxuXHQvL2FuaW1hdGlvbiBwb3VyIGxpZW4gZCdhbmNyZSBkYW5zIGxhIHBhZ2VcbiAgIC8qICQoJ2FbaHJlZl49XCIjXCJdJykuY2xpY2soZnVuY3Rpb24oKXsgIFxuXHQgICAgbGV0IHRhcmdldCA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XG5cdCAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAkKHRhcmdldCkub2Zmc2V0KCkudG9wfSwgNzAwKTtcblx0ICAgIHJldHVybiBmYWxzZTsgIFxuXHR9KTsgKi9cdFx0XG5cblx0LyokKCcjbWVudS1idXR0b24nKS5jbGljayhhbmltYXRlX3VwX2JhbmRlYXVfb3B0aW9ucyk7XG5cdCQoJyNvdmVybGF5JykuY2xpY2soYW5pbWF0ZV9kb3duX2JhbmRlYXVfb3B0aW9ucyk7Ki9cblxuXHR1cGRhdGVDb21wb25lbnRzU2l6ZSgpO1xuXG5cdCQoJyNidG4tYmFuZGVhdS1oZWxwZXItY2xvc2UnKS5jbGljayhoaWRlQmFuZGVhdUhlbHBlcik7XG5cblx0JCgnLmZsYXNoLW1lc3NhZ2UgLmJ0bi1jbG9zZScpLmNsaWNrKCBmdW5jdGlvbigpIHsgJCh0aGlzKS5wYXJlbnQoKS5zbGlkZVVwKCdmYXN0JywgZnVuY3Rpb24oKSB7IHVwZGF0ZUNvbXBvbmVudHNTaXplKCk7IH0pOyB9KTtcblxuXHQkKCcjYnRuLWNsb3NlLWRpcmVjdGlvbnMnKS5jbGljayggKCkgPT4gXG5cdHtcblx0XHRBcHAuc2V0U3RhdGUoQXBwU3RhdGVzLlNob3dFbGVtZW50LCB7IGlkIDogQXBwLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpIH0pO1xuXHR9KTtcblxuXHRsZXQgcmVzO1xuXHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIFxuXHR7XG5cdCAgIGlmIChyZXMpIHtjbGVhclRpbWVvdXQocmVzKTsgfVxuXHQgICByZXMgPSBzZXRUaW1lb3V0KHVwZGF0ZUNvbXBvbmVudHNTaXplLDIwMCk7XG5cdH07XHRcblx0XG5cdC8vTWVudSBDQVJURVx0XG5cdCQoJyNtZW51LWJ1dHRvbicpLmNsaWNrKHNob3dEaXJlY3RvcnlNZW51KTtcblx0JCgnI292ZXJsYXknKS5jbGljayhoaWRlRGlyZWN0b3J5TWVudSk7XG5cdCQoJyNkaXJlY3RvcnktbWVudSAuYnRuLWNsb3NlLW1lbnUnKS5jbGljayhoaWRlRGlyZWN0b3J5TWVudSk7XG5cblx0JCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCAuc2hvdy1hcy1saXN0LWJ1dHRvbicpLmNsaWNrKChlIDogRXZlbnQpID0+IHtcdFx0XG5cdFx0QXBwLnNldFRpbWVvdXRDbGlja2luZygpO1xuXHRcdEFwcC5zZXRNb2RlKEFwcE1vZGVzLkxpc3QpO1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH0pO1xuXG5cdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IC5zaG93LWFzLW1hcC1idXR0b24nKS5jbGljaygoKSA9PiB7XHRcdFxuXHRcdEFwcC5zZXRNb2RlKEFwcE1vZGVzLk1hcCk7XG5cdH0pO1xuXHRcblx0Ly8gaWYgKG9ubHlJbnB1dEFkcmVzc01vZGUpXG5cdC8vIHtcblx0Ly8gXHRzaG93T25seUlucHV0QWRyZXNzKCk7XG5cdC8vIH1cblxuXHQvLyAkKCcjbGlzdF90YWInKS5jbGljayhmdW5jdGlvbigpe1xuXHQvLyBcdCQoXCIjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdFwiKS5zaG93KCk7XG5cdC8vIFx0JCgnI2RpcmVjdG9yeS1jb250YWluZXInKS5oaWRlKCk7XG5cdC8vIH0pO1xuXHQvLyAkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwX3RhYicpLmNsaWNrKGZ1bmN0aW9uKCl7XHRcdFxuXHQvLyBcdCQoJyNkaXJlY3RvcnktY29udGFpbmVyJykuc2hvdygpO1xuXHQvLyBcdCQoXCIjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdFwiKS5oaWRlKCk7XG5cdC8vIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0RpcmVjdG9yeU1lbnUoKVxue1xuXHRBcHAuaW5mb0JhckNvbXBvbmVudC5oaWRlKCk7ICBcblx0JCgnI292ZXJsYXknKS5jc3MoJ3otaW5kZXgnLCcxMCcpO1xuXHQkKCcjb3ZlcmxheScpLmFuaW1hdGUoeydvcGFjaXR5JzogJy42J30sNzAwKTtcblx0JCgnI2RpcmVjdG9yeS1tZW51Jykuc2hvdyggXCJzbGlkZVwiLCB7ZGlyZWN0aW9uOiAnbGVmdCcsIGVhc2luZzogJ3N3aW5nJ30gLCAzNTAsICgpID0+IHsgQXBwLmRpcmVjdG9yeU1lbnVDb21wb25lbnQudXBkYXRlTWFpbk9wdGlvbkJhY2tncm91bmQoKSB9ICk7XG5cdFxuXHQvLyQoJyNkaXJlY3RvcnktbWVudScpLmNzcygnd2lkdGgnLCcwcHgnKS5zaG93KCkuYW5pbWF0ZSh7J3dpZHRoJzogJzI0MHB4J30sNzAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVEaXJlY3RvcnlNZW51KClcbntcblx0JCgnI292ZXJsYXknKS5jc3MoJ3otaW5kZXgnLCctMScpO1xuXHQkKCcjb3ZlcmxheScpLmFuaW1hdGUoeydvcGFjaXR5JzogJy4wJ30sNTAwKTtcblx0JCgnI2RpcmVjdG9yeS1tZW51JykuaGlkZSggXCJzbGlkZVwiLCB7ZGlyZWN0aW9uOiAnbGVmdCcsIGVhc2luZzogJ3N3aW5nJ30gLCAyNTAgKTtcblx0JCgnI21lbnUtdGl0bGUgLnNoYWRvdy1ib3R0b20nKS5oaWRlKCk7XG5cdC8vJCgnI2RpcmVjdG9yeS1tZW51JykuYW5pbWF0ZSh7J3dpZHRoJzogJzBweCd9LDcwMCkuaGlkZSgpO1xufVxuXG5sZXQgc2xpZGVPcHRpb25zID0geyBkdXJhdGlvbjogNTAwLCBlYXNpbmc6IFwiZWFzZU91dFF1YXJ0XCIsIHF1ZXVlOiBmYWxzZSwgY29tcGxldGU6IGZ1bmN0aW9uKCkge319O1xuXG5leHBvcnQgZnVuY3Rpb24gaGlkZUJhbmRlYXVIZWxwZXIoKVxue1xuXHQkKCcjYmFuZGVhdV9oZWxwZXInKS5zbGlkZVVwKHNsaWRlT3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93T25seUlucHV0QWRyZXNzKClcbntcblx0aGlkZUJhbmRlYXVIZWxwZXIoKTtcblx0JCgnI2RpcmVjdG9yeS1jb250ZW50JykuY3NzKCdtYXJnaW4tbGVmdCcsJzAnKTtcblx0JCgnI2JhbmRlYXVfdGFicycpLmhpZGUoKTtcblx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QnKS5oaWRlKCk7XG5cdHVwZGF0ZUNvbXBvbmVudHNTaXplKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDb21wb25lbnRzU2l6ZSgpXG57XHRcblx0Ly8kKFwiI2JhbmRlYXVfb3B0aW9uXCIpLmNzcygnaGVpZ2h0JywkKCB3aW5kb3cgKS5oZWlnaHQoKS0kKCdoZWFkZXInKS5oZWlnaHQoKSk7XG5cdC8vY29uc29sZS5sb2coXCJVcGRhdGUgY29tcG9uZW50IHNpemVcIik7XG5cdCQoJyNwYWdlLWNvbnRlbnQnKS5jc3MoJ2hlaWdodCcsJ2F1dG8nKTtcblxuXHRsZXQgY29udGVudF9oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKCdoZWFkZXInKS5oZWlnaHQoKTtcblx0Y29udGVudF9oZWlnaHQgLT0gJCgnLmZsYXNoLW1lc3NhZ2VzLWNvbnRhaW5lcicpLm91dGVySGVpZ2h0KHRydWUpO1xuXHQkKFwiI2RpcmVjdG9yeS1jb250YWluZXJcIikuY3NzKCdoZWlnaHQnLGNvbnRlbnRfaGVpZ2h0KTtcblx0JChcIiNkaXJlY3RvcnktY29udGVudC1saXN0XCIpLmNzcygnaGVpZ2h0Jyxjb250ZW50X2hlaWdodCk7XG5cblx0aWYgKEFwcCkgc2V0VGltZW91dChBcHAudXBkYXRlTWF4RWxlbWVudHMsIDUwMCk7XG5cblx0dXBkYXRlSW5mb0JhclNpemUoKTtcdFxuXHR1cGRhdGVNYXBTaXplKCk7XG59XG5cblxubGV0IG1hdGNoTWVkaWFCaWdTaXplX29sZDtcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVNYXBTaXplKGVsZW1lbnRJbmZvQmFyX2hlaWdodCA9ICQoJyNlbGVtZW50LWluZm8tYmFyJykub3V0ZXJIZWlnaHQodHJ1ZSkpXG57XHRcdFxuXHQvL2NvbnNvbGUubG9nKFwidXBkYXRlTWFwU2l6ZVwiLCBlbGVtZW50SW5mb0Jhcl9oZWlnaHQpO1xuXHRpZihcIm1hdGNoTWVkaWFcIiBpbiB3aW5kb3cpIFxuXHR7XHRcblx0XHRpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA2MDBweClcIikubWF0Y2hlcykgXG5cdCAgXHR7XG5cdCAgXHRcdCQoXCIjZGlyZWN0b3J5LW1lbnVcIikuY3NzKCdoZWlnaHQnLCQoXCIjZGlyZWN0b3J5LWNvbnRlbnRcIikuaGVpZ2h0KCktZWxlbWVudEluZm9CYXJfaGVpZ2h0KTtcdFxuXHQgIFx0fVxuXHQgIFx0ZWxzZVxuXHQgIFx0e1xuXHQgIFx0XHQkKFwiI2RpcmVjdG9yeS1tZW51XCIpLmNzcygnaGVpZ2h0JywnMTAwJScpO1xuXHQgIFx0fVxuXG5cdFx0aWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogMTIwMHB4KVwiKS5tYXRjaGVzKSBcblx0XHR7XG5cdFx0ICBcdGlmIChtYXRjaE1lZGlhQmlnU2l6ZV9vbGQpIGVsZW1lbnRJbmZvQmFyX2hlaWdodCA9IDA7XG5cblx0XHQgIFx0Ly9jb25zb2xlLmxvZyhcInJlc2l6ZSBtYXAgaGVpZ2h0IHRvXCIsICQoXCIjZGlyZWN0b3J5LWNvbnRlbnRcIikub3V0ZXJIZWlnaHQoKS1lbGVtZW50SW5mb0Jhcl9oZWlnaHQpO1xuXHRcdCAgXHQkKFwiI2RpcmVjdG9yeS1jb250ZW50LW1hcFwiKS5jc3MoJ2hlaWdodCcsJChcIiNkaXJlY3RvcnktY29udGVudFwiKS5vdXRlckhlaWdodCgpLWVsZW1lbnRJbmZvQmFyX2hlaWdodCk7XHRcblx0XHQgIFx0XG5cblx0XHQgIFx0bWF0Y2hNZWRpYUJpZ1NpemVfb2xkID0gZmFsc2U7XG5cdCAgXHR9IFxuXHRcdGVsc2UgXG5cdFx0e1x0XHRcdFxuXHRcdCAgXHQkKFwiI2RpcmVjdG9yeS1jb250ZW50LW1hcFwiKS5jc3MoJ2hlaWdodCcsJChcIiNkaXJlY3RvcnktY29udGVudFwiKS5oZWlnaHQoKSk7XHRcblx0XHQgIFx0aWYgKCQoJyNlbGVtZW50LWluZm8tYmFyJykuaXMoXCI6dmlzaWJsZVwiKSkgXG5cdCAgXHRcdHtcblx0ICBcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuY3NzKCdtYXJnaW4tcmlnaHQnLCc0ODBweCcpO1xuXHQgIFx0XHRcdCQoJyNiYW5kZWF1X2hlbHBlcicpLmNzcygnbWFyZ2luLXJpZ2h0JywnNDgwcHgnKTtcblx0ICBcdFx0XHRcblx0ICBcdFx0fVxuXHRcdCAgXHRlbHNlIFxuXHQgIFx0XHR7XG5cdCAgXHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLmNzcygnbWFyZ2luLXJpZ2h0JywnMHB4Jyk7XG5cdCAgXHRcdFx0JCgnI2JhbmRlYXVfaGVscGVyJykuY3NzKCdtYXJnaW4tcmlnaHQnLCcwcHgnKTtcblx0ICBcdFx0fVxuXHRcdCAgXHRtYXRjaE1lZGlhQmlnU2l6ZV9vbGQgPSB0cnVlOyBcdFxuXHRcdH1cblx0fVxuXHRlbHNlXG5cdHtcblx0XHRjb25zb2xlLmVycm9yKFwiTWF0Y2ggTWVkaWEgbm90IGF2YWlsYWJsZVwiKTtcblx0fVxuXG5cdC8vIGFwcsOocyA1MDBtcyBsJ2FuaW1hdGlvbiBkZSByZWRpbWVuc2lvbm5lbWVudCBlc3QgdGVybWluw6lcblx0Ly8gb24gdHJpZ2dlciBjZXQgw6l2ZW5lbWVudCBwb3VyIHF1ZSBsYSBjYXJ0ZSBzZSByZWRpbWVuc2lvbm5lIHZyYWltZW50XG5cdGlmIChBcHAubWFwQ29tcG9uZW50KSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBBcHAubWFwQ29tcG9uZW50LnJlc2l6ZSgpOyB9LDUwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVJbmZvQmFyU2l6ZSgpXG57XG5cdGlmICgkKCcjZWxlbWVudC1pbmZvLWJhcicpLndpZHRoKCkgPCA2MDApXG5cdHtcblx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLnJlbW92ZUNsYXNzKFwibGFyZ2VXaWR0aFwiKTtcblx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmFkZENsYXNzKFwic21hbGxXaWR0aFwiKTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmFkZENsYXNzKFwibGFyZ2VXaWR0aFwiKTtcblx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLnJlbW92ZUNsYXNzKFwic21hbGxXaWR0aFwiKTtcblx0fVxuXG5cdGlmKFwibWF0Y2hNZWRpYVwiIGluIHdpbmRvdykgXG5cdHtcdFxuXHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDEyMDBweClcIikubWF0Y2hlcykgXG5cdFx0e1xuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZURldGFpbHMnKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG5cdFx0ICBcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5jb2xsYXBzaWJsZS1ib2R5JykuY3NzKCdtYXJnaW4tdG9wJywnMHB4Jyk7XG5cdCAgXHR9IFxuXHRcdGVsc2UgXG5cdFx0e1x0XHRcdFxuXHRcdCAgXHRsZXQgZWxlbWVudEluZm9CYXIgPSAkKFwiI2VsZW1lbnQtaW5mby1iYXJcIik7XG5cdFx0ICBcdGxldCBoZWlnaHQgPSBlbGVtZW50SW5mb0Jhci5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdGhlaWdodCAtPSBlbGVtZW50SW5mb0Jhci5maW5kKCcuY29sbGFwc2libGUtaGVhZGVyJykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRoZWlnaHQgLT0gZWxlbWVudEluZm9CYXIuZmluZCgnLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZS1oZWxwZXI6dmlzaWJsZScpLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0aGVpZ2h0IC09IGVsZW1lbnRJbmZvQmFyLmZpbmQoXCIubWVudS1lbGVtZW50XCIpLm91dGVySGVpZ2h0KHRydWUpO1xuXG5cdFx0ICBcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5jb2xsYXBzaWJsZS1ib2R5JykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdCAgXHQkKCcjZWxlbWVudC1pbmZvLWJhciAuY29sbGFwc2libGUtYm9keScpLmNzcygnbWFyZ2luLXRvcCcsIGVsZW1lbnRJbmZvQmFyLmZpbmQoJy5jb2xsYXBzaWJsZS1oZWFkZXInKS5vdXRlckhlaWdodCh0cnVlKStlbGVtZW50SW5mb0Jhci5maW5kKCcuc3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlLWhlbHBlcjp2aXNpYmxlJykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xuXHRcdH1cblx0fVxufVxuXG5cblxuXG5cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImxlYWZsZXRcIiAvPlxuXG5kZWNsYXJlIGxldCB3aW5kb3csIFJvdXRpbmcgOiBhbnk7XG5kZWNsYXJlIGxldCBDT05GSUcsIE1BSU5fQ0FURUdPUlksIE9QRU5IT1VSU19DQVRFR09SWTtcbmRlY2xhcmUgdmFyICQ7XG5cbmltcG9ydCB7IEdlb2NvZGVyTW9kdWxlLCBHZW9jb2RlUmVzdWx0IH0gZnJvbSBcIi4vbW9kdWxlcy9nZW9jb2Rlci5tb2R1bGVcIjtcbmltcG9ydCB7IEZpbHRlck1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZmlsdGVyLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudHNNb2R1bGUsIEVsZW1lbnRzQ2hhbmdlZCB9IGZyb20gXCIuL21vZHVsZXMvZWxlbWVudHMubW9kdWxlXCI7XG5pbXBvcnQgeyBEaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy9kaXNwbGF5LWVsZW1lbnQtYWxvbmUubW9kdWxlXCI7XG5pbXBvcnQgeyBBamF4TW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy9hamF4Lm1vZHVsZVwiO1xuaW1wb3J0IHsgQ2F0ZWdvcmllc01vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy9jYXRlZ29yaWVzLm1vZHVsZSc7XG5pbXBvcnQgeyBEaXJlY3Rpb25zTW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy9kaXJlY3Rpb25zLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudExpc3RDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2VsZW1lbnQtbGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEluZm9CYXJDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2luZm8tYmFyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgU2VhcmNoQmFyQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbW1vbnMvc2VhcmNoLWJhci5jb21wb25lbnRcIjtcbmltcG9ydCB7IERpcmVjdG9yeU1lbnVDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2RpcmVjdG9yeS1tZW51LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTWFwQ29tcG9uZW50LCBWaWV3UG9ydCB9IGZyb20gXCIuL2NvbXBvbmVudHMvbWFwL21hcC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEJpb3Blbk1hcmtlciB9IGZyb20gXCIuL2NvbXBvbmVudHMvbWFwL2Jpb3Blbi1tYXJrZXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBIaXN0b3J5TW9kdWxlLCBIaXN0b3J5U3RhdGUgfSBmcm9tICcuL21vZHVsZXMvaGlzdG9yeS5tb2R1bGUnO1xuXG5cbmltcG9ydCB7IGluaXRpYWxpemVBcHBJbnRlcmFjdGlvbnMgfSBmcm9tIFwiLi9hcHAtaW50ZXJhY3Rpb25zXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplRWxlbWVudE1lbnUgfSBmcm9tIFwiLi9jb21wb25lbnRzL2VsZW1lbnQtbWVudS5jb21wb25lbnRcIjtcblxuaW1wb3J0IHsgZ2V0UXVlcnlQYXJhbXMsIGNhcGl0YWxpemUgfSBmcm9tIFwiLi4vY29tbW9ucy9jb21tb25zXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5kZWNsYXJlIHZhciBBcHAgOiBBcHBNb2R1bGU7XG5cbi8qKlxuKiBBcHAgaW5pdGlhbGlzYXRpb24gd2hlbiBkb2N1bWVudCByZWFkeVxuKi9cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKClcbntcdFxuICAgQXBwID0gbmV3IEFwcE1vZHVsZSgpOyAgICAgIFxuXG4gICBBcHAuY2F0ZWdvcnlNb2R1bGUuY3JlYXRlQ2F0ZWdvcmllc0Zyb21Kc29uKE1BSU5fQ0FURUdPUlksIE9QRU5IT1VSU19DQVRFR09SWSk7XG5cbiAgIEFwcC5lbGVtZW50TW9kdWxlLmluaXRpYWxpemUoKTtcblxuICAgQXBwLmxvYWRIaXN0b3J5U3RhdGUoKTtcblxuICAgaW5pdGlhbGl6ZUFwcEludGVyYWN0aW9ucygpO1xuICAgaW5pdGlhbGl6ZUVsZW1lbnRNZW51KCk7XG59KTtcblxuLypcbiogQXBwIHN0YXRlcyBuYW1lc1xuKi9cbmV4cG9ydCBlbnVtIEFwcFN0YXRlcyBcbntcblx0Tm9ybWFsLFxuXHRTaG93RWxlbWVudCxcblx0U2hvd0VsZW1lbnRBbG9uZSxcblx0U2hvd0RpcmVjdGlvbnMsXG5cdENvbnN0ZWxsYXRpb24sXG5cdFN0YXJSZXByZXNlbnRhdGlvbkNob2ljZSAgICBcbn1cblxuZXhwb3J0IGVudW0gQXBwTW9kZXNcbntcblx0TWFwLFxuXHRMaXN0XG59XG5cbi8qXG4qIEFwcCBNb2R1bGUuIE1haW4gbW9kdWxlIG9mIHRoZSBBcHBcbipcbiogQXBwTW9kdWxlIGNyZWF0ZXMgYWxsIG90aGVycyBtb2R1bGVzLCBhbmQgZGVhbHMgd2l0aCB0aGVpcnMgZXZlbnRzXG4qL1xuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZVxue1x0XHRcblx0Z2VvY29kZXJNb2R1bGVfID0gbmV3IEdlb2NvZGVyTW9kdWxlKCk7XG5cdGZpbHRlck1vZHVsZV8gPSBuZXcgRmlsdGVyTW9kdWxlKCk7XG5cdGVsZW1lbnRzTW9kdWxlXyA9IG5ldyBFbGVtZW50c01vZHVsZSgpO1xuXHRkaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXyA9IG5ldyBEaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlKCk7XG5cdGRpcmVjdGlvbnNNb2R1bGVfIDogRGlyZWN0aW9uc01vZHVsZSA9IG5ldyBEaXJlY3Rpb25zTW9kdWxlKCk7XG5cdGFqYXhNb2R1bGVfID0gbmV3IEFqYXhNb2R1bGUoKTtcblx0aW5mb0JhckNvbXBvbmVudF8gPSBuZXcgSW5mb0JhckNvbXBvbmVudCgpO1xuXHRtYXBDb21wb25lbnRfICA9IG5ldyBNYXBDb21wb25lbnQoKTtcblx0c2VhcmNoQmFyQ29tcG9uZW50ID0gbmV3IFNlYXJjaEJhckNvbXBvbmVudCgnc2VhcmNoLWJhcicpO1xuXHRlbGVtZW50TGlzdENvbXBvbmVudCA9IG5ldyBFbGVtZW50TGlzdENvbXBvbmVudCgpO1xuXHRoaXN0b3J5TW9kdWxlID0gbmV3IEhpc3RvcnlNb2R1bGUoKTtcblx0Y2F0ZWdvcnlNb2R1bGUgPSBuZXcgQ2F0ZWdvcmllc01vZHVsZSgpO1xuXHRkaXJlY3RvcnlNZW51Q29tcG9uZW50ID0gbmV3IERpcmVjdG9yeU1lbnVDb21wb25lbnQoKTtcblxuXHQvL3N0YXJSZXByZXNlbnRhdGlvbkNob2ljZU1vZHVsZV8gPSBjb25zdGVsbGF0aW9uTW9kZSA/IG5ldyBTdGFyUmVwcmVzZW50YXRpb25DaG9pY2VNb2R1bGUoKSA6IG51bGw7XG5cdFxuXHQvLyBjdXJyIHN0YXRlIG9mIHRoZSBhcHBcblx0cHJpdmF0ZSBzdGF0ZV8gOiBBcHBTdGF0ZXMgPSBudWxsO1x0XG5cdHByaXZhdGUgbW9kZV8gOiBBcHBNb2RlcyA9IG51bGw7XG5cblx0Ly8gc29tZXMgc3RhdGVzIG5lZWQgYSBlbGVtZW50IGlkLCB3ZSBzdG9yZSBpdCBpbiB0aGlzIHByb3BlcnR5XG5cdHByaXZhdGUgc3RhdGVFbGVtZW50SWQgOiBudW1iZXIgPSBudWxsO1xuXG5cblx0Ly8gd2hlbiBjbGljayBvbiBtYXJrZXIgaXQgYWxzbyB0cmlnZXIgY2xpY2sgb24gbWFwXG5cdC8vIHdoZW4gY2xpY2sgb24gbWFya2VyIHdlIHB1dCBpc0NsaWNraW5nIHRvIHRydWUgZHVyaW5nXG5cdC8vIGZldyBtaWxsaXNlY29uZHMgc28gdGhlIG1hcCBkb24ndCBkbyBhbnl0aGluZyBpcyBjbGljayBldmVudFxuXHRpc0NsaWNraW5nXyA9IGZhbHNlO1xuXG5cdC8vIHByZXZlbnQgdXBkYXRlZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCB3aGlsZSB0aGUgYWN0aW9uIGlzIGp1c3Rcblx0Ly8gc2hvd2luZyBlbGVtZW50IGRldGFpbHNcblx0aXNTaG93aW5nSW5mb0JhckNvbXBvbmVudF8gPSBmYWxzZTtcblxuXHQvLyBQdXQgYSBsaW1pdCBvZiBtYXJrZXJzIHNob3dlZCBvbiBtYXAgKG1hcmtlcnMgbm90IGNsdXN0ZXJlZClcblx0Ly8gQmVjYXVzZSBpZiB0b28gbWFueSBtYXJrZXJzIGFyZSBzaG93biwgYnJvd3NlciBzbG93IGRvd25cblx0bWF4RWxlbWVudHNUb1Nob3dPbk1hcF8gPSAxMDAwO1x0XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5pbmZvQmFyQ29tcG9uZW50Xy5vblNob3cuZG8oIChlbGVtZW50SWQpID0+IHsgdGhpcy5oYW5kbGVJbmZvQmFyU2hvdyhlbGVtZW50SWQpOyB9KTtcbiAgXHR0aGlzLmluZm9CYXJDb21wb25lbnRfLm9uSGlkZS5kbyggKCk9PiB7IHRoaXMuaGFuZGxlSW5mb0JhckhpZGUoKTsgfSk7XG5cdFxuXHRcdHRoaXMubWFwQ29tcG9uZW50Xy5vbk1hcFJlYWR5LmRvKCAoKSA9PiB7IHRoaXMuaW5pdGlhbGl6ZU1hcEZlYXR1cmVzKCk7IH0pO1xuXG5cdFx0Ly90aGlzLmdlb2NvZGVyTW9kdWxlXy5vblJlc3VsdC5kbyggKGFycmF5KSA9PiB7IHRoaXMuaGFuZGxlR2VvY29kaW5nKGFycmF5KTsgfSk7XG5cdFx0dGhpcy5hamF4TW9kdWxlXy5vbk5ld0VsZW1lbnRzLmRvKCAoZWxlbWVudHMpID0+IHsgdGhpcy5oYW5kbGVOZXdFbGVtZW50c1JlY2VpdmVkRnJvbVNlcnZlcihlbGVtZW50cyk7IH0pO1xuXHRcblx0XHR0aGlzLmVsZW1lbnRzTW9kdWxlXy5vbkVsZW1lbnRzQ2hhbmdlZC5kbyggKGVsZW1lbnRzQ2hhbmdlZCk9PiB7IHRoaXMuaGFuZGxlRWxlbWVudHNDaGFuZ2VkKGVsZW1lbnRzQ2hhbmdlZCk7IH0pO1xuXHRcblx0XHR0aGlzLnNlYXJjaEJhckNvbXBvbmVudC5vblNlYXJjaC5kbyggKGFkZHJlc3MgOiBzdHJpbmcpID0+IHsgdGhpcy5oYW5kbGVTZWFyY2hBY3Rpb24oYWRkcmVzcyk7IH0pO1xuXHR9XG5cblx0aW5pdGlhbGl6ZU1hcEZlYXR1cmVzKClcblx0e1x0XG5cdFx0XG5cdH07XG5cblx0Lypcblx0KiBMb2FkIGluaXRpYWwgc3RhdGUgd2l0aCBDT05GSUcgcHJvdmlkZWQgYnkgc3ltZm9ueSBjb250cm9sbGVyIG9yXG5cdCAgd2l0aCBzdGF0ZSBwb3BlZCBieSB3aW5kb3cgaGlzdG9yeSBtYW5hZ2VyXG5cdCovXG5cdGxvYWRIaXN0b3J5U3RhdGUoaGlzdG9yeXN0YXRlIDogSGlzdG9yeVN0YXRlID0gQ09ORklHLCAkYmFja0Zyb21IaXN0b3J5ID0gZmFsc2UpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwibG9hZEhpc3RvcnlzdGF0ZSBmaWx0ZXJzZFwiLCBoaXN0b3J5c3RhdGUuZmlsdGVycylcblx0XHRpZiAoaGlzdG9yeXN0YXRlLmZpbHRlcnMpXG5cdFx0e1xuXHRcdFx0dGhpcy5maWx0ZXJNb2R1bGUubG9hZEZpbHRlcnNGcm9tU3RyaW5nKGhpc3RvcnlzdGF0ZS5maWx0ZXJzKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuZGlyZWN0b3J5TWVudUNvbXBvbmVudC5zZXRNYWluT3B0aW9uKCdhbGwnKTtcblx0XHR9XG5cblx0XHRpZiAoaGlzdG9yeXN0YXRlID09PSBudWxsKSByZXR1cm47XG5cblx0XHQvLyBpZiBubyBiYWNrZnJvbWhpc3RvcnkgdGhhdCBtZWFucyBoaXN0b3J5c3RhdGUgaXMgYWN0dWFsbHkgdGhlIENPTkZJR1xuXHRcdC8vIGdpdmVuIGJ5IHN5bWZvbnksIHNvIHdlIG5lZWQgdG8gY29udmVydCB0aGlzIG9iZWN0IGluIHJlYWwgSGlzdG9yeXN0YXRlIGNsYXNzXG5cdFx0aWYgKCEkYmFja0Zyb21IaXN0b3J5KVxuXHRcdFx0aGlzdG9yeXN0YXRlID0gbmV3IEhpc3RvcnlTdGF0ZSgpLnBhcnNlKGhpc3RvcnlzdGF0ZSk7XHRcdFxuXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS52aWV3cG9ydClcblx0XHR7XHRcdFx0XG5cdFx0XHQvLyBpZiBtYXAgbm90IGxvYWRlZCB3ZSBqdXN0IHNldCB0aGUgbWFwQ29tcG9uZW50IHZpZXdwb3J0IHdpdGhvdXQgY2hhbmdpbmcgdGhlXG5cdFx0XHQvLyBhY3R1YWwgdmlld3BvcnQgb2YgdGhlIG1hcCwgYmVjYXVzZSBpdCB3aWxsIGJlIGRvbmUgaW5cblx0XHRcdC8vIG1hcCBpbml0aWFsaXNhdGlvblxuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQuc2V0Vmlld1BvcnQoaGlzdG9yeXN0YXRlLnZpZXdwb3J0LCB0aGlzLm1hcENvbXBvbmVudC5pc01hcExvYWRlZCk7XG5cblx0XHRcdCQoJyNkaXJlY3Rvcnktc3Bpbm5lci1sb2FkZXInKS5oaWRlKCk7XHRcblxuXHRcdFx0aWYgKGhpc3RvcnlzdGF0ZS5tb2RlID09IEFwcE1vZGVzLkxpc3QgKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgbG9jYXRpb24gPSBMLmxhdExuZyhoaXN0b3J5c3RhdGUudmlld3BvcnQubGF0LCBoaXN0b3J5c3RhdGUudmlld3BvcnQubG5nKTtcblx0XHRcdFx0dGhpcy5hamF4TW9kdWxlLmdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24obG9jYXRpb24sIDMwKTtcdFxuXHRcdFx0fVx0XG5cdFx0fVx0XG5cblx0XHR0aGlzLnNldE1vZGUoaGlzdG9yeXN0YXRlLm1vZGUsICRiYWNrRnJvbUhpc3RvcnksIGZhbHNlKTtcblxuXHRcdC8vIGlmIGFkZHJlc3MgaXMgcHJvdmlkZWQgd2UgZ2VvbG9jYWxpemVcblx0XHQvLyBpZiBubyB2aWV3cG9ydCBhbmQgc3RhdGUgbm9ybWFsIHdlIGdlb2NvZGUgb24gZGVmYXVsdCBsb2NhdGlvblxuXHRcdGlmIChoaXN0b3J5c3RhdGUuYWRkcmVzcyB8fCAoIWhpc3RvcnlzdGF0ZS52aWV3cG9ydCAmJiBoaXN0b3J5c3RhdGUuc3RhdGUgPT09IEFwcFN0YXRlcy5Ob3JtYWwpKSBcblx0XHR7XG5cdFx0XHR0aGlzLmdlb2NvZGVyTW9kdWxlXy5nZW9jb2RlQWRkcmVzcyhcblx0XHRcdFx0aGlzdG9yeXN0YXRlLmFkZHJlc3MsIFxuXHRcdFx0XHQocmVzdWx0cykgPT4gXG5cdFx0XHRcdHsgXG5cdFx0XHRcdFx0Ly8gaWYgdmlld3BvcnQgaXMgZ2l2ZW4sIG5vdGhpbmcgdG8gZG8sIHdlIGFscmVhZHkgZGlkIGluaXRpYWxpemF0aW9uXG5cdFx0XHRcdFx0Ly8gd2l0aCB2aWV3cG9ydFxuXHRcdFx0XHRcdGlmIChoaXN0b3J5c3RhdGUudmlld3BvcnQpIHJldHVybjtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZUdlb2NvZGVSZXN1bHQocmVzdWx0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHQvLyBmYWlsdXJlIGNhbGxiYWNrXG5cdFx0XHRcdFx0dGhpcy5zZWFyY2hCYXJDb21wb25lbnQuc2V0VmFsdWUoXCJFcnJldXIgZGUgbG9jYWxpc2F0aW9uIDogXCIgKyBoaXN0b3J5c3RhdGUuYWRkcmVzcyk7XG5cdFx0XHRcdFx0aWYgKCFoaXN0b3J5c3RhdGUudmlld3BvcnQpIFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vIGdlb2NvZGUgZGVmYXVsdCBsb2NhdGlvblxuXHRcdFx0XHRcdFx0dGhpcy5nZW9jb2Rlck1vZHVsZV8uZ2VvY29kZUFkZHJlc3MoJycsIChyKSA9PiB7IHRoaXMuaGFuZGxlR2VvY29kZVJlc3VsdChyKTsgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XHRcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKGhpc3RvcnlzdGF0ZS5pZCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShcblx0XHRcdFx0aGlzdG9yeXN0YXRlLnN0YXRlLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQ6IGhpc3RvcnlzdGF0ZS5pZCwgXG5cdFx0XHRcdFx0cGFuVG9Mb2NhdGlvbjogKGhpc3RvcnlzdGF0ZS52aWV3cG9ydCA9PT0gbnVsbClcblx0XHRcdFx0fSxcblx0XHRcdFx0JGJhY2tGcm9tSGlzdG9yeSk7XG5cdFx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTdGF0ZShoaXN0b3J5c3RhdGUuc3RhdGUsIG51bGwsICRiYWNrRnJvbUhpc3RvcnkpO1x0XHRcblx0XHR9XHRcdFxuXHR9O1x0XG5cblx0c2V0TW9kZSgkbW9kZSA6IEFwcE1vZGVzLCAkYmFja0Zyb21IaXN0b3J5IDogYm9vbGVhbiA9IGZhbHNlLCAkdXBkYXRlVGl0bGVBbmRTdGF0ZSA9IHRydWUpXG5cdHtcblx0XHRpZiAoJG1vZGUgIT0gdGhpcy5tb2RlXylcblx0XHR7XHRcdFx0XG5cdFx0XHRpZiAoJG1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25JZGxlLmRvKCAoKSA9PiB7IHRoaXMuaGFuZGxlTWFwSWRsZSgpOyAgfSk7XG5cdFx0XHRcdHRoaXMubWFwQ29tcG9uZW50Xy5vbkNsaWNrLmRvKCAoKSA9PiB7IHRoaXMuaGFuZGxlTWFwQ2xpY2soKTsgfSk7XHRcdFxuXG5cdFx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1tYXAnKS5zaG93KCk7XG5cdFx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0JykuaGlkZSgpO1x0XHRcdFx0XG5cblx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQuaW5pdCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25JZGxlLm9mZiggKCkgPT4geyB0aGlzLmhhbmRsZU1hcElkbGUoKTsgIH0pO1xuXHRcdFx0XHR0aGlzLm1hcENvbXBvbmVudF8ub25DbGljay5vZmYoICgpID0+IHsgdGhpcy5oYW5kbGVNYXBDbGljaygpOyB9KTtcdFx0XG5cblx0XHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LW1hcCcpLmhpZGUoKTtcblx0XHRcdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QnKS5zaG93KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIHByZXZpb3VzIG1vZGUgd2Fzbid0IG51bGwgXG5cdFx0XHRsZXQgb2xkTW9kZSA9IHRoaXMubW9kZV87XG5cdFx0XHR0aGlzLm1vZGVfID0gJG1vZGU7XG5cblx0XHRcdC8vIHVwZGF0ZSBoaXN0b3J5IGlmIHdlIG5lZWQgdG9cblx0XHRcdGlmIChvbGRNb2RlICE9IG51bGwgJiYgISRiYWNrRnJvbUhpc3RvcnkgJiYgJG1vZGUgPT0gQXBwTW9kZXMuTGlzdCkgdGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZSgpO1xuXG5cdFx0XHR0aGlzLmVsZW1lbnRNb2R1bGUuY2xlYXJDdXJyZW50c0VsZW1lbnQoKTtcblx0XHRcdHRoaXMuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50VG9EaXNwbGF5KHRydWUsIHRydWUpO1xuXG5cdFx0XHRpZiAoJHVwZGF0ZVRpdGxlQW5kU3RhdGUpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZSgpO1x0XHRcdFxuXG5cdFx0XHRcdC8vIGFmdGVyIGNsZWFyaW5nLCB3ZSBzZXQgdGhlIGN1cnJlbnQgc3RhdGUgYWdhaW5cblx0XHRcdFx0aWYgKCRtb2RlID09IEFwcE1vZGVzLk1hcCkgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLCB7aWQgOiB0aGlzLnN0YXRlRWxlbWVudElkfSk7XHRcblx0XHRcdH1cdFx0XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHQvKlxuXHQqIENoYW5nZSBBcHAgc3RhdGVcblx0Ki9cblx0c2V0U3RhdGUoJG5ld1N0YXRlIDogQXBwU3RhdGVzLCBvcHRpb25zIDogYW55ID0ge30sICRiYWNrRnJvbUhpc3RvcnkgOiBib29sZWFuID0gZmFsc2UpIFxuXHR7IFx0XG5cdFx0Ly9jb25zb2xlLmxvZyhcIkFwcE1vZHVsZSBzZXQgU3RhdGUgOiBcIiArIEFwcFN0YXRlc1skbmV3U3RhdGVdICArICAnLCBvcHRpb25zID0gJyxvcHRpb25zKTtcblx0XHRcblx0XHRsZXQgZWxlbWVudDtcblxuXHRcdGxldCBvbGRTdGF0ZU5hbWUgPSB0aGlzLnN0YXRlXztcblx0XHR0aGlzLnN0YXRlXyA9ICRuZXdTdGF0ZTtcdFx0XHRcblxuXHRcdGlmIChvbGRTdGF0ZU5hbWUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zICYmIHRoaXMuZGlyZWN0aW9uc01vZHVsZV8pIFxuXHRcdFx0dGhpcy5kaXJlY3Rpb25zTW9kdWxlXy5jbGVhcigpO1xuXG5cdFx0aWYgKG9sZFN0YXRlTmFtZSA9PSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSlcdFxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudE1vZHVsZS5jbGVhckN1cnJlbnRzRWxlbWVudCgpO1xuXHRcdFx0dGhpcy5kaXNwbGF5RWxlbWVudEFsb25lTW9kdWxlXy5lbmQoKTtcdFxuXHRcdH1cdFxuXG5cdFx0dGhpcy5zdGF0ZUVsZW1lbnRJZCA9IG9wdGlvbnMgPyBvcHRpb25zLmlkIDogbnVsbDtcblx0XHRcblx0XHRzd2l0Y2ggKCRuZXdTdGF0ZSlcblx0XHR7XG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5Ob3JtYWw6XHRcdFx0XG5cdFx0XHRcdC8vIGlmICh0aGlzLnN0YXRlXyA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbikgXG5cdFx0XHRcdC8vIHtcblx0XHRcdFx0Ly8gXHRjbGVhckRpcmVjdG9yeU1lbnUoKTtcblx0XHRcdFx0Ly8gXHR0aGlzLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZU1vZHVsZV8uZW5kKCk7XG5cdFx0XHRcdC8vIH1cdFxuXHRcdFx0XHRpZiAoJGJhY2tGcm9tSGlzdG9yeSkgdGhpcy5pbmZvQmFyQ29tcG9uZW50LmhpZGUoKTtcdFx0XHRcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudDpcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSByZXR1cm47XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmVsZW1lbnRCeUlkKG9wdGlvbnMuaWQpLm1hcmtlci5zaG93Tm9ybWFsSGlkZGVuKCk7XG5cdFx0XHRcdHRoaXMuZWxlbWVudEJ5SWQob3B0aW9ucy5pZCkubWFya2VyLnNob3dCaWdTaXplKCk7XG5cdFx0XHRcdHRoaXMuaW5mb0JhckNvbXBvbmVudC5zaG93RWxlbWVudChvcHRpb25zLmlkKTtcblxuXHRcdFx0XHRicmVhaztcdFxuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RWxlbWVudEFsb25lOlxuXHRcdFx0XHRpZiAoIW9wdGlvbnMuaWQpIHJldHVybjtcblxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5lbGVtZW50QnlJZChvcHRpb25zLmlkKTtcblx0XHRcdFx0aWYgKGVsZW1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLkRFQU1vZHVsZS5iZWdpbihlbGVtZW50LmlkLCBvcHRpb25zLnBhblRvTG9jYXRpb24pO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFqYXhNb2R1bGVfLmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQsXG5cdFx0XHRcdFx0XHQoZWxlbWVudEpzb24pID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhbZWxlbWVudEpzb25dLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5ERUFNb2R1bGUuYmVnaW4oZWxlbWVudEpzb24uaWQsIG9wdGlvbnMucGFuVG9Mb2NhdGlvbik7XG5cdFx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZShvcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0Ly8gd2UgZ2V0IGVsZW1lbnQgYXJvdW5kIHNvIGlmIHRoZSB1c2VyIGVuZCB0aGUgRFBBTWRvdWxlXG5cdFx0XHRcdFx0XHRcdC8vIHRoZSBlbGVtZW50cyB3aWxsIGFscmVhZHkgYmUgYXZhaWxhYmxlIHRvIGRpc3BsYXlcblx0XHRcdFx0XHRcdFx0dGhpcy5hamF4TW9kdWxlLmdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24oXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQuZ2V0Q2VudGVyKCksIFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubWFwQ29tcG9uZW50Lm1hcFJhZGl1c0luS20oKSAqIDJcblx0XHRcdFx0XHRcdFx0KTtcdCBcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQoZXJyb3IpID0+IHsgLypUT0RPKi8gYWxlcnQoXCJObyBlbGVtZW50IHdpdGggdGhpcyBpZFwiKTsgfVxuXHRcdFx0XHRcdCk7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcblx0XHRcdFx0aWYgKCFvcHRpb25zLmlkKSByZXR1cm47XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5lbGVtZW50QnlJZChvcHRpb25zLmlkKTtcblx0XHRcdFx0bGV0IG9yaWdpbjtcblxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZV8gPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcmlnaW4gPSB0aGlzLmNvbnN0ZWxsYXRpb24uZ2V0T3JpZ2luKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3JpZ2luID0gdGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbG9jYWwgZnVuY3Rpb25cblx0XHRcdFx0bGV0IGNhbGN1bGF0ZVJvdXRlID0gZnVuY3Rpb24gKG9yaWdpbiA6IEwuTGF0TG5nLCBlbGVtZW50IDogRWxlbWVudClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdEFwcC5kaXJlY3Rpb25zTW9kdWxlLmNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7IFxuXHRcdFx0XHRcdEFwcC5ERUFNb2R1bGUuYmVnaW4oZWxlbWVudC5pZCwgZmFsc2UpO1x0XHRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBpZiBubyBlbGVtZW50LCB3ZSBnZXQgaXQgZnJvbSBhamF4IFxuXHRcdFx0XHRpZiAoIWVsZW1lbnQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFqYXhNb2R1bGVfLmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuaWQsIChlbGVtZW50SnNvbikgPT4gXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhbZWxlbWVudEpzb25dLCB0cnVlKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRCeUlkKGVsZW1lbnRKc29uLmlkKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcbiAgICAgICAgICAgIFxuXHRcdFx0XHRcdFx0b3JpZ2luID0gdGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpO1xuXHRcdFx0XHRcdFx0Ly8gd2UgZ2VvbG9jYWxpemVkIG9yaWdpbiBpbiBsb2FkSGlzdG9yeSBmdW5jdGlvblxuXHRcdFx0XHRcdFx0Ly8gbWF5YmUgdGhlIGdlb2NvZGluZyBpcyBub3QgYWxyZWFkeSBkb25lIHNvIHdlIHdhaXQgYSBsaXR0bGUgYml0IGZvciBpdFxuXHRcdFx0XHRcdFx0aWYgKCFvcmlnaW4pXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdG9yaWdpbiA9IHRoaXMuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIW9yaWdpbilcblx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcmlnaW4gPSB0aGlzLmdlb2NvZGVyLmdldExvY2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsY3VsYXRlUm91dGUob3JpZ2luLCBlbGVtZW50KTtcdFx0XG5cdFx0XHRcdFx0XHRcdH0sIDUwMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0KGVycm9yKSA9PiB7IC8qVE9ETyovIGFsZXJ0KFwiTm8gZWxlbWVudCB3aXRoIHRoaXMgaWRcIik7IH1cblx0XHRcdFx0XHQpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBSZWFkeS5kbygoKSA9PiBcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y2FsY3VsYXRlUm91dGUob3JpZ2luLCBlbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBSZWFkeS5vZmYoKCkgPT4geyBjYWxjdWxhdGVSb3V0ZShvcmlnaW4sIGVsZW1lbnQpOyB9KTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR0aGlzLnNldE1vZGUoQXBwTW9kZXMuTWFwLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNhbGN1bGF0ZVJvdXRlKG9yaWdpbiwgZWxlbWVudCk7XG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH1cdFx0XHRcdFx0XG5cblx0XHRcdFx0YnJlYWs7XHRcdFx0XG5cdFx0fVxuXG5cdFx0aWYgKCEkYmFja0Zyb21IaXN0b3J5ICYmXG5cdFx0XHQgKCBvbGRTdGF0ZU5hbWUgIT09ICRuZXdTdGF0ZSBcblx0XHRcdFx0fHwgJG5ld1N0YXRlID09IEFwcFN0YXRlcy5TaG93RWxlbWVudFxuXHRcdFx0XHR8fCAkbmV3U3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmVcblx0XHRcdFx0fHwgJG5ld1N0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucykgKVxuXHRcdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnB1c2hOZXdTdGF0ZShvcHRpb25zKTtcblxuXHRcdHRoaXMudXBkYXRlRG9jdW1lbnRUaXRsZShvcHRpb25zKTtcblx0fTtcblxuXHRoYW5kbGVHZW9jb2RlUmVzdWx0KHJlc3VsdHMpXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiaGFuZGxlR2VvY29kZVJlc3VsdFwiLCByZXN1bHRzKTtcblx0XHQkKCcjZGlyZWN0b3J5LXNwaW5uZXItbG9hZGVyJykuaGlkZSgpO1x0XHRcblxuXHRcdC8vIGlmIGp1c3QgYWRkcmVzcyB3YXMgZ2l2ZW5cblx0XHRpZiAodGhpcy5tb2RlID09IEFwcE1vZGVzLk1hcClcblx0XHR7XG5cdFx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5Ob3JtYWwpO1xuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQuZml0Qm91bmRzKHRoaXMuZ2VvY29kZXIuZ2V0Qm91bmRzKCkpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5lbGVtZW50TW9kdWxlLmNsZWFyQ3VycmVudHNFbGVtZW50KCk7XG5cdFx0XHR0aGlzLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudFRvRGlzcGxheSh0cnVlLHRydWUpO1xuXHRcdFx0dGhpcy5hamF4TW9kdWxlLmdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24odGhpcy5nZW9jb2Rlci5nZXRMb2NhdGlvbigpLCAzMCk7XHRcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNYXJrZXJDbGljayhtYXJrZXIgOiBCaW9wZW5NYXJrZXIpXG5cdHtcblx0XHRpZiAoIHRoaXMubW9kZSAhPSBBcHBNb2Rlcy5NYXApIHJldHVybjtcblxuXHRcdHRoaXMuc2V0VGltZW91dENsaWNraW5nKCk7XG5cblx0XHRpZiAobWFya2VyLmlzSGFsZkhpZGRlbigpKSB0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5Ob3JtYWwpO1x0XG5cblx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZDogbWFya2VyLmdldElkKCkgfSk7XHRcdFxuXG5cdFx0aWYgKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlKVxuXHRcdHtcblx0XHRcdC8vQXBwLlNSQ01vZHVsZSgpLnNlbGVjdEVsZW1lbnRCeUlkKHRoaXMuaWRfKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNYXBJZGxlKClcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJBcHAgaGFuZGxlIG1hcCBpZGxlLCBtYXBMb2FkZWQgOiBcIiAsIHRoaXMubWFwQ29tcG9uZW50LmlzTWFwTG9hZGVkKTtcblxuXHRcdC8vIHNob3dpbmcgSW5mb0JhckNvbXBvbmVudCBtYWtlIHRoZSBtYXAgcmVzaXplZCBhbmQgc28gaWRsZSBpcyB0cmlnZ2VyZWQsIFxuXHRcdC8vIGJ1dCB3ZSdyZSBub3QgaW50ZXJlc3NlZCBpbiB0aGlzIGlkbGluZ1xuXHRcdC8vaWYgKHRoaXMuaXNTaG93aW5nSW5mb0JhckNvbXBvbmVudCkgcmV0dXJuO1xuXHRcdFxuXHRcdGlmICh0aGlzLm1vZGUgIT0gQXBwTW9kZXMuTWFwKSAgICAgcmV0dXJuO1xuXHRcdC8vaWYgKHRoaXMuc3RhdGUgICE9IEFwcFN0YXRlcy5Ob3JtYWwpICAgICByZXR1cm47XG5cblx0XHQvLyB3ZSBuZWVkIG1hcCB0byBiZSBsb2FkZWQgdG8gZ2V0IHRoZSByYWRpdXMgb2YgdGhlIHZpZXdwb3J0XG5cdFx0Ly8gYW5kIGdldCB0aGUgZWxlbWVudHMgaW5zaWRlXG5cdFx0aWYgKCF0aGlzLm1hcENvbXBvbmVudC5pc01hcExvYWRlZClcblx0XHR7XG5cdFx0XHR0aGlzLm1hcENvbXBvbmVudC5vbk1hcExvYWRlZC5kbygoKSA9PiB7dGhpcy5oYW5kbGVNYXBJZGxlKCk7IH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5tYXBDb21wb25lbnQub25NYXBMb2FkZWQub2ZmKCgpID0+IHt0aGlzLmhhbmRsZU1hcElkbGUoKTsgfSk7XG5cdFx0fVxuXG5cdFx0bGV0IHVwZGF0ZUluQWxsRWxlbWVudExpc3QgPSB0cnVlO1xuXHRcdGxldCBmb3JjZVJlcGFpbnQgPSBmYWxzZTtcblxuXHRcdGxldCB6b29tID0gdGhpcy5tYXBDb21wb25lbnRfLmdldFpvb20oKTtcblx0XHRsZXQgb2xkX3pvb20gPSB0aGlzLm1hcENvbXBvbmVudF8uZ2V0T2xkWm9vbSgpO1xuXG5cdFx0aWYgKHpvb20gIT0gb2xkX3pvb20gJiYgb2xkX3pvb20gIT0gLTEpICBcblx0XHR7XG5cdFx0XHRpZiAoem9vbSA+IG9sZF96b29tKSB1cGRhdGVJbkFsbEVsZW1lbnRMaXN0ID0gZmFsc2U7XHQgICBcdFx0XG5cdFx0XHRmb3JjZVJlcGFpbnQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIHNvbWV0aW1lcyBpZGxlIGV2ZW50IGlzIGZpcmVkIGJ1dCBtYXAgaXMgbm90IHlldCBpbml0aWFsaXplZCAoc29tZXMgbWlsbGlzZWNvbmRcblx0XHQvLyBhZnRlciBpdCB3aWxsIGJlKVxuXHRcdC8vIGxldCBkZWxheSA9IHRoaXMubWFwQ29tcG9uZW50LmlzTWFwTG9hZGVkID8gMCA6IDEwMDtcblx0XHQvLyBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFxuXHRcdC8vIH0sIGRlbGF5KTtcdFxuXG5cdFx0dGhpcy5lbGVtZW50TW9kdWxlLnVwZGF0ZUVsZW1lbnRUb0Rpc3BsYXkodXBkYXRlSW5BbGxFbGVtZW50TGlzdCwgZm9yY2VSZXBhaW50KTtcblx0XHR0aGlzLmFqYXhNb2R1bGUuZ2V0RWxlbWVudHNBcm91bmRMb2NhdGlvbihcblx0XHRcdHRoaXMubWFwQ29tcG9uZW50LmdldENlbnRlcigpLCBcblx0XHRcdHRoaXMubWFwQ29tcG9uZW50Lm1hcFJhZGl1c0luS20oKSAqIDJcblx0XHQpO1x0IFxuXG5cdFx0dGhpcy5oaXN0b3J5TW9kdWxlLnVwZGF0ZUN1cnJTdGF0ZSgpO1xuXHR9O1xuXG5cdGhhbmRsZU1hcENsaWNrKClcblx0e1xuXHRcdGlmICh0aGlzLmlzQ2xpY2tpbmcpIHJldHVybjtcblxuXHRcdC8vY29uc29sZS5sb2coXCJoYW5kbGUgTWFwIENsaWNrXCIsIEFwcFN0YXRlc1t0aGlzLnN0YXRlXSk7XG5cdFx0XG5cdFx0aWYgKHRoaXMuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50IHx8IHRoaXMuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUpXG5cdFx0XHR0aGlzLmluZm9CYXJDb21wb25lbnQuaGlkZSgpOyBcdFx0XG5cdFx0ZWxzZSBpZiAodGhpcy5zdGF0ZSA9PSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMpXG5cdFx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwgeyBpZCA6IEFwcC5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSB9KTtcdFx0XHRcdFxuXHR9O1xuICAgIFxuXG5cdGhhbmRsZVNlYXJjaEFjdGlvbihhZGRyZXNzIDogc3RyaW5nKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coXCJoYW5kbGUgc2VhcmNoIGFjdGlvblwiLCBhZGRyZXNzKTtcblx0XHRcblx0XHRcdHRoaXMuZ2VvY29kZXJNb2R1bGVfLmdlb2NvZGVBZGRyZXNzKFxuXHRcdFx0YWRkcmVzcywgXG5cdFx0XHQocmVzdWx0cyA6IEdlb2NvZGVSZXN1bHRbXSkgPT4gXG5cdFx0XHR7IFxuXHRcdFx0XHRzd2l0Y2ggKEFwcC5zdGF0ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLk5vcm1hbDpcdFxuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50Olx0XG5cdFx0XHRcdFx0XHR0aGlzLmhhbmRsZUdlb2NvZGVSZXN1bHQocmVzdWx0cyk7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZURvY3VtZW50VGl0bGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmU6XG5cdFx0XHRcdFx0XHR0aGlzLmluZm9CYXJDb21wb25lbnQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5oYW5kbGVHZW9jb2RlUmVzdWx0KHJlc3VsdHMpO1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVEb2N1bWVudFRpdGxlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcdFxuXHRcdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZShBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnMse2lkOiB0aGlzLmluZm9CYXJDb21wb25lbnQuZ2V0Q3VyckVsZW1lbnRJZCgpIH0pO1xuXHRcdFx0XHRcdFx0YnJlYWs7XHRcdFxuXHRcdFx0XHR9XHRcdFx0XHRcdFxuXHRcdFx0fVx0XG5cdFx0KTtcdFxuXHR9O1xuXHRcblxuXHRoYW5kbGVOZXdFbGVtZW50c1JlY2VpdmVkRnJvbVNlcnZlcihlbGVtZW50c0pzb24pXG5cdHtcblx0XHRpZiAoIWVsZW1lbnRzSnNvbiB8fCBlbGVtZW50c0pzb24ubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdFx0bGV0IG5ld2VsZW1lbnRzID0gdGhpcy5lbGVtZW50TW9kdWxlLmFkZEpzb25FbGVtZW50cyhlbGVtZW50c0pzb24sIHRydWUpO1xuXHRcdGlmIChuZXdlbGVtZW50cyA+IDApIHRoaXMuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50VG9EaXNwbGF5KCk7IFxuXHR9OyBcblxuXHRoYW5kbGVFbGVtZW50c0NoYW5nZWQocmVzdWx0IDogRWxlbWVudHNDaGFuZ2VkKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImhhbmRsZUVsZW1lbnRzQ2hhbmdlZCBuZXcgOiBcIiwgcmVzdWx0KTtcblxuXHRcdGlmICh0aGlzLm1vZGVfID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0e1xuXHRcdFx0dGhpcy5lbGVtZW50TGlzdENvbXBvbmVudC51cGRhdGUocmVzdWx0KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodGhpcy5zdGF0ZSAhPSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSlcblx0XHR7XG5cdFx0XHRmb3IobGV0IGVsZW1lbnQgb2YgcmVzdWx0Lm5ld0VsZW1lbnRzKVxuXHRcdFx0e1x0XHRcdFx0XG5cdFx0XHRcdGVsZW1lbnQuc2hvdygpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKGxldCBlbGVtZW50IG9mIHJlc3VsdC5lbGVtZW50c1RvUmVtb3ZlKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoIWVsZW1lbnQuaXNTaG93bkFsb25lKSBlbGVtZW50LmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07IFxuXG5cdGhhbmRsZUluZm9CYXJIaWRlKClcblx0e1xuXHRcdGlmICh0aGlzLnN0YXRlICE9IEFwcFN0YXRlcy5TdGFyUmVwcmVzZW50YXRpb25DaG9pY2UgJiYgdGhpcy5tb2RlXyAhPSBBcHBNb2Rlcy5MaXN0KSBcblx0XHR7XG5cdFx0XHR0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5Ob3JtYWwpO1xuXHRcdH1cblx0fTtcblxuXHRoYW5kbGVJbmZvQmFyU2hvdyhlbGVtZW50SWQpXG5cdHtcblx0XHQvL2xldCBzdGF0ZXNUb0F2b2lkID0gW0FwcFN0YXRlcy5TaG93RGlyZWN0aW9ucyxBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZSxBcHBTdGF0ZXMuU3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlXTtcblx0XHQvL2lmICgkLmluQXJyYXkodGhpcy5zdGF0ZSwgc3RhdGVzVG9Bdm9pZCkgPT0gLTEgKSB0aGlzLnNldFN0YXRlKEFwcFN0YXRlcy5TaG93RWxlbWVudCwge2lkOiBlbGVtZW50SWR9KTtcdFx0XG5cdH07XG5cblx0dXBkYXRlTWF4RWxlbWVudHMoKSBcblx0eyBcblx0XHR0aGlzLm1heEVsZW1lbnRzVG9TaG93T25NYXBfID0gTWF0aC5taW4oTWF0aC5mbG9vcigkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykud2lkdGgoKSAqICQoJyNkaXJlY3RvcnktY29udGVudC1tYXAnKS5oZWlnaHQoKSAvIDEwMDApLCAxMDAwKTtcblx0XHQvL3dpbmRvdy5jb25zb2xlLmxvZyhcInNldHRpbmcgbWF4IGVsZW1lbnRzIFwiICsgdGhpcy5tYXhFbGVtZW50c1RvU2hvd09uTWFwXyk7XG5cdH07XG5cblx0c2V0VGltZW91dENsaWNraW5nKCkgXG5cdHsgXG5cdFx0dGhpcy5pc0NsaWNraW5nXyA9IHRydWU7XG5cdFx0bGV0IHRoYXQgPSB0aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRoYXQuaXNDbGlja2luZ18gPSBmYWxzZTsgfSwgMTAwKTsgXG5cdH07XG5cblx0c2V0VGltZW91dEluZm9CYXJDb21wb25lbnQoKSBcblx0eyBcblx0XHR0aGlzLmlzU2hvd2luZ0luZm9CYXJDb21wb25lbnRfID0gdHJ1ZTtcblx0XHRsZXQgdGhhdCA9IHRoaXM7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhhdC5pc1Nob3dpbmdJbmZvQmFyQ29tcG9uZW50XyA9IGZhbHNlOyB9LCAxMzAwKTsgXG5cdH1cblxuXHR1cGRhdGVEb2N1bWVudFRpdGxlKG9wdGlvbnMgOiBhbnkgPSB7fSlcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJ1cGRhdGVEb2N1bWVudFRpdGxlXCIsIHRoaXMuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkpO1xuXG5cdFx0bGV0IHRpdGxlIDogc3RyaW5nO1xuXHRcdGxldCBlbGVtZW50TmFtZSA6IHN0cmluZztcblxuXHRcdGlmICggKG9wdGlvbnMgJiYgb3B0aW9ucy5pZCkgfHwgdGhpcy5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSkgXG5cdFx0e1xuXHRcdFx0XG5cdFx0XHRsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudEJ5SWQodGhpcy5pbmZvQmFyQ29tcG9uZW50LmdldEN1cnJFbGVtZW50SWQoKSk7XG5cdFx0XHRlbGVtZW50TmFtZSA9IGNhcGl0YWxpemUoZWxlbWVudCA/IGVsZW1lbnQubmFtZSA6ICcnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlXyA9PSBBcHBNb2Rlcy5MaXN0KVxuXHRcdHtcdFx0XG5cdFx0XHR0aXRsZSA9ICdMaXN0ZSBkZXMgYWN0ZXVycyAnICsgdGhpcy5nZXRMb2NhdGlvbkFkZHJlc3NGb3JUaXRsZSgpO1x0XHRcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHN3aXRjaCAodGhpcy5zdGF0ZV8pXG5cdFx0XHR7XG5cdFx0XHRcdGNhc2UgQXBwU3RhdGVzLlNob3dFbGVtZW50Olx0XHRcdFx0XG5cdFx0XHRcdFx0dGl0bGUgPSAnQWN0ZXVyIC0gJyArIGVsZW1lbnROYW1lO1xuXHRcdFx0XHRcdGJyZWFrO1x0XG5cblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZTpcblx0XHRcdFx0XHR0aXRsZSA9ICdBY3RldXIgLSAnICsgZWxlbWVudE5hbWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnM6XG5cdFx0XHRcdFx0dGl0bGUgPSAnSXRpbsOpcmFpcmUgLSAnICsgZWxlbWVudE5hbWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuTm9ybWFsOlx0XHRcdFxuXHRcdFx0XHRcdHRpdGxlID0gJ0NhcnRlIGRlcyBhY3RldXJzICcgKyB0aGlzLmdldExvY2F0aW9uQWRkcmVzc0ZvclRpdGxlKCk7XHRcdFx0XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcdFxuXHR9O1xuXG5cdHByaXZhdGUgZ2V0TG9jYXRpb25BZGRyZXNzRm9yVGl0bGUoKVxuXHR7XG5cdFx0aWYgKHRoaXMuZ2VvY29kZXIuZ2V0TG9jYXRpb25BZGRyZXNzKCkpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIFwiLSBcIiArIHRoaXMuZ2VvY29kZXIuZ2V0TG9jYXRpb25BZGRyZXNzKCk7XG5cdFx0fVxuXHRcdHJldHVybiBcIi0gRnJhbmNlXCI7XG5cdH1cblxuXG5cdC8vIEdldHRlcnMgc2hvcnRjdXRzXG5cdG1hcCgpIDogTC5NYXAgeyByZXR1cm4gdGhpcy5tYXBDb21wb25lbnRfPyB0aGlzLm1hcENvbXBvbmVudF8uZ2V0TWFwKCkgOiBudWxsOyB9O1xuXHRlbGVtZW50cygpIHsgcmV0dXJuIHRoaXMuZWxlbWVudHNNb2R1bGVfLmN1cnJWaXNpYmxlRWxlbWVudHMoKTsgIH07XG5cdGVsZW1lbnRCeUlkKGlkKSB7IHJldHVybiB0aGlzLmVsZW1lbnRzTW9kdWxlXy5nZXRFbGVtZW50QnlJZChpZCk7ICB9O1xuXHRjbHVzdGVyZXIoKSA6IGFueSB7IHJldHVybiB0aGlzLm1hcENvbXBvbmVudF8/IHRoaXMubWFwQ29tcG9uZW50Xy5nZXRDbHVzdGVyZXIoKSA6IG51bGw7IH07XG5cblx0Z2V0IGNvbnN0ZWxsYXRpb24oKSB7IHJldHVybiBudWxsOyB9XG5cblx0Z2V0IGN1cnJNYWluSWQoKSB7IHJldHVybiB0aGlzLmRpcmVjdG9yeU1lbnVDb21wb25lbnQuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZDsgfVxuXG5cdGdldCBpc0NsaWNraW5nKCkgeyByZXR1cm4gdGhpcy5pc0NsaWNraW5nXzsgfTtcblx0Z2V0IGlzU2hvd2luZ0luZm9CYXJDb21wb25lbnQoKSA6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1Nob3dpbmdJbmZvQmFyQ29tcG9uZW50XzsgfTtcblx0Z2V0IG1heEVsZW1lbnRzKCkgeyByZXR1cm4gdGhpcy5tYXhFbGVtZW50c1RvU2hvd09uTWFwXzsgfTtcblxuXHQvLyBNb2R1bGVzIGFuZCBjb21wb25lbnRzXG5cdGdldCBtYXBDb21wb25lbnQoKSB7IHJldHVybiB0aGlzLm1hcENvbXBvbmVudF87IH07XG5cdGdldCBpbmZvQmFyQ29tcG9uZW50KCkgeyByZXR1cm4gdGhpcy5pbmZvQmFyQ29tcG9uZW50XzsgfTtcblx0Z2V0IGdlb2NvZGVyKCkgeyByZXR1cm4gdGhpcy5nZW9jb2Rlck1vZHVsZV87IH07XG5cdGdldCBhamF4TW9kdWxlKCkgeyByZXR1cm4gdGhpcy5hamF4TW9kdWxlXzsgfTtcblx0Z2V0IGVsZW1lbnRNb2R1bGUoKSB7IHJldHVybiB0aGlzLmVsZW1lbnRzTW9kdWxlXzsgfTtcblx0Z2V0IGRpcmVjdGlvbnNNb2R1bGUoKSB7IHJldHVybiB0aGlzLmRpcmVjdGlvbnNNb2R1bGVfOyB9O1xuXHQvL2dldCBtYXJrZXJNb2R1bGUoKSB7IHJldHVybiB0aGlzLm1hcmtlck1vZHVsZV87IH07XG5cdGdldCBmaWx0ZXJNb2R1bGUoKSB7IHJldHVybiB0aGlzLmZpbHRlck1vZHVsZV87IH07XG5cdC8vZ2V0IFNSQ01vZHVsZSgpIHsgcmV0dXJuIHRoaXMuc3RhclJlcHJlc2VudGF0aW9uQ2hvaWNlTW9kdWxlXzsgfTtcblx0Z2V0IERFQU1vZHVsZSgpIHsgcmV0dXJuIHRoaXMuZGlzcGxheUVsZW1lbnRBbG9uZU1vZHVsZV87IH07XG5cdC8vZ2V0IGxpc3RFbGVtZW50TW9kdWxlKCkgeyByZXR1cm4gdGhpcy5saXN0RWxlbWVudE1vZHVsZV87IH07XG5cdGdldCBzdGF0ZSgpIHsgcmV0dXJuIHRoaXMuc3RhdGVfOyB9O1xuXHRnZXQgbW9kZSgpIHsgcmV0dXJuIHRoaXMubW9kZV87IH07XG5cbn0iLCJpbXBvcnQgeyBBcHBNb2R1bGUsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbi5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgZW51bSBDYXRlZ29yeU9wdGlvblRyZWVOb2RlVHlwZVxue1xuXHRPcHRpb24sXG5cdENhdGVnb3J5XG59XG5cbi8qKlxuKiBDbGFzcyByZXByZXNlbnRhdGluZyBhIE5vZGUgaW4gdGhlIERpcmVjdG9yeSBNZW51IFRyZWVcbipcbiogQSBDYXRlZ29yeU9wdGlvblRyZWVOb2RlIGNhbiBiZSBhIENhdGVnb3J5IG9yIGFuIE9wdGlvblxuKi9cbmV4cG9ydCBjbGFzcyBDYXRlZ29yeU9wdGlvblRyZWVOb2RlIFxue1xuXHRpZCA6IG51bWJlcjtcblxuXHRjaGlsZHJlbiA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVbXSA9IFtdO1xuXG5cdG93bmVySWQgOiBudW1iZXIgPSBudWxsO1xuXHQvLyBsJ2lkIGRlIGxhIG1haW5PcHRpb24sIG91IFwiYWxsXCIgcG91ciB1bmUgbWFpbk9wdGlvblxuXHRtYWluT3duZXJJZCA6IGFueSA9IG51bGw7XG5cblx0aXNDaGVja2VkIDogYm9vbGVhbiA9IHRydWU7XG5cdGlzRGlzYWJsZWQgOiBib29sZWFuID0gZmFsc2U7XHRcblxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIFRZUEUgOiBDYXRlZ29yeU9wdGlvblRyZWVOb2RlVHlwZSwgcHJpdmF0ZSBET01fSUQgOiBzdHJpbmcscHJpdmF0ZSBET01fQ0hFQ0tCT1hfSUQgOiBzdHJpbmcscHJpdmF0ZSBET01fQ0hJTERSRU5fQ0xBU1MgOiBzdHJpbmcpIHt9O1xuXG5cdGdldERvbSgpIHsgcmV0dXJuICQodGhpcy5ET01fSUQgKyB0aGlzLmlkKTsgfVxuXG5cdGdldERvbUNoZWNrYm94KCkgeyByZXR1cm4gJCh0aGlzLkRPTV9DSEVDS0JPWF9JRCArIHRoaXMuaWQpOyB9XG5cblx0Z2V0RG9tQ2hpbGRyZW4oKSB7IHJldHVybiB0aGlzLmdldERvbSgpLm5leHQodGhpcy5ET01fQ0hJTERSRU5fQ0xBU1MpO31cblxuXHRnZXRPd25lcigpIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSBcblx0eyBcblx0XHRpZiAodGhpcy5UWVBFID09IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLk9wdGlvbilcblx0XHRcdHJldHVybiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0Q2F0ZWdvcnlCeUlkKHRoaXMub3duZXJJZCk7IFxuXG5cdFx0aWYgKHRoaXMuVFlQRSA9PSBDYXRlZ29yeU9wdGlvblRyZWVOb2RlVHlwZS5DYXRlZ29yeSlcblx0XHRcdHJldHVybiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0T3B0aW9uQnlJZCh0aGlzLm93bmVySWQpOyBcblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJvdGVjdGVkIGRpc2FibGVkQ2hpbGRyZW4oKSA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGVbXSB7IHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlciggY2hpbGQgPT4gY2hpbGQuaXNEaXNhYmxlZCk7IH1cblxuXHRwcm90ZWN0ZWQgY2hlY2tlZENoaWxkcmVuKCkgOiBDYXRlZ29yeU9wdGlvblRyZWVOb2RlW10geyByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoIGNoaWxkID0+IGNoaWxkLmlzQ2hlY2tlZCk7IH1cblxuXHRpc09wdGlvbigpIHsgcmV0dXJuIHRoaXMuVFlQRSA9PSBDYXRlZ29yeU9wdGlvblRyZWVOb2RlVHlwZS5PcHRpb24gfVxuXG5cdGlzTWFpbk9wdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0c2V0Q2hlY2tlZChib29sIDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMuaXNDaGVja2VkID0gYm9vbDtcblx0XHR0aGlzLmdldERvbUNoZWNrYm94KCkucHJvcChcImNoZWNrZWRcIiwgYm9vbCk7XG5cdH1cblxuXHRzZXREaXNhYmxlZChib29sIDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMuaXNEaXNhYmxlZCA9IGJvb2w7XG5cdFx0aWYgKGJvb2wpXG5cdFx0e1xuXHRcdFx0aWYgKCF0aGlzLmdldERvbSgpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB0aGlzLmdldERvbSgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0dGhpcy5zZXRDaGVja2VkKGZhbHNlKTtcdFx0XHRcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tKCkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cblx0dG9nZ2xlKHZhbHVlIDogYm9vbGVhbiA9IG51bGwsIGh1bWFuQWN0aW9uIDogYm9vbGVhbiA9IHRydWUpXG5cdHtcdFx0XG5cdFx0XHRsZXQgY2hlY2s7XG5cdFx0XHRpZiAodmFsdWUgIT0gbnVsbCkgY2hlY2sgPSB2YWx1ZTtcblx0XHRcdGVsc2UgY2hlY2sgPSAhdGhpcy5pc0NoZWNrZWQ7XG5cblx0XHRcdHRoaXMuc2V0Q2hlY2tlZChjaGVjayk7XG5cdFx0XHR0aGlzLnNldERpc2FibGVkKCFjaGVjayk7XG5cblx0XHRcdC8vIGluIEFsbCBtb2RlLCB3ZSBjbGlja3MgZGlyZWN0bHkgb24gdGhlIG1haW5PcHRpb24sIGJ1dCBkb24ndCB3YW50IHRvIGFsbCBjaGVja2JveCBpbiBNYWluT3B0aW9uRmlsdGVyIHRvIGRpc2FibGVcblx0XHRcdGlmICghdGhpcy5pc01haW5PcHRpb24oKSkgXG5cdFx0XHR7XG5cdFx0XHRcdGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGNoaWxkLnRvZ2dsZShjaGVjaywgZmFsc2UpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5tYWluT3duZXJJZCA9PSAnb3BlbmhvdXJzJykgQXBwLmNhdGVnb3J5TW9kdWxlLnVwZGF0ZU9wZW5Ib3Vyc0ZpbHRlcigpO1xuXG5cdFx0XHRpZihodW1hbkFjdGlvbilcblx0XHRcdHtcblx0XHRcdFx0aWYgKHRoaXMuZ2V0T3duZXIoKSkgdGhpcy5nZXRPd25lcigpLnVwZGF0ZVN0YXRlKCk7XG5cblx0XHRcdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLk1hcCkgQXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlQ3VycmVudHNFbGVtZW50cygpO1xuXHRcdFx0XHRBcHAuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50VG9EaXNwbGF5KGNoZWNrKTtcblx0XHRcdFx0QXBwLmhpc3RvcnlNb2R1bGUudXBkYXRlQ3VyclN0YXRlKCk7XG5cdFx0XHR9XG5cdH1cblxuXHR1cGRhdGVTdGF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5pc01haW5PcHRpb24oKSkgcmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDApIFxuXHRcdFx0dGhpcy5zZXREaXNhYmxlZCghdGhpcy5pc0NoZWNrZWQpO1xuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgZGlzYWJsZWRDaGlsZHJlbkNvdW50ID0gdGhpcy5jaGlsZHJlbi5maWx0ZXIoIChjaGlsZCA6IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUpID0+IGNoaWxkLmlzRGlzYWJsZWQpLmxlbmd0aDtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIk9wdGlvbiBcIiArIHRoaXMubmFtZSArIFwiIHVwZGF0ZSBzdGF0ZSwgbmJyZSBjaGlsZHJlbiBkaXNhYmxlZCA9IFwiLCBkaXNhYmxlZENoaWxkcmVuQ291bnQpO1xuXG5cdFx0XHRpZiAoZGlzYWJsZWRDaGlsZHJlbkNvdW50ID09IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxuXHRcdFx0XHR0aGlzLnNldERpc2FibGVkKHRydWUpO1x0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuc2V0RGlzYWJsZWQoZmFsc2UpO1xuXG5cdFx0XHRsZXQgY2hlY2tlZENoaWxkcmVuQ291bnQgPSB0aGlzLmNoaWxkcmVuLmZpbHRlciggKGNoaWxkIDogQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSkgPT4gY2hpbGQuaXNDaGVja2VkKS5sZW5ndGg7XG5cblx0XHRcdGlmIChjaGVja2VkQ2hpbGRyZW5Db3VudCA9PSB0aGlzLmNoaWxkcmVuLmxlbmd0aClcblx0XHRcdFx0dGhpcy5zZXRDaGVja2VkKHRydWUpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLnNldENoZWNrZWQoZmFsc2UpXG5cdFx0fVx0XHRcblxuXHRcdGlmICh0aGlzLmdldE93bmVyKCkpICB0aGlzLmdldE93bmVyKCkudXBkYXRlU3RhdGUoKTtcdFxuXHR9XG5cblx0cmVjdXJzaXZlbHlVcGRhdGVTdGF0ZXMoKVxuXHR7XG5cdFx0Zm9yKGxldCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGNoaWxkLnJlY3Vyc2l2ZWx5VXBkYXRlU3RhdGVzKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVTdGF0ZSgpO1xuXHR9XG5cblx0aXNFeHBhbmRlZCgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldERvbSgpLmhhc0NsYXNzKCdleHBhbmRlZCcpOyB9XG5cblx0dG9nZ2xlQ2hpbGRyZW5EZXRhaWwoKVxuXHR7XG5cdFx0aWYgKHRoaXMuaXNFeHBhbmRlZCgpKVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tQ2hpbGRyZW4oKS5zdG9wKHRydWUsZmFsc2UpLnNsaWRlVXAoeyBkdXJhdGlvbjogMzUwLCBlYXNpbmc6IFwiZWFzZU91dFF1YXJ0XCIsIHF1ZXVlOiBmYWxzZSwgY29tcGxldGU6IGZ1bmN0aW9uKCkgeyQodGhpcykuY3NzKCdoZWlnaHQnLCAnJyk7fX0pO1xuXHRcdFx0dGhpcy5nZXREb20oKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuZ2V0RG9tQ2hpbGRyZW4oKS5zdG9wKHRydWUsZmFsc2UpLnNsaWRlRG93bih7IGR1cmF0aW9uOiAzNTAsIGVhc2luZzogXCJlYXNlT3V0UXVhcnRcIiwgcXVldWU6IGZhbHNlLCBjb21wbGV0ZTogZnVuY3Rpb24oKSB7JCh0aGlzKS5jc3MoJ2hlaWdodCcsICcnKTt9fSk7XG5cdFx0XHR0aGlzLmdldERvbSgpLmFkZENsYXNzKCdleHBhbmRlZCcpO1xuXHRcdH1cblx0fVxufSIsImltcG9ydCB7IENhdGVnb3J5LCBPcHRpb24sIE9wdGlvblZhbHVlfSBmcm9tIFwiLi9jbGFzc2VzXCI7XG5cbmV4cG9ydCBjbGFzcyBDYXRlZ29yeVZhbHVlXG57XG5cdGNhdGVnb3J5IDogQ2F0ZWdvcnk7XG5cdGNoaWxkcmVuIDogT3B0aW9uVmFsdWVbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGNhdGVnb3J5IDogQ2F0ZWdvcnkpXG5cdHtcblx0XHR0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHRcblx0fVxuXG5cdGFkZE9wdGlvblZhbHVlKG9wdGlvblZhbHVlIDogT3B0aW9uVmFsdWUpXG5cdHtcblx0XHR0aGlzLmNoaWxkcmVuLnB1c2gob3B0aW9uVmFsdWUpO1xuXHR9XG5cblx0Z2V0IGlzTGFzdENhdGVnb3J5RGVwdGgoKSA6IGJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLmNoaWxkcmVuLmV2ZXJ5KCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbi5zdWJjYXRlZ29yaWVzLmxlbmd0aCA9PSAwKTtcblx0fVxufSIsImltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi4vY2xhc3Nlcy9vcHRpb24uY2xhc3NcIjtcbmltcG9ydCB7IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUsIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlIH0gZnJvbSBcIi4vY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnkgZXh0ZW5kcyBDYXRlZ29yeU9wdGlvblRyZWVOb2RlXG57IFxuXHRuYW1lIDogc3RyaW5nO1xuXHRpbmRleDogbnVtYmVyO1xuXHRzaW5nbGVPcHRpb24gOiBib29sZWFuO1xuXHRlbmFibGVEZXNjcmlwdGlvbiA6IGJvb2xlYW47XG5cdGRpc3BsYXlDYXRlZ29yeU5hbWUgOiBib29sZWFuO1xuXHRkZXB0aCA6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcigkY2F0ZWdvcnlKc29uIDogYW55KVxuXHR7XG5cdFx0c3VwZXIoQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVR5cGUuQ2F0ZWdvcnksICcjY2F0ZWdvcnktJywgJyNzdWJjYXRlZ29yaWUtY2hlY2tib3gtJywgJy5vcHRpb25zLXdyYXBwZXInKTtcblxuXHRcdHRoaXMuaWQgPSAkY2F0ZWdvcnlKc29uLmlkO1xuXHRcdHRoaXMubmFtZSA9ICRjYXRlZ29yeUpzb24ubmFtZTtcblx0XHR0aGlzLmluZGV4ID0gJGNhdGVnb3J5SnNvbi5pbmRleDtcblx0XHR0aGlzLnNpbmdsZU9wdGlvbiA9ICRjYXRlZ29yeUpzb24uc2luZ2xlX29wdGlvbjtcblx0XHR0aGlzLmVuYWJsZURlc2NyaXB0aW9uID0gJGNhdGVnb3J5SnNvbi5lbmFibGVfZGVzY3JpcHRpb247XG5cdFx0dGhpcy5kaXNwbGF5Q2F0ZWdvcnlOYW1lID0gJGNhdGVnb3J5SnNvbi5kaXNwbGF5X2NhdGVnb3J5X25hbWU7XG5cdFx0dGhpcy5kZXB0aCA9ICRjYXRlZ29yeUpzb24uZGVwdGg7XG5cdFx0dGhpcy5tYWluT3duZXJJZCA9ICRjYXRlZ29yeUpzb24ubWFpbk93bmVySWQ7XG5cdH1cblxuXHRhZGRPcHRpb24oJG9wdGlvbiA6IE9wdGlvbikgeyB0aGlzLmNoaWxkcmVuLnB1c2goJG9wdGlvbik7IH1cblxuXHRnZXQgb3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmNoaWxkcmVuOyB9XG5cblx0Z2V0IGRpc2FibGVkT3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmRpc2FibGVkQ2hpbGRyZW4oKTsgfVxuXG5cdGdldCBjaGVja2VkT3B0aW9ucygpIDogT3B0aW9uW10geyByZXR1cm4gPE9wdGlvbltdPiB0aGlzLmNoZWNrZWRDaGlsZHJlbigpOyB9XG59XG4iLCJleHBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuL2NhdGVnb3J5LmNsYXNzXCI7XG5leHBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC5jbGFzc1wiO1xuZXhwb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9uLmNsYXNzXCI7XG5leHBvcnQgeyBPcHRpb25WYWx1ZSB9IGZyb20gXCIuL29wdGlvbi12YWx1ZS5jbGFzc1wiO1xuZXhwb3J0IHsgQ2F0ZWdvcnlWYWx1ZSB9IGZyb20gXCIuL2NhdGVnb3J5LXZhbHVlLmNsYXNzXCI7IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBCaW9wZW5NYXJrZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tYXAvYmlvcGVuLW1hcmtlci5jb21wb25lbnRcIjtcbmltcG9ydCB7IE9wdGlvblZhbHVlLCBDYXRlZ29yeVZhbHVlLCBPcHRpb24sIENhdGVnb3J5IH0gZnJvbSBcIi4vY2xhc3Nlc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIHZhciAkO1xuZGVjbGFyZSBsZXQgVHdpZyA6IGFueTtcbmRlY2xhcmUgbGV0IGJpb3Blbl90d2lnSnNfZWxlbWVudEluZm8gOiBhbnk7XG5cblxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBcbntcdFxuXHRyZWFkb25seSBpZCA6IHN0cmluZztcblx0cmVhZG9ubHkgbmFtZSA6IHN0cmluZztcblx0cmVhZG9ubHkgcG9zaXRpb24gOiBMLkxhdExuZztcblx0cmVhZG9ubHkgYWRkcmVzcyA6IHN0cmluZztcblx0cmVhZG9ubHkgZGVzY3JpcHRpb24gOiBzdHJpbmc7XG5cdHJlYWRvbmx5IHRlbCA6IHN0cmluZztcblx0cmVhZG9ubHkgd2ViU2l0ZSA6IHN0cmluZztcblx0cmVhZG9ubHkgbWFpbCA6IHN0cmluZztcblx0cmVhZG9ubHkgb3BlbkhvdXJzIDogYW55O1xuXHRyZWFkb25seSBvcGVuSG91cnNEYXlzIDogc3RyaW5nW10gPSBbXTtcblx0cmVhZG9ubHkgb3BlbkhvdXJzTW9yZUluZm9zIDogYW55O1xuXHRyZWFkb25seSBtYWluT3B0aW9uT3duZXJJZHMgOiBudW1iZXJbXSA9IFtdO1xuXG5cdG9wdGlvbnNWYWx1ZXMgOiBPcHRpb25WYWx1ZVtdID0gW107XG5cdG9wdGlvblZhbHVlc0J5Q2F0Z2VvcnkgOiBPcHRpb25WYWx1ZVtdW10gPSBbXTtcblxuXHRjb2xvck9wdGlvbklkIDogbnVtYmVyO1xuXHRwcml2YXRlIGljb25zVG9EaXNwbGF5IDogT3B0aW9uVmFsdWVbXSA9IFtdO1xuXHRwcml2YXRlIG9wdGlvblRyZWUgOiBPcHRpb25WYWx1ZTtcblxuXHRmb3JtYXRlZE9wZW5Ib3Vyc18gPSBudWxsO1xuXG5cdGRpc3RhbmNlIDogbnVtYmVyO1xuXG5cdGlzSW5pdGlhbGl6ZWRfIDpib29sZWFuID0gZmFsc2U7XG5cblx0Ly8gZm9yIGVsZW1lbnRzIG1vZHVsZSBhbGdvcml0aG1zXG5cdGlzRGlzcGxheWVkIDpib29sZWFuID0gZmFsc2U7XG5cblx0aXNWaXNpYmxlXyA6IGJvb2xlYW4gPSBmYWxzZTtcblx0aXNJbkVsZW1lbnRMaXN0IDogYm9vbGVhbj0gZmFsc2U7XG5cblx0Ly9UT0RPXG5cdGJpb3Blbk1hcmtlcl8gOiBCaW9wZW5NYXJrZXIgPSBudWxsO1xuXHRodG1sUmVwcmVzZW50YXRpb25fID0gJyc7XG5cblx0cHJvZHVjdHNUb0Rpc3BsYXlfIDogYW55ID0ge307XG5cblx0c3RhckNob2ljZUZvclJlcHJlc2VudGF0aW9uID0gJyc7XG5cdGlzU2hvd25BbG9uZSA6IGJvb2xlYW49IGZhbHNlO1xuXG5cdGlzRmF2b3JpdGUgOiBib29sZWFuPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcihlbGVtZW50SnNvbiA6IGFueSlcblx0e1xuXHRcdHRoaXMuaWQgPSBlbGVtZW50SnNvbi5pZDtcblx0XHR0aGlzLm5hbWUgPSBlbGVtZW50SnNvbi5uYW1lO1xuXHRcdHRoaXMucG9zaXRpb24gPSBMLmxhdExuZyhlbGVtZW50SnNvbi5sYXQsIGVsZW1lbnRKc29uLmxuZyk7XG5cdFx0dGhpcy5hZGRyZXNzID0gZWxlbWVudEpzb24uYWRkcmVzcztcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gZWxlbWVudEpzb24uZGVzY3JpcHRpb24gfHwgJyc7XG5cdFx0dGhpcy50ZWwgPSBlbGVtZW50SnNvbi50ZWwgPyBlbGVtZW50SnNvbi50ZWwucmVwbGFjZSgvKC57Mn0pKD8hJCkvZyxcIiQxIFwiKSA6ICcnO1x0XG5cdFx0dGhpcy53ZWJTaXRlID0gZWxlbWVudEpzb24ud2ViX3NpdGU7XG5cdFx0dGhpcy5tYWlsID0gZWxlbWVudEpzb24ubWFpbDtcblx0XHR0aGlzLm9wZW5Ib3VycyA9IGVsZW1lbnRKc29uLm9wZW5faG91cnM7XG5cdFx0dGhpcy5vcGVuSG91cnNNb3JlSW5mb3MgPSAgZWxlbWVudEpzb24ub3Blbl9ob3Vyc19tb3JlX2luZm9zO1xuXG5cdFx0Ly8gaW5pdGlhbGl6ZSBmb3JtYXRlZCBvcGVuIGhvdXJzXG5cdFx0dGhpcy5nZXRGb3JtYXRlZE9wZW5Ib3VycygpO1xuXG5cdFx0bGV0IG5ld09wdGlvbiA6IE9wdGlvblZhbHVlLCBvd25lcklkIDogbnVtYmVyO1xuXHRcdGZvciAobGV0IG9wdGlvblZhbHVlSnNvbiBvZiBlbGVtZW50SnNvbi5vcHRpb25fdmFsdWVzKVxuXHRcdHtcblx0XHRcdG5ld09wdGlvbiA9IG5ldyBPcHRpb25WYWx1ZShvcHRpb25WYWx1ZUpzb24pO1xuXG5cdFx0XHQvL293bmVySWQgPSBuZXdPcHRpb24ub3B0aW9uLm1haW5Pd25lcklkO1xuXHRcdFx0aWYgKG5ld09wdGlvbi5vcHRpb24uaXNNYWluT3B0aW9uKCkpIHRoaXMubWFpbk9wdGlvbk93bmVySWRzLnB1c2gobmV3T3B0aW9uLm9wdGlvbklkKTtcblx0XHRcdC8vaWYgKHRoaXMubWFpbk9wdGlvbk93bmVySWRzLmluZGV4T2Yob3duZXJJZCkgPT0gLTEpIFxuXG5cdFx0XHR0aGlzLm9wdGlvbnNWYWx1ZXMucHVzaChuZXdPcHRpb24pO1xuXG5cdFx0XHQvLyBwdXQgb3B0aW9ucyB2YWx1ZSBpbiBzcGVjaWZpYyBlYXN5IGFjY2Vzc2libGUgYXJyYXkgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxuXHRcdFx0aWYgKCF0aGlzLm9wdGlvblZhbHVlc0J5Q2F0Z2VvcnlbbmV3T3B0aW9uLm9wdGlvbi5vd25lcklkXSkgdGhpcy5vcHRpb25WYWx1ZXNCeUNhdGdlb3J5W25ld09wdGlvbi5vcHRpb24ub3duZXJJZF0gPSBbXTtcblx0XHRcdHRoaXMub3B0aW9uVmFsdWVzQnlDYXRnZW9yeVtuZXdPcHRpb24ub3B0aW9uLm93bmVySWRdLnB1c2gobmV3T3B0aW9uKTtcblx0XHR9XG5cblx0XHR0aGlzLmRpc3RhbmNlID0gZWxlbWVudEpzb24uZGlzdGFuY2UgPyBNYXRoLnJvdW5kKGVsZW1lbnRKc29uLmRpc3RhbmNlKSA6IG51bGw7XHRcblxuXHR9XHRcblxuXHRnZXRPcHRpb25WYWx1ZUJ5Q2F0ZWdvcnlJZCgkY2F0ZWdvcnlJZClcblx0e1xuXHRcdHJldHVybiB0aGlzLm9wdGlvblZhbHVlc0J5Q2F0Z2VvcnlbJGNhdGVnb3J5SWRdIHx8IFtdO1xuXHR9XHRcblxuXHRpbml0aWFsaXplKCkgXG5cdHtcdFx0XG5cdFx0aWYgKCF0aGlzLmlzSW5pdGlhbGl6ZWRfKSBcblx0XHR7XG5cdFx0XHR0aGlzLmNyZWF0ZU9wdGlvbnNUcmVlKCk7XG5cdFx0XHR0aGlzLnVwZGF0ZUljb25zVG9EaXNwbGF5KCk7XG5cblx0XHRcdHRoaXMuYmlvcGVuTWFya2VyXyA9IG5ldyBCaW9wZW5NYXJrZXIodGhpcy5pZCwgdGhpcy5wb3NpdGlvbik7XG5cdFx0XHR0aGlzLmlzSW5pdGlhbGl6ZWRfID0gdHJ1ZTtcblx0XHR9XHRcdFxuXHR9XG5cblx0c2hvdygpIFxuXHR7XHRcdFxuXHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0Ly90aGlzLmJpb3Blbk1hcmtlcl8udXBkYXRlKCk7XG5cdFx0dGhpcy5iaW9wZW5NYXJrZXJfLnNob3coKTtcblx0XHR0aGlzLmlzVmlzaWJsZV8gPSB0cnVlO1x0XHRcblx0fTtcblxuXHRoaWRlKCkgXG5cdHtcdFx0XG5cdFx0aWYgKHRoaXMuYmlvcGVuTWFya2VyXykgdGhpcy5iaW9wZW5NYXJrZXJfLmhpZGUoKTtcblx0XHR0aGlzLmlzVmlzaWJsZV8gPSBmYWxzZTtcblx0XHQvLyB1bmJvdW5kIGV2ZW50cyAoY2xpY2sgZXRjLi4uKT9cblx0XHQvL2lmIChjb25zdGVsbGF0aW9uTW9kZSkgJCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgI2VsZW1lbnQtaW5mby0nK3RoaXMuaWQpLmhpZGUoKTtcblx0fTtcblxuXHR1cGRhdGUoKVxuXHR7XG5cdFx0aWYgKCF0aGlzLmlzSW5pdGlhbGl6ZWRfKSB0aGlzLmluaXRpYWxpemUoKTtcdFxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLnVwZGF0ZUljb25zVG9EaXNwbGF5KCk7XG5cdFx0XHRpZiAodGhpcy5tYXJrZXIpIHRoaXMubWFya2VyLnVwZGF0ZSgpO1xuXHRcdH1cdFx0XG5cdH1cblxuXHRnZXRDdXJyT3B0aW9uc1ZhbHVlcygpIDogT3B0aW9uVmFsdWVbXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9uc1ZhbHVlcy5maWx0ZXIoIChvcHRpb25WYWx1ZSkgPT4gb3B0aW9uVmFsdWUub3B0aW9uLm1haW5Pd25lcklkID09IEFwcC5jdXJyTWFpbklkKTtcblx0fVxuXG5cdGdldEN1cnJNYWluT3B0aW9uVmFsdWUoKSA6IE9wdGlvblZhbHVlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zVmFsdWVzLmZpbHRlciggKG9wdGlvblZhbHVlKSA9PiBvcHRpb25WYWx1ZS5vcHRpb24uaWQgPT0gQXBwLmN1cnJNYWluSWQpLnNoaWZ0KCk7XG5cdH1cblxuXHRnZXRDYXRlZ29yaWVzSWRzKCkgOiBudW1iZXJbXVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0Q3Vyck9wdGlvbnNWYWx1ZXMoKS5tYXAoIChvcHRpb25WYWx1ZSkgPT4gb3B0aW9uVmFsdWUuY2F0ZWdvcnlPd25lci5pZCkuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+IHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4KTtcblx0fVxuXG5cdGdldE9wdGlvbnNJZHNJbkNhdGVnb3JpZUlkKGNhdGVnb3J5SWQpIDogbnVtYmVyW11cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldEN1cnJPcHRpb25zVmFsdWVzKCkuZmlsdGVyKCAob3B0aW9uVmFsdWUpID0+IG9wdGlvblZhbHVlLm9wdGlvbi5vd25lcklkID09IGNhdGVnb3J5SWQpLm1hcCggKG9wdGlvblZhbHVlKSA9PiBvcHRpb25WYWx1ZS5vcHRpb25JZCk7XG5cdH1cblxuXHRjcmVhdGVPcHRpb25zVHJlZSgpXG5cdHtcblx0XHR0aGlzLm9wdGlvblRyZWUgPSBuZXcgT3B0aW9uVmFsdWUoe30pO1xuXHRcdGxldCBtYWluQ2F0ZWdvcnkgPSBBcHAuY2F0ZWdvcnlNb2R1bGUubWFpbkNhdGVnb3J5O1xuXG5cdFx0dGhpcy5yZWN1c2l2ZWx5Q3JlYXRlT3B0aW9uVHJlZShtYWluQ2F0ZWdvcnksIHRoaXMub3B0aW9uVHJlZSk7XG5cdH1cblxuXHRnZXRPcHRpb25UcmVlKClcblx0e1xuXHRcdGlmICh0aGlzLm9wdGlvblRyZWUpIHJldHVybiB0aGlzLm9wdGlvblRyZWU7XG5cdFx0dGhpcy5jcmVhdGVPcHRpb25zVHJlZSgpO1xuXHRcdHJldHVybiB0aGlzLm9wdGlvblRyZWU7XG5cdH1cblxuXHRwcml2YXRlIHJlY3VzaXZlbHlDcmVhdGVPcHRpb25UcmVlKGNhdGVnb3J5IDogQ2F0ZWdvcnksIG9wdGlvblZhbHVlIDogT3B0aW9uVmFsdWUpXG5cdHtcblx0XHRsZXQgY2F0ZWdvcnlWYWx1ZSA9IG5ldyBDYXRlZ29yeVZhbHVlKGNhdGVnb3J5KTtcblxuXHRcdGZvcihsZXQgb3B0aW9uIG9mIGNhdGVnb3J5Lm9wdGlvbnMpXG5cdFx0e1xuXHRcdFx0bGV0IGNoaWxkT3B0aW9uVmFsdWUgPSB0aGlzLmZpbGxPcHRpb25JZChvcHRpb24uaWQpO1xuXHRcdFx0aWYgKGNoaWxkT3B0aW9uVmFsdWUpXG5cdFx0XHR7XG5cdFx0XHRcdGNhdGVnb3J5VmFsdWUuYWRkT3B0aW9uVmFsdWUoY2hpbGRPcHRpb25WYWx1ZSk7XG5cdFx0XHRcdGZvcihsZXQgc3ViY2F0ZWdvcnkgb2Ygb3B0aW9uLnN1YmNhdGVnb3JpZXMpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnJlY3VzaXZlbHlDcmVhdGVPcHRpb25UcmVlKHN1YmNhdGVnb3J5LCBjaGlsZE9wdGlvblZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXHRcdH1cblxuXHRcdGlmIChjYXRlZ29yeVZhbHVlLmNoaWxkcmVuLmxlbmd0aCA+IDApXG5cdFx0e1xuXHRcdFx0Y2F0ZWdvcnlWYWx1ZS5jaGlsZHJlbi5zb3J0KCAoYSxiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cdFx0XHRvcHRpb25WYWx1ZS5hZGRDYXRlZ29yeVZhbHVlKGNhdGVnb3J5VmFsdWUpO1xuXHRcdH0gXG5cdH1cblxuXHRmaWxsT3B0aW9uSWQoJG9wdGlvbklkIDogbnVtYmVyKSA6IE9wdGlvblZhbHVlXG5cdHtcblx0XHRsZXQgaW5kZXggPSB0aGlzLm9wdGlvbnNWYWx1ZXMubWFwKCh2YWx1ZSkgPT4gdmFsdWUub3B0aW9uSWQpLmluZGV4T2YoJG9wdGlvbklkKTtcblx0XHRpZiAoaW5kZXggPT0gLTEpIHJldHVybiBudWxsO1xuXHRcdHJldHVybiB0aGlzLm9wdGlvbnNWYWx1ZXNbaW5kZXhdO1xuXHR9XG5cblx0Z2V0SWNvbnNUb0Rpc3BsYXkoKSA6IE9wdGlvblZhbHVlW11cblx0e1xuXHRcdGxldCByZXN1bHQgPSB0aGlzLmljb25zVG9EaXNwbGF5O1xuXHRcdHJldHVybiByZXN1bHQuc29ydCggKGEsYikgPT4gYS5pc0ZpbGxlZEJ5RmlsdGVycyA/IC0xIDogMSk7XG5cdH1cblxuXHR1cGRhdGVJY29uc1RvRGlzcGxheSgpIFxuXHR7XHRcdFxuXHRcdHRoaXMuY2hlY2tGb3JEaXNhYmxlZE9wdGlvblZhbHVlcygpO1xuXG5cdFx0aWYgKEFwcC5jdXJyTWFpbklkID09ICdhbGwnKVxuXHRcdFx0dGhpcy5pY29uc1RvRGlzcGxheSA9IHRoaXMucmVjdXJzaXZlbHlTZWFyY2hJY29uc1RvRGlzcGxheSh0aGlzLmdldE9wdGlvblRyZWUoKSwgZmFsc2UpO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMuaWNvbnNUb0Rpc3BsYXkgPSB0aGlzLnJlY3Vyc2l2ZWx5U2VhcmNoSWNvbnNUb0Rpc3BsYXkodGhpcy5nZXRDdXJyTWFpbk9wdGlvblZhbHVlKCkpO1xuXG5cdFx0Ly8gaW4gY2FzZSBvZiBubyBPcHRpb25WYWx1ZSBpbiB0aGlzIG1haW5PcHRpb24sIHdlIGRpc3BsYXkgdGhlIG1haW5PcHRpb24gSWNvblxuXHRcdGlmICh0aGlzLmljb25zVG9EaXNwbGF5Lmxlbmd0aCA9PSAwKVxuXHRcdHtcblx0XHRcdHRoaXMuaWNvbnNUb0Rpc3BsYXkucHVzaCh0aGlzLmdldEN1cnJNYWluT3B0aW9uVmFsdWUoKSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb2xvck9wdGlvbklkID0gdGhpcy5pY29uc1RvRGlzcGxheS5sZW5ndGggPiAwID8gdGhpcy5nZXRJY29uc1RvRGlzcGxheSgpWzBdLm9wdGlvbi5vd25lckNvbG9ySWQgOiBudWxsO1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coXCJJY29ucyB0byBkaXNwbGF5IHNvcnRlZFwiLCB0aGlzLmdldEljb25zVG9EaXNwbGF5KCkpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWN1cnNpdmVseVNlYXJjaEljb25zVG9EaXNwbGF5KHBhcmVudE9wdGlvblZhbHVlIDogT3B0aW9uVmFsdWUsIHJlY3Vyc2l2ZSA6IGJvb2xlYW4gPSB0cnVlKSA6IE9wdGlvblZhbHVlW11cblx0e1xuXHRcdGlmICghcGFyZW50T3B0aW9uVmFsdWUpIHJldHVybiBbXTtcblxuXHRcdGxldCByZXN1bHRPcHRpb25zIDogT3B0aW9uVmFsdWVbXSA9IFtdO1x0XHRcblxuXHRcdGZvcihsZXQgY2F0ZWdvcnlWYWx1ZSBvZiBwYXJlbnRPcHRpb25WYWx1ZS5jaGlsZHJlbilcblx0XHR7XG5cdFx0XHRmb3IobGV0IG9wdGlvblZhbHVlIG9mIGNhdGVnb3J5VmFsdWUuY2hpbGRyZW4pXG5cdFx0XHR7XG5cdFx0XHRcdGxldCByZXN1bHQgPSBbXTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChyZWN1cnNpdmUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXN1bHQgPSB0aGlzLnJlY3Vyc2l2ZWx5U2VhcmNoSWNvbnNUb0Rpc3BsYXkob3B0aW9uVmFsdWUpIHx8IFtdO1xuXHRcdFx0XHRcdHJlc3VsdE9wdGlvbnMgPSByZXN1bHRPcHRpb25zLmNvbmNhdChyZXN1bHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMCAmJiBvcHRpb25WYWx1ZS5vcHRpb24udXNlSWNvbkZvck1hcmtlcilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJlc3VsdE9wdGlvbnMucHVzaChvcHRpb25WYWx1ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcHRpb25WYWx1ZVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0T3B0aW9ucztcblx0fVxuXG5cdGNoZWNrRm9yRGlzYWJsZWRPcHRpb25WYWx1ZXMoKVxuXHR7XG5cdFx0dGhpcy5yZWN1cnNpdmVseUNoZWNrRm9yRGlzYWJsZWRPcHRpb25WYWx1ZXModGhpcy5nZXRPcHRpb25UcmVlKCkpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWN1cnNpdmVseUNoZWNrRm9yRGlzYWJsZWRPcHRpb25WYWx1ZXMob3B0aW9uVmFsdWUgOiBPcHRpb25WYWx1ZSlcblx0e1xuXHRcdGxldCBpc0V2ZXJ5Q2F0ZWdvcnlDb250YWluc09uZU9wdGlvbk5vdGRpc2FibGVkID0gdHJ1ZTtcblxuXHRcdGZvcihsZXQgY2F0ZWdvcnlWYWx1ZSBvZiBvcHRpb25WYWx1ZS5jaGlsZHJlbilcblx0XHR7XG5cdFx0XHRsZXQgaXNTb21lT3B0aW9uTm90ZGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdGZvciAobGV0IHN1Ym9wdGlvblZhbHVlIG9mIGNhdGVnb3J5VmFsdWUuY2hpbGRyZW4pXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChzdWJvcHRpb25WYWx1ZS5jaGlsZHJlbi5sZW5ndGggPT0gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJib3R0b20gb3B0aW9uIFwiICsgc3Vib3B0aW9uVmFsdWUub3B0aW9uLm5hbWUsc3Vib3B0aW9uVmFsdWUub3B0aW9uLmlzQ2hlY2tlZCApO1xuXHRcdFx0XHRcdHN1Ym9wdGlvblZhbHVlLmlzRmlsbGVkQnlGaWx0ZXJzID0gc3Vib3B0aW9uVmFsdWUub3B0aW9uLmlzQ2hlY2tlZDtcdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5yZWN1cnNpdmVseUNoZWNrRm9yRGlzYWJsZWRPcHRpb25WYWx1ZXMoc3Vib3B0aW9uVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdWJvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycykgaXNTb21lT3B0aW9uTm90ZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFpc1NvbWVPcHRpb25Ob3RkaXNhYmxlZCkgaXNFdmVyeUNhdGVnb3J5Q29udGFpbnNPbmVPcHRpb25Ob3RkaXNhYmxlZCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25WYWx1ZS5vcHRpb24pXG5cdFx0e1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIk9wdGlvblZhbHVlIFwiICsgb3B0aW9uVmFsdWUub3B0aW9uLm5hbWUgKyBcImlzRXZlcnlDYXRlZ295ckNvbnRhaW5Pbk9wdGlvblwiLCBpc0V2ZXJ5Q2F0ZWdvcnlDb250YWluc09uZU9wdGlvbk5vdGRpc2FibGVkICk7XG5cdFx0XHRvcHRpb25WYWx1ZS5pc0ZpbGxlZEJ5RmlsdGVycyA9IGlzRXZlcnlDYXRlZ29yeUNvbnRhaW5zT25lT3B0aW9uTm90ZGlzYWJsZWQ7XG5cdFx0XHRpZiAoIW9wdGlvblZhbHVlLmlzRmlsbGVkQnlGaWx0ZXJzKSBvcHRpb25WYWx1ZS5zZXRSZWN1cnNpdmVseUZpbGxlZEJ5RmlsdGVycyhmYWxzZSk7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlUHJvZHVjdHNSZXByZXNlbnRhdGlvbigpIFxuXHR7XHRcdFxuXHRcdC8vIGlmIChBcHAuc3RhdGUgIT09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSByZXR1cm47XG5cblx0XHQvLyBsZXQgc3Rhck5hbWVzID0gQXBwLmNvbnN0ZWxsYXRpb24uZ2V0U3Rhck5hbWVzUmVwcmVzZW50ZWRCeUVsZW1lbnRJZCh0aGlzLmlkKTtcblx0XHQvLyBpZiAodGhpcy5pc1Byb2R1Y3RldXJPckFtYXAoKSlcblx0XHQvLyB7XG5cdFx0Ly8gXHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9kdWN0cy5sZW5ndGg7aSsrKVxuXHRcdC8vIFx0e1xuXHRcdC8vIFx0XHRwcm9kdWN0TmFtZSA9IHRoaXMucHJvZHVjdHNbaV0ubmFtZUZvcm1hdGU7XHRcdFx0XG5cblx0XHQvLyBcdFx0aWYgKCQuaW5BcnJheShwcm9kdWN0TmFtZSwgc3Rhck5hbWVzKSA9PSAtMSlcblx0XHQvLyBcdFx0e1xuXHRcdC8vIFx0XHRcdHRoaXMucHJvZHVjdHNbaV0uZGlzYWJsZWQgPSB0cnVlO1x0XHRcdFx0XG5cdFx0Ly8gXHRcdFx0aWYgKHByb2R1Y3ROYW1lID09IHRoaXMubWFpblByb2R1Y3QpIHRoaXMubWFpblByb2R1Y3RJc0Rpc2FibGVkID0gdHJ1ZTtcdFx0XHRcdFxuXHRcdC8vIFx0XHR9XHRcblx0XHQvLyBcdFx0ZWxzZVxuXHRcdC8vIFx0XHR7XG5cdFx0Ly8gXHRcdFx0dGhpcy5wcm9kdWN0c1tpXS5kaXNhYmxlZCA9IGZhbHNlO1x0XHRcdFx0XG5cdFx0Ly8gXHRcdFx0aWYgKHByb2R1Y3ROYW1lID09IHRoaXMubWFpblByb2R1Y3QpIHRoaXMubWFpblByb2R1Y3RJc0Rpc2FibGVkID0gZmFsc2U7XHRcdFxuXHRcdC8vIFx0XHR9XHRcdFxuXHRcdC8vIFx0fVxuXHRcdC8vIH1cblx0XHQvLyBlbHNlXG5cdFx0Ly8ge1xuXHRcdC8vIFx0aWYgKHN0YXJOYW1lcy5sZW5ndGggPT09IDApIHRoaXMubWFpblByb2R1Y3RJc0Rpc2FibGVkID0gdHJ1ZTtcdFxuXHRcdC8vIFx0ZWxzZSB0aGlzLm1haW5Qcm9kdWN0SXNEaXNhYmxlZCA9IGZhbHNlO1x0XG5cdFx0Ly8gfVxuXHR9O1xuXG5cdHVwZGF0ZURpc3RhbmNlKClcblx0e1xuXHRcdHRoaXMuZGlzdGFuY2UgPSBudWxsO1xuXHRcdGlmIChBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKSkgXG5cdFx0XHR0aGlzLmRpc3RhbmNlID0gQXBwLm1hcENvbXBvbmVudC5kaXN0YW5jZUZyb21Mb2NhdGlvblRvKHRoaXMucG9zaXRpb24pO1xuXHRcdGVsc2UgaWYgKEFwcC5tYXBDb21wb25lbnQuZ2V0Q2VudGVyKCkpXG5cdFx0XHR0aGlzLmRpc3RhbmNlID0gQXBwLm1hcENvbXBvbmVudC5nZXRDZW50ZXIoKS5kaXN0YW5jZVRvKHRoaXMucG9zaXRpb24pO1xuXHRcdC8vIGRpc3RhbmNlIHZvbCBkJ29pc2VhdSwgb24gYXJyb25kaSBldCBvbiBsJ2F1Z21lbnRlIHVuIHBldVxuXHRcdHRoaXMuZGlzdGFuY2UgPSB0aGlzLmRpc3RhbmNlID8gTWF0aC5yb3VuZCgxLjIqdGhpcy5kaXN0YW5jZSkgOiBudWxsO1xuXHR9XG5cblx0Z2V0SHRtbFJlcHJlc2VudGF0aW9uKCkgXG5cdHtcdFxuXHRcdHRoaXMudXBkYXRlKCk7XHRcblx0XHQvL2xldCBzdGFyTmFtZXMgPSBBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24gPyBBcHAuY29uc3RlbGxhdGlvbi5nZXRTdGFyTmFtZXNSZXByZXNlbnRlZEJ5RWxlbWVudElkKHRoaXMuaWQpIDogW107XG5cdFx0bGV0IHN0YXJOYW1lcyA6IGFueVtdID0gW107XG5cblx0XHRsZXQgb3B0aW9uc3RvRGlzcGxheSA9IHRoaXMuZ2V0SWNvbnNUb0Rpc3BsYXkoKTtcblxuXHRcdC8vY29uc29sZS5sb2coXCJHZXRIdG1sUmVwcmVzZW50YXRpb24gXCIgKyB0aGlzLmRpc3RhbmNlICsgXCIga21cIiwgdGhpcy5nZXRPcHRpb25UcmVlKCkuY2hpbGRyZW5bMF0pO1xuXG5cdFx0bGV0IGh0bWwgPSBUd2lnLnJlbmRlcihiaW9wZW5fdHdpZ0pzX2VsZW1lbnRJbmZvLCBcblx0XHR7XG5cdFx0XHRlbGVtZW50IDogdGhpcywgXG5cdFx0XHRzaG93RGlzdGFuY2U6IEFwcC5nZW9jb2Rlci5nZXRMb2NhdGlvbigpID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdFx0bGlzdGluZ01vZGU6IEFwcC5tb2RlID09IEFwcE1vZGVzLkxpc3QsIFxuXHRcdFx0b3B0aW9uc1RvRGlzcGxheTogb3B0aW9uc3RvRGlzcGxheSxcblx0XHRcdG1haW5PcHRpb25WYWx1ZVRvRGlzcGxheTogb3B0aW9uc3RvRGlzcGxheVswXSwgXG5cdFx0XHRvdGhlck9wdGlvbnNWYWx1ZXNUb0Rpc3BsYXk6IG9wdGlvbnN0b0Rpc3BsYXkuc2xpY2UoMSksICBcblx0XHRcdHN0YXJOYW1lcyA6IHN0YXJOYW1lcyxcblx0XHRcdG1haW5DYXRlZ29yeVZhbHVlIDogdGhpcy5nZXRPcHRpb25UcmVlKCkuY2hpbGRyZW5bMF0sXG5cdFx0fSk7XG5cblx0XHRcblx0XHR0aGlzLmh0bWxSZXByZXNlbnRhdGlvbl8gPSBodG1sO1x0XHRcdFx0XG5cdFx0cmV0dXJuIGh0bWw7XG5cdH07XG5cblx0Z2V0Rm9ybWF0ZWRPcGVuSG91cnMoKSBcblx0e1x0XHRcblx0XHRpZiAodGhpcy5mb3JtYXRlZE9wZW5Ib3Vyc18gPT09IG51bGwgKVxuXHRcdHtcdFx0XG5cdFx0XHR0aGlzLmZvcm1hdGVkT3BlbkhvdXJzXyA9IHt9O1xuXHRcdFx0bGV0IG5ld19rZXksIG5ld19rZXlfdHJhbnNsYXRlZCwgbmV3RGFpbHlTbG90O1xuXHRcdFx0Zm9yKGxldCBrZXkgaW4gdGhpcy5vcGVuSG91cnMpXG5cdFx0XHR7XG5cdFx0XHRcdG5ld19rZXkgPSBrZXkuc3BsaXQoJ18nKVsxXTtcblx0XHRcdFx0bmV3X2tleV90cmFuc2xhdGVkID0gdGhpcy50cmFuc2xhdGVEYXlLZXkobmV3X2tleSk7XHRcdFx0XHRcblx0XHRcdFx0bmV3RGFpbHlTbG90ID0gdGhpcy5mb3JtYXRlRGFpbHlUaW1lU2xvdCh0aGlzLm9wZW5Ib3Vyc1trZXldKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChuZXdEYWlseVNsb3QpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmZvcm1hdGVkT3BlbkhvdXJzX1tuZXdfa2V5X3RyYW5zbGF0ZWRdID0gbmV3RGFpbHlTbG90O1xuXHRcdFx0XHRcdHRoaXMub3BlbkhvdXJzRGF5cy5wdXNoKG5ld19rZXlfdHJhbnNsYXRlZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZm9ybWF0ZWRPcGVuSG91cnNfO1xuXHR9O1xuXG5cdHByaXZhdGUgdHJhbnNsYXRlRGF5S2V5KGRheUtleSlcblx0e1xuXHRcdHN3aXRjaChkYXlLZXkpXG5cdFx0e1xuXHRcdFx0Y2FzZSAnbW9uZGF5JzogcmV0dXJuICdsdW5kaSc7XG5cdFx0XHRjYXNlICd0dWVzZGF5JzogcmV0dXJuICdtYXJkaSc7XG5cdFx0XHRjYXNlICd3ZWRuZXNkYXknOiByZXR1cm4gJ21lcmNyZWRpJztcblx0XHRcdGNhc2UgJ3RodXJzZGF5JzogcmV0dXJuICdqZXVkaSc7XG5cdFx0XHRjYXNlICdmcmlkYXknOiByZXR1cm4gJ3ZlbmRyZWRpJztcblx0XHRcdGNhc2UgJ3NhdHVyZGF5JzogcmV0dXJuICdzYW1lZGknO1xuXHRcdFx0Y2FzZSAnc3VuZGF5JzogcmV0dXJuICdkaW1hbmNoZSc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cblx0cHJpdmF0ZSBmb3JtYXRlRGFpbHlUaW1lU2xvdChkYWlseVNsb3QpIFxuXHR7XHRcdFxuXHRcdGlmIChkYWlseVNsb3QgPT09IG51bGwpXG5cdFx0e1x0XHRcblx0XHRcdHJldHVybiAnZmVybcOpJztcblx0XHR9XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGlmIChkYWlseVNsb3Quc2xvdDFzdGFydClcblx0XHR7XG5cdFx0XHRyZXN1bHQrPSB0aGlzLmZvcm1hdGVEYXRlKGRhaWx5U2xvdC5zbG90MXN0YXJ0KTtcblx0XHRcdHJlc3VsdCs9ICcgLSAnO1xuXHRcdFx0cmVzdWx0Kz0gdGhpcy5mb3JtYXRlRGF0ZShkYWlseVNsb3Quc2xvdDFlbmQpO1xuXHRcdH1cblx0XHRpZiAoZGFpbHlTbG90LnNsb3Qyc3RhcnQpXG5cdFx0e1xuXHRcdFx0cmVzdWx0Kz0gJyBldCAnO1xuXHRcdFx0cmVzdWx0Kz0gdGhpcy5mb3JtYXRlRGF0ZShkYWlseVNsb3Quc2xvdDJzdGFydCk7XG5cdFx0XHRyZXN1bHQrPSAnIC0gJztcblx0XHRcdHJlc3VsdCs9IHRoaXMuZm9ybWF0ZURhdGUoZGFpbHlTbG90LnNsb3QyZW5kKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRmb3JtYXRlRGF0ZShkYXRlKSBcblx0e1x0XHRcblx0XHRpZiAoIWRhdGUpIHJldHVybjtcblx0XHRyZXR1cm4gZGF0ZS5zcGxpdCgnVCcpWzFdLnNwbGl0KCc6MDArMDEwMCcpWzBdO1xuXHR9O1xuXG5cdGlzQ3VycmVudFN0YXJDaG9pY2VSZXByZXNlbnRhbnQoKSBcblx0e1x0XHRcblx0XHRpZiAoIHRoaXMuc3RhckNob2ljZUZvclJlcHJlc2VudGF0aW9uICE9PSAnJylcblx0XHR7XG5cdFx0XHRsZXQgZWxlbWVudFN0YXJJZCA9IEFwcC5jb25zdGVsbGF0aW9uLmdldFN0YXJGcm9tTmFtZSh0aGlzLnN0YXJDaG9pY2VGb3JSZXByZXNlbnRhdGlvbikuZ2V0RWxlbWVudElkKCk7XG5cdFx0XHRyZXR1cm4gKHRoaXMuaWQgPT0gZWxlbWVudFN0YXJJZCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcdFxuXHR9O1xuXG5cblxuXG5cblxuXG5cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyAgICAgICAgICAgIFNFVFRFUlMgR0VUVEVSU1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Z2V0IG1hcmtlcigpICA6IEJpb3Blbk1hcmtlclxuXHR7XHRcdFxuXHRcdC8vIGluaXRpYWxpemUgPSBpbml0aWFsaXplIHx8IGZhbHNlO1xuXHRcdC8vIGlmIChpbml0aWFsaXplKSB0aGlzLmluaXRpYWxpemUoKTtcblx0XHRyZXR1cm4gdGhpcy5iaW9wZW5NYXJrZXJfO1xuXHR9O1xuXG5cdGdldCBpc1Zpc2libGUoKSBcblx0e1x0XHRcblx0XHRyZXR1cm4gdGhpcy5pc1Zpc2libGVfO1xuXHR9O1xuXG5cdGdldCBpc0luaXRpYWxpemVkKCkgXG5cdHtcdFx0XG5cdFx0cmV0dXJuIHRoaXMuaXNJbml0aWFsaXplZF87XG5cdH07XG5cbn1cblxuIiwiaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3J5LCBPcHRpb24sIENhdGVnb3J5VmFsdWV9IGZyb20gXCIuL2NsYXNzZXNcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uVmFsdWVcbntcblx0b3B0aW9uSWQgOiBudW1iZXI7XG5cdGluZGV4IDogbnVtYmVyO1xuXHRkZXNjcmlwdGlvbiA6IHN0cmluZztcblx0b3B0aW9uXyA6IE9wdGlvbiA9IG51bGw7XG5cdGlzRmlsbGVkQnlGaWx0ZXJzIDogYm9vbGVhbjtcblxuXHRjaGlsZHJlbiA6IENhdGVnb3J5VmFsdWVbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKCAkb3B0aW9uVmFsdWVKc29uIClcblx0e1xuXHRcdHRoaXMub3B0aW9uSWQgPSAkb3B0aW9uVmFsdWVKc29uLm9wdGlvbl9pZDtcblx0XHR0aGlzLmluZGV4ID0gJG9wdGlvblZhbHVlSnNvbi5pbmRleDtcblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gJG9wdGlvblZhbHVlSnNvbi5kZXNjcmlwdGlvbiB8fCAnJztcblx0fVxuXG5cdGdldCBvcHRpb24oKSA6IE9wdGlvblxuXHR7XG5cdFx0aWYgKHRoaXMub3B0aW9uXykgcmV0dXJuIHRoaXMub3B0aW9uXztcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25fID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE9wdGlvbkJ5SWQodGhpcy5vcHRpb25JZCk7XG5cdH1cblxuXHRzZXRSZWN1cnNpdmVseUZpbGxlZEJ5RmlsdGVycyhib29sIDogYm9vbGVhbilcblx0e1xuXHRcdHRoaXMuaXNGaWxsZWRCeUZpbHRlcnMgPSBib29sO1xuXHRcdGZvcihsZXQgY2F0ZWdvcnlWYWx1ZSBvZiB0aGlzLmNoaWxkcmVuKVxuXHRcdHtcblx0XHRcdGZvciAobGV0IHN1Ym9wdGlvblZhbHVlIG9mIGNhdGVnb3J5VmFsdWUuY2hpbGRyZW4pXG5cdFx0XHR7XG5cdFx0XHRcdHN1Ym9wdGlvblZhbHVlLnNldFJlY3Vyc2l2ZWx5RmlsbGVkQnlGaWx0ZXJzKGJvb2wpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGdldCBjYXRlZ29yeU93bmVyKCkgOiBDYXRlZ29yeVxuXHR7XG5cdFx0cmV0dXJuIDxDYXRlZ29yeT4gdGhpcy5vcHRpb24uZ2V0T3duZXIoKTtcblx0fVxuXG5cdGFkZENhdGVnb3J5VmFsdWUoY2F0ZWdvcnlWYWx1ZSA6IENhdGVnb3J5VmFsdWUpXG5cdHtcblx0XHR0aGlzLmNoaWxkcmVuLnB1c2goY2F0ZWdvcnlWYWx1ZSk7XG5cdH1cbn1cblxuIiwiaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uL2NsYXNzZXMvY2F0ZWdvcnkuY2xhc3NcIjtcbmltcG9ydCB7IENhdGVnb3J5T3B0aW9uVHJlZU5vZGUsIENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlIH0gZnJvbSBcIi4vY2F0ZWdvcnktb3B0aW9uLXRyZWUtbm9kZS5jbGFzc1wiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uIGV4dGVuZHMgQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZVxueyBcblx0aWQgOiBudW1iZXI7XG5cdG5hbWUgOiBzdHJpbmc7XG5cdG5hbWVTaG9ydDogc3RyaW5nO1xuXHRpbmRleCA6IG51bWJlcjtcblx0Y29sb3IgOiBzdHJpbmc7XG5cdGljb24gOiBzdHJpbmc7XG5cdHVzZUljb25Gb3JNYXJrZXI6IGJvb2xlYW47XG5cdHVzZUNvbG9yRm9yTWFya2VyIDogYm9vbGVhbjtcblx0c2hvd09wZW5Ib3VycyA6IGJvb2xlYW47XG5cdGRlcHRoIDogbnVtYmVyO1xuXHRcblx0cHJpdmF0ZSBteU93bmVyQ29sb3JJZCA6IG51bWJlciA9IG51bGw7XG5cblxuXHRjb25zdHJ1Y3Rvcigkb3B0aW9uSnNvbiA6IGFueSlcblx0e1xuXHRcdHN1cGVyKENhdGVnb3J5T3B0aW9uVHJlZU5vZGVUeXBlLk9wdGlvbiwgJyNvcHRpb24tJywgJyNvcHRpb24tY2hlY2tib3gtJywgJy5zdWJjYXRlZ29yaWVzLXdyYXBwZXInKTtcblxuXHRcdHRoaXMuaWQgPSAkb3B0aW9uSnNvbi5pZDtcblx0XHR0aGlzLm5hbWUgPSAkb3B0aW9uSnNvbi5uYW1lO1xuXHRcdHRoaXMuaW5kZXggPSAkb3B0aW9uSnNvbi5pbmRleDtcblx0XHR0aGlzLm5hbWVTaG9ydCA9ICRvcHRpb25Kc29uLm5hbWVfc2hvcnQ7XG5cdFx0dGhpcy5jb2xvciA9ICRvcHRpb25Kc29uLmNvbG9yO1xuXHRcdHRoaXMuaWNvbiA9ICRvcHRpb25Kc29uLmljb247XG5cdFx0dGhpcy51c2VJY29uRm9yTWFya2VyID0gJG9wdGlvbkpzb24udXNlX2ljb25fZm9yX21hcmtlcjtcblx0XHR0aGlzLnVzZUNvbG9yRm9yTWFya2VyID0gJG9wdGlvbkpzb24udXNlX2NvbG9yX2Zvcl9tYXJrZXI7XG5cdFx0dGhpcy5zaG93T3BlbkhvdXJzID0gJG9wdGlvbkpzb24uc2hvd19vcGVuX2hvdXJzO1xuXHR9XG5cblx0Z2V0IG93bmVyQ29sb3JJZCgpIDogbnVtYmVyXG5cdHtcblx0XHRpZiAodGhpcy5teU93bmVyQ29sb3JJZCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMubXlPd25lckNvbG9ySWQ7XG5cblx0XHRpZiAoIXRoaXMudXNlQ29sb3JGb3JNYXJrZXIpXG5cdFx0e1xuXHRcdFx0bGV0IG9wdGlvbiA6IGFueSA9IHRoaXM7XG5cdFx0XHRsZXQgY29sb3JJZCA6IG51bWJlciA9IG51bGw7XG5cdFx0XHR3aGlsZShjb2xvcklkID09IG51bGwgJiYgb3B0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHRvcHRpb24gPSBvcHRpb24uZ2V0T3duZXIoKTtcblx0XHRcdFx0aWYgKG9wdGlvbikgXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcHRpb24gPSBvcHRpb24uZ2V0T3duZXIoKTtcblx0XHRcdFx0XHRjb2xvcklkID0gb3B0aW9uLnVzZUNvbG9yRm9yTWFya2VyID8gb3B0aW9uLmlkIDogbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5teU93bmVyQ29sb3JJZCA9IGNvbG9ySWQ7XG5cdFx0fVxuXHRcdGVsc2UgXG5cdFx0e1xuXHRcdFx0dGhpcy5teU93bmVyQ29sb3JJZCA9IHRoaXMuaWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMubXlPd25lckNvbG9ySWQ7XG5cdH1cblxuXHRhZGRDYXRlZ29yeSgkY2F0ZWdvcnkgOiBDYXRlZ29yeSkgeyB0aGlzLmNoaWxkcmVuLnB1c2goJGNhdGVnb3J5KTsgIH1cblxuXHRpc01haW5PcHRpb24oKSB7IHJldHVybiB0aGlzLmdldE93bmVyKCkgPyAoPENhdGVnb3J5PnRoaXMuZ2V0T3duZXIoKSkuZGVwdGggPT0gMCA6IGZhbHNlOyB9XG5cblx0aXNDb2xsYXBzaWJsZSgpIDogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldERvbSgpLmhhc0NsYXNzKCdvcHRpb24tY29sbGFwc2libGUnKTsgfVxuXG5cdGdldCBzdWJjYXRlZ29yaWVzKCkgOiBDYXRlZ29yeVtdIHsgcmV0dXJuIDxDYXRlZ29yeVtdPiB0aGlzLmNoaWxkcmVuOyB9XG5cblx0Z2V0IGFsbENoaWxkcmVuT3B0aW9ucygpIDogT3B0aW9uW11cblx0e1xuXHRcdHJldHVybiB0aGlzLnJlY3Vyc2l2ZWx5R2V0Q2hpbGRyZW5PcHRpb24odGhpcyk7XG5cdH1cblxuXHRwcml2YXRlIHJlY3Vyc2l2ZWx5R2V0Q2hpbGRyZW5PcHRpb24ocGFyZW50T3B0aW9uIDogT3B0aW9uKSA6IE9wdGlvbltdXG5cdHtcblx0XHRsZXQgcmVzdWx0T3B0aW9ucyA6IE9wdGlvbltdID0gW107XG5cdFx0Zm9yKGxldCBjYXQgb2YgcGFyZW50T3B0aW9uLnN1YmNhdGVnb3JpZXMpXG5cdFx0e1xuXHRcdFx0cmVzdWx0T3B0aW9ucyA9IHJlc3VsdE9wdGlvbnMuY29uY2F0KGNhdC5vcHRpb25zKTtcblx0XHRcdGZvcihsZXQgb3B0aW9uIG9mIGNhdC5vcHRpb25zKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXN1bHRPcHRpb25zID0gcmVzdWx0T3B0aW9ucy5jb25jYXQodGhpcy5yZWN1cnNpdmVseUdldENoaWxkcmVuT3B0aW9uKG9wdGlvbikpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0T3B0aW9ucztcblx0fVxufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5kZWNsYXJlIGxldCAkLCBqUXVlcnkgOiBhbnk7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBDYXRlZ29yeSwgT3B0aW9uIH0gZnJvbSBcIi4uL21vZHVsZXMvY2F0ZWdvcmllcy5tb2R1bGVcIjtcbmltcG9ydCB7IGhpZGVEaXJlY3RvcnlNZW51IH0gZnJvbSBcIi4uL2FwcC1pbnRlcmFjdGlvbnNcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuZXhwb3J0IGNsYXNzIERpcmVjdG9yeU1lbnVDb21wb25lbnRcbntcdFxuXHRjdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkID0gbnVsbDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLmluaXRpYWxpemUoKTtcblx0fVxuXG5cdGluaXRpYWxpemUoKVxuXHR7XHRcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tIFNFQVJDSCBCQVIgLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQkKCcjc2VhcmNoLWJhcicpLm9uKFwic2VhcmNoXCIsIGZ1bmN0aW9uKGV2ZW50LCBhZGRyZXNzKVxuXHRcdHtcblx0XHRcdC8vIGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIHJlZGlyZWN0VG9EaXJlY3RvcnkoJ2Jpb3Blbl9jb25zdGVsbGF0aW9uJywgYWRkcmVzcywgJCgnI3NlYXJjaC1kaXN0YW5jZS1pbnB1dCcpLnZhbCgpKTtcblx0XHRcdC8vIGVsc2UgXG5cdFx0XHRBcHAuZ2VvY29kZXIuZ2VvY29kZUFkZHJlc3MoXG5cdFx0XHRcdGFkZHJlc3MsIFxuXHRcdFx0XHRmdW5jdGlvbihyZXN1bHRzKSBcblx0XHRcdFx0eyBcblx0XHRcdFx0XHQvL0FwcC5oYW5kbGVHZW9jb2RpbmcocmVzdWx0cyk7XG5cdFx0XHRcdFx0JCgnI3NlYXJjaC1iYXInKS52YWwocmVzdWx0c1swXS5nZXRGb3JtYXR0ZWRBZGRyZXNzKCkpOyBcblx0XHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0cykgeyAkKCcjc2VhcmNoLWJhcicpLmFkZENsYXNzKCdpbnZhbGlkJyk7IH0gXG5cdFx0XHQpO1xuXG5cdFx0XHQvLyBJZiBNZW51IHRha2UgYWxsIGF2YWlsYWJsZSB3aWR0aCAoaW4gY2FzZSBvZiBzbWFsbCBtb2JpbGUpXG5cdFx0XHRpZiAoJCgnI2RpcmVjdG9yeS1tZW51Jykub3V0ZXJXaWR0aCgpID09ICQod2luZG93KS5vdXRlcldpZHRoKCkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIHRoZW4gd2UgaGlkZSBtZW51IHRvIHNob3cgc2VhcmNoIHJlc3VsdFxuXHRcdFx0XHRoaWRlRGlyZWN0b3J5TWVudSgpO1xuXHRcdFx0fVxuXHRcdH0pO1x0XG5cblx0XHQvLyBhZmZpY2hlIHVuZSBwZXRpdGUgb21icmUgc291cyBsZSB0aXRyZSBtZW51IHF1YW5kIG9uIHNjcm9sbFxuXHRcdC8vICh1bmlxdWVtZW50IHZpc2libGUgc3VyIHBldHRzIMOpY3JhbnMpXG5cdFx0Ly8gJChcIiNkaXJlY3RvcnktbWVudS1tYWluLWNvbnRhaW5lclwiKS5zY3JvbGwoZnVuY3Rpb24oKSBcblx0XHQvLyB7XG5cdFx0Ly8gICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IDApIHtcblx0XHQvLyAgICAgJCgnI21lbnUtdGl0bGUgLnNoYWRvdy1ib3R0b20nKS5zaG93KCk7XG5cdFx0Ly8gICB9IGVsc2Uge1xuXHRcdC8vICAgICAkKCcjbWVudS10aXRsZSAuc2hhZG93LWJvdHRvbScpLmhpZGUoKTtcblx0XHQvLyAgIH1cblx0XHQvLyB9KTtcblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0gRkFWT1JJVEUtLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdCQoJyNmaWx0ZXItZmF2b3JpdGUnKS5jbGljayhmdW5jdGlvbihlIDogRXZlbnQpXG5cdFx0e1xuXHRcdFx0XG5cdFx0XHRsZXQgZmF2b3JpdGVDaGVja2JveCA9ICQoJyNmYXZvcml0ZS1jaGVja2JveCcpO1xuXG5cdFx0XHRsZXQgY2hlY2tWYWx1ZSA9ICFmYXZvcml0ZUNoZWNrYm94LmlzKCc6Y2hlY2tlZCcpO1xuXG5cdFx0XHRBcHAuZmlsdGVyTW9kdWxlLnNob3dPbmx5RmF2b3JpdGUoY2hlY2tWYWx1ZSk7XG5cdFx0XHRBcHAuZWxlbWVudE1vZHVsZS51cGRhdGVFbGVtZW50VG9EaXNwbGF5KCFjaGVja1ZhbHVlKTtcblxuXHRcdFx0ZmF2b3JpdGVDaGVja2JveC5wcm9wKCdjaGVja2VkJyxjaGVja1ZhbHVlKTtcblxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSk7XG5cblx0XHQkKCcjZmlsdGVyLWZhdm9yaXRlJykudG9vbHRpcCgpO1xuXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLSBNQUlOIE9QVElPTlMgLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0JCgnLm1haW4tY2F0ZWdvcmllcyAubWFpbi1pY29uJykuY2xpY2soIGZ1bmN0aW9uKGUpXG5cdFx0e1xuXHRcdFx0bGV0IG9wdGlvbklkID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9wdGlvbi1pZCcpO1xuXHRcdFx0dGhhdC5zZXRNYWluT3B0aW9uKG9wdGlvbklkKTtcblx0XHR9KTtcblxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyAtLS0tLS0gQ0FURUdPUklFUyAtLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdCQoJy5zdWJjYXRlZ29yeS1pdGVtIC5uYW1lLXdyYXBwZXInKS5jbGljayhmdW5jdGlvbigpXG5cdFx0e1x0XHRcblx0XHRcdGxldCBjYXRlZ29yeUlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWNhdGVnb3J5LWlkJyk7XG5cdFx0XHRBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0Q2F0ZWdvcnlCeUlkKGNhdGVnb3J5SWQpLnRvZ2dsZUNoaWxkcmVuRGV0YWlsKCk7XG5cdFx0fSk7XHRcblxuXHRcdCQoJy5zdWJjYXRlZ29yeS1pdGVtIC5jaGVja2JveC13cmFwcGVyJykuY2xpY2soZnVuY3Rpb24oZSlcblx0XHR7XHRcdFxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGxldCBjYXRlZ29yeUlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWNhdGVnb3J5LWlkJyk7XG5cdFx0XHRBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0Q2F0ZWdvcnlCeUlkKGNhdGVnb3J5SWQpLnRvZ2dsZSgpO1xuXHRcdFx0XG5cdFx0fSk7XHRcdFx0XG5cblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gLS0tLS0tIFNVQiBPUFRJT05TIC0tLS0tLS0tLS0tLVxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQkKCcuc3ViY2F0ZWdvcmllLW9wdGlvbi1pdGVtOm5vdCgjZmlsdGVyLWZhdm9yaXRlKSAuaWNvbi1uYW1lLXdyYXBwZXInKS5jbGljayhmdW5jdGlvbihlIDogRXZlbnQpXG5cdFx0e1xuXHRcdFx0bGV0IG9wdGlvbklkID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9wdGlvbi1pZCcpO1xuXHRcdFx0bGV0IG9wdGlvbiA9IEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRPcHRpb25CeUlkKG9wdGlvbklkKTtcblxuXHRcdFx0b3B0aW9uLmlzQ29sbGFwc2libGUoKSA/IG9wdGlvbi50b2dnbGVDaGlsZHJlbkRldGFpbCgpIDogb3B0aW9uLnRvZ2dsZSgpO1xuXHRcdH0pO1xuXG5cdFx0JCgnLnN1YmNhdGVnb3JpZS1vcHRpb24taXRlbTpub3QoI2ZpbHRlci1mYXZvcml0ZSkgLmNoZWNrYm94LXdyYXBwZXInKS5jbGljayhmdW5jdGlvbihlKVxuXHRcdHtcdFx0XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0bGV0IG9wdGlvbklkID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9wdGlvbi1pZCcpO1xuXHRcdFx0QXBwLmNhdGVnb3J5TW9kdWxlLmdldE9wdGlvbkJ5SWQob3B0aW9uSWQpLnRvZ2dsZSgpO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRzZXRNYWluT3B0aW9uKG9wdGlvbklkKVxuXHR7XG5cdFx0aWYgKHRoaXMuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZCA9PSBvcHRpb25JZCkgcmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZCAhPSBudWxsKSBBcHAuZWxlbWVudE1vZHVsZS5jbGVhckN1cnJlbnRzRWxlbWVudCgpO1xuXG5cdFx0bGV0IG9sZElkID0gdGhpcy5jdXJyZW50QWN0aXZlTWFpbk9wdGlvbklkO1xuXHRcdHRoaXMuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZCA9IG9wdGlvbklkO1xuXG5cdFx0aWYgKG9wdGlvbklkID09ICdhbGwnKVxuXHRcdHtcblx0XHRcdCQoJyNtZW51LXN1YmNhdGVnb3JpZXMtdGl0bGUnKS50ZXh0KFwiVG91cyBsZXMgYWN0ZXVyc1wiKTtcblx0XHRcdCQoJyNvcGVuLWhvdXJzLWZpbHRlcicpLmhpZGUoKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGxldCBtYWluT3B0aW9uID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25CeUlkKG9wdGlvbklkKTtcdFx0XHRcdFxuXG5cdFx0XHQkKCcjbWVudS1zdWJjYXRlZ29yaWVzLXRpdGxlJykudGV4dChtYWluT3B0aW9uLm5hbWUpO1xuXHRcdFx0aWYgKG1haW5PcHRpb24uc2hvd09wZW5Ib3VycykgJCgnI29wZW4taG91cnMtZmlsdGVyJykuc2hvdygpO1xuXHRcdFx0ZWxzZSAkKCcjb3Blbi1ob3Vycy1maWx0ZXInKS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVNYWluT3B0aW9uQmFja2dyb3VuZCgpO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyhcInNldE1haW5PcHRpb25JZCBcIiArIG9wdGlvbklkICsgXCIgLyBvbGRPcHRpb24gOiBcIiArIG9sZElkKTtcblx0XHRpZiAob2xkSWQgIT0gbnVsbCkgQXBwLmhpc3RvcnlNb2R1bGUudXBkYXRlQ3VyclN0YXRlKCk7XG5cdFx0XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudFRvRGlzcGxheSh0cnVlLHRydWUpO1xuXHRcdEFwcC5lbGVtZW50TW9kdWxlLnVwZGF0ZUN1cnJlbnRzRWxlbWVudHMoKTtcblx0fVxuXG5cdHVwZGF0ZU1haW5PcHRpb25CYWNrZ3JvdW5kKClcblx0e1xuXHRcdGxldCBvcHRpb25JZCA9IHRoaXMuY3VycmVudEFjdGl2ZU1haW5PcHRpb25JZDtcblxuXHRcdGlmKCEkKCcjZGlyZWN0b3J5LW1lbnUnKS5pcygnOnZpc2libGUnKSkgeyBjb25zb2xlLmxvZyhcImRpcmVjdG9yeSBub3QgdmlzaWJsZVwiKTtyZXR1cm47IH1cblxuXHRcdCQoJyNhY3RpdmUtbWFpbi1vcHRpb24tYmFja2dyb3VuZCcpLmFuaW1hdGUoe3RvcDogJCgnI21haW4tb3B0aW9uLWljb24tJyArIG9wdGlvbklkKS5wb3NpdGlvbigpLnRvcH0sIDUwMCwgJ2Vhc2VPdXRRdWFydCcpO1xuXG5cdFx0JCgnLm1haW4tb3B0aW9uLXN1YmNhdGVnb3JpZXMtY29udGFpbmVyJykuaGlkZSgpO1xuXHRcdCQoJyNtYWluLW9wdGlvbi0nICsgb3B0aW9uSWQpLmZhZGVJbig2MDApO1xuXG5cdFx0JCgnLm1haW4tY2F0ZWdvcmllcyAubWFpbi1pY29uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoJyNtYWluLW9wdGlvbi1pY29uLScgKyBvcHRpb25JZCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9XG59XG5cblxuXG5cblxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuaW1wb3J0IHsgRWxlbWVudHNDaGFuZ2VkIH0gZnJvbSBcIi4uL21vZHVsZXMvZWxlbWVudHMubW9kdWxlXCI7XG5pbXBvcnQgeyBzbHVnaWZ5LCBjYXBpdGFsaXplLCB1bnNsdWdpZnkgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5cbmltcG9ydCB7IGNyZWF0ZUxpc3RlbmVyc0ZvckVsZW1lbnRNZW51LCB1cGRhdGVGYXZvcml0ZUljb24gfSBmcm9tIFwiLi9lbGVtZW50LW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudExpc3RDb21wb25lbnRcbntcblx0Ly9vblNob3cgPSBuZXcgRXZlbnQ8bnVtYmVyPigpO1xuXG5cdC8vIE51bWJlciBvZiBlbGVtZW50IGluIG9uZSBsaXN0XG5cdEVMRU1FTlRfTElTVF9TSVpFX1NURVAgOiBudW1iZXIgPSAxNTtcblx0Ly8gQmFzaWNseSB3ZSBkaXNwbGF5IDEgRUxFTUVOVF9MSVNUX1NJWkVfU1RFUCwgYnV0IGlmIHVzZXIgbmVlZFxuXHQvLyBmb3IsIHdlIGRpc3BsYXkgYW4gb3RoZXJzIEVMRU1FTlRfTElTVF9TSVpFX1NURVAgbW9yZVxuXHRzdGVwc0NvdW50IDogbnVtYmVyID0gMTtcblx0aXNMaXN0RnVsbCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHQvLyBsYXN0IHJlcXVlc3Qgd2FzIHNlbmQgd2l0aCB0aGlzIGRpc3RhbmNlXG5cdGxhc3REaXN0YW5jZVJlcXVlc3QgPSAxMDtcblxuXHRpc0luaXRpYWxpemVkIDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdC8vIGRldGVjdCB3aGVuIHVzZXIgcmVhY2ggYm90dG9tIG9mIGxpc3Rcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgdWwnKS5vbignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoJCh0aGlzKS5zY3JvbGxUb3AoKSArICQodGhpcykuaW5uZXJIZWlnaHQoKSA+PSAkKHRoaXMpWzBdLnNjcm9sbEhlaWdodCkgeyAgICAgICAgICAgIFxuXHRcdCAgICBcdHRoYXQuaGFuZGxlQm90dG9tKCk7XG5cdFx0ICB9XG5cdFx0fSk7XG5cdH1cblxuXHR1cGRhdGUoJGVsZW1lbnRzUmVzdWx0IDogRWxlbWVudHNDaGFuZ2VkKSBcblx0e1xuXHRcdHRoaXMuY2xlYXIoKTtcblx0XHR0aGlzLmRyYXcoJGVsZW1lbnRzUmVzdWx0LmVsZW1lbnRzVG9EaXNwbGF5LCBmYWxzZSk7XG5cdFx0XG5cdFx0bGV0IGFkZHJlc3MgPSBBcHAuZ2VvY29kZXIubGFzdEFkZHJlc3NSZXF1ZXN0O1xuXHRcdGlmIChhZGRyZXNzKVxuXHRcdFx0dGhpcy5zZXRUaXRsZSgnIGF1dG91ciBkZSA8aT4nICsgY2FwaXRhbGl6ZSh1bnNsdWdpZnkoYWRkcmVzcykpKSArICc8L2k+Jztcblx0XHRlbHNlXG5cdFx0XHR0aGlzLnNldFRpdGxlKCcgYXV0b3VyIGR1IGNlbnRyZSBkZSBsYSBjYXJ0ZScpO1xuXHR9XG5cblx0c2V0VGl0bGUoJHZhbHVlIDogc3RyaW5nKVxuXHR7XG5cdFx0JCgnLmVsZW1lbnQtbGlzdC10aXRsZS10ZXh0JykuaHRtbCgkdmFsdWUpO1xuXHR9XG5cblx0Y2xlYXIoKVxuXHR7XG5cdFx0JCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgbGknKS5yZW1vdmUoKTtcblx0fVxuXG5cdGN1cnJFbGVtZW50c0Rpc3BsYXllZCgpIDogbnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gJCgnI2RpcmVjdG9yeS1jb250ZW50LWxpc3QgbGknKS5sZW5ndGg7XG5cdH1cblxuXHRwcml2YXRlIGRyYXcoJGVsZW1lbnRMaXN0IDogRWxlbWVudFtdLCAkYW5pbWF0ZSA9IGZhbHNlKSBcblx0e1xuXHRcdC8vY29uc29sZS5sb2coJ0VsZW1lbnRMaXN0IGRyYXcnLCAkZWxlbWVudExpc3QubGVuZ3RoKTtcblxuXHRcdGxldCBlbGVtZW50IDogRWxlbWVudDtcblx0XHRsZXQgZWxlbWVudHNUb0Rpc3BsYXkgOiBFbGVtZW50W10gPSAkZWxlbWVudExpc3Q7IFxuXG5cdFx0Zm9yKGVsZW1lbnQgb2YgZWxlbWVudHNUb0Rpc3BsYXkpXG5cdFx0e1xuXHRcdFx0ZWxlbWVudC51cGRhdGVEaXN0YW5jZSgpO1xuXHRcdH1cblx0XHRlbGVtZW50c1RvRGlzcGxheS5zb3J0KHRoaXMuY29tcGFyZURpc3RhbmNlKTtcblxuXHRcdGxldCBtYXhFbGVtZW50c1RvRGlzcGxheSA9IHRoaXMuRUxFTUVOVF9MSVNUX1NJWkVfU1RFUCAqIHRoaXMuc3RlcHNDb3VudDtcblx0XHRsZXQgZW5kSW5kZXggPSBNYXRoLm1pbihtYXhFbGVtZW50c1RvRGlzcGxheSwgZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoKTsgIFxuXHRcdFxuXHRcdC8vIGlmIHRoZSBsaXN0IGlzIG5vdCBmdWxsLCB3ZSBzZW5kIGFqYXggcmVxdWVzdFxuXHRcdGlmICggZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoIDwgbWF4RWxlbWVudHNUb0Rpc3BsYXkpXG5cdFx0e1xuXHRcdFx0bGV0IGxvY2F0aW9uID0gQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCk7XG5cblx0XHRcdGlmIChsb2NhdGlvbilcblx0XHRcdHtcblx0XHRcdFx0bGV0IGRpc3RhbmNlID0gdGhpcy5sYXN0RGlzdGFuY2VSZXF1ZXN0ICogNTtcblx0XHRcdFx0dGhpcy5sYXN0RGlzdGFuY2VSZXF1ZXN0ID0gZGlzdGFuY2U7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJsaXN0IGlzbid0IGZ1bGwgLT4gQWpheCByZXF1ZXN0XCIpO1xuXHRcdFx0XHQvL2xldCBtYXhSZXN1bHRzID0gMjA7XG5cdFx0XHRcdEFwcC5hamF4TW9kdWxlLmdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24obG9jYXRpb24sIGRpc3RhbmNlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gaWYgbG9jYXRpb24gaXNuJ3QgYXZhaWxhYmxlIHdlIGRpcGxheSBlbGVtZW50cyB2aXNpYmxlIGZyb20gdGhlXG5cdFx0XHRcdC8vIGN1cnJlbnQgbWFwIHZpZXcgXG5cdFx0XHRcdEFwcC5hamF4TW9kdWxlLmdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24oXG5cdFx0XHRcdFx0QXBwLm1hcENvbXBvbmVudC5nZXRDZW50ZXIoKSwgXG5cdFx0XHRcdFx0QXBwLm1hcENvbXBvbmVudC5tYXBSYWRpdXNJbkttKClcblx0XHRcdFx0KTtcblx0XHRcdH1cdFx0XHRcblx0XHR9XHRcblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImxpc3QgaXMgZnVsbFwiKTtcblx0XHRcdHRoaXMuaXNMaXN0RnVsbCA9IHRydWU7XG5cdFx0XHQvLyB3YWl0aW5nIGZvciBzY3JvbGwgYm90dG9tIHRvIGFkZCBtb3JlIGVsZW1lbnRzIHRvIHRoZSBsaXN0XG5cdFx0fVxuXHRcdFxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBlbmRJbmRleDsgaSsrKVxuXHRcdHtcblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50c1RvRGlzcGxheVtpXTtcblx0XHRcdCQoJyNkaXJlY3RvcnktY29udGVudC1saXN0IHVsJykuYXBwZW5kKGVsZW1lbnQuZ2V0SHRtbFJlcHJlc2VudGF0aW9uKCkpO1xuXHRcdFx0bGV0IGRvbU1lbnUgPSAkKCcjZWxlbWVudC1pbmZvLScrZWxlbWVudC5pZCArJyAubWVudS1lbGVtZW50Jyk7XG5cdFx0XHRjcmVhdGVMaXN0ZW5lcnNGb3JFbGVtZW50TWVudShkb21NZW51KTtcdFxuXHRcdFx0dXBkYXRlRmF2b3JpdGVJY29uKGRvbU1lbnUsIGVsZW1lbnQpXHRcdFxuXHRcdH1cblxuXHRcdGlmICgkYW5pbWF0ZSlcblx0XHR7XG5cdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCB1bCcpLmFuaW1hdGUoe3Njcm9sbFRvcDogJzAnfSwgNTAwKVxuXHRcdH1cdFx0XG5cblx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCB1bCcpLmNvbGxhcHNpYmxlKHtcbiAgICAgIFx0YWNjb3JkaW9uIDogdHJ1ZSBcbiAgIFx0fSk7XG5cbiAgIFx0JCgnLmVsZW1lbnQtbGlzdC10aXRsZS1udW1iZXItcmVzdWx0cycpLnRleHQoJygnICsgZWxlbWVudHNUb0Rpc3BsYXkubGVuZ3RoICsgJyknKTtcblx0fVxuXG5cdHByaXZhdGUgaGFuZGxlQm90dG9tKClcblx0e1xuXHRcdGlmICh0aGlzLmlzTGlzdEZ1bGwpIFxuXHRcdHtcblx0XHRcdHRoaXMuc3RlcHNDb3VudCsrO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvdHRvbSByZWFjaGVkXCIpO1xuXHRcdFx0dGhpcy5pc0xpc3RGdWxsID0gZmFsc2U7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLmRyYXcoQXBwLmVsZW1lbnRzKCkpO1xuXHRcdH1cdFx0XG5cdH1cblxuXHRwcml2YXRlIGNvbXBhcmVEaXN0YW5jZShhLGIpIFxuXHR7ICBcblx0ICBpZiAoYS5kaXN0YW5jZSA9PSBiLmRpc3RhbmNlKSByZXR1cm4gMDtcblx0ICByZXR1cm4gYS5kaXN0YW5jZSA8IGIuZGlzdGFuY2UgPyAtMSA6IDE7XG5cdH1cbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuZGVjbGFyZSBsZXQgZ3JlY2FwdGNoYTtcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5kZWNsYXJlIGxldCBSb3V0aW5nIDogYW55O1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcywgQXBwTW9kZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgc2x1Z2lmeSB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUVsZW1lbnRNZW51KClcbntcdFxuXHQvLyAgIE1FTlUgUFJPVklERVJcblx0bGV0IG1lbnVfZWxlbWVudCA9ICQoJyNlbGVtZW50LWluZm8tYmFyIC5tZW51LWVsZW1lbnQnKTtcblx0Y3JlYXRlTGlzdGVuZXJzRm9yRWxlbWVudE1lbnUobWVudV9lbGVtZW50KTtcdFxuXG5cdCQoJyNwb3B1cC1kZWxldGUtZWxlbWVudCAjc2VsZWN0LXJlYXNvbicpLm1hdGVyaWFsX3NlbGVjdCgpO1xuXG5cdC8vIGJ1dHRvbiB0byBjb25maXJtIGNhbGN1bGF0ZSBpZHJlY3Rpb25zIGluIG1vZGFsIHBpY2sgYWRkcmVzcyBmb3IgZGlyZWN0aW9uc1xuXHQkKCcjbW9kYWwtcGljay1hZGRyZXNzICNidG4tY2FsY3VsYXRlLWRpcmVjdGlvbnMnKS5jbGljaygoKSA9PiBcblx0e1xuXHRcdGxldCBhZGRyZXNzID0gJCgnI21vZGFsLXBpY2stYWRkcmVzcyBpbnB1dCcpLnZhbCgpO1xuXHRcdFxuXHRcdGlmIChhZGRyZXNzKVxuXHRcdHtcdFx0XHRcblx0XHRcdEFwcC5nZW9jb2Rlci5nZW9jb2RlQWRkcmVzcyhhZGRyZXNzLFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHQkKFwiI21vZGFsLXBpY2stYWRkcmVzcyAubW9kYWwtZXJyb3ItbXNnXCIpLmhpZGUoKTtcblx0XHRcdFx0JCgnI21vZGFsLXBpY2stYWRkcmVzcycpLmNsb3NlTW9kYWwoKTtcblx0XHRcdFx0QXBwLnNlYXJjaEJhckNvbXBvbmVudC5zZXRWYWx1ZShhZGRyZXNzKTtcblxuXHRcdFx0XHRBcHAuc2V0U3RhdGUoQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zLHtpZDogZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCl9KTtcblx0XHRcdH0sXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdCQoXCIjbW9kYWwtcGljay1hZGRyZXNzIC5tb2RhbC1lcnJvci1tc2dcIikuc2hvdygpO1xuXHRcdFx0fSk7XHRcdFx0XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQkKCcjbW9kYWwtcGljay1hZGRyZXNzIGlucHV0JykuYWRkQ2xhc3MoJ2ludmFsaWQnKTtcblx0XHR9XG5cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUVsZW1lbnQoKVxue1xuXHRpZiAoZ3JlY2FwdGNoYS5nZXRSZXNwb25zZSgpLmxlbmd0aCA9PT0gMClcblx0e1xuXHRcdCQoJyNjYXB0Y2hhLWVycm9yLW1lc3NhZ2UnKS5zaG93KCk7XG5cdFx0Z3JlY2FwdGNoYS5yZXNldCgpO1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdCQoJyNjYXB0Y2hhLWVycm9yLW1lc3NhZ2UnKS5oaWRlKCk7XG5cdFx0JCgnI3BvcHVwLWRlbGV0ZS1lbGVtZW50JykuY2xvc2VNb2RhbCgpO1xuXHR9XHRcbn1cblxuZnVuY3Rpb24gb25sb2FkQ2FwdGNoYSgpIFxue1xuICAgIGdyZWNhcHRjaGEucmVuZGVyKCdjYXB0Y2hhJywge1xuICAgICAgJ3NpdGVrZXknIDogJzZMY0VWaVVUQUFBQUFPRU1wRkN5TEh3UEcxdkpxRXh1eUQ0bjFMYncnXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVGYXZvcml0ZUljb24ob2JqZWN0LCBlbGVtZW50IDogRWxlbWVudClcbntcblx0aWYgKCFlbGVtZW50LmlzRmF2b3JpdGUpIFxuXHR7XG5cdFx0b2JqZWN0LmZpbmQoJy5pdGVtLWFkZC1mYXZvcml0ZScpLnNob3coKTtcblx0XHRvYmplY3QuZmluZCgnLml0ZW0tcmVtb3ZlLWZhdm9yaXRlJykuaGlkZSgpO1xuXHR9XHRcblx0ZWxzZSBcblx0e1xuXHRcdG9iamVjdC5maW5kKCcuaXRlbS1hZGQtZmF2b3JpdGUnKS5oaWRlKCk7XG5cdFx0b2JqZWN0LmZpbmQoJy5pdGVtLXJlbW92ZS1mYXZvcml0ZScpLnNob3coKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0Z1bGxUZXh0TWVudShvYmplY3QsIGJvb2wgOiBib29sZWFuKVxue1xuXHRpZiAoYm9vbClcblx0e1xuXHRcdG9iamVjdC5hZGRDbGFzcyhcImZ1bGwtdGV4dFwiKTtcblx0XHRvYmplY3QuZmluZCgnLnRvb2x0aXBwZWQnKS50b29sdGlwKCdyZW1vdmUnKTtcdFxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdG9iamVjdC5yZW1vdmVDbGFzcyhcImZ1bGwtdGV4dFwiKTtcblx0XHRvYmplY3QuZmluZCgnLnRvb2x0aXBwZWQnKS50b29sdGlwKCk7XHRcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGlzdGVuZXJzRm9yRWxlbWVudE1lbnUob2JqZWN0KVxue1xuXHRvYmplY3QuZmluZCgnLnRvb2x0aXBwZWQnKS50b29sdGlwKCk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLWVkaXQnKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9lbGVtZW50X2VkaXQnLCB7IGlkIDogZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkgfSk7IFxuXHR9KTtcblxuXHRvYmplY3QuZmluZCgnLml0ZW0tZGVsZXRlJykuY2xpY2soZnVuY3Rpb24oKSBcblx0e1x0XHRcblx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpKTtcblx0XHQvL3dpbmRvdy5jb25zb2xlLmxvZyhlbGVtZW50Lm5hbWUpO1xuXHRcdCQoJyNwb3B1cC1kZWxldGUtZWxlbWVudCAuZWxlbWVudE5hbWUnKS50ZXh0KGNhcGl0YWxpemUoZWxlbWVudC5uYW1lKSk7XG5cdFx0JCgnI3BvcHVwLWRlbGV0ZS1lbGVtZW50Jykub3Blbk1vZGFsKHtcblx0XHQgICAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdFx0ICAgICAgb3BhY2l0eTogMC41LCBcblx0XHQgICAgICBpbl9kdXJhdGlvbjogMzAwLCBcblx0XHQgICAgICBvdXRfZHVyYXRpb246IDIwMFxuICAgIFx0XHR9KTtcblx0fSk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLWRpcmVjdGlvbnMnKS5jbGljayhmdW5jdGlvbigpIFxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cblx0XHRpZiAoQXBwLnN0YXRlICE9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbiAmJiAhQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpXG5cdFx0e1xuXHRcdFx0bGV0IG1vZGFsID0gJCgnI21vZGFsLXBpY2stYWRkcmVzcycpO1xuXHRcdFx0bW9kYWwuZmluZChcIi5tb2RhbC1mb290ZXJcIikuYXR0cignb3B0aW9uLWlkJyxlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1x0XHRcdFxuXHRcdFx0XG5cdFx0XHRtb2RhbC5vcGVuTW9kYWwoe1xuXHQgICAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdCAgICAgIG9wYWNpdHk6IDAuNSwgXG5cdCAgICAgIGluX2R1cmF0aW9uOiAzMDAsIFxuXHQgICAgICBvdXRfZHVyYXRpb246IDIwMCxcbiAgIFx0XHR9KTtcblx0XHR9XG5cdFx0ZWxzZSBBcHAuc2V0U3RhdGUoQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zLHtpZDogZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCl9KTtcblx0fSk7XG5cblx0b2JqZWN0LmZpbmQoJy5pdGVtLXNoYXJlJykuY2xpY2soZnVuY3Rpb24oKVxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0XG5cdFx0bGV0IG1vZGFsID0gJCgnI21vZGFsLXNoYXJlLWVsZW1lbnQnKTtcblxuXHRcdG1vZGFsLmZpbmQoXCIubW9kYWwtZm9vdGVyXCIpLmF0dHIoJ29wdGlvbi1pZCcsZWxlbWVudC5jb2xvck9wdGlvbklkKTtcblx0XHQvL21vZGFsLmZpbmQoXCIuaW5wdXQtc2ltcGxlLW1vZGFsXCIpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoXCJpbnB1dC1zaW1wbGUtbW9kYWwgXCIgKyBlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1xuXG5cdFx0bGV0IHVybDtcblx0XHRpZiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdHtcblx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dXJsID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2RpcmVjdG9yeV9zaG93RWxlbWVudCcsIHsgbmFtZSA6ICBjYXBpdGFsaXplKHNsdWdpZnkoZWxlbWVudC5uYW1lKSksIGlkIDogZWxlbWVudC5pZCB9LCB0cnVlKTtcdFxuXHRcdH1cblxuXHRcdG1vZGFsLmZpbmQoJy5pbnB1dC1zaW1wbGUtbW9kYWwnKS52YWwodXJsKTtcblx0XHRtb2RhbC5vcGVuTW9kYWwoe1xuXHQgICAgICBkaXNtaXNzaWJsZTogdHJ1ZSwgXG5cdCAgICAgIG9wYWNpdHk6IDAuNSwgXG5cdCAgICAgIGluX2R1cmF0aW9uOiAzMDAsIFxuXHQgICAgICBvdXRfZHVyYXRpb246IDIwMFxuICAgXHR9KTtcblx0fSk7XHRcblx0XG5cdG9iamVjdC5maW5kKCcuaXRlbS1hZGQtZmF2b3JpdGUnKS5jbGljayhmdW5jdGlvbigpIFxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUuYWRkRmF2b3JpdGUoZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkpO1xuXG5cdFx0dXBkYXRlRmF2b3JpdGVJY29uKG9iamVjdCwgZWxlbWVudCk7XG5cblx0XHRpZiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKVxuXHRcdHtcblx0XHRcdGVsZW1lbnQubWFya2VyLnVwZGF0ZSgpO1xuXHRcdFx0ZWxlbWVudC5tYXJrZXIuYW5pbWF0ZURyb3AoKTtcblx0XHR9XG5cdFx0XG5cdH0pO1xuXHRcblx0b2JqZWN0LmZpbmQoJy5pdGVtLXJlbW92ZS1mYXZvcml0ZScpLmNsaWNrKGZ1bmN0aW9uKCkgXG5cdHtcblx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKGdldEN1cnJlbnRFbGVtZW50SWRTaG93bigpKTtcblx0XHRBcHAuZWxlbWVudE1vZHVsZS5yZW1vdmVGYXZvcml0ZShnZXRDdXJyZW50RWxlbWVudElkU2hvd24oKSk7XG5cdFx0XG5cdFx0dXBkYXRlRmF2b3JpdGVJY29uKG9iamVjdCwgZWxlbWVudCk7XG5cblx0XHRpZiAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwKSBlbGVtZW50Lm1hcmtlci51cGRhdGUoKTtcblx0fSk7XHRcbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudEVsZW1lbnRJZFNob3duKCkgOiBudW1iZXJcbntcblx0aWYgKCBBcHAubW9kZSA9PSBBcHBNb2Rlcy5NYXAgKSBcblx0e1xuXHRcdHJldHVybiAkKCcjZWxlbWVudC1pbmZvLWJhcicpLmZpbmQoJy5lbGVtZW50LWl0ZW0nKS5hdHRyKCdkYXRhLWVsZW1lbnQtaWQnKTtcblx0fVxuXHRyZXR1cm4gcGFyc2VJbnQoJCgnLmVsZW1lbnQtaXRlbS5hY3RpdmUnKS5hdHRyKCdkYXRhLWVsZW1lbnQtaWQnKSk7XG59XG5cblxuLypmdW5jdGlvbiBib29rTWFya01lKClcbntcblx0aWYgKHdpbmRvdy5zaWRlYmFyKSB7IC8vIE1vemlsbGEgRmlyZWZveCBCb29rbWFya1xuICAgICAgd2luZG93LnNpZGViYXIuYWRkUGFuZWwobG9jYXRpb24uaHJlZixkb2N1bWVudC50aXRsZSxcIlwiKTtcbiAgICB9IGVsc2UgaWYod2luZG93LmV4dGVybmFsKSB7IC8vIElFIEZhdm9yaXRlXG4gICAgICB3aW5kb3cuZXh0ZXJuYWwuQWRkRmF2b3JpdGUobG9jYXRpb24uaHJlZixkb2N1bWVudC50aXRsZSk7IH1cbiAgICBlbHNlIGlmKHdpbmRvdy5vcGVyYSAmJiB3aW5kb3cucHJpbnQpIHsgLy8gT3BlcmEgSG90bGlzdFxuICAgICAgdGhpcy50aXRsZT1kb2N1bWVudC50aXRsZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0qL1xuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5cbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vdXRpbHMvZXZlbnRcIjtcbmltcG9ydCB7IHVwZGF0ZU1hcFNpemUsIHVwZGF0ZUluZm9CYXJTaXplIH0gZnJvbSBcIi4uL2FwcC1pbnRlcmFjdGlvbnNcIjtcbmltcG9ydCB7IHVwZGF0ZUZhdm9yaXRlSWNvbiwgc2hvd0Z1bGxUZXh0TWVudSB9IGZyb20gXCIuL2VsZW1lbnQtbWVudS5jb21wb25lbnRcIjtcblxuZGVjbGFyZSB2YXIgJDtcblxuZXhwb3J0IGNsYXNzIEluZm9CYXJDb21wb25lbnRcbntcblx0aXNWaXNpYmxlIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRpc0RldGFpbHNWaXNpYmxlID0gZmFsc2U7XG5cblx0ZWxlbWVudFZpc2libGUgOiBFbGVtZW50ID0gbnVsbDtcblxuXHRvblNob3cgPSBuZXcgRXZlbnQ8bnVtYmVyPigpO1xuXHRvbkhpZGUgPSBuZXcgRXZlbnQ8Ym9vbGVhbj4oKTtcblxuXHRnZXRDdXJyRWxlbWVudElkKCkgOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5lbGVtZW50VmlzaWJsZSA/IHRoaXMuZWxlbWVudFZpc2libGUuaWQgOiBudWxsfVxuXG5cdHByaXZhdGUgaXNEaXNwbGF5ZWRBc2lkZSgpXG5cdHtcblx0XHRyZXR1cm4gJCgnI2VsZW1lbnQtaW5mby1iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2Fic29sdXRlJztcblx0fVxuXG5cdC8vIEFwcC5pbmZvQmFyQ29tcG9uZW50LnNob3dFbGVtZW50O1xuXHRzaG93RWxlbWVudChlbGVtZW50SWQpIFxuXHR7XG5cdFx0bGV0IGVsZW1lbnQgPSBBcHAuZWxlbWVudE1vZHVsZS5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyhcInNob3dFbGVtZW50XCIsIHRoaXMuaXNEaXNwbGF5ZWRBc2lkZSgpKTtcblx0XHRcblx0XHQvLyBpZiBlbGVtZW50IGFscmVhZHkgdmlzaWJsZVxuXHRcdGlmICh0aGlzLmVsZW1lbnRWaXNpYmxlKVxuXHRcdHtcblx0XHRcdHRoaXMuZWxlbWVudFZpc2libGUubWFya2VyLnNob3dOb3JtYWxTaXplKHRydWUpO1xuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudFZpc2libGUgPSBlbGVtZW50O1x0XHRcdFx0XG5cblx0XHRlbGVtZW50LnVwZGF0ZURpc3RhbmNlKCk7XG5cblx0XHQkKCcjZWxlbWVudC1pbmZvJykuaHRtbChlbGVtZW50LmdldEh0bWxSZXByZXNlbnRhdGlvbigpKTtcblxuXHRcdGxldCBkb21NZW51ID0gJCgnI2VsZW1lbnQtaW5mby1iYXIgLm1lbnUtZWxlbWVudCcpO1xuXHRcdGRvbU1lbnUuYXR0cignb3B0aW9uLWlkJywgZWxlbWVudC5jb2xvck9wdGlvbklkKTtcblxuXHRcdHVwZGF0ZUZhdm9yaXRlSWNvbihkb21NZW51LCBlbGVtZW50KTtcblxuXHRcdC8vIG9uIGxhcmdlIHNjcmVlbiBpbmZvIGJhciBpcyBkaXNwbGF5ZWQgYXNpZGUgYW5kIHNvIHdlIGhhdmUgZW5vdWdoIHNwYWNlXG5cdFx0Ly8gdG8gc2hvdyBtZW51IGFjdGlvbnMgZGV0YWlscyBpbiBmdWxsIHRleHRcblx0XHRzaG93RnVsbFRleHRNZW51KGRvbU1lbnUsIHRoaXMuaXNEaXNwbGF5ZWRBc2lkZSgpKTtcblxuXG5cdFx0JCgnI2J0bi1jbG9zZS1iYW5kZWF1LWRldGFpbCcpLmNsaWNrKCgpID0+XG5cdFx0eyAgXHRcdFxuXHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cdFx0XG5cdFx0JCgnI2VsZW1lbnQtaW5mbyAuY29sbGFwc2libGUtaGVhZGVyJykuY2xpY2soKCkgPT4ge3RoaXMudG9nZ2xlRGV0YWlscygpOyB9KTtcblx0XHRcblx0XHR0aGlzLnNob3coKTtcblxuXHRcdC8vIGFmdGVyIGluZm9iYXIgYW5pbWF0aW9uLCB3ZSBjaGVjayBpZiB0aGUgbWFya2VyIFxuXHRcdC8vIGlzIG5vdCBoaWRkZWQgYnkgdGhlIGluZm8gYmFyXG5cdFx0c2V0VGltZW91dCgoKT0+IHtcblx0XHRcdGlmICghQXBwLm1hcENvbXBvbmVudC5jb250YWlucyhlbGVtZW50LnBvc2l0aW9uKSlcblx0XHRcdHtcblx0XHRcdFx0QXBwLm1hcENvbXBvbmVudC5wYW5Ub0xvY2F0aW9uKGVsZW1lbnQucG9zaXRpb24pO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IHRoaXMuZWxlbWVudFZpc2libGUubWFya2VyLnNob3dCaWdTaXplKCk7IH0sIDEwMDApO1xuXHRcdFx0XHQvL0FwcC5lbGVtZW50TW9kdWxlLnVwZGF0ZUVsZW1lbnRUb0Rpc3BsYXkoKVxuXHRcdFx0fVx0XHRcdFxuXHRcdH0sIDEwMDApO1xuXG5cdFx0dGhpcy5vblNob3cuZW1pdChlbGVtZW50SWQpO1xuXHR9O1xuXG5cdHNob3coKVxuXHR7XG5cdFx0Ly9BcHAuc2V0VGltZW91dEluZm9CYXJDb21wb25lbnQoKTtcblxuXHRcdGlmICghdGhpcy5pc0Rpc3BsYXllZEFzaWRlKCkpXG5cdFx0e1xuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5zaG93KCk7XG5cblx0XHRcdGxldCBlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQgPSAkKCcjZWxlbWVudC1pbmZvJykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQgKz0gJCgnI2VsZW1lbnQtaW5mby1iYXIgLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZS1oZWxwZXI6dmlzaWJsZScpLmhlaWdodCgpO1xuXG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmNzcygnaGVpZ2h0JywgZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0KTtcblx0XHRcdHVwZGF0ZUluZm9CYXJTaXplKCk7XG5cdFx0XHR1cGRhdGVNYXBTaXplKGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCk7XG5cdFx0fVx0XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdC8qJCgnI2VsZW1lbnQtaW5mby1iYXInKS5zaG93KCk7XG5cdFx0XHR1cGRhdGVJbmZvQmFyU2l6ZSgpOyovXHRcdFxuXG5cdFx0XHRpZiAoISQoJyNlbGVtZW50LWluZm8tYmFyJykuaXMoJzp2aXNpYmxlJykpXG5cdFx0XHR7XG5cdFx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuY3NzKCdyaWdodCcsJy01MDBweCcpO1x0XHRcdFxuXHRcdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLnNob3coKS5hbmltYXRlKHsncmlnaHQnOicwJ30sMzUwLCdzd2luZycsZnVuY3Rpb24oKXsgdXBkYXRlTWFwU2l6ZSgwKTsgfSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHVwZGF0ZUluZm9CYXJTaXplKCk7XG5cdFx0XHQvLyQoJyNlbGVtZW50LWluZm8tYmFyJykuc2hvdyhcInNsaWRlXCIsIHtkaXJlY3Rpb246ICdyaWd0aCcsIGVhc2luZzogJ3N3aW5nJ30gLCAzNTAgKTtcblx0XHR9XG5cblx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG5cdH07XG5cblx0aGlkZSgpXG5cdHtcblx0XHRpZiAoJCgnI2VsZW1lbnQtaW5mby1iYXInKS5pcygnOnZpc2libGUnKSlcblx0XHR7XG5cdFx0XHRpZiAoIXRoaXMuaXNEaXNwbGF5ZWRBc2lkZSgpKVxuXHRcdFx0e1x0XHRcdFxuXHRcdFx0XHR0aGlzLmhpZGVEZXRhaWxzKCk7XG5cdFx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuY3NzKCdoZWlnaHQnLCcwJyk7XG5cdFx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyJykuaGlkZSgpO1xuXHRcdFx0XHR1cGRhdGVNYXBTaXplKDApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQkKCcjZGlyZWN0b3J5LWNvbnRlbnQtbWFwJykuY3NzKCdtYXJnaW4tcmlnaHQnLCcwcHgnKTtcblx0XHRcdFx0JCgnI2JhbmRlYXVfaGVscGVyJykuY3NzKCdtYXJnaW4tcmlnaHQnLCcwcHgnKTtcblxuXHRcdFx0XHRpZiAoJCgnI2VsZW1lbnQtaW5mby1iYXInKS5pcygnOnZpc2libGUnKSlcblx0XHRcdFx0e1x0XHRcblx0XHRcdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmFuaW1hdGUoeydyaWdodCc6Jy01MDBweCd9LDM1MCwnc3dpbmcnLGZ1bmN0aW9uKCl7ICQodGhpcykuaGlkZSgpO3VwZGF0ZU1hcFNpemUoMCk7ICB9KTtcblx0XHRcdFx0fVx0XHRcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vbkhpZGUuZW1pdCh0cnVlKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5lbGVtZW50VmlzaWJsZSAmJiB0aGlzLmVsZW1lbnRWaXNpYmxlLm1hcmtlcikgdGhpcy5lbGVtZW50VmlzaWJsZS5tYXJrZXIuc2hvd05vcm1hbFNpemUodHJ1ZSk7XG5cblx0XHR0aGlzLmVsZW1lbnRWaXNpYmxlID0gbnVsbDtcblx0XHR0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1x0XHRcblx0fTtcblxuXHR0b2dnbGVEZXRhaWxzKClcblx0e1x0XG5cdFx0Ly9BcHAuc2V0VGltZW91dEluZm9CYXJDb21wb25lbnQoKTtcblxuXHRcdGlmICggJCgnI2VsZW1lbnQtaW5mby1iYXIgLm1vcmVEZXRhaWxzJykuaXMoJzp2aXNpYmxlJykgKVxuXHRcdHtcblx0XHRcdHRoaXMuaGlkZURldGFpbHMoKTtcblx0XHRcdCQoJyNiYW5kZWF1X2hlbHBlcicpLmNzcygnei1pbmRleCcsMjApLmFuaW1hdGUoeydvcGFjaXR5JzogJzEnfSw1MDApO1xuXHRcdFx0JCgnI21lbnUtYnV0dG9uJykuZmFkZUluKCk7XHRcdFxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0JCgnI2JhbmRlYXVfaGVscGVyJykuYW5pbWF0ZSh7J29wYWNpdHknOiAnMCd9LDUwMCkuY3NzKCd6LWluZGV4JywtMSk7XG5cdFx0XHQkKCcjbWVudS1idXR0b24nKS5mYWRlT3V0KCk7XG5cblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5tb3JlSW5mb3MnKS5oaWRlKCk7XG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhciAubGVzc0luZm9zJykuc2hvdygpO1x0XG5cdFx0XHRcblx0XHRcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5tb3JlRGV0YWlscycpLnNob3coKTtcdFx0XG5cblx0XHRcdGxldCBlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQgPSAgJCggd2luZG93ICkuaGVpZ2h0KCk7XG5cdFx0XHRlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQgLT0gJCgnaGVhZGVyJykuaGVpZ2h0KCk7XG5cdFx0XHRlbGVtZW50SW5mb0Jhcl9uZXdIZWlnaHQgLT0kKCcjYmFuZGVhdV9nb1RvZGlyZWN0b3J5LWNvbnRlbnQtbGlzdCcpLm91dGVySGVpZ2h0KHRydWUpO1xuXG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhcicpLmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcblxuXHRcdFx0bGV0IGVsZW1lbnRJbmZvQmFyID0gJChcIiNlbGVtZW50LWluZm8tYmFyXCIpO1xuXHRcdCAgXHRsZXQgaGVpZ2h0ID0gIGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodDtcblx0XHRcdGhlaWdodCAtPSBlbGVtZW50SW5mb0Jhci5maW5kKCcuY29sbGFwc2libGUtaGVhZGVyJykub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRoZWlnaHQgLT0gZWxlbWVudEluZm9CYXIuZmluZCgnLnN0YXJSZXByZXNlbnRhdGlvbkNob2ljZS1oZWxwZXI6dmlzaWJsZScpLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0aGVpZ2h0IC09IGVsZW1lbnRJbmZvQmFyLmZpbmQoXCIubWVudS1lbGVtZW50XCIpLm91dGVySGVpZ2h0KHRydWUpO1xuXG5cdFx0ICBcdCQoJyNlbGVtZW50LWluZm8tYmFyIC5jb2xsYXBzaWJsZS1ib2R5JykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuXHRcdFx0XG5cdFx0XHR1cGRhdGVNYXBTaXplKGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCk7XHRcdFx0XG5cdFx0fVx0XG5cdH07XG5cblx0aGlkZURldGFpbHMoKVxuXHR7XG5cdFx0Ly9BcHAuc2V0VGltZW91dEluZm9CYXJDb21wb25lbnQoKTtcblxuXHRcdGlmICgkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZURldGFpbHMnKS5pcygnOnZpc2libGUnKSlcblx0XHR7XG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZURldGFpbHMnKS5oaWRlKCk7XG5cdFx0XHQkKCcjZWxlbWVudC1pbmZvLWJhciAubW9yZUluZm9zJykuc2hvdygpO1xuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXIgLmxlc3NJbmZvcycpLmhpZGUoKTtcblxuXHRcdFx0bGV0IGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCA9ICQoJyNlbGVtZW50LWluZm8nKS5vdXRlckhlaWdodCh0cnVlKSArICQoJyNlbGVtZW50LWluZm8tYmFyIC5zdGFyUmVwcmVzZW50YXRpb25DaG9pY2UtaGVscGVyOnZpc2libGUnKS5oZWlnaHQoKTtcblxuXHRcdFx0JCgnI2VsZW1lbnQtaW5mby1iYXInKS5jc3MoJ2hlaWdodCcsIGVsZW1lbnRJbmZvQmFyX25ld0hlaWdodCk7XG5cblx0XHRcdHVwZGF0ZU1hcFNpemUoZWxlbWVudEluZm9CYXJfbmV3SGVpZ2h0KTtcdFxuXHRcdH1cdFxuXHR9O1xufVxuXG4iLCIvKipcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBNb25Wb2lzaW5GYWl0RHVCaW8gcHJvamVjdC5cbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNiBTZWJhc3RpYW4gQ2FzdHJvIC0gOTBzY2FzdHJvQGdtYWlsLmNvbVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTYtMTItMTNcbiAqL1xuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMgfSBmcm9tIFwiLi4vLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgZHJhd0xpbmVCZXR3ZWVuUG9pbnRzIH0gZnJvbSBcIi4vbWFwLWRyYXdpbmdcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgbGV0ICQ7XG5cbmRlY2xhcmUgbGV0IFR3aWcgOiBhbnk7XG5kZWNsYXJlIGxldCBiaW9wZW5fdHdpZ0pzX21hcmtlciA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEJpb3Blbk1hcmtlclxue1xuXHRpZF8gOiBzdHJpbmc7XG5cdGlzQW5pbWF0aW5nXyA6IGJvb2xlYW4gPSBmYWxzZTtcblx0cmljaE1hcmtlcl8gOiBMLk1hcmtlcjtcblx0aXNIYWxmSGlkZGVuXyA6IGJvb2xlYW4gPSBmYWxzZTtcblx0aW5jbGluYXRpb25fID0gXCJub3JtYWxcIjtcblx0cG9seWxpbmVfO1xuXG5cdGNvbnN0cnVjdG9yKGlkXyA6IHN0cmluZywgcG9zaXRpb25fIDogTC5MYXRMbmcpIFxuXHR7XG5cdFx0dGhpcy5pZF8gPSBpZF87XG5cblx0XHRpZiAoIXBvc2l0aW9uXylcblx0XHR7XG5cdFx0XHRsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuXHRcdFx0aWYgKGVsZW1lbnQgPT09IG51bGwpIHdpbmRvdy5jb25zb2xlLmxvZyhcImVsZW1lbnQgbnVsbCBpZCA9IFwiKyB0aGlzLmlkXyk7XG5cdFx0XHRlbHNlIHBvc2l0aW9uXyA9IGVsZW1lbnQucG9zaXRpb247XG5cdFx0fSBcblxuXHRcdHRoaXMucmljaE1hcmtlcl8gPSBMLm1hcmtlcihwb3NpdGlvbl8sIHsgJ3Jpc2VPbkhvdmVyJyA6IHRydWV9KTtcdFxuXHRcdFx0XG5cdFx0dGhpcy5yaWNoTWFya2VyXy5vbignY2xpY2snLCAoZXYpID0+XG5cdFx0e1xuXHRcdFx0QXBwLmhhbmRsZU1hcmtlckNsaWNrKHRoaXMpO1x0XG4gIFx0fSk7XG5cdFxuXHRcdHRoaXMucmljaE1hcmtlcl8ub24oJ21vdXNlb3ZlcicsIChldikgPT5cblx0XHR7XG5cdFx0XHRpZiAodGhpcy5pc0FuaW1hdGluZ18pIHsgcmV0dXJuOyB9XG5cdFx0XHQvL2lmICghdGhpcy5pc05lYXJseUhpZGRlbl8pIC8vIGZvciBjb25zdGVsbGF0aW9uIG1vZGUgIVxuXHRcdFx0XHR0aGlzLnNob3dCaWdTaXplKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnJpY2hNYXJrZXJfLm9uKCdtb3VzZW91dCcsIChldikgPT5cblx0XHR7XG5cdFx0XHRpZiAodGhpcy5pc0FuaW1hdGluZ18pIHsgcmV0dXJuOyB9XHRcdFx0XG5cdFx0XHR0aGlzLnNob3dOb3JtYWxTaXplKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKVxuXHRcdC8vIHtcblx0XHQvLyBcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMucmljaE1hcmtlcl8sICd2aXNpYmxlX2NoYW5nZWQnLCAoKSA9PiBcblx0XHQvLyBcdHsgXG5cdFx0Ly8gXHRcdHRoaXMuY2hlY2tQb2x5bGluZVZpc2liaWxpdHlfKHRoaXMpOyBcblx0XHQvLyBcdH0pO1xuXHRcdC8vIH1cblxuXHRcdHRoaXMuaXNIYWxmSGlkZGVuXyA9IGZhbHNlO1x0XHRcdFxuXG5cdFx0dGhpcy51cGRhdGUoKTtcdFxuXHR9O1x0XG5cblx0aXNEaXNwbGF5ZWRPbkVsZW1lbnRJbmZvQmFyKClcblx0e1xuXHRcdHJldHVybiBBcHAuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkgPT0gdGhpcy5pZF87XG5cdH1cblxuXHRwcml2YXRlIGRvbU1hcmtlcigpXG5cdHtcblx0XHRyZXR1cm4gJCgnI21hcmtlci0nKyB0aGlzLmlkXyk7XG5cdH1cblxuXHRhbmltYXRlRHJvcCgpIFxuXHR7XG5cdFx0dGhpcy5pc0FuaW1hdGluZ18gPSB0cnVlO1xuXHRcdHRoaXMuZG9tTWFya2VyKCkuYW5pbWF0ZSh7dG9wOiAnLT0yNXB4J30sIDMwMCwgJ2Vhc2VJbk91dEN1YmljJyk7XG5cdFx0dGhpcy5kb21NYXJrZXIoKS5hbmltYXRlKHt0b3A6ICcrPTI1cHgnfSwgMjUwLCAnZWFzZUluT3V0Q3ViaWMnLCBcblx0XHRcdCgpID0+IHt0aGlzLmlzQW5pbWF0aW5nXyA9IGZhbHNlO30gKTtcblx0fTtcblxuXHR1cGRhdGUoKSBcblx0e1x0XHRcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuXG5cdFx0bGV0IGRpc2FibGVNYXJrZXIgPSBmYWxzZTtcblx0XHRsZXQgc2hvd01vcmVJY29uID0gdHJ1ZTtcblxuXHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pXG5cdFx0e1xuXHRcdFx0Ly8gUE9MWUxJTkUgVFlQRVxuXHRcdFx0bGV0IGxpbmVUeXBlO1xuXG5cdFx0XHRpZiAoZWxlbWVudC5zdGFyQ2hvaWNlRm9yUmVwcmVzZW50YXRpb24gPT09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRsaW5lVHlwZSA9IEFwcFN0YXRlcy5Ob3JtYWw7XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcdFx0XHRcblx0XHRcdFx0bGluZVR5cGUgPSBlbGVtZW50LmlzQ3VycmVudFN0YXJDaG9pY2VSZXByZXNlbnRhbnQoKSA/IEFwcFN0YXRlcy5Ob3JtYWwgOiAnZGFzaGVkJztcblx0XHRcdFx0Ly8gZW4gbW9kZSBTQ1IsIHRvdXQgbGVzbWFya2VycyBzb250IGRpc2FibGVkIHNhdWYgbGUgcmVwcsOpc2VudGFudCBkZSBsJ8OpdG9pbGVcblx0XHRcdFx0ZGlzYWJsZU1hcmtlciA9ICFlbGVtZW50LmlzQ3VycmVudFN0YXJDaG9pY2VSZXByZXNlbnRhbnQoKTtcblx0XHRcdH1cdFx0XG5cblx0XHRcdHRoaXMudXBkYXRlUG9seWxpbmUoe2xpbmVUeXBlOiBsaW5lVHlwZX0pO1xuXHRcdH1cblxuXHRcdGxldCBvcHRpb25zdG9EaXNwbGF5ID0gZWxlbWVudC5nZXRJY29uc1RvRGlzcGxheSgpO1xuXG5cdFx0Ly8gSWYgdXNlY29sb3IgYW5kIHVzZUljb24sIHdlIGRvbid0IHNob3cgb3RoZXJzIGljb25zXG5cdFx0Ly8gaWYgKG9wdGlvbnN0b0Rpc3BsYXlbMF0pXG5cdFx0Ly8gXHRzaG93TW9yZUljb24gPSAhb3B0aW9uc3RvRGlzcGxheVswXS51c2VDb2xvckZvck1hcmtlciB8fCAhb3B0aW9uc3RvRGlzcGxheVswXS51c2VJY29uRm9yTWFya2VyO1xuXG5cdFx0bGV0IGh0bWxNYXJrZXIgPSBUd2lnLnJlbmRlcihiaW9wZW5fdHdpZ0pzX21hcmtlciwgXG5cdFx0e1xuXHRcdFx0ZWxlbWVudCA6IGVsZW1lbnQsIFxuXHRcdFx0bWFpbk9wdGlvblZhbHVlVG9EaXNwbGF5OiBvcHRpb25zdG9EaXNwbGF5WzBdLFxuXHRcdFx0b3RoZXJPcHRpb25zVmFsdWVzVG9EaXNwbGF5OiBvcHRpb25zdG9EaXNwbGF5LnNsaWNlKDEpLCBcblx0XHRcdHNob3dNb3JlSWNvbiA6IHNob3dNb3JlSWNvbixcblx0XHRcdGRpc2FibGVNYXJrZXIgOiBkaXNhYmxlTWFya2VyXG5cdFx0fSk7XG5cbiAgXHR0aGlzLnJpY2hNYXJrZXJfLnNldEljb24oTC5kaXZJY29uKHtjbGFzc05hbWU6ICdsZWFmbGV0LW1hcmtlci1jb250YWluZXInLCBodG1sOiBodG1sTWFya2VyfSkpO1x0XG5cbiAgXHRpZiAodGhpcy5pc0Rpc3BsYXllZE9uRWxlbWVudEluZm9CYXIoKSkgdGhpcy5zaG93QmlnU2l6ZSgpO1xuXG4gIFx0aWYgKHRoaXMuaW5jbGluYXRpb25fID09IFwicmlnaHRcIikgdGhpcy5pbmNsaW5hdGVSaWdodCgpO1xuICBcdGlmICh0aGlzLmluY2xpbmF0aW9uXyA9PSBcImxlZnRcIikgdGhpcy5pbmNsaW5hdGVMZWZ0KCk7XG5cdH07XG5cblx0YWRkQ2xhc3NUb1JpY2hNYXJrZXJfIChjbGFzc1RvQWRkKSBcblx0e1x0XHRcblx0XHR0aGlzLmRvbU1hcmtlcigpLmFkZENsYXNzKGNsYXNzVG9BZGQpO1xuXHRcdHRoaXMuZG9tTWFya2VyKCkuc2libGluZ3MoJy5tYXJrZXItbmFtZScpLmFkZENsYXNzKGNsYXNzVG9BZGQpOyBcblx0fTtcblxuXHRyZW1vdmVDbGFzc1RvUmljaE1hcmtlcl8gKGNsYXNzVG9SZW1vdmUpIFxuXHR7XHRcdFxuXHRcdHRoaXMuZG9tTWFya2VyKCkucmVtb3ZlQ2xhc3MoY2xhc3NUb1JlbW92ZSk7XG5cdFx0dGhpcy5kb21NYXJrZXIoKS5zaWJsaW5ncygnLm1hcmtlci1uYW1lJykucmVtb3ZlQ2xhc3MoY2xhc3NUb1JlbW92ZSk7ICAgICAgXG5cdH07XG5cblx0c2hvd0JpZ1NpemUgKCkgXG5cdHtcdFx0XHRcblx0XHR0aGlzLmFkZENsYXNzVG9SaWNoTWFya2VyXyhcIkJpZ1NpemVcIik7XG5cdFx0bGV0IGRvbU1hcmtlciA9IHRoaXMuZG9tTWFya2VyKCk7XG5cdFx0ZG9tTWFya2VyLnBhcmVudCgpLmZpbmQoJy5tYXJrZXItbmFtZScpLnNob3coKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLm1vcmVJY29uQ29udGFpbmVyJykuc2hvdygpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcuaWNvbi1wbHVzLWNpcmNsZScpLmhpZGUoKTtcblx0XHRcblx0XHRpZiAoIXRoaXMuaXNIYWxmSGlkZGVuXyAmJiB0aGlzLnBvbHlsaW5lXylcblx0XHR7XG5cdFx0XHR0aGlzLnNldFBvbHlsaW5lT3B0aW9ucyh7XG5cdFx0XHRcdHN0cm9rZU9wYWNpdHk6IDEsXG5cdFx0XHRcdHN0cm9rZVdlaWdodDogM1xuXHRcdFx0fSk7XG5cdFx0fVx0XG5cdH07XG5cblx0c2hvd05vcm1hbFNpemUgKCRmb3JjZSA6IGJvb2xlYW4gPSBmYWxzZSkgXG5cdHtcdFxuXHRcdGlmICghJGZvcmNlICYmIHRoaXMuaXNEaXNwbGF5ZWRPbkVsZW1lbnRJbmZvQmFyKCkpIHJldHVybjtcblxuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdHRoaXMucmVtb3ZlQ2xhc3NUb1JpY2hNYXJrZXJfKFwiQmlnU2l6ZVwiKTtcblx0XHRkb21NYXJrZXIucGFyZW50KCkuZmluZCgnLm1hcmtlci1uYW1lJykuaGlkZSgpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcubW9yZUljb25Db250YWluZXInKS5oaWRlKCk7XG5cdFx0ZG9tTWFya2VyLmZpbmQoJy5pY29uLXBsdXMtY2lyY2xlJykuc2hvdygpO1xuXHRcdFxuXHRcdGlmICghdGhpcy5pc0hhbGZIaWRkZW5fICYmIHRoaXMucG9seWxpbmVfKVxuXHRcdHtcblx0XHRcdHRoaXMuc2V0UG9seWxpbmVPcHRpb25zKHtcblx0XHRcdFx0c3Ryb2tlT3BhY2l0eTogMC41LFxuXHRcdFx0XHRzdHJva2VXZWlnaHQ6IDNcblx0XHRcdH0pO1xuXHRcdH1cdFxuXHR9O1xuXG5cdGluaXRpYWxpemVJbmNsaW5hdGlvbiAoKSBcblx0e1x0XG5cdFx0bGV0IGRvbU1hcmtlciA9IHRoaXMuZG9tTWFya2VyKCk7XG5cdFx0ZG9tTWFya2VyLmNzcyhcInotaW5kZXhcIixcIjFcIik7XG5cdFx0ZG9tTWFya2VyLmZpbmQoXCIucm90YXRlXCIpLnJlbW92ZUNsYXNzKFwicm90YXRlTGVmdFwiKS5yZW1vdmVDbGFzcyhcInJvdGF0ZVJpZ2h0XCIpO1xuXHRcdGRvbU1hcmtlci5yZW1vdmVDbGFzcyhcInJvdGF0ZUxlZnRcIikucmVtb3ZlQ2xhc3MoXCJyb3RhdGVSaWdodFwiKTtcblx0XHR0aGlzLmluY2xpbmF0aW9uXyA9IFwibm9ybWFsXCI7XG5cdH07XG5cblx0aW5jbGluYXRlUmlnaHQgKCkgXG5cdHtcdFxuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5maW5kKFwiLnJvdGF0ZVwiKS5hZGRDbGFzcyhcInJvdGF0ZVJpZ2h0XCIpO1xuXHQgICBkb21NYXJrZXIuYWRkQ2xhc3MoXCJyb3RhdGVSaWdodFwiKTtcblx0ICAgdGhpcy5pbmNsaW5hdGlvbl8gPSBcInJpZ2h0XCI7XG5cdH07XG5cblx0aW5jbGluYXRlTGVmdCAoKSBcblx0e1x0XG5cdFx0bGV0IGRvbU1hcmtlciA9IHRoaXMuZG9tTWFya2VyKCk7XG5cdFx0ZG9tTWFya2VyLmZpbmQoXCIucm90YXRlXCIpLmFkZENsYXNzKFwicm90YXRlTGVmdFwiKTtcblx0ICAgZG9tTWFya2VyLmFkZENsYXNzKFwicm90YXRlTGVmdFwiKTtcblx0ICAgdGhpcy5pbmNsaW5hdGlvbl8gPSBcImxlZnRcIjtcblx0fTtcblxuXG5cdHNldFBvbHlsaW5lT3B0aW9ucyAob3B0aW9ucylcblx0e1xuXHRcdGlmICghdGhpcy5wb2x5bGluZV8uaXNEYXNoZWQpXG5cdFx0e1xuXHRcdFx0dGhpcy5wb2x5bGluZV8uc2V0T3B0aW9ucyhvcHRpb25zKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMudXBkYXRlUG9seWxpbmUoe1xuXHRcdFx0XHRsaW5lVHlwZSA6ICdkYXNoZWQnICwgXG5cdFx0XHRcdHN0cm9rZU9wYWNpdHk6IG9wdGlvbnMuc3Ryb2tlT3BhY2l0eSxcblx0XHRcdFx0c3Ryb2tlV2VpZ2h0OiBvcHRpb25zLnN0cm9rZVdlaWdodFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRcdFxuXHR1cGRhdGVQb2x5bGluZSAob3B0aW9ucykgXG5cdHtcblx0XHQvLyBpZiAoIXRoaXMucG9seWxpbmVfKVxuXHRcdC8vIHtcblx0XHQvLyBcdHRoaXMucG9seWxpbmVfID0gZHJhd0xpbmVCZXR3ZWVuUG9pbnRzKEFwcC5jb25zdGVsbGF0aW9uLmdldE9yaWdpbigpLCB0aGlzLnJpY2hNYXJrZXJfLmdldFBvc2l0aW9uKCksIHRoaXMuZ2V0RWxlbWVudCgpLnR5cGUsIG51bGwsIG9wdGlvbnMpO1xuXHRcdC8vIH1cblx0XHQvLyBlbHNlXG5cdFx0Ly8ge1x0XHRcblx0XHQvLyBcdGxldCBtYXAgPSB0aGlzLnBvbHlsaW5lXy5nZXRNYXAoKTtcblx0XHQvLyBcdHRoaXMucG9seWxpbmVfLnNldE1hcChudWxsKTtcblx0XHQvLyBcdHRoaXMucG9seWxpbmVfID0gZHJhd0xpbmVCZXR3ZWVuUG9pbnRzKEFwcC5jb25zdGVsbGF0aW9uLmdldE9yaWdpbigpLCB0aGlzLnJpY2hNYXJrZXJfLmdldFBvc2l0aW9uKCksIHRoaXMuZ2V0RWxlbWVudCgpLnR5cGUsIG1hcCwgb3B0aW9ucyk7XHRcblx0XHQvLyB9XG5cdH07XG5cblx0c2hvd0hhbGZIaWRkZW4gKCRmb3JjZSA6IGJvb2xlYW4gPSBmYWxzZSkgXG5cdHtcdFx0XG5cdFx0aWYgKCEkZm9yY2UgJiYgdGhpcy5pc0Rpc3BsYXllZE9uRWxlbWVudEluZm9CYXIoKSkgcmV0dXJuO1xuXG5cdFx0dGhpcy5hZGRDbGFzc1RvUmljaE1hcmtlcl8oXCJoYWxmSGlkZGVuXCIpO1xuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5jc3MoJ3otaW5kZXgnLCcxJyk7XG5cdFx0ZG9tTWFya2VyLmZpbmQoJy5pY29uLXBsdXMtY2lyY2xlJykuYWRkQ2xhc3MoXCJoYWxmSGlkZGVuXCIpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcubW9yZUljb25Db250YWluZXInKS5hZGRDbGFzcyhcImhhbGZIaWRkZW5cIik7XG5cdFx0aWYgKHRoaXMucG9seWxpbmVfKSB0aGlzLnNldFBvbHlsaW5lT3B0aW9ucyh7XG5cdFx0XHRcdHN0cm9rZU9wYWNpdHk6IDAuMSxcblx0XHRcdFx0c3Ryb2tlV2VpZ2h0OiAyXG5cdFx0fSk7XG5cblx0XHR0aGlzLmlzSGFsZkhpZGRlbl8gPSB0cnVlO1xuXHR9O1xuXG5cdHNob3dOb3JtYWxIaWRkZW4gKCkgXG5cdHtcdFx0XG5cdFx0dGhpcy5yZW1vdmVDbGFzc1RvUmljaE1hcmtlcl8oXCJoYWxmSGlkZGVuXCIpO1xuXHRcdGxldCBkb21NYXJrZXIgPSB0aGlzLmRvbU1hcmtlcigpO1xuXHRcdGRvbU1hcmtlci5jc3MoJ3otaW5kZXgnLCcxMCcpO1xuXHRcdGRvbU1hcmtlci5maW5kKCcuaWNvbi1wbHVzLWNpcmNsZScpLnJlbW92ZUNsYXNzKFwiaGFsZkhpZGRlblwiKTtcblx0XHRkb21NYXJrZXIuZmluZCgnLm1vcmVJY29uQ29udGFpbmVyJykucmVtb3ZlQ2xhc3MoXCJoYWxmSGlkZGVuXCIpO1xuXHRcdFxuXHRcdGlmICh0aGlzLnBvbHlsaW5lXykgdGhpcy5zZXRQb2x5bGluZU9wdGlvbnMoe1xuXHRcdFx0XHRzdHJva2VPcGFjaXR5OiAwLjcsXG5cdFx0XHRcdHN0cm9rZVdlaWdodDogM1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5pc0hhbGZIaWRkZW5fID0gZmFsc2U7XG5cdH07XG5cblx0Z2V0SWQgKCkgOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZF87IH07XG5cblx0Z2V0UmljaE1hcmtlciAoKSA6IEwuTWFya2VyIHsgcmV0dXJuIHRoaXMucmljaE1hcmtlcl87IH07XG5cblx0aXNIYWxmSGlkZGVuKCkgOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNIYWxmSGlkZGVuXzsgfVxuXG5cdGdldEVsZW1lbnQgKCkgOiBFbGVtZW50IHsgcmV0dXJuIEFwcC5lbGVtZW50TW9kdWxlLmdldEVsZW1lbnRCeUlkKHRoaXMuaWRfKTsgfTtcblxuXHRjaGVja1BvbHlsaW5lVmlzaWJpbGl0eV8gKGNvbnRleHQpIFxuXHR7XHRcdFxuXHRcdGlmIChjb250ZXh0LnJpY2hNYXJrZXJfID09PSBudWxsKSByZXR1cm47XG5cdFx0Ly93aW5kb3cuY29uc29sZS5sb2coXCJjaGVja1BvbHlsaW5lVmlzaWJpbGl0eV8gXCIgKyBjb250ZXh0LnJpY2hNYXJrZXJfLmdldFZpc2libGUoKSk7XG5cdFx0Y29udGV4dC5wb2x5bGluZV8uc2V0VmlzaWJsZShjb250ZXh0LnJpY2hNYXJrZXJfLmdldFZpc2libGUoKSk7XHRcblx0XHRjb250ZXh0LnBvbHlsaW5lXy5zZXRNYXAoY29udGV4dC5yaWNoTWFya2VyXy5nZXRNYXAoKSk7XHRcblxuXHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zKSBcblx0XHR7XG5cdFx0XHRjb250ZXh0LnBvbHlsaW5lXy5zZXRNYXAobnVsbCk7XHRcblx0XHRcdGNvbnRleHQucG9seWxpbmVfLnNldFZpc2libGUoZmFsc2UpO1xuXHRcdH1cdFxuXHR9O1xuXG5cdHNob3cgKCkgXG5cdHtcdFxuXHRcdEFwcC5tYXBDb21wb25lbnQuYWRkTWFya2VyKHRoaXMucmljaE1hcmtlcl8pO1xuXHRcdC8vdGhpcy5yaWNoTWFya2VyXy5hZGRUbyhBcHAubWFwKCkpO1xuXHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLkNvbnN0ZWxsYXRpb24pIHRoaXMucG9seWxpbmVfLnNldE1hcChBcHAubWFwKCkpO1xuXHR9O1xuXG5cdGhpZGUgKCkgXG5cdHtcdFx0XHRcblx0XHRBcHAubWFwQ29tcG9uZW50LnJlbW92ZU1hcmtlcih0aGlzLnJpY2hNYXJrZXJfKTtcblx0XHQvL3RoaXMucmljaE1hcmtlcl8ucmVtb3ZlKCk7XG5cdFx0aWYgKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbikgdGhpcy5wb2x5bGluZV8uc2V0TWFwKG51bGwpO1xuXHR9O1xuXG5cdHNldFZpc2libGUgKGJvb2wgOiBib29sZWFuKSBcblx0e1x0XG5cdFx0Ly90aGlzLnJpY2hNYXJrZXJfLnNldFZpc2libGUoYm9vbCk7XG5cdFx0aWYgKGJvb2wpIHRoaXMuc2hvdygpO1xuXHRcdGVsc2UgdGhpcy5oaWRlKCk7XG5cdH07XG5cblx0Z2V0UG9zaXRpb24gKCkgOiBMLkxhdExuZ1xuXHR7XHRcblx0XHRyZXR1cm4gdGhpcy5yaWNoTWFya2VyXy5nZXRMYXRMbmcoKTtcblx0fTtcbn1cblxuIiwiXG5pbXBvcnQgeyBBcHBNb2R1bGUsIEFwcFN0YXRlcyB9IGZyb20gXCIuLi8uLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFdmVudCwgSUV2ZW50IH0gZnJvbSBcIi4uLy4uL3V0aWxzL2V2ZW50XCI7XG5pbXBvcnQgeyBpbml0QXV0b0NvbXBsZXRpb25Gb3JFbGVtZW50IH0gZnJvbSBcIi4uLy4uLy4uL2NvbW1vbnMvc2VhcmNoLWJhci5jb21wb25lbnRcIjtcbmltcG9ydCB7IGluaXRDbHVzdGVyIH0gZnJvbSBcIi4vY2x1c3Rlci9pbml0LWNsdXN0ZXJcIjtcbmltcG9ydCB7IGNhcGl0YWxpemUsIHNsdWdpZnkgfSBmcm9tIFwiLi4vLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5pbXBvcnQgeyBHZW9jb2RlUmVzdWx0LCBSYXdCb3VuZHMgfSBmcm9tIFwiLi4vLi4vbW9kdWxlcy9nZW9jb2Rlci5tb2R1bGVcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuZGVjbGFyZSB2YXIgJCwgTCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIFZpZXdQb3J0XG57XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBsYXQgOiBudW1iZXIgPSAwLCBcblx0XHRcdFx0XHRwdWJsaWMgbG5nIDpudW1iZXIgPSAwLCBcblx0XHRcdFx0XHRwdWJsaWMgem9vbSA6IG51bWJlciA9IDApXG5cdHtcblx0XHR0aGlzLmxhdCA9IGxhdCB8fCAwO1xuXHRcdHRoaXMubG5nID0gbG5nIHx8IDA7XG5cdFx0dGhpcy56b29tID0gem9vbSB8fCAwO1xuXHR9XG5cblx0dG9TdHJpbmcoKVxuXHR7XG5cdFx0bGV0IGRpZ2l0cyA9IHRoaXMuem9vbSA+IDE0ID8gNCA6IDI7XG5cdFx0cmV0dXJuIGBAJHt0aGlzLmxhdC50b0ZpeGVkKGRpZ2l0cyl9LCR7dGhpcy5sbmcudG9GaXhlZChkaWdpdHMpfSwke3RoaXMuem9vbX16YDtcblx0fVxuXG5cdGZyb21TdHJpbmcoc3RyaW5nIDogc3RyaW5nKVxuXHR7XG5cdFx0aWYgKCFzdHJpbmcpIHJldHVybiBudWxsO1xuXG5cdFx0bGV0IGRlY29kZSA9IHN0cmluZy5zcGxpdCgnQCcpLnBvcCgpLnNwbGl0KCcsJyk7XG5cdFx0aWYgKGRlY29kZS5sZW5ndGggIT0gMykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJWaWV3UG9ydCBmcm9tU3RyaW5nIGVycmV1clwiLCBzdHJpbmcpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdHRoaXMubGF0ID0gcGFyc2VGbG9hdChkZWNvZGVbMF0pO1xuXHRcdHRoaXMubG5nID0gcGFyc2VGbG9hdChkZWNvZGVbMV0pO1xuXHRcdHRoaXMuem9vbSA9IHBhcnNlSW50KGRlY29kZVsyXS5zbGljZSgwLC0xKSk7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiVmlld1BvcnQgZnJvbVN0cmluZyBEb25lXCIsIHRoaXMpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuXG4vKipcbiogVGhlIE1hcCBDb21wb25lbnQgd2hvIGVuY2Fwc3VsYXRlIHRoZSBtYXBcbipcbiogTWFwQ29tcG9uZW50IHB1YmxpY3MgbWV0aG9kcyBtdXN0IGJlIGFzIGluZGVwZW5kYW50IGFzIHBvc3NpYmxlXG4qIGZyb20gdGVjaG5vbG9neSB1c2VkIGZvciB0aGUgbWFwIChnb29nbGUsIGxlYWZsZXQgLi4uKVxuKlxuKiBNYXAgY29tcG9uZW50IGlzIGxpa2UgYW4gaW50ZXJmYWNlIGJldHdlZW4gdGhlIG1hcCBhbmQgdGhlIHJlc3Qgb2YgdGhlIEFwcFxuKi9cbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnRcbntcblx0b25NYXBSZWFkeSA9IG5ldyBFdmVudDxhbnk+KCk7XG5cdG9uTWFwTG9hZGVkID0gbmV3IEV2ZW50PGFueT4oKTtcblx0b25DbGljayA9IG5ldyBFdmVudDxhbnk+KCk7XG5cdG9uSWRsZSA9IG5ldyBFdmVudDxhbnk+KCk7XG5cblx0Ly9MZWFmbGV0IG1hcFxuXHRtYXBfIDogTC5NYXAgPSBudWxsO1xuXG5cdG1hcmtlckNsdXN0ZXJlckdyb3VwO1xuXHRpc0luaXRpYWxpemVkIDogYm9vbGVhbiA9IGZhbHNlO1xuXHRpc01hcExvYWRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcblx0Y2x1c3RlcmVyXyA9IG51bGw7XG5cdG9sZFpvb20gPSAtMTtcblx0dmlld3BvcnQgOiBWaWV3UG9ydCA9IG51bGw7XG5cblxuXHRnZXRNYXAoKXsgcmV0dXJuIHRoaXMubWFwXzsgfTsgXG5cdGdldENlbnRlcigpIDogTC5MYXRMbmcgeyByZXR1cm4gdGhpcy52aWV3cG9ydCA/IEwubGF0TG5nKHRoaXMudmlld3BvcnQubGF0LCB0aGlzLnZpZXdwb3J0LmxuZykgOiBudWxsOyB9XG5cdGdldEJvdW5kcygpIDogTC5MYXRMbmdCb3VuZHMgeyByZXR1cm4gdGhpcy5tYXBfID8gdGhpcy5tYXBfLmdldEJvdW5kcygpIDogbnVsbDsgfVxuXHRnZXRDbHVzdGVyZXIoKSB7IHJldHVybiB0aGlzLmNsdXN0ZXJlcl87IH07XG5cdGdldFpvb20oKSB7IHJldHVybiB0aGlzLm1hcF8uZ2V0Wm9vbSgpOyB9XG5cdGdldE9sZFpvb20oKSB7IHJldHVybiB0aGlzLm9sZFpvb207IH1cblxuXHRpbml0KCkgXG5cdHtcdFxuXHRcdC8vaW5pdEF1dG9Db21wbGV0aW9uRm9yRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWJhcicpKTtcblx0XHRpZiAodGhpcy5pc0luaXRpYWxpemVkKSBcblx0XHR7XG5cdFx0XHR0aGlzLnJlc2l6ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMubWFwXyA9IEwubWFwKCdkaXJlY3RvcnktY29udGVudC1tYXAnLCB7XG5cdFx0ICAgIHpvb21Db250cm9sOiBmYWxzZVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5tYXJrZXJDbHVzdGVyZXJHcm91cCA9IEwubWFya2VyQ2x1c3Rlckdyb3VwKHtcblx0XHQgICAgc3BpZGVyZnlPbk1heFpvb206IHRydWUsXG5cdFx0ICAgIHNob3dDb3ZlcmFnZU9uSG92ZXI6IGZhbHNlLFxuXHRcdCAgICB6b29tVG9Cb3VuZHNPbkNsaWNrOiB0cnVlLFxuXHRcdCAgICBzcGlkZXJmeU9uSG92ZXI6IGZhbHNlLFxuXHRcdCAgICBzcGlkZXJmeU1heENvdW50OiA4LFxuXHRcdCAgICBzcGlkZXJmeURpc3RhbmNlTXVsdGlwbGllcjogMS4xLFxuXHRcdCAgICBtYXhDbHVzdGVyUmFkaXVzOiAoem9vbSkgPT5cblx0XHQgICAge1xuXHRcdCAgICBcdGlmICh6b29tID4gOSkgcmV0dXJuIDU1O1xuXHRcdCAgICBcdGVsc2UgcmV0dXJuIDEwMDtcblx0XHQgICAgfVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5tYXBfLmFkZExheWVyKHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXApO1xuXG5cdFx0TC5jb250cm9sLnpvb20oe1xuXHRcdCAgIHBvc2l0aW9uOid0b3ByaWdodCdcblx0XHR9KS5hZGRUbyh0aGlzLm1hcF8pO1xuXG5cdFx0TC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL21hcGJveC9zdHJlZXRzLXYxMC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYzJWaVlXeHNiM1FpTENKaElqb2lZMmw0TUd0bmVHVmpNREYwYURKNmNXTnRkV0Z2YzJZM1lTSjkubklacjZHMnQwOGV0TXpmdF9CSEhVUScpLmFkZFRvKHRoaXMubWFwXyk7XG5cblx0XHR0aGlzLm1hcF8ub24oJ2NsaWNrJywgKGUpID0+IHsgdGhpcy5vbkNsaWNrLmVtaXQoKTsgfSk7XG5cdFx0dGhpcy5tYXBfLm9uKCdtb3ZlZW5kJywgKGUpID0+IFxuXHRcdHsgXG5cdFx0XHR0aGlzLm9sZFpvb20gPSB0aGlzLm1hcF8uZ2V0Wm9vbSgpO1xuXHRcdFx0dGhpcy51cGRhdGVWaWV3UG9ydCgpO1xuXHRcdFx0dGhpcy5vbklkbGUuZW1pdCgpOyBcblx0XHR9KTtcblx0XHR0aGlzLm1hcF8ub24oJ2xvYWQnLCAoZSkgPT4geyB0aGlzLmlzTWFwTG9hZGVkID0gdHJ1ZTsgdGhpcy5vbk1hcExvYWRlZC5lbWl0KCk7IH0pO1xuXG5cdFx0dGhpcy5yZXNpemUoKTtcblxuXHRcdC8vIGlmIHdlIGJlZ2FuIHdpdGggTGlzdCBNb2RlLCB3aGVuIHdlIGluaXRpYWxpemUgbWFwXG5cdFx0Ly8gdGhlcmUgaXMgYWxyZWFkeSBhbiBhZGRyZXNzIGdlb2NvZGVkIG9yIGEgdmlld3BvcnQgZGVmaW5lZFxuXHRcdGlmIChBcHAgJiYgQXBwLmdlb2NvZGVyLmdldEJvdW5kcygpKVxuXHQgICB7XG5cdCAgIFx0dGhpcy5maXRCb3VuZHMoQXBwLmdlb2NvZGVyLmdldEJvdW5kcygpLCBmYWxzZSk7XG5cdCAgIH1cblx0ICAgZWxzZSBpZiAodGhpcy52aWV3cG9ydClcblx0ICAge1xuXHQgICBcdC8vIHNldFRpbWVvdXQgd2FpdGluZyBmb3IgdGhlIG1hcCB0byBiZSByZXNpemVkXG5cdCAgIFx0c2V0VGltZW91dCggKCkgPT4geyB0aGlzLnNldFZpZXdQb3J0KHRoaXMudmlld3BvcnQpOyB9LDIwMCk7XG5cdCAgIH1cblxuXHRcdHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIm1hcCBpbml0IGRvbmVcIik7XG5cdFx0dGhpcy5vbk1hcFJlYWR5LmVtaXQoKTtcblx0fTtcblxuXHRyZXNpemUoKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIlJlc2l6ZSwgY3VyciB2aWV3cG9ydCA6XCIpO1xuXHRcdC8vIFdhcm5pbmcgIUkgY2hhbmdlZCB0aGUgbGVhZmxldC5qcyBmaWxlIGxpYnJhcnkgbXlzZWxmXG5cdFx0Ly8gYmVjYXVzZSB0aGUgb3B0aW9ucyBkb2Vzbid0IHdvcmsgcHJvcGVybHlcblx0XHQvLyBJIGNoYW5nZWQgaXQgdG8gYXZvaSBwYW5uaW5nIHdoZW4gcmVzaXppbmcgdGhlIG1hcFxuXHRcdC8vIGJlIGNhcmVmdWwgaWYgdXBkYXRpbmcgdGhlIGxlYWZsZXQgbGlicmFyeSB0aGlzIHdpbGxcblx0XHQvLyBub3Qgd29yayBhbnltb3JlXG5cdFx0aWYgKHRoaXMubWFwXykgdGhpcy5tYXBfLmludmFsaWRhdGVTaXplKGZhbHNlKTtcblx0fVxuXG5cdGFkZE1hcmtlcihtYXJrZXIgOiBMLk1hcmtlcilcblx0e1xuXHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXAuYWRkTGF5ZXIobWFya2VyKTtcblx0fVxuXG5cdHJlbW92ZU1hcmtlcihtYXJrZXIgOiBMLk1hcmtlcilcblx0e1xuXHRcdHRoaXMubWFya2VyQ2x1c3RlcmVyR3JvdXAucmVtb3ZlTGF5ZXIobWFya2VyKTtcblx0fVxuXG5cdC8vIGZpdCBtYXAgdmlldyB0byBib3VuZHNcblx0Zml0Qm91bmRzKGJvdW5kcyA6IEwuTGF0TG5nQm91bmRzLCBhbmltYXRlIDogYm9vbGVhbiA9IHRydWUpXG5cdHtcblx0XHRjb25zb2xlLmxvZyhcImZpdGJvdW5kc1wiLCBib3VuZHMpO1xuXHRcdFxuXHRcdGlmICh0aGlzLmlzTWFwTG9hZGVkICYmIGFuaW1hdGUpIEFwcC5tYXAoKS5mbHlUb0JvdW5kcyhib3VuZHMpO1xuXHRcdGVsc2UgQXBwLm1hcCgpLmZpdEJvdW5kcyhib3VuZHMpO1xuXHR9XHRcdFxuXG5cdHBhblRvTG9jYXRpb24obG9jYXRpb24gOiBMLkxhdExuZywgem9vbT8sIGFuaW1hdGUgOiBib29sZWFuID0gdHJ1ZSlcblx0e1xuXHRcdHpvb20gPSB6b29tIHx8IHRoaXMuZ2V0Wm9vbSgpIHx8IDEyO1xuXHRcdGNvbnNvbGUubG9nKFwicGFuVG9sb2NhdGlvblwiLCBsb2NhdGlvbik7XG5cblx0XHRpZiAodGhpcy5pc01hcExvYWRlZCAmJiBhbmltYXRlKSB0aGlzLm1hcF8uZmx5VG8obG9jYXRpb24sIHpvb20pO1xuXHRcdGVsc2UgdGhpcy5tYXBfLnNldFZpZXcobG9jYXRpb24sIHpvb20pO1xuXHR9O1xuXG5cdC8vIHRoZSBhY3R1YWwgZGlzcGxheWVkIG1hcCByYWRpdXMgKGRpc3RhbmNlIGZyb20gY3JvbmVyIHRvIGNlbnRlcilcblx0bWFwUmFkaXVzSW5LbSgpIDogbnVtYmVyXG5cdHtcblx0XHRpZiAoIXRoaXMuaXNNYXBMb2FkZWQpIHJldHVybiAwO1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMubWFwXy5nZXRCb3VuZHMoKS5nZXROb3J0aEVhc3QoKS5kaXN0YW5jZVRvKHRoaXMubWFwXy5nZXRDZW50ZXIoKSkgLyAxMDAwKTtcblx0fVxuXG5cdC8vIGRpc3RhbmNlIGZyb20gbGFzdCBzYXZlZCBsb2NhdGlvbiB0byBhIHBvc2l0aW9uXG5cdGRpc3RhbmNlRnJvbUxvY2F0aW9uVG8ocG9zaXRpb24gOiBMLkxhdExuZylcblx0e1xuXHRcdGlmICghQXBwLmdlb2NvZGVyLmdldExvY2F0aW9uKCkpIHJldHVybiBudWxsO1xuXHRcdHJldHVybiBBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb24oKS5kaXN0YW5jZVRvKHBvc2l0aW9uKSAvIDEwMDA7XG5cdH1cblxuXHRjb250YWlucyhwb3NpdGlvbiA6IEwuTGF0TG5nRXhwcmVzc2lvbikgOiBib29sZWFuXG5cdHtcblx0XHRpZiAodGhpcy5pc01hcExvYWRlZCAmJiBwb3NpdGlvbilcblx0XHR7XG5cdFx0XHQgcmV0dXJuIHRoaXMubWFwXy5nZXRCb3VuZHMoKS5jb250YWlucyhwb3NpdGlvbik7XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwiTWFwQ29tcG9uZW50LT5jb250YWlucyA6IG1hcCBub3QgbG9hZGVkIG9yIGVsZW1lbnQgcG9zaXRpb24gdW5kZWZpbmVkXCIpO1xuXHRcdHJldHVybiBmYWxzZTtcdFx0XG5cdH1cblxuXHR1cGRhdGVWaWV3UG9ydCgpXG5cdHtcblx0XHRpZiAoIXRoaXMudmlld3BvcnQpIHRoaXMudmlld3BvcnQgPSBuZXcgVmlld1BvcnQoKTtcblx0XHR0aGlzLnZpZXdwb3J0LmxhdCA9ICB0aGlzLm1hcF8uZ2V0Q2VudGVyKCkubGF0O1xuXHRcdHRoaXMudmlld3BvcnQubG5nID0gIHRoaXMubWFwXy5nZXRDZW50ZXIoKS5sbmc7XG5cdFx0dGhpcy52aWV3cG9ydC56b29tID0gdGhpcy5nZXRab29tKCk7XG5cdH1cblxuXHRzZXRWaWV3UG9ydCgkdmlld3BvcnQgOiBWaWV3UG9ydCwgJHBhbk1hcFRvVmlld3BvcnQgOiBib29sZWFuID0gdHJ1ZSlcblx0e1x0XHRcblx0XHRpZiAodGhpcy5tYXBfICYmICR2aWV3cG9ydCAmJiAkcGFuTWFwVG9WaWV3cG9ydClcblx0XHR7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwic2V0Vmlld1BvcnRcIiwgJHZpZXdwb3J0KTtcblx0XHRcdGxldCB0aW1lb3V0ID0gQXBwLnN0YXRlID09IEFwcFN0YXRlcy5TaG93RWxlbWVudEFsb25lID8gNTAwIDogMDtcblx0XHRcdHNldFRpbWVvdXQoICgpID0+IHsgdGhpcy5tYXBfLnNldFZpZXcoTC5sYXRMbmcoJHZpZXdwb3J0LmxhdCwgJHZpZXdwb3J0LmxuZyksICR2aWV3cG9ydC56b29tKSB9LCB0aW1lb3V0KTtcblx0XHR9XG5cdFx0dGhpcy52aWV3cG9ydCA9ICR2aWV3cG9ydDtcblx0fVxuXG5cdGhpZGVQYXJ0aWFsbHlDbHVzdGVycygpXG5cdHtcblx0XHQkKCcubWFya2VyLWNsdXN0ZXInKS5hZGRDbGFzcygnaGFsZkhpZGRlbicpO1xuXHR9XG5cblx0c2hvd05vcm1hbEhpZGRlbkNsdXN0ZXJzKClcblx0e1xuXHRcdCQoJy5tYXJrZXItY2x1c3RlcicpLnJlbW92ZUNsYXNzKCdoYWxmSGlkZGVuJyk7XG5cdH1cbn1cbiIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEV2ZW50LCBJRXZlbnQgfSBmcm9tIFwiLi4vdXRpbHMvZXZlbnRcIjtcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5kZWNsYXJlIGxldCBSb3V0aW5nO1xuXG5leHBvcnQgY2xhc3MgUmVxdWVzdFxue1xuXHRvcmlnaW5MYXQgOiBudW1iZXI7XG5cdG9yaWdpbkxuZyA6IG51bWJlcjsgXG5cdGRpc3RhbmNlICA6IG51bWJlcjsgXG5cdGVsZW1lbnRJZHMgOiBudW1iZXJbXTtcblx0bWF4UmVzdWx0cyA6IG51bWJlcjsgIFxuXG5cdGNvbnN0cnVjdG9yKGxhdCA6IG51bWJlciwgbG5nIDogbnVtYmVyLCBkaXN0YW5jZSA6bnVtYmVyLCBtYXhSZXN1bHRzIDogbnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5vcmlnaW5MYXQgPSBsYXQ7XG5cdFx0dGhpcy5vcmlnaW5MbmcgPSBsbmc7XG5cdFx0dGhpcy5kaXN0YW5jZSA9IGRpc3RhbmNlO1xuXHRcdHRoaXMubWF4UmVzdWx0cyA9IG1heFJlc3VsdHM7XG5cdH07XG59XG5cbmV4cG9ydCBjbGFzcyBBamF4TW9kdWxlXG57XG5cdG9uTmV3RWxlbWVudHMgPSBuZXcgRXZlbnQ8YW55W10+KCk7XG5cblx0aXNSZXRyaWV2aW5nRWxlbWVudHMgOiBib29sZWFuID0gZmFsc2U7XG5cblx0cmVxdWVzdFdhaXRpbmdUb0JlRXhlY3V0ZWQgOiBib29sZWFuID0gZmFsc2U7XG5cdHdhaXRpbmdSZXF1ZXN0IDogUmVxdWVzdCA9IG51bGw7XG5cblx0Y3VyclJlcXVlc3QgOiBSZXF1ZXN0ID0gbnVsbDtcblxuXHRsb2FkZXJUaW1lciA9IG51bGw7XG5cblx0Y29uc3RydWN0b3IoKSB7IH0gIFxuXG5cdGdldEVsZW1lbnRzQXJvdW5kTG9jYXRpb24oJGxvY2F0aW9uLCAkZGlzdGFuY2UsICRtYXhSZXN1bHRzID0gMClcblx0e1xuXHRcdC8vIGlmIGludmFsaWQgbG9jYXRpb24gd2UgYWJvcnRcblx0XHRpZiAoISRsb2NhdGlvbiB8fCAhJGxvY2F0aW9uLmxhdCkgXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJBamF4IGludmFsaWQgcmVxdWVzdCByZXR1cm5cIiwgJGxvY2F0aW9uKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gdGhlcmUgaXMgYSBsaW1pdCBpbiBhamF4IGRhdGEsIHdlIGNhbiBub3Qgc2VuZCBtb3JlIHRoYW50IGEgdGhvdXNhbmQgaWRzXG5cdFx0Ly8gc28gZm9yIHRoZSBtb21lbnQgaXMgcXVpdGUgdXNlbGVzcyB0byBzZW5kIHRoZXNlcyBpZC4gU2VlIGlmIHdlIG1hbmFnZSB0b1xuXHRcdC8vIGNoYW5nZSBzZXJ2ZXIgY29uZmlnIHRvIHNlbmQgbW9yZSB0aGFudCAxMDAwIGlkcztcblx0XHQvL2xldCAkYWxsSWRzID0gQXBwLmVsZW1lbnRNb2R1bGUuZ2V0QWxsRWxlbWVudHNJZHMoKTtcblxuXHRcdHRoaXMuZ2V0RWxlbWVudHMobmV3IFJlcXVlc3QoJGxvY2F0aW9uLmxhdCwgJGxvY2F0aW9uLmxuZywgJGRpc3RhbmNlLCAkbWF4UmVzdWx0cykpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRFbGVtZW50cygkcmVxdWVzdCA6IFJlcXVlc3QpXG5cdHtcblx0XHRpZiAodGhpcy5pc1JldHJpZXZpbmdFbGVtZW50cylcblx0XHR7XHRcdFxuXHRcdFx0dGhpcy5yZXF1ZXN0V2FpdGluZ1RvQmVFeGVjdXRlZCA9IHRydWU7XG5cdFx0XHR0aGlzLndhaXRpbmdSZXF1ZXN0ID0gJHJlcXVlc3Q7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5jdXJyUmVxdWVzdCA9ICRyZXF1ZXN0O1xuXG5cdFx0bGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0bGV0IHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2FwaV9lbGVtZW50c19hcm91bmRfbG9jYXRpb24nKTtcblxuXHRcdC8vY29uc29sZS5sb2coXCJBamF4IGdldCBlbGVtZW50cyByZXF1ZXN0ICBlbGVtZW50c0lkID0gXCIsICRyZXF1ZXN0LmVsZW1lbnRJZHMubGVuZ3RoKTtcblx0XHRcblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsOiByb3V0ZSxcblx0XHRcdG1ldGhvZDogXCJwb3N0XCIsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG9yaWdpbkxhdCA6ICRyZXF1ZXN0Lm9yaWdpbkxhdCxcblx0XHRcdFx0b3JpZ2luTG5nIDogJHJlcXVlc3Qub3JpZ2luTG5nLFxuXHRcdFx0XHRkaXN0YW5jZSAgOiAkcmVxdWVzdC5kaXN0YW5jZSxcblx0XHRcdFx0bWF4UmVzdWx0cyA6ICRyZXF1ZXN0Lm1heFJlc3VsdHMsXG5cdFx0XHR9LFxuXHRcdFx0YmVmb3JlU2VuZDogKCkgPT5cblx0XHRcdHsgXG5cdFx0XHRcdHRoaXMuaXNSZXRyaWV2aW5nRWxlbWVudHMgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLmxvYWRlclRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHsgJCgnI2RpcmVjdG9yeS1sb2FkaW5nJykuc2hvdygpOyB9LCAyMDAwKTsgXG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogcmVzcG9uc2UgPT5cblx0XHRcdHtcdCAgICAgICAgXG5cdFx0XHQgIC8vY29uc29sZS5sb2coXCJBamF4IHJlc3BvbnNlXCIsIHJlc3BvbnNlLmRhdGFbMF0pO1xuXG5cdFx0XHQgIGlmIChyZXNwb25zZS5kYXRhICE9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJyZWNlaXZlIFwiICsgcmVzcG9uc2UuZGF0YS5sZW5ndGggKyBcIiBlbGVtZW50cyBpbiBcIiArIChlbmQtc3RhcnQpICsgXCIgbXNcIik7XHRcdFx0XHRcblxuXHRcdFx0XHRcdHRoaXMub25OZXdFbGVtZW50cy5lbWl0KHJlc3BvbnNlLmRhdGEpO1x0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdCAgXG5cdFx0XHRcdGlmIChyZXNwb25zZS5leGNlZWRNYXhSZXN1bHQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiICAgbW9yZUVsZW1lbnRzVG9SZWNlaXZlXCIpO1xuXHRcdFx0XHRcdGlmICghdGhpcy5yZXF1ZXN0V2FpdGluZ1RvQmVFeGVjdXRlZCkgXG5cdFx0XHRcdFx0eyAgICAgICAgXHRcdFx0XG5cdFx0XHRcdFx0XHR0aGlzLmdldEVsZW1lbnRzKHRoaXMuY3VyclJlcXVlc3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVx0ICAgICAgICBcblx0XHRcdH0sXG5cdFx0XHRjb21wbGV0ZTogKCkgPT5cblx0XHRcdHtcblx0XHRcdCAgdGhpcy5pc1JldHJpZXZpbmdFbGVtZW50cyA9IGZhbHNlO1xuXHRcdFx0ICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcik7XG5cdFx0XHQgIGlmICh0aGlzLnJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkKVxuXHRcdFx0ICB7XG5cdFx0XHQgIFx0IC8vY29uc29sZS5sb2coXCIgICAgcmVxdWVzdFdhaXRpbmdUb0JlRXhlY3V0ZWQgc3RvcmVkXCIsIHRoaXMud2FpdGluZ1JlcXVlc3QpO1xuXHRcdFx0ICBcdCB0aGlzLmdldEVsZW1lbnRzKHRoaXMud2FpdGluZ1JlcXVlc3QpO1xuXHRcdFx0ICBcdCB0aGlzLnJlcXVlc3RXYWl0aW5nVG9CZUV4ZWN1dGVkID0gZmFsc2U7XG5cdFx0XHQgIH1cblx0XHRcdCAgZWxzZVxuXHRcdFx0ICB7XG5cdFx0XHQgIFx0IC8vY29uc29sZS5sb2coXCJBamF4IHJlcXVlc3QgY29tcGxldGVcIik7XHRcdFx0ICBcdCBcblx0XHRcdFx0ICQoJyNkaXJlY3RvcnktbG9hZGluZycpLmhpZGUoKTtcblx0XHRcdCAgfVxuXHRcdFx0fSxcblx0XHR9KTtcblx0fTtcblxuXHRnZXRFbGVtZW50QnlJZChlbGVtZW50SWQsIGNhbGxiYWNrU3VjY2Vzcz8sIGNhbGxiYWNrRmFpbHVyZT8pXG5cdHtcblx0XHRsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRsZXQgcm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fYXBpX2VsZW1lbnRfYnlfaWQnKTtcblxuXHRcdCQuYWpheCh7XG5cdFx0XHR1cmw6IHJvdXRlLFxuXHRcdFx0bWV0aG9kOiBcInBvc3RcIixcblx0XHRcdGRhdGE6IHsgZWxlbWVudElkOiBlbGVtZW50SWQgfSxcblx0XHRcdHN1Y2Nlc3M6IHJlc3BvbnNlID0+IFxuXHRcdFx0e1x0ICAgICAgICBcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0Ly93aW5kb3cuY29uc29sZS5sb2coXCJyZWNlaXZlIGVsZW1lbnRCeUlkIGluIFwiICsgKGVuZC1zdGFydCkgKyBcIiBtc1wiLCByZXNwb25zZS5kYXRhKTtcdFx0XHRcblxuXHRcdFx0XHRcdGlmIChjYWxsYmFja1N1Y2Nlc3MpIGNhbGxiYWNrU3VjY2VzcyhyZXNwb25zZS5kYXRhKTsgXG5cdFx0XHRcdFx0Ly90aGlzLm9uTmV3RWxlbWVudC5lbWl0KHJlc3BvbnNlLmRhdGEpO1x0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlIGlmIChjYWxsYmFja0ZhaWx1cmUpIGNhbGxiYWNrRmFpbHVyZShyZXNwb25zZS5kYXRhKTsgXHRcdFx0XHQgICAgICAgXG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IHJlc3BvbnNlID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmIChjYWxsYmFja0ZhaWx1cmUpIGNhbGxiYWNrRmFpbHVyZShyZXNwb25zZSk7IFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LmNsYXNzXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi4vY2xhc3Nlcy9vcHRpb24uY2xhc3NcIjtcblxuZXhwb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vY2xhc3Nlcy9jYXRlZ29yeS5jbGFzc1wiO1xuZXhwb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4uL2NsYXNzZXMvb3B0aW9uLmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgbGV0ICQgOiBhbnk7XG5cblxuZXhwb3J0IGNsYXNzIENhdGVnb3JpZXNNb2R1bGVcbntcblx0Y2F0ZWdvcmllcyA6IENhdGVnb3J5W10gPSBbXTtcblx0b3B0aW9ucyA6IE9wdGlvbltdID0gW107XG5cblx0bWFpbkNhdGVnb3J5IDogQ2F0ZWdvcnk7XG5cdG9wZW5Ib3Vyc0NhdGVnb3J5IDogQ2F0ZWdvcnk7XG5cblx0b3BlbkhvdXJzRmlsdGVyc0RheXMgOiBzdHJpbmdbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKCkgXG5cdHtcblx0XHR0aGlzLm9wdGlvbnMgPSBbXTtcblx0XHR0aGlzLmNhdGVnb3JpZXMgPSBbXTtcblx0fVxuXG5cdGNyZWF0ZUNhdGVnb3JpZXNGcm9tSnNvbihtYWluQ2F0Z2VvcnlKc29uLCBvcGVuSG91cnNDYXRlZ29yeUpzb24pXG5cdHtcblx0XHR0aGlzLm1haW5DYXRlZ29yeSA9IHRoaXMucmVjdXJzaXZlbHlDcmVhdGVDYXRlZ29yeUFuZE9wdGlvbnMobWFpbkNhdGdlb3J5SnNvbik7XG5cdFx0dGhpcy5vcGVuSG91cnNDYXRlZ29yeSA9IHRoaXMucmVjdXJzaXZlbHlDcmVhdGVDYXRlZ29yeUFuZE9wdGlvbnMob3BlbkhvdXJzQ2F0ZWdvcnlKc29uKTtcblxuXHRcdHRoaXMudXBkYXRlT3BlbkhvdXJzRmlsdGVyKCk7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLm1haW5DYXRlZ29yeSk7XG5cdH1cblxuXHRwcml2YXRlIHJlY3Vyc2l2ZWx5Q3JlYXRlQ2F0ZWdvcnlBbmRPcHRpb25zKGNhdGVnb3J5SnNvbiA6IGFueSkgOiBDYXRlZ29yeVxuXHR7XG5cdFx0bGV0IGNhdGVnb3J5ID0gbmV3IENhdGVnb3J5KGNhdGVnb3J5SnNvbik7XG5cblx0XHRmb3IobGV0IG9wdGlvbkpzb24gb2YgY2F0ZWdvcnlKc29uLm9wdGlvbnMpXG5cdFx0e1xuXHRcdFx0bGV0IG9wdGlvbiA9IG5ldyBPcHRpb24ob3B0aW9uSnNvbik7XG5cdFx0XHRvcHRpb24ub3duZXJJZCA9IGNhdGVnb3J5SnNvbi5pZDtcblx0XHRcdG9wdGlvbi5kZXB0aCA9IGNhdGVnb3J5LmRlcHRoO1xuXG5cdFx0XHRpZiAoY2F0ZWdvcnkuZGVwdGggPT0gMCkgb3B0aW9uLm1haW5Pd25lcklkID0gXCJhbGxcIjtcblx0XHRcdGVsc2UgaWYgKGNhdGVnb3J5LmRlcHRoID09IC0xKSBvcHRpb24ubWFpbk93bmVySWQgPSBcIm9wZW5ob3Vyc1wiO1xuXHRcdFx0ZWxzZSBvcHRpb24ubWFpbk93bmVySWQgPSBjYXRlZ29yeS5tYWluT3duZXJJZDtcblxuXHRcdFx0Zm9yKGxldCBzdWJjYXRlZ29yeUpzb24gb2Ygb3B0aW9uSnNvbi5zdWJjYXRlZ29yaWVzKVxuXHRcdFx0e1x0XHRcdFx0XG5cdFx0XHRcdGlmIChjYXRlZ29yeS5kZXB0aCA8PSAwKSBzdWJjYXRlZ29yeUpzb24ubWFpbk93bmVySWQgPSBvcHRpb24uaWQ7XG5cdFx0XHRcdGVsc2Ugc3ViY2F0ZWdvcnlKc29uLm1haW5Pd25lcklkID0gb3B0aW9uLm1haW5Pd25lcklkO1xuXG5cdFx0XHRcdGxldCBzdWJjYXRlZ29yeSA9IHRoaXMucmVjdXJzaXZlbHlDcmVhdGVDYXRlZ29yeUFuZE9wdGlvbnMoc3ViY2F0ZWdvcnlKc29uKTtcblx0XHRcdFx0c3ViY2F0ZWdvcnkub3duZXJJZCA9IG9wdGlvbi5pZDtcdFx0XHRcdFxuXG5cdFx0XHRcdG9wdGlvbi5hZGRDYXRlZ29yeShzdWJjYXRlZ29yeSk7XG5cdFx0XHR9XG5cblx0XHRcdGNhdGVnb3J5LmFkZE9wdGlvbihvcHRpb24pO1x0XG5cdFx0XHR0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1x0XG5cdFx0fVxuXG5cdFx0dGhpcy5jYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xuXG5cdFx0cmV0dXJuIGNhdGVnb3J5O1xuXHR9XG5cblx0dXBkYXRlT3BlbkhvdXJzRmlsdGVyKClcblx0e1xuXHRcdHRoaXMub3BlbkhvdXJzRmlsdGVyc0RheXMgPSBbXTtcblx0XHRsZXQgb3B0aW9uIDogYW55O1xuXHRcdGZvcihvcHRpb24gb2YgdGhpcy5vcGVuSG91cnNDYXRlZ29yeS5jaGlsZHJlbilcblx0XHR7XG5cdFx0XHRpZiAob3B0aW9uLmlzQ2hlY2tlZCkgdGhpcy5vcGVuSG91cnNGaWx0ZXJzRGF5cy5wdXNoKCBvcHRpb24ubmFtZS50b0xvd2VyQ2FzZSgpKTtcblx0XHR9XG5cdFx0Ly9jb25zb2xlLmxvZyhcInVwZGF0ZU9wZW5Ib3Vyc2ZpbHRlcnNcIiwgdGhpcy5vcGVuSG91cnNGaWx0ZXJzRGF5cyk7XG5cdH1cblxuXHRnZXRNYWluT3B0aW9ucygpIDogT3B0aW9uW11cblx0e1xuXHRcdHJldHVybiB0aGlzLm1haW5DYXRlZ29yeS5vcHRpb25zO1xuXHR9XG5cblx0Z2V0Q3Vyck1haW5PcHRpb24oKSA6IE9wdGlvblxuXHR7XG5cdFx0cmV0dXJuIEFwcC5jdXJyTWFpbklkID09ICdhbGwnID8gbnVsbCA6IHRoaXMuZ2V0TWFpbk9wdGlvbkJ5SWQoQXBwLmN1cnJNYWluSWQpO1xuXHR9XG5cblx0Z2V0TWFpbk9wdGlvbkJ5U2x1Zygkc2x1ZykgOiBPcHRpb25cblx0e1xuXHRcdHJldHVybiB0aGlzLmdldE1haW5PcHRpb25zKCkuZmlsdGVyKCAob3B0aW9uIDogT3B0aW9uKSA9PiBvcHRpb24ubmFtZVNob3J0ID09ICRzbHVnKS5zaGlmdCgpO1xuXHR9XG5cblx0Z2V0TWFpbk9wdGlvbkJ5SWQgKCRpZCkgOiBPcHRpb25cblx0e1xuXHRcdHJldHVybiB0aGlzLm1haW5DYXRlZ29yeS5vcHRpb25zLmZpbHRlciggKG9wdGlvbiA6IE9wdGlvbikgPT4gb3B0aW9uLmlkID09ICRpZCkuc2hpZnQoKTtcblx0fTtcblxuXHRnZXRDYXRlZ29yeUJ5SWQgKCRpZCkgOiBDYXRlZ29yeVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuY2F0ZWdvcmllcy5maWx0ZXIoIChjYXRlZ29yeSA6IENhdGVnb3J5KSA9PiBjYXRlZ29yeS5pZCA9PSAkaWQpLnNoaWZ0KCk7XG5cdH07XG5cblx0Z2V0T3B0aW9uQnlJZCAoJGlkKSA6IE9wdGlvblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIoIChvcHRpb24gOiBPcHRpb24pID0+IG9wdGlvbi5pZCA9PSAkaWQpLnNoaWZ0KCk7XG5cdH07XG59IiwiZGVjbGFyZSBsZXQgZ29vZ2xlO1xuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMgfSBmcm9tIFwiLi4vYXBwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgbGV0ICQsIEw6IGFueTtcblxuZGVjbGFyZSBsZXQgd2luZG93IDogYW55O1xuXG5leHBvcnQgY2xhc3MgRGlyZWN0aW9uc01vZHVsZVxue1xuXHRtYXJrZXJEaXJlY3Rpb25SZXN1bHQgPSBudWxsO1xuXG5cdHJvdXRpbmdDb250cm9sIDogYW55O1xuXHRcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgXHR3aW5kb3cubHJtQ29uZmlnID0ge1xuXHRcdFx0Ly8gVE9ETyBjaGFuZ2UgdGhpcyBkZW1vIHNlcnZpY2VVcmxcblx0XHRcdC8vIFx0XHRzZXJ2aWNlVXJsOiAnLy9yb3V0ZXIucHJvamVjdC1vc3JtLm9yZy92aWFyb3V0ZScsXG5cdFx0XHQvLyAgICBwcm9maWxlOiAnbWFwYm94L2RyaXZpbmcnLFxuXHRcdH07XG5cbiAgfVxuXG5cdGNsZWFyKClcblx0e1xuXHRcdGlmICghdGhpcy5yb3V0aW5nQ29udHJvbCkgcmV0dXJuO1xuXG5cdFx0dGhpcy5jbGVhclJvdXRlKCk7XG5cdFx0Ly90aGlzLmNsZWFyRGlyZWN0aW9uTWFya2VyKCk7XG5cdFx0dGhpcy5oaWRlSXRpbmVyYXJ5UGFuZWwoKTtcblxuXHRcdEFwcC5ERUFNb2R1bGUuZW5kKCk7XG5cblx0XHR0aGlzLnJvdXRpbmdDb250cm9sID0gbnVsbDtcblx0fTtcblxuXHRjbGVhclJvdXRlKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKFwiY2xlYXJpbmcgcm91dGVcIik7XG5cdFx0aWYgKHRoaXMucm91dGluZ0NvbnRyb2wpIFxuXHRcdHtcblx0XHRcdHRoaXMucm91dGluZ0NvbnRyb2wuc3BsaWNlV2F5cG9pbnRzKDAsMik7XHRcdFxuXHRcdFx0QXBwLm1hcCgpLnJlbW92ZUNvbnRyb2wodGhpcy5yb3V0aW5nQ29udHJvbCk7XHRcblx0XHR9XG5cdH07XG5cblx0Y2FsY3VsYXRlUm91dGUob3JpZ2luIDogTC5MYXRMbmcsIGVsZW1lbnQgOiBFbGVtZW50KSBcblx0e1xuXHRcdHRoaXMuY2xlYXIoKTtcblxuXHRcdGxldCB3YXlwb2ludHMgPSBbXG5cdFx0ICAgIG9yaWdpbixcblx0XHQgICAgZWxlbWVudC5wb3NpdGlvbixcblx0XHRdO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyhcImNhbGN1bGF0ZSByb3V0ZVwiLCB3YXlwb2ludHMpO1xuXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbCA9IEwuUm91dGluZy5jb250cm9sKHtcblx0XHRcdHBsYW46IEwuUm91dGluZy5wbGFuKFxuXHRcdFx0XHR3YXlwb2ludHMsIFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gZGVsZXRlaW5nIHN0YXJ0IGFuZCBlbmQgbWFya2Vyc1xuXHRcdFx0XHRcdGNyZWF0ZU1hcmtlcjogZnVuY3Rpb24oaSwgd3ApIHsgcmV0dXJuIG51bGw7IH0sXG5cdFx0XHRcdFx0cm91dGVXaGlsZURyYWdnaW5nOiBmYWxzZSxcblx0XHRcdFx0XHRzaG93QWx0ZXJuYXRpdmVzOiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHQpLFxuXHRcdFx0bGFuZ3VhZ2U6ICdmcicsXG5cdFx0XHRyb3V0ZVdoaWxlRHJhZ2dpbmc6IGZhbHNlLFxuXHRcdFx0c2hvd0FsdGVybmF0aXZlczogZmFsc2UsXG5cdFx0XHRhbHRMaW5lT3B0aW9uczoge1xuXHRcdFx0XHRzdHlsZXM6IFtcblx0XHRcdFx0XHR7Y29sb3I6ICdibGFjaycsIG9wYWNpdHk6IDAuMTUsIHdlaWdodDogOX0sXG5cdFx0XHRcdFx0e2NvbG9yOiAnd2hpdGUnLCBvcGFjaXR5OiAwLjgsIHdlaWdodDogNn0sXG5cdFx0XHRcdFx0e2NvbG9yOiAnIzAwYjNmZCcsIG9wYWNpdHk6IDAuNSwgd2VpZ2h0OiAyfVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSkuYWRkVG8oQXBwLm1hcCgpKTtcblxuXHRcdC8vIHNob3cgSXRpbmVyYXJ5IHBhbmVsIHdpdGhvdXQgaXRpbmVyYXJ5LCBqdXN0IHRvIHNob3cgdXNlclxuXHRcdC8vIHNvbWV0aGluZ2lzIGhhcHBlbm5pbmcgYW4gZGlzcGxheSBzcGlubmVyIGxvYWRlclxuXHRcdHRoaXMuc2hvd0l0aW5lcmFyeVBhbmVsKGVsZW1lbnQpO1xuXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbC5vbigncm91dGVzZm91bmQnLCAoZXYpID0+IFxuXHRcdHtcblx0XHRcdHRoaXMuc2hvd0l0aW5lcmFyeVBhbmVsKGVsZW1lbnQpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gZml0IGJvdW5kcyBcblx0XHR0aGlzLnJvdXRpbmdDb250cm9sLm9uKCdyb3V0ZXNlbGVjdGVkJywgZnVuY3Rpb24oZSkgXG5cdFx0e1x0ICAgIFxuXHQgICAgdmFyIHIgPSBlLnJvdXRlO1xuXHQgICAgdmFyIGxpbmUgPSBMLlJvdXRpbmcubGluZShyKTtcblx0ICAgIHZhciBib3VuZHMgPSBsaW5lLmdldEJvdW5kcygpO1xuXHQgICAgQXBwLm1hcCgpLmZpdEJvdW5kcyhib3VuZHMpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5yb3V0aW5nQ29udHJvbC5vbigncm91dGluZ2Vycm9yJywgKGV2KSA9PiBcblx0XHR7XG5cdFx0XHQkKCcjbW9kYWwtZGlyZWN0aW9ucy1mYWlsJykub3Blbk1vZGFsKCk7XG5cdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0fSk7XG5cdFx0XHRcblx0fTtcblxuXHRoaWRlSXRpbmVyYXJ5UGFuZWwoKVxuXHR7XG5cdFx0Ly90aGlzLnJvdXRpbmdDb250cm9sLmhpZGUoKTtcblx0XHQvL0FwcC5tYXAoKS5yZW1vdmVDb250cm9sKHRoaXMucm91dGluZ0NvbnRyb2wpO1xuXG5cdFx0Ly8kKCcubGVhZmxldC1yb3V0aW5nLWNvbnRhaW5lcicpLmhpZGUoKTtcblx0XHQvLyQoJy5sZWFmbGV0LXJvdXRpbmctY29udGFpbmVyJykucHJlcGVuZFRvKCcuZGlyZWN0b3J5LW1lbnUtY29udGVudCcpO1xuXHRcdCQoJyNkaXJlY3RvcnktbWVudS1tYWluLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCk7XG5cdFx0JCgnLmRpcmVjdG9yeS1tZW51LWhlYWRlcicpO1xuXHRcdCQoJyNzZWFyY2gtYmFyJykucmVtb3ZlQ2xhc3MoKTtcdFx0XG5cdH1cblxuXHRzaG93SXRpbmVyYXJ5UGFuZWwoZWxlbWVudCA6IEVsZW1lbnQpXG5cdHtcblx0XHQvL3RoaXMucm91dGluZ0NvbnRyb2wuc2hvdygpO1xuXHRcdC8vQXBwLm1hcCgpLmFkZENvbnRyb2wodGhpcy5yb3V0aW5nQ29udHJvbCk7XHRcblxuXHRcdC8vJCgnLmxlYWZsZXQtcm91dGluZy1jb250YWluZXInKS5zaG93KCk7XG5cblx0XHRjb25zb2xlLmxvZyhcInNob3cgaXRpbmVyYXJ5XCIpO1xuXG5cdFx0JCgnI2RpcmVjdG9yeS1tZW51LW1haW4tY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyhcImRpcmVjdGlvbnNcIik7XHRcblx0XHQkKCcuZGlyZWN0b3J5LW1lbnUtaGVhZGVyJykuYXR0cignb3B0aW9uLWlkJyxlbGVtZW50LmNvbG9yT3B0aW9uSWQpO1xuXHRcdC8vJCgnI3NlYXJjaC1iYXInKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKGVsZW1lbnQuY29sb3JPcHRpb25JZCk7XHRcblxuXHRcdCQoJy5sZWFmbGV0LXJvdXRpbmctY29udGFpbmVyJykucHJlcGVuZFRvKCcuZGlyZWN0b3J5LW1lbnUtY29udGVudCcpO1xuXHRcdFx0XG5cblx0XHRcblx0fVxuXG5cdGNsZWFyRGlyZWN0aW9uTWFya2VyKClcblx0e1xuXHRcdGlmICh0aGlzLm1hcmtlckRpcmVjdGlvblJlc3VsdCAhPT0gbnVsbClcblx0XHR7XG5cdFx0XHR0aGlzLm1hcmtlckRpcmVjdGlvblJlc3VsdC5zZXRWaXNpYmxlKGZhbHNlKTtcblx0XHRcdHRoaXMubWFya2VyRGlyZWN0aW9uUmVzdWx0LnNldE1hcChudWxsKTtcblx0XHRcdHRoaXMubWFya2VyRGlyZWN0aW9uUmVzdWx0ID0gbnVsbDtcblx0XHR9XG5cdH07XG59IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgQXBwTW9kdWxlIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tIFwiLi4vY2xhc3Nlcy9lbGVtZW50LmNsYXNzXCI7XG5cbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcblxuZXhwb3J0IGNsYXNzIERpc3BsYXlFbGVtZW50QWxvbmVNb2R1bGVcbntcblx0ZWxlbWVudFNob3duQWxvbmVfID0gbnVsbDtcblxuXHRjb25zdHJ1Y3RvcigpIHt9XG5cblx0Z2V0RWxlbWVudCgpIDogRWxlbWVudCB7IHJldHVybiB0aGlzLmVsZW1lbnRTaG93bkFsb25lXzsgfVxuXG5cdGJlZ2luKGVsZW1lbnRJZCA6IHN0cmluZywgcGFuVG9FbGVtZW50TG9jYXRpb24gOiBib29sZWFuID0gdHJ1ZSkgXG5cdHtcdFxuXHRcdGNvbnNvbGUubG9nKFwiRGlzcGxheUVsZW1lbnRBbG9uZU1vZHVsZSBiZWdpblwiLCBwYW5Ub0VsZW1lbnRMb2NhdGlvbik7XG5cblx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50QnlJZChlbGVtZW50SWQpO1xuXHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfID0gZWxlbWVudDtcdFx0XHRcblxuXHRcdGlmICh0aGlzLmVsZW1lbnRTaG93bkFsb25lXyAhPT0gbnVsbCkgXG5cdFx0e1xuXHRcdFx0dGhpcy5lbGVtZW50U2hvd25BbG9uZV8uaGlkZSgpO1xuXHRcdFx0dGhpcy5lbGVtZW50U2hvd25BbG9uZV8uaXNTaG93bkFsb25lID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgKEFwcC5zdGF0ZSA9PSBBcHBTdGF0ZXMuQ29uc3RlbGxhdGlvbikgQXBwLmVsZW1lbnRNb2R1bGUuZm9jdXNPblRoZXNlc0VsZW1lbnRzKFtlbGVtZW50LmlkXSk7XG5cdFx0Ly8gZWxzZSBcblx0XHQvLyB7XG5cdFx0Ly9BcHAuZWxlbWVudE1vZHVsZS5jbGVhck1hcmtlcnMoKTtcblx0XHRBcHAuZWxlbWVudE1vZHVsZS5jbGVhckN1cnJlbnRzRWxlbWVudCgpO1xuXHRcdC8vfVx0XHRcdFxuXHRcdEFwcC5lbGVtZW50TW9kdWxlLnNob3dFbGVtZW50KGVsZW1lbnQpO1xuXHRcdGVsZW1lbnQuaXNTaG93bkFsb25lID0gdHJ1ZTtcblxuXHRcdEFwcC5pbmZvQmFyQ29tcG9uZW50LnNob3dFbGVtZW50KGVsZW1lbnQuaWQpO1xuXG5cdFx0aWYgKHBhblRvRWxlbWVudExvY2F0aW9uKVxuXHRcdHtcblx0XHRcdC8vIHdlIHNldCBhIHRpbWVvdXQgdG8gbGV0IHRoZSBpbmZvYmFyIHNob3cgdXBcblx0XHRcdC8vIGlmIHdlIG5vdCBkbyBzbywgdGhlIG1hcCB3aWxsIG5vdCBiZSBjZW50ZXJlZCBpbiB0aGUgZWxlbWVudC5wb3NpdGlvblxuXHRcdFx0c2V0VGltZW91dCggKCkgPT4ge0FwcC5tYXBDb21wb25lbnQucGFuVG9Mb2NhdGlvbihlbGVtZW50LnBvc2l0aW9uLCAxMiwgZmFsc2UpO30sIDUwMCk7XG5cdFx0fVxuXHR9O1xuXG5cdGVuZCAoKSBcblx0e1xuXG5cdFx0aWYgKHRoaXMuZWxlbWVudFNob3duQWxvbmVfID09PSBudWxsKSByZXR1cm47XG5cblx0XHQvLyBpZiAoQXBwLnN0YXRlID09IEFwcFN0YXRlcy5Db25zdGVsbGF0aW9uKSBBcHAuZWxlbWVudE1vZHVsZS5jbGVhckZvY3VzT25UaGVzZXNFbGVtZW50cyhbdGhpcy5lbGVtZW50U2hvd25BbG9uZV8uZ2V0SWQoKV0pO1xuXHRcdC8vIGVsc2UgXG5cdFx0Ly8ge1xuXHRcdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudFRvRGlzcGxheSh0cnVlLHRydWUpO1xuXHRcdC8vfVxuXHRcdFxuXHRcdHRoaXMuZWxlbWVudFNob3duQWxvbmVfLmlzU2hvd25BbG9uZSA9IGZhbHNlO1x0XG5cblx0XHR0aGlzLmVsZW1lbnRTaG93bkFsb25lXyA9IG51bGw7XHRcblx0fTtcbn1cblxuIiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyICQ7XHRcblxuaW1wb3J0ICogYXMgQ29va2llcyBmcm9tIFwiLi4vdXRpbHMvY29va2llc1wiO1xuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gXCIuLi9jbGFzc2VzL2VsZW1lbnQuY2xhc3NcIjtcbmltcG9ydCB7IEJpb3Blbk1hcmtlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL21hcC9iaW9wZW4tbWFya2VyLmNvbXBvbmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRzQ2hhbmdlZFxueyBcblx0ZWxlbWVudHNUb0Rpc3BsYXkgOiBFbGVtZW50W107XG5cdG5ld0VsZW1lbnRzIDogRWxlbWVudFtdO1xuXHRlbGVtZW50c1RvUmVtb3ZlIDogRWxlbWVudFtdO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudHNNb2R1bGVcbntcblx0b25FbGVtZW50c0NoYW5nZWQgPSBuZXcgRXZlbnQ8RWxlbWVudHNDaGFuZ2VkPigpO1xuXG5cdGV2ZXJ5RWxlbWVudHNfIDogRWxlbWVudFtdW10gPSBbXTtcblx0XG5cdC8vIGN1cnJlbnQgdmlzaWJsZSBlbGVtZW50c1xuXHR2aXNpYmxlRWxlbWVudHNfIDogRWxlbWVudFtdW10gPSBbXTtcblxuXHRmYXZvcml0ZUlkc18gOiBudW1iZXJbXSA9IFtdO1xuXHRpc1Nob3dpbmdIYWxmSGlkZGVuIDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdGxldCBjb29raWVzID0gQ29va2llcy5yZWFkQ29va2llKCdGYXZvcml0ZUlkcycpO1xuXHRcdGlmIChjb29raWVzICE9PSBudWxsKVxuXHRcdHtcblx0XHRcdHRoaXMuZmF2b3JpdGVJZHNfID0gSlNPTi5wYXJzZShjb29raWVzKTtcdFx0XG5cdFx0fSAgIFxuXHRcdGVsc2UgdGhpcy5mYXZvcml0ZUlkc18gPSBbXTtcdFx0XG5cdH1cblxuXHRpbml0aWFsaXplKClcblx0e1xuXHRcdHRoaXMuZXZlcnlFbGVtZW50c19bJ2FsbCddID0gW107XG5cdFx0dGhpcy52aXNpYmxlRWxlbWVudHNfWydhbGwnXSA9IFtdO1xuXHRcdGZvcihsZXQgb3B0aW9uIG9mIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9ucygpKVxuXHRcdHtcblx0XHRcdHRoaXMuZXZlcnlFbGVtZW50c19bb3B0aW9uLmlkXSA9IFtdO1xuXHRcdFx0dGhpcy52aXNpYmxlRWxlbWVudHNfW29wdGlvbi5pZF0gPSBbXTtcblx0XHR9XHRcblx0fVxuXG5cdGNoZWNrQ29va2llcygpXG5cdHtcblx0XHRmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5mYXZvcml0ZUlkc18ubGVuZ3RoOyBqKyspXG5cdCAgXHR7XG5cdCAgXHRcdHRoaXMuYWRkRmF2b3JpdGUodGhpcy5mYXZvcml0ZUlkc19bal0sIGZhbHNlKTtcblx0ICBcdH1cblx0fTtcblxuXHRhZGRKc29uRWxlbWVudHMgKGVsZW1lbnRMaXN0LCBjaGVja0lmQWxyZWFkeUV4aXN0ID0gdHJ1ZSlcblx0e1xuXHRcdGxldCBlbGVtZW50IDogRWxlbWVudCwgZWxlbWVudEpzb247XG5cdFx0bGV0IG5ld0VsZW1lbnRzQ291bnQgPSAwO1xuXHRcdC8vY29uc29sZS5sb2coXCJFbGVtZW50TW9kdWxlIGFkZHMgXCIgKyBlbGVtZW50TGlzdC5sZW5ndGgpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudExpc3QubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0ZWxlbWVudEpzb24gPSBlbGVtZW50TGlzdFtpXS5FbGVtZW50ID8gZWxlbWVudExpc3RbaV0uRWxlbWVudCA6IGVsZW1lbnRMaXN0W2ldO1xuXG5cdFx0XHRpZiAoIWNoZWNrSWZBbHJlYWR5RXhpc3QgfHwgIXRoaXMuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudEpzb24uaWQpKVxuXHRcdFx0e1xuXHRcdFx0XHRlbGVtZW50ID0gbmV3IEVsZW1lbnQoZWxlbWVudEpzb24pO1xuXG5cdFx0XHRcdGZvciAobGV0IG1haW5JZCBvZiBlbGVtZW50Lm1haW5PcHRpb25Pd25lcklkcylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuZXZlcnlFbGVtZW50c19bbWFpbklkXS5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHR9XHRcdFx0XHRcblx0XHRcdFx0dGhpcy5ldmVyeUVsZW1lbnRzX1snYWxsJ10ucHVzaChlbGVtZW50KTtcblxuXHRcdFx0XHRuZXdFbGVtZW50c0NvdW50Kys7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJhZGRKc29uRWxlbWVudHMsIGNldCBlbGVtZW50IGV4aXN0ZSBkZWphXCIpO1xuXHRcdFx0fVx0XHRcblx0XHR9XG5cdFx0dGhpcy5jaGVja0Nvb2tpZXMoKTtcblx0XHQvL2NvbnNvbGUubG9nKFwiRWxlbWVudE1vZHVsZSByZWFsbHkgYWRkZWQgXCIgKyBuZXdFbGVtZW50c0NvdW50KTtcblx0XHRyZXR1cm4gbmV3RWxlbWVudHNDb3VudDtcblx0fTtcblxuXHRzaG93RWxlbWVudChlbGVtZW50IDogRWxlbWVudClcblx0e1xuXHRcdGVsZW1lbnQuc2hvdygpO1xuXHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLnB1c2goZWxlbWVudCk7XG5cdH1cblxuXHRhZGRGYXZvcml0ZSAoZmF2b3JpdGVJZCA6IG51bWJlciwgbW9kaWZ5Q29va2llcyA9IHRydWUpXG5cdHtcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQoZmF2b3JpdGVJZCk7XG5cdFx0aWYgKGVsZW1lbnQgIT09IG51bGwpIGVsZW1lbnQuaXNGYXZvcml0ZSA9IHRydWU7XG5cdFx0ZWxzZSByZXR1cm47XG5cdFx0XG5cdFx0aWYgKG1vZGlmeUNvb2tpZXMpXG5cdFx0e1xuXHRcdFx0dGhpcy5mYXZvcml0ZUlkc18ucHVzaChmYXZvcml0ZUlkKTtcblx0XHRcdENvb2tpZXMuY3JlYXRlQ29va2llKCdGYXZvcml0ZUlkcycsSlNPTi5zdHJpbmdpZnkodGhpcy5mYXZvcml0ZUlkc18pKTtcdFx0XG5cdFx0fVxuXHR9O1xuXG5cdHJlbW92ZUZhdm9yaXRlIChmYXZvcml0ZUlkIDogbnVtYmVyLCBtb2RpZnlDb29raWVzID0gdHJ1ZSlcblx0e1xuXHRcdGxldCBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChmYXZvcml0ZUlkKTtcblx0XHRpZiAoZWxlbWVudCAhPT0gbnVsbCkgZWxlbWVudC5pc0Zhdm9yaXRlID0gZmFsc2U7XG5cdFx0XG5cdFx0aWYgKG1vZGlmeUNvb2tpZXMpXG5cdFx0e1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5mYXZvcml0ZUlkc18uaW5kZXhPZihmYXZvcml0ZUlkKTtcblx0XHRcdGlmIChpbmRleCA+IC0xKSB0aGlzLmZhdm9yaXRlSWRzXy5zcGxpY2UoaW5kZXgsIDEpO1xuXG5cdFx0XHRDb29raWVzLmNyZWF0ZUNvb2tpZSgnRmF2b3JpdGVJZHMnLEpTT04uc3RyaW5naWZ5KHRoaXMuZmF2b3JpdGVJZHNfKSk7XG5cdFx0fVxuXHR9O1xuXG5cdGNsZWFyQ3VycmVudHNFbGVtZW50KClcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJjbGVhckN1cnJFbGVtZW50c1wiKTtcblx0XHRsZXQgbCA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLmxlbmd0aDtcblx0XHR3aGlsZShsLS0pXG5cdFx0e1xuXHRcdFx0dGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0uaGlkZSgpO1xuXHRcdFx0dGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0uaXNEaXNwbGF5ZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0dGhpcy5jbGVhckN1cnJWaXNpYmxlRWxlbWVudHMoKTtcblx0fVxuXG5cdHVwZGF0ZUN1cnJlbnRzRWxlbWVudHMoKVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcIlVwZGF0ZUN1cnJFbGVtZW50c1wiKTtcblx0XHRsZXQgbCA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLmxlbmd0aDtcblx0XHR3aGlsZShsLS0pXG5cdFx0e1xuXHRcdFx0dGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0udXBkYXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gY2hlY2sgZWxlbWVudHMgaW4gYm91bmRzIGFuZCB3aG8gYXJlIG5vdCBmaWx0ZXJlZFxuXHR1cGRhdGVFbGVtZW50VG9EaXNwbGF5IChjaGVja0luQWxsRWxlbWVudHMgPSB0cnVlLCBmb3JjZVJlcGFpbnQgPSBmYWxzZSkgXG5cdHtcdFxuXHRcdC8vIGluIHRoZXNlIHN0YXRlLHRoZXJlIGlzIG5vIG5lZWQgdG8gdXBkYXRlIGVsZW1lbnRzIHRvIGRpc3BsYXlcblx0XHRpZiAoIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dFbGVtZW50QWxvbmUgfHwgQXBwLnN0YXRlID09IEFwcFN0YXRlcy5TaG93RGlyZWN0aW9ucyApIFxuXHRcdFx0XHRcdCYmIEFwcC5tb2RlICE9IEFwcE1vZGVzLkxpc3QpIFxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRsZXQgZWxlbWVudHMgOiBFbGVtZW50W10gPSBudWxsO1xuXHRcdGlmIChjaGVja0luQWxsRWxlbWVudHMgfHwgdGhpcy52aXNpYmxlRWxlbWVudHNfLmxlbmd0aCA9PT0gMCkgZWxlbWVudHMgPSB0aGlzLmN1cnJFdmVyeUVsZW1lbnRzKCk7XG5cdFx0ZWxzZSBlbGVtZW50cyA9IHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpO1xuXHRcdFxuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coXCJVUERBVEUgRUxFTUVOVFMgXCIsIGVsZW1lbnRzLmxlbmd0aCk7XG5cblx0XHRsZXQgaSA6IG51bWJlciwgZWxlbWVudCA6IEVsZW1lbnQ7XG5cdFx0bGV0IGJvdW5kcztcblxuXHQgXHRsZXQgbmV3RWxlbWVudHMgOiBFbGVtZW50W10gPSBbXTtcblx0IFx0bGV0IGVsZW1lbnRzVG9SZW1vdmUgOiBFbGVtZW50W10gPSBbXTtcblx0IFx0bGV0IGVsZW1lbnRzQ2hhbmdlZCA9IGZhbHNlO1xuXG5cdFx0bGV0IGZpbHRlck1vZHVsZSA9IEFwcC5maWx0ZXJNb2R1bGU7XHRcblxuXHRcdGkgPSBlbGVtZW50cy5sZW5ndGg7XG5cblx0XHQvL2NvbnNvbGUubG9nKFwiVXBkYXRlRWxlbWVudFRvRGlzcGxheS4gTmJyZSBlbGVtZW50IMOgIHRyYWl0ZXIgOiBcIiArIGksIGNoZWNrSW5BbGxFbGVtZW50cyk7XG5cdFx0XG5cdFx0bGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cblx0XHR3aGlsZShpLS0gLyomJiB0aGlzLnZpc2libGVFbGVtZW50c18ubGVuZ3RoIDwgQXBwLmdldE1heEVsZW1lbnRzKCkqLylcblx0XHR7XG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudHNbaV07XG5cblx0XHRcdC8vIGluIExpc3QgbW9kZSB3ZSBkb24ndCBuZWVkIHRvIGNoZWNrIGJvdW5kcztcblx0XHRcdGxldCBlbGVtZW50SW5Cb3VuZHMgPSAoQXBwLm1vZGUgPT0gQXBwTW9kZXMuTGlzdCkgfHwgQXBwLm1hcENvbXBvbmVudC5jb250YWlucyhlbGVtZW50LnBvc2l0aW9uKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50SW5Cb3VuZHMgJiYgZmlsdGVyTW9kdWxlLmNoZWNrSWZFbGVtZW50UGFzc0ZpbHRlcnMoZWxlbWVudCkpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICghZWxlbWVudC5pc0Rpc3BsYXllZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVsZW1lbnQuaXNEaXNwbGF5ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0bmV3RWxlbWVudHMucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHRlbGVtZW50c0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChlbGVtZW50LmlzRGlzcGxheWVkKSBcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVsZW1lbnQuaXNEaXNwbGF5ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRlbGVtZW50c1RvUmVtb3ZlLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0ZWxlbWVudHNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5pbmRleE9mKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGlmIChpbmRleCA+IC0xKSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaWYgKHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGggPj0gQXBwLmdldE1heEVsZW1lbnRzKCkpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0LyokKCcjdG9vLW1hbnktbWFya2Vycy1tb2RhbCcpLnNob3coKS5mYWRlVG8oIDUwMCAsIDEpO1xuXHRcdC8vIFx0dGhpcy5jbGVhck1hcmtlcnMoKTtcdFx0XG5cdFx0Ly8gXHRyZXR1cm47Ki9cblx0XHQvLyBcdC8vY29uc29sZS5sb2coXCJUb29tYW55IG1hcmtlcnMuIE5icmUgbWFya2VycyA6IFwiICsgdGhpcy52aXNpYmxlRWxlbWVudHNfLmxlbmd0aCArIFwiIC8vIE1heE1hcmtlcnMgPSBcIiArIEFwcC5nZXRNYXhFbGVtZW50cygpKTtcblx0XHQvLyB9XG5cdFx0Ly8gZWxzZVxuXHRcdC8vIHtcblx0XHQvLyBcdCQoJyN0b28tbWFueS1tYXJrZXJzLW1vZGFsOnZpc2libGUnKS5mYWRlVG8oNjAwLDAsIGZ1bmN0aW9uKCl7ICQodGhpcykuaGlkZSgpOyB9KTtcblx0XHQvLyB9XG5cblxuXHRcdGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRsZXQgdGltZSA9IGVuZCAtIHN0YXJ0O1xuXHRcdC8vd2luZG93LmNvbnNvbGUubG9nKFwiICAgIGFuYWx5c2UgZWxlbWVudHMgZW4gXCIgKyB0aW1lICsgXCIgbXNcIik7XHRcblxuXHRcdGlmIChlbGVtZW50c0NoYW5nZWQgfHwgZm9yY2VSZXBhaW50KVxuXHRcdHtcdFx0XG5cdFx0XHR0aGlzLm9uRWxlbWVudHNDaGFuZ2VkLmVtaXQoe1xuXHRcdFx0XHRlbGVtZW50c1RvRGlzcGxheTogdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCksIFxuXHRcdFx0XHRuZXdFbGVtZW50cyA6IG5ld0VsZW1lbnRzLCBcblx0XHRcdFx0ZWxlbWVudHNUb1JlbW92ZSA6IGVsZW1lbnRzVG9SZW1vdmVcblx0XHRcdH0pO1x0XHRcblx0XHR9XG5cblx0XHRcblx0fTtcblxuXHRjdXJyVmlzaWJsZUVsZW1lbnRzKCkgXG5cdHtcblx0XHRyZXR1cm4gdGhpcy52aXNpYmxlRWxlbWVudHNfW0FwcC5jdXJyTWFpbklkXTtcblx0fTtcblxuXHRjdXJyRXZlcnlFbGVtZW50cygpIFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZXZlcnlFbGVtZW50c19bQXBwLmN1cnJNYWluSWRdO1xuXHR9O1xuXG5cdHByaXZhdGUgY2xlYXJDdXJyVmlzaWJsZUVsZW1lbnRzKCkgXG5cdHtcblx0XHRyZXR1cm4gdGhpcy52aXNpYmxlRWxlbWVudHNfW0FwcC5jdXJyTWFpbklkXSA9IFtdO1xuXHR9O1xuXG5cdGFsbEVsZW1lbnRzKClcblx0e1xuXHRcdHJldHVybiB0aGlzLmV2ZXJ5RWxlbWVudHNfWydhbGwnXTtcblx0fVxuXG5cdGNsZWFyTWFya2VycygpXG5cdHtcblx0XHRjb25zb2xlLmxvZyhcImNsZWFyTWFya2Vyc1wiKTtcblx0XHR0aGlzLmhpZGVBbGxNYXJrZXJzKCk7XG5cdFx0dGhpcy5jbGVhckN1cnJWaXNpYmxlRWxlbWVudHMoKTtcblx0fTtcblxuXHRnZXRNYXJrZXJzICgpIFxuXHR7XG5cdFx0bGV0IG1hcmtlcnMgPSBbXTtcblx0XHRsZXQgbCA9IHRoaXMudmlzaWJsZUVsZW1lbnRzXy5sZW5ndGg7XG5cdFx0d2hpbGUobC0tKVxuXHRcdHtcblx0XHRcdG1hcmtlcnMucHVzaCh0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5tYXJrZXIpO1xuXHRcdH1cblx0XHRyZXR1cm4gbWFya2Vycztcblx0fTtcblxuXHRoaWRlUGFydGlhbGx5QWxsTWFya2VycyAoKSBcblx0e1xuXHRcdHRoaXMuaXNTaG93aW5nSGFsZkhpZGRlbiA9IHRydWU7XG5cdFx0bGV0IGwgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5sZW5ndGg7XHRcdFxuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyKSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5tYXJrZXIuc2hvd0hhbGZIaWRkZW4oKTtcblx0XHR9XHRcdFxuXHR9O1xuXG5cdGhpZGVBbGxNYXJrZXJzICgpIFxuXHR7XG5cdFx0bGV0IGwgPSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKS5sZW5ndGg7XG5cdFx0d2hpbGUobC0tKVxuXHRcdHtcblx0XHRcdHRoaXMuY3VyclZpc2libGVFbGVtZW50cygpW2xdLmhpZGUoKTtcblx0XHR9XG5cdH07XG5cblx0c2hvd05vcm1hbEhpZGRlbkFsbE1hcmtlcnMgKCkgXG5cdHtcblx0XHR0aGlzLmlzU2hvd2luZ0hhbGZIaWRkZW4gPSBmYWxzZTtcblx0XHQkKCcubWFya2VyLWNsdXN0ZXInKS5yZW1vdmVDbGFzcygnaGFsZkhpZGRlbicpO1xuXHRcdFxuXHRcdGxldCBsID0gdGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKCkubGVuZ3RoO1xuXHRcdHdoaWxlKGwtLSlcblx0XHR7XG5cdFx0XHRpZiAodGhpcy5jdXJyVmlzaWJsZUVsZW1lbnRzKClbbF0ubWFya2VyKSB0aGlzLmN1cnJWaXNpYmxlRWxlbWVudHMoKVtsXS5tYXJrZXIuc2hvd05vcm1hbEhpZGRlbigpO1xuXHRcdH1cblx0fTtcblxuXHRnZXRFbGVtZW50QnlJZCAoZWxlbWVudElkKSA6IEVsZW1lbnRcblx0e1xuXHRcdC8vcmV0dXJuIHRoaXMuZXZlcnlFbGVtZW50c19bZWxlbWVudElkXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWxsRWxlbWVudHMoKS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMuYWxsRWxlbWVudHMoKVtpXS5pZCA9PSBlbGVtZW50SWQpIHJldHVybiB0aGlzLmFsbEVsZW1lbnRzKClbaV07XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0xMi0xM1xuICovXG5cblxuaW1wb3J0IHsgQXBwTW9kdWxlLCBBcHBTdGF0ZXMsIEFwcE1vZGVzIH0gZnJvbSBcIi4uL2FwcC5tb2R1bGVcIjtcbmltcG9ydCB7IHNsdWdpZnksIGNhcGl0YWxpemUsIHBhcnNlQXJyYXlOdW1iZXJJbnRvU3RyaW5nLCBwYXJzZVN0cmluZ0ludG9BcnJheU51bWJlciB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IE9wdGlvbn0gZnJvbSBcIi4uL2NsYXNzZXMvb3B0aW9uLmNsYXNzXCI7XG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LmNsYXNzXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuaW1wb3J0IHsgQ2F0ZWdvcnlPcHRpb25UcmVlTm9kZSB9IGZyb20gXCIuLi9jbGFzc2VzL2NhdGVnb3J5LW9wdGlvbi10cmVlLW5vZGUuY2xhc3NcIjtcblxuZGVjbGFyZSBsZXQgQXBwIDogQXBwTW9kdWxlO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyTW9kdWxlXG57XG5cdHNob3dPbmx5RmF2b3JpdGVfIDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdGNvbnN0cnVjdG9yKCkge1x0fVxuXG5cdHNob3dPbmx5RmF2b3JpdGUoYm9vbCA6IGJvb2xlYW4pXG5cdHtcblx0XHR0aGlzLnNob3dPbmx5RmF2b3JpdGVfID0gYm9vbDtcblx0fTtcblxuXHRjaGVja0lmRWxlbWVudFBhc3NGaWx0ZXJzIChlbGVtZW50IDogRWxlbWVudCkgOiBib29sZWFuXG5cdHtcblx0XHRpZiAodGhpcy5zaG93T25seUZhdm9yaXRlXykgcmV0dXJuIGVsZW1lbnQuaXNGYXZvcml0ZTtcblxuXHRcdGlmIChBcHAuY3Vyck1haW5JZCA9PSAnYWxsJylcblx0XHR7XG5cdFx0XHRsZXQgZWxlbWVudE9wdGlvbnMgPSBlbGVtZW50LmdldE9wdGlvblZhbHVlQnlDYXRlZ29yeUlkKCBBcHAuY2F0ZWdvcnlNb2R1bGUubWFpbkNhdGVnb3J5LmlkKTtcblx0XHRcdGxldCBjaGVja2VkT3B0aW9ucyA9IEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkuY2hlY2tlZE9wdGlvbnM7XG5cblx0XHRcdC8vY29uc29sZS5sb2coXCJcXG5lbGVtZW50c09wdGlvbnNcIiwgZWxlbWVudE9wdGlvbnMubWFwKCAodmFsdWUpID0+IHZhbHVlLm9wdGlvbi5uYW1lKSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiY2hlY2tlZE9wdGlvbnNcIiwgY2hlY2tlZE9wdGlvbnMubWFwKCAodmFsdWUpID0+IHZhbHVlLm5hbWUpKTtcblxuXHRcdFx0bGV0IHJlc3VsdCA9IGVsZW1lbnRPcHRpb25zLnNvbWUob3B0aW9uVmFsdWUgPT4gY2hlY2tlZE9wdGlvbnMuaW5kZXhPZihvcHRpb25WYWx1ZS5vcHRpb24pID4gLTEpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInJldHVyblwiLCByZXN1bHQpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdCA7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgbWFpbk9wdGlvbiA9IEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRDdXJyTWFpbk9wdGlvbigpO1x0XHRcdFxuXHRcdFx0bGV0IGlzUGFzc2luZ0ZpbHRlcnMgPSB0aGlzLnJlY3Vyc2l2ZWx5Q2hlY2tlZEluT3B0aW9uKG1haW5PcHRpb24sIGVsZW1lbnQpO1xuXHRcdFx0XG5cdFx0XHRpZiAoaXNQYXNzaW5nRmlsdGVycyAmJiBlbGVtZW50Lm9wZW5Ib3Vycylcblx0XHRcdHtcblx0XHRcdFx0aXNQYXNzaW5nRmlsdGVycyA9IGVsZW1lbnQub3BlbkhvdXJzRGF5cy5zb21lKCAoZGF5IDogYW55KSA9PiBBcHAuY2F0ZWdvcnlNb2R1bGUub3BlbkhvdXJzRmlsdGVyc0RheXMuaW5kZXhPZihkYXkpID4gLTEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gaXNQYXNzaW5nRmlsdGVycztcblx0XHR9XHRcdFxuXHR9XG5cblx0cHJpdmF0ZSByZWN1cnNpdmVseUNoZWNrZWRJbk9wdGlvbihvcHRpb24gOiBPcHRpb24sIGVsZW1lbnQgOiBFbGVtZW50KSA6IGJvb2xlYW5cblx0e1xuXHRcdGxldCBlY2FydCA9IFwiXCI7XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IG9wdGlvbi5kZXB0aDsgaSsrKSBlY2FydCs9IFwiLS1cIjtcblxuXHRcdGxldCBsb2cgPSBmYWxzZTtcblxuXHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKGVjYXJ0ICsgXCJDaGVjayBmb3Igb3B0aW9uIFwiLCBvcHRpb24ubmFtZSk7XG5cblx0XHRsZXQgcmVzdWx0O1xuXHRcdGlmIChvcHRpb24uc3ViY2F0ZWdvcmllcy5sZW5ndGggPT0gMCB8fCBvcHRpb24uaXNEaXNhYmxlZClcblx0XHR7XG5cdFx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhlY2FydCArIFwiTm8gc3ViY2F0ZWdvcmllcyBcIik7XG5cdFx0XHRyZXN1bHQgPSBvcHRpb24uaXNDaGVja2VkO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmVzdWx0ID0gb3B0aW9uLnN1YmNhdGVnb3JpZXMuZXZlcnkoIChjYXRlZ29yeSkgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGxvZykgY29uc29sZS5sb2coXCItLVwiICsgZWNhcnQgKyBcIkNhdGVnb3J5XCIsIGNhdGVnb3J5Lm5hbWUpO1xuXG5cdFx0XHRcdGxldCBjaGVja2VkT3B0aW9ucyA9IGNhdGVnb3J5LmNoZWNrZWRPcHRpb25zO1xuXHRcdFx0XHRsZXQgZWxlbWVudE9wdGlvbnMgPSBlbGVtZW50LmdldE9wdGlvblZhbHVlQnlDYXRlZ29yeUlkKGNhdGVnb3J5LmlkKTtcblxuXHRcdFx0XHRsZXQgaXNTb21lT3B0aW9uSW5DYXRlZ29yeUNoZWNrZWRPcHRpb25zID0gZWxlbWVudE9wdGlvbnMuc29tZShvcHRpb25WYWx1ZSA9PiBjaGVja2VkT3B0aW9ucy5pbmRleE9mKG9wdGlvblZhbHVlLm9wdGlvbikgPiAtMSk7IFxuXG5cdFx0XHRcdGlmIChsb2cpIGNvbnNvbGUubG9nKFwiLS1cIiArIGVjYXJ0ICsgXCJpc1NvbWVPcHRpb25JbkNhdGVnb3J5Q2hlY2tlZE9wdGlvbnNcIiwgaXNTb21lT3B0aW9uSW5DYXRlZ29yeUNoZWNrZWRPcHRpb25zKTtcblx0XHRcdFx0aWYgKGlzU29tZU9wdGlvbkluQ2F0ZWdvcnlDaGVja2VkT3B0aW9ucylcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhcIi0tXCIgKyBlY2FydCArIFwiU28gd2UgY2hlY2tlZCBpbiBzdWJvcHRpb25zXCIsIGNhdGVnb3J5Lm5hbWUpO1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50T3B0aW9ucy5zb21lKCAob3B0aW9uVmFsdWUpID0+IHRoaXMucmVjdXJzaXZlbHlDaGVja2VkSW5PcHRpb24ob3B0aW9uVmFsdWUub3B0aW9uLCBlbGVtZW50KSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZiAobG9nKSBjb25zb2xlLmxvZyhlY2FydCArIFwiUmV0dXJuIFwiLCByZXN1bHQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRsb2FkRmlsdGVyc0Zyb21TdHJpbmcoc3RyaW5nIDogc3RyaW5nKVxuXHR7XG5cdFx0bGV0IHNwbGl0ZWQgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHRsZXQgbWFpbk9wdGlvblNsdWcgPSBzcGxpdGVkWzBdO1xuXG5cdFx0bGV0IG1haW5PcHRpb25JZCA9IG1haW5PcHRpb25TbHVnID09ICdhbGwnID8gJ2FsbCcgOiBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbkJ5U2x1ZyhtYWluT3B0aW9uU2x1ZykuaWQ7XG5cdFx0QXBwLmRpcmVjdG9yeU1lbnVDb21wb25lbnQuc2V0TWFpbk9wdGlvbihtYWluT3B0aW9uSWQpO1x0XHRcblxuXHRcdGxldCBmaWx0ZXJzU3RyaW5nIDogc3RyaW5nO1xuXHRcdGxldCBhZGRpbmdNb2RlIDogYm9vbGVhbjtcblxuXHRcdGlmICggc3BsaXRlZC5sZW5ndGggPT0gMilcblx0XHR7XG5cdFx0XHRmaWx0ZXJzU3RyaW5nID0gc3BsaXRlZFsxXTtcblxuXHRcdFx0aWYgKGZpbHRlcnNTdHJpbmdbMF0gPT0gJyEnKSBhZGRpbmdNb2RlID0gZmFsc2U7XG5cdFx0XHRlbHNlIGFkZGluZ01vZGUgPSB0cnVlO1xuXG5cdFx0XHRmaWx0ZXJzU3RyaW5nID0gZmlsdGVyc1N0cmluZy5zdWJzdHJpbmcoMSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBzcGxpdGVkLmxlbmd0aCA+IDIpXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIHNwbGl0aW5nIGluIGxvYWRGaWx0ZXJGcm9tU3RyaW5nXCIpO1xuXHRcdH1cblxuXHRcdGxldCBmaWx0ZXJzID0gcGFyc2VTdHJpbmdJbnRvQXJyYXlOdW1iZXIoZmlsdGVyc1N0cmluZyk7XG5cblx0XHQvL2NvbnNvbGUubG9nKCdmaWx0ZXJzJywgZmlsdGVycyk7XG5cdFx0Ly9jb25zb2xlLmxvZygnYWRkaW5nTW9kZScsIGFkZGluZ01vZGUpO1xuXG5cdFx0Ly8gaWYgYWRkaW5nTW9kZSwgd2UgZmlyc3QgcHV0IGFsbCB0aGUgZmlsdGVyIHRvIGZhbHNlXG5cdFx0aWYgKGFkZGluZ01vZGUpXG5cdFx0e1xuXHRcdFx0aWYgKG1haW5PcHRpb25TbHVnID09ICdhbGwnKVxuXHRcdFx0XHRBcHAuY2F0ZWdvcnlNb2R1bGUubWFpbkNhdGVnb3J5LnRvZ2dsZShmYWxzZSwgZmFsc2UpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBjYXQgb2YgQXBwLmNhdGVnb3J5TW9kdWxlLmdldE1haW5PcHRpb25CeVNsdWcobWFpbk9wdGlvblNsdWcpLnN1YmNhdGVnb3JpZXMpXG5cdFx0XHRcdFx0Zm9yKGxldCBvcHRpb24gb2YgY2F0Lm9wdGlvbnMpIG9wdGlvbi50b2dnbGUoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdFx0QXBwLmNhdGVnb3J5TW9kdWxlLm9wZW5Ib3Vyc0NhdGVnb3J5LnRvZ2dsZShmYWxzZSwgZmFsc2UpO1xuXHRcdH1cblxuXHRcdGZvcihsZXQgZmlsdGVySWQgb2YgZmlsdGVycylcblx0XHR7XG5cdFx0XHRsZXQgb3B0aW9uID0gQXBwLmNhdGVnb3J5TW9kdWxlLmdldE9wdGlvbkJ5SWQoZmlsdGVySWQpO1xuXHRcdFx0aWYgKCFvcHRpb24pIGNvbnNvbGUubG9nKFwiRXJyb3IgbG9hZGluZ3MgZmlsdGVycyA6IFwiICsgZmlsdGVySWQpO1xuXHRcdFx0ZWxzZSBvcHRpb24udG9nZ2xlKGFkZGluZ01vZGUsIGZhbHNlKTtcblx0XHR9XG5cblx0XHRpZiAobWFpbk9wdGlvblNsdWcgPT0gJ2FsbCcpIEFwcC5jYXRlZ29yeU1vZHVsZS5tYWluQ2F0ZWdvcnkudXBkYXRlU3RhdGUoKTtcblx0XHRlbHNlIEFwcC5jYXRlZ29yeU1vZHVsZS5nZXRNYWluT3B0aW9uQnlTbHVnKG1haW5PcHRpb25TbHVnKS5yZWN1cnNpdmVseVVwZGF0ZVN0YXRlcygpO1xuXG5cdFx0QXBwLmVsZW1lbnRNb2R1bGUudXBkYXRlRWxlbWVudFRvRGlzcGxheSh0cnVlKTtcblx0XHQvL0FwcC5oaXN0b3J5TW9kdWxlLnVwZGF0ZUN1cnJTdGF0ZSgpO1xuXG5cdH1cblxuXHRnZXRGaWx0ZXJzVG9TdHJpbmcoKSA6IHN0cmluZ1xuXHR7XG5cdFx0bGV0IG1haW5PcHRpb25JZCA9IEFwcC5jdXJyTWFpbklkO1xuXG5cdFx0bGV0IG1haW5PcHRpb25OYW1lO1xuXHRcdGxldCBjaGVja0FycmF5VG9QYXJzZSwgdW5jaGVja0FycmF5VG9QYXJzZTtcblx0XHRcblx0XHRpZiAobWFpbk9wdGlvbklkID09ICdhbGwnKVxuXHRcdHtcdFx0XHRcblx0XHRcdG1haW5PcHRpb25OYW1lID0gXCJhbGxcIjtcblx0XHRcdGNoZWNrQXJyYXlUb1BhcnNlID0gQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeS5jaGVja2VkT3B0aW9ucy5tYXAoIChvcHRpb24pID0+IG9wdGlvbi5pZCk7XG5cdFx0XHR1bmNoZWNrQXJyYXlUb1BhcnNlID0gQXBwLmNhdGVnb3J5TW9kdWxlLm1haW5DYXRlZ29yeS5kaXNhYmxlZE9wdGlvbnMubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0bGV0IG1haW5PcHRpb24gPSBBcHAuY2F0ZWdvcnlNb2R1bGUuZ2V0TWFpbk9wdGlvbkJ5SWQobWFpbk9wdGlvbklkKTtcblx0XHRcdG1haW5PcHRpb25OYW1lID0gbWFpbk9wdGlvbi5uYW1lU2hvcnQ7XG5cblx0XHRcdGxldCBhbGxPcHRpb25zID0gbWFpbk9wdGlvbi5hbGxDaGlsZHJlbk9wdGlvbnM7XG5cblx0XHRcdGNoZWNrQXJyYXlUb1BhcnNlID0gYWxsT3B0aW9ucy5maWx0ZXIoIChvcHRpb24pID0+IG9wdGlvbi5pc0NoZWNrZWQgKS5tYXAoIChvcHRpb24pID0+IG9wdGlvbi5pZCk7XG5cdFx0XHR1bmNoZWNrQXJyYXlUb1BhcnNlID0gYWxsT3B0aW9ucy5maWx0ZXIoIChvcHRpb24pID0+IG9wdGlvbi5pc0Rpc2FibGVkICkubWFwKCAob3B0aW9uKSA9PiBvcHRpb24uaWQpO1xuXG5cdFx0XHRpZiAobWFpbk9wdGlvbi5zaG93T3BlbkhvdXJzKSBcblx0XHRcdHtcblx0XHRcdFx0Y2hlY2tBcnJheVRvUGFyc2UgPSBjaGVja0FycmF5VG9QYXJzZS5jb25jYXQoQXBwLmNhdGVnb3J5TW9kdWxlLm9wZW5Ib3Vyc0NhdGVnb3J5LmNoZWNrZWRPcHRpb25zLm1hcCggKG9wdGlvbikgPT4gb3B0aW9uLmlkKSk7XG5cdFx0XHRcdHVuY2hlY2tBcnJheVRvUGFyc2UgPSB1bmNoZWNrQXJyYXlUb1BhcnNlLmNvbmNhdChBcHAuY2F0ZWdvcnlNb2R1bGUub3BlbkhvdXJzQ2F0ZWdvcnkuZGlzYWJsZWRPcHRpb25zLm1hcCggKG9wdGlvbikgPT4gb3B0aW9uLmlkKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGNoZWNrZWRJZHNQYXJzZWQgPSBwYXJzZUFycmF5TnVtYmVySW50b1N0cmluZyhjaGVja0FycmF5VG9QYXJzZSk7XG5cdFx0bGV0IHVuY2hlY2tlZElkc1BhcnNlZCA9IHBhcnNlQXJyYXlOdW1iZXJJbnRvU3RyaW5nKHVuY2hlY2tBcnJheVRvUGFyc2UpO1xuXG5cdFx0bGV0IGFkZGluZ01vZGUgPSAoY2hlY2tlZElkc1BhcnNlZC5sZW5ndGggPCB1bmNoZWNrZWRJZHNQYXJzZWQubGVuZ3RoKTtcblxuXHRcdGxldCBhZGRpbmdTeW1ib2wgPSBhZGRpbmdNb2RlID8gJysnIDogJyEnO1xuXG5cdFx0bGV0IGZpbHRlcnNTdHJpbmcgPSBhZGRpbmdNb2RlID8gY2hlY2tlZElkc1BhcnNlZCA6IHVuY2hlY2tlZElkc1BhcnNlZDtcblxuXHRcdGlmICghYWRkaW5nTW9kZSAmJiBmaWx0ZXJzU3RyaW5nID09IFwiXCIgKSByZXR1cm4gbWFpbk9wdGlvbk5hbWU7XG5cblx0XHRyZXR1cm4gbWFpbk9wdGlvbk5hbWUgKyAnQCcgKyBhZGRpbmdTeW1ib2wgKyBmaWx0ZXJzU3RyaW5nO1xuXHR9XG59IiwiZGVjbGFyZSBsZXQgR2VvY29kZXJKUztcbmRlY2xhcmUgbGV0IEFwcCA6IEFwcE1vZHVsZTtcbmRlY2xhcmUgdmFyIEwsICQ7XG5cbmltcG9ydCB7IEFwcE1vZHVsZSB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBzbHVnaWZ5LCBjYXBpdGFsaXplLCB1bnNsdWdpZnkgfSBmcm9tIFwiLi4vLi4vY29tbW9ucy9jb21tb25zXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VvY29kZVJlc3VsdFxue1xuXHRnZXRDb29yZGluYXRlcygpIDogTC5MYXRMbmdUdXBsZTtcblx0Z2V0Rm9ybWF0dGVkQWRkcmVzcygpIDogc3RyaW5nO1x0XG5cdGdldEJvdW5kcygpIDogUmF3Qm91bmRzO1xufVxuXG4vLyBzb3V0aCwgd2VzdCwgbm9ydGgsIGVhc3RcbmV4cG9ydCB0eXBlIFJhd0JvdW5kcyA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuXG4vKipcbiogSW50ZXJmYWNlIGJldHdlZW4gR2VvY29kZXJKUyBhbmQgdGhlIEFwcFxuKiBBbGxvdyB0byBjaGFuZ2UgZ2VvY29kZSB0ZWNobm9sb2d5IHdpdGhvdXQgY2hhbmdpbmcgY29kZSBpbiB0aGUgQXBwXG4qL1xuZXhwb3J0IGNsYXNzIEdlb2NvZGVyTW9kdWxlXG57XG5cdGdlb2NvZGVyIDogYW55ID0gbnVsbDtcblx0bGFzdEFkZHJlc3NSZXF1ZXN0IDogc3RyaW5nID0gJyc7XG5cdGxhc3RSZXN1bHRzIDogR2VvY29kZVJlc3VsdFtdID0gbnVsbDtcblx0bGFzdFJlc3VsdEJvdW5kcyA6IEwuTGF0TG5nQm91bmRzID0gbnVsbDtcblxuXHRnZXRMb2NhdGlvbigpIDogTC5MYXRMbmdcblx0e1xuXHRcdGlmICghdGhpcy5sYXN0UmVzdWx0cyB8fCAhdGhpcy5sYXN0UmVzdWx0c1swXSkgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIEwubGF0TG5nKHRoaXMubGFzdFJlc3VsdHNbMF0uZ2V0Q29vcmRpbmF0ZXMoKSk7XG5cdH1cblxuXHRnZXRCb3VuZHMoKSA6IEwuTGF0TG5nQm91bmRzXG5cdHtcblx0XHRpZiAoIXRoaXMubGFzdFJlc3VsdEJvdW5kcykgcmV0dXJuIG51bGw7XG5cdFx0cmV0dXJuIHRoaXMubGFzdFJlc3VsdEJvdW5kcztcblx0fVxuXG5cdHByaXZhdGUgbGF0TG5nQm91bmRzRnJvbVJhd0JvdW5kcyhyYXdib3VuZHMgOiBSYXdCb3VuZHMpIDogTC5MYXRMbmdCb3VuZHNcblx0e1xuXHRcdGxldCBjb3JuZXIxID0gTC5sYXRMbmcocmF3Ym91bmRzWzBdLCByYXdib3VuZHNbMV0pO1xuXHRcdGxldCBjb3JuZXIyID0gTC5sYXRMbmcocmF3Ym91bmRzWzJdLCByYXdib3VuZHNbM10pO1xuXHRcdHJldHVybiBMLmxhdExuZ0JvdW5kcyhjb3JuZXIxLCBjb3JuZXIyKTtcblx0fVxuXG5cdGdldExvY2F0aW9uU2x1ZygpIDogc3RyaW5nIHsgcmV0dXJuIHNsdWdpZnkodGhpcy5sYXN0QWRkcmVzc1JlcXVlc3QpOyB9XG5cdGdldExvY2F0aW9uQWRkcmVzcygpIDogc3RyaW5nIHsgcmV0dXJuIHRoaXMubGFzdEFkZHJlc3NSZXF1ZXN0OyB9XG5cblx0c2V0TG9jYXRpb25BZGRyZXNzKCRhZGRyZXNzIDogc3RyaW5nKSB7IHRoaXMubGFzdEFkZHJlc3NSZXF1ZXN0ID0gJGFkZHJlc3M7IH1cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLmdlb2NvZGVyID0gR2VvY29kZXJKUy5jcmVhdGVHZW9jb2Rlcih7ICdwcm92aWRlcic6ICdvcGVuc3RyZWV0bWFwJywgJ2NvdW50cnljb2RlcycgOiAnZnInfSk7XG5cdFx0Ly90aGlzLmdlb2NvZGVyID0gR2VvY29kZXJKUy5jcmVhdGVHZW9jb2Rlcih7J3Byb3ZpZGVyJzogJ2dvb2dsZSd9KTtcblx0fVxuXG5cdGdlb2NvZGVBZGRyZXNzKCBhZGRyZXNzLCBjYWxsYmFja0NvbXBsZXRlPywgY2FsbGJhY2tGYWlsPyApIHtcblxuXHRcdC8vY29uc29sZS5sb2coXCJnZW9jb2RlIGFkZHJlc3MgOiBcIiwgYWRkcmVzcyk7XG5cdFx0dGhpcy5sYXN0QWRkcmVzc1JlcXVlc3QgPSBhZGRyZXNzO1xuXG5cdFx0Ly8gaWYgbm8gYWRkcmVzcywgd2Ugc2hvdyBmcmFuY2Vcblx0XHRpZiAoYWRkcmVzcyA9PSAnJylcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhcImRlZmF1bHQgbG9jYXRpb25cIik7XG5cdFx0XHR0aGlzLmxhc3RSZXN1bHRzID0gW107XG5cdFx0XHR0aGlzLmxhc3RSZXN1bHRCb3VuZHMgPSB0aGlzLmxhdExuZ0JvdW5kc0Zyb21SYXdCb3VuZHMoWzUxLjY4NjE3OTU0ODU1NjI0LDguODMzMDA3ODEyNTAwMDAyLDQyLjMwOTgxNTQxNTY4NjY2NCwgLTUuMzM5MzU1NDY4NzUwMDAxXSk7XG5cblx0XHRcdC8vIGxlYXZlIHRpbWUgZm9yIG1hcCB0byBsb2FkXG5cdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7IGNhbGxiYWNrQ29tcGxldGUodGhpcy5sYXN0UmVzdWx0cyk7IH0sIDIwMCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQvLyBmYWtlIGdlb2NvZGVyIHdoZW4gbm8gaW50ZXJuZXQgY29ubmV4aW9uXG5cdFx0XHRsZXQgZmFrZSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIWZha2UpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuZ2VvY29kZXIuZ2VvY29kZSggYWRkcmVzcywgKHJlc3VsdHMgOiBHZW9jb2RlUmVzdWx0W10pID0+XG5cdFx0XHRcdHtcdFx0XHRcblx0XHRcdFx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkgXG5cdFx0XHRcdFx0e1x0XHRcdFx0XG5cdFx0XHRcdFx0XHR0aGlzLmxhc3RSZXN1bHRzID0gcmVzdWx0cztcblx0XHRcdFx0XHRcdHRoaXMubGFzdFJlc3VsdEJvdW5kcyA9IHRoaXMubGF0TG5nQm91bmRzRnJvbVJhd0JvdW5kcyh0aGlzLmxhc3RSZXN1bHRzWzBdLmdldEJvdW5kcygpKTtcblxuXHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrQ29tcGxldGUpIGNhbGxiYWNrQ29tcGxldGUocmVzdWx0cyk7XHRcblx0XHRcdFx0XHR9IFx0XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmIChjYWxsYmFja0ZhaWwpIGNhbGxiYWNrRmFpbCgpO1x0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGxldCByZXN1bHQgPSB7XG5cdFx0XHRcdFx0Ym91bmRzOiBbLjA2OTE4NSwtMC42NDE0MTUsNDQuMTg0NzM1MSwtMC40Njk5ODM1XSxcblx0XHRcdFx0XHRjaXR5OiAnTGFicml0Jyxcblx0XHRcdFx0XHRmb3JtYXR0ZWRBZGRyZXNzOiBcIkxhYnJpdCA0MDQyMFwiLFxuXHRcdFx0XHRcdGxhdGl0dWRlOjQ0LjEwNDk1NjcsXG5cdFx0XHRcdFx0bG9uZ2l0dWRlOi0wLjU0NDUyOTYsXG5cdFx0XHRcdFx0cG9zdGFsX2NvZGU6XCI0MDQyMFwiLFxuXHRcdFx0XHRcdHJlZ2lvbjpcIk5vdXZlbGxlLUFxdWl0YWluZVwiLFxuXHRcdFx0XHRcdGdldEJvdW5kcygpIHsgcmV0dXJuIHRoaXMuYm91bmRzOyB9LFxuXHRcdFx0XHRcdGdldENvb3JkaW5hdGVzKCkgeyByZXR1cm4gW3RoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlXTsgfSxcblx0XHRcdFx0XHRnZXRGb3JtYXR0ZWRBZGRyZXNzKCkgeyByZXR1cm4gdGhpcy5mb3JtYXR0ZWRBZGRyZXNzOyB9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IFtdO1xuXHRcdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcblxuXHRcdFx0XHR0aGlzLmxhc3RSZXN1bHRzID0gcmVzdWx0cztcblx0XHRcdFx0dGhpcy5sYXN0UmVzdWx0Qm91bmRzID0gdGhpcy5sYXRMbmdCb3VuZHNGcm9tUmF3Qm91bmRzKHRoaXMubGFzdFJlc3VsdHNbMF0uZ2V0Qm91bmRzKCkpO1xuXG5cdFx0XHRcdGNhbGxiYWNrQ29tcGxldGUocmVzdWx0cyk7XG5cdFx0XHR9XHRcblx0XHR9XHRcdFx0XG5cdH07XG59IiwiLyoqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgTW9uVm9pc2luRmFpdER1QmlvIHByb2plY3QuXG4gKiBGb3IgdGhlIGZ1bGwgY29weXJpZ2h0IGFuZCBsaWNlbnNlIGluZm9ybWF0aW9uLCBwbGVhc2UgdmlldyB0aGUgTElDRU5TRVxuICogZmlsZSB0aGF0IHdhcyBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc291cmNlIGNvZGUuXG4gKlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTYgU2ViYXN0aWFuIENhc3RybyAtIDkwc2Nhc3Ryb0BnbWFpbC5jb21cbiAqIEBsaWNlbnNlICAgIE1JVCBMaWNlbnNlXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE2LTEyLTEzXG4gKi9cblxuaW1wb3J0IHsgRXZlbnQsIElFdmVudCB9IGZyb20gXCIuLi91dGlscy9ldmVudFwiO1xuaW1wb3J0IHsgc2x1Z2lmeSwgY2FwaXRhbGl6ZSB9IGZyb20gXCIuLi8uLi9jb21tb25zL2NvbW1vbnNcIjtcbmltcG9ydCB7IEFwcE1vZHVsZSwgQXBwU3RhdGVzLCBBcHBNb2RlcyB9IGZyb20gXCIuLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSBcIi4uL2NsYXNzZXMvZWxlbWVudC5jbGFzc1wiO1xuaW1wb3J0IHsgVmlld1BvcnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tYXAvbWFwLmNvbXBvbmVudFwiO1xuXG5kZWNsYXJlIGxldCBBcHAgOiBBcHBNb2R1bGU7XG5kZWNsYXJlIGxldCAkO1xuZGVjbGFyZSBsZXQgUm91dGluZztcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKVxue1x0XG4gICAvLyBHZXRzIGhpc3Rvcnkgc3RhdGUgZnJvbSBicm93c2VyXG4gICB3aW5kb3cub25wb3BzdGF0ZSA9IChldmVudCA6IFBvcFN0YXRlRXZlbnQpID0+XG4gICB7XG5cdCAgLy9jb25zb2xlLmxvZyhcIlxcblxcbk9ucG9wU3RhdGUgXCIsIGV2ZW50LnN0YXRlLmZpbHRlcnMpO1xuXHQgIGxldCBoaXN0b3J5c3RhdGUgOiBIaXN0b3J5U3RhdGUgPSBldmVudC5zdGF0ZTtcblx0ICAvLyB0cmFuc2Zvcm0ganNvblZpZXdwb3J0IGludG8gVmlld1BvcnQgb2JqZWN0IChpZiB3ZSBkb24ndCBkbyBzbyxcblx0ICAvLyB0aGUgVmlld1BvcnQgbWV0aG9kcyB3aWxsIG5vdCBiZSBhY2Nlc3NpYmxlKVxuXHQgIGhpc3RvcnlzdGF0ZS52aWV3cG9ydCA9ICQuZXh0ZW5kKG5ldyBWaWV3UG9ydCgpLCBldmVudC5zdGF0ZS52aWV3cG9ydCk7XG5cdCAgQXBwLmxvYWRIaXN0b3J5U3RhdGUoZXZlbnQuc3RhdGUsIHRydWUpO1xuXHR9O1xufSk7XG5cbmV4cG9ydCBjbGFzcyBIaXN0b3J5U3RhdGVcbntcblx0bW9kZTogQXBwTW9kZXM7XG5cdHN0YXRlIDogQXBwU3RhdGVzO1xuXHRhZGRyZXNzIDogc3RyaW5nO1xuXHR2aWV3cG9ydCA6IFZpZXdQb3J0O1xuXHRpZCA6IG51bWJlcjtcblx0ZmlsdGVycyA6IHN0cmluZztcblxuXHRwYXJzZSgkaGlzdG9yeVN0YXRlIDogYW55KSA6IEhpc3RvcnlTdGF0ZVxuXHR7XG5cdFx0dGhpcy5tb2RlID0gJGhpc3RvcnlTdGF0ZS5tb2RlID09ICdNYXAnID8gQXBwTW9kZXMuTWFwIDogQXBwTW9kZXMuTGlzdDtcblx0XHR0aGlzLnN0YXRlID0gcGFyc2VJbnQoQXBwU3RhdGVzWyRoaXN0b3J5U3RhdGUuc3RhdGVdKTtcblx0XHR0aGlzLmFkZHJlc3MgPSAkaGlzdG9yeVN0YXRlLmFkZHJlc3M7XG5cdFx0dGhpcy52aWV3cG9ydCA9IG5ldyBWaWV3UG9ydCgpLmZyb21TdHJpbmcoJGhpc3RvcnlTdGF0ZS52aWV3cG9ydCk7XG5cdFx0dGhpcy5pZCA9ICRoaXN0b3J5U3RhdGUuaWQ7XG5cdFx0dGhpcy5maWx0ZXJzID0gJGhpc3RvcnlTdGF0ZS5maWx0ZXJzO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBIaXN0b3J5TW9kdWxlXG57XG5cblx0Y29uc3RydWN0b3IoKSB7IH0gIFxuXG5cdHVwZGF0ZUN1cnJTdGF0ZShvcHRpb25zPylcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJVcGRhdGUgQ3VyciBTdGF0ZVwiKTtcblx0XHRpZiAoIWhpc3Rvcnkuc3RhdGUpIHsgY29uc29sZS5sb2coXCJjdXJyIHN0YXRlIG51bGxcIik7dGhpcy5wdXNoTmV3U3RhdGUoKTt9XG5cdFx0dGhpcy51cGRhdGVIaXN0b3J5KGZhbHNlLCBvcHRpb25zKTtcblx0fTtcblxuXHRwdXNoTmV3U3RhdGUob3B0aW9ucz8pXG5cdHtcblx0XHQvL2NvbnNvbGUubG9nKFwiUHVzaCBOZXcgU3RhdGVcIik7XG5cblx0XHRpZiAoaGlzdG9yeS5zdGF0ZSA9PT0gbnVsbCkgdGhpcy51cGRhdGVIaXN0b3J5KGZhbHNlLCBvcHRpb25zKTtcblx0XHRlbHNlIHRoaXMudXBkYXRlSGlzdG9yeSh0cnVlLCBvcHRpb25zKTtcblx0XHRcblx0fTtcblxuXHRwcml2YXRlIHVwZGF0ZUhpc3RvcnkoJHB1c2hTdGF0ZSA6IGJvb2xlYW4sICRvcHRpb25zPyA6IGFueSlcblx0e1xuXHRcdGlmIChBcHAubW9kZSA9PSB1bmRlZmluZWQpIHJldHVybjtcblxuXHRcdCRvcHRpb25zID0gJG9wdGlvbnMgfHwge307XG5cdFx0bGV0IGhpc3RvcnlTdGF0ZSA9IG5ldyBIaXN0b3J5U3RhdGU7XG5cdFx0aGlzdG9yeVN0YXRlLm1vZGUgPSBBcHAubW9kZTtcblx0XHRoaXN0b3J5U3RhdGUuc3RhdGUgPSBBcHAuc3RhdGU7XG5cdFx0aGlzdG9yeVN0YXRlLmFkZHJlc3MgPSBBcHAuZ2VvY29kZXIuZ2V0TG9jYXRpb25TbHVnKCk7XG5cdFx0aGlzdG9yeVN0YXRlLnZpZXdwb3J0ID0gQXBwLm1hcENvbXBvbmVudC52aWV3cG9ydDtcblx0XHRoaXN0b3J5U3RhdGUuaWQgPSBBcHAuaW5mb0JhckNvbXBvbmVudC5nZXRDdXJyRWxlbWVudElkKCkgfHwgJG9wdGlvbnMuaWQ7XG5cdFx0aGlzdG9yeVN0YXRlLmZpbHRlcnMgPSBBcHAuZmlsdGVyTW9kdWxlLmdldEZpbHRlcnNUb1N0cmluZygpO1xuXG5cdFx0Ly8gaWYgKCRwdXNoU3RhdGUpIGNvbnNvbGUubG9nKFwiTkVXIFNhdGVcIiwgaGlzdG9yeVN0YXRlLmZpbHRlcnMpO1xuXHRcdC8vIGVsc2UgY29uc29sZS5sb2coXCJVUERBVEUgU3RhdGVcIiwgaGlzdG9yeVN0YXRlLmZpbHRlcnMpO1xuXG5cdFx0bGV0IHJvdXRlID0gdGhpcy5nZW5lcmF0ZVJvdXRlKGhpc3RvcnlTdGF0ZSk7XG5cblx0XHRpZiAoIXJvdXRlKSByZXR1cm47XG5cblx0XHRpZiAoJHB1c2hTdGF0ZSlcblx0XHR7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZShoaXN0b3J5U3RhdGUsICcnLCByb3V0ZSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiUHVzaGluZyBuZXcgc3RhdGVcIiwgaGlzdG9yeVN0YXRlKTtcblx0XHR9XG5cdFx0ZWxzZSBcblx0XHR7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiUmVwbGFjZSBzdGF0ZVwiLCBoaXN0b3J5U3RhdGUpO1xuXHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgcm91dGUpO1xuXHRcdH1cblx0fTtcblxuXHRwcml2YXRlIGdlbmVyYXRlUm91dGUoaGlzdG9yeVN0YXRlIDogSGlzdG9yeVN0YXRlKVxuXHR7XG5cdFx0bGV0IHJvdXRlO1xuXHRcdGxldCBtb2RlID0gQXBwLm1vZGUgPT0gQXBwTW9kZXMuTWFwID8gJ2NhcnRlJyA6ICdsaXN0ZSc7XG5cdFx0bGV0IGFkZHJlc3MgPSBoaXN0b3J5U3RhdGUuYWRkcmVzcztcblx0XHRsZXQgdmlld3BvcnQgPSBoaXN0b3J5U3RhdGUudmlld3BvcnQ7XG5cdFx0bGV0IGFkZHJlc3NBbmRWaWV3cG9ydCA9ICcnO1xuXHRcdGlmIChhZGRyZXNzKSBhZGRyZXNzQW5kVmlld3BvcnQgKz0gYWRkcmVzcztcblx0XHQvLyBpbiBNYXAgTW9kZSB3ZSBhZGQgdmlld3BvcnRcblx0XHQvLyBpbiBMaXN0IG1vZGUgd2UgYWRkIHZpZXdwb3J0IG9ubHkgd2hlbiBubyBhZGRyZXNzIHByb3ZpZGVkXG5cdFx0aWYgKHZpZXdwb3J0ICYmIChBcHAubW9kZSA9PSBBcHBNb2Rlcy5NYXAgfHwgIWFkZHJlc3MpKSBhZGRyZXNzQW5kVmlld3BvcnQgKz0gdmlld3BvcnQudG9TdHJpbmcoKTtcblxuXHRcdC8vIGluIGxpc3QgbW9kZSB3ZSBkb24ndCBjYXJlIGFib3V0IHN0YXRlXG5cdFx0aWYgKEFwcC5tb2RlID09IEFwcE1vZGVzLkxpc3QpXG5cdFx0e1xuXHRcdFx0cm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fZGlyZWN0b3J5X25vcm1hbCcsIHsgbW9kZSA6ICBtb2RlIH0pO1x0XG5cdFx0XHRpZiAoYWRkcmVzc0FuZFZpZXdwb3J0KSByb3V0ZSArPSAnLycgKyBhZGRyZXNzQW5kVmlld3BvcnQ7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzd2l0Y2ggKEFwcC5zdGF0ZSlcblx0XHRcdHtcblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuTm9ybWFsOlx0XG5cdFx0XHRcdFx0cm91dGUgPSBSb3V0aW5nLmdlbmVyYXRlKCdiaW9wZW5fZGlyZWN0b3J5X25vcm1hbCcsIHsgbW9kZSA6ICBtb2RlIH0pO1x0XG5cdFx0XHRcdFx0Ly8gZm9yanNyb3V0aW5nIGRvZXNuJ3Qgc3VwcG9ydCBzcGVhY2lhbCBjaGFyYWN0cyBsaWtlIGluIHZpZXdwb3J0XG5cdFx0XHRcdFx0Ly8gc28gd2UgYWRkIHRoZW0gbWFudWFsbHlcblx0XHRcdFx0XHRpZiAoYWRkcmVzc0FuZFZpZXdwb3J0KSByb3V0ZSArPSAnLycgKyBhZGRyZXNzQW5kVmlld3BvcnQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnQ6XHRcblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0VsZW1lbnRBbG9uZTpcblx0XHRcdFx0Y2FzZSBBcHBTdGF0ZXMuU2hvd0RpcmVjdGlvbnM6XG5cdFx0XHRcdFx0aWYgKCFoaXN0b3J5U3RhdGUuaWQpIHJldHVybjtcblx0XHRcdFx0XHRsZXQgZWxlbWVudCA9IEFwcC5lbGVtZW50QnlJZChoaXN0b3J5U3RhdGUuaWQpO1xuXHRcdFx0XHRcdGlmICghZWxlbWVudCkgcmV0dXJuO1x0XHRcblxuXHRcdFx0XHRcdGlmIChBcHAuc3RhdGUgPT0gQXBwU3RhdGVzLlNob3dEaXJlY3Rpb25zKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJvdXRlID0gUm91dGluZy5nZW5lcmF0ZSgnYmlvcGVuX2RpcmVjdG9yeV9zaG93RGlyZWN0aW9ucycsIHsgbmFtZSA6ICBjYXBpdGFsaXplKHNsdWdpZnkoZWxlbWVudC5uYW1lKSksIGlkIDogZWxlbWVudC5pZCB9KTtcdFxuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyb3V0ZSA9IFJvdXRpbmcuZ2VuZXJhdGUoJ2Jpb3Blbl9kaXJlY3Rvcnlfc2hvd0VsZW1lbnQnLCB7IG5hbWUgOiAgY2FwaXRhbGl6ZShzbHVnaWZ5KGVsZW1lbnQubmFtZSkpLCBpZCA6IGVsZW1lbnQuaWQgfSk7XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gZm9yanNyb3V0aW5nIGRvZXNuJ3Qgc3VwcG9ydCBzcGVhY2lhbCBjaGFyYWN0cyBsaWtlIGluIHZpZXdwb3J0XG5cdFx0XHRcdFx0Ly8gc28gd2UgYWRkIHRoZW0gbWFudWFsbHlcblx0XHRcdFx0XHRpZiAoYWRkcmVzc0FuZFZpZXdwb3J0KSByb3V0ZSArPSAnLycgKyBhZGRyZXNzQW5kVmlld3BvcnQ7XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHQvLyBjYXNlIEFwcFN0YXRlcy5TaG93RGlyZWN0aW9uczpcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdC8vIFx0YnJlYWs7XHRcdFx0XG5cdFx0XHR9XHRcdFxuXHRcdH1cblxuXHRcdGlmIChoaXN0b3J5U3RhdGUuZmlsdGVycykgcm91dGUgKz0gJz9jYXQ9JyArIGhpc3RvcnlTdGF0ZS5maWx0ZXJzO1xuXHRcdFxuXHRcdFxuXHRcdFxuXHRcdC8vIGZvciAobGV0IGtleSBpbiBvcHRpb25zKVxuXHRcdC8vIHtcblx0XHQvLyBcdHJvdXRlICs9ICc/JyArIGtleSArICc9JyArIG9wdGlvbnNba2V5XTtcblx0XHQvLyBcdC8vcm91dGUgKz0gJy8nICsga2V5ICsgJy8nICsgb3B0aW9uc1trZXldO1xuXHRcdC8vIH1cblxuXHRcdC8vY29uc29sZS5sb2coXCJyb3V0ZSBnZW5lcmF0ZWRcIiwgcm91dGUpO1xuXG5cdFx0cmV0dXJuIHJvdXRlO1xuXHR9O1xufSIsIi8qKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIE1vblZvaXNpbkZhaXREdUJpbyBwcm9qZWN0LlxuICogRm9yIHRoZSBmdWxsIGNvcHlyaWdodCBhbmQgbGljZW5zZSBpbmZvcm1hdGlvbiwgcGxlYXNlIHZpZXcgdGhlIExJQ0VOU0VcbiAqIGZpbGUgdGhhdCB3YXMgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE2IFNlYmFzdGlhbiBDYXN0cm8gLSA5MHNjYXN0cm9AZ21haWwuY29tXG4gKiBAbGljZW5zZSAgICBNSVQgTGljZW5zZVxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNi0wOC0zMVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29va2llKG5hbWUsdmFsdWUpIFxue1xuXHRsZXQgZGF5cyA9IDEwMDtcblxuXHRsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSsoZGF5cyoyNCo2MCo2MCoxMDAwKSk7XG5cdGxldCBleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIrZGF0ZS50b1VUQ1N0cmluZygpO1xuXHRcblx0ZG9jdW1lbnQuY29va2llID0gbmFtZStcIj1cIit2YWx1ZStleHBpcmVzK1wiOyBwYXRoPS9cIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRDb29raWUobmFtZSkge1xuXHRsZXQgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuXHRsZXQgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcblx0Zm9yKGxldCBpPTA7aSA8IGNhLmxlbmd0aDtpKyspIHtcblx0XHRsZXQgYyA9IGNhW2ldO1xuXHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLGMubGVuZ3RoKTtcblx0XHRpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLGMubGVuZ3RoKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcblx0Y3JlYXRlQ29va2llKG5hbWUsXCJcIik7XG59IiwiZXhwb3J0IGludGVyZmFjZSBJRXZlbnQ8VD4ge1xuICAgIGRvKGhhbmRsZXI6IHsgKGRhdGE/OiBUKTogdm9pZCB9KSA6IHZvaWQ7XG4gICAgb2ZmKGhhbmRsZXI6IHsgKGRhdGE/OiBUKTogdm9pZCB9KSA6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudDxUPiBpbXBsZW1lbnRzIElFdmVudDxUPiB7XG4gICAgcHJpdmF0ZSBoYW5kbGVyczogeyAoZGF0YT86IFQpOiB2b2lkOyB9W10gPSBbXTtcblxuICAgIHB1YmxpYyBkbyhoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIG9mZihoYW5kbGVyOiB7IChkYXRhPzogVCk6IHZvaWQgfSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5maWx0ZXIoaCA9PiBoICE9PSBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW1pdChkYXRhPzogVCkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnNsaWNlKDApLmZvckVhY2goaCA9PiBoKGRhdGEpKTtcbiAgICB9XG59Il19
