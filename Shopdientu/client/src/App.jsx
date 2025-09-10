import { useContext } from 'react';
import './App.css';
import { path } from "./ultils/path";
import {
  Public, Home, Login, Blog, DetailProduct, Servicer,
  FAQ, Contact, FinalRegister, ResetPassword, Profile, ProductCa, DetailCart, CheckOut
} from "./page/public";

import { AdminLayout, Dashboard, CreateProduct, ManagerUser, ManagerProduct, ManagerOrder } from "./page/admin";

import { MemberLayout, Personal, Mycart, History, Wishlist } from "./page/member";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingContext, LoadingProvider } from './ultils/contentLoading';
import { Loading } from './component';

function AppContent() {
  const { loading, loadingText } = useContext(LoadingContext);
  return (
    <>
      {loading && <Loading text={loadingText} />}
      <Routes>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGER_PRODUCT} element={<ManagerProduct />} />
          <Route path={path.MANAGER_USER} element={<ManagerUser />} />
          <Route path={path.MANAGER_ORDER} element={<ManagerOrder />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.MYCART} element={<Mycart />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />
          <Route path={path.HISTORY} element={<History />} />
        </Route>

        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOG} element={<Blog />} />
          <Route path={path.DETAIL_PRODUCT_CATEGORI_PID_TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.CONTACT} element={<Contact />} />
          <Route path={path.OUT_SERVICER} element={<Servicer />} />
          <Route path={path.PROFILE} element={<Profile />} />
          <Route path={path.PRODUCTCA} element={<ProductCa />} />
          <Route path={path.DETAILCART} element={<DetailCart />} />
          <Route path={path.CHECKOUT} element={<CheckOut />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>

        <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={path.FINAl_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}
