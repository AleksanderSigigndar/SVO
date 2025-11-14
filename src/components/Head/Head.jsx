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
      <div className={s.container}>
        <Link to="/" className={s.logoLink}>
          <div className={s.logo}>
            <h1>Корочки.есть</h1>
            <span className={s.port}>Портал дополнительного образования</span>
          </div>
        </Link>
        <nav className={s.nav}>
          {isHomePage && (
            <>
          <button to="/courses" className={s.navButton} onClick={scrollToCourses}>
            Курсы
          </button>
          <button className={s.navButton} onClick={scrollToFeatures}>
            Преимущества
          </button>
          </>
          )}
          <button to="/reviews" className={s.navButton} onClick={goToReviews}>
            Отзывы
          </button>
          
          {currentUser ? (
            <>
              {isAdmin && (
                <Link to="/admin" className={s.navLink}>
                  Админ Панель
                </Link>
              )}
              <Link to="/profile" className={s.navLink}>
                Личный кабинет
              </Link>
              <button className={s.logoutBtn} onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={s.loginBtn}>
                Войти
              </Link>
              <Link to="/register" className={s.registerBtn}>
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Head
