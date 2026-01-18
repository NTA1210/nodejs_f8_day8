const pool = require("../config/database");
const jwt = require("jsonwebtoken");
const { authSecret } = require("../config/jwt");

class revokedToken {
  async findOne(token) {
    const [data] = await pool.query(
      `SELECT * FROM revoked_tokens WHERE access_token = '${token}'`,
    );

    return data[0] || null;
  }

  async create(token) {
    const payload = jwt.verify(token, authSecret);

    const data = await pool.query(
      `INSERT INTO revoked_tokens (access_token,expires_at) VALUES ('${token}', '${payload.exp}')`,
    );
    return data.affectedRows;
  }

  async deleteExpiredToken() {
    const data = await pool.query(
      `DELETE  FROM revoked_tokens WHERE  expires_at < now()`,
    );
    console.log(data);

    return data.affectedRows;
  }
}

module.exports = new revokedToken();
