import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const Confiti = ({ parentRef }) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (parentRef?.current) {
            const { clientWidth, clientHeight } = parentRef.current;
            setSize({ width: clientWidth, height: clientHeight });
        }
    }, [parentRef]);

    if (size.width === 0 || size.height === 0) return null; // chỉ render khi đo xong

    return (
        <Confetti
            width={size.width}
            height={size.height}
            style={{ position: "absolute", top: 0, left: 0 }}
        />
    );
};

export default Confiti;
