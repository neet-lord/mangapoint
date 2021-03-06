from django.core import serializers
from django.core.paginator import Paginator

from django.shortcuts import render, loader

from django.http import HttpResponse, JsonResponse

from django.contrib.auth.decorators import login_required

from manga import session as manga_session
from manga.models import Manga

from users import session as user_session
from users.models import SiteUser

from user_manga_integration.session import watchlist as user_watchlist

# Create your views here.

@login_required
def user_dashboard(request):
    template = loader.get_template('account/account_dashbord.html')
    active_user = user_session.get_authenticated_user(request)
    
    context = {
        'user': active_user,
    }

    return HttpResponse(template, context)

@login_required
def manga_list_watchlist_view(request):
    authors_page = manga_session.get_authors_page(1, 10)
    tags_page = manga_session.get_tags_page(1, 10)

    active_user = user_session.get_authenticated_user(request)
    
    order_by = request.GET.get('order_by')

    if order_by is None:
        order_by = 'manga_name'

    watchlist_mangas = user_watchlist.get_watchlist_page(active_user, 1, 12, order_by)

    template = loader.get_template('manga/modules/manga_list.dtl.html')

    context = {
        'sections': (
            {
                'section_id': 'library',
                'section_name': 'My Library',
                'section_order': 'manga_name',
                'section_description': 'This is where you should place manga that you want notifications for (both on the site and off).',
                'section_items_per_page': 12,
                'section_content': watchlist_mangas,
                'pages': range(1, watchlist_mangas.paginator.num_pages + 1)
            },
        ),
        'filterable_section': 'library',
        'filterable_section_items_per_page': 12,
        'all_authors': authors_page,
        'author_pages': range(1, authors_page.paginator.num_pages + 1),
        'all_tags': tags_page,
        'tag_pages': range(1, tags_page.paginator.num_pages + 1),
    }

    context = user_session.attach_active_user_to_context(context, request)

    return HttpResponse(template.render(context, request))
