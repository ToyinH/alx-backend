#!/usr/bin/env python3
"""
This is a Flask app with Babel extension configured and user login emulation.
"""

from typing import Optional
from flask import Flask, render_template, request, g
from flask_babel import Babel, _

app = Flask(__name__)
babel = Babel(app)

# Mock user data
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user_locale(user_id: Optional[int]) -> Optional[str]:
    if user_id:
        user = users.get(user_id)
        if user and user['locale']:
            return user['locale']
    return None


@babel.localeselector
def get_locale() -> Optional[str]:
    # Check locale from URL parameters
    if 'locale' in request.args:
        return request.args['locale']

    # Check locale from user settings
    if hasattr(g, 'user') and g.user:
        user_locale = get_user_locale(g.user)
        if user_locale:
            return user_locale

    # Check locale from request header
    if request.headers.get('Accept-Language'):
        return request.accept_languages.best_match(app.config['LANGUAGES'])

    # Default locale
    return app.config['BABEL_DEFAULT_LOCALE']


@app.before_request
def before_request() -> None:
    user_id = request.args.get('login_as')
    if user_id:
        g.user = int(user_id)
    else:
        g.user = None


@app.route('/')
def index() -> str:
    return render_template('6-index.html')


if __name__ == '__main__':
    app.run(debug=True)
