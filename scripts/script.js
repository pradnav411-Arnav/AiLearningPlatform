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

    window.addEventListener('mousemove', (e) => {
      floatGrid.style.setProperty('--x', `${e.clientX}px`);
      floatGrid.style.setProperty('--y', `${e.clientY}px`);
    });