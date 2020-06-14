import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'react-feather'

const data = [
	{ name: 'asd', category: 'resp'	},
	{ name: '13', category: 'resp/vis'	},
	{ name: 'fa', category: 'resp/vis'	},
	{ name: 'asss', category: 'resp'	},
	{ name: 'vv', category: 'lens'	},	
];


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



	return (
		<div className="wrapper overview">
			<header>
				<h1>Literature Overview</h1>
				<span className="heading">Responsive Graphs: Adapting Node-Link Diagrams for Mobile Devices</span>
			</header>
			<main>
				<h2>1 Responsive Design</h2>
				<div className="article">
					<div className="title">
						<Link to={"/articles/peter"}>Interactive Lenses for Visualization: An Extended Survey: Interactive Lenses for Visualization</Link>
					</div>
					<div className="authors">
						<span>Tominski</span>
						<span>Gladisch</span>
						<span>Kister</span>
					</div>
					<div className="actions">
						<div className="controls">
							<Link to={"/articles/asd"}><MessageSquare size=".9em" />0 Comments</Link>
						</div>
						<div className="research-platforms">Elsevier, IEEE Xplore, ACM DL, Wiley</div>
					</div>
				</div>

				<div className="article">
					<div className="title">MultiLens: Fluent Interaction with Multi-Functional Multi-Touch Lenses for Information Visualization</div>
					<div className="actions">
						<div className="controls">asds ad</div>
						<div className="research-platforms">Elsevier, IEEE Xplore, ACM DL</div>
					</div>
				</div>

				<div className="article">
					<div className="title">Edge bundling in information visualization</div>
					<div className="actions">
						<div className="controls">asds ad</div>
						<div className="research-platforms">Elsevier, IEEE Xplore, ACM DL</div>
					</div>
				</div>
				<h3>1.1 Responsive Visualizations</h3>

			</main>
		</div>
	)
}

export default LiteratureOverview;