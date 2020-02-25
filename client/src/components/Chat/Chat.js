import React, {Component} from 'react'
import axios from 'axios';
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
        this.getMessages();
        //this.socket.emit('join', this.props.mapID);
        this.socket.on('message', (data) => {
            
            if(data.roomID === this.props.roomID && data.mapID === this.props.mapID)
            {
                console.log(data);
                this.setState(prevState => {
                    return {                    
                        chatHistory: [...prevState.chatHistory, data]
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
            mapID: this.props.mapID,
            roomID: this.props.roomID,
            text: this.state.inputText
        })

        this.setState({
            inputText: ''
        })        
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.roomID !== this.props.roomID || prevProps.mapID !== this.props.mapID) {
          this.getMessages();
        }
        var element = document.getElementsByClassName("chatMessages");
        element[0].scrollTop = element[0].scrollHeight;
        element[1].scrollTop = element[1].scrollHeight;
    }

    getMessages = () => {
        let self = this;
        const roomID = this.props.roomID!==undefined?this.props.roomID:'';
        axios.get(`/chat/get/${this.props.mapID}/${roomID}`)
            .then(function (response) {
                console.log(response.data);
                
                self.setState({chatHistory: response.data});                
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return <div className={`${styles.Chat} ${this.props.className}`} id={this.props.id} style={this.props.style}>
            <ul className={`chatMessages ${styles.messages}`}>
                {this.state.chatHistory.map((message, index) =>
                    <li key={index}>                    
                        <div className={styles.flexImage}>
                            <img src={`/profileImages/${message.profileImg}`} className={styles.profileImg}/>
                        </div>
                        <div className={styles.flexContent}>
                            <p className={styles.header}>{message.username}<span className={styles.time}>{message.sent_at}</span></p>
                            <p className={styles.text}>{message.text}</p>
                        </div>
                    </li>
                )}
            
            </ul>
            {!this.props.isDisabled &&
                <form onSubmit={this.handleSubmit} className={styles.inputForm}>
                    <input 
                        type="text" 
                        value={this.state.inputText} 
                        name="inputText" 
                        placeholder="Message..." 
                        onChange={this.handleChange} 
                        autoComplete="off"
                    />                
                </form>
            }
            
        </div>;
    }
}

export default Chat;