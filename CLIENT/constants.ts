export const REACT_APP_API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3501' 
  : 'https://lobster-app-c38r5.ondigitalocean.app'; // 👈 This is the SAFEST way because it automatically uses your current URL!

