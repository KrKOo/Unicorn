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
        this.socket.on("Test", (data) => {
            console.log(data);

            this.setState(prevState => {
                let message = {
                    username: 'Bob',
                    text: data.text
                }

                return {                    
                    chatHistory: [...prevState.chatHistory, message]
                }
            })
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
        this.socket.emit('Test', {
            text: this.state.inputText
        })

        this.setState({
            inputText: ''
        })
    }

    render() {
        return <div className={`${styles.Chat} ${this.props.className}`} id={this.props.id}>
            <ul className={styles.messages}>
                <li>John: Hello my name is John</li>
                {this.state.chatHistory.map(message => <li>{`${message['username']}: ${message['text']}`}</li>)}  {/*TODO: Add componentShouldUpdate support*/}
            
            </ul>
            <form onSubmit={this.handleSubmit} className={styles.inputForm}>
                <input type="text" value={this.state.inputText} name="inputText" placeholder="Message..." onChange={this.handleChange}/>                
            </form>
        </div>;
    }
}

export default Chat;