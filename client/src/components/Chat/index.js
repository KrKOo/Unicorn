import React, {Component} from 'react'

class Chat extends Component{
    constructor(props)
    {
        super(props);

        this.state = {
            inputText: "",
            privateChat: ""
        }

        this.privateChat = []
        
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.socket = this.props.socket;
    }

    componentDidMount()
    {
        fetch("/users").then(async (res)=> {
            const text = await res.text()
            console.log(text);
        })

        this.socket.on("Test", (data) => {
            console.log(data);

            this.setState(prevState => {
                return {                    
                    privateChat: [...prevState.privateChat, <li>{data.text}</li>]
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
    }

    render() {
        return <div>
        <ul className="privateChatMessages">
            {this.state.privateChat}
        </ul>
        <form onSubmit={this.handleSubmit}>
            <input type='text' value={this.state.inputText} name="inputText" placeholder="Message..." onChange={this.handleChange}/>
            <button>Submit</button>
        </form>
        </div>;
    }
}

export default Chat;