const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    const isClickable = e.target.closest("a, button");
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    cursor.src = isClickable
        ? "./photos/pointer.png"
        : "./photos/cursor.png";
    });


// Grid background animation
const floatGrid = document.querySelector('.grid-float');

const topButton = document.getElementById('topBtn');
topButton?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth'
    });
});

    window.addEventListener('mousemove', (e) => {
      if (!floatGrid) return;
      const bounds = floatGrid.getBoundingClientRect();
      floatGrid.style.setProperty('--x', `${e.clientX - bounds.left}px`);
      floatGrid.style.setProperty('--y', `${e.clientY - bounds.top}px`);
    });
