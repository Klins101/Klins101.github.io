!function(a){"use strict";a.fn.fitVids=function(b){var c={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var d=document.head||document.getElementsByTagName("head")[0],e=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",f=document.createElement("div");f.innerHTML='<p>x</p><style id="fit-vids-style">'+e+"</style>",d.appendChild(f.childNodes[1])}return b&&a.extend(c,b),this.each(function(){var b=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];c.customSelector&&b.push(c.customSelector);var d=".fitvidsignore";c.ignore&&(d=d+", "+c.ignore);var e=a(this).find(b.join(","));e=e.not("object object"),e=e.not(d),e.each(function(){var b=a(this);if(!(b.parents(d).length>0||"embed"===this.tagName.toLowerCase()&&b.parent("object").length||b.parent(".fluid-width-video-wrapper").length)){b.css("height")||b.css("width")||!isNaN(b.attr("height"))&&!isNaN(b.attr("width"))||(b.attr("height",9),b.attr("width",16));var c="object"===this.tagName.toLowerCase()||b.attr("height")&&!isNaN(parseInt(b.attr("height"),10))?parseInt(b.attr("height"),10):b.height(),e=isNaN(parseInt(b.attr("width"),10))?b.width():parseInt(b.attr("width"),10),f=c/e;if(!b.attr("id")){var g="fitvid"+Math.floor(999999*Math.random());b.attr("id",g)}b.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*f+"%"),b.removeAttr("height").removeAttr("width")}})})}}(window.jQuery||window.Zepto),jQuery(document).ready(function(a){function b(){if(r.hasClass("open"))r.trigger("close"),r.removeClass("open"),a(this).children("span").text(objectL10n.openPrimaryMenu),a(this).attr("aria-expanded","false"),a("#menu-primary-items ul, .menu-unset ul").removeAttr("style"),a(".menu-item-has-children").each(function(){a(this).hasClass("open")&&a(this).removeClass("open")}),g(),d(),a(window).unbind("scroll",k);else{r.addClass("open"),r.trigger("open"),a(this).children("span").text(objectL10n.closePrimaryMenu),a(this).attr("aria-expanded","true");var b=window.innerWidth;if(b>549&&950>b){var c=0;s.find(".social-media-icons").length&&(c=s.find(".social-media-icons").find("ul").outerHeight());var e=y.outerHeight(),f=r.outerHeight(),h=u.height(),i=h+f+c+e;i>window.innerHeight&&t.css("min-height",i+"px"),a(window).scroll(k)}}}function c(){var b=a(this).parent();b.hasClass("open")?(b.removeClass("open"),a(this).children("span").text(objectL10n.openChildMenu),a(this).attr("aria-expanded","false")):(b.addClass("open"),a(this).children("span").text(objectL10n.closeChildMenu),a(this).attr("aria-expanded","true"),A=!1),g()}function d(){var b=window.innerWidth;if(b>549&&950>b){var c=0;s.find(".social-media-icons").length&&(c=s.find(".social-media-icons").find("ul").outerHeight());var d=y.outerHeight(),e=r.outerHeight();a("#menu-primary").css("top",e+c+24+"px"),u.css("top",e+c+d+48+"px")}else a("#sidebar-primary, #menu-primary").css("top","")}function e(){var b=window.innerWidth;if(b>549&&950>b){var c=a(this).next(),d=0;c.children().each(function(){d+=a(this).height()});var e=u.css("top"),f=t.css("min-height");e=parseInt(e),f=parseInt(f);var g=a(this).parent();g.hasClass("open")?(u.css("top",e+d+"px"),t.css("min-height",f+d+"px")):(u.css("top",e-d+"px"),t.css("min-height",f-d+"px"))}}function f(){window.innerWidth>949&&r.hasClass("open")&&b()}function g(){t.css("min-height","");var a=v.height();x.length>0&&(a-=x.children("a").height()),a>window.innerHeight&&t.css("min-height",a+"px")}function h(){if(window.innerWidth<950){r.removeAttr("style")}}function i(){var b=a("#overflow-container"),c=window.innerWidth,d=a(window).height(),e=b.height(),f=r.outerHeight(),g=a(window).scrollTop(),h=a("body").hasClass("admin-bar")?a("#wpadminbar").height():0;950>c||(f+h>d&&1!=A?g>z?n?(n=!1,B=r.offset().top>0?r.offset().top-h:0,r.attr("style","top: "+B+"px;")):!o&&g+d>f+r.offset().top&&e>f+h?(o=!0,r.attr("style","position: fixed; bottom: 0;")):f+h>d&&!o&&(B=r.offset().top>0?r.offset().top-h:0,r.attr("style","top: "+B+"px;")):z>g?o?(o=!1,B=r.offset().top>0?r.offset().top-h:0,r.attr("style","top: "+B+"px;")):!n&&g>0&&g+h<r.offset().top&&(n=!0,r.attr("style","position: fixed;")):n=o=!1:(n=!0,A=!0,r.attr("style","position: fixed;")),z=g)}function j(){h(),i()}function k(){var c=u.offset().top+u.height(),d=a(window).scrollTop();d>c+50&&b()}function l(){"object-fit"in document.body.style||a(".featured-image").each(function(){if(!a(this).parent(".post").hasClass("ratio-natural")){var b=a(this).children("img").add(a(this).children("a").children("img"));if(b.hasClass("no-object-fit"))return;b.addClass("no-object-fit"),b.outerWidth()<a(this).outerWidth()&&b.css({width:"100%","min-width":"100%","max-width":"100%",height:"auto","min-height":"100%","max-height":"none"}),b.outerHeight()<a(this).outerHeight()&&b.css({height:"100%","min-height":"100%","max-height":"100%",width:"auto","min-width":"100%","max-width":"none"})}})}function m(){a(".infinite-wrap").children(".entry").detach().appendTo(w),a(".infinite-wrap, .infinite-loader").remove()}var n,o,p,q=a(".toggle-dropdown"),r=a("#main-sidebar"),s=a("#site-header"),t=a("#main"),u=a("#sidebar-primary"),v=a("#overflow-container"),w=a("#loop-container"),x=a("#header-image"),y=a(a(".menu-unset").length?".menu-unset":"#menu-primary-items"),z=0,A=!1,B=0;d(),l(),a("#toggle-navigation").on("click",b),q.on("click",c),q.on("click",e),a(window).bind("load",function(){g()}),a(window).resize(function(){d(),f(),g(),l()}),a(document.body).on("post-load",function(){a.when(m()).then(function(){l()})}),a(".post-content").fitVids({customSelector:'iframe[src*="dailymotion.com"], iframe[src*="slideshare.net"], iframe[src*="animoto.com"], iframe[src*="blip.tv"], iframe[src*="funnyordie.com"], iframe[src*="hulu.com"], iframe[src*="ted.com"], iframe[src*="wordpress.tv"]'}),a(".current-menu-ancestor").addClass("open"),a(window).on("scroll",i).on("resize",function(){clearTimeout(p),p=setTimeout(j,500)}),r.on("click keydown","button",j),j()}),window.addEventListener("hashchange",function(){var a=document.getElementById(location.hash.substring(1));a&&(/^(?:a|select|input|button|textarea)$/i.test(a.tagName)||(a.tabIndex=-1),a.focus())},!1);