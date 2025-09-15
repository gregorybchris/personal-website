export function PlacesPage() {
  return (
    <div className="p-8">
      <div className="mx-auto w-[80%] pb-5 text-center">
        <div className="block pb-3 font-noto text-3xl font-bold text-text-1">
          Places
        </div>
        <div className="mx-auto block w-[80%] py-3 font-raleway text-text-1">
          I don't travel a whole lot, but here are some places I've liked!
        </div>
      </div>
      <div className="mx-auto my-5 w-full text-center">
        <iframe
          className="mx-auto my-5 h-[500px] w-[90%] border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
          title="Seattle"
          src="https://www.google.com/maps/d/u/0/embed?mid=1YpGkcgAv-I4_fexKFwTl1laE-0o21aiU"
          width="640"
          height="480"
        ></iframe>
        <iframe
          className="mx-auto my-5 h-[500px] w-[90%] border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
          title="Indianapolis"
          src="https://www.google.com/maps/d/u/0/embed?mid=19yXbLVzXqtMyhf3nLS0WVXfkONPjXTsS"
          width="640"
          height="480"
        ></iframe>
        <iframe
          className="mx-auto my-5 h-[500px] w-[90%] border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
          title="San Diego"
          src="https://www.google.com/maps/d/u/0/embed?mid=12DIDfRXi5ud9-nIsVJBTEInH-xQ0NNnf"
          width="640"
          height="480"
        ></iframe>
      </div>
    </div>
  );
}
