window.onload = init;
var context;
var bufferLoader;

function init() {
  context = new webkitAudioContext();

  bufferLoader = new BufferLoader(
    context,
    ['test.mp3'],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  var source1 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source1.connect(context.destination);
  source1.noteOn(0);
}