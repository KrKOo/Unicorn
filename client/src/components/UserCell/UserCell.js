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
        console.log('asdfasdf');
        this.setState(prevState => {
            return ({isMenuOpen: !prevState.isMenuOpen});
        })
    }

    render() {
        return(
            <div>
                {(this.props.userID) && 
                    <div className={styles.container}>
                        <div className={styles.menuContainer}>
                            <button className={styles.menuButton} onClick={this.handleClick}><i class="fas fa-ellipsis-h"></i></button>
                            <ul className={styles.menu}>
                                <li>Profile</li>
                                <li>Add Friend</li>
                            </ul>
                        </div>
                        <img src="https://www.appliedlogistics.co.nz/wp-content/uploads/2018/01/person-placeholder.jpg" className={styles.profileImg}/>
                        <p className={styles.userName}>{this.props.userID}</p>
                    </div>
                }
                
                
            </div>
        )
    }
}

export default UserCell;