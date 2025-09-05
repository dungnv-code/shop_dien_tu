import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";


const WithBaseComponent = (Component) => (pops) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const local = useLocation()
    return (<>
        <Component {...pops} navigate={navigate} dispatch={dispatch} local={local} />
    </>)
}

export default WithBaseComponent