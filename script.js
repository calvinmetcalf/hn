var link = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D'http%3A%2F%2Fnews.ycombinator.com%2Fbigrss'&format=json";
var Story = Backbone.Model.extend({
    initialize:function(){
        var comments = this.get("comments");
        var sep = comments.indexOf("=");
        this.set({"id":comments.slice(sep+1)});
    }
    });
var Stories = Backbone.Collection.extend({
     model:Story,
     parse: function(response) {
        return response.query.results.item;
    },
  url:link
});
var stories = new Stories();

var Items = Backbone.View.extend({
    initialize:function(){
        this.collection.fetch();
        this.collection.on("add",function(){this.render()},this);
    },
    el:$("#mainStuff"),
    collection:stories,
    template:Mustache.compile("{{#items}}<div class='row-fluid'><div class='span4'><a href='{{link}}'>{{title}}</a></div><div class='span2'><a class='btn btn-small btn-primary'href='{{comments}}'>comments</a></div></div>{{/items}}"),

    render:function(){
        this.$el.html(this.template({items:this.collection.toJSON()}));
    }
});
var items = new Items();
var Togle = Backbone.View.extend({
     initialize:function(){
         this.render();
        this.collection.on("add",function(){this.loading=false;this.render()},this);
    },
    el:$("#refresh"),
    loading:true,
    collection:stories,
     events: {
     "click":"refresh"
     },
    template:Mustache.compile('<p class="navbar-text"><i class="icon-refresh icon-large{{#loading}} icon-spin{{/loading}}"></i><p>'),
    refresh:function(){
        this.loading = true;
        this.render();
        var _this=this;
        this.collection.fetch({success:function(){_this.loading=false;_this.render();console.log("got it")}});
    },
    render: function(){
        this.$el.html(this.template({loading:this.loading}));
    }
    });
var togle = new Togle();