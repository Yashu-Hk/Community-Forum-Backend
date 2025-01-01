const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()
const connectDb = async () => {
  try {
    //connecting to mongodb
    //adding parameters to get the properties in console.log and database name
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database connected :",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

//for exporting
module.exports = connectDb;