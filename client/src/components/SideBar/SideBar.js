import React, { Component } from "react";

import styles from './SideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

class SideBar extends Component {

	constructor() {
		super();
		this.state = {
			visible: true,
			isEditMode: false
		}
	}

	handleClick = (e) => 
	{
		if(e.currentTarget.className == 'navButton')
		{
			let sideBarContent = this.props.children[e.target.dataset.key];

			this.setState({sideBarContent:sideBarContent});
		}
		else if(e.currentTarget.id == 'mapModeButton')
		{
			this.props.onMapModeToggle();
		}
		else if(e.currentTarget.id == 'mapCreateButton')
		{
			this.props.onCreateRoomToggle();			
		}
		else if(e.currentTarget.id == 'leaveMapButton')
		{
			this.props.onDisconnect(undefined, false);
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
		let navList = [];
		this.props.children.forEach((element, key) =>
		{
			navList.push(<li key={key} data-key={key} onClick={this.handleClick} className="navButton">{element.props.title}</li>)
		});

		this.setState({
			sideBarContent: this.props.children[1],
			navList:navList
		});
	}

	render() {
		return (

			<div 
				className={`${styles.sideBar} ${this.props.className}`} 
				id="sideBar" 
				style={{left:(this.state.visible ? '0px' : -document.getElementById('sideBar').clientWidth)}}>

					{(this.props.toggle == 'true') && 
						<button className={`${styles.sideBarButton} ${(this.state.visible) ? '' : styles.right}`} onClick={this.toggleSideBar}><i class="fas fa-chevron-left fa-2x"></i></button>
					}
					
					<ul className={styles.navigation}>
						{this.state.navList}
					</ul>
					<div className={styles.content}>
						{this.state.sideBarContent}
					</div>

					<footer>
						<button 
							id="leaveMapButton"
							onClick={this.handleClick}>
								<i class="fas fa-phone-slash"></i>
						</button>
						<button 
							id="settingsButton"
							onClick={this.handleClick}>
								<i class="fas fa-cog"></i>
						</button>
						<button 
							id="mapModeButton" 
							onClick={this.handleClick}>
								<i class="fas fa-edit"></i>
						</button>
						<button
							id="mapCreateButton"
							onClick={this.handleClick}>
								<i class="far fa-plus-square"></i>
						</button>
						
					</footer>
			</div>
		);
	}
}

export default SideBar;