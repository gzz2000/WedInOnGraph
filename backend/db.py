from gstore_api import GstoreConnector, GStoreError
from utils import validate_parameters, is_username, is_password, is_email, is_postid, is_search_keyword, hash_password
import uuid
import time
import json

gc = GstoreConnector('127.0.0.1', 9000, 'root', '123456')
gc.load('weibo', '0')

def db_query(sparql):
    ret = gc.query('weibo', 'json', sparql)
    if 'results' in ret:
        ret = ret['results']['bindings']
        for record in ret:
            for k in record:
                if 'datatype' in record[k] and record[k]['datatype'] == \
                   'http://www.w3.org/2001/XMLSchema#integer':
                    record[k] = int(record[k]['value'])
                elif 'datatype' in record[k] and record[k]['datatype'] == \
                   'http://www.w3.org/2001/XMLSchema#boolean':
                    record[k] = record[k]['value'] == 'true'
                elif 'value' in record[k]:
                    record[k] = record[k]['value']
                else:
                    record[k] = 'ERR: NO VALUE'
        return ret
    else:
        return None

def simple_cleanup(result, fields=[], fields_array=[]):
    ret = []
    for r in result:
        r = r.copy()
        for field in fields:
            assert r[field].startswith('weibo:'), r[field]
            r[field] = r[field][r[field].index('/') + 1:]
        for field in fields_array:
            r[field] = r[field].split()
            for i in range(len(r[field])):
                assert r[field][i].startswith('weibo:'), r[field][i]
                r[field][i] = r[field][i][r[field][i].index('/') + 1:]
        ret.append(r)
    return ret

@validate_parameters
def add_user(username: is_username(str), password: is_password(str),
             email: is_email(str), nick: str = None):
    exist = db_query(f'SELECT ?email WHERE {{ \
    <weibo:user/{username}> <weibo:email> ?email \
    }}')
    if exist:
        print(exist)
        if exist[0]['email'] == email:
            raise ValueError('User exists with the same email. '
                             'Please try logging in.')
        else:
            raise ValueError('Username already registered with '
                             'a different email. '
                             'Try another one.')

    if nick is None:
        nick = username

    db_query(f'INSERT DATA {{ \
    <weibo:user/{username}> <weibo:password> "{hash_password(password)}"; \
    <weibo:email> "{email}"; \
    <weibo:nick> {json.dumps(str(nick))} \
    }}')
    set_follow(username, username)  # always following oneself

@validate_parameters
def user_login(username: is_username(str), password: is_password(str)):
    u = db_query(f'SELECT ?password ?email ?nick WHERE {{ \
    <weibo:user/{username}> <weibo:password> ?password; \
    <weibo:email> ?email; \
    <weibo:nick> ?nick \
    }}')
    if not u:
        raise ValueError('User does not exist.')
    if u[0]['password'] != hash_password(password):
        raise ValueError('Password incorrect.')
    print(f'User {username} logged in.')
    return u[0]['email'], u[0]['nick']

@validate_parameters
def add_post(username: is_username(str), post: str):
    post_id = str(uuid.uuid4())
    db_query(f'INSERT DATA {{ \
    <weibo:post/{post_id}> \
    <weibo:posted_by> <weibo:user/{username}>; \
    <weibo:post_content> {json.dumps(str(post))}; \
    <weibo:post_time> {int(time.time())} \
    }}')

@validate_parameters
def delete_post(postid: is_postid(str), user: is_username(str)):
    real_user = db_query(f'SELECT ?user WHERE {{ \
    <weibo:post/{postid}> <weibo:posted_by> ?user \
    }}')
    real_user = simple_cleanup(real_user, ['user'])
    if not real_user or real_user[0]['user'] != user:
        raise ValueError('Post does not exist or is not published by you')
    db_query(f'DELETE {{ <weibo:post/{postid}> ?p ?o }} WHERE {{ \
    <weibo:post/{postid}> ?p ?o \
    }}')
    db_query(f'DELETE {{ ?s ?p <weibo:post/{postid}> }} WHERE {{ \
    ?s ?p <weibo:post/{postid}> \
    }}')

@validate_parameters
def set_follow(me: is_username(str), other: is_username(str)):
    # check the following user exists
    assert db_query(f'SELECT ?email WHERE {{ \
    <weibo:user/{other}> <weibo:email> ?email \
    }}')
    db_query(f'INSERT DATA {{ \
    <weibo:user/{me}> <weibo:follows> <weibo:user/{other}> \
    }}')

@validate_parameters
def set_unfollow(me: is_username(str), other: is_username(str)):
    db_query(f'DELETE DATA {{ \
    <weibo:user/{me}> <weibo:follows> <weibo:user/{other}> \
    }}')

@validate_parameters
def check_follow(me: is_username(str), other: is_username(str)):
    return db_query(f'ASK WHERE {{ \
    <weibo:user/{me}> <weibo:follows> <weibo:user/{other}> \
    }}')[0]['_askResult']

@validate_parameters
def list_thumbups(postid: is_postid(str)):
    ret = db_query(f'SELECT ?username ?nick WHERE {{ \
    ?username <weibo:thumbup> <weibo:post/{postid}>; \
    <weibo:nick> ?nick \
    }}')
    return simple_cleanup(ret, ['username'])

@validate_parameters
def add_thumbup(me: is_username(str), postid: is_postid(str)):
    db_query(f'INSERT DATA {{ \
    <weibo:user/{me}> <weibo:thumbup> <weibo:post/{postid}> \
    }}')

@validate_parameters
def remove_thumbup(me: is_username(str), postid: is_postid(str)):
    db_query(f'DELETE DATA {{ \
    <weibo:user/{me}> <weibo:thumbup> <weibo:post/{postid}> \
    }}')

@validate_parameters
def list_followed_posts(me: is_username(str), limit=100, offset=0):
    ret = db_query(f'SELECT ?postid ?author ?authornick ?content ?time WHERE {{ \
    <weibo:user/{me}> <weibo:follows> ?author . \
    ?postid <weibo:posted_by> ?author ; \
    <weibo:post_content> ?content; \
    <weibo:post_time> ?time . \
    ?author <weibo:nick> ?authornick \
    }} ORDER BY DESC(?time) LIMIT {int(limit)} OFFSET {int(offset)}')
    return simple_cleanup(ret, ['postid', 'author'])

@validate_parameters
def list_all_posts(limit=100, offset=0):
    ret = db_query(f'SELECT ?postid ?author ?authornick ?content ?time WHERE {{ \
    ?postid <weibo:posted_by> ?author; \
    <weibo:post_content> ?content; \
    <weibo:post_time> ?time . \
    ?author <weibo:nick> ?authornick \
    }} ORDER BY DESC(?time) LIMIT {int(limit)} OFFSET {int(offset)}')
    return simple_cleanup(ret, ['postid', 'author'])

@validate_parameters
def search_user(keyword: is_search_keyword(str), limit=100, offset=0):
    ret = db_query(f'SELECT ?username ?nick WHERE {{ \
    ?username <weibo:nick> ?nick . \
    FILTER ( regex( str(?username), ".*{keyword}.*" ) || regex( ?nick, ".*{keyword}.*" ) ) \
    }} LIMIT {int(limit)} OFFSET {int(offset)}')
    return simple_cleanup(ret, ['username'])

@validate_parameters
def recommend_2_hop(me: is_username(str), limit=100):
    ret = db_query(f'SELECT ?username ?nick (COUNT(?middle) AS ?nmiddle) WHERE {{ \
    <weibo:user/{me}> <weibo:follows> ?middle . \
    ?middle <weibo:follows> ?username . \
    ?username <weibo:nick> ?nick \
    MINUS {{ <weibo:user/{me}> <weibo:follows> ?username }} \
    }} GROUP BY ?username ?nick LIMIT {int(limit)}')
    return simple_cleanup(ret, ['username'])

# @validate_parameters
# def recommend_random(limit=100):
#     ret = db_query(f'SELECT ?username ?nick (RAND() AS ?rnd) WHERE {{ \
#     ?username <weibo:nick> ?nick \
#     }} ORDER BY ?rnd LIMIT {int(limit)}')
#     return simple_cleanup(ret, ['username'])

@validate_parameters
def get_info(username: is_username(str)):
    return db_query(f'SELECT ?nick ?email WHERE {{ \
    <weibo:user/{username}> <weibo:nick> ?nick ; \
    <weibo:email> ?email \
    }}')[0]

@validate_parameters
def list_followed_users(username: is_username(str)):
    # todo: for "network" page, return list of username
    return "abaaba@pku.edu.cn"

@validate_parameters
def list_follower_users(username: is_username(str)):
    # todo: for "network" page, return list of username
    return "abaaba@pku.edu.cn"

@validate_parameters
def user_email(username: is_username(str)):
    # todo: for "network" page, return email（string)
    return "abaaba@pku.edu.cn"

@validate_parameters
def edit_info(username: is_username(str), password: is_password(str),
             email: is_email(str)):
    # todo: for "network" page
    return "abaaba@pku.edu.cn"

@validate_parameters
def list_2hop_unfollowed_users(username: is_username(str)):
    # todo: for "home" page, return list of username
    return "abaaba@pku.edu.cn"

def init_sample_data():
    add_user('gzz', '123456', 'gzz_2000@126.com')
    add_user('gzz2', '123456', 'gzz_2000@127.com')
    add_post('gzz', 'hello world from gzz')
    time.sleep(2)
    add_post('gzz2', 'hello world from gzz2')
    set_follow('gzz', 'gzz2')
