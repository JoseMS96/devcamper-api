const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copiando req.query
  const reqQuery = { ...req.query };

  // Campos a excluir da query
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Percorre removeFields e deleta eles da query
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery); // 1 - filtering is very simple with Express and Mongoose

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  ); // lte, gte, etc are mongoose operators, but it needs a money sign to work
  // some URLs may be encoded prior to reaching your Node.js backend. In other words, the $ symbol could be represented as %24 in URLs.
  // which is why it might not be best practice to have front-end send the $ in the request

  // Traz recursos
  query = model.find(JSON.parse(queryStr)); // 2 - filtering is very simple with Express and Mongoose
  // Populate brings the actual courses info to the response

  // Seleciona campos a serem trazidos| Ex: {{URL}}/api/v1/bootcamps?select=name,description : Traz só os campos nome e descrição dos bootcamps
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Ordenação | Ex: {{URL}}/api/v1/bootcamps?sort=-name = Nome descendente: Z -> A
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Ordenação padrão caso não venha nada na query; Data de criação descendente
    query = query.sort('-createdAt');
  }

  // Paginação || Número da página e número(limite) de recursos por página | Ex: {{URL}}/api/v1/bootcamps?limit=2&select=name
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executa a query
  const results = await query;

  //Resultado da paginação
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit, // same as limit: limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
