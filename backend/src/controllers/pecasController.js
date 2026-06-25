const pool = require('../config/db');

async function listar(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM pecas ORDER BY nome');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM pecas WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: 'Peca nao encontrada.' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function criar(req, res) {
  const { nome, tema, descricao } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO pecas (nome, tema, descricao) VALUES (?, ?, ?)',
      [nome, tema, descricao]
    );
    return res.status(201).json({ id: result.insertId, nome, tema, descricao });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function atualizar(req, res) {
  const { nome, tema, descricao } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE pecas SET nome = ?, tema = ?, descricao = ? WHERE id = ?',
      [nome, tema, descricao, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Peca nao encontrada.' });
    return res.json({ mensagem: 'Peca atualizada com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM pecas WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Peca nao encontrada.' });
    return res.json({ mensagem: 'Peca removida com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };