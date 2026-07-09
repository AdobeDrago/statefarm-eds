/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: State Farm site-wide cleanup.
 *
 * State Farm insurance pages are Next.js apps built on the oneX design system.
 * All selectors below were verified against migration-work/cleaned.html and the
 * live page structure described in page analysis. Non-authorable site chrome
 * (header, footer, breadcrumbs, skip/feedback links, spacer) and interstitial
 * widgets (the third-party-link modal) are removed so the import contains only
 * page-level authorable content.
 *
 * Notes on the captured DOM:
 * - `#oneX-header` / `#footer` are the global header/footer. They are stripped
 *   from cleaned.html by the scraper but present on the live URL the validator
 *   runs against, so they are targeted here.
 * - `#__next > div.-oneX-header-spacer` is a layout shim under the fixed header.
 * - "Skip to Main Content" (`a.-oneX-skip-content` / [href="#maincontent"]) and
 *   the "Start Of Main Content" paragraph are a11y/landmark scaffolding.
 * - `#give-us-feedback` is a floating feedback widget.
 * - `section.-oneX-breadcrumbs` is the auto-generated breadcrumb trail (verified
 *   as the first child of <body> in cleaned.html). EDS auto-generates breadcrumbs,
 *   so it is removed.
 * - `#thirdPartyLinkModal` (`.-oneX-modal__container`, role="dialog",
 *   display:none) is an interstitial link-out confirmation dialog — an overlay
 *   widget, not authorable content. Verified inside <main> in cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlay / interstitial widgets that could interfere with block matching.
    // Verified in cleaned.html: <div id="thirdPartyLinkModal" class="-oneX-modal__container" ...>
    WebImporter.DOMUtils.remove(element, [
      '#thirdPartyLinkModal',
      '.-oneX-modal__container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (present on the live page the validator loads).
    WebImporter.DOMUtils.remove(element, [
      '#oneX-header',
      'header#oneX-header',
      '#footer',
      'footer#footer',
      '.-oneX-header-spacer',
      'section.-oneX-breadcrumbs',
      '.-oneX-breadcrumbs',
      'a.-oneX-skip-content',
      'a[href="#maincontent"]',
      '#give-us-feedback',
      '[class*="give-us-feedback"]',
      // Leftover non-authorable / non-rendering elements.
      'iframe',
      'noscript',
      'link',
      'style',
    ]);

    // Remove the "Skip to Main Content" and "Start Of Main Content" landmark
    // scaffolding by text match — these are plain <a>/<p> with no stable class.
    element.querySelectorAll('a, p').forEach((el) => {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text === 'skip to main content' || text === 'start of main content') {
        el.remove();
      }
    });
  }
}
