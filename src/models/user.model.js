const pool = require("../config/database");

class User {
    async findAll(limit, offset) {
        const [rows] = await pool.query(
            `select * from users limit ${limit} offset ${offset};`
        );
        return rows;
    }

    async count() {
        const [rows] = await pool.query("select count(*) as count from users;");
        return rows[0].count;
    }

    async findOne(id) {
        const [rows] = await pool.query(
            `select * from users where id = ${id};`
        );
        return rows[0];
    }
}

module.exports = new User();
