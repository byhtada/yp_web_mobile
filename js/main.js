console.log( "window loaded" );

$( document ).ready(function() {



    var api_url = "https://yp.herokuapp.com/";

    if (window.location.href.includes("localhost")) {
       api_url = "http://localhost:3000/";
    }

    // var cookie_token = getCookie(cookie_name_token);



    let doc = ""



    // Initial

    ifLogin();
    function ifLogin()     {
        //TODO
        start()
        doc = document.getElementById("container_buyer")
         return



        if (typeof cookie_token !== 'undefined' && cookie_token !== 'undefined') {
            start();
        }
    }



    function start(){

        $('#page_load').hide();
        $('#page_login').hide();
        $('#page_main').show();
    }


    Array.from(doc.getElementsByClassName("orders_header")).forEach(function(element) {
        element.addEventListener('click', clickOrderHeader);
    });
    function clickOrderHeader(){
        let display   = 'none'
        let new_arrow = 'open'

        if (this.querySelector('.opening_arrow').src.includes("_open")) {
            display   = 'block'
            new_arrow = 'close'
        }
        this.parentElement.querySelector(".orders_list").style.display = display
        this.querySelector('.opening_arrow').src = `img/nav/arrow_${new_arrow}.svg`

    }



    Array.from(doc.getElementsByClassName("nav_bottom")).forEach(function(element) {
        element.addEventListener('click', clickNavBottom);
    });
    function clickNavBottom(){
        Array.from(doc.getElementsByClassName("nav_bottom")).forEach(function(element) {
            element.classList.remove("active")
            element.querySelector("img").src = `img/nav/no_active/${element.getAttribute("data-page")}.svg`
        });
        this.classList.add("active")
        this.querySelector("img").src = `img/nav/active/${this.getAttribute("data-page")}.svg`



        openPage(this.getAttribute("data-page"))
    }

    function openPage(page){
        Array.from(doc.getElementsByClassName("page")).forEach(function(element) {
            element.classList.remove("visible")
        });
        doc.querySelector('[data-page="'+page+'"]').classList.add("visible")

        doc.querySelector('.top_header').innerText = page.replace("_", " ")

        // last_page = $(this).attr("data-page");
        // showMainPage(last_page);
        // window.history.pushState(last_page, "another page", "#" + last_page);
    }

    // Для навигации назад
    window.onpopstate = function(event) {
        console.log( event.state);

        if (typeof event.state !== 'undefined'){
            var page = JSON.stringify(event.state).replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            var v = new String("course");

            var isEquel = JSON.stringify(page) === JSON.stringify(v);
            var isNull  = JSON.stringify(page) === JSON.stringify("null");

            if (isNull) {
                page = "page_main";
            }


            switch (page){
                case "page_value_kaoshikii":
                case "page_value_tandava":
                case "page_main":
                    $('#logo').click();
                    break;


                case "samgiits":
                    $('#page_value_samgiits_all')       .show();
                    $('#page_value_samgiits_list')       .show();
                    $('#page_value_samgiit_detail').hide();
                    break;
                case "mantras":
                    $('#page_value_mantras_list')       .show();
                    $('#page_value_mantra_detail').hide();
                    break;



                case "asanas":
                case "mudras":
                case "pranayamas":
                    $('#page_value_practises')       .show();
                    $('#page_value_practises_detail').hide();
                    break;

                case "caryacarya":
                    $('.page_header').empty().append(main_data.words.header_charya_charya);
                    setCCpart(1);
                    hide_all();
                    $('#page_value_charya_charya').show();
                    //$('.btn_back').show();
                    window.history.pushState("caryacarya", "another page", "#caryacarya");


                    break;

                //case "practise":
                //    $('#page_value_practises')       .hide();
                //    $('#page_value_practises_detail').hide();
                //    $('#page_value_charya_charya').show();
                //    break;

                case "flow_rawa_fm":
                case "instrument":
                    $('#logo').click();
                    break;
                default:
                    hide_all();
                    showMainPage(page);
                    break;
            }

            console.log(page);
            console.log("scroll_height ", scroll_height);



            setTimeout(() => window.scrollTo(0, scroll_height),  300);
        }


    };



    function sendRequest(type, url, body = null) {
        const headers = {
            'Authorization': 'Token token=' + cookie_token,
            'Content-type': 'application/json'
        }

        return fetch(`${api_url}${url}`, {
            method: type,
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            return response.json()
        })
    }







    function setCookie(name, value, days = 1600) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function deleteCookie( name ) {
        document.cookie = name + '=undefined; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }



    $.ajaxSetup({
        error: function (data, textStatus, jqXHR) {
            console.log("ajaxSetup");
            console.log(data);

            if (data.status == 401) {
                console.log("Error 401");
                $('#page_login').show();
                $('.wrapper_top_bar').hide();
                $("#page_user_main") .hide();
                $('#page_admin_main').hide();
                //  console.log(data.responseText.includes("Incorrect credentials"));

                if (data.responseText.includes("Incorrect credentials")) {
                    showAlert(alert_error_login);
                }
                if (data.responseText.includes("Bad Token")) {
                    cookie_token = getCookie(cookie_name_token);
                }
            }

            if (data.status == 500) {
                console.log("Error 500 ");
            }
        }
    });


    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

});
