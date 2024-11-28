import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();

  const logout = () => {
    localStorage.removeItem("user");

    authDispatch({ type: "LOGOUT" });
  };

  return { logout };
};
