import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { db } from './firebase.js';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { format, isToday } from "date-fns";
import { it } from "date-fns/locale";

@customElement('game-chat')
export class Chat extends LitElement {
  
  @property({ type: String }) user = localStorage.userName ? localStorage.userName : ''; 
  @property({ type: Array }) messages: Array<{ user: string, text: string, timestamp: Timestamp, timestampFormatted: string }> = [];
  @property({ type: String }) messageText: string = '';

  static styles = css`
    .chat-container {
      width: 600px;
      height: 400px;
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      padding: 10px;
      overflow-y: scroll;
    }

    .messages {
      flex-grow: 1;
      overflow-y: auto;
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

  constructor() {
    super();
    this.loadMessages();
  }

  
  loadMessages() {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    onSnapshot(q, (querySnapshot) => {
      this.messages = querySnapshot.docs.map(doc => {
        const data = doc.data() as { 
          user: string, 
          text: string, 
          timestamp: Timestamp 
        };

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };

        const timestampFormatted = isToday(data.timestamp.toDate())
        ? format(data.timestamp.toDate(), "HH:mm") // solo l'ora se oggi
        : format(data.timestamp.toDate(), "dd MMMM yyyy, HH:mm", { locale: it }); // data completa se non è oggi

   
        return {
          ...data,
          timestampFormatted: timestampFormatted
        };
      });

      this.requestUpdate();
    });
  }

  async sendMessage() {
    if (this.messageText.trim() === '') return;

    try {
      await addDoc(collection(db, "messages"), {
        user: this.user,
        text: this.messageText,
        timestamp: new Date()
      });
      this.messageText = ''; // Clear the input after sending
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.messageText = input.value;
  }
  render() {
    return html`
      <div class="chat-container">
        <div class="messages">
          ${this.messages.map(message => html`
            <div>
              ${message.timestampFormatted} <strong>${message.user}</strong>: ${message.text}
            </div>
          `)}
        </div>
        <div class="input-container">
          <input type="text" .value="${this.messageText}" @input="${this.handleInput}" placeholder="Type a message..." />
          <button @click="${this.sendMessage}">Send</button>
        </div>
      </div>
    `;
  }

}
