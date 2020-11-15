import React from "react";

import "./Contact.css";

export interface ContactProps {}

export interface ContactState {}

class Contact extends React.Component<ContactProps, ContactState> {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="Contact">
        <div className="Contact-header-wrap">
          <div className="Contact-title">
            Looking forward to hearing from you
          </div>
          <div className="Contact-instructions">
            To send me a message just fill out this form and make sure to
            include your email so I can respond!
          </div>
        </div>
        <div className="Contact-form-wrap">
          <form action="https://formspree.io/f/xdopgdnk" method="POST">
            <input
              className="Contact-text-input Contact-text-field"
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="off"
              required
            />
            <input
              className="Contact-text-input Contact-text-field"
              type="email"
              name="_replyto"
              placeholder="Email"
              autoComplete="off"
              required
            />
            <textarea
              className="Contact-text-input Contact-text-area"
              name="message"
              placeholder="Message"
              required
            />
            <input className="Contact-send-button" type="submit" value="Send" />
          </form>
        </div>
      </div>
    );
  }
}

export default Contact;
