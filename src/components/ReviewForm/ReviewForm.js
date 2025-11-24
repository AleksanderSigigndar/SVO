import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ onClose }) => {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    isAnonymous: false,
    rating: 5,
    text: '',
    course: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userData && !formData.isAnonymous) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        middleName: userData.middleName || ''
      }));
    }
  }, [userData, formData.isAnonymous]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.text.trim()) {
      setMessage('Пожалуйста, напишите отзыв');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        firstName: formData.isAnonymous ? 'Аноним' : formData.firstName,
        lastName: formData.isAnonymous ? '' : formData.lastName,
        middleName: formData.isAnonymous ? '' : formData.middleName,
        isAnonymous: formData.isAnonymous,
        rating: parseInt(formData.rating),
        text: formData.text.trim(),
        course: formData.course.trim(),
        isApproved: false, 
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setMessage('Отзыв отправлен на модерацию!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage('Ошибка отправки отзыва: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.reviewForm}>
      <div className={styles.formHeader}>
        <div className={styles.headerBadge}>
          <span>Новый отзыв</span>
        </div>
        <h3 className={styles.formTitle}>Поделитесь впечатлениями</h3>
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
        <div className={styles.anonymousOption}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxCustom}></span>
            Оставить отзыв анонимно
          </label>
        </div>

        {!formData.isAnonymous && (
          <div className={styles.nameFields}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Имя *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={styles.formInput}
                placeholder="Ваше имя"
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
                placeholder="Ваша фамилия"
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
                placeholder="Ваше отчество"
              />
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Курс (необязательно)</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={styles.formInput}
            placeholder="На каком курсе вы учились?"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Оценка *</label>
          <select 
            name="rating" 
            value={formData.rating} 
            onChange={handleChange}
            required
            className={styles.formSelect}
          >
            <option value="5">★★★★★ (5) Отлично</option>
            <option value="4">★★★★ (4) Хорошо</option>
            <option value="3">★★★ (3) Удовлетворительно</option>
            <option value="2">★★ (2) Плохо</option>
            <option value="1">★ (1) Очень плохо</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Текст отзыва *</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows="5"
            className={styles.formTextarea}
            placeholder="Поделитесь вашими впечатлениями о курсе..."
            maxLength="1000"
          />
          <span className={styles.charCount}>
            {formData.text.length}/1000 символов
          </span>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                <span>Отправка...</span>
              </>
            ) : (
              <>
                <span>Отправить на модерацию</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;