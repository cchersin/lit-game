import { auth, db } from './firebase.js';
import { getFirestore, Firestore, collection, addDoc, setDoc, deleteDoc, getDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { Game } from './game.js';

type CallbackFunction = (game:Game) => void;

export class StoreService {
	static saveGame(game: Game) {
		const currentGameDoc = doc(db, 'global', 'currentGame');
    	setDoc(currentGameDoc, game.toJSON());

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
