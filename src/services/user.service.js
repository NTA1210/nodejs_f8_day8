const userModel = require("../models/user.model");
const paginationService = require("./pagination.service");

class UserService {
    model = userModel;

    constructor() {
        paginationService.apply(this);
    }
}

module.exports = new UserService();
