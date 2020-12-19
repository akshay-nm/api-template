const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({}, { strict: false })

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id
  },
})

module.exports = mongoose.model('FarmerConfiguration', schema)
