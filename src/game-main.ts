import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { auth, db } from './firebase.js';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, getDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';

import './game-card.js';
import { Card } from './card.js'
import { Player } from './player.js';
import { Game } from './game.js';

@customElement('game-main')
export class GameMain extends LitElement {
  @property({ type: String }) currentCardId = "-1";
  @property({ type: Game }) currentGame = new Game('');
/*  @property({ type: Array }) whiteCards: Array<Card> = 
  [
    new Card('Martina', 'white'), 
    new Card('Inès', 'white'),
    new Card('Andrea', 'white'),
    new Card('Montra', 'white'), 
    new Card('le critiche di Rossolini', 'white'),
    new Card('Grado', 'white'),
    new Card('la sessualità di Martina', 'white'), 
    new Card('il divorzio dei miei genitori', 'white'),
    new Card('il comic sans', 'white'),
    new Card('Helvetica', 'white'), 
    new Card('i poveri che non hanno soldi', 'white'),
    new Card('i ladri che rubano', 'white'),    
  ];
  @property({ type: Array }) blackCards: Array<Card> = 
  [
    new Card('La colazione di Montra oggi consiste in ______ .', 'black'),
    new Card('Per far andare Cindy più veloce abbiamo deciso di potenziare il suo carretto con ______ .', 'black'),
    new Card('Bevo per dimenticare ______ .', 'black') 
  ]; */
  
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
    this.currentGame.status = 'completed';
    this.currentGame.players = [];
    const currentGameDoc = doc(db, 'global', 'currentGame');
    setDoc(currentGameDoc, this.currentGame.toJSON());
    localStorage.currentGameName = '';
    localStorage.role = '';
    this.requestUpdate();
  }

  loadGame() {
    const docRef = doc(db, 'global', 'currentGame');
    onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        this.currentGame = Game.fromJSON(docSnapshot.data());

        if (this.currentGame.status === 'completed') {
          localStorage.role = '';
        }
        if (this.currentGame.status !== 'started') {
          Router.go('/starting');
        }
   
        this.requestUpdate();
      }
    });
  }

  findMaster() {
    const master = this.currentGame.players.find(p => p.role === 'master');
    return master ? master.name : '';
  }

  findPlayers() {
    return this.currentGame.players.filter(p => p.role === 'player');
  } 

  renderBlackCard() {
    if (localStorage.role === '') {
      return html``; 
    }
    let left = 0;
    let zindex = 11;
   
    return html`<game-card description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(this.currentCardId)}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></game-card>`;
  }

  getHand() {
    return JSON.parse(localStorage.hand);
  }

  renderWhiteCards() {
    if (localStorage.role !== 'player') {
      return html``; 
    }
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

  render() {
    return html`
      <main class="game" @game-card-click=${this.handleCardClick}>
        <span>User: ${localStorage.userName}(${localStorage.role}) - ${this.currentGame.status}</span>
        <div class="container-widget">
          <span class="master-widget">${this.findMaster()}</span>
          ${this.findPlayers().map(player => html`
            <span class="player-widget">
              ${player.name}
            </span>
          `)}
        </div>
         ${this.renderBlackCard()} 
         ${this.renderWhiteCards()}
         ${this.currentGame.status === 'started' ? html`<button @click="${this.handleStopGame}">Stop game</button>` : html``}
      </main>
    `;
  }
}
