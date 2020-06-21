import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ExternalLink } from 'react-feather';

import { PUBLISHER } from '../misc/constants';

const ListArticle = ({ bibId, title, publisher, abstract, authors = [], commentCount = 0 }) => (
	<div className="art">
		<div className="title">
			<Link to={`/article/${bibId}`}>{title}</Link>
		</div>
		<div className="authors">
			{ authors.map(author => <span key={author}>{author}</span>) }
		</div>
		<div className="abstract">
			{ abstract }
		</div>
		<div className="actions">
			<div className="controls">
				<Link to={`/article/${bibId}`}><MessageSquare size=".9em" />{`${commentCount} Comments`}</Link>
			</div>
			<div className="publisher">
				{ publisher 
					&& <a
						href={publisher.url}
						target="_blank"
						rel="noreferrer noopener"
					>
						{PUBLISHER[publisher.id]}<ExternalLink size=".9em" />
					</a> 
				}
			</div>
		</div>
	</div>
);

export default ListArticle;