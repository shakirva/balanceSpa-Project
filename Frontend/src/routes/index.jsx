import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { LoadingSpinner } from "@components/common/loading";
import Products from "@pages/Dashboard";
import BrochureDisplay from "@pages/BrochureDisplay";
import Services from "@pages/Services";
import BookingForm from "@pages/BookingForm";
import PDFPreviewPage from "@pages/PDFPreviewPage";
import Appointments from "@pages/Appointments";
import Category from "@pages/Category";
import Customers from "@pages/Customers";
import Treatments from "@pages/Treatments";
import Users from "@pages/Users";
import AdminLogin from "@pages/AdminLogin";
import ServiceCategory from "@pages/Category";
import DisplayLanding from "@pages/DisplayLanding";
import Settings from "@pages/Settings";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

const Page404 = Loadable(lazy(() => import("@pages/Page404")));
const Dashboard = Loadable(lazy(() => import("@pages/Dashboard")));
const Menu = Loadable(lazy(() => import("@pages/LanguageSelection")));

export default function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "products", element: <Products /> },
        { path: "appointment", element: <Appointments /> },
        { path: "service-category", element: <ServiceCategory /> },
        { path: "customers", element: <Customers /> },
        { path: "treatment", element: <Treatments /> },
        { path: "settings", element: <Settings /> },
        { path: "users", element: <Users /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "/", element: <DisplayLanding /> },
    { path: "/admin", element: <AdminLogin /> },
    {path: "/menu", element: <Services /> },
    {path: "/brochure", element: <BrochureDisplay /> },
    {path: "/booking", element: <BookingForm /> },
    {path: "/pdf-preview", element: <PDFPreviewPage /> },
    { path: "/admin/login", element: <AdminLogin /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
