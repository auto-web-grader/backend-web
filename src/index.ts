import express, { Express, Request, Response } from "express";
import env from "./config/LoadEnv";
import sessionMiddleware from "./middleware/SessionMiddleware";
import uploadRouter from "./router/SubmissionRouter";
import authRouter from "./router/AuthRouter";
import initializeSentry from "./utils/sentry/Sentry";

const app: Express = express();
const port = env.PORT || 80;
const sentry = initializeSentry(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(sentry.Handlers.requestHandler());
app.use(sentry.Handlers.tracingHandler());

app.get("/", (_: Request, res: Response) => {
  res.send("OK");
});

app.use("/api/", uploadRouter);
app.use("/api/", authRouter);

app.use(sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.get("/sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
