const AccessibilityHelper = {
    skipToContent() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('main-content');
            target.focus();
            });
        }
    }
};

export default AccessibilityHelper;
