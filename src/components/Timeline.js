import React, { useContext, useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import Chart from "react-google-charts";
import dayjs from 'dayjs';
import { CheckCircle } from 'react-feather';
import { CircleSpinner } from 'react-spinners-kit';

import FirebaseContext from '../misc/firebase-context';
import mc from '../misc/material-colors';

const MIN_DATE = new Date(2020, 5, 1);
const MAX_DATE = new Date(2020, 10, 20);

const chartColumns = [
	{ type: 'string', id: 'Chapter' },
	{ type: 'string', id: 'Task' },
	{ type: 'string', id: 'style', role: 'style' },
	{ type: 'string', role: 'tooltip' },
	{ type: 'date', id: 'Start' },
	{ type: 'date', id: 'End' }
];

const dateDiff = (d1, d2, unit = 'day') => {
	return dayjs(d1).diff(dayjs(d2), unit);
};

const category = {
	'Research Phase': { baseColor: mc.teal[500], lightColor: mc.teal[200] },
	'Conceptual Phase': { baseColor: mc.deepOrange[500], lightColor: mc.deepOrange[200] },
	'Implementation Phase': { baseColor: mc.indigo[500], lightColor: mc.indigo[200] },
	'Writing Phase': { baseColor: mc.pink[500], lightColor: mc.pink[200] },
};

const categoryOrder = {
	'Research Phase': '1',
	'Conceptual Phase': '2',
	'Implementation Phase': '3',
	'Writing Phase': '4',
};

const getTooltip = (datum) => {
	return ReactDOMServer.renderToString(
		<div style={{minWidth: 200}}>
			<div className="task">{datum.task}</div>
			<div className="info">
				<span>Timeframe:</span>
				<span>{`${dayjs(datum.start).format('MMM D')} - ${dayjs(datum.end).format('MMM D')}`}</span>
			</div>
			<div className="info">
				<span>Deadline:</span>
				<span>{`${Math.max(0, dateDiff(datum.end, new Date()))} days left`}</span>
			</div>
			<div className="info">
				<span>Duration:</span>
				<span>
					{`${dateDiff(datum.end, datum.start)} days`}
				</span>
			</div>

			{
				(datum.subTasks && datum.subTasks.length > 0) && (
					<div className="info">
						<span>Sub Tasks:</span>
						<ul>
							{
								(datum.subTasks || []).map(s => (
									<li key={s} className={s.done ? 'done' : ''}>
										<CheckCircle size={12} />
										<span>{s.task}</span>
									</li>
								))
							}
						</ul>
					</div>
				)
			}
		</div>
	)
};

const Timeline = () => {
	const [schedule, setSchedule] = useState([]);
	const { db } = useContext(FirebaseContext);

	useEffect(() => {
		if (schedule.length === 0) {			
			db().collection('timeline').get().then(snapshot => {
				const today = new Date();
				const fireData = [];
				const scheduleData = [
					chartColumns,
					[ '\0', 'Today', 'color: #ff0000', '', today, today]
				];

				snapshot.forEach(doc =>	{ 
					const rawData = doc.data();
					const d = { ...rawData, start: rawData.start.toDate(), end: rawData.end.toDate() };
					const color = d.uncertain ? category[d.category].lightColor : category[d.category].baseColor;

					fireData.push([
						d.category,
						d.task,
						`fill-color: ${color}`,
						getTooltip(d),
						d.start,
						d.end
					]);
				});

				fireData.sort((a, b) => categoryOrder[a[0]].localeCompare(categoryOrder[b[0]]));
				scheduleData.push(...fireData);
				setSchedule(scheduleData);
			});
		}
	}, []);

	if (schedule.length === 0) {
		return (
			<div className="wrapper timeline">
				<div className="center-notice"><CircleSpinner size={45} color="#00695C" /></div>
			</div>
		);
	}

	return (
		<div className="wrapper timeline" key={Date.now()}>
			<h1>Timeline</h1>
			<Chart				
				width={'100%'}
				height={'calc(100% - 108px)'}
				chartType="Timeline"
				loader={<div className="center-notice"><CircleSpinner size={45} color="#00695C" /></div>}
				data={schedule}
				options={{					
					timeline: {
						showRowLabels: true,
					},	
					allowHtml: true,
				}}
				rootProps={{ 'data-testid': '1' }}
				chartEvents={[
					{
						eventName: 'ready',
						callback: () => {
							const rects = document.querySelectorAll('[id^="reactgooglegraph-"] svg rect');
							const height = Array.from(rects).reduce((maxHeight, node) => {
								if (+node.getAttribute('x') === 0 && +node.getAttribute('y') === 0) {
									const h = +node.getAttribute('height');
									if (h > maxHeight) return h;
								}
								return maxHeight;
							}, 0);

							const textNodes = document.querySelectorAll('[id^="reactgooglegraph-"] svg text');
							const todayText = Array.from(textNodes).filter(n => n.textContent === 'Today');
							const todayRect = todayText[0].previousSibling;							

							todayText[0].remove();
							todayRect.remove();

							const maxDays = dateDiff(MAX_DATE, MIN_DATE, 'hour');
							const relative = dateDiff(new Date(), MIN_DATE, 'hour') / maxDays;

							const gs = document.querySelectorAll('[id^="reactgooglegraph-"] svg > g');
							const { x, width } = gs[3].getBBox();

							const svg = document.querySelector('[id^="reactgooglegraph-"] svg');
							const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
							g.setAttribute('id', 'markers');
							svg.insertBefore(g, gs[3]);

							const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
							rect.setAttribute('x', Math.round(x + relative * width));
							rect.setAttribute('y', 0);
							rect.setAttribute('width', 1);
							rect.setAttribute('height', height);
							rect.setAttribute('fill', '#ff0000');

							g.append(rect);
						}
					}
				]}
			/>
		</div>
	);
};

export default Timeline;