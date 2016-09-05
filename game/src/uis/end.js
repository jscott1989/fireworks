/**
 * The end UI
 */

import ui from './ui';
import pause from '../pause';

var container;

module.exports = {
    open() {
        
        var container = document.getElementById("end-ui");
        pause.pause('end');
        container.style.display = "block";
    }
}