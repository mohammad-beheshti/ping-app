import {useForm} from "react-hook-form";
import {useAuthControllerLogin} from "../queries/apiComponents";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {error, mutate, isLoading} = useAuthControllerLogin({
    onSuccess: ({access_token}) => {
      localStorage.setItem("accessToken", access_token);
      navigate("/");
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const onSubmit = handleSubmit((formData) => mutate({body: formData}));
  return (
    <>
      <div className="min-h-screen flex flex-col bg-orange-400 justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-orange-400"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register("username", {
                      required: true,
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600">Username is required</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-orange-400"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    {...register("password", {
                      required: true,
                    })}
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">Password is required</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div className="mt-6 flex justify-center">
              {error && <p className="text-xs text-red-500">Login failed</p>}
              {isLoading && <p className="text-xs text-gray-500">Loading...</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
