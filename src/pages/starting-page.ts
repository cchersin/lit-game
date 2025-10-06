import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import { Game } from '../domain/game';
import { StoreService } from '../store-service';
import { sharedStyles } from '../shared-styles';

@customElement('starting-page')
export class StartingPage extends LitElement {
  currentGame = new Game('');
  
  static styles = [
    sharedStyles, css`
    main {
    background-color: red;
    height: 100%;
  }

  .information {
    font-family: "tablet-gothic", sans-serif;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    font-size: 18px;
    line-height: 1.2;
  }

  .action-button {
    font-size: 14pt;
    color: red;
    font-family: "tablet-gothic", sans-serif;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-left: 50px;
    padding-right: 50px;
    border-radius: 18px;
    background-color: black;
    margin-top: 15px;
    border: none;
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

  .information:first-letter {
      text-transform: capitalize;
  }

  `];

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

        if (this.currentGame.status === 'started' && this.hasRole()) {
          Router.go('/game');
        } 

        if (this.currentGame.status === 'completed') {
          if (localStorage.currentGame != '') {
            Router.go('/winner');
          } else {
            Router.go('/games');
          }
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
         ${this.findMasterName()==localStorage.userName ? html`<p class="information">${this.findMasterName() !== '' ? 'You have created a new game.' : ''}</p>` : html`<p class="information">${this.findMasterName() !== '' ? this.findMasterName() + ' has created a new game.' : ''}</p>`}
         ${this.findPlayers().map(player => html`
            ${player.name==localStorage.userName ? html`<p class="information"> You have joined the game.</p>` 
            : html`<p class="information">${player.name} has joined the game.</p>`}
          `)}
          ${this.isPlayer() ? html`<p class="information">${this.currentGame.isMinNumPlayersReached() ? 'Minimum number of players reached. Waiting for the master to start...' : 'Waiting for more players to join...'}</p>` : html``}
          ${this.isMaster() ? html`<p class="information">${this.currentGame.isMinNumPlayersReached() ? 'Minimum number of players reached. You can start the game!' : 'Waiting for more players to join...'}</p>` : html``}
          </div>
        <div class="container-button">
         ${this.isMaster() && this.currentGame.status === 'pending' && this.currentGame.isMinNumPlayersReached() ? html`<button class="action-button" @click="${this.handleStartGame}">start game</button>` : html``}
         ${this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleStopGame}">stop game</button>` : html``}       
         ${!this.hasRole() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleJoin}">join</button>` : html``}
         ${!this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleLeave}">leave</button>` : html``}
         </div>
      </main>
    `;
  }
}
