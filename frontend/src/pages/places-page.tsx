import { PageTitle } from "../components/page-title";

export function PlacesPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6">
      <PageTitle>Places</PageTitle>

      <iframe
        className="my-5 h-[500px] w-full border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] md:w-[80%]"
        title="Seattle"
        src="https://www.google.com/maps/d/u/0/embed?mid=1YpGkcgAv-I4_fexKFwTl1laE-0o21aiU"
        width="640"
        height="480"
      ></iframe>
      <iframe
        className="my-5 h-[500px] w-full border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] md:w-[80%]"
        title="Indianapolis"
        src="https://www.google.com/maps/d/u/0/embed?mid=19yXbLVzXqtMyhf3nLS0WVXfkONPjXTsS"
        width="640"
        height="480"
      ></iframe>
      <iframe
        className="my-5 h-[500px] w-full border-none shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] md:w-[80%]"
        title="San Diego"
        src="https://www.google.com/maps/d/u/0/embed?mid=12DIDfRXi5ud9-nIsVJBTEInH-xQ0NNnf"
        width="640"
        height="480"
      ></iframe>
    </div>
  );
}
