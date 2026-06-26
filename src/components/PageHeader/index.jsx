import "./pageheader.css";

const PageHeader = ({ icon: Icon, eyebrow, title, subtitle, action }) => {
  return (
    <div className="page-header">
      <div className="page-header-text">
        {eyebrow && (
          <span className="page-header-eyebrow">
            {Icon && <Icon size={14} strokeWidth={2.4} />}
            {eyebrow}
          </span>
        )}
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
};

export default PageHeader;
