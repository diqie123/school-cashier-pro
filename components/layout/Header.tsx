
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, User as UserIcon, ChevronDown, LogOut } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';
import { AuthContext } from '../../contexts/AuthContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!appContext || !authContext) return null;
  const { theme, toggleTheme } = appContext;
  const { user, logout } = authContext;

  return (
    <header className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
      <button
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-end">
        <div className="ml-4 flex items-center md:ml-6">
          <button
            onClick={toggleTheme}
            className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-primary-500"
          >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative" ref={dropdownRef}>
            <div>
              <button
                className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-primary-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                   <UserIcon className="h-5 w-5 text-white" />
                </div>
                <span className="hidden md:inline-block ml-2 text-gray-700 dark:text-gray-300 text-sm font-medium">{user?.nama}</span>
                <ChevronDown className="hidden md:inline-block ml-1 h-4 w-4 text-gray-500" />
              </button>
            </div>
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    <p className="font-semibold">{user?.nama}</p>
                    <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); logout(); setDropdownOpen(false); }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
