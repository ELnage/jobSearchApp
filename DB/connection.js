import  Mongoose  from "mongoose";

export const db_connection = async () => {
  try {
    await Mongoose.connect(process.env.CONNECTION_DB_URI);
    console.log("connected to DataBase");
  } catch (error) {
    console.log("error in db connection", error);
  }
};
