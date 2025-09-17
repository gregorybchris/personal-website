import {
  BowlFood,
  Cookie,
  CookingPot,
  FishSimple,
  ForkKnife,
  Knife,
  Person,
  Shrimp,
  Timer,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../components/page-title";
import { formatDuration } from "../utilities/datetime-utilities";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface Recipe {
  name: string;
  slug: string;
  bigoven_link: string;
  recipe_type: RecipeType;
  food_type: FoodType;
  origin: string;
  prep_time: string;
  serves: number;
  archived: boolean;
  ingredients: Ingredient[];
  instructions?: string;
  notes?: string;
}

export type RecipeType = "dessert" | "main" | "side" | "snack" | "drink";
export type FoodType =
  | "shrimp"
  | "cookie"
  | "fork-knife"
  | "knife"
  | "baked"
  | "bowl"
  | "fish";

export interface Ingredient {
  name: string;
  amount?: number;
  units?: Unit;
  notes?: string;
}

export type Unit = "cup" | "tbsp" | "tsp" | "oz" | "lb" | "g" | "kg" | "ml";

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const recipesQuery = makeQuery("recipes");
    GET(recipesQuery).then((queryResult) => {
      setRecipes(queryResult);
    });
  }, []);

  function getIcon(foodType: FoodType) {
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
    <div className="flex flex-col items-center gap-8 px-2 py-8">
      <PageTitle>Recipes</PageTitle>

      <div className="flex flex-row flex-wrap justify-center md:w-[80%]">
        {recipes.map((recipe) => {
          const icon = getIcon(recipe.food_type);

          return (
            !recipe.archived && (
              <div
                key={recipe.name}
                className="border-sky relative mx-4 my-3 flex h-[130px] w-[240px] cursor-pointer flex-row items-center border-2 text-center transition-all hover:border-royal"
                onClick={() => navigate(`/hidden/recipes/${recipe.slug}`)}
              >
                <div className="bg-sky absolute -left-3 -top-3 rounded-full p-2">
                  {icon}
                </div>

                <div className="flex w-full flex-col items-center gap-2 text-center">
                  <div className="font-sanchez underline decoration-blue-500/60 underline-offset-4">
                    {recipe.name}
                  </div>

                  <div className="flex flex-col items-center gap-1 text-xs">
                    <div className="flex flex-row items-center gap-1">
                      <Timer size={14} color="#6283c0" weight="duotone" />
                      <div>Ready in {formatDuration(recipe.prep_time)}</div>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <Person size={14} color="#6283c0" weight="duotone" />
                      <div>Serves {recipe.serves}</div>
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
