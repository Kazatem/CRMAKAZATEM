import { query, closePool } from './db.ts';

async function migrate() {
  try {
    await query(`
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
    `);

    await query(`
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
    `);

    await query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id);`);
    await query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cargo_sistema TEXT DEFAULT 'cliente' CHECK (cargo_sistema IN ('superadmin', 'vendedor_crm', 'cliente'));`);

    console.log('✅ Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
  } finally {
    await closePool();
  }
}

migrate();
