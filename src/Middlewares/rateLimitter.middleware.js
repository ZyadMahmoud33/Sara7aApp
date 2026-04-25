import { count } from "node:console";
import { get, set, incr } from "../DB/redis.service.js"; // عدل الباث حسب عندك

//ip request 
const ipRequest = {};

// set of blocked ips
const blockedIps = new Set();

//Map {"127.0.0.1" -> { time, count}, "192.168.1.1" -> { }}
const unBlockerTimers = new Map();

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

export const customRateLimiter = (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    if (blockedIps.has(ip)) {
        return res.status(403).json({ message: "Blocked IP, try again later" });
    }

    if (!ipRequest[ip]) {
        ipRequest[ip] = {
            count: 1,
            startTime: currentTime,
        };
        return next();
    }

    const diff = currentTime - ipRequest[ip].startTime;

    if (diff > WINDOW_MS) {
        ipRequest[ip] = {
            count: 1,
            startTime: currentTime,
        };
    } else {
        ipRequest[ip].count++;

        if (ipRequest[ip].count > RATE_LIMIT) {
            blockedIps.add(ip);

            if (!unBlockerTimers.has(ip)) {
                const timer = setTimeout(() => {
                    blockedIps.delete(ip);
                    unBlockerTimers.delete(ip);
                }, WINDOW_MS);

                unBlockerTimers.set(ip, timer);
            }

            return res.status(429).json({
                message: "Too Many Requests, You Are Blocked",
            });
        }
    }

    next();
};

