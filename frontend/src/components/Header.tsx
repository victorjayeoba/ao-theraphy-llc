import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ShoppingCart, ChevronDown, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, openCart } = useCart();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const resourcesDropdown = [
    { name: "Shop", path: "/shop" },
    { name: "Consultation", path: "/consultation" },
    { name: "Presentations", path: "/presentations" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="A&O Therapy LLC" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${
                  isActive(item.path) ? "text-primary font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1 outline-none">
                Resources
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background">
                {resourcesDropdown.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.path} className="cursor-pointer">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:(630) 394-0632"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone size={16} />
              <span>(630) 394-0632</span>
            </a>
            
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link flex items-center gap-1 outline-none">
                  <User size={18} />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background">
                  <DropdownMenuItem disabled className="text-xs opacity-70">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="nav-link flex items-center gap-1">
                <User size={18} />
                Sign In
              </Link>
            )}

            
            <Button asChild className="btn-hero">
              <Link to="/consultation">Book Consultation</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {resourcesDropdown.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <a
                  href="tel:555-123-4567"
                  className="flex items-center space-x-2 px-3 py-2 text-muted-foreground"
                >
                  <Phone size={16} />
                  <span>(555) 123-4567)</span>
                </a>
                <Button
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2"
                  onClick={() => {
                    openCart();
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart size={16} />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Button>

                {user ? (
                  <Button
                    variant="outline"
                    className="w-full mt-3 flex items-center justify-center gap-2"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out ({user.name.split(" ")[0]})
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-3 flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/auth">
                      <User size={16} />
                      Sign In
                    </Link>
                  </Button>
                )}
                <Button asChild className="btn-hero w-full mt-3" onClick={() => setIsMenuOpen(false)}>
                  <Link to="/consultation">Book Consultation</Link>
                  
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;