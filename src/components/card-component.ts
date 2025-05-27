import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('card-component')
export class CardComponent extends LitElement {
  @property({ type: String }) id = '';
  @property({ type: String }) description = '';
  @property({ type: String }) value = '';
  @property({ type: String }) color = '';
  @property({ type: String }) backgroundColor = '';
  @property({ type: String }) left = '';
  @property({ type: String }) zindex = '';
  @property({ type: String }) isselected = "false";


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
    background-color: red;
    color: black;
    font-size: 25px;
    font-style: normal;
    line-height: 32px;
    rotate: -5deg;
    margin: auto;
    margin-top: 20px;
    font-family: "tablet-gothic", sans-serif;
    font-weight: 300;
  }

  .white {
    background-color: white;
    color: black;
    font-size: 30px;
    rotate: 10deg;
    border: 1px black solid;
    display: inline-block;
    position: absolute;
    margin-top: -200px;
    font-family: "eskapade-fraktur", serif;
    font-weight: 400;
  }

  .card p {
    margin: 0px;
  }

  .black .point {
    display: none;
  }
`;

  handleClick() {
    this.dispatchEvent(new CustomEvent('card-click', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  getDescription() {
    const a = this.description.split('______ ');

    if (this.value !== '') {
      return html`
        <span>${a[0]}</span>
        <span style="font-family: 'eskapade-fraktur', serif; font-weight: 400; font-size: 29px;">${this.value}</span>
        <span style="margin-left: -6px">${a[1]}</span>
      `;
    }

    return this.description;
  }

  render() {
    return html`
    <div class="card ${this.backgroundColor}" @click=${this.handleClick} style="left: ${this.left}; z-index: ${this.isselected === "true" ? 1000 : this.zindex};">
      <p>${this.getDescription()}<span class="point">.</span></p>
    </div>
  `;
  }
}
