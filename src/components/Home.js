import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
	<div className="wrapper">
		<h1>
			You can either go to the&nbsp;
			<Link to="/literature">Literature Overview</Link> 
			&nbsp;or to the&nbsp;
			<Link to="/timeline">Thesis Timeline</Link>.
		</h1>

	</div>
);

export default Home;