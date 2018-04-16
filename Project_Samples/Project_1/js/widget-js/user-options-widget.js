/*******************************/
/* User Options Section Widget */
/*******************************/

Stage.addWidget({
    className: 'user-options-widget',
    templateId: 'user_options_widget',
    sliders: {},
    initialize: function(){
        var self = this;

        _.bindAll(this,'reportHsa','render','updateDisplay','setMaxHsaContribution','updatePremium','updateHsaUserContributionBar');

        self.userOptions = self.model.get('userOptions');

        self.userOptions.on('change:reportHsa', self.reportHsa);

        self.userOptions.on('change',self.updateDisplay);
        self.userOptions.on('change:networkLevel change:deductible change:copay',self.updatePremium);

        self.userOptions.on('change:premium',self.setMaxHsaContribution);
        self.userOptions.on('change:employerCredit',self.setMaxHsaContribution);

        WidgetView.prototype.initialize.call(self);
    },
    reportHsa: function(){
        this.$el.find('.hsa-value span').html(this.userOptions.get('reportHsa'));
    },
    updateDisplay: function(){
        var self = this;
        var sliders = self.sliders;
        sliders.networkSlider.slider('option','value',self.userOptions.get('networkLevel'));
        sliders.deductibleSlider.slider('option','value',self.userOptions.get('deductible'));
        sliders.copaySlider.slider('option','value',self.userOptions.get('copay'));

        // Warning notification
        var warningIcon = $('.warning-icon');
        var hsaDisable = $('.hsa-disable');
        var rightCover = $('.right-column-cover');
        if(self.userOptions.get('deductible') <= 200){
            warningIcon.fadeIn();
            hsaDisable.css('opacity','.1');
            rightCover.fadeIn();
        }else{
            hsaDisable.css('opacity','1');
            warningIcon.fadeOut();
            rightCover.fadeOut();
        }
        // Credit Note
        var premiumValue = this.userOptions.get('premium');
        var creditNote = $('.credit-hb-wrapper');
        if(premiumValue < 400){
            creditNote.fadeIn();
        }else{
            creditNote.fadeOut();
        }

        self.updateHsaUserContributionBar();
    },
    updatePremium: function(){
        var newPremium = this.userOptions.get('networkLevel') + this.userOptions.get('deductible') + this.userOptions.get('copay');
        this.userOptions.set('premium',newPremium);
        this.sliders.premiumLevelSlider.slider('option','value',newPremium);
    },
    setMaxHsaContribution: function(){
        var premiumValue = this.userOptions.get('premium');
        var credit;
        if(premiumValue < this.userOptions.get('maxEmpolyerPremium')){
            credit = this.userOptions.get('maxEmpolyerPremium') - premiumValue;
        }else{
            credit = this.userOptions.get('employerCredit');
        }
        var newMax = 3200 - (this.userOptions.get('hsa')*12) - credit;
        newMax = (newMax < 0) ? 2000 : newMax;// Hack to prevent a bad math error
        this.sliders.monthlyHsaSlider.slider('option','max',newMax);
        this.$('.hsa-max span').html(newMax);
    },
    updateHsaUserContributionBar: function(){
        var self = this;
        _.defer(function(){
            // Update the blue bar
            var dragHandle = self.sliders.monthlyHsaSlider.find('a');
            var newWidth = dragHandle.position().left + (dragHandle.outerWidth()/2);
            self.$('.hsa-slider-blue-bar').width(newWidth);
        });
    },
    render: function(){
        var self = this;
        self.$el.html( self.template({userOptions:self.userOptions}) );
        self.sliders.networkSlider = self.$el.find( ".network-slider" ).slider({
            min: 100,
            max: 500,
            step: 100,
            value: self.userOptions.get('networkLevel'),
            slide: function(event, ui){
                self.userOptions.set('networkLevel', ui.value);
            }
        });
        self.sliders.deductibleSlider = self.$el.find( ".deductible-slider" ).slider({
            min: 100,
            max: 400,
            step: 75,
            value: self.userOptions.get('deductible'),
            slide: function(event, ui){
                self.userOptions.set('deductible', ui.value);
            }
        });
        self.sliders.copaySlider = self.$el.find( ".copay-slider" ).slider({
            min: 0,
            max: 50,
            step: 10,
            value: self.userOptions.get('copay'),
            slide: function(event, ui){
                self.userOptions.set('copay', ui.value);
            }
        });
        self.sliders.monthlyHsaSlider = self.$el.find( ".monthly-hsa-slider").slider({
            min: 0,
            max: 2000,
            step: 1,
            value: self.userOptions.get('hsa'),
            slide: function(event, ui){
                self.userOptions.set('hsa', ui.value);
            }
        });
        self.sliders.premiumLevelSlider = self.$el.find( ".premium-level-slider" ).slider({
            min: 200,
            max: 950,
            step: 1,
            value: self.userOptions.get('premium'),
            slide: function(event, ui){
                self.userOptions.set('premium', ui.value);

                if(ui.value < 300){
                    self.userOptions.set('networkLevel',100);
                    self.userOptions.set('deductible',175);
                    self.userOptions.set('copay',0);
                }else if(ui.value >= 300 && ui.value < 400){
                    self.userOptions.set('networkLevel',200);
                    self.userOptions.set('deductible',175);
                    self.userOptions.set('copay',20);
                }else if(ui.value >= 400 && ui.value < 600){
                    self.userOptions.set('networkLevel',200);
                    self.userOptions.set('deductible',250);
                    self.userOptions.set('copay',10);
                }else{
                    self.userOptions.set('networkLevel',400);
                    self.userOptions.set('deductible',325);
                    self.userOptions.set('copay',40);
                }
            }
        });
        self.hideHsa();
        self.setMaxHsaContribution();
        self.updateHsaUserContributionBar();
        return self;
    }
});