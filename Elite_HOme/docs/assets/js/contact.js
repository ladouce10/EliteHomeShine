(() => {
  const menuButton = document.querySelector('.mobile-toggle');
  const navigation = document.querySelector('.navlinks');

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    menuButton.textContent = '☰';
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      menuButton.textContent = isOpen ? '×' : '☰';
    });

    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const form = document.querySelector('#quote-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#form-status');
  const fileInput = form.querySelector('#upload');
  const fileSelection = form.querySelector('#file-selection');

  const setStatus = (message, type = '') => {
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ''}`;
  };

  fileInput?.addEventListener('change', () => {
    const count = fileInput.files?.length || 0;
    fileSelection.textContent = count ? `${count} photo${count === 1 ? '' : 's'} selected.` : '';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    setStatus('Sending your request…');

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data.errors?.map((error) => error.message).join(' ') || 'Your request could not be sent. Please try again or call us.';
        throw new Error(message);
      }

      form.reset();
      if (fileSelection) fileSelection.textContent = '';
      setStatus('Thank you! Your quote request has been sent. We’ll be in touch soon.', 'success');
    } catch (error) {
      setStatus(error.message || 'Your request could not be sent. Please try again or call us.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Quote Request';
    }
  });
})();
