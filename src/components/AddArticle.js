import React, { useState, useContext } from 'react';
import { Select, Input, Form, TextArea, Button } from 'semantic-ui-react';
import { useToasts } from 'react-toast-notifications';
import 'semantic-ui-css/semantic.min.css';

import { PUBLISHER as PUB_LIST, STRUCTURE } from '../misc/constants';
import { extractHierarchy } from '../misc/utils';
import FirebaseContext from '../misc/firebase-context';

const publisherOptions = Object.entries(PUB_LIST).map(e => ({ value: e[0], text: e[1] }));
const categoryOptions = Object.entries(STRUCTURE).map(h => ({
	value: h[0],
	text: `${extractHierarchy(h[1].order)} ${h[1].name}`
}));


const AddArticle = () => {
	const [title, setTitle] = useState('');
	const [bibId, setBibId] = useState('');
	const [authors, setAuthors] = useState(['']);
	const [publisher, setPublisher] = useState({ id: '', url: '' });
	const [abstract, setAbstract] = useState('');
	const [publication, setPublication] = useState('');
	const [notes, setNotes] = useState(['']);
	const [category, setCategory] = useState('');
	const [loading, setLoading] = useState(false);

	const { db } = useContext(FirebaseContext);
	const { addToast } = useToasts();

	const addAuthor = () => setAuthors(prev => [...prev, '']);
	const addNote = () => setNotes(prev => [...prev, '']);

	const changeNote = (e, note) => {
		setNotes(prev => ([
			...prev.slice(0, note['data-index']),
			note.value,
			...prev.slice(note['data-index'] + 1)
		]));
	};

	const changeAuthor = (e, author) => {
		setAuthors(prev => ([
			...prev.slice(0, author['data-index']),
			author.value,
			...prev.slice(author['data-index'] + 1)
		]));
	};

	const changeTitle = (e, { value }) => setTitle(value);
	const changeAbstract = (e, { value }) => setAbstract(value);
	const changePublication = (e, { value }) => setPublication(value);
	const changePublisherId = (e, { value }) => setPublisher(prev => ({ ...prev, id: value }));
	const changePublisherUrl = (e, { value }) => setPublisher(prev => ({ ...prev, url: value }));
	const changeBibId = (e, { value }) => setBibId(value);
	const changeCat = (e, { value }) => setCategory(value);

	const onSubmit = () => {
		setLoading(true);

		const newArticle = {
			title,
			bibId,
			category,
			publisher,
			publication,
			abstract,

			notes: notes.filter(n => n.length > 0),
			authors: authors.filter(a => a.length > 0),

			commentCount: 0,
			noteCount: 0,
		};

		db.collection('articles').add(newArticle)
			.then(() => {
				setTitle('');
				setBibId('');
				setAuthors(['']);
				setPublisher({ id: '', url: '' });
				setAbstract('');
				setPublication('');
				setNotes(['']);
				setCategory('');
			})
			.catch(err => {
				addToast(err.message, { appearance: 'error' });
				console.warn(err);
			})
			.finally(() => {
				setLoading(false);
			});

	};


	return (
		<div className="wrapper new-article">
			<header><h1>Add new article</h1></header>
			<main>
				<Form loading={loading}>
					<Form.Group widths="two" className="form-group-title">
						<Form.Field 
							control={Input}
							label="Title"
							placeholder="Responsive Visualizations"
							value={title}
							onChange={changeTitle}
						/>

						<Form.Field 
							control={Input}
							label="Bib Id"
							placeholder="ED20"
							value={bibId}
							onChange={changeBibId}
						/>
					</Form.Group>

					<Form.Field 
						control={Select}
						label="Category"
						placeholder={'e.g. ' + categoryOptions[0].text}
						options={categoryOptions}
						value={category}
						onChange={changeCat}
					/>

					<Form.Group widths="3" className="form-group-wrap">
						{ 
							authors.map((author, i) => {
								return (
									<Form.Field 
										control={Input}
										value={author}
										placeholder="Charles Dickens"
										label={`Author Nr. ${i+1}`}
										key={i}
										data-index={i}
										onChange={changeAuthor}
									/>
								)
							})
						}
					</Form.Group>
					<Form.Field control={Button} onClick={addAuthor}>Add author</Form.Field>

					<Form.Group widths="equal">
						<Form.Field 
							control={Select}
							label="Publisher"
							placeholder={'e.g. ' + publisherOptions[0].text}
							options={publisherOptions}
							value={publisher.id}
							onChange={changePublisherId}
						/>
						<Form.Field 
							control={Input}
							label="URL"
							placeholder="https://dl.acm.org/doi/10.2312/eurp.20171182"
							value={publisher.url}
							onChange={changePublisherUrl}
						/>
					</Form.Group>

					<Form.Group widths="equal">			        	
						<Form.Field
							control={TextArea}
							label='Abstract'
							placeholder='As mobile visualization is increasingly used and new mobile device form factors and...'
							value={abstract}
							onChange={changeAbstract}
						/>
						<Form.Field
							control={TextArea}
							label="Publication"
							placeholder="CHI EA '18: Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems..."
							value={publication}
							onChange={changePublication}
						/>
					</Form.Group>

					<Form.Group widths="two" className="form-group-wrap">
						{ 
							notes.map((note, i) => {
								return (
									<Form.Field 
										control={Input}
										value={note}
										placeholder="Contains relevant references and..."
										label={`Note Nr. ${i+1}`}
										data-index={i}
										key={i}
										onChange={changeNote}
									/>
								)
							})
						}
					</Form.Group>
					<Form.Field control={Button} onClick={addNote}>Add note</Form.Field>

					<div className="submitIt">
						<Button primary onClick={onSubmit}>Save article</Button>
					</div>
				</Form>
			</main>
			
		</div>
	);

};

export default AddArticle;

