import express, { Express, Request, Response } from "express";
import env from "./config/LoadEnv";
import sessionMiddleware from "./middleware/SessionMiddleware";
import uploadRouter from "./router/SubmissionRouter";
import authRouter from "./router/AuthRouter";
import initializeSentry from "./utils/sentry/Sentry";
import cors from "cors";

const app: Express = express();
const port = env.PORT || 80;
const sentry = initializeSentry(app);

//cors handling
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], //can be added to fit the frontend request
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(sentry.Handlers.requestHandler());
app.use(sentry.Handlers.tracingHandler());

app.get("/", (_: Request, res: Response) => {
  res.send("OK");
});

app.use("/api/submission", uploadRouter);
app.use("/api/auth/", authRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
