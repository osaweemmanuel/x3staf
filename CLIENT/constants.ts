export const REACT_APP_API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3501'
  : window.location.origin; // 👈 This is the SAFEST way because it automatically uses your current URL!

