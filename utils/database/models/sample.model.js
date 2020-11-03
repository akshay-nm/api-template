const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  sample: { type: Schema.Types.String },
})

module.exports = mongoose.model("Sample", schema)
