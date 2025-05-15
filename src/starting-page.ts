import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import { Game } from './game.js';
import { StoreService } from './store-service.js';

@customElement('starting-page')
export class StartingPage extends LitElement {
  currentGame = new Game('');
  
  static styles = css`
  `;

  constructor() {
    super();
    this.loadGame();
  }

  handleNewGame(event: any) {
    const gameName = new Date().toString();
 
    const game = new Game(gameName);

    game.init(localStorage.userName);
  
    StoreService.saveGame(game);
  }

  handleJoin(event: any) {
    this.currentGame.join(localStorage.userName);
    StoreService.saveGame(this.currentGame); 
  }

  handleStartGame(event: any) {
    this.currentGame.start();
    StoreService.saveGame(this.currentGame);
  }

  handleStopGame(event: any) {
    this.currentGame.stop();
    StoreService.saveGame(this.currentGame);
    this.requestUpdate();
  }

  loadGame() {
    StoreService.onGameUpdate((game) => {
        this.currentGame = game;

        if(this.currentGame.status === 'started' && this.hasRole()) {
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
    return html`
      <main class="game">
        <span>User: ${localStorage.userName}(${this.getRole()}) - ${this.currentGame.status}</span>
         <p>${this.findMasterName() !== '' ? this.findMasterName() + ' has started the game' : ''}</p>
         ${this.findPlayers().map(player => html`
            <p>
              ${player.name} has joined the game
            </p>
          `)}
         ${this.currentGame.status === 'completed' ? html`<button @click="${this.handleNewGame}">New game</button>` : html``}
         ${this.isMaster() && this.currentGame.status === 'pending' ? html`<button @click="${this.handleStartGame}">Start game</button>` : html``}
         ${this.currentGame.status === 'started' ? html`<button @click="${this.handleStopGame}">Stop game</button>` : html``}
         ${!this.hasRole() && this.currentGame.status === 'pending' ? html`<button @click="${this.handleJoin}">Join</button>` : html``}
      </main>
    `;
  }
}
