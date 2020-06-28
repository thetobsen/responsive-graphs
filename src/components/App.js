import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications'

import { FirebaseProvider } from '../misc/firebase-context';
import { StoreProvider } from '../misc/store-context';

import AuthWrapper from './AuthWrapper';
import LiteratureOverview from './LiteratureOverview';
import Article from './Article';
import AddArticle from './AddArticle';
import Timeline from './Timeline';
import Home from './Home';
import TimeTracker from './TimeTracker';

import '../main.scss';

const App = () => {
	return (
		<FirebaseProvider>
			<StoreProvider>
				<Router>
					<ToastProvider autoDismiss autoDismissTimeout={3000}>
						<AuthWrapper>					
							<Switch>
								<Route exact path="/">
									<Home />
								</Route>
								<Route path="/literature">
									<LiteratureOverview />
								</Route>
								<Route path="/article/add">
									<AddArticle />
								</Route>
								<Route path="/article/:bibId">
									<Article />
								</Route>
								<Route path="/timeline">
									<Timeline />
								</Route>
								<Route path="/tracker">
									<TimeTracker />
								</Route>
								<Route>
									<div className="wrapper">
										<div className="center-notice">
											<h1>That page doesn&apos;t exist!</h1>		
										</div>
									</div>
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