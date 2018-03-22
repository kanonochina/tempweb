(function(){function parseUrl(url){var foo;try{foo=url.split('?')[1];if(!foo)return{};foo=foo.split('#')[0].split('&');}catch(err){return{};};var dict={};var elem=[];for(var i=foo.length-1;i>=0;i--){elem=foo[i].split('=');dict[elem[0]]=elem[1];};return dict;}
function setCookie(c_name,value,exdays){var exdate=new Date();exdate.setDate(exdate.getDate()+exdays);var c_value=escape(value)+((exdays==null)?"":"; expires="+exdate.toUTCString());document.cookie=c_name+"="+c_value+"; path=/";}
function getCookie(c_name,c_subname){var i,x,y,ac=document.cookie.split(";");for(i=0;i<ac.length;i++){var ix=ac[i].indexOf("=");x=ac[i].substr(0,ix);y=ac[i].substr(ix+1);x=x.replace(/^\s+|\s+$/g,"");if(x==c_name){if(c_subname){ac=y.split("&");for(i=0;i<ac.length;i++){x=ac[i].substr(0,ac[i].indexOf("="));y=ac[i].substr(ac[i].indexOf("=")+1);x=x.replace(/^\s+|\s+$/g,"");if(x==c_subname){return unescape(y);}}}else{return unescape(y);}}}}
function getHitBaseUrl(){var hiturl='https://www.sparning.com/hit/';if('https:'==document.location.protocol){hiturl=hiturl.replace('http://','https://');}else{hiturl=hiturl.replace('https://','http://');}
return hiturl;}
function hitregistererror(hiturl){if(window.hitregistered)return;var img=document.createElement('img');img.setAttribute('src',hiturl);img.setAttribute('width','1px');img.setAttribute('height','1px');document.body.appendChild(img);}
function appendScript(scriptUrl){var s=document.createElement('script');s.setAttribute('type','text/javascript');s.setAttribute('src',scriptUrl);s.setAttribute('async','async');document.getElementsByTagName('head')[0].appendChild(s);}
function runByCond(cond,cb){var handle=window.setInterval(function(){var res=cond();if(res){cb();window.clearInterval(handle);}},2000);};function actionUrl(name){return getHitBaseUrl().replace("hit","misc")+'?action='+name+'&callback=lmpost.defaultCb&ResponseType=json';}
window.hitregistersuccess=function(data){if(data.hituid=='00000000-0000-0000-0000-000000000000'){window.hitregistered=true;lmpost.options.hituid=data.hituid;return;};if(lmpost.virginHit){delete lmpost.virgin;var scriptUrl=getHitBaseUrl()+'fpt.js';appendScript(scriptUrl);runByCond(function(){return window.Fingerprint;},function(){var hash=new Fingerprint().get(),fpUrl=actionUrl('regfp')+'&uid='+lmpost.options.hituid+'&fpt='+hash;appendScript(fpUrl);},2000);}
if(window.ga){ga(function(){var trackers=ga.getAll();for(var i in trackers){if(trackers.hasOwnProperty(i)){var trackingId=trackers[i].get('trackingId'),clientId=trackers[i].get('clientId');clientId&&(trackingId!=='UA-45594311-2')&&appendScript(actionUrl('regga')+'&uid='+data.hituid+'&gaclient='+clientId+'&gatracker='+trackingId);}}});}
if(data.va_token){var va=window._va||{},d=document;window._va=va;va.key=data.va_token;va.starttime=(new Date()).getTime();var ns=d.createElement('script');ns.async=true;ns.src=d.location.protocol+'//d23p9gffjvre9v.cloudfront.net/api/core.js';var es=d.getElementsByTagName('script')[0];es.parentNode.insertBefore(ns,es);}
var pingUrl=actionUrl('ping1')+"&uid="+data.hituid;appendScript(pingUrl);setCookie('hit=uid',data.hituid,36500);if(data.campaignid){setCookie('campaignid',data.campaignid,36500);}
if(data.did)runByCond(function(){return window.jQuery;},function(){jQuery('.lmpost_did').html(data.did).attr('href','tel:1-'+data.did)});if(window.lmpost&&window.lmpost.options){if(data.campaignid){window.lmpost.options.campaignid=data.campaignid;}
window.lmpost.options.hituid=data.hituid;}
if(data.redirect){window.location=data.redirect;}
window.hitregistered=true;}
function registerHit(){if(!window.lmpost){window.lmpost={};var merge=function(src,dst,keys){for(var i=0;i<keys.length;i++){var k=keys[i],val=src[k];if(val)dst[k]=src[k];}};var opts=window.lmpost.options={},mergeKeys=['subId','keyword','hituid','domain','form'];if(window.opts){merge(window.opts,opts,mergeKeys);}
if(window.LeadsB2C&&window.LeadsB2C.options){merge(window.LeadsB2C.options,opts,mergeKeys);}}
lmpost.defaultCb=function(){};var uid=getCookie('hit','uid');if(!uid){lmpost.virginHit=true;}
var qs=parseUrl(window.location.href),p=parseUrl(document.referrer);var keyword,cid=qs['c'],sid=qs['SID'];if(!cid)cid=getCookie('campaignid');if(!cid)cid=window.lmpost&&window.lmpost.options&&window.lmpost.options.campaignid;if(!cid)cid=window.opts&&window.opts.campaignid;if(!cid)cid=window.LeadsB2C&&window.LeadsB2C.options&&window.LeadsB2C.options.campaignid;if(cid){setCookie('campaignid',cid,365);if(window.lmpost&&window.lmpost.options){window.lmpost.options.campaignid=cid;}}
if(/google.com/.test(document.referrer)&&p.q)keyword=p.q;if(!keyword&&/yahoo.com/.test(document.referrer)&&p.p)keyword=p.p;if(!keyword&&/bing.com/.test(document.referrer)&&p.q)keyword=p.q;if(!keyword)keyword=qs.keyword;if(!keyword)keyword=window.lmpost&&window.lmpost.options&&window.lmpost.options.keyword;if(keyword&&window.lmpost&&window.lmpost.options)window.lmpost.options.keyword=keyword;var subid=qs['subid'];if(!subid)subid=qs['v1'];if(!subid)subid=window.lmpost&&window.lmpost.options&&window.lmpost.options.subid;if(subid&&window.lmpost&&window.lmpost.options)window.lmpost.options.subid=subid;var opts=(window.lmpost&&window.lmpost.options)||{},vars={};for(var i=2;i<=4;i++){var vkey='v'+i;vars[vkey]=qs[vkey]||opts[vkey];}
var msguid=qs['msguid'];var msgsid;for(var i in qs){if(i.length==6&&!qs[i]){msgsid=i;break;}};var hiturl=getHitBaseUrl();hiturl+='?clienturl='+escape(location.href)+'&rnd='+Math.random()+'&callback=hitregistersuccess&responsetype=json'
+'&o='+(new Date()).getTimezoneOffset()+'&ReferrerURL='+escape(document.referrer);if(uid){hiturl+='&uid='+escape(uid);}
if(cid){hiturl+='&c='+escape(cid);}
if(sid){hiturl+='&sid='+escape(sid);}
if(subid){hiturl+='&subid='+escape(subid);}
for(var i=2;i<=4;i++){var vkey='v'+i;if(vars[vkey])hiturl+='&'+vkey+'='+escape(vars[vkey]);}
if(keyword){hiturl+='&keyword='+escape(keyword);}
if(msguid){hiturl+='&msguid='+escape(msguid);}
if(msgsid){hiturl+='&msgsid='+escape(msgsid);}
appendScript(hiturl);setTimeout(function(){hitregistererror(hiturl);},10000);}
if(!window.hitcorejsalreadyfired){window.hitcorejsalreadyfired=1;registerHit();}})();