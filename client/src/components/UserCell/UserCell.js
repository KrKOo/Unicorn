import React, {Component} from 'react';

import axios from 'axios';
import styles from './UserCell.module.scss';

class UserCell extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            isMenuOpen: false
        }

        
    }

    componentDidMount()
    {

    }

    handleClick = (e) =>
    {
        if(e.currentTarget.className.includes('profileButton'))
        {
            this.props.toggleUserInfo(true, this.props.userID);
        }
        else if(e.currentTarget.className.includes('friendButton'))
        {

        }
    }

    render() {
        return(
            <div>
                {(this.props.userID) && 
                    <div className={styles.container}>
                        <div className={styles.menuContainer}>
                            <button className={styles.menuButton}><i class="fas fa-ellipsis-h"></i></button>
                            <ul className={styles.menu}>
                                <li onClick={this.handleClick} className="profileButton">Profile</li>
                                <li onClick={this.handleClick} className="friendButton">Add Friend</li>
                            </ul>
                        </div>
                        <img src={`/profileImages/${this.props.profileImg || "profilePlaceholder.jpg"}`} className={styles.profileImg}/>
                        <p className={styles.userName}>{this.props.username}</p>
                    </div>
                }
                
                
            </div>
        )
    }
}

export default UserCell;