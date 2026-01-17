const fs = require("fs");

const basePath = "./src/tasks";
const postfix = ".task.js";

const entries = fs
  .readdirSync(basePath)
  .filter((fileName) => fileName.endsWith(postfix));

console.log(entries);

const tasksMap = entries.reduce((obj, fileName) => {
  return {
    ...obj,
    [fileName.replace(postfix, "")]: require(`./${fileName}`),
  };
}, {});

console.log(tasksMap);

module.exports = tasksMap;
