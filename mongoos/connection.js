const { default: mongoose } = require('mongoose');
require("dotenv").config();


// Mongo DB Connections
// mongoose.connect(process.env.MONGO_DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(response=>{
//     console.log('MongoDB Connection Succeeded.')
// }).catch(error=>{
//     console.log('Error in DB connection: ' + error)
// });


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const URI = process.env.MONGO_DB_URL_CLOUD
.replace('${MONGO_CLOUD_USER}', process.env.MONGO_CLOUD_USER)
.replace('${MONGO_CLOUD_PASSWORD}', process.env.MONGO_CLOUD_PASSWORD)


module.exports.connectMongo = async () => {
  try {
    await mongoose.connect(URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}