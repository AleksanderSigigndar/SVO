import React from 'react';
import Head from '../../components/Head/Head';
import Hero from '../../components/Hero/Hero';
import CourseCatalog from '../../components/CourseCatalog/CourseCatalog';
import Features from '../../components/Features/Features';
import Footer from '../../components/Footer/Footer';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import s from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={s.homePage}>
      <Head />
      <Hero />
      <CourseCatalog />
      <Features />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;