from gstore_api import GstoreConnector, GStoreError
from utils import validate_parameters, is_username, is_password, is_email
import hashlib

gc = GstoreConnector('127.0.0.1', 9000, 'root', '123456')
gc.load('weibo', '0')

def db_query(sparql):
    ret = gc.query('weibo', 'json', sparql)
    if 'results' in ret:
        ret = ret['results']['bindings']
        for record in ret:
            for k in record:
                record[k] = record[k]['value']
        return ret
    else:
        return None

def hash_password(password):
    return hashlib.md5(b'[_highly_secure_md5salt_by_zizheng]' +
                       password.encode('utf-8')) \
                  .hexdigest()

@validate_parameters
def add_user(username: is_username(str), password: is_password(str),
             email: is_email(str)):
    exist = db_query(f'SELECT ?email WHERE {{ \
    <weiboproj:user/{username}> <weiboproj:email> ?email \
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
    <weiboproj:user/{username}> <weiboproj:password> "{hash_password(password)}"; \
    <weiboproj:email> "{email}" \
    }}')

@validate_parameters
def user_login(username: is_username(str), password: is_password(str)):
    u = db_query(f'SELECT ?password WHERE {{ \
    <weiboproj:user/{username}> <weiboproj:password> ?password \
    }}')
    if not u:
        raise ValueError('User not exist.')
    if u[0]['password'] != hash_password(password):
        raise ValueError('Password incorrect')
    print(f'User {username} logged in.')
