import React, {Component} from 'react';

import axios from 'axios';
import styles from './RoomCreateDialog.module.scss';

class RoomCreateDialog extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            roomBackground: '#000000',
            saveMessages: false
        }       
        this.socket = this.props.socket;
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

    onChange = (e) =>
    {
        const {name, value} = e.target;
        if(e.target.type == 'checkbox')
        {
            const isChecked = e.target.checked;
            this.setState({[name]:isChecked});
        }
        else
        {
            this.setState({[name]:value});
        }       
        
    }

    onSubmit = (e) =>
    {
        e.preventDefault()
        if(this.state.roomName && this.state.roomBackground)
        {
            this.socket.emit('roomCreate', {
                roomName: this.state.roomName,
                mapID: this.props.mapID,
                roomBackground: this.state.roomBackground,
                password: this.state.password,
                saveMessages: this.state.saveMessages        
            });
            this.props.onToggle();
        }
    }

    render() {
        return(
            <div className={`${this.props.className} ${styles.container}`}>
                <form onSubmit={this.onSubmit}>
                    <h3>Create Room</h3>
                    <div className={styles.inputs}>
                        <input type="text" id="roomName" name="roomName" onChange={this.onChange} placeholder="Room Name"/>
                        <input type="color" id="roomBackground" name="roomBackground" onChange={this.onChange}/><br />
                        <input type="password" id="password" name="password" onChange={this.onChange} placeholder="Password"/>
                                               
                    </div>

                    <div class={styles.content}>
                        
                        <label for="saveMessages">Save Messages </label> 
                        <input type="checkbox" id="saveMessages" name="saveMessages" onChange={this.onChange}/>
                        
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <input type="button" value="Cancel" id="cancelButton" onClick={this.handleClick}/>
                        <input type="submit" value="Create" id="submitButton"/>
                    </div>
                    
                </form>
            </div>
        )
    }
}

export default RoomCreateDialog;