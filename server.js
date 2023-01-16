process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...", err);
  process.exit(1);
});

const app = require("./app");

const port = process.env.PORT || 3000;

const connectDatabase = require('./src/database/connect');

connectDatabase().then(() => {
  console.log('Connected to mongodb...');
});

//START SERVER
const server = app.listen(port, () => {
  console.log(`App running on PORT:${port} in ${process.env.NODE_ENV} mode...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
