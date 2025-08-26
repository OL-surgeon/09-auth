// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { api } from "@/lib/api/clientApi";
// import { useAuthStore } from "@/lib/store/authStore";

// interface AuthProviderProps {
//   children: ReactNode;
// }

// const privatePaths = ["/profile", "/notes"];

// export default function AuthProvider({ children }: AuthProviderProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { setUser, clearIsAuthenticated } = useAuthStore();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       setChecking(true);

//       try {
//         const res = await api.get("/users/me");
//         const user = res.data;

//         if (user?.id) {
//           setUser(user);
//         } else {
//           clearIsAuthenticated();

//           if (privatePaths.some((path) => pathname?.startsWith(path))) {
//             router.push("/sign-in");
//           }
//         }
//       } catch {
//         clearIsAuthenticated();

//         if (privatePaths.some((path) => pathname?.startsWith(path))) {
//           router.push("/sign-in");
//         }
//       } finally {
//         setChecking(false);
//       }
//     };

//     checkAuth();
//   }, [pathname, router, setUser, clearIsAuthenticated]);

//   if (checking) return <div>Loading...</div>;

//   return <>{children}</>;
// }
// components/AuthProvider/AuthProvider.tsx

"use client";

import { getSession, getCurrentUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      // Перевіряємо сесію
      const isAuthenticated = await getSession();
      if (isAuthenticated) {
        // Якщо сесія валідна — отримуємо користувача
        const user = await getCurrentUser();
        if (user) setUser(user);
      } else {
        // Якщо сесія невалідна — чистимо стан
        clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
};

export default AuthProvider;
