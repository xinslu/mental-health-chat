import io from "socket.io-client";
import React, { Component, useState } from 'react';
import 'bulma/css/bulma.min.css';
const socket = io.connect('http://localhost:5000/');

socket.on('disconnect', function () {
  socket.removeAllListeners('connect')
  socket.removeAllListeners('message')
  socket.removeAllListeners('disconnect')
  socket.removeAllListeners('send message')
  socket.close()
  console.log('a user disconnected')
})

export default class chat extends Component{
  constructor(props){
    super(props);
    this.state={
      message: '',
      user: '',
      message: '',
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
          <button type="submit" onClick={this.onSubmit}>Submit</button><br />
          {this.state.messages.map((message, i) => (
          <div style={{heigth: '100%', width: '100%' }}>
            <p style={{textAlign: (message.user==="kinshuk") ? 'left' : 'right'}}>
              <span className={(message.user==="kinshuk")? ("tag is-medium is-info") : ("tag is-medium is-success")} style={{width: "fit-content"}}>
                  {message.message}
              </span>
            </p>
            <br />
          </div>
          ))}
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

  onSubmit(event){
    event.preventDefault();
    socket.send(JSON.stringify({
      time: Date().toLocaleString(),
      user: this.state.user,
      message: this.state.message
    }))
  }

  componentDidMount(){
    socket.on('send message',(message)=>{
      this.setState({
        messages: [...this.state.messages,message]
      })
    })
    socket.on("connect_error", (err) => {
      console.log('in error')
      console.log(`connect_error due to ${err}`);
    })
  }
}
