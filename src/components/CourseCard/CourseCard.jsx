import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import s from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  
  const navigate = useNavigate();
  
  const goToApplicate = () => {
    navigate('/applicate');
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
            <button className={s.enrollButton} onClick={goToApplicate}>
              <span className={s.buttonText}>Подать заявку</span>
            </button>
          </div>
        </div>
        <div className={s.cardHoverEffect}></div>
      </div>
    </>
  );
};

export default CourseCard;