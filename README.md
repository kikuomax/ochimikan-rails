**OchiMikanRails** is a Ruby on Rails application which serves OchiMikan.

Prerequisites
-------------

You need to install [Ruby](https://www.ruby-lang.org) and [Ruby on Rails](http://rubyonrails.org) 4.1.
[This guide](http://guides.railsgirls.com/install/) is helpful for Ruby and Rails installation.

Running OchiMikanRails
----------------------

 1. Clone the repository.

		git clone https://github.com/kikuomax/ochimikan-rails.git
		cd ochimikan-rails

 2. Resolve dependencies.

		bundle install

 3. Run rails.

		rails server

Now the server should be waiting for connections on the port 3000 of your machine.

secrets.yml
-----------

Although `config/secrets.yml` is remained in the repository so that the application can run out of the box, you should use different keys for your application.

License
-------

[MIT License](http://opensource.org/licenses/MIT)
