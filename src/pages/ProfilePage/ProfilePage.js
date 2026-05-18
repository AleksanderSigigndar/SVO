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
  const [phoneError, setPhoneError] = useState('');

  // Функция валидации номера телефона
  const validatePhone = (phone) => {
    if (!phone) return true; // Пустое поле не валидируем
    const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
  };

  // Функция форматирования телефона
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    
    let formatted = '+7';
    if (numbers.length > 1) formatted += ` (${numbers.substring(1, 4)}`;
    if (numbers.length >= 5) formatted += `) ${numbers.substring(4, 7)}`;
    if (numbers.length >= 8) formatted += `-${numbers.substring(7, 9)}`;
    if (numbers.length >= 10) formatted += `-${numbers.substring(9, 11)}`;
    
    return formatted;
  };

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
    }, (error) => {
      console.error('Error loading reviews:', error);
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      if (formatted && !validatePhone(formatted)) {
        setPhoneError('Неверный формат телефона');
      } else {
        setPhoneError('');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setPhoneError('');

    // Валидация телефона
    if (formData.phone && !validatePhone(formData.phone)) {
      setPhoneError('Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
      setLoading(false);
      return;
    }

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
            <div className={styles.accessDenied}>
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
        <div className={styles.backgroundElements}>
          <div className={styles.geometricShape}></div>
          <div className={styles.geometricShape}></div>
          <div className={styles.floatingElement}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.headerBadge}>
                <span>Личный кабинет</span>
              </div>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleLine}>Мой профиль</span>
              </h1>
            </div>
            
            {message && (
              <div className={`${styles.message} ${message.includes('Ошибка') ? styles.error : styles.success}`}>
                <span className={styles.messageIcon}>
                  {message.includes('Ошибка') ? '⚠' : '✓'}
                </span>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Email</label>
                  <input
                    type="email"
                    value={currentUser.email || ''}
                    disabled
                    className={styles.disabledInput}
                  />
                  <span className={styles.helpText}>Email нельзя изменить</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Имя *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Фамилия *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Отчество</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`${styles.formInput} ${phoneError ? styles.inputError : ''}`}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    maxLength="18"
                  />
                  {phoneError && <span className={styles.errorText}>{phoneError}</span>}
                  <span className={styles.helpText}>Формат: +7 (XXX) XXX-XX-XX</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Пол</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className={styles.formSelect}
                  >
                    <option value="">Не указан</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Дата рождения</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.loadingSpinner}></span>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <span>Сохранить изменения</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.reviewsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Мои отзывы</h2>
                <div className={styles.reviewsCount}>
                  {userReviews.length} отзывов
                </div>
              </div>
              
              {reviewsLoading ? (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Загрузка отзывов...</p>
                </div>
              ) : userReviews.length === 0 ? (
                <div className={styles.noReviews}>
                  <p>У вас пока нет отзывов</p>
                </div>
              ) : (
                <div className={styles.userReviews}>
                  {userReviews.map((review, index) => (
                    <div 
                      key={review.id} 
                      className={styles.userReviewItem}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ReviewCard review={review} />
                      <div className={`${styles.reviewStatus} ${review.isApproved ? styles.approved : styles.pending}`}>
                        {review.isApproved ? 'Опубликован' : 'На модерации'}
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