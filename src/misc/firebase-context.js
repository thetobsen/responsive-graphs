import React, { createContext } from 'react';

import { db, auth } from './firebase';

const FirebaseContext = createContext({ db: null, auth: null });


const FirebaseProvider = ({ children }) => {
	const firebaseValue = { db, auth };

	return (
		<FirebaseContext.Provider value={firebaseValue}>
			{ children }
		</FirebaseContext.Provider>
	);	
};



export default FirebaseContext;
export { FirebaseProvider };