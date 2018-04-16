var mobileConv = 551;
var desktopConv = 548;

if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/android/i)){
    CodeBaby.config.set('conversation', mobileConv);
}else{
    CodeBaby.config.set('conversation', desktopConv);
}
var introButton = $('.start-hb');
var recommendButton = $('.civa-buttons:eq(1)');
var chatButton = $('.civa-buttons:eq(4)');
var faqButton = $('.civa-buttons:eq(2)');
var hsaButton = $('.civa-buttons:eq(3)');
introButton.click(function(){
	CodeBaby.conversation.trigger('Intro_Link');
});
recommendButton.click(function(){
	CodeBaby.conversation.trigger('Recommend_Link');
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
