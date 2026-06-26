import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import "./backbutton.css";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();
  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      <LuArrowLeft size={17} strokeWidth={2.2} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
