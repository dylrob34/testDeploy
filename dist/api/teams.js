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
const user_1 = __importDefault(require("../database/models/user"));
const teams_1 = __importDefault(require("../database/models/teams"));
router.post('/createTeam', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`name: ${req.body.name}`);
    const team = yield teams_1.default.createTeam(req.authData.user, req.body.name);
    if (team != null) {
        return res.json(team);
    }
    return res.json({ error: false });
}));
router.get('/getTeams', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield teams_1.default.getTeams(req.authData.user);
    return res.json({ teams });
}));
router.post("/getTeam", auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield teams_1.default.getTeam(req.body.team);
    return res.json({ team });
}));
router.post('/editTeam', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.getUser(req.authData.user);
    try {
        yield user.editBucket(req.body.oldBucket, req.body.newBucket);
    }
    catch (error) {
        return res.json({ error: true, message: error });
    }
    res.json({ error: false });
}));
router.post('/deleteTeam', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.getUser(req.authData.user);
    try {
        yield user.deleteBucket(req.body.bucket);
    }
    catch (error) {
        return res.json({ error: true, message: error });
    }
    res.json({ error: false });
}));
exports.default = router;
//# sourceMappingURL=teams.js.map