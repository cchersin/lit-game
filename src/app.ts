import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './index.js';



@customElement('game-app')
export class App extends LitElement {
  @property({ type: String }) header = 'My game';
 
  static styles = css`
  .main {
    padding: 10px;
    background-color: red;
    height: 100%;
  }
  .slot {
      height: 100%;
  }
  
 `;

  constructor() {
    super();
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.getElementById('outlet');
    if (outlet) {
        const router = new Router(outlet);
        router.setRoutes(routes);
        Router.go('/login')
    }
  }

  render() {
    return html`
      <main class="main">
         <div class="topnav">
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/game">Game</a>
          <a href="/player-list">Player list</a>
          <a href="/chat">Chat</a>
          <a href="/winner">Winner</a>
         </div>
         <div id="outlet" style="height: 100%"></div>
      </main>
    `;
  }
}
