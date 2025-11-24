import React from 'react';
import s from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.backgroundElements}>
        <div className={s.geometricShape}></div>
        <div className={s.geometricShape}></div>
        <div className={s.floatingElement}></div>
      </div>
      <div className={s.container}>
        <div className={s.footerContent}>
          <div className={s.footerSection}>
            <div className={s.brandSection}>
              <h3 className={s.brandTitle}>Корочки.есть</h3>
              <p className={s.brandSubtitle}>Превосходство в образовании</p>
              <div className={s.brandLine}></div>
            </div>
          </div>
          <div className={s.footerSection}>
            <h4 className={s.sectionTitle}>Контакты</h4>
            <div className={s.contactInfo}>
              <div className={s.contactItem}>
                <span className={s.contactLabel}>Email:</span>
                <span className={s.contactValue}>sigma@sobaka.pussy</span>
              </div>
              <div className={s.contactItem}>
                <span className={s.contactLabel}>Телефон:</span>
                <span className={s.contactValue}>+7 (999) 999-99-99</span>
              </div>
            </div>
          </div>
          <div className={s.footerSection}>
            <h4 className={s.sectionTitle}>Навигация</h4>
            <nav className={s.footerNav}>
              <a href="#courses" className={s.navLink}>Все курсы</a>
              <a href="#features" className={s.navLink}>О платформе</a>
              <a href="#reviews" className={s.navLink}>Отзывы</a>
            </nav>
          </div>
        </div>
        <div className={s.footerBottom}>
          <div className={s.divider}></div>
          <p className={s.copyright}>
            &copy; 2025 Корочки.есть. Все права защищены Стёпой.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;