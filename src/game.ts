import { Card } from './card.js'
import { Player } from './player.js'

const whiteCards = [
    new Card('1', 'Martina', 'white'), 
    new Card('2', 'Inès', 'white'),
    new Card('3', 'Andrea', 'white'),
    new Card('4', 'Montra', 'white'), 
    new Card('5', 'le critiche di Rossolini', 'white'),
    new Card('6', 'Grado', 'white'),
    new Card('7', 'la sessualità di Martina', 'white'), 
    new Card('8', 'il divorzio dei miei genitori', 'white'),
    new Card('9', 'il comic sans', 'white'),
    new Card('10', 'Helvetica', 'white'), 
    new Card('11', 'i poveri che non hanno soldi', 'white'),
    new Card('12', 'i ladri che rubano', 'white'),    
  ];

const blackCards = [
    new Card('1', 'La colazione di Montra oggi consiste in ______.', 'black'),
    new Card('2', 'Per far andare Cindy più veloce abbiamo deciso di potenziare il suo carretto con ______.', 'black'),
    new Card('3', 'Bevo per dimenticare ______.', 'black') 
  ];

export class Game {
  name: string;
  status: string; 
  whiteDeck: Array<Card>;
  blackDeck: Array<Card>;
  blackCard?: Card;
  players: Array<Player>; 
  turn: string;
  
  constructor(name: string) {
    this.name = name;
    this.status = 'completed';
    this.whiteDeck = [];
    this.blackDeck = [];
    this.players = [];
    this.blackCard = new Card('0', '','');

    this.turn = 'players';
  }

  init(masterName: string) {
    console.log('init game');
 
    const p = new Player(masterName, 'master');
    this.players = [p];
    this.whiteDeck = whiteCards;
    this.blackDeck = blackCards;
    this.status = 'pending';
  }

  start() {
    console.log('start game');
 
    this.status = 'started';
    this.drawBlackCard();
  }

  drawBlackCard() {
    const drawnCard = this.blackDeck.shift();
    if (drawnCard) {
       this.blackCard = drawnCard;
    }
  }
 
  stop() {
    console.log('stop game');
 
    this.status = 'completed';
    this.players = [];
  }

  join(playerName: string) {
    let p = this.players.find((player) => player.name === playerName);

    if (!p) {
      p = new Player(playerName, 'player');
      this.players.push(p);

      this.drawHand(p);
    }
  }

  drawHand(player: Player) {
    player.currentCardId = '';
    for(let i = 0; i < 3; i++) {
      const drawnCard = this.whiteDeck.shift();
      if (drawnCard) {
        player.hand.push(drawnCard);
      }
    }
  }

  confirmCard(playerName: string, cardId: string) {
    let p = this.players.find((player) => player.name === playerName);

    if (p) {
      if (p.role == 'player') {
        p.currentCardId = cardId;
        if (this.isPlayerTurnCompleted()) {
            const master = this.findMaster();

            if (master) {
              master.hand = [];
              this.findPlayers().forEach((player) => {
                  const card = player.getCurrentCard();
                  if (card) {
                    player.hand = [];
                    master.hand.push(card);
                  }
              });
            }
        }
      } else {
        const winner = this.findPlayers().filter((player) => player.currentCardId === cardId);
        this.findPlayers().forEach((player) => {
            this.drawHand(player);
        });  
        this.drawBlackCard(); 
        p.hand = [];
      }
    }
  }

  isPlayerTurnCompleted() {
    return !this.findPlayers().find((player) => !player.hasCurrentCard());
  }

  findMaster() {
    return this.players.find(p => p.role === 'master');
  }

  findMasterName() {
    const master = this.findMaster();
    return master ? master.name : '';
  }

  findPlayers() {
    return this.players.filter(p => p.role === 'player');
  } 

  getPlayer(playerName: string) {
    return this.players.find((player) => player.name === playerName);
  }

  isMaster(playerName: string) {
    return this.getPlayer(playerName)?.role === 'master';
  }

  isPlayer(playerName: string) {
    return this.getPlayer(playerName)?.role === 'player';
  }

  getRole(playerName: string) {
    const p = this.getPlayer(playerName);
    if (p) {
      return p.role;
    }
    return '';
  }

  getHand(playerName: string) {
    const p = this.getPlayer(playerName);
    if (p) {
      return p.hand;
    }
   
    return [];
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      whiteDeck: this.whiteDeck.map(c => c.toJSON()),
      blackDeck: this.blackDeck.map(c => c.toJSON()),
      blackCard: this.blackCard?.toJSON(),
      players: this.players.map(c => c.toJSON()),
      turn: this.turn
    };
  }

  static fromJSON(json: any) {
    const g = new Game(json.name);
    g.status = json.status;
    g.whiteDeck = json.whiteDeck.map((c: any) => Card.fromJSON(c));
    g.blackDeck = json.blackDeck.map((c: any) => Card.fromJSON(c));
    g.blackCard = Card.fromJSON(json.blackCard);
    g.players = json.players.map((p: any) => Player.fromJSON(p));
    g.turn = json.turn;
    return g;
  }
}
                                      