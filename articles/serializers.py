from django.db.models.query import QuerySet
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import smart_text
from django.contrib.auth.models import User
from .models import *
from accounts.models import *


class CreatableSlugRelatedField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            return self.get_queryset().get_or_create(**{self.slug_field: data})[0]
        except ObjectDoesNotExist:
            self.fail('does_not_exist', slug_name=self.slug_field,
                      value=smart_text(data))
        except (TypeError, ValueError):
            self.fail('invalid')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):

    article_likes = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    tags = CreatableSlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = Article
        fields = ('id', 'url', 'article_type', 'title',
                  'content', 'description', 'tags', 'user', 'article_likes')

    def create(self, validated_data):

        # extract tags
        tags = validated_data.pop('tags')

        # create article
        article = super().create(validated_data)
        article.save()

        # create tags if doesn't exist and add to article
        for tag in tags:
            Tag.objects.get_or_create(name=tag)
            article.tags.add(tag)

        # get user
        user = User.objects.get(pk=article.user.pk)

        # init unread, private, local stats
        Unread.objects.create(status=True, article=article, user=user)
        Private.objects.create(status=False, article=article, user=user)
        Local.objects.create(status=False, article=article, user=user)

        return article
