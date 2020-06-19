import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MoreVertical, FilePlus, LogIn, LogOut, Home } from 'react-feather';
import { CircleSpinner } from 'react-spinners-kit';
import { useToasts } from 'react-toast-notifications';

import FirebaseContext from '../misc/firebase-context';
import StoreContext from '../misc/store-context';

const AuthWrapper = ({ children }) => {
	const [initializing, setInitializing] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const { auth } = useContext(FirebaseContext)
	const { setUser, user } = useContext(StoreContext);
	const history = useHistory();
	const { addToast } = useToasts();

	const onAuthStateChanged = (user) => {			
		if (user) {
			setUser(user);
			setInitializing(false);	
			console.log('Authentication |', 'anonymous:', user.isAnonymous, '- id:', user.uid);	
			return;
		}

		auth().signInAnonymously().catch(function(error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			addToast(errorMessage, { appearance: 'error' });
			console.warn('Error', errorCode, errorMessage);
		});
	};

	const historyListen = () => setMenuOpen(false);

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
		const unlisten = history.listen(historyListen);

		return () =>  {
			unsubscribe();
			unlisten();
		}
	}, []);

	const handleSignIn = () => {
		setMenuOpen(false);
		const provider = new auth.GoogleAuthProvider();
		auth().signInWithPopup(provider).then(() => {
			// const token = result.credential.accessToken;
			// const user = result.user;
			addToast('Successfully signed in.', { appearance: 'success' });
		}).catch(function(error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
			const credential = error.credential;
			addToast(errorMessage, { appearance: 'error' });
			console.warn(errorCode, errorMessage, email, credential);
		});
	};

	const handleSignOut = () => {
		setMenuOpen(false);
		auth().signOut().then(() => {
			addToast('Successfully signed out.', { appearance: 'success' });
		}).catch(error => {
			addToast(error.message, { appearance: 'error' });
			console.warn(error);
		});
	};

	const toggleMenu = () => setMenuOpen(prev => !prev);

	const renderMenu = () => {
		if (!menuOpen) return null;

		return (
			<div className="menu">
				<span>
					<Link to="/">
						<Home size={22}/>
						<span>Back to Overview</span>
					</Link>	
				</span>

				{ !user.isAnonymous 
					&& (
						<span>
							<Link to="/articles/add">
								<FilePlus size={22}/>
								<span>Add Article</span>
							</Link>								
						</span>
					)
				}
				{ 
					user.isAnonymous
						? (
							<span>
								<button role="button" onClick={handleSignIn}>
									<LogIn size={22} />
									<span>Sign In</span>
								</button>									
							</span>
						) : (
							<span>
								<button role="button" onClick={handleSignOut}>
									<LogOut size={22}/>
									<span>Sign Out</span>
								</button>									
							</span>
						)
				}
			</div>
		)
	};

	if (initializing) {
		return (
			<div className="center-notice">
				<CircleSpinner size={50} color="#212121" />				
			</div>
		);
	}

	return (
		<div className="grid">
			<div className="menu-wrapper">
				<div className="handle" role="button" onClick={toggleMenu}>
					<MoreVertical />
				</div>
				{ renderMenu() }
			</div>
			{ children }
		</div>
	);
};

export default AuthWrapper;