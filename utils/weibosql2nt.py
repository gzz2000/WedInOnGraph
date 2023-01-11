import re
import json
import time

re_user = re.compile(r'INSERT INTO \`user\` VALUES \(\'(?P<uid>\d+)\', \'(?P<nick>[^\']+)\', \'(?P<nick2>[^\']+)\', [^\)]*\)')

re_userrelation = re.compile(r'INSERT INTO \`userrelation\` VALUES \(\'(?P<suid>\d+)\', \'(?P<tuid>\d+)\'\)')

re_post = re.compile(r'INSERT INTO \`weibo\` VALUES \(\'(?P<mid>\d+)\', \'(?P<date>[\d\-\s:]+)\', \'(?P<text>[^\']+)\', \'(:?[^\']*)\', \d+, \d+, \d+, \'(?P<uid>\d+)\', \'(?:[^\']*)\'\)')

with open('weibodatabase.sql') as f:
    dbstr = f.read()

users = [m.groupdict() for m in re_user.finditer(dbstr)]
userrelations = [m.groupdict() for m in re_userrelation.finditer(dbstr)]
posts = [m.groupdict() for m in re_post.finditer(dbstr)]

with open('weibodatabase_small.nt', 'w') as f:
    for user in users:
        f.write(f'<weibo:user/weibo{user["uid"]}> <weibo:email> "{user["uid"]}@weibo.com".\n')
        f.write(f'<weibo:user/weibo{user["uid"]}> <weibo:password> "N/A (IMPORTED)".\n')
        f.write(f'<weibo:user/weibo{user["uid"]}> <weibo:nick> {json.dumps(user["nick"])}.\n')

    for rel in userrelations:
        f.write(f'<weibo:user/weibo{rel["suid"]}> <weibo:follows> <weibo:user/weibo{rel["tuid"]}>.\n')

    for post in posts[-5000:]:
        f.write(f'<weibo:post/imported-{post["mid"]}> <weibo:posted_by> <weibo:user/weibo{post["uid"]}>.\n')
        f.write(f'<weibo:post/imported-{post["mid"]}> <weibo:post_content> {json.dumps(post["text"])}.\n')
        f.write(f'<weibo:post/imported-{post["mid"]}> <weibo:post_time> {int(time.mktime(time.strptime(post["date"], "%Y-%m-%d %H:%M:%S")))}.\n')
