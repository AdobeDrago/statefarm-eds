export default async function decorate(block) {
  const navMeta = block.querySelector('a[href]')?.getAttribute('href');
  const navPath = navMeta || '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const sections = [...tmp.children];
  const [brandSection, primarySection, utilitySection, loginSection] = sections;

  // --- Utility bar (grey strip, full-width, above main nav) ---
  // Search IS in the utility bar as a text button (first item, before Help/Español)
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility-bar';

  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-search';
  searchBtn.setAttribute('aria-expanded', 'false');
  searchBtn.textContent = 'Search';
  utilityBar.append(searchBtn);

  if (utilitySection) {
    const list = utilitySection.querySelector('ul');
    if (list) utilityBar.append(list);
  }

  // --- Search pane (full-width, between utility bar and nav) ---
  const searchPane = document.createElement('div');
  searchPane.className = 'nav-search-pane';
  searchPane.setAttribute('role', 'search');
  searchPane.innerHTML = `
    <form class="nav-search-form" action="/search" method="get">
      <div class="nav-search-inner">
        <div class="nav-search-field">
          <input type="search" name="q" id="nav-search-input" class="nav-search-input"
                 placeholder=" " autocomplete="off" aria-labelledby="nav-search-label">
          <label id="nav-search-label" for="nav-search-input" class="nav-search-label">How can we help you?</label>
        </div>
        <button type="submit" class="nav-search-submit">Search</button>
      </div>
    </form>
    <button type="button" class="nav-search-close" aria-label="Close search">&times;</button>
  `;

  // --- Main nav ---
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) brand.append(...brandSection.childNodes);

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const primary = document.createElement('div');
  primary.className = 'nav-primary';
  if (primarySection) {
    const list = primarySection.querySelector('ul');
    if (list) primary.append(list);
  }

  const login = document.createElement('div');
  login.className = 'nav-login';
  if (loginSection) {
    const list = loginSection.querySelector('ul');
    if (list) login.append(list);
  }

  nav.append(brand, hamburger, primary, login);

  block.textContent = '';
  block.append(utilityBar, searchPane, nav);

  // --- Search pane toggle logic ---
  const searchInput = searchPane.querySelector('.nav-search-input');
  const searchClose = searchPane.querySelector('.nav-search-close');

  const openSearch = () => {
    searchPane.classList.add('is-open');
    block.classList.add('search-open');
    searchBtn.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  };

  const closeSearch = () => {
    searchPane.classList.remove('is-open');
    block.classList.remove('search-open');
    searchBtn.setAttribute('aria-expanded', 'false');
    searchBtn.focus();
  };

  searchBtn.addEventListener('click', () => {
    const isOpen = searchPane.classList.contains('is-open');
    if (isOpen) closeSearch();
    else openSearch();
  });

  searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchPane.classList.contains('is-open')) {
      closeSearch();
    }
  });

  // --- Mobile toggle ---
  const closeMenu = () => {
    nav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
  };
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  const desktop = window.matchMedia('(min-width: 900px)');
  const onChange = () => { if (desktop.matches) closeMenu(); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else desktop.addListener(onChange);
}
