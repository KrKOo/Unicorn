import React, { Component } from "react";
import axios from 'axios';
import openSocket from 'socket.io-client';

class App extends Component {

  

  constructor()
  {
    super();
    this.state = {
      inputText: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.socket = openSocket('http://localhost:8000');
  }

  componentDidMount()
  {
    fetch("/users").then(async (res)=> {
      const text = await res.text()
      console.log(text);

      
      this.socket.on("Test", (data) => console.log(data));
      
    })
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
      <form onSubmit={this.handleSubmit}>
        <input type='text' value={this.state.inputText} name="inputText" placeholder="Message..." onChange={this.handleChange}/>
        <button>Submit</button>
      </form>
    </div>;
  }
}

export default App;