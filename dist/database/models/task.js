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
const data_1 = __importDefault(require("../data"));
const user_1 = __importDefault(require("./user"));
const teams_1 = __importDefault(require("./teams"));
const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
class Task {
    constructor(id, user, team, assignees, title, body, buckets) {
        this._id = id;
        this.user = user;
        this.team = team;
        this.assignees = assignees;
        this.title = title;
        this.body = body;
        this.buckets = buckets;
    }
    static getTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const temp = yield data_1.default.getTask(id);
            return new Task(temp._id, temp.user, temp.team, temp.assignees, temp.title, temp.body, temp.buckets);
        });
    }
    static createTask(user, team, assignees, title, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const buckets = Task.parseBuckets(body);
            const result = yield data_1.default.createTask(user, team, assignees, title, body, buckets);
            const task = yield Task.getTask(result.ops[0]._id);
            yield task.updateBuckets();
            return task;
        });
    }
    static parseBuckets(body) {
        const buckets = [];
        let track = false;
        for (const char of body) {
            if (char === "#") {
                track = true;
                buckets.push("");
                continue;
            }
            if (char === " " && track === true) {
                track = false;
            }
            if (track) {
                buckets[buckets.length - 1] = buckets[buckets.length - 1].concat(char);
            }
        }
        return buckets;
    }
    updateBuckets() {
        return __awaiter(this, void 0, void 0, function* () {
            let owner = null;
            if (this.user !== undefined) {
                owner = yield user_1.default.getUser(this.user);
            }
            else {
                owner = yield teams_1.default.getTeam(this.team);
            }
            this.buckets.forEach((bucket) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield owner.addBucket(bucket);
                }
                catch (error) {
                    if (error !== "Bucket Already Exists") {
                        throw new Error("An unknown error has occured");
                    }
                }
            }));
        });
    }
    deleteTask() {
        return __awaiter(this, void 0, void 0, function* () {
            data_1.default.deleteTask(this._id);
        });
    }
    editTask(assignees, title, body) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assignees = assignees;
            this.title = title;
            this.body = body;
            this.buckets = Task.parseBuckets(body);
            this.updateBuckets();
            const newTask = yield data_1.default.updateTask(this._id, assignees, title, body, this.buckets);
        });
    }
}
exports.default = Task;
//# sourceMappingURL=task.js.map