export class Favorite {
  blackCardContent: string;
  whiteCardContent: string;
  playerName: string;
  
  constructor(blackCardContent: string, whiteCardContent: string, playerName: string) {
    this.blackCardContent = blackCardContent;
    this.whiteCardContent = whiteCardContent;
    this.playerName = playerName;
  }

  toJSON() {
    return {
      blackCardContent: this.blackCardContent,
      whiteCardContent: this.whiteCardContent,
      playerName: this.playerName,
    };
  }

  equal(other: Favorite) {
    return this.blackCardContent === other.blackCardContent &&
           this.whiteCardContent === other.whiteCardContent &&
           this.playerName === other.playerName;
  }

  static fromJSON(json: any) {
    const r = new Favorite(json.blackCardContent, json.whiteCardContent, json.playerName);
    return r;
  }
}