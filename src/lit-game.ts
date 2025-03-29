import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './player-list.js';
import './game-card.js';
import './game-chat.js';

import { auth, db } from './firebase.js';
import { getAuth, onAuthStateChanged, signInAnonymously, User, updateProfile } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { format, formatDistanceToNow, isToday } from "date-fns";
import { it } from "date-fns/locale";


@customElement('lit-game')
export class LitGame extends LitElement {
  @property({ type: String }) header = 'My game';
  @property({ type: String }) currentCardName = '';
  @property({ type: String }) displayName = localStorage.userName ? localStorage.userName : ''; 
 
  static styles = css`
  .main {
    padding: 10px;
  }

  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .input-container {
    display: flex;
    margin-top: 10px;
  }

  .input-container input {
    flex-grow: 1;
    padding: 5px;
  }

  .input-container button {
    padding: 5px 10px;
  }
  `;

  private user: User | null = null;
  
  constructor() {
    super();
  }

  async signInAnonymously(): Promise<void> {
  
    try {
      const userCredential = await signInAnonymously(auth);
      this.user = userCredential.user;
      console.log("Signed in anonymously:", this.user.uid);
      if (this.user) {
        await updateProfile(this.user, {
          displayName: this.displayName
        });
       
        const userDoc = doc(db, "users", this.displayName);
        const data = {
          name: this.displayName,
          sessionId: this.user.uid,
          lastOnlineRef: new Date(),
        };

        await setDoc(userDoc, data);

        localStorage.userName  = data.name;
        localStorage.sessionId = data.sessionId;
      } else {
        console.warn("No user is currently signed in.");
      }

      this.requestUpdate(); 
    } catch (error: any) {
      console.error("Anonymous auth failed:", error);
      // Handle errors more gracefully!
    }
  }
 
  handleCardClick(event: any) {
    this.currentCardName = event.detail.name;
  }

  handleInputDisplayName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.displayName = input.value;
  }

  render() {
    return html`
      <main class="main" @game-card-click=${this.handleCardClick}>
         <div class="topnav">
          <a href="/">Home</a>
          <a href="/player-list">Player list</a>
          <a href="/game-chat/${this.displayName}">Chat</a>
         </div>
         <h1>${this.header}</h1>
         <div class="input-container">
          <input type="text" .value="${this.displayName}" @input="${this.handleInputDisplayName}" placeholder="Login as..." />
          <button @click="${this.signInAnonymously}">Login</button>
         </div>
         <slot></slot>
         <game-card name="Zelda" description="Un grande classico"></game-card>
         <game-card name="Pippo" description="L'amico di topolino"></game-card>
         <div class="card">Hai scelto la card ${this.currentCardName}</div>  
      </main>
    `;
  }
}
