export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Find the text cell (last div)
  const textCell = block.querySelector(':scope > div:last-child > div');
  if (!textCell) return;

  // Remove any existing "Start a quote" button/link so the form replaces it
  const existingLinks = textCell.querySelectorAll('a');
  existingLinks.forEach((a) => {
    if (a.textContent.trim().toLowerCase().includes('start a quote')) {
      // Remove the parent <p> if that's all it contains, otherwise just the link
      const parent = a.parentElement;
      if (parent && parent.tagName === 'P' && parent.children.length === 1) {
        parent.remove();
      } else {
        a.remove();
      }
    }
  });

  // Inject the ZIP quote form after the first <p> (intro copy)
  const introParagraph = textCell.querySelector('p');
  const form = document.createElement('form');
  form.className = 'hero-quote-form';
  form.action = '/get-insurance-quote';
  form.method = 'get';
  form.innerHTML = `
    <input type="text" name="zip" placeholder="Enter ZIP code" maxlength="5" pattern="[0-9]{5}" aria-label="ZIP code" class="hero-quote-zip">
    <button type="submit" class="hero-quote-submit">Start a quote</button>
  `;

  if (introParagraph) {
    introParagraph.after(form);
  } else {
    textCell.append(form);
  }
}
