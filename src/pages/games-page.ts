import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Game } from '../domain/game';
import '../components/game-component';
import { StoreService } from '../store-service';
import { db } from '../firebase';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';

import { format, isToday } from "date-fns";
import { it } from "date-fns/locale";



@customElement('games-page')
export class GamesPage extends LitElement {

  static styles = css`
  main {
    background-color: red;
    height: 100%;
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

  .game-component {
    border: 2px solid black;
    border-radius: 20px;
  }
  `;

  games: Game[] = [];

  constructor() {
    super();
    this.loadGames();
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

  handleNewGame(event: any) {
    const date = new Date();     
    
    const gameName = format(date, "dd MMMM yyyy, HH:mm", { locale: it });
 
    const game = new Game(gameName);

    game.init(localStorage.userName);

    localStorage.currentGame = game.name;

    StoreService.saveGame(game);

    Router.go('/starting');
  }

  handleGameJoin(event: any) {
    const game = this.games.find(g => g.name === event.detail.name);
    if (game) {
      game.join(localStorage.userName);

      localStorage.currentGame = game.name;

      StoreService.saveGame(game); 

      Router.go('/starting');
    }
  }

  handleGameDelete(event: any) {
    const game = this.games.find(g => g.name === event.detail.name);
    if (game) {
      StoreService.deleteGame(game.name);  
    }
  }

  render() {
    return html`
      <main @game-join=${this.handleGameJoin} @game-delete=${this.handleGameDelete}>
         ${this.games.map(game => html`
            <div class="game-component">
              <game-component name="${game.name}" status="${game.status}" master="${game.findMaster()?.name}" winner="${game.getWinner()}"</game-component>
            </div>
          `)}
           <div><button class="action-button" @click="${this.handleNewGame}">New game</button></div>
      </main>
    `;
  }
}
