import { useState, useEffect } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { path } from '../../../ultils/path';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrent } from "../../../redux/userSlice/asyncActionUser";
import { MemberSibar } from "../../../component/index"
const MemberLayout = () => {
    const { isLogIn, current } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLogIn && !current) {
            dispatch(getCurrent());
        }
    }, [isLogIn, current, dispatch]);

    // Nếu chưa login → redirect ngay
    if (!isLogIn) {
        return <Navigate to={path.LOGIN} replace />;
    }


    if (isLogIn && !current) {
        return <div>Loading...</div>;
    }

    return (
        <div className="member-layout">
            <div>
                <MemberSibar />
            </div>
            <div style={{ marginLeft: "20%" }}>
                <Outlet />
            </div>
        </div>
    );
}

export default MemberLayout;