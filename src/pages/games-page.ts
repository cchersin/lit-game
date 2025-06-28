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

import { sharedStyles } from '../shared-styles';




@customElement('games-page')
export class GamesPage extends LitElement {

  static styles = [

  sharedStyles, css`
  main {
    background-color: red;
    height: 100%;
  }

  .action-button {
    font-size: 16pt;
    color: red;
    font-family: "eskapade-fraktur", sans-serif;
    padding-top: 5px;
    padding-bottom: 6px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 15px;
    background-color: black;
    margin-top: 15px;
    border: none;
  }

  .game-component {
    border: 2px solid black;
    border-radius: 20px;
  }

  div.button-container {
    display: flex;
    align-content: center;
  }

  .archive-button {
    background-color: black;
    height: 70px;
    width: 70px;
    border-radius: 35px;
  }

  .favourites-button {
    margin-left: 50px;
    background-color: black;
    height: 70px;
    width: 70px;
    border-radius: 35px;
  }

  .circles-container {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    max-width: 100%;
    margin-bottom: 50px;
  }

  .outer-circles-container {
    position: fixed;
    bottom: 0;
  }
  `];

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

  handleGoToArchive (event: any) {
    Router.go('/games-archive');  
  }  

  render() {
    return html`
      <main @game-join=${this.handleGameJoin}>
         ${this.games.filter(game => game.status !== 'completed').map(game => html`
            <div class="game-component">
              <game-component name="${game.name}" status="${game.status}" master="${game.findMaster()?.name}" winner="${game.getWinner()}"</game-component>
            </div>
          `)}
           <div class="button-container"><button class="action-button" @click="${this.handleNewGame}">New game</button></div>
           <div class="outer-circles-container"><div class="circles-container"><div class="archive-button" @click="${this.handleGoToArchive}"></div><div class="favourites-button"></div></div></div>
      </main>
    `;
  }
}
