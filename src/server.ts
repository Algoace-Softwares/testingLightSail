import "dotenv/config";
import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env.dev",
});
/*
 ** Connectiong to database
 */
import { app2 } from "./app";
// import { connectToDatabase } from "./database";

const port = process.env.PORT || 3000;

app2.listen(port, () => {
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
