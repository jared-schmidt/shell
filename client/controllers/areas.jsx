Template.areas.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Areas />,
          document.getElementById('yield')
        );
    }
}

Areas = ReactMeteor.createClass({
    getMeteorState: function(){
        var user = Meteor.user();
        var areas = [];
        var total = 0;

        if (user){
            areas = user.areas;
            total = user.totalAreas;
        }

        return {
            areas: areas,
            totalAreas: total
        }
    },
    renderArea: function(index){
        return <Area
            key={index}
            index={index}
        />
    },
    render: function(){
        var lands = [];
        for (var i=0;i<this.state.totalAreas;i++){
            lands.push(this.renderArea(i));
        }

        return <div>

            <div>Total Areas: {this.state.totalAreas}</div>
            <hr />

            {lands}

        </div>
    }
});

Area = ReactMeteor.createClass({
    componentDidMount: function () {
        $.material.radio();
    },
    renderRadioButton: function(label, index){
        var inputName = "areaButtons" + index;
        return <div className="radio radio-primary">
            <label>
                <input type="radio" name={inputName} />
                <span className="radio-label">{label}</span>
            </label>

        </div>
    },
    render: function(){
        return <div className='col-xs-12 col-md-3'>
            <div className="well">
                {this.renderRadioButton('Farm', this.props.index)}
                {this.renderRadioButton('Water', this.props.index)}
                {this.renderRadioButton('Town', this.props.index)}
            </div>
        </div>
    }
});
