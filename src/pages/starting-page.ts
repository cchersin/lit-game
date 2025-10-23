import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import { Game } from '../domain/game';
import { StoreService } from '../store-service';
import { sharedStyles } from '../shared-styles';

@customElement('starting-page')
export class StartingPage extends LitElement {
  currentGame = new Game('', '');
  
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
    padding-right: 20px;
    padding-left: 20px;
    margin-left: 10px;
    margin-right: 10px;
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
    padding-top: 100px;
    padding-bottom: 20px;
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
        <div class="information-container">
         ${this.findMasterName()==localStorage.userName ? html`<p class="information">${this.findMasterName() !== '' ? 'Hai creato un nuovo gioco.' : ''}</p>` : html`<p class="information">${this.findMasterName() !== '' ? this.findMasterName() + ' ha creato un nuovo gioco.' : ''}</p>`}
         ${this.findPlayers().map(player => html`
            ${player.name==localStorage.userName ? html`<p class="information"> Stai partecipando al gioco.</p>` 
            : html`<p class="information">${player.name} sta partecipando al gioco.</p>`}
          `)}
          ${this.isPlayer() ? html`<p class="information">${this.currentGame.isMinNumPlayersReached() ? 'Numero minimo di giocatori raggiunti. Aspetta che il master cominci...' : 'Aspetta che partecipino altri giocatori...'}</p>` : html``}
          ${this.isMaster() ? html`<p class="information">${this.currentGame.isMinNumPlayersReached() ? 'Numero minimo di giocatori raggiunti. Puoi iniziare il gioco!' : 'Aspetta che partecipino altri giocatori...'}</p>` : html``}
          </div>
        <div class="container-button">
         ${this.isMaster() && this.currentGame.status === 'pending' && this.currentGame.isMinNumPlayersReached() ? html`<button class="action-button" @click="${this.handleStartGame}">inizia il gioco</button>` : html``}
         ${this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleStopGame}">ferma il gioco</button>` : html``}       
         ${!this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleJoin}">join</button>` : html``}
         ${!this.isMaster() && this.currentGame.status === 'pending' ? html`<button class="action-button" @click="${this.handleLeave}">abbandona</button>` : html``}
         </div>
      </main>
    `;
  }
}
