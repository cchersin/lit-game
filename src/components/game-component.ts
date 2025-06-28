import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { sharedStyles } from '../shared-styles';

@customElement('game-component')
export class GameComponent extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) status = '';
  @property({ type: String }) master = '';
  @property({ type: String }) winner = '';
  

  static styles = [
    sharedStyles, css`
    .game-information {
    font-family: "tablet-gothic", sans-serif;
    text-align: center;
    font-size: 12pt;
    font-weight: bold;
    line-height: 16pt;
  }
  
  .game-information:first-letter {
      text-transform: capitalize;
  }

  .action-button {
    background-color: red;
    font-size: 18px;
    border-radius: 20px;
    z-index: 1000;
    position: relative;
    border: 2px solid black;
    padding: 10px;
    padding-left: 18px;
    padding-right: 18px;
    font-weight: bold;
    margin: 10px;
    margin-top: 30px;
    font-family: "tablet-gothic", sans-serif;
  }

  .button-container {
    width: 100%;
    display: flex;
    align-content: center;
  }
`];

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
        <div class="game-information"> ${this.name} </div>
        ${this.status === 'pending' ? html` <div class="game-information"> ${this.master} has started a new game </div> <div class="button-container"> <button class="action-button" @click="${this.handleJoin}">Join</button> </div>` : html``}
        ${this.status === 'completed' ? html` Winner: ${this.winner} <div class="button-container"> <button class="action-button" @click="${this.handleDelete}">Delete</button> </div>` : html``}        
      </div>
  `;
  }
}
