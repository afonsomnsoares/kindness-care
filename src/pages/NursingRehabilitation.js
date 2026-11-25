import React from 'react';
import ServicePage from './ServicePage';
import nursingImage from '../images/nursing-rehabilitation.webp';

function NursingRehabilitation() {
  return (
    <ServicePage
      i18nKey="nursingRehabilitation"
      pathKey="nursing"
      contactSubject="enfermagem"
      image={nursingImage}
    />
  );
}

export default NursingRehabilitation;
