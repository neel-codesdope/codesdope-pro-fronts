export const GtagReportConversion = url => {
    var callback = function () {
        console.log('Conversion tracking successful');
        if (typeof url != 'undefined') {
            window.location = url;
        }
    };
    window.gtag('event', 'conversion', {
        send_to: 'AW-10817025881/zzbPCLeelYcDENnu-qUo',
        transaction_id: '',
        event_callback: callback
    });
    return false;
};
