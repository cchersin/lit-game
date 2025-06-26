
export class Round {
  masterName: string;
  winnerName: string;
  sentence: string;
  
  constructor(masterName: string, winnerName: string, sentence: string) {
    this.masterName = masterName;
    this.winnerName = winnerName;
    this.sentence = sentence;
  }

  toJSON() {
    return {
      masterName: this.masterName,
      winnerName: this.winnerName,
      sentence: this.sentence, 
    };
  }

  static fromJSON(json: any) {
    const r = new Round(json.masterName,json.winnerName, json.sentence);
    return r;
  }
}
                                      