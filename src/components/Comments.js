import React from 'react';
import { CircleSpinner } from 'react-spinners-kit';

import Comment from './Comment';

const Comments = ({ comments }) => {
	if (comments === null) 
		return <div className="center-notice"><CircleSpinner size={40} color="#00695C" /></div>;

	if (comments.length === 0)
		return <div className="center-notice missing-content">No comments yet</div>;

	return (
		<div className="comments">
			{
				comments.map(comment => {
					const { content, postedBy, postedAt, id } = comment;
					return <Comment
						author={postedBy}
						content={content}
						time={postedAt.seconds * 1000}
						key={id}
					/>;
				})
			}						
		</div>
	)
}

export default Comments;