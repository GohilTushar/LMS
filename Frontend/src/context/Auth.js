import { createContext,useContext } from "react";

export const AuthContext=createContext({
    isAuthenticated:false,
    userRole:null,
    login:()=>{},
    logout:()=>{},
})
export const AuthProvider=AuthContext.Provider;

export default function useAuth(){
    return useContext(AuthContext);
}