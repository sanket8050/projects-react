import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { LogOut, User, Plus, Bell } from 'lucide-react';

const Navbar = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Equinox</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                            <Bell className="h-6 w-6" />
                        </button>
                        <span className="text-gray-700 text-sm font-medium hidden sm:block">
                            {user?.name}
                        </span>
                        <button
                            onClick={logout}
                            className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
