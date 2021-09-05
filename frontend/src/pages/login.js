import React, { Component } from 'react';
import 'bulma/css/bulma.min.css';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
  deleteFromStorage
} from '../utils/storage/storage.js';
import { Redirect, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import './login.css'
import logo from '../signInWithGoogle.png'
import { initializeApp } from "firebase/app";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";





export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      token: '',
      signInError: '',
      firstName: '',
      lastName: '',
      signInEmail: '',
      signInPassword: '',
      signInUserName: ''
    }
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }
    render(){
      const {isLoading,
        token,
        signInEmail,
        signInPassword,
        signInError,
        firstName,
        lastName}=this.state
        var classNameEmail="input"
        var emailError=false
        var passwordError=false
        var classNamePassword="input"
        var buttonClassName='button is-info'

      if (isLoading){
        buttonClassName+=" is-loading"
      }

      if (signInError==="Error: Email cannot be blank."){
        classNameEmail="input is-danger"
        emailError=true
      }

      if (signInError==="Error: Password cannot be blank."){
        classNamePassword="input is-danger"
        passwordError=true
      }


      if (!token){
        return (
          <div style={{ display: 'flex', backgroundColor: `#007FFF`,alignItems: 'center', alignContent: `center`,alignText: `center`, height: `100vh`, width:`100%`}}>
            <form style={{display: `flex`, backgroundColor: `#FFFFFF`, flexDirection: `column`,  width: `50%`, height:`100%`, justifyContent: `center`, paddingLeft: `2%`, boxShadow: `0 0 6px 0 rgba(0, 0, 0, 2)`}}>
              <h3 className="title is-3" style={{textAlign: `center`}}>Sign In to Continue</h3>
              <img src={logo} width="30%" style={{align: 'center', "pointer-events": "all"}} onClick={this.onGoogle}    />
              <div className="field"><p className="help is-danger" style={{display: 'inline'}}>*</p><p className="help" style={{display: 'inline'}}>=Required</p></div>
              {(!emailError && !passwordError)? (<p className="help is-danger">{signInError}</p>):(null)}
              <div className="field"><label className="label" style={{fontWeight: "normal"}}>Email <p className="help is-danger" style={{display: 'inline'}}>*</p></label>
              <p className="control has-icons-left">
                <input style={{width: `50%`}} className={classNameEmail} type="email" placeholder="e.g alex@example.com" value={signInEmail} onChange={this.onTextboxChangeSignInEmail}/>
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </p>
              {(emailError)? (<p className="help is-danger">Cannot be blank</p>):(null)}</div>
              <div className="field"><label className="label" style={{fontWeight: "normal"}}>Password <p className="help is-danger" style={{display: 'inline'}}>*</p></label>
              <p className="control has-icons-left">
              <input style={{width: `50%`}} className={classNamePassword} type="password" placeholder="********" value={signInPassword} onChange={this.onTextboxChangeSignInPassword} />
              <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faLock} />
              </span>
              </p>
              {(passwordError)? (<p className="help is-danger">Cannot be blank</p>):(null)}</div>
              <div className="field mt-5" style={{justifyContent: 'center'}}><button type="button" className={buttonClassName} onClick={this.onSignIn} style={{width: `70%`,left: `15%`}}>Sign In</button></div>
              <div style={{display: 'flex', alignText: 'center', justifyContent: 'center', alignItems: 'center'}}>
              <p className="label mb-5" style={{fontWeight: "normal"}}>Dont Have an Account? <Link to="/signup">Sign Up Here!</Link></p></div>
            </form>

          </div>
          )
      }else{
        return (<Redirect to="/chat" />)
      }
    };

    async onGoogle(){
      console.log("in onGoogle")
        try{
          console.log("in try")
          const firebaseConfig = {
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_PROJECT_ID,
            storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
            appId: process.env.REACT_APP_APP_ID
          };
          const app = initializeApp(firebaseConfig);
          var provider = new GoogleAuthProvider();
          const auth = getAuth()
          let result= await signInWithPopup(auth, provider)
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log(credential)
          console.log(result)
          const token = credential.accessToken;
          const user = result.user;
        }catch(err){
          const errorCode = err.code;
          const errorMessage = err.message;
          const email = err.email;
          const credential = GoogleAuthProvider.credentialFromError(err);
        }
      };


    async onSignIn() {
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    const res=await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
    const jsonData=await res.json()
    if (jsonData.success) {
      setInStorage('SESS_ID', { token: jsonData.token });
      this.setState({
        isLoading: false,
        signInPassword: '',
        signInEmail: '',
        token: jsonData.token,
        firstName: jsonData.firstName,
        lastName: jsonData.lastName,
        userName: jsonData.userName
      });
      } else {
        this.setState({
          signInError: jsonData.message,
          isLoading: false,
        });
      }
    }

    onTextboxChangeSignInEmail(event) {
      if (event.target.value){
        this.setState({
        signInEmail: event.target.value,
      });
      }
    }

    onTextboxChangeSignInPassword(event) {
      this.setState({
        signInPassword: event.target.value,
      });
    }

    async componentDidMount(){
      const obj = getFromStorage('SESS_ID');
      if (obj && obj.token) {
        const { token } = obj;
        const res= await fetch('http://localhost:5000/verify?token=' + token)
        const jsonData=await res.json()
        if (jsonData.success) {
          await this.setState({
            token:token,
            isLoading: false,
            firstName: jsonData.firstName,
            lastName: jsonData.lastName,
            userName: jsonData.userName
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }
}
