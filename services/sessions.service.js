const path = require('path')
const appDir = path.dirname(require.main.filename)

const model = require(path.join(appDir, '/utils/database')).Session

const search = async (payload) => {
  const ids = await model.find(payload).distinct('_id').exec()
  return ids
}

const getAll = async () => {
  const ids = await model.find().distinct('_id').exec()
  return ids
}

const create = async (payload) => {
  const resource = new model(payload)
  await resource.save()
  return resource
}

const get = async (id) => {
  const resource = await model.findById(id).exec()
  return resource
}

const update = async (id, payload) => {
  await model.findByIdAndUpdate(id, { $set: payload }).exec()
  return await model.findById(id)
}

const terminate = async (id) => {
  await model.findByIdAndDelete(id).exec()
}

module.exports = { search, getAll, create, get, update, terminate }
