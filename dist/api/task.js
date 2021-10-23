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
const data_1 = __importDefault(require("../database/data"));
const auth_1 = __importDefault(require("./auth"));
const task_1 = __importDefault(require("../database/models/task"));
const teams_1 = __importDefault(require("../database/models/teams"));
router.get('/getTasks', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield data_1.default.getTasks(req.authData.user);
    return res.json({ tasks });
}));
router.post("/getTeamTasks", auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield data_1.default.getTeamTasks(req.body.team);
    return res.json({ tasks });
}));
router.post('/createTask', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = null;
    let team = null;
    if (req.body.team !== undefined) {
        team = req.body.team;
    }
    else {
        user = req.authData.user;
    }
    const assignees = [];
    const title = req.body.title;
    const body = req.body.body;
    const task = yield task_1.default.createTask(user, team, assignees, title, body);
    return res.json({ error: false });
}));
router.post('/editTask', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authData.user;
    const taskId = req.body.id;
    const assignees = req.body.assignees;
    const title = req.body.title;
    const body = req.body.body;
    const task = yield task_1.default.getTask(taskId);
    if (task.team !== undefined) {
        const team = yield teams_1.default.getTeam(task.team);
        if (team.owner === user || team.admins.includes(user) || team.users.includes(user)) {
            yield task.editTask(assignees, title, body);
            return res.json({ error: false });
        }
    }
    if (task.user === user) {
        yield task.editTask(assignees, title, body);
        return res.json({ error: false });
    }
    return res.json({ error: true });
}));
router.post('/deleteTask', auth_1.default.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authData.user;
    const taskId = req.body.id;
    const task = yield task_1.default.getTask(taskId);
    if (task.user === user) {
        yield task.deleteTask();
        return res.json({ error: false });
    }
    else {
        return res.json({ error: true });
    }
}));
exports.default = router;
//# sourceMappingURL=task.js.map