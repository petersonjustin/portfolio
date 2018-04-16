/*******************************/
/* User Options Section Widget */
/*******************************/

Stage.addWidget({
    className: 'user-options-widget',
    templateId: 'user_options_widget',
    initialize: function(){
        var self = this;

        self.userOptions = self.model.get('userOptions');

        self.userOptions.on('change:reportHsa', self.reportHsa,self);
        self.userOptions.on('change:deductible', self.deductible,self);
        self.userOptions.on('change:deductible', self.hideHsa,self);

        WidgetView.prototype.initialize.call(self);
    },
    reportHsa: function(){
        this.$el.find('.hsa-value span').html(this.userOptions.get('reportHsa'));
    },
    premiumTotal: function(){
        this.$el.find('.premium span').html(this.userOptions.get('deductible') + this.userOptions.get('copay') + this.userOptions.get('networkLevel'));
    },
    render: function(){
        var self = this;
        self.$el.html( self.template({userOptions:self.userOptions}) );
        self.$el.find( ".network-slider" ).slider({
            min: 200,
            max: 400,
            step: 50,
            value: self.userOptions.get('networkLevel'),
            change: function(event, ui){
                self.userOptions.set('networkLevel', ui.value);
            }
        });
        self.$el.find( ".deductible-slider" ).slider({
            max: 500,
            min: 200,
            step: 75,
            value: self.userOptions.get('deductible'),
            change: function(event, ui){
                self.userOptions.set('deductible', ui.value);
                
            }
        });
        self.$el.find( ".copay-slider" ).slider({
            max: 50,
            min: 0,
            step: 10,
            value: self.userOptions.get('copay'),
            change: function(event, ui){
                self.userOptions.set('copay', ui.value);
            }
        });
        self.$el.find( ".monthly-hsa-slider").slider({
            min: 0,
            max: parseInt(self.userOptions.get('hsaMaxContribution'),10) - parseInt(self.userOptions.get('employerHsaContribution'),10),
            step: 1,
            value: self.userOptions.get('reportHsa'),
            slide: function(event, ui){
                self.userOptions.set('reportHsa', ui.value);
            }

        });
        self.hideHsa();
        return self;

    }
});