import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { query } from './db.ts';
import { authenticateToken, authorizeAdmin, signToken, hashPassword, comparePasswords, AuthRequest } from './auth.ts';

const app = express();
app.use(cors());
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const result = await query('SELECT id, nome, email, senha, cargo, ativo FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.ativo) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const passwordMatches = await comparePasswords(senha, user.senha);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const payload = {
      id: user.id,
      name: user.nome,
      email: user.email,
      role: user.cargo,
    };

    const token = signToken(payload);
    return res.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao autenticar.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }

  try {
    const result = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'Se o email existir, uma instrução de recuperação foi enviada.' });
    }

    return res.status(200).json({ message: 'Se o email existir, uma instrução de recuperação foi enviada.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao processar recuperação de senha.' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  return res.json({ user: req.user });
});

app.get('/api/users', authenticateToken, authorizeAdmin, async (_req, res) => {
  const result = await query('SELECT id, nome AS name, email, cargo AS role, ativo, created_at FROM usuarios ORDER BY id DESC');
  return res.json(result.rows);
});

app.post('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
  const { nome, email, senha, cargo, ativo } = req.body;

  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ error: 'Nome, email, senha e cargo são obrigatórios.' });
  }

  try {
    const passwordHash = await hashPassword(senha);
    const result = await query(
      'INSERT INTO usuarios (nome, email, senha, cargo, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome AS name, email, cargo AS role, ativo, created_at',
      [nome, email, passwordHash, cargo, ativo ?? true]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

app.put('/api/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, cargo, ativo } = req.body;

  try {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (nome) {
      fields.push('nome = $' + (fields.length + 1));
      values.push(nome);
    }
    if (email) {
      fields.push('email = $' + (fields.length + 1));
      values.push(email);
    }
    if (cargo) {
      fields.push('cargo = $' + (fields.length + 1));
      values.push(cargo);
    }
    if (typeof ativo === 'boolean') {
      fields.push('ativo = $' + (fields.length + 1));
      values.push(ativo);
    }
    if (senha) {
      const passwordHash = await hashPassword(senha);
      fields.push('senha = $' + (fields.length + 1));
      values.push(passwordHash);
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
    }

    values.push(id);
    const result = await query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING id, nome AS name, email, cargo AS role, ativo, created_at`, values);
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

app.delete('/api/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  await query('UPDATE usuarios SET ativo = FALSE WHERE id = $1', [id]);
  return res.json({ message: 'Usuário inativado com sucesso.' });
});

app.get('/api/sales', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cliente, from, to } = req.query as { cliente?: string; from?: string; to?: string };
    const values: unknown[] = [];
    let sql = `SELECT v.id, v.cliente, v.produto, v.valor, v.data_venda${req.user?.role === 'admin' ? ', u.nome AS vendedor' : ''}
      FROM vendas v${req.user?.role === 'admin' ? ' JOIN usuarios u ON u.id = v.vendedor_id' : ''}`;

    const filters: string[] = [];
    if (req.user?.role !== 'admin') {
      filters.push('v.vendedor_id = $1');
      values.push(req.user?.id);
    }
    if (cliente) {
      filters.push(`v.cliente ILIKE $${values.length + 1}`);
      values.push(`%${cliente}%`);
    }
    if (from) {
      filters.push(`v.data_venda >= $${values.length + 1}`);
      values.push(from);
    }
    if (to) {
      filters.push(`v.data_venda <= $${values.length + 1}`);
      values.push(to);
    }

    if (filters.length) {
      sql += ` WHERE ${filters.join(' AND ')}`;
    }
    sql += ' ORDER BY v.data_venda DESC';

    const result = await query(sql, values);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar vendas.' });
  }
});

app.post('/api/sales', authenticateToken, async (req: AuthRequest, res) => {
  const { cliente, produto, valor, data_venda } = req.body;

  if (req.user?.role !== 'vendedor') {
    return res.status(403).json({ error: 'Apenas vendedores podem registrar vendas.' });
  }

  if (!cliente || !produto || !valor) {
    return res.status(400).json({ error: 'Cliente, produto e valor são obrigatórios.' });
  }

  try {
    await query(
      'INSERT INTO clientes (vendedor_id, nome) VALUES ($1, $2) ON CONFLICT (vendedor_id, nome) DO NOTHING',
      [req.user.id, cliente]
    );

    const result = await query(
      'INSERT INTO vendas (vendedor_id, cliente, produto, valor, data_venda) VALUES ($1, $2, $3, $4, $5) RETURNING id, cliente, produto, valor, data_venda',
      [req.user.id, cliente, produto, valor, data_venda || new Date().toISOString().slice(0, 10)]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao registrar venda.' });
  }
});

app.get('/api/clients', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { search } = req.query as { search?: string };
    const values: unknown[] = [];
    let sql = 'SELECT id, nome AS name, created_at FROM clientes';

    if (req.user?.role !== 'admin') {
      values.push(req.user?.id);
      sql += ' WHERE vendedor_id = $1';
    }

    if (search) {
      sql += values.length ? ' AND nome ILIKE $' + (values.length + 1) : ' WHERE nome ILIKE $1';
      values.push(`%${search}%`);
    }

    sql += ' ORDER BY nome';
    const result = await query(sql, values);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
});

app.post('/api/clients', authenticateToken, async (req: AuthRequest, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
  }

  try {
    const result = await query(
      'INSERT INTO clientes (vendedor_id, nome) VALUES ($1, $2) ON CONFLICT (vendedor_id, nome) DO UPDATE SET nome = EXCLUDED.nome RETURNING id, nome AS name, created_at',
      [req.user?.id, nome]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
});

app.get('/api/goals', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role === 'admin') {
      const result = await query(
        `SELECT m.id, m.vendedor_id, u.nome AS vendedor, m.meta_mensal, m.updated_at
         FROM metas m
         JOIN usuarios u ON u.id = m.vendedor_id
         ORDER BY u.nome`
      );
      return res.json(result.rows);
    }

    const result = await query('SELECT id, vendedor_id, meta_mensal, updated_at FROM metas WHERE vendedor_id = $1', [req.user?.id]);
    return res.json(result.rows[0] ? [result.rows[0]] : []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar metas.' });
  }
});

app.post('/api/goals', authenticateToken, authorizeAdmin, async (req, res) => {
  const { vendedor_id, meta_mensal } = req.body;
  if (!vendedor_id || !meta_mensal) {
    return res.status(400).json({ error: 'Vendedor e meta mensal são obrigatórios.' });
  }

  try {
    const existing = await query('SELECT id FROM metas WHERE vendedor_id = $1', [vendedor_id]);
    if ((existing.rowCount ?? 0) > 0) {
      const result = await query(
        'UPDATE metas SET meta_mensal = $1, updated_at = CURRENT_TIMESTAMP WHERE vendedor_id = $2 RETURNING id, vendedor_id, meta_mensal, updated_at',
        [meta_mensal, vendedor_id]
      );
      return res.json(result.rows[0]);
    }

    const result = await query(
      'INSERT INTO metas (vendedor_id, meta_mensal) VALUES ($1, $2) RETURNING id, vendedor_id, meta_mensal, updated_at',
      [vendedor_id, meta_mensal]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao definir meta.' });
  }
});

app.get('/api/reports/admin', authenticateToken, authorizeAdmin, async (_req, res) => {
  try {
    const totals = await query(`
      SELECT
        COALESCE(SUM(v.valor), 0)::numeric(12,2) AS faturamento_total,
        COUNT(DISTINCT v.vendedor_id)::int AS total_vendedores,
        COUNT(v.id)::int AS total_vendas
      FROM vendas v;
    `);

    const ranking = await query(`
      SELECT u.id AS vendedor_id, u.nome AS vendedor, COUNT(v.id) AS total_vendas, COALESCE(SUM(v.valor), 0)::numeric(12,2) AS total_faturamento
      FROM usuarios u
      LEFT JOIN vendas v ON u.id = v.vendedor_id
      WHERE u.cargo = 'vendedor'
      GROUP BY u.id
      ORDER BY total_faturamento DESC
      LIMIT 10;
    `);

    return res.json({ dashboard: totals.rows[0], ranking: ranking.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao gerar relatório.' });
  }
});

app.get('/api/reports/seller', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const vendas = await query(
      'SELECT id, cliente, produto, valor, data_venda FROM vendas WHERE vendedor_id = $1 ORDER BY data_venda DESC',
      [req.user?.id]
    );
    const metas = await query('SELECT meta_mensal FROM metas WHERE vendedor_id = $1', [req.user?.id]);
    const total = vendas.rows.reduce((sum: number, item: { valor: string | number }) => sum + Number(item.valor), 0);
    const goal = metas.rows[0]?.meta_mensal || 0;
    return res.json({ vendas: vendas.rows, total_vendido: total, meta_mensal: Number(goal) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar relatório do vendedor.' });
  }
});

app.get('/api/metrics', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role === 'admin') {
      const totals = await query('SELECT COUNT(*)::int AS total_usuarios FROM usuarios');
      return res.json({ users: totals.rows[0] });
    }

    const vendas = await query('SELECT COUNT(*)::int AS vendas_atuais FROM vendas WHERE vendedor_id = $1', [req.user?.id]);
    return res.json({ vendas: vendas.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar métricas.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { nome, email, senha, cargo } = req.body;
  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ error: 'Nome, email, senha e cargo são obrigatórios.' });
  }
  try {
    const passwordHash = await hashPassword(senha);
    const result = await query(
      'INSERT INTO usuarios (nome, email, senha, cargo, ativo) VALUES ($1, $2, $3, $4, TRUE) RETURNING id, nome AS name, email, cargo AS role, ativo, created_at',
      [nome, email, passwordHash, cargo]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

app.get('/api/config/commission', authenticateToken, async (_req, res) => {
  try {
    const result = await query('SELECT taxa_percentual FROM config_comissao ORDER BY id DESC LIMIT 1');
    const taxaPercentual = result.rows[0]?.taxa_percentual || 5.00;
    return res.json({ taxa_percentual: Number(taxaPercentual) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar configuração de comissão.' });
  }
});

app.put('/api/config/commission', authenticateToken, authorizeAdmin, async (req, res) => {
  const { taxa_percentual } = req.body;

  if (taxa_percentual === undefined || taxa_percentual === null) {
    return res.status(400).json({ error: 'Taxa de comissão é obrigatória.' });
  }

  const taxa = Number(taxa_percentual);
  if (taxa < 0 || taxa > 100) {
    return res.status(400).json({ error: 'Taxa deve estar entre 0% e 100%.' });
  }

  try {
    const result = await query(
      'UPDATE config_comissao SET taxa_percentual = $1, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM config_comissao ORDER BY id DESC LIMIT 1) RETURNING taxa_percentual',
      [taxa]
    );

    if (!result.rows.length) {
      await query('INSERT INTO config_comissao (taxa_percentual) VALUES ($1)', [taxa]);
      return res.json({ taxa_percentual: taxa });
    }

    return res.json({ taxa_percentual: Number(result.rows[0].taxa_percentual) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar comissão.' });
  }
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`CRM backend rodando em http://localhost:${port}`);
});

// ============ SUPER ADMIN ROUTES ============

app.get('/api/superadmin/empresas', authenticateToken, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
  try {
    const result = await query(`
      SELECT e.*, u.nome AS vendedor_crm
      FROM empresas e
      LEFT JOIN usuarios u ON u.id = e.vendedor_crm_id
      ORDER BY e.created_at DESC
    `);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar empresas.' });
  }
});

app.post('/api/superadmin/empresas', authenticateToken, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
  const { nome, email, telefone, vendedor_crm_id } = req.body;
  if (!nome || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  try {
    const result = await query(
      `INSERT INTO empresas (nome, email, telefone, vendedor_crm_id, status)
       VALUES ($1, $2, $3, $4, 'ativo')
       RETURNING *`,
      [nome, email, telefone, vendedor_crm_id || null]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar empresa.' });
  }
});

app.put('/api/superadmin/empresas/:id', authenticateToken, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await query(
      `UPDATE empresas SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar empresa.' });
  }
});

app.get('/api/superadmin/stats', authenticateToken, async (req: AuthRequest, res) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
  try {
    const empresas = await query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'ativo')::int AS ativas FROM empresas`);
    const mrr = await query(`SELECT COALESCE(SUM(valor_mensalidade), 0)::numeric(12,2) AS mrr FROM empresas WHERE status = 'ativo'`);
    return res.json({ ...empresas.rows[0], mrr: mrr.rows[0].mrr });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar stats.' });
  }
});
