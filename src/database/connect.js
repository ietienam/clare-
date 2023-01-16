const mongoose = require("mongoose");

module.exports = async () => {
  // connect to the database
  await mongoose
    .connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
