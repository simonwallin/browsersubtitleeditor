import React from 'react';
import LoginForm from "./LoginForm.jsx";
import MessageBox from "./MessageBox.jsx";
const textContent = require("./../../config.js");
const $ = require("jquery");


export default class Header extends React.Component {
  constructor(props){
    super(props)
  }
  sendMessage() {
    const name = $("#mail-to-name").val();
    const email = $("#mail-to-email").val();
    const message = $("#mail-to-message").val();
    const payLoad = {
      name: name,
      email: email,
      message: message
    };
    $.ajax({
      url: "/api/message",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payLoad),
      success: (data) => {

      }
    })
    this.refs.contact.hide($("#test").get(0));
  }
  contactContent() {
    return(
      <div id="mail-to-form">
        <input type="text" id="mail-to-name" className="mail-to-element" placeholder="Your name"></input>
        <input type="email" id="mail-to-email" className="mail-to-element" placeholder="Your email"></input>
        <textarea id="mail-to-message" className="mail-to-element" defaultValue="Your message"></textarea>
        <button onClick={this.sendMessage.bind(this)} id="mail-to-button">Send</button>
      </div>
    )
  }
  render () {
    return (
      <div id="header">
        <div id="header-menu-wrapper">
          <MessageBox id="test" ref="about" content={textContent.about} class="hidden" />
          <MessageBox ref="contact" content={textContent.contact} htmlContent={this.contactContent()} class="hidden" />
          <MessageBox ref="donate" content={textContent.donate} class="hidden" />
          <h2 id="header-title">{this.props.title}</h2>
          <ul id="header-menu">
            <li onClick={() => {this.refs.about.show()}}>About</li>
            <li onClick={() => {this.refs.contact.show()}}>Contact</li>
            {/*<li onClick={() => {this.refs.donate.show()}}>Donate<i className="fa fa-heart"></i></li>*/}
          </ul>
        </div>
        <div id="header-banner">

        </div>
      </div>
    );
  }
}
