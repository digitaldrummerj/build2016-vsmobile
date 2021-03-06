

import {App, IonicApp, Events, Platform} from 'ionic-angular';
import {ConferenceData} from './providers/conference-data';
import {UserData} from './providers/user-data';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';
import {LogOutPage} from './pages/logout/logout';

interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@App({
  templateUrl: 'build/app.html',
  providers: [ConferenceData, UserData],
  config: {
    platforms: {
      android: {
        tabbarLayout: 'icon-hide'
      }
    }
  }
})
class ConferenceApp {
  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [
    { title: 'Schedule', component: TabsPage, icon: 'calendar' },
    { title: 'Speakers', component: TabsPage, index: 1, icon: 'contacts' },
    { title: 'Map', component: TabsPage, index: 2, icon: 'map' },
    { title: 'About', component: TabsPage, index: 3, icon: 'information-circle' },
  ];
  loggedInPages: PageObj[] = [
    { title: 'Logout', component: LogOutPage, icon: 'log-out' }
  ];
  loggedOutPages: PageObj[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' }
  ];
  rootPage: any = TabsPage;
  loggedIn = false;

  constructor(
    private app: IonicApp,
    private events: Events,
    private userData: UserData,
    private platform: Platform,
    private confData: ConferenceData
  ) {

    // load the conference data
    confData.load();

    this.loggedIn = this.userData.loggedIn;
    
    this.listenToLoginEvents();
  }

  openPage(page: PageObj) {
    // find the nav component and set what the root page should be
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');

    if (page.index) {
      nav.setRoot(page.component, {tabIndex: page.index});
    } else {
      nav.setRoot(page.component);
    }
    
    if (page.title === 'Logout') {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
        this.loggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
      this.loggedIn = false;
    });
  }
}
