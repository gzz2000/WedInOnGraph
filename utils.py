import re
from parameters_validation import validate_parameters, parameter_validation

@parameter_validation
def is_username(username: str):
    if not re.fullmatch(r'[a-z0-9]{3,10}', username):
        raise ValueError('Username must be lowercases and digits '
                         'and have length between 3 and 10.')

@parameter_validation
def is_password(password: str):
    if not re.fullmatch(r'.{6,20}', password):
        raise ValueError('Password must have length between 6 and 20.')

@parameter_validation
def is_email(email: str):
    if not re.fullmatch(r'[-+\.\w]{1,100}@[\w-]{1,100}(\.[\w-]{1,100}){1,10}', email):
        raise ValueError('This does not look like a valid email address.')
