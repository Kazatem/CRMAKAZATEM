-- Criação do banco e tabelas básicas para o CRM
CREATE DATABASE crmakazatem;
\c crmakazatem;

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  cargo TEXT NOT NULL CHECK (cargo IN ('admin', 'vendedor')),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  vendedor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cliente TEXT NOT NULL,
  produto TEXT NOT NULL,
  valor NUMERIC(12, 2) NOT NULL,
  data_venda DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS metas (
  id SERIAL PRIMARY KEY,
  vendedor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  meta_mensal NUMERIC(12, 2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insira usuários com senhas criptografadas via seed ou manualmente.
