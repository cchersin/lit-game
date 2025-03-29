import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { auth, db } from './firebase.js';
import { getAuth, onAuthStateChanged, signInAnonymously, User, updateProfile } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';


@customElement('user-login')
export class Login extends LitElement {
  @property({ type: String }) displayName = localStorage.userName ? localStorage.userName : ''; 
 
  static styles = css`
 
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

        Router.go('/game');
      } else {
        console.warn("No user is currently signed in.");
      }

      this.requestUpdate(); 
    } catch (error: any) {
      console.error("Anonymous auth failed:", error);
      // Handle errors more gracefully!
    }
  }
 
  handleInputDisplayName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.displayName = input.value;
  }

  render() {
    return html`
      <div class="login">
         <div class="input-container">
          <input type="text" .value="${this.displayName}" @input="${this.handleInputDisplayName}" placeholder="Login as..." />
          <button @click="${this.signInAnonymously}">Login</button>
         </div>
      </div>
    `;
  }
}
