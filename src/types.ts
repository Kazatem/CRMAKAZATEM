export type AppRole = 'admin' | 'vendedor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  ativo?: boolean;
  created_at?: string;
}

export interface Sale {
  id: number;
  vendedor?: string;
  cliente: string;
  produto: string;
  valor: number;
  data_venda: string;
}

export interface Goal {
  id: number;
  vendedor_id: number;
  vendedor?: string;
  meta_mensal: number;
  updated_at: string;
}

export interface ClientItem {
  id?: number;
  name: string;
  created_at?: string;
}
