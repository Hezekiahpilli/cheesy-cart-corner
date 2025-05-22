
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { items, getTotalPrice } = useCartStore();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  const cartItemCount = items.reduce((count, item) => {
    if (item.type === 'pizza' && item.pizza) {
      return count + item.pizza.quantity;
    } else if (item.type === 'drink' && item.drink) {
      return count + item.drink.quantity;
    }
    return count;
  }, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
  ];
  
  if (isAuthenticated) {
    navLinks.push({ name: 'My Orders', path: '/orders' });
  }

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <header className="sticky top-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold text-pizza-600">
            Pizza<span className="text-pizza-800">Delight</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-gray-700 hover:text-pizza-600 transition-colors ${
                location.pathname === link.path ? 'font-bold text-pizza-600' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth & Cart */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hi, {user?.firstName}
              </span>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-pizza-600"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="default" className="bg-pizza-600 hover:bg-pizza-700" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            className="relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pizza-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full py-6">
                <div className="flex-1 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block py-2 px-4 text-lg ${
                        location.pathname === link.path ? 'font-bold text-pizza-600' : 'text-gray-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Auth */}
                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <p className="px-4 text-sm text-gray-700">
                        Logged in as <span className="font-bold">{user?.username}</span>
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 px-4 text-gray-700"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 px-4 text-pizza-600 font-semibold"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
