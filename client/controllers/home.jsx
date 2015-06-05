Template.home.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Home />,
          document.getElementById('yield')
        );
    }
}

Home = ReactMeteor.createClass({
    startMeteorSubscriptions: function () {
        Meteor.subscribe('items');
    },
    getMeteorState: function(){
        var user = Meteor.user();
        var equipment = {};

        if (user){
            for (var key in user.equipment) {
               if (user.equipment.hasOwnProperty(key)) {
                   var obj = user.equipment[key];
                   var item = Items.findOne({'_id': obj});
                   equipment[key] = item;
                }
            }
            return {
                defense: user.totalDefense,
                attack: user.totalAttack,
                equipment: equipment
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

            Left-Hand: {
                    this.state.equipment && this.state.equipment.leftHand
                ?
                    this.state.equipment.leftHand.name
                :
                    "Empty"
                }
            <br />
            Right-Hand: {
                    this.state.equipment && this.state.equipment.rightHand
                ?
                    this.state.equipment.rightHand.name
                :
                    "Empty"
                }
            <br />
            Head: {
                    this.state.equipment && this.state.equipment.head
                ?
                    this.state.equipment.head.name
                :
                    "Empty"
                }
            <br />
            Feet: {
                    this.state.equipment && this.state.equipment.feet
                ?
                    this.state.equipment.feet.name
                :
                    "Empty"
                }
            <br />
            Body: {
                    this.state.equipment && this.state.equipment.body
                ?
                    this.state.equipment.body.name
                :
                    "Empty"
                }

        </div>
    }
});
