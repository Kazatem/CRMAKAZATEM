type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PageHeader({ title, subtitle, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actionLabel ? (
        <button className="btn btn-primary" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
