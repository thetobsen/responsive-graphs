import React, { useState, useContext, useEffect, useMemo } from 'react';
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
 
 const AddTracking = () => {
	const [startTime, setStartTime] = useState(moment());
	const [endTime, setEndTime] = useState(moment().add(1, 'hours'));
	const [date, setDate] = useState(new Date());
	const [task, setTask] = useState('');
	const [trackingData, setTrackingData] = useState([]);

	const { db } = useContext(FirebaseContext);

	const { addToast } = useToasts();

	useEffect(() => {
		db().collection('tracker').get().then(snapshot => {
			const data = [];
			snapshot.forEach(doc =>	{ 
				data.push({...doc.data(), id: doc.id});
			});
			setTrackingData(data);
		});
	}, []);

	const changeDate = (event, data) => setDate(data.value);
	const changeStartTime = d => setStartTime(d);
	const changeEndTime = d => setEndTime(d);
	const changeTask = e => setTask(e.target.value);

	// console.log(moment('08:33', 'HH:mm'))

	const onSubmit = () => {
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
		})
		.catch((err) => addToast(err.message, { appearance: 'error' }));

	};

	// https://medium.com/@snowleo208/how-to-create-responsive-table-d1662cb62075
	// https://dribbble.com/shots/6802141-Applicants-Page/attachments
	// https://github.com/moment/moment/issues/463
	// https://github.com/Gizra/garmentbox/issues/183

	// https://stackoverflow.com/questions/48083728/group-dates-by-week-javascript
	// https://css-tricks.com/css-nth-of-class-selector/

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

				<div className="grid-table">
					<div className="t-grid t-head">
						<div></div>
						<div>Date</div>
						<div>Duration</div>
						<div>Tracked times</div>
					</div>
					<div className="t-grid">
						<div><ChevronDown size={14}/></div>
						<div>25.06.2020</div>
						<div>02:55 h</div>
						<div>5</div>
					</div>

				</div>

				<table className="overview-table">
					<thead>
						<tr>
							<th></th>
							<th>Date</th>
							<th>Duration</th>
							<th>Tracked times</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><ChevronDown size={14}/></td>
							<td>25.06.2020</td>
							<td>02:55 h</td>
							<td>5</td>
						</tr>
						<tr className="date-details">
							<td colSpan="4">
								<table className="detail-table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Begin</th>
											<th>End</th>
											<th>Duration</th>
											<th>Task</th>
										</tr>
									</thead>								
									<tbody>
										<tr>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
										</tr>

									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>+</td>
							<td>25.06.2020</td>
							<td>02:55 h</td>
							<td>5</td>
						</tr>
						<tr className="date-details">
							<td colSpan="4">
								<table className="detail-table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Begin</th>
											<th>End</th>
											<th>Duration</th>
											<th>Task</th>
										</tr>
									</thead>								
									<tbody>
										<tr>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
										</tr>

									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>+</td>
							<td>25.06.2020</td>
							<td>02:55 h</td>
							<td>5</td>
						</tr>
						<tr className="date-details">
							<td colSpan="4">
								<table className="detail-table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Begin</th>
											<th>End</th>
											<th>Duration</th>
											<th>Task</th>
										</tr>
									</thead>								
									<tbody>
										<tr>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
										</tr>

									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>+</td>
							<td>25.06.2020</td>
							<td>02:55 h</td>
							<td>5</td>
						</tr>
						<tr className="date-details">
							<td colSpan="4">
								<table className="detail-table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Begin</th>
											<th>End</th>
											<th>Duration</th>
											<th>Task</th>
										</tr>
									</thead>								
									<tbody>
										<tr>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
											<td>asd</td>
										</tr>

									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>


				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Begin</th>
							<th>End</th>
							<th>Duration</th>
							<th>Task</th>
						</tr>
					</thead>
					<tbody>
						{
							trackingData.reduce((acc,datum) => {
								datum.times.forEach(time => {
									const date = moment(datum.date.seconds * 1000);
									const begin = moment(time.start, 'HH:mm');
									const end = moment(time.end, 'HH:mm');
									const duration = moment.utc(end.diff(begin)).format('HH:mm [h]')

									acc.push((
										<tr key={datum.id + time.start}>
											<td>{date.format('DD.MM.YYYY')}</td>
											<td>{time.start}</td>
											<td>{time.end}</td>
											<td>{duration}</td>
											<td>{time.task}</td>

										</tr>
									));
								});

								return acc;
							}, [])
						}


					</tbody>
				</table>


			</div>
			
		</div>
	);
 };

 export default AddTracking;