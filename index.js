import "dotenv/config";
import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env.dev",
});
/*
 ** Connectiong to database
 */

// import { connectToDatabase } from "./database";

const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  return res.status(200).json({ success: true, greeting: "Hello app2 / from API" });
});
app.listen(port, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});

// connectToDatabase()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
//   });
