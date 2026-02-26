'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  FiHome,
  FiClock,
  FiFileText,
  FiSettings,
  FiHelpCircle,
  FiCopy,
  FiUpload,
  FiCode,
  FiActivity,
  FiStar,
  FiUser,
  FiLogOut,
  FiChevronRight,
  FiMail,
  FiZap,
  FiGrid,
} from 'react-icons/fi'
import { HiOutlineBars3, HiXMark, HiCheck, HiArrowRight } from 'react-icons/hi2'
import {
  RiTwitterXLine,
  RiLinkedinFill,
  RiGithubFill,
  RiDiscordFill,
  RiYoutubeFill,
  RiRedditFill,
} from 'react-icons/ri'
import {
  TbBrain,
  TbBrandApple,
  TbBrandNetflix,
  TbBrandAmazon,
  TbBrandMeta,
  TbBrandWindows,
  TbCoin,
} from 'react-icons/tb'
import { BiLogoGoogle } from 'react-icons/bi'

/* ─── CSS Keyframes ─── */
const DASHBOARD_KEYFRAMES = `
@keyframes scroll-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-border {
  0%, 100% { border-color: rgba(6, 182, 212, 0.2); }
  50% { border-color: rgba(6, 182, 212, 0.5); }
}
`

/* ─── Types ─── */
interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  id: string
}

interface StepCard {
  number: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

interface SurveyOption {
  label: string
  icon: React.ComponentType<{ className?: string }>
  id: string
}

interface CompanyLogo {
  name: string
  icon: React.ComponentType<{ className?: string }>
}

/* ─── Static Data ─── */
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: FiHome, id: 'dashboard' },
  { label: 'Sessions', icon: FiClock, id: 'sessions' },
  { label: 'Resume', icon: FiFileText, id: 'resume' },
  { label: 'Settings', icon: FiSettings, id: 'settings' },
  { label: 'Help', icon: FiHelpCircle, id: 'help' },
]

const STEP_CARDS: StepCard[] = [
  {
    number: '1',
    icon: FiUpload,
    title: 'Upload Resume',
    description: 'Upload your resume so Avia can personalize responses to match your experience.',
  },
  {
    number: '2',
    icon: FiCode,
    title: 'Choose Interview Type',
    description: 'Select your interview format: System Design, Behavioral, or Coding.',
  },
  {
    number: '3',
    icon: FiActivity,
    title: 'Create Session',
    description: 'Start a new AI-powered interview practice session with real-time assistance.',
  },
  {
    number: '4',
    icon: FiStar,
    title: 'Review Performance',
    description: 'View your session history, AI feedback, and improvement areas.',
  },
]

const INTERVIEW_TYPES = ['System Design', 'Behavioral', 'Coding']

const SURVEY_OPTIONS: SurveyOption[] = [
  { label: 'LinkedIn', icon: RiLinkedinFill, id: 'linkedin' },
  { label: 'Twitter / X', icon: RiTwitterXLine, id: 'twitter' },
  { label: 'YouTube', icon: RiYoutubeFill, id: 'youtube' },
  { label: 'Reddit', icon: RiRedditFill, id: 'reddit' },
  { label: 'GitHub', icon: RiGithubFill, id: 'github' },
  { label: 'Discord', icon: RiDiscordFill, id: 'discord' },
  { label: 'Google Search', icon: BiLogoGoogle, id: 'google' },
  { label: 'Friend Referral', icon: FiUser, id: 'friend' },
]

const COMPANY_LOGOS: CompanyLogo[] = [
  { name: 'Google', icon: BiLogoGoogle },
  { name: 'Meta', icon: TbBrandMeta },
  { name: 'Amazon', icon: TbBrandAmazon },
  { name: 'Microsoft', icon: TbBrandWindows },
  { name: 'Apple', icon: TbBrandApple },
  { name: 'Netflix', icon: TbBrandNetflix },
]

/* ─── Helper: extract first name from email ─── */
function getFirstName(email: string): string {
  if (!email) return ''
  const local = email.split('@')[0] ?? ''
  // Remove numbers and special chars, capitalize first letter
  const cleaned = local.replace(/[0-9._\-+]/g, ' ').trim().split(' ')[0] ?? ''
  if (!cleaned) return ''
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
}

/* ─── Helper: generate random referral code ─── */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/* ─── Page Component ─── */
export default function Page() {
  const router = useRouter()

  // Auth state
  const [isChecking, setIsChecking] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')

  // Step 2: Interview type selection
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Survey state
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set())
  const [surveySubmitted, setSurveySubmitted] = useState(false)

  // Referral state
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Auth guard
  useEffect(() => {
    const stored = localStorage.getItem('avia_user')
    if (!stored) {
      router.push('/')
      return
    }
    setUserEmail(stored)
    setIsChecking(false)
  }, [router])

  // Generate referral code on mount (useEffect to avoid hydration mismatch)
  useEffect(() => {
    setReferralCode(generateReferralCode())
  }, [])

  // Close sidebar on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('avia_user')
    router.push('/')
  }, [router])

  const handleCopyReferral = useCallback(() => {
    const code = `AVIA-${referralCode}`
    navigator.clipboard.writeText(code).catch(() => {
      // Fallback: do nothing
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [referralCode])

  const toggleSurveySource = useCallback((id: string) => {
    setSelectedSources(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleSurveySubmit = useCallback(() => {
    setSurveySubmitted(true)
  }, [])

  const firstName = getFirstName(userEmail)
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U'

  // Loading / auth check
  if (isChecking) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: DASHBOARD_KEYFRAMES }} />
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
              <TbBrain className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DASHBOARD_KEYFRAMES }} />
      <div className="min-h-screen bg-[#030712] text-gray-100 font-sans antialiased flex">

        {/* ─── MOBILE SIDEBAR BACKDROP ─── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── SIDEBAR ─── */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0d1117]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <TbBrain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Avia
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  {item.label}
                  {isActive && (
                    <FiChevronRight className="w-4 h-4 ml-auto text-cyan-500/50" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t border-white/[0.06] space-y-2">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">{userInitial}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{firstName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
            >
              <FiLogOut className="w-[18px] h-[18px] shrink-0" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">

          {/* ─── TOP HEADER BAR ─── */}
          <header className="sticky top-0 z-30 bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
              {/* Left: Hamburger + Welcome */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                  aria-label="Open sidebar"
                >
                  <HiOutlineBars3 className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-base sm:text-lg font-semibold text-white">
                    Welcome back{firstName ? `, ${firstName}` : ''}
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Here is your interview preparation hub
                  </p>
                </div>
              </div>

              {/* Right: Credits + Get Credits + Avatar */}
              <div className="flex items-center gap-3">
                {/* Credits pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                  <TbCoin className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-300">15 min</span>
                </div>
                {/* Get Credits button */}
                <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30">
                  <FiZap className="w-3.5 h-3.5" />
                  Get Credits
                </button>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center ring-2 ring-white/10">
                  <span className="text-xs font-bold text-white">{userInitial}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ─── SCROLLABLE MAIN CONTENT ─── */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">

              {/* ═══════════════════════════════════════════════ */}
              {/* SECTION 1: STEP-BASED ONBOARDING FLOW          */}
              {/* ═══════════════════════════════════════════════ */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <FiGrid className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Get Started</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {STEP_CARDS.map((step) => (
                    <div
                      key={step.number}
                      className="group relative rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] p-5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5"
                    >
                      {/* Number badge + icon row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-cyan-500/25">
                          {step.number}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/15 group-hover:border-cyan-500/20 transition-all duration-300">
                          <step.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{step.description}</p>

                      {/* Step-specific content */}
                      {step.number === '1' && (
                        <button className="w-full py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-gray-300 hover:bg-white/[0.1] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5">
                          <FiUpload className="w-3.5 h-3.5" />
                          Upload Resume
                        </button>
                      )}

                      {step.number === '2' && (
                        <div className="flex flex-wrap gap-1.5">
                          {INTERVIEW_TYPES.map(type => (
                            <button
                              key={type}
                              onClick={() => setSelectedType(selectedType === type ? null : type)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                                selectedType === type
                                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400'
                                  : 'bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-gray-300 hover:border-white/[0.12]'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      )}

                      {step.number === '3' && (
                        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center justify-center gap-1.5">
                          <FiActivity className="w-3.5 h-3.5" />
                          Create Session
                        </button>
                      )}

                      {step.number === '4' && (
                        <button className="w-full py-2 rounded-lg bg-transparent border border-white/[0.12] text-xs font-medium text-gray-300 hover:bg-white/[0.04] hover:border-white/[0.2] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5">
                          <FiClock className="w-3.5 h-3.5" />
                          View History
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ═══════════════════════════════════════════════ */}
              {/* SECTION 2: "WHERE DID YOU HEAR ABOUT US?" SURVEY */}
              {/* ═══════════════════════════════════════════════ */}
              <section>
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-6">
                  {surveySubmitted ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center mb-4">
                        <HiCheck className="w-7 h-7 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">Thanks for your feedback!</h3>
                      <p className="text-sm text-gray-500">Your response helps us improve Avia for everyone.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-5">
                        <h3 className="text-base font-semibold text-white mb-1">Where did you hear about us?</h3>
                        <p className="text-xs text-gray-500">Help us improve by telling us where you found Avia.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
                        {SURVEY_OPTIONS.map(option => {
                          const isSelected = selectedSources.has(option.id)
                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleSurveySource(option.id)}
                              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                                  : 'bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:border-white/[0.1] hover:text-gray-300'
                              }`}
                            >
                              <option.icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`} />
                              <span className="text-xs sm:text-sm">{option.label}</span>
                              {isSelected && <HiCheck className="w-4 h-4 ml-auto text-cyan-400 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        onClick={handleSurveySubmit}
                        disabled={selectedSources.size === 0}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          selectedSources.size > 0
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20'
                            : 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        Submit
                        <HiArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </section>

              {/* ═══════════════════════════════════════════════ */}
              {/* SECTION 3: TRUSTED BY SECTION (MARQUEE)        */}
              {/* ═══════════════════════════════════════════════ */}
              <section>
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] py-6 overflow-hidden">
                  <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-5">
                    Trusted by engineers at
                  </p>
                  <div className="relative overflow-hidden">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />
                    {/* Scrolling track */}
                    <div
                      className="flex items-center gap-10 opacity-40"
                      style={{ animation: 'scroll-marquee 25s linear infinite', width: 'max-content' }}
                    >
                      {/* First set */}
                      {COMPANY_LOGOS.map((company, idx) => (
                        <div key={`a-${idx}`} className="flex items-center gap-2 text-gray-400 text-lg font-semibold shrink-0">
                          <company.icon className="w-6 h-6" />
                          <span>{company.name}</span>
                        </div>
                      ))}
                      {/* Duplicate for seamless loop */}
                      {COMPANY_LOGOS.map((company, idx) => (
                        <div key={`b-${idx}`} className="flex items-center gap-2 text-gray-400 text-lg font-semibold shrink-0">
                          <company.icon className="w-6 h-6" />
                          <span>{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ═══════════════════════════════════════════════ */}
              {/* SECTION 4: REFERRAL SECTION                    */}
              {/* ═══════════════════════════════════════════════ */}
              <section className="pb-6">
                <div className="relative rounded-2xl overflow-hidden">
                  {/* Gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/15 via-blue-600/20 to-purple-600/15" />
                  <div className="absolute inset-0 bg-[#0d1117]/50 backdrop-blur-sm" />
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative px-5 py-8 sm:px-8 sm:py-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Left content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FiZap className="w-5 h-5 text-cyan-400" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Referral Program</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          Invite Friends, Get Rewarded
                        </h3>
                        <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
                          Share your referral code with friends. When they sign up, you both get 2 free interview sessions.
                        </p>
                        {/* Referral stats */}
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                          <span>0 Referrals</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span>0 Credits Earned</span>
                        </div>
                      </div>

                      {/* Right: Referral code + actions */}
                      <div className="flex flex-col items-start lg:items-end gap-3">
                        {/* Referral code pill */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1]">
                            <span className="text-sm font-mono font-semibold text-white tracking-wider">
                              AVIA-{referralCode}
                            </span>
                          </div>
                          <button
                            onClick={handleCopyReferral}
                            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                              copied
                                ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                                : 'bg-white/[0.06] border border-white/[0.1] text-gray-300 hover:bg-white/[0.1] hover:text-white'
                            }`}
                          >
                            {copied ? (
                              <>
                                <HiCheck className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <FiCopy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        {/* Share via Email */}
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-md shadow-cyan-500/20">
                          <FiMail className="w-3.5 h-3.5" />
                          Share via Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </>
  )
}
