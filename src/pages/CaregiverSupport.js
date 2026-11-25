import React from 'react';
import ServicePage from './ServicePage';
import caregiverImage from '../images/caregiver-support.webp';

function CaregiverSupport() {
  return (
    <ServicePage
      i18nKey="caregiverSupport"
      pathKey="caregiver"
      contactSubject="cuidador"
      image={caregiverImage}
    />
  );
}

export default CaregiverSupport;
