Template.about.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <About />,
          document.getElementById('yield')
        );
    }
}

About = ReactMeteor.createClass({
    render: function(){
        return <div>
            <b>What to do?</b>
            <br/>
            <p>
                &nbsp;Go to the map and change your location.
                <br />
                &nbsp;You will go on a search every X minutes.
                <br />
                &nbsp;Everytime you go on a hunt you will be hurt but also find gold.
            </p>

            <b>How to get health back?</b>
            <br/>
            <p>
                &nbsp;You can get health back:
                    <br />
                    &nbsp;&nbsp;&nbsp;- Using a health potion.
                    <br />
                    &nbsp;&nbsp;&nbsp;- Standing in town (You will get 1 health every minute you are in town).
                <br />
                <b>&nbsp;If you die, you will loss the amount of money you would have gained. So make so you go straight back to town after you died.</b>
            </p>

            <b>How long is a minute?</b>
            <br/>
            <p>
                &nbsp;60 seconds. Game time is real time.
            </p>

            <b>What does gold do?</b>
            <br/>
            <p>
                With the gold, you can:
                    <br />
                    &nbsp;&nbsp;&nbsp;- Buy stuff.
                    <br />
                    &nbsp;&nbsp;&nbsp;- Get more gold then everyone else.
            </p>

            <b>What is a Sowrd?</b>
            <br/>
            <p>
                &nbsp;You shouldn't have to ask.
            </p>

            <b>Why is it called Shell?</b>
            <br/>
            <p>
                &nbsp;Because.
            </p>

            <b>What is a area?</b>
            <br/>
            <p>
                <i>In Progress...</i>
            </p>

            <b>Stuff Broke!</b>
            <br/>
            <p>
                Report what happened.
            </p>

            <b>Feature Request:</b>
            <br/>
            <p>
                <i>In Progress...</i>
            </p>

            <b>Want to help?</b>
            <br/>
            <p>
                Ask
            </p>

        </div>
    }
});
