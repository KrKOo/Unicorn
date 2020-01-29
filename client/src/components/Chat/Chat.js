import React, {Component} from 'react'

import styles from './Chat.module.scss'

class Chat extends Component{
    constructor(props)
    {
        super(props);

        this.state = {
            inputText: "",
            chatHistory: []
        }

        
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.socket = this.props.socket;
    }

    componentDidMount()
    {
        
        //this.socket.emit('join', this.props.mapID);
        this.socket.on('message', (data) => {
            
            if(data.roomName == this.props.roomName)
            {
                console.log(data);
                this.setState(prevState => {
                    let message = {
                        username: data.username,
                        text: data.text
                    }
    
                    return {                    
                        chatHistory: [...prevState.chatHistory, message]
                    }
                });
            }
            
        });        
        
    }

    handleChange(e)
    {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e)
    {
        e.preventDefault()
        this.socket.emit('message', {
            roomName: this.props.roomName,
            text: this.state.inputText
        })

        this.setState({
            inputText: ''
        })

        
    }

    componentDidUpdate()
    {
        var element = document.getElementsByClassName("chatMessages");
        console.log(element)
        element[0].scrollTop = element[0].scrollHeight;
        element[1].scrollTop = element[1].scrollHeight;
    }

    render() {
        return <div className={`${styles.Chat} ${this.props.className}`} id={this.props.id} style={this.props.style}>
            <ul className={`chatMessages ${styles.messages}`}>
                <li>John: Hello my name is John</li>
                {this.state.chatHistory.map(message => <li>{`${message['username']}: ${message['text']}`}</li>)}  {/*TODO: Add componentShouldUpdate support*/}
            
            </ul>
            <form onSubmit={this.handleSubmit} className={styles.inputForm}>
                <input type="text" value={this.state.inputText} name="inputText" placeholder="Message..." onChange={this.handleChange} autoComplete="off"/>                
            </form>
        </div>;
    }
}

export default Chat;