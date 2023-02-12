const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  CreateBootcamp,
  UpdateBootcamp,
  DeleteBootcamp,
  getBootcampsInRadius
} = require("../controllers/bootcamps");

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route("/")
  .get(getBootcamps)
  .post(CreateBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(UpdateBootcamp)
  .delete(DeleteBootcamp);

module.exports = router;
