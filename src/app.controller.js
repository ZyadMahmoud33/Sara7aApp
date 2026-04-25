import connectDB from "./DB/conecctions.js";
import { connectRedis } from "./DB/redis.connection.js";
import { authRouter , userRouter , messageRouter } from "./Modules/index.js";
import {
    globalErorrHandler,
    NotFoundException,
} from "./Utlis/response/error.response.js";
import { successResponse } from "./Utlis/response/succes.response.js";
import cors from "cors";
import path from "node:path";
import { emailSubject, sendEmail } from "./Utlis/email/email.utils.js";
import { corsOptions } from "./Utlis/cors/cors.util.js";
import helmet from "helmet";
import { attachRouterWithLogger } from "./Utlis/loggers/morgan.logger.js";
import { customRateLimiter } from "./Middlewares/rateLimitter.middleware.js";

const bootstrap = async (app, express) => {
    app.use(express.json() , cors(corsOptions()), helmet(), customRateLimiter);

    await connectDB();
    await connectRedis();

    attachRouterWithLogger(app, "/api", authRouter, "access.log");
    app.use("/uploads", express.static(path.resolve("./src/uploads")));
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/message", messageRouter);

    app.all("/*dummy", (req, res) => {
       throw NotFoundException ({message: "not found Handler!!"})
    });

    app.use(globalErorrHandler);
};

export default bootstrap;