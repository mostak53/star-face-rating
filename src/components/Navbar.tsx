import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { LogOut, User, ShieldCheck, Star } from 'lucide-react';

interface NavbarProps {
  user: any;
  isAdmin: boolean;
  setUser: (user: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Navbar({ user, isAdmin, setUser, setIsAdmin }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-zinc-900">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <span>Face Rating</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                How to Rate
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Total Active User
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link to="/rating">
                    <Button variant="ghost" size="sm">Rate Photos</Button>
                  </Link>
                  <Link to="/my-ratings">
                    <Button variant="ghost" size="sm">My Ratings</Button>
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-sm font-medium">
                <User className="h-4 w-4" />
                {user.username}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="rounded-full px-6">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
