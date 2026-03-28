from rest_framework import serializers


class FunnelEventInputSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(
        choices=['product_view', 'add_to_cart', 'checkout_start', 'purchase'],
    )
    metadata = serializers.DictField(required=False, default=dict)
