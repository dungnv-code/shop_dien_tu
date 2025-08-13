import React from "react";

export default function RatingProgress({ stats, total }) {
    return (
        <div>
            {stats.map((item) => {
                const percent = total > 0 ? (item.count / total) * 100 : 0;
                return (
                    <div
                        key={item.star}
                        style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
                    >
                        <span style={{ width: "20px" }}>{item.star}★</span>
                        <div style={{
                            flex: 1,
                            backgroundColor: "#eee",
                            height: "10px",
                            margin: "0 10px",
                            borderRadius: "5px",
                            overflow: "hidden"
                        }}>
                            <div
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: "#f90",
                                    height: "100%"
                                }}
                            />
                        </div>
                        <span>{percent.toFixed(0)}% | {item.count} đánh giá</span>
                    </div>
                );
            })}
        </div>
    );
}
