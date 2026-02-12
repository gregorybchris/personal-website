import {
  ArrowLeftIcon,
  ClockCountdownIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/button";
import { ExternalLink } from "../components/external-link";
import { formatDuration } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";
import { Recipe } from "./recipes-page";

export function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const recipesQuery = makeQuery("recipes");
    GET<Recipe[]>(recipesQuery).then((queryResult) => {
      setRecipes(queryResult);
    });
  }, []);

  function convertFraction(n: number) {
    if (n === 0.125) return <span>1/8</span>;
    if (n === 0.25) return <span>&frac14;</span>;
    if (n === 0.333) return <span>1/3</span>;
    if (n === 0.5) return <span>&frac12;</span>;
    if (n === 0.666) return <span>2/3</span>;
    if (n === 0.75) return <span>&frac34;</span>;
    if (n === 1.25) return <span>1&frac14;</span>;
    if (n === 1.333) return <span>1 1/3</span>;
    if (n === 1.5) return <span>1&frac12;</span>;
    if (n === 1.666) return <span>1 2/3</span>;
    if (n === 1.75) return <span>1&frac34;</span>;
    if (n === 2.25) return <span>2&frac14;</span>;
    if (n === 2.5) return <span>2&frac12;</span>;
    if (n === 2.75) return <span>2&frac34;</span>;
    if (n === 3.333) return <span>3.33</span>;
    return `${n}`;
  }

  const recipe = recipes.find((r) => r.slug === slug);

  return (
    <div className="flex w-full flex-col items-start gap-4 px-6 py-8 pt-3 md:px-16">
      <Link
        to="/recipes"
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-black/8"
      >
        <div className="flex flex-row gap-x-2">
          <ArrowLeftIcon size={25} color="#6283c0" />
          <div>Back to recipes</div>
        </div>
      </Link>

      {recipe === undefined && <div>Recipe not found</div>}

      {recipe !== undefined && (
        <div className="flex w-[95%] flex-col items-start gap-6 md:w-[80%]">
          <ExternalLink href={recipe.bigovenLink}>
            <div className="border-sky font-sanchez border-b text-3xl">
              {recipe.name}
            </div>
          </ExternalLink>

          <div className="flex flex-row gap-x-6">
            <div className="flex flex-row gap-x-2">
              <div>
                <ClockCountdownIcon size={25} color="#6283c0" />
              </div>
              <div>Ready in {formatDuration(recipe.prepTime)}</div>
            </div>
            <div className="flex flex-row gap-x-2">
              <div>
                <UsersIcon size={25} color="#6283c0" />
              </div>
              <div>{recipe.serves} servings</div>
            </div>
          </div>

          <div className="border-sky border-l-2 px-4 md:px-8">
            <div className="font-sanchez text-xl">Notes</div>
            <div className="text-sm leading-6">
              {recipe.notes || "No notes available"}
            </div>
          </div>

          <div className="border-sky border-l-2 px-4 md:px-8">
            <div className="font-sanchez text-xl">Ingredients</div>
            <div className="text-sm">
              {recipe.ingredients.length === 0 &&
                "No ingredients included in this recipe"}

              {recipe.ingredients.map((ingredient) => (
                <div className="flex flex-row py-1" key={ingredient.name}>
                  <div className="flex w-[400px] flex-row items-center">
                    <div className="flex-none">{ingredient.name}</div>
                    <div className="border-sky mx-3 h-1 w-full border-b border-dotted"></div>
                    <div className="flex flex-none flex-row items-center gap-2">
                      <div className="bg-sky text-parchment h-9 w-9 rounded-full pt-2 text-center font-bold">
                        {ingredient.amount != null ? convertFraction(ingredient.amount) : ""}
                      </div>
                      <span>{ingredient.units || ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-sky border-l-2 px-4 md:px-8">
            <div className="font-sanchez text-xl">Instructions</div>
            <div className="text-sm leading-6">
              {recipe.instructions || "Nothing to see here"}
            </div>
          </div>

          <div className="flex flex-row items-center gap-x-3">
            <Button onClick={() => alert("Coming soon!")} text="Step by step" />
            <Button
              onClick={() => alert("Coming soon!")}
              text="Adjust serving size"
            />
          </div>
        </div>
      )}
    </div>
  );
}
