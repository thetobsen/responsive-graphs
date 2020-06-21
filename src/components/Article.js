import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'react-feather';
import { CircleSpinner } from 'react-spinners-kit';
import TextareaAutosize from 'react-textarea-autosize';
import { useToasts } from 'react-toast-notifications';
import classNames from 'classnames';

import FirebaseContext from '../misc/firebase-context';
import StoreContext from '../misc/store-context';
import { QUERY_TOKEN } from '../misc/constants';

import Comments from './Comments';

const Article = () => {
	const [commentFocus, setCommentFocus] = useState(false);
	const [commentSending, setCommentSending] = useState(false);
	const [article, setArticle] = useState(null);
	const [content, setContent] = useState('');
	const { bibId } = useParams();

	const { addToast } = useToasts();

	const { db } = useContext(FirebaseContext);
	const { comments, setComments, commentWriteToken, user } = useContext(StoreContext);

	useEffect(() => {
		db().collection('articles').where('bibId', '==', bibId).limit(1).get().then(snapshot => {
			if (!snapshot.empty) {
				setArticle({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id});				
			}
		});
	}, [bibId]);

	useEffect(() => {
		if (article === null) return;
		if (comments?._bibId === bibId) return;

		db().collection('comments')
			.where('postedTo', '==', article.id)
			.orderBy('postedAt', 'desc')
			.get().then(snapshot => {
				const cmmtns = [];
				snapshot.forEach(comment => cmmtns.push({ ... comment.data(), id: comment.id }));
				setComments({ data: cmmtns, _bibId: bibId });
			});
	}, [article])


	const handleFocus = () => setCommentFocus(true);

	const handleBlur = (e) => {
		if (e.currentTarget.value.length === 0) {
			setCommentFocus(false);
		}
	}

	const handleCommentChange = (e) => setContent(e.currentTarget.value);

	const handleSend = () => {
		if (content.length > 0) {
			setCommentSending(true);

			const newComment = {
				content: content,
				postedTo: article.id,
				postedBy: 'Anonymous',
				postedById: user?.uid,
				postedAt: new Date(),
				[QUERY_TOKEN]: commentWriteToken
			};

			const commentRef = db().collection('comments').doc();
			const articleRef = db().collection('articles').doc(article.id);
			const newCommentCount = article.commentCount + 1;

			const batch = db().batch();
			batch.set(commentRef, newComment);
			batch.update(articleRef, { commentCount: newCommentCount });

			batch.commit().then(() => {
				newComment.id = commentRef.id;
				newComment.postedAt = { seconds: Math.floor(newComment.postedAt.getTime() / 1000) }

				setComments({ data: [newComment, ...comments.data], _bibId: comments._bibId });
				setContent('');
				setCommentFocus(false);
				setArticle({ ...article, commentCount: newCommentCount });
			})
			.catch(err => {
				addToast(err.message, { appearance: 'error' });
			})
			.finally(() => {
				setCommentSending(false);
			});
		}
	}

	const newCommentClasses = classNames('new-comment', { expanded: commentFocus })

	if (article === null) {
		return (
			<div className="wrapper article">
				<div className="center-notice"><CircleSpinner size={45} color="#00695C" /></div>
			</div>
		);
	}

	const { title, authors, commentCount, publication, notes = [], abstract = '' } = article;

	return (
		<div className="wrapper article">
			<header>
				<Link to="/"><ArrowLeft /> Back to Overview</Link>
				<h1>{title}</h1>
			</header>
			<main>
				<div className="info">
					<div className="authors">
						<span className="label">Authors:</span>
						{ authors.map(author => <span key={author} className="author">{author}</span>) }
					</div>
					<div className="publication">
						<span className="label">Publication:</span>
						<span className="pub">{publication}</span>
					</div>

				</div>
				<div className="abstract">
					{ abstract }
				</div>
				<div className="notes-container">
					<h2>Notes</h2>		
					<div className="notes">
						{ notes.length === 0
							? <div className="center-notice missing-content">No notes yet</div>
							: (
								<ul>
									{ notes.map(n => <li key={n}>{n}</li>) }
								</ul>
							)
						}
					</div>			
				</div>
				<div className="comments-container">
					<h2>
						Comments
						<span className="comment-count">{commentCount}</span>
					</h2>
					<div className={newCommentClasses}>
						<TextareaAutosize
							placeholder="Leave a comment"
							maxRows={6}
							minRows={3}
							onFocus={handleFocus}
							onBlur={handleBlur}
							value={content}
							onChange={handleCommentChange}
						/>
						<div className="actions">
							<span className="posting-as">
								<span>Posting as</span> 
								<span className="name">Anonymous</span>
							</span>
							<button
								className="send"
								onClick={handleSend}
								role="button"
							>
								{commentSending
									? <CircleSpinner size={20} color="#f5f5f5" />
									: <Send />
								}
							</button>
						</div>
					</div>

					<Comments comments={comments.data} />
				</div>


			</main>

		</div>

	);
};

export default Article;