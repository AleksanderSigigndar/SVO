import React from 'react';
import s from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerContent}>
          <div className={s.footerSection}>
            <h3>Корочки.есть</h3>
            <p>Портал дополнительного профессионального образования</p>
          </div>
          <div className={s.footerSection}>
            <h4>Контакты</h4>
            <p>Email: sigma@sobaka.pussy</p>
            <p>Телефон: +7(999)999-99-99</p>
          </div>
          <div className={s.footerSection}>
            <h4>Быстрые ссылки</h4>
            <a href="#courses">Все курсы</a>
            <a href="#features">О платформе</a>
            <a href="#login">Вход</a>
          </div>
        </div>
        <div className={s.footerBottom}>
          <p>&copy; 2025  Корочки.есть. Все права защищены Стёпой.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;