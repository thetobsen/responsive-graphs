import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications'

import { FirebaseProvider } from './misc/firebase-context';
import { StoreProvider } from './misc/store-context';

import AuthWrapper from './components/AuthWrapper';
import LiteratureOverview from './components/LiteratureOverview';
import Article from './components/Article';
import AddArticle from './components/AddArticle';


import './main.scss';

const cats = [
	{ id: 'resp', title: '1 Responsive' },
	{ id: 'resp/vis', title: '1.1 Visualization' },
	{ id: 'lens', title: '2 Lenses'}
];



const App = () => {
	return (
		<FirebaseProvider>
			<StoreProvider>
				<Router>
					<ToastProvider autoDismiss autoDismissTimeout={3000}>
						<AuthWrapper>					
							<Switch>
								<Route exact path="/">
									<LiteratureOverview />
								</Route>
								<Route path="/articles/add">
									<AddArticle />
								</Route>
								<Route path="/articles/:bibId">
									<Article />
								</Route>
								<Route>
									<h1>Not found</h1>
								</Route>							
							</Switch>							
						</AuthWrapper>
					</ToastProvider>
				</Router>				
			</StoreProvider>
		</FirebaseProvider>
	)
};

export default App;