import React, { Component } from "react";

import styles from './SideBar.module.scss';

class SideBar extends Component {

	constructor() {
		super();
		this.state = {
			visible: true
		}
	}

	handleClick = (e) => 
	{
		let sideBarContent = this.props.children[e.target.dataset.key];

		this.setState({sideBarContent:sideBarContent});
	}

	toggleSideBar = (e) =>
	{
		this.setState((prevState) => ({visible: !prevState.visible}));
		console.log(this.state.visible);
		//e.target.parentNode.style.left = ;
	}

	componentDidMount()
	{
		let navList = [];
		this.props.children.forEach((element, key) =>
		{
			navList.push(<li key={key} data-key={key} onClick={this.handleClick}>{element.props.title}</li>)
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

					<button className={`${styles.sideBarButton} ${(this.state.visible) ? '' : styles.right}`} onClick={this.toggleSideBar}><i class="fas fa-chevron-left fa-2x"></i></button>
					<ul className={styles.navigation}>
						{this.state.navList}
					</ul>
					<div>
						{this.state.sideBarContent}
					</div>
			</div>
		);
	}
}

export default SideBar;