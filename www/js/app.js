import Barba from 'barba.js';

const onWindowLoaded = function() {
    /**
     * Next step, you have to tell Barba to use the new Transition
     */
    Barba.Pjax.start();
}

window.onload = onWindowLoaded;