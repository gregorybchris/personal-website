import { ClockCountdown } from "@phosphor-icons/react";

export function RecipesPage() {
  return (
    <div className="p-8">
      <div className="mx-auto w-[90%] pb-5 text-center md:w-[80%]">
        <div className="block pb-3 font-noto text-3xl font-bold text-text-1">
          Recipes
        </div>
        <div className="mx-auto block w-[95%] py-3 font-raleway text-text-1 md:w-[70%]">
          Here are some recipes!
        </div>
      </div>

      <div className="mx-auto mt-5 w-[95%] max-w-[500px]">
        <ClockCountdown size={80} color="#3e8fda" weight="thin" />;
      </div>
    </div>
  );
}
