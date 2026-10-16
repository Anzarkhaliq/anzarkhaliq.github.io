(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.querySelector('.bar'), prog = document.querySelector('.progress');

  // header state and reading progress
  function onScroll(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.classList.toggle('solid', y > 40);
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    parallax(y);
  }
  // gentle parallax on hero and page art
  var par = [].slice.call(document.querySelectorAll('[data-par]'));
  function parallax(){
    if (reduce) return;
    par.forEach(function(el){
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = 'translate3d(0,' + (p * -6) + '%,0)';
    });
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // index overlay
  var idx = document.querySelector('.index'), openB = document.querySelector('.index-btn'), closeB = document.querySelector('.index .close');
  function setIdx(o){
    if (!idx) return;
    idx.classList.toggle('open', o); document.body.classList.toggle('locked', o);
    idx.setAttribute('aria-hidden', !o); openB && openB.setAttribute('aria-expanded', o);
    if (o) { var f = idx.querySelector('a'); f && f.focus(); } else { openB && openB.focus(); }
  }
  openB && openB.addEventListener('click', function(){ setIdx(true); });
  closeB && closeB.addEventListener('click', function(){ setIdx(false); });
  addEventListener('keydown', function(e){ if (e.key === 'Escape' && idx && idx.classList.contains('open')) setIdx(false); });
  if (idx) {
    var pics = idx.querySelectorAll('aside img');
    idx.querySelectorAll('nav a[data-i]').forEach(function(a){
      a.addEventListener('mouseenter', function(){
        pics.forEach(function(p){ p.classList.toggle('on', p.dataset.i === a.dataset.i); });
      });
    });
  }

  // reveal on scroll
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -10% 0px'});
    rv.forEach(function(el){ io.observe(el); });
  } else rv.forEach(function(el){ el.classList.add('in'); });

  // sticky table of contents: mark the section in view
  var toc = document.querySelectorAll('.toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {}; toc.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { toc.forEach(function(a){ a.classList.remove('on'); }); var a = map[e.target.id]; a && a.classList.add('on'); } });
    }, {rootMargin:'-30% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){ var s = document.getElementById(id); s && so.observe(s); });
  }

  // shelf: arrows and drag to scroll
  document.querySelectorAll('[data-shelf]').forEach(function(nav){
    var s = document.getElementById(nav.dataset.shelf); if (!s) return;
    nav.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){ s.scrollBy({left: (b.dataset.d === 'next' ? 1 : -1) * s.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth'}); });
    });
    var down = false, sx = 0, sl = 0, moved = false;
    s.addEventListener('pointerdown', function(e){ if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = s.scrollLeft; s.style.scrollSnapType = 'none'; });
    addEventListener('pointermove', function(e){ if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; s.scrollLeft = sl - dx; });
    addEventListener('pointerup', function(){ if (!down) return; down = false; s.style.scrollSnapType = ''; });
    s.addEventListener('click', function(e){ if (moved) { e.preventDefault(); moved = false; } }, true);
    s.addEventListener('dragstart', function(e){ e.preventDefault(); });
  });

  // image preview that follows the cursor over index lists
  var peek = document.querySelector('.peek');
  if (peek && matchMedia('(hover: hover)').matches) {
    var pimg = peek.querySelector('img'), tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    function loop(){ cx += (tx - cx) * .18; cy += (ty - cy) * .18; peek.style.left = cx + 'px'; peek.style.top = cy + 'px'; raf = requestAnimationFrame(loop); }
    document.querySelectorAll('[data-peek]').forEach(function(a){
      a.addEventListener('mouseenter', function(e){ pimg.src = a.dataset.peek; tx = cx = e.clientX + 170; ty = cy = e.clientY; peek.classList.add('on'); if (!raf) loop(); });
      a.addEventListener('mousemove', function(e){ tx = e.clientX + 170; ty = e.clientY; });
      a.addEventListener('mouseleave', function(){ peek.classList.remove('on'); cancelAnimationFrame(raf); raf = 0; });
    });
  }

  // click-to-load video
  document.querySelectorAll('button.video').forEach(function(b){
    b.addEventListener('click', function(){
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1&rel=0' + (b.dataset.t ? '&start=' + b.dataset.t : '');
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'; f.allowFullscreen = true;
      f.title = b.getAttribute('aria-label') || 'Video';
      b.innerHTML = ''; b.appendChild(f); b.style.cursor = 'default';
    }, {once:true});
  });
})();
