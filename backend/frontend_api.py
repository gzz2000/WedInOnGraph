from db import add_user, user_login, add_post, set_follow, set_unfollow, list_followed_posts, list_all_posts
from flask import Flask, redirect, request

app = Flask(__name__)

@app.route("/login", methods=["POST"])
def login():
    user = request.get_json()
    ret = user_login(user["username"], user["password"])
    return "login"

@app.route("/register", methods=["POST"])
def register():
    user = request.get_json()
    ret = add_user(user["username"], user["password"], user["email"])
    return "register"

if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)