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

  .input-label {
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    padding-top: 100px;
  }
 
  .input-container {
    margin-top: 10px;
    width: 100%;
  }

  .input-container2 {
    margin: auto;
    width: 80%;
  }

  .input-container input {
    border-radius: 12px;
    border: 2px solid black;
    height: 60px;
    width: 100%;
    text-align: center;
    font-size: 50px;
    padding-bottom: 10px;
    margin: auto;
    font-family: "gandur-new", sans-serif;
    font-weight: 600;
    font-style: normal;
    background-color: red;
    text-transform: capitalize;

  }

  .input-container input::placeholder {
    color: darkred;
    font-weight: 600;
    text-transform: none;
  }

  .input-container input:focus {
    outline: none;
  }

  .input-container button {
    padding: 5px 10px;
    border: 2px solid black;
    border-radius: 12px;
    background-color: red;
    margin: auto;
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
        localStorage.hand = JSON.stringify([]);

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
        <p class="input-label">E tu chi saresti???</p>
         <div class="input-container">
          <div class="input-container2">
            <input type="text" .value="${this.displayName}" @input="${this.handleInputDisplayName}" maxlength="15" placeholder="Io sono..."/>
          </div>
          <button @click="${this.signInAnonymously}">Login</button>
         </div>
      </div>
    `;
  }
}
