import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { currentUser, userData, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
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

  // Отладочная информация
  useEffect(() => {
    console.log('ProfilePage - currentUser:', currentUser);
    console.log('ProfilePage - userData:', userData);
  }, [currentUser, userData]);

  useEffect(() => {
    if (!currentUser) {
      console.log('No currentUser, redirecting to login');
      navigate('/login');
      return;
    }

    if (userData) {
      console.log('Setting form data from userData:', userData);
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

  // Загружаем отзывы пользователя
  useEffect(() => {
    if (!currentUser) return;

    console.log('Loading reviews for user:', currentUser.uid);
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
      console.log('Loaded reviews:', reviewsData);
      setUserReviews(reviewsData);
      setReviewsLoading(false);
    }, (error) => {
      console.error('Error loading reviews:', error);
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

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
      console.error('Error updating profile:', error);
      setMessage('Ошибка сохранения: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className={styles.profilePage}>
        <Head />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.profileContainer}>
              <h1>Доступ запрещен</h1>
              <p>Пожалуйста, войдите в систему чтобы получить доступ к личному кабинету.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
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

            {/* Секция с отзывами пользователя */}
            <div className={styles.reviewsSection}>
              <h2>Мои отзывы</h2>
              
              {reviewsLoading ? (
                <div className={styles.loading}>Загрузка отзывов...</div>
              ) : userReviews.length === 0 ? (
                <div className={styles.noReviews}>
                  <p>У вас пока нет отзывов</p>
                </div>
              ) : (
                <div className={styles.userReviews}>
                  {userReviews.map(review => (
                    <div key={review.id} className={styles.userReviewItem}>
                      <ReviewCard review={review} />
                      <div className={styles.reviewStatus}>
                        Статус: {review.isApproved ? 'Опубликован' : 'На модерации'}
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

export default ProfilePage;