import { FormEvent, useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Menu, Phone, Play, X } from 'lucide-react';
import { pestServices } from './services';
import ServiceDetailPage from './ServiceDetailPage';
import { FormEvent, useEffect, useRef, useState, useCallback } from 'react';

const logo = '/images/WEB_LOGO.png';
const phoneNumber = '0424 111 201';
const phoneHref = 'tel:0424111201';
const web3formsKey = 'dc59def2-9e32-4fb6-bb02-8d1fe912c0f3';

const galleryItems = [
  { label: 'Exterior protection', image: '/images/1.webp' },
  { label: 'On-site service', image: '/images/2.webp' },
  { label: 'Indoor treatment', image: '/images/3.webp' },
  { label: 'The Pest-Aside team', image: '/images/5.webp' },
  { label: 'Thorough coverage', image: '/images/7.webp' },
  { label: 'Professional equipment', image: '/images/8.webp' },
];

const googleReviewsUrl = 'https://www.google.com/search?q=pest-aside+sydney&sca_esv=9cb5d0058d5e6f03&rlz=1C1ONGR_enAU1065AU1065&biw=1920&bih=945&sxsrf=APpeQnvTyywA-m1wsdvGbLpBWnZ7h2FlUQ%3A1787889849817&ei=uQiRaqnAMeWfhvcPpMGQyQs&ved=0ahUKEwjpgJXbuMKWAxXlj-EIHaQgJLkQ4dUDCBA&uact=5&oq=pest-aside+sydney&gs_lp=Egxnd3Mtd2l6LXNlcnAiEXBlc3QtYXNpZGUgc3lkbmV5MgQQABgeMgQQABgeMgsQABiABBiKBRiGAzILEAAYgAQYigUYhgMyCxAAGIAEGIoFGIYDSNcFUOQCWOQCcAF4AZABAJgBuQGgAbkBqgEDMC4xuAEDyAEA-AEBmAICoAK-AcICChAAGEcY1gQYsAPCAhcQLhjcBhi4BhjaBhjYAhjIAxiwA9gBAZgDAOIDBRIBMSBAiAYBkAYPugYGCAEQARgZkgcDMS4xoAevA7IHAzAuMbgHvAHCBwMwLjLIBwSACAE&sclient=gws-wiz-serp#lrd=0x623ee01f3fb2a113:0x34723145fac7fba2,1,,,,';

const reviews = [
  { name: 'Liam', initials: 'L', text: 'Excellent and timely work! I had a rat problem at my home and Ross installed bait stations and resolved the issue. He also spoke through the whole process and made sure I had a good understanding of the method. Would recommend anyone who has similar issues!' },
  { name: 'JN', initials: 'J', text: 'I recently had Ross complete my pest control service and could not be happier with the experience. He was punctual, professional, and took the time to explain everything clearly. The quality of his work was excellent, and he went above and beyond to make sure the job was done thoroughly!' },
  { name: 'Jackie', initials: 'J', text: 'Always very friendly and professional. I book my pest spray every six to eight months. Ross does a great job getting in and around the house to give it a thorough spray and there are dead pests showing up months after spraying. Ross also administered an effective solution to kill off the swarms of flies under my pergola. Very happy customer who can confidently recommend Pest-Aside highly.' },
  { name: 'Christos', initials: 'C', text: 'Ross did an incredible job. We had previously used a different company but did not see any results. With Pest-Aside there was instantaneous results. Especially with a new born baby having someone that genuinely cares about their job really makes us feel at ease.' },
  { name: 'Innerlec Services', initials: 'I', text: 'We recently engaged with Ross from Pest-aside Sydney to carry out pest control treatment across our factory and office premises, and the service was exceptional from start to finish. We also appreciated the safety measures taken. Highly recommended for any commercial pest control needs.' },
  { name: 'Daniel', initials: 'D', text: 'Pest-A-Side were quick, fair priced and very professional. Ross worked closely with all tenants and Strata to ensure everyone was satisfied and was very flexible to ensure he met everyone\'s calendar. Recommended!' },
  { name: 'Sharon', initials: 'S', text: 'Highly recommend Ross from Pest Aside! Professional, reliable and took the time to explain everything properly. The service was thorough and you can tell he genuinely cares about doing a great job. Super friendly and easy to deal with from start to finish. Thanks again Ross!' },
];

function ContactForm({ variant = 'light', idPrefix = '' }: { variant?: 'light' | 'dark'; idPrefix?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
        name: String(form.get(`${idPrefix}name`) || '').trim(),
        phone: String(form.get(`${idPrefix}phone`) || '').trim(),
        email: String(form.get(`${idPrefix}email`) || '').trim(),
        message: String(form.get(`${idPrefix}message`) || '').trim(),
      }),
    });
    const result = await response.json();
    setSubmitting(false);
    if (!result.success) {
      setFormError(`We could not send that just now. Please call Ross directly on ${phoneNumber}.`);
      return;
    }
    setSubmitted(true);
    event.currentTarget.reset();
  };

  const formClass = variant === 'dark' ? 'inline-form inline-form-dark' : 'inline-form inline-form-light';

  if (submitted) {
    return (
      <div className={`${formClass} success-state`}>
        <div className="success-icon"><Check size={26} /></div>
        <h3>Message received.</h3>
        <p>Ross will be in touch shortly. If it is urgent, call {phoneNumber}.</p>
        <button className="text-link" onClick={() => setSubmitted(false)}>Send another enquiry <ArrowUpRight size={15} /></button>
      </div>
    );
  }

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <label><span>Name</span><input name={`${idPrefix}name`} required placeholder="Your name" /></label>
      <div className="form-row"><label><span>Phone</span><input name={`${idPrefix}phone`} required type="tel" placeholder="0400 000 000" /></label><label><span>Email</span><input name={`${idPrefix}email`} required type="email" placeholder="you@email.com" /></label></div>
      <label><span>How can we help?</span><textarea name={`${idPrefix}message`} required rows={3} placeholder="Tell us what you are dealing with..." /></label>
      {formError && <p className="form-error">{formError}</p>}
      <button className="button button-dark form-submit" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Request a free quote'} <ArrowUpRight size={17} /></button>
    </form>
  );
}

function PhoneBadge({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <a className={`phone-badge phone-badge-${size}`} href={phoneHref}>
      <Phone size={size === 'large' ? 22 : size === 'small' ? 14 : 18} />
      <span>{phoneNumber}</span>
    </a>
  );
}
function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const startVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    void video.play();
    setPlaying(true);
  };

  return (
    <div className="hero-video-placeholder reveal delay-2">
      <div className={playing ? 'hero-video-frame is-playing' : 'hero-video-frame'}>
        <video
          ref={videoRef}
          className="hero-video-element"
          src="/videos/herovid.mp4"
          poster="/images/7.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={playing}
        />
        {!playing && (
          <button type="button" className="hero-video-overlay" onClick={startVideo}>
            <span className="hero-video-play"><Play size={36} /></span>
            <span className="hero-video-label">See Pest-Aside in action</span>
            <span className="hero-video-sub">Watch how we protect Sydney homes</span>
          </button>
        )}
      </div>
    </div>
  );
}
function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => setLightboxIndex((i) => (i === null ? i : (i + 1) % galleryItems.length)), []);
  const prevImage = useCallback(() => setLightboxIndex((i) => (i === null ? i : (i - 1 + galleryItems.length) % galleryItems.length)), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Pest-Aside Sydney home">
          <img src={logo} alt="Pest-Aside Sydney" />
        </button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <button onClick={() => scrollTo('services')}>Services</button>
          <button onClick={() => scrollTo('about')}>Why Pest-Aside</button>
          <button onClick={() => scrollTo('values')}>Values</button>
          <button onClick={() => scrollTo('gallery')}>Work</button>
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </nav>
        <a className="header-phone" href={phoneHref}><Phone size={18} /> {phoneNumber}</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-video" aria-hidden="true"><div className="hero-photo" /><div className="hero-grid" /></div>
          <div className="hero-copy reveal">
            <p className="eyebrow"><span /> Sydney pest control, done properly</p>
            <h1>We Keep<br /><em>Pests Aside</em></h1>
            <p className="hero-intro">Reliable pest control for homes and businesses across Sydney. Honest pricing, thoughtful treatment and results that last.</p>
            <div className="hero-actions">
              <button className="button button-lime" onClick={() => scrollTo('contact')}>Get a free quote <ArrowUpRight size={17} /></button>
              <a className="button button-ghost" href={phoneHref}>Call Ross <Phone size={16} /></a>
            </div>
            <div className="hero-proof"><span><Check size={13} /> Family &amp; pet conscious</span><span><Check size={13} /> Same-day available</span></div>
          </div>
          <div className="hero-form-card reveal delay-one" id="contact">
            <div className="form-heading"><span>01 / Start here</span><h2>Let&apos;s clear<br />the way.</h2><p>Tell us what&apos;s happening and we&apos;ll get back to you with a clear next step.</p></div>
            <ContactForm variant="light" idPrefix="hero-" />
          </div>
          <div className="hero-scroll">Scroll to explore <ChevronDown size={16} /></div>
	  <HeroVideo />
          </section>

        <section className="ticker" aria-label="Service highlights"><div>SYDNEY WIDE <span>*</span> HONEST SERVICE <span>*</span> LONG-LASTING RESULTS <span>*</span> CALL {phoneNumber} <span>*</span> SYDNEY WIDE <span>*</span> HONEST SERVICE <span>*</span> LONG-LASTING RESULTS <span>*</span> CALL {phoneNumber}</div></section>

        <section className="intro-section reveal" id="about">
          <div className="section-kicker">The Pest-Aside approach</div>
          <div className="intro-content"><div className="intro-copy"><h2>Trusted Local Pest Control<br /><span>for Sydney Homes &amp; Businesses</span></h2><div className="intro-text"><p>At Pest-Aside Sydney, we are passionate about helping families and businesses live and operate pest-free. We provide professional pest control solutions tailored to your property, with safe, effective treatments designed for long-lasting protection.</p><p>From homes and apartments to cafes, offices, warehouses and commercial properties, we have got you covered. We are committed to delivering quality service, attention to detail and reliable pest management across Sydney.</p><button className="button button-lime" onClick={() => scrollTo('services')}>View Our Services <ArrowUpRight size={17} /></button></div></div><div className="intro-photo"><img src="/images/6.webp" alt="Pest-Aside technician beside the service vehicle" /></div></div>
          <div className="stat-row"><div><strong>01</strong><span>simple promise:<br />do it properly</span></div><div><strong>100%</strong><span>care in every<br />job we take on</span></div></div>
        </section>

        <section className="why-choose-section reveal" id="why-choose">
          <div className="why-choose-grid">
            <div className="why-choose-left">
              <div className="section-kicker">Why Pest-Aside</div>
              <h2>Why Choose<br /><span>Pest-Aside Sydney?</span></h2>
              <p>Choosing Pest-Aside Sydney means choosing trusted local pest control backed by genuine care, professional service and a proven track record of protecting Sydney homes and businesses. Every treatment is tailored to deliver safe, effective and long-lasting protection.</p>
              <div className="why-choose-contact">
                <PhoneBadge size="large" />
                <button className="button button-lime" onClick={() => scrollTo('contact')}>Get In Touch <ArrowUpRight size={17} /></button>
              </div>
            </div>
            <div className="why-choose-right">
              <ul className="benefits-list">
                <li><Check size={18} /> Trusted local Sydney pest control specialists</li>
                <li><Check size={18} /> Fully licensed and insured technicians</li>
                <li><Check size={18} /> Proven track record of reliable results</li>
                <li><Check size={18} /> Tailored treatments for every home and business</li>
                <li><Check size={18} /> Same-day service available for urgent pest problems</li>
                <li><Check size={18} /> Safe, effective and long-lasting pest control solutions</li>
                <li><Check size={18} /> Residential, commercial and industrial pest management</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-top reveal">
            <div>
              <div className="section-kicker">What we do</div>
              <h2>Real Protection.<br /><span>Real Results.</span></h2>
            </div>
            <p>From a single unwelcome visitor to complete commercial protection, every treatment is tailored to the way you live and work.</p>
          </div>
          <div className="pest-cards-grid">
            {pestServices.map((service, index) => (
              <Link to={`/services/${service.slug}`} className={`pest-card reveal delay-${(index % 3) + 1}`} key={service.slug}>
                <div className="pest-card-image" style={{ backgroundImage: `url(${service.image})` }}>
                  <span className="pest-card-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="pest-card-info">
                  <h3>{service.name}</h3>
                  <p>{service.heroSub}</p>
                  <span className="pest-card-link">Learn more <ArrowUpRight size={15} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="statement-section reveal">
          <div className="statement-mark"><img src={logo} alt="Pest-Aside Sydney" /></div>
          <p>&ldquo;I treat every home like it&apos;s my own.&rdquo;</p>
          <span>ROSS GATIS, FOUNDER</span>
        </section>

        <section className="helping-section reveal" id="helping">
          <div className="helping-grid">
            <div className="helping-photo">
              <img src="/images/5.webp" alt="Pest-Aside team at work protecting a Sydney property" />
            </div>
            <div className="helping-copy">
              <div className="section-kicker">Our commitment</div>
              <h2>Our Commitment Is<br /><span>To Be Reliable</span></h2>
              <p>At Pest-Aside Sydney, our commitment is to be reliable. We deliver professional pest control with safe, effective treatments and long-lasting results that protect your home or workplace all year round.</p>
              <p>Our goal is simple: to keep Sydney homes and businesses pest-free with professional service and long-lasting protection.</p>
              <div className="helping-contact">
                <PhoneBadge size="large" />
              </div>
            </div>
          </div>
        </section>

        <section className="values-section reveal" id="values">
          <div className="values-header">
            <div className="section-kicker">What drives us</div>
            <h2>Our Values</h2>
            <p>At Pest-Aside Sydney, our values are at the heart of every service we provide. We are committed to protecting Sydney homes and businesses with honest advice, professional workmanship, safe treatments and results that last.</p>
          </div>
          <div className="values-grid">
            <div className="value-card reveal delay-1">
              <div className="value-icon"><Check size={24} /></div>
              <h3>Reliability</h3>
              <p>We show up on time, communicate clearly and complete every job with care and attention to detail.</p>
            </div>
            <div className="value-card reveal delay-2">
              <div className="value-icon"><Check size={24} /></div>
              <h3>Safety</h3>
              <p>Safe and effective pest control solutions designed to protect your family, pets, employees and property.</p>
            </div>
            <div className="value-card reveal delay-3">
              <div className="value-icon"><Check size={24} /></div>
              <h3>Quality</h3>
              <p>Professional treatments and proven methods designed to provide long-lasting protection through thorough, effective pest management.</p>
            </div>
            <div className="value-card reveal delay-1">
              <div className="value-icon"><Check size={24} /></div>
              <h3>Customer First</h3>
              <p>Your satisfaction and peace of mind come first. We provide thorough, professional pest control solutions tailored to protect your home or business with long-lasting results.</p>
            </div>
          </div>
        </section>

        <section className="reviews-section" id="reviews">
          <div className="reviews-heading reveal">
            <div>
              <div className="section-kicker">What customers say</div>
              <h2>Good work<br /><span>travels.</span></h2>
            </div>
            <a className="google-review-link" href={googleReviewsUrl} target="_blank" rel="noreferrer">
              <img src="/images/GoogleLogo.png" alt="Google" />
              <div><strong>Read us on Google</strong><span>See all reviews <ArrowUpRight size={14} /></span></div>
            </a>
          </div>
          <div className="reviews-viewport">
            <div className="reviews-track">
              {[...reviews, ...reviews].map((review, index) => (
                <article className="review-card" key={`${review.name}-${index}`}>
                  <div className="review-card-top"><span className="review-stars">★★★★★</span><span className="review-source"><img src="/images/GoogleLogo.png" alt="" /> Google</span></div>
                  <p>&ldquo;{review.text}&rdquo;</p>
                  <div className="review-author"><span>{review.initials}</span><strong>{review.name}</strong><small>Google review</small></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-section" id="gallery"><div className="section-top reveal"><div><div className="section-kicker">The work, up close</div><h2>A clearer<br /><span>standard.</span></h2></div><p>Real Pest-Aside work, from rooflines and wall cavities to the final detail that leaves a property protected.</p></div><div className="gallery-grid">{galleryItems.map((item, index) => <button type="button" className={`gallery-card reveal delay-${index % 3 + 1}`} key={item.label} onClick={() => setLightboxIndex(index)} aria-label={`View ${item.label} larger`}><img className="gallery-photo" src={item.image} alt={item.label} /><div className="gallery-placeholder"><span>Image {String(index + 1).padStart(2, '0')}</span><strong>{item.label}</strong></div></button>)}</div></section>

        <section className="coverage-section reveal"><div className="coverage-copy"><div className="section-kicker">Where we work</div><h2>All across<br /><span>Sydney.</span></h2><p>From the Northern Beaches to the Hills, the Inner West to the South West, Pest-Aside covers the suburbs that make Sydney home.</p><button className="button button-lime" onClick={() => scrollTo('contact')}>Check your suburb <ArrowUpRight size={17} /></button></div><div className="map-art"><div className="map-ring ring-one" /><div className="map-ring ring-two" /><div className="map-ring ring-three" /><span className="map-label label-north">Northern<br />Beaches</span><span className="map-label label-city">Sydney<br />CBD</span><span className="map-label label-west">Western<br />Sydney</span><span className="map-label label-south">South<br />Sydney</span><div className="map-pin"><span /></div></div></section>

        <section className="cta-banner-section reveal" id="cta-banner">
          <div className="cta-banner-content">
            <div className="section-kicker">Ready to act</div>
            <h2>Peace of Mind<br /><span>Starts Here</span></h2>
            <p>We provide safe, effective pest control solutions tailored to your property, with reliable service and long-lasting protection you can count on. Every treatment is delivered with genuine care for your home, family or business.</p>
            <span className="cta-banner-tagline">Protecting homes. Supporting businesses. Building peace of mind.</span>
            <div className="cta-banner-actions">
              <button className="button button-lime" onClick={() => scrollTo('contact')}>Contact Us <ArrowUpRight size={17} /></button>
              <PhoneBadge size="large" />
            </div>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><X size={28} /></button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous"><ChevronLeft size={32} /></button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={galleryItems[lightboxIndex].image} alt={galleryItems[lightboxIndex].label} />
            <figcaption><span>Image {String(lightboxIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span><strong>{galleryItems[lightboxIndex].label}</strong></figcaption>
          </figure>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next"><ChevronRight size={32} /></button>
        </div>
      )}

      <footer id="contact">
        <div className="footer-get-in-touch reveal">
          <div className="footer-get-in-touch-left">
            <div className="section-kicker">Get In Touch</div>
            <h2>Let&apos;s sort your<br /><span>pest problem.</span></h2>
            <p>Protecting Sydney homes and businesses with trusted local pest control and a genuine passion for helping families and businesses live and operate pest-free. We are committed to delivering professional service and long-lasting protection for every property we treat.</p>
            <div className="footer-contact-info">
              <a href={phoneHref}><Phone size={20} /> {phoneNumber}</a>
              <a href="mailto:Info@pestasidesydney.com.au">Info@pestasidesydney.com.au</a>
              <span>Sydney, NSW</span>
            </div>
            <a className="button button-lime" href={phoneHref}>Call Ross Now <Phone size={16} /></a>
          </div>
          <div className="footer-get-in-touch-right">
            <div className="footer-services-list">
              <div className="section-kicker">Our Services</div>
              <ul>
                <li><Link to="/services/cockroach-control">Cockroach Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/mice-control">Rodent Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/spider-control">Spider Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/ant-control">Ant Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/wasp-control">Wasp Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/wasp-control">Bee Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/ant-control">Flea Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/silverfish-control">Silverfish Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/spider-control">Mosquito Control <ArrowUpRight size={13} /></Link></li>
                <li><Link to="/services/bed-bug-control">Bed Bug Control <ArrowUpRight size={13} /></Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-form-section reveal">
          <div className="footer-form-wrap">
            <div className="footer-form-heading">
              <div className="section-kicker">Send a message</div>
              <h3>Prefer we call you?</h3>
              <p>Fill in the form below and Ross will get back to you with a clear next step.</p>
            </div>
            <ContactForm variant="light" idPrefix="footer-" />
          </div>
        </div>

        <div className="footer-main">
          <img src={logo} alt="Pest-Aside Sydney" />
          <div className="footer-cta">
            <div className="section-kicker">Ready when you are</div>
            <h2>We Keep<br /><span>Pests Aside</span></h2>
            <a className="button button-lime" href={phoneHref}>Call {phoneNumber} <Phone size={16} /></a>
          </div>
          <div className="footer-links">
            <a href="mailto:Info@pestasidesydney.com.au">Info@pestasidesydney.com.au</a>
            <a href={phoneHref}>{phoneNumber}</a>
            <span>Sydney, NSW</span>
          </div>
        </div>
        <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Pest-Aside Sydney</span><a href="https://www.itscold.com.au" target="_blank" rel="noreferrer">Website by Go Polar</a><span>Built to keep things clear</span></div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
