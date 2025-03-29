import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('game-app')
export class GameApp extends LitElement {
  @property({ type: String }) header = 'My game';
 
  static styles = css`
  .main {
    padding: 10px;
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
          <a href="/player-list">Player list</a>
          <a href="/chat">Chat</a>
         </div>
         <h1>${this.header}</h1>
         <slot></slot>
      </main>
    `;
  }
}
