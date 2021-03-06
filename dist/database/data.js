"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// Connection URI
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@todo.5yfiz.mongodb.net/toDo?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err, c) => {
    if (err) {
        console.log("Error connecting to database...");
    }
    else {
        console.log("Successfully Connected to Database");
    }
});
/*******************
 *
 *******Users*******
 *
 *******************/
function getUser(email) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("users").findOne({ email })
            .then((user) => {
            resolve(user);
        });
    });
}
function createUser(email, password, firstName, lastName, buckets) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("users").insertOne({
            email,
            password,
            firstName,
            lastName,
            buckets
        })
            .then((result) => {
            resolve(result);
        });
    });
}
function setBuckets(email, buckets) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("users").updateOne({ email }, {
            "$set": { buckets }
        })
            .then((result) => {
            resolve(result);
        });
    });
}
/*******************
 *
 *******Teams*******
 *
 *******************/
function createTeam(owner, name) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("teams").insertOne({
            owner,
            name,
            admins: [],
            users: [],
            buckets: []
        })
            .then((result) => {
            resolve(result);
        });
    });
}
function getTeam(id) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("teams").findOne({ _id: (0, mongodb_1.ObjectId)(id) })
            .then((team) => {
            resolve(team);
        });
    });
}
function getTeams(email) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("teams").find({
            "$or": [
                { owner: email },
                { admins: { "$in": [email] } },
                { users: { "$in": [email] } }
            ]
        })
            .toArray((err, teams) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(teams);
            }
        });
    });
}
function updateTeam(id, owner, name, admins, users) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("teams").updateOne({ _id: (0, mongodb_1.ObjectId)(id) }, {
            "$set": { owner, name, admins, users }
        })
            .then((team) => {
            resolve(team);
        });
    });
}
function setTeamBuckets(id, buckets) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("teams").updateOne({ _id: (0, mongodb_1.ObjectId)(id) }, {
            "$set": { buckets }
        })
            .then((result) => {
            resolve(result);
        });
    });
}
function deleteTeam(id) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("teams").deleteOne({ _id: (0, mongodb_1.ObjectId)(id) })
            .then((team) => {
            resolve(team);
        });
    });
}
/*******************
 *
 *******TASKS*******
 *
 *******************/
function getTasks(email) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("tasks").find({ user: email }).toArray()
            .then((tasks) => {
            resolve(tasks);
        });
    });
}
function getTeamTasks(id) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("tasks").find({ team: id }).toArray()
            .then((tasks) => {
            resolve(tasks);
        });
    });
}
function getTask(id) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("tasks").findOne({ _id: (0, mongodb_1.ObjectId)(id) })
            .then((task) => {
            resolve(task);
        });
    });
}
function updateTask(id, assignees, title, body, buckets) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("tasks").updateOne({ _id: (0, mongodb_1.ObjectId)(id) }, {
            "$set": { assignees, title, body, buckets }
        })
            .then((task) => {
            resolve(task);
        });
    });
}
function deleteTask(id) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("tasks").deleteOne({ _id: (0, mongodb_1.ObjectId)(id) })
            .then((task) => {
            resolve(task);
        });
    });
}
function createTask(user, team, assignees, title, body, buckets) {
    return new Promise((resolve, reject) => {
        client.db("toDo").collection("tasks").insertOne({
            user,
            team,
            assignees,
            title,
            body,
            buckets
        })
            .then((result) => {
            resolve(result);
        });
    });
}
exports.default = {
    getUser,
    createUser,
    setBuckets,
    createTeam,
    getTeam,
    getTeams,
    updateTeam,
    setTeamBuckets,
    deleteTeam,
    getTasks,
    getTeamTasks,
    getTask,
    updateTask,
    deleteTask,
    createTask
};
//# sourceMappingURL=data.js.map