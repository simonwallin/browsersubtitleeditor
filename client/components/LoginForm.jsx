import React from 'react';
const $ = require("jquery");
const globals = require("./../globals");

export default class LoginForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
    this.validate();
  }
  validate(email, password) {
    const credentials = {
      email: email,
      password: password,
    }
    $.ajax({
      url: "/api/authenticate",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(credentials),
      success: (data) => {
        const newState = $.extend({}, this.state);
        newState.authenticated = data.loggedIn;
        newState.user = data.user
        this.setState(newState);
      }
    })
  }
  logout(){
    $.get("/api/logout", (data) => {
      console.log("logout callbacl");
      const newState = $.extend({}, this.state);
      newState.authenticated = data.loggedIn;
      newState.user = data.user
      this.setState(newState);
    });
  }
  loggedIn(){
    if(this.state.authenticated){
      return <div>
          <h3>{this.state.user}</h3>
          <button onClick={this.logout.bind(this)}>Log out</button>
        </div>
    }else{
      return <div>
        <div>
          <input name="email" type="text"></input>
          <input name="password" type="password"></input>
          <input onClick={this.validate.bind(this)} type="submit"></input>
        </div>
      </div>
    }
  }
  render () {
    return (<div className="formWrapper">{this.loggedIn()}</div>)
  }
}
