import "../styles/common.css";

export function ContactPage() {
  return (
    <div className="bg-background p-8">
      <div className="w-[80%] mx-auto text-center">
        <div className="font-noto text-text-1 text-3xl font-bold block mb-5">Looking forward to hearing from you!</div>
        <div className="font-raleway text-text-1 block w-[80%] mx-auto">
          Fill out this form to send me a message. I'll try to get back to you ASAP.
        </div>
      </div>
      <div className="w-[90%] max-w-[500px] mt-[50px] mx-auto">
        <form action="https://formspree.io/f/xdopgdnk" method="POST">
          <input
            className="block w-[95%] mt-3 mx-auto Common-text-field"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="off"
            maxLength={50}
            required
          />
          <input
            className="Common-text-field block w-[95%] mt-3 mx-auto"
            type="email"
            name="_replyto"
            placeholder="Email"
            autoComplete="off"
            maxLength={50}
            required
          />

          <textarea
            className="Common-text-field block resize-none w-[95%] h-[150px] mt-3 mx-auto"
            name="message"
            placeholder="Message"
            maxLength={500}
            required
          />
          <input className="Common-button block py-2 px-8 my-3 mx-auto" type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
}
