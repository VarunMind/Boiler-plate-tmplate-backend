import express from "express";
import cors from "cors";
import connectToDatabase from "./database.js";
import authRouter from "./routes/auth/auth.js";
import InboxRouter from "./routes/inbox/inbox.js";


const app = express();
const PORT = 300;

connectToDatabase();

const Cors_Config = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("*", cors(Cors_Config));
app.use(cors(Cors_Config));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (request, response) => {
  response.send({
    message: "Hey The App Is Live",
    success: true,
  });
});

app.use("/app/v1", authRouter);
app.use("/app/v1", InboxRouter);



app.listen(PORT, () => {
  console.log(`App Is Listing On The Port:${PORT}`);
});