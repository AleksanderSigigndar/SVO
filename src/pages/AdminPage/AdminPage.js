import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [currentUser, isAdmin, navigate]);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
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

  const approveReview = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        isApproved: true,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Ошибка подтверждения отзыва:', error);
    }
  };

  const rejectReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
    }
  };

  const pendingReviews = reviews.filter(review => !review.isApproved);
  const approvedReviews = reviews.filter(review => review.isApproved);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.adminPage}>
      <Head />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.adminContainer}>
            <h1>Панель администратора</h1>
            <p>Управление отзывами пользователей</p>

            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                На модерации ({pendingReviews.length})
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'approved' ? styles.active : ''}`}
                onClick={() => setActiveTab('approved')}
              >
                Опубликованные ({approvedReviews.length})
              </button>
            </div>

            {loading ? (
              <div className={styles.loading}>Загрузка отзывов...</div>
            ) : (
              <div className={styles.reviewsList}>
                {(activeTab === 'pending' ? pendingReviews : approvedReviews).map(review => (
                  <div key={review.id} className={styles.adminReviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <strong>
                          {review.isAnonymous ? 'Аноним' : `${review.lastName} ${review.firstName}`}
                        </strong>
                        <span className={styles.userEmail}>({review.userEmail})</span>
                        {review.course && (
                          <span className={styles.course}>Курс: {review.course}</span>
                        )}
                      </div>
                      <div className={styles.reviewMeta}>
                        <span className={styles.rating}>☆ {review.rating}/5</span>
                        <span className={styles.date}>
                          {review.createdAt?.toDate().toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.reviewText}>
                      {review.text}
                    </div>

                    {activeTab === 'pending' && (
                      <div className={styles.adminActions}>
                        <button 
                          className={styles.approveBtn}
                          onClick={() => approveReview(review.id)}
                        >
                          Одобрить
                        </button>
                        <button 
                          className={styles.rejectBtn}
                          onClick={() => rejectReview(review.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    )}

                    {activeTab === 'approved' && (
                      <div className={styles.adminActions}>
                        <button 
                          className={styles.rejectBtn}
                          onClick={() => rejectReview(review.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pending' && pendingReviews.length === 0 && !loading && (
              <div className={styles.noReviews}>
                <p>Нет отзывов для модерации</p>
              </div>
            )}

            {activeTab === 'approved' && approvedReviews.length === 0 && !loading && (
              <div className={styles.noReviews}>
                <p>Нет опубликованных отзывов</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;