export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-agent-cta-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-agent-cta-img-col');
        }
      } else {
        // text column: remove any authored "Find an agent" link, then inject form
        const existingLink = [...col.querySelectorAll('a')].find(
          (a) => /find\s+an?\s+agent/i.test(a.textContent),
        );
        if (existingLink) {
          // remove the wrapping <p> if it only contained this link
          const parent = existingLink.parentElement;
          if (parent && parent.tagName === 'P' && parent.children.length === 1) {
            parent.remove();
          } else {
            existingLink.remove();
          }
        }

        // inject ZIP form after the last <p>
        const lastP = [...col.querySelectorAll('p')].pop();
        const form = document.createElement('form');
        form.classList.add('columns-agent-cta-form');
        form.innerHTML = `
          <input type="text" name="zip" placeholder="ZIP Code" class="columns-agent-cta-zip" maxlength="10" autocomplete="postal-code">
          <button type="submit" class="columns-agent-cta-submit">Find an agent</button>
        `;
        if (lastP) {
          lastP.insertAdjacentElement('afterend', form);
        } else {
          col.append(form);
        }
      }
    });
  });
}
