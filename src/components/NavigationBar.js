import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NavigationBar.css';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../images/logo.webp';
import flagPT from '../images/flag-pt.webp';
import flagUK from '../images/flag-uk.webp';
import routes from '../i18n/routes';
import { languageFromPathname } from '../i18n/language';
import { localizePath } from '../i18n/useLocalizedPath';

function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = languageFromPathname(location.pathname);
  const r = routes[currentLang];

  const menuItems = [
    { id: 'home', label: t('nav.home'), path: r.home },
    {
      id: 'care',
      label: t('pillars.items.care.title'),
      dropdown: [
        { id: 'home-care', label: t('nav.homeCare'), path: r.homeCare },
        { id: 'nursing-rehabilitation', label: t('nav.nursingRehabilitation'), path: r.nursing },
        { id: 'medical-assistance', label: t('nav.medicalAssistance'), path: r.medical },
        { id: 'caregiver-support', label: t('nav.caregiverSupport'), path: r.caregiver },
        { id: 'postpartum-support', label: t('nav.postpartumSupport'), path: r.postpartum },
      ],
    },
    { id: 'longevity', label: t('pillars.items.longevity.title'), path: r.longevity },
    { id: 'academy', label: t('pillars.items.academy.title'), path: r.academy },
    {
      id: 'experiences',
      label: t('pillars.items.experiences.title'),
      dropdown: [
        { id: 'pillar-experiences', label: t('nav.overview'), path: r.experiences },
        { id: 'pousadas-portugal', label: t('nav.pousadasPortugal'), path: r.pousadas },
      ],
    },
    {
      id: 'brand',
      label: t('nav.brand'),
      dropdown: [
        { id: 'history', label: t('nav.history'), path: r.history },
        { id: 'value-proposal', label: t('nav.valueProposal'), path: r.valueProposal },
        { id: 'mission-objectives-values', label: t('nav.missionObjectivesValues'), path: r.mission },
        { id: 'testimonials', label: t('nav.testimonials'), path: r.testimonials },
      ],
    },
  ];

  const contactItem = {
    id: 'contact',
    label: t('nav.contact'),
    path: r.contacts,
    isButton: true
  };

  const languages = [
    { id: 'pt', label: t('nav.portuguese'), icon: flagPT, lang: 'pt' },
    { id: 'en', label: t('nav.english'), icon: flagUK, lang: 'en' },
  ];

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/' || path === '/en') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isItemActive = (item) => {
    if (item.path) return isActive(item.path);
    if (item.dropdown) return item.dropdown.some((sub) => isActive(sub.path));
    return false;
  };

  const handleDropdownToggle = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveDropdown(null);
  };

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setActiveDropdown(null);
    };
    const onPointer = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest('.nav-item')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const menu = mobileMenuRef.current;
    const getFocusables = () =>
      menu
        ? Array.from(
            menu.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
          ).filter((el) => !el.disabled && el.offsetParent !== null)
        : [];

    const previouslyFocused = document.activeElement;
    getFocusables()[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const items = getFocusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [mobileMenuOpen]);

  const handleLanguageChange = (lang) => {
    const target = lang?.startsWith('en') ? 'en' : 'pt';
    if (target !== currentLang) {
      i18n.changeLanguage(target);
      navigate(`${localizePath(location.pathname, target)}${location.search}${location.hash}`);
      window.scrollTo(0, 0);
    }
    closeAllMenus();
  };

  const renderLanguageSwitcher = (variant = 'desktop') => (
    <div
      className={variant === 'mobile' ? 'mobile-lang-switcher' : 'lang-switcher'}
      role="group"
      aria-label={t('nav.language')}
    >
      {languages.map((lang) => (
        <button
          key={lang.id}
          type="button"
          className={`${variant === 'mobile' ? 'mobile-lang-btn' : 'lang-btn'}${currentLang === lang.lang ? ' active' : ''}`}
          onClick={() => handleLanguageChange(lang.lang)}
          aria-label={lang.label}
          aria-pressed={currentLang === lang.lang}
        >
          <img src={lang.icon} alt="" width="18" height="12" className="lang-flag" />
          <span className="lang-code">{lang.lang.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to={r.home} onClick={closeAllMenus} className="logo-link">
            <img src={logo} alt="" width="48" height="48" className="logo-image" />
            <div className="logo-text">
              <span className="logo-main">Kindness & Care</span>
            </div>
          </Link>
        </div>

        <div className="menu-container">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`nav-item ${isItemActive(item) ? 'active' : ''} ${item.dropdown ? 'has-dropdown' : ''}`}
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <div className="nav-link-container">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className="nav-link"
                        aria-haspopup="true"
                        aria-expanded={activeDropdown === item.id}
                        aria-controls={`dropdown-${item.id}`}
                      >
                        <span className="nav-label">{item.label}</span>
                        <span className="dropdown-arrow"><FaChevronDown /></span>
                      </button>
                      {activeDropdown === item.id && (
                        <div className="dropdown-menu" id={`dropdown-${item.id}`}>
                          {item.dropdown.map((subItem) => (
                            <Link key={subItem.id} to={subItem.path} onClick={closeAllMenus} className="dropdown-item" aria-current={isActive(subItem.path) ? 'page' : undefined}>
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={item.path} onClick={closeAllMenus} className="nav-link" aria-current={isActive(item.path) ? 'page' : undefined}>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
            <li className="nav-item nav-item-lang">
              {renderLanguageSwitcher('desktop')}
            </li>
            <li className={`nav-item ${isItemActive(contactItem) ? 'active' : ''}`}>
              <div className="nav-link-container">
                <Link to={contactItem.path} onClick={closeAllMenus} className="nav-link nav-button">
                  {contactItem.label}
                </Link>
              </div>
            </li>
          </ul>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeAllMenus}>
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.mainMenu')}
            className="mobile-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-logo">
              <img src={logo} alt="" width="48" height="48" className="mobile-logo-image" />
              <span className="mobile-logo-text">Kindness & Care</span>
            </div>

            {menuItems.map((item) => (
              <div key={item.id} className="mobile-menu-item">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`mobile-nav-link ${isItemActive(item) ? 'active' : ''}`}
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === item.id}
                      aria-controls={`mobile-dropdown-${item.id}`}
                    >
                      {item.label}
                      <span className={`mobile-dropdown-arrow ${activeDropdown === item.id ? 'active' : ''}`}>
                        <FaChevronDown />
                      </span>
                    </button>
                    {activeDropdown === item.id && (
                      <div className="mobile-dropdown" id={`mobile-dropdown-${item.id}`}>
                        {item.dropdown.map((subItem) => (
                          <Link key={subItem.id} to={subItem.path} onClick={closeAllMenus} className="mobile-dropdown-item">
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path} onClick={closeAllMenus} className={`mobile-nav-link ${isItemActive(item) ? 'active' : ''}`}>{item.label}</Link>
                )}
              </div>
            ))}

            <div className="mobile-menu-item mobile-menu-item-lang">
              {renderLanguageSwitcher('mobile')}
            </div>

            <div className="mobile-menu-item">
              <Link to={contactItem.path} onClick={closeAllMenus} className="mobile-nav-link mobile-button">{contactItem.label}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
