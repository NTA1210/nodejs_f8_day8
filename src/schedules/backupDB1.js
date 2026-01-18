const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const emailService = require("../services/email.service");
require("dotenv").config();
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000",
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

function backupDB() {
  const backupDir = path.join(process.cwd(), "db_backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

  const mysqldump = spawn("mysqldump", [
    `-u${process.env.DB_USER}`,
    `-p${process.env.DB_PASSWORD}`,
    `-P${process.env.DB_PORT}`,
    `${process.env.DB_NAME}`,
  ]);

  const writeStream = fs.createWriteStream(backupFile);

  // ⭐ PIPE STREAM (QUAN TRỌNG NHẤT)
  mysqldump.stdout.pipe(writeStream);

  mysqldump.stderr.on("data", (data) => {
    console.error(`mysqldump error: ${data}`);
  });

  writeStream.on("finish", () => {
    console.log(`✅ Database backup saved to ${backupFile}`);
  });

  writeStream.on("error", (err) => {
    console.error("❌ Write stream error:", err);
  });

  mysqldump.on("close", async (code) => {
    if (code !== 0) {
      console.error(`❌ mysqldump exited with code ${code}`);
      return fs.unlinkSync(backupFile); // Xóa file backup nếu có lỗi
    }

    const res = await drive.files.create({
      requestBody: {
        name: `${backupFile}`,
        mimeType: "application/sql",
        parents: ["1tkcvHTSvV3vK7Oc68-BrZ39qpNP-MA8s"],
      },
      media: {
        mimeType: "application/sql",
        body: fs.createReadStream(backupFile),
      },
    });
    console.log(res.data);
    console.log("Upload GDrive successfully!");
    console.log(`✅ mysqldump exited with code ${code}`);

    try {
      await emailService.sendBackupReport({
        email: "anhkn7@gmail.com",
      });
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = backupDB;
