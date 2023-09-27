import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthState } from "@/hooks/useAuthState";
import { app } from "@/firebase/clientApp";

export default function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const isAuthenticated = useAuthState(app);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          redirect("/login");
        }
      }, 0);
    
      return () => clearTimeout(timer);
    }, [isAuthenticated]);

    return <Component {...props} />;
  };
}
