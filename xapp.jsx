var appname = 'letter';
var appzoom = 1;

function mycallbackform(e, v, m, f) {
    if (typeof v != "undefined") if (v) {
        window.location = '../customer/account/login';

    }

}
$.ajaxSetup ({

    cache: false
});
var jc;
var jw=0;
var jh=0;
var cropcord;
var rwid = 400;
var rhei = 564.3;
var previewmode = false;
var myWidth;
var myHeight;
var zlevel = 1;
var tp = 0;
if (typeof (window.innerWidth) == 'number') {

    //Non-IE 

    myWidth = window.innerWidth;
    myHeight = window.innerHeight;

} else if (document.documentElement &&

(document.documentElement.clientWidth || document.documentElement.clientHeight)) {

    //IE 6+ in 'standards compliant mode' 

    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;

} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {

    //IE 4 compatible 

    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;

}
myWidth = myWidth - 20;
myHeight = myHeight - 20;
$("#dcrop").dialog({
    height: myHeight,
    width: myWidth,
    autoOpen: false,
    modal: true,
    buttons: {
        Done: function () {
            var r = jc.tellSelect();
			console.log("widthheight",jw,jh);
			$('.modal').fadeIn('fast');
            $.get('crop.php', {
                src: $('#icrop').attr('src'),
                x: r.x,
                y: r.y,
                x2: r.x2,
                uid: userid,
                w: jw,
                h: jh,
                y2: r.y2
            }, function (data) {
			
                var image = new fabric.Image.fromURL(null, data, function (dt, image) {
                    image.set({
                        left: 0,
                        top: 0,
                        angle: 0
                    });
                    ////////console.log(image.width,image.height);                
                    image.lukwidth(image.width);
                    image.lukheight(image.height);
                    //image.scale();
                    ////////////console.log(image.width, canvas.getWidth());
                    if ((image.wid > canvas.getWidth())) {
                        var wo = image.width;
                        image.lukwidth(canvas.getWidth());
                        var nn = image.height * (image.wid / wo);
                        image.lukheight(nn);
                        if (nn > canvas.getHeight()) {
                            image.lukheight(canvas.getHeight());
                            var nw = image.width * (image.hei / nn);
                            image.lukwidth(nw);

                        }
                    } else {
                        if ((image.hei > canvas.getHeight())) {
                            var wo = image.height;
                            image.lukheight(canvas.getHeight());
                            var nn = image.width * (image.hei / wo);
                            image.lukwidth(nn);
                            if (nn > canvas.getWidth()) {
                                image.lukwidth(canvas.getWidth());
                                var nw = image.height * (image.wid / nn);
                                image.lukheight(nw);

                            }
                        }

                    }
                    //alert('x');
                    canvas.centerObject(image);
                    image.setCoords();
                    canvas.add(image);

                    canvas.renderAll();
                    stateupdate(1);
					$('.modal').fadeOut('fast');
                });

                $("#dcrop").dialog("close");

                $.get('cat.php', {
                    uid: userid
                }, function (data) {
                    $('#store').html(data);
                    $('.xhr ul').html(data);
                    $('#sos').html('');
                    $(".xhr li").hover(function () {
                        $(this).find('.delstore,.crop').fadeIn('fast');
                    }, function () {
                        $(this).find('.delstore,.crop').fadeOut('fast');
                    });

                    $("#accordion img").draggable({
                        appendTo: "body",
                        helper: "clone",
                        revert: "true"
                    });
                    $("#accordion li.txt span").draggable({
                        appendTo: "body",
                        helper: "clone",
                        revert: "true"
                    });
                    $("div.obj li").hover(function () {
                        $(this).find('.delstore,.crop').fadeIn('slow');

                    }, function () {
                        $(this).find('.delstore,.crop').fadeOut('slow');
                    });

                    $('.delstore').click(function () {
						if(!isUse($(this).parent().find('.img').attr('src')))
						{
                        $(this).parent().remove();
                        $.get('delstore.php', {
                            file: $(this).parent().find('.img').attr('src')
                        }, function () {

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });
                    $('.crop').click(function () {
                        crop($(this).parent().find('.img').attr('src'));
                    });




                });
            })
        }
    }
});
$('#wrapper').css('width', myWidth + 'px');
$('#wrapper').css('height', myHeight + 'px');
$('#content').css('height', (myHeight - 60) + 'px');

$('#canvas').css('height', (myHeight - 100) + 'px');
$('#canvas').css('width', (myWidth - 210) + 'px');

$('#accordionResizer').css('height', (myHeight - 90) + 'px');
$("<canvas id='c' width='400px' height='566px'></canvas>").appendTo('#page');
$(document).mousemove(function (e) {

});
$("#accordion").accordion({
    fillSpace: true
});


/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function (b) {
    b.support.touch = "ontouchend" in document;
    if (!b.support.touch) {
        return;
    }
    var c = b.ui.mouse.prototype,
        e = c._mouseInit,
        a;

    function d(g, h) {
        if (g.originalEvent.touches.length > 1) {
            return;
        }
        g.preventDefault();
        var i = g.originalEvent.changedTouches[0],
            f = document.createEvent("MouseEvents");
        f.initMouseEvent(h, true, true, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, false, false, false, false, 0, null);
        g.target.dispatchEvent(f);
    }
    c._touchStart = function (g) {
        var f = this;
        if (a || !f._mouseCapture(g.originalEvent.changedTouches[0])) {
            return;
        }
        a = true;
        f._touchMoved = false;
        d(g, "mouseover");
        d(g, "mousemove");
        d(g, "mousedown");
    };
    c._touchMove = function (f) {
        if (!a) {
            return;
        }
        this._touchMoved = true;
        d(f, "mousemove");
    };
    c._touchEnd = function (f) {
        if (!a) {
            return;
        }
        d(f, "mouseup");
        d(f, "mouseout");
        if (!this._touchMoved) {
            d(f, "click");
        }
        a = false;
    };
    c._mouseInit = function () {
        var f = this;
        f.element.bind("touchstart", b.proxy(f, "_touchStart")).bind("touchmove", b.proxy(f, "_touchMove")).bind("touchend", b.proxy(f, "_touchEnd"));
        e.call(f);
    };
})(jQuery);
//////////console.log("v3dropbox");
var _isGrid = false;
var inText = false;
var tmp = 0;
var txtchanged = false;
var saveexisting = 0;
var stack = new Array();
var redo = new Array();
var IDs = 0;
var crate = 6.2;

var iur = 0;
var ire = 0;
var fname = null;
$('button').button();
$('button').css('font-size', '10px');

var rate = 6.2;

function hexToR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}
$.get("font.php",{uid:userid}, function (data) {
    $('#font').html(data);
});
$.get('catfont.php', {
    uid: userid
}, function (data) {
    $('#userfont').html(data);
    $('#xhrfont ul').html(data);
    $('#sosfont').html('');
    $("#xhrfont li").hover(function () {
        $(this).find('.delstorefont').fadeIn('fast');
    }, function () {
        $(this).find('.delstorefont').fadeOut('fast');
    });


    $("#accordion #userfont li.txt span").draggable({
        appendTo: "body",
        helper: "clone",
        revert: "true"
    });
    $("div.text li").hover(function () {
        $(this).find('.delstorefont').fadeIn('slow');
    }, function () {
        $(this).find('.delstorefont').fadeOut('slow');
    });

                    $('.delstorefont').click(function () {
						if(!isUse($(this).parent().find('span:eq(0)').css('font-family')))
						{
                        $(this).parent().remove();
                        $.get('delstorefont.php', {
                            file: $(this).parent().find('span:eq(0)').attr('src')
                        }, function () {

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });


});

$.get('cat.php', {
    uid: userid
}, function (data) {
    $('#store').html(data);

    $("#accordion img").draggable({
        appendTo: "body",
        helper: "clone",
        revert: "true"
    });
    $("div.obj li").hover(function () {
        $(this).find('.delstore,.crop').fadeIn('fast');
    }, function () {
        $(this).find('.delstore,.crop').fadeOut('fast');
    });
                    $('.delstore').click(function () {
						if(!isUse($(this).parent().find('.img').attr('src')))
						{
                        $(this).parent().remove();
                        $.get('delstore.php', {
                            file: $(this).parent().find('.img').attr('src')
                        }, function () {

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });
					$('.crop').click(function () {
        crop($(this).parent().find('.img').attr('src'));
    });

    $('img[type=img],img[type=svg],img[type=rect],img[type=circle],img[type=triangle],img[type=ellipse],span[type=text]').dblclick(function () {

        var src = $(this).attr('source');
        var source = $(this).attr('source');
        var width = $(this).attr('width');
        var hegiht = $(this).attr('height');
        var type = $(this).attr('type');
        var pack = $(this).attr('pack');
        var font = $(this).attr('data-val');
        var pleft = 0;
        var ptop = 0;
        if (type == 'rect') {
            var rect = new fabric.Rect({
                left: pleft,
                top: ptop,
                width: 100,
                height: 100,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1
            });
            rect.Round = true;
            rect.pack = "shape";
            canvas.centerObject(rect);
            rect.setCoords();
            canvas.add(rect);
            canvas.renderAll();
        } else if (type == 'circle') {
            var circle = new fabric.Circle({
                left: pleft,
                top: ptop,
                radius: 50,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1

            });
            circle.pack = "shape";
            canvas.centerObject(circle);
            circle.setCoords();
            canvas.add(circle);
            canvas.renderAll();
        } else if (type == 'triangle') {
            var triangle = new fabric.Triangle({
                left: pleft,
                top: ptop,
                width: 100,
                height: 100,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1

            });
            triangle.pack = "shape";
            canvas.centerObject(triangle);
            triangle.setCoords();
            canvas.add(triangle);
            canvas.renderAll();
        }
        if (type == "line") {
            var line = new fabric.Line([pleft, ptop, 100, 0], {
                left: pleft,
                top: ptop,
                stroke: 'black',
                fill: 'black',
                strokeWidth: 1
            });
            canvas.centerObject(line);
            line.setCoords();
            canvas.add(line);
            canvas.renderAll();
        } else if (type == "ellipse") {
            var ellipse = new fabric.Ellipse({
                rx: 45,
                ry: 80,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1,
                angle: 90,
                left: pleft,
                top: ptop
            });
            ellipse.pack = "shape";
            canvas.centerObject(ellipse);
            ellipse.setCoords();
            canvas.add(ellipse);


            canvas.renderAll();
        } else if (type == 'svg') {
            fabric.loadSVGFromURL(src, null, function (n, objects, options) {
                var loadedObject;
                if (objects.length > 1) {
                    loadedObject = new fabric.PathGroup(objects, options);
                } else {
                    loadedObject = objects[0];
                }
                loadedObject.set({
                    left: pleft,
                    top: ptop,
                    angle: 0
                });
                if (pack == "line") {
                    loadedObject.noFill = true;

                    loadedObject.pack = "shape";
                }
                loadedObject.svgsrc = src;
                if ((loadedObject.width > canvas.getWidth()) || (loadedObject.height > canvas.getHeight())) {
                    loadedObject.scale(0.9 / (loadedObject.width / canvas.getWidth()), 0.9 / (loadedObject.height / canvas.getHeight()));
                }
                loadedObject.type = "svg";
                loadedObject.src = src;
                canvas.centerObject(loadedObject);
                loadedObject.setCoords();
                canvas.add(loadedObject);

                canvas.calcOffset();
                stateupdate(1);

                canvas.renderAll();
            });
        } else if (type == 'img') {
            var image = new fabric.Image.fromURL(null, src, function (dt, image) {
                image.set({
                    left: pleft,
                    top: ptop,
                    angle: 0
                });
                ////////console.log(image.width,image.height);                
                image.lukwidth(image.width);
                image.lukheight(image.height);
                //image.scale();
                ////////////console.log(image.width, canvas.getWidth());
                if ((image.wid > canvas.getWidth())) {
                    var wo = image.width;
                    image.lukwidth(canvas.getWidth());
                    var nn = image.height * (image.wid / wo);
                    image.lukheight(nn);
                    if (nn > canvas.getHeight()) {
                        image.lukheight(canvas.getHeight());
                        var nw = image.width * (image.hei / nn);
                        image.lukwidth(nw);

                    }
                } else {
                    if ((image.hei > canvas.getHeight())) {
                        var wo = image.height;
                        image.lukheight(canvas.getHeight());
                        var nn = image.width * (image.hei / wo);
                        image.lukwidth(nn);
                        if (nn > canvas.getWidth()) {
                            image.lukwidth(canvas.getWidth());
                            var nw = image.height * (image.wid / nn);
                            image.lukheight(nw);

                        }
                    }

                }
                //alert('x');
                canvas.centerObject(image);
                image.setCoords();
                canvas.add(image);

                canvas.renderAll();
                stateupdate(1);
            });
        } else if (type == 'text') {

            var dtext = font;
            var text = new fabric.Text(dtext, {
                left: pleft,
                top: ptop,
                lockScalingY: true,
                lockScalingX: true,
                lockUniScaling: true,
                fontFamily: font,
                fontSize: 100,
                fill: '#000'
            });

            text.pack = "shape";
            text.scale(norma(12) / 100);
            text.xfontSize = 12;
            //canvas.centerObject(text);
            canvas.centerObject(text);
            text.setCoords();
            canvas.add(text);

            text.lockScalingX = true;
            text.lockScalingY = true;
            stateupdate(1);

            canvas.renderAll();
        } else if (type == 'tpl') {
            var image = new fabric.Image.fromURL(null, source, function (dt, image) {
                image.set({
                    left: pleft,
                    top: ptop,
                    angle: 0
                });
                //image.scale();
                canvas.centerObject(image);
                image.setCoords();
                canvas.add(image);

                stateupdate(1);
                canvas.renderAll();
            });
        }
    });
});

var canvas = new fabric.Canvas('c', {});
canvas.backgroundColor = 'rgb(255,255,255)';
canvas.renderAll();
initAligningGuidelines(canvas);
initCenteringGuidelines(canvas);
var zoom = 0;
var mar = 9;
var rmargin = new fabric.Rect({
    left: -1000,
    top: (canvas.getHeight() / 2),
    width: (canvas.getWidth()) - topx(4),
    height: (canvas.getHeight()) - topx(4),
    fill: 'white',
    stroke: 'magenta',
    strokeWidth: 1,
    opacity: 0.8,
    selectable: false
});
rmargin.ID = 'low';
//canvas.add(rmargin);

$('#smargin').click(function () {
    if ($(this).is(':checked')) {
        rmargin.left = (canvas.getWidth() / 2);
        canvas.sendToBack(rmargin);
        canvas.renderAll();
    } else {
        rmargin.left = -1000;

        canvas.renderAll();
    }
});

function toggleGrid(isGrid,func) {

    _isGrid = isGrid;
    if (!_isGrid) {
        canvas.setOverlayImage('images/emptySlice.png', func);
        //    _isGrid = false;
    } else {
        if (Math.round(canvas.canvasScale * 100) == 100) {
            canvas.setOverlayImage('images/grid/fullfront.png', func);
        } else if (Math.round(canvas.canvasScale * 100) == 150 || Math.round(canvasScale * 100) == 225) {
            canvas.setOverlayImage('images/grid/fullfrontx1.png', func);
        } else if (Math.round(canvas.canvasScale * 100) == 338) {
            canvas.setOverlayImage('images/emptySlice.png', func);
        } else {
            canvas.setOverlayImage('images/grid/fullfront.png', func);
        }

        //  _isGrid = true;
    }

}
$('#ali').click(function () {
    if ($(this).is(':checked')) {
        //toggleGrid(true);
        canvas.showAlign = true;
    } else {
        //toggleGrid(false);
        canvas.showAlign = false;
    }
});

canvas.showAlign = true;

$('#grid').click(function () {
    if ($(this).is(':checked')) {
        toggleGrid(true,function(){ canvas.renderAll();});
        canvas.showAlign = true;
    } else {
        toggleGrid(false,function(){ canvas.renderAll();});
        canvas.showAlign = false;
    }
});

function runZoomIn() {
    //isRender = true;
    if (canvas.canvasScale > 3) {
        return false;
    }
    canvas.deactivateAll();
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');

    canvas.canvasScale = canvas.canvasScale * 1.5;
    $('#page').css('padding', 5 * canvas.canvasScale);
    //var lblZoom = document.getElementById("lblZoom");
    //lblZoom.innerHTML = "zoom  @  " + Math.round(canvas.canvasScale * 100) + "%";

    //var canvasWrapper = document.getElementById("canvasWrapper");
    canvas.setHeight(canvas.getHeight() * 1.5);
    canvas.setWidth(canvas.getWidth() * 1.5);
    //updateCG(canvas);
    rate = rate / 1.5;
    crate = crate * 1.5;


    if (_isGrid) {
        if (Math.round(canvas.canvasScale * 100) == 100) {
            canvas.setOverlayImage('images/grid/fullfront.png', canvas.renderAll.bind(canvas));
        } else if (Math.round(canvas.canvasScale * 100) == 150 || Math.round(canvas.canvasScale * 100) == 225) {
            canvas.setOverlayImage('images/grid/fullfrontx1.png', canvas.renderAll.bind(canvas));
        } else if (Math.round(canvas.canvasScale * 100) == 338) {
            canvas.setOverlayImage('images/emptySlice.png', canvas.renderAll.bind(canvas));
        } else {
            canvas.setOverlayImage('images/grid/fullfront.png', canvas.renderAll.bind(canvas));
        }
    }
    zlevel = zlevel * 1.5;
    var obj = canvas.getObjects();
    for (var i in obj) {
        var scaleX = 0;
        var scaleY = 0; {
            scaleY = obj[i].getHeight();
            scaleX = obj[i].getWidth();

        }


        var left = obj[i].get('left');
        var top = obj[i].get('top');

        var tempScaleX = scaleX * 1.5;
        var tempScaleY = scaleY * 1.5;
        var tempLeft = left * 1.5;
        var tempTop = top * 1.5;

        obj[i].lukwidth(tempScaleX);
        obj[i].lukheight(tempScaleY);
        obj[i].set('left', tempLeft);
        obj[i].set('top', tempTop);
        if (obj[i].type == 'text') {
            obj[i].zoom = zlevel;
        }

        obj[i].setCoords();
    }

    canvas.renderAll();


    return rate;

}

function runZoomOut() {
    if (canvas.canvasScale < 0.3) {
        return false;
    }
    canvas.deactivateAll();
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');


    canvas.canvasScale = canvas.canvasScale / 1.5;
    $('#page').css('padding', 5 * canvas.canvasScale);
    //var lblZoom = document.getElementById("lblZoom");
    //lblZoom.innerHTML = "zoom  @  " + Math.round(canvas.canvasScale * 100) + "%";
    canvas.setHeight(canvas.getHeight() * (1 / 1.5));
    canvas.setWidth(canvas.getWidth() * (1 / 1.5))
    //updateCG(canvas);
    rate = rate * 1.5;
    crate = crate / 1.5;
    if (_isGrid) {
        if (Math.round(canvas.canvasScale * 100) == 100) {
            canvas.setOverlayImage('images/grid/fullfront.png', canvas.renderAll.bind(canvas));
        } else if (Math.round(canvas.canvasScale * 100) == 150 || Math.round(canvas.canvasScale * 100) == 225) {
            canvas.setOverlayImage('images/grid/fullfrontx1.png', canvas.renderAll.bind(canvas));
        } else if (Math.round(canvas.canvasScale * 100) == 338) {
            canvas.setOverlayImage('images/emptySlice.png', canvas.renderAll.bind(canvas));
        } else {
            canvas.setOverlayImage('images/grid/fullfront.png', canvas.renderAll.bind(canvas));
        }
    }
    zlevel = zlevel / 1.5;
    var obj = canvas.getObjects();
    for (var i in obj) {
        var scaleX = 0;
        var scaleY = 0; {
            scaleY = obj[i].getHeight();
            scaleX = obj[i].getWidth();

        }

        var left = obj[i].get('left');
        var top = obj[i].get('top');

        var tempScaleX = scaleX / 1.5;
        var tempScaleY = scaleY / 1.5;
        var tempLeft = left / 1.5;
        var tempTop = top / 1.5;

        obj[i].lukwidth(tempScaleX);
        obj[i].lukheight(tempScaleY);
        obj[i].set('left', tempLeft);
        obj[i].set('top', tempTop);
        if (obj[i].type == 'text') {
            obj[i].zoom = zlevel;
        }
        obj[i].setCoords();
    }

    canvas.renderAll();
    return rate;
}
function topt(s) {
    return s * zlevel;
}
function xtopt(s) {
    return s / zlevel;
}
var w = parseInt($('#canvas').css('height')) / canvas.getHeight();
if (w > 1.5) {
    runZoomIn();

    rwid = canvas.getWidth();
    rhei = canvas.getHeight();
}
//console.log('canvas.canvasScale',canvas.canvasScale);
$('#zoomin').click(function () {
    runZoomIn();
});
$('#zoomout').click(function () {
    runZoomOut();

});

function norma(v) {
    v = v * canvas.canvasScale;
    console.log(v, canvas.canvasScale);
    return v;
}
//====================
function stateupdate(iawal) {
    ////////////console.log("begin " + iur);
    //redo=null;
    ire = 0;
    canvas.forEachObject(function (obj) {
        //////console.log(obj.ID);
        if (obj.ID != 'low') {


            var changed = false;
            var o = new Object();
            o.self = obj;
            o.child = 0;
            o.state = new Object();
            o.awal = iawal;

            if (iawal == 1) {

                if (!obj.stacked) {
                    for (var c in obj.stateProperties) {

                        if ((obj.stateProperties[c] == 'width') || (obj.stateProperties[c] == 'height')) {
                            o.state['width'] = obj.getWidth();
                            o.state['height'] = obj.getHeight();
                        } else {
                            var valx = obj[obj.stateProperties[c]];
                            if (obj.stateProperties[c] == 'lineHeight') {
                                valx = parseFloat(valx);
                            }

                            o.state[obj.stateProperties[c]] = valx;
                        }
                    }
                    IDs = IDs + 1;
                    o.ID = "obj" + IDs;
                    stack[iur] = o;
                    ////////////console.log(stack[iur]);
                    var oo = new Object();
                    oo.self = obj;
                    oo.child = 1;
                    oo.state = new Object();
                    oo.state = o.state;
                    oo.awal = 0;
                    oo.ID = "obj" + IDs;
                    iur++;
                    stack[iur] = oo;
                    obj.stacked = true;
                    obj.ID = "obj" + IDs;
                    //////console.log("added new item to #" + iur);
                    iur++;
                }
            } else {
                for (var c in obj.stateProperties) {

                    if ((obj.stateProperties[c] == 'width') || (obj.stateProperties[c] == 'height')) {
                        o.state['width'] = obj.getWidth();
                        o.state['height'] = obj.getHeight();
                    } else {
                        var valx = obj[obj.stateProperties[c]];
                        if (obj.stateProperties[c] == 'lineHeight') {

                            valx = parseFloat(valx);
                        }
                        o.state[obj.stateProperties[c]] = valx;
                    }

                    if (obj[obj.stateProperties[c]] != obj.originalState[obj.stateProperties[c]]) {
                        ////////////console.log("we seen different | " + obj.stateProperties[c] + " original : " + obj.originalState[obj.stateProperties[c]] + "| val:" + obj[obj.stateProperties[c]]);
                        obj.originalState[obj.stateProperties[c]] = obj[obj.stateProperties[c]];
                        changed = true;
                    }
                }
                if (changed) {
                    o.ID = obj.ID;
                    stack[iur] = o;
                    ////////////console.log("added updated item to #" + iur);
                    iur++;
                }
            }
        }
    });
    //console.log(stack);

}

function undo() {
    if (iur > 0) {
        //////////console.log("before undo", stack);        
        iur--;
        var old = stack[iur];
        if (old.child == 1) {
            stack[iur] = null;
            iur--;
            ////////////console.log("goto parent | #" + iur);
            old = stack[iur];
        }
        ////////////console.log("remove stack #" + iur, stack[iur]);        
        redo[ire] = old;
        ire++;
        stack[iur] = null;
        if (old.awal == 1) {
            ////////////console.log("remove  obj#" + iur, old.self);
            for (var n in stack) {
                if (stack[n] != null) {
                    if (stack[n].ID == old.ID) {
                        stack[n] = null;
                    }
                }
            }
            canvas.remove(old.self);
        } else {
            if (stack.length > 0) {
                var i = 0;
                var xiur = iur - 1;
                ////////////console.log(iur - 1);
                for (i = iur - 1; i >= 0; i--) {
                    if (stack[i] != null) {
                        if (old.ID == stack[i].ID) {
                            xiur = i;
                            //////////console.log(i, stack[i].ID);
                            break;
                        }
                    }
                }
                if (xiur == 0) {
                    xiur = iur - 1;
                }
                var un = stack[xiur];
                canvas.forEachObject(function (obj) {
                    if (obj.ID == un.ID) {
                        ////////////console.log("move to this stack " + (xiur), stack[xiur]);
                        for (var c in obj.stateProperties) {
                            if (
                            (obj.stateProperties[c] == "left") || (obj.stateProperties[c] == "top") || (obj.stateProperties[c] == "angle") || (obj.stateProperties[c] == "fill") || (obj.stateProperties[c] == "flipX") || (obj.stateProperties[c] == "flipY") || (obj.stateProperties[c] == "opacity") || (obj.stateProperties[c] == "stroke") || (obj.stateProperties[c] == "lineHeight") || (obj.stateProperties[c] == "strokeWidth")) {
                                obj.set(obj.stateProperties[c], un.state[obj.stateProperties[c]]);
                                if (obj.stateProperties[c] == 'angle') {
                                    obj.setAngle(un.state[obj.stateProperties[c]]);
                                    ////////console.log("set angle");
                                }

                            }
                            if (obj.type != "text") {
                                if (obj.stateProperties[c] == "width") {
                                    obj.lukwidth(un.state[obj.stateProperties[c]]);
                                    //////////console.log(obj.stateProperties[c],un.state[obj.stateProperties[c]]);
                                } else if (obj.stateProperties[c] == "height") {
                                    obj.lukheight(un.state[obj.stateProperties[c]]);
                                    //alert(un.state[obj.stateProperties[c]]);
                                }
                            }

                        }

                    }
                });
                canvas.renderAll();
            }
        }
    }
    //////////console.log("after undo", stack);
}

function centeraligngroup() {
    var gr = canvas.getActiveGroup();
    var objs = gr.getObjects();
    for (var i in objs) {
        objs[i].set('left', 0);
        objs[i].setCoords();
        //////console.log(gr.get('left'));
    }
    canvas.renderAll();
}

function leftaligngroup() {
    var gr = canvas.getActiveGroup();
    var objs = gr.getObjects();
    for (var i in objs) {
        objs[i].set('left', 0 - (gr.getWidth() / 2) + (objs[i].getWidth() / 2));
        objs[i].setCoords();
    }
    canvas.renderAll();
}

function rightaligngroup() {
    var gr = canvas.getActiveGroup();
    var objs = gr.getObjects();
    for (var i in objs) {
        objs[i].set('left', 0 + (gr.getWidth() / 2) - (objs[i].getWidth() / 2));
        objs[i].setCoords();
    }
    canvas.renderAll();
}

function samealigngroup() {


    var gr = canvas.getActiveGroup();
    var objs = gr.getObjects();
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < objs.length - 1; i++) {
            if (objs[i].get('top') > objs[i + 1].get('top')) {
                var temp = objs[i];
                objs[i] = objs[i + 1];
                objs[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    var max = objs.length;
    var ha = gr.getHeight();
    var sps = 0;
    var h = 0;
    for (var i in objs) {
        h = h + objs[i].getHeight();
        //console.log('heig',objs[i].hei,h);                         
    }
    //////console.log('ha',ha,'h',h);

    if ((ha - h) < 0) {
        ha = h;
        h = ha - h;
    } else {
        h = ha - h;
    }
    h = h / (max - 1);
    //////console.log(h,max);
    var t = 0;
    var t0 = 0;
    for (var i in objs) {
        if (i == 0) {
            //objs[i].set('top',0);
        } else {
            t = t0 + (objs[i - 1].getHeight()) + h;
            objs[i].set('top', t);
        }
        t0 = objs[i].get('top');
        //////console.log(t0);

    }
    /*for (var i in objs) {        
                objs[i].set('top',-(gr.getHeight()/2)+(objs[i].getHeight()/2)+objs[i].get('top'));
                objs[i].setCoords();
        }*/
    gr.setObjectsCoords();
    canvas.renderAll();
}
function sameHaligngroup() {


    var gr = canvas.getActiveGroup();
    var objs = gr.getObjects();
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < objs.length - 1; i++) {
            if (objs[i].get('left') > objs[i + 1].get('left')) {
                var temp = objs[i];
                objs[i] = objs[i + 1];
                objs[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    var max = objs.length;
    var ha = gr.getHeight();
    var sps = 0;
    var h = 0;
    for (var i in objs) {
        h = h + objs[i].getHeight();
        //console.log('heig',objs[i].hei,h);                         
    }
    //////console.log('ha',ha,'h',h);

    if ((ha - h) < 0) {
        ha = h;
        h = ha - h;
    } else {
        h = ha - h;
    }
    h = h / (max - 1);
    //////console.log(h,max);
    var t = 0;
    var t0 = 0;
    for (var i in objs) {
        if (i == 0) {
            //objs[i].set('top',0);
        } else {
            t = t0 + (objs[i - 1].getHeight()) + h;
            objs[i].set('left', t);
        }
        t0 = objs[i].get('left');
        //////console.log(t0);

    }
    /*for (var i in objs) {        
                objs[i].set('top',-(gr.getHeight()/2)+(objs[i].getHeight()/2)+objs[i].get('top'));
                objs[i].setCoords();
        }*/
    gr.setObjectsCoords();
    canvas.renderAll();
}
$('#objleft').click(function () {
    leftaligngroup();
});
$('#objright').click(function () {
    rightaligngroup();
});
$('#objcenter').click(function () {
    centeraligngroup();
});
$('#samespace').click(function () {
    samealigngroup();
});
$('#samespaceH').click(function () {
    sameHaligngroup();
});

function goredo() {
    if (ire > 0) {
        //alert('x');
        ire--;
        var old = redo[ire];
        stack[iur] = old;
        iur++;

        redo[ire] = null;
        if (old.awal == 1) {
            canvas.add(old.self);
        } else {
            canvas.forEachObject(function (obj) {
                if (obj.ID == old.ID) {
                    ////////////console.log("move to this stack " + (xiur), stack[xiur]);
                    for (var c in obj.stateProperties) {
                        if (
                        (obj.stateProperties[c] == "left") || (obj.stateProperties[c] == "top") || (obj.stateProperties[c] == "angle") || (obj.stateProperties[c] == "fill") || (obj.stateProperties[c] == "flipX") || (obj.stateProperties[c] == "flipY") || (obj.stateProperties[c] == "opacity") || (obj.stateProperties[c] == "stroke") || (obj.stateProperties[c] == "lineHeight") || (obj.stateProperties[c] == "strokeWidth")) {
                            obj.set(obj.stateProperties[c], old.state[obj.stateProperties[c]]);
                        }
                        if (obj.type != "text") {

                            if (obj.stateProperties[c] == "width") {
                                obj.lukwidth(old.state[obj.stateProperties[c]]);
                                //////////console.log(obj.stateProperties[c],un.state[obj.stateProperties[c]]);
                            } else if (obj.stateProperties[c] == "height") {
                                obj.lukheight(old.state[obj.stateProperties[c]]);
                                //alert(un.state[obj.stateProperties[c]]);
                            }
                        }
                    }

                }
            });
            canvas.renderAll();
        } //else                    
        ////////////console.log("after undo", stack);
    }
}


//=====================
$('#undo').click(function () {
    undo();
});
$('#redo').click(function () {
    goredo();
});
//background selector
$('#color').ColorPicker({
    color: '#0000ff',
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        stateupdate(0);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#color').css('background-image', 'url(images/select.png)');
        $('#color').css('background-color', hex);
        canvas.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
        canvas.renderAll();
    }
});

$('#font').change(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        //////////////console.log($(this).val());
        activeObject.fontFamily = $(this).val();
        if (!txtchanged) {
            $('#txt').val(activeObject.fontFamily);
            activeObject.text = $('#txt').val();
        }

        //////////////console.log(activeObject.fontFamily);
        stateupdate(0);
        canvas.renderAll();
    }

});
$('#fonts').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textShadow = !activeObject.textShadow ? 'rgba(0,0,0,0.2) 2px 2px 10px' : '';
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#fontb').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.fontStyle = (activeObject.fontStyle == 'bold' ? '' : 'bold');
        stateupdate(0);
        canvas.renderAll();
    }
});

$('#fonti').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#fontu').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
        stateupdate(0);
        canvas.renderAll();
    }
});

$('#fontl').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#fonto').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textDecoration = (activeObject.textDecoration == 'overline' ? '' : 'overline');
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#fontla').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textAlign = 'left';
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#fontca').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textAlign = 'center';
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#fontra').click(function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.textAlign = 'right';
        stateupdate(0);
        canvas.renderAll();
    }
});
$('#textcolor').ColorPicker({
    color: '#0000ff',
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        stateupdate(0);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#textcolor').css('background-image', 'url(images/select.png)');
        $('#textcolor').css('background-color', hex);
        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.fill = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';;
        canvas.renderAll();
    }
});
$('.bgcolor').ColorPicker({
    color: '#000',
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        stateupdate(0);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('.bgcolor').css('background-image', 'url(images/select.png)');
        $('.bgcolor').css('background-color', hex);


        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }

        if (hsb != 'none') {
            if (activeObject && activeObject.type === 'text') {
                activeObject.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
            } else {
                activeObject.fill = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';;

            }
        } else {
            $('.bgcolor').css('background', 'url(images/none.gif)');
            if (activeObject && activeObject.type === 'text') {
                activeObject.backgroundColor = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
            } else {

                activeObject.fill = 'none';
            }
        }

        canvas.renderAll();
    }
});
$('.bgborder').ColorPicker({
    color: '#000',
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        stateupdate(0);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('.bgborder').css('background-image', 'url(images/select.png)');
        $('.bgborder').css('background-color', hex);

        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        //////console.log(hsb, hex, rgb);
        if (hsb != 'none') {
            if (activeObject.type == 'text') {
                activeObject.strokeStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                activeObject.stroke = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
            } else {
                activeObject.stroke = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';;

            }
        } else {
            $('.bgborder').css('background', 'url(images/none.gif)');
            activeObject.stroke = 'none';
            activeObject.strokeStyle = 'none';


        }

        canvas.renderAll();
    }
});
$("#dialog:ui-dialog").dialog("destroy");
$("#dialog-save").dialog({
    modal: true,
    autoOpen: false,

});
$("#dialog-open").dialog({
    modal: true,
    autoOpen: false,
    width: 600,
    height: 300,
    buttons: {
        Cancel: function () {
            $(this).dialog("close");
        }
    }
});
$("#openxmldlg").dialog({
    modal: true,
    autoOpen: false,
    width: 600,
    height: 300,
    buttons: {
        Cancel: function () {
            $(this).dialog("close");
        }
    }
});
$("#myfiledlg").dialog({
    modal: true,
    autoOpen: false,
    width: 600,
    height: 560,
    buttons: {
        Close: function () {
            $(this).dialog("close");
        }
    }
});

$("#dialog-upload").dialog({
    modal: true,
    autoOpen: false,
    width: 881,
    height: 400
});
$("#dialog-upload-font").dialog({
    modal: true,
    autoOpen: false,
    width: 881,
    height: 400
});
$('#upload_done').click(function (event) {
    // Act on the event
    $('#dialog-upload').dialog('close');
});
$('#upload_done_font').click(function (event) {
    // Act on the event
    $('#dialog-upload-font').dialog('close');
});

function jcgetRandom(jc) {
    var dim = jc.getBounds();
    return [
    Math.round(0),
    Math.round(0),
    Math.round(dim[0]),
    Math.round(dim[1])];
};

function showCoords(c) {
    // body...
    cropcord = c;
    //console.log(cropcord);
}
function crop(fname) {
if(isUse(fname))
{
	msg('cannot crop aset library while used on canvas, please remove it first');
	return false;
}
    $('.modal').fadeIn('fast');
	$('.modal').css('z-index', 9999);
    if (fname.indexOf('.pdf') > 0) {
        if (confirm(b1)) {

            $.get('convert.php', {
                file: fname
            }, function (data) {
                fname = data;

        
                $('#concrop').html('<center><img width="700" height="auto"   src="' + fname + '" id="icrop" /></center>');


    
                $('#icrop').load(function () {
        
                    $('#dialog-upload').dialog('close');
                    $('#dcrop').dialog("open");
                    $('.modal').fadeOut('fast');
                    jc = $.Jcrop('#icrop');
                    jc.setSelect(jcgetRandom(jc));
                });

            })
        }else{
        	$('.modal').fadeOut('fast');
        }

    } else {
        
        $('#concrop').html('<center><img width="700" height="auto"   src="' + fname + '" id="icrop" /></center>');
		
        $('#icrop').load(function () {
        
		
            $('#dialog-upload').dialog('close');
            $('#dcrop').dialog("open");
            $('.modal').fadeOut('fast');
            jc = $.Jcrop('#icrop');
            jc.setSelect(jcgetRandom(jc));
        });
    }
}
$('#file_upload').uploadifive({
    'uploadScript': 'uploadifive.php?uid=' + userid + '&max=' + maxupload + '&maxsize=' + maxsizeupload,
    'auto': true,
    'queueID': 'sos',
    'buttonText': '',
    'fileType': 'image/*,application/pdf',
    'onUpload': function (filesToUpload) {
        $('#sos').show();
    },
    'onUploadComplete': function (file, data) {
        var d = jQuery.parseJSON(data);
        console.log(d);
		var err=0;
        $('#sos').hide();
        if (d.err == 'OUT') {
            $.prompt(a1, {
                buttons: {
                    Close: true
                },
                focus: 1
            });
			err=1;
        } else if (d.err == 'OVER') {
            $('#dialog-upload').dialog('close');
            $.prompt(a2 + (maxsizeupload / 1024) + ' kb</strong>', {
                buttons: {
                    Close: true
                },
                focus: 1
            });
			err=1;
        }
        if (d.ext == "pdf") {
            $.get('cat.php', {
                uid: userid
            }, function (data) {
			$("#dialog-upload").dialog('close');
                $('#store').html(data);
                $('.xhr ul').html(data);
                $('#sos').html('');
                $(".xhr li").hover(function () {
                    $(this).find('.delstore,.crop').fadeIn('fast');
                }, function () {
                    $(this).find('.delstore,.crop').fadeOut('fast');
                });

                $("#accordion img").draggable({
                    appendTo: "body",
                    helper: "clone",
                    revert: "true"
                });
                $("div.obj li").hover(function () {
                    $(this).find('.delstore,.crop').fadeIn('slow');
                }, function () {
                    $(this).find('.delstore,.crop').fadeOut('slow');
                });

                    $('.delstore').click(function () {
						if(!isUse($(this).parent().find('.img').attr('src')))
						{
                        $(this).parent().remove();
                        $.get('delstore.php', {
                            file: $(this).parent().find('.img').attr('src')
                        }, function () {

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });
                $('.crop').click(function () {
                    crop($(this).parent().find('.img').attr('src'));
                });

            });
        } else {
			if(err==0)
			{
				crop(d.url);
			}
        }




    },
    'multi': 'false'
});

$('#file_upload_font').uploadifive({
    'uploadScript': 'uploadfont.php?uid=' + userid + '&max=' + maxupload + '&maxsize=' + maxsizeupload,
    'auto': true,
    'queueID': 'sosfont',
    'buttonText': '',
    'fileType': '',
    'onUploadFile': function (filesToUpload) {
	
		$('.modal').fadeIn('fast');
        $('#sosfont').show();
		
    },
    'onUploadComplete': function (file, data) {
	$("#dialog-upload-font").dialog('close');
        var d = jQuery.parseJSON(data);
		$('.modal').fadeOut('fast');
		if(d.ext=='ttf')
		{
        $('#sosfont').hide();
        if (d.err == 'OUT') {
            $.prompt('Maximum Slot reached', {
                buttons: {
                    Close: true
                },
                focus: 1
            });
        } else if (d.err == 'OVER') {
            $("#dialog-upload-font").dialog('close');
            $.prompt(a2+ (maxsizeupload / 1024) + ' kb</strong>', {
                buttons: {
                    Close: true
                },
                focus: 1
            });
        }
		$('#dialog-upload').dialog('close');
        if (confirm(b2)) {
			
            $('.modal').fadeIn('fast');
			yepnope.injectJs( d.cufon ,function(){
				yepnope.injectCss(d.css,function(){
					$('.modal').fadeOut('fast');
				});
			});
			
		$.get("font.php",{uid:userid}, function (data) {
			$('#font').html(data);
		});			
            $.get('catfont.php', {
                uid: userid
            }, function (data) {
                $('#userfont').html(data);
                $('#xhrfont ul').html(data);
                $('#sosfont').html('');
                $("#xhrfont li").hover(function () {
                    $(this).find('.delstorefont').fadeIn('fast');
                }, function () {
                    $(this).find('.delstorefont').fadeOut('fast');
                });


                $("#accordion #userfont li.txt span").draggable({
                    appendTo: "body",
                    helper: "clone",
                    revert: "true"
                });
                $("div.text li").hover(function () {
                    $(this).find('.delstorefont').fadeIn('slow');
                }, function () {
                    $(this).find('.delstorefont').fadeOut('slow');
                });

                    $('.delstorefont').click(function () {
						if(!isUse($(this).parent().find('span:eq(0)').css('font-family')))
						{
                        $(this).parent().remove();
                        $.get('delstorefont.php', {
                            file: $(this).parent().find('span:eq(0)').attr('src')

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });

            });
        } else {
            $.get('delstore.php', {
                file: file.name
            }, function () {

            });

        }




		}else
		{
			$.prompt(a3, {
                buttons: {
                    Close: true
                },
                focus: 1
            });		
		}
    },
    'multi': 'false'
});



$("#dialog-pdf").dialog({
    modal: true,
    autoOpen: false,
    width: 300,
    height: 200,
    buttons: {
        OK: function () {
            $(this).dialog("close");
        }
    }
});
$('#clear').click(function () {
    if (confirm(b3)) {
        $('#textoption').fadeOut('slow');
        $('#imgoption').fadeOut('slow');
        $('#objoption').fadeOut('slow');
        $('#groption').fadeOut('slow');

        canvas.clear();
        canvas.setHeight(rhei);
        canvas.setWidth(rwid);
        //updateCG(canvas);                        
        saveexisting = 0;
        txtchanged = false;

        stack = [];
        redo = [];
        IDs = 0;
        iur = 0;
        ire = 0;

        stack = [];
        iur = 0;
    }
});
var mobj = new Array();

function afterrender() {
    if (appname == 'card') {
        var i = 0;

        canvas.setHeight(96.9 * appzoom);
        canvas.setWidth(171 * appzoom);

        backtocanvas(mobj);
        canvas.forEachObject(function (obj) {

            if (obj.cloned) {
                canvas.remove(obj);

            } else {

            }


        });
    }
}
function msg(txt)
{
 $.prompt('<strong>'+txt+'</strong>', {
                buttons: {
                    Close: true
                },
                focus: 1
            });
}
function isUse(src)
{
var found=false;
canvas.forEachObject(function (obj) {

if(obj.type=='image' || obj.type=='img')
{
console.log('check',obj.getSrc().indexOf(src));
						if(obj.getSrc().indexOf(src)>0)
						{						
							found =true;
							
						}
						
}else
if(obj.type=='text')
{
if(obj.fontFamily==src)
						{						
							found =true;
							
						}			
}
					});

return found;					
}
function prerender() {
    canvas.deactivateAll();
    mobj = new Array();
    if (appname == 'card') {
        var gr = new fabric.Group();
        var box = new fabric.Rect({
            left: ((171 * appzoom) / 2),
            top: ((96.9 * appzoom) / 2),
            width: (171 * appzoom),
            height: (96.9 * appzoom),
            fill: 'none',
            stroke: 'black',
            strokeWidth: 1,
            opacity: 1
        });

        canvas.forEachObject(function (obj) {

            gr.add(obj);
            mobj.push(obj);
            canvas.remove(obj);
        });

        canvas.clipdata = '<clipPath id="box"><rect width="' + box.width + '" height="' + box.height + '"/></clipPath>';

        gr.add(box);

        gr.scale(1 / appzoom);
        canvas.setHeight(rhei);
        canvas.setWidth(rwid);
        var o;
        var ltop = 19;
        var lleft = 19;
        for (o = 0; o < 5; o++) {
            gr.async = false;
            var s = fabric.util.object.clone(gr);
            s.useClip = true;
            s.cloned = true;
            s.gopos(lleft, ltop);
            ltop = ltop + 96.9 + 5.7;
            s.cloned = true;
            canvas.add(s);
        }
        ltop = 19;
        lleft = lleft + 171 + 15.2;
        for (o = 0; o < 5; o++) {
            gr.async = false;

            var s = fabric.util.object.clone(gr);
            s.useClip = true;
            s.gopos(lleft, ltop);
            s.cloned = true;
            ltop = ltop + 96.9 + 5.7;
            s.cloned = true;
            canvas.add(s);
        }


        canvas.renderAll();


    }
}
function savejson(fn, mode, fil) {
    canvas.deactivateAll();
	
    prerender();


    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');
    var nojson = false;
    if (!previewmode) {
        if (saveexisting == 0) {
			
            if (fname = prompt("File name", "")) {
				saveexisting = 1;
            } else {
                return false;
            }

        } else {
            saveexisting = 1;
        }
    } else {
        var randomNum = Math.ceil(Math.random() * 2000);
        fname = 'previe' + randomNum;
        //console.log(fname);
        nojson = true;
        previewmode = false;        
    }
    
    $("#dialog-save p").html('<center>Saving...</center>');
    $("#dialog-save").dialog('open');
    var act = 0;
    var fac = 6.2 / rate;
    //////console.log('rate',rate);
    if (rate < 6.2) {
        act = 1;
        var obj = canvas.getObjects();
        for (var i in obj) {
            var scaleX = 0;
            var scaleY = 0; {
                scaleY = obj[i].getHeight();
                scaleX = obj[i].getWidth();

            }


            var left = obj[i].get('left');
            var top = obj[i].get('top');

            var tempScaleX = scaleX / fac;
            var tempScaleY = scaleY / fac;
            var tempLeft = left / fac;
            var tempTop = top / fac;

            obj[i].lukwidth(tempScaleX);
            obj[i].lukheight(tempScaleY);
            obj[i].set('left', tempLeft);
            obj[i].set('top', tempTop);

            obj[i].setCoords();
        }

    } else if (rate > 6.2) {
        act = 2;
        var obj = canvas.getObjects();
        for (var i in obj) {
            var scaleX = 0;
            var scaleY = 0; {
                scaleY = obj[i].getHeight();
                scaleX = obj[i].getWidth();

            }


            var left = obj[i].get('left');
            var top = obj[i].get('top');

            var tempScaleX = scaleX * fac;
            var tempScaleY = scaleY * fac;
            var tempLeft = left * fac;
            var tempTop = top * fac;

            obj[i].lukwidth(tempScaleX);
            obj[i].lukheight(tempScaleY);
            obj[i].set('left', tempLeft);
            obj[i].set('top', tempTop);

            obj[i].setCoords();
        }
    }
    canvas.renderAll();

    var cols = new Array();
    var imgs = "";
    var fnts = "";
    var svg = "";
    canvas.forEachObject(function (obj) {
        var object = new Object();

        if (obj.ID != 'low') {
            // console.log('obj',obj);
            if (obj.type == "image") {
                object.src = obj.getSrc();
                imgs = imgs + object.src + ",";

            } else if (obj.type == "text") {
                fnts = fnts + obj.fontFamily + ",";
            } else if (obj.type == "svg") {
                svg = svg + obj.src + ",";
            }

            for (var propertyName in obj) {
                if (typeof obj[propertyName] != "function" && typeof obj[propertyName] != "object" && typeof obj[propertyName] != "array") {
                    object[propertyName] = obj[propertyName];

                }
            }
            cols.push(object);
        }
    });


    if (act == 2) {
        var obj = canvas.getObjects();
        for (var i in obj) {
            var scaleX = 0;
            var scaleY = 0; {
                scaleY = obj[i].getHeight();
                scaleX = obj[i].getWidth();

            }


            var left = obj[i].get('left');
            var top = obj[i].get('top');

            var tempScaleX = scaleX / fac;
            var tempScaleY = scaleY / fac;
            var tempLeft = left / fac;
            var tempTop = top / fac;

            obj[i].lukwidth(tempScaleX);
            obj[i].lukheight(tempScaleY);
            obj[i].set('left', tempLeft);
            obj[i].set('top', tempTop);

            obj[i].setCoords();
        }
    } else if (act == 1) {
        var obj = canvas.getObjects();
        for (var i in obj) {
            var scaleX = 0;
            var scaleY = 0; {
                scaleY = obj[i].getHeight();
                scaleX = obj[i].getWidth();

            }


            var left = obj[i].get('left');
            var top = obj[i].get('top');

            var tempScaleX = scaleX * fac;
            var tempScaleY = scaleY * fac;
            var tempLeft = left * fac;
            var tempTop = top * fac;

            obj[i].lukwidth(tempScaleX);
            obj[i].lukheight(tempScaleY);
            obj[i].set('left', tempLeft);
            obj[i].set('top', tempTop);

            obj[i].setCoords();
        }
    }

    canvas.renderAll();
    var json = '';
    if (!nojson) {
        //console.log(cols);
        json = JSON.stringify(JSON.decycle(cols));
    }
		
    ////////////console.log("save file to fname :" + fname);
    //console.log(canvas.toSVG());
    $.post('save' + fil + '.php', {
        name: fname.replace('(', '').replace(')', '').replace(' ', ''),
        js: json,
        images: imgs,
        fonts: fnts,
        maxpdf: maxpdf,
        maxpdfsize: maxpdfsize,
        mode: mode,
        email: email,
        svgc: svg,
        svg: canvas.toSVG(),
        existing: saveexisting
    }, function (data) {
        afterrender();
        if (mode == 'file') {
            needToConfirm = false;

            window.location = "dsave.php?ID=" + data;
            $("#dialog-save").dialog("close");
            
        } else {
            if (typeof data != null) {
                saveexisting = 1;
            }
            $("#dialog-save p").html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>Your page saved successfully');
            $("#dialog-save").dialog("close");
            fn(data);
        }
    });

}
$('#preview').click(function () {
    canvas.deactivateAll();
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');

    var img_dataurl = canvas.toDataURL("image/png");
    window.open(img_dataurl, "_blank");
});
$('#preview2').click(function () {
    canvas.deactivateAll();
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');
    runZoomIn();
    runZoomIn();
    runZoomIn();
    var img_dataurl = canvas.toDataURL("image/png");
    window.open(img_dataurl, "_blank");
    runZoomOut();
    runZoomOut();
    runZoomOut();
});


$('#setpdf').click(function () {
	if(saveexisting==0)
    previewmode = true;
	var gr=_isGrid;
	toggleGrid(false,function(){
		savejson(function (data) {
			$('#dialog-pdf').dialog("open");
			
			$('#topdf').attr('href', 'dopdf.php?data=' + data + '&name=' + fname);

		}, '', '');
	});
	if(gr)
	{
		toggleGrid(true,function(){canvas.renderAll();});
	}
});

function getc(obj) {
    if (obj.constructor) {
        return obj.constructor.toString().replace(/^.*function\s+([^\s]*|[^\(]*)\([^\x00]+$/, "$1");
    }
    return null;
}
$('#save').click(function () {
    previewmode = false;
    if (userid == 'guest') {
        needToConfirm = false;
        //window.location='../home/customer/account/login';
        $.prompt(a5, {
            callback: mycallbackform,
            buttons: {
                Close: false,
                Continue: true
            },
            focus: 1
        });
    } else {
        savejson(function () {}, 'file', '');
    }
});
$('#upload').click(function () {
    if (userid == 'guest') {
        needToConfirm = false;
        //window.location='../home/customer/account/login';
        $.prompt(a4, {
            callback: mycallbackform,
            buttons: {
                Close: false,
                Continue: true
            },
            focus: 1
        });
    } else {
        $('#sos').hide();
		$('#uploadifive-file_upload input:last-child').click();
        $.get('cat.php', {
            uid: userid
        }, function (data) {
            $('.xhr ul').html(data);
            
			$("#dialog-upload").dialog('open');
			

            $(".xhr li").hover(function () {
                $(this).find('.delstore,.crop').fadeIn('fast');
            }, function () {
                $(this).find('.delstore,.crop').fadeOut('fast');
            });
                    $('.delstore').click(function () {
						if(!isUse($(this).parent().find('.img').attr('src')))
						{
                        $(this).parent().remove();
                        $.get('delstore.php', {
                            file: $(this).parent().find('.img').attr('src')
                        }, function () {

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });
            $('.crop').click(function () {
                crop($(this).parent().find('.img').attr('src'));
            });


        });
    }


});
$('#uploadfont').click(function () {
    if (userid == 'guest') {
        needToConfirm = false;
        //window.location='../home/customer/account/login';
        $.prompt(a4, {
            callback: mycallbackform,
            buttons: {
                Close: false,
                Continue: true
            },
            focus: 1
        });
    } else {
        $('#sosfont').hide();
		$('#uploadifive-file_upload_font input:last-child').click();
        $.get('catfont.php', {
            uid: userid
        }, function (data) {
            console.log(data);


            $("#dialog-upload-font").dialog('open');
			
            $('#xhrfont ul').html(data);

            $("#xhrfont li").hover(function () {
                $(this).find('.delstorefont').fadeIn('fast');
            }, function () {
                $(this).find('.delstorefont').fadeOut('fast');
            });
                    $('.delstorefont').click(function () {		
						if(!isUse($(this).parent().find('span:eq(0)').css('font-family')))
						{
                        $(this).parent().remove();
                        $.get('delstorefont.php', {
                            file: $(this).parent().find('span:eq(0)').attr('src')

                        })
						}else
						{
							msg('cannot delete aset library while used on canvas');
						};
                    });

        });
    }


});

function sync(xob, obj) {
    for (var propertyName in xob) {
        if ((typeof xob[propertyName] != "object") && (typeof xob[propertyName] != "array") && (typeof xob[propertyName] != "function")) {
            if (propertyName == 'theta') {
                obj.setAngle(xob[propertyName] * 180 / Math.PI);
            } else {
                obj[propertyName] = xob[propertyName];
            }
            //console.log(propertyName,xob[propertyName]);
        }
    }

}
function jsontocanvas(data) {
    canvas.clear();
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');

    canvas.setHeight(rhei);
    canvas.setWidth(rwid);
    //updateCG(canvas);                        

    stack = [];
    redo = [];
    IDs = 0;
    iur = 0;
    ire = 0;
    var objects = JSON.retrocycle(JSON.parse(data));
    //console.log('objecxt',objects);
    var wait = false;
    for (var i in objects) {
        IDs = i + 1;
        //console.log('i',i);
        //////console.log(objects[i].type, objects[i]);
        if (objects[i].type == "triangle") {
            var xob = objects[i];
            var sh = new fabric.Triangle({
                left: xob.left,
                top: xob.top,
                width: xob.width,
                height: xob.height,
                fill: xob.fill
            });
            sh.pack = "shape";
            sync(xob, sh);

            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "ellipse") {
            var xob = objects[i];
            var sh = new fabric.Ellipse({
                left: xob.left,
                top: xob.top,
                rx: xob.rx,
                ry: xob.ry,
                fill: xob.fill
            });
            sh.pack = "shape";
            sync(xob, sh);

            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "circle") {
            var xob = objects[i];
            var sh = new fabric.Circle({
                left: xob.left,
                top: xob.top,
                radius: xob.radius,
                fill: xob.fill
            });
            sh.pack = "shape";
            sync(xob, sh);

            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "line") {
            var xob = objects[i];
            var sh = new fabric.Line({
                left: xob.left,
                top: xob.top,
                width: xob.width,
                height: xob.height,
                stroke: xob.stroke
            });
            sh.pack = "shape";
            sync(xob, sh);
            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "rect") {
            var xob = objects[i];
            var sh = new fabric.Rect({
                left: xob.left,
                top: xob.top,
                width: xob.width,
                height: xob.height,
                fill: xob.fill
            });
            sh.Round = true;
            sh.pack = "shape";
            sync(xob, sh);
            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "text") {
            var xob = objects[i];
            txtchanged = true;
            var text = new fabric.Text(xob.text, {
                left: xob.left,
                top: xob.top,
                fontFamily: xob.fontFamily,
                fontSize: 100,

                lockUniScaling: true,
                lockScalingY: true,
                lockScalingX: true,

                fill: xob.fill,
            });

            sync(xob, text);
            text.fontSize = 100;

            if (xob.fontSize != 100) {
                console.log('OLD', xob.fontSize);
                text.xfontSize = xob.fontSize;
                text.scale(norma(xob.fontSize) / 100);
            } else {

                text.xfontSize = (text.scaleY * 100);
            }
            text.pack = "shape";

            //console.log(xob.fontSize);
            //text.xfontSize = xob.fontSize;
            text.stacked = false;
            canvas.add(text);
            text.lockScalingX = true;
            text.lockScalingY = true;
            stateupdate(1);
            canvas.sendToBack(text);
        } else if (objects[i].type == 'svg') {
            var xoc = objects[i];
            //console.log("wait",wait);

            wait = true;
            fabric.loadSVGFromURL(xoc.src, xoc, function (dat, objects, options) {

                var xob = dat;
                //console.log(xob.src);
                var loadedObject;
                if (objects.length > 1) {
                    loadedObject = new fabric.PathGroup(objects, options);
                } else {
                    loadedObject = objects[0];
                }
                //console.log(xob.src,xob,objects);
                loadedObject.set({
                    left: xob.left,
                    top: xob.top,
                    angle: 0
                });
                loadedObject.svgsrc = xob.src;
                if ((loadedObject.width > canvas.getWidth()) || (loadedObject.height > canvas.getHeight())) {
                    loadedObject.scale(0.9 / (loadedObject.width / canvas.getWidth()), 0.9 / (loadedObject.height / canvas.getHeight()));
                }
                sync(xob, loadedObject);

                loadedObject.type = "svg";
                loadedObject.src = xob.src;
                loadedObject.setCoords();
                loadedObject.stacked = false;
                canvas.add(loadedObject);

                stateupdate(1);
                wait = false;
                canvas.renderAll();
            });

        } else if (objects[i].type == "image") {
            var xobx = objects[i];
            var image = new fabric.Image.fromURL(xobx, xobx.src, function (dt, image) {
                var xob = dt;

                image.set({
                    left: xob.left,
                    top: xob.top,
                    angle: 0
                });

                sync(xob, image);



                //console.log(xob.type,xob.src,image);
                image.stacked = false;
                image.setCoords();
                canvas.add(image);
                stateupdate(1);
                canvas.sendToBack(image);


            });



        } else if (objects[i].type == "path") {
            var xob = objects[i];
            var path = new fabric.Path.fromObject(xob);
            canvas.add(path);
            stateupdate(1);
            canvas.sendToBack(path);
        } else if (objects[i].type = "path-group") {
            var xob = objects[i];
            //////console.log(xob.svgsrc);
            fabric.loadSVGFromURL(xob.svgsrc, null, function (n, objects, options) {
                var loadedObject;
                if (objects.length > 1) {
                    loadedObject = new fabric.PathGroup(objects, options);
                } else {
                    loadedObject = objects[0];
                }
                loadedObject.set({
                    left: 100,
                    top: 100,
                    angle: 0

                });

                for (var c in xob.stateProperties) {
                    if (
                    (xob.stateProperties[c] == "left") || (xob.stateProperties[c] == "top") || (xob.stateProperties[c] == "angle") || (xob.stateProperties[c] == "fill") || (xob.stateProperties[c] == "flipX") || (xob.stateProperties[c] == "flipY") || (xob.stateProperties[c] == "opacity") || (xob.stateProperties[c] == "stroke") || (xob.stateProperties[c] == "lineHeight") || (xob.stateProperties[c] == "strokeWidth")) {
                        loadedObject.set(xob.stateProperties[c], xob[xob.stateProperties[c]]);
                        //////console.log(xob.stateProperties[c], xob[xob.stateProperties[c]]);
                        if (xob.stateProperties[c] == 'angle') {
                            loadedObject.setAngle(xob[xob.stateProperties[c]]);
                            ////////console.log("set angle");
                        }

                    }
                    if (xob.type != "text") {
                        if (xob.stateProperties[c] == "width") {
                            loadedObject.lukwidth(xob[xob.stateProperties[c]]);
                            //////////console.log(obj.stateProperties[c],un.state[obj.stateProperties[c]]);
                        } else if (xob.stateProperties[c] == "height") {
                            loadedObject.lukheight(xob[xob.stateProperties[c]]);
                            //alert(un.state[obj.stateProperties[c]]);
                        }
                    }

                }
                loadedObject.setCoords();
                loadedObject.src = src;
                loadedObject.type = "svg";
                canvas.add(loadedObject);


            });

        }


    }
    $('#openxmldlg').dialog("close");
}
function backtocanvas(mobj) {
    console.log(mobj);
    canvas.clear();
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');


    //updateCG(canvas);                        

    var objects = mobj;
    //console.log('objecxt',objects);
    var wait = false;
    for (var i in objects) {
        IDs = i + 1;
        console.log(objects[i]);
        //console.log('i',i);
        //////console.log(objects[i].type, objects[i]);
        if (objects[i].type == "triangle") {
            var xob = objects[i];
            var sh = new fabric.Triangle({
                left: xob.left,
                top: xob.top,
                width: xob.width,
                height: xob.height,
                fill: xob.fill
            });
            sh.pack = "shape";
            sync(xob, sh);

            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "ellipse") {
            var xob = objects[i];
            var sh = new fabric.Ellipse({
                left: xob.left,
                top: xob.top,
                rx: xob.rx,
                ry: xob.ry,
                fill: xob.fill
            });
            sh.pack = "shape";
            sync(xob, sh);

            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "circle") {
            var xob = objects[i];
            var sh = new fabric.Circle({
                left: xob.left,
                top: xob.top,
                radius: xob.radius,
                fill: xob.fill
            });
            sh.pack = "shape";
            sync(xob, sh);

            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "line") {
            var xob = objects[i];
            var sh = new fabric.Line({
                left: xob.left,
                top: xob.top,
                width: xob.width,
                height: xob.height,
                stroke: xob.stroke
            });
            sh.pack = "shape";
            sync(xob, sh);
            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "rect") {
            var xob = objects[i];
            var sh = new fabric.Rect({
                left: xob.left,
                top: xob.top,
                width: xob.width,
                height: xob.height,
                fill: xob.fill
            });
            sh.Round = true;
            sh.pack = "shape";
            sync(xob, sh);
            sh.setCoords();
            sh.stacked = false;
            canvas.add(sh);
            stateupdate(1);
            canvas.sendToBack(sh);
        } else if (objects[i].type == "text") {
            var xob = objects[i];
            txtchanged = true;
            var text = new fabric.Text(xob.text, {
                left: xob.left,
                top: xob.top,
                fontFamily: xob.fontFamily,
                fontSize: 100,

                lockUniScaling: true,
                lockScalingY: true,
                lockScalingX: true,

                fill: xob.fill,
            });

            sync(xob, text);
            text.fontSize = 100;


            if (xob.fontSize != 100) {
                console.log('OLD', xob.fontSize);
                text.xfontSize = xob.fontSize;
                text.scale(norma(xob.fontSize) / 100);
            } else {

                text.xfontSize = (text.scaleY * 100);
            }

            text.pack = "shape";

            //console.log(xob.fontSize);
            //text.xfontSize = xob.fontSize;
            text.stacked = false;
            canvas.add(text);
            text.lockScalingX = true;
            text.lockScalingY = true;
            stateupdate(1);
            canvas.sendToBack(text);
        } else if (objects[i].type == 'svg') {
            var xoc = objects[i];
            //console.log("wait",wait);

            wait = true;
            fabric.loadSVGFromURL(xoc.src, xoc, function (dat, objects, options) {

                var xob = dat;
                //console.log(xob.src);
                var loadedObject;
                if (objects.length > 1) {
                    loadedObject = new fabric.PathGroup(objects, options);
                } else {
                    loadedObject = objects[0];
                }
                //console.log(xob.src,xob,objects);
                loadedObject.set({
                    left: xob.left,
                    top: xob.top,
                    angle: 0
                });
                loadedObject.svgsrc = xob.src;
                if ((loadedObject.width > canvas.getWidth()) || (loadedObject.height > canvas.getHeight())) {
                    loadedObject.scale(0.9 / (loadedObject.width / canvas.getWidth()), 0.9 / (loadedObject.height / canvas.getHeight()));
                }
                sync(xob, loadedObject);

                loadedObject.type = "svg";
                loadedObject.src = xob.src;
                loadedObject.setCoords();
                loadedObject.stacked = false;
                canvas.add(loadedObject);

                stateupdate(1);
                wait = false;
                canvas.renderAll();
            });

        } else if (objects[i].type == "image") {
            var xobx = objects[i];
            var image = new fabric.Image.fromURL(xobx, xobx.src, function (dt, image) {
                var xob = dt;

                image.set({
                    left: xob.left,
                    top: xob.top,
                    angle: 0
                });

                sync(xob, image);



                //console.log(xob.type,xob.src,image);
                image.stacked = false;
                image.setCoords();
                canvas.add(image);
                stateupdate(1);
                canvas.sendToBack(image);


            });



        } else if (objects[i].type == "path") {
            var xob = objects[i];
            var path = new fabric.Path.fromObject(xob);
            canvas.add(path);
            stateupdate(1);
            canvas.sendToBack(path);
        } else if (objects[i].type = "path-group") {
            var xob = objects[i];
            //////console.log(xob.svgsrc);
            fabric.loadSVGFromURL(xob.svgsrc, null, function (n, objects, options) {
                var loadedObject;
                if (objects.length > 1) {
                    loadedObject = new fabric.PathGroup(objects, options);
                } else {
                    loadedObject = objects[0];
                }
                loadedObject.set({
                    left: 100,
                    top: 100,
                    angle: 0

                });

                for (var c in xob.stateProperties) {
                    if (
                    (xob.stateProperties[c] == "left") || (xob.stateProperties[c] == "top") || (xob.stateProperties[c] == "angle") || (xob.stateProperties[c] == "fill") || (xob.stateProperties[c] == "flipX") || (xob.stateProperties[c] == "flipY") || (xob.stateProperties[c] == "opacity") || (xob.stateProperties[c] == "stroke") || (xob.stateProperties[c] == "lineHeight") || (xob.stateProperties[c] == "strokeWidth")) {
                        loadedObject.set(xob.stateProperties[c], xob[xob.stateProperties[c]]);
                        //////console.log(xob.stateProperties[c], xob[xob.stateProperties[c]]);
                        if (xob.stateProperties[c] == 'angle') {
                            loadedObject.setAngle(xob[xob.stateProperties[c]]);
                            ////////console.log("set angle");
                        }

                    }
                    if (xob.type != "text") {
                        if (xob.stateProperties[c] == "width") {
                            loadedObject.lukwidth(xob[xob.stateProperties[c]]);
                            //////////console.log(obj.stateProperties[c],un.state[obj.stateProperties[c]]);
                        } else if (xob.stateProperties[c] == "height") {
                            loadedObject.lukheight(xob[xob.stateProperties[c]]);
                            //alert(un.state[obj.stateProperties[c]]);
                        }
                    }

                }
                loadedObject.setCoords();
                loadedObject.src = src;
                loadedObject.type = "svg";
                canvas.add(loadedObject);


            });

        }


    }

}

$('#topdf').click(function () {
    $('#dialog-pdf').dialog("close");
});
$('#openx').click(function () {
    //alert(userid);
    if (userid == 'guest') {
        needToConfirm = false;
        //window.location='../home/customer/account/login';
        $.prompt(a6, {
            callback: mycallbackform,
            buttons: {
                Close: false,
                Continue: true
            },
            focus: 1
        });
    } else {
        //alert('x');

        $('#openxmldlg').dialog("open");
    }
});
$(document).keydown(function (e) {
    if (e.which === 90 && e.ctrlKey) {
        undo();
    } else if (e.which === 89 && e.ctrlKey) {
        goredo();
    }
    /*
        var ar=new Array(33,34,35,36,37,38,39,40);      
        var key = e.which;      
         if($.inArray(key,ar) > -1) {
                  e.preventDefault();
                  //return false;
              }
              */
    return true;
});
var ctrldown = 0;
var objcopy = null;

function doKeyUp(evt) {
    if (evt.keyCode == 17) {
        ctrldown = 0;
        objcopy = null;
    }
}
function doKeyDown(evt) {
    var activeObject = canvas.getActiveObject();
    //if(!activeObject){return false;}
    var gr = canvas.getActiveGroup();
    if (!inText) {
        switch (evt.keyCode) {

            case 46:
                /* Up arrow was pressed */
                $('#textoption').fadeOut("slow");
                $('#objoption').fadeOut('slow');
                $('#imgoption').fadeOut('slow');
                $('#groption').fadeOut('slow');
                if (gr) {
                    var objs = gr.getObjects();
                    for (var i in objs) {
                        canvas.remove(objs[i]);
                    }
                    canvas.deactivateAll();
                    $('#textoption').fadeOut('slow');
                    $('#imgoption').fadeOut('slow');
                    $('#objoption').fadeOut('slow');
                    $('#groption').fadeOut('slow');

                } else {
                    canvas.remove(activeObject);
                    updateinfo();
                }
                canvas.renderAll();
                break;
            case 8:
                /* Up arrow was pressed */
                $('#textoption').fadeOut("slow");
                $('#objoption').fadeOut('slow');
                $('#imgoption').fadeOut('slow');
                $('#groption').fadeOut('slow');
                if (gr) {
                    var objs = gr.getObjects();
                    for (var i in objs) {
                        canvas.remove(objs[i]);
                    }
                    canvas.deactivateAll();
                    $('#textoption').fadeOut('slow');
                    $('#imgoption').fadeOut('slow');
                    $('#objoption').fadeOut('slow');
                    $('#groption').fadeOut('slow');

                } else {
                    canvas.remove(activeObject);
                    updateinfo();
                }
                canvas.renderAll();
                break;

            case 38:

                /* Up arrow was pressed */
                if (activeObject.top > 0) {
                    activeObject.top--;
                    canvas.renderAll();
                    updateinfo();
                }
                break;
            case 40:
                /* Down arrow was pressed */
                if (activeObject.top < canvas.height) {
                    activeObject.top++;
                    canvas.renderAll();
                    updateinfo();
                }
                break;
            case 37:
                /* Left arrow was pressed */
                if (activeObject.left > 0) {
                    activeObject.left--;
                    updateinfo();
                    canvas.renderAll();
                }
                break;
            case 39:
                /* Right arrow was pressed */
                if (activeObject.left < canvas.width) {
                    activeObject.left++;
                    canvas.renderAll();
                    updateinfo();
                }
                break;
            case 17:
                ctrldown = 1;
                break;
            case 68:

                if (evt.ctrlKey) {

                    evt.preventDefault();
                    var ac = canvas.getActiveObject();
                    if (ac) {
                        //console.log('c');  
                        objcopy = fabric.util.object.clone(ac);
                        objcopy.set("top", ac.top + 25);
                        objcopy.set("left", ac.left + 25);
                        if (objcopy) {
                            canvas.deactivateAll();
                            $('#textoption').fadeOut('slow');
                            $('#imgoption').fadeOut('slow');
                            $('#objoption').fadeOut('slow');
                            $('#groption').fadeOut('slow');

                            objcopy.stacked = false;
                            objcopy.setCoords();
                            //console.log('v',objcopy);
                            //objcopy.ID='obj'+parseInt(parseInt(IDs)+1);
                            canvas.add(objcopy);
                            canvas.renderAll();

                            stateupdate(1);
                        }

                    }

                }
                break;
        }
    }
}
window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);


$('.size').each(function () {
    $(this)[0].onchange = function () {
        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.strokeWidth = this.value;
        canvas.renderAll();
    }
});
var firstin = false;
var firstval = false;
var vv = 0;

function topx(s) {
    return (s * 11.875) / rate;
}

function tomm(s) {
    //console.log(rate);
    return (s / 11.875) * rate;
}
$('input[type=number]').each(function () {
    $(this).change(function () {

        //stateupdate(0);

    });
    $(this).focus(function () {

        var activeObject = canvas.getActiveObject();

        tmp = topx($(this).val());
        tp = $(this).val();
        inText = true;
        ////////console.log('focus',tmp);
    });
    $(this).keyup(function () {

        canvas.renderAll();
        //if ($(this).val() == tp) {return false;}

        if ($(this).val() != '') {
            var val = topx($(this).val());
            if ($(this).parent().parent().find('.lock:first').attr('data-val') == 'lock') {
                if ((val != '') && (val > 0)) {
                    var nv = val / tmp;
                    //  ////console.log(val+'/'+tmp);
                    if ($(this).attr('title') == 'width') {
                        //////////console.log('width');
                        if (!firstval) {
                            vv = topx($(this).parent().parent().parent().find('.height:first').val());

                            firstval = true;
                        }

                        $(this).parent().parent().parent().find('.height:first').val(tomm(vv * nv));
                    } else if ($(this).attr('title') == 'height') {
                        if (!firstval) {
                            vv = topx($(this).parent().parent().parent().find('.width:first').val());
                            firstval = true;
                            //       ////console.log('init',vv);
                        }
                        //////console.log(vv,nv);
                        $(this).parent().parent().parent().find('.width:first').val(tomm(vv * nv));
                        //////console.log(tomm(vv*nv));
                    }
                    //tmp=val;    
                }
            }
            var activeObject = canvas.getActiveObject();
            //    if(!activeObject){return false;}
            var va = 0;
            if ($(this).attr('title') == 'opacity') {
                va = 1 - ($(this).val() / 100);
                activeObject.set('opacity', va);
            }
            va = $(this).val();
            if ($(this).attr('title') == 'lineHeight') {



                var activeObject = canvas.getActiveObject();
                //if(!activeObject){return false;}
                activeObject.set('lineHeight', $(this).val());
                activeObject.setCoords();
                canvas.renderAll();
                var left = 0;
                var top = 0;

                var ha = parseFloat((parseFloat(activeObject.getHeight()) / 2) - parseFloat(parseFloat(activeObject.gh) / 2));
                //console.log("h",ha,"he gh",(parseFloat(activeObject.getHeight())/2),parseFloat(parseFloat(activeObject.gh)/2));
                top = activeObject.gtop + ha;

                activeObject.set('top', top);
                //console.log(activeObject.gtop);
                canvas.renderAll();

            } else if ($(this).attr('title') == 'fontSize') {



                var activeObject = canvas.getActiveObject();

                var f = parseFloat($(this).val()) / parseFloat(activeObject.xfontSize);
                var s = (activeObject.scaleY * 100) * f;
                activeObject.scale(parseFloat(s) / 100);
                activeObject.xfontSize = parseFloat($(this).val());
                activeObject.setCoords();


                canvas.renderAll();
                var left = 0;
                var top = 0;

                var ha = parseFloat((parseFloat(activeObject.getHeight()) / 2) - parseFloat(parseFloat(activeObject.gh) / 2));
                var wa = parseFloat((parseFloat(activeObject.getWidth()) / 2) - parseFloat(parseFloat(activeObject.gw) / 2));

                top = activeObject.gtop + ha;
                left = activeObject.gleft + wa;

                activeObject.set('top', top);
                activeObject.set('left', left);

                canvas.renderAll();

            } else if ($(this).attr('title') == 'rx') {
                activeObject.rx = parseInt($(this).val());
                activeObject.ry = parseInt($(this).val());
            } else if ($(this).attr('title') == 'ry') {

                activeObject.ry = parseInt($(this).val());
            } else if ($(this).attr('title') == 'left') {
                var vvx = (parseFloat($(this).val()) * (1.9 * (crate / 6.2))) + parseFloat(activeObject.getWidth() / 2);


                activeObject.set('left', vvx);

            } else if ($(this).attr('title') == 'top') {
                var vvx = (parseFloat($(this).val()) * (1.9 * (crate / 6.2))) + parseFloat(activeObject.getHeight() / 2);

                activeObject.set('top', vvx);
            } else if ($(this).attr('title') == 'width') {
                if (activeObject.pack == "shape") {
                    activeObject.lukwidth(topx(va) * 0.3528);
                } else {
                    activeObject.lukwidth(topx(va));
                    activeObject.lukheight(topx($(this).parent().parent().parent().find('.height:first').val()));
                }
            } else if ($(this).attr('title') == 'height') {
                if (activeObject.pack == "shape") {
                    activeObject.lukheight(topx(va) * 0.3528);
                } else {
                    activeObject.lukheight(topx(va));
                    activeObject.lukwidth(topx($(this).parent().parent().parent().find('.width:first').val()));

                }

            } else if ($(this).attr('title') == 'angle') {
                activeObject.setAngle(va);
                ////////console.log("set angle");
            } else if ($(this).attr('title') == 'strokeWidth') {
                if (activeObject.type == "text") {
                    if (va == 0) {
                        va = 1;
                    } else {
                        va = va * 5;
                    }
                }
                activeObject.set($(this).attr('title'), va);
            } else {

                activeObject.set($(this).attr('title'), va);
            }


        }
    });
    $(this).mousedown(function () {
        if (!firstin) {
            firstin = true;
            $(this).trigger('focus');
        }

        $(this).trigger('keyup');
    });
    $(this).mouseup(function () {
        $(this).trigger('keyup');
    });
    $(this).blur(function () {
        firstin = false;
        vv = 0;
        firstval = false;
        inText = false;
        stateupdate();
    });

});

$('input[type=range]').each(function () {

    $(this).change(function () {

        var $v = $(this).parent().parent().find('input[type=number]');
        $v.val($(this).val());
        var activeObject = canvas.getActiveObject();
        if ($(this).attr('title') == 'opacity') {
            var va = 1 - (($(this).val()) / 100);
            activeObject.set('opacity', va);
        } else {
            var va = $(this).val();
        }
        if ($(this).attr('title') == 'width') {
            activeObject.lukwidth(va);
        } else if ($(this).attr('title') == 'height') {
            activeObject.lukheight(va);
        } else if ($(this).attr('title') == 'angle') {
            activeObject.setAngle(va);
            ////////console.log("set angle");
        } else {
            activeObject.set($(this).attr('title'), va);
        }
        activeObject.setCoords();
        canvas.renderAll();
    });
    $(this).keyup(function () {
        stateupdate(0);
    });

    $(this).mouseup(function () {

        stateupdate(0);
        //////console.log(stack);
    });

});
function addObj(event,ui)
{

	
        var src = ui.draggable.attr('source');
        var source = ui.draggable.attr('source');
        var width = ui.draggable.attr('width');
        var hegiht = ui.draggable.attr('height');
        var type = ui.draggable.attr('type');
        var pack = ui.draggable.attr('pack');
        var font = ui.draggable.attr('data-val');
		
        var of = $("#c").offset();
		
        var pos = canvas.getPointer(event.originalEvent);
		console.log(pos);
		
        var doc = document.getElementById('canvas');
        var left = doc.scrollLeft;
        var top = doc.scrollTop
        var pleft = pos.x + left;
        var ptop = pos.y + top;
		
        if (type == 'rect') {
            var rect = new fabric.Rect({
                left: pleft,
                top: ptop,
                width: 100,
                height: 100,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1
            });
            rect.pack = "shape";
            rect.setCoords();
            rect.Round = true;
            canvas.add(rect);

            canvas.renderAll();
        } else if (type == 'circle') {
            var circle = new fabric.Circle({
                left: pleft,
                top: ptop,
                radius: 50,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1

            });
            circle.pack = "shape";
            canvas.add(circle);
            canvas.renderAll();
        } else if (type == 'triangle') {
            var triangle = new fabric.Triangle({
                left: pleft,
                top: ptop,
                width: 100,
                height: 100,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1

            });
            triangle.pack = "shape";
            canvas.add(triangle);
            canvas.renderAll();
        }
        if (type == "line") {
            var line = new fabric.Line([pleft, ptop, 100, 0], {
                left: pleft,
                top: ptop,
                stroke: 'black',
                fill: 'black',
                strokeWidth: 1
            });
            canvas.add(line);
            canvas.renderAll();
        } else if (type == "ellipse") {
            var ellipse = new fabric.Ellipse({
                rx: 45,
                ry: 80,
                fill: 'none',
                stroke: 'black',
                strokeWidth: 1,
                angle: 90,
                left: pleft,
                top: ptop
            });
            ellipse.pack = "shape";
            canvas.add(ellipse);
        } else if (type == 'svg') {
            fabric.loadSVGFromURL(src, null, function (n, objects, options) {
                var loadedObject;
                if (objects.length > 1) {
                    loadedObject = new fabric.PathGroup(objects, options);
                } else {
                    loadedObject = objects[0];
                }
                loadedObject.set({
                    left: pleft,
                    top: ptop,
                    angle: 0
                });
                if (pack == "line") {
                    loadedObject.noFill = true;
                    loadedObject.pack = "shape";
                }
                loadedObject.svgsrc = src;
                if ((loadedObject.width > canvas.getWidth()) || (loadedObject.height > canvas.getHeight())) {
                    loadedObject.scale(0.9 / (loadedObject.width / canvas.getWidth()), 0.9 / (loadedObject.height / canvas.getHeight()));
                }
                loadedObject.src = src;
                loadedObject.type = "svg";
                canvas.add(loadedObject);

                canvas.calcOffset();
                loadedObject.type = "svg";

                stateupdate(1);
                canvas.renderAll();
            });
        } else if (type == 'img') {
            var image = new fabric.Image.fromURL(null, src, function (dt, image) {
                image.set({
                    left: pleft,
                    top: ptop,
                    angle: 0
                });
                ////////console.log(image.width,image.height);                


                image.lukwidth(image.width);
                image.lukheight(image.height);
                //image.scale();
                ////////////console.log(image.width, canvas.getWidth());
                if ((image.wid > canvas.getWidth())) {
                    var wo = image.width;
                    image.lukwidth(canvas.getWidth());
                    var nn = image.height * (image.wid / wo);
                    image.lukheight(nn);
                    if (nn > canvas.getHeight()) {
                        image.lukheight(canvas.getHeight());
                        var nw = image.width * (image.hei / nn);
                        image.lukwidth(nw);

                    }
                } else {
                    if ((image.hei > canvas.getHeight())) {
                        var wo = image.height;
                        image.lukheight(canvas.getHeight());
                        var nn = image.width * (image.hei / wo);
                        image.lukwidth(nn);
                        if (nn > canvas.getWidth()) {
                            image.lukwidth(canvas.getWidth());
                            var nw = image.height * (image.wid / nn);
                            image.lukheight(nw);

                        }
                    }

                }
                if (src.indexOf('.pdf') > 0) {

                    image.scale(canvas.getWidth() / image.width, canvas.getHeight() / image.height);
                }

                //alert('x');
                //console.log(image);
                canvas.add(image);
                canvas.renderAll();
                stateupdate(1);
            });
        } else if (type == 'text') {
			
            var dtext = font.replace('uid' + userid);
            var text = new fabric.Text(dtext, {
                left: pleft,
                top: ptop,
                lockScalingY: true,
                lockScalingX: true,
                lockUniScaling: true,
                fontFamily: font,
                fontSize: 100,
                fill: '#000'
            });

            text.scale(norma(12) / 100);
            text.xfontSize = 12;
            text.pack = "shape";
            //canvas.centerObject(text);
            canvas.add(text);
            text.lockScalingX = true;
            text.lockScalingY = true;
            stateupdate(1);
            canvas.renderAll();
        } else if (type == 'tpl') {
            var image = new fabric.Image.fromURL(null, source, function (dt, image) {
                image.set({
                    left: pleft,
                    top: ptop,
                    angle: 0
                });
                //image.scale();
                canvas.add(image);
                stateupdate(1);
                canvas.renderAll();
            });
        }

    }
$("#c").droppable({
    drop: function (event, ui) {
		addObj(event,ui);
	}
})

//end bg selectr
//start  event
$('#color').css('background-color', canvas.backgroundColor);
$('#txt').focus(function (event) {
    // Act on the event
    inText = true;
});
$('#txt').blur(function (event) {
    // Act on the event
    inText = false;
    var activeObject = canvas.getActiveObject();
    activeObject.gw = activeObject.getWidth();
    activeObject.gleft = parseFloat(activeObject.left);
    activeObject.gh = activeObject.getHeight();
    activeObject.gtop = parseFloat(activeObject.top);

});
var h1 = 0;
var w1 = 0;
$('#txt').keyup(function () {
    txtchanged = true;
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.text = $('#txt').val();
        canvas.renderAll();
        var left = 0;
        var top = 0;
        var wa = parseFloat((parseFloat(activeObject.getWidth()) / 2) - parseFloat(parseFloat(activeObject.gw) / 2));
        var ha = parseFloat((parseFloat(activeObject.getHeight()) / 2) - parseFloat(parseFloat(activeObject.gh) / 2));
        var a = Math.abs(activeObject.getAngle());
        if (a > 90 && a <= 180) {
            a = Math.abs(a - 180);
        } else if (a > 180 && a <= 270) {
            a = a - 180;
        } else if (a > 270 && a <= 360) {
            a = Math.abs(a - 360);
        }
        left = activeObject.gleft + (wa * (1 - (a / 90))) + (ha * (a / 90));
        top = activeObject.gtop + (ha * (1 - (a / 90))) + (wa * (a / 90));
        activeObject.set('left', left);
        activeObject.set('top', top);

        canvas.renderAll();


    }
});

var safex = 0,
    safey = 0;

function updateinfo() {
    $('#option').fadeOut('slow');

    var activeObject = canvas.getActiveObject();
    activeObject.gw = activeObject.getWidth();
    activeObject.gleft = parseFloat(activeObject.left);
    activeObject.gh = activeObject.getHeight();
    activeObject.gtop = parseFloat(activeObject.top);

    if (canvas.getActiveGroup()) {
        $('#textoption').fadeOut("slow");
        $('#objoption').fadeOut('slow');
        $('#imgoption').fadeOut('slow');
        $('#groption').fadeIn('slow');

    } else {
        if (activeObject && activeObject.type === 'text') {
            $('.bgcolor').css('background-color', activeObject.backgroundColor);
            $('#txt').val(activeObject.text);
            $('#font').val(activeObject.fontFamily);
            console.log(activeObject.scaleY);

            $('.fontsize').val(activeObject.xfontSize);
            if (activeObject.pack == "shape") {
                $('.sizeu').html('pt');
            } else {
                $('.sizeu').html('mm');
            }
            if ((activeObject.stroke != 'none') && (activeObject.stroke != null)) {

                $('.bgborder').css('background-image', 'url(images/select.png)');
                //////console.log("xx");
                $('.bgborder').css('background-color', activeObject.stroke);
            } else {
                //////console.log("ss");
                $('.bgborder').css('background-image', 'url(images/none.gif)');
                //////console.log($('.bgborder')[0]);
            }

            if (activeObject.fill != 'none') {
                $('#textcolor').css('background-image', 'url(images/select.png)');
                $('#textcolor').css('background-color', activeObject.fill);

            } else {
                $('#textcolor').css('background', 'url(images/none.gif)');
            }

            //$('#textcolor').css('background-color', activeObject.fill);
            $('#textoption').fadeIn("slow");
            $('#objoption').fadeOut('slow');
            $('#imgoption').fadeOut('slow');
            $('#groption').fadeOut('slow');
        } else if (activeObject && activeObject.type === 'image') {
            $('#textoption').fadeOut('slow');
            $('#objoption').fadeOut('slow');
            $('#groption').fadeOut('slow');
            $('#imgoption').fadeIn('slow');
        } else {
            if (activeObject.stroke != 'none') {

                $('.bgborder').css('background-image', 'url(images/select.png)');
                $('.bgborder').css('background-color', activeObject.stroke);
            } else {
                $('.bgborder').css('background', 'url(images/none.gif)');
            }
            $('#textoption').fadeOut('slow');
            $('#objoption').fadeIn('slow');
            //console.log(activeObject.type);
            if (activeObject.type == 'line') {
                $('.fullshape1').hide();
                $('.fullshape2').hide();
            } else {
                $('.fullshape1').show();

            }
            if (activeObject.type == "rect") {
                $('.fullshape1').show();
                $('.fullshape2').show();
            }
            if (activeObject.pack == "shape") {
                $('.sizeu').html('pt');
            } else {
                $('.sizeu').html('mm');
            }
            $('#imgoption').fadeOut('slow');
            if (activeObject.type == "rect" || activeObject.type == "ellipse") {
                $('#rectround').show();
            } else {
                $('#rectround').hide();
            }
            if (activeObject.fill != 'none') {
                $('.bgcolor').css('background-image', 'url(images/select.png)');
                $('.bgcolor').css('background-color', activeObject.fill);

            } else {
                $('.bgcolor').css('background', 'url(images/none.gif)');
            }
            $('#groption').fadeOut('slow');
        }
    }

    $('.rotate').val(activeObject.getAngle());
    //$('.scale').val(activeObject.getlukwidth());
    var vas = activeObject.strokeWidth;
    if (activeObject.type == "text") {
        if (vas == 1) {
            vas = 0;
        }
        vas = vas / 5;
    }
    $('.strokeWidth').val(vas);

    $('.opacity').val((1 - activeObject.getOpacity()) * 100);

    if (activeObject.pack == "shape") {

        $('.width').val((activeObject.getWidth() / 11.875) * rate);
        $('.height').val((activeObject.getHeight() / 11.875) * rate);
    } else {
        $('.width').val((activeObject.getWidth() / 11.875) * rate);
        $('.height').val((activeObject.getHeight() / 11.875) * rate);
    }
    if (activeObject.type == "text") {
        $('.width').val((activeObject.getWidth() / 11.875) * rate * 0.3528);
        $('.height').val((activeObject.getHeight() / 11.875) * rate * 0.3528);

    }

    $('.left').val((activeObject.get('left') - (activeObject.getWidth() / 2)) / (1.9 * (crate / 6.2)));
    $('.top').val((activeObject.get('top') - (activeObject.getHeight() / 2)) / (1.9 * (crate / 6.2)));

    $('.rx').val(activeObject.get('rx'));
    $('.ry').val(activeObject.get('ry'));

    $('.lineHeight').val(activeObject.get('lineHeight'));

    $('input[type=number]').each(function () {
        var v = parseFloat($(this).val()).toFixed(1);

        $(this).val(v);
    });
    //console.log('nofill',activeObject.noFill);
    if (activeObject.noFill) {
        $('.fullshape1').hide();

    } else {
        $('.fullshape1').show();
    }
    //console.log(activeObject.Round);
    if (activeObject.Round) {
        $('.fullshape2').show();

    } else {
        $('.fullshape2').hide();
    }


}

canvas.observe('object:moving', function () {

    var activeObject = canvas.getActiveObject();
    if (!activeObject) {
        return false;
    }
    if ((activeObject.left - (activeObject.getWidth() / 2)) > canvas.getWidth()) {
        activeObject.left = safex;
    } else {
        safex = activeObject.left;
    }
    if ((activeObject.top - (activeObject.getHeight() / 2)) > canvas.getHeight()) {
        activeObject.top = safey;
    } else {
        safey = activeObject.top;
    }

    if ((activeObject.left - (activeObject.getWidth() / 2)) < 0) {
        activeObject.left = safex;
    } else {
        safex = activeObject.left;
    }
    if ((activeObject.top - (activeObject.getHeight() / 2)) < 0) {
        activeObject.top = safey;
    } else {
        safey = activeObject.top;
    }
    updateinfo();
});

canvas.observe('selection:cleared', function () {
    $('#textoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#objoption').fadeOut('slow');
    $('#groption').fadeOut('slow');
});
canvas.observe('object:modified', function () {
    needToConfirm = true;
    updateinfo();
    stateupdate();
});


canvas.observe('selection:created', function () {
    $('#textoption').fadeOut("slow");
    $('#objoption').fadeOut('slow');
    $('#imgoption').fadeOut('slow');
    $('#groption').fadeIn('slow');

});

canvas.observe('object:selected', updateinfo);
$('.lock').each(function () {
    $(this).click(function () {

        if ($(this).attr('data-val') == 'lock') {
            $(this).find('img:first').attr('src', 'images/unlock.png');
            $(this).attr('data-val', 'unlock');
            canvas.lockscale = false;
            //console.log('unlock');
        } else {

            $(this).find('img:first').attr('src', 'images/lock.png');
            $(this).attr('data-val', 'lock');
            canvas.lockscale = true;
        }

    });

});
canvas.lockscale = true;
$('.stb').each(function () {
    $(this).click(function () {
        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        canvas.sendBackwards(activeObject);
    });
});
$('.btf').each(function () {
    $(this).click(function () {
        var activeObject = canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        canvas.bringForward(activeObject);
    });
});
$("#imgoption").draggable({
    handle: "div.ui-widget-header",
    drag: function (event, ui) {
        canvas.renderAll();
    }
});
$("#objoption").draggable({
    handle: "div.ui-widget-header",
    drag: function (event, ui) {
        canvas.renderAll();

    }
});
$("#textoption").draggable({
    handle: "div.ui-widget-header",
    drag: function (event, ui) {
        canvas.renderAll();
    }
});
$("#groption").draggable({
    handle: "div.ui-widget-header",
    drag: function (event, ui) {
        canvas.renderAll();
    }
});

fabric.util.addListener(fabric.document, 'dblclick', function (e) {
    var target = canvas.findTarget(e);
    if (target != null) {
        if (target.type == "text") {
            $('#txt').select();
            $('#txt').focus();
        }
    }

});

function jsonLoad(file, data) {
    //console.log(data);
    $('#lbl').html("");
	
    jsontocanvas(data);
    
    fname = file.replace('.xml', '');
    $('#smargin').removeAttr("checked");
}
$('#xmlload').uploadifive({
    'uploadScript': 'uploadxml.php?uid=' + userid,
    'auto': 'true',
    'queueID': 'lbl',
    'fileType': 'text/xml',
    'buttonText': '',
    'onUpload': function (filesToUpload) {

    },
    'onUploadComplete': function (file, data) {
        jsonLoad('uid' + userid + file.name, data);
		saveexisting = 1;

    }
});
$('#savetocloud').click(function () {

    if (userid == 'guest') {
        needToConfirm = false;
        //window.location='../home/customer/account/login';
        $.prompt(a7, {
            callback: mycallbackform,
            buttons: {
                Close: false,
                Continue: true
            },
            focus: 1
        });
    } else {

        savejson(function (data) {
            if (data == 'OVER') {
                $.prompt(a1, {
                    buttons: {
                        Close: true
                    },
                    focus: 1
                });
            } else if (data == 'ERR') {
                $.prompt(a8 + (maxpdfsize / 1024) + 'KB) Is Over Limitation</strong>', {
                    buttons: {
                        Close: true
                    },
                    focus: 1
                });
            } else {
                $.get('dofilepdf.php', {
                    name: fname,
                    data: data,
                    email: email
                });
            }
        }, '', 'file');
    }

});
$('#mfile').click(function () {
    $.get('getFiles.php', {
        email: email
    }, function (data) {
        var arr = data.split("|");
        var res = '';
        var label = '';
        var path = '';
        var ixml = '';
        if (data != 'NO') {
            for (var i in arr) {
                var far = arr[i].split(",");

                label = far[1].replace('.pdf', '');
                path = far[0] + '/' + far[1];
                ixml = far[0] + '/' + far[1].replace('.pdf', '.xml');
                res = res + '<div class="fileitem" ><div style="float:left;margin-top:6px;" ><img src="../favicon.ico" width="20px"></div>&nbsp;<div style="float:left;margin-top:6px;" class="label" >' + label + '</div ><div style="float:right;"><button class="rename" data-name="' + label + '" data-val="' + far[0] + '">Rename</button><button class="editxml" data-name="' + label + '" data-val="' + ixml + '">Open</button>' + '<button class="downloadpdf" data-val="http://pdftool.eu/editor/' + path + '">Pdf</button>' + '<button class="deletepdf" data-val="' + path + '">X</button>' + '</div></div>';
            }
        } else {
            res = '<center><strong>'+c1+'</strong></center>'
        }

        $('#lists').html(res);
        $('.deletepdf').click(function () {
            var t = $(this);
            var r = confirm(b3);
            if (r) {
                $.get('deletepdf.php', {
                    path: $(this).attr('data-val')
                }, function () {
                    t.parent().parent().fadeOut("fast", function () {
                        $(this).remove();
                    });
                })
            }
        });
        $('.rename').click(function () {
            var t = $(this);
            if (fname = prompt("File name", "")) {
                $.get('rename.php', {
                    path: $(this).attr('data-val'),
                    name: $(this).attr('data-name'),
                    newname: fname
                }, function () {

                    t.attr('data-name', fname);
                    t.parent().parent().find('.label:first').html(fname);
                });
            }
        });

        $('.downloadpdf').click(function () {
            var t = $(this);

            window.open($(this).attr('data-val'));
        });
        $('.editxml').click(function () {
        	$('.modal').fadeIn('slow');
            var name = $(this).attr('data-name');
            $.get('doXML.php', {
                filename: $(this).attr('data-val')
            }, function (data) {
                $('#myfiledlg').dialog("close");
                $('.modal').fadeOut('slow');
                jsonLoad(name, data);
				saveexisting = 1;
            });
        });
        $('#myfiledlg').dialog("open");

    });
});
$('#letter').click(function () {
    var r = confirm(b4);
    if (r == true) {
        canvas.clear();
        $('#textoption').fadeOut('slow');
        $('#imgoption').fadeOut('slow');
        $('#objoption').fadeOut('slow');
        $('#groption').fadeOut('slow');

        stack = [];
        redo = [];
        IDs = 0;
        iur = 0;
        ire = 0;
        $('.topmenu button').removeClass('btnactive');
        $(this).addClass('btnactive');
        canvas.setHeight(rhei);
        canvas.setWidth(rwid);
        appname = 'letter';
    }

});
$('#card').click(function () {
    var r = confirm(b4);
    if (r == true) {
        canvas.clear();
        $('#textoption').fadeOut('slow');
        $('#imgoption').fadeOut('slow');
        $('#objoption').fadeOut('slow');
        $('#groption').fadeOut('slow');

        stack = [];
        redo = [];
        IDs = 0;
        iur = 0;
        ire = 0;

        $('.topmenu button').removeClass('btnactive');
        $(this).addClass('btnactive');
        appzoom = 5;

        appname = 'card';
        appzoom = 3;
        canvas.setHeight(96.9 * appzoom);
        canvas.setWidth(171 * appzoom);
    }
});
$('#amplop').click(function () {
    var r = confirm(b4);
    if (r == true) {

        canvas.clear();
        $('#textoption').fadeOut('slow');
        $('#imgoption').fadeOut('slow');
        $('#objoption').fadeOut('slow');
        $('#groption').fadeOut('slow');

        stack = [];
        redo = [];
        IDs = 0;
        iur = 0;
        ire = 0;

        $('.topmenu button').removeClass('btnactive');
        $(this).addClass('btnactive');
        appzoom = 5;

        appname = 'amplop';
        appzoom = 1;
        canvas.setHeight(162 * 1.9);
        canvas.setWidth(229 * 1.9);
    }
});

function autoUpdate() {
    canvas.calcOffset();
    autoUpdateTimer = setTimeout("autoUpdate()", 1000);
}
autoUpdate();