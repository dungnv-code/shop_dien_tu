

const Quantity = ({ quantity, setQuantity }) => {
    return <>
        <div className="d-flex align-items-center gap-1">
            <button className="btn" onClick={() => { setQuantity(prev => { return prev == 1 ? prev : prev - 1 }) }}>-</button>
            <input
                type="number"
                className="form-control"
                style={{ width: "70px" }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <button className="btn" onClick={() => { setQuantity(prev => prev + 1) }}>+</button>
        </div >
    </>
}

export default Quantity;