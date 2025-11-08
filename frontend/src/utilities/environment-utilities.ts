type Environment = "development" | "production";

const getEnvironment = () => {
  return import.meta.env.MODE as Environment;
};

const isDevEnvironment = () => {
  return getEnvironment() === "development";
};

const isProdEnvironment = () => {
  return getEnvironment() === "production";
};

export { getEnvironment, isDevEnvironment, isProdEnvironment };
