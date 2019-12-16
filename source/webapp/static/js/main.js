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
            $('#detail_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                quoteView(item.id);
            });
             $('#edit_' + item.id).on('click', function(event) {
                event.preventDefault();
                editForm(item);
            });
             $('#delete_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                quoteDelete(item.id);
            });
        });

    }).fail(function(response, status, message) {
        console.log('Could not get quotes.');
        console.log(response.responseText);
    });
}

function formQuote(){
    quoteForm.on('submit', function(event) {
        event.preventDefault();
        console.log('yes')
        addQuote(textInput.val(), authorInput.val(), emailInput.val());
    });

    createLink.on('click', function(event) {
        event.preventDefault();
        logInForm.addClass('d-none');
        quoteForm.removeClass('d-none');
        formTitle.text('Создать');
        formSubmit.text('Сохранить');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            quoteForm.submit()
        });
    });
}

function addQuote(text, author, email) {
    const credentials = {text, author, email};
    let token = getToken();
    if(token){
        request = makeRequest('quotes', 'post', true, credentials);
    }
    else{request = makeRequest('quotes', 'post', false, credentials);}
    request.done(function (data) {
        formModal.modal('hide');
        content.empty();
        getQuotes();
        }
    ).fail(function (response, status, message) {
        console.log('Цитата не создана!');
        console.log(response.responseText);
    });

}

function quoteView(id){
    let request =  makeRequest('quotes/' + id, 'get', true);
    request.done(function(item)
    {
        content.empty();
        content.append($(`<div class="card" id="quote_${item.id}">
                <p>${item.text}</p>
                <p>Автор: ${item.author}</p>
                <p>Статус: ${item.status}</p>
                <p>Рейтинг: ${item.raiting}</p>
                <p>Создана: ${item.create}</p>
                <a href="#" class="btn btn-success" id ="home_${item.id}">Назад</a>
               </div>`));
        $('#home_' + item.id).on('click', function(event) {
        console.log('click');
        event.preventDefault();
        getQuotes();
    });
    }

    ).fail(function(response, status, message){
        console.log('Цитата не открывается!');
        console.log(response.responseText);
    });
}



function editForm(item){
    textInputEdit.val(item.text);
    ratingInput.val(item.raiting);
    statusSelect.val(item.status);
    let updateLink = $('#edit_' + item.id);

    quoteFormEdit.on('submit', function(event) {
        event.preventDefault();
        quoteEdit(item.id, textInputEdit.val(), ratingInput.val(), statusSelect.val());
    });

    console.log('yes');
    event.preventDefault();
    logInForm.addClass('d-none');
    quoteForm.addClass('d-none');
    quoteFormEdit.removeClass('d-none');
    formTitle.text('Редактировать');
    formSubmit.text('Сохранить');
    formSubmit.off('click');
    formSubmit.on('click', function(event) {
        quoteFormEdit.submit()
    });


}
function quoteEdit(id, text, raiting, status){
    const credentials = {text, raiting, status};
    console.log('this');
    console.log(credentials);
    let request = makeRequest('quotes/' + id, 'patch', true, credentials);
    request.done(function (data) {
        console.log('ok');
        formModal.modal('hide');
        getQuotes();
        }
    ).fail(function (response, status, message) {
        console.log('Цитата не отредактирована!');
        console.log(response.responseText);
    });
}


function quoteDelete(id){
    let request = makeRequest('quotes/' + id, 'delete', true);
    request.done(function(id)
        {console.log('Цитата удалена!')}

    ).fail(function (response, status, message){
        console.log('Цитата не удалена!');
        console.log(response.responseText);
    });
    getQuotes();
}



$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    checkAuth();
    getQuotes();
    formQuote();
});