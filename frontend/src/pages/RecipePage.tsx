import { ArrowLeft, ClockCountdown, Users } from "@phosphor-icons/react";
import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Recipe } from "../models/recipesModels";
import { formatDuration } from "../utilities/datetimeUtilities";

export function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const recipesQuery = makeQuery("recipes");
    GET(recipesQuery).then((queryResult) => {
      setRecipes(queryResult);
    });
  }, []);

  function convertFraction(n: number) {
    if (n == 0.125) return <span>&frac18;</span>;
    if (n == 0.25) return <span>&frac14;</span>;
    if (n == 0.333) return <span>1/3</span>;
    if (n == 0.5) return <span>&frac12;</span>;
    if (n == 0.666) return <span>2/3</span>;
    if (n == 0.75) return <span>&frac34;</span>;
    if (n == 1.25) return <span>1&frac14;</span>;
    if (n == 1.333) return <span>1 1/3</span>;
    if (n == 1.5) return <span>1&frac12;</span>;
    if (n == 1.666) return <span>1 2/3</span>;
    if (n == 1.75) return <span>1&frac34;</span>;
    if (n == 2.25) return <span>2&frac14;</span>;
    if (n == 2.5) return <span>2&frac12;</span>;
    if (n == 2.75) return <span>2&frac34;</span>;
    return `${n}`;
  }

  const recipe = recipes.find((r) => r.slug === slug);

  return (
    <div className="px-16 pb-10 pt-3">
      <div
        className="mb-4 inline-block cursor-pointer rounded-md px-2 py-1 hover:bg-background-dark"
        onClick={() => navigate("/hidden/recipes")}
      >
        <div className="flex flex-row space-x-2 font-raleway">
          <ArrowLeft size={25} color="#6283c0" weight="regular" />
          <div>Back to recipes</div>
        </div>
      </div>

      {recipe === undefined && (
        <div className="font-raleway">Recipe not found</div>
      )}

      {recipe !== undefined && (
        <div>
          <a href={recipe.bigoven_link} target="_blank">
            <div className="inline-block border-b border-accent font-noto text-3xl">
              {recipe.name}
            </div>
          </a>

          <div className="flex flex-row space-x-6 py-7">
            <div className="flex flex-row space-x-2 font-raleway">
              <div>
                <ClockCountdown size={25} color="#6283c0" weight="regular" />
              </div>
              <div>Ready in {formatDuration(recipe.prep_time)}</div>
            </div>
            <div className="flex flex-row space-x-2 font-raleway">
              <div>
                <Users size={25} color="#6283c0" weight="regular" />
              </div>
              <div>{recipe.serves} servings</div>
            </div>
          </div>

          <div className="relative mb-8 w-[80%] border-l-2 border-accent pb-3 pl-8">
            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full border-2 border-accent bg-background"></div>
            <div className="pb-3 font-noto text-xl">Notes</div>
            <div className="font-raleway text-sm leading-6">
              {recipe.notes || "No notes available"}
            </div>
          </div>

          <div className="relative mb-8 w-[80%] border-l-2 border-accent pb-3 pl-8">
            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full border-2 border-accent bg-background"></div>
            <div className="pb-3 font-noto text-xl">Ingredients</div>
            <div className="font-raleway text-sm">
              {recipe.ingredients.length === 0 &&
                "No ingredients included in this recipe"}

              {recipe.ingredients.map((ingredient) => (
                <div className="flex flex-row py-1" key={ingredient.name}>
                  <div className="flex w-[400px] flex-row items-center">
                    <div className="flex-none">{ingredient.name}</div>
                    <div className="mx-3 h-1 w-full border-b border-dotted border-accent"></div>
                  </div>
                  <div>
                    {!!ingredient.amount ? (
                      <div className="inline-block h-9 w-9 rounded-full bg-accent pt-2 text-center font-bold text-background">
                        {convertFraction(ingredient.amount)}
                      </div>
                    ) : (
                      ""
                    )}{" "}
                    {ingredient.units || ""}{" "}
                    {!!ingredient.notes ? ` - (${ingredient.notes})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mb-8 w-[80%] border-l-2 border-accent pb-3 pl-8">
            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full border-2 border-accent bg-background"></div>
            <div className="pb-3 font-noto text-xl">Instructions</div>
            <div className="font-raleway text-sm leading-6">
              {recipe.instructions || "Nothing to see here"}
            </div>
          </div>

          <div className="flex flex-row items-center space-x-3">
            <div
              onClick={() => alert("Coming soon!")}
              className="cursor-pointer border-2 border-accent px-3 py-1 font-raleway font-bold transition-all hover:border-accent-focus hover:bg-background-dark"
            >
              <div>Step by step</div>
            </div>
            <div
              onClick={() => alert("Coming soon!")}
              className="cursor-pointer border-2 border-accent px-3 py-1 font-raleway font-bold transition-all hover:border-accent-focus hover:bg-background-dark"
            >
              <div>Adjust serving size</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
