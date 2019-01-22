(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "    <div id=\"theForm\">\n      <h2>Bus Form</h2>\n      <form #f=\"ngForm\" name=\"theForm\" (ngSubmit)=\"addLog(f)\">\n        <div class=\"form-group\">\n          <label>Boarded</label>\n          \n          <input type=\"number\"\n                class=\"form-control\"\n                name=\"boarded\"\n                [(ngModel)]=\"log.boarded\"\n                #logBoarded=\"ngModel\"\n                pattern=\"^[0-9]+$\"\n                required>\n          <span class=\"help-block danger\" *ngIf=\"logBoarded.errors?.required && logBoarded.touched\">\n            The # of boarded is required\n          </span>\n          <span class=\"help-block danger\" *ngIf=\"logBoarded.errors?.pattern && logBoarded.touched\">\n            The # of boaurded can only contain numbers\n          </span>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Stop</label>\n          <input type=\"text\"\n                class=\"form-control\"\n                name=\"stop\"\n                [(ngModel)]=\"log.stop\"\n                #logStop=\"ngModel\"\n                pattern=\"^[a-zA-Z]+$\"\n                required>\n          <span class=\"help-block danger\" *ngIf=\"logStop.errors?.required && logStop.touched\">\n            The stop name is required\n          </span>\n          <span class=\"help-block danger\" *ngIf=\"logStop.errors?.pattern && logStop.touched\">\n            The stop name can only contain the letters a-z or A-Z\n          </span>\n        </div>\n\n        <!-- <div class=\"form-group\">\n          <label>timestap</label>\n          <input type=\"datetime-local\"\n                class=\"form-control\"\n                name=\"timestamp\"\n                [(ngModel)]=\"log.timestamp\"\n                #logTimestamp=\"ngModel\"\n                required>\n          <span class=\"help-block danger\" *ngIf=\"logTimestamp.errors?.required && logTimestamp.touched\">\n            The model name is required\n          </span>\n          <span class=\"help-block danger\" *ngIf=\"logTimestamp.errors?.pattern && logTimestamp.touched\">\n            The model name can only contain the letters a-z or A-Z\n          </span>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Date</label>\n          <input type=\"date\"\n                class=\"form-control\"\n                name=\"Date\"\n                [(ngModel)]=\"log.date\"\n                #logDate=\"ngModel\"\n                required>\n          <span class=\"help-block danger\" *ngIf=\"logDate.errors?.required && logDate.touched\">\n            The model name is required\n          </span>\n          <span class=\"help-block danger\" *ngIf=\"logDate.errors?.pattern && logDate.touched\">\n            The model name can only contain the letters a-z or A-Z\n          </span>\n        </div> -->\n\n        <div class=\"form-group\">\n          <label>Loop</label>\n          <input type=\"text\"\n                class=\"form-control\"\n                name=\"loop\"\n                [(ngModel)]=\"log.loop\"\n                #logLoop=\"ngModel\"\n                required\n                pattern=\"^[a-zA-Z]+$\">\n          <span class=\"help-block danger\" *ngIf=\"logLoop.errors?.required && logLoop.touched\">\n            The loop name is required.\n          </span>\n          <span class=\"help-block danger\" *ngIf=\"logLoop.errors?.pattern && logLoop.touched\">\n            The loop name can only contain the letters a-z or A-Z\n          </span>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Driver</label>\n          <input type=\"text\"\n                class=\"form-control\"\n                name=\"driver\"\n                [(ngModel)]=\"log.driver\"\n                #logDriver=\"ngModel\"\n                required\n                pattern=\"^[a-zA-Z]+$\">\n          <span class=\"help-block danger\" *ngIf=\"logDriver.errors?.required && logDriver.touched\">\n            The driver name is required\n          </span>\n          <span class=\"help-block danger\" *ngIf=\"logDriver.errors?.pattern && logDriver.touched\">\n            The driver name can only contain the letters a-z or A-Z\n          </span>\n        </div>\n    \n        <button type=\"submit\" \n          class=\"btn btn-primary btn-lg btn-block\"\n            [disabled]=\"f.invalid\">Add</button>\n      </form>\n    </div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log */ "./src/app/log.ts");
/* harmony import */ var _log_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./log.service */ "./src/app/log.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = /** @class */ (function () {
    function AppComponent(logService) {
        this.logService = logService;
        this.error = '';
        this.success = '';
        this.total = 0;
        this.log = new _log__WEBPACK_IMPORTED_MODULE_1__["Log"](0, '', '', '');
    }
    AppComponent.prototype.addLog = function (f) {
        this.logService.store(this.log).subscribe(function (data) {
            console.log(data);
            f.controls['boarded'].reset();
            f.controls['stop'].reset();
            f.controls['loop'].reset();
        }, function (error) { return console.log("Could not add bitch"); });
    };
    // addCar(log: Log) {
    //   this.resetErrors();
    //   this.logService.store(this.log)
    //     .subscribe(
    //       (res: Log) => {
    //         // Update the list of cars
    //         this.logs = res;
    //         // Inform the user
    //         this.success = 'Created successfully';
    //         // Reset the form
    //         f.reset();
    //       },
    //       (err) => this.error = err
    //     );
    // }
    AppComponent.prototype.resetErrors = function () {
        this.success = '';
        this.error = '';
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_log_service__WEBPACK_IMPORTED_MODULE_2__["LogService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/log.service.ts":
/*!********************************!*\
  !*** ./src/app/log.service.ts ***!
  \********************************/
/*! exports provided: LogService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogService", function() { return LogService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LogService = /** @class */ (function () {
    function LogService(http) {
        this.http = http;
        this.baseUrl = 'https://www.mildvariety.club/api';
    }
    LogService.prototype.store = function (log) {
        return this.http.post('https://www.mildvariety.club/api/store', { data: log })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    };
    /** POST: add a new hero to the database */
    // store (log: Log): Observable<Log[]> {
    //   return this.http.post<Log[]>(`${this.baseUrl}/store`, log, httpOptions)
    //     .pipe(
    //       catchError(this.handleError)
    //     );
    // }
    // store(car: Log): Observable<Log[]> {
    //   return this.http.post(`${this.baseUrl}/store`, { data: car })
    //     .pipe(map((res) => {
    //       this.logs.push(res['data']);
    //       return this.logs;
    //     }),
    //     catchError(this.handleError));
    // }
    LogService.prototype.handleError = function (error) {
        console.log("there was an error");
        console.log(error);
        // return an observable with a user friendly message
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])('Error! something went wrong.');
    };
    LogService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], LogService);
    return LogService;
}());



/***/ }),

/***/ "./src/app/log.ts":
/*!************************!*\
  !*** ./src/app/log.ts ***!
  \************************/
/*! exports provided: Log */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Log", function() { return Log; });
var Log = /** @class */ (function () {
    function Log(boarded, stop, loop, driver, id) {
    }
    return Log;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/keithdesimini/Documents/GitHub/ShuttleLogCollectionSystemSourceCode/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map