import React from 'react';
import s from './Features.module.css';

const Features = () => {
  const features = [
    {
      title: "Официальные документы",
      description: "Получите диплом или удостоверение установленного образца"
    },
    {
      title: "Онлайн-формат", 
      description: "Занимайтесь из любой точки мира в удобное время"
    },
    {
      title: "Опытные преподаватели", 
      description: "Обучение ведут практикующие специалисты"
    },
    {
      title: "Гибкая система оплаты",
      description: "Рассрочка и различные способы оплаты"
    },
    {
      title: "Актуальные программы",
      description: "Обучение по современным и востребованным методикам"
    },
    {
      title: "Поддержка выпускников",
      description: "Помощь в трудоустройстве и карьерном развитии"
    }
  ];

  return (
    <section id="features" className={s.features}>
      <div className={s.backgroundElements}>
        <div className={s.geometricShape}></div>
        <div className={s.geometricShape}></div>
        <div className={s.floatingOrb}></div>
      </div>
      <div className={s.container}>
        <div className={s.sectionHeader}>
          <div className={s.sectionBadge}>
            <span>Наши преимущества</span>
          </div>
          <h2 className={s.sectionTitle}>
            <span className={s.titleLine}>Почему выбирают</span>
            <span className={s.titleLine}>именно нас</span>
          </h2>
          <p className={s.sectionSubtitle}>
            Мы создали идеальные условия для вашего профессионального роста 
            и карьерного развития
          </p>
        </div>
        <div className={s.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={s.featureCard} style={{animationDelay: `${index * 0.1}s`}}>
              <div className={s.cardBackground}></div>
              <div className={s.featureContent}>
                <div className={s.featureNumber}>0{index + 1}</div>
                <h3 className={s.featureTitle}>{feature.title}</h3>
                <p className={s.featureDescription}>{feature.description}</p>
              </div>
              <div className={s.cardHoverEffect}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;