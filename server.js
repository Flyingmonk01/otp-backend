import { config } from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import cors from 'cors';

// Define the whitelist of allowed domains
const whitelist = ['http://192.168.21.248:8081']; // Add your allowed domains here

// Configure CORS options to allow only whitelisted domains
const corsOptions = {
    origin: function (origin, callback) {
        // If no origin (like some Postman requests), allow it
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // If you need to allow cookies
};

// Use the CORS middleware with the options
app.use(cors(corsOptions));

config({
    path: ".env",
});

connectDB()
    .then(() => {
        
        app.get('/', (req, res) => {
            res.send('Hello there !!!')
        })
        
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
