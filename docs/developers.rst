.. _developers:

Developers
==========

Hello, developers! This will get you set up with a local WebPay server.
You can also :ref:`use a hosted <use-hosted>` WebPay server.

Install
~~~~~~~

You need Python 2.7, and MySQL, and a few NodeJS commands
like `stylus`_ for minifying JS/CSS.
Install system requirements with `homebrew`_ (Mac OS X)::

    brew tap homebrew/versions
    brew install python mysql swig nodejs

To develop locally you also need:

* An instance of the `Solitude`_ payment API running.
  If you run it with mock services (such as ``BANGO_MOCK=True``)
  then some things will still work.
  You can configure webpay with ``SOLITUDE_URL`` pointing at your
  localhost.
* Access to the `Zamboni`_ db. For extra points this can be a read only slave.
  You can configure zamboni with ``MARKETPLACE_URL`` pointing at your
  localhost.

Let's install webpay! Clone the source::

    git clone git://github.com/mozilla/webpay.git

Install all Python dependencies. You probably want to do this
within a `virtualenv`_. If you use `virtualenvwrapper`_ (recommended)
set yourself up with::

    mkvirtualenv --python=python2.7 webpay

Install with::

    pip install --no-deps -r requirements/dev.txt

Node dependencies are included in the source tree.
For node to find them add this to your bash profile::

    # Get the bin for any local NodeJS module on cwd.
    PATH="./node_modules/.bin:${PATH}"

Make sure you see a valid path when you type::

    which stylus
    which cleancss
    which uglifyjs

Out of the box, webpay makes some assumptions in the settings file and should
not need a custom settings files. Some environment variables are configurable
from the environment, they are: `ZAMBONI_URL`, `SOLITUDE_URL`. See the
`marketplace docs`_ for information on the environment variables and how
they affect the services.

You can now fire up a development server::

    python manage.py runserver 0.0.0.0:8001

Try it out at http://localhost:8001/mozpay/ .
If you see a form error about a missing JWT then
you are successfully up and running.

If you can't log in with Persona
check the value of ``SITE_URL`` in your local
settings. It must match the
URL bar of how you run your dev server exactly.

See :ref:`this section <use-hosted>` for how to set up a B2G device to
talk to your brand new local development server.

Setting Up the Tests
~~~~~~~~~~~~~~~~~~~~

You will need to install the python testing dependencies for python
or UI testing::

    pip install -r requirements/test.txt

To run UI tests you need `casperjs`_ 1.1 or greater. With `homebrew`_ on
Mac OS X you can install it like this::

    brew install --devel casperjs


Running Tests
~~~~~~~~~~~~~

Webpay has integration tests that make HTTP requests to Django views
or test public functions and classes directly.
You can run the test suite like this::

    python manage.py test

Running UI Tests
~~~~~~~~~~~~~~~~

Webpay has a test suite that sets up a couple mocks then runs tests
against the web UI in a headless browser. From the root of Webpay and
within your Python virualenv, run the tests like this::

    make test-ui

To hack on tests, add a file like ``uitests/tests/*.js``.
All JS files in that directory are run automatically.

Debugging UI Tests
~~~~~~~~~~~~~~~~~~

If something catastrophic goes wrong, check the output of
``tmp/supervisord.log`` and/or ``tmp/webpay.log`` for clues.

In the case of timeout failures, you'll see a message in the console showing you
where to find a screenshot of the browser page when the test timed out. It will
be something like this: ``uitests/captures/timeout-oye23zirsf0qkt9.png``.

For more debugging see the `casperjs`_ docs.

.. _casperjs: http://docs.casperjs.org/en/latest/
.. _homebrew: http://brew.sh/

Building the Docs
~~~~~~~~~~~~~~~~~

To build these very docs that you are reading while developing locally,
do this from your webpay root::

    pip install -r requirements/docs.txt
    make -C docs/ html

Then open ``docs/_build/html/index.html`` in a browser.

Working on the UI
~~~~~~~~~~~~~~~~~

The webpay server has a very minimal UI. It lets you log in and
create/enter/reset a PIN but after that it redirects you to a
payment processor. You can work on the login and PIN by setting this
in your ``webpay/settings/local.py``::

    TEST_PIN_UI = True

Then load the front page: http://localhost:8001/mozpay/

Overriding JS settings from Django settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

JS settings are overridden from  the `webpay.settings.base.JS_SETTINGS` dict.

Here's an example to override a setting `foo` with the value `True`:

.. code-block:: python

    base.JS_SETTINGS['foo'] = True

Using JWTs for development
~~~~~~~~~~~~~~~~~~~~~~~~~~

Each payment begins with a JWT (Json Web Token) so you'll need to
start with a JWT if you want to see the complete payment flow.
The best way to get a valid JWT is to make a real
purchase using your local Marketplace or any app
that has a valid in-app payment key.
When you start a purchase from B2G check your B2G console. In stdout you
should see a link that you can copy and paste into a browser to use better dev
tools. Here is an example of what that looks like::

    http://localhost:8001/mozpay/?req=eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJhdWQiOiAibG9jYWxob3N0IiwgImlzcyI6ICJtYXJrZXRwbGFjZSIsICJyZXF1ZXN0IjogeyJwcmljZSI6IFt7ImN1cnJlbmN5IjogIlVTRCIsICJhbW91bnQiOiAiMC45OSJ9XSwgIm5hbWUiOiAiTXkgYmFuZHMgbGF0ZXN0IGFsYnVtIiwgInByb2R1Y3RkYXRhIjogIm15X3Byb2R1Y3RfaWQ9MTIzNCIsICJkZXNjcmlwdGlvbiI6ICIzMjBrYnBzIE1QMyBkb3dubG9hZCwgRFJNIGZyZWUhIn0sICJleHAiOiAxMzUwOTQ3MjE3LCAiaWF0IjogMTM1MDk0MzYxNywgInR5cCI6ICJtb3ppbGxhL3BheW1lbnRzL3BheS92MSJ9.ZW-Y9-UroJk7-ZpDjebUU-uYOx4h7TfztO7JBi2d5z4

Displaying statsd results
~~~~~~~~~~~~~~~~~~~~~~~~~

You can configure your ``webpay/settings/local.py`` settings to
visualize the summary table generated by django-statsd counting the
number of keys logged and the time spent in views::

    NOSE_PLUGINS = [
       'nosenicedots.NiceDots',
       'django_statsd.NoseStatsd',
    ]
    NOSE_ARGS = [
       '--logging-clear-handlers',
       '--with-statsd',
    ]
    STATSD_CLIENT = 'django_statsd.clients.nose'

.. _WebPaymentProvider: https://wiki.mozilla.org/WebAPI/WebPaymentProvider
.. _virtualenv: http://pypi.python.org/pypi/virtualenv
.. _`nightly desktop B2G build`: http://ftp.mozilla.org/pub/mozilla.org/b2g/nightly/latest-mozilla-b2g18/
.. _`Gaia Hacking`: https://wiki.mozilla.org/Gaia/Hacking
.. _virtualenvwrapper: http://pypi.python.org/pypi/virtualenvwrapper
.. _less: http://lesscss.org/
.. _npm: https://npmjs.org/
.. _`nightly B2G desktop`: http://ftp.mozilla.org/pub/mozilla.org/b2g/nightly/latest-mozilla-central/
.. _`stylus`: http://learnboost.github.io/stylus/
.. _`Solitude`: https://solitude.readthedocs.org/en/latest/index.html
.. _`Android Developer Tools`: http://developer.android.com/sdk/index.html
.. _git: http://git-scm.com/
.. _`navigator.mozPay()`: https://wiki.mozilla.org/WebAPI/WebPayment
.. _`Zamboni`: https://github.com/mozilla/zamboni
.. _`marketplace docs`: http://marketplace.readthedocs.org/en/latest/topics/setup.html
