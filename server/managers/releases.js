Meteor.methods({
    'getReleases': function(){
        var url = "https://api.github.com/repos/jared-schmidt/shell/releases?access_token=10b1f857976c08b3f4c5e27d53a965d703329f9b";

        var options = {
            'headers': {
                "user-agent": "Meteor1.0"
            }
        }

        var resp = HTTP.get(url, options);

        return resp.data;
    }
});
