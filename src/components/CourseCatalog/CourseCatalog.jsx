import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { useNavigate } from 'react-router-dom';
import s from './CourseCatalog.module.css';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const popularCourses = [
    {
      id: 1,
      title: "Веб-разработка",
      duration: "6 месяцев",
      price: "25 000 ₽",
      category: "IT",
      rating: 4.8
    },
    {
      id: 2,
      title: "Дизайн интерфейсов",
      duration: "4 месяца",
      price: "20 000 ₽",
      category: "Дизайн",
      rating: 4.9
    },
    {
      id: 3,
      title: "Digital-маркетинг",
      duration: "3 месяца",
      price: "18 000 ₽",
      category: "Маркетинг",
      rating: 4.7
    },
    {
      id: 4,
      title: "Анализ данных",
      duration: "5 месяцев",
      price: "30 000 ₽",
      category: "Аналитика",
      rating: 4.8
    },
    {
      id: 5,
      title: "Python для начинающих",
      duration: "12 месяца",
      price: "22 000 ₽",
      category: "IT",
      rating: 4.8
    },
    {
      id: 6,
      title: "JavaScript продвинутый",
      duration: "6 месяцев",
      price: "28 000 ₽",
      category: "Аналитика",
      rating: 4.9
    }
  ];
  
  const goToAllCourses = () => {
    navigate('/courses');
  };
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

  return (
    <>
    <section id="courses" className={s.courseCatalog}>
      <div className={s.container}>
        <h2>Популярные курсы</h2>
        <div className={s.coursesGrid}>
          {popularCourses.map(course => (
            <div key={course.id} className={s.courseCard}>
              <div className={s.courseCategory}>{course.category}</div>
              <h3>{course.title}</h3>
              <div className={s.courseDetails}>
                <span className={s.duration}>⏱ {course.duration}</span>
                <span className={s.rating}>☆ {course.rating}</span>
              </div>
              <div className={s.coursePrice}>{course.price}/мес.</div>
              <button className={s.btnCourse} onClick={openModal}>Подробнее</button>
            </div>
          ))}
        </div>
        <div className={s.catalogActions}>
          <button className={s.btnViewAll} onClick={goToAllCourses}>Смотреть все курсы</button>
        </div>
      </div>
    </section>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
      <p>Подробнее можно узнать по номеру телефона</p>
      <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#c494ff', marginTop: '1rem' }}>
        +7(999)999-99-99
      </p>
      </Modal>
    </>
  );
};

export default CourseCatalog;