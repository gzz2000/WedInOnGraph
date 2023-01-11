from db import add_user, user_login, add_post, set_follow, set_unfollow, list_followed_posts, list_all_posts, user_email
from flask import Flask, redirect, request

app = Flask(__name__)

@app.route("/login", methods=["POST"])
def login():
    params = request.get_json()
    ret = user_login(params["username"], params["password"])
    return params["username"]

@app.route("/register", methods=["POST"])
def register():
    params = request.get_json()
    ret = add_user(params["username"], params["password"], params["email"])
    return params["username"]

@app.route("/editInfo", methods=["POST"])
def editInfo():
    params = request.get_json()
    ret = edit_info(params["username"], params["password"], params["email"])
    return params["username"]

@app.route("/addPost", methods=["POST"])
def addPost():
    params = request.get_json()
    ret = add_post(params["username"], params["post"])
    return params["username"]

@app.route("/delPost", methods=["POST"])
def delPost():
    params = request.get_json()
    ret = del_post(params["username"], params["postid"])
    return params["username"]

@app.route("/setFollow", methods=["POST"])
def setFollow():
    params = request.get_json()
    ret = set_follow(params["me"], params["other"])
    return params["username"]

@app.route("/setFollow", methods=["POST"])
def setUnfollow():
    params = request.get_json()
    ret = set_unfollow(params["me"], params["other"])
    return params["username"]

@app.route("/getUserEmail", methods=["GET"])
def getUserEmail():
    usr = request.args.get("username")
    return user_email(usr)

@app.route("/getFollowed", methods=["GET"])
def getFollowed():
    usr = request.args.get("username")
    return list_follower_users(usr)

@app.route("/getFollower", methods=["GET"])
def getFollower():
    usr = request.args.get("username")
    ret = list_followed_users(usr)
    return "register"

@app.route("/getPosts", methods=["GET"])
def getPosts():
    usr = request.args.get("username")
    return list_followed_posts(usr)

@app.route("/get2HopUnfollow", methods=["GET"])
def get2HopUnfollow():
    usr = request.args.get("username")
    return list_2hop_unfollowed_users(usr)

@app.route("/exploreUser", methods=["GET"])
def exploreUser():
    usr = request.args.get("username")
    return search_user(usr)



if __name__ == '__main__':
    app.run('127.0.0.1', port=5000)