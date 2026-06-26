import "./skeleton.css";

export const SkeletonBlock = ({ width = "100%", height = "16px", radius = "8px", style }) => (
  <span
    className="skeleton-block"
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

const Skeleton = {
  Block: SkeletonBlock,
};

export default Skeleton;
