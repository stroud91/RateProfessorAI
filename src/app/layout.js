import { ClerkProvider } from '@clerk/nextjs';
import './styles/globals.css';

export const metadata = {
  title: 'Luxury AI',
  description: 'A luxurious AI interface with a sleek black and gold design',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="background-overlay">
            <header className="header">
              <div className="logo">LUXURY AI</div>
              <nav className="nav-menu">
                <a href="/features">Features</a>
                <a href="/pricing">Pricing</a>
                <a href="/contact">Contact</a>
                <a href="/sign-in">Sign In</a>
                <a href="/sign-up">Sign Up</a>
              </nav>
            </header>
            <main className="main-content">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
