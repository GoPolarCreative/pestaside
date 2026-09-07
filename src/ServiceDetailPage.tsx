import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Check, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { getServiceBySlug, pestServices } from './services';

const logo = '/images/WEB_LOGO.png';
const web3formsKey = 'dc59def2-9e32-4fb6-bb02-8d1fe912c0f3';

function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = slug ? getServiceBySlug(slug) : undefined;

  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [slug]);

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', service.metaDescription);

      const existing = document.getElementById('service-schema');
      if (existing) existing.remove();

      const schema = {
        '@context': 'https://schema.org',
        '@type': service.schemaType,
        name: service.name,
        description: service.metaDescription,
        provider: { '@type': 'LocalBusiness', name: 'Pest-Aside Sydney', telephone: '+61424111201', email: 'Info@pestasidesydney.com.au', address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressRegion: 'NSW', addressCountry: 'AU' } },
        areaServed: service.areaServed,
        serviceType: service.serviceType,
        url: `/services/${service.slug}`,
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'service-schema';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('service-schema');
      if (s) s.remove();
    };
  }, [service]);

  if (!service) {
    return (
      <div className="site-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <h1 style={{ fontSize: '48px', color: 'var(--lime)' }}>Page not found</h1>
        <button className="button button-lime" onClick={() => navigate('/')}>Back home <ArrowUpRight size={17} /></button>
      </div>
    );
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        name: String(form.get('name') || '').trim(),
        phone: String(form.get('phone') || '').trim(),
        email: String(form.get('email') || '').trim(),
        message: `${service.name} enquiry: ${String(form.get('message') || '').trim()}`,
      }),
    });
    const result = await response.json();
    setSubmitting(false);
    if (!result.success) {
      setFormError('We could not send that just now. Please call Ross directly on 0424 111 201.');
      return;
    }
    setSubmitted(true);
    event.currentTarget.reset();
  };

  const otherServices = pestServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="brand" onClick={() => navigate('/')} aria-label="Pest-Aside Sydney home">
          <img src={logo} alt="Pest-Aside Sydney" />
        </button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/#services')}>Services</button>
          <button onClick={() => navigate('/#gallery')}>Work</button>
          <button onClick={scrollToContact}>Contact</button>
        </nav>
        <a className="header-phone" href="tel:0424111201"><Phone size={18} /> 0424 111 201</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main>
        <section className="service-hero" id="top">
          <div className="service-hero-bg" style={{ backgroundImage: `linear-gradient(180deg, rgba(5,16,9,.82) 0%, rgba(5,16,9,.6) 50%, #07130d 100%), url(${service.image})` }} />
          <div className="service-hero-content reveal">
            <button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={15} /> All services</button>
            <p className="eyebrow"><span /> Pest-Aside Sydney</p>
            <h1>{service.heroHeadline}</h1>
            <p className="service-hero-sub">{service.heroSub}</p>
            <div className="hero-actions">
              <button className="button button-lime" onClick={scrollToContact}>Get a free quote <ArrowUpRight size={17} /></button>
              <a className="button button-ghost" href="tel:0424111201">Call Ross <Phone size={16} /></a>
            </div>
          </div>
        </section>

        <section className="service-intro-section reveal">
          <div className="service-intro-grid">
            <div className="service-intro-left">
              <div className="section-kicker">The problem</div>
              <h2>{service.name}<br /><span>in Sydney.</span></h2>
            </div>
            <div className="service-intro-right">
              <p>{service.intro}</p>
            </div>
          </div>
        </section>

        <section className="service-detail-section">
          <div className="service-detail-grid">
            <div className="service-detail-card reveal delay-1">
              <div className="section-kicker">Signs to look for</div>
              <ul className="signs-list">
                {service.signs.map((sign) => (
                  <li key={sign}><span className="sign-dot" /> {sign}</li>
                ))}
              </ul>
            </div>
            <div className="service-detail-card reveal delay-2">
              <div className="section-kicker">Our treatment</div>
              <ul className="signs-list">
                {service.treatment.map((item) => (
                  <li key={item}><span className="sign-dot lime" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="service-detail-card reveal delay-3">
              <div className="section-kicker">How to prevent</div>
              <ul className="signs-list">
                {service.prevention.map((item) => (
                  <li key={item}><span className="sign-dot" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="service-faq-section reveal">
          <div className="service-faq-container">
            <div className="section-kicker">Common questions</div>
            <h2>Questions about<br /><span>{service.name.toLowerCase()}.</span></h2>
            <div className="faq-list">
              {service.faqs.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                    {faq.question}
                    <ChevronDown size={18} className={openFaq === index ? 'faq-chevron open' : 'faq-chevron'} />
                  </button>
                  {openFaq === index && <div className="faq-answer"><p>{faq.answer}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="service-contact-section" id="contact">
          <div className="service-contact-grid">
            <div className="service-contact-left reveal">
              <div className="section-kicker">Ready when you are</div>
              <h2>Get {service.name.toLowerCase()}<br /><span>sorted today.</span></h2>
              <p>Tell us what you are dealing with and we will get back to you with a clear next step. Same-day service is often available.</p>
              <div className="service-contact-info">
                <a href="tel:0424111201"><Phone size={20} /> 0424 111 201</a>
                <a href="mailto:Info@pestasidesydney.com.au">Info@pestasidesydney.com.au</a>
              </div>
            </div>
            <div className="service-form-card reveal delay-one">
              {submitted ? (
                <div className="success-state">
                  <div className="success-icon"><Check size={26} /></div>
                  <h3>Message received.</h3>
                  <p>Ross will be in touch shortly. If it is urgent, call 0424 111 201.</p>
                  <button className="text-link" onClick={() => setSubmitted(false)}>Send another enquiry <ArrowUpRight size={15} /></button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label><span>Name</span><input name="name" required placeholder="Your name" /></label>
                  <div className="form-row">
                    <label><span>Phone</span><input name="phone" required type="tel" placeholder="0400 000 000" /></label>
                    <label><span>Email</span><input name="email" required type="email" placeholder="you@email.com" /></label>
                  </div>
                  <label><span>How can we help?</span><textarea name="message" required rows={3} placeholder="Tell us what you are dealing with..." /></label>
                  {formError && <p className="form-error">{formError}</p>}
                  <button className="button button-dark form-submit" type="submit" disabled={submitting}>
                    {submitting ? 'Sending...' : `Request ${service.name.toLowerCase()} quote`} <ArrowUpRight size={17} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="other-services-section reveal">
          <div className="section-kicker">Other services</div>
          <div className="other-services-grid">
            {otherServices.map((s) => (
              <Link to={`/services/${s.slug}`} className="other-service-card" key={s.slug}>
                <div className="other-service-image" style={{ backgroundImage: `url(${s.image})` }} />
                <div className="other-service-info">
                  <strong>{s.name}</strong>
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <img src={logo} alt="Pest-Aside Sydney" />
          <div className="footer-cta">
            <div className="section-kicker">Ready when you are</div>
            <h2>We Keep<br /><span>Pests Aside</span></h2>
            <a className="button button-lime" href="tel:0424111201">Call 0424 111 201 <Phone size={16} /></a>
          </div>
          <div className="footer-links">
            <a href="mailto:Info@pestasidesydney.com.au">Info@pestasidesydney.com.au</a>
            <a href="tel:0424111201">0424 111 201</a>
            <span>Sydney, NSW</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Pest-Aside Sydney</span>
          <a href="https://www.itscold.com.au" target="_blank" rel="noreferrer">Website by Go Polar</a>
          <span>Built to keep things clear</span>
        </div>
      </footer>
    </div>
  );
}

export default ServiceDetailPage;
