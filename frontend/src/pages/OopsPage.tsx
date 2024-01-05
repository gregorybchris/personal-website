export function OopsPage() {
  return (
    <div>
      <div className="w-[70%] mx-auto py-4">
        <div className="font-noto text-text-1 font-bold text-4xl pb-10 block text-center">Oops! :/</div>
        <div className="font-raleway tracking-wide text-lg text-text-1 leading-6 text-center">
          Somehow you've ended up on a page that doesn't exist...
        </div>
      </div>
      <div className="w-[300px] h-[300px] overflow-hidden rounded-full mx-auto text-center mt-10">
        <img
          object-fit="cover"
          alt="oops"
          className="w-[300px] bg-cover block mx-auto relative top-[-10%]"
          src="https://storage.googleapis.com/cgme/bio/profiles/wide-eyes-profile.jpg"
        />
      </div>
    </div>
  );
}
