import "./waterslider.css";

const WaterSlider = ({ amount, goal, color, onChange }) => {
  const percentage = Math.min((amount / goal) * 100, 100);

  return (
    <div className="water-slider-wrap">
      <input
        type="range"
        min="0"
        max={Math.round(goal * 1.5)}
        value={amount}
        onChange={(e) => onChange(Number(e.target.value))}
        className="water-slider-input"
        aria-label="Custom water amount"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color} ${percentage}%, var(--surface-2) ${percentage}%, var(--surface-2) 100%)`,
        }}
      />
    </div>
  );
};

export default WaterSlider;
