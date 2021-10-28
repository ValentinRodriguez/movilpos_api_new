import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Echo from 'laravel-echo';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { MenuService } from './app.menu.service';
import { RolesService } from './services/globales/roles.service';
import { UsuarioService } from './services/panel-control/usuario.service';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
})
export class AppMainComponent implements OnInit{
    menuMode = 'static';
    colorScheme = 'light';
    menuTheme = 'layout-sidebar-darkgray';
    overlayMenuActive: boolean;
    staticMenuDesktopInactive: boolean;
    staticMenuMobileActive: boolean;
    menuClick: boolean;
    search = false;
    searchClick = false;
    userMenuClick: boolean;
    topbarUserMenuActive: boolean;
    notificationMenuClick: boolean;
    topbarNotificationMenuActive: boolean;
    rightMenuClick: boolean;
    rightMenuActive: boolean;
    configActive: boolean;
    configClick: boolean;
    resetMenu: boolean;
    menuHoverActive = false;
    inputStyle = 'outlined';
    ripple: boolean;
    usuario: any;
    permisos: any[] = [];
    notificationMenuClick2: boolean;
    topbarNotificationMenuActive2: boolean;

    constructor(private menuService: MenuService,
                public route: Router,
                private usuarioSrv: UsuarioService,
                private primengConfig: PrimeNGConfig,
                private permisosServ: RolesService) {
                    this.usuario = usuarioSrv.getUserLogged().usuario;
                    console.log(this.usuario); 
                }

    ngOnInit() {        
        this.primengConfig.ripple = true;   
        this.permisos = this.usuario.rol

        if (localStorage.getItem('tipo-menu')) {
            this.menuMode = localStorage.getItem('tipo-menu');    
            const appLogoLink: HTMLImageElement = document.getElementById('app-logo') as HTMLImageElement;

            // if (this.menuMode === 'slim') {
            //     appLogoLink.src = 'assets/layout/images/mini-logo.png';
            // }else{
            //     appLogoLink.src = 'assets/layout/images/logo.png';
            // } 
        }

        if (localStorage.getItem('tipo-input')) {
            this.inputStyle = localStorage.getItem('tipo-input');         
        }

        if (localStorage.getItem('esquema-color')) {
            this.colorScheme = localStorage.getItem('esquema-color');         
        }
    }

    initializeEcho() {
        const echo = new Echo({
            broadcaster: 'pusher',
            cluster: environment.pusher_CLUSTER,
            key: environment.pusher_KEY,
            wsHost: window.location.hostname,
            wsPort: environment.pusher_PORT,
            forceTLS: false,
            disableStats: true,
            enabledTransports: ['ws'],

            /*broadcaster: 'pusher',
            key: environment.pusher_KEY,
            wsHost: environment.pusher_HOST,
            wsPort: environment.pusher_PORT,
            forceTLS: false,
            authEndpoint: `${environment.urlClean}/api/broadcasting/auth`,
            auth: {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            },
            disableStats: true,
            encrypted: false*/
        });
        
        echo.channel('chanel-chat').listen('testMessage', (resp) => {
            console.log(resp);
        });
    }

    onLayoutClick() {
        if (!this.searchClick) {
            this.search = false;
        }

        if (!this.userMenuClick) {
            this.topbarUserMenuActive = false;
        }

        if (!this.notificationMenuClick) {
            this.topbarNotificationMenuActive = false;
        }

        if (!this.rightMenuClick) {
            this.rightMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isSlim()) {
                this.menuService.reset();
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
            this.unblockBodyScroll();
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        this.searchClick = false;
        this.configClick = false;
        this.userMenuClick = false;
        this.rightMenuClick = false;
        this.notificationMenuClick = false;
        this.menuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarUserMenuActive = false;
        this.topbarNotificationMenuActive = false;
        this.rightMenuActive = false;

        if (this.isOverlay()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }

        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
            if (this.staticMenuMobileActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }

        event.preventDefault();
    }

    onSearchClick(event) {
        this.search = !this.search;
        this.searchClick = !this.searchClick;
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;
    }

    onTopbarUserMenuButtonClick(event) {
        this.userMenuClick = true;
        this.topbarUserMenuActive = !this.topbarUserMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarNotificationMenuButtonClick(event) {
        this.notificationMenuClick = true;
        this.topbarNotificationMenuActive = !this.topbarNotificationMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarNotificationMenuButtonClick2(event) {
        this.notificationMenuClick2 = true;
        this.topbarNotificationMenuActive2= !this.topbarNotificationMenuActive2;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onRightMenuClick(event) {
        this.rightMenuClick = true;
        this.rightMenuActive = !this.rightMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onRippleChange(event) {
        this.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;     
    }

    isSlim() {
        return this.menuMode === 'slim';
    }

    isOverlay() {
        return this.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return window.innerWidth <= 991;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
}
