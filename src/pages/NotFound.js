import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './NotFound.css';

function NotFound() {
  const { t } = useTranslation();
  const homePath = useLocalizedPath('home');

  return (
    <div className="not-found-page">
      <MetaTags
        title={t('notFound.seoTitle')}
        description={t('notFound.seoDescription')}
        url="/404"
        noindex
      />
      <div className="page-shell-narrow not-found-inner">
        <p className="not-found-code">404</p>
        <h1>{t('notFound.heading')}</h1>
        <p>{t('notFound.message')}</p>
        <Link className="btn-primary" to={homePath}>
          {t('notFound.button')}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
