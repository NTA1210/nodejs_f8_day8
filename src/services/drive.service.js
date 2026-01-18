const { google } = require("googleapis");
const fs = require("fs");

class DriveService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:3000",
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.drive = google.drive({ version: "v3", auth: this.oauth2Client });
  }

  async uploadBackup({
    source: { name, mimeTypeSource = "application/sql", parent_ids },
    dest: { mimeTypeDest = "application/sql", file_path },
  }) {
    return await this.drive.files.create({
      requestBody: {
        name: `${name}`,
        mimeType: mimeTypeSource,
        parents: parent_ids,
      },
      media: {
        mimeType: mimeTypeDest,
        body: fs.createReadStream(file_path),
      },
    });
  }
}

module.exports = new DriveService();
