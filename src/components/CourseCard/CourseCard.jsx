import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import s from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={s.courseCard}>
        <div className={s.cardBackground}></div>
        <div className={s.cardContent}>
          <div className={s.courseCategory}>{course.category}</div>
          <h3 className={s.courseTitle}>{course.title}</h3>
          <p className={s.courseDescription}>{course.description}</p>
          <div className={s.courseDetails}>
            <div className={s.detailItem}>
              <span className={s.detailLabel}>Длительность:</span>
              <span className={s.detailValue}>{course.duration}</span>
            </div>
            <div className={s.detailItem}>
              <span className={s.detailLabel}>Рейтинг:</span>
              <span className={s.detailValue}>{course.rating}</span>
            </div>
          </div>
          <div className={s.cardFooter}>
            <div className={s.priceSection}>
              <span className={s.priceValue}>{course.price}</span>
              <span className={s.pricePeriod}>/месяц</span>
            </div>
            <button className={s.enrollButton} onClick={openModal}>
              <span className={s.buttonText}>Подать заявку</span>
            </button>
          </div>
        </div>
        <div className={s.cardHoverEffect}></div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={s.modalContent}>
          <h3 className={s.modalTitle}>Курс "{course.title}"</h3>
          <p className={s.modalText}>
            Подробную информацию о курсе и подачу заявки можно оформить 
            по указанному номеру телефона
          </p>
          <div className={s.contactInfo}>
            <div className={s.phoneNumber}>+7 (999) 999-99-99</div>
            <div className={s.contactNote}>Консультация бесплатная</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CourseCard;