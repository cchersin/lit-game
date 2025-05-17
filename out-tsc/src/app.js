import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './index.js';
let App = class App extends LitElement {
    constructor() {
        super();
        this.header = 'My game';
    }
    firstUpdated() {
        const outlet = this.shadowRoot?.getElementById('outlet');
        if (outlet) {
            const router = new Router(outlet);
            router.setRoutes(routes);
            Router.go('/login');
        }
    }
    render() {
        return html `
      <main class="main">
         <!-- <div class="topnav">
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/game">Game</a>
          <a href="/player-list">Player list</a>
          <a href="/chat">Chat</a>
          <a href="/winner">Winner</a>
         </div> -->
         <div id="outlet" style="height: 100%"></div>
      </main>
    `;
    }
};
App.styles = css `
  .main {
    height: 100%;
  }
    
  #outlet {
      height: 100%;
  }
  
 `;
__decorate([
    property({ type: String })
], App.prototype, "header", void 0);
App = __decorate([
    customElement('game-app')
], App);
export { App };
//# sourceMappingURL=app.js.map