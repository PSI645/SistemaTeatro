const pool = require('../config/db');

async function listar(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM atores ORDER BY nome');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM atores WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: 'Ator nao encontrado.' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function criar(req, res) {
  const { nome, idade, vocacao, descricao, usuario_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO atores (nome, idade, vocacao, descricao, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [nome, idade, vocacao, descricao, usuario_id || null]
    );
    return res.status(201).json({ id: result.insertId, nome, idade, vocacao });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function atualizar(req, res) {
  const { nome, idade, vocacao, descricao } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE atores SET nome = ?, idade = ?, vocacao = ?, descricao = ? WHERE id = ?',
      [nome, idade, vocacao, descricao, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Ator nao encontrado.' });
    return res.json({ mensagem: 'Ator atualizado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM atores WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Ator nao encontrado.' });
    return res.json({ mensagem: 'Ator removido com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };