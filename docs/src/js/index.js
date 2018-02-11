if (!window.sessionStorage.getItem('token')) location.replace('login.html');

//const address = 'localhost:3000';
const address = '123.207.96.127:3000';

$(document).ready(() => {

    // header buttons
    let btnLogout = $('#btn-logout');
    let btnHide = $('#btn-hide');
    let btnNew = $('#btn-new');

    btnLogout.click(function() {
        window.sessionStorage.removeItem('token');
        location.replace('login.html');
    })
    btnHide.click(function() {
        $('.diary>.text>p').addBack().toggleClass('hide');
        console.log($(this))
        if ($(this).text() == 'visibility') {
            $(this).text('visibility_off');
        } else {
            $(this).text('visibility');
        }
    })
    btnNew.click(function() {
        $('main').addClass('blur');
        $('.edit-panel').slideDown(500).find('textarea').val('');
        $('.edit-panel>.textfield').attr('name', 'new-diary');
        $('.textfield>textarea').focus().trigger('input');
    })

    // 展开或折叠日记块
    $('main').on('click', '.monthly-block .arrow', function() {
        $(this).parent().next().slideToggle();
        if ($(this).text() == 'arrow_drop_up') {
            $(this).text('arrow_drop_down')
        } else {
            $(this).text('arrow_drop_up');
        }
    })

    // diary buttons
    $('main').on('click', '.btn-edit', function() {
        let text = $(this).parentsUntil('.diary').parent().find('.text').children().text();
        $('main').addClass('blur');
        $('.edit-panel').slideDown(500).find('textarea').val(text);
        $('.edit-panel>.textfield').attr('name', 'edit-diary').data('id', $(this).parents('.diary').attr('id'));
        $('.textfield>textarea').focus().trigger('input');
    })
    $('main').on('click', '.btn-delete', function() {
        let confirm = window.confirm('确定要删除吗？');
        if (confirm) {
            $.ajax({
                url: 'http://' + address + '/diary/delete',
                type: 'post',
                data: {
                    token: window.sessionStorage.getItem('token'),
                    id: $(this).parents('.diary').attr('id')
                },
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                dataType: 'json',
                statusCode: {
                    401: () => {
                        window.sessionStorage.removeItem('token');
                        location.replace('login.html');
                    },
                    200: () => {
                        console.log('删除成功');
                        location.reload();
                    }
                }

            })
        }
    })

    // edit panel buttons
    $('#btn-edit-cancel').on('click', function() {
        $('.edit-panel').slideUp(500);
        $('main').removeClass('blur');
    })
    $('#btn-edit-done').on('click', function() {
        $('.edit-panel>.textfield').submit();
    })

    // new diary or edit diary submit
    $('.edit-panel').on('submit', '.textfield[name="new-diary"]', function(event) {
        event.preventDefault();
        $.ajax({
            url: 'http://' + address + '/diary/add',
            type: 'post',
            data: {
                token: window.sessionStorage.getItem('token'),
                text: $('.textfield>textarea').val()
            },
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            dataType: 'json',
            statusCode: {
                401: () => {
                    window.sessionStorage.removeItem('token');
                    location.replace('login.html');
                },
                200: () => {
                    console.log('提交成功');
                    location.reload();
                }
            }
        })
    })
    $('.edit-panel').on('submit', '.textfield[name="edit-diary"]', function(event) {
        event.preventDefault();
        $.ajax({
            url: 'http://' + address + '/diary/update',
            type: 'post',
            data: {
                token: window.sessionStorage.getItem('token'),
                text: $('.textfield>textarea').val(),
                id: $('.textfield').data('id')
            },
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            dataType: 'json',
            statusCode: {
                401: () => {
                    window.sessionStorage.removeItem('token');
                    location.replace('login.html');
                },
                200: () => {
                    console.log('修改成功');
                    location.reload();
                }
            }
        })
    })

    // edit panel 字数统计
    $('.textfield>textarea').on('input', function() {
        $('.edit-info>span').text($(this).val().length)
    })

    // index panel
    $('main').on('click', '.month span', function() {
        $('main').addClass('blur');
        $('.month>span').each(function() {
            createIndexItem($(this).text());
        })
        $('.index-panel').slideDown(500);
    })
    $('.index-panel').on('click', '.index-item', function() {
        let text = $(this).children('span').text();
        $('.index-panel').slideUp(500, function() {
            $('html,body').animate({ scrollTop: $('#' + text).offset().top - 60 }, 500);
        });
        $('main').removeClass('blur');
    })

    // loading
    $('.loading').on('click', function() {
        let nextPage = parseInt($('.wrapper').data('page')) + 1;
        $.ajax({
            url: 'http://' + address + '/diaries/page/' + nextPage,
            type: 'post',
            data: { 'token': window.sessionStorage.getItem('token') },
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            dataType: 'json',
            beforeSend: function() {
                $('.loading>p').addClass('material-icons').text('cached');
            },
            complete: function() {
                $('.loading>p').removeClass('material-icons');
            },
            statusCode: {
                401: () => {
                    window.sessionStorage.removeItem('token');
                    location.replace('login.html');
                },
                200: (data) => {
                    if (data.length) {
                        handleDiaries(data);
                        $('.wrapper').data('page', nextPage);
                        $('.loading>p').text('加载更多 ...');
                    } else {
                        $('.loading>p').text('没有更多啦😆');
                    }
                }
            }
        })
    })

    $.ajax({
        url: 'http://' + address + '/diaries/page/1',
        type: 'post',
        data: { 'token': window.sessionStorage.getItem('token') },
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        dataType: 'json',
        success: (data) => {
            handleDiaries(data);
            // 当前加载的页数
            $('.wrapper').data('page', 1);
        },
        statusCode: {
            401: () => {
                window.sessionStorage.removeItem('token');
                location.replace('login.html');
            }
        }
    })

})

function createDiary(diary) {
    let diaryCopy = diary;
    if (parseInt(diaryCopy.date.hour) < 10) {
        diaryCopy.date.hour = '0' + diaryCopy.date.hour;
    }
    if (parseInt(diaryCopy.date.min) < 10) {
        diaryCopy.date.min = '0' + diaryCopy.date.min;
    }
    if (parseInt(diaryCopy.date.day) < 10) {
        diaryCopy.date.day = '0' + diaryCopy.date.day;
    }

    let time = diaryCopy.date.hour + ':' + diaryCopy.date.min;

    let textNode = $('<div class="text"><p>' + diaryCopy.text + '</p></div>');
    let footerNode = $('<div class="footer"><div class="footer-date"><span class="time">' + time + '</span><span class="date">' + diaryCopy.date.day + '日</span></div><div class="footer-btns"><i class="material-icons btn-edit">edit</i><i class="material-icons btn-delete">delete_forever</i></div></div>');
    let diaryNode = $('<div class="diary" id="' + diaryCopy.id + '"></div>');
    diaryNode.append(textNode).append(footerNode);
    return diaryNode;
}

function createMonthlyBlock(date) {
    let monthNode = $('<div class="month"><span>' + date + '</span><i class="arrow material-icons">arrow_drop_up</i></div>');
    let diarylistNode = $('<div class="diary-list"></div>');
    let monthlyblockNode = $('<section class="monthly-block" id="' + date + '"></section>');
    monthlyblockNode.append(monthNode).append(diarylistNode);
    $('.wrapper').append(monthlyblockNode);
}

function handleDiaries(diaries) {
    diaries.forEach((diary) => {
        let diaryCopy = diary;
        if (parseInt(diaryCopy.date.mon) < 10) {
            diaryCopy.date.mon = '0' + diaryCopy.date.mon;
        }
        let monthString = diaryCopy.date.year + '-' + diaryCopy.date.mon;
        if ($('#' + monthString).length == 0) {
            createMonthlyBlock(monthString);
        }
        let diaryNode = createDiary(diary);
        $('#' + monthString + '>.diary-list').append(diaryNode);
    })
}

function createIndexItem(text) {
    let iconNode = $('<i class="material-icons">label_outline</i>');
    let spanNode = $('<span>' + text + '</span>');
    let indexitemNode = $('<div class="index-item">');
    indexitemNode.append(iconNode).append(spanNode);
    $('.index-panel').append(indexitemNode);
}