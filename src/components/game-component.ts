import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('game-component')
export class GameComponent extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) status = '';
  @property({ type: String }) winner = '';
  

  static styles = css`
`;

  handleJoin() {
    this.dispatchEvent(new CustomEvent('game-join', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }));
  }

  handleDelete() {
    this.dispatchEvent(new CustomEvent('game-delete', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }));
  }
  
  
  render() {
    return html`
     <div>
        ${this.name}
        ${this.status === 'pending' ? html`<button class="action-button" @click="${this.handleJoin}">Join</button>` : html``}
        ${this.status === 'completed' ? html` Winner: ${this.winner} <button class="action-button" @click="${this.handleDelete}">Delete</button>` : html``}        
      </div>
  `;
  }
}
