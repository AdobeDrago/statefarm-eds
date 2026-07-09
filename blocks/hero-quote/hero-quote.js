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
  <div class="hero-quote-select-wrapper">
    <label for="hero-quote-product" class="hero-quote-select-label">Product</label>
    <select id="hero-quote-product" name="productName" class="hero-quote-select">
      <option value="Auto">Auto</option>
      <option value="AutoHome">Auto + Home</option>
      <option value="AutoRenters">Auto + Renters</option>
      <option value="Motorcycle">Motorcycle</option>
      <option value="Homeowners">Homeowners</option>
      <option value="CondoOwners">Condo Owners</option>
      <option value="Renters">Renters</option>
      <option value="SmallBusiness">Small Business</option>
      <option value="Life">Life</option>
      <option value="Boat">Boat</option>
      <option value="MedicareSupplement">Medicare Supplement</option>
      <option value="SupplementalHealth">Supplemental Health</option>
      <option value="Pet">Pet Insurance</option>
    </select>
    <span class="hero-quote-select-arrow" aria-hidden="true"></span>
  </div>
  <div class="hero-quote-row">
    <div class="hero-quote-zip-wrapper">
      <label for="hero-quote-zip" class="hero-quote-zip-label">ZIP Code</label>
      <input type="text" id="hero-quote-zip" name="zipCode" class="hero-quote-zip"
             maxlength="5" pattern="[0-9]{5}" autocomplete="postal-code" placeholder=" ">
    </div>
    <button type="submit" class="hero-quote-submit">Start a quote</button>
  </div>
`;

  if (introParagraph) {
    introParagraph.after(form);
  } else {
    textCell.append(form);
  }
}
