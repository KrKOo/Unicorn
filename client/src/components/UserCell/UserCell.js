import React, {Component} from 'react';

import axios from 'axios';
import styles from './UserCell.module.scss';

class UserCell extends Component{
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
            <div className={styles.container}>
                {(this.props.userID) && 
                    <img src="https://www.appliedlogistics.co.nz/wp-content/uploads/2018/01/person-placeholder.jpg" className={styles.profileImg}/>
                }
                <p className={styles.userName}>{this.props.userID}</p>
                
            </div>
        )
    }
}

export default UserCell;