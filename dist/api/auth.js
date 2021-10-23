"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_1 = __importDefault(require("../database/data"));
/* Login API */
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.user === "" || req.body.pass === "") {
        return res.json({ error: true, login: false });
    }
    const email = req.body.user.toLowerCase();
    console.log(email + " Attempting to login...");
    const pass = req.body.pass;
    class User {
    }
    const user = yield data_1.default.getUser(email);
    if (user === null || (typeof user) === "undefined") {
        console.log("Error: idk");
        res.json({ error: true });
    }
    else {
        bcrypt_1.default.compare(pass, user.password, (err, result) => {
            if (result) {
                jsonwebtoken_1.default.sign({ user: user.email }, process.env.secretKey, { expiresIn: "2h" }, (errr, token) => {
                    if (errr) {
                        console.log("signing error");
                        res.json({ error: true });
                    }
                    res.cookie("jwt", token);
                    res.json({
                        error: false,
                        loggedIn: true,
                        token
                    });
                });
            }
            else {
                res.json({ error: true, login: false });
            }
        });
    }
}));
router.get('/checkLogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ loggedIn: true });
}));
function hashPassword(pass) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.hash(pass, 10)
            .then((hashed) => { resolve(hashed); });
    });
}
function verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jsonwebtoken_1.default.verify(bearerToken, process.env.secretKey, (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res.json({ error: true, message: "You are not logged in" });
            }
            else {
                req.authData = data;
                return next();
            }
        }));
    }
    else {
        return res.json({ error: true });
    }
}
exports.default = { router, hashPassword, verifyToken };
//# sourceMappingURL=auth.js.map