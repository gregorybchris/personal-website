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
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <ExternalLink href={recipe.bigovenLink}>
                <h1 className="font-sanchez text-2xl transition-colors hover:text-[#5979b5] md:text-3xl">
                  {recipe.name}
                </h1>
              </ExternalLink>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <ClockCountdownIcon size={18} color="#6283c0" weight="duotone" />
                  <span>{formatDuration(recipe.prepTime)}</span>
                </div>
                {recipe.serves && (
                  <div className="flex items-center gap-1.5">
                    <UsersIcon size={18} color="#6283c0" weight="duotone" />
                    <span>{recipe.serves} servings</span>
                  </div>
                )}
              </div>
            </div>

            {recipe.notes && (
              <div>
                <h2 className="font-sanchez text-lg">Notes</h2>
                <p className="text-sm leading-relaxed">{recipe.notes}</p>
              </div>
            )}

            <div>
              {recipe.ingredients.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No ingredients included in this recipe
                </div>
              ) : (
                <div className="overflow-hidden rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="bg-sky border-r border-r-[#5979b5] px-3 py-1 text-left font-bold text-white">
                          Ingredient
                        </th>
                        <th className="bg-sky border-r border-r-[#5979b5] px-3 py-1 text-left font-bold text-white">
                          Amount
                        </th>
                        <th className="bg-sky px-3 py-1 text-left font-bold text-white">
                          Units
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.ingredients.map((ingredient) => (
                        <tr key={ingredient.name}>
                          <td className="border-b border-b-[#f5f5f0] bg-white px-3 py-0.5 text-left">
                            {ingredient.name}
                          </td>
                          <td className="border-b border-b-[#f5f5f0] bg-white px-3 py-0.5 text-left">
                            {ingredient.amount != null
                              ? convertFraction(ingredient.amount)
                              : ""}
                          </td>
                          <td className="border-b border-b-[#f5f5f0] bg-white px-3 py-0.5 text-left">
                            {ingredient.units || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {recipe.instructions && (
              <div>
                <h2 className="font-sanchez text-lg">Instructions</h2>
                <p className="text-sm leading-relaxed">{recipe.instructions}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => alert("Coming soon!")} text="Step by step" />
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
