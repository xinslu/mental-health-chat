import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../utils/storage/storage.js';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Redirect } from 'react-router-dom';


export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpLastName: '',
      signUpFirstName: '',
      signUpUserName: ''
    }
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpUserName = this.onTextboxChangeSignUpUserName.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  };
    render(){
      const {isLoading,
        token,
        signUpEmail,
        signUpPassword,
        signUpLastName,
        signUpFirstName,
        signUpError,
        signUpUserName}=this.state
        var firstNameError=false
        var lastNameError=false
        var emailError=false
        var passwordError=false
        var userNameError=false
        var classNameEmail="input"
        var classNamePassword="input"
        var classNameFirstName="input"
        var classNameLastName="input"
        var classNameUserName="input"
        var buttonClassName='button is-info'
      if (isLoading){
        buttonClassName+=" is-loading"
      }
      if (signUpError==="Error: First Name cannot be blank."){
        classNameFirstName="input is-danger"
        firstNameError=true
      }

      if (signUpError==="Error: Last Name cannot be blank."){
        classNameLastName="input is-danger"
        firstNameError=true
      }

      if (signUpError==="Error: User Name cannot be blank."){
        classNameUserName="input is-danger"
        userNameError=true
      }

      if (signUpError==="Error: Email cannot be blank."){
        classNameEmail="input is-danger"
        emailError=true
      }

      if (signUpError==="Error: Password cannot be blank."){
        classNamePassword="input is-danger"
        passwordError=true
      }

      if (signUpError==="Registered"){
        <Redirect to="/login" />
      }

      if (!token){
        return (
          <div style={{ display: 'flex',backgroundColor: "#007FFF", alignItems: 'center', height: `100vh`, width:`100%`}}>
            <form style={{display: `flex`, backgroundColor: `#FFFFFF`, flexDirection: `column`, width: `50%`, justifyContent: `center`, height: `100%`, paddingLeft: `2%`, boxShadow: `0 0 6px 0 rgba(0, 0, 0, 2)`, paddingRight: `1%`}}>
              <h3 className="title is-3" style={{textAlign: `center`}}>Sign Up</h3>
              <div class="field"><p className="help is-danger">*Required</p></div>
              {(!emailError && !passwordError && !firstNameError && ! userNameError)? (<p className="help is-danger">{signUpError}</p>):(null)}
              <div class="field">
                <label className="label" style={{fontWeight: "normal"}}>Name <p className="help is-danger" style={{display: 'inline'}}>*</p></label>
                <div class="field-body">
                  <div class="field">
                    <p className="control has-icons-left"><input className={classNameFirstName} type="text" placeholder="First Name" value={signUpFirstName} onChange={this.onTextboxChangeSignUpFirstName}/><span className="icon is-small is-left"><FontAwesomeIcon icon={faUser} /></span></p>
                    {(firstNameError)? (<p className="help is-danger">Cannot be blank</p>):(null)}
                  </div>
                  <div class="field" >
                    <p className="control has-icons-left"><input className={classNameLastName} type="text" placeholder="Last Name" onChange={this.onTextboxChangeSignUpLastName}/><span className="icon is-small is-left"><FontAwesomeIcon icon={faUser} /></span></p>
                    {(lastNameError)? (<p className="help is-danger is-align-self-center" style={{alignText: 'left',alignContent: 'left', justifyContent: 'left'}}>Cannot be blank</p>):(null)}
                  </div>
                </div>
              </div>
              <div class="field"><label className="label" style={{fontWeight: "normal"}}>Username <p className="help is-danger" style={{display: 'inline'}}>*</p></label>
              <p className="control has-icons-left">
                <input style={{width: `50%`}} className={classNameUserName} type="text" placeholder="someCoolUserName" value={signUpUserName} onChange={this.onTextboxChangeSignUpUserName}/>
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faUserCircle} />
                </span>
              </p>
              {(userNameError)? (<p className="help is-danger">Cannot be blank</p>):(null)}</div>
              <div class="field"><label className="label" style={{fontWeight: "normal"}}>Email <p className="help is-danger" style={{display: 'inline'}}>*</p></label>
              <p className="control has-icons-left">
                <input style={{width: `50%`}} className={classNameEmail} type="email" placeholder="e.g alex@example.com" value={signUpEmail} onChange={this.onTextboxChangeSignUpEmail}/>
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </p>
              {(emailError)? (<p className="help is-danger">Cannot be blank</p>):(null)}</div>
              <div class="field"><label class="label" style={{fontWeight: "normal"}}>Password <p className="help is-danger" style={{display: 'inline'}}>*</p></label>
              <p className="control has-icons-left">
              <input style={{width: `50%`}} className={classNamePassword} type="password" placeholder="********" value={signUpPassword} onChange={this.onTextboxChangeSignUpPassword} />
              <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faLock} />
              </span>
              </p>
              {(passwordError)? (<p className="help is-danger">Cannot be blank</p>):(null)}</div>

              <div class="field mt-5" style={{justifyContent: 'center'}}><button type="button" className={buttonClassName} onClick={this.onSignUp} style={{width: `70%`,left: `15%`}}>Sign Up</button></div>
            </form>
          </div>
          )
      }else{
        return this.props.history.push({
            pathname: '/chat',
            state: { user: this.state.userName}
        });
      }
    };

    async onSignUp() {
    const {
      signUpLastName,
      signUpFirstName,
      signUpEmail,
      signUpPassword,
      signUpUserName
    } = this.state;
    this.setState({
      isLoading: true,
    });
    console.log(signUpUserName)
    var res= await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
        userName: signUpUserName
      })
    })
    const jsonData=await res.json()
    if (jsonData.success) {
      const res=await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
    const jsonData=await res.json()
    if (jsonData.success) {
      setInStorage('SESS_ID', { token: jsonData.token });
      this.setState({
        signUpError: jsonData.message,
        isLoading: false,
        signUpEmail: '',
        signUpPassword: '',
        signUpLastName: '',
        signUpFirstName: '',
        signUpUserName: '',
        token: jsonData.token
      });
      } else {
        this.setState({
          signUpError: jsonData.message,
          isLoading: false,
        })
      }
  }else{
    this.setState({
          signUpError: jsonData.message,
          isLoading: false,
        });
  }
};



    onTextboxChangeSignUpEmail(event) {
      this.setState({
        signUpEmail: event.target.value,
      });
    }

    onTextboxChangeSignUpUserName(event) {
      this.setState({
        signUpUserName: event.target.value,
      });
    }

    onTextboxChangeSignUpLastName(event) {
      this.setState({
        signUpLastName: event.target.value,
      });
    }

    onTextboxChangeSignUpFirstName(event) {
      this.setState({
        signUpFirstName: event.target.value,
      });
    }

    onTextboxChangeSignUpPassword(event) {
      this.setState({
        signUpPassword: event.target.value,
      });
    }

    async componentDidMount(){
      const obj = getFromStorage('SESS_ID');
      if (obj && obj.token) {
        const { token } = obj;
        const res= await fetch('https://twitake.herokuapp.com/verify?token=' + token)
        const jsonData=await res.json()
        if (jsonData.success) {
          this.setState({
            token:token,
            isLoading: false
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
