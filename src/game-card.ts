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
    height: 400px;
    width: 250px;
    padding-top: 20px;
    padding-left: 22px;
    padding-right: 22px;
    border-radius: 10px;
    margin: auto;
  }

  .black {
    font-size: 37px;
    font-family: "gandur-new", sans-serif;
    font-weight: 300;
    font-style: normal;
    line-height: 42px;
    rotate: -7deg;
  }

  .white {
    font-size: 25px;
  }

  .card p {
    margin: 0px;
  }

  .black .point {
    display: none;
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
    <div class="card ${this.backgroundColor}" @click=${this.handleClick} style="background-color: ${this.backgroundColor}; color: ${this.color}">
      <p>${this.description}<span class="point">.</span></p>
    </div>
  `;
  }
}
