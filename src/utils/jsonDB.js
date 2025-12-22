const { readFile, writeFile } = require("node:fs/promises");

const DB_FILE = "./db.json";

const readDB = async () => {
    try {
        const result = await readFile(DB_FILE, "utf-8");
        return JSON.parse(result);
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeDB({});
        }
        return {};
    }
};

const writeDB = async (data) => {
    await writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = { readDB, writeDB };
