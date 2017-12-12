(function () {

    function renderCoverPulse(pulse) {
        var div = '<div class="cover__wrapper">' +
            '<a href=" ' + pulse.url + ' " target="_blank">' +
            '<div class="cover__overlay"></div>' +
            '<div class="cover__img">' +
            '<img src="' + pulse.lead_image_url + '" alt="">' +
            '</div>' +
            '<div class="cover__info">' +
            '<span class="cover__smtext">Cover Story</span>' +
            '<h3 class="cover__title"> ' + pulse.title + ' </h3>' +
            '<ul class="cover__infobar">' +
            '<li>' + pulse.domain + '</li>' +
            '</ul>' +
            '</div>' +
            '</a>' +
            '</div>'
        $(".cover").append(div);
    }

    function createPulseElement(pulse) {
        var li = '<li class="card">' +
            '<a href=" ' + pulse.url + ' " target="_blank">' +
            '<div class="card__img">' +
            '<img src="' + pulse.lead_image_url + '" alt="">' +
            '</div>' +
            '<div class="card__info">' +
            '<h3 class="card__title"> ' + pulse.title + ' </h3>' +
            '<ul class="card__infobar">' +
            '<li>' + pulse.domain + '</li>' +
            '</ul>' +
            '<p class="card__para">' + pulse.excerpt + '</p>' +
            '</div>' +
            '</a>' +
            '</li>';

        return li;
    }

    function renderPulsesInElement(pulses, parentElement) {
        for (var i = 0; i < pulses.length; i++) {
            var pulse = pulses[i];
            var li = createPulseElement(pulse);
            parentElement.append(li);
        }
    }

    function loadMorePulses() {
        
    }

    function fetchAndRenderPulses() {
        var pulseAPI = "https://api.pulsenepal.com/api/v1/pulses";
        $.getJSON(pulseAPI, {}).done(function (response) {
            if (response.status == "OK") {

                var pulses = response.data;
                if (pulses.hot.length > 0) {
                    var coverPulse = pulses.hot[0];
                    renderCoverPulse(coverPulse);
                }

                if (pulses.popular.length > 0) {
                    var popular = pulses.popular;
                    renderPulsesInElement(popular, $(".popular .card-wrapper"));
                }

                if (pulses.all.length > 0) {
                    var all = pulses.all;
                    renderPulsesInElement(all, $(".news .card-wrapper"));
                }
            }
        }); 
    }
    
    fetchAndRenderPulses();
})();