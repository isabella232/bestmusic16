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
	
	var STORAGE = function () {
	    var set = function set(key, value) {
	        simpleStorage.set(APP_CONFIG.PROJECT_SLUG + '-' + key, value);
	    };
	
	    var get = function get(key) {
	        var value = simpleStorage.get(APP_CONFIG.PROJECT_SLUG + '-' + key);
	        return value;
	    };
	
	    var deleteKey = function deleteKey(key) {
	        simpleStorage.deleteKey(APP_CONFIG.PROJECT_SLUG + '-' + key);
	    };
	
	    var setTTL = function setTTL(key, ttl) {
	        simpleStorage.setTTL(APP_CONFIG.PROJECT_SLUG + '-' + key, ttl);
	    };
	
	    var getTTL = function getTTL(key) {
	        var ttl = simpleStorage.getTTL(APP_CONFIG.PROJECT_SLUG + '-' + key);
	        return ttl;
	    };
	
	    var testStorage = function testStorage() {
	        var test = STORAGE.get('test');
	        if (test) {
	            STORAGE.deleteKey('test');
	        }
	        console.log(simpleStorage.index()); // empty array
	        console.log(STORAGE.get('test')); // undefined
	
	        STORAGE.set('test', 'haha');
	        console.log(STORAGE.get('test'), STORAGE.getTTL('test')); // haha, Infinity
	
	        STORAGE.setTTL('test', 1000);
	        console.log(STORAGE.getTTL('test')); // 999 or 1000 or something close
	
	        console.log(simpleStorage.index()); // one element array
	        simpleStorage.flush();
	        console.log(simpleStorage.index()); // empty array
	    };
	
	    return {
	        'set': set,
	        'get': get,
	        'deleteKey': deleteKey,
	        'setTTL': setTTL,
	        'getTTL': getTTL,
	        'testStorage': testStorage
	    };
	}();

/***/ }
/******/ ]);
//# sourceMappingURL=storage.js.map