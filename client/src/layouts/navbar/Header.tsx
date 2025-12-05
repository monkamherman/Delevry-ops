import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/ui/mode_toggle';
import { Menu, X, Package, User, LogIn, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = false; // À remplacer par la logique d'authentification

  const navItems = [
    { name: 'Accueil', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Livraisons', path: '/deliveries', icon: <Package className="h-5 w-5" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Delivery Ops</span>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Bouton de connexion/profil */}
          {isAuthenticated ? (
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <User className="h-5 w-5" />
              <span className="sr-only">Profil</span>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/login')}>
              <LogIn className="mr-2 h-4 w-4" />
              Connexion
            </Button>
          )}

          {/* Bouton thème clair/sombre */}
          <ModeToggle />

          {/* Bouton menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-t shadow-lg">
          <div className="container py-2 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
            
            {isAuthenticated ? (
              <button
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => {
                  // Logique de déconnexion
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Déconnexion
              </button>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
