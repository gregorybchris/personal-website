const DEVELOPMENT_ENV = "development";
const PRODUCTION_ENV = "production";

const getEnvironment = () => {
  return import.meta.env.MODE;
};

const isDevEnvironment = () => {
  return getEnvironment() === DEVELOPMENT_ENV;
};

const isProdEnvironment = () => {
  return getEnvironment() === PRODUCTION_ENV;
};

export { getEnvironment, isDevEnvironment, isProdEnvironment };
