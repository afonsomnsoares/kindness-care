import React from 'react';
import ServicePage from './ServicePage';
import homeCareImage from '../images/home-care.webp';

function HomeCare() {
  return (
    <ServicePage
      i18nKey="homeCare"
      pathKey="homeCare"
      contactSubject="apoio-domiciliario"
      image={homeCareImage}
    />
  );
}

export default HomeCare;
