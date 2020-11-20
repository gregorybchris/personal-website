import React from "react";

import "./Contact.sass";

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
            Looking forward to hearing from you!
          </div>
          <div className="Contact-instructions">
            Fill out this form to send me a message directly. I'll try to get
            back to you at the email you provide as soon as possible
          </div>
        </div>
        <div className="Contact-form-wrap">
          <form action="https://formspree.io/f/xdopgdnk" method="POST">
            <input
              className="Contact-text-input Common-text-field"
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="off"
              required
            />
            <input
              className="Contact-text-input Common-text-field"
              type="email"
              name="_replyto"
              placeholder="Email"
              autoComplete="off"
              required
            />
            <textarea
              className="Contact-text-area Common-text-field"
              name="message"
              placeholder="Message"
              required
            />
            <input
              className="Contact-send-button Common-button"
              type="submit"
              value="Send"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Contact;
