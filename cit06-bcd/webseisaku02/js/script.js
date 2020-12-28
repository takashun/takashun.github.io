$(document).ready(function(){
    let limit = 0;
    let delta = 0;
    while(true) {
        if(limit === 5) {
            break;
        }
        limit++;

        moment.locale('ja');
        const menu_day = moment().subtract(delta, 'week').day(1);
        const img_url = 'https://takashun.github.io/cit06-bcd/webseisaku02/img/menu/' + menu_day.format('YYMMDD') + '_td.png?_=1'
        const formatted_menu_day = menu_day.format('NNNNyoMMMDo');

        let flag = 0;
        $.ajax({
            url: img_url,
            type: 'GET',
            cache: false,
            async: false,
        })
        .done((data, textStatus, jqXHR) => {
            flag = 1;

            $('#menu-day').text(formatted_menu_day);
            $('#lightbox-url').attr('href', img_url);
            $('#img-tag').attr('src', img_url);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            flag = 0;
        })

        if(flag === 1) {
            break;
        }
        else if(flag === 0) {
            delta++;
        }
    }
});