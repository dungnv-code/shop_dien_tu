// Input.jsx
import "./Button.css";

const Button = ({ name, icon_after, icon_before, style, hanleOnclick }) => {
    return (
        <div className="m-2 w-100">
            {icon_before}
            <button type="button" className={style ? style : "btn w-100 btn-danger"} onClick={(e) => { hanleOnclick && hanleOnclick(e) }}>{name}</button>
            {icon_after}
        </div>
    );
};

export default Button;
