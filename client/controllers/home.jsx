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
    getItemInfo: function(itemid, location){
        if(itemid){
            var item = Items.findOne({"_id": itemid});
            if(item){
                return item.name;
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
                    this.getItemInfo(this.state.equipment.leftHand) 
                : 
                    "Empty"
                }
            <br />
            Right-Hand: {
                    this.state.equipment && this.state.equipment.rightHand 
                ? 
                    this.getItemInfo(this.state.equipment.rightHand) 
                : 
                    "Empty"
                }
            <br />
            Head: {
                    this.state.equipment && this.state.equipment.head 
                ? 
                    this.getItemInfo(this.state.equipment.head) 
                : 
                    "Empty"
                }
            <br />
            Feet: {
                    this.state.equipment && this.state.equipment.feet
                ? 
                    this.getItemInfo(this.state.equipment.feet) 
                : 
                    "Empty"
                }
            <br />
            Body: {
                    this.state.equipment && this.state.equipment.body 
                ? 
                    this.getItemInfo(this.state.equipment.body) 
                : 
                    "Empty"
                }
        </div>
    }
});
