//@description      Get all bootcamps
//@route            GET /api/v1/bootcamps
//@access           Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

//@description      Get single bootcamps
//@route            GET /api/v1/bootcamps/:id
//@access           Public

exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

//@description      Create new bootcamp
//@route            POST /api/v1/bootcamps
//@access           Private

exports.CreateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

//@description      Update bootcamp
//@route            Put /api/v1/bootcamps/:id
//@access           Private

exports.UpdateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

//@description      Delete bootcamp
//@route            Put /api/v1/bootcamps/:id
//@access           Private

exports.DeleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
