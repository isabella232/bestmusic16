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
/***/ function(module, exports) {

	'use strict';
	
	var reloadTimestamp;
	
	var RELOAD = function () {
	    var getTimestamp = function getTimestamp() {
	        if (reloadTimestamp == null) {
	            checkTimestamp();
	        }
	        setInterval(checkTimestamp, APP_CONFIG.RELOAD_CHECK_INTERVAL * 1000);
	    };
	
	    var checkTimestamp = function checkTimestamp() {
	        $.ajax({
	            'url': 'live-data/timestamp.json',
	            'cache': false,
	            'success': function success(data) {
	                var newTime = data['timestamp'];
	
	                if (reloadTimestamp == null) {
	                    reloadTimestamp = newTime;
	                }
	                if (reloadTimestamp != newTime) {
	                    window.location.reload(true);
	                }
	            }
	        });
	    };
	
	    return {
	        'getTimestamp': getTimestamp
	    };
	}();
	
	$(document).ready(function () {
	    RELOAD.getTimestamp();
	});

/***/ }
/******/ ]);
//# sourceMappingURL=reload.js.map