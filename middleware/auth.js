const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protege as rotas
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Token utilizando bearer header
    token = req.headers.authorization.split(' ')[1];
    // Token utilizando cookie
  }
  // } else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Garante que o token existe
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Adiciona o usuário logado a requisição/query atual
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Concede acesso a role especifica
exports.authorize = (...roles) => {
  // ...roles Traz as roles que tem acesso a requisição especifica como parâmetro

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`
        ),
        403
      );
    }
    next();
  };
};
