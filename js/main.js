$(document).ready(function() {
    if (!(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)) {
        $('body').html('<p id="disclaimer">We are sorry, this experiment only works under the latest version of Google Chrome</p>');
        return;
    }
    App.run();
});