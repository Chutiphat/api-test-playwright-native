import urllib.request
import json

req = urllib.request.Request(
    'https://reqres.in/api/login',
    data=json.dumps({'email': 'eve.holt@reqres.in'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)
try:
    with urllib.request.urlopen(req) as resp:
        print('status', resp.status, resp.reason)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('status', e.code, e.reason)
    print(e.read().decode())
