import { Link, useLocation } from 'react-router-dom'
import { Clock, Calendar, Users, Home, LogOut, Globe } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { language, setLanguage, t } = useLanguageStore()

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: Home },
    { name: t('nav.checkin'), href: '/checkin', icon: Clock },
    { name: t('nav.schedule'), href: '/schedule', icon: Calendar },
    ...(user?.role === 'admin' ? [{ name: t('nav.admin'), href: '/admin', icon: Users }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">TimeTidy</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === item.href
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'da' : 'en')}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Dansk' : 'English'}
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                {user?.role === 'admin' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                    Admin
                  </span>
                )}
              </div>
              
              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  )
} 