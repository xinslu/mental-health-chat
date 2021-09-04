import React, { Component, useState } from 'react';
import chat from "./chat.js";
import {Redirect} from "react-router-dom";

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
                <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                      <a className="navbar-item">
                        <img height="auto" width="50" />
                      </a>
                    </div>
                    <div className="navbar-end">
                      <div className="navbar-item">
                        <div className="buttons">
                          <a className="button is-info" href="/signup">
                            <strong>Sign up</strong>
                          </a>
                          <a className="button is-light" href="/login">
                            Log in
                          </a>
                        </div>
                      </div>
                    </div>
                </nav>
                <div style={{paddingTop: `10%`}}>
                    <h1>Welcome Home!</h1>
                    <input placeholder="User" type="text" onChange={this.onTextboxChangeUser} /><br />
                    <button type="submit" onClick={this.onSubmit}>Submit</button><br />
                </div>
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
            state: { user: this.state.userName}
        })
    }
}
