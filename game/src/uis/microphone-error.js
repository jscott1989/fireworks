/**
 * The chrome error UI
 */

import _ from 'lodash';
import pause from '../pause';

module.exports = {
    open(error) {
        var container = document.getElementById("microphone-error-ui");
        container.querySelector("blockquote").innerHTML = error;

        pause.pause('microphone');
        container.style.display = "block";
    }
}