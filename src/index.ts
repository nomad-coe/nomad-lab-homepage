import './styles.scss';

import { MDCRipple } from '@material/ripple';
import { MDCTopAppBar } from '@material/top-app-bar';
import { MDCMenu } from '@material/menu';

document.querySelectorAll('.nomad-button').forEach(button => {
    new MDCRipple(button); 
});

new MDCTopAppBar(document.querySelector('.nomad-app-bar'));

const registerMenuEvents = (id: string) => {
    const element = document.querySelector('#' + id)
    const menu = new MDCMenu(element.querySelector('.menu')) 

    document.querySelector('#' + id).addEventListener('mouseenter', () => {
        menu.open = true;
    })
    document.querySelector('#' + id).addEventListener('mouseleave', () => {
        menu.open = false;
    })
}

registerMenuEvents('services-menu')
registerMenuEvents('documentation-menu')
registerMenuEvents('support-menu')
registerMenuEvents('about-menu')
