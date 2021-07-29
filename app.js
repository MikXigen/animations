// Utility funscions

const throttle = (func, wait, options) => {
    /**
     * throttle function is taken as is from Xigen.co.uk codebase
     */
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
        previous = options.leading === false ? 0 : (Date.now() || new Date().getTime());
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function () {
        var now = (Date.now() || new Date().getTime());
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}

const inViewport = (el, part) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    let vertInView = false;

    if (part === 'top') {
        vertInView = (rect.top <= (windowHeight)) && ((rect.top + rect.height) >= 0);
    } else if (part === 'bottom') {
        vertInView = (rect.bottom <= (windowHeight)) && ((rect.top + rect.height) >= 0);
    }
    const horInView = (rect.left <= (windowWidth - 30)) && ((rect.left + rect.width) >= 0);
  
    return (vertInView && horInView);
}
  

// Animation functions

const scrollToAnchor = () => {

    /**
     * Function scrollToAnchor 
     * @params none
     * @returns none
     * 
     * This function finds hash links on the page and
     * smoothly scrolls to target if the link is clicked
     */
    const links = document.querySelectorAll('a');
    links.forEach((link) => {

        const href = link.getAttribute('href');
        if (href.charAt(0) === '#') {

            link.addEventListener('click', (e) => {

                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: "smooth" })
            })
        }
    })
}

const animateInViewport = () => {
    /**
     * Function animateInViewport 
     * @params none
     * @returns none
     * 
     * This function checksc all elements with class .animate and adds 
     * .run class when it's scrolled into viewport.
     * This is used for CSS animations.
     */
    const elements = document.querySelectorAll('.animate');
    
    window.addEventListener('scroll', throttle(() => {
        elements.forEach((element) => {

            if (inViewport(element, 'bottom')) {
                element.classList.add('run');
            }
        });
    }, 100));
}

const parallax = () => {
        /**
     * Function parallax 
     * @params none
     * @returns none
     * 
     * This function checksc all elements with class .parallax and applies parallax effect basing on speed provided in data-speed attribute
     */
    const elements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', throttle(() => {
        elements.forEach((element) => {

            const speed = parseInt(element.getAttribute('data-speed'));
            if (inViewport(element, 'top')) {

                const windowScrollTop = window.pageYOffset;
                const elementTop = element.offsetTop;

                const shiftDistance = (elementTop - windowScrollTop) * (speed / 100);

                console.log(shiftDistance);
                
                element.setAttribute('style', `transform: translateY(${shiftDistance}px);`);
            }
        });
    }, 30));
}

document.addEventListener('DOMContentLoaded', () => {

    console.log('app runs');

    scrollToAnchor();
    animateInViewport();
    parallax();
});