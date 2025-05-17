import { db } from './firebase';
import { setDoc, doc, onSnapshot } from 'firebase/firestore';
import { Game } from './game';

type CallbackFunction = (game: Game) => void;

export class StoreService {
	static saveGame(game: Game) {
		const docRef = doc(db, 'global', 'currentGame');
    	setDoc(docRef, game.toJSON());

    	console.log('saved');
	}

	static onGameUpdate(cb: CallbackFunction) {
		const docRef = doc(db, 'global', 'currentGame');
    	onSnapshot(docRef, (docSnapshot) => {
    		if (docSnapshot.exists()) {
    			const game =Game.fromJSON(docSnapshot.data());
    			cb(game);
    		}
    	});
	}
}
