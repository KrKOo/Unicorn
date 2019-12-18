import React, { Component } from "react";

import styles from './SideBar.module.scss';

class SideBarCategory extends Component {

	constructor() {
		super();
		this.state = {
		}
	}

	componentDidMount()
	{
		
	}

	render() {
		return (			
            <div className={styles.SideBarCategory}>
                {this.props.children}
            </div>
		);
	}
}

export default SideBarCategory;