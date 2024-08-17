const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
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
