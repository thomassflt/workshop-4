"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchOnionRouters = void 0;
const simpleOnionRouter_1 = require("./simpleOnionRouter");
async function launchOnionRouters(n) {
    const promises = [];
    // launch a n onion routers
    for (let index = 0; index < n; index++) {
        const newPromise = (0, simpleOnionRouter_1.simpleOnionRouter)(index);
        promises.push(newPromise);
    }
    const servers = await Promise.all(promises);
    await (0, simpleOnionRouter_1.registerNodes)(n);
    return servers;
}
exports.launchOnionRouters = launchOnionRouters;
