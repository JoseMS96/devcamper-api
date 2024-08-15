// @desc    Traz dados de todos bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: 'Show all bootcamps' });
};

// @desc    Traz dados de um único bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: `Show bootcamp ${req.params.id}` });
};

// @desc    Cria um novo bootcamp
// @route   Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: 'Create new bootcamp' });
};

// @desc    Atualiza as informações de um bootcamp
// @route   Post /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc    Deleta um bootcamp
// @route   Post /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Delete bootcamp ${req.params.id}` });
};
