#!/usr/bin/env python3
"""
This is a Flask app with Babel extension configured and user login emulation.
"""

from typing import Optional
from flask import Flask, render_template, request, g
from flask_babel import Babel, _, timezoneselector
import pytz

app = Flask(__name__)
babel = Babel(app)

# Mock user data
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user_timezone(user_id: Optional[int]) -> Optional[str]:
    if user_id:
        user = users.get(user_id)
        if user and user['timezone']:
            return user['timezone']
    return None


@babel.timezoneselector
def get_timezone() -> Optional[str]:
    # Check timezone from URL parameters
    if 'timezone' in request.args:
        timezone = request.args['timezone']
        try:
            pytz.timezone(timezone)
            return timezone
        except pytz.exceptions.UnknownTimeZoneError:
            pass

    # Check timezone from user settings
    if hasattr(g, 'user') and g.user:
        user_timezone = get_user_timezone(g.user)
        if user_timezone:
            try:
                pytz.timezone(user_timezone)
                return user_timezone
            except pytz.exceptions.UnknownTimeZoneError:
                pass

    # Default to UTC
    return 'UTC'


@app.before_request
def before_request() -> None:
    user_id = request.args.get('login_as')
    if user_id:
        g.user = int(user_id)
    else:
        g.user = None


@app.route('/')
def index() -> str:
    return render_template('7-index.html')


if __name__ == '__main__':
    app.run(debug=True)
