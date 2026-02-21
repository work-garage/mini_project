'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Factory,
    Cog,
    ClipboardCheck,
    Truck,
    Package,
    Database,
    LogOut,
    ArrowRight,
    BarChart3,
    Activity,
    Boxes,
    Wrench,
    ChefHat,
    Send,
    ShieldCheck,
    Monitor,
    Loader2,
    Search,
    TrendingUp,
    Clock,
    Zap,
} from 'lucide-react'

/* ─── animation helpers ─── */
const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

/* ─── data ─── */
const quickStats = [
    { label: 'Active Lines', value: '4 / 5', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Today\'s Output', value: '2,450', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending GRNs', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Uptime', value: '99.2%', icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50' },
]

interface NavModule {
    title: string
    description: string
    icon: React.ElementType
    color: string
    iconBg: string
    links: { label: string; href: string; primary?: boolean }[]
}

const modules: NavModule[] = [
    {
        title: 'Production Floor',
        description: 'Batches, process logging & machine data',
        icon: Factory,
        color: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        links: [
            { label: 'Sub-Batch', href: '/production/sub-batch' },
            { label: 'Mixing / Oven', href: '/production/mixing' },
            { label: 'Supervisor Dashboard', href: '/production/dashboard', primary: true },
        ],
    },
    {
        title: 'Inbound Logistics',
        description: 'Gate, Weighbridge & vehicle inspection',
        icon: Truck,
        color: 'text-violet-600',
        iconBg: 'bg-violet-50',
        links: [
            { label: 'Gate Entry', href: '/gate' },
            { label: 'Weighbridge', href: '/weighbridge' },
            { label: 'Vehicle Inspection', href: '/vehicle-inspection' },
            { label: 'Inventory Transfer', href: '/stores/transfer' },
        ],
    },
    {
        title: 'Stores & FG',
        description: 'GRN, inventory & finished goods',
        icon: Boxes,
        color: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        links: [
            { label: 'Create GRN', href: '/stores/grn-create' },
            { label: 'FG Batch', href: '/fg/create' },
            { label: 'Dispatch', href: '/dispatch/create' },
            { label: 'View Inventory', href: '/stores/inventory' },
        ],
    },
    {
        title: 'Quality & Maintenance',
        description: 'QA inspections, downtime & audits',
        icon: ShieldCheck,
        color: 'text-amber-600',
        iconBg: 'bg-amber-50',
        links: [
            { label: 'QA Inspection', href: '/qa' },
            { label: 'Downtime Ticket', href: '/maintenance/downtime' },
            { label: 'Inventory Audit', href: '/stores/audit' },
        ],
    },
    {
        title: 'Analytics',
        description: 'Production trends, OEE & waste analysis',
        icon: BarChart3,
        color: 'text-cyan-600',
        iconBg: 'bg-cyan-50',
        links: [
            { label: 'Production Analytics', href: '/analytics', primary: true },
            { label: 'System Monitoring', href: '/monitoring' },
        ],
    },
    {
        title: 'System Config',
        description: 'Master data, machines & recipes',
        icon: Cog,
        color: 'text-slate-600',
        iconBg: 'bg-slate-100',
        links: [
            { label: 'Machines', href: '/masters/machines' },
            { label: 'Materials', href: '/masters/materials' },
            { label: 'Recipe Manager', href: '/recipes' },
        ],
    },
]

/* ─── component ─── */
export default function MainDashboard() {
    const { user, profile, isLoading, checkSession, signOut } = useAuth()
    const router = useRouter()

    useEffect(() => { checkSession() }, [])

    useEffect(() => {
        if (!isLoading && !user) router.push('/login')
    }, [isLoading, user, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    if (!user) return null

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    const greeting = (() => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 17) return 'Good afternoon'
        return 'Good evening'
    })()

    return (
        <div className="min-h-screen bg-slate-50/80">
            {/* ── Top bar ── */}
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/20">
                            <Factory className="h-4.5 w-4.5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold leading-none text-slate-900">MES Platform</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">Manufacturing Execution System</p>
                        </div>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            All Systems Online
                        </Badge>
                        <Separator orientation="vertical" className="hidden sm:block h-6" />
                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium leading-none text-slate-900">{profile?.full_name ?? 'User'}</p>
                                <p className="mt-0.5 text-[11px] capitalize text-slate-500">{profile?.role?.replace('_', ' ') ?? 'operator'}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-slate-600"
                            onClick={() => { signOut(); router.push('/login') }}
                            aria-label="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero greeting */}
                <motion.section
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {greeting}, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Here&apos;s what&apos;s happening across your plant today.
                    </p>
                </motion.section>

                {/* Quick stats */}
                <motion.section
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
                >
                    {quickStats.map((s) => (
                        <motion.div
                            key={s.label}
                            variants={fadeUp}
                            className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.section>

                {/* Module cards */}
                <motion.section
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                    {modules.map((mod) => (
                        <motion.div
                            key={mod.title}
                            variants={fadeUp}
                            className="group relative flex flex-col rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-lg hover:border-slate-300"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 p-5 pb-3">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${mod.iconBg}`}>
                                    <mod.icon className={`h-5 w-5 ${mod.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900">{mod.title}</h3>
                                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex flex-1 flex-col gap-1.5 px-5 pb-5">
                                {mod.links.map((link) => (
                                    <Link key={link.href} href={link.href}>
                                        <span
                                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                                                link.primary
                                                    ? 'bg-indigo-50 font-medium text-indigo-700 hover:bg-indigo-100'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            {link.label}
                                            <ArrowRight className={`h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 ${
                                                link.primary ? 'text-indigo-500' : 'text-slate-400'
                                            }`} />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.section>
            </main>

            {/* ── Footer ── */}
            <footer className="mt-12 border-t bg-white py-6">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
                    <p className="text-xs text-slate-400">© {new Date().getFullYear()} MES Platform · Manufacturing Execution System</p>
                    <div className="flex gap-4 text-xs text-slate-400">
                        <Link href="#" className="hover:text-slate-600 transition-colors">Documentation</Link>
                        <Link href="#" className="hover:text-slate-600 transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
