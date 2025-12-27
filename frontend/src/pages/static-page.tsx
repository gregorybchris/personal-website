import {
  FishIcon,
  ForkKnifeIcon,
  GlobeHemisphereWestIcon,
  HamburgerIcon,
  IceCreamIcon,
  PizzaIcon,
  WineIcon,
} from "@phosphor-icons/react";
import { GlowButton } from "../components/glow-button";
import NoiseBackground from "../components/noise-background";

const iconProps = { size: 20, weight: "duotone" as const };

export function StaticPage() {
  return (
    <div className="font-geist flex flex-col items-center py-8">
      <div className="relative h-[500px] w-[600px] p-2 text-sm">
        <NoiseBackground className="absolute rounded-3xl" />

        <div className="relative z-10 flex h-full flex-row gap-2">
          <div className="border-1.5 flex h-full w-[350px] flex-col items-center gap-6 rounded-2xl border border-neutral-500/40 bg-black/65 px-3 py-5">
            <div className="flex flex-row items-center gap-3">
              <ForkKnifeIcon size={32} color="#2b7fff" weight="duotone" />
              <span className="text-lg text-white">Food Finder</span>
            </div>

            <div className="flex h-full w-full flex-col justify-center gap-1.5 p-1">
              <GlowButton text="Pizza" icon={<PizzaIcon {...iconProps} />} />
              <GlowButton
                text="Burgers"
                icon={<HamburgerIcon {...iconProps} />}
              />
              <GlowButton text="Sea food" icon={<FishIcon {...iconProps} />} />
              <GlowButton text="Wine" icon={<WineIcon {...iconProps} />} />
              <GlowButton
                text="Desserts"
                icon={<IceCreamIcon {...iconProps} />}
              />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center gap-4 px-4 py-8">
            <div className="text-xl font-bold text-white/70">
              Are you ready to <span className="text-white">explore</span>?
            </div>

            <div className="flex flex-row gap-1.5">
              <TranslucentButton text="Yes" />
              <TranslucentButton text="No" />
            </div>

            <GlobeHemisphereWestIcon
              size={180}
              color="#2b7fff"
              weight="duotone"
              className="mt-5"
            />

            <div className="mt-auto text-center text-[10px]/4 text-white/60 uppercase select-none">
              We care about the environment. Check out our{" "}
              <SimpleLink text="animal friendly farming" /> policies!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleLink({ text }: { text: string }) {
  return (
    <a className="cursor-pointer whitespace-nowrap text-white/60 underline underline-offset-3 transition-colors duration-200 hover:text-blue-400 active:text-white">
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
