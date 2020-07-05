import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { useToasts } from 'react-toast-notifications';
import { ChevronDown } from 'react-feather';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

// import 'semantic-ui-css/semantic.min.css';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import 'rc-time-picker/assets/index.css';

import FirebaseContext from '../misc/firebase-context';
import { getPrettifiedDuration } from '../misc/utils';
 
 const TimeTracker = () => {
	const [startTime, setStartTime] = useState(moment());
	const [endTime, setEndTime] = useState(moment().add(1, 'hours'));
	const [date, setDate] = useState(new Date());
	const [task, setTask] = useState('');
	const [trackingData, setTrackingData] = useState([]);
	const [activeEntry, setActiveEntry] = useState(null);

	const { db } = useContext(FirebaseContext);

	const { addToast } = useToasts();

	useEffect(() => {
		db().collection('tracker')
		.orderBy('date', 'desc')
		.limit(14)
		.get().then(snapshot => {
			const data = [];
			snapshot.forEach(doc =>	{ 
				data.push({...doc.data(), id: doc.id});
			});
			setTrackingData(data);
		})
		.catch((err) => addToast(err.message, { appearance: 'error' }));
	}, []);

	const changeDate = (event, data) => setDate(data.value);
	const changeStartTime = d => setStartTime(d);
	const changeEndTime = d => setEndTime(d);
	const changeTask = e => setTask(e.target.value);

	const onSubmit = () => {
		if (!endTime.isAfter(startTime)) {
			addToast('Starting time has to be before ending time.', { appearance: 'warning' });
			return;
		}

		if (task.length === 0) {
			addToast('Task must not be empty.', { appearance: 'warning' });
			return;
		}

		const dateId = moment(date).format('YYYYMMDD');
		
		const entry = {
			start: startTime.format('HH:mm'),
			end: endTime.format('HH:mm'),
			task
		};

		db().collection('tracker').doc(dateId).set({
			date: date,
			times: db.FieldValue.arrayUnion(entry)
		}, { merge: true })
		.then(() => {
			setTask('');
			addToast('Successfully added tracked task.', { appearance: 'info' });

			const existingIndex = trackingData.findIndex(t => t.id === dateId);
			if (existingIndex !== -1) {
				const existingEntry = trackingData[existingIndex];
				const updatedEntry = {
					...existingEntry,
					times: [
						...existingEntry.times,
						entry
					]
				};

				const newState = [
					...trackingData.slice(0, existingIndex),
					updatedEntry,
					...trackingData.slice(existingIndex + 1)
				];

				setTrackingData(newState);

				return;
			}

			setTrackingData([
				{ date: { seconds: Math.floor(date.getTime() / 1000) }, id: dateId, times: [entry] },
				...trackingData
			]);

		})
		.catch((err) => addToast(err.message, { appearance: 'error' }));
	};

	const handleRowClick = ({ currentTarget: { dataset: { id }} }) => setActiveEntry(prev => prev === id ? null : id);

	return (
		<div className="wrapper tracker">
			<header>
				<h1>Time Tracker</h1>
			</header>
			<div className="form-wrapper">
				<Form>
					<Form.Group widths="three" className="form-group-title">
						<Form.Field 
							control={SemanticDatepicker}
							label="Date"
							className="date-field"
							value={date}
							onChange={changeDate}
						/>
						<Form.Field 
							control={TimePicker}
							label="Start time"
							showSecond={false}
							className="semantic-like time-field"
							popupClassName="semantic-like--popup"
							value={startTime}
							onChange={changeStartTime}
						/>
						<Form.Field 
							control={TimePicker}
							label="End time"
							showSecond={false}
							className="semantic-like time-field"
							popupClassName="semantic-like--popup"
							value={endTime}
							onChange={changeEndTime}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Field
							control={Input}
							label="Completed task"
							placeholder="e.g. created descriptive illustration"
							className="task-field"
							value={task}
							onChange={changeTask}
						/>
						<Form.Field
							control={Button}
							primary
							className="save-field"
							onClick={onSubmit}
						>
							Save tracking data
						</Form.Field>
						
					</Form.Group>
				</Form>
			</div>
			<div className="data">

				<div className="tracking-dates-table">
					<div className="date-row t-head">
						<div></div>
						<div>Date</div>
						<div>Duration</div>
						<div>Tracked times</div>
					</div>
					{
						trackingData.map((datum) => {
							const tracked = datum.times.reduce((acc, time) => {
								const begin = moment(time.start, 'HH:mm');
								const end = moment(time.end, 'HH:mm');
								const duration = moment.duration(end.diff(begin));

								acc.toRender.push((
									<div className="time-row" key={datum.id + time.start}>
										<div>{time.start}</div>
										<div>{time.end}</div>
										<div>{getPrettifiedDuration(duration)}</div>
										<div>{time.task}</div>
									</div>
								));

								acc.duration.add(duration);

								return acc;

							}, {duration: moment.duration(0, 'minutes'), toRender: []});

							const rowClasses = 'date-row' + (activeEntry === datum.id ? ' active' : '');

							return (
								<div className="date-row-wrapper" key={datum.id}>
									<div className={rowClasses} data-id={datum.id} onClick={handleRowClick}>
										<div className="dd-icon"><ChevronDown size={16}/></div>
										<div>{moment(datum.date.seconds * 1000).format('DD.MM.YYYY')}</div>
										<div>{getPrettifiedDuration(tracked.duration)}</div>
										<div>{tracked.toRender.length}</div>
									</div>
									<div className="tracking-times">
										<div className="hrchy-indicator" />
										<div className="tracking-times-table">
											<div className="time-row t-head">
												<div>Begin</div>
												<div>End</div>
												<div>Duration</div>
												<div>Tracked Task</div>
											</div>
											{ tracked.toRender }
										</div>
									</div>
								</div>
							);
						})
					}
				</div>
			</div>			
		</div>
	);
 };

 export default TimeTracker;