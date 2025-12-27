import {
  ChatsCircleIcon,
  CheeseIcon,
  PizzaIcon,
  ShrimpIcon,
} from "@phosphor-icons/react";
import { match } from "ts-pattern";
import NoiseBackground from "../components/noise-background";

export function StaticPage() {
  return (
    <div className="font-geist flex flex-col items-center py-8">
      <div className="relative h-[500px] w-[600px] p-2 text-sm">
        <NoiseBackground className="absolute rounded-3xl" />

        <div className="relative z-10 flex h-full flex-row gap-2">
          <div className="border-1.5 flex h-full w-[350px] flex-col items-center gap-6 rounded-2xl border border-neutral-500/40 bg-black/65 px-3 py-5">
            <div className="flex flex-row items-center gap-3">
              <ChatsCircleIcon size={32} color="#2b7fff" weight="duotone" />
              <span className="text-lg text-white">Big Title</span>
            </div>

            <div className="flex h-full w-full flex-col justify-center gap-1.5 p-1">
              <SolidButton text="Shrimp" iconName="shrimp" />
              <SolidButton text="Cheese" iconName="cheese" />
              <SolidButton text="Pizza" iconName="pizza" />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center gap-4 px-4 py-8">
            <div className="text-xl font-bold text-white">
              Welcome <span className="text-white/70">to a</span> place
            </div>

            <div className="flex flex-row gap-1.5">
              <TranslucentButton text="Settings" />
              <TranslucentButton text="More" />
            </div>

            <div className="mt-auto text-center text-[10px]/4 text-white/60 uppercase">
              Some fish change color very quickly. You could{" "}
              <SimpleLink text="learn more" /> about it!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type IconName = "shrimp" | "cheese" | "pizza";

function SolidButton({ text, iconName }: { text: string; iconName: IconName }) {
  const iconProps = {
    className: "group-hover:fill-black transition duration-200 fill-white",
    size: 20,
    weight: "duotone" as const,
  };
  return (
    <button className="group flex w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-md bg-blue-500/85 px-4 py-2 text-white transition duration-200 hover:bg-[#d4d4d4] hover:text-black active:scale-97 active:bg-white/70">
      {match(iconName)
        .with("shrimp", () => <ShrimpIcon {...iconProps} />)
        .with("cheese", () => <CheeseIcon {...iconProps} />)
        .with("pizza", () => <PizzaIcon {...iconProps} />)
        .exhaustive()}
      <span>{text}</span>
    </button>
  );
}

function SimpleLink({ text }: { text: string }) {
  return (
    <a className="cursor-pointer whitespace-nowrap text-white/60 underline underline-offset-3 transition-colors duration-500 hover:text-blue-400 active:text-white">
      {text}
    </a>
  );
}

function TranslucentButton({ text }: { text: string }) {
  return (
    <div className="relative transition duration-200 active:scale-97">
      <div
        className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(15deg,transparent,rgba(130,130,130,0.5)_50%,transparent)] p-px"
        style={{
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      <button className="relative cursor-pointer rounded-xl bg-black/15 px-4 py-2 text-white/70 transition duration-200 hover:bg-white/7 hover:text-white active:bg-white/10">
        {text}
      </button>
    </div>
  );
}
