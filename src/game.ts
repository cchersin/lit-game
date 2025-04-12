import { Card } from './card.js'
import { Player } from './player.js'

export class Game {
  name: string;
  status: string; 
  whiteDeck: Array<Card>;
  blackDeck: Array<Card>;
  blackCard?: Card;
  players: Array<Player>; 
  
  constructor(name: string) {
    this.name = name;
    this.status = 'completed';
    this.whiteDeck = [];
    this.blackDeck = [];
    this.blackCard = new Card('','');
    this.players = [];
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      whiteDeck: this.whiteDeck.map(c => c.toJSON()),
      blackDeck: this.blackDeck.map(c => c.toJSON()),
      blackCard: this.blackCard?.toJSON(),
      players: this.players.map(c => c.toJSON())
    };
  }

  static fromJSON(json: any) {
    const g = new Game(json.name);
    g.status = json.status;
    g.whiteDeck = json.whiteDeck.map((c: any) => Card.fromJSON(c));
    g.blackDeck = json.blackDeck.map((c: any) => Card.fromJSON(c));
    g.blackCard = Card.fromJSON(json.blackCard);
    g.players = json.players.map((p: any) => Player.fromJSON(p));
    return g;
  }
}
                                      