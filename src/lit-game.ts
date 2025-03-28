import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './game-card.js';
import './game-chat.js';

import { auth, db } from './firebase.js';
import { getAuth, onAuthStateChanged, signInAnonymously, User, updateProfile } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, setDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

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

  /*loadUsers() {
    const q = query(collection(db, "users"), orderBy("lastOnlineRef"));
    onSnapshot(q, (querySnapshot) => {
      this.users = querySnapshot.docs.map(doc => doc.data() as 
        { name: string, 
          lastOnlineRef: string });
      this.requestUpdate();
    });
  }*/

 
  async loadUsers() {
    const q = query(collection(db, "users"), orderBy("lastOnlineRef"));
    onSnapshot(q, (querySnapshot) => {
      this.users = querySnapshot.docs.map(doc => {
        const data = doc.data() as { 
          name: string, 
          lastOnlineRef: Timestamp 
        };

        return {
          ...data,
          lastOnlineFormatted: data.lastOnlineRef.toDate().toLocaleString()
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
            <div>
              <strong>${user.name} (${user.lastOnlineFormatted})</strong>
            </div>
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
