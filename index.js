const express = require("express");
const app = express();
const {getUsers, getUserByID, createNewUser, deleteCurrentUser,updateCurrentUser, renderUserSS} = require('./utils/apiRoutesHandlers');
const {connectMongo} = require('./mongoos/connection')
const cors = require("cors");

// connect mongo
connectMongo().catch(e => console.log(e))

// Middleware Connections
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}))

// Routes for all user list
app.route("/api/users")
.get(getUsers)
.post(createNewUser);

// routes for specific user
app.route("/api/users/:id")
.get(getUserByID)
.patch(updateCurrentUser)
.delete(deleteCurrentUser)

// web routes
app.route("/users").get(renderUserSS);

// Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});

