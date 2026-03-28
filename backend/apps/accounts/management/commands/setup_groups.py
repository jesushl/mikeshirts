from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


GROUPS = ['ventas', 'envios', 'produccion', 'admin_full']


class Command(BaseCommand):
    help = 'Create initial staff groups for Mike Shirts'

    def handle(self, *args, **options):
        for name in GROUPS:
            group, created = Group.objects.get_or_create(name=name)
            status = 'created' if created else 'already exists'
            self.stdout.write(f'  Group "{name}": {status}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone — {Group.objects.count()} groups total.'
        ))
