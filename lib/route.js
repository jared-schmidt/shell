Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function(){

    this.route('home', {
        path:'/',
        onBeforeAction:mustLogIn,
        onStop: onStopFunction
    });

    this.route('map', {
        path: '/map',
        onBeforeAction:mustLogIn,
        onStop: onStopFunction
    });

    this.route('store', {
        path: '/store',
        onBeforeAction:mustLogIn,
        onStop: onStopFunction
    });

    this.route('inventory', {
        path: '/inventory',
        onBeforeAction:mustLogIn,
        onStop: onStopFunction
    });

    this.route('leaderboard', {
        path: '/leaderboard',
        onBeforeAction:mustLogIn,
        onStop: onStopFunction
    });

    this.route('about', {
        path: '/faq',
        onBeforeAction:mustLogIn,
        onStop: onStopFunction
    });

    this.route('stats', {
        path: '/stats'
    });

});

function mustLogIn(pause){
    $.material.init();
    if (! Meteor.userId()) {
        this.layout("loginLayout");
        this.render('login');
    } else {
        this.next();
    }
}

function onStopFunction(){
    React.unmountComponentAtNode(document.getElementById('yield'));
}
