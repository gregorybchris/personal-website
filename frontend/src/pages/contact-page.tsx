import { NavLink } from "react-router-dom";
import pixelMe from "../assets/icons/pixel-me.svg";
import { FormSubmitButton } from "../components/form-submit-button";
import { FormTextAreaInput } from "../components/form-text-area-input";
import { FormTextInput } from "../components/form-text-input";
import { PageTitle } from "../components/page-title";

export function ContactPage() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle className="text-balance">
          Fill out this form to send me a message
        </PageTitle>

        <div className="text-center text-black/75 md:w-[70%]">
          Looking forward to hearing from you!
        </div>
      </div>

      <div className="w-[90%] max-w-[500px]">
        <img
          src={pixelMe}
          alt="Pixel art avatar of Chris Gregory"
          className="mx-auto size-30"
        />

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
        <div className="absolute top-5 right-5 h-10 w-10 cursor-pointer rounded-full bg-transparent"></div>
      </NavLink>
    </div>
  );
}
