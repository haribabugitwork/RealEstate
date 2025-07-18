import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { 
  Building, 
  Home, 
  Users, 
  CreditCard, 
  Bell, 
  Search, 
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Settings,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: '',
    initials: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await axios.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = response.data;
      setUser({
        username: userData.username || userData.name || 'User',
        email: userData.email || 'user@example.com',
        role: userData.role || 'User',
        initials: getInitials(userData.username || userData.name || 'User')
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If token is invalid, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initials from username
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage and redirect regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    }
  };

  const navigationItems = [
    {
      to: "propertyloader",
      icon: Building,
      label: "Property Loader",
      description: "Add new properties",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      to: "viewproperties",
      icon: Home,
      label: "View Properties", 
      description: "Manage portfolio",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      to: "tenantdetails",
      icon: Users,
      label: "View Tenant Details",
      description: "Tenant management",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
   /*  {
      to: "tenantPaymentDetails", 
      icon: CreditCard,
      label: "View Tenant Payments",
      description: "Payment tracking",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    } */
  ];

  const isActiveRoute = (path) => {
    return location.pathname.includes(path);
  };

  const getActiveItem = () => {
    return navigationItems.find(item => isActiveRoute(item.to)) || navigationItems[0];
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Modern Header */}
      <nav className="navbar navbar-expand-lg shadow-lg border-0" style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 1030
      }}>
        <div className="container-fluid px-4">
          {/* Brand */}
          <div className="navbar-brand d-flex align-items-center">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center me-3"
                style={{ 
                  width: '50px', 
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <Building size={24} className="text-white" />
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-dark">RealEstates</h4>
                <small className="text-muted">Property Management</small>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <div className="d-flex gap-2">
              {navigationItems.map((item, index) => {
                const isActive = isActiveRoute(item.to);
                return (
                  <Link
                    key={index}
                    to={item.to}
                    className={`btn d-flex align-items-center gap-2 px-4 py-2 border-0 transition-all text-decoration-none ${
                      isActive 
                        ? 'text-white shadow-lg' 
                        : 'text-dark bg-transparent'
                    }`}
                    style={{
                      background: isActive ? item.gradient : 'transparent',
                      borderRadius: '15px',
                      transform: isActive ? 'translateY(-2px)' : 'none',
                      boxShadow: isActive ? '0 8px 25px rgba(0,0,0,0.15)' : 'none'
                    }}
                  >
                    <div 
                      className={`rounded-2 d-flex align-items-center justify-content-center ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-light'
                      }`}
                      style={{ width: '32px', height: '32px' }}
                    >
                      <item.icon size={16} className={isActive ? 'text-white' : 'text-primary'} />
                    </div>
                    <div className="text-start">
                      <div className="fw-semibold small">{item.label}</div>
                      <div className={`${isActive ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-grow-1 mx-4 d-none d-md-block d-lg-none" style={{ maxWidth: '300px' }}>
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
              <input 
                type="text" 
                className="form-control border-0 bg-light ps-5" 
                placeholder="Search..."
                style={{ borderRadius: '15px' }}
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Welcome Message - Desktop only */}
            <div className="d-none d-xl-block">
              <small className="text-muted">Welcome back,</small>
              <div className="fw-semibold text-dark">{user.username}</div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="btn btn-link text-dark p-2 d-lg-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Notifications */}
            <button className="btn btn-link text-dark position-relative p-2 d-none d-md-block">
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="dropdown" style={{ position: 'relative' }}>
              <button 
                className="btn btn-link text-dark d-flex align-items-center gap-2 text-decoration-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '14px'
                  }}
                  title={user.username}
                >
                  {user.initials}
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold small" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.username}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {user.role}
                  </div>
                </div>
                <ChevronDown size={16} />
              </button>
              
              {showUserMenu && (
                <div 
                  className="dropdown-menu dropdown-menu-end show border-0 shadow-lg" 
                  style={{ 
                    borderRadius: '15px', 
                    marginTop: '10px',
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    zIndex: 9999,
                    minWidth: '280px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                        style={{ 
                          width: '45px', 
                          height: '45px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '16px'
                        }}
                      >
                        {user.initials}
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <div className="fw-semibold text-truncate">{user.username}</div>
                        <small className="text-muted text-truncate d-block">{user.email}</small>
                        <span className="badge bg-primary bg-opacity-10 text-primary small mt-1">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="dropdown-item d-flex align-items-center gap-3 py-2 px-3"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="text-muted" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link 
                      to="/preferences" 
                      className="dropdown-item d-flex align-items-center gap-3 py-2 px-3"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} className="text-muted" />
                      <span>Preferences</span>
                    </Link>
                    <Link 
                      to="/activity" 
                      className="dropdown-item d-flex align-items-center gap-3 py-2 px-3"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Activity size={16} className="text-muted" />
                      <span>Activity Log</span>
                    </Link>
                  </div>
                  
                  <div className="dropdown-divider my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item d-flex align-items-center gap-3 py-2 px-3 text-danger"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="d-lg-none">
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowMobileMenu(false)}
          />
          <div 
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
            style={{ width: '300px', zIndex: 1050, transform: showMobileMenu ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="p-4">
              {/* Mobile User Info */}
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                  style={{ 
                    width: '50px', 
                    height: '50px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '18px'
                  }}
                >
                  {user.initials}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{user.username}</div>
                  <small className="text-muted d-block text-truncate">{user.email}</small>
                  <span className="badge bg-primary bg-opacity-10 text-primary small">
                    {user.role}
                  </span>
                </div>
                <button className="btn btn-link p-0" onClick={() => setShowMobileMenu(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="d-flex flex-column gap-2">
                {navigationItems.map((item, index) => {
                  const isActive = isActiveRoute(item.to);
                  return (
                    <Link
                      key={index}
                      to={item.to}
                      onClick={() => setShowMobileMenu(false)}
                      className={`btn text-start d-flex align-items-center gap-3 p-3 border-0 text-decoration-none ${
                        isActive 
                          ? 'text-white' 
                          : 'text-dark bg-light'
                      }`}
                      style={{
                        background: isActive ? item.gradient : '#f8f9fa',
                        borderRadius: '12px'
                      }}
                    >
                      <div 
                        className={`rounded-2 d-flex align-items-center justify-content-center ${
                          isActive ? 'bg-white bg-opacity-20' : 'bg-white'
                        }`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        <item.icon size={20} className={isActive ? 'text-white' : 'text-primary'} />
                      </div>
                      <div>
                        <div className="fw-semibold">{item.label}</div>
                        <small className={isActive ? 'text-white-50' : 'text-muted'}>
                          {item.description}
                        </small>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Logout Button */}
              <div className="mt-4 pt-3 border-top">
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Navigation Pills (Alternative Design) */}
      <div className="container-fluid px-4 py-3 d-none d-xl-block">
        <div className="d-flex justify-content-center">
          <div 
            className="d-flex gap-2 p-2 rounded-pill shadow-lg"
            style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {navigationItems.map((item, index) => {
              const isActive = isActiveRoute(item.to);
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`btn rounded-pill d-flex align-items-center gap-2 px-3 py-2 border-0 transition-all text-decoration-none ${
                    isActive 
                      ? 'text-white shadow' 
                      : 'text-dark'
                  }`}
                  style={{
                    background: isActive ? item.gradient : 'transparent',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <item.icon size={18} />
                  <span className="fw-semibold">{item.label.replace('View ', '')}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        <div className="container-fluid px-4 pb-4">
          <div 
            className="bg-white rounded-4 shadow-lg p-4 h-100"
            style={{ 
              minHeight: 'calc(100vh - 200px)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-muted text-decoration-none">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {getActiveItem().label}
                  </li>
                </ol>
              </nav>
              
              {/* User Welcome - Mobile */}
              <div className="d-block d-xl-none">
                <small className="text-muted">Hello, {user.username.split(' ')[0]}!</small>
              </div>
            </div>

            {/* Your Components Will Render Here */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
