const userModel = require("../models/user.model");
const userService = require("../services/user.service");

const getAll = async (req, res) => {
    const page = +req.query.page || 1;
    const result = await userService.pagination(page);
    res.paginate(result);
};

const getOne = async (req, res) => {
    const task = await userModel.findOne(req.params.id);
    if (!task) return res.error("Not found", 404);

    res.success(task);
};

const create = (req, res) => {};

module.exports = { getAll, getOne, create };
