
export class Round {
  masterName: string;
  winnerName: string;
  blackCardContent: string;
  whiteCardContent: string;
  
  constructor(masterName: string, winnerName: string, blackCardContent: string, whiteCardContent: string) {
    this.masterName = masterName;
    this.winnerName = winnerName;
    this.blackCardContent = blackCardContent;
    this.whiteCardContent = whiteCardContent;
  }

  toJSON() {
    return {
      masterName: this.masterName,
      winnerName: this.winnerName,
      blackCardContent: this.blackCardContent, 
      whiteCardContent: this.whiteCardContent
    };
  }

  static fromJSON(json: any) {
    const r = new Round(json.masterName, json.winnerName, json.blackCardContent, json.whiteCardContent);
    return r;
  }
}
                                      