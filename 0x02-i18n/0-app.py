#!/usr/bin/env python3
"""
This is a basic Flask app with a single route.
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index() -> str:
    """
    Render the index.html template.
    """
    return render_template('0-index.html')


if __name__ == '__main__':
    app.run(debug=True)
