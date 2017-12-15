var PN = {};
PN.lastObjectId = '';
// PN.apiUrl = 'https://api.pulsenepal.com/api';
PN.apiUrl = 'http://localhost:8080/api';

PN.renderCoverPulse = function(pulse) {
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
};

PN.createPulseElement = function(pulse) {
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
};

PN.renderPulsesInElement = function(pulses, parentElement) {
    for (var i = 0; i < pulses.length; i++) {
        var pulse = pulses[i];
        var li = PN.createPulseElement(pulse);
        parentElement.append(li);
    }
};

PN.fetchPulses = function(lastObjectID, callback) {
    var pulseAPI = PN.apiUrl + "/v1/pulses";
    if (lastObjectID != "") {
        pulseAPI = PN.apiUrl + "/v1/pulses?loid="+lastObjectID;
    }
    $.getJSON(pulseAPI, {}).done(function (response) {
        if (response.status == "OK") {
            callback(response.data);
        }
    });
};

PN.renderMorePulses = function(pulses) {
    if (pulses.length > 0) {
        PN.renderPulsesInElement(pulses, $(".news .card-wrapper"));
        var last = pulses.slice(-1)[0];
        if (last != undefined) {
            PN.lastObjectId = last.id;
        }
        $('#read-more-link').removeClass('disabled');
        $('#read-more-link').text('Load More');
    } else {
        PN.lastObjectId = ""
        $('#read-more-link').addClass('hide');
    }
}

PN.renderMainContent = function(pulses) {
    if (pulses.hot.length > 0) {
        var coverPulse = pulses.hot[0];
        PN.renderCoverPulse(coverPulse);
    }
    if (pulses.popular.length > 0) {
        var popular = pulses.popular;
        PN.renderPulsesInElement(popular, $(".popular .card-wrapper"));
    }
    if (pulses.all.length > 0) {
        var all = pulses.all;
        PN.renderPulsesInElement(all, $(".news .card-wrapper"));

        var last = all.slice(-1)[0];
        if (last != undefined) {
            PN.lastObjectId = last.id;
        }
    }
    $('#read-more-link').removeClass('disabled');
    $('#read-more-link').text('Load More');
}

PN.fetchAndRenderPulses = function() {
    PN.fetchPulses(PN.lastObjectId, function(pulses) {
        if (pulses == null || pulses.length == 0) {
            $('#read-more-link').addClass('hide');
            $('#end-label').removeClass('hide');
        } else if (Array.isArray(pulses)) {
            PN.renderMorePulses(pulses);
        } else {
            PN.renderMainContent(pulses);
        }
    });
};

$(document).ready(function(d) {
    PN.fetchAndRenderPulses();

    //click event 
    $('#read-more-link').click(function (e) {
        e.preventDefault();
        $('#read-more-link').addClass('disabled');
        $('#read-more-link').text('Loading...');
        PN.fetchAndRenderPulses();
    });
}(document));