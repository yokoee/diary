$(document).ready(() => {
    //const address = 'localhost:8080';
    const address = '123.207.96.127:3000';

    let login = $('form[name="login"]');
    let pwInput = $('input[type="password"]');
    let smInput = $('input[type="submit"]');

    if (window.sessionStorage.getItem('token')) {
        location.replace('index.html');
    }

    pwInput.focus();

    smInput.prop('disabled', 'disabled').css('color', 'gray');
    pwInput.on('input', function() {
        if ($(this).val().length == 0) {
            smInput.attr('disabled', 'disabled').css('color', 'gray');
        } else {
            smInput.removeAttr('disabled').css('color', '');
        }
    })

    login.submit((event) => {
        event.preventDefault();
        $.ajax({
            url: 'http://' + address + '/token',
            type: 'post',
            data: { password: pwInput.val() },
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            success: function(data) {
                window.sessionStorage.setItem('token', data);
                location.replace('index.html');
            },
            statusCode: {
                401: function() {
                    pwInput.val('').trigger('input');
                    pwInput.attr('placeholder', '你猜不到密码的啦🙄');
                },
            }

        })
    })
})