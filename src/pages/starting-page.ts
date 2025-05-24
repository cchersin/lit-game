import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import { Game } from '../domain/game';
import { StoreService } from '../store-service';

@customElement('starting-page')
export class StartingPage extends LitElement {
  currentGame = new Game('');
  
  static styles = css`
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

  constructor() {
    super();
    this.loadGame();
  }


  handleStopGame(event: any) {
    console.log('handleStopGame');

    this.currentGame.stop();
    StoreService.saveGame(this.currentGame);
    localStorage.currentGame = '';

    Router.go('/games');
  }

  handleLeave(event: any) {
    this.currentGame.leave(localStorage.userName);

    StoreService.saveGame(this.currentGame); 
    localStorage.currentGame = ''

    Router.go('/games');  
  }

  handleJoin(event: any) {
    this.currentGame.join(localStorage.userName);
    StoreService.saveGame(this.currentGame); 
    localStorage.currentGame = this.currentGame.name;
  }

  handleStartGame(event: any) {
    this.currentGame.start();
    StoreService.saveGame(this.currentGame);
  }


  loadGame() {
    StoreService.onGameUpdate(localStorage.currentGame, (game) => {
      if(!game) {
        Router.go('/games');
      } else {
        this.currentGame = game;

        if(this.currentGame.status === 'started' && this.hasRole()) {
          Router.go('/game');
        } 
        this.requestUpdate();
      }
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
        <div class="information-container">
         <p class="information">${this.findMasterName() !== '' ? this.findMasterName() + ' has created a new game' : ''}</p>
         ${this.findPlayers().map(player => html`
            <p class="information">
              ${player.name} has joined the game
            </p>
          `)}
        </div>
        <div class="container-button">
         ${this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleStartGame}">Start game</button>` : html``}
         ${this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleStopGame}">Stop game</button>` : html``}       
         ${!this.hasRole() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleJoin}">Join</button>` : html``}
         ${!this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleLeave}">Leave</button>` : html``}
     
         </div>
      </main>
    `;
  }
}
