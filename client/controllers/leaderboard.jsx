var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.leaderboard.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <LeaderBoard />,
          document.getElementById('yield')
        );
    }
}

LeaderBoard = ReactMeteor.createClass({
    startMeteorSubscriptions: function () {
        Meteor.subscribe('leader');
    },
    render: function(){
        return <div>
            <UserList />
        </div>
    }
});

// TODO: Maybe used for groups?
// BoardHeader = ReactMeteor.createClass({
//     render: function(){
//         return <div>
//             <button >Create Group</button>
//         </div>
//     }
// });

UserList = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            users: Meteor.users.find({}, {sort:{'money': -1, 'totalAreas': -1}}).fetch()
        }
    },
    renderUser: function(model, index){
        return <User
            key={model._id}
            userid={model._id}
            username={model.profile ? model.profile.username : "Loading..."}
            money={model.money}
            died={model.timesDied}
            location={model.location ? model.location.name : "Loading..."}
            health={model.health}
            userTime={model.time}
            locationTime={model.location ? model.location.time : 0}
            totalDefense={model.totalDefense}
            totalAttack={model.totalAttack}
            totalAreas={model.totalAreas}
        />
    },
    render: function(){
        return <div className="inner">
            {
                this.state.users.length
            ?
                <div className='container-fluid'>
                    <ReactCSSTransitionGroup transitionName="example">
                        {this.state.users.map(this.renderUser)}
                    </ReactCSSTransitionGroup>
                </div>
            :
                "No Users in leaderboard"
            }
        </div>
    }
});

User = ReactMeteor.createClass({
    getMeteorState: function(){
        var now = new Date().getTime();
        var timeLeft = this.props.userTime - (now - ((60 * 1000) * this.props.locationTime));
        return {
            'timeLeft': timeLeft,
            'isInactive': this.props.money < -1000 || timeLeft < 0
        }
    },
    giftMoney: function(userid){
        var me = Meteor.user();

        bootbox.dialog({
                title: "Gift Money",
                message: '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<form class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="name">Amount</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="gift" name="gift" type="number" placeholder="Money amount" class="form-control input-md"> ' +
                    '<span class="help-block">Enter money amount to gift</span> </div> ' +
                    '</div> ' +
                    // '<div class="form-group"> ' +
                    // '<label class="col-md-4 control-label" for="awesomeness">How awesome is this?</label> ' +
                    // '<div class="col-md-4"> <div class="radio"> <label for="awesomeness-0"> ' +
                    // '<input type="radio" name="awesomeness" id="awesomeness-0" value="Really awesome" checked="checked"> ' +
                    // 'Really awesome </label> ' +
                    // '</div><div class="radio"> <label for="awesomeness-1"> ' +
                    // '<input type="radio" name="awesomeness" id="awesomeness-1" value="Super awesome"> Super awesome </label> ' +
                    // '</div> ' +
                    '</div> </div>' +
                    '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Save",
                        className: "btn-success",
                        callback: function () {
                            var giftAmount = $('#gift').val();
                            Meteor.call('giftMoney', giftAmount, me._id, userid, function(err, username){
                                if (err){
                                    console.error(err.reason);
                                    toastr.error(err.reason);
                                } else {
                                    toastr.success("Gifted money to " + username);
                                }
                            });
                        }
                    }
                }
            }
        );

    },
    render: function(){
        var user = Meteor.user();
        var timeLeft = moment.duration(this.state.timeLeft, 'milliseconds');
        var minutesLeft = Math.floor(timeLeft.asMinutes());

        return <div className='panel panel-default'>

            <div className='panel-heading clearfix'>
                <h3 className='panel-title pull-left'>
                    {this.props.username}
                    {
                        this.state.isInactive
                    ?
                        " -- Inactive"
                    :
                        null
                    }
                </h3>
                <div className='pull-right'>
                    <button className='btn btn-material-blue-grey btn-xs btn-remove-margin' onClick={this.giftMoney.bind(this, this.props.userid)}>Gift Gold</button>
                </div>
            </div>

            <div className="panel-body">
                <div className='row'>
                    <div className="col-md-4"><b>Died:</b>&nbsp;{this.props.died}</div>
                    <div className="col-md-4"><b>Money:</b>&nbsp;{this.props.money}</div>
                    <div className="col-md-4"><b>Location:</b>&nbsp;{this.props.location}</div>
                    <div className="col-md-4"><b>Health:</b>&nbsp;{this.props.health}</div>
                    <div className="col-md-4"><b>Next Search:</b>&nbsp;{minutesLeft} minute(s)</div>
                    <div className="col-md-4"><b>Total Defense:</b>&nbsp;{this.props.totalDefense}</div>
                    <div className="col-md-4"><b>Total Attack:</b>&nbsp;{this.props.totalAttack}</div>
                    <div className="col-md-4"><b>Total Areas:</b>&nbsp;{this.props.totalAreas}</div>
                </div>
            </div>
        </div>
    }
});
