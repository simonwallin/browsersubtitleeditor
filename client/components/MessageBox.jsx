import React from 'react';
const $ = require("jquery");

export default class MessageBox extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      class: ""
    }
  }
  toggle() {
    $("#" + this.props.id).toggle();
  }
  hide(e) {
    if(e.target){
      e.target.className === "message-box" ? this.setState({class: "hidden"}) : null;
    }else{
      e.className === "message-box" ? this.setState({class: "hidden"}) : null;
    }
  }
  show() {
    this.setState({
      class: "",
    })
  }
  componentDidMount() {
    this.setState({
      class: this.props.class,
    })
  }
  render () {
    return (
      <div className={this.state.class}>
        <div id={this.props.id} onClick={this.hide.bind(this)} className="message-box">
          <div className="inner-message-box">
            <h3>{this.props.content.heading}</h3>
            <p>{this.props.content.message}</p>
            <div>
              {this.props.htmlContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
