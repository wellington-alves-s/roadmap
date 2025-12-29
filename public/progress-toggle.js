document.addEventListener('DOMContentLoaded', function() {
    const progressSection = document.querySelector('.progress-section');
    const toggleBtn = document.querySelector('.toggle-progress-btn');
    
    if (toggleBtn && progressSection) {
        // Restaurar estado anterior
        const wasCollapsed = localStorage.getItem('progressSectionCollapsed') === 'true';
        if (wasCollapsed) {
            progressSection.classList.add('collapsed');
        }

        toggleBtn.addEventListener('click', function() {
            progressSection.classList.toggle('collapsed');
            localStorage.setItem('progressSectionCollapsed', progressSection.classList.contains('collapsed'));
        });
    }
});
