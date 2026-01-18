const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const emailService = require("../services/email.service");
const DriveService = require("../services/drive.service");
require("dotenv").config();

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

    const res = await DriveService.uploadBackup({
      source: {
        name: `${backupFile}`,
        mimeTypeSource: "application/sql",
        parent_ids: ["1tkcvHTSvV3vK7Oc68-BrZ39qpNP-MA8s"],
      },
      dest: {
        mimeTypeDest: "application/sql",
        file_path: backupFile,
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
