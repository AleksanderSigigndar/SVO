import React from 'react';
import s from './Features.module.css';

const Features = () => {
  const features = [
    {
      icon: "",
      title: "Официальные документы",
      description: "Получите диплом или удостоверение установленного образца"
    },
    {
      icon: "",
      title: "Онлайн-формат",
      description: "Занимайтесь из любой точки мира в удобное время"
    },
    {
      icon: "",
      title: "Опытные преподаватели",
      description: "Обучение ведут практикующие специалисты"
    },
    {
      icon: " ",
      title: "Гибкая система оплаты",
      description: "Рассрочка и различные способы оплаты"
    }
  ];

  return (
    <section id="features" className={s.features}>
      <div className={s.container}>
        <h2>Почему выбирают нас?</h2>
        <div className={s.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={s.featureCard}>
              <div className={s.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;