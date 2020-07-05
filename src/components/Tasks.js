import React, { useState, useContext, useEffect } from 'react';
import { Bookmark, Trash2 } from 'react-feather';
import ReactMarkdown from 'react-markdown';

import FirebaseContext from '../misc/firebase-context';

const Tasks = () => {
	const [notes, setNotes] = useState([]);
	const { db } = useContext(FirebaseContext);

	useEffect(() => {
		db().collection('notes').get().then(snapshot => {
			const fireData = [];			

			snapshot.forEach(doc =>	{
				fireData.push({ ...doc.data(), id: doc.id });
			});

			setNotes(fireData);
		});
	}, []);

	return (
		<>
			<h2>Tasks & Notes</h2>
			<div className="notes-wrapper">
				{
					notes.map(n => (
						<div key={n.id} className={n.pinned ? 'pinned' : ''}>
							<div className="content">
								<ReactMarkdown source={n.content} />
							</div>
							<button className="actn-btn pin"><Bookmark size={18}/></button>
							<button className="actn-btn delete"><Trash2 size={18}/></button>
						</div>
					))
				}				

			</div>
		</>
	);
};

export default Tasks;