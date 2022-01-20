import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'alertifyjs/build/css/alertify.css';
import './App.css';

function App() {
  const Home = React.lazy(() => import("./pages/Home"));
  const Login = React.lazy(() => import("./pages/Auth/login"));
  const Register = React.lazy(() => import("./pages/Auth/register"));
  const Err404 = React.lazy(() => import("./pages/Err404"));
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<React.Suspense fallback={<>...</>}><Home/></React.Suspense>} />
        <Route path="/login/" element={<React.Suspense fallback={<>...</>}><Login/></React.Suspense>} />
        <Route path="/register/" element={<React.Suspense fallback={<>...</>}><Register/></React.Suspense>} />
        <Route path="*" element={<React.Suspense fallback={<>...</>}><Err404/></React.Suspense>}/>
      </Routes>
    </Router>
  );
}

export default App;