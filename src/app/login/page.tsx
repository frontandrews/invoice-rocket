"use client";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { logInAsync } from "@/redux/features/auth/slice";
import { useDispatch, useSelector,  } from "react-redux";
import { useRouter } from 'next/navigation'
import { app } from "@/firebase/clientApp";
import ErrorMessageByAuthCode from "@/components/common/ErrorMessageByAuthCode";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useAuthState } from '@/hooks/useAuthState';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  
  const [errorCode, setErrorCode] = useState("");
  const dispatch = useDispatch();
  const router = useRouter(); 
  // const isAuthenticated = useAuthState(app);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/invoices');
  //   }
  // }, [isAuthenticated, router])

  const auth = getAuth(app);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // @ts-expect-error: TODO: fix this type error
      const action = dispatch(logInAsync({ auth, email, password }));
  
      const result = await action.unwrap();
  
      if (result.id) {
        router.push('/invoices');
      } else {
        console.error("Login failed");
      }
    } catch (error: any) {
      setErrorCode(error.code);
      console.error("Login or account creation failed", error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="pr-8 absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  Sign in
                </button>
              </div>
              <ErrorMessageByAuthCode code={errorCode} />
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            <a
              href="create-account"
              className="font-semibold leading-6 text-cyan-600 hover:text-cyan-500"
            >
              Create account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;