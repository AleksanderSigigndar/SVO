import React from 'react';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  const displayName = review.isAnonymous 
    ? 'Анонимный пользователь'
    : `${review.lastName} ${review.firstName} ${review.middleName}`.trim();

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewerInfo}>
          <span className={styles.reviewerName}>{displayName}</span>
          {review.course && (
            <span className={styles.course}>Курс: {review.course}</span>
          )}
        </div>
        <div className={styles.reviewMeta}>
          <span className={styles.rating}>{renderStars(review.rating)}</span>
          <span className={styles.date}>{formatDate(review.createdAt)}</span>
        </div>
      </div>
      <div className={styles.reviewText}>
        {review.text}
      </div>
    </div>
  );
};

export default ReviewCard;