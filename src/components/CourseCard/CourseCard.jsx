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
      <div className={s.courseCategory}>{course.category}</div>
      <h3 className={s.courseTitle}>{course.title}</h3>
      <p className={s.courseDescription}>{course.description}</p>
      <div className={s.courseDetails}>
        <span className={s.duration}>⏱ {course.duration}</span>
        <span className={s.rating}>☆ {course.rating}</span>
        <span className={s.students}>👥 {course.students}</span>
      </div>
      <div className={s.coursePrice}>{course.price}/мес.</div>
      <button className={s.btnCourse} onClick={openModal}>Подробнее</button>
    </div>
    

      <Modal isOpen={isModalOpen} onClose={closeModal}>
      <p>Подробнее о курсе "{course.title}" можно узнать по номеру телефона</p>
      <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#c494ff', marginTop: '1rem' }}>
        +7(999)999-99-99
      </p>
      </Modal>
    </>
  );
};

export default CourseCard;