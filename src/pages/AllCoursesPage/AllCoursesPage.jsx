import React, { useState, useEffect } from 'react';
import Head from '../../components/Head/Head';
import Footer from '../../components/Footer/Footer';
import CourseCard from '../../components/CourseCard/CourseCard';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import { allCourses } from '../../data/coursesData';
import s from './AllCoursesPage.module.css';

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreCourses = async () => {
    setLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setVisibleCourses(prev => Math.min(prev + 6, courses.length));
    } catch (error) {
      console.error('Ошибка загрузки дополнительных курсов:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCourses(allCourses);
      } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const displayedCourses = courses.slice(0, visibleCourses);
  const hasMoreCourses = visibleCourses < courses.length;

  return (
    <div className={s.allCoursesPage}>
      <Head/>
      
      <main className={s.main}>
        <div className={s.container}>
          <div className={s.pageHeader}>
            <h1>Все курсы</h1>
            <p>Выберите подходящий курс из {courses.length} программ обучения</p>
          </div>

          {loading ? (
            <div className={s.loading}>
              <p>Загрузка курсов...</p>
            </div>
          ) : (
            <>
              <div className={s.coursesGrid}>
                {displayedCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {hasMoreCourses && (
                <div className={s.loadMoreSection}>
                  <button 
                    className={s.loadMoreBtn} 
                    onClick={loadMoreCourses}
                    disabled={loadingMore}
                  >
                    {loadingMore 
                      ? 'Загрузка...' 
                      : `Показать ещё`
                    }
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default AllCoursesPage;