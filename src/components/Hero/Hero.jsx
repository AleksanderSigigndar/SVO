import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Hero.module.css';

const Hero = () => {
  const navigate = useNavigate();
  const goToAllCourses = () => {
    navigate('/courses');
  };
  return (
    <section className={s.hero}>
      <div className={s.geometricBackground}>
        <div className={s.geometricShape1}></div>
        <div className={s.geometricShape2}></div>
        <div className={s.geometricShape3}></div>
        <div className={s.floatingOrbs}>
          <div className={s.orb}></div>
          <div className={s.orb}></div>
          <div className={s.orb}></div>
        </div>
      </div>
      <div className={s.container}>
        <div className={s.heroContent}>
          <div className={s.badge}>
            <span>Премиум образование</span>
          </div>
          <h1>
            <span className={s.titleLine1}>Профессиональный</span>
            <span className={s.titleLine2}>рост начинается</span>
            <span className={s.titleLine3}>здесь</span>
          </h1>
          <p className={s.subtitle}>
            Трансформируйте свою карьеру с помощью экспертных знаний 
            и практических навыков от лидеров индустрии
          </p>
          <div className={s.heroButtons}>
            <button className={s.ctaButton} onClick={goToAllCourses}>
              <span className={s.buttonText}>Начать обучение</span>
              <span className={s.buttonIcon}>→</span>
            </button>
          </div>
          <div className={s.statsGrid}>
            <div className={s.statCard}>
              <div className={s.statContent}>
                <span className={s.statNumber}>50+</span>
                <span className={s.statLabel}>Премиум курсов</span>
              </div>
            </div>
            <div className={s.statCard}>
              <div className={s.statContent}>
                <span className={s.statNumber}>8000+</span>
                <span className={s.statLabel}>Успешных выпускников</span>
              </div>
            </div>
            <div className={s.statCard}>
              <div className={s.statContent}>
                <span className={s.statNumber}>98%</span>
                <span className={s.statLabel}>Положительных отзывов</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;