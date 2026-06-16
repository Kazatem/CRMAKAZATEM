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

-- Multi-tenant: empresas assinantes
CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  plano TEXT NOT NULL DEFAULT 'basico',
  valor_mensalidade NUMERIC(12,2) NOT NULL DEFAULT 197.00,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativo', 'cancelado', 'bloqueado')),
  vendedor_crm_id INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assinaturas e pagamentos
CREATE TABLE IF NOT EXISTS assinaturas (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado', 'vencido')),
  valor NUMERIC(12,2) NOT NULL DEFAULT 197.00,
  metodo_pagamento TEXT,
  mp_payment_id TEXT,
  data_vencimento DATE NOT NULL,
  data_pagamento TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vincular usuários a empresas
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cargo_sistema TEXT DEFAULT 'cliente' CHECK (cargo_sistema IN ('superadmin', 'vendedor_crm', 'cliente'));
