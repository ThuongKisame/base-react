import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginSchema } from '@/masterData/formSchema';
import { handleLogin } from '@/api/userAPI';
import Loading from '@/components/common/Loading';
import { setUser, setAccessToken, setRefreshToken } from '@/actions/userActions';
import jwt_decode from 'jwt-decode';
import { navFromRole } from '@/masterData/commonFunction';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const handleToggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    //dispatch token về null mỗi lần về trang login

    useEffect(() => {
        dispatch(setAccessToken(null));
        dispatch(setRefreshToken(null));
        dispatch(setUser(null));
    }, [dispatch]);

    const formSubmitHandler = (data) => {
        const fetchLogin = async () => {
            try {
                setErrMessage('');
                setLoading(true);
                let params = { email: data.email, password: data.password };
                const response = await handleLogin(params);
                setLoading(false);

                if (response.errCode === 0) {
                    // console.log(response);
                    // save user infor and access token
                    dispatch(setAccessToken(response?.access_token));

                    dispatch(setRefreshToken(response?.refresh_token));

                    dispatch(setUser(response.user));

                    try {
                        const decodedToken = jwt_decode(response?.access_token);
                        console.log(decodedToken);
                        navigate(navFromRole(parseInt(decodedToken?.roleId)));
                    } catch (error) {
                        console.error('Error decoding token:', error.message);
                    }

                    // navigate('/admin');
                } else {
                    setErrMessage(response.message);
                }
            } catch (error) {
                console.log('Failed to fetch product list: ', error);
            }
        };
        fetchLogin();
    };
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            {loading && <Loading />}
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

                <p className="mt-4 text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque ipsa
                    culpa autem, at itaque nostrum!
                </p>
            </div>

            <form onSubmit={handleSubmit(formSubmitHandler)} action="" className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                <div>
                    <label htmlFor="email" className="sr-only">
                        Email
                    </label>

                    <div className="relative">
                        <input
                            {...register('email')}
                            name="email"
                            type="email"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Enter email"
                        />

                        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                />
                            </svg>
                        </span>
                    </div>
                    {errors.email ? <span className="text-red-900 block px-2">{errors.email.message}</span> : <></>}
                </div>

                <div>
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>

                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Enter password"
                        />

                        <span
                            className="absolute inset-y-0 end-0 grid place-content-center px-4"
                            onClick={handleToggleShowPassword}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </span>
                    </div>
                    {errors.password ? (
                        <span className="text-red-900 block px-2">{errors.password.message}</span>
                    ) : (
                        <></>
                    )}
                </div>

                {errMessage ? <span className="text-red-900 block px-2">{errMessage}</span> : <></>}

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        No account?
                        {/* <a className="underline" href=""> */}
                        Sign up
                        {/* </a> */}
                    </p>

                    <button
                        type="submit"
                        className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
