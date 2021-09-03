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
        <div id="MainCanvas" style={{height: `100%`, overflow: 'hidden'}}>
          <div style={{opacity: `100%`,width: `100%`, position: "fixed", bottom:`4px`, zIndex: `9999`}}>
              <form onSubmit={this.onSubmit}>
                <input className="input" placeholder="Type Message here" id="message" type="text" onChange={this.onTextboxChangeMessage} value={this.state.message} style={{position: "fixed", bottom:`4px`,width: `85%`, height: `5%`,marginLeft: `1%`}}/>
              </form>
              <button type="submit" className="button is-info" style={{left: `88%`, width: `10%`, height: `5%`}}>Submit</button><br />
          </div>
          <div style={{heigth: '100%', width: '100%',paddingBottom: `1%`}}>
          {this.state.messages.map((message, i) => (
          <div style={{heigth: '100%', paddingLeft: `1%`, paddingRight: `1%`, paddingBottom: `1%`, zIndex: `9998`}}>
            <p style={{textAlign: (message.user===this.state.user) ? 'right' : 'left'}}>
            <p className="has-text-weight-light" style={{color: "#CCCCCC", fontSize: `11px`}}>{message.user}</p>
              <span className={(message.user===this.state.user)? ("tag is-medium is-info") : ("tag is-medium is-success")} style={{width: "fit-content"}}>
                  {message.message}
              </span>
            </p>
            <br />
          </div>
          ))}
        </div>
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
    console.log("in submit")
    event.preventDefault();
    socket.emit("message", JSON.stringify({
      time: Date.now(),
      user: this.state.user,
      message: this.state.message
    }))
    this.state.message=""
  }

  componentDidMount(){
    socket.emit("get message")
    socket.on('send message',(message)=>{
      this.setState({
      messages: [...this.state.messages,message]
      })
    })
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err}`);
    })
  }
}
