const mongoose = require("mongoose")

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}
mongoose.connect(process.env.MONGODB_URI, connectionOptions)
mongoose.Promise = global.Promise

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

module.exports = {
  Sample: require("./models/sample.model"),
  isValidId,
}
