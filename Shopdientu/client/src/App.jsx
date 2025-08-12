import { useContext } from 'react';
import './App.css';
import { path } from "./ultils/path";
import {
  Public, Home, Login, Blog, DetailProduct, Servicer,
  FAQ, Contact, FinalRegister, ResetPassword, Profile
} from "./page/public";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingContext, LoadingProvider } from './ultils/contentLoading';
import { Loading } from './component';

function AppContent() {
  const { loading, loadingText } = useContext(LoadingContext);

  return (
    <>
      {/* Hiển thị loading overlay nếu đang loading */}
      {loading && <Loading text={loadingText} />}

      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOG} element={<Blog />} />
          <Route path={path.DETAIL_PRODUCT_CATEGORI_PID_TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.CONTACT} element={<Contact />} />
          <Route path={path.OUT_SERVICER} element={<Servicer />} />
          <Route path={path.PROFILE} element={<Profile />} />
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
