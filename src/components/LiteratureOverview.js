import React, { useContext, useEffect } from 'react';

import FirebaseContext from '../misc/firebase-context';
import StoreContext from '../misc/store-context';

import ListArticle from './ListArticle';

import { STRUCTURE } from '../misc/constants';
import { extractHierarchy } from '../misc/utils';

const LiteratureOverview = () => {
	const { db } = useContext(FirebaseContext)
	const { articles, setArticles } = useContext(StoreContext);

	const generateStructure = () => {
		const sortedHeadings = Object.entries(STRUCTURE).sort((a, b) => a[1].order.localeCompare(b[1].order));

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
			db().collection('articles').get().then(snapshot => {
				const data = [];
				snapshot.forEach(doc =>	{ 
					const article = doc.data();
					if (article.category in STRUCTURE) data.push({ ...doc.data(), id: doc.id });
				});

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