$(document).ready(function() {
    register_document_level_events();
    register_search_manga_events();
    register_navigation_events();
    register_quick_scrolling_events();
    trigger_bookmark_events();
    trigger_watchlist_events();
    register_apply_ordering_rule_events();
    register_apply_filters_events();
    register_enable_inputs_events();
    trigger_get_last_read_events();
    trigger_get_bookmarked_events();
    trigger_image_stub_events();
    register_rate_manga_events();

    register_select_reading_mode_events();

    trigger_header_scrolling_events(); // This isn't doing its job right now BTW. TODO: Fix it. You know what I'm talking about.

    register_add_post_events();
    register_commenting_events();
    register_reply_and_like_events();
    register_reply_initializer_events();
});

function register_document_level_events() {
    document.onclick = function(event) {
        hide_search_results();
        hide_tag_search_results();
        hide_author_search_results();
    };
}

function register_search_manga_events() {
    $('[data-action="search_manga"]').on('keyup', function(event){
        var input = event.currentTarget;
        search_manga(input);
    });

    $('[data-action="search_manga"]').on('click', function(event){
        show_search_results();
    });
}

function register_navigation_events() {
    $('.back-button').on('click', function() {
        history.back();
    });
}

function register_quick_scrolling_events() {
    $(window).scroll( function(event) {
        if(window.scrollY > 50) {
            document.getElementById('back-to-top-div').classList.remove('d-none');
        } else {
            document.getElementById('back-to-top-div').classList.add('d-none');
        }
    });
}

function trigger_bookmark_events() {
    var bookmark_toggler = $('[data-toggle="bookmark_state"]');

    if (bookmark_toggler)
        toggle_bookmark_state_button(bookmark_toggler);
}

function trigger_watchlist_events() {
    var watchlist_toggler = $('[data-toggle="watchlist_state"]');

    if(watchlist_toggler)
        toggle_watchlist_state_button(watchlist_toggler); 
}

function register_enable_inputs_events() {
    $('[data-toggle="enable_inputs"]').on('click', function(event) {
        var button = event.currentTarget;
        var targets = button.getAttribute('data-targets');
        targets = targets.split(' ');

        enable_edit_user_details(button, targets);
    });
}

function register_apply_filters_events() {
    $('[data-toggle="apply_filters"]').on('click', function(event) {
        var button = event.currentTarget;

        var filterable_section = button.getAttribute('data-filterable-section');
        var items_per_page = button.getAttribute('data-items-per-page');

        apply_active_filters(filterable_section, items_per_page);
    });
}

function register_apply_ordering_rule_events() {
    $('[data-toggle="apply_ordering_rule"]').on('change', function(event) {
       var select = event.currentTarget;

       var filterable_section = select.getAttribute('data-filterable-section');
       var items_per_page = select.getAttribute('data-items-per-page');

       apply_ordering_rule(filterable_section, items_per_page);
    });
}

function register_rate_manga_events() {
    $('[data-action="rate_manga"]').on('click', function(event) {
        var button = event.currentTarget;

        var manga_id = button.getAttribute('data-manga');
        var rating = button.getAttribute('data-value');

        submit_rating(button, manga_id, rating);
    });
}

function trigger_get_last_read_events() {
    $.each($('[data-action="get_last_read"]'), function(index, element) {
        var manga_id = element.getAttribute('data-manga');

        get_last_read_chapter(element, manga_id);
    });
}

function trigger_get_bookmarked_events() {
    $.each($('[data-action="get_bookmarked"]'), function(index, element) {
        var manga_id = element.getAttribute('data-manga');

        get_bookmarked_chapter(element, manga_id);
    });
}

function trigger_image_stub_events() {        
    $('[data-toggle="image_stub"]').each(function(index, element) {
        var el = document.getElementById(element.id);
        fetch_image(el);
    });
}

function register_select_reading_mode_events() {
    $('[data-action="select_reading_mode"]').on('change', function(event) {
        switch_reading_mode(event.currentTarget);
    });

    establish_reading_mode();
}

var scrollListener = function(event) {
    load_visible_page_webtoon_format();
};

function register_global_event_listener_for_reader() {
    document.addEventListener('scroll', scrollListener, true);
}

function unregister_global_event_listener_for_reader() {
    document.removeEventListener('scroll', scrollListener, true);
}

function trigger_header_scrolling_events() {
    var scroll_pos = 0;
    var scroll_time;

    document.addEventListener('scroll', function(event) {
        clearTimeout(scroll_time);
        var current_scroll = $(window).scrollTop();
        var outer_height = $('#top_header').outerHeight();

        if (current_scroll <= scroll_pos) {
            $('#top_header').removeClass('d-none');    
        }
        else {
            $('#top_header').addClass('d-none');  
        }
    
        scroll_time = setTimeout(function() {
            scroll_pos = $(window).scrollTop();
        }, 100);
    },true);
}

function register_add_post_events() {
    $('[data-action="add_post"]').on('click', function(event) {
        var source_element = event.currentTarget;
        add_post(source_element);
    });
}

function register_commenting_events() {
    document.addEventListener('scroll', function(event) {
        load_comments_on_demand();
    },true);

    $('[data-action="fetch_more_comments"]').on('click', function(event) {
        fetch_comments();
    });
}

function register_reply_initializer_events() {
    $('[data-action="submit_reply"]').on('click', function(event) {
        submit_reply(event.currentTarget);
    });
}

function register_reply_and_like_events() {
    $('[data-action="like_post"]').on('click', function(event) {
        like_post(event.currentTarget);
    });

    $('[data-action="add_reply"]').on('click', function(event) {
        reply_to_post(event.currentTarget);
    });
}

$('#add_post').summernote({
    placeholder: 'Add a post',
    tabsize: 2,
    height: 200,
    toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen']],
    ]
});

$('#add_reply').summernote({
    placeholder: 'Add a comment',
    tabsize: 2,
    height: 200,
    toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen']],
    ]
});