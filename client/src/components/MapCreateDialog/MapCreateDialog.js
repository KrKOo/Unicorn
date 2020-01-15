import React, {Component} from 'react';

import axios from 'axios';
import styles from './MapCreateDialog.module.scss';

class MapCreateDialog extends Component{
    constructor(props)
    {
        super(props);
        this.state = {

        }

        
    }

    componentDidMount()
    {

    }

    handleClick = (e) => 
    {
        if(e.currentTarget.id == 'cancelButton')
        {
            this.props.onToggle();
        }
    }

    render() {
        return(
            <div className={`${this.props.className} ${styles.container}`}>
                <form>
                    <label for="roomName">Room Name</label>
                    <input type="text" id="roomName" name="roomName"/>
                    <div className={styles.buttonContainer}>
                        <input type="button" value="Cancel" id="cancelButton" onClick={this.handleClick}/>
                        <input type="submit" value="Create" id="submitButton"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default MapCreateDialog;