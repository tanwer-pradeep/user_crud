const { default: mongoose } = require("mongoose");
const { UserSchema } = require("../mongoos/schema");
const {
	ReasonPhrases,
	StatusCodes,
} = require('http-status-codes');

const User = mongoose.model("users", UserSchema);


// get all users JSON
const getUsers = async (req, res) => {
  const { page, limit = 10 } = req.query;
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

// exports
module.exports.getUsers = getUsers;
module.exports.createNewUser = createNewUser;
module.exports.getUserByID = getUserByID;
module.exports.updateCurrentUser = updateCurrentUser;
module.exports.deleteCurrentUser = deleteCurrentUser;
