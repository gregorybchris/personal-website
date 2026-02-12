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

  const FRACTION_MAP: Record<number, string> = {
    0.125: "\u215B",  // ⅛
    0.166: "\u2159",  // ⅙
    0.2: "\u2155",    // ⅕
    0.25: "\u00BC",   // ¼
    0.333: "\u2153",  // ⅓
    0.375: "\u215C",  // ⅜
    0.4: "\u2156",    // ⅖
    0.5: "\u00BD",    // ½
    0.6: "\u2157",    // ⅗
    0.625: "\u215D",  // ⅝
    0.666: "\u2154",  // ⅔
    0.75: "\u00BE",   // ¾
    0.8: "\u2158",    // ⅘
    0.833: "\u215A",  // ⅚
    0.875: "\u215E",  // ⅞
  };

  function convertFraction(n: number): string {
    const whole = Math.floor(n);
    const decimal = Math.round((n - whole) * 1000) / 1000;
    if (decimal === 0) return `${whole}`;
    const frac = FRACTION_MAP[decimal];
    if (!frac) return `${n}`;
    return whole > 0 ? `${whole}${frac}` : frac;
  }

  const recipe = recipes.find((r) => r.slug === slug);

  return (
    <div className="flex w-full justify-center px-4 py-6 md:px-8">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Link
          to="/recipes"
          className="text-sky flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-black/5"
        >
          <ArrowLeftIcon size={16} weight="bold" />
          <span>Back to recipes</span>
        </Link>

        {recipe === undefined && (
          <div className="text-sm text-gray-500">Recipe not found</div>
        )}

        {recipe !== undefined && (
          <div className="flex flex-col gap-10">
            <div>
              <ExternalLink href={recipe.bigovenLink}>
                <h1 className="font-sanchez text-3xl tracking-tight md:text-4xl">
                  {recipe.name}
                </h1>
              </ExternalLink>
              <div className="bg-sky mt-2 h-0.5 w-16 rounded-full" />

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ClockCountdownIcon
                    size={16}
                    color="#6283c0"
                    weight="duotone"
                  />
                  <span>{formatDuration(recipe.prepTime)}</span>
                </div>
                {recipe.serves && (
                  <div className="flex items-center gap-1.5">
                    <UsersIcon size={16} color="#6283c0" weight="duotone" />
                    <span>{recipe.serves} servings</span>
                  </div>
                )}
              </div>
            </div>

            {recipe.notes && (
              <div>
                <h2 className="font-sanchez text-sky mb-1 text-xs font-bold uppercase tracking-widest">
                  Notes
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {recipe.notes}
                </p>
              </div>
            )}

            <div>
              <h2 className="font-sanchez text-sky mb-3 text-xs font-bold uppercase tracking-widest">
                Ingredients
              </h2>
              {recipe.ingredients.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No ingredients included in this recipe
                </p>
              ) : (
                <div className="flex flex-col">
                  {recipe.ingredients.map((ingredient, i) => (
                    <div
                      key={ingredient.name}
                      className={`flex items-baseline justify-between gap-4 px-2 py-1.5 ${
                        i % 2 === 0 ? "bg-white" : "bg-dark-parchment/50"
                      }`}
                    >
                      <span className="text-sm">{ingredient.name}</span>
                      <span className="border-darker-parchment min-w-0 flex-1 border-b border-dotted" />
                      <span className="text-sky shrink-0 text-sm font-semibold tabular-nums">
                        {ingredient.amount != null
                          ? convertFraction(ingredient.amount)
                          : ""}
                        {ingredient.units ? ` ${ingredient.units}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {recipe.instructions && (
              <div>
                <h2 className="font-sanchez text-sky mb-1 text-xs font-bold uppercase tracking-widest">
                  Instructions
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {recipe.instructions}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => alert("Coming soon!")}
                text="Step by step"
              />
              <Button
                onClick={() => alert("Coming soon!")}
                text="Adjust serving size"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
