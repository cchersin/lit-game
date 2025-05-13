import { Card } from './card.js'
import { Player } from './player.js'

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
    this.blackCard = new Card('0', '','');
    this.players = [];
    this.turn = 'players';
  }

  /*init(master: string) {
    const p = new Player(master, 'master');
    this.players = [p];
    this.whiteDeck = this.whiteCards;
    this.blackDeck = this.blackCards;
    this.status = 'pending';
  }*/
 
  stop() {
    this.status = 'completed';
    this.players = [];
  }

  findMaster() {
    const master = this.players.find(p => p.role === 'master');
    return master ? master.name : '';
  }

  findPlayers() {
    return this.players.filter(p => p.role === 'player');
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
                                      