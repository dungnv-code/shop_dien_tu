// Input.jsx
import "./Input.css";

const Input = ({ value = "", setValue, name, type = "text", placeholder = "Chưa có" }) => {
    return (
        <div className="m-2 w-100 " style={{ position: "relative" }}>
            {
                value.trim() != "" && <label htmlFor={name} style={{ position: "absolute", backgroundColor: "white", padding: "1px", top: "-10px", fontSize: "12px" }}>{placeholder}</label>
            }
            <input
                className="form-control"
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(prev => ({ ...prev, [name]: e.target.value }))}
            />
        </div>
    );
};

export default Input;
