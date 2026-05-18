import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Функция валидации номера телефона
  const validatePhone = (phone) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Пароли не совпадают');
    }

    if (formData.password.length < 6) {
      return setError('Пароль должен содержать минимум 6 символов');
    }

    // Валидация телефона
    if (formData.phone && !validatePhone(formData.phone)) {
      return setError('Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
    }

    try {
      setLoading(true);
      await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      navigate('/profile');
    } catch (error) {
      setError('Ошибка регистрации: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <Head />
      <main className={styles.main}>
        <div className={styles.backgroundElements}>
          <div className={styles.geometricShape}></div>
          <div className={styles.geometricShape}></div>
          <div className={styles.floatingElement}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <div className={styles.headerBadge}>
                <span>Создание аккаунта</span>
              </div>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleLine}>Регистрация</span>
              </h1>
            </div>
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="your@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Пароль</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="••••••••"
                  />
                  <span className={styles.helpText}>Минимум 6 символов</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Подтвердите пароль</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="••••••••"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Имя</label>
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
                  <label className={styles.inputLabel}>Фамилия</label>
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
                  <label className={styles.inputLabel}>Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    maxLength="18"
                  />
                  <span className={styles.helpText}>Формат: +7 (XXX) XXX-XX-XX</span>
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
                    <span>Регистрация...</span>
                  </>
                ) : (
                  <>
                    <span>Создать аккаунт</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.loginLink}>
              <span>Уже есть аккаунт?</span>
              <Link to="/login" className={styles.loginButton}>
                <span>Войти в аккаунт</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;