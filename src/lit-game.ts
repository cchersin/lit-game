import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './player-card.js';
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
  @property({ type: String }) displayName = '';
  @property({ type: Array }) users: Array<{ name: string, lastOnlineRef: Timestamp, lastOnlineFormatted: string }> = [];
  
 
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
          lastOnlineRef: new Date(),
        };

        await setDoc(userDoc, data);

        this.loadUsers();

      } else {
        console.warn("No user is currently signed in.");
      }

      this.requestUpdate(); 
    } catch (error: any) {
      console.error("Anonymous auth failed:", error);
      // Handle errors more gracefully!
    }
  }
 
  async loadUsers() {
    const q = query(collection(db, "users"), orderBy("lastOnlineRef"));
    onSnapshot(q, (querySnapshot) => {
      this.users = querySnapshot.docs.map(doc => {
        const data = doc.data() as { 
          name: string, 
          lastOnlineRef: Timestamp 
        };

        const lastOnlineFormatted = formatDistanceToNow(data.lastOnlineRef.toDate(), { addSuffix: true, locale: it })


        return {
          ...data,
          lastOnlineFormatted: lastOnlineFormatted
        };
      });


      this.requestUpdate();
    });
  }

  handleCardClick(event: any) {
    this.currentCardName = event.detail.name;
  }

  handleInputDisplayName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.displayName = input.value;
  }

  handlePlayerDelete(event: any) {
     const playerDoc = doc(db, "users", event.detail.name);  
     deleteDoc(playerDoc);
  }

  render() {
    return html`
      <main class="main" @game-card-click=${this.handleCardClick}>
         <h1>${this.header}</h1>
         <div class="input-container">
          <input type="text" .value="${this.displayName}" @input="${this.handleInputDisplayName}" placeholder="Login as..." />
          <button @click="${this.signInAnonymously}">Login</button>
         </div>
         <div class="users">
          Players:
          ${this.users.map(user => html`
            <player-card name="${user.name}" lastOnline= "${user.lastOnlineFormatted}" @player-delete="${this.handlePlayerDelete}"/>
           `)}
         </div>
         <game-card name="Zelda" description="Un grande classico"></game-card>
         <game-card name="Pippo" description="L'amico di topolino"></game-card>
         <div class="card">Hai scelto la card ${this.currentCardName}</div>
         ${this.user ? html`<game-chat user="${this.displayName}"></game-chat>` : html``}
   
      </main>
    `;
  }
}
