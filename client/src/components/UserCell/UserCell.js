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
            const data = {
                friendID: this.props.userID,
                isAdd: true
            }
            axios.post('/users/manageFriend', data, {headers: {'Content-Type': 'application/json'}})
            .then(async res => {                
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            });
        }
    }

    render() {
        return(
            <div>
                {(this.props.userID) && 
                    <div className={styles.container}>
                        <div className={styles.menuContainer}>
                            <button className={styles.menuButton}><i className="fas fa-ellipsis-h"></i></button>
                            <ul className={styles.menu}>
                                <li onClick={this.handleClick} className="profileButton">Profile</li>
                                {!this.props.isThisUser &&
                                    <li onClick={this.handleClick} className="friendButton">Add Friend</li>
                                }
                            </ul>
                        </div>
                        <img src={`/profileImages/${this.props.profileImg || "profilePlaceholder.jpg"}`} className={styles.profileImg}/>
                        <p className={styles.userName} title={this.props.username}>{this.props.username}</p>
                    </div>
                }
                
                
            </div>
        )
    }
}

export default UserCell;