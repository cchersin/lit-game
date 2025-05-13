import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import { Card } from './card.js'
import { Player } from './player.js';
import { Game } from './game.js';
import { StoreService } from './store-service.js';

@customElement('starting-page')
export class StartingPage extends LitElement {
  @property({ type: String }) currentCardName = '';
  @property({ type: Game }) currentGame = new Game('');
  
  static styles = css`
  `;

  constructor() {
    super();
    this.loadGame();
  }

  handleNewGame(event: any) {
    const gameName = new Date().toString();
    /*addDoc(collection(db, "games"), {
      name: gameName
    });*/

    const game = new Game(gameName);

    game.init(localStorage.userName);
  
    StoreService.saveGame(game);

    localStorage.currentGameName = gameName;
    localStorage.role = 'master';
  }

  handleJoin(event: any) {
    var p = this.currentGame.join(localStorage.userName);
    StoreService.saveGame(this.currentGame);
 
    if (p) {
      localStorage.hand = JSON.stringify(p.hand);
      localStorage.role = p.role;
    }
  }

  handleStartGame(event: any) {
    this.currentGame.start();
    StoreService.saveGame(this.currentGame);
  }

  handleStopGame(event: any) {
    this.currentGame.stop();
    StoreService.saveGame(this.currentGame);
    localStorage.currentGameName = '';
    localStorage.role = '';
    this.requestUpdate();
  }

  loadGame() {
    StoreService.onGameUpdate((game) => {
        this.currentGame = game;

        if(this.currentGame.status === 'started' && localStorage.role != '') {
          Router.go('/game');
        }
        if (this.currentGame.status === 'completed') {
          localStorage.role = '';
        }
   
        this.requestUpdate();
    });
  }

  findMaster() {
    const master = this.currentGame.players.find(p => p.role === 'master');
    return master ? master.name : '';
  }

  findPlayers() {
    return this.currentGame.players.filter(p => p.role === 'player');
  } 

  render() {
    return html`
      <main class="game">
        <span>User: ${localStorage.userName}(${localStorage.role}) - ${this.currentGame.status}</span>
         <p>${this.findMaster() !== '' ? this.findMaster() + ' has started the game' : ''}</p>
         ${this.findPlayers().map(player => html`
            <p>
              ${player.name} has joined the game
            </p>
          `)}
         ${this.currentGame.status === 'completed' ? html`<button @click="${this.handleNewGame}">New game</button>` : html``}
         ${localStorage.role === 'master' && this.currentGame.status === 'pending' ? html`<button @click="${this.handleStartGame}">Start game</button>` : html``}
         ${this.currentGame.status === 'started' ? html`<button @click="${this.handleStopGame}">Stop game</button>` : html``}
         ${localStorage.role === '' && this.currentGame.status === 'pending' ? html`<button @click="${this.handleJoin}">Join</button>` : html``}
      </main>
    `;
  }
}
