"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunklit_game"] = self["webpackChunklit_game"] || []).push([["src_winner-page_ts"],{

/***/ "./src/winner-page.ts":
/*!****************************!*\
  !*** ./src/winner-page.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WinnerPage: () => (/* binding */ WinnerPage)\n/* harmony export */ });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.mjs\");\n/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ \"./node_modules/lit/index.js\");\n/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ \"./node_modules/lit/decorators.js\");\n/* harmony import */ var _vaadin_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vaadin/router */ \"./node_modules/@vaadin/router/dist/index.js\");\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./game */ \"./src/game.ts\");\n/* harmony import */ var _store_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./store-service */ \"./src/store-service.ts\");\n\n\n\n\n\n\nlet WinnerPage = class WinnerPage extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {\n    constructor() {\n        super();\n        this.currentGame = new _game__WEBPACK_IMPORTED_MODULE_3__.Game('');\n        this.loadGame();\n    }\n    handleNewGame(event) {\n        const gameName = new Date().toString();\n        const game = new _game__WEBPACK_IMPORTED_MODULE_3__.Game(gameName);\n        game.init(localStorage.userName);\n        _store_service__WEBPACK_IMPORTED_MODULE_4__.StoreService.saveGame(game);\n    }\n    loadGame() {\n        _store_service__WEBPACK_IMPORTED_MODULE_4__.StoreService.onGameUpdate((game) => {\n            this.currentGame = game;\n            if (this.currentGame.status === 'pending') {\n                _vaadin_router__WEBPACK_IMPORTED_MODULE_2__.Router.go('/starting');\n            }\n            this.requestUpdate();\n        });\n    }\n    renderLeaderboard() {\n        const leaderboard = this.currentGame.getLeaderboard();\n        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `\n      <div class=\"leaderboard\">\n        <h3>Classifica</h3>\n        <ul>\n          ${leaderboard.map(entry => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `\n            <li>${entry.playerName}: ${entry.wins} vittorie</li>\n          `)}\n        </ul>\n      </div>\n    `;\n    }\n    render() {\n        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `\n      <main class=\"game\">\n        <span>User: ${localStorage.userName}${this.currentGame.status}</span>\n         <button @click=\"${this.handleNewGame}\">New game</button>\n         ${this.renderLeaderboard()}\n      </main>\n    `;\n    }\n};\nWinnerPage.styles = (0,lit__WEBPACK_IMPORTED_MODULE_0__.css) `\n  main {\n    background-color: red;\n    height: 100%;\n  }\n  `;\nWinnerPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([\n    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.customElement)('winner-page')\n], WinnerPage);\n\n\n\n//# sourceURL=webpack://lit-game/./src/winner-page.ts?");

/***/ })

}]);