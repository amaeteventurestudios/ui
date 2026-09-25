/* Screenshot lightbox for /ai-lab: native <dialog> (focus trap, Esc), no libraries. Leaves the page exactly where it was. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.al-shots .al-zoom'));
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  var dlg = document.createElement('dialog');
  dlg.className = 'al-lightbox';
  dlg.setAttribute('aria-label', 'Screenshot viewer');
  dlg.innerHTML = '<button type="button" class="alb-close" aria-label="Close (Esc)">&times;</button>' +
    '<button type="button" class="alb-nav alb-prev" aria-label="Previous screenshot">&#8249;</button>' +
    '<figure><img alt="" /><figcaption></figcaption></figure>' +
    '<button type="button" class="alb-nav alb-next" aria-label="Next screenshot">&#8250;</button>';
  document.body.appendChild(dlg);
  var img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption'), i = 0, opener = null, y = 0;
  function show(n) {
    i = (n + links.length) % links.length;
    var a = links[i], im = a.querySelector('img');
    img.src = a.getAttribute('href'); img.alt = im.alt;
    var c = a.parentNode.querySelector('figcaption'); cap.textContent = (i + 1) + ' of ' + links.length + '. ' + (c ? c.textContent : '');
  }
  function open(n, from) {
    y = window.pageYOffset; opener = from; show(n);
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
  }
  function close() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () {
    document.documentElement.style.overflow = '';
    window.scrollTo(0, y);                                    // exactly where the visitor was
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  });
  links.forEach(function (a, n) { a.addEventListener('click', function (e) { e.preventDefault(); open(n, a); }); });
  dlg.querySelector('.alb-close').addEventListener('click', close);
  dlg.querySelector('.alb-prev').addEventListener('click', function () { show(i - 1); });
  dlg.querySelector('.alb-next').addEventListener('click', function () { show(i + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });   // click outside the picture
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
  });
})();
