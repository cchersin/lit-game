import { Game } from '../../src/domain/game';
import { Player } from '../../src/domain/player';
import { Card } from '../../src/domain/card';

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
  });


  test('join should add a player and draw hand', () => {
    game.join('Alice');
    const alice = game.getPlayer('Alice');
    expect(alice).toBeDefined();
    expect(alice?.hand.length).toBe(3);
    expect(game.players.length).toBe(2);
  });

  test('player playCard should play a card and move it to tableCards', () => {
    game.join('Alice');
    const alice = game.getPlayer('Alice')!;
    const cardId = alice.hand[0].id;
    game.playCard('Alice', cardId);
    expect(alice.currentCardId).toBe(cardId);
    // Simula che tutti i player abbiano giocato
    game.findPlayers().forEach(p => p.currentCardId = p.hand[0].id);
    game.playCard('Alice', cardId);
    expect(game.tableCards.length).toBeGreaterThanOrEqual(1);
  });

  test('master playCard should set new master after round', () => {
    game.join('Alice');
    game.join('Bob');
    // Simula che tutti i player abbiano giocato
    const alice = game.getPlayer('Alice')!;
    const aliceCardId = alice.hand[0].id;
    game.playCard(alice.name, aliceCardId);
   
    const bob = game.getPlayer('Bob')!;
    const bobCardId = bob.hand[0].id;
    game.playCard(bob.name, bobCardId);
   
    // Il master sceglie la carta di Alice come vincente
    const master = game.findMaster()!;
    game.playCard(master.name, aliceCardId);

    expect(game.findMasterName()).toBe('Alice');
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