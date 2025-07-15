import { useLocation } from 'react-router-dom';

export default function InfoPage() {
  const { pathname } = useLocation();
  const title = pathname
    .split('/')
    .filter(Boolean)
    .slice(-1)[0]
    .replace(/[-]/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

  return (
    <div style={{ padding:'3rem 1.5rem', maxWidth:800, margin:'0 auto', lineHeight:1.7 }}>
      <h2 style={{ marginBottom:'1rem', color:'#dc2626' }}>{title}</h2>
      <p>
        This is a placeholder page for <code>{pathname}</code>. Replace this text with real content whenever
        you’re ready. You can put headings, images, FAQs, or any component you like.
      </p>
    </div>
  );
}
