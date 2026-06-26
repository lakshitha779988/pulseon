import "./emptystate.css";

const EmptyState = ({ icon: Icon, title, body, action }) => {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={26} strokeWidth={1.8} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {body && <p className="empty-state-body">{body}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
