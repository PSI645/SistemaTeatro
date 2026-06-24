const pool    = require('../config/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

// Login de usuario (gestor ou ator)
async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND ativo = 1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({ token, perfil: usuario.perfil, nome: usuario.nome });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

// Login de cliente
async function loginCliente(req, res) {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM clientes WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const cliente = rows[0];
    const senhaValida = await bcrypt.compare(senha, cliente.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const token = jwt.sign(
      { id: cliente.id, perfil: 'cliente', nome: cliente.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({ token, perfil: 'cliente', nome: cliente.nome });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

// Cadastro de cliente
async function cadastrarCliente(req, res) {
  const { nome, email, senha, telefone, ano_nasc } = req.body;

  try {
    const [existe] = await pool.query(
      'SELECT id FROM clientes WHERE email = ?',
      [email]
    );

    if (existe.length) {
      return res.status(409).json({ erro: 'Email ja cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      'INSERT INTO clientes (nome, email, senha, telefone, ano_nasc) VALUES (?, ?, ?, ?, ?)',
      [nome, email, hash, telefone, ano_nasc]
    );

    return res.status(201).json({ id: result.insertId, nome, email });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

// Cadastro de usuario (gestor cria atores/gestores)
async function cadastrarUsuario(req, res) {
  const { nome, email, senha, perfil } = req.body;

  try {
    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existe.length) {
      return res.status(409).json({ erro: 'Email ja cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hash, perfil]
    );

    return res.status(201).json({ id: result.insertId, nome, email, perfil });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

module.exports = { loginUsuario, loginCliente, cadastrarCliente, cadastrarUsuario };