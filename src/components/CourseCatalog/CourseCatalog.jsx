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
  const [selectedCourse, setSelectedCourse] = useState(null);

  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <section id="courses" className={s.courseCatalog}>
        <div className={s.backgroundElements}>
          <div className={s.geometricShape}></div>
          <div className={s.geometricShape}></div>
          <div className={s.floatingElement}></div>
        </div>
        <div className={s.container}>
          <div className={s.sectionHeader}>
            <div className={s.sectionBadge}>
              <span>Топ направления</span>
            </div>
            <h2 className={s.sectionTitle}>
              <span className={s.titleLine}>Премиум</span>
              <span className={s.titleLine}>курсы</span>
            </h2>
            <p className={s.sectionSubtitle}>
              Освойте востребованные профессии под руководством экспертов индустрии
            </p>
          </div>
          
          <div className={s.coursesGrid}>
            {popularCourses.map((course, index) => (
              <div key={course.id} className={s.courseCard} style={{animationDelay: `${index * 0.1}s`}}>
                <div className={s.cardHeader}>
                  <div className={s.courseCategory}>{course.category}</div>
                  <div className={s.ratingBadge}>
                    <span className={s.ratingValue}>{course.rating}</span>
                  </div>
                </div>
                <h3 className={s.courseTitle}>{course.title}</h3>
                <div className={s.courseMeta}>
                  <div className={s.metaItem}>
                    <span className={s.metaIcon}>⏱</span>
                    <span className={s.metaText}>{course.duration}</span>
                  </div>
                </div>
                <div className={s.cardFooter}>
                  <div className={s.priceSection}>
                    <span className={s.priceLabel}>от</span>
                    <span className={s.priceValue}>{course.price}</span>
                    <span className={s.pricePeriod}>/месяц</span>
                  </div>
                  <button 
                    className={s.enrollButton}
                    onClick={() => openModal(course)}
                  >
                    <span className={s.buttonText}>Подробнее</span>
                  </button>
                </div>
                <div className={s.cardHoverEffect}></div>
              </div>
            ))}
          </div>
          
          <div className={s.actionsSection}>
            <button className={s.viewAllButton} onClick={goToAllCourses}>
              <span className={s.buttonLabel}>Исследовать все курсы</span>
            </button>
          </div>
        </div>
      </section>
      
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={s.modalContent}>
          <h3 className={s.modalTitle}>
            {selectedCourse?.title || 'Курс'}
          </h3>
          <p className={s.modalText}>
            Подробную информацию о курсе можно получить у нашего менеджера
          </p>
          <div className={s.contactInfo}>
            <div className={s.phoneNumber}>
              +7 (999) 999-99-99
            </div>
            <div className={s.contactNote}>
              Звонок бесплатный • Консультация 24/7
            </div>
          </div>
          <button className={s.modalButton} onClick={closeModal}>
            Понятно
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CourseCatalog;