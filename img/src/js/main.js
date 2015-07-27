Zepto(function($) {

	function isWeixin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	}
	var timer,
		msnry,
		isLoading          = false,
		isFirstLoadDataHot = true,
		isFirstLoadDataTa  = true,
		$uiLoading         = $('.ui-loading'),
		tabIndex           = 0,
		hotUrl             = 'js/data.txt',
		taUrl              = 'js/data1.txt';

	var main = {
		shareBox: function() {
			var $shareBd     = $('.share__bd'),
				isweixin     = isWeixin(),
				$shareWeixin = $('.share__weixin'),
				$shareCover  = $('.share__cover');

			$shareBd.hide();

			$('.video__share').on('touchstart', function() {
				$shareCover.show();
				if(isweixin) {
					$shareWeixin.show();
				}
				setTimeout(function() {
					$shareBd.show().addClass('ui-slideUp').removeClass('ui-slideDown');
				}, 100);
			});

			$('.share__cancel, .share__cover').on('touchstart', function(e) {
				$shareCover.hide();
				$shareBd.removeClass('ui-slideUp').addClass('ui-slideDown');
				if(isweixin) {
					$shareWeixin.hide();
				}
				setTimeout(function() {
					$shareBd.hide();
				}, 300);

				e.preventDefault();  // 解决点透现象
			});

		},
		tabToggle: function() {
			$('.tab__nav h3').on('touchstart', function(e) {
				var _this = $(this),
				index     = _this.index(),
				$tabLine  = $('.tab__line'),
				$tab      = $('.g-tab'),
				left      = 50 * index;

				_this.addClass('is-tabCurrent').siblings().removeClass('is-tabCurrent');
				$tabLine.css({
					"left": left + '%'
				});

				tabIndex = index;
				$tab.find('.tab__video').hide().eq(index).show().height(300);

				if(isFirstLoadDataTa) {
					main.loadDataAjax();
					isFirstLoadDataTa = false;
				}
				e.preventDefault();  // 解决点透现象
			});
		},
		isAtBottom: function() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				var scrollTop = $(window).scrollTop();
				var clientHeight = $(document).height() - $(window).height();
				if(scrollTop >= clientHeight && !isLoading && !isFirstLoadDataHot) {
					isLoading = true;
					main.loadDataAjax();
				}
			}, 100);
		},
		loadDataAjax: function() {
			var url = tabIndex == 0 ? hotUrl : taUrl;
			$.ajax({
				url: url,
				dataType: 'json',
				success: function(data) {
					$.each(data, function(k, v) {
						main.addItem(v);
						isLoading = false;
						isFirstLoadDataHot = false;
					});
				}
			});
		},
		loadMore: function() {
			$(window).on('scroll', main.isAtBottom);
		},
		addItem: function(data) {
			var len  = data.length,
				html = '';
			for(var i = 0;i < len;i++) {
				html += '<li class="tab__videoList">'+
		                    '<img src="'+data[i].img_url+'" alt="">'+
		                    '<div class="tab__videoCover"></div>'+
		                    '<div class="tab__videoIntro">'+
		                        '<div class="tab__userIco">'+
		                            '<img src="'+data[i].sIconUrl+'" alt="" class="avatar">'+
		                        '</div>'+
		                        '<p class="tab__videoName">'+data[i].sBrief+'</p>'+
		                        '<p class="tab__videoInfo">'+
		                            '<i class="ico-like"></i><span>'+data[i].iFavorCnt+'</span>'+
		                            '<i class="ico-look"></i><span>'+data[i].iComentCnt+'</span>'+
		                        '</p>'+
		                    '</div>'+
		                '</li>';
			}
			ele = tabIndex == 0 ? '.tab__videoHot' : '.tab__videoTa';
			this.waterfull(ele);
			$(ele).append(html);
			this.waterfull(ele);
		},
		waterfull: function(ele) {
			imagesLoaded( document.querySelector(ele), function() {
			    var grid = document.querySelector(ele);
			    msnry = new Masonry( grid, {
				    itemSelector: '.tab__videoList'
			    });
			});
		},
		init: function() {
			this.shareBox();
			this.tabToggle();
			// this.waterfull();
			this.loadMore();
			this.loadDataAjax();
		}
	}

	main.init();
});