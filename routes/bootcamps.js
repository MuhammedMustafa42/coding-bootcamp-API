const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  CreateBootcamp,
  UpdateBootcamp,
  DeleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

// Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(bootcampPhotoUpload);

router.route("/").get(getBootcamps).post(CreateBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(UpdateBootcamp)
  .delete(DeleteBootcamp);

module.exports = router;
