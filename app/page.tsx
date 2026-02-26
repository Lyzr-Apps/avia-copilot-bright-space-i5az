'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HiOutlineBars3, HiXMark, HiChevronDown, HiChevronUp, HiPlay, HiCheck, HiArrowRight } from 'react-icons/hi2'
import { FiCode, FiFileText, FiShield, FiMonitor, FiMessageCircle, FiStar, FiUser, FiLogOut, FiMail } from 'react-icons/fi'
import { BiLogoGoogle } from 'react-icons/bi'
import { RiTwitterXLine, RiLinkedinFill, RiGithubFill, RiDiscordFill } from 'react-icons/ri'
import { TbBrain, TbBrandApple, TbBrandNetflix, TbBrandAmazon, TbBrandMeta, TbBrandWindows } from 'react-icons/tb'

/* ─── Animated Counter Hook ─── */
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    const node = ref.current
    if (node) observer.observe(node)
    return () => { if (node) observer.unobserve(node) }
  }, [hasStarted, startOnView])

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration])

  return { count, ref }
}

/* ─── Typing Effect Hook ─── */
function useTypingEffect(text: string, speed: number = 15, trigger: boolean = true) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!trigger) {
      setDisplayed('')
      setIsComplete(false)
      return
    }
    setDisplayed('')
    setIsComplete(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, trigger])

  return { displayed, isComplete }
}

/* ─── Static Data ─── */
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const FEATURES = [
  {
    icon: TbBrain,
    title: 'Real-Time AI Answers',
    description: 'Get instant, context-aware answers during live interviews. Avia listens and generates responses in real-time.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: FiCode,
    title: 'Coding Interview Support',
    description: 'Full support for LeetCode-style problems with step-by-step solutions, complexity analysis, and code generation.',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: FiFileText,
    title: 'Resume-Aware Personalization',
    description: 'Upload your resume and Avia tailors answers to match your experience, projects, and skills.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiShield,
    title: '100% Undetectable',
    description: 'Works seamlessly with all major interview platforms. No screen sharing flags, no detection.',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: FiMonitor,
    title: 'Multi-Platform Support',
    description: 'Compatible with Zoom, Google Meet, Microsoft Teams, and all browser-based interview tools.',
    gradient: 'from-orange-500 to-rose-500',
  },
  {
    icon: FiMessageCircle,
    title: 'Smart Follow-Up Handling',
    description: 'Intelligently handles follow-up questions and maintains context throughout your interview.',
    gradient: 'from-indigo-500 to-cyan-500',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Setup',
    description: 'Install the Avia browser extension and connect your account. Upload your resume for personalized responses.',
    icon: FiFileText,
  },
  {
    number: '02',
    title: 'Join Interview',
    description: 'Join your interview on any platform. Avia automatically detects the session and starts listening.',
    icon: FiMonitor,
  },
  {
    number: '03',
    title: 'Get AI Answers',
    description: 'Receive real-time AI-generated answers displayed in a discreet overlay. Copy or use them naturally.',
    icon: TbBrain,
  },
]

const DEMO_TABS = [
  {
    id: 'system-design',
    label: 'System Design',
    question: 'Can you explain how you would design a URL shortener service like bit.ly?',
    answer: `Great question. I'd approach this systematically:\n\n**Functional Requirements:**\n- Generate short URLs from long URLs\n- Redirect short URLs to original URLs\n- Custom alias support\n- Analytics tracking\n\n**High-Level Architecture:**\n\n1. **API Gateway** - Handles incoming requests, rate limiting\n2. **Application Servers** - Stateless, horizontally scalable\n3. **Key Generation Service** - Pre-generates unique short keys using Base62 encoding\n4. **Database** - NoSQL (DynamoDB/Cassandra) for key-value lookups\n5. **Cache Layer** - Redis for hot URLs (80/20 rule)\n\n**Key Decisions:**\n- Base62 encoding gives us 62^7 = 3.5 trillion unique URLs\n- Read-heavy system (100:1 ratio) - optimize with caching\n- Database sharding by hash of short URL\n\n**Scalability:** Load balancer + auto-scaling groups, CDN for geographic distribution, database replication for read replicas.`,
  },
  {
    id: 'behavioral',
    label: 'Behavioral',
    question: 'Tell me about a time you had to deal with a difficult team member and how you handled it.',
    answer: `Absolutely. At my previous role at [Company], I worked with a senior engineer who was resistant to adopting our new CI/CD pipeline.\n\n**Situation:** We were migrating from manual deployments to automated pipelines. One team member consistently bypassed the new process, deploying directly to production.\n\n**Action:**\n- I scheduled a 1-on-1 to understand their concerns\n- Discovered they worried about deployment speed and rollback capabilities\n- Collaborated to add a fast-rollback feature to our pipeline\n- Paired with them for a week to address workflow friction\n\n**Result:**\n- They became one of the strongest advocates for the new system\n- Deployment errors decreased by 73%\n- The fast-rollback feature they inspired became a standard feature\n\n**Key Takeaway:** Resistance often stems from unaddressed concerns. Listening first and collaborating on solutions creates better outcomes than enforcing compliance.`,
  },
  {
    id: 'coding',
    label: 'Coding',
    question: 'Given an array of integers, find two numbers that add up to a specific target. What is the most efficient approach?',
    answer: `The optimal solution uses a Hash Map approach:\n\n**Approach: One-Pass Hash Map**\n\n\`\`\`python\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\`\`\`\n\n**Complexity Analysis:**\n- Time: O(n) - single pass through array\n- Space: O(n) - hash map storage\n\n**Why not brute force?**\n- Brute force is O(n^2) with nested loops\n- Hash map trades space for time efficiency\n\n**Edge Cases:**\n- Duplicate values: handled naturally by hash map\n- No solution: returns empty array\n- Negative numbers: works without modification\n\nThis approach is preferred in interviews because it demonstrates understanding of time-space tradeoffs and hash table usage.`,
  },
]

const PRICING_PLANS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for getting started',
    features: ['5 interview sessions/month', 'Basic AI answers', 'Email support'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: 19,
    description: 'For serious job seekers',
    features: ['Unlimited sessions', 'Advanced AI + coding support', 'Resume personalization', 'Priority support'],
    cta: 'Start Pro Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    monthlyPrice: 79,
    annualPrice: 59,
    description: 'For teams and bootcamps',
    features: ['Everything in Pro', 'Team management dashboard', 'Custom AI training', 'Dedicated account manager', 'API access'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    initials: 'SC',
    text: 'Avia helped me prepare for my Google L5 interview. The real-time coding support was a game-changer.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Marcus Johnson',
    role: 'Senior Developer at Meta',
    initials: 'MJ',
    text: 'I was skeptical at first, but Avia\'s undetectable overlay gave me the confidence I needed. Landed my dream role.',
    color: 'from-blue-500 to-purple-500',
  },
  {
    name: 'Priya Sharma',
    role: 'CS Graduate, Stanford',
    initials: 'PS',
    text: 'As a student, the free tier was perfect for practice. Upgraded to Pro for my final rounds and it was worth every penny.',
    color: 'from-purple-500 to-pink-500',
  },
]

const FAQS = [
  {
    question: 'Is Avia really undetectable?',
    answer: 'Yes. Avia operates as a browser extension overlay that doesn\'t interact with the interview platform\'s DOM or screen-sharing APIs. It\'s invisible to all major proctoring software.',
  },
  {
    question: 'Which interview platforms does Avia support?',
    answer: 'Avia works with Zoom, Google Meet, Microsoft Teams, WebEx, and all browser-based interview platforms including HackerRank, CodeSignal, and LeetCode.',
  },
  {
    question: 'Can I use Avia for coding interviews?',
    answer: 'Absolutely. Avia provides real-time code generation, step-by-step explanations, complexity analysis, and can even debug code snippets during live coding sessions.',
  },
  {
    question: 'How does the resume personalization work?',
    answer: 'Upload your resume and Avia analyzes your experience, skills, and projects. During interviews, it tailors answers to match your background, making responses sound authentic and personal.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Our Free plan includes 5 interview sessions per month with basic AI answers. No credit card required.',
  },
  {
    question: 'What happens if my internet connection drops?',
    answer: 'Avia caches recent context locally, so brief disconnections won\'t affect your experience. The AI will reconnect automatically and resume where it left off.',
  },
]

/* ─── CSS Keyframes (injected via style attribute on wrapper) ─── */
const GRADIENT_KEYFRAMES = `
@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.15); }
  66% { transform: translate(30px, -40px) scale(0.85); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, 40px) scale(1.05); }
  66% { transform: translate(-30px, -30px) scale(0.95); }
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
@keyframes scroll-logos {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-in {
  animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
`

/* ─── Page Component ─── */
export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDemoTab, setActiveDemoTab] = useState('system-design')
  const [demoTrigger, setDemoTrigger] = useState(true)
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [signInEmail, setSignInEmail] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Persist login state
  useEffect(() => {
    const stored = localStorage.getItem('avia_user')
    if (stored) {
      setIsLoggedIn(true)
      setUserEmail(stored)
    }
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSignIn) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showSignIn])

  const handleSignIn = useCallback((emailVal: string) => {
    const displayEmail = emailVal || 'user@avia.ai'
    localStorage.setItem('avia_user', displayEmail)
    setIsLoggedIn(true)
    setUserEmail(displayEmail)
    setShowSignIn(false)
    setSignInEmail('')
  }, [])

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('avia_user')
    setIsLoggedIn(false)
    setUserEmail('')
    setShowUserMenu(false)
  }, [])

  const stat1 = useCountUp(50, 2000)
  const stat2 = useCountUp(94, 2000)
  const stat3 = useCountUp(200, 2000)
  const stat4 = useCountUp(49, 2000)

  const activeDemo = DEMO_TABS.find(t => t.id === activeDemoTab) ?? DEMO_TABS[0]
  const { displayed: typedAnswer } = useTypingEffect(activeDemo.answer, 8, demoTrigger)

  const handleTabChange = useCallback((tabId: string) => {
    setDemoTrigger(false)
    setActiveDemoTab(tabId)
    setTimeout(() => setDemoTrigger(true), 50)
  }, [])

  const scrollToSection = useCallback((href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }, [])

  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setEmailSubmitted(true)
      setTimeout(() => setEmailSubmitted(false), 3000)
      setEmail('')
    }
  }, [email])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GRADIENT_KEYFRAMES }} />
      <div className="min-h-screen bg-[#030712] text-gray-100 font-sans antialiased overflow-x-hidden">

        {/* ─── NAVIGATION ─── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <TbBrain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Avia
                </span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map(link => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                    >
                      <FiUser className="w-4 h-4" />
                      Dashboard
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0d1117] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm text-white truncate">{userEmail}</p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-gray-400 hover:text-white p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-[#030712]/95 backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-4">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left text-gray-300 hover:text-white py-2 text-base"
                >
                  {link.label}
                </button>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={() => { setMobileMenuOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white mt-4"
                >
                  <FiUser className="w-4 h-4" />
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowSignIn(true) }}
                  className="w-full px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white mt-4"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ─── SIGN IN MODAL ─── */}
        {showSignIn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSignIn(false)}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-[420px] mx-4 animate-in">
              <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 p-8 sm:p-10">
                {/* Close button */}
                <button
                  onClick={() => setShowSignIn(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  aria-label="Close sign in"
                >
                  <HiXMark className="w-5 h-5" />
                </button>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  Sign In
                </h2>

                {/* Google Sign In Button */}
                <button
                  onClick={() => handleSignIn('user@gmail.com')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400 whitespace-nowrap">or continue with email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Email Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (signInEmail.trim()) {
                      handleSignIn(signInEmail)
                    }
                  }}
                  className="relative"
                >
                  <div className="relative flex items-center">
                    <FiMail className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-14 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-sm transition-all duration-200"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-2 w-10 h-10 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-all duration-200 shadow-sm"
                      aria-label="Submit email"
                    >
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-gray-600 underline underline-offset-2 hover:text-gray-800">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-gray-600 underline underline-offset-2 hover:text-gray-800">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── HERO SECTION ─── */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
              style={{ animation: 'float1 8s ease-in-out infinite' }}
            />
            <div
              className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[100px]"
              style={{ animation: 'float2 10s ease-in-out infinite' }}
            />
            <div
              className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-purple-600/15 blur-[100px]"
              style={{ animation: 'float3 12s ease-in-out infinite' }}
            />
          </div>

          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-400 font-medium">Now in Public Beta</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Ace Every Interview with{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    AI-Powered
                  </span>{' '}
                  Confidence
                </h1>

                <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Avia is your invisible interview copilot. Get real-time AI answers, coding support, and personalized coaching -- completely undetectable.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => scrollToSection('#pricing')}
                    className="px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => scrollToSection('#demo')}
                    className="px-8 py-3.5 text-base font-semibold rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <HiPlay className="w-5 h-5" />
                    Watch Demo
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6" ref={stat1.ref}>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat1.count}K+</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Active Users</div>
                  </div>
                  <div className="text-center lg:text-left" ref={stat2.ref}>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat2.count}%</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Success Rate</div>
                  </div>
                  <div className="text-center lg:text-left" ref={stat3.ref}>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat3.count}+</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Companies</div>
                  </div>
                  <div className="text-center lg:text-left" ref={stat4.ref}>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{(stat4.count / 10).toFixed(1)}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">User Rating</div>
                  </div>
                </div>
              </div>

              {/* Right: Floating Mockup */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  {/* Main card */}
                  <div className="rounded-2xl bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 p-6 shadow-2xl shadow-cyan-500/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-xs text-gray-500 ml-2">Avia Interview Copilot</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="text-xs text-cyan-400 font-medium mb-1">Interviewer</div>
                        <div className="text-sm text-gray-300">How would you optimize a slow database query?</div>
                      </div>
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
                        <div className="text-xs text-cyan-400 font-medium mb-1 flex items-center gap-1">
                          <TbBrain className="w-3 h-3" /> Avia AI Response
                        </div>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p>I would start by analyzing the query execution plan...</p>
                          <p className="text-gray-500">1. Check indexes and add composite indexes</p>
                          <p className="text-gray-500">2. Optimize JOIN operations</p>
                          <p className="text-gray-500">3. Consider query caching with Redis</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl px-4 py-2 shadow-lg shadow-green-500/25">
                    <div className="flex items-center gap-1.5">
                      <FiShield className="w-4 h-4 text-white" />
                      <span className="text-xs font-semibold text-white">Undetectable</span>
                    </div>
                  </div>

                  {/* Floating latency badge */}
                  <div className="absolute -bottom-3 -left-3 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2 shadow-lg">
                    <div className="text-xs text-gray-500">Response Time</div>
                    <div className="text-lg font-bold text-cyan-400">0.3s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRUSTED BY SECTION ─── */}
        <section className="py-16 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 uppercase tracking-widest mb-10">
              Trusted by engineers at
            </p>
            <div className="relative overflow-hidden">
              <div className="flex items-center gap-12 md:gap-16 justify-center flex-wrap md:flex-nowrap opacity-40">
                <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold shrink-0">
                  <BiLogoGoogle className="w-7 h-7" /> Google
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold shrink-0">
                  <TbBrandMeta className="w-7 h-7" /> Meta
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold shrink-0">
                  <TbBrandAmazon className="w-7 h-7" /> Amazon
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold shrink-0">
                  <TbBrandWindows className="w-6 h-6" /> Microsoft
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold shrink-0">
                  <TbBrandApple className="w-7 h-7" /> Apple
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xl font-semibold shrink-0">
                  <TbBrandNetflix className="w-7 h-7" /> Netflix
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Everything You Need to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Ace Your Interview
                </span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
                Comprehensive AI-powered tools designed to give you the edge in every interview scenario.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS SECTION ─── */}
        <section id="how-it-works" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                How{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Avia
                </span>{' '}
                Works
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
                Get up and running in minutes. Three simple steps to interview success.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30" />

              {STEPS.map((step, idx) => (
                <div key={idx} className="relative text-center group">
                  {/* Number badge */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all duration-300 relative z-10">
                      <step.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white z-20">
                      {step.number.replace('0', '')}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── DEMO SECTION ─── */}
        <section id="demo" className="py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                See Avia{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  in Action
                </span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
                Watch how Avia generates intelligent answers in real-time across different interview types.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
                {DEMO_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeDemoTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Interface */}
            <div className="max-w-5xl mx-auto rounded-2xl bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-gray-500 ml-3">avia-copilot -- Interview Session</span>
              </div>

              <div className="grid md:grid-cols-2 divide-x divide-white/5">
                {/* Interviewer Panel */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">IN</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Interviewer</div>
                      <div className="text-xs text-gray-500">Live Session</div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-gray-300 leading-relaxed">{activeDemo.question}</p>
                  </div>
                </div>

                {/* AI Response Panel */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <TbBrain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-cyan-400">Avia AI</div>
                      <div className="text-xs text-gray-500">Generating response...</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl p-4 border border-cyan-500/10 max-h-[400px] overflow-y-auto">
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
                      {typedAnswer}
                      <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section id="pricing" className="py-24 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Simple,{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Transparent
                </span>{' '}
                Pricing
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
                Choose the plan that fits your interview prep needs.
              </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 transition-colors duration-300"
                aria-label="Toggle annual pricing"
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 ${
                    isAnnual ? 'left-[30px]' : 'left-0.5'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
                Annual <span className="text-cyan-400 text-xs font-semibold ml-1">Save 35%</span>
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PRICING_PLANS.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl p-6 transition-all duration-500 ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-cyan-500/10 to-blue-600/5 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/10 scale-[1.02] md:scale-105'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25">
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    <div className="mt-5 mb-6">
                      <span className="text-4xl font-bold text-white">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-gray-300">
                        <HiCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS SECTION ─── */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Loved by Engineers{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Worldwide
                </span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
                See what our users have to say about their interview experience with Avia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {TESTIMONIALS.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <FiStar key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white">{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION ─── */}
        <section id="faq" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Frequently Asked{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="mt-4 text-gray-400 text-lg">
                Everything you need to know about Avia.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-white/10"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                    aria-expanded={openFaq === idx}
                  >
                    <span className="text-sm sm:text-base font-medium text-white pr-4">{faq.question}</span>
                    {openFaq === idx ? (
                      <HiChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <HiChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA / NEWSLETTER SECTION ─── */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-600/30 to-purple-600/20" />
              <div className="absolute inset-0 bg-[#0d1117]/60 backdrop-blur-sm" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to Ace Your Next Interview?
                </h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
                  Join 50,000+ engineers who trust Avia for their interviews.
                </p>

                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-sm backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {emailSubmitted ? (
                      <>
                        <HiCheck className="w-4 h-4" /> Subscribed!
                      </>
                    ) : (
                      <>
                        Get Early Access <HiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                  No credit card required. Free tier available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-white/5 bg-[#020408]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Brand Column */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <TbBrain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Avia
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-5 max-w-xs">
                  Your AI-powered interview copilot. Ace every interview with confidence.
                </p>
                <div className="flex items-center gap-3">
                  <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                    <RiTwitterXLine className="w-4 h-4" />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                    <RiLinkedinFill className="w-4 h-4" />
                  </a>
                  <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                    <RiGithubFill className="w-4 h-4" />
                  </a>
                  <a href="#" aria-label="Discord" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                    <RiDiscordFill className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
                <ul className="space-y-2.5">
                  {['Features', 'Pricing', 'How It Works', 'Demo'].map(item => (
                    <li key={item}>
                      <button
                        onClick={() => scrollToSection(`#${item.toLowerCase().replace(/ /g, '-')}`)}
                        className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
                <ul className="space-y-2.5">
                  {['About', 'Blog', 'Careers', 'Press'].map(item => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h4>
                <ul className="space-y-2.5">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-xs text-gray-600">
                Copyright 2024 Avia. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
