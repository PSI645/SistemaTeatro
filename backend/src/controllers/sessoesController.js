const pool = require('../config/db');

async function listar(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, p.nome AS peca_nome
      FROM sessoes s
      INNER JOIN pecas p ON s.peca_id = p.id
      ORDER BY s.data_inicio, s.hora
    `);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [sessao] = await pool.query(`
      SELECT s.*, p.nome AS peca_nome, p.tema, p.descricao AS peca_descricao
      FROM sessoes s
      INNER JOIN pecas p ON s.peca_id = p.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (!sessao.length) return res.status(404).json({ erro: 'Sessao nao encontrada.' });

    const [atores] = await pool.query(`
      SELECT a.id, a.nome, a.vocacao
      FROM sessao_atores sa
      INNER JOIN atores a ON sa.ator_id = a.id
      WHERE sa.sessao_id = ?
    `, [req.params.id]);

    return res.json({ ...sessao[0], atores });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function criar(req, res) {
  const { nome, peca_id, data_inicio, hora, classificacao, disponibilidade, atores } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO sessoes (nome, peca_id, data_inicio, hora, classificacao, disponibilidade) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, peca_id, data_inicio, hora, classificacao, disponibilidade || 'em_breve']
    );

    const sessaoId = result.insertId;

    if (atores && atores.length) {
      const valores = atores.map(ator_id => [sessaoId, ator_id]);
      await conn.query('INSERT INTO sessao_atores (sessao_id, ator_id) VALUES ?', [valores]);
    }

    await conn.commit();
    return res.status(201).json({ id: sessaoId, nome, peca_id, data_inicio });
  } catch (err) {
    await conn.rollback();
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  } finally {
    conn.release();
  }
}

async function atualizar(req, res) {
  const { nome, peca_id, data_inicio, hora, classificacao, disponibilidade, atores } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'UPDATE sessoes SET nome = ?, peca_id = ?, data_inicio = ?, hora = ?, classificacao = ?, disponibilidade = ? WHERE id = ?',
      [nome, peca_id, data_inicio, hora, classificacao, disponibilidade, req.params.id]
    );

    if (!result.affectedRows) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Sessao nao encontrada.' });
    }

    if (atores) {
      await conn.query('DELETE FROM sessao_atores WHERE sessao_id = ?', [req.params.id]);
      if (atores.length) {
        const valores = atores.map(ator_id => [req.params.id, ator_id]);
        await conn.query('INSERT INTO sessao_atores (sessao_id, ator_id) VALUES ?', [valores]);
      }
    }

    await conn.commit();
    return res.json({ mensagem: 'Sessao atualizada com sucesso.' });
  } catch (err) {
    await conn.rollback();
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  } finally {
    conn.release();
  }
}

async function atualizarDisponibilidade(req, res) {
  const { disponibilidade } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE sessoes SET disponibilidade = ? WHERE id = ?',
      [disponibilidade, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Sessao nao encontrada.' });
    return res.json({ mensagem: 'Disponibilidade atualizada.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM sessoes WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Sessao nao encontrada.' });
    return res.json({ mensagem: 'Sessao removida com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, atualizarDisponibilidade, remover };