import React, { Component, useState } from 'react';
import io from "socket.io-client";

const socket = io.connect('http://localhost:5000/'
);


socket.on("connect_error", (err) => {
  console.log('in error')
  console.log(`connect_error due to ${err}`);
});

export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      message: '',
      user: '',
      message: ''
    }
    this.onTextboxChangeMessage = this.onTextboxChangeMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTextboxChangeUser = this.onTextboxChangeUser.bind(this);
  }


  render() {
      return (
        <div>
          <input placeholder="Type Message here" type="text" onChange={this.onTextboxChangeMessage} /><br />
          <input placeholder="User" type="text" onChange={this.onTextboxChangeUser} /><br />
          <button type="button" onClick={this.onSubmit}>Submit</button><br />
        </div>
      );
    }

  onTextboxChangeMessage(event) {
      this.setState({
        message: event.target.value
      });
  }

  onTextboxChangeUser(event) {
      this.setState({
        user: event.target.value
      });
  }

  onSubmit(){
    socket.send(JSON.stringify({
      time: Date().toLocaleString(),
      user: this.state.user,
      message: this.state.message
    }))
    console.log('Message Sent')
  }
}


//   componentDidMount(){
//     socket.onconnection=()=>{
//       console.log('Web Socket is connected')
//     };
//     socket.onmessage=(message)=>{
//       console.log('in on message in react')
//       const dataFromServer=JSON.parse(message.data);
//       console.log('got reply',dataFromServer)
//     }
//   }
// }
