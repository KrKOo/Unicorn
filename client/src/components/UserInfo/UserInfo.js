import React, {Component} from 'react';

import axios from 'axios';
import styles from './UserInfo.module.scss';

class UserInfo extends Component{
    constructor(props)
    {
        super(props);
        this.state = {

        }

        
    }

    componentDidMount()
    {

    }

    render() {
        return(
            <div className={`${this.props.className} ${styles.container}`}>
                <header>
                    <img src="https://www.appliedlogistics.co.nz/wp-content/uploads/2018/01/person-placeholder.jpg"/>
                    <p class={styles.username}>KrKO_o</p>
                    <p class={styles.userid}>#53982</p>
                </header>
                <article>
                    Description: ....
                </article>
            </div>
        )
    }
}

export default UserInfo;