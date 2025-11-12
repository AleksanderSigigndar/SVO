import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const ProfilePage = () => {
  const { currentUser, userData, updateUserProfile } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const navigate = useNavigate();
  const [reviewsLoading, setReviewsLoading] = useState(true);

   useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setUserReviews(reviewsData);
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    gender: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        middleName: userData.middleName || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        birthDate: userData.birthDate || ''
      }));
    }
  }, [currentUser, userData, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateUserProfile(currentUser.uid, formData);
      setMessage('Данные успешно сохранены');
    } catch (error) {
      setMessage('Ошибка сохранения: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.profilePage}>
      <Head />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileContainer}>
            <h1>Личный кабинет</h1>
            
            {message && (
              <div className={`${styles.message} ${message.includes('Ошибка') ? styles.error : styles.success}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={currentUser.email || ''}
                    disabled
                    className={styles.disabledInput}
                  />
                  <span className={styles.helpText}>Email нельзя изменить</span>
                </div>

                <div className={styles.formGroup}>
                  <label>Имя *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Фамилия *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Отчество</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Пол</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                  >
                    <option value="">Не указан</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Дата рождения</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </form>
             <div className={styles.reviewsSection}>
              <h2>Мои отзывы</h2>
              
              {reviewsLoading ? (
                <div className={styles.loading}>Загрузка отзывов...</div>
              ) : userReviews.length === 0 ? (
                <div className={styles.noReviews}>
                  <p>У вас пока нет отзывов</p>
                  <a href="/reviews" className={styles.linkToReviews}>
                    Оставить отзыв
                  </a>
                </div>
              ) : (
                <div className={styles.userReviews}>
                  {userReviews.map(review => (
                    <div key={review.id} className={styles.userReviewItem}>
                      <ReviewCard review={review} />
                      <div className={styles.reviewStatus}>
                        Статус: {review.isApproved ? '✅ Опубликован' : '⏳ На модерации'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
};

export default ProfilePage;