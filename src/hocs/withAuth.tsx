import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { StoreTypes } from "@/types";

export default function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const isAuthenticated = useSelector((state: StoreTypes) => state.auth.user.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
          redirect("/login");
        }
    }, [isAuthenticated]);

    return <Component {...props} />;
  };
}
