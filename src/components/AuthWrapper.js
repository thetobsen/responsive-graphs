import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { MoreVertical, FilePlus, LogIn, LogOut, Home, Clock, List } from 'react-feather';
import { CircleSpinner } from 'react-spinners-kit';
import { useToasts } from 'react-toast-notifications';

import FirebaseContext from '../misc/firebase-context';
import StoreContext from '../misc/store-context';

import { QUERY_TOKEN } from '../misc/constants';

const AuthWrapper = ({ children }) => {
	const [initializing, setInitializing] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const { auth } = useContext(FirebaseContext)
	const { setUser, user, setCommentWriteToken } = useContext(StoreContext);

	const history = useHistory();
	const { search, pathname } = useLocation();

	const { addToast } = useToasts();

	const onAuthStateChanged = (newUser) => {			
		if (newUser) {
			setUser(newUser);
			setInitializing(false);
			return;
		}

		auth().signInAnonymously().catch(error => {
			addToast(error.message, { appearance: 'error' });
		});
	};

	const historyListen = () => setMenuOpen(false);

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
		const unlisten = history.listen(historyListen);

		const params = new URLSearchParams(search);

		if (params.has(QUERY_TOKEN)) {
			setCommentWriteToken(params.get(QUERY_TOKEN));
			params.delete(QUERY_TOKEN);
			history.push({ pathname, search: params.toString() });
		}

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
			addToast(error.message, { appearance: 'error' });
		});
	};

	const handleSignOut = () => {
		setMenuOpen(false);
		auth().signOut().then(() => {
			addToast('Successfully signed out.', { appearance: 'success' });
		}).catch(error => {
			addToast(error.message, { appearance: 'error' });
		});
	};

	const toggleMenu = () => setMenuOpen(prev => !prev);

	const renderMenu = () => {
		if (!menuOpen) return null;

		return (
			<div className="menu">
				<span>
					<Link to="/literature">
						<List size={22}/>
						<span>Literature Overview</span>
					</Link>	
				</span>
				<span>
					<Link to="/timeline">
						<Clock size={22}/>
						<span>Thesis Timeline</span>
					</Link>	
				</span>

				{ !user.isAnonymous 
					&& (
						<span>
							<Link to="/article/add">
								<FilePlus size={22}/>
								<span>Add Article</span>
							</Link>								
						</span>
					)
				}

				<span className="separator"></span>

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
				<CircleSpinner size={45} color="#00695C" />			
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