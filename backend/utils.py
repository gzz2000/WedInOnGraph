import re
from parameters_validation import validate_parameters, parameter_validation
import hashlib
from jose import jwe
import json

hash_salt = b'[_highly_secure_md5salt_by_zizheng]'
user_token_key = b'jwek_jq2h41isz;3'

@parameter_validation
def is_username(username: str):
    if not re.fullmatch(r'[a-z0-9]{3,20}', username):
        raise ValueError('Username must be lowercases and digits '
                         'and have length between 3 and 20.')

@parameter_validation
def is_password(password: str):
    if not re.fullmatch(r'.{6,20}', password):
        raise ValueError('Password must have length between 6 and 20.')

@parameter_validation
def is_email(email: str):
    if not re.fullmatch(r'[-+\.\w]{1,100}@[\w-]{1,100}(\.[\w-]{1,100}){1,10}', email):
        raise ValueError('This does not look like a valid email address.')

@parameter_validation
def is_postid(postid: str):
    if not re.fullmatch(r'[-a-zA-Z0-9]{1,100}', postid):
        raise ValueError('This does not look like a valid post id.')

@parameter_validation
def is_search_keyword(postid: str):
    if not re.fullmatch(r'[-a-zA-Z0-9\u4e00-\u9fa5]{1,100}', postid):
        raise ValueError('Please enter a keyword without space and special chars')

def hash_password(password):
    return hashlib.md5(hash_salt +
                       password.encode('utf-8')) \
                  .hexdigest()

def encrypt_user_token(data):
    return jwe.encrypt(json.dumps(data), user_token_key,
                       algorithm='dir', encryption='A128GCM'
                       ).decode('ascii')

def decrypt_user_token(tok):
    return json.loads(jwe.decrypt(tok, user_token_key))
