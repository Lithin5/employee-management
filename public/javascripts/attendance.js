const video = document.getElementById('idvideoelement')
var localstream;
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
$('#idmessage_box').fadeOut(0);
$('#errormessage').fadeOut(0);
$('#successmessage').fadeOut(0);
$(document).ready(function () {
    $('#startcapture').click(function () {
        $('#sampleimageone').attr('src', '');
        $('#sampleimagetwo').attr('src', '');
        $('#sampleimagethree').attr('src', '');
        $('#errormessage').fadeOut(0);
        $('#successmessage').fadeOut(0);
        $('#idmessage_box').fadeIn();
        $('#picturecontainer').fadeIn();
        $('#idmessage_box').find('.header').html("Taking your Picture, Please Wait");
        $('#startcapture').fadeOut();
        $('#wholeitemcontainer').fadeIn();
        $('#idvideoelement').fadeIn();
        $('#videocontainer').fadeIn();
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
var expressiondetections;
var notcalledfacematch = true;
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
            expressiondetections = detections[0].expressions;
            setTimeout(function () {
                isIntervalPaused = false;
            }, 1000);
        } else if (imgnos == 1) {
            $('#sampleimagetwo').attr('src', pictcanvas.toDataURL());
            $('#idmessage_box').find('.header').html("Awesome, One more :)");
            isIntervalPaused = true;
            setTimeout(function () {
                isIntervalPaused = false;
            }, 1000);
        } else if (imgnos == 2) {
            $('#sampleimagethree').attr('src', pictcanvas.toDataURL());
            $('#idmessage_box').find('.header').html("Last Picture, Processing");
            isIntervalPaused = true;
            setTimeout(function () {
                isIntervalPaused = false;
            }, 10);
        } else {
            $('#idmessage_box').find('.header').html("Analyzing images, Wait");
            clearInterval(curentinterval);
            localstream.getTracks()[0].stop();
            video.pause();
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            $('#idvideoelement').fadeOut();
            $('#videocontainer').fadeOut();
            if (notcalledfacematch) {
                matchimage();
                notcalledfacematch = false;
            }
        }
        imgnos++;
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections);
}

const threshold = 0.4;
let descriptors = { desc1: null, desc2: null };
async function matchimage() {
    await faceapi.loadFaceRecognitionModel('/models');
    var maxdist = 0;
    const input = await faceapi.fetchImage(document.getElementById('profilepicturehidden').src);
    descriptors['desc1'] = await faceapi.computeFaceDescriptor(input)

    var input2 = await faceapi.fetchImage(document.getElementById('sampleimageone').src);
    descriptors['desc2'] = await faceapi.computeFaceDescriptor(input2)
    var distance = await faceapi.round(
        faceapi.euclideanDistance(descriptors.desc1, descriptors.desc2)
    )
    if (distance > maxdist) {
        maxdist = distance;
    }

    input2 = await faceapi.fetchImage(document.getElementById('sampleimagetwo').src);
    descriptors['desc2'] = await faceapi.computeFaceDescriptor(input2)
    distance = await faceapi.round(
        faceapi.euclideanDistance(descriptors.desc1, descriptors.desc2)
    )
    if (distance > maxdist) {
        maxdist = distance;
    }

    input2 = await faceapi.fetchImage(document.getElementById('sampleimagethree').src);
    descriptors['desc2'] = await faceapi.computeFaceDescriptor(input2)
    distance = await faceapi.round(
        faceapi.euclideanDistance(descriptors.desc1, descriptors.desc2)
    )
    if (distance > maxdist) {
        maxdist = distance;
    }
    //console.log("Match", maxdist);
    if (distance > maxdist) {
        $('#startcapture').fadeIn(100);
        imgnos = 0;
        $('#startcapture').html("Try Again!!!");
        $('#errormessage').fadeIn();
    } else { //Matched
        console.log(findexpression(expressiondetections));
        $('#successmessage').fadeIn();
    }

    // Ajax Call to add Expressions
    
    $('#idmessage_box').find('.header').html("Cool, Wait for a while :)");
    $('#picturecontainer').fadeOut(0);
    setTimeout(() => {
        $('#idmessage_box').fadeOut();
    }, 1000);
}
function findexpression(expression) {
    var currentexp = "angry";
    var cval = expression.angry;
    if(cval<expression.disgusted){
        cval = expression.disgusted;
        currentexp = "disgusted";
    }

    if(cval<expression.fearful){
        cval = expression.fearful;
        currentexp = "fearful";
    }
    
    if(cval<expression.happy){
        cval = expression.happy;
        currentexp = "happy";
    }

    if(cval<expression.neutral){
        cval = expression.neutral;
        currentexp = "neutral";
    }

    if(cval<expression.sad){
        cval = expression.sad;
        currentexp = "sad";
    }

    if(cval<expression.surprised){
        cval = expression.surprised;
        currentexp = "sasurprisedd";
    }
    return currentexp;
}
