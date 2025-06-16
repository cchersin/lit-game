import { Player } from '../../src/domain/player';
import { Card } from '../../src/domain/card';

describe('Player', () => {
  let player: Player;
  let card1: Card;
  let card2: Card;

  beforeEach(() => {
    player = new Player('Alice', 'player');
    card1 = new Card('1', 'Test Card 1', 'white');
    card2 = new Card('2', 'Test Card 2', 'white');
    player.hand = [card1, card2];
  });

  test('getCard should return the correct card', () => {
    expect(player.getCard('1')).toBe(card1);
    expect(player.getCard('2')).toBe(card2);
    expect(player.getCard('3')).toBeUndefined();
  });

  test('hasCard should return true if card is in hand', () => {
    expect(player.hasCard('1')).toBe(true);
    expect(player.hasCard('3')).toBe(false);
  });

  test('hasCards should return true if hand is not empty', () => {
    expect(player.hasCards()).toBe(true);
    player.hand = [];
    expect(player.hasCards()).toBe(false);
  });

  test('getCurrentCard and hasCurrentCard', () => {
    player.currentCardId = '2';
    expect(player.hasCurrentCard()).toBe(true);
    expect(player.getCurrentCard()).toBe(card2);
    player.currentCardId = '';
    expect(player.hasCurrentCard()).toBe(false);
    expect(player.getCurrentCard()).toBeUndefined();
  });

  test('removeCard should remove the card from hand', () => {
    player.removeCard('1');
    expect(player.hand.length).toBe(1);
    expect(player.hasCard('1')).toBe(false);
  });

  test('removeCurrentCard should remove the current card', () => {
    player.currentCardId = '2';
    player.removeCurrentCard();
    expect(player.hasCard('2')).toBe(false);
  });

  test('setPeerId should set the peerId', () => {
    player.setPeerId('peer-123');
    expect(player.peerId).toBe('peer-123');
  });

  test('toJSON and fromJSON should serialize and deserialize correctly', () => {
    player.currentCardId = '1';
    player.setPeerId('peer-abc');
    const json = player.toJSON();
    const newPlayer = Player.fromJSON(json);
    expect(newPlayer.name).toBe(player.name);
    expect(newPlayer.role).toBe(player.role);
    expect(newPlayer.hand.length).toBe(2);
    expect(newPlayer.currentCardId).toBe('1');
    expect(newPlayer.peerId).toBe('peer-abc');
  });
});