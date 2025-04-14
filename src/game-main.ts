import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { auth, db } from './firebase.js';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, getDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import './game-card.js';
import { Card } from './card.js'
import { Player } from './player.js';
import { Game } from './game.js';

@customElement('game-main')
export class GameMain extends LitElement {
  @property({ type: String }) currentCardName = '';
  @property({ type: Game }) currentGame = new Game('');
  @property({ type: Array }) whiteCards: Array<Card> = 
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
  ];
  
  static styles = css`
  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .playerWidget {
    background-color: white;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 20px;
  }

  .masterWidget {
    background-color: black;
    color: white;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 20px;
  }
  `;

  constructor() {
    super();
    this.loadGame();
  }

  handleCardClick(event: any) {
    this.currentCardName = event.detail.name;
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

  /*drawCard(deck: Card[]): Card | undefined {
    if (deck.length === 0) {
      console.log(`Il mazzo è vuoto.`);
      return undefined;
    }

    return deck.shift();
  }*/

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
    console.log('handleStartGame2');

    console.log('-----' + this.currentGame.blackCard);

    const currentGameDoc = doc(db, 'global', 'currentGame');
    setDoc(currentGameDoc, this.currentGame.toJSON());
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

  /*findWhiteCards() {
    return this.findCardsByColor('white');
  } 

  findBlackCards() {
    return this.findCardsByColor('black');
  }

  findCardsByColor(color: string) {
    return this.cards.filter(c => c.color === color);
  }*/

  

  render() {
    return html`
      <main class="game" @game-card-click=${this.handleCardClick}>
        <span>User: ${localStorage.userName}(${localStorage.role})</span>
        <div>
          <span class="masterWidget">${this.findMaster()}</span>
          ${this.findPlayers().map(player => html`
            <span class="playerWidget">
              ${player.name}
            </span>
          `)}
        </div>
         <p>${this.findMaster() !== '' ? this.findMaster() + ' has started the game' : ''}</p>
         ${this.findPlayers().map(player => html`
            <p>
              ${player.name} has joined the game
            </p>
          `)}
         <game-card description="${this.currentGame.blackCard?.content}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></game-card>
         ${JSON.parse(localStorage.hand).map((card: any) => new Card(card.content, card.color)).map((card: any) => html`
            <game-card description="${card.content}" backgroundColor="${card.color}" color="${card.getOppositeColor()}"></game-card>
          `)}
         <!--<game-card name="Zelda" description="Un grande classico"></game-card>
         <game-card name="Pippo" description="L'amico di topolino"></game-card>
         <div class="card">Hai scelto la card ${this.currentCardName}</div>-->  
         ${this.currentGame.status === 'completed' ? html`<button @click="${this.handleNewGame}">New game</button>` : html``}
         ${localStorage.role === 'master' && this.currentGame.status === 'pending' ? html`<button @click="${this.handleStartGame}">Start game</button>` : html``}
         ${this.currentGame.status === 'started' ? html`<button @click="${this.handleStopGame}">Stop game</button>` : html``}
         ${localStorage.role === '' && this.currentGame.status === 'pending' ? html`<button @click="${this.handleJoin}">Join</button>` : html``}
      </main>
    `;
  }
}
