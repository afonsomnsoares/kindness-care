import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import './Testimonials.css';

function Testimonials() {
  const { t } = useTranslation();
  const testimonialsPath = useLocalizedPath('testimonials');
  const items = t('testimonials.items', { returnObjects: true });
  const list = Array.isArray(items) ? items : [];

  const reviewSchema = list.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Kindness & Care',
        url: 'https://www.kindnesscare.pt',
        review: list.map((item) => ({
          '@type': 'Review',
          reviewBody: item.text,
          author: {
            '@type': 'Person',
            name: item.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Kindness & Care',
          },
        })),
      }
    : null;

  return (
    <div className="testimonials-page">
      <MetaTags
        title={t('testimonials.seoTitle')}
        description={t('testimonials.seoDescription')}
        url={testimonialsPath}
        schema={reviewSchema}
      />

      <PageHero
        title={t('testimonials.hero.title')}
        subtitle={t('testimonials.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell-narrow">
          {list.length > 0 && (
            <div className="testimonials-list">
              {list.map((item) => (
                <article key={item.quote} className="testimonial-entry">
                  <p className="testimonial-eyebrow">{item.eyebrow}</p>
                  <h2 className="page-block-title">{item.title}</h2>
                  <blockquote className="testimonial-quote">
                    <p>“{item.quote}”</p>
                  </blockquote>
                  <p className="testimonial-text">{item.text}</p>
                  <footer className="testimonial-meta">
                    <p className="testimonial-author">{item.author}</p>
                    <p className="testimonial-date">{item.date}</p>
                    <a
                      className="text-link"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('testimonials.body.readOnInstagram')}
                    </a>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Testimonials;
