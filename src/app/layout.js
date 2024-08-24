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
                <a href="#">About</a>
                <a href="#">Products</a>
                <a href="#">Pricing</a>
                <a href="#">Contact</a>
              </nav>
            </header>
            <main className="main-content">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
