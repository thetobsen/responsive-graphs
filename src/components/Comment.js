import React from 'react';
import { format } from 'timeago.js';
import { User } from 'react-feather';

const Comment = ({ author, time, content }) => {
	const avatarBg = time % 7 + 1;

	return (
		<div className="comment">
			<div className="thumbnail">
				<span className={`avatar c-${avatarBg}`}>
					<User size={30}/>
				</span>
			</div>
			<div className="body">
				<div className="metadata">
					<span className="commenter">{author}</span>
					<span className="time">{format(time)}</span>
				</div>
				<div className="content">
					{ content }
				</div>				
			</div>
		</div>
		)
};

export default Comment;