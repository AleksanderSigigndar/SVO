import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import styles from './ReviewsPage.module.css';

const ReviewsPage = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('isApproved', '==', true)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div className={styles.reviewsPage}>
      <Head/>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1>Отзывы наших студентов</h1>
            <p>Узнайте, что говорят о наших курсах</p>
          </div>

          {!currentUser ? (
            <div className={styles.authMessage}>
              <p>Сначала авторизируйтесь, чтобы оставить отзыв</p>
            </div>
          ) : (
            <div className={styles.reviewActions}>
              <button 
                className={styles.addReviewBtn}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Отменить' : 'Оставить отзыв'}
              </button>
            </div>
          )}

          {showForm && currentUser && (
            <ReviewForm onClose={() => setShowForm(false)} />
          )}

          <div className={styles.reviewsList}>
            {loading ? (
              <div className={styles.loading}>Загрузка отзывов...</div>
            ) : reviews.length === 0 ? (
              <div className={styles.noReviews}>
                <p>Пока нет отзывов. Будьте первым!</p>
              </div>
            ) : (
              reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewsPage;