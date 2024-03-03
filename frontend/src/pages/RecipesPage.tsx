import {
  BowlFood,
  Cookie,
  CookingPot,
  FishSimple,
  ForkKnife,
  Knife,
  Shrimp,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/requestUtilities";

import { useNavigate } from "react-router-dom";
import { Recipe } from "../models/recipesModels";
import { formatDuration } from "../utilities/datetimeUtilities";

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const recipesQuery = makeQuery("recipes");
    GET(recipesQuery).then((queryResult) => {
      setRecipes(queryResult);
    });
  }, []);

  function getIcon(foodType: string) {
    switch (foodType) {
      case "shrimp":
        return <Shrimp size={30} color="#f5f5f0" weight="regular" />;
      case "cookie":
        return <Cookie size={30} color="#f5f5f0" weight="regular" />;
      case "fork-knife":
        return <ForkKnife size={30} color="#f5f5f0" weight="regular" />;
      case "knife":
        return <Knife size={30} color="#f5f5f0" weight="regular" />;
      case "baked":
        return <CookingPot size={30} color="#f5f5f0" weight="regular" />;
      case "bowl":
        return <BowlFood size={30} color="#f5f5f0" weight="regular" />;
      case "fish":
        return <FishSimple size={30} color="#f5f5f0" weight="regular" />;
      default:
        return <ForkKnife size={30} color="#f5f5f0" weight="regular" />;
    }
  }

  return (
    <div className="px-2 py-8 md:px-20">
      <div className="mx-auto w-[90%] pb-5 text-center md:w-[80%]">
        <div className="block pb-3 font-noto text-3xl font-bold text-text-1">
          Recipes
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center">
        {recipes.map((recipe) => {
          const icon = getIcon(recipe.food_type);

          return (
            !recipe.archived && (
              <div
                key={recipe.name}
                className="relative mx-4 my-3 flex h-[130px] w-[240px] cursor-pointer flex-row items-center border-2 border-accent text-center transition-all hover:border-accent-focus"
                onClick={() => navigate(`/hidden/recipes/${recipe.slug}`)}
              >
                <div className="absolute -left-3 -top-3 rounded-full bg-accent p-2">
                  {icon}
                </div>

                <div className="w-full text-center">
                  <div className="mb-2 inline-block border-b border-background-dark font-noto">
                    {recipe.name}
                  </div>
                  <div>
                    <div className="font-raleway text-xs">
                      Ready in {formatDuration(recipe.prep_time)}
                    </div>
                    <div className="font-raleway text-xs">
                      Serves {recipe.serves}
                    </div>
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}
