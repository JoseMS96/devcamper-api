const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc    Registra o usuário
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Criar usuário
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Cria o token de acesso
  sendTokenResponse(user, 200, res);
});

// @desc    Realiza o login do usuário
// @route   POST /api/v1/auth/register
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar email e senha
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Checar o usuário
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Checa se a senha está correta
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401)); // Importante a mensagem ser igual a mensagem de cima pq se a mensagem for diferente um hacker pode tentar essa senha em outros emails e vice-versa
  }

  // Cria o token de acesso
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   Get /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Esqueci a senha
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('Email not found.', 404));
  }

  // Token de resetar senha
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Cria url de resetar senha
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false,
    });
    return next(new ErrorResponse('Email could not be sent'), 500);
  }
});

// @desc    Resetar a senha
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetpassword = asyncHandler(async (req, res, next) => {
  // Achar o token criptografado
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Checa se o token expirou
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Traz o token do model, cria o tcookie e envia resposta
const sendTokenResponse = (user, statusCode, res) => {
  // Criar o token de acesso
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Transforma o cookie em https
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ sucess: true, token });
};
