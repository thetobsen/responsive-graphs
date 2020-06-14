import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import { db } from './misc/firebase';

import LiteratureOverview from './components/LiteratureOverview';

import Test from './Test';

import './main.scss';

const cats = [
	{ id: 'resp', title: '1 Responsive' },
	{ id: 'resp/vis', title: '1.1 Visualization' },
	{ id: 'lens', title: '2 Lenses'}
];



const App = () => {
	// const categoryItems = data.reduce((acc, entry) => {
	// 	if (acc[entry.category] === undefined) {
	// 		acc[entry.category] = [];
	// 	}

	// 	acc[entry.category].push(entry);
	// 	return acc;
	// }, {})

	// db.ref('/database/articles').once('value').then(s => console.log(s))
	db.collection('articles').get().then(snapshot => {
		snapshot.forEach(doc => {
			console.log(doc.id, doc.data())

			db.collection('comments').where('postedTo', '==', doc.id).get().then(s => {
				s.forEach(comment => {
					console.log(comment.id, comment.data());
				})
			})

		})
	})


	return (
		<div className="grid">			
			<Router>
				<Switch>
					<Route exact path="/">
						<LiteratureOverview />
					</Route>
					<Route path="/articles/:id">
						<Test />
					</Route>
					<Route>
						<h1>Not found</h1>
					</Route>
					
				</Switch>
			</Router>		
		</div>
	)
};

export default App;