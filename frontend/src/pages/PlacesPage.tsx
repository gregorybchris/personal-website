export function PlacesPage() {
  return (
    <div className="p-8">
      <div className="w-[80%] mx-auto text-center pb-5">
        <div className="font-noto text-text-1 text-3xl font-bold block pb-3">Places</div>
        <div className="font-raleway text-text-1 block w-[80%] mx-auto py-3">
          I don't travel a whole lot, but here are some places I've liked!
        </div>
      </div>
      <div className="my-5 mx-auto w-full text-center">
        <iframe
          className="my-5 mx-auto w-[90%] h-[500px] border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
          title="Seattle"
          src="https://www.google.com/maps/d/u/0/embed?mid=1YpGkcgAv-I4_fexKFwTl1laE-0o21aiU"
          width="640"
          height="480"
        ></iframe>
        <iframe
          className="my-5 mx-auto w-[90%] h-[500px] border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
          title="Indianapolis"
          src="https://www.google.com/maps/d/u/0/embed?mid=19yXbLVzXqtMyhf3nLS0WVXfkONPjXTsS"
          width="640"
          height="480"
        ></iframe>
        <iframe
          className="my-5 mx-auto w-[90%] h-[500px] border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
          title="San Diego"
          src="https://www.google.com/maps/d/u/0/embed?mid=12DIDfRXi5ud9-nIsVJBTEInH-xQ0NNnf"
          width="640"
          height="480"
        ></iframe>
      </div>
    </div>
  );
}
