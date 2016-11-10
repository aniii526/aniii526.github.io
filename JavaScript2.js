(function () {

    window.uiResizeTime = 50;

    var rootWrapper = document.getElementById('root-wrapper'),
		iOS = !!/iPad|iPhone|iPod/i.exec(navigator.userAgent),
		isUc = /ucbrowser/ig.test(window.navigator.userAgent),
		isQQ = /qqbrowser/ig.test(window.navigator.userAgent),

		// iphone(4) anticrash hack :)
		ui = document.getElementById('ui'),
		resizeTimeout,
		show = function () {
		    ui.style.display = 'block';
		    ui.style.visibility = 'visible';
		},
		hide = function () {
		    ui.style.display = 'none';
		    ui.style.visibility = 'hidden';
		};

    if (!isUc && !isQQ) {
        rootWrapper.style.position = 'fixed';
    }

    window.forceWindowResize = function () {
        var scaleRatio,
			wrapperWidth,
			wrapperHeight,
			curWidth = 0,
			curHeight = 0;

        curWidth = window.innerWidth || document.body.clientWidth;
        curHeight = window.innerHeight || document.body.clientHeight;


        if (window.innerWidth / window.innerHeight < 4 / 3)
        {
            //	portrait
            wrapperWidth = 960;
            wrapperHeight = parseFloat((curHeight / curWidth * wrapperWidth).toFixed(2));
            scaleRatio = parseFloat((curWidth / wrapperWidth).toFixed(3));
        }
        else
        {
            //	mixed+
            wrapperHeight = 720;
            wrapperWidth = parseFloat((curWidth / curHeight * wrapperHeight).toFixed(2));
            scaleRatio = parseFloat((curHeight / wrapperHeight).toFixed(3));
        }
        var currentScaleRatio = rootWrapper.style.webkitTransform || rootWrapper.style.transform;
        if (
			(!rootWrapper.style.width || Math.abs(parseFloat(rootWrapper.style.width) - wrapperWidth) >= 1) ||
			(!rootWrapper.style.height || Math.abs(parseFloat(rootWrapper.style.height) - wrapperHeight) >= 1) ||
			(!currentScaleRatio || Math.abs(parseFloat(currentScaleRatio.match(/scale\((.+)\)/)[1]) - scaleRatio) >= 0.01)
		) {

            var style = 'scale(' + String(scaleRatio) + ')';
            if (window.ENV && window.ENV.isAndroid && window.ENV.isUCBrowser) {
                style += ' translate3d(0,0,0)';
            }
            if (rootWrapper.style.transform != undefined) {
                rootWrapper.style.transform = style;
            } else if (rootWrapper.style.webkitTransform != undefined) {
                rootWrapper.style.webkitTransform = style;
            }

            rootWrapper.style.width = wrapperWidth + 'px';
            rootWrapper.style.height = wrapperHeight + 'px';

            // UC ios hack
            if (iOS && isUc) {
                document.body.style.width = wrapperWidth + 'px';
                setTimeout(function () {
                    document.body.style.width = '100%';
                }, 100);
            }
        }
    };

    var resizeFunc = function () {
        hide();
        if (!ui.fullscreen || (ui.fullscreen && !ui.fullscreen.data.doNotResize)) {

            // hack for UC browser
            if (window.ENV && window.ENV.isUCBrowser) {
                window.scrollTo(0, 1);
            }

            forceWindowResize();
            if (ui && ui.mainMenu) {
                ui.mainMenu.rearrangeTab();
            }
        }
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            show();
        }.bind(this), window.uiResizeTime);
    };
    document.addEventListener('DOMContentLoaded', forceWindowResize);
    window.addEventListener('resize', resizeFunc);
    window.addEventListener('orientationchange', resizeFunc);

    forceWindowResize();

    var orientMarker = document.getElementById('orient-marker'),
		cssCheckInterval = setInterval(function () {
		    if (getComputedStyle(orientMarker).position === 'absolute') {
		        clearInterval(cssCheckInterval);
		        if (!ui.fullscreen || (ui.fullscreen && !ui.fullscreen.data.doNotResize)) {
		            forceWindowResize();
		        }
		    }
		}, 100);

    var pageArguments = window.location.search.match(/\??(.*)/)[1]
		.split('&')
		.map(function (valKey) {
		    var valKeySplitted = valKey.split('=');

		    return {
		        key: valKeySplitted[0],
		        value: decodeURIComponent(valKeySplitted[1])
		    };
		})
		.reduce(function(prev, curr) {
		    prev[curr.key] = curr.value;
		    return prev;
		}, {});

    if (pageArguments.logo == "ps") {
        document.getElementById('spinner').classList.add("origin");
    }

    window.onload = function () {
        forceWindowResize();
    }

})();