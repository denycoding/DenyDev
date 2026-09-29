import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Clientdashboard from "./Clientdashboard";
import PostJob from "./Postjob";
import ClientProfile from "./ClientPofile";
import ClientMessages from "./ClientMessages";
import Clientprojects from "./Clientprojects";
import Freelancerdashboard from "./Freelancerdashboard";
import Freelancerheader from "./Freelancerheader";
import Freelancermessage from "./Freelancermessage";
import Freelancerproject from "./Freelancerproject";
import Freelancerprofile from "./Freelancerprofile";
import FreelancerDetail from "./FreelancerDetail";
import Freelancerproposal from "./Freelancerproposal";
import ClientViewProject from "./ClientViewProject";
import FreelancerViewProject from "./FreelancerViewProject";
import Admindashboard from "./Admin/Admindashboard";
import Clients from "./Admin/Clients";
import Freelancers from "./Admin/Freelancers";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clientdashboard" element={<Clientdashboard />} />
          <Route path="/postjob" element={<PostJob />} />
          <Route path="/clientprofile" element={<ClientProfile />} />
          <Route path="/clientmessages" element={<ClientMessages />} />
          <Route path="/clientprojects" element={<Clientprojects />} />
          <Route
            path="/freelancerdashboard"
            element={<Freelancerdashboard />}
          />
          <Route path="/freelancerheader" element={<Freelancerheader />} />
          <Route path="/freelancermessage" element={<Freelancermessage />} />
          <Route path="/freelancerproject" element={<Freelancerproject />} />
          <Route path="/freelancerprofile" element={<Freelancerprofile />} />
          <Route path="/freelancer/:userId" element={<FreelancerDetail />} />
          <Route path="/project/:projectId" element={<Freelancerproposal />} />
          <Route path="/admindashboard" element={<Admindashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route
            path="/clientprojects/:projectId"
            element={<ClientViewProject />}
          />
          <Route
            path="/freelancermessage/:clientId?"
            element={<Freelancermessage />}
          />
          <Route
            path="/freelancerproject/:projectId"
            element={<FreelancerViewProject />}
          />
          <Route
            path="/clientmessages/:freelancerId?"
            element={<ClientMessages />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
