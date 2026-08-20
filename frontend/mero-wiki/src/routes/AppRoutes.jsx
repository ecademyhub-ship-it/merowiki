import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Professionals from "../pages/Professionals";
import MainLayout from "../layouts/MainLayout";
import SearchResults from "../pages/SearchResults";
import ProfessionalDetails from "../pages/ProfessionalDetails";
import HireNow from "../pages/HireNow";
import Blogs from "../pages/Blogs";
import BlogDetails from "../pages/BlogDetails";
import LoginSignup from "../pages/LoginSignup";


function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hire" element={<HireNow />} />
        <Route path="/professionals/:id"element={<ProfessionalDetails />}
        
/>
<Route path="/blogs" element={<Blogs />} />
<Route path="/blogs/:id" element={<BlogDetails />} />
<Route path="/login" element={<LoginSignup />} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;