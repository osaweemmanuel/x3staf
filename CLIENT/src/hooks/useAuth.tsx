import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "User";
  let isLoggedIn = false;

  if (token) {
    const decoded: {
      UserInfo: {
        userId: string;
        verified: boolean;
        email: string;
        username: string;
        roles: string[];
      };
    } = jwtDecode(token);

    let { userId, verified, email, username, roles: rawRoles } = decoded.UserInfo;
    let rolesArray: string[] = [];

    if (typeof rawRoles === 'string') {
      try {
        rolesArray = JSON.parse(rawRoles);
      } catch (e) {
        rolesArray = [rawRoles];
      }
    } else {
      rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
    }

    console.log('DEBUG: useAuth Roles (Final):', rolesArray);
    isLoggedIn = true;
    isManager = rolesArray.includes("Manager");
    isAdmin = rolesArray.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return {
      userId,
      username,
      verified,
      email,
      roles: rolesArray,
      status,
      isManager,
      isAdmin,
      isLoggedIn,
    };
  }

  return {
    userId: "",
    username: "",
    roles: [],
    verified: false,
    email: "",
    isManager,
    isAdmin,
    status,
    isLoggedIn,
  };
};

export default useAuth;
