
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    if (location.pathname === '/login' || location.pathname === '/signup') {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {children}
            </div>
        </>
    );
};

export default Layout;
