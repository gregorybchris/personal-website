import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import pixelMeEyesClosed from "../assets/icons/pixel-me-eyes-closed.svg";
import pixelMeEyesOpen from "../assets/icons/pixel-me.svg";
import { FormSubmitButton } from "../components/form-submit-button";
import { FormTextAreaInput } from "../components/form-text-area-input";
import { FormTextInput } from "../components/form-text-input";
import { PageTitle } from "../components/page-title";

export function ContactPage() {
  const [eyesClosed, setEyesClosed] = useState(false);

  function boxMullerGaussian(mean: number, stddev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + stddev * z0;
  }

  useEffect(() => {
    const scheduleNextBlink = () => {
      // Cornelis et al (2025)
      // blinks per minute: μ = 10.3, σ = 5.9
      // blink duration: μ = 128.8ms, σ = 56.4ms

      const delayMeanSec = 60 / 10.3;
      const delayStddevSec = (5.9 / (10.3 * 10.3)) * 60; // Approximation
      const randomDelayMs =
        boxMullerGaussian(delayMeanSec, delayStddevSec) * 1000;
      const durMeanMs = 128.8;
      const durStddevMs = 56.4;
      const blinkDurMs = boxMullerGaussian(durMeanMs, durStddevMs);

      return setTimeout(() => {
        setEyesClosed(true);

        setTimeout(() => {
          setEyesClosed(false);
          scheduleNextBlink();
        }, blinkDurMs);
      }, randomDelayMs);
    };

    const timeoutId = scheduleNextBlink();

    return () => clearTimeout(timeoutId);
  }, []);
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
          src={eyesClosed ? pixelMeEyesClosed : pixelMeEyesOpen}
          alt="Pixel art avatar of Chris Gregory"
          className="mx-auto size-30"
          title="Blink timing based on Cornelis et al. (2025)"
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
