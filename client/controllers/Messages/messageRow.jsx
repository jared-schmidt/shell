MessageRow = ReactMeteor.createClass({
    getMeteorState: function () {
        return {
            userRead: Messages.find({'_id': this.props.messageid, 'usersClosed': Meteor.user()._id}).count() > 0
        };
    },
    deleteMessage: function(id){
        Meteor.call("deleteMessage", id, function(err, messageId){
            if (err){
                console.error(err);
                toastr.error(err.reason, "Error!");
            }
        });
    },
    renderDeleteBtn: function(messageid){
        return <button onClick={this.deleteMessage.bind(this, messageid)} className='btn btn-material-blue-grey btn-xs btn-remove-margin'>
            Delete
        </button>
    },
    render: function(){
        var {messageid, message} = this.props;
        return <div className="panel panel-default">
                <div className="panel-body container-fluid">
                    <div className='row'>
                        <div className="col-xs-4 col-md-4">{message}</div>
                        <div className="col-xs-4 col-md-4">{this.state.userRead ? "You read this" : null}</div>
                        <div className="col-xs-4 col-md-4">{this.renderDeleteBtn(messageid)}</div>
                    </div>
                </div>
        </div>
    }
});
