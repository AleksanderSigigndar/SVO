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

  // Автозаполнение данных из профиля
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
      <h3>Оставить отзыв</h3>
      
      {message && (
        <div className={`${styles.message} ${message.includes('Ошибка') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.anonymousOption}>
          <label>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            Оставить отзыв анонимно
          </label>
        </div>

        {!formData.isAnonymous && (
          <div className={styles.nameFields}>
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
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Курс (необязательно)</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="На каком курсе вы учились?"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Оценка *</label>
          <select 
            name="rating" 
            value={formData.rating} 
            onChange={handleChange}
            required
          >
            <option value="5">☆☆☆☆☆ (5)</option>
            <option value="4">☆☆☆☆ (4)</option>
            <option value="3">☆☆☆ (3)</option>
            <option value="2">☆☆ (2)</option>
            <option value="1">☆ (1)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Текст отзыва *</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Поделитесь вашими впечатлениями о курсе..."
            maxLength="1000"
          />
          <span className={styles.charCount}>{formData.text.length}/1000</span>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить на модерацию'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;