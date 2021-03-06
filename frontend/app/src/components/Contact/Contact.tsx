import React from "react";

import "./styles/Contact.sass";

interface ContactProps {}

interface ContactState {}

class Contact extends React.Component<ContactProps, ContactState> {
  render() {
    return (
      <div className="Contact">
        <div className="Contact-header-wrap">
          <div className="Contact-title">Looking forward to hearing from you!</div>
          <div className="Contact-instructions">
            Fill out this form to send me a message directly. I'll try to get back to you ASAP.
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
              maxLength={50}
              required
            />
            <input
              className="Common-text-field Contact-text-input"
              type="email"
              name="_replyto"
              placeholder="Email"
              autoComplete="off"
              maxLength={50}
              required
            />
            <textarea
              className="Common-text-field Contact-text-area"
              name="message"
              placeholder="Message"
              maxLength={500}
              required
            />
            <input className="Common-button Contact-send-button" type="submit" value="Send" />
          </form>
        </div>
      </div>
    );
  }
}

export default Contact;
