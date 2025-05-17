import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
let PlayerCard = class PlayerCard extends LitElement {
    constructor() {
        super(...arguments);
        this.name = '';
        this.lastOnline = '';
    }
    handleDelete() {
        this.dispatchEvent(new CustomEvent('player-delete', {
            detail: { name: this.name },
            bubbles: true,
            composed: true
        }));
    }
    render() {
        return html `
    <p class="player">
      <span>${this.name}</span>
      <span>${this.lastOnline}</span>
      <button @click="${this.handleDelete}">Delete</button>
    </p>
  `;
    }
};
PlayerCard.styles = css `
  .player {
    border: 1px solid red;
  }
  `;
__decorate([
    property({ type: String })
], PlayerCard.prototype, "name", void 0);
__decorate([
    property({ type: String })
], PlayerCard.prototype, "lastOnline", void 0);
PlayerCard = __decorate([
    customElement('player-card')
], PlayerCard);
export { PlayerCard };
//# sourceMappingURL=player-card.js.map