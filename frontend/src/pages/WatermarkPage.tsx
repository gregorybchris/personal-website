import logo from "../assets/icons/logo-blue.svg";

export function WatermarkPage() {
  return (
    <div className="flex h-[600px] items-center justify-center">
      <div className="opacity-40">
        <img src={logo} alt="Your SVG" />
      </div>
    </div>
  );
}
