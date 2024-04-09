#!/usr/bin/env python3
"""
This is a Flask app with Babel extension configured and user login emulation.
"""

from typing import Dict, Union
from flask import Flask, render_template, g, request
from flask_babel import Babel, _

app = Flask(__name__)
babel = Babel(app)


# Mock user data
users: Dict[int, Dict[str, Union[str, None]]] = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user(user_id: int) -> Dict[str, Union[str, None]]:
    # Check if the user_id exists in users dictionary
    return users.get(user_id)


@app.before_request
def before_request() -> None:
    # Check if login_as parameter is provided in the request
    user_id = request.args.get('login_as')
    if user_id:
        g.user = get_user(int(user_id))
    else:
        g.user = None


@app.route('/')
def index() -> str:
    return render_template('5-index.html')


if __name__ == '__main__':
    app.run(debug=True)
