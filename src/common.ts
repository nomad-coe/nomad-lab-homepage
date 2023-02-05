import { MDCRipple } from '@material/ripple';
import { MDCTopAppBar } from '@material/top-app-bar';
import { MDCMenu } from '@material/menu';
import { MDCDrawer } from "@material/drawer";
import { MDCList } from "@material/list";

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

export function registerComponents() {
    // document.querySelectorAll('button').forEach(button => {
    //     new MDCRipple(button);
    // });

    // document.querySelectorAll('.mdc-icon-button').forEach(button => {
    //     new MDCRipple(button);
    // })

    registerMenuEvents('services-menu')
    registerMenuEvents('documentation-menu')
    registerMenuEvents('support-menu')
    registerMenuEvents('about-menu')

    const listEl = document.querySelector('.mdc-drawer .mdc-list-item');
    const mainContentEl = document.querySelector('main');
    const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    const navButton = document.querySelector('.nomad-nav-button');

    navButton.addEventListener('click', () => {
        drawer.open = true;
    })

    listEl.addEventListener('click', () => {
        drawer.open = false;
    });


    document.querySelectorAll('.mdc-list').forEach(listElement => {
        new MDCList(listElement);
    });

    mainContentEl.addEventListener('click', () => {
        drawer.open = false;
    });

    document.body.addEventListener('MDCDrawer:closed', () => {
        (mainContentEl.querySelector('input, button') as HTMLElement).focus();
    });

    new MDCTopAppBar(document.querySelector('.nomad-app-bar'));
}
