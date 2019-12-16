const baseUrl = 'http://localhost:8000/api/v1/';

function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'Authorization': 'Token ' + getToken()};
    }
    return $.ajax(settings);
}
function getToken() {
    return localStorage.getItem('authToken');
}

function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function removeToken() {
    localStorage.removeItem('authToken');
}



function logIn(username, password) {
    let editQuote = $("#edit_");
    const credentials = {username, password};

    let request = makeRequest('login', 'post', false, credentials);

    request.done(function(data, status, response) {
        console.log('Received token');
        saveToken(data.token);
        formModal.modal('hide');
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
        editQuote.removeClass('d-none');
        getQuotes();
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response.responseText);
    });
}

function logOut() {
    let request = makeRequest('logout', 'post', true);

    request.done(function(data, status, response) {
        console.log('Cleaned token');
        removeToken();
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
        getQuotes();
    }).fail(function(response, status, message) {
        console.log('Could not clean token');
        console.log(response.responseText);
    });
}

let logInForm, quoteForm, homeLink, enterLink, exitLink, formSubmit, formTitle, content, formModal,
    usernameInput, passwordInput, authorInput, textInput, emailInput, createLink, quoteFormEdit, textInputEdit, ratingInput, statusSelect;

function setUpGlobalVars() {
    logInForm = $('#log_in_form');
    quoteForm = $('#quote_form');
    homeLink = $('#home_link');
    enterLink = $('#enter_link');
    exitLink = $('#exit_link');
    formSubmit = $('#form_submit');
    formTitle = $('#form_title');
    content = $('#content');
    formModal = $('#form_modal');
    usernameInput = $('#username_input');
    passwordInput = $('#password_input');
    authorInput = $('#author_input');
    textInput = $('#text_input');
    textInputEdit = $('#text_input_edit');
    emailInput = $('#email_input');
    createLink = $('#create_link');
    quoteFormEdit = $('#quote_form_edit');
    ratingInput = $('#rating_input');
    statusSelect = $('#status_select');
}

function setUpAuth() {
    logInForm.on('submit', function(event) {
        event.preventDefault();
        logIn(usernameInput.val(), passwordInput.val());
    });

    enterLink.on('click', function(event) {
        event.preventDefault();
        logInForm.removeClass('d-none');
        quoteForm.addClass('d-none');
        formTitle.text('Войти');
        formSubmit.text('Войти');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            logInForm.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });
}

function checkAuth() {
    let token = getToken();
    if(token) {
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
    } else {
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
    }
}

function getQuotes() {
    let request = makeRequest('quotes', 'get', false);
    let token = getToken();
    if (token) {
        request = makeRequest('quotes', 'get', true);
    }
    request.done(function(data, status, response) {
        console.log(data);
        content.empty();

        data.forEach(function(item, index, array) {
            content.append($(`<div class="card m-5" id="quote_${item.id}">
                <p class="text m-3 "><b>Цитата: </b>${item.text}</p>
                <p>Установить рейтинг для цитаты:</p>
                <p><a href="#" class="btn btn-success ml-3" id="rate_up_${item.id}">+</a>
                    <a href="#" class="btn btn-success ml-5" id="rate_down_${item.id}">-</a></p>
                <p id="rating_${item.id}">Рейтинг цитаты: ${item.raiting}</p>
                <p><a href="#" class="btn btn-success ml-3" id="detail_${item.id}">Подробнее</a>
                
                    <a href="#" class="d-none btn btn-info ml-3" id="edit_${item.id}" data-toggle="modal" data-target="#form_modal">Редактировать</a>
                    <a href="#" class="delete d-none btn btn-danger ml-3 d-none" id="delete_${item.id}">Удалить</a></p>
                
                    
            </div>`));

    }).fail(function(response, status, message) {
        console.log('Could not get quotes.');
        console.log(response.responseText);
    });
}


$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    checkAuth();
    getQuotes();
});