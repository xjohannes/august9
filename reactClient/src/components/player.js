import React from 'react';

function Player() {
	return (
		<div className="player">
			<div>
				<div id="playerControls" className="">
					<i className="glyphicon glyphicon-step-backward"></i>
					<i className="glyphicon glyphicon-play"></i>
					<i className="glyphicon glyphicon-step-forward"></i>
					<div id="playCircle" className="circle"></div>
				</div>
				<div id="progressBar">
					<div id="playedTime">0:00</div>
					<div id="playedBar"></div>
					<div id="dragBox"></div>
					<div id="slider" className="ui-draggable"></div>
					<div id="duration">0:00</div>
					<a href="#/queue">
						<div id="queue" className="glyphicon glyphicon-list"></div>
					</a>
				</div>


			</div>
		</div>
	);
}

export default Player;
