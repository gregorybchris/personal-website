export function OopsPage() {
  return (
    <div>
      <div className="mx-auto w-[70%] py-4">
        <div className="block pb-10 text-center font-noto text-4xl font-bold text-text-1">
          Oops! :/
        </div>
        <div className="text-center font-raleway text-lg leading-6 tracking-wide text-text-1">
          Somehow you've ended up on a page that doesn't exist...
        </div>
      </div>
      <div className="mx-auto mt-10 h-[300px] w-[300px] overflow-hidden rounded-full text-center">
        <img
          object-fit="cover"
          alt="oops"
          className="relative top-[-10%] mx-auto block w-[300px] bg-cover"
          src="https://storage.googleapis.com/cgme/bio/profiles/wide-eyes-profile.jpg"
        />
      </div>
    </div>
  );
}
