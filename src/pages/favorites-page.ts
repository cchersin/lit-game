import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';
import { StoreService } from '../store-service';
import { Favorite } from '../domain/favorite';


@customElement('favorites-page')
export class FavoritesPage extends LitElement {
  static styles = [
    css`
    main {
    background-color: red;
    height: 100%;
  }
  `];
  favorites: Array<Favorite> = [];

  constructor() {
    super();
    this.loadFavorites()
  }

  loadFavorites() {
      StoreService.onFavoritesUpdate((favorites) => {
       if (favorites) {
          this.favorites = favorites;
          this.requestUpdate();
        }
      });
  }
  
  renderFavorites() {
        return html`<div>
             ${this.favorites.map((f: Favorite) => 
                html`<card-component description="${f.blackCardContent}" value="${f.whiteCardContent}" 
                 backgroundColor="black" color="white"></card-component>`
              )}
            </div>`;
 }

  handleOK(event: any) {
    Router.go('/games');
  }

  render() {
    return html`
      <main>
        ${this.renderFavorites()}
        <button @click="${this.handleOK}">OK</button>
      </main>
    `;
  }
}
    