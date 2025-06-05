"use client";

import AuthForm from '@/components/form';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from "next/link";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterForm(){
    const router = useRouter();

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3,"Username must at least be 3 characters")
            .required("Username is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/\d/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required'),
    });

    return (
        <AuthForm>
            <div className='text-center'>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Welcome to VYV</h2>
                <p className='text-gray-600 font-body '>Sign up to get started</p> 
            </div>
            <Formik 
                initialValues={{username: '', email:'', password:'', confirmPassword: ''}}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const { username, email, password } = values;
                        await axios.post("/api/user", {
                            username,
                            email,
                            password
                        });
                        // If registration is successful, redirect to login
                        toast.success('Registration successful! Please login.');
                        router.push('/login');
                    } catch (err: Error | unknown) {
                        const error = err as { response?: { data?: { error?: string } } };
                        if (error.response?.data?.error === 'DUPLICATE_USERNAME') {
                            toast.error('Username is already taken. Please choose a different username.');
                        } else if (error.response?.data?.error === 'DUPLICATE_EMAIL') {
                            toast.error('Email is already registered. Please use a different email or login.');
                        } else {
                            toast.error('Registration failed. Please try again.');
                        }
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <div className="my-4">
                            <label className="block text-lg font-heading  font-semibold ">Username</label>
                            <Field
                                name="username"
                                type="text"
                                placeholder="Enter your Username"
                                className="mt-1 w-full border border-gray-400 font-body  rounded-md p-1"
                            />
                            <ErrorMessage name="username" component="div" className="text-red-500 font-body  text-sm mt-1" />
                        </div>
                        <div className="my-4">
                            <label className="block text-lg font-semibold ">Email</label>
                            <Field 
                                name="email"
                                type="email"
                                placeholder="Enter your email here"
                                className="mt-1 w-full border border-gray-400 font-body  rounded-md p-1"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 font-body  text-sm mt-1" />
                        </div>
                        <div className="my-4">
                            <label className="block text-lg font-semibold font-heading  ">Password</label>
                            <Field 
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                className="mt-1 w-full border border-gray-400 font-body  rounded-md p-1"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 font-body  text-sm mt-1" />
                        </div>
                        <div className="my-4">
                            <label className="block text-lg font-semibold font-heading ">Confirm Password</label>
                            <Field 
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className="mt-1 w-full border border-gray-400 rounded-md font-body  p-1"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 font-body  text-sm mt-1" />
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-body "
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing up...' : 'Sign Up'}
                        </Button>
                        <div className='text-center font-body  mt-4'>Already have an account?<Link className='text-secondary' href="/login"> Sign In</Link></div>
                    </Form>
                )}
            </Formik>
        </AuthForm>
    );
}