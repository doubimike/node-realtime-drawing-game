$(document).ready(function () {
    var url = 'http://localhost:8082';
    var socket = io.connect(url);

    // 为什么需要一个id呢？
    var id = Math.round($.now() * Math.random());
    console.log(id);

    var canvas = $('#paper');
    var ctx = canvas[0].getContext('2d');

    var drawData = {};

    canvas.on('mousedown', function (event) {
        event.preventDefault();
        console.log('mousedown');
        drawing = true;
        drawData.originX = event.pageX;
        drawData.originY = event.pageY;
    });

    canvas.on('mouseup', function (event) {
        event.preventDefault();
        drawing = false;
        drawData.lastX = event.pageX;
        drawData.lastY = event.pageY;

        // drawLine(drawData.originX,
        //     drawData.originY,
        //     drawData.lastX,
        //     drawData.lastY);
    });

    drawing = false;

    var beginTime = $.now();

    canvas.on('mousemove', function (event) {
        event.preventDefault();
        if (drawing) {
            console.log('mousemove');

            drawData.lastX = event.pageX;
            drawData.lastY = event.pageY;

            if ($.now() - beginTime > 30) {
                drawLine(drawData.originX,
                    drawData.originY,
                    drawData.lastX,
                    drawData.lastY);
                socket.emit('mousemove', {
                    drawData: drawData
                });

                drawData.originX = event.pageX;
                drawData.originY = event.pageY;

                beginTime = $.now();



            }


        }



        // 应该是在这里画线
        // drawLine();

    });

    // 检测
    socket.on('moving', function (data) {
        console.log(data);
        drawLine(data.drawData.originX, data.drawData.originY, data.drawData.lastX, data.drawData.lastY);

    });

    function drawLine(fromx, fromy, tox, toy) {
        console.log('drawing');
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();
    }
});
