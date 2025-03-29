import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import './game-card.js';

@customElement('game-main')
export class Game extends LitElement {
  @property({ type: String }) currentCardName = '';
 
  static styles = css`
  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }
  `;

  constructor() {
    super();
  }

  handleCardClick(event: any) {
    this.currentCardName = event.detail.name;
  }
  
  render() {
    return html`
      <main class="game" @game-card-click=${this.handleCardClick}>
         <game-card name="Zelda" description="Un grande classico"></game-card>
         <game-card name="Pippo" description="L'amico di topolino"></game-card>
         <div class="card">Hai scelto la card ${this.currentCardName}</div>  
      </main>
    `;
  }
}
