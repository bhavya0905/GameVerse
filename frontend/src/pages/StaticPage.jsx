import { useLocation } from 'react-router-dom';

export default function StaticPage() {
  const { pathname } = useLocation();

  const renderContent = () => {
    switch (pathname) {
      case '/about/our-story':
        return {
          title: 'Our Story',
          content: (
            <>
              <p>
                GameVerse was born from a passion for bringing immersive, innovative, and inclusive gaming experiences to everyone. 
                What started as a small project between friends in a dorm room has now grown into a platform filled with diverse games, 
                creative ideas, and a thriving community.
              </p>
              <p>
                We believe gaming is for everyone—whether you're here for a quick challenge, a competitive battle, or a casual puzzle,
                GameVerse is your arena. Our journey is just beginning, and you're a part of it.
              </p>
            </>
          ),
        };

      case '/about/team':
        return {
          title: 'Our Team',
          content: (
            <>
              <p>
                Behind GameVerse is a passionate team of designers, developers, artists, and dreamers from around the world. 
                We come together to build engaging games and features for players of all kinds.
              </p>
              <p>
                Our core values are creativity, collaboration, and community. We thrive on pushing boundaries and growing together.
              </p>
            </>
          ),
        };

      case '/about/careers':
        return {
          title: 'Careers',
          content: (
            <>
              <p>
                Join our team! GameVerse is always looking for creative, dedicated individuals who want to change the way people play.
              </p>
              <p>
                We offer roles in game development, design, marketing, support, and more. Work remotely or on-site with a global team 
                that values innovation and inclusivity.
              </p>
            </>
          ),
        };

      case '/support/help':
        return {
          title: 'Help Center',
          content: (
            <>
              <p>
                Welcome to the GameVerse Help Center. Browse through our FAQs, guides, and tutorials to get help with your account, 
                games, and platform features.
              </p>
              <p>
                Need more help? <a href="/support/contact" style={{ color: '#dc2626' }}>Contact Us</a> and we’ll be happy to assist you.
              </p>
            </>
          ),
        };

      case '/support/report-bug':
        return {
          title: 'Report a Bug',
          content: (
            <>
              <p>
                Found something that’s not working right? We appreciate your help in making GameVerse better!
              </p>
              <p>
                Please email us at <strong>bugs@gameverse.com</strong> or use the in-game report button. Include as much detail as 
                possible (screenshot, steps to reproduce, etc.).
              </p>
            </>
          ),
        };

      case '/support/contact':
        return {
          title: 'Contact Us',
          content: (
            <>
              <p>
                Have questions, suggestions, or feedback? We'd love to hear from you.
              </p>
              <p>
                Reach out to us at <strong>support@gameverse.com</strong> and our team will respond within 24-48 hours.
              </p>
            </>
          ),
        };

      case '/community/forums':
        return {
          title: 'Community Forums',
          content: (
            <>
              <p>
                Connect with other players in the GameVerse community forums! Discuss games, share tips, post memes, and be part of 
                exciting conversations.
              </p>
              <p>
                Visit <strong>forum.gameverse.com</strong> to join now!
              </p>
            </>
          ),
        };

      case '/community/events':
        return {
          title: 'Community Events',
          content: (
            <>
              <p>
                Don’t miss out on our monthly tournaments, seasonal challenges, and community livestreams. GameVerse events are all 
                about fun, competition, and celebration!
              </p>
              <p>
                Check back here for updates or follow us on <strong>Twitter</strong> and <strong>Discord</strong> for live announcements.
              </p>
            </>
          ),
        };

      case '/legal/terms':
        return {
          title: 'Terms of Use',
          content: (
            <>
              <p>
                By accessing and using GameVerse, you agree to comply with our terms. This includes respecting community guidelines,
                fair play, and not misusing the platform.
              </p>
              <p>
                For full legal details, please contact <strong>legal@gameverse.com</strong>.
              </p>
            </>
          ),
        };

      case '/legal/privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <>
              <p>
                Your privacy matters. GameVerse collects minimal data necessary to offer you the best experience. We never sell your 
                data and we store it securely.
              </p>
              <p>
                Read our full policy or contact <strong>privacy@gameverse.com</strong> for questions.
              </p>
            </>
          ),
        };

      case '/legal/cookies':
        return {
          title: 'Cookies Policy',
          content: (
            <>
              <p>
                We use cookies to enhance your GameVerse experience—like remembering preferences and improving performance. You can 
                manage cookies in your browser settings.
              </p>
            </>
          ),
        };

      default:
        return {
          title: 'Page Not Found',
          content: <p>Sorry, this page does not exist. Please check the URL.</p>,
        };
    }
  };

  const { title, content } = renderContent();

  return (
    <div style={{ padding: '3rem', maxWidth: '700px', margin: 'auto', lineHeight: 1.6 }}>
      <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>{title}</h2>
      <div>{content}</div>
    </div>
  );
}
