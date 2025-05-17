import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { db } from './firebase.js';
import { collection, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import './player-card.js';
let PlayerList = class PlayerList extends LitElement {
    constructor() {
        super();
        this.users = [];
        this.loadUsers();
    }
    async loadUsers() {
        const q = query(collection(db, "users"), orderBy("lastOnlineRef"));
        onSnapshot(q, (querySnapshot) => {
            this.users = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const lastOnlineFormatted = formatDistanceToNow(data.lastOnlineRef.toDate(), { addSuffix: true, locale: it });
                return {
                    ...data,
                    lastOnlineFormatted: lastOnlineFormatted
                };
            });
            this.requestUpdate();
        });
    }
    handlePlayerDelete(event) {
        const playerDoc = doc(db, "users", event.detail.name);
        deleteDoc(playerDoc);
    }
    render() {
        return html `
       <div class="users">
        Players:
        ${this.users.map(user => html `
          <player-card name="${user.name}" lastOnline= "${user.lastOnlineFormatted}" @player-delete="${this.handlePlayerDelete}"/>
         `)}
       </div>   
  `;
    }
};
PlayerList.styles = css `
  .users {
    border: 1px solid blue;
  }
  `;
__decorate([
    property({ type: Array })
], PlayerList.prototype, "users", void 0);
PlayerList = __decorate([
    customElement('player-list')
], PlayerList);
export { PlayerList };
//# sourceMappingURL=player-list.js.map