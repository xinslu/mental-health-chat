import io from "socket.io-client";
import React, { Component, useState } from 'react';
import 'bulma/css/bulma.min.css';
import {Redirect} from "react-router-dom"
const socket = io.connect('http://localhost:5000/');

socket.on('disconnect', function () {
  console.log("in disconnect")
  socket.removeAllListeners('connect')
  socket.removeAllListeners('message')
  socket.removeAllListeners('disconnect')
  socket.removeAllListeners('send message')
  socket.close()
})

export default class chat extends Component{
  constructor(props){
    super(props);
    this.state={
      user: (this.props.location.state!=undefined) ? this.props.location.state.user : "" ,
      message: '',
      messages: []
    }
    this.onTextboxChangeMessage = this.onTextboxChangeMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    if (this.state.user){
      return (
        <div>
          <input className="input" placeholder="Type Message here" type="text" onChange={this.onTextboxChangeMessage} style={{position:"fixed", bottom:`2px`, width: `90%`, height: `5%`}}/><br />
          <button type="submit" onClick={this.onSubmit} className="button" style={{position:"fixed", bottom:`2px`, left: `90%`, width: `10%`, height: `5%`}}><i className="fas fa-angle-right" /></button><br />
          {this.state.messages.map((message, i) => (
          <div style={{heigth: '100%', width: '100%', paddingLeft: `1%`, paddingRight: `1%` }}>
            <p style={{textAlign: (message.user===this.state.user) ? 'left' : 'right'}}>
            <p className="has-text-weight-light" style={{color: "#CCCCCC", fontSize: `11px`}}>{message.user}</p>
              <span className={(message.user===this.state.user)? ("tag is-medium is-info") : ("tag is-medium is-success")} style={{width: "fit-content"}}>
                  {message.message}
              </span>
            </p>
            <br />
          </div>
          ))}
        </div>
      );
    }else{
      console.log("in else rn");
      return <Redirect to="/" />

    }
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
      time: Date.now(),
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
