import React, { useContext, useEffect } from 'react';


import FirebaseContext from '../misc/firebase-context';
import StoreContext from '../misc/store-context';

import ListArticle from './ListArticle';

import { STRUCTURE } from '../misc/constants';
import { extractHierarchy } from '../misc/utils';
/**
 * How to correctly fit articles into categories:
 * 1. create object with category ids and their respective position in the hierarchy order
 * (so 1. Visualization should have order 0 and 1.1 Responsive Vis 1 ...)
 * 2. sort the article array based on the category order (sort function accepts custom callback)
 * see https://stackoverflow.com/questions/46781765/js-sort-by-specific-sort-order
 * 3. iterate over sorted array and record latest used category
 * 3.1 if it's a new category, create corresponding heading
 * 3.2 add article to the list
 */

const LiteratureOverview = () => {
	const { db } = useContext(FirebaseContext)
	const { articles, setArticles, user } = useContext(StoreContext);

	console.log('user', user.uid, user.isAnonymous);

	const generateStructure = () => {
		const sortedHeadings = Object.entries(STRUCTURE).sort((a, b) => a[1].order.localeCompare(b[1].order));

		// articles.sort((a, b) => STRUCTURE[a.category].order.localeCompare(STRUCTURE[b.category].order))

		let articleIndex = 0;
		return sortedHeadings.reduce((acc, heading) => {
			const depth = (heading[1].order.length + 1) / 3 + 1;			
			const name = `${extractHierarchy(heading[1].order)} ${heading[1].name}`;
			const Heading = `h${depth}`;

			acc.push(<Heading key={heading[0]}>{name}</Heading>);

			while (articleIndex < articles.length && articles[articleIndex].category === heading[0]) {
				const { bibId, title, authors, commentCount, publisher, abstract } = articles[articleIndex];
				acc.push(
					<ListArticle 
						bibId={bibId}
						title={title}
						authors={authors}
						commentCount={commentCount}
						publisher={publisher}
						abstract={abstract}
						key={bibId}
					/>
				);

				articleIndex++;
			}

			return acc;
		}, []);
	}

	useEffect(() => {
		if (articles.length === 0) {			
			db.collection('articles').get().then(snapshot => {
				const data = [];
				snapshot.forEach(doc =>	data.push({ ...doc.data(), id: doc.id }));

				data.sort((a, b) => STRUCTURE[a.category].order.localeCompare(STRUCTURE[b.category].order));
				setArticles(data);
			});
		}
	}, []);

	return (
		<div className="wrapper overview">
			<header>
				<h1>Literature Overview</h1>
				<span className="heading">Responsive Graphs: Adapting Node-Link Diagrams for Mobile Devices</span>
			</header>
			<main>
				{ generateStructure() }

			</main>
		</div>
	)
}

export default LiteratureOverview;