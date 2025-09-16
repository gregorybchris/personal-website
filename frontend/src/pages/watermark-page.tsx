import logo from "../assets/icons/logo-blue.svg";

export function WatermarkPage() {
  return (
    <div className="flex h-[600px] items-center justify-center">
      <div className="relative">
        <div className="absolute top-1/2 flex w-full items-center text-center font-sanchez text-4xl text-black/75">
          <div className="absolute -top-10 w-full text-center">
            ChrisGregory.me
          </div>
        </div>
        <img src={logo} alt="Your SVG" className="w-[400px] opacity-20" />
      </div>
    </div>
  );
}
