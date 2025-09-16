import { NavLink } from "react-router-dom";
import { FormSubmitButton } from "../components/form-submit-button";
import { FormTextAreaInput } from "../components/form-text-area-input";
import { FormTextInput } from "../components/form-text-input";
import "../styles/common.css";

export function ContactPage() {
  return (
    <div className="flex flex-col items-center gap-12 p-8">
      <div className="flex w-[80%] flex-col items-center gap-4 text-center">
        <div className="font-sanchez text-3xl text-black/75">
          Fill out this form to send me a message
        </div>
        <div className="text-black/75">
          Looking forward to hearing from you!
        </div>
      </div>

      <div className="w-[90%] max-w-[500px]">
        <form action="https://formspree.io/f/xdopgdnk" method="POST">
          <div className="flex flex-col items-center gap-3">
            <FormTextInput
              type="text"
              name="name"
              placeholder="Name"
              autoComplete={false}
              maxLength={50}
              required={true}
              className="w-[95%]"
            />

            <FormTextInput
              type="email"
              name="_replyto"
              placeholder="Email"
              autoComplete={false}
              maxLength={50}
              required={true}
              className="w-[95%]"
            />

            <FormTextAreaInput
              name="message"
              placeholder="Message"
              maxLength={500}
              required={true}
              className="h-[150px] w-[95%]"
            />

            <FormSubmitButton text="Send" />
          </div>
        </form>
      </div>

      <NavLink to="/hidden">
        <div className="absolute right-5 top-5 h-10 w-10 cursor-pointer rounded-full bg-transparent"></div>
      </NavLink>
    </div>
  );
}
