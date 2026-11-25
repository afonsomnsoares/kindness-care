import React from 'react';
import ServicePage from './ServicePage';
import postpartumImage from '../images/postpartum-support.webp';

function PostpartumSupport() {
  return (
    <ServicePage
      i18nKey="postpartumSupport"
      pathKey="postpartum"
      contactSubject="pos-parto"
      image={postpartumImage}
    />
  );
}

export default PostpartumSupport;
