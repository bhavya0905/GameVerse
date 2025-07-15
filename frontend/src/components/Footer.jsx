import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSection = (i) => setOpenSection(openSection === i ? null : i);

  const sections = [
    {
      title: 'About',
      links: [
        { label: 'Our Story', to: '/about/our-story' },
        { label: 'Team', to: '/about/team' },
        { label: 'Careers', to: '/about/careers' },
      ],
    },
    {
      title: 'Games',
      links: [
        { label: 'All Games', to: '/explore' },
        { label: 'New Releases', to: '/explore?sort=new' },
        { label: 'Top Rated', to: '/explore?sort=top' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/support/help' },
        { label: 'Report a Bug', to: '/support/report-bug' },
        { label: 'Contact Us', to: '/support/contact' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Forums', to: '/community/forums' },
        { label: 'Discord', to: 'https://discord.com/invite/devcommunity', external: true },
        { label: 'Events', to: '/community/events' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Use', to: '/legal/terms' },
        { label: 'Privacy Policy', to: '/legal/privacy' },
        { label: 'Cookies', to: '/legal/cookies' },
      ],
    },
  ];

  const S = {
    foot: {
      background: '#111',
      color: '#ccc',
      padding: '2rem',
      borderTop: '2px solid #dc2626',
      marginTop: '4rem',
      position: 'relative',
      zIndex: 10,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
      gap: '2rem',
    },
    h: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      marginBottom: '1rem',
      cursor: 'pointer',
    },
    link: {
      display: 'block',
      textDecoration: 'none',
      color: '#ccc',
      fontSize: '0.9rem',
      lineHeight: 1.8,
    },
    socials: {
      marginTop: '2rem',
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
    },
    iconLink: {
      width: '32px',
      height: '32px',
      display: 'inline-block',
      transition: 'transform 0.3s ease, filter 0.3s ease',
    },
    icon: {
      width: '100%',
      height: '100%',
      transition: 'fill 0.3s ease',
    },
    bar: {
      borderTop: '1px solid #333',
      paddingTop: '1rem',
      fontSize: '0.8rem',
      textAlign: 'center',
      color: '#999',
    },
  };

  return (
    <footer style={S.foot}>
      {/* LINKS GRID */}
      <div style={S.grid}>
        {sections.map((sec, i) => (
          <div key={i}>
            <div style={S.h} onClick={() => toggleSection(i)}>{sec.title}</div>
            {(!isMobile || openSection === i) &&
              sec.links.map((ln, j) =>
                ln.external ? (
                  <a key={j} href={ln.to} target="_blank" rel="noopener noreferrer" style={S.link}>{ln.label}</a>
                ) : (
                  <Link key={j} to={ln.to} style={S.link}>{ln.label}</Link>
                )
              )}
          </div>
        ))}
      </div>

      {/* SOCIAL ICONS */}
      <div style={S.socials}>
        {/* Facebook */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={S.iconLink}
           onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
           onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}>
          <svg style={{ ...S.icon, fill: '#1877F2' }} viewBox="0 0 320 512">
            <path d="M279.1 288l14.2-92.7h-88.9v-60.1c0-25.4 12.4-50.1 52.2-50.1H293V6.3S259.5 0 225.4 0c-73 0-121 44.3-121 124.7V195H22.9V288H104.4V512h100.2V288z"/>
          </svg>
        </a>

      {/* Instagram (official glyph) */}
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={S.iconLink}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ ...S.icon, fill: '#E1306C' }}>
            <path d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66ZM398.8,80A48,48,0,0,0,368,48c-22-4.5-72.5-5.2-144-5.2s-122,.7-144,5.2A48,48,0,0,0,49.2,80c-4.5,22-5.2,72.5-5.2,144s.7,122,5.2,144A48,48,0,0,0,80,432c22,4.5,72.5,5.2,144,5.2s122-.7,144-5.2A48,48,0,0,0,398.8,368c4.5-22,5.2-72.5,5.2-144S403.3,102,398.8,80ZM224,338.66A82.66,82.66,0,1,1,306.66,256,82.75,82.75,0,0,1,224,338.66Zm85.4-148.92a19.34,19.34,0,1,1,19.34-19.34A19.34,19.34,0,0,1,309.4,189.74Z"/>
        </svg>
      </a>

        {/* Twitter */}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={S.iconLink}
           onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
           onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}>
          <svg style={{ ...S.icon, fill: '#1DA1F2' }} viewBox="0 0 512 512">
            <path d="M459.4 151.7c.3 4.5 .3 9 .3 13.6 0 138.72-105.6 298.5-298.5 298.5-59.5 0-114.7-17.2-161.1-47.1 8.4 .9 16.8 1.3 25.7 1.3 49.1 0 94.2-16.8 130.3-45.2-46.1-1-84.8-31.3-98.1-73 6.4 .9 12.9 1.3 19.6 1.3 9.4 0 18.7-1.3 27.4-3.6-48.1-9.7-84.2-52.2-84.2-103v-1.3c13.9 7.8 30.1 12.6 47.2 13.3-28.3-18.9-46.9-51-46.9-87.7 0-19.3 5.1-37.3 14.2-52.9 51.7 63.5 129 105.2 216.1 109.7-1.8-7.8-2.7-15.9-2.7-24.2 0-58.2 47.3-105.5 105.5-105.5 30.4 0 57.8 12.9 77 33.7 24-4.5 46.1-13.6 66-25.5-7.8 24.3-24.3 44.7-46.1 57.6 21.4-2.4 41.8-8.1 60.6-16.2-14.3 21.3-32.1 40.1-52.6 55.1z"/>
          </svg>
        </a>

        {/* YouTube */}
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={S.iconLink}
           onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
           onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}>
          <svg style={{ ...S.icon, fill: '#FF0000' }} viewBox="0 0 576 512">
            <path d="M549.65 124.08a68.72 68.72 0 0 0-48.38-48.56C458.73 64 288 64 288 64s-170.73 0-213.27 11.52a68.72 68.72 0 0 0-48.38 48.56C16 166.55 16 256 16 256s0 89.45 10.35 131.92a68.72 68.72 0 0 0 48.38 48.56C117.27 448 288 448 288 448s170.73 0 213.27-11.52a68.72 68.72 0 0 0 48.38-48.56C560 345.45 560 256 560 256s0-89.45-10.35-131.92zM232 336V176l142 80z"/>
          </svg>
        </a>
      </div>

      {/* COPYRIGHT BAR */}
      <div style={S.bar}>
        🌐 English (India) | © {new Date().getFullYear()} GameVerse. All rights reserved.
      </div>
    </footer>
  );
}
