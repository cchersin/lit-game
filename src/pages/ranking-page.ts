import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';
import { db } from '../firebase';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';
import { StoreService } from '../store-service';
import { Favorite } from '../domain/favorite';
import { Utils } from '../utils';
import { Game } from '../domain/game';


@customElement('ranking-page')
export class RankingPage extends LitElement {
  static styles = [
    css`
    main {
    background-color: red;
    height: 100%;
  }
  `];
  games: Array<Game> = [];

  constructor() {
    super();
    this.loadGames()
  }

  async loadGames() {
      const q = query(collection(db, "games"));
          onSnapshot(q, (querySnapshot) => {
            this.games = querySnapshot.docs.map(doc => {
              return Game.fromJSON(doc.data());
            });
      
            this.requestUpdate();
          });
    }
  
  renderRanking() {
      return html`<div class="cards-container">
        ${Utils.getRanking(this.games).map((r: any, idx:number) =>   
          html`<p>${idx + 1} ${r.playerName} - ${r.wins} vittorie</p>`
        )}</div>`;
  }

  handleOK(event: any) {
    Router.go('/games');
  }

  render() {
    return html`
      <main>
        ${this.renderRanking()}
        <button @click="${this.handleOK}">OK</button>
      </main>
    `;
  }
}