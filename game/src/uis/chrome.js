/**
 * The chrome error UI
 */

import _ from 'lodash';
import pause from '../pause';

module.exports = {
    open() {
        var container = document.getElementById("chrome-only-ui");

        pause.pause('chrome');
        container.style.display = "block";
    }
}