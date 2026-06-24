const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token nao fornecido.' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}

function apenasGestor(req, res, next) {
  if (req.usuario?.perfil !== 'gestor') {
    return res.status(403).json({ erro: 'Acesso restrito ao gestor.' });
  }
  next();
}

function apenasAtor(req, res, next) {
  if (req.usuario?.perfil !== 'ator') {
    return res.status(403).json({ erro: 'Acesso restrito ao ator.' });
  }
  next();
}

module.exports = { autenticar, apenasGestor, apenasAtor };