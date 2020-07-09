import React, { useState, useContext, useEffect } from 'react';
import { Bookmark, Trash2 } from 'react-feather';
import ReactMarkdown from 'react-markdown';

import FirebaseContext from '../misc/firebase-context';

const Tasks = () => {
	const [notes, setNotes] = useState([]);
	const { db } = useContext(FirebaseContext);

	useEffect(() => {
		db().collection('notes')
			.where("archived", "==", false)
			.get().then(snapshot => {
				const regularTasks = [];
				const pinnedTasks = [];

				snapshot.forEach(doc =>	{
					const data = doc.data();
					if (data.pinned) pinnedTasks.push({ ...data, id: doc.id });
					else regularTasks.push({ ...data, id: doc.id });
				});

				setNotes([...pinnedTasks, ...regularTasks]);
			});
	}, []);

	const handlePin = (e) => {
		const id = e.currentTarget.dataset.id;
		const noteIdx = notes.findIndex(n => n.id === id);
		db().collection('notes').doc(id)
			.update({ pinned: !notes[noteIdx].pinned })
			.then(() => {
				setNotes(prev => ([
					...prev.slice(0, noteIdx),
					{ ...notes[noteIdx], pinned: !notes[noteIdx].pinned },
					...prev.slice(noteIdx + 1)
				]));
			});
	};

	const handleArchive = (e) => {
		const id = e.currentTarget.dataset.id;
		const noteIdx = notes.findIndex(n => n.id === id);
		db().collection('notes').doc(id)
			.update({ archived: true })
			.then(() => {
				setNotes(prev => ([
					...prev.slice(0, noteIdx),
					...prev.slice(noteIdx + 1)
				]));
			});
	};

	return (
		<>
			<h2>Tasks & Notes</h2>
			<div className="notes-wrapper">
				{
					notes.map(n => (
						<div key={n.id} className={n.pinned ? 'pinned' : ''}>
							<div className="content">
								<ReactMarkdown source={n.content.replace(/\\n/g, '\n')} />
							</div>
							<button
								className="actn-btn pin"
								data-id={n.id}
								onClick={handlePin}
							>
								<Bookmark size={18}/>
							</button>
							<button
								className="actn-btn delete"
								data-id={n.id}
								onClick={handleArchive}
							>
								<Trash2 size={18}/>
							</button>
						</div>
					))
				}				

			</div>
		</>
	);
};

export default Tasks;