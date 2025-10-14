import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';



import '../components/card-component';
import { Card } from '../domain/card'
import { Game } from '../domain/game';
import { Round } from '../domain/round';
import { Favorite } from '../domain/favorite';

import { StoreService } from '../store-service';
import { MediaConnection, Peer } from 'peerjs';
import { query } from 'lit/decorators.js';

import { sharedStyles } from '../shared-styles';
import TinyGesture from 'tinygesture'

@customElement('game-page')
export class GamePage extends LitElement {
  currentCardId = '';
  currentGame = new Game('');
  calls : Array<MediaConnection> = []
  favorites: Array<Favorite> = [];
  showModal = false;
  modalAction: (() => void) | null = null;
  modalText = '';

  @query('#remote-audio') remoteAudioEl: any;
  
  
  static styles = [
  sharedStyles, css`
  main {
    overflow: hidden;
    background-color: #000000;
    height: 100%;
  }

  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .player-widget {
    background-color: white;
    padding: 7px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 20px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 7px;
    text-transform: capitalize;
    font-family: "tablet-gothic", sans-serif;
    font-size: 10pt;
  }

  .master-widget {
    background-color: red;
    color: black;
    padding: 7px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 20px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 7px;
    text-transform: capitalize;
    font-family: "tablet-gothic", sans-serif;
    font-size: 10pt;
  }

  .container-cards {
   margin-top: 20px;
   margin-left: -5px;
   position: relative;
  }

  .outer-container-widget {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    margin: auto;
    position: sticky;
    z-index: 10000;
  }

  .outer-container-widget-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin: auto;
    z-index: 10000;
    position: fixed;
    bottom: 20px;
  }
  
  .action-button {
    background-color: red;
    border: 1px solid black;
    z-index: 1000;
    position: relative;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-right: 20px;
    padding-left: 20px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 14pt;
    font-family: "tablet-gothic", sans-serif;
    border-radius: 18px;
    margin-top: 15px;
  }
  
  .has-choosen {
    background-color: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    justify-content: center;
    margin-bottom: 10px;
  }

  .has-choosen-container {
    display: flex;
    justify-content: center;
  }

  .name-typewriter {
    text-transform: capitalize;
    font-size: 48px; 
    font-family: 'eskapade-fraktur', serif; 
    color: black; 
    text-align: left; 
    position: fixed; 
    top: 460px; 
    margin-left: 50%;
    margin-right: 40%;
    z-index: 10;
    overflow: hidden;
    white-space: nowrap;
    animation: typing 5s steps(40, end);
    width: 0;
    animation-delay: 3.5s;
  }

  .frase-typewriter {
    font-size: 20px; 
    font-weight: lighter;
    font-family: 'tablet-gothic', sans-serif; 
    color: red; 
    margin: 0 auto;
    text-align: center;
    margin-bottom: 25px;
    overflow: hidden;
    white-space: nowrap;
    animation: typing 5s steps(40, end);
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  @keyframes opacity {
    from { opacity: 0 }
    to { opacity: 1 }
  }

  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  }

  .modal {
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    text-align: center;
  }

  .modal button {
    margin: 12px;
    font-size: 16px;
  }
`];

  constructor() {
    super();
    this.loadGame();
    this.loadFavorites();
  }

  updated() {
    this.initGestures()
  }

  initGestures(){
   const options = {
      threshold: (type:any, self:any) =>
        Math.max(
          25,
          Math.floor(
            0.15 *
              (type === 'x'
                ? window.innerWidth || document.body.clientWidth
                : window.innerHeight || document.body.clientHeight),
          ),
        ),
      velocityThreshold: 10,
      disregardVelocityThreshold: (type:any, self:any) =>
        Math.floor(0.5 * (type === 'x' ? self.element.clientWidth : self.element.clientHeight)),
      pressThreshold: 8,
      diagonalSwipes: false,
      diagonalLimit: 15,
      mouseSupport: true,
    };

    const target = this.renderRoot.querySelector('.container-cards') as HTMLElement;
    if (target) {
      const gesture = new TinyGesture(target, options);

      gesture.on('panend', (event) => {
        if (gesture.swipingHorizontal && gesture.swipingDirection === 'horizontal' && gesture.touchMoveX) {
          if (gesture.touchMoveX < 0) { this.goLeft() };
          if (gesture.touchMoveX > 0) { this.goRight() };
        }
        if (gesture.swipedVertical && gesture.swipingDirection === 'vertical' && gesture.touchMoveX) {
          if (gesture.touchMoveY && gesture.touchMoveY < 0) { this.goUp() };
        }
    });
    }
  }

  firstUpdated() {
    this.setupListen()
  }

  findCardContent(cardId: String) {
    const card = this.currentGame.getWhiteCard(cardId);

    if (card) {
      return card.content;
    }

    return '';
  }

  handleStopGame(event: any) {
    this.modalText = 'Sei sicuro di voler terminare la partita? Tutti i giocatori verranno espulsi e la partita non potrà più essere ripresa.';
    this.showModal = true;
    this.modalAction = this.confirmStopGame.bind(this);
    this.requestUpdate();
  }

  confirmStopGame() {
    this.currentGame.stop();
    StoreService.saveGame(this.currentGame);
  }

  confirmAction() {
    this.modalAction?.();  
    this.showModal = false;
    this.requestUpdate();
  }

  cancelAction() {
    this.showModal = false;
    this.requestUpdate();
  }

  handleLeaveGame() {
    this.modalText = 'Sei sicuro di voler abbandonare la partita?';
    this.showModal = true;
    this.modalAction = this.confirmLeaveGame.bind(this);
    this.requestUpdate();
  }

  confirmLeaveGame() {
    this.currentGame.leave(localStorage.userName);
    StoreService.saveGame(this.currentGame);
  }

  loadGame() {
    StoreService.onGameUpdate(localStorage.currentGame, (game) => {
     if (game) {
        this.currentGame = game;

        if (this.currentGame.status !== 'started' || !this.hasRole()) {
          Router.go('/starting');
        }

        if (this.currentGame.status === 'completed') {
          Router.go('/winner');
        }

        if (this.getPlayer()?.hasCards() && !this.getPlayer()?.hasCard(this.currentCardId)) {
          this.currentCardId = '';
        }

        if (this.getPlayer()?.currentCardId === '' && this.currentCardId === '' && this.getPlayerChoosableCards().length > 0) {
            this.currentCardId = this.getFrontCard().id;
        }
   
        this.requestUpdate();
      }
    });
  }

  loadFavorites() {
    StoreService.onFavoritesUpdate((favorites) => {
     if (favorites) {
        this.favorites = favorites;
        this.requestUpdate();
      }
    });
  } 

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.handleArrowKeys.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleArrowKeys.bind(this));
    super.disconnectedCallback();
  }

  goLeft() {
    this.reverseSwap(() => {
      this.moveBackCardToFront();
      this.currentCardId = this.getFrontCard().id;
      this.requestUpdate();
    });
  }

  goRight() {
    this.swap(() => {
      this.moveCurrentCardToBack();
      this.currentCardId = this.getFrontCard().id;
      this.requestUpdate();
    });
  }

  goUp() {
    if (this.getPlayer()?.currentCardId === '' && this.currentCardId !== '') {
      const containerCards = this.renderRoot.querySelector(".container-cards") as HTMLElement;
      const blackContainerCards = this.renderRoot.querySelector(".black-card-container") as HTMLElement;
      const frontCard = containerCards?.querySelector("card-component:last-child") as any;
      const blackCard = blackContainerCards?.querySelector("card-component:first-child") as any;

      if (frontCard) { 
        frontCard.applyAnimation("slide-up", () => {
          this.handlePlayCard();
        });
      }
      if (blackCard) { 
        blackCard.applyAnimation("slide-down", () => {
        });
      }
      containerCards?.querySelectorAll(`card-component`).forEach((card, index, array) => {
        if (card !== frontCard) {
          (card as any).applyAnimation("slide-more-down");
        }
      });
    }
  }

  handleArrowKeys(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.goUp();
        break;
      case 'ArrowLeft':
        this.goLeft();
        break;
      case 'ArrowRight':
        this.goRight()
        break
    }
  }

  getFrontCard() {
    return this.getPlayerChoosableCards()[this.getPlayerChoosableCards().length - 1];
  }

  moveCurrentCardToBack() {
    const frontCard = this.getFrontCard();
    this.getPlayerChoosableCards().pop();
    this.getPlayerChoosableCards().unshift(frontCard);
  }

  moveBackCardToFront() {
    const backCard = this.getPlayerChoosableCards()[0];
    this.getPlayerChoosableCards().shift();
    this.getPlayerChoosableCards().push(backCard);
  }

  swap(cb?: () => void) {
    const containerCards = this.renderRoot.querySelector(".container-cards") as HTMLElement;
   
    const frontCard = containerCards?.querySelector("card-component:last-child") as any;
   
    if (!frontCard) 
      return;

    containerCards?.querySelectorAll(`card-component`).forEach((card, index, array) => {
      if (card !== frontCard) {
        (card as any).applyAnimation("slide-left");
      }
    });

    frontCard.applyAnimation("swap", cb);

    // this.requestUpdate();
  }

  reverseSwap(cb?: () => void) {
    const containerCards = this.renderRoot.querySelector(".container-cards") as HTMLElement;
   
    const backCard = containerCards?.querySelector("card-component:first-child") as any;
   
    if (!backCard) 
      return;

    backCard.applyAnimation("reverse-swap", cb);

    containerCards?.querySelectorAll(`card-component`).forEach((card, index, array) => {
      if (card !== backCard) {
        (card as any).applyAnimation("slide-right");
      }
    });

    // this.requestUpdate();
  }
  
  findCurrentCardIndex() {
    const hand = this.getPlayerChoosableCards();
    if (!hand || hand.length === 0) {
      return -1;
    }
    return hand.findIndex(card => card.id === this.currentCardId);
  }

  getLeftCardIndex() {
    const hand = this.getPlayerChoosableCards();
    if (!hand || hand.length === 0) {
      return -1;
    }
    const currentIndex = this.findCurrentCardIndex();
    if (currentIndex === -1) {
      return 0;
    }
    return (currentIndex - 1 + hand.length) % hand.length;
  }

  getRightCardIndex() {
    const hand = this.getPlayerChoosableCards();
    if (!hand || hand.length === 0) {
      return -1;
    }
    const currentIndex = this.findCurrentCardIndex();
    if (currentIndex === -1) {
      return 0;
    }
    return (currentIndex + 1) % hand.length;
  }

  getLeftCardId() {
    const hand = this.getPlayerChoosableCards();
    const leftIndex = this.getLeftCardIndex();
    if (leftIndex === -1) {
      return '';
    }
    return hand[leftIndex].id;
  }

  getRightCardId() {
    const hand = this.getPlayerChoosableCards();
    const rightIndex = this.getRightCardIndex();
    if (rightIndex === -1) {
      return '';
    }
    return hand[rightIndex].id;
  } 


  findMasterName() {
    return this.currentGame.findMasterName();
  }

  findPlayers() {
    return this.currentGame.findPlayers();
  } 

  isMaster() {
    return this.currentGame.isMaster(localStorage.userName);
  }

  isPlayer() {
    return this.currentGame.isPlayer(localStorage.userName);
  }

  getPlayer() {
    return this.currentGame.getPlayer(localStorage.userName);
  }

  hasRole() {
    return this.getPlayer();
  }

  hasHand() {
    const player = this.currentGame.getPlayer(localStorage.userName);
    return player ? player.hand.length > 0 : false;
  }

  getRole() {
    return this.currentGame.getRole(localStorage.userName);
  }

  renderBlackCard() {
  
    if (!this.hasRole() || (this.isMaster() && this.currentGame.tableCards.length > 0) || this.currentGame.hasMasterChoosenCard()) {
      return html``; 
    }
   
    return html`<div class="black-card-container"><card-component description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(this.currentCardId || this.getPlayer()?.currentCardId || '')}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></card-component></div>`;
  }

  getHand() {
    return this.currentGame.getHand(localStorage.userName);
  }

  getRounds() {
    return this.currentGame.rounds;
  }

  handlePlayCard() {
    this.currentGame.playCard(localStorage.userName, this.currentCardId);

    StoreService.saveGame(this.currentGame);
  }

  handleNextRound() {
    this.currentGame.nextRound();

    StoreService.saveGame(this.currentGame);
  }

  getPlayerChoosableCards() {
     if (this.getRole() === 'player') {
      return this.getHand();
    } else {
      return this.currentGame.tableCards;
    }
  }

  renderChoosableCards() {
    return this.renderCards(this.getPlayerChoosableCards(), this.getRole() === 'master');
  }

  handleFavoriteCard(e: any) {
    const blackCardContent = e.detail.description;
    const whiteCardContent = e.detail.value;
    const favorite = e.detail.favorite;
    const playerName = this.currentGame.getPlayerOfCard(e.detail.id);

    if (blackCardContent === '' || whiteCardContent === '' || playerName === '') {
      return;
    }

    const fav = new Favorite(blackCardContent, whiteCardContent, playerName);

    if (favorite) {
     this.addFavorite(fav);
    } else {
      this.removeFavorite(fav);
    }
  } 

  addFavorite(favorite: Favorite) {
    if (this.isFavorite(favorite)) {
      return;
    }

    this.favorites.push(favorite);
    StoreService.saveFavorites(this.favorites);
  }

  removeFavorite(favorite: Favorite) {
    this.favorites = this.favorites.filter(fav => !fav.equal(favorite));
    StoreService.saveFavorites(this.favorites);
  } 

  isFavorite(favorite: Favorite) {
    return this.favorites.find(fav => fav.equal(favorite)) !== undefined;
  }

  renderCards(cards: any, resolve: boolean) {
    let left = 0;
    let zindex = 11;
   
    return html`<div class="container-cards" @card-favorite="${this.handleFavoriteCard}">
         ${cards.map((card: any) => 
              new Card(card.id, card.content, card.color)).map((card: any) => { 
                left += 10;
                zindex += 1;
                return this.renderCard(card, left, zindex, resolve, true);
          })}
        </div>`;
  }

  renderCard(card: Card, left: number, zindex: number, resolve: boolean, choosable: boolean) {
    if(resolve) {
       return html`<card-component id="${card.id}" description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(card.id)}" 
                backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}" 
                left="${left}" zindex="${zindex}" choosable="${choosable}" 
                favorite="${this.isFavorite(new Favorite(this.currentGame.blackCard?.content ?? '', this.findCardContent(card.id) ?? '', this.currentGame.getPlayerOfCard(card.id)))}"></card-component>`;
    } else {
      return html`
            <card-component id="${card.id}" description="${card.content}" backgroundColor="${card.color}" color="${card.getOppositeColor()}" left="${left}" cardNumber="${this.getPlayerChoosableCards().length}" zindex="${zindex}" choosable="${choosable}"></card-component>
          `;
    } 
  }


  renderLastRound() {
    if(this.currentGame.turn == 'master' && this.currentGame.hasMasterChoosenCard()) {
      const lastRound = this.currentGame.getLastRound();
      if (lastRound) {
        return html`<div>${this.renderLastRoundWinner(lastRound)}${this.renderLastRoundWinningCard(lastRound)}/div>`;
      }
    }
  }

  renderLastRoundWinner(lastRound: Round) {
      return html`<div><div id="last-round" class="frase-typewriter">E il vincitore è...</div><div id="last-round" class="name-typewriter">${lastRound.winnerName}</div></div>`;
  }

  renderLastRoundWinningCard(lastRound: Round) {
     return html`
            <card-component id="-1" description="${lastRound.blackCardContent}" value="${lastRound.whiteCardContent}" winning="true" backgroundColor="black" color="white"></card-component>
          `;
  }

  async handleCall() {
      const peer = new Peer();

      for(const player of this.currentGame.players) {
        if (player.name !== localStorage.userName) {
          console.log('Calling player:', player.name, 'with peer ID:', player.peerId);
          
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          const call = peer.call(player.peerId, stream);

          this.calls.push(call);
        }
      }
  };

  async handleCloseCall() {
      const peer = new Peer();

      for(const call of this.calls) {
          call.close()
      }
      this.calls = [];
  };

  async setupListen() {
    /*
      const peer = new Peer();

      console.log('Setup listen for peer connection');

      peer.on('open', id =>
          this.getPlayer()?.setPeerId(id);
          StoreService.saveGame(this.currentGame);
          console.log('My Peer ID:', id);
      });

      peer.on('call', call => {
        call.answer(); 

        console.log('Call received from:', call.peer);

        call.on('stream', remoteStream => {
          this.remoteAudioEl.srcObject = remoteStream;
        });

        call.on('close', () => {
          console.log('Call closed:');
          this.remoteAudioEl.srcObject = null;
        });

        call.on('error', () => {
          console.log('error:');
        });
       
      });

      peer.on('close', () => {
          console.log('Peer closed:');
      });

      peer.on('error', () => {
          console.log('Peer error:');
      });*/

  };


  render() {
     return html`
      <main class="game">
        <span>User: ${localStorage.userName}(${this.getRole()}) - ${this.currentGame.status}</span>
         <audio id="remote-audio" autoplay controls style="display:none"></audio>

        <div class="outer-container-widget">
          ${this.currentGame.players.map(player => html`
            <div class="container-widget">
              <div class="${player.role}-widget" style="${player.name === localStorage.userName ? 'font-weight: light;' : ''}">
                ${player.name}  ${this.currentGame.getPlayerWins(player.name)}
              </div>
              <div class="has-choosen-container">
                <div class="has-choosen" style="opacity: ${player.currentCardId !== '' ? '1' : '0'}"/>
              </div>
            </div>
          `)}
        </div>
         <!--${this.isPlayer() && this.currentGame.turn != 'master' && this.getPlayer()?.currentCardId !== '' ? html `<div style="font-size: 48px; font-family: 'eskapade-fraktur', serif; color:red; text-align: center; rotate: 2deg; line-height: 0.9; margin-bottom: 12px; margin-top: 15px; animation: opacity 0.5s ease-in-out;">Congratulazioni,</br>hai scelto la</br>tua carta!</div><div style="font-size: 20px; font-family: 'tablet-gothic', sans-serif; color:red; text-align: center; rotate: 2deg; font-weight: lighter; margin-bottom:40px; animation: opacity 0.5s ease-in-out;">(ora aspetta che gli altri</br>scelgano la loro...)</div>` : html ``}-->
         ${this.isPlayer() && this.getPlayer()?.currentCardId !== '' && !this.currentGame.hasMasterChoosenCard() ? html `<div style="font-size: 48px; font-family: 'eskapade-fraktur', serif; color:red; text-align: center; rotate: 2deg; line-height: 0.9; margin-bottom: 12px; margin-top: 15px; animation: opacity 0.5s ease-in-out;">Congratulazioni,</br>hai scelto la</br>tua carta!</div><div style="font-size: 20px; font-family: 'tablet-gothic', sans-serif; color:red; text-align: center; rotate: 2deg; font-weight: lighter; margin-bottom:40px; animation: opacity 0.5s ease-in-out;">(ora aspetta che il master</br>scelga la migliore...)</div>` : html ``}
         ${this.renderLastRound()}
         ${this.renderBlackCard()}
         ${this.getPlayer()?.currentCardId === '' ? this.renderChoosableCards() : html ``}
         <div class="outer-container-widget-bottom">
          ${this.currentGame.status === 'started' ? html`<button class="action-button" @click="${this.handleStopGame}">stop</button>` : html``}
          ${this.isMaster() && this.currentGame.hasMasterChoosenCard() && this.currentGame.hasNextRound() ? html`<button class="action-button" @click="${this.handleNextRound}">prossimo round</button>` : html``}
          <!--${this.getPlayer()?.currentCardId === '' && this.currentCardId !== '' ? html`<button class="action-button" @click="${this.handlePlayCard}">conferma</button>` : html``}-->
          <!--<button class="action-button" @click="${this.handleLeaveGame}">abbandona</button>-->
          <button class="action-button" @click="${this.handleCall}" style="display:none">chiama</button>
          <button class="action-button" @click="${this.handleCloseCall}" style="display:none">chiudi chiamata</button>
         </div>  
         ${this.showModal ? html`
        <div class="modal-overlay">
          <div class="modal">
            <div>${this.modalText}</div>
            <button @click="${this.confirmAction}">sì</button>
            <button @click="${this.cancelAction}">no</button>
          </div>
        </div>
      ` : ''}
     </main>
    `;
  }
}

