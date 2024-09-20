import React, { useEffect, useState, ComponentType } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import { useVerifyToken } from '../hooks/useVerifyToken'; // Custom hook for token verification

interface Props {
  children?: React.ReactNode;
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();  // Replaces useRouter from Next.js
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    const { data, isLoading: tokenLoading, error } = useVerifyToken(token); // Custom hook to verify token

    useEffect(() => {
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      if (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        navigate('/login'); // Redirect to login if error in token verification
      }

      if (data) {
        setIsLoading(false); // Token verified, stop loading
      }
    }, [data, error, token, navigate]);

    if (tokenLoading || isLoading) {
      // Show spinner or loading UI while checking token
      return (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="border-t-transparent border-solid animate-spin border-blue-500 border-8 rounded-full w-16 h-16 border-t-8"></div>
        </div>
      );
    }

    // Render the wrapped component after authentication
    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
