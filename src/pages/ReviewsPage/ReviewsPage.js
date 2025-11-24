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
      where('isApproved', '==', true),
      orderBy('createdAt', 'desc')
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
        <div className={styles.backgroundElements}>
          <div className={styles.geometricShape}></div>
          <div className={styles.geometricShape}></div>
          <div className={styles.floatingElement}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <div className={styles.headerBadge}>
              <span>Мнения студентов</span>
            </div>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleLine}>Отзывы</span>
              <span className={styles.titleLine}>наших студентов</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Узнайте о реальном опыте обучения от выпускников наших курсов
            </p>
          </div>

          {!currentUser ? (
            <div className={styles.authMessage}>
              <p>Авторизуйтесь, чтобы поделиться своим опытом обучения</p>
            </div>
          ) : (
            <div className={styles.reviewActions}>
              <button 
                className={styles.addReviewBtn}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? (
                  <>
                    <span>Отменить</span>
                  </>
                ) : (
                  <>
                    <span>Оставить отзыв</span>
                  </>
                )}
              </button>
            </div>
          )}

          {showForm && currentUser && (
            <ReviewForm onClose={() => setShowForm(false)} />
          )}

          <div className={styles.reviewsList}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Загрузка отзывов...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className={styles.noReviews}>
                <p>Пока нет отзывов. Будьте первым!</p>
              </div>
            ) : (
              reviews.map((review, index) => (
                <ReviewCard 
                  key={review.id} 
                  review={review}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
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