Template.about.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <About />,
          document.getElementById('yield')
        );
    }
}

About = ReactMeteor.createClass({
    createCard: function(card){
        return <div className='panel panel-default'>

            <div className='panel-heading clearfix'>
                <h3 className='panel-title pull-left'>
                    {card.title}
                </h3>
            </div>

            <div className="panel-body" dangerouslySetInnerHTML={{__html: card.body}} >

            </div>
        </div>
    },
    render: function(){
        var whatToDo = {
            "title": "What To Do?",
            "body": "Go to the map and change your location. <br /> You will go on a search every X minutes. <br /> Everytime you go on a hunt you will be hurt but also find gold."
        }

        var howToGetHealth = {
            "title": "How to get health back?",
            "body": "1. Using a health potion. <br /> 2. Standing in town. (You will get 3 health every minute you are in town). <br /> <b>If you die, you will loss the amount of money you would have gained. So make so you go straight back to town after you died. <br /> YOU CAN HAVE NEGATIVE MONEY!</b>"
        }

        var timeOfMinute = {
            "title": "How long is a minute?",
            "body": "60 seconds. Game time is real time."
        }

        var whatDoesMoneyDo = {
            "title": "What does money do?",
            "body": "1. Buy stuff to help you. <br /> 2. Get higher on the leaderboard"
        }

        var whyShell = {
            "title": "Why is it called Shell?",
            "body": "Because, why not?"
        }

        var whatIsAnArea = {
            "title": "What is an area?",
            "body": "They raise you up in the leaderboard. <i>In Progress</i>"
        }

        var possibleIdeas = {
            "title": "Possible Ideas",
            "body": "See <a href='https://trello.com/b/NhwzJXmg/shell' target='_blank'>Trello</a>"
        }

        return <div>
            {this.createCard(whatToDo)}
            {this.createCard(howToGetHealth)}
            {this.createCard(timeOfMinute)}
            {this.createCard(whatDoesMoneyDo)}
            {this.createCard(whyShell)}
            {this.createCard(whatIsAnArea)}
            {this.createCard(possibleIdeas)}
        </div>
    }
});
