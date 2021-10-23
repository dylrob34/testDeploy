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
const auth_1 = __importDefault(require("./auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../database/models/user"));
router.get('/getUser', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.getUser(req.authData.user);
    res.json({ user });
}));
router.post('/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email.toLowerCase();
    const pass = req.body.password;
    const passCheck = req.body.passCheck;
    try {
        const user = yield user_1.default.createUser(email, pass, passCheck, firstName, lastName, true);
    }
    catch (error) {
        return res.json({ error: true, message: error });
    }
    jsonwebtoken_1.default.sign({ user: email }, process.env.secretKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            console.log("signing error");
            return res.json({ error: true });
        }
        res.cookie("jwt", token);
        return res.json({
            error: false,
            loggedIn: true,
            token
        });
    });
}));
exports.default = router;
//# sourceMappingURL=user.js.map