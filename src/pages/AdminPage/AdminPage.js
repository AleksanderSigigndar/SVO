import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  where 
} from 'firebase/firestore';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Состояние для отзывов
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Состояние для заявок
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviewsSubTab, setReviewsSubTab] = useState('pending');
  const [applicationsSubTab, setApplicationsSubTab] = useState('pending');

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

  // Загрузка отзывов
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
      setReviewsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Загрузка заявок
  useEffect(() => {
    const q = query(
      collection(db, 'applications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appsData = [];
      querySnapshot.forEach((doc) => {
        appsData.push({ id: doc.id, ...doc.data() });
      });
      setApplications(appsData);
      setApplicationsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Обработчики для отзывов
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

  // Обработчики для заявок
  const approveApplication = async (appId) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'approved',
        updatedAt: new Date(),
        approvedAt: new Date()
      });
    } catch (error) {
      console.error('Ошибка подтверждения заявки:', error);
    }
  };

  const rejectApplication = async (appId) => {
    const reason = prompt('Укажите причину отказа:');
    if (!reason) return;

    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'rejected',
        updatedAt: new Date(),
        rejectionReason: reason
      });
    } catch (error) {
      console.error('Ошибка отклонения заявки:', error);
    }
  };

  // Фильтрация отзывов
  const pendingReviews = reviews.filter(review => !review.isApproved);
  const approvedReviews = reviews.filter(review => review.isApproved);

  // Фильтрация заявок
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  // Функция для получения статуса заявки
  const getApplicationStatus = (status) => {
    switch (status) {
      case 'pending': return { text: 'На рассмотрении', className: styles.statusPending };
      case 'approved': return { text: 'Принято', className: styles.statusApproved };
      case 'rejected': return { text: 'Отказано', className: styles.statusRejected };
      default: return { text: status, className: '' };
    }
  };

  // Функция для получения способа оплаты
  const getPaymentMethod = (method) => {
    return method === 'card' ? 'Картой' : 'Наличные';
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.adminPage}>
      <Head />
      <main className={styles.main}>
        <div className={styles.backgroundElements}>
          <div className={styles.geometricShape}></div>
          <div className={styles.geometricShape}></div>
          <div className={styles.floatingElement}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.adminContainer}>
            <div className={styles.adminHeader}>
              <div className={styles.headerBadge}>
                <span>Административная панель</span>
              </div>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleLine}>Управление системой</span>
              </h1>
              <p className={styles.pageSubtitle}>
                Модерация отзывов и управление заявками на курсы
              </p>
            </div>

            {/* Основные табы */}
            <div className={styles.mainTabs}>
              <button 
                className={`${styles.mainTab} ${activeTab === 'reviews' ? styles.active : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <span className={styles.tabText}>Отзывы</span>
                <span className={styles.tabCount}>{reviews.length}</span>
              </button>
              <button 
                className={`${styles.mainTab} ${activeTab === 'applications' ? styles.active : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <span className={styles.tabText}>Заявки</span>
                <span className={styles.tabCount}>{applications.length}</span>
              </button>
            </div>

            {/* Секция отзывов */}
            {activeTab === 'reviews' && (
              <>
                <div className={styles.subTabs}>
                  <button 
                    className={`${styles.subTab} ${reviewsSubTab === 'pending' ? styles.active : ''}`}
                    onClick={() => setReviewsSubTab('pending')}
                  >
                    <span className={styles.tabText}>На модерации</span>
                    <span className={styles.tabCount}>{pendingReviews.length}</span>
                  </button>
                  <button 
                    className={`${styles.subTab} ${reviewsSubTab === 'approved' ? styles.active : ''}`}
                    onClick={() => setReviewsSubTab('approved')}
                  >
                    <span className={styles.tabText}>Опубликованные</span>
                    <span className={styles.tabCount}>{approvedReviews.length}</span>
                  </button>
                </div>

                {reviewsLoading ? (
                  <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Загрузка отзывов...</p>
                  </div>
                ) : (
                  <div className={styles.reviewsList}>
                    {(reviewsSubTab === 'pending' ? pendingReviews : approvedReviews).map((review, index) => (
                      <div 
                        key={review.id} 
                        className={styles.adminReviewCard}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={styles.cardBackground}></div>
                        <div className={styles.cardContent}>
                          <div className={styles.reviewHeader}>
                            <div className={styles.reviewerInfo}>
                              <div className={styles.nameSection}>
                                <strong className={styles.reviewerName}>
                                  {review.isAnonymous ? 'Аноним' : `${review.lastName} ${review.firstName}`}
                                </strong>
                                <span className={styles.userEmail}>{review.userEmail}</span>
                              </div>
                              {review.course && (
                                <span className={styles.course}>Курс: {review.course}</span>
                              )}
                            </div>
                            <div className={styles.reviewMeta}>
                              <span className={styles.rating}>★ {review.rating}/5</span>
                              <span className={styles.date}>
                                {review.createdAt?.toDate().toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                          
                          <div className={styles.reviewText}>
                            {review.text}
                          </div>

                          <div className={styles.adminActions}>
                            {reviewsSubTab === 'pending' && (
                              <>
                                <button 
                                  className={styles.approveBtn}
                                  onClick={() => approveReview(review.id)}
                                >
                                  <span>Одобрить</span>
                                </button>
                                <button 
                                  className={styles.rejectBtn}
                                  onClick={() => rejectReview(review.id)}
                                >
                                  <span>Удалить</span>
                                </button>
                              </>
                            )}

                            {reviewsSubTab === 'approved' && (
                              <button 
                                className={styles.rejectBtn}
                                onClick={() => rejectReview(review.id)}
                              >
                                <span>Удалить</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={styles.cardHoverEffect}></div>
                      </div>
                    ))}
                  </div>
                )}

                {reviewsSubTab === 'pending' && pendingReviews.length === 0 && !reviewsLoading && (
                  <div className={styles.noContent}>
                    <p>Нет отзывов для модерации</p>
                  </div>
                )}

                {reviewsSubTab === 'approved' && approvedReviews.length === 0 && !reviewsLoading && (
                  <div className={styles.noContent}>
                    <p>Нет опубликованных отзывов</p>
                  </div>
                )}
              </>
            )}

            {/* Секция заявок */}
            {activeTab === 'applications' && (
              <>
                <div className={styles.subTabs}>
                  <button 
                    className={`${styles.subTab} ${applicationsSubTab === 'pending' ? styles.active : ''}`}
                    onClick={() => setApplicationsSubTab('pending')}
                  >
                    <span className={styles.tabText}>На рассмотрении</span>
                    <span className={styles.tabCount}>{pendingApplications.length}</span>
                  </button>
                  <button 
                    className={`${styles.subTab} ${applicationsSubTab === 'approved' ? styles.active : ''}`}
                    onClick={() => setApplicationsSubTab('approved')}
                  >
                    <span className={styles.tabText}>Одобренные</span>
                    <span className={styles.tabCount}>{approvedApplications.length}</span>
                  </button>
                  <button 
                    className={`${styles.subTab} ${applicationsSubTab === 'rejected' ? styles.active : ''}`}
                    onClick={() => setApplicationsSubTab('rejected')}
                  >
                    <span className={styles.tabText}>Отклонённые</span>
                    <span className={styles.tabCount}>{rejectedApplications.length}</span>
                  </button>
                </div>

                {applicationsLoading ? (
                  <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Загрузка заявок...</p>
                  </div>
                ) : (
                  <div className={styles.applicationsList}>
                    {(applicationsSubTab === 'pending' ? pendingApplications : 
                      applicationsSubTab === 'approved' ? approvedApplications : rejectedApplications)
                      .map((app, index) => {
                      const status = getApplicationStatus(app.status);
                      
                      return (
                        <div 
                          key={app.id} 
                          className={styles.adminApplicationCard}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className={styles.cardBackground}></div>
                          <div className={styles.cardContent}>
                            <div className={styles.applicationHeader}>
                              <div className={styles.applicantInfo}>
                                <div className={styles.nameSection}>
                                  <strong className={styles.applicantName}>
                                    {app.firstName} {app.lastName}
                                  </strong>
                                  <span className={styles.userEmail}>{app.userEmail}</span>
                                </div>
                                <div className={styles.applicationMeta}>
                                  <span className={styles.course}>Курс: {app.course}</span>
                                  <span className={styles.phone}>{app.phone}</span>
                                </div>
                              </div>
                              <div className={styles.applicationStatus}>
                                <span className={`${styles.statusBadge} ${status.className}`}>
                                  {status.text}
                                </span>
                                <span className={styles.date}>
                                  {app.createdAt?.toDate().toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                            </div>
                            
                            <div className={styles.applicationDetails}>
                              <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Способ оплаты:</span>
                                <span className={styles.detailValue}>
                                  {getPaymentMethod(app.paymentMethod)}
                                </span>
                              </div>
                              
                              {app.paymentMethod === 'card' && (
                                <div className={styles.paymentInfo}>
                                  <span className={styles.detailLabel}>Реквизиты для клиента:</span>
                                  <div className={styles.paymentDetails}>
                                    <p>+79999999999 (Сбербанк)</p>
                                    <p>sigma@sobaka.pussy (отправить чек)</p>
                                  </div>
                                </div>
                              )}
                              
                              {app.paymentMethod === 'cash' && app.status === 'approved' && (
                                <div className={styles.cashInfo}>
                                  <span className={styles.detailLabel}>Информация для клиента:</span>
                                  <p className={styles.cashNote}>
                                    Мы свяжемся с вами по указанному номеру по поводу оплаты.
                                  </p>
                                </div>
                              )}
                              
                              {app.status === 'rejected' && app.rejectionReason && (
                                <div className={styles.rejectionInfo}>
                                  <span className={styles.detailLabel}>Причина отказа:</span>
                                  <p className={styles.rejectionReason}>{app.rejectionReason}</p>
                                </div>
                              )}
                              
                              {app.approvedAt && app.status === 'approved' && (
                                <div className={styles.approvalInfo}>
                                  <span className={styles.detailLabel}>Одобрено:</span>
                                  <span className={styles.detailValue}>
                                    {app.approvedAt?.toDate().toLocaleDateString('ru-RU')}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className={styles.adminActions}>
                              {applicationsSubTab === 'pending' && (
                                <>
                                  <button 
                                    className={styles.approveBtn}
                                    onClick={() => approveApplication(app.id)}
                                  >
                                    <span>Одобрить</span>
                                  </button>
                                  <button 
                                    className={styles.rejectBtn}
                                    onClick={() => rejectApplication(app.id)}
                                  >
                                    <span>Отклонить</span>
                                  </button>
                                </>
                              )}

                              {applicationsSubTab === 'approved' && (
                                <button 
                                  className={styles.rejectBtn}
                                  onClick={() => rejectApplication(app.id)}
                                >
                                  <span>Отклонить</span>
                                </button>
                              )}

                              {applicationsSubTab === 'rejected' && (
                                <button 
                                  className={styles.approveBtn}
                                  onClick={() => approveApplication(app.id)}
                                >
                                  <span>Одобрить</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className={styles.cardHoverEffect}></div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {applicationsSubTab === 'pending' && pendingApplications.length === 0 && !applicationsLoading && (
                  <div className={styles.noContent}>
                    <p>Нет заявок для рассмотрения</p>
                  </div>
                )}

                {applicationsSubTab === 'approved' && approvedApplications.length === 0 && !applicationsLoading && (
                  <div className={styles.noContent}>
                    <p>Нет одобренных заявок</p>
                  </div>
                )}

                {applicationsSubTab === 'rejected' && rejectedApplications.length === 0 && !applicationsLoading && (
                  <div className={styles.noContent}>
                    <p>Нет отклонённых заявок</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;