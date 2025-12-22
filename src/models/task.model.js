const { readDB, writeDB } = require("../utils/jsonDB");

let taskId = 1;
let db = {};

readDB().then((result) => {
    db = result;
});

const taskModel = {
    findAll() {
        return db.tasks;
    },
    findOne(id) {
        return db.tasks.find((_task) => _task.id === id);
    },
    create(task) {
        const newTask = {
            id: taskId++,
            ...task,
            isCompleted: false,
        };
        db.tasks.push(newTask);

        writeDB(db);

        return newTask;
    },
};

module.exports = taskModel;
