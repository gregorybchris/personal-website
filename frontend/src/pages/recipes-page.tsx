import {
  BowlFoodIcon,
  CookieIcon,
  CookingPotIcon,
  FishSimpleIcon,
  ForkKnifeIcon,
  KnifeIcon,
  PersonIcon,
  ShrimpIcon,
  TimerIcon,
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
        return <ShrimpIcon size={30} color="#f5f5f0" />;
      case "cookie":
        return <CookieIcon size={30} color="#f5f5f0" />;
      case "fork-knife":
        return <ForkKnifeIcon size={30} color="#f5f5f0" />;
      case "knife":
        return <KnifeIcon size={30} color="#f5f5f0" />;
      case "baked":
        return <CookingPotIcon size={30} color="#f5f5f0" />;
      case "bowl":
        return <BowlFoodIcon size={30} color="#f5f5f0" />;
      case "fish":
        return <FishSimpleIcon size={30} color="#f5f5f0" />;
      default:
        return <ForkKnifeIcon size={30} color="#f5f5f0" />;
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
                className="border-sky hover:border-royal relative mx-4 my-3 flex h-[130px] w-[240px] cursor-pointer flex-row items-center border-2 text-center transition-all"
                onClick={() => navigate(`/hidden/recipes/${recipe.slug}`)}
              >
                <div className="bg-sky absolute -top-3 -left-3 rounded-full p-2">
                  {icon}
                </div>

                <div className="flex w-full flex-col items-center gap-2 text-center">
                  <div className="font-sanchez underline decoration-blue-500/60 underline-offset-4">
                    {recipe.name}
                  </div>

                  <div className="flex flex-col items-center gap-1 text-xs">
                    <div className="flex flex-row items-center gap-1">
                      <TimerIcon size={14} color="#6283c0" weight="duotone" />
                      <div>Ready in {formatDuration(recipe.prep_time)}</div>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <PersonIcon size={14} color="#6283c0" weight="duotone" />
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
