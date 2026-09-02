import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Professionals from "../pages/Professionals";
import MainLayout from "../layouts/MainLayout";
import SearchResults from "../pages/SearchResults";
import ProfessionalDetails from "../pages/ProfessionalDetails";
import Blogs from "../pages/Blogs";
import BlogDetails from "../pages/BlogDetails";
import Signup from '../pages/signup.jsx'
import Login from '../pages/login.jsx'
import ActivateAccount from '../pages/activate_html.jsx'
import ProtectedRoute from "../protectedroute.jsx";
import Emailbox from '../pages/email_form.jsx';
import New_password from '../pages/new_password.jsx';
import ChangePassword from "../pages/ChangePassword.jsx";


function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/professionals" element={<ProtectedRoute><Professionals /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/professionals/:id"element={<ProtectedRoute><ProfessionalDetails /></ProtectedRoute>}
        
/>
<Route path="/blogs" element={<Blogs />} />
<Route path="/blogs/:id" element={<BlogDetails />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/activate/:uid/:token" element={<ActivateAccount />} />
<Route path="/reset/:uid/:token" element={<New_password  />} />
<Route path="/resetpassword" element={<Emailbox />} />
<Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;