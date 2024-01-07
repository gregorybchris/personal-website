import "../styles/common.css";

export function ContactPage() {
  return (
    <div className="bg-background p-8">
      <div className="mx-auto w-[80%] text-center">
        <div className="mb-5 block font-noto text-3xl font-bold text-text-1">
          Fill out this form to send me a message
        </div>
        <div className="mx-auto block w-[80%] font-raleway text-text-1">
          Looking forward to hearing from you!
        </div>
      </div>
      <div className="mx-auto mt-[50px] w-[90%] max-w-[500px]">
        <form action="https://formspree.io/f/xdopgdnk" method="POST">
          <input
            className="Common-text-field mx-auto mt-3 block w-[95%]"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="off"
            maxLength={50}
            required
          />
          <input
            className="Common-text-field mx-auto mt-3 block w-[95%]"
            type="email"
            name="_replyto"
            placeholder="Email"
            autoComplete="off"
            maxLength={50}
            required
          />

          <textarea
            className="Common-text-field mx-auto mt-3 block h-[150px] w-[95%] resize-none"
            name="message"
            placeholder="Message"
            maxLength={500}
            required
          />
          <input
            className="Common-button mx-auto my-3 block px-8 py-2"
            type="submit"
            value="Send"
          />
        </form>
      </div>
    </div>
  );
}
