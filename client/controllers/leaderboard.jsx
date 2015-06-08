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
        return {
            'timeLeft': this.props.userTime - (now - ((60 * 1000) * this.props.locationTime))
        }
    },
    render: function(){
        var user = Meteor.user();
        var timeLeft = moment.duration(this.state.timeLeft, 'milliseconds');
        var minutesLeft = Math.floor(timeLeft.asMinutes());

        return <div className='panel panel-default'>

            <div className='panel-heading clearfix'>
                <h3 className='panel-title pull-left'>
                    {this.props.username}
                </h3>
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
