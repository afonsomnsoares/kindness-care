import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

function NotFound() {
  const { t } = useTranslation();

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <title>{`${t('notFound.heading')} | Kindness & Care`}</title>
      <meta name="robots" content="noindex" />
      <h1 style={{ fontSize: '6rem', color: '#094352', margin: 0 }}>404</h1>
      <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
        {t('notFound.heading')}
      </h2>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem', maxWidth: '500px' }}>
        {t('notFound.message')}
      </p>
      <Link
        to={useLocalizedPath('home')}
        style={{
          background: '#094352',
          color: 'white',
          padding: '12px 35px',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        {t('notFound.button')}
      </Link>
    </div>
  );
}

export default NotFound;