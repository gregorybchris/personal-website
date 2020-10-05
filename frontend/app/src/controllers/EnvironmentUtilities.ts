const DEVELOPMENT_ENV = "development";
const PRODUCTION_ENV = "production";

const getEnvironment = () => {
  return process.env.NODE_ENV;
};

const isDevEnvironment = () => {
  return getEnvironment() === DEVELOPMENT_ENV;
};

const isProdEnvironment = () => {
  return getEnvironment() === PRODUCTION_ENV;
};

export { getEnvironment, isDevEnvironment, isProdEnvironment };
