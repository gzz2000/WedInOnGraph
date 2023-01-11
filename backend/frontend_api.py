import db
import utils
from flask import Flask, redirect, request, jsonify
import time
import functools

app = Flask(__name__)

class LoginError(ValueError):
    pass

def encode_credential(username, nick, email, valid_days):
    return utils.encrypt_user_token({
        'username': username,
        'nick': nick,
        'email': email,
        'expire': time.time() + valid_days * 86400
    })

def decode_credential(cred):
    r = utils.decrypt_user_token(cred)
    if r['expire'] < time.time():
        raise LoginError('Login expired')
    return r

def json_io(f):
    @functools.wraps(f)
    def f1(*args, **kwargs):
        params = request.get_json()
        err = None
        relogin = False
        try:
            ret = f(*args, **kwargs, params=params)
        except LoginError as e:
            err = e.args[0]
            relogin = True
        except ValueError as e:
            err = e.args[0]
        if err is None:
            if ret is None:
                ret = {'success': True}
            else:
                ret = {'success': True, 'data': ret}
        else:
            ret = {'success': False, 'err': err}
            if relogin:
                ret['relogin'] = True
        return jsonify(ret)
    return f1

# should apply inside json_io.
def requires_login(f):
    @functools.wraps(f)
    def f1(params, *args, **kwargs):
        try:
            tok = params['token']
            user = decode_credential(tok)
        except ValueError as e:
            raise LoginError(*e.args)
        return f(*args, **kwargs, params=params, user=user)
    return f1

@app.route('/api/login', methods=['POST'])
@json_io
def login(params):
    username, password = params['username'], params['password']
    email, nick = db.user_login(
        username, password
    )
    valid_days = 30 if params['remember'] else 1
    return {'username': username,
            'email': email,
            'nick': nick,
            'token': encode_credential(username, nick, email,
                                       valid_days)}

@app.route('/api/register', methods=['POST'])
@json_io
def register(params):
    username, password, email, nick = params['username'], params['password'], params['email'], params['nick']
    db.add_user(username, password, email, nick)
    valid_days = 1
    return {'username': username,
            'email': email,
            'nick': nick,
            'token': encode_credential(username, email, nick,
                                       valid_days)}

# @app.route("/editInfo", methods=["POST"])
# def editInfo():
#     params = request.get_json()
#     ret = edit_info(params["username"], params["password"], params["email"])
#     return params["username"]

@app.route('/api/add_post', methods=['POST'])
@json_io
@requires_login
def add_post(params, user):
    db.add_post(user['username'], params['post'])

@app.route('/api/delete_post', methods=['POST'])
@json_io
@requires_login
def delete_post(params, user):
    db.delete_post(params['postid'], user['username'])

@app.route('/api/set_follow', methods=['POST'])
@json_io
@requires_login
def set_follow(params, user):
    db.set_follow(user['username'], params['other'])

@app.route('/api/set_unfollow', methods=['POST'])
@json_io
@requires_login
def set_unfollow(params, user):
    db.set_unfollow(user['username'], params['other'])

@app.route('/api/list_followed_posts', methods=['POST'])
@json_io
@requires_login
def list_followed_posts(params, user):
    posts = db.list_followed_posts(
        user['username'], params['limit'], params['offset'])
    for post in posts:
        post['thumbups'] = db.list_thumbups(post['postid'])
    return posts

@app.route('/api/list_all_posts', methods=['POST'])
@json_io
def list_all_posts(params):
    posts = db.list_all_posts(
        params['limit'], params['offset'])
    for post in posts:
        post['thumbups'] = db.list_thumbups(post['postid'])
    return posts

@app.route('/api/list_ones_posts', methods=['POST'])
@json_io
def list_ones_posts(params):
    posts = db.list_ones_posts(
        params['user'], params['limit'], params['offset'])
    for post in posts:
        post['thumbups'] = db.list_thumbups(post['postid'])
    return posts

@app.route('/api/add_thumbup', methods=['POST'])
@json_io
@requires_login
def add_thumbup(params, user):
    db.add_thumbup(user['username'], params['postid'])

@app.route('/api/remove_thumbup', methods=['POST'])
@json_io
@requires_login
def remove_thumbup(params, user):
    db.remove_thumbup(user['username'], params['postid'])

@app.route('/api/search_user', methods=['POST'])
@json_io
def search_user(params):
    ret = db.search_user(params['keyword'], params['limit'], params['offset'])
    if 'token' in params:
        user = decode_credential(params['token'])
        db.append_relation_curuser(ret, user['username'])
    return ret

@app.route('/api/recommend_2_hop', methods=['POST'])
@json_io
def recommend_2_hop(params):
    return db.recommend_2_hop(params['me'], params['limit'])

@app.route('/api/get_user_info', methods=['POST'])
@json_io
def get_user_info(params):
    ret = db.get_user_info(params['username'])
    if 'token' in params:
        user = decode_credential(params['token'])
        db.append_relation_curuser(ret['followers'], user['username'])
        db.append_relation_curuser(ret['following'], user['username'])
    return ret

# @app.route("/get2HopUnfollow", methods=["GET"])
# def get2HopUnfollow():
#     usr = request.args.get("username")
#     return list_2hop_unfollowed_users(usr)

# @app.route("/exploreUser", methods=["GET"])
# def exploreUser():
#     usr = request.args.get("username")
#     return search_user(usr)

if __name__ == '__main__':
    app.run('127.0.0.1', port=5000)
