import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { auth, db } from '../firebase';
import { signInAnonymously, User, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

import { Router } from '@vaadin/router';


@customElement('login-page')
export class LoginPage extends LitElement {
  @property({ type: String }) displayName = localStorage.userName ? localStorage.userName : ''; 
 
  static styles = css`
  .login {
    overflow: hidden;
    background-color: red;
    height: 100%;
  }

  .input-label {
    font-family: "tablet-gothic", sans-serif;
    text-align: center;
    font-weight: bold;
    font-size: 18pt;
    padding-top: 233px;
  }
 
  .input-container {
    margin-top: 10px;
    width: 100%;
  }

  .input-container2 {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 79%;
  }

  .button-container {
    display: flex;
    justify-content: center; 
    margin: auto;
    width: 20%;
  }

  .input-container input {
    border-radius: 12px;
    border: 2px solid black;
    height: 55px;
    width: 233px;
    text-align: center;
    font-size: 50px;
    padding-bottom: 10px;
    font-family: "eskapade-fraktur", serif;
    font-weight: 400;
    font-style: normal;
    background-color: red;
    text-transform: capitalize;
  }

  .input-container input::placeholder {
    color: #8a1a0c;
    font-size: 18pt;
    font-family: "tablet-gothic", sans-serif;
    font-weight: 300;
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
    margin-top: 21px;
  }
  `;

  private user: User | null = null;
  
  constructor() {
    super();
    if (this.displayName) {
      this.signInAnonymously();
    }
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
     
        if (localStorage.currentGame && localStorage.currentGame !== '') {
          Router.go('/starting');
        } else {
          Router.go('/games');
        }
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
        <p class="input-label">E TU CHI CAZZO SEI?!</p>
         <div class="input-container">
          <div class="input-container2">
            <input type="text" .value="${this.displayName}" @input="${this.handleInputDisplayName}" maxlength="6" placeholder="scrivi il tuo stupido nome"/>
          </div>
          <div class="button-container">
            <button @click="${this.signInAnonymously}">Login</button>
          </div>
         </div>
      </div>
    `;
  }
}
