import '@styles/globals.css';
import Nav from '@components/navbar';
import Logo from '@components/Logo';
import { Providers } from './providers';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
    title: 'NFT RWA',
    description: 'NFT REAL WORLD ASSETS platform',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
        <body>
            <Providers>
                <AuthProvider>
                    <main className="bg-[#000000]">
                        {/* Logo in top left */}
                        <div className="fixed top-4 left-4 z-50">
                            <Logo />
                        </div>
                        {children}
                        <Nav />
                    </main>
                </AuthProvider>
            </Providers>
        </body>
    </html>
  )
}  

export default RootLayout;