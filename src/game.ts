import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { auth, db } from './firebase.js';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, getDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import './game-card.js';

@customElement('game-main')
export class Game extends LitElement {
  @property({ type: String }) currentCardName = '';
  @property({ type: Object }) currentGame: { name: String, status: String, players: Array<{ name: string, role: string }> } = { name: '', status: 'completed', players: [] };
  
  static styles = css`
  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
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

    const currentGameDoc = doc(db, "global", "currentGame");
    setDoc(currentGameDoc, {
      name: gameName,
      status: 'pending',
      players: [{ name: localStorage.userName, role: "master"}]
    });

    localStorage.currentGameName = gameName;
    localStorage.role = 'master'
  }

  handleJoin(event: any) {
    const p = this.currentGame.players.find((player) => player.name === localStorage.userName);

    if (!p) {
      this.currentGame.players.push({ name: localStorage.userName, role: 'player'});
      localStorage.role = 'player'
      const currentGameDoc = doc(db, "global", "currentGame");
      setDoc(currentGameDoc, this.currentGame);
    }
  }

  handleStartGame(event: any) {
    console.log('handleStartGame');
    this.currentGame.status = 'started'
    const currentGameDoc = doc(db, "global", "currentGame");
    setDoc(currentGameDoc, this.currentGame);
  }

  handleStopGame(event: any) {
     console.log('handleStopGame');
    this.currentGame.status = 'completed'
    const currentGameDoc = doc(db, "global", "currentGame");
    setDoc(currentGameDoc, this.currentGame);
    localStorage.currentGameName = '';
    localStorage.role = ''
  }

  loadGame() {
    const docRef = doc(db, "global", "currentGame");
    onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        this.currentGame = docSnapshot.data() as { 
          name: string,
          status: string,
          players: Array<{ name: string, role: string }>
        };
   
        this.requestUpdate();
      }
    });
  }
  
  render() {
    return html`
      <main class="game" @game-card-click=${this.handleCardClick}>
        <span>${this.currentGame.name}</span>
         ${this.currentGame.players.map(player => html`
            <div>
              ${player.name} ${player.role}
            </div>
          `)}
         <game-card name="Zelda" description="Un grande classico"></game-card>
         <game-card name="Pippo" description="L'amico di topolino"></game-card>
         <div class="card">Hai scelto la card ${this.currentCardName}</div>  
         ${this.currentGame.status === 'completed' ? html`<button @click="${this.handleNewGame}">New game</button>` : html``}
         ${this.currentGame.status === 'pending' ? html`<button @click="${this.handleStartGame}">Start game</button>` : html``}
         ${this.currentGame.status === 'started' ? html`<button @click="${this.handleStopGame}">Stop game</button>` : html``}
         ${localStorage.role !== 'master' && this.currentGame.status === 'pending' ? html`<button @click="${this.handleJoin}">Join</button>` : html``}
      </main>
    `;
  }
}
