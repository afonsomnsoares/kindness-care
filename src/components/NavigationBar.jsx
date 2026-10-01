import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import './NavigationBar.css';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../images/logo.webp';
import flagPT from '../images/flag-1.webp';
import flagUK from '../images/flag-2.webp';
import routes from '../i18n/routes';
import { localizePath } from '../i18n/useLocalizedPath';

function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'pt';
  const r = routes[currentLang];

  const menuItems = [
    { id: 'home', label: t('nav.home'), path: r.home },
    { id: 'history', label: t('nav.history'), path: r.history },
    {
      id: 'kindness-care',
      label: t('nav.kindnessCare'),
      dropdown: [
        { id: 'value-proposal', label: t('nav.valueProposal'), path: r.valueProposal },
        { id: 'mission-objectives-values', label: t('nav.missionObjectivesValues'), path: r.mission },
      ]
    },
    {
      id: 'services',
      label: t('nav.services'),
      dropdown: [
        { id: 'home-care', label: t('nav.homeCare'), path: r.homeCare },
        { id: 'nursing-rehabilitation', label: t('nav.nursingRehabilitation'), path: r.nursing },
        { id: 'medical-assistance', label: t('nav.medicalAssistance'), path: r.medical },
        { id: 'caregiver-support', label: t('nav.caregiverSupport'), path: r.caregiver },
        { id: 'postpartum-support', label: t('nav.postpartumSupport'), path: r.postpartum },
        { id: 'health-tourism-services', label: t('nav.healthTourism'), path: r.healthTourism },
      ]
    },
    {
      id: 'language',
      label: t('nav.language'),
      dropdown: [
        { id: 'portuguese', label: t('nav.portuguese'), path: routes.pt.home, icon: flagPT, lang: 'pt' },
        { id: 'english', label: t('nav.english'), path: routes.en.home, icon: flagUK, lang: 'en' },
      ]
    },
    {
      id: 'contact',
      label: t('nav.contact'),
      path: r.contacts,
      isButton: true
    }
  ];

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/' || path === '/en') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
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

  // Menu de desktop: fecha o submenu aberto ao clicar fora ou com Escape.
  useEffect(() => {
    if (!activeDropdown || mobileMenuOpen) return undefined;

    const handlePointerDown = (e) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      const toggle = desktopMenuRef.current?.querySelector(
        `[aria-controls="dropdown-${activeDropdown}"]`
      );
      setActiveDropdown(null);
      toggle?.focus();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDropdown, mobileMenuOpen]);

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
      // O idioma vem do URL (ver src/root.jsx): basta navegar.
      navigate(localizePath(location.pathname, lang));
      window.scrollTo(0, 0);
    }
    closeAllMenus();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to={r.home} onClick={closeAllMenus} className="logo-link">
            <img src={logo} alt="Kindness & Care" className="logo-image" />
            <div className="logo-text">
              <span className="logo-main">Kindness & Care</span>
            </div>
          </Link>
        </div>

        <div className="menu-container" ref={desktopMenuRef}>
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.id} className={`nav-item ${isActive(item.path) ? 'active' : ''} ${item.dropdown ? 'has-dropdown' : ''}`}>
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
                            subItem.lang ? (
                              <button key={subItem.id} onClick={() => handleLanguageChange(subItem.lang)} className="dropdown-item-btn">
                                {subItem.icon && <img src={subItem.icon} alt="" className="dropdown-flag" />}
                                {subItem.label}
                              </button>
                            ) : (
                              <Link key={subItem.id} to={subItem.path} onClick={closeAllMenus} className="dropdown-item">
                                {subItem.icon && <img src={subItem.icon} alt="" className="dropdown-flag" />}
                                {subItem.label}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.isButton ? (
                    <Link to={item.path} onClick={closeAllMenus} className="nav-link nav-button">
                      {item.label}
                    </Link>
                  ) : (
                    <Link to={item.path} onClick={closeAllMenus} className="nav-link">
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
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
              <img src={logo} alt="Kindness & Care" className="mobile-logo-image" />
              <span className="mobile-logo-text">Kindness & Care</span>
            </div>

            {menuItems.map((item) => (
              <div key={item.id} className="mobile-menu-item">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
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
                          subItem.lang ? (
                            <button key={subItem.id} onClick={() => handleLanguageChange(subItem.lang)} className="mobile-dropdown-item-btn">
                              {subItem.icon && <img src={subItem.icon} alt="" className="dropdown-flag" />}
                              {subItem.label}
                            </button>
                          ) : (
                            <Link key={subItem.id} to={subItem.path} onClick={closeAllMenus} className="mobile-dropdown-item">
                              {subItem.icon && <img src={subItem.icon} alt="" className="dropdown-flag" />}
                              {subItem.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : item.isButton ? (
                  <Link to={item.path} onClick={closeAllMenus} className="mobile-nav-link mobile-button">{item.label}</Link>
                ) : (
                  <Link to={item.path} onClick={closeAllMenus} className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}>{item.label}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;