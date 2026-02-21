'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import {
    Loader2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Factory,
    BarChart3,
    ShieldCheck,
    Zap,
    ArrowRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
}

const stats = [
    { icon: BarChart3, value: '99.5%', label: 'Uptime' },
    { icon: Zap, value: '<2s', label: 'Response' },
    { icon: ShieldCheck, value: '100%', label: 'Secure' },
]

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            })

            if (error) {
                if (error.message === 'Email not confirmed') {
                    toast.error('Login Failed', { description: 'Please check your email to confirm your account.' })
                } else {
                    toast.error('Login Failed', { description: error.message })
                }
            } else {
                toast.success('Login Successful')
                router.refresh()
                router.push('/gate')
            }
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password
            })
            if (error) {
                toast.error('Sign Up Failed', { description: error.message })
            } else {
                if (data.user && !data.session) {
                    toast.success('Sign Up Successful!', { description: 'Please check your email to confirm your account.' })
                } else {
                    toast.success('Account created! You can now sign in.')
                }
                setIsSignUp(false)
            }
        } catch {
            toast.error('Error during sign up')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* ── Left branded panel ── */}
            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 text-white">
                {/* Decorative grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Gradient orbs */}
                <div className="pointer-events-none absolute -left-40 -top-40 h-125 w-125 rounded-full bg-indigo-500/20 blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-100 w-100 rounded-full bg-violet-500/20 blur-[100px]" />

                {/* Top: branding */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/30">
                            <Factory className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold tracking-tight">MES Platform</h1>
                            <p className="text-xs text-indigo-300">Manufacturing Execution System</p>
                        </div>
                    </div>
                </motion.div>

                {/* Center: headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative z-10 max-w-md"
                >
                    <h2 className="text-4xl font-bold leading-tight tracking-tight">
                        Streamline Your
                        <span className="mt-1 block bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Production Floor
                        </span>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-400">
                        Real-time monitoring, quality control, and intelligent scheduling — all in one platform built for modern manufacturing.
                    </p>
                </motion.div>

                {/* Bottom: stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative z-10 flex gap-6"
                >
                    {stats.map((s) => (
                        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                            <s.icon className="h-5 w-5 text-indigo-400" />
                            <div>
                                <p className="text-lg font-semibold">{s.value}</p>
                                <p className="text-xs text-slate-400">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-col items-center justify-center bg-white px-6 py-12 lg:px-16">
                {/* Mobile logo (hidden on lg+) */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 flex items-center gap-3 lg:hidden"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <Factory className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-slate-900">MES Platform</span>
                </motion.div>

                <div className="w-full max-w-100">
                    {/* Header */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        variants={fadeUp}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {isSignUp
                                ? 'Fill in the details below to get started.'
                                : 'Enter your credentials to access the dashboard.'}
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial="hidden"
                        animate="visible"
                        onSubmit={isSignUp ? handleSignUp : handleLogin}
                        className="space-y-5"
                    >
                        {/* Email field */}
                        <motion.div custom={1} variants={fadeUp} className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="h-11 pl-10 text-sm"
                                />
                            </div>
                        </motion.div>

                        {/* Password field */}
                        <motion.div custom={2} variants={fadeUp} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700">
                                    Password
                                </Label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                        onClick={() => toast.info('Please contact your administrator to reset your password.')}
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                    className="h-11 pl-10 pr-10 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember me (login only) */}
                        {!isSignUp && (
                            <motion.div custom={3} variants={fadeUp} className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                                    Remember me for 30 days
                                </Label>
                            </motion.div>
                        )}

                        {/* Submit button */}
                        <motion.div custom={4} variants={fadeUp}>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 w-full bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500/50 transition-all duration-200 text-sm font-medium shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </Button>
                        </motion.div>
                    </motion.form>

                    {/* Divider */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={5}
                        variants={fadeUp}
                        className="my-8 flex items-center gap-3"
                    >
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs text-slate-400">or</span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </motion.div>

                    {/* Toggle sign-up / sign-in */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={6}
                        variants={fadeUp}
                        className="text-center"
                    >
                        <p className="text-sm text-slate-500">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                {isSignUp ? 'Sign in' : 'Create one'}
                            </button>
                        </p>
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        custom={7}
                        variants={fadeUp}
                        className="mt-12 text-center text-xs text-slate-400"
                    >
                        By continuing you agree to our{' '}
                        <Link href="#" className="underline hover:text-slate-600 transition-colors">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="#" className="underline hover:text-slate-600 transition-colors">
                            Privacy Policy
                        </Link>
                        .
                    </motion.p>
                </div>
            </div>
        </div>
    )
}
