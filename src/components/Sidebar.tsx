import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Caixa de entrada', icon: '📥' },
  { to: '/clientes', label: 'Clientes', icon: '👥' },
  { to: '/funil', label: 'Funil de vendas', icon: '📊' },
  { to: '/fluxo', label: 'Fluxo de atendimento', icon: '⚙️' },
  { to: '/disparos', label: 'Disparos de mensagem', icon: '✉️' },
  { to: '/status', label: 'Postar status', icon: '🖼️' },
  { to: '/dashboard', label: 'Dashboard', icon: '📈' },
  { to: '/etiquetas', label: 'Etiquetas', icon: '🏷️' },
  { to: '/admin', label: 'Configurações', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">VarejoCRM</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-badge">AS</div>
        <div>
          <div className="user-name">Ana Silva</div>
          <div className="user-status">Online</div>
        </div>
      </div>
    </aside>
  );
}
