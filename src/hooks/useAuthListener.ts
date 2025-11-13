import { useEffect, useState } from 'react';

export const useAuthListener = () => {
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const esCoord = localStorage.getItem("esCoordinador") === "true";
    setIsLoggedIn(!!user);
    setIsCoordinator(esCoord);

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      const updatedCoord = localStorage.getItem("esCoordinador") === "true";
      setIsLoggedIn(!!updatedUser);
      setIsCoordinator(updatedCoord);
    };

    window.addEventListener('storage', handleStorageChange);

    const handleCustomChange = () => {
      const updatedUser = localStorage.getItem("user");
      const updatedCoord = localStorage.getItem("esCoordinador") === "true";
      setIsLoggedIn(!!updatedUser);
      setIsCoordinator(updatedCoord);
    };

    window.addEventListener('authChanged', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleCustomChange);
    };
  }, []);

  return { isCoordinator, isLoggedIn };
};
