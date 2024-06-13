const { default: mongoose } = require("mongoose");
const { UserSchema } = require("../mongoos/schema");
const {
	ReasonPhrases,
	StatusCodes,
} = require('http-status-codes');

const User = mongoose.model("users", UserSchema);


// get all users JSON
const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const finalResp = await User.find({}).skip(skip).limit(limit);
  const totalUsers = await User.countDocuments();
  return res.status(StatusCodes.OK).send({ users: finalResp, totalUsers });
};

// get user by ID
const getUserByID = async (req, res) => {
  const { id } = req.params;
  const requiredUser = await User.findById(id);
  if(!requiredUser) return res.status(StatusCodes.NO_CONTENT).end()
  return res.status(StatusCodes.OK).send(requiredUser);
};

// create new user
const createNewUser = (req, res) => {
  const UserDetails = req.body;
  const { firstName, gender, email, lastName, job } = UserDetails;
   User.create({
    firstName,
    lastName,
    email,
    gender,
    job,
  })
  .then(result =>{
    return res
      .status(StatusCodes.CREATED)
      .json({ status: StatusCodes.CREATED, message: ReasonPhrases.CREATED, user: result });
  })
  .catch((err) => {
    return res.status(StatusCodes.BAD_REQUEST).send({message:err.message})
  });
};

// update user with given ID
const updateCurrentUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, gender, job } = req.body;
  User.findByIdAndUpdate(
    id,
    { first_name, last_name, email, gender, job },
    { new: true }
  )
    .then((result) => {
      if(!result) return res.status(StatusCodes.NO_CONTENT).end();

      return res.status(StatusCodes.CREATED).send({ msg: ReasonPhrases.CREATED, user: result });
    })
    .catch((err) => {
      return res.status(StatusCodes.BAD_REQUEST).send({ msg: err.message });
    });
};

// delete user with given ID
const deleteCurrentUser = async (req, res) => {
  const { id } = req.params;
  const userToDelete = await User.findByIdAndDelete(id);
  if (userToDelete == null)
    return res.status(204).end();
  return res.status(StatusCodes.OK).send({ msg: "User deleted successfully." });
};


// SSR
const renderUserSS = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const finalResp = await User.find({}).skip(skip).limit(limit);
  

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
        <td>${user.firstName} ${user.lastName}</td>
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
  res.status(StatusCodes.OK).send(renderedPage);
};

// exports
module.exports.getUsers = getUsers;
module.exports.createNewUser = createNewUser;
module.exports.getUserByID = getUserByID;
module.exports.updateCurrentUser = updateCurrentUser;
module.exports.deleteCurrentUser = deleteCurrentUser;
module.exports.renderUserSS = renderUserSS
