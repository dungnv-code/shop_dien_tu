import "./InputSelect.css";

const InputSelect = ({ options = [], value = "Chọn", onChange, }) => {
    return (
        <div className="input-select">
            <select value={value} onChange={(e) => { onChange(e) }} className="form-select">
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default InputSelect;