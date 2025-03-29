import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('player-card')
export class PlayerCard extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) lastOnline = '';

  static styles = css`
  .player {
    border: 1px solid red;
  }
  `;

  handleDelete() {
    this.dispatchEvent(new CustomEvent('player-delete', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
    <p class="player">
      <span>${this.name}</span>
      <span>${this.lastOnline}</span>
      <button @click="${this.handleDelete}">Delete</button>
    </p>
  `;
  }
}
