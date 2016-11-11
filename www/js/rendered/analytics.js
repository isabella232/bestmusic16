/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _cookie = __webpack_require__(1);
	
	var _cookie2 = _interopRequireDefault(_cookie);
	
	var _crossStorageClient = __webpack_require__(2);
	
	var _crossStorageClient2 = _interopRequireDefault(_crossStorageClient);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _gaq = _gaq || [];
	var _sf_async_config = {};
	var _comscore = _comscore || [];
	
	var ANALYTICS = function () {
	
	    // Global time tracking variables
	    var slideStartTime = new Date();
	    var timeOnLastSlide = null;
	
	    var embedGa = function embedGa() {
	        (function (i, s, o, g, r, a, m) {
	            i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
	                (i[r].q = i[r].q || []).push(arguments);
	            }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
	        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
	    };
	
	    var setupVizAnalytics = function setupVizAnalytics() {
	        ga('create', APP_CONFIG.VIZ_GOOGLE_ANALYTICS.ACCOUNT_ID, 'auto');
	        ga('send', 'pageview');
	    };
	
	    var setupDotOrgAnalytics = function setupDotOrgAnalytics() {
	        ga('create', APP_CONFIG.NPR_GOOGLE_ANALYTICS.ACCOUNT_ID, 'auto', 'dotOrgTracker');
	
	        var orientation = 'portrait';
	        if (window.orientation == 90 || window.orientation == -90) {
	            orientation = 'landscape';
	        }
	        var screenType = Modernizr.touch ? 'touch' : 'traditional';
	        var station = _cookie2.default.get('station');
	
	        var customDimensions = {
	            'dimension1': null, // story ID (this is the SEAMUS ID)
	            'dimension2': APP_CONFIG.NPR_GOOGLE_ANALYTICS.TOPICS, // topics, see Google spreadsheet for ids. First id begins with P for primary
	            'dimension3': APP_CONFIG.NPR_GOOGLE_ANALYTICS.PRIMARY_TOPIC, // primary topic -- name of the topic, not the ID
	            'dimension4': null, // story theme, which is the html theme in Seamus
	            'dimension5': null, // program, english name of program
	            'dimension6': APP_CONFIG.NPR_GOOGLE_ANALYTICS.TOPICS, // parents, roll up program, theme, topics, etc.
	            'dimension7': null, // story tags
	            'dimension8': null, // byline
	            'dimension9': null, // content partner organization
	            'dimension10': null, // publish date, yyyymmddhh
	            'dimension11': null, // page type, seamus page type
	            'dimension12': null, // original referrer, from localstorage
	            'dimension13': null, // original landing page, from localstorage
	            'dimension14': station ? station : null, // localized station, read the cookie
	            'dimension15': null, // favorite station, read the cookie
	            'dimension16': null, // audio listener, from localstorage
	            'dimension17': null, // days since first session, from localstorage
	            'dimension18': null, // first session date, from localstorage
	            'dimension19': null, // registered user, from localstorage
	            'dimension20': null, // logged in sessions, from localstorage
	            'dimension21': null, // registration date, from localstorage
	            'dimension22': document.title, // story title
	            'dimension23': orientation, // screen orientation
	            'dimension24': screenType // screen type
	        };
	
	        var storage = new _crossStorageClient2.default('http://www.npr.org/visuals/cross-storage-iframe.html');
	        storage.onConnect().then(function () {
	            return storage.get('firstVisitDate', 'hasListenedToAudio', 'isLoggedIn', 'isRegistered', 'originalLandingPage', 'originalReferrer', 'regDate');
	        }).then(function (res) {
	            customDimensions['dimension17'] = res[0] ? setDaysSinceFirstVisit(storage, res[0]) : 0;
	            customDimensions['dimension18'] = res[0] ? res[0] : setFirstVisitDate(storage);
	            customDimensions['dimension16'] = res[1] ? res[1] : null;
	            customDimensions['dimension20'] = res[2] ? res[2] : null;
	            customDimensions['dimension19'] = res[3] ? res[3] : null;
	            customDimensions['dimension13'] = res[4] ? res[4] : setOriginalLandingPage(storage);
	            customDimensions['dimension12'] = res[5] ? res[5] : setOriginalReferrer(storage);
	            customDimensions['dimension21'] = res[6] ? res[6] : null;
	            ga('dotOrgTracker.set', customDimensions);
	            ga('dotOrgTracker.send', 'pageview');
	        });
	    };
	
	    var setDaysSinceFirstVisit = function setDaysSinceFirstVisit(storage, firstDate) {
	        var firstDateISO = firstDate.substring(0, 4) + '-' + firstDate.substring(4, 6) + '-' + firstDate.substring(6);
	        var firstDateTime = new Date(firstDateISO);
	        var now = new Date();
	
	        var oneDay = 24 * 60 * 60 * 1000;
	        var daysSince = Math.round(Math.abs((firstDateTime.getTime() - now.getTime()) / oneDay));
	
	        return daysSince.toString();
	    };
	
	    var setFirstVisitDate = function setFirstVisitDate(storage) {
	        var now = new Date();
	        var year = now.getFullYear().toString();
	        var day = now.getDate().toString();
	        var month = now.getMonth() + 1;
	        if (month < 10) {
	            month = '0' + month.toString();
	        }
	        var dateString = year + month + day;
	
	        storage.set('firstVisitDate', dateString);
	        return dateString;
	    };
	
	    var setOriginalLandingPage = function setOriginalLandingPage(storage) {
	        var url = APP_CONFIG.S3_BASE_URL;
	        storage.set('originalLandingPage', url);
	        return url;
	    };
	
	    var setOriginalReferrer = function setOriginalReferrer(storage) {
	        var referrerString = null;
	
	        var utmSource = getParameterByName('utm_source', window.location.href);
	        if (utmSource) {
	            referrerString = utmSource;
	        } else {
	            var referrer = document.referrer;
	            if (!referrer) {
	                referrerString = 'direct';
	            } else {
	                var l = document.createElement('a');
	                l.href = referrer;
	                referrerString = l.hostname;
	            }
	        }
	
	        storage.set('originalReferrer', referrerString);
	        return referrerString;
	    };
	
	    function getParameterByName(name, url) {
	        if (!url) url = window.location.href;
	        name = name.replace(/[\[\]]/g, "\\$&");
	        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	            results = regex.exec(url);
	        if (!results) return null;
	        if (!results[2]) return '';
	        return decodeURIComponent(results[2].replace(/\+/g, " "));
	    }
	
	    var setupGoogle = function setupGoogle() {
	        embedGa();
	        setupVizAnalytics();
	        setupDotOrgAnalytics();
	    };
	
	    /*
	     * Comscore
	     */
	    var setupComscore = function setupComscore() {
	        _comscore.push({ c1: "2", c2: "17691522" });
	
	        (function () {
	            var s = document.createElement("script"),
	                el = document.getElementsByTagName("script")[0];s.async = true;
	            s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
	            el.parentNode.insertBefore(s, el);
	        })();
	    };
	
	    /*
	     * Nielson
	     */
	    var setupNielson = function setupNielson() {
	        (function () {
	            var d = new Image(1, 1);
	            d.onerror = d.onload = function () {
	                d.onerror = d.onload = null;
	            };
	            d.src = ["//secure-us.imrworldwide.com/cgi-bin/m?ci=us-803244h&cg=0&cc=1&si=", escape(window.location.href), "&rp=", escape(document.referrer), "&ts=compact&rnd=", new Date().getTime()].join('');
	        })();
	    };
	
	    /*
	     * Chartbeat
	     */
	    var setupChartbeat = function setupChartbeat() {
	        /** CONFIGURATION START **/
	        _sf_async_config.uid = 18888;
	        _sf_async_config.domain = "npr.org";
	        /** CONFIGURATION END **/
	        (function () {
	            function loadChartbeat() {
	                window._sf_endpt = new Date().getTime();
	                var e = document.createElement("script");
	                e.setAttribute("language", "javascript");
	                e.setAttribute("type", "text/javascript");
	                e.setAttribute("src", ("https:" == document.location.protocol ? "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" : "http://static.chartbeat.com/") + "js/chartbeat.js");
	                document.body.appendChild(e);
	            }
	            var oldonload = window.onload;
	            window.onload = typeof window.onload != "function" ? loadChartbeat : function () {
	                oldonload();loadChartbeat();
	            };
	        })();
	    };
	
	    /*
	     * Event tracking.
	     */
	    var trackEvent = function trackEvent(eventName, label, value) {
	        var eventData = {
	            'hitType': 'event',
	            'eventCategory': APP_CONFIG.PROJECT_SLUG,
	            'eventAction': eventName
	        };
	
	        if (label) {
	            eventData['eventLabel'] = label;
	        }
	
	        if (value) {
	            eventData['eventValue'] = value;
	        }
	
	        ga('send', eventData);
	    };
	
	    // SHARING
	
	    var openShareDiscuss = function openShareDiscuss() {
	        trackEvent('open-share-discuss');
	    };
	
	    var closeShareDiscuss = function closeShareDiscuss() {
	        trackEvent('close-share-discuss');
	    };
	
	    var clickTweet = function clickTweet(location) {
	        trackEvent('tweet', location);
	    };
	
	    var clickFacebook = function clickFacebook(location) {
	        trackEvent('facebook', location);
	    };
	
	    var clickEmail = function clickEmail(location) {
	        trackEvent('email', location);
	    };
	
	    var postComment = function postComment() {
	        trackEvent('new-comment');
	    };
	
	    var actOnFeaturedTweet = function actOnFeaturedTweet(action, tweet_url) {
	        trackEvent('featured-tweet-action', action, null);
	    };
	
	    var actOnFeaturedFacebook = function actOnFeaturedFacebook(action, post_url) {
	        trackEvent('featured-facebook-action', action, null);
	    };
	
	    var copySummary = function copySummary() {
	        trackEvent('summary-copied');
	    };
	
	    // NAVIGATION
	    var usedKeyboardNavigation = false;
	
	    var useKeyboardNavigation = function useKeyboardNavigation() {
	        if (!usedKeyboardNavigation) {
	            trackEvent('keyboard-nav');
	            usedKeyboardNavigation = true;
	        }
	    };
	
	    var completeTwentyFivePercent = function completeTwentyFivePercent() {
	        trackEvent('completion', '0.25');
	    };
	
	    var completeFiftyPercent = function completeFiftyPercent() {
	        trackEvent('completion', '0.5');
	    };
	
	    var completeSeventyFivePercent = function completeSeventyFivePercent() {
	        trackEvent('completion', '0.75');
	    };
	
	    var completeOneHundredPercent = function completeOneHundredPercent() {
	        trackEvent('completion', '1');
	    };
	
	    var startFullscreen = function startFullscreen() {
	        trackEvent('fullscreen-start');
	    };
	
	    var stopFullscreen = function stopFullscreen() {
	        trackEvent('fullscreen-stop');
	    };
	
	    var begin = function begin(location) {
	        trackEvent('begin', location);
	    };
	
	    var readyChromecast = function readyChromecast() {
	        trackEvent('chromecast-ready');
	    };
	
	    var startChromecast = function startChromecast() {
	        trackEvent('chromecast-start');
	    };
	
	    var stopChromecast = function stopChromecast() {
	        trackEvent('chromecast-stop');
	    };
	
	    // SLIDES
	
	    var exitSlide = function exitSlide(slide_index) {
	        var currentTime = new Date();
	        timeOnLastSlide = Math.abs(currentTime - slideStartTime);
	        slideStartTime = currentTime;
	        trackEvent('slide-exit', slide_index, timeOnLastSlide);
	    };
	
	    setupGoogle();
	    setupComscore();
	    setupNielson();
	
	    return {
	        'setupChartbeat': setupChartbeat,
	        'trackEvent': trackEvent,
	        'openShareDiscuss': openShareDiscuss,
	        'closeShareDiscuss': closeShareDiscuss,
	        'clickTweet': clickTweet,
	        'clickFacebook': clickFacebook,
	        'clickEmail': clickEmail,
	        'postComment': postComment,
	        'actOnFeaturedTweet': actOnFeaturedTweet,
	        'actOnFeaturedFacebook': actOnFeaturedFacebook,
	        'copySummary': copySummary,
	        'useKeyboardNavigation': useKeyboardNavigation,
	        'completeTwentyFivePercent': completeTwentyFivePercent,
	        'completeFiftyPercent': completeFiftyPercent,
	        'completeSeventyFivePercent': completeSeventyFivePercent,
	        'completeOneHundredPercent': completeOneHundredPercent,
	        'exitSlide': exitSlide,
	        'startFullscreen': startFullscreen,
	        'stopFullscreen': stopFullscreen,
	        'begin': begin,
	        'readyChromecast': readyChromecast,
	        'startChromecast': startChromecast,
	        'stopChromecast': stopChromecast
	    };
	}();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/*!
	 * JavaScript Cookie v2.1.0
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	(function (factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
			module.exports = factory();
		} else {
			var _OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = _OldCookies;
				return api;
			};
		}
	})(function () {
		function extend() {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[i];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}
	
		function init(converter) {
			function api(key, value, attributes) {
				var result;
	
				// Write
	
				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);
	
					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}
	
					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}
	
					if (!converter.write) {
						value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}
	
					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);
	
					return document.cookie = [key, '=', value, attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
					attributes.path && '; path=' + attributes.path, attributes.domain && '; domain=' + attributes.domain, attributes.secure ? '; secure' : ''].join('');
				}
	
				// Read
	
				if (!key) {
					result = {};
				}
	
				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;
	
				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var name = parts[0].replace(rdecode, decodeURIComponent);
					var cookie = parts.slice(1).join('=');
	
					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}
	
					try {
						cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);
	
						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}
	
						if (key === name) {
							result = cookie;
							break;
						}
	
						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}
	
				return result;
			}
	
			api.get = api.set = api;
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};
	
			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};
	
			api.withConverter = init;
	
			return api;
		}
	
		return init(function () {});
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * cross-storage - Cross domain local storage
	 *
	 * @version   0.8.1
	 * @link      https://github.com/zendesk/cross-storage
	 * @author    Daniel St. Jules <danielst.jules@gmail.com>
	 * @copyright Zendesk
	 * @license   Apache-2.0
	 */
	
	;(function (root) {
	  /**
	   * Constructs a new cross storage client given the url to a hub. By default,
	   * an iframe is created within the document body that points to the url. It
	   * also accepts an options object, which may include a timeout, frameId, and
	   * promise. The timeout, in milliseconds, is applied to each request and
	   * defaults to 5000ms. The options object may also include a frameId,
	   * identifying an existing frame on which to install its listeners. If the
	   * promise key is supplied the constructor for a Promise, that Promise library
	   * will be used instead of the default window.Promise.
	   *
	   * @example
	   * var storage = new CrossStorageClient('https://store.example.com/hub.html');
	   *
	   * @example
	   * var storage = new CrossStorageClient('https://store.example.com/hub.html', {
	   *   timeout: 5000,
	   *   frameId: 'storageFrame'
	   * });
	   *
	   * @constructor
	   *
	   * @param {string} url    The url to a cross storage hub
	   * @param {object} [opts] An optional object containing additional options,
	   *                        including timeout, frameId, and promise
	   *
	   * @property {string}   _id        A UUID v4 id
	   * @property {function} _promise   The Promise object to use
	   * @property {string}   _frameId   The id of the iFrame pointing to the hub url
	   * @property {string}   _origin    The hub's origin
	   * @property {object}   _requests  Mapping of request ids to callbacks
	   * @property {bool}     _connected Whether or not it has connected
	   * @property {bool}     _closed    Whether or not the client has closed
	   * @property {int}      _count     Number of requests sent
	   * @property {function} _listener  The listener added to the window
	   * @property {Window}   _hub       The hub window
	   */
	  function CrossStorageClient(url, opts) {
	    opts = opts || {};
	
	    this._id = CrossStorageClient._generateUUID();
	    this._promise = opts.promise || Promise;
	    this._frameId = opts.frameId || 'CrossStorageClient-' + this._id;
	    this._origin = CrossStorageClient._getOrigin(url);
	    this._requests = {};
	    this._connected = false;
	    this._closed = false;
	    this._count = 0;
	    this._timeout = opts.timeout || 5000;
	    this._listener = null;
	
	    this._installListener();
	
	    var frame;
	    if (opts.frameId) {
	      frame = document.getElementById(opts.frameId);
	    }
	
	    // If using a passed iframe, poll the hub for a ready message
	    if (frame) {
	      this._poll();
	    }
	
	    // Create the frame if not found or specified
	    frame = frame || this._createFrame(url);
	    this._hub = frame.contentWindow;
	  }
	
	  /**
	   * The styles to be applied to the generated iFrame. Defines a set of properties
	   * that hide the element by positioning it outside of the visible area, and
	   * by modifying its display.
	   *
	   * @member {Object}
	   */
	  CrossStorageClient.frameStyle = {
	    display: 'none',
	    position: 'absolute',
	    top: '-999px',
	    left: '-999px'
	  };
	
	  /**
	   * Returns the origin of an url, with cross browser support. Accommodates
	   * the lack of location.origin in IE, as well as the discrepancies in the
	   * inclusion of the port when using the default port for a protocol, e.g.
	   * 443 over https. Defaults to the origin of window.location if passed a
	   * relative path.
	   *
	   * @param   {string} url The url to a cross storage hub
	   * @returns {string} The origin of the url
	   */
	  CrossStorageClient._getOrigin = function (url) {
	    var uri, protocol, origin;
	
	    uri = document.createElement('a');
	    uri.href = url;
	
	    if (!uri.host) {
	      uri = window.location;
	    }
	
	    if (!uri.protocol || uri.protocol === ':') {
	      protocol = window.location.protocol;
	    } else {
	      protocol = uri.protocol;
	    }
	
	    origin = protocol + '//' + uri.host;
	    origin = origin.replace(/:80$|:443$/, '');
	
	    return origin;
	  };
	
	  /**
	   * UUID v4 generation, taken from: http://stackoverflow.com/questions/
	   * 105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
	   *
	   * @returns {string} A UUID v4 string
	   */
	  CrossStorageClient._generateUUID = function () {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = Math.random() * 16 | 0,
	          v = c == 'x' ? r : r & 0x3 | 0x8;
	
	      return v.toString(16);
	    });
	  };
	
	  /**
	   * Returns a promise that is fulfilled when a connection has been established
	   * with the cross storage hub. Its use is required to avoid sending any
	   * requests prior to initialization being complete.
	   *
	   * @returns {Promise} A promise that is resolved on connect
	   */
	  CrossStorageClient.prototype.onConnect = function () {
	    var client = this;
	
	    if (this._connected) {
	      return this._promise.resolve();
	    } else if (this._closed) {
	      return this._promise.reject(new Error('CrossStorageClient has closed'));
	    }
	
	    // Queue connect requests for client re-use
	    if (!this._requests.connect) {
	      this._requests.connect = [];
	    }
	
	    return new this._promise(function (resolve, reject) {
	      var timeout = setTimeout(function () {
	        reject(new Error('CrossStorageClient could not connect'));
	      }, client._timeout);
	
	      client._requests.connect.push(function (err) {
	        clearTimeout(timeout);
	        if (err) return reject(err);
	
	        resolve();
	      });
	    });
	  };
	
	  /**
	   * Sets a key to the specified value, optionally accepting a ttl to passively
	   * expire the key after a number of milliseconds. Returns a promise that is
	   * fulfilled on success, or rejected if any errors setting the key occurred,
	   * or the request timed out.
	   *
	   * @param   {string}  key   The key to set
	   * @param   {*}       value The value to assign
	   * @param   {int}     ttl   Time to live in milliseconds
	   * @returns {Promise} A promise that is settled on hub response or timeout
	   */
	  CrossStorageClient.prototype.set = function (key, value, ttl) {
	    return this._request('set', {
	      key: key,
	      value: value,
	      ttl: ttl
	    });
	  };
	
	  /**
	   * Accepts one or more keys for which to retrieve their values. Returns a
	   * promise that is settled on hub response or timeout. On success, it is
	   * fulfilled with the value of the key if only passed a single argument.
	   * Otherwise it's resolved with an array of values. On failure, it is rejected
	   * with the corresponding error message.
	   *
	   * @param   {...string} key The key to retrieve
	   * @returns {Promise}   A promise that is settled on hub response or timeout
	   */
	  CrossStorageClient.prototype.get = function (key) {
	    var args = Array.prototype.slice.call(arguments);
	
	    return this._request('get', { keys: args });
	  };
	
	  /**
	   * Accepts one or more keys for deletion. Returns a promise that is settled on
	   * hub response or timeout.
	   *
	   * @param   {...string} key The key to delete
	   * @returns {Promise}   A promise that is settled on hub response or timeout
	   */
	  CrossStorageClient.prototype.del = function () {
	    var args = Array.prototype.slice.call(arguments);
	
	    return this._request('del', { keys: args });
	  };
	
	  /**
	   * Returns a promise that, when resolved, indicates that all localStorage
	   * data has been cleared.
	   *
	   * @returns {Promise} A promise that is settled on hub response or timeout
	   */
	  CrossStorageClient.prototype.clear = function () {
	    return this._request('clear');
	  };
	
	  /**
	   * Returns a promise that, when resolved, passes an array of all keys
	   * currently in storage.
	   *
	   * @returns {Promise} A promise that is settled on hub response or timeout
	   */
	  CrossStorageClient.prototype.getKeys = function () {
	    return this._request('getKeys');
	  };
	
	  /**
	   * Deletes the iframe and sets the connected state to false. The client can
	   * no longer be used after being invoked.
	   */
	  CrossStorageClient.prototype.close = function () {
	    var frame = document.getElementById(this._frameId);
	    if (frame) {
	      frame.parentNode.removeChild(frame);
	    }
	
	    // Support IE8 with detachEvent
	    if (window.removeEventListener) {
	      window.removeEventListener('message', this._listener, false);
	    } else {
	      window.detachEvent('onmessage', this._listener);
	    }
	
	    this._connected = false;
	    this._closed = true;
	  };
	
	  /**
	   * Installs the necessary listener for the window message event. When a message
	   * is received, the client's _connected status is changed to true, and the
	   * onConnect promise is fulfilled. Given a response message, the callback
	   * corresponding to its request is invoked. If response.error holds a truthy
	   * value, the promise associated with the original request is rejected with
	   * the error. Otherwise the promise is fulfilled and passed response.result.
	   *
	   * @private
	   */
	  CrossStorageClient.prototype._installListener = function () {
	    var client = this;
	
	    this._listener = function (message) {
	      var i, origin, error, response;
	
	      // Ignore invalid messages or those after the client has closed
	      if (client._closed || !message.data || typeof message.data !== 'string') {
	        return;
	      }
	
	      // postMessage returns the string "null" as the origin for "file://"
	      origin = message.origin === 'null' ? 'file://' : message.origin;
	
	      // Ignore messages not from the correct origin
	      if (origin !== client._origin) return;
	
	      // LocalStorage isn't available in the hub
	      if (message.data === 'cross-storage:unavailable') {
	        if (!client._closed) client.close();
	        if (!client._requests.connect) return;
	
	        error = new Error('Closing client. Could not access localStorage in hub.');
	        for (i = 0; i < client._requests.connect.length; i++) {
	          client._requests.connect[i](error);
	        }
	
	        return;
	      }
	
	      // Handle initial connection
	      if (message.data.indexOf('cross-storage:') !== -1 && !client._connected) {
	        client._connected = true;
	        if (!client._requests.connect) return;
	
	        for (i = 0; i < client._requests.connect.length; i++) {
	          client._requests.connect[i](error);
	        }
	        delete client._requests.connect;
	      }
	
	      if (message.data === 'cross-storage:ready') return;
	
	      // All other messages
	      try {
	        response = JSON.parse(message.data);
	      } catch (e) {
	        return;
	      }
	
	      if (!response.id) return;
	
	      if (client._requests[response.id]) {
	        client._requests[response.id](response.error, response.result);
	      }
	    };
	
	    // Support IE8 with attachEvent
	    if (window.addEventListener) {
	      window.addEventListener('message', this._listener, false);
	    } else {
	      window.attachEvent('onmessage', this._listener);
	    }
	  };
	
	  /**
	   * Invoked when a frame id was passed to the client, rather than allowing
	   * the client to create its own iframe. Polls the hub for a ready event to
	   * establish a connected state.
	   */
	  CrossStorageClient.prototype._poll = function () {
	    var client, interval, targetOrigin;
	
	    client = this;
	
	    // postMessage requires that the target origin be set to "*" for "file://"
	    targetOrigin = client._origin === 'file://' ? '*' : client._origin;
	
	    interval = setInterval(function () {
	      if (client._connected) return clearInterval(interval);
	      if (!client._hub) return;
	
	      client._hub.postMessage('cross-storage:poll', targetOrigin);
	    }, 1000);
	  };
	
	  /**
	   * Creates a new iFrame containing the hub. Applies the necessary styles to
	   * hide the element from view, prior to adding it to the document body.
	   * Returns the created element.
	   *
	   * @private
	   *
	   * @param  {string}            url The url to the hub
	   * returns {HTMLIFrameElement} The iFrame element itself
	   */
	  CrossStorageClient.prototype._createFrame = function (url) {
	    var frame, key;
	
	    frame = window.document.createElement('iframe');
	    frame.id = this._frameId;
	
	    // Style the iframe
	    for (key in CrossStorageClient.frameStyle) {
	      if (CrossStorageClient.frameStyle.hasOwnProperty(key)) {
	        frame.style[key] = CrossStorageClient.frameStyle[key];
	      }
	    }
	
	    window.document.body.appendChild(frame);
	    frame.src = url;
	
	    return frame;
	  };
	
	  /**
	   * Sends a message containing the given method and params to the hub. Stores
	   * a callback in the _requests object for later invocation on message, or
	   * deletion on timeout. Returns a promise that is settled in either instance.
	   *
	   * @private
	   *
	   * @param   {string}  method The method to invoke
	   * @param   {*}       params The arguments to pass
	   * @returns {Promise} A promise that is settled on hub response or timeout
	   */
	  CrossStorageClient.prototype._request = function (method, params) {
	    var req, client;
	
	    if (this._closed) {
	      return this._promise.reject(new Error('CrossStorageClient has closed'));
	    }
	
	    client = this;
	    client._count++;
	
	    req = {
	      id: this._id + ':' + client._count,
	      method: 'cross-storage:' + method,
	      params: params
	    };
	
	    return new this._promise(function (resolve, reject) {
	      var timeout, originalToJSON, targetOrigin;
	
	      // Timeout if a response isn't received after 4s
	      timeout = setTimeout(function () {
	        if (!client._requests[req.id]) return;
	
	        delete client._requests[req.id];
	        reject(new Error('Timeout: could not perform ' + req.method));
	      }, client._timeout);
	
	      // Add request callback
	      client._requests[req.id] = function (err, result) {
	        clearTimeout(timeout);
	        if (err) return reject(new Error(err));
	        resolve(result);
	      };
	
	      // In case we have a broken Array.prototype.toJSON, e.g. because of
	      // old versions of prototype
	      if (Array.prototype.toJSON) {
	        originalToJSON = Array.prototype.toJSON;
	        Array.prototype.toJSON = null;
	      }
	
	      // postMessage requires that the target origin be set to "*" for "file://"
	      targetOrigin = client._origin === 'file://' ? '*' : client._origin;
	
	      // Send serialized message
	      client._hub.postMessage(JSON.stringify(req), targetOrigin);
	
	      // Restore original toJSON
	      if (originalToJSON) {
	        Array.prototype.toJSON = originalToJSON;
	      }
	    });
	  };
	
	  /**
	   * Export for various environments.
	   */
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = CrossStorageClient;
	  } else if (true) {
	    exports.CrossStorageClient = CrossStorageClient;
	  } else if (typeof define === 'function' && define.amd) {
	    define([], function () {
	      return CrossStorageClient;
	    });
	  } else {
	    root.CrossStorageClient = CrossStorageClient;
	  }
	})(undefined);

/***/ }
/******/ ]);
//# sourceMappingURL=analytics.js.map