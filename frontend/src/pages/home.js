import React, { Component, useState } from 'react';
import chat from "./chat.js"
import {Redirect} from "react-router-dom"

export default class home extends Component{
    constructor(props){
        super(props);
        this.state={
          user: '',
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onTextboxChangeUser = this.onTextboxChangeUser.bind(this);
    }

    render(){
        return(
            <div>
                <h1>Welcome Home!</h1>
                <input placeholder="User" type="text" onChange={this.onTextboxChangeUser} /><br />
                <button type="submit" onClick={this.onSubmit}>Submit</button><br />
            </div>
        )
    }

    onTextboxChangeUser(event) {
      this.setState({
        user: event.target.value
      });
    }

    onSubmit(event){
        console.log("In submit rn");
        this.props.history.push({
            pathname: '/chat',
            state: { user: this.state.user}
        })
    }
}
