export function OopsPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-10">
      <div className="font-sanchez text-4xl font-bold text-black/75">
        Oops! :/
      </div>

      <div className="text-lg text-black/75">
        Somehow you've ended up on a page that doesn't exist...
      </div>

      <div className="size-[300px] overflow-hidden rounded-full">
        <img
          object-fit="cover"
          alt="oops"
          className="relative top-[-10%] w-full bg-cover"
          src="https://storage.googleapis.com/cgme/bio/profiles/wide-eyes-profile.jpg"
        />
      </div>
    </div>
  );
}
