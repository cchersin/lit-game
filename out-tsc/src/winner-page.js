import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { Game } from './game.js';
import { StoreService } from './store-service.js';
let WinnerPage = class WinnerPage extends LitElement {
    constructor() {
        super();
        this.currentGame = new Game('');
        this.loadGame();
    }
    handleNewGame(event) {
        const gameName = new Date().toString();
        const game = new Game(gameName);
        game.init(localStorage.userName);
        StoreService.saveGame(game);
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
        return html `
      <div class="leaderboard">
        <h3>Classifica</h3>
        <ul>
          ${leaderboard.map(entry => html `
            <li>${entry.playerName}: ${entry.wins} vittorie</li>
          `)}
        </ul>
      </div>
    `;
    }
    render() {
        return html `
      <main class="game">
        <span>User: ${localStorage.userName}${this.currentGame.status}</span>
         <button @click="${this.handleNewGame}">New game</button>
         ${this.renderLeaderboard()}
      </main>
    `;
    }
};
WinnerPage.styles = css `
  main {
    background-color: red;
    height: 100%;
  }
  `;
WinnerPage = __decorate([
    customElement('winner-page')
], WinnerPage);
export { WinnerPage };
//# sourceMappingURL=winner-page.js.map