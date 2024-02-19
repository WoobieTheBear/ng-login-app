import { headerFields } from "./config.mjs";

// global utilities
export const headers = (req, res, next) => {
    for (const key of Object.keys(headerFields)) {
        res.setHeader(key, headerFields[key]);
    }
    next();
}
