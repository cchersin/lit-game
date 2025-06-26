import { Card } from './card'
import { Player } from './player'
import { Round } from './round'

const whiteCards = [
    new Card('1', 'venire insultati da Glauco perchè hai dimenticato i crocini di taglio', 'white'), 
    new Card('2', 'Inès', 'white'),
    new Card('3', 'Andrea', 'white'),
    new Card('4', 'Montra', 'white'), 
    new Card('5', 'le critiche di Rossolini', 'white'),
    new Card('6', 'Grado', 'white'),
    new Card('7', 'la sessualità di Martina', 'white'), 
    new Card('8', 'il divorzio dei miei genitori', 'white'),
    new Card('9', 'il comic sans', 'white'),
    new Card('10', 'l\'Helvetica', 'white'), 
    new Card('11', 'i poveri che non hanno soldi', 'white'),
    new Card('12', 'i ladri che rubano', 'white'),     

  ];

const blackCards = [
    new Card('1', 'Voglio fare un gioco, hai un minuto per tagliarti la gamba utilizzando ______.', 'black'),
    new Card('2', 'Per far andare Cindy più veloce abbiamo deciso di potenziare il suo carretto con ______.', 'black'),
    new Card('3', 'Bevo per dimenticare ______.', 'black') ,
  ];

export class Game {
  name: string;
  status: string; 
  whiteDeck: Array<Card>;
  blackDeck: Array<Card>;
  blackCard?: Card;
  tableCards: Array<Card>;
  players: Array<Player>; 
  rounds: Array<Round>;
  
  constructor(name: string) {
    this.name = name;
    this.status = 'completed';
    this.whiteDeck = [];
    this.blackDeck = [];
    this.players = [];
    this.blackCard = new Card('0', '','');
    this.tableCards = [];
    this.rounds = [];
  }

  init(masterName: string) {
    console.log('init game');
 
    const p = new Player(masterName, 'master');
    this.players = [p];
    this.whiteDeck = [...whiteCards];
    this.blackDeck = [...blackCards];
    this.shuffle(this.whiteDeck);
    this.shuffle(this.blackDeck);
    this.status = 'pending';
  }

  shuffle(deck: Array<Card>): void {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
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

  getPlayerWins(playerName: string): number {
      return this.rounds.filter(round => round.winnerName === playerName).length;
  }

  getWinner(): string {
    if (this.status !== 'completed') {
      return '';
    }
    const playerWins = this.players.map(player => ({
      playerName: player.name,
      wins: this.getPlayerWins(player.name)
    }));
    const maxWins = Math.max(...playerWins.map(player => player.wins));
    const winners = playerWins.filter(player => player.wins === maxWins);
    if (winners.length === 1) {
      return winners[0].playerName;
    } else {
      return winners.map(winner => winner.playerName).join(', ');
    }
  }

  getLastRoundWinner(): string {
    if (this.rounds.length === 0) {
      return '';
    }
  
    const lastRound = this.rounds[this.rounds.length - 1];
    return lastRound.winnerName || '';
  }

  getLeaderboard(): Array<{ playerName: string; wins: number }> {
     return this.players
      .map(player => ({
        playerName: player.name,
        wins: this.getPlayerWins(player.name)
    }))
    .sort((a, b) => b.wins - a.wins); 
  }
 
  stop() {
    console.log('stop game');
 
    this.status = 'completed';
    // this.players = [];
  }

  join(playerName: string) {
    let p = this.players.find((player) => player.name === playerName);

    if (!p) {
      p = new Player(playerName, 'player');
      this.players.push(p);

      this.drawHand(p);
    }
  }

  leave(playerName: string): void {
    const playerIndex = this.players.findIndex(player => player.name === playerName);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }

    if (!this.hasMaster()) {
      this.stop();
    }
  }

  drawHand(player: Player) {
    player.currentCardId = '';
    for(let i = player.hand.length; i < 3; i++) {
      this.drawCard(player);
    }
  }

  
  private drawCard(player: Player) {
    const drawnCard = this.whiteDeck.shift();
    if (drawnCard) {
      player.hand.push(drawnCard);
    }
  }

  playCard(playerName: string, cardId: string) {
    console.log(`playCard: playerName=${playerName}, cardId=${cardId}`);
   
    let p = this.players.find((player) => player.name === playerName);

    if (p) {
      if (p.role == 'player') {
        p.currentCardId = cardId;
        if (this.isPlayerTurnCompleted()) {
            const master = this.findMaster();

            if (master) {
              this.findPlayers().forEach((player) => {
                  const card = player.getCurrentCard();
                  if (card) {
                    player.removeCurrentCard();
                    this.tableCards.push(card);
                  }
              });
            }
        }
      } else {
        const areDecksEmpty = this.areDecksEmpty();
        
        const winner = this.findPlayers().find((player) => player.currentCardId === cardId);
        const winnerCard = this.getWhiteCard(cardId);
        const winnerCardContent = winnerCard ? winnerCard.content : '';
        const blackCardContent = this.blackCard ? this.blackCard.content : '';
        const sentence = blackCardContent.replace('______',winnerCardContent);
        const winnerName = winner ? winner.name : '';

        console.log(`winner: ${winnerName}, sentence: ${sentence}`);

        const round = new Round(winnerName, sentence);
        this.rounds.push(round);

        if (areDecksEmpty) {
          this.stop();
        } else 
          this.setMaster(winnerName);
       }
    }
  }

  setMaster(playerName: string) {
    console.log(`setMaster: playerName=${playerName}`);
    const p = this.players.find((player) => player.name === playerName);
    if (p) {
      p.role = 'master';
      p.currentCardId = '';
      this.tableCards = [];
      this.drawBlackCard(); 
      this.players.filter((player) => player.name !== playerName).forEach((player) => {
        player.role = 'player';
        player.currentCardId = '';
        this.drawHand(player);  
      });
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

  hasMaster(): boolean {
     return this.players.some(player => player.role === 'master');
  }

  getHand(playerName: string) {
    const p = this.getPlayer(playerName);
    if (p) {
      return p.hand;
    }
   
    return [];
  }

  getWhiteCard(cardId: String) {
    return whiteCards.find(card => card.id === cardId);
  }

  areDecksEmpty() {
    return this.whiteDeck.length === 0 || this.blackDeck.length === 0;
  }

  getLastRound(): Round | undefined {
    if (this.rounds.length === 0) {
      return undefined;
    }
    return this.rounds[this.rounds.length - 1];
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      whiteDeck: this.whiteDeck.map(c => c.toJSON()),
      blackDeck: this.blackDeck.map(c => c.toJSON()),
      blackCard: this.blackCard?.toJSON(),
      tableCards: this.tableCards.map(c => c.toJSON()),
      players: this.players.map(c => c.toJSON()),
      rounds: this.rounds.map(r => r.toJSON())
    };
  }

  static fromJSON(json: any) {
    const g = new Game(json.name);
    g.status = json.status;
    g.whiteDeck = json.whiteDeck.map((c: any) => Card.fromJSON(c));
    g.blackDeck = json.blackDeck.map((c: any) => Card.fromJSON(c));
    g.blackCard = Card.fromJSON(json.blackCard);
    g.tableCards = json.tableCards.map((c: any) => Card.fromJSON(c));
    g.players = json.players.map((p: any) => Player.fromJSON(p));
    g.rounds = json.rounds.map((r:any) => Round.fromJSON(r));
    return g;
  }
}
                                      