import { salesPageCopy } from '../../constants/salesPageCopy';
import { SalesButton, SalesSection } from './shared';

export function SalesFooter() {
  const { footer } = salesPageCopy;

  return (
    <>
      {/* Final CTA Section */}
      <SalesSection background="dark" className="sales-final-cta">
        <div className="sales-final-cta-content">
          <h2 className="sales-final-cta-headline">{footer.ctaHeadline}</h2>
          <p className="sales-final-cta-subheadline">{footer.ctaSubheadline}</p>
          <SalesButton variant="primary" size="lg" to="/learn">
            {footer.ctaButton}
          </SalesButton>
        </div>
      </SalesSection>

      {/* Footer */}
      <footer className="sales-footer">
        <div className="sales-footer-inner">
          <div className="sales-footer-grid">
            <div className="sales-footer-section">
              <h4>Product</h4>
              <ul>
                {footer.links.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sales-footer-section">
              <h4>Resources</h4>
              <ul>
                {footer.links.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sales-footer-section">
              <h4>Company</h4>
              <ul>
                {footer.links.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sales-footer-bottom">
            <p>{footer.copyright}</p>
            <p className="sales-footer-disclaimer">{footer.disclaimer}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
