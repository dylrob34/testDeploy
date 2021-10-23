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
class Team {
    constructor(id, owner, name, admins, users, buckets) {
        this._id = id;
        this.owner = owner; // email
        this.name = name; // string
        this.admins = admins; // list of emails
        this.users = users; // list of emails
        this.buckets = buckets; // list of strings
    }
    static getTeam(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const temp = yield data_1.default.getTeam(id);
            return new Team(temp._id, temp.owner, temp.name, temp.admins, temp.users, temp.buckets);
        });
    }
    static getTeams(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const temp = yield data_1.default.getTeams(email);
            console.log(`Temp: ${temp}`);
            const teams = [];
            for (const team of temp) {
                teams.push(new Team(team._id, team.owner, team.name, team.admins, team.users, team.buckets));
            }
            return teams;
        });
    }
    static createTeam(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield data_1.default.createTeam(email, name);
            const team = yield Team.getTeam(result.ops[0]._id);
            return team;
        });
    }
    deleteTeam() {
        return __awaiter(this, void 0, void 0, function* () {
            data_1.default.deleteTeam(this._id);
        });
    }
    editTeam(owner, admins, users, name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.owner = owner;
            this.admins = admins;
            this.users = users;
            this.name = name;
            const newTask = yield data_1.default.updateTeam(this._id, this.owner, this.name, this.admins, this.users);
            const team = yield Team.getTeam(this._id);
            return team;
        });
    }
    addBucket(bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.buckets.includes(bucket)) {
                throw new Error("Bucket Already Exists");
            }
            this.buckets.push(bucket);
            const res = yield data_1.default.setTeamBuckets(this._id, this.buckets);
            const tempBuckets = yield Team.getTeam(this._id);
            this.buckets = tempBuckets.buckets;
        });
    }
    deleteBucket(bucket) {
        if (this.buckets.includes(bucket)) {
            const index = this.buckets.indexOf(bucket);
            this.buckets.splice(index, 1);
            data_1.default.setTeamBuckets(this._id, this.buckets);
        }
        else {
            throw new Error("Bucket Does Not Exist");
        }
    }
    editBucket(oldBucket, newBucket) {
        if (this.buckets.includes(oldBucket)) {
            const index = this.buckets.indexOf(oldBucket);
            this.buckets[index] = newBucket;
            data_1.default.setTeamBuckets(this._id, this.buckets);
        }
        else {
            throw new Error("Bucket Does Not Exist");
        }
    }
}
exports.default = Team;
//# sourceMappingURL=teams.js.map