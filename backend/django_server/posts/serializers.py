from rest_framework.exceptions import NotFound
from rest_framework import serializers
from user_agents import parse
from django.db.models import Q
from users.serializers import UserSerializer
from .models import Post, Like, Repeat
from users.models import Follow, User

class PostSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(read_only=True)
    message = serializers.CharField(max_length=280)
    id_user = UserSerializer(read_only=True)
    agent = serializers.CharField(read_only=True)
    id_post_reply = Post()

    class Meta:
        model = Post
        fields = ['id', 'id_user', 'message', 'agent', 'id_post_reply']

    def create(self, validated_data):
        message = validated_data.get('message', None)
        id_user = validated_data.get('id_user', None)
        agent = parse(validated_data.get('agent', None))
        id_post_reply = self.initial_data.get('id_post_reply', None)

        post_reply = None

        if id_post_reply != None:
            try:
                post_reply = Post.objects.get(pk=id_post_reply)
            except Post.DoesNotExist:
                raise NotFound("No se encuentra el post padre")

        post = Post.objects.create(id_user=id_user, message=message, agent=agent.os.family, id_post_reply=post_reply)

        return post

    def validate(self, data):
        message = data.get("message", None)
        id_user = self.context.get("id_user", None)
        agent = self.context.get("agent", None)
        id_post_reply = data.get("id_post_reply", None)
        
        return {
            'message': message,
            'id_user': id_user,
            'agent': agent,
            'id_post_reply': id_post_reply 
        }

class AllPostSerializer(serializers.ModelSerializer):

    def get_user_posts(self):
        user = self.context.get("user", None)
        act_user = self.context.get("act_user", None)

        try:
            posts = Post.objects.raw('''
            SELECT p1.id, p1.message, p1.agent, p1.id_post_reply_id, p1.first_name, p1.username, p1.avatar as photo, p1.descr, p1.created_at, p1.likes as nlikes, p1.repeats as nrepeats, (l1.id_like IS NOT NULL) AS you_like, (l1.id_repeat IS NOT NULL) AS you_repeat, p1.user_repeat
            FROM (
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, u.descr, p.created_at, l.likes, r.repeats, NULL as user_repeat
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id_user_id = u.id AND p.id_user_id = "{usr}"
                UNION ALL
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, u.descr, u2.created_at, l.likes, r.repeats, u2.user_repeat as user_repeat
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, (
                    SELECT r3.id_post_id, u.username as user_repeat, r3.created_at
                    FROM posts_repeat r3, users_user u
                    WHERE r3.id_user_id = u.id AND r3.id_user_id = "{usr}"
                ) u2, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id = u2.id_post_id AND p.id_user_id = u.id
            ) p1 LEFT JOIN (
                SELECT l.id_post, l.id_like, r.id_repeat
                FROM (
                    SELECT id_post_id as id_post, id as id_like, null as id_repeat
                    FROM posts_like
                    WHERE id_user_id = "{arg}"
                ) l, (
                    SELECT id_post_id as id_post, null as id_like, id as id_repeat
                    FROM posts_repeat
                    WHERE id_user_id = "{arg}"
                ) r
                WHERE l.id_post = r.id_post
                UNION ALL
                SELECT id_post_id as id_post, id as id_like, null as id_repeat
                FROM posts_like
                WHERE id_user_id = "{arg}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{arg}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{arg}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
                UNION ALL
                SELECT id_post_id as id_post, null as id_like, id as id_repeat
                FROM posts_repeat
                WHERE id_user_id = "{arg}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{arg}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{arg}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
            ) l1
            ON p1.id = l1.id_post
            ORDER BY p1.created_at DESC
            LIMIT 30
            '''.format(arg=act_user.id.hex, usr=user.id.hex))
        except Post.DoesNotExist:
            raise NotFound("No existe el post")

        res = []
        for p in posts:
            res.append({
                'id': p.id,
                'message': p.message,
                'agent': p.agent,
                'id_post_reply': p.id_post_reply_id,
                'date': p.created_at,
                'user': {
                    'name': p.first_name,
                    'username': p.username,
                    'photo': p.photo,
                    'descr': p.descr
                },
                'data': {
                    'nlikes': p.nlikes,
                    'nrepeats': p.nrepeats,
                    'you_like': p.you_like,
                    'you_repeat': p.you_repeat,
                    'user_repeat': p.user_repeat
                }
            })

        if user.id != act_user.id:
            try: 
                follow = Follow.objects.get(Q(user_follow=act_user.id) & Q(user_followed=user.id))
                if follow:
                    user_follow = True
                else:
                    user_follow = False
            except Follow.DoesNotExist:
                user_follow = False
        else:
            user_follow = None

        this_response = {
            'name': user.first_name,
            'username': user.username,
            'photo': user.avatar,
            'descr': user.descr,
            'user_follow': user_follow,
            'user_posts': res
        }

        return this_response
    
    def get_post(self):
        id_post = self.context.get("id_post", None)
        user = self.context.get("user", None)

        try:
            posts = Post.objects.raw('''
            SELECT p1.id, p1.message, p1.agent, NULL as id_post_reply_id, p1.first_name, p1.username, p1.avatar as photo, p1.created_at, p1.likes as nlikes, p1.repeats as nrepeats, (l1.id_like IS NOT NULL) AS you_like, (l1.id_repeat IS NOT NULL) AS you_repeat
            FROM (
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, p.created_at, l.likes, r.repeats
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id = "{idp}" AND p.id_user_id = u.id
            ) p1 LEFT JOIN (
                SELECT l.id_post, l.id_like, r.id_repeat
                FROM (
                    SELECT id_post_id as id_post, id as id_like, null as id_repeat
                    FROM posts_like
                    WHERE id_user_id = "{idu}"
                ) l, (
                    SELECT id_post_id as id_post, null as id_like, id as id_repeat
                    FROM posts_repeat
                    WHERE id_user_id = "{idu}"
                ) r
                WHERE l.id_post = r.id_post
                UNION ALL
                SELECT id_post_id as id_post, id as id_like, null as id_repeat
                FROM posts_like
                WHERE id_user_id = "{idu}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{idu}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{idu}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
                UNION ALL
                SELECT id_post_id as id_post, null as id_like, id as id_repeat
                FROM posts_repeat
                WHERE id_user_id = "{idu}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{idu}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{idu}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
            ) l1
            ON p1.id = l1.id_post
            '''.format(idu=user.id.hex, idp=id_post))
        except Post.DoesNotExist:
            raise NotFound("No existe el post")

        for p in posts:
            res = {
                'id': p.id,
                'message': p.message,
                'agent': p.agent,
                'id_post_reply': p.id_post_reply_id,
                'date': p.created_at,
                'user': {
                    'name': p.first_name,
                    'username': p.username,
                    'photo': p.photo
                },
                'data': {
                    'nlikes': p.nlikes,
                    'nrepeats': p.nrepeats,
                    'you_like': p.you_like,
                    'you_repeat': p.you_repeat
                },
                'replys': []
            }

        try:
            replys = Post.objects.raw('''
            SELECT p1.id, p1.message, p1.agent, p1.id_post_reply_id, p1.first_name, p1.username, p1.avatar as photo, p1.created_at, p1.likes as nlikes, p1.repeats as nrepeats, (l1.id_like IS NOT NULL) AS you_like, (l1.id_repeat IS NOT NULL) AS you_repeat
            FROM (
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, p.created_at, l.likes, r.repeats
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id_post_reply_id = "{idp}" AND p.id_user_id = u.id
            ) p1 LEFT JOIN (
                SELECT l.id_post, l.id_like, r.id_repeat
                FROM (
                    SELECT id_post_id as id_post, id as id_like, null as id_repeat
                    FROM posts_like
                    WHERE id_user_id = "{idu}"
                ) l, (
                    SELECT id_post_id as id_post, null as id_like, id as id_repeat
                    FROM posts_repeat
                    WHERE id_user_id = "{idu}"
                ) r
                WHERE l.id_post = r.id_post
                UNION ALL
                SELECT id_post_id as id_post, id as id_like, null as id_repeat
                FROM posts_like
                WHERE id_user_id = "{idu}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{idu}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{idu}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
                UNION ALL
                SELECT id_post_id as id_post, null as id_like, id as id_repeat
                FROM posts_repeat
                WHERE id_user_id = "{idu}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{idu}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{idu}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
            ) l1
            ON p1.id = l1.id_post
            ORDER BY p1.created_at DESC
            '''.format(idu=user.id.hex, idp=id_post))
        except Post.DoesNotExist:
            replys = None

        if replys:
            for r in replys:
                res.get("replys", []).append({
                    'id': r.id,
                    'message': r.message,
                    'agent': r.agent,
                    'id_post_reply': None,
                    'date': r.created_at,
                    'user': {
                        'name': r.first_name,
                        'username': r.username,
                        'photo': r.photo
                    },
                    'data': {
                        'nlikes': r.nlikes,
                        'nrepeats': r.nrepeats,
                        'you_like': r.you_like,
                        'you_repeat': r.you_repeat
                    }
                })

        return res

    def get_all_posts(self):

        user = self.context

        try:
            posts = Post.objects.raw('''
            SELECT p1.id, p1.message, p1.agent, p1.id_post_reply_id, p1.first_name, p1.username, p1.avatar as photo, p1.created_at, p1.likes as nlikes, p1.repeats as nrepeats, (l1.id_like IS NOT NULL) AS you_like, (l1.id_repeat IS NOT NULL) AS you_repeat, p1.user_repeat
            FROM (
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, p.created_at, l.likes, r.repeats, NULL as user_repeat
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id IN (
                    SELECT p2.id
                    FROM posts_post p2, users_follow f2
                    WHERE p2.id_user_id = f2.user_followed_id AND f2.user_follow_id = "{arg}" OR p2.id_user_id = "{arg}"
                ) AND p.id_user_id = u.id
                UNION ALL
                SELECT p.id, p.message, p.agent, p.id_post_reply_id, u.first_name, u.username, u.avatar, u2.created_at, l.likes, r.repeats, u2.user_repeat as user_repeat
                FROM posts_post p, (
                    SELECT p.id as id, COUNT(l.id) as likes
                    FROM posts_post p LEFT JOIN posts_like l
                    ON l.id_post_id = p.id
                    GROUP BY p.id
                ) l, (
                    SELECT p.id as id, COUNT(r.id) as repeats
                    FROM posts_post p LEFT JOIN posts_repeat r
                    ON r.id_post_id = p.id
                    GROUP BY p.id
                ) r, (
                    SELECT r3.id_post_id, u.username as user_repeat, r3.created_at
                    FROM posts_repeat r3, users_follow f3, users_user u
                    WHERE r3.id_user_id = f3.user_followed_id AND f3.user_follow_id = "{arg}" AND r3.id_user_id = u.id
                ) u2, users_user u
                WHERE p.id = l.id AND p.id = r.id AND p.id = u2.id_post_id AND p.id_user_id = u.id
            ) p1 LEFT JOIN (
                SELECT l.id_post, l.id_like, r.id_repeat
                FROM (
                    SELECT id_post_id as id_post, id as id_like, null as id_repeat
                    FROM posts_like
                    WHERE id_user_id = "{arg}"
                ) l, (
                    SELECT id_post_id as id_post, null as id_like, id as id_repeat
                    FROM posts_repeat
                    WHERE id_user_id = "{arg}"
                ) r
                WHERE l.id_post = r.id_post
                UNION ALL
                SELECT id_post_id as id_post, id as id_like, null as id_repeat
                FROM posts_like
                WHERE id_user_id = "{arg}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{arg}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{arg}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
                UNION ALL
                SELECT id_post_id as id_post, null as id_like, id as id_repeat
                FROM posts_repeat
                WHERE id_user_id = "{arg}" AND id_post_id NOT IN (
                    SELECT l.id_post
                    FROM (
                        SELECT id_post_id as id_post, id as id_like, null as id_repeat
                        FROM posts_like
                        WHERE id_user_id = "{arg}"
                    ) l, (
                        SELECT id_post_id as id_post, null as id_like, id as id_repeat
                        FROM posts_repeat
                        WHERE id_user_id = "{arg}"
                    ) r
                    WHERE l.id_post = r.id_post
                )
            ) l1
            ON p1.id = l1.id_post
            ORDER BY p1.created_at DESC
            LIMIT 30
            '''.format(arg=user.id.hex))
        except Post.DoesNotExist:
            raise NotFound("error posts")

        res = []
        for p in posts:
            res.append({
                'id': p.id,
                'message': p.message,
                'agent': p.agent,
                'id_post_reply': p.id_post_reply_id,
                'date': p.created_at,
                'user': {
                    'name': p.first_name,
                    'username': p.username,
                    'photo': p.photo
                },
                'data': {
                    'nlikes': p.nlikes,
                    'nrepeats': p.nrepeats,
                    'you_like': p.you_like,
                    'you_repeat': p.you_repeat,
                    'user_repeat': p.user_repeat
                }
            })

        return res

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['user', 'post']

    def create(self, validate_data):
        user = self.context.get('user', None)
        post = self.context.get('post', None)

        like = Like.objects.create(id_post=post, id_user=user)
        
        return like

class RepeatSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)
    class Meta:
        model = Repeat
        fields = ['user', 'post']

    def create(self, validate_data):
        user = self.context.get('user', None)
        post = self.context.get('post', None)

        repeat = Repeat.objects.create(id_post=post, id_user=user)
        
        return repeat