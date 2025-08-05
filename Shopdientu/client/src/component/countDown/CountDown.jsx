import styles from "./CountDown.module.css"
import { memo } from "react";
const CountDown = ({ unit, number }) => {
    return <>
        <div
            className="p-3 d-flex flex-column align-items-center"
            style={{
                gap: "4px",
                borderRadius: "10px",
                fontWeight: "bold",
                backgroundColor: "#F2F4F7",
                boxShadow:
                    "rgb(60 64 67 / 10%) 0px 1px 2px 0px, rgb(60 64 67 / 15%) 0px 2px 6px 2px",
                width: "80px",
            }}
        >
            <span style={{ fontSize: "24px", color: "#111" }}>{number}</span>
            <span style={{ fontSize: "14px", color: "#555" }}>{unit}</span>
        </div>

    </>
}

export default memo(CountDown);