import React, { Component, useState } from 'react';
const ws = new WebSocket('ws://localhost:5000/');

export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      message: '',
      users: [],
      messages: []
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
        <button type="button" onClick={this.onSubmit}>Submit?</button><br />
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
        users: [...this.state.users,event.target.value]
      });
  }

  onSubmit(){
    ws.send(JSON.stringify({
      type: 'message',
      user: this.state.users[-1],
      message: this.state.message
    }))
  }


  componentDidMount(){
    ws.onopen=()=>{
      console.log('Web Socket is connected')
    };
    ws.onmessage=(message)=>{
      console.log('in on message')
      const dataFromServer=JSON.parse(message.data);
      console.log('got reply',dataFromServer)
    }
  }
}
