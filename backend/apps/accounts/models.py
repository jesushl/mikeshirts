from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomerManager, StaffUserManager


class User(AbstractUser):
    AUTH_PROVIDER_CHOICES = [
        ('email', 'Email'),
        ('google', 'Google'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
    ]

    phone = models.CharField(max_length=20, blank=True)
    rfc = models.CharField('RFC', max_length=13, blank=True)
    auth_provider = models.CharField(
        max_length=20,
        choices=AUTH_PROVIDER_CHOICES,
        default='email',
    )

    class Meta:
        db_table = 'accounts_user'

    def __str__(self):
        return self.email or self.username

    @property
    def is_profile_complete(self):
        return bool(self.phone) and self.addresses.exists()


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=50, blank=True, help_text='e.g. Casa, Oficina')
    street = models.CharField('Calle', max_length=255)
    ext_number = models.CharField('Número exterior', max_length=20)
    int_number = models.CharField('Número interior', max_length=20, blank=True)
    neighborhood = models.CharField('Colonia', max_length=255)
    city = models.CharField('Ciudad', max_length=255)
    state = models.CharField('Estado', max_length=100)
    zip_code = models.CharField('Código postal', max_length=10)
    country = models.CharField('País', max_length=100, default='México')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts_address'
        verbose_name_plural = 'addresses'
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f'{self.street} {self.ext_number}, {self.neighborhood}, {self.city}'

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class Customer(User):
    objects = CustomerManager()

    class Meta:
        proxy = True
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'


class StaffUser(User):
    objects = StaffUserManager()

    class Meta:
        proxy = True
        verbose_name = 'Staff User'
        verbose_name_plural = 'Staff Users'
