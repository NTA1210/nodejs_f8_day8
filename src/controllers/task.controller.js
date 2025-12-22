const taskModel = require("../models/task.model");

const getAll = (req, res) => {
    const tasks = taskModel.findAll();
    res.success(tasks);
};

const getOne = (req, res) => {
    const task = taskModel.findOne(+req.params.id);
    res.success(task);
};

const create = (req, res) => {
    const newTask = taskModel.create({
        title: req.body.title,
    });
    res.success(newTask, 201);
};

const toggle = (req, res) => {
    res.send("Toggle task isCompleted");
};

module.exports = { getAll, getOne, create, toggle };
