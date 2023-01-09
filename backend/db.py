from gstore_api import GstoreConnector, GStoreError
from utils import validate_parameters, is_username, is_password, is_email, hash_password
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
                else:
                    record[k] = record[k]['value']
        return ret
    else:
        return None

@validate_parameters
def add_user(username: is_username(str), password: is_password(str),
             email: is_email(str)):
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

    db_query(f'INSERT DATA {{ \
    <weibo:user/{username}> <weibo:password> "{hash_password(password)}"; \
    <weibo:email> "{email}" \
    }}')

@validate_parameters
def user_login(username: is_username(str), password: is_password(str)):
    u = db_query(f'SELECT ?password WHERE {{ \
    <weibo:user/{username}> <weibo:password> ?password \
    }}')
    if not u:
        raise ValueError('User does not exist.')
    if u[0]['password'] != hash_password(password):
        raise ValueError('Password incorrect.')
    print(f'User {username} logged in.')

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
def list_followed_posts(me: is_username(str), limit=100, offset=0):
    return db_query(f'SELECT ?postid ?author ?content ?time WHERE {{ \
    {{{{<weibo:user/{me}> <weibo:follows> ?author . \
        ?postid <weibo:posted_by> ?author }} UNION \
      {{?postid <weibo:posted_by> ?author FILTER \
        (?author = <weibo:user/{me}>)}} }} . \
    ?postid <weibo:post_content> ?content; \
    <weibo:post_time> ?time \
    }} LIMIT {limit} OFFSET {offset} ORDER BY ?time DESC')

@validate_parameters
def list_all_posts(limit=100, offset=0):
    return db_query(f'SELECT ?postid ?author ?content ?time WHERE {{ \
    ?postid <weibo:posted_by> ?author; \
    <weibo:post_content> ?content; \
    <weibo:post_time> ?time \
    }} LIMIT {limit} OFFSET {offset} ORDER BY ?time DESC')

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

@validate_parameters
def search_user(username: is_username(str)):
    # todo: for "explore" page, return username
    return "abaaba@pku.edu.cn"

def init_sample_data():
    add_user('gzz', '123456', 'gzz_2000@126.com')
    add_user('gzz2', '123456', 'gzz_2000@127.com')
    add_post('gzz', 'hello world from gzz')
    time.sleep(2)
    add_post('gzz2', 'hello world from gzz2')
    set_follow('gzz', 'gzz2')
