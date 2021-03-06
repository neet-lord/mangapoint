from django.core import serializers
from django.core.paginator import Paginator

from django.shortcuts import render, loader

from django.http import HttpResponse, JsonResponse

from django.contrib.auth.decorators import login_required

from manga import session as manga_session
from manga.models import Manga

from users import session as user_session
from users.models import SiteUser

from user_manga_integration.session import history as user_history

# Create your views here.

@login_required
def manga_list_history_view(request):
    authors_page = manga_session.get_authors_page(1, 10)
    tags_page = manga_session.get_tags_page(1, 10)

    active_user = user_session.get_authenticated_user(request)
    
    order_by = request.GET.get('order_by')

    if order_by is None:
        order_by = 'updated_on'

    history_mangas = user_history.get_history_page(active_user, 1, 12, order_by)

    template = loader.get_template('user_manga_integration/user_manga_history.dtl.html')

    context = {
        'sections': (
            {
                'section_id': 'history',
                'section_name': 'Reading History',
                'section_order': 'updated_on',
                'section_items_per_page': 12,
                'section_content': history_mangas,
                'pages': range(1, history_mangas.paginator.num_pages + 1)
            },
        ),
        'filterable_section': 'history',
        'filterable_section_items_per_page': 12,
        'all_authors': authors_page,
        'author_pages': range(1, authors_page.paginator.num_pages + 1),
        'all_tags': tags_page,
        'tag_pages': range(1, tags_page.paginator.num_pages + 1),
    }

    context = user_session.attach_active_user_to_context(context, request)

    return HttpResponse(template.render(context, request))
