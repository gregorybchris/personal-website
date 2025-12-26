import {
  ChatsCircleIcon,
  CheeseIcon,
  PizzaIcon,
  ShrimpIcon,
} from "@phosphor-icons/react";
import NoiseBackground from "../components/noise-background";

export function StaticPage() {
  return (
    <div className="font-geist flex flex-col items-center py-8">
      <div className="relative h-[500px] w-[600px] p-2 text-sm">
        <NoiseBackground className="absolute rounded-3xl" />

        <div className="relative z-10 flex h-full flex-row gap-2">
          <div className="flex h-full w-[350px] flex-col items-center gap-6 rounded-2xl bg-black/65 px-3 py-5">
            <div className="flex flex-row items-center gap-3">
              <ChatsCircleIcon size={32} color="#2b7fff" weight="bold" />
              <span className="text-lg text-white">Great App</span>
            </div>

            <div className="flex h-full w-full flex-col justify-center gap-1.5 p-1">
              <SolidButton text="Shrimp" iconName="shrimp" />
              <SolidButton text="Cheese" iconName="cheese" />
              <SolidButton text="Pizza" iconName="pizza" />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center gap-4 px-4 py-8">
            <div className="text-xl font-bold text-white">
              Welcome <span className="text-white/70">to this</span> site
            </div>

            <div className="flex flex-row gap-1.5">
              <TranslucentButton text="Settings" />
              <TranslucentButton text="More" />
            </div>

            <div className="mt-auto text-center text-xs text-white/60 uppercase">
              I hope you enjoyed. Come back again soon. You can{" "}
              <a className="cursor-pointer text-white/30 transition-colors duration-500 hover:text-white/40">
                click here
              </a>{" "}
              also!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type IconName = "shrimp" | "cheese" | "pizza";

function SolidButton({ text, iconName }: { text: string; iconName: IconName }) {
  return (
    <div className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-[#2b7fff] px-4 py-2 transition duration-200 hover:bg-blue-500/85">
      {iconName === "shrimp" && (
        <ShrimpIcon size={20} color="white" weight="duotone" />
      )}
      {iconName === "cheese" && (
        <CheeseIcon size={20} color="white" weight="duotone" />
      )}
      {iconName === "pizza" && (
        <PizzaIcon size={20} color="white" weight="duotone" />
      )}
      <span className="text-white">{text}</span>
    </div>
  );
}

function TranslucentButton({ text }: { text: string }) {
  return (
    <div className="flex cursor-pointer flex-col items-center self-start rounded-xl border border-white/10 bg-black/15 px-4 py-2 text-white/80 transition duration-200 hover:border-white/15 hover:bg-white/7 hover:text-white">
      {text}
    </div>
  );
}
