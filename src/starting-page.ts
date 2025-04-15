import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { auth, db } from './firebase.js';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, getDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';

import { Card } from './card.js'
import { Player } from './player.js';
import { Game } from './game.js';

@customElement('starting-page')
export class StartingPage extends LitElement {
  @property({ type: String }) currentCardName = '';
  @property({ type: Game }) currentGame = new Game('');
  @property({ type: Array }) whiteCards: Array<Card> = 
  [
    new Card('1', 'Martina', 'white'), 
    new Card('2', 'Inès', 'white'),
    new Card('3', 'Andrea', 'white'),
    new Card('4', 'Montra', 'white'), 
    new Card('5', 'le critiche di Rossolini', 'white'),
    new Card('6', 'Grado', 'white'),
    new Card('7', 'la sessualità di Martina', 'white'), 
    new Card('8', 'il divorzio dei miei genitori', 'white'),
    new Card('9', 'il comic sans', 'white'),
    new Card('10', 'Helvetica', 'white'), 
    new Card('11', 'i poveri che non hanno soldi', 'white'),
    new Card('12', 'i ladri che rubano', 'white'),    
  ];
  @property({ type: Array }) blackCards: Array<Card> = 
  [
    new Card('1', 'La colazione di Montra oggi consiste in ______ .', 'black'),
    new Card('2', 'Per far andare Cindy più veloce abbiamo deciso di potenziare il suo carretto con ______ .', 'black'),
    new Card('3', 'Bevo per dimenticare ______ .', 'black') 
  ];
  
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

    console.log(gameName);

    const p = new Player(localStorage.userName, 'master');
    const g = new Game(gameName);
    g.players = [p];
    g.whiteDeck = this.whiteCards;
    g.blackDeck = this.blackCards;
    g.status = 'pending';
  
    console.log(g.toJSON());

    const currentGameDoc = doc(db, 'global', 'currentGame');
    setDoc(currentGameDoc, g.toJSON());

     console.log('saved');

    localStorage.currentGameName = gameName;
    localStorage.role = p.role;

    console.log(p.role);
  }

  handleJoin(event: any) {
    let p = this.currentGame.players.find((player) => player.name === localStorage.userName);

    if (!p) {
      p = new Player(localStorage.userName, 'player');
      this.currentGame.players.push(p);

      for(let i = 0; i < 3; i++) {
        const drawnCard = this.currentGame.whiteDeck.shift();
        if (drawnCard) {
          p.hand.push(drawnCard);
        }
      }

      localStorage.hand = JSON.stringify(p.hand);
      localStorage.role = p.role;
      const currentGameDoc = doc(db, 'global', 'currentGame');
      setDoc(currentGameDoc, this.currentGame.toJSON());
    }
  }

  handleStartGame(event: any) {
    console.log('handleStartGame');
    this.currentGame.status = 'started';
    console.log('handleStartGame1');
    const drawnCard = this.currentGame.blackDeck.shift();
    if (drawnCard) {
      this.currentGame.blackCard = drawnCard;
    }
  
    const currentGameDoc = doc(db, 'global', 'currentGame');
    setDoc(currentGameDoc, this.currentGame.toJSON());
  }

  handleStopGame(event: any) {
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

        if(this.currentGame.status === 'started' && localStorage.role != '') {
          Router.go('/game');
        }
        if (this.currentGame.status === 'completed') {
          localStorage.role = '';
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
