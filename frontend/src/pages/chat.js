import io from "socket.io-client";
import React, { Component, useState } from 'react';
import 'bulma/css/bulma.min.css';
import {
  setInStorage,
  getFromStorage,
  deleteFromStorage
} from '../utils/storage/storage.js';
import {Redirect} from "react-router-dom"
import './chat.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLevelUpAlt} from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
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
      user: "" ,
      token: "",
      message: '',
      messages: [],
      isLoading: true,
      themeChange: false
    }
    this.onTextboxChangeMessage = this.onTextboxChangeMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.logout=this.logout.bind(this)
  }

  render() {
    const {
        user,
        token,
        isLoading,
        themeChange}=this.state
    var divBackground=""
    if (themeChange){
      divBackground="has-background-black"
    }else{
      divBackground=""
    }
    if (token){
      return (
        <div id="MainCanvas" className="has-background-black" style={{height: `100%`, zIndex: `-1`}}>
          <div style={{opacity: `1`,height: `100%`, width: `100%`, position: "fixed", paddingBottom:`1%`, paddingTop: `1%`, top:`91%`, zIndex: `1`, backdropFilter: `blur(10px)`}}>
            <div className="dropdown is-up is-hoverable " style={{position: "fixed", left:`6%`}}>
              <div className="dropdown-trigger" aria-haspopup="true" aria-controls="dropdown-menu7">
                <button className={(themeChange) ? "button is-black is-inverted is-outlined" : "button"} >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faCog} aria-hidden="true" />
                  </span>
                </button>
              </div>
              <div className={(themeChange) ? "dropdown-menu has-background-black " : "dropdown-menu"} id="dropdown-menu7" role="menu">
                <div className={(themeChange) ? "dropdown-content has-background-black" : "dropdown-content"}>
                  <a onClick={()=> this.setState({themeChange: !themeChange})} className={(themeChange) ? "dropdown-item has-text-white" : "dropdown-item"}>
                      Change Theme
                  </a>
                  <a className={(themeChange) ? "dropdown-item has-text-white" : "dropdown-item"}>
                      Profile
                  </a>
                  <hr className="dropdown-divider" />
                  <div className="dropdown-item">
                    <a onClick={this.logout} className={(themeChange) ? "dropdown-item has-text-white" : "dropdown-item"}>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
              <form onSubmit={this.onSubmit}>
                <div className="control has-icons-right" style={{width: `81.5%`, marginLeft: `9%`}}>
                <input className={(themeChange) ? "input is-white has-background-black has-text-white" : "input"} placeholder="Type Message here" id="message" type="text" onChange={this.onTextboxChangeMessage} value={this.state.message}/>
                <span className="icon is-small is-right" style={{pointerEvents: 'initial', cursor: "pointer"}}>
                  <button type="submit" className="button is-info" style={{ width: `0.1%`, height: `80%`}}><FontAwesomeIcon icon={faLevelUpAlt}/></button >
                </span>
                </div>
              </form>

          </div>
          <div id="Messages" className={divBackground} style={{position: `absolute`, height: `100%` , width: '100%', paddingTop: `0.5%`, paddingBottom: `6%`,overflow: 'scroll'}}>
          {this.state.messages.map((message, i) => (
          <div style={{heigth: '100%', paddingLeft: `2%`, paddingRight: `2%`, zIndex: `-1`}}>
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
    }else if (!isLoading && !token) {
      return <Redirect to="/login" />
      }else{
          return (<Redirect to="/chat" />);
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
    socket.emit("message", JSON.stringify({
      time: Date.now(),
      user: this.state.user,
      message: this.state.message
    }))
    this.state.message=""
    var element=document.getElementById('Messages')
    console.log(element.scrollHeight+60)
    console.log(element.scrollHeight)
    element.scrollTop = element.scrollHeight+150;

  }

  async logout() {
        this.setState({
          isLoading: true,
        });
        const { token } = this.state;
        const res= await fetch('http://localhost:5000/logout?token=' + token)
        const jsonData=await res.json()
        if (jsonData.success) {
          deleteFromStorage()
          this.setState({
            token: '',
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
  }


  async componentDidMount(){
    console.log(window.pageYOffset)
    const obj = getFromStorage('SESS_ID');
    if (obj && obj.token){
      const { token } = obj;
      const res= await fetch('http://localhost:5000/verify?token=' + token);
      const jsonData=await res.json()
      if (jsonData.success) {
          await this.setState({
            user: jsonData.userName,
            isLoading: false,
            token: token
          });
      }else{
        this.setState({
            isLoading: false,
          });
      }
    }else{
      this.setState({
        isLoading: false,
      });
    }
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
