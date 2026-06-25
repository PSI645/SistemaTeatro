const pool = require('../config/db');

async function listarPorSessao(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ingressos WHERE sessao_id = ?',
      [req.params.sessao_id]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function criar(req, res) {
  const { sessao_id, valor, descricao } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO ingressos (sessao_id, valor, descricao) VALUES (?, ?, ?)',
      [sessao_id, valor, descricao]
    );
    return res.status(201).json({ id: result.insertId, sessao_id, valor });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function atualizar(req, res) {
  const { valor, descricao } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE ingressos SET valor = ?, descricao = ? WHERE id = ? AND cliente_id IS NULL',
      [valor, descricao, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(400).json({ erro: 'Ingresso nao encontrado ou ja vendido.' });
    }
    return res.json({ mensagem: 'Ingresso atualizado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

async function comprar(req, res) {
  const cliente_id = req.usuario.id;
  const { ingresso_id } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT * FROM ingressos WHERE id = ? AND cliente_id IS NULL FOR UPDATE',
      [ingresso_id]
    );

    if (!rows.length) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Ingresso indisponivel ou ja vendido.' });
    }

    const ingresso = rows[0];
    const [sessao] = await conn.query(
      'SELECT data_inicio FROM sessoes WHERE id = ?',
      [ingresso.sessao_id]
    );

    await conn.query(
      'UPDATE ingressos SET cliente_id = ?, data_compra = NOW(), data_validade = ? WHERE id = ?',
      [cliente_id, sessao[0].data_inicio, ingresso_id]
    );

    const [pedido] = await conn.query(
      'INSERT INTO pedidos (cliente_id, sessao_id, total) VALUES (?, ?, ?)',
      [cliente_id, ingresso.sessao_id, ingresso.valor]
    );

    await conn.query(
      'INSERT INTO pedido_ingressos (pedido_id, ingresso_id) VALUES (?, ?)',
      [pedido.insertId, ingresso_id]
    );

    await conn.commit();
    return res.status(201).json({ mensagem: 'Compra realizada com sucesso.', pedido_id: pedido.insertId });
  } catch (err) {
    await conn.rollback();
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  } finally {
    conn.release();
  }
}

async function meusPedidos(req, res) {
  const cliente_id = req.usuario.id;
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id AS pedido_id,
        p.comprado_em,
        p.total,
        s.nome AS sessao_nome,
        s.data_inicio,
        s.hora,
        pc.nome AS peca_nome,
        i.id AS ingresso_id,
        i.valor,
        i.data_validade
      FROM pedidos p
      INNER JOIN sessoes s ON p.sessao_id = s.id
      INNER JOIN pecas pc ON s.peca_id = pc.id
      INNER JOIN pedido_ingressos pi ON p.id = pi.pedido_id
      INNER JOIN ingressos i ON pi.ingresso_id = i.id
      WHERE p.cliente_id = ?
      ORDER BY p.comprado_em DESC
    `, [cliente_id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.', detalhe: err.message });
  }
}

module.exports = { listarPorSessao, criar, atualizar, comprar, meusPedidos };