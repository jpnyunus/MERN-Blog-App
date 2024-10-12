import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useUser } from './UserContext';

function Header() {
  const { setUserInfo, userInfo } = useUser();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/profile`, {
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(userInfo => {
      setUserInfo(userInfo);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setUserInfo(null);
    });
  }, []);

  function logout() {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/logout`, {
      credentials: 'include',
      method: 'POST',
    })
    .then(() => {
      setUserInfo(null);
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">yunus's blog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout} style={{cursor: 'pointer'}}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;