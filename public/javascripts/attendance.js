const video = document.getElementById('idvideoelement')
var localstream;
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
$('#idmessage_box').fadeOut(0);
$(document).ready(function () {
    $('#startcapture').click(function () {
        $('#idmessage_box').fadeIn();
        $('#idmessage_box').find('.header').html("Taking your Picture, Please Wait");
        $('#startcapture').fadeOut();
        $('#wholeitemcontainer').fadeIn();
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(startvideo)
    });
    //startvideo();
});
function startvideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = localstream = stream,
        err => console.error(err)
    )
}
var imgnos = 0;
var isIntervalPaused = false;
var canvas;
var pictcanvas;
var displaySize;
var curentinterval;
video.addEventListener('play', () => {
    canvas = faceapi.createCanvasFromMedia(video);
    pictcanvas = $('#picturecanvas')[0];
    $('#videocontainer').append(canvas);
    displaySize = { width: $('#idvideoelement').width(), height: $('#idvideoelement').height() };
    pictcanvas.width = $('#idvideoelement').width();
    pictcanvas.height = $('#idvideoelement').height();
    faceapi.matchDimensions(canvas, displaySize);
    curentinterval = setInterval(function () {
        if (!isIntervalPaused) {
            callVideoRecord();
        }
    }, 100);
});
async function callVideoRecord() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    if (detections.length > 0 && !isIntervalPaused) {
        pictcanvas.getContext('2d').drawImage(video, 0, 0, $('#idvideoelement').width(), $('#idvideoelement').height());
        //console.log(detections);
        if (imgnos == 0) {
            $('#sampleimageone').attr('src', pictcanvas.toDataURL());
            $('#idmessage_box').find('.header').html("Nice Picture :), Waiting for another!!!");
            isIntervalPaused = true;
            setTimeout(function () {
                isIntervalPaused = false;
            }, 2000);
        } else if (imgnos == 1) {
            $('#sampleimagetwo').attr('src', pictcanvas.toDataURL());
            $('#idmessage_box').find('.header').html("Awesome, One more :)");
            isIntervalPaused = true;
            setTimeout(function () {
                isIntervalPaused = false;
            }, 2000);
        } else if (imgnos == 2) {
            $('#sampleimagethree').attr('src', pictcanvas.toDataURL());
            $('#idmessage_box').find('.header').html("Completed, Processing");
            isIntervalPaused = true;
            setTimeout(function () {
                isIntervalPaused = false;
            }, 2000);
        } else {
            $('#idmessage_box').find('.header').html("Analyzing images");            
            clearInterval(curentinterval);
            localstream.getTracks()[0].stop();
            video.pause();
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            $('#idvideoelement').fadeOut();
            $('#videocontainer').fadeOut();
            matchimage();            
        }
        imgnos++;
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections);
}

const threshold = 0.6;
let descriptors = { desc1: null, desc2: null };
async function matchimage(){
    await faceapi.loadFaceRecognitionModel('/models');
    const input = await faceapi.fetchImage(document.getElementById('profilepicturehidden').src);
    descriptors['desc1'] = await faceapi.computeFaceDescriptor(input)

    const input2 = await faceapi.fetchImage(document.getElementById('sampleimageone').src);
    descriptors['desc2'] = await faceapi.computeFaceDescriptor(input2)

    const distance = faceapi.round(
        faceapi.euclideanDistance(descriptors.desc1, descriptors.desc2)
    )
    let text = distance
    let bgColor = '#ffffff'
    if (distance > threshold) {
        text += ' (no match)'
        bgColor = '#ce7575'
    }
    //console.log("match",text);
    $('#distance').html(text)
    $('#distance').css('background-color', bgColor)
    $('#startcapture').fadeIn(100);
    $('#startcapture').html("Try Again!!!");
    $('#idmessage_box').find('.header').html("Cool");            
    
}