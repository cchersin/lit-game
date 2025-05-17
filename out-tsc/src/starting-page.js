import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { Game } from './game.js';
import { StoreService } from './store-service.js';
let StartingPage = class StartingPage extends LitElement {
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
    handleJoin(event) {
        this.currentGame.join(localStorage.userName);
        StoreService.saveGame(this.currentGame);
    }
    handleStartGame(event) {
        this.currentGame.start();
        StoreService.saveGame(this.currentGame);
    }
    loadGame() {
        StoreService.onGameUpdate((game) => {
            this.currentGame = game;
            if (this.currentGame.status === 'started' && this.hasRole()) {
                Router.go('/game');
            }
            this.requestUpdate();
        });
    }
    findMasterName() {
        return this.currentGame.findMasterName();
    }
    findPlayers() {
        return this.currentGame.findPlayers();
    }
    isMaster() {
        return this.currentGame.isMaster(localStorage.userName);
    }
    isPlayer() {
        return this.currentGame.isPlayer(localStorage.userName);
    }
    hasRole() {
        return this.currentGame.getPlayer(localStorage.userName);
    }
    getRole() {
        return this.currentGame.getRole(localStorage.userName);
    }
    render() {
        return html `
      <main class="game">
        <span>User: ${localStorage.userName}(${this.getRole()}) - ${this.currentGame.status}</span>
        <div class="information-container">
         <p class="information">${this.findMasterName() !== '' ? this.findMasterName() + ' has started the game' : ''}</p>
         ${this.findPlayers().map(player => html `
            <p class="information">
              ${player.name} has joined the game
            </p>
          `)}
        </div>
        <div class="container-button">
         ${this.currentGame.status === 'completed' ? html `<button class="action-button" @click="${this.handleNewGame}">New game</button>` : html ``}
         ${this.isMaster() && this.currentGame.status === 'pending' ? html `<button class="action-button" @click="${this.handleStartGame}">Start game</button>` : html ``}
         ${!this.hasRole() && this.currentGame.status === 'pending' ? html `<button class="action-button" @click="${this.handleJoin}">Join</button>` : html ``}
         </div>
      </main>
    `;
    }
};
StartingPage.styles = css `
  main {
    background-color: red;
    height: 100%;
  }

  .information {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
  }

  .action-button {
    background-color: red;
    font-size: 18px;
    border-radius: 20px;
    z-index: 1000;
    position: relative;
    border: none;
    padding: 10px;
    padding-left: 18px;
    padding-right: 18px;
    font-weight: bold;
    margin: auto;
    border: 2px solid black;
  }

  .container-button {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    margin: auto;
  }

  .information-container {
    margin-top: 80px;
    margin-bottom: 20px;
  }

  `;
StartingPage = __decorate([
    customElement('starting-page')
], StartingPage);
export { StartingPage };
//# sourceMappingURL=starting-page.js.map