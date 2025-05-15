import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import './game-card.js';
import { Card } from './card.js'
import { Player } from './player.js';
import { Game } from './game.js';
import { StoreService } from './store-service.js';

@customElement('game-main')
export class GameMain extends LitElement {
  currentCardId = '';
  currentGame = new Game('');
  
  static styles = css`
  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .player-widget {
    background-color: white;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 20px;
    margin: 20px;
  }

  .master-widget {
    background-color: black;
    color: white;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 20px;
    margin: 20px;
  }

  .container-cards {
   position: relative;
  }

  .container-widget {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    height: 100%;
    margin: auto;
  `;

  constructor() {
    super();
    this.loadGame();
  }

  handleCardClick(event: any) {
    this.currentCardId = event.detail.id;
    this.requestUpdate();
  }

  findCardContent(cardId: String) {
    const card = this.getHand().find((c: any) => c.id === cardId);

    if (card) {
      return card.content;
    }

    return '';
  }

  handleStopGame(event: any) {
    console.log('handleStopGame');
    this.currentGame.stop();
    StoreService.saveGame(this.currentGame);
    this.requestUpdate();
  }

  loadGame() {
    StoreService.onGameUpdate((game) => {
        this.currentGame = game;

        if (this.currentGame.status !== 'started' || !this.hasRole()) {
          Router.go('/starting');
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

  hasHand() {
    const player = this.currentGame.getPlayer(localStorage.userName);
    return player ? player.hand.length > 0 : false;
  }

  getRole() {
    return this.currentGame.getRole(localStorage.userName);
  }

  renderBlackCard() {
    if (!this.hasRole()) {
      return html``; 
    }

    let left = 0;
    let zindex = 11;
   
    return html`<game-card description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(this.currentCardId)}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></game-card>`;
  }

  getHand() {
    return this.currentGame.getHand(localStorage.userName);
  }

  getRounds() {
    return this.currentGame.rounds;
  }

  handleConfirmCard() {
    this.currentGame.confirmCard(localStorage.userName, this.currentCardId);
    StoreService.saveGame(this.currentGame);
  }

  renderWhiteCards() {
    let left = 0;
    let zindex = 11;
   
    return html`<div class="container-cards">
         ${this.getHand().map((card: any) => 
              new Card(card.id, card.content, card.color)).map((card: any) => { 
                left += 20;
                zindex -= 1;
                return html`
            <game-card id="${card.id}" description="${card.content}" backgroundColor="${card.color}" color="${card.getOppositeColor()}" left="${left}px" zindex="${zindex}" isselected="${card.id === this.currentCardId}"></game-card>
          `})}
        </div>`;
  }

  renderRounds() {
    return html`<div>
         ${this.getRounds().map((round: any) => {
          return html`<div>
            winner:${round.winnerName} ${round.sentence} 
          </div>`})}
        </div>`;
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
      <main class="game" @game-card-click=${this.handleCardClick}>
        <span>User: ${localStorage.userName}(${this.getRole()}) - ${this.currentGame.status}</span>
        <div class="container-widget">
          <span class="master-widget">${this.findMasterName()}</span>
          ${this.findPlayers().map(player => html`
            <span class="player-widget">
              ${player.name} ${player.currentCardId !== '' ? html`has choosen` : html``}
            </span>
          `)}
        </div>
         ${this.renderBlackCard()} 
         ${this.renderWhiteCards()}
         ${this.hasHand() && this.currentCardId !== '' ? html`<button @click="${this.handleConfirmCard}">Confirm</button>` : html``}
         ${this.currentGame.status === 'started' ? html`<button @click="${this.handleStopGame}">Stop game</button>` : html``}
         ${this.renderRounds()} 
         ${this.renderLeaderboard()}
      </main>
    `;
  }
}
