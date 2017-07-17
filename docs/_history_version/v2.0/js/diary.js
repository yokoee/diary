// 显示/隐藏增加日记输入框
function btn_add_click() {
    let add_diary = document.getElementById("add-diary");

    if (add_diary.style.display == 'none') {
        add_diary.style.display = 'block';
        window.scrollTo(0, 0);
    } else {
        add_diary.style.display = 'none';
    }
}

// 退出登录
function logout() {
    document.cookie = 'token=';
    document.getElementsByClassName("diary")[0].className = 'login';
}

// 日记内容打马赛克
function hide_diary(that) {
    if (that.firstChild.className == 'fa fa-eye') {
        let text = document.getElementsByClassName('text');
        for (let i = text.length; i > 0; i--) {
            text[i - 1].className = 'text-hided';
        }
        that.firstChild.className = 'fa fa-eye-slash';
    } else {
        let text_hided = document.getElementsByClassName('text-hided');
        for (let i = text_hided.length; i > 0; i--) {
            text_hided[i - 1].className = 'text';
        }
        that.firstChild.className = 'fa fa-eye';
    }


}
// 添加日记
function add_diary() {
    let xhr_add = new XMLHttpRequest();
    let text = document.getElementById('input_diary').value;
    if (text.length < 0) return;
    xhr_add = new XMLHttpRequest();
    xhr_add.open('POST', 'http://yokoee.cn:3000/journal/add', false);
    xhr_add.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr_add.send(document.cookie + '&text=' + text);
    window.location.reload();
}
// 删除日记
function del_diary(that) {
    let id = that.parentNode.parentNode.id;
    if (confirm('确定要删除吗？')) {
        xhr_del = new XMLHttpRequest();
        xhr_del.open('POST', 'http://yokoee.cn:3000/journal/delete', false);
        xhr_del.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr_del.send(document.cookie + '&id=' + id);
        if (xhr_del.status == 200) {
            window.location.reload();
        } else {
            alert('删除失败！');
        }
    }
}


function get_diary(page) {
    let xhr_diary = new XMLHttpRequest();
    xhr_diary.open('POST', 'http://yokoee.cn:3000/journals/page/' + page, false);
    xhr_diary.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr_diary.send(document.cookie);
    if (xhr_diary.status == 401) {
        document.cookie = 'token=';
        document.getElementsByClassName("diary")[0].className = 'login';
    } else if (xhr_diary.status == 200) {
        let diaries = JSON.parse(xhr_diary.responseText);
        return diaries;
    }
}

function create_diary_html(diaries) {
    let content = document.getElementById('content');
    let next_page = document.getElementById('next-page');
    diaries.forEach(function(diary) {
        let diary_list = document.createElement('div');
        diary_list.setAttribute('class', 'diary-list');
        diary_list.setAttribute('id', diary.id);

        let text = document.createElement('p');
        text.setAttribute('class', 'text');
        text.innerText = diary.text
        let date_time = document.createElement('p');
        date_time.setAttribute('class', 'date-time');

        let span1 = document.createElement('span');
        span1.innerText = diary.date.hour + ':' + diary.date.min;
        let span2 = document.createElement('span');
        span2.setAttribute('class', 'date');
        if (diary.date.mon < 10) diary.date.mon = '0' + diary.date.mon;
        if (diary.date.day < 10) diary.date.day = '0' + diary.date.day;
        span2.innerText = ' ,' + diary.date.year + '/' + diary.date.mon + '/' + diary.date.day;
        let span3 = document.createElement('span');
        span3.setAttribute('class', 'fa fa-close');
        span3.setAttribute('onclick', 'del_diary(this)');

        date_time.appendChild(span1);
        date_time.appendChild(span2);
        date_time.appendChild(span3);

        diary_list.appendChild(text);
        diary_list.appendChild(date_time);
        content.insertBefore(diary_list, next_page);

    }, this);
}

var PAGE = 1;

function create_diary() {
    let diaries = get_diary(PAGE);
    create_diary_html(diaries);
};

function next_page() {
    PAGE += 1;
    try {
        let diaries = get_diary(PAGE);
    } catch (e) {
        document.getElementById('next-page').innerText = '没有更多啦😆';
        return;
    }
    create_diary_html(diaries);
}