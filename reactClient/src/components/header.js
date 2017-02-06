import React from 'react';

function Header() {
		return (
				<div className="navbar navbar-default navbar-fixed-top headerContainer">
					<header className="">
						<div className="logoContainer ">
							<span className="slogan">— music production for every mood</span>
							<a href="#/" className="logo"><h1>August9</h1></a>
						</div>


						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
										data-target=".navbar-collapse">
							<span className='sr-only'>Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
					</header>

					<ul className="nav navbar-nav navbar-right collapse navbar-collapse">
						<li><a href="#/login">login</a></li>
						<li><a href="#/logout">logout</a></li>
						<li><a href="#/project/newProject" className="admin hidden">New project</a></li>
					</ul>
				</div>
		);
}

export default Header;
