-- ============================================================
-- SISTEMA DE TEATRO - Schema do Banco de Dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS sistema_teatro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_teatro;

-- ------------------------------------------------------------
-- TABELA: clientes
-- Pessoas que compram ingressos
-- ------------------------------------------------------------
CREATE TABLE clientes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(150)        NOT NULL,
  email       VARCHAR(200)        NOT NULL UNIQUE,
  senha       VARCHAR(255)        NOT NULL,
  telefone    VARCHAR(20),
  ano_nasc    YEAR                NOT NULL,
  criado_em   TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABELA: usuarios
-- Gestores e atores com acesso ao painel administrativo
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(150)                        NOT NULL,
  email     VARCHAR(200)                        NOT NULL UNIQUE,
  senha     VARCHAR(255)                        NOT NULL,
  perfil    ENUM('gestor', 'ator')              NOT NULL,
  ativo     TINYINT(1)                          NOT NULL DEFAULT 1,
  criado_em TIMESTAMP                           NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABELA: pecas
-- Pecas de teatro cadastradas pelo gestor
-- ------------------------------------------------------------
CREATE TABLE pecas (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(200)  NOT NULL,
  tema       VARCHAR(200),
  descricao  TEXT,
  criado_em  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABELA: atores
-- Perfil dos atores cadastrados
-- Pode ser vinculado a um usuario do tipo 'ator'
-- ------------------------------------------------------------
CREATE TABLE atores (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT UNSIGNED UNIQUE,          -- NULL se cadastrado so pelo gestor
  nome         VARCHAR(150)  NOT NULL,
  idade        TINYINT UNSIGNED,
  vocacao      ENUM('musico', 'cantor', 'ator') NOT NULL DEFAULT 'ator',
  descricao    TEXT,
  criado_em    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_ator_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- TABELA: sessoes
-- Cada sessao referencia uma peca e tem seus proprios dados
-- ------------------------------------------------------------
CREATE TABLE sessoes (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(200)    NOT NULL,
  peca_id         INT UNSIGNED    NOT NULL,
  data_inicio     DATE            NOT NULL,
  hora            TIME            NOT NULL,
  classificacao   VARCHAR(10),              -- ex: 'Livre', '12', '14', '16', '18'
  disponibilidade ENUM('disponivel', 'esgotada', 'em_breve') NOT NULL DEFAULT 'em_breve',
  criado_em       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sessao_peca
    FOREIGN KEY (peca_id) REFERENCES pecas(id)
    ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- TABELA: sessao_atores
-- Relacionamento N:N entre sessoes e atores
-- ------------------------------------------------------------
CREATE TABLE sessao_atores (
  sessao_id   INT UNSIGNED NOT NULL,
  ator_id     INT UNSIGNED NOT NULL,

  PRIMARY KEY (sessao_id, ator_id),

  CONSTRAINT fk_sa_sessao
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_sa_ator
    FOREIGN KEY (ator_id) REFERENCES atores(id)
    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- TABELA: ingressos
-- Cada ingresso pertence a uma sessao e tem um valor definido
-- pelo gestor. A compra gera um registro vinculando ao cliente.
-- ------------------------------------------------------------
CREATE TABLE ingressos (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sessao_id     INT UNSIGNED    NOT NULL,
  valor         DECIMAL(10,2)   NOT NULL,
  descricao     TEXT,
  -- campos preenchidos no momento da compra
  cliente_id    INT UNSIGNED,
  data_compra   TIMESTAMP,
  -- a validade e a data_inicio da sessao (redundancia controlada para o ingresso fisico)
  data_validade DATE,
  criado_em     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_ingresso_sessao
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_ingresso_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- TABELA: pedidos
-- Agrupa ingressos comprados em uma mesma transacao
-- ------------------------------------------------------------
CREATE TABLE pedidos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cliente_id  INT UNSIGNED    NOT NULL,
  sessao_id   INT UNSIGNED    NOT NULL,
  comprado_em TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total       DECIMAL(10,2)   NOT NULL DEFAULT 0.00,

  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_pedido_sessao
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id)
    ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- TABELA: pedido_ingressos
-- Relaciona cada pedido com os ingressos comprados
-- ------------------------------------------------------------
CREATE TABLE pedido_ingressos (
  pedido_id    INT UNSIGNED NOT NULL,
  ingresso_id  INT UNSIGNED NOT NULL,

  PRIMARY KEY (pedido_id, ingresso_id),

  CONSTRAINT fk_pi_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_pi_ingresso
    FOREIGN KEY (ingresso_id) REFERENCES ingressos(id)
    ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- VIEWS uteis
-- ------------------------------------------------------------

-- Ingresso completo com dados da sessao, peca e cliente
CREATE OR REPLACE VIEW view_ingressos_completos AS
SELECT
  i.id                    AS ingresso_id,
  i.valor,
  i.descricao             AS ingresso_descricao,
  i.data_compra,
  i.data_validade,
  c.id                    AS cliente_id,
  c.nome                  AS cliente_nome,
  s.id                    AS sessao_id,
  s.nome                  AS sessao_nome,
  s.data_inicio,
  s.hora,
  s.classificacao,
  p.id                    AS peca_id,
  p.nome                  AS peca_nome
FROM ingressos i
  LEFT JOIN clientes c ON i.cliente_id = c.id
  INNER JOIN sessoes s  ON i.sessao_id  = s.id
  INNER JOIN pecas   p  ON s.peca_id    = p.id;

-- Sessao com os atores listados
CREATE OR REPLACE VIEW view_sessoes_atores AS
SELECT
  s.id            AS sessao_id,
  s.nome          AS sessao_nome,
  s.data_inicio,
  s.hora,
  s.disponibilidade,
  p.nome          AS peca_nome,
  a.id            AS ator_id,
  a.nome          AS ator_nome,
  a.vocacao
FROM sessoes s
  INNER JOIN pecas       p  ON s.peca_id  = p.id
  LEFT  JOIN sessao_atores sa ON s.id     = sa.sessao_id
  LEFT  JOIN atores       a  ON sa.ator_id = a.id;

-- ------------------------------------------------------------
-- USUARIO GESTOR INICIAL (senha: admin123 - deve ser trocada)
-- Na aplicacao, a senha sera armazenada com bcrypt.
-- Aqui usamos um placeholder para referencia.
-- ------------------------------------------------------------
INSERT INTO usuarios (nome, email, senha, perfil, ativo)
VALUES ('Administrador', 'admin@teatro.com', 'HASH_BCRYPT_AQUI', 'gestor', 1);