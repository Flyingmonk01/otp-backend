import { config } from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

config({
    path: ".env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}!!!`);
        });

        app.on("error", () => {
            console.log("Error during opening the server!!!");
        });
    })
    .catch((e) => {
        throw Error(e.message);
    });
