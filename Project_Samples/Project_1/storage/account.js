// var mobileConv = 551;
// var desktopConv = 154;

// if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/android/i)){
//     CodeBaby.config.set('conversation', mobileConv);
// }else{
//     CodeBaby.config.set('conversation', desktopConv);
// }
// Defines the actions to trigger segments. 
var introButton = $('.doctor');
var hsaWarning = $('.credit-hb-text a');
var chatButton = $('.civa-buttons:eq(4)');
var faqButton = $('.civa-buttons:eq(2)');
var hsaButton = $('.civa-buttons:eq(3)');
introButton.click(function(){
    CodeBaby.conversation.trigger('Intro_Link');
});
hsaWarning.click(function(){
    CodeBaby.conversation.trigger('HSAWarning');
});
chatButton.click(function(){
    CodeBaby.conversation.trigger('Chat_Link');
});
faqButton.click(function(){
    CodeBaby.conversation.trigger('FAQ_Link');
});
hsaButton.click(function(){
    CodeBaby.conversation.trigger('HSA_Link');
});
