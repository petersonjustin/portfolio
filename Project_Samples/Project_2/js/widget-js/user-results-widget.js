/***********************/
/* User Results Widget */
/***********************/
Stage.addWidget({
    className: 'results-widget',
    templateId: 'results_widget',
    initialize: function(){
        var self = this;
        self.userOptions = self.model.get('userOptions');
        // Watch the hsa sliders
        self.userOptions.on('change:reportHsa', self.updateHsaBar,self);
        self.userOptions.on('change:deductible change:reportHsa change:copay change:networkLevel', self.updatePremiumBar,self);
        self.userOptions.on('change:deductible', self.hideHsa,self);

        WidgetView.prototype.initialize.call(self);
        
    },
    updateHsaBar: function(){
        var self = this;
        var newHsaValue = self.userOptions.get('reportHsa');
        self.$el.find('.hsa-summary-label span').html(newHsaValue);
        var newHeight = (80 * newHsaValue) / 438;
        self.$el.find('.hsa-total-bar').height(newHeight);
        var newHsaTotal = self.userOptions.get('employerHsaContribution') + newHsaValue;
        self.$el.find('.hsa-input span').html(newHsaTotal);
    },
    updatePremiumBar: function(){
        var self = this;
        var newPremiumValue = self.userOptions.get('deductible') + self.userOptions.get('networkLevel') + self.userOptions.get('copay');
        self.$el.find('.premium-wrapper .premium span').html(newPremiumValue);
        self.$el.find('.premium-wrapper .plan-cost-premium span').html(newPremiumValue);
        var newPremiumHeight =(100 * newPremiumValue) / 900;
        self.$el.find('.premium-bar').height(newPremiumHeight);
        var newPremiumTotal = newPremiumValue - 600;
        if(newPremiumTotal < 0){
            newPremiumTotal = 0;
        }
        self.$el.find('.your-premium-total span').html(newPremiumTotal);
        var hsaTotal = self.userOptions.get('reportHsa');
        var newTotal = hsaTotal + newPremiumTotal;
        // Cheater Functions
        $('.monthly-total span').html(newTotal);
        $('.premium-table span').html(newPremiumTotal);
        $('.summary-hsa span').html(hsaTotal);
    },
    render: function(){
        var self = this;
        self.$el.html( self.template( {userOptions:self.userOptions} ) );
        self.updatePremiumBar();
        self.updateHsaBar();
        self.hideHsa();
        return self;
    }
});

