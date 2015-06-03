Template.home.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Home />,
          document.getElementById('yield')
        );
    }
}

Home = ReactMeteor.createClass({
    getMeteorState: function(){
        var user = Meteor.user();

        if (user){
            return {
                defense: user.totalDefense,
                attack: user.totalAttack,
                equipment: user.equipment
            }
        } else {
            return {
                defense: "Loading...",
                attack: "Loading...",
                equipment: "Loading..."
            }
        }

    },
    render: function(){
        return <div>
            Defense: {this.state.defense}
            <br />
            Attack: {this.state.attack}

            <br />
            <br />

            Left-Hand: {this.state.equipment.leftHand ? "Equiped" : "Empty"}
            <br />
            Right-Hand: {this.state.equipment.rightHand ? "Equiped" : "Empty"}
            <br />
            Head: {this.state.equipment.head ? "Equiped" : "Empty"}
            <br />
            Feet: {this.state.equipment.feet ? "Equiped" : "Empty"}
            <br />
            Body: {this.state.equipment.body ? "Equiped" : "Empty"}

        </div>
    }
});
