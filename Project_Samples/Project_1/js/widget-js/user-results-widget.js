/***********************/
/* User Results Widget */
/***********************/
Stage.addWidget({
    className: 'results-widget',
    templateId: 'results_widget',
    initialize: function(){
        var self = this;
        _.bindAll(this,'render','updateValues');
        self.userOptions = self.model.get('userOptions');

        // Watch the sliders (aka changes to user options model)
        self.userOptions.on('change', self.updateValues);

        WidgetView.prototype.initialize.call(self);
    },
    getEmployerPremium: function(){
        var premiumValue = this.userOptions.get('premium');
        if(premiumValue < this.userOptions.get('maxEmpolyerPremium')){
            return premiumValue;
        }else{
            return this.userOptions.get('maxEmpolyerPremium');
        }
    },
    getCredit: function(){
        var premiumValue = this.userOptions.get('premium');
        var credit;
        if(premiumValue < this.userOptions.get('maxEmpolyerPremium')){
            credit = this.userOptions.get('maxEmpolyerPremium') - premiumValue;
        }else{
            credit = this.userOptions.get('employerCredit');
        }
        if(credit > 0){
            this.$('.credit-label').addClass('green-credit');
        }else{
            this.$('.credit-label').removeClass('green-credit');
        }
        return credit;
    },
    getUserPremium: function(){
        var premiumValue = this.userOptions.get('premium');
        if(premiumValue > this.userOptions.get('maxEmpolyerPremium')){
            return premiumValue - this.userOptions.get('maxEmpolyerPremium');
        }else{
            return 0;
        }
    },
    getUserHsaContribution: function(){
        return this.userOptions.get('hsa');
    },
    updateValues: function(){
        this.$('.employer-premium span').html(this.getEmployerPremium());
        this.$('.employer-hsa-contribution span').html(this.userOptions.get('empolyerHsaContribution'));
        this.$('.employer-credit span').html(this.getCredit());
        this.$('.employer-total span').html(this.getEmployerPremium() + this.userOptions.get('empolyerHsaContribution') + this.getCredit());
        this.$('.user-premium span').html(this.getUserPremium());
        this.$('.user-hsa span').html(round(this.userOptions.get('hsa')/12,0));
        this.$('.user-total span, .user-payment span').html(round(this.getUserPremium() + this.userOptions.get('hsa')/12,0));
        this.$('.employer-cont-hsa span').html((this.getCredit() + this.userOptions.get('empolyerHsaContribution'))*12);
        this.$('.credit-total span').html(this.getCredit()*12);
        this.$('.deductible-pointer span').html(deductibleMap[this.userOptions.get('deductible')]);
        this.$('.hsa-text span').html(this.userOptions.get('hsa'));

        // Update graph
        this.updateEmployerHsaGraph();
        this.userHsaBar();
        this.updateDeductiblePointer();
        this.updateHsaPointer();
    },
    updateEmployerHsaGraph: function(){
        var yearlyContribution = (this.getCredit() + this.userOptions.get('empolyerHsaContribution'))*12;
        var newHeight = (360*yearlyContribution)/6000;
        this.$('.employer-hsa-graph').css({height: newHeight});
    },
    userHsaBar: function(){
        var yearlyHSA = this.userOptions.get('hsa') + ((this.userOptions.get('empolyerHsaContribution') + this.getCredit())*12);
        var newHeight = (360*yearlyHSA)/6000;
        this.$('.your-hsa-graph').css({height: newHeight});
    },
    updateDeductiblePointer: function(){
        var deductible = deductibleMap[this.userOptions.get('deductible')];
        var newBottom = (360*deductible)/6000;
        this.$('.deductible-pointer-wrapper').stop().animate({bottom: newBottom});
    },
    updateHsaPointer: function(){
        var deductible = this.userOptions.get('hsa') + ((this.userOptions.get('empolyerHsaContribution') + this.getCredit())*12);
        var newBottom = (360*deductible)/6000;
        this.$('.hsa-pointer-wrapper').css({bottom: newBottom});
    },
    creditFiller: function(){
        var self = this;
        // To call from CDM:
        // Stage.widgets.get({'cid':'c12'}).get('view').creditFiller();
        var creditText = $('.credit-text');
        var bar1 = $('.credit-bar-1');
        var bar2 = $('.credit-bar-2');
        var bar3 = $('.credit-bar-3');
        var barFiller = $('.credit-filler');
        var activateEffect = $('.credit-hb-text a');
        var bar1Move = function(){
            bar1.animate({
                'width': '35px'
            }, 200);
        };
        var bar2Move = function(){
            bar2.animate({
                'bottom': '-400px',
                'height': '310px'
            }, 600);
        };
        var bar3Move = function(){
            bar3.animate({
                'width': '101px'
            }, 300);
        };
        var bar4Move = function(){
            var newHeight = (360*(self.getCredit()*12))/6000;
            barFiller.animate({
                'height': newHeight
            }, 500);
        };
        creditText.fadeIn();
        bar1Move();
        _.delay(bar2Move,200);
        _.delay(bar3Move,800);
        _.delay(bar4Move,1100);
    },
    clearCreditFiller: function(){
        var creditText = $('.credit-text');
        var bar1 = $('.credit-bar-1');
        var bar2 = $('.credit-bar-2');
        var bar3 = $('.credit-bar-3');
        var barFiller = $('.credit-filler');
        var activateHide = $('div.credit-options');
        var bar1Hide = function(){
            bar1.css({
                'width': '0px'
            });
        };
        var bar2Hide = function(){
            bar2.css({
                'bottom': '-100px',
                'height': '0px'
            });
        };
        var bar3Hide = function(){
            bar3.css({
                'width': '0px'
            });
        };
        var bar4Hide = function(){
            barFiller.css({
                'height': '0px'
            });
        };
        creditText.hide();
        bar1Hide();
        bar2Hide();
        bar3Hide();
        bar4Hide();
    },
    render: function(){
        var self = this;
        self.$el.html( self.template({
            view: self,
            userOptions: self.userOptions,
            employerPremium: self.getEmployerPremium(),
            credit: self.getCredit(),
            userPremium: self.getUserPremium(),
            userHsaContribution: self.getUserHsaContribution()
        }) );
        // self.updatePremiumBar();
        // self.updateHsaBar();
        self.hideHsa();
        self.updateEmployerHsaGraph();
        self.userHsaBar();
        self.updateDeductiblePointer();
        self.updateHsaPointer();
        self.$('.credit-label').click(function(){
            self.creditFiller();
            return false;
        });
        self.$('div.credit-options').click(function(){
            self.clearCreditFiller();
            var creditReminder = $('.credit-text');
            creditReminder.show();
            return false;
        });
        return self;
    }
});

