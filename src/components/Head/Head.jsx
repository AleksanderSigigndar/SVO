import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSmoothScroll } from '../../hooks/useSmoothScroll.js';
import s from './Head.module.css'

const Head = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const scrollToElement = useSmoothScroll();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const scrollToFeatures = () => {
    scrollToElement('features', 100);
  };
  
  const goToReviews = () => {
    navigate('/reviews');
  };
  const scrollToCourses = () => {
    scrollToElement('courses', 100);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <header className={s.header}>
      <div className={s.headerBackground}></div>
      <div className={s.container}>
        <Link to="/" className={s.logoContainer}>
          <div className={s.logoWrapper}>
            <div className={s.logoIcon}>
              <div className={s.logoDot}></div>
              <div className={s.logoRing}></div>
            </div>
            <div className={s.logoText}>
              <h1 className={s.logoTitle}>Корочки.есть</h1>
              <span className={s.logoSubtitle}>Превосходство в образовании</span>
            </div>
          </div>
        </Link>
        
        <nav className={s.nav}>
          <div className={s.navMain}>
            {isHomePage && (
              <>
                <button className={s.navItem} onClick={scrollToCourses}>
                  <span className={s.navIcon}></span>
                  Курсы
                </button>
                <button className={s.navItem} onClick={scrollToFeatures}>
                  <span className={s.navIcon}></span>
                  Преимущества
                </button>
              </>
            )}
            <button className={s.navItem} onClick={goToReviews}>
              <span className={s.navIcon}></span>
              Отзывы
            </button>
          </div>
          
          <div className={s.navAuth}>
            {currentUser ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className={s.authItem}>
                    <span className={s.authIcon}>👑</span>
                    Админ
                  </Link>
                )}
                <Link to="/profile" className={s.authItem}>
                  <span className={s.authIcon}></span>
                  Кабинет
                </Link>
                <button className={s.logoutItem} onClick={handleLogout}>
                  <span className={s.authIcon}> </span>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={s.authSecondary}>
                  Войти
                </Link>
                <Link to="/register" className={s.authPrimary}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
        
        <div className={s.mobileMenu}>
          <div className={s.menuToggle}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Head