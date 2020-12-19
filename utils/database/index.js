const mongoose = require('mongoose')

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
  StorageConfiguration: require('./models/storage-configuration.model'),
  FarmerConfiguration: require('./models/farmer-configuration.model'),
  DriverConfiguration: require('./models/driver-configuration.model'),
  User: require('./models/user.model'),
  Session: require('./models/session.model'),
  isValidId,
}
