import { BrowserRouter, Routes, Route } from "react-router-dom";
import AttendanceUpload from "./pages/AttendanceUpload";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import PeopleUpload from "./pages/PeopleUpload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NoPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/upload-attendance" element={<AttendanceUpload />} />
          <Route path="/upload-student" element={<PeopleUpload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
