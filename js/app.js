var PN = {};
PN.lastObjectId = '';
PN.apiUrl = 'https://api.pulsenepal.com/api';

PN.renderFeaturePulse = function(pulse) {
    var div = '<div class="feature__wrapper">' +
        '<a href="#" class="pulse-link" data-url="' + pulse.url + '">' +
        '<div class="cover__overlay"></div>' +
        '<div class="feature__img" data-type="background" data-speed="1.4" style="background-image: url(' + PN.imageUrl(pulse.lead_image_url) + '); background-attachment: fixed;">' +
        '</div>' +
        '<div class="cover__info">' +
        '<span class="cover__smtext">Highlight</span>' +
        '<h3 class="cover__title"> ' + pulse.title + ' </h3>' +
        '<ul class="cover__infobar">' +
        '<li>' + pulse.domain + '</li>' +
        '</ul>' +
        '</div>' +
        '</a>' +
        '</div>'

    $(".feature").append(div);
};

PN.renderCoverPulse = function(pulse) {
    var div = '<div class="feature__wrapper">' +
        '<a href="#" class="pulse-link" data-url="' + pulse.url + '">' +
        '<div class="cover__overlay"></div>' +
        '<div class="feature__img" data-type="background" data-speed="1.4" style="background-image: url(../images/banner.jpg); background-attachment: fixed;">' +
        '</div>' +
        '<div class="cover__info">' +
        '<span class="cover__smtext">@pulsenepal</span>' +
        '<h3 class="cover__title"></h3>' +
        '<ul class="cover__infobar">' +
        '<li></li>' +
        '</ul>' +
        '</div>' +
        '</a>' +
        '</div>'

    $(".cover").append(div);
};

PN.createPulseElement = function(pulse) {
    var li = '<li class="card">' +
    '<a href="#" class="pulse-link" data-url="'+ pulse.url +'">' +
    '<div class="card__img">' +
    '<img src="' + PN.imageUrl(pulse.lead_image_url) + '" alt="" title="'+pulse.excerpt+'">' +
    '</div>' +
    '<div class="card__info">' +
    '<h3 class="card__title"> ' + pulse.title + ' </h3>' +
    '<ul class="card__infobar">' +
    '<li>' + pulse.domain + '</li>' +
    '</ul>' +
    '</div>' +
    '</a>' +
    '</li>';

    return li;
};

PN.imageUrl = function(url) {
    var url = url.replace("http://", "");
    url = url.replace("https://", "");
    return "https://images.weserv.nl/?errorredirect=ssl:pulsenepal.com/images/pn-logo.png&url=" + url;
}

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
        PN.renderFeaturePulse(coverPulse);
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

        $('.pulse-link').click(function (e) {
            window.location.href = 'pulse.html?url='+$(e.currentTarget).attr("data-url");
        });
        $('#loading-indicator').addClass('hide');
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

    $('#terms-link').click(function (e) {
        window.location.href = 'terms.html';
    });
    $('#about-link').click(function (e) {
        window.location.href = 'about.html';
    });

}(document));