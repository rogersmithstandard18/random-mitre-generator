import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User, ChevronDown, Settings } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="user-avatar" />
        ) : (
          <User size={20} />
        )}
        <span className="user-menu-trigger-name">{user.name?.split(' ')[0]}</span>
        <ChevronDown size={14} className={`user-menu-chevron ${isOpen ? 'user-menu-chevron-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <p className="user-menu-name">{user.name}</p>
            <p className="user-menu-email">{user.email}</p>
          </div>
          <Link
            to="/account"
            className="user-menu-settings"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} />
            Account Settings
          </Link>
          <button
            className="user-menu-logout"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
