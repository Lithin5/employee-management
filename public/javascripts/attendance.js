const video = document.getElementById('idvideoelement')
var localstream;
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

$(document).ready(function () {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startvideo)

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
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const pictcanvas = $('#picturecanvas')[0];
    $('#videocontainer').append(canvas);
    const displaySize = { width: $('#idvideoelement').width(), height: $('#idvideoelement').height() };
    pictcanvas.width = $('#idvideoelement').width();
    pictcanvas.height = $('#idvideoelement').height();

    faceapi.matchDimensions(canvas, displaySize);
    var curentinterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        if (detections.length > 0 && !isIntervalPaused) {
            pictcanvas.getContext('2d').drawImage(video, 0, 0, $('#idvideoelement').width(), $('#idvideoelement').height());
            console.log(detections);
            if (imgnos == 0) {
                $('#sampleimageone').attr('src', pictcanvas.toDataURL());
            } else if (imgnos == 1) {
                $('#sampleimagetwo').attr('src', pictcanvas.toDataURL());
            } else if (imgnos == 2) {
                $('#sampleimagethree').attr('src', pictcanvas.toDataURL());
            } else {                
                clearInterval(curentinterval);                
                localstream.getTracks()[0].stop();
                video.pause();
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            }
            imgnos++;
            isIntervalPaused = true;
            setTimeout(function(){
                isIntervalPaused = false;
            },2500);
        }
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
    }, 1000);
});