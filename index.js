const express = require("express");
const app = express();
const {getUsers, getUserByID, createNewUser, deleteCurrentUser,updateCurrentUser} = require('./utils/apiRoutesHandlers');
const {connectMongo} = require('./mongoos/connection')
const cors = require("cors");

// connect mongo
connectMongo().catch(e => console.log(e))

// Middleware Connections
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}))


// SSR handlers
const renderUserSS = (req, res) => {
  const { page, limit } = req.query;
  if (!page && !limit)
    res.send("please select the page number or limit of users.");
  const startIndex = limit ? 0 : (page - 1) * 10;
  const endIndex = limit ? limit : startIndex + 10;
  const finalResp = USERS?.slice(startIndex, endIndex);

  let renderedPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User List</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Loop through the users array to generate table rows
  finalResp.forEach((user, index) => {
    renderedPage += `
      <tr>
        <td>${index+1}</td>
        <td>${user.id}</td>
        <td>${user.first_name} ${user.last_name}</td>
        <td>${user.gender}</td>
        <td>${user.email}</td>
      </tr>
    `;
  });

  // Close the HTML tags
  renderedPage += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  res.send(renderedPage);
};

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

