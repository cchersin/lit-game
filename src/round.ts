import { Card } from './card.js'

export class Round {
  winnerName: string;
  sentence: string;
  
  constructor(winnerName: string, sentence: string) {
    this.winnerName = winnerName;
    this.sentence = sentence;
  }

  toJSON() {
    return {
      winnerName: this.winnerName,
      sentence: this.sentence,
    };
  }

  static fromJSON(json: any) {
    const r = new Round(json.winnerName, json.sentence);
    return r;
  }
}
                                      