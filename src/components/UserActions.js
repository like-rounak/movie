import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserActions = ({ user, onSignOut }) => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div>
      {user ? (
        <button onClick={onSignOut}>Sign Out</button>
      ) : (
        <>
          <button onClick={handleSignInClick}>Sign In</button>
          <button onClick={handleSignUpClick}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default UserActions;
