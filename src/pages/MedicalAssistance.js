import React from 'react';
import ServicePage from './ServicePage';
import medicalImage from '../images/medical-assistance.webp';

function MedicalAssistance() {
  return (
    <ServicePage
      i18nKey="medicalAssistance"
      pathKey="medical"
      contactSubject="medicina"
      image={medicalImage}
    />
  );
}

export default MedicalAssistance;
