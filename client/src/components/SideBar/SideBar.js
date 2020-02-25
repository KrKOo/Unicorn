import React, { Component } from "react";

import styles from './SideBar.module.scss';

class SideBar extends Component {

	constructor() {
		super();
		this.state = {
			visible: true,
			isEditMode: false,
			sideBarContent: 'server'
		}
	}

	handleClick = (e) => 
	{
		if(e.currentTarget.className === 'navButton')
		{


			this.setState({sideBarContent:e.target.dataset.key});
		}
		else if(e.currentTarget.id === 'mapModeButton')
		{
			this.props.onMapModeToggle();
		}
		else if(e.currentTarget.id === 'mapCreateButton')
		{
			this.props.onCreateRoomToggle();			
		}
		else if(e.currentTarget.id === 'leaveMapButton')
		{
			this.props.onLeave(null, false);
		}
	}

	toggleSideBar = (e) =>
	{
		this.setState((prevState) => ({visible: !prevState.visible}),
		() => 
		{
			console.log(this.state.visible);
			(this.props.onToggle && this.props.onToggle(this.state.visible));
		});
		//e.target.parentNode.style.left = ;
	}

	componentDidMount()
	{

	}

	render() {
		return (

			<div 
				className={`${styles.sideBar} ${this.props.className}`} 
				id="sideBar" 
				style={{left:(this.state.visible ? '0px' : -document.getElementById('sideBar').clientWidth)}}>

					{(this.props.toggle === 'true') && 
						<button className={`${styles.sideBarButton} ${(this.state.visible) ? '' : styles.right}`} onClick={this.toggleSideBar}><i class="fas fa-chevron-left fa-2x"></i></button>
					}
					
					<ul className={styles.navigation}>
						<li data-key="server" onClick={this.handleClick} className="navButton">Servers</li>
						<li data-key="friends" onClick={this.handleClick} className="navButton">Friends</li>
					</ul>

					<div className={styles.content}>
						{this.props[this.state.sideBarContent]}
					</div>

					<footer>
						<button 
							id="leaveMapButton"
							onClick={this.handleClick}>
								<i className="fas fa-phone-slash"></i>
						</button>
						<button 
							id="settingsButton"
							onClick={this.handleClick}>
								<i className="fas fa-cog"></i>
						</button>
						<button 
							id="mapModeButton" 
							onClick={this.handleClick}>
								<i className="fas fa-edit"></i>
						</button>
						<button
							id="mapCreateButton"
							onClick={this.handleClick}>
								<i className="far fa-plus-square"></i>
						</button>
						
					</footer>
			</div>
		);
	}
}

export default SideBar;