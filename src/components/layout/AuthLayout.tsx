import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            
            <Header variant="auth" />
            
            <main className="w-full max-w-[1190px] mx-auto px-4 md:px-8 grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}