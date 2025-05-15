import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { db } from './firebase.js';
import { collection, deleteDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

import './player-card.js';

@customElement('player-list')
export class PlayerList extends LitElement {
  @property({ type: Array }) users: Array<{ name: string, lastOnlineRef: Timestamp, lastOnlineFormatted: string }> = [];
 
  static styles = css`
  .users {
    border: 1px solid blue;
  }
  `;

  constructor() {
    super();
    this.loadUsers();
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

  handlePlayerDelete(event: any) {
     const playerDoc = doc(db, "users", event.detail.name);  
     deleteDoc(playerDoc);
  }

  render() {
    return html`
       <div class="users">
        Players:
        ${this.users.map(user => html`
          <player-card name="${user.name}" lastOnline= "${user.lastOnlineFormatted}" @player-delete="${this.handlePlayerDelete}"/>
         `)}
       </div>   
  `;
  }
}
