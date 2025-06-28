import { tr } from 'date-fns/locale';
import { Game } from '../../src/domain/game';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game('TestGame');
    game.init('Master');
  });

  test('should initialize with master', () => {
    expect(game.players.length).toBe(1);
    expect(game.players[0].role).toBe('master');
    expect(game.status).toBe('pending');
    expect(game.turn).toBe('players');
  });


  test('join should add a player and draw hand', () => {
    game.join('Alice');
    const alice = game.getPlayer('Alice');
    expect(alice).toBeDefined();
    expect(alice?.hand.length).toBe(3);
    expect(game.players.length).toBe(2);
  });

  
  test('master playCard should set new master after round', () => {
    game.join('Alice');
    game.join('Bob');
    // Simula che tutti i player abbiano giocato
    const alice = game.getPlayer('Alice')!;
    const aliceCardId = alice.hand[0].id;
    game.playCard(alice.name, aliceCardId);

    expect(game.tableCards.length).toBe(0);
    expect(game.hasAllPlayersChoosenCards()).toBe(false);
    
   
    const bob = game.getPlayer('Bob')!;
    const bobCardId = bob.hand[0].id;
    game.playCard(bob.name, bobCardId);

    expect(game.hasAllPlayersChoosenCards()).toBe(true);
    expect(game.tableCards.length).toBe(2);
    expect(game.turn).toBe('master');

    expect(game.hasMasterChoosenCard()).toBe(false);

    // Il master sceglie la carta di Alice come vincente
    const master = game.findMaster()!;
    game.playCard(master.name, aliceCardId);

    expect(game.hasMasterChoosenCard()).toBe(true);

    expect(game.getLastRoundWinner()).toBe('Alice');

    game.nextRound();

    expect(game.findMasterName()).toBe('Alice');
    expect(game.tableCards.length).toBe(0);
    expect(game.turn).toBe('players');
  });

  test('should return leaderboard', () => {
    game.join('Alice');
    game.rounds.push({ winnerName: 'Alice', sentence: 'test', toJSON: () => ({}) } as any);
    const leaderboard = game.getLeaderboard();
    expect(leaderboard[0].playerName).toBe('Alice');
    expect(leaderboard[0].wins).toBe(1);
  });

  test('should serialize and deserialize', () => {
    const json = game.toJSON();
    const game2 = Game.fromJSON(json);
    expect(game2.name).toBe(game.name);
    expect(game2.players.length).toBe(game.players.length);
    expect(game2.whiteDeck.length).toBe(game.whiteDeck.length);
  });
});