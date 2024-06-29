import colors from "colors";

// eslint-disable-next-line
export const blueLog = (param: any) => {
  console.log(colors.blue.bold(param));
};

// eslint-disable-next-line
export const errorLog = (param: any) => {
  console.log(colors.magenta.bold("Error :\n"), colors.dim(param));
};
