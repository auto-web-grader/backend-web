import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "../config/RedisClient";

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SECRET_ACCESS_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "strict",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    },
})

export default sessionMiddleware;