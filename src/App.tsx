import { useEffect, useState } from 'react';
import './App.css';
import Cookies from 'js-cookie';

const giProUri = import.meta.env.VITE_GITHUB_USER_URL;
const ipFinderUri = import.meta.env.VITE_IP_FINDER_URL;

function App() {
  const [dotcomUser, setDotcomUser] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const fetchIpAddress = async () => {
    try {
      const response = await fetch(ipFinderUri);
      if (!response.ok) throw new Error('Failed to fetch IP address');

      const data = await response.json();
      setIpAddress(data.ip);
      console.log(`User's IP address: ${data.ip}`);

      // TODO: Send the IP address to the backend to get the location via the Geolocation API.

    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  const fetchGitHubUserData = async (username: any) => {
    try {
      const response = await fetch(`${giProUri}/${username}`);
      if (!response.ok) throw new Error('Failed to fetch GitHub user data');

      const data = await response.json();
      console.log('GitHub User Data:', data);
    } catch (error) {
      console.error("Error fetching GitHub user data:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const isLoggedIn = Cookies.get('logged_in');
        const storedUser = Cookies.get('dotcom_user');

        if (isLoggedIn && storedUser) {
          setDotcomUser(storedUser);
        } else if (ipFinderUri) {

          await fetchIpAddress();
          
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (dotcomUser) {
      fetchGitHubUserData(dotcomUser);
    }
  }, [dotcomUser]);

  return (
    <div>
      <h1>Hello, Welcome to my Project</h1>
      {ipAddress && <p>Your IP Address: {ipAddress}</p>}
      {dotcomUser && <p>GitHub User: {dotcomUser}</p>}
    </div>
  );
}

export default App;
