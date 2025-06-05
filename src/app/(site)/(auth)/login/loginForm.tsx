"use client";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/form';
import { useAuthStore } from '@/store/authStore';
import { getSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function LoginForm() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
    });

    return (
        <AuthForm>
            <div className='text-center'>
                <h2 className="text-3xl font-heading font-bold tracking-tight">Sign In</h2>
                <p className='text-gray-600 font-body '>Welcome back! Please sign in to your account.</p>
            </div>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await login(values.email, values.password);
                        
                        // Wait for session to update
                        const session = await getSession();
                        toast.success('Login successful!');
                        if (session?.user?.accountType === 'ADMIN') {
                            router.push('/admin/dashboard');
                        } else {
                            router.push('/products');
                        }
                    } catch (err) {
                        console.log(err);
                        toast.error('Login failed. Please try again.');
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="my-4">
                            <label className="block text-lg font-heading font-semibold">Email</label>
                            <Field
                                name="email"
                                type="email"
                                className="mt-1 w-full border border-gray-400 rounded-md p-1"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 font-body  text-sm mt-1" />
                        </div>
                        <div className="my-4">
                            <label className="block text-lg font-heading font-semibold">Password</label>
                            <Field
                                name="password"
                                type="password"
                                className="mt-1 w-full border border-gray-400 rounded-md p-1"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 font-body  text-sm mt-1" />
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-body "
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <div className='text-center font-body  mt-4'>
                            New Here? <Link href="/register" className="text-secondary">Sign Up</Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </AuthForm>
    );
}