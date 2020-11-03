const router = require("express").Router()

router.use("/docs", require("./docs"))
router.use("/sample", require("./sample"))

module.exports = router
