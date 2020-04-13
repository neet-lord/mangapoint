function fetch_image(resource_stub) {
    var src = resource_stub.getAttribute('data-src');
    var className = resource_stub.getAttribute('data-resource-class');
    var id = resource_stub.getAttribute('data-resource-id');
    var alternate = resource_stub.getAttribute('data-resource-alternate');
    
    var image = document.createElement('img');
    image.src = src;
    image.className = className;
    image.id = id;
    image.setAttribute('alternate', alternate);

    clear_div(resource_stub);

    resource_stub.appendChild(image);
}

function get_next_manga_page(section_id, pager_id, page_counter_id, order_by, items_per_page) {
    var num_pages_id = section_id + '_num_pages';
    var num_pages = document.getElementById(num_pages_id);
    num_pages = num_pages.innerHTML.trim();
    var current_page_number = document.getElementById(pager_id).value.trim();

    if (num_pages == current_page_number) {
        return;
    }

    var request_parameters = {
        order_by: order_by,
        items_per_page: items_per_page,
        section_id: section_id,
    };

    current_page_number++;

    var parameters = {
        page_number: current_page_number,
        section_id: section_id,
        pager_id: pager_id,
        page_counter_id: page_counter_id,
        force_overwrite: true,
        apply_filters: true,
        apply_order: true,
    };

    get_manga_page(request_parameters, parameters);
}

function get_previous_manga_page(section_id, pager_id, page_counter_id, order_by, items_per_page) {
    var current_page_number = document.getElementById(pager_id).value.trim();

    if (current_page_number == '1') {
        return;
    }

    var request_parameters = {
        order_by: order_by,
        items_per_page: items_per_page,
        section_id: section_id,
    };

    current_page_number--;

    var parameters = {
        page_number: current_page_number,
        section_id: section_id,
        pager_id: pager_id,
        page_counter_id: page_counter_id,
        force_overwrite: true,
        apply_filters: true,
        apply_order: true,
    };

    get_manga_page(request_parameters, parameters);
}

function get_selected_manga_page(section_id, pager_id, page_counter_id, order_by, items_per_page) {
    var current_page_number = document.getElementById(pager_id).value.trim();

    var request_parameters = {
        order_by: order_by,
        items_per_page: items_per_page,
        section_id: section_id
    };

    var parameters = {
        page_number: current_page_number,
        section_id: section_id,
        pager_id: pager_id,
        page_counter_id: page_counter_id,
        force_overwrite: true,
        apply_filters: true,
        apply_order: true,
    };

    get_manga_page(request_parameters, parameters);
}

function get_manga_page(request_parameters, parameters) {

    if (parameters.apply_filters) {
        var filters = gather_active_filters();

        request_parameters.tags = JSON.stringify(filters.tags);
        request_parameters.authors = JSON.stringify(filters.authors);
    }

    if (parameters.apply_order) {
        request_parameters.order_by = get_ordering_rule();
    }

    var page_id = parameters.section_id + "_page_" + parameters.page_number;
    var carousel_id = parameters.section_id + '_carousel';
    var pager = document.getElementById(parameters.pager_id);
    var page = document.getElementById(page_id);
    var last_page = document.getElementById(parameters.page_counter_id);
    var section = document.getElementById(parameters.section_id);
    var page_number = parameters.page_number;

    if (!parameters.force_overwrite) {
        if (page) {
            var offset = $('#' + carousel_id).offset();
            $('html, body').animate({
                scrollTop: offset.top - 60,
                scrollLeft: offset.left
            }, 1000);

            var index = Array.prototype.indexOf.call(section.children, page);
            $('#' + carousel_id).carousel(index);

            pager.selectedIndex = page_number - 1;

            return;
        }
    }

    lock_module_loading();

    $.ajax({
        type: "GET",
        url: "/manga_page_json/" + page_number,
        data: request_parameters,
        success: function(response) {
            unlock_module_loading();

            var num_pages = response.num_pages;
            var mangas = response.mangas;

            if (mangas.length > 0) {
                clear_div(section);
            } else {
                alert("No manga found by that criteria.");
                return;
            }

            var i = 0, l = mangas.length;

            page = document.createElement('div');
            page.className = 'carousel-item' + (parameters.force_overwrite ? ' active' : '');

            var page_inner = document.createElement('div');
            page_inner.className = 'page d-flex row w-100 mx-0';
            page.id = page_id;

            for(; i < l; i++) {

                var manga = mangas[i];
                var manga_div = create_manga_card(manga);

                page_inner.appendChild(manga_div);
            }

            page.appendChild(page_inner);
            section.appendChild(page);

            var offset = $('#' + carousel_id).offset();
            $('html, body').animate({
                scrollTop: offset.top - 60,
                scrollLeft: offset.left
            }, 1000);

            var index = Array.prototype.indexOf.call(section.children, page);
            $('#' + carousel_id).carousel(index);

            pager.selectedIndex = page_number - 1;
            last_page.innerHTML = num_pages;

            $.each($('[data-action="get_bookmarked"]'), function(index, element) {
                var manga_id = element.getAttribute('data-manga');

                get_bookmarked_chapter(element, manga_id);
            });

            $.each($('[data-action="get_last_read"]'), function(index, element) {
                var manga_id = element.getAttribute('data-manga');

                get_last_read_chapter(element, manga_id);
            });
        },
        error: function(response) {
            unlock_module_loading();
            alert(response);
        }
    });
}

function search_manga(input_element) {
    var search_term = input_element.value;

    if (search_term.length < 3) {
        return;
    }

    var data = {
        search_term: search_term
    };

    var func = function(response) {
        update_search_results(response);
    };

    fetch_manga_json(data);
}

function fetch_manga_json(data, func) {
    $.ajax({
        type: "GET",
        url: "/manga_list_json",
        data: data,
        success: function(response) {
            var manga_list = JSON.parse(response);
            var results_div = document.getElementById("search_results");
            clear_div(results_div);
            var i = 0, l = manga_list.length;

            for(; i < l; i++) {
                var manga = manga_list[i];
                var div = document.createElement('div');
                var link = document.createElement('a');

                link.href = '/manga/manga/' + manga.pk;
                link.className = 'nav-link search_result bg-white';
                link.innerHTML = manga.fields.manga_name;

                div.appendChild(link);
                results_div.appendChild(div);
            }
        }
    });
}

function create_manga_card(manga) {
    var manga_card = document.createElement('div');
    manga_card.className = 'col-md-3 col-sm-4 col-xl-2 manga-card px-2';

    var card = document.createElement('div');
    card.className = 'card mb-3';

    var banner_image = document.createElement('img');
    banner_image.src = manga.fields.banner_image_url;
    banner_image.className = 'w-100 cover-image';

    var card_body = document.createElement('div');
    card_body.className = 'card-body py-1 px-1 d-flex flex-column';

    var manga_name = document.createElement('h6');
    manga_name.className = 'card-title font-weight-bold text-primary my-0';

    var manga_link = document.createElement('a');
    manga_link.className = 'manga-title';
    manga_link.href = '/manga/manga/' + manga.pk;
    manga_link.innerHTML = manga.fields.manga_name;

    manga_name.appendChild(manga_link);

    var manga_tags = document.createElement('p');
    manga_tags.className = 'card-text small my-0 manga-tags';

    var tags = manga.tags;
    var i = 0, l = tags.length;

    for(; i < l; i++) {
        var tag_json = tags[i];
        var tag = document.createElement('a');
        tag.className = 'tag';
        tag.href = tag_json.pk;
        tag.innerHTML = '&nbsp;' + tag_json.fields.tag_name;

        manga_tags.appendChild(tag);
    }

    var latest_chapter = document.createElement('p');
    latest_chapter.className = 'card-text small my-0 manga-chapter mt-auto';
    latest_chapter.innerHTML = "<a href='/manga/" + manga.pk + "/chapters/" + manga.latest_chapter +
                                "' class='current-chapter'>" +
                                "<span class='fa fa-arrow-right'></span>" +
                                "<span>Read Chapter " + manga.latest_chapter  + "</span></a>";

    var bookmarked = create_bookmarked_probing_element(manga.pk);
    var last_read = create_last_read_probing_element(manga.pk);

    var last_updated = document.createElement('p');
    last_updated.className = 'card-text last-updated';

    var small_text = document.createElement('small');
    small_text.class_name = 'text-muted';
    small_text.innerHTML = 'Last updated: ' + manga.fields.updated_on;

    last_updated.appendChild(small_text);

    card_body.appendChild(manga_name);
    card_body.appendChild(manga_tags);
    card_body.appendChild(latest_chapter);
    card_body.appendChild(bookmarked);
    card_body.appendChild(last_read);
    card_body.appendChild(last_updated);

    card.appendChild(banner_image);
    card.appendChild(card_body);

    manga_card.appendChild(card);

    return manga_card;
}