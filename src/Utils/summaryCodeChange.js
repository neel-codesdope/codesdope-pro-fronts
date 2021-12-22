export const summaryCodeChange = event => {
    const currentElement = event.target;
    if (
        currentElement.parentNode.parentNode &&
        currentElement.tagName === 'LI' &&
        currentElement.parentNode.parentNode.classList.contains('code-multiple-lang')
    ) {
        currentElement.parentNode.querySelectorAll('LI').forEach((liElement, index) => {
            if (liElement === currentElement) {
                liElement.classList.add('active-tab');
                liElement.parentNode.parentNode.querySelectorAll('PRE').forEach((preElement, indexPre) => {
                    if (indexPre === index) {
                        preElement.classList.add('active-code');
                    } else {
                        preElement.classList.remove('active-code');
                    }
                });
            } else {
                liElement.classList.remove('active-tab');
            }
        });
    }
};
