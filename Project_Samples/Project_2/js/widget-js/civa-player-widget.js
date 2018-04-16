/**********************/
/* CIVA Player Widget */
/**********************/
Stage.addWidget({
    className: 'civa-widget',
    templateId: 'civa_widget',
    initialize: function(){
        var self = this;

        self.userOptions = self.model.get('userOptions');
        self.faqs = self.model.get('faqs');

        WidgetView.prototype.initialize.call(self);
    },
    events: {
        'click .faq':'triggerFaq',
        'click div.civa-buttons:eq(2)': "toggleFaqPanel",
        'click div.civa-buttons:eq(4)': "toggleChatPanel",
        'click div.civa-buttons:eq(3)': "toggleHsaPanel",
        'click div.faq-close': "closeFaqPanel",
        'click div.chat-close': "closeChatPanel",
        'click div.hsa-close': "closeHsaPanel"
    },

    // Trigger a CodeBaby segment based on the connector clicked
    triggerFaq: function(event){
        stopEventPropagation(event);
        var faqElem = $(event.currentTarget);
        var faqTrigger = faqElem.attr('data-connector');
        try{
            CodeBaby.conversation.trigger(faqTrigger);
        }catch(err){
            console.log(err);
        }
    },

    // Stored selectors
    faqWrapper: null,
    chatWrapper: null,
    hsaWrapper: null,
    faqClose: null,
    chatClose: null,
    hsaClose: null,

    faqPanelOpen: false,
    chatPanelOpen: false,
    hsaPanelOpen: false,

    toggleFaqPanel: function(event){
        stopEventPropagation(event);
        var self = this;
        if(self.chatPanelOpen){
            self.toggleChatPanel();
        }
        self.faqWrapper.animate({
            left: '490px'
        }, 700);
        self.chatWrapper.animate({
            left: '0px'
        }, 500);
        self.hsaWrapper.animate({
            left: '0px'
        }, 500);
    },
    closeFaqPanel: function(event){
        stopEventPropagation(event);
        var self = this;
        self.faqWrapper.animate({
            left: '0px'
        }, 500);
    },
    toggleChatPanel: function(event){
        stopEventPropagation(event);
        var self = this;
        if(self.faqPanelOpen){
            self.toggleFaqPanel();
        }
        self.chatWrapper.animate({
            left: '490px'
        }, 700);
        self.faqWrapper.animate({
            left: '0px'
        }, 500);
        self.hsaWrapper.animate({
            left: '0px'
        }, 500);
    },
    closeChatPanel: function(event){
        stopEventPropagation(event);
        var self = this;
        self.chatWrapper.animate({
            left: '0px'
        }, 500);
    },
    toggleHsaPanel: function(event){
        stopEventPropagation(event);
        var self = this;
        if(self.hsaPanelOpen){
            self.toggleHsaPanel();
        }
        self.hsaWrapper.animate({
            left: '490px'
        }, 700);
        self.chatWrapper.animate({
            left: '0px'
        }, 700);
        self.faqWrapper.animate({
            left: '0px'
        }, 500);
    },
    closeHsaPanel: function(event){
        stopEventPropagation(event);
        var self = this;
        self.hsaWrapper.animate({
            left: '0px'
        }, 500);
    },
    fixFAQButton: function(){
        var self = this;
        self.$el.find('.civa-buttons:eq(3)').css({
            'height': '40px'
        });
        self.$el.find('.civa-buttons:eq(2)').css({
            'height': '40px'
        });
    },
    render: function(){
        var self = this;
        self.$el.html( self.template( {faqs: self.faqs} ) );

        // Storing DOM selectors...
        this.chatWrapper = this.$el.find('div.chat-wrapper');
        this.faqWrapper = this.$el.find('div.faq-wrapper');
        this.hsaWrapper = this.$el.find('div.hsa-wrapper');
        self.fixFAQButton();

        return self;
    }
});