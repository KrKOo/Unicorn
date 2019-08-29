import React, { Component } from "react";
import axios from 'axios';

class App extends Component {

  componentDidMount()
  {
    fetch("/users").then(async (res)=> {
      const text = await res.text()
      console.log(text);
    })
  }

  render() {
    return <div>I'M READY TO USE THE BACK END APIS! :-)</div>;
  }
}

export default App;