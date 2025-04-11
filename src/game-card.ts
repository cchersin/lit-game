import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('game-card')
export class GameCard extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) description = '';
  @property({ type: String }) color = '';
  @property({ type: String }) backgroundColor = '';
  


  static styles = css`
  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }
`;

  handleClick() {
    this.dispatchEvent(new CustomEvent('game-card-click', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
    <div class="card" @click=${this.handleClick} style="background-color: ${this.backgroundColor}; color: ${this.color}">
      <p>${this.description}</p>
    </div>
  `;
  }
}
