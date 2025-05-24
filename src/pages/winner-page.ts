import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import { Game } from '../domain/game';
import { StoreService } from '../store-service';

@customElement('winner-page')
export class WinnerPage extends LitElement {
  currentGame = new Game('');
  
  static styles = css`
  main {
    background-color: red;
    height: 100%;
  }
  `;

  constructor() {
    super();
    this.loadGame();
  }

  handleOK(event: any) {
    localStorage.currentGame = '';
    Router.go('/games');
  }

  loadGame() {
    StoreService.onGameUpdate((game) => {
        this.currentGame = game;

        if (this.currentGame.status === 'pending') {
          Router.go('/starting');
        } 

        this.requestUpdate();
    });
  }

  renderLeaderboard() {
    const leaderboard = this.currentGame.getLeaderboard();
    return html`
      <div class="leaderboard">
        <h3>Classifica</h3>
        <ul>
          ${leaderboard.map(entry => html`
            <li>${entry.playerName}: ${entry.wins} vittorie</li>
          `)}
        </ul>
      </div>
    `;
  }

 
  render() {
    return html`
      <main class="game">
        <span>User: ${localStorage.userName}${this.currentGame.status}</span>
         <button @click="${this.handleOK}">OK</button>
         ${this.renderLeaderboard()}
      </main>
    `;
  }
}
