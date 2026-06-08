import { query, closePool } from './db.ts';
import { hashPassword } from './auth.ts';

async function seed() {
  try {
    await query(`
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

      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        vendedor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (vendedor_id, nome)
      );

      CREATE TABLE IF NOT EXISTS metas (
        id SERIAL PRIMARY KEY,
        vendedor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        meta_mensal NUMERIC(12, 2) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (vendedor_id)
      );

      CREATE TABLE IF NOT EXISTS config_comissao (
        id SERIAL PRIMARY KEY,
        taxa_percentual NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const adminPassword = await hashPassword('12345678');
    const sellerPassword = await hashPassword('12345678');

    await query(`
      INSERT INTO usuarios (nome, email, senha, cargo, ativo)
      VALUES
        ('Kazatem Imports', 'kazatemimports01@gmail.com', $1, 'admin', TRUE),
        ('Paulo Ricardo Batista', 'pauloricardobatistadas@gmail.com', $2, 'vendedor', TRUE)
      ON CONFLICT (email) DO NOTHING;
    `, [adminPassword, sellerPassword]);

    const result = await query(`SELECT id FROM usuarios WHERE email IN ('kazatemimports01@gmail.com', 'pauloricardobatistadas@gmail.com') ORDER BY email;`);
    const [adminRow, sellerRow] = result.rows;

    if (sellerRow) {
      await query(`
        INSERT INTO metas (vendedor_id, meta_mensal)
        SELECT $1, 20000.00
        WHERE NOT EXISTS (SELECT 1 FROM metas WHERE vendedor_id = $1);
      `, [sellerRow.id]);

      await query(`
        INSERT INTO clientes (vendedor_id, nome)
        SELECT $1, 'Luiza Ribeiro'
        WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE vendedor_id = $1 AND nome = 'Luiza Ribeiro');
      `, [sellerRow.id]);

      await query(`
        INSERT INTO clientes (vendedor_id, nome)
        SELECT $1, 'Bruna Ferreira'
        WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE vendedor_id = $1 AND nome = 'Bruna Ferreira');
      `, [sellerRow.id]);

      await query(`
        INSERT INTO clientes (vendedor_id, nome)
        SELECT $1, 'Camila Souza'
        WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE vendedor_id = $1 AND nome = 'Camila Souza');
      `, [sellerRow.id]);

      await query(`
        INSERT INTO vendas (vendedor_id, cliente, produto, valor, data_venda)
        SELECT $1, 'Luiza Ribeiro', 'Vestido Floral', 520.00, '2026-06-01'
        WHERE NOT EXISTS (SELECT 1 FROM vendas WHERE vendedor_id = $1 AND cliente = 'Luiza Ribeiro' AND produto = 'Vestido Floral' AND valor = 520.00 AND data_venda = '2026-06-01');
      `, [sellerRow.id]);

      await query(`
        INSERT INTO vendas (vendedor_id, cliente, produto, valor, data_venda)
        SELECT $1, 'Bruna Ferreira', 'Conjunto de Linho', 320.00, '2026-06-03'
        WHERE NOT EXISTS (SELECT 1 FROM vendas WHERE vendedor_id = $1 AND cliente = 'Bruna Ferreira' AND produto = 'Conjunto de Linho' AND valor = 320.00 AND data_venda = '2026-06-03');
      `, [sellerRow.id]);

      await query(`
        INSERT INTO vendas (vendedor_id, cliente, produto, valor, data_venda)
        SELECT $1, 'Camila Souza', 'Sandália Premium', 189.50, '2026-06-04'
        WHERE NOT EXISTS (SELECT 1 FROM vendas WHERE vendedor_id = $1 AND cliente = 'Camila Souza' AND produto = 'Sandália Premium' AND valor = 189.50 AND data_venda = '2026-06-04');
      `, [sellerRow.id]);
    }

    await query(`
      INSERT INTO config_comissao (taxa_percentual)
      SELECT 5.00
      WHERE NOT EXISTS (SELECT 1 FROM config_comissao);
    `);

    console.log('Seed do banco concluído. Use kazatemimports01@gmail.com / 12345678 e pauloricardobatistadas@gmail.com / 12345678.');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  } finally {
    await closePool();
  }
}

seed();
