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
      <div className={s.container}>
        <div className={s.heroContent}>
          <h1>Дополнительное профессиональное образование</h1>
          <p>
            Получите востребованную профессию или повысьте квалификацию 
            на онлайн-курсах от ведущих преподавателей
          </p>
          <div className={s.heroButtons}>
            <button className={s.btnPrimary} onClick={goToAllCourses}>Выбрать курс</button>
            <button className={s.btnSecondary}>Подать заявку</button>
          </div>
          <div className={s.heroStats}>
            <div className={s.stat}>
              <span className={s.statNumber}>50+</span>
              <span className={s.statText}>Курсов</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNumber}>8000+</span>
              <span className={s.statText}>Выпускников</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNumber}>98%</span>
              <span className={s.statText}>Довольных студентов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;