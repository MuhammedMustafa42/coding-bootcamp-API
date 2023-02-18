const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");

//@description      Get all bootcamps
//@route            GET /api/v1/bootcamps
//@access           Public
exports.getBootcamps = async (_req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

//@description      Get single bootcamps
//@route            GET /api/v1/bootcamps/:id
//@access           Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

//@description      Create new bootcamp
//@route            POST /api/v1/bootcamps
//@access           Private
exports.CreateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

//@description      Update bootcamp
//@route            Put /api/v1/bootcamps/:id
//@access           Private
exports.UpdateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

//@description      Delete bootcamp
//@route            Put /api/v1/bootcamps/:id
//@access           Private
exports.DeleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

//@description      Get bootcamps within a radius
//@route            Put /api/v1/bootcamps/radius/:zipcode/:distance
//@access           Private
exports.getBootcampsInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // get latitude/longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of the Earth
    // Earth radius = 3963 miles / 6378 kilometers
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

//@description      Upload photo for bootcamp
//@route            PUT /api/v1/bootcamps/:id/photo
//@access           Private
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the img is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image file less than ${
            process.env.MAX_FILE_UPLOAD / 1000000
          }MB`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  } catch (error) {
    next(error);
  }
};
