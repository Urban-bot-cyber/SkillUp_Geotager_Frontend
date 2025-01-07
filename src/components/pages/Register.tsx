import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../api/axios';
import axios from 'axios';
import UploadImageToS3 from '../../components/uploadImage';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const inputFile = React.useRef<HTMLInputElement | null>(null);

    const [emailValue, setEmailValue] = React.useState<string>('');
    const [firstNameValue, setFirstNameValue] = React.useState<string>('');
    const [lastNameValue, setLastNameValue] = React.useState<string>('');
    const [passwordValue, setPasswordValue] = React.useState<string>('');
    const [passwordConfirmValue, setPasswordConfirmValue] = React.useState<string>('');
    const [errorValue, setErrorValue] = React.useState<string>('');
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [image, setImage] = React.useState<string | null>(null);

    const handleEmailChange = (email: string) => setEmailValue(email);
    const handleFirstNameChange = (firstName: string) => setFirstNameValue(firstName);
    const handleLastNameChange = (lastName: string) => setLastNameValue(lastName);
    const handlePasswordChange = (password: string) => setPasswordValue(password);
    const handlePasswordConfirmChange = (passwordConfirm: string) => setPasswordConfirmValue(passwordConfirm);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            try {
                const uploadedImage = await UploadImageToS3(event.target.files[0]);
                setImage(uploadedImage ?? null);
            } catch (uploadError) {
                setErrorValue('Failed to upload image. Please try again.');
            }
        }
    };

    const validateForm = (): boolean => {
        if (!emailValue || !firstNameValue || !lastNameValue || !passwordValue || !passwordConfirmValue) {
            setErrorValue('All fields are required.');
            return false;
        }
        if (passwordValue !== passwordConfirmValue) {
            setErrorValue('Passwords do not match!');
            return false;
        }
        if (!image) {
            setErrorValue('Please upload an image.');
            return false;
        }
        return true;
    };

    const signUpFunction = async () => {
        if (!validateForm()) return;

        try {
            await customAxios.post('/auth/register', {
                email: emailValue,
                first_name: firstNameValue,
                last_name: lastNameValue,
                password: passwordValue,
                avatar: image,
            });
            navigate('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setErrorValue('Email already in use.');
                } else if (error.response?.status === 400) {
                    setErrorValue('All fields are required.');
                } else {
                    setErrorValue('Something went wrong.');
                }
            } else {
                setErrorValue('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white p-8">
                <div className="flex items-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo-color.png" alt="Logo" className="w-8 h-10 mr-2" />
                    <h1 className="text-2xl font-bold text-green-500">GeoTagger</h1>
                </div>

                <h3 className="text-2xl font-semibold mb-4">Sign up</h3>
                <p className="text-gray-600 mb-8 text-center">
                    Your name will appear on posts and your public profile.
                </p>

                <div className="flex justify-center items-center mb-6">
                    <input
                        type="file"
                        id="avatar"
                        ref={inputFile}
                        style={{ display: 'none' }}
                        onChange={uploadImage}
                    />
                    <img
                        src={image ? image : '/default-avatar.png'}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover cursor-pointer"
                        onClick={() => inputFile.current?.click()}
                    />
                </div>

                {errorValue && <p className="text-red-500 text-sm mb-4">{errorValue}</p>}

                <div className="space-y-4 w-full max-w-md">
                    <div>
                        <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={emailValue}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                            aria-label="Email"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="first_name" className="text-sm text-gray-600">First Name</label>
                            <input
                                id="first_name"
                                type="text"
                                value={firstNameValue}
                                onChange={(e) => handleFirstNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                aria-label="First Name"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="last_name" className="text-sm text-gray-600">Last Name</label>
                            <input
                                id="last_name"
                                type="text"
                                value={lastNameValue}
                                onChange={(e) => handleLastNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                aria-label="Last Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm text-gray-600">Password</label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordValue}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordConfirm" className="text-sm text-gray-600">Confirm Password</label>
                        <input
                            id="passwordConfirm"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordConfirmValue}
                            onChange={(e) => handlePasswordConfirmChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <button
                        onClick={signUpFunction}
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                    >
                        SIGN UP
                    </button>
                </div>

                <p className="text-gray-600 mt-4 text-center">
                    Already have an account?{' '}
                    <span
                        className="text-green-500 hover:underline cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Sign in
                    </span>
                </p>
            </div>

            <div className="hidden lg:block w-1/2 bg-green-100 relative">
                <img
                    src="/background-map.png"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                    <img src="/logo-white.png" alt="Logo" className="w-40 h-40" />
                </div>
            </div>
        </div>
    );
};

export default Register;