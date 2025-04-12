import { Card } from './card.js'
import { Player } from './player.js'

export class Game {
  name: string;
  status: string; 
  deck: Array<Card>;
  players: Array<Player>; 
  
  constructor(name: string) {
    this.name = name;
    this.status = 'completed';
    this.deck = [];
    this.players = [];
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      deck: this.deck.map(c => c.toJSON()),
      players: this.players.map(c => c.toJSON())
    };
  }

  static fromJSON(json: any) {
    const g = new Game(json.name);
    g.status = json.status;
    g.deck = json.deck.map((c: any) => Card.fromJSON(c));
    g.players = json.players.map((p: any) => Player.fromJSON(p));
    return g;
  }
}
                                      