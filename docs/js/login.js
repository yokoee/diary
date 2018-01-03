let input_submit = document.getElementById("input_submit");
let html = document.getElementsByClassName("login")[0];


window.onload = function() {
    // 刷新免重新登录
    if (document.cookie.length > 60) {
        html.className = 'diary';
        create_diary();
    }
    // 保存新日记草稿
    document.querySelector('#input_diary').addEventListener('input', saveDraft);

    document.querySelector('#input_pass').focus();
}

// 回车提交
function enter() {
    if (event.keyCode == 13) {
        submit();
    }
}

// 登录
function submit() {
    let input_pass = document.getElementById("input_pass");
    if (input_pass.value.length < 1) return;
    let xhr_login = new XMLHttpRequest();
    xhr_login.open('POST', 'http://123.207.96.127:3000/token', false);
    xhr_login.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr_login.send('password=' + input_pass.value);
    if (xhr_login.status == 200) {
        input_pass.value = null;
        document.cookie = 'token=' + xhr_login.responseText;
        html.className = 'diary';
        create_diary();
    } else {
        input_pass.placeholder = '你猜不到密码的啦🙄';
        input_pass.value = null;
    }
}