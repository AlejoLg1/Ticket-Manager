"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const useAuth = (redirectPath: string = "/login") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectPath);
    }
  }, [status, router, redirectPath]);

  return { session, status };
};

export default useAuth;
