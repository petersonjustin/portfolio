/*
    UTILS
*/
var stopEventPropagation = function(e) {
    if (!e) {
        if (window.event) {
            var e = window.event;
        } else {
            return false;
        }
    }

    //e.cancelBubble is supported by IE
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works in Firefox.
    if (e.stopPropagation) {
        e.stopPropagation();
        //e.preventDefault();
    }
    return false;
};

/*
    MODELS
*/
var Widget = Backbone.Model.extend({
    defaults: {
        name: null
    }
});
var Widgets = Backbone.Collection.extend({
    model: Widget
});

// Base model that holds all data used w/in the Stage
var CIVA = Backbone.Model.extend();
var civa = new CIVA();

var Faq = Backbone.Model.extend({
    defaults: {
        trigger: '',
        label: 'Blank FAQ'
    }
});

var Faqs = Backbone.Collection.extend({
    model: Faq
});
var faqs = new Faqs();

faqs.add([
    { trigger: 'start', label: "Show me how"},
    { trigger: 'start', label: "Recommend a plan"},
    { trigger: 'start', label: "Frequently Asked Questions"},
    { trigger: 'start', label: "What is a Health Savings Account?"},
    { trigger: 'start', label: "Chat with a Specialist"}
]);

// Model for the user inputs used to filter plans
var UserOptions = Backbone.Model.extend({
    defaults: {
        employerContribution: 600,
        employerHsaContribution: 100,
        reportHsa: 0,
        hsaMaxContribution: 538,
        totalContribution: 900,
        newPremium: null,
        newPremiumTotal: null,
        newTotal: null,

        // user editable
        networkLevel: 300,
        deductible: 350,
        copay: 40,
        premium: null
    }
});
var userOptions = new UserOptions();


// Add sub models to the main base model
civa.set('userOptions',userOptions);
civa.set('faqs',faqs);

/*
    VIEWS
*/
var WidgetView = Backbone.View.extend({

    className: 'codebaby-stage-widget',

    templateId: 'blank_widget_template',

    initialize: function(){
        this.template = _.template( $("#"+this.templateId).html() ),
        this.stage = this.options.stage;
        _.bindAll(this, "render");
        this.render();
    },
    hideHsa: function(){
        var self = this;
        if(self.userOptions.get('deductible') < 500){
            self.$el.find('.monthly-hsa-slider').slider( "option", "disabled", false );
            self.$el.find('.hsa-hiding-wrapper').removeClass('opacity-hide');
            $('.warning-icon').hide();
        }
        if(self.userOptions.get('deductible') >= 500){
            var newValue = 0;
            self.userOptions.set({'reportHsa': newValue});
            self.$el.find('.hsa-hiding-wrapper').addClass('opacity-hide');
            self.$el.find('.monthly-hsa-slider').slider( "option", "value", newValue);
            self.$el.find('.monthly-hsa-slider').slider( "option", "disabled", true );
            $('.warning-icon').show();

        }
    }
});

var StageView = Backbone.View.extend({

    className: 'codebaby-stage',
    
    // defaults
    templateId: 'stage_template',
    defaultPadding: 20,

    initialize: function(){
        this.template = _.template($("#"+this.templateId).html()),
        // A collection to store widget instances in
        this.widgets = new Widgets();

        _.bindAll(this, "addWidget", "getSafeHeight", "resize");

        this.render();
    },

    resize: function(){
        var self = this;
        if(self.resizeTimeout){
            clearInterval(self.resizeTimeout);
        }
        self.resizeTimeout = setTimeout(function(){
            self.$el.css({
                'width':self.getSafeWidth(self.options.width),
                'height':self.getSafeHeight(self.options.height),
                'minWidth':self.options.minWidth,
                'minHeight':self.options.minHeight,
                'maxWidth':self.options.maxWidth,
                'maxHeight':self.options.maxHeight
            }).position({
                my: 'center',
                at: 'center',
                of: window,
                offset: '0 0',
                collision: 'fit'
            });
            self.widgets.each(function(widgetModel){
                widgetModel.get('view').trigger('resize');
            });
            $('#CodeBabyWrapper').position({
                my: 'left bottom',
                at: 'left bottom',
                of: self.$el,
                offset: '0 0',
                collision: 'none'
            });
        },50);
    },

    addWidget: function(widgetData){
        var widgetView = new ( WidgetView.extend(widgetData) )({
            model: this.model,
            stage: this
        });

        var newWidget = new Widget({
            view: widgetView
        });

        this.widgets.add(newWidget);

        this.$el.append(widgetView.render().el);
    },

    getSafeHeight: function(desiredHeight, padding){
        var pad = padding || this.defaultPadding;
        var windowHeight = $(window).height();
        if(desiredHeight !== null){
            if(desiredHeight < 0){
                //User wants to take a certain amount off the window height
                return windowHeight - Math.abs(desiredHeight);
            }else if(desiredHeight < (windowHeight-pad)){
                return desiredHeight;
            }
        }
        return windowHeight-pad;
    },

    getSafeWidth: function(desiredWidth, padding){
        var pad = padding || this.defaultPadding;
        var windowWidth = $(window).width();
        if(desiredWidth !== null){
            if(desiredWidth < 0){
                //User wants to take a certain amount off the window height
                return windowWidth - Math.abs(desiredWidth);
            }else if(desiredWidth < (windowWidth-pad)){
                return desiredWidth;
            }
        }
        return windowWidth-pad;
    },

    close: function(){
        this.$el.detach();
    },

    show: function(){
        this.options.target.append(this.el);
    },

    render: function(){
        var self = this;
        self.$el.html( self.template(self.model.toJSON()) );
        self.options.target.append(self.el);
        self.resize();
        $(window).on('resize',self.resize);
        return self;
    }
});

/*
    BUILD STAGE INSTANCE
*/
var Stage = new StageView({
    model: civa,
    target: $('#main'),
    width: 940,
    height: 645,
    minWidth: 940,
    minHeight: 645,
    maxWidth: 940,
    maxHeight: 645
});

/*
    Add widgets
 */

                                                                        /********************/
                                                                        /* DC Header Widget */
                                                                        /********************/


Stage.addWidget({
    className: 'dc-widget',
    templateId: 'dc_widget',
    initialize: function(){
        var self = this;

        self.userOptions = self.model.get('userOptions');
        self.userOptions.on('change:deductible', self.hideHsa,self);


        WidgetView.prototype.initialize.call(self);

    },
    render: function(){
        var self = this;
        self.$el.html( self.template( {userOptions:self.userOptions} ) );
        self.hideHsa();
        return self;
    }

});


                                                                    
    
                                                                        /******************/
                                                                        /* Proceed Widget */
                                                                        /******************/


Stage.addWidget({
    className: 'proceed-widget',
    templateId: 'proceed_widget',
    initialize: function(){
        var self = this;

        self.userOptions = self.model.get('userOptions');
        self.userOptions.on('change:reportHsa change:deductible',self.render,self);

        WidgetView.prototype.initialize.call(self);

    },
    render: function(){
        var self = this;
        self.$el.html( self.template( {userOptions:self.userOptions} ) );
        return self;
    }
});
                                                                        /**********************/
                                                                        /* Single Plan Widget */
                                                                        /**********************/


Stage.addWidget({
    className: 'plan-widget',
    templateId: 'plan_widget',
    initialize: function(){
        var self = this;

        self.userOptions = self.model.get('userOptions');

        self.userOptions.on('change:deductible change:networkLevel change:copay',self.render,self);

        WidgetView.prototype.initialize.call(self);

    },

    getPlanTotal: function(){
        var self = this;
        var newPlan;
        var userOptions = self.userOptions;
        var networkLevel = userOptions.get('networkLevel');
        var deductible = userOptions.get('deductible');
        var copay = userOptions.get('copay');
        var premium;
        var mapDeductible = {
            200: 5000,
            275: 4000,
            350: 3000,
            425: 2000,
            500: 1000
        };
        var mapCopay = {
            0: 50,
            10: 40,
            20: 30,
            30: 20,
            40: 10,
            50: 0
        };
        var mapNetworkLevel = {
            200: 'Broad',
            250: 'Broader',
            300: 'Broader',
            350: 'Broader',
            400: 'Broadest'
        };
        var actualDeductible = mapDeductible[deductible];
        var actualCopay = mapCopay[copay];
        var actualNetworkLevel = mapNetworkLevel[networkLevel];
        self.$el.find('.actual-deductible span').html(actualDeductible);
        self.$el.find('.actual-copay span').html(actualCopay);
        self.$el.find('.actual-network').html(actualNetworkLevel);
    },
    render: function(){
        var self = this;
 
        // Draw it!
        self.$el.html( self.template( {userOptions:self.userOptions} ) );
        self.getPlanTotal();
        return self;
    }
});