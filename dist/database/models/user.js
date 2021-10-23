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
const auth_1 = __importDefault(require("../../api/auth"));
class User {
    constructor(email, password, firstName, lastName, buckets) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.buckets = buckets;
    }
    static createUser(email, pass, passCheck, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof email === 'undefined' || email === '') {
                throw new Error("Invalid Email");
            }
            if (typeof firstName === 'undefined' || firstName === '') {
                throw new Error("Invalid First Name");
            }
            if (typeof lastName === 'undefined' || lastName === '') {
                throw new Error("Invalid Last Name");
            }
            if (typeof pass === 'undefined' || passCheck === 'undefined' || pass.length < 4 || pass !== passCheck) {
                throw new Error("Invalid Password");
            }
            const hash = yield auth_1.default.hashPassword(pass);
            const result = yield data_1.default.createUser(email, hash, firstName, lastName, []);
            return new User(email, pass, firstName, lastName, null);
        });
    }
    static getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield data_1.default.getUser(email);
            return new User(user.email, user.password, user.firstName, user.lastName, user.buckets);
        });
    }
    addBucket(bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.buckets.includes(bucket)) {
                throw new Error("Bucket Already Exists");
            }
            this.buckets.push(bucket);
            const res = yield data_1.default.setBuckets(this.email, this.buckets);
            const tempBuckets = yield User.getUser(this.email);
            this.buckets = tempBuckets.buckets;
        });
    }
    deleteBucket(bucket) {
        if (this.buckets.includes(bucket)) {
            const index = this.buckets.indexOf(bucket);
            this.buckets.splice(index, 1);
            data_1.default.setBuckets(this.email, this.buckets);
        }
        else {
            throw new Error("Bucket Does Not Exist");
        }
    }
    editBucket(oldBucket, newBucket) {
        if (this.buckets.includes(oldBucket)) {
            const index = this.buckets.indexOf(oldBucket);
            this.buckets[index] = newBucket;
            data_1.default.setBuckets(this.email, this.buckets);
        }
        else {
            throw new Error("Bucket Does Not Exist");
        }
    }
    deleteUser() {
        console.log("Does not exist yet");
    }
    editUser() {
        console.log("Does not exist yet");
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map