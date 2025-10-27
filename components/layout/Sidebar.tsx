
import React, { useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getSidebarLinks } from '../../constants';
import { X, School } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
             <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarContent: React.FC = () => {
    const authContext = useContext(AuthContext);
    const userRole = authContext?.user?.role;
    
    // Default to 'kasir' role if userRole is somehow undefined to avoid errors, though it shouldn't happen in a protected context.
    const sidebarLinks = useMemo(() => getSidebarLinks(userRole || 'kasir'), [userRole]);

    return (
        <div className="flex flex-col flex-grow bg-primary-800 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
                <School className="h-8 w-8 text-white mr-2" />
                <h1 className="text-white text-xl font-bold">School Cashier</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
                {sidebarLinks.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                                isActive
                                    ? 'bg-primary-900 text-white'
                                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};


export default Sidebar;
