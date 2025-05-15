import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

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

  render() {
    return html`
      <main class="main">
         <div class="topnav">
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/game">Game</a>
          <a href="/player-list">Player list</a>
          <a href="/chat">Chat</a>
         </div>
         <slot class="slot"></slot>
      </main>
    `;
  }
}
