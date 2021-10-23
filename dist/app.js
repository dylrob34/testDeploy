"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const corsOptions = {
    origin: "http://localhost:3000"
};
const index_1 = __importDefault(require("./index"));
const auth_1 = __importDefault(require("./api/auth"));
const user_1 = __importDefault(require("./api/user"));
const teams_1 = __importDefault(require("./api/teams"));
const task_1 = __importDefault(require("./api/task"));
const bucket_1 = __importDefault(require("./api/bucket"));
const app = (0, express_1.default)();
const port = 80;
app.use(express_1.default.static(__dirname + '/build'));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use('/', index_1.default);
app.use('/api/auth', auth_1.default.router);
app.use('/api/user', user_1.default);
app.use('/api/teams', teams_1.default);
app.use('/api/task', task_1.default);
app.use('/api/buckets', bucket_1.default);
app.listen(port, () => {
    console.log(`To Do App listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map