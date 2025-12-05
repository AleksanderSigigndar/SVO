import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import styles from './ApplicationPage.module.css';

const ApplicationPage = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userApplications, setUserApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  
  // Список доступных курсов
  const availableCourses = [
    'Основы программирования',
    'Веб-разработка',
    'Data Science',
    'Мобильная разработка',
    'Дизайн интерфейсов',
    'Digital Marketing'
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    course: '',
    paymentMethod: 'cash'
  });

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
        phone: userData.phone || ''
      }));
    }
  }, [currentUser, userData, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'applications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const applicationsData = [];
      querySnapshot.forEach((doc) => {
        applicationsData.push({ id: doc.id, ...doc.data() });
      });
      setUserApplications(applicationsData);
      setApplicationsLoading(false);
    }, (error) => {
      console.error('Error loading applications:', error);
      setApplicationsLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.course) {
      setMessage('Пожалуйста, заполните все обязательные поля');
      setLoading(false);
      return;
    }

    if (!formData.phone.match(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/)) {
      setMessage('Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'applications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        course: formData.course,
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setMessage('Заявка успешно отправлена на рассмотрение!');
      setFormData(prev => ({
        ...prev,
        course: '',
        paymentMethod: 'cash'
      }));
    } catch (error) {
      console.error('Error submitting application:', error);
      setMessage('Ошибка при отправке заявки: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'На рассмотрении';
      case 'approved': return 'Принято';
      case 'rejected': return 'Отказано';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return styles.pending;
      case 'approved': return styles.approved;
      case 'rejected': return styles.rejected;
      default: return '';
    }
  };

  if (!currentUser) {
    return (
      <div className={styles.applicationPage}>
        <Head />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.accessDenied}>
              <h1>Доступ запрещен</h1>
              <p>Пожалуйста, войдите в систему чтобы подать заявку.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.applicationPage}>
      <Head />
      <main className={styles.main}>
        <div className={styles.backgroundElements}>
          <div className={styles.geometricShape}></div>
          <div className={styles.geometricShape}></div>
          <div className={styles.floatingElement}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.applicationContainer}>
            <div className={styles.applicationHeader}>
              <div className={styles.headerBadge}>
                <span>Подача заявки</span>
              </div>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleLine}>Заявка на курс</span>
              </h1>
              <p className={styles.pageSubtitle}>
                Заполните форму ниже для подачи заявки на выбранный курс
              </p>
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
                  <span className={styles.helpText}>Будет использован для связи</span>
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
                    placeholder="Введите ваше имя"
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
                    placeholder="Введите вашу фамилию"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    className={styles.formInput}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    maxLength="18"
                  />
                  <span className={styles.helpText}>Формат: +7 (XXX) XXX-XX-XX</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Курс</label>
                  <input
                    type="text" 
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="Напишите название курса"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Способ оплаты *</label>
                  <div className={styles.paymentMethods}>
                    <label className={styles.paymentOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioCustom}></span>
                      <span className={styles.paymentText}>Наличные</span>
                    </label>
                    <label className={styles.paymentOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioCustom}></span>
                      <span className={styles.paymentText}>Картой</span>
                    </label>
                  </div>
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
                    <span>Отправка...</span>
                  </>
                ) : (
                  <>
                    <span>Отправить заявку</span>
                  </>
                )}
              </button>
            </form>

            <div className={styles.applicationsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Мои заявки</h2>
                <div className={styles.applicationsCount}>
                  {userApplications.length} заявок
                </div>
              </div>
              
              {applicationsLoading ? (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Загрузка заявок...</p>
                </div>
              ) : userApplications.length === 0 ? (
                <div className={styles.noApplications}>
                  <p>У вас пока нет заявок</p>
                </div>
              ) : (
                <div className={styles.userApplications}>
                  {userApplications.map((application, index) => (
                    <div 
                      key={application.id} 
                      className={styles.userApplicationItem}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={styles.cardBackground}></div>
                      <div className={styles.cardContent}>
                        <div className={styles.applicationHeader}>
                          <div className={styles.applicationInfo}>
                            <div className={styles.nameSection}>
                              <strong className={styles.applicantName}>
                                {application.firstName} {application.lastName}
                              </strong>
                              <span className={styles.userEmail}>{application.userEmail}</span>
                            </div>
                            <div className={styles.applicationMeta}>
                              <span className={styles.course}>Курс: {application.course}</span>
                              <span className={styles.phone}>{application.phone}</span>
                            </div>
                          </div>
                          <div className={styles.applicationStatus}>
                            <span className={`${styles.statusBadge} ${getStatusClass(application.status)}`}>
                              {getStatusText(application.status)}
                            </span>
                            <span className={styles.date}>
                              {application.createdAt?.toDate().toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        
                        <div className={styles.applicationDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Способ оплаты:</span>
                            <span className={styles.detailValue}>
                              {application.paymentMethod === 'card' ? 'Картой' : 'Наличные'}
                            </span>
                          </div>
                          
                          {application.status === 'approved' && (
                            <div className={styles.approvalInfo}>
                              {application.paymentMethod === 'card' ? (
                                <>
                                  <div className={styles.paymentDetails}>
                                    <h4>Реквизиты для оплаты:</h4>
                                    <p className={styles.paymentInfo}>
                                      <strong>Номер карты:</strong> +79999999999 (Сбербанк)
                                    </p>
                                    <p className={styles.paymentInfo}>
                                      <strong>Email для чека:</strong> sigma@sobaka.pussy
                                    </p>
                                    <p className={styles.paymentNote}>
                                      Отправьте чек об оплате на указанную почту
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className={styles.cashPaymentInfo}>
                                  <h4>Информация об оплате:</h4>
                                  <p className={styles.cashNote}>
                                    Мы свяжемся с вами по указанному вами номеру в заявке по поводу оплаты.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {application.status === 'rejected' && application.rejectionReason && (
                            <div className={styles.rejectionInfo}>
                              <h4>Причина отказа:</h4>
                              <p className={styles.rejectionReason}>{application.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.cardHoverEffect}></div>
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

export default ApplicationPage;