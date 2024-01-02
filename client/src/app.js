import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Join from './components/Join/join';
import Chat from './components/Chat/Chat';
import SignUp from './components/SignUp/SignUp';
import Login from './components/login/login';

const App = () => {
  const [namex, setNamex] = useState('');
  const [userId, setUserId] = useState('');
  const [userSignedIn, setUserSignedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login userNameCallback={setNamex} userIdCallback={setUserId} SignedIn={setUserSignedIn} />}
        />
        <Route
          path="/join"
          element={userSignedIn ? <Join name={namex} /> : <Navigate to="/"/>}
          />
        <Route
          path="/chat"
          element={userSignedIn ? <Chat back={setUserSignedIn} userId={userId}/> : <Navigate to="/"/>}
        />
        <Route 
          path="/signup"
          element={<SignUp />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
