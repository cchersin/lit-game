import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('game-card')
export class GameCard extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) description = '';
  @property({ type: String }) color = '';
  @property({ type: String }) backgroundColor = '';
  @property({ type: String }) left = '';
  @property({ type: String }) zindex = '';
  


  static styles = css`
  .card {
    height: 400px;
    width: 250px;
    padding-top: 20px;
    padding-left: 22px;
    padding-right: 22px;
    border-radius: 10px;
  }

  .card:first-letter {
    text-transform: uppercase;
  }

  .black {
    font-size: 37px;
    font-family: "gandur-new", sans-serif;
    font-weight: 300;
    font-style: normal;
    line-height: 42px;
    rotate: -5deg;
    margin: auto;
    margin-top: 20px;
  }

  .white {
    font-size: 25px;
    rotate: 10deg;
    border: 1px black solid;
    display: inline-block;
    position: absolute;
    margin-top: -200px;
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
    <div class="card ${this.backgroundColor}" @click=${this.handleClick} style="background-color: ${this.backgroundColor}; color: ${this.color}; left: ${this.left}; z-index: ${this.zindex};">
      <p>${this.description}<span class="point">.</span></p>
    </div>
  `;
  }
}
