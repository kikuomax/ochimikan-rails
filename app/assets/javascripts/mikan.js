/**
 * Returns the version of OchiMikan.
 *
 * @method getOchiMikanVersion
 * @static
 * @return {string}
 *     The version of this OchiMikan.
 */
function getOchiMikanVersion() {
	return '0.0.2';
}
/**
 * Provides variants of binary search.
 *
 * @class Search
 * @static
 */
Search = (function () {
	function Search() { }

	/**
	 * Searches for the lower bound of a specified object in a specified array.
	 *
	 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
	 * and retruns
	 *  - negative number if `lhs < rhs`
	 *  - 0 if `lhs == rhs`
	 *  - positive number if `lhs > rhs`
	 *
	 * A returning index `i` is an index such that
	 *
	 *     array[i - 1] < target <= array[i]
	 *
	 * But
	 *
	 *     i = 0            if target <= array[0]
	 *     i = array.length if target >  array[array.length - 1]
	 *
	 * NOTE: undefined if `array` isn't sorted in ascending order defined by
	 *       `comparator`.
	 *
	 * @method lowerBound
	 * @param array {array}
	 *     The array in which the lower bound of `target` is to be searched.
	 * @param target {object}
	 *     The object whose lower bound in `array` is to be searched.
	 * @param comparator {function}
	 *     The function which compares an element in `array` and `target`
	 *     for order.
	 * @return {number}
	 *     The lower bound of `target` in `array`.
	 */
	Search.lowerBound = function (array, target, comparator) {
		var lower = 0;
		var upper = array.length;
		while (lower < upper) {
			var center = Math.floor((lower + upper) / 2);
			if (comparator(array[center], target) < 0) {
				// target is in a upper half
				lower = center + 1;
			} else {
				// target is in a lower half
				upper = center;
			}
		}
		return lower;
	};

	/**
	 * Searches for the upper bound of a specified object in a specified array.
	 *
	 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
	 * and returns
	 *  - negative number if `lhs < rhs`
	 *  - 0 if `lhs == rhs`
	 *  - positive number if `lhs > rhs`
	 *
	 * A returning index `i` satisfies
	 *
	 *     array[i - 1] <= target < array[i]
	 *
	 * But
	 *
	 *     i = 0            if target <  array[0]
	 *     i = array.length if target >= array[array.length - 1]
	 *
	 * NOTE: undefined if `array` isn't sorted in ascending order defined
	 *       by `comparator`.
	 *
	 * @method upperBound
	 * @param array {array}
	 *     The array in which the upper bound of `target` is to be searched.
	 * @param target {object}
	 *     The object whose upper bound in `array` is to be searched.
	 * @param comparator {function}
	 *     A function which compares an element in `array` and `target`
	 *     for order.
	 * @return {number}
	 *     The index of the upper bound of `target` in `array`.
	 */
	Search.upperBound = function (array, target, comparator) {
		var lower = 0;
		var upper = array.length;
		while (lower < upper) {
			var center = Math.floor((lower + upper) / 2);
			if (comparator(target, array[center]) < 0) {
				// target is in the lower half
				upper = center;
			} else {
				// target is in the upper half
				lower = center + 1;
			}
		}
		return upper;
	};

	/**
	 * Compares specified two values for order.
	 *
	 * Just applies `<` operator for comparison.
	 *
	 * @method compare
	 * @param lhs {any}
	 *     The left hand side of comparison.
	 * @param rhs {any}
	 *     The right hand side of comparison.
	 * @return {number}
	 *     Negative number if lhs <  rhs.
	 *     0               if lhs == rhs.
	 *     Positive number if lhs >  rhs.
	 */
	Search.compare = function (lhs, rhs) {
		if (lhs < rhs) {
			return -1;
		} else if (rhs < lhs) {
			return 1;
		} else {
			return 0;
		}
	};

	return Search;
})();

/**
 * Provides utilities to manipulate properties.
 *
 * @class Properties
 * @static
 */
Properties = (function () {
	function Properties() {}

	/**
	 * Overrides a specified function of a specified object.
	 *
	 * The function specified by `name` of `obj` will be replaced with `impl`.
	 * You can still invoke the overridden function through `impl._super` like,
	 *
	 *     impl._super(arguments ...)
	 *     i.e.
	 *     obj[name]._super(arguments ...)
	 *
	 * NOTE: `_super` always invokes the overridden function in the context
	 *       of `obj`.
	 *
	 * Throws an exception
	 *  - if `obj` is not specified
	 *  - or if `name` is not specified
	 *  - or if `impl` is not a function
	 *  - or if the property of `obj` specified by `name` is not a function
	 * 
	 * @method override
	 * @param obj {object}
	 *     The object whose function is to be overridden.
	 * @param name {string}
	 *     The name of the function to be overridden.
	 * @param impl {function}
	 *     The new implementation of the function.
	 * @return {object}
	 *     `impl`.
	 */
	Properties.override = function (obj, name, impl) {
		if (name == null) {
			throw 'name must be specified';
		}
		if (typeof impl !== 'function') {
			throw 'impl must be a function';
		}
		if (typeof obj[name] !== 'function') {
			throw 'obj must have a function specified by ' + name;
		}
		var superFunction = obj[name];
		obj[name] = impl;
		impl._super = function () {
			return superFunction.apply(obj, arguments);
		};
		return impl;
	};

	return Properties;
})();

/**
 * The interface of an observable object.
 *
 * @class Observable
 * @constructor
 */
Observable = (function () {
	function Observable() {
		var self = this;

		/**
		 * The list of observer functions.
		 *
		 * @property observers
		 * @type {Array}
		 */
		self.observers = [];
	}

	/**
	 * Returns whether a specified object is an `Observable`.
	 *
	 * An `Observable` must have all of the following properties,
	 *  - addObserver:     function
	 *  - removeObserver:  function
	 *  - notifyObservers: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `Observable`. `false` if `obj` is not specified.
	 */
	Observable.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.addObserver     === 'function'
			&& typeof obj.removeObserver  === 'function'
			&& typeof obj.notifyObservers === 'function';
	};

	/**
	 * Returns whether a specified object can be an `Observable`.
	 *
	 * An object which have the following property can be an `Observable`,
	 *  - observers: Array
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be an `Observable`.
	 *     `false` if `obj`is not specified.
	 */
	Observable.canAugment = function (obj) {
		return obj != null && Array.isArray(obj.observers);
	};

	/**
	 * Augments a specified object with the features of `Observable`.
	 *
	 * The following properties of `obj` will be overwritten,
	 *  - addObserver
	 *  - removeObserver
	 *  - notifyObservers
	 *
	 * Never checks if `obj` can actually be an `Observable` because this method
	 * may be applied to incomplete instances; i.e., prototypes.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Observable.augment = function (obj) {
		for (prop in Observable.prototype) {
			obj[prop] = Observable.prototype[prop];
		}
		return obj;
	};

	/**
	 * Adds a specified observer to this `Observable`.
	 *
	 * Throws an exception if `observer` is not a function.
	 *
	 * Default implementation pushes `observer` to `this.observers`.
	 *
	 * @method addObserver
	 * @param observer {function}
	 *     The observer to observe this `Observable`.
	 */
	Observable.prototype.addObserver = function (observer) {
		if (typeof observer !== 'function') {
			throw 'observer must be a function';
		}
		this.observers.push(observer);
	};

	/**
	 * Removes a specified observer from this `Observable`.
	 *
	 * Has no effect if `observer` is not observing this `Observable`.
	 *
	 * Default implementation removes `observer` from `this.observers`.
	 *
	 * @method removeObserver
	 * @param observer {function}
	 *     The observer to be removed from this `Observable`.
	 */
	Observable.prototype.removeObserver = function (observer) {
		var idx = this.observers.indexOf(observer);
		if (idx != -1) {
			this.observers.splice(idx, 1);
		}
	};

	/**
	 * Notifies observers observing this `Observable`.
	 *
	 * Arguments specified to this function will be forwarded to the observers.
	 * Observers will be invoked in the global context.
	 *
	 * Default implementation notifies observers in `this.observers`.
	 *
	 * @method notifyObservers
	 */
	Observable.prototype.notifyObservers = function () {
		var args = arguments;
		this.observers.forEach(function (observer) {
			observer.apply(null, args);
		})
	};

	return Observable;
})();

/**
 * A resource manager.
 *
 * Behavior of an instance created by this constructor is different from
 * the prototype.
 *
 * ### loadImage
 *
 * An instance created by this constructor caches loaded images.
 *
 * @class ResourceManager
 * @constructor
 */
ResourceManager = (function () {
	function ResourceManager() {
		var self = this;

		// default implementation
		var imageCache = {};
		self.loadImage = function (url) {
			if (url == null) {
				throw 'url must be specified';
			}
			var image = imageCache[url];
			if (!image) {
				image = new Image();
				image.src = url;
				imageCache[url] = image;
			}
			return image;
		};
	};

	/**
	 * Returns if a specified object is a `ResourceManager`.
	 *
	 * A `ResourceManager` must have all of the following property,
	 *  - loadImage: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `ResourceManager`.
	 *     `false` if `obj` is not specified.
	 */
	ResourceManager.isClassOf = function (obj) {
		return obj != null && typeof obj.loadImage === 'function';
	};

	/**
	 * Returns if a specified object can be a `ResourceManager`.
	 *
	 * Any object can be a `ResourceManager`.
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     `true` unless `obj` is unspecified.
	 */
	ResourceManager.canAugment = function (obj) {
		return obj != null;
	};

	/**
	 * Augments a specified object with features of `ResourceManager`.
	 *
	 * The following property of `obj` will be overwritten,
	 *  - loadImage
	 *
	 * Never checks if `obj` actually can be a `ResourceManager`, because this
	 * method may be applied to incomplete instances; i.e. prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	ResourceManager.augment = function (obj) {
		for (prop in ResourceManager.prototype) {
			obj[prop] = ResourceManager.prototype[prop];
		}
		return obj;
	};

	/**
	 * Loads an `Image` associated with a specified URL.
	 *
	 * This method may cache a loaded image and returns it everytime
	 * the same URL is requested.
	 *
	 * `url` may be redirected by some `ResourceManager`.
	 *
	 * Throws an exception if `url` is not specified.
	 *
	 * NOTE: prototype does nothing and returns `undefined`.
	 *
	 * @method loadImage
	 * @param url {string}
	 *     The URL to be loaded.
	 * @return {Image}
	 *     An `Image` object associated with `url`.
	 */
	ResourceManager.prototype.loadImage = function (url) {};

	return ResourceManager;
})();

/**
 * A sprite which renders a specified part of an image.
 *
 * Contents associated with `url` will not be loaded until `load` is invoked.
 *
 * Throws an exception
 *  - if `url` is not a string
 *  - or if `x` is not a number
 *  - or if `y` is not a number
 *  - or if `width` is not a number
 *  - or if `height` is not a number
 *  - or if `width < 0`
 *  - or if `height` < 0
 *
 * @class Sprite
 * @constructor 
 * @param url {string}
 *     The URL of the image data. The image may contain multiple sprites in it.
 * @param x {number}
 *     The x-coordinate value of the top-left corner of the part to be rendered
 *     as the sprite.
 * @param y {number}
 *     The y-coordinate value of the top-left corner of the part to be rendered
 *     as the sprite.
 * @param width {number}
 *     The width of the sprite.
 * @param height {number}
 *     The height of the sprite.
 */
Sprite = (function () {
	function Sprite(url, x, y, width, height) {
		var self = this;

		if (typeof url !== 'string') {
			throw 'url must be a string';
		}
		if (typeof x !== 'number') {
			throw 'x must be a number';
		}
		if (typeof y !== 'number') {
			throw 'y must be a number';
		}
		if (typeof width !== 'number') {
			throw 'width must be a number';
		}
		if (typeof height !== 'number') {
			throw 'height must be a number';
		}
		if (width < 0) {
			throw 'width must be >= 0 but ' + width;
		}
		if (height < 0) {
			throw 'height must be >= 0 but ' + height;
		}

		self.url = url;
		self.x = x;
		self.y = y;
		self.width = width;
		self.height = height;

		/**
		 * Loads the sprite specified by this definition.
		 *
		 * Adds a property `image:Image` associated with the URL of
		 * this `Sprite`.
		 *
		 * No effect if this sprite has already been loaded.
		 *
		 * Throws an exception if `resourceManager` is not a `ResourceManager`.
		 *
		 * @method load
		 * @param resourceManager {ResourceManager}
		 *     The `ResourceManager` which resolves a URL.
		 */
		self.load = function (resourceManager) {
			if (!ResourceManager.isClassOf(resourceManager)) {
				throw 'resourceManager must be specified';
			}
			if (!self.image) {
				self.image = resourceManager.loadImage(self.url);
			}
		};

		/**
		 * Renders this sprite at the specified location.
		 *
		 * Does nothing if this sprite isn't yet loaded.
		 *
		 * @method render
		 * @param context {Context}
		 *     The Context in which rendering is to be performed.
		 * @param x {int}
		 *     The x-coordinate value of the top-left corner of the destination.
		 * @param y {int}
		 *     The y-coordinate value of the top-left corner of the destination.
		 */
		self.render = function (context, x, y) {
			if (self.image !== undefined) {
				context.drawImage(self.image,
								  self.x,
								  self.y,
								  self.width,
								  self.height,
								  x,
								  y,
								  self.width,
								  self.height);
			}
		};
	}

	return Sprite;
})();

/**
 * Provides resources used in the game.
 *
 * @class Resources
 * @static
 */
Resources = (function () {
	function Resources() { }

	/**
	 * A collection of sprites.
	 *
	 * Each subproperty in this property is an array of sprites.
	 *  - mikan: an array of mikan sprites.
	 *    each index corresponds to a degree of damage.
	 *  - spray: an array of spray sprites.
	 *    each index corresponds to a frame index.
	 *
	 * @property SPRITES
	 * @type {object}
	 */
	Resources.SPRITES = {
		mikan: [
			new Sprite('imgs/mikan.png',  0, 0, 32, 32),
			new Sprite('imgs/mikan.png', 32, 0, 32, 32),
			new Sprite('imgs/mikan.png', 64, 0, 32, 32),
			new Sprite('imgs/mikan.png', 96, 0, 32, 32)
		],
		spray: [
			new Sprite('imgs/spray.png',  0, 0, 32, 32),
			new Sprite('imgs/spray.png', 32, 0, 32, 32),
			new Sprite('imgs/spray.png', 64, 0, 32, 32),
			new Sprite('imgs/spray.png', 96, 0, 32, 32)
		],
		preservative: [
			new Sprite('imgs/preservative.png',   0, 0, 32, 32),
			new Sprite('imgs/preservative.png',  32, 0, 32, 32),
			new Sprite('imgs/preservative.png',  64, 0, 32, 32),
			new Sprite('imgs/preservative.png',  96, 0, 32, 32),
			new Sprite('imgs/preservative.png', 128, 0, 32, 32)
		]
	};

	/**
	 * Loads sprites.
	 *
	 * Loads every sprite in `Resources.SPRITES`.
	 *
	 * Throws an exception if `resourceManager` is not a `ResourceManager`.
	 *
	 * @method loadSprites
	 * @param resourceManager {ResourceManager}
	 *     The `ResourceManager` which resolve resources.
	 */
	Resources.loadSprites = function (resourceManager) {
		if (!ResourceManager.isClassOf(resourceManager)) {
			throw 'resourceManager must be a ResourceManager';
		}
		for (prop in Resources.SPRITES) {
			Resources.SPRITES[prop].forEach(function (sprite) {
				sprite.load(resourceManager);
			});
		}
	};

	return Resources;
})();

/**
 * The interface of an interpreter of user inputs.
 *
 * @class GamePad
 * @constructor
 */
GamePad = (function () {
	function GamePad() {
		var self = this;

		/**
		 * The list of `DirectionListener`s.
		 *
		 * DO NOT directly manipulate this property.
		 * Use `addDirectionListener` or `removeDirectionListener` instead.
		 *
		 * @property directionListeners
		 * @type {Array}
		 * @private
		 */
		var directionListeners = [];

		/**
		 * Adds a specified `DirectionListener` to this `GamePad`.
		 *
		 * Throws an exception if `listener` is not a `DirectionListener`.
		 *
		 * @method addDirectionListener
		 * @param listener {DirectionListener}
		 *     The listener to listen to directional input.
		 */
		self.addDirectionListener = function (listener) {
			if (!DirectionListener.isClassOf(listener)) {
				throw 'listener must be a DirectionListener';
			}
			directionListeners.push(listener);
		};

		/**
		 * Removes a specified `DirectionListener` from this `GamePad`.
		 *
		 * No effect if `listener` is not listening to this `GamePad`.
		 *
		 * @method removeDirectionListener
		 * @param listener {DirectionListener}
		 *     The listener to be removed from this `GamePad`.
		 */
		self.removeDirectionListener = function (listener) {
			var idx = directionListeners.indexOf(listener);
			if (idx != -1) {
				directionListeners.splice(idx, 1);
			}
		};

		/**
		 * Sends a specified direction to `DirectionListener`s listening to
		 * this `GamePad`.
		 *
		 * Throws an exception if `direction` does not match any of
		 * the `DirectionListener` methods.
		 *
		 * @method sendDirection
		 * @protected
		 * @param direction {string}
		 *     The direction to be sent to `DirectionListener`s.
		 *     The name of a direction method.
		 */
		self.sendDirection = function (direction) {
			directionListeners.forEach(function (listener) {
				listener[direction](self);
			});
		};
	}

	/**
	 * Returns whehter a specified object is a `GamePad`.
	 *
	 * A `GamePad` must have all of the following properties,
	 *  - addDirectionListener:    function
	 *  - removeDirectionListener: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `GamePad`. `false` if `obj` is not specified.
	 */
	GamePad.isClassOf = function (obj) {
		return typeof obj.addDirectionListener    === 'function'
			&& typeof obj.removeDirectionListener === 'function';
	};

	return GamePad;
})();

/**
 * An interface to listen to directional input from a `GamePad`.
 *
 * @class DirectionListener
 * @constructor
 */
DirectionListener = (function () {
	function DirectionListener() {}

	/**
	 * Returns whether a specified object is a `DirectionListener`.
	 *
	 * A `DirectionListener` must have all of the following properties,
	 *  - moveLeft:               function
	 *  - moveRight:              function
	 *  - rotateClockwise:        function
	 *  - rotateCounterClockwise: function
	 *  - releaseControl:         function
	 *
	 * @method isClassOf
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `DirectionListener`.
	 *     `false` if `obj` is not specified.
	 */
	DirectionListener.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.moveLeft               === 'function'
			&& typeof obj.moveRight              === 'function'
			&& typeof obj.rotateClockwise        === 'function'
			&& typeof obj.rotateCounterClockwise === 'function'
			&& typeof obj.releaseControl         === 'function';
	};

	/**
	 * Handles a move left direction from a `GamePad`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method moveLeft
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing move.
	 */
	DirectionListener.prototype.moveLeft = function (pad) {};

	/**
	 * Handles a move right direction from a `GamePad`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method moveRight
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing move.
	 */
	DirectionListener.prototype.moveRight = function (pad) {};

	/**
	 * Handles a rotate clockwise direction from a `GamePad`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method rotateClockwise
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing rotation.
	 */
	DirectionListener.prototype.rotateClockwise = function (pad) {};

	/**
	 * Handles a rotate counter-clockwise direction from a `GamePad`.
	 *
	 * @method rotateCounterClockwise
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing rotation.
	 */
	DirectionListener.prototype.rotateCounterClockwise = function (pad) {};

	/**
	 * Handles a release control direction from a `GamePad`.
	 *
	 * @method releaseControl
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing releasing.
	 */
	DirectionListener.prototype.releaseControl = function (pad) {};

	return DirectionListener;
})();

/**
 * An actor.
 *
 * Throws an exception
 *  - if `priority` is not a number
 *  - or if `act` is not a function
 *
 * @class Actor
 * @constructor
 * @param priority {number}
 *     The priority of the actor.
 *     The lower this number is, the higher priority is.
 * @param act {function}
 *     The action of the actor.
 *     Takes an `ActorScheduler`.
 */
Actor = (function () {
	function Actor(priority, act) {
		var self = this;

		// verifies arguments
		if (typeof priority !== 'number') {
			throw "priority must be specified"
		}
		if (typeof act !== "function") {
			throw "act must be a function";
		}

		/**
		 * The priority of this actor.
		 *
		 * The lower this number is, the higher priority is.
		 *
		 * @property priority
		 * @type {number}
		 */
		self.priority = priority;

		/**
		 * Performs the action of this actor.
		 *
		 * `scheduler.schedule` may be invoked in this method.
		 *
		 * @method act
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` which is running this actor.
		 */
		self.act = act;
	}

	/**
	 * Returns whether a specified object is an `Actor`.
	 *
	 * An `Actor` must have the following properties,
	 *  - priority: number
	 *  - act:      function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `Actor`. `false` if `obj` is not specified.
	 */
	Actor.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.priority === 'number'
			&& typeof obj.act      === 'function';
	};

	/**
	 * Returns whether a specified object can be an `Actor`.
	 *
	 * An object which has the following properties can be an `Actor`.
	 *  - priority: number
	 *  - act: function
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be an `Actor`. `false` is `obj` is not specified.
	 */
	Actor.canAugment = function (obj) {
		return obj != null
			&& typeof obj.priority === 'number'
			&& typeof obj.act      === 'function';
	};

	/**
	 * Augments a specified object with features of `Actor`.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * Never checks if `obj` can actually be an `Actor` because this method
	 * may be applied to incomplete objects; i.e., prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Actor.augment = function (obj) {
		if (obj == null) {
			throw 'obj must be specified';
		}
		return obj;
	};

	/**
	 * A comparator which compares priorities of specified two `Actor`s
	 * for order.
	 *
	 * @method comparePriorities
	 * @static
	 * @param lhs {Actor}
	 *     The left hand side of comparison.
	 * @param rhs {Actor}
	 *     The right hand side of comparison.
	 * @return {number}
	 *     Negative number if `lhs.priority` <  `rhs.priority`
	 *     0               if `lhs.priority` == `rhs.priority`
	 *     Positive number if `lhs.priority` >  `rhs.priority`
	 */
	Actor.comparePriorities = function (lhs, rhs) {
		return Search.compare(lhs.priority, rhs.priority);
	};

	return Actor;
})();

/**
 * An actor scheduler.
 *
 * ## Scenarios
 *
 * ### Scheduling an `Actor`
 *
 * 1. An `Actor` is given.
 * 2. An `ActorScheduler` is given.
 * 3. A user asks the `ActorScheduler` to `schedule` the `Actor`.
 *
 * ### Running `Actor`s
 *
 * 1. An `ActorScheduler` with scheduled `Actor`s is given.
 * 2. A user asks the `ActorScheduler` to `run` `Actor`s scheduled in it.
 * 3. The `ActorScheduler` selects `Actor`s to run and asks them to `act`.
 *
 * ### Self-reproducing `Actor`
 *
 * 1. An `ActorScheduler` is given.
 * 2. An `Actor` scheduled in the `ActorScheduler` is given.
 * 3. The `ActorScheduler` asks the `Actor` to act.
 * 4. The `Actor` acts and asks the `ActorScheduler` to `schedule` itself again.
 *
 * @class ActorScheduler
 * @constructor
 */
ActorScheduler = (function () {
	function ActorScheduler() {
		var self = this;

		/**
		 * The queue of the scheduled actors.
		 *
		 * Do not directly manipulate this property.
		 * Use `schedule` or `run` instead.
		 *
		 * @property actorQueue
		 * @type Array{Actor}
		 * @protected
		 */
		self.actorQueue = [];
	}

	/**
	 * Returns whether a specified object is an `ActorScheduler`.
	 *
	 * An `ActorScheduler` must have the following properties.
	 * - schedule: function
	 * - run: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `ActorScheduler`.
	 *     `false` if `obj` is not specified.
	 */
	ActorScheduler.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.schedule === 'function'
			&& typeof obj.run === 'function';
	};

	/**
	 * Returns whether a specified object can be an `ActorScheduler`.
	 *
	 * An object which has the following property can be an `ActorScheduler`.
	 * - actorQueue: Array
	 *
	 * @method canAugment
	 * @static
	 * @param obj {ojbect}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be an `ActorScheduler`.
	 *     `false` if `obj` is not specified.
	 */
	ActorScheduler.canAugment = function (obj) {
		return obj != null && Array.isArray(obj.actorQueue);
	};

	/**
	 * Augments a specified object with features of the `ActorScheduler`.
	 *
	 * The following properties of `obj` will be overwritten.
	 * - schedule
	 * - run
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * Never checks if `obj` actually can be an `ActorScheduler` because this
	 * method may be applied to incomplete objects; i.e., prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	ActorScheduler.augment = function (obj) {
		for (prop in ActorScheduler.prototype) {
			obj[prop] = ActorScheduler.prototype[prop];
		}
		return obj;
	};

	/**
	 * Schedules a specified `Actor`.
	 *
	 * Throws an exception if `actor` is not an `Actor`.
	 *
	 * @method schedule
	 * @param actor {Actor}
	 *     The actor to be scheduled.
	 */
	ActorScheduler.prototype.schedule = function (actor) {
		if (!Actor.isClassOf(actor)) {
			throw 'actor must be an Actor';
		}
		this.actorQueue.push(actor);
	};

	/**
	 * Runs scheduled `Actor`s.
	 *
	 * Runs `Actor`s which satisfy one of the following conditions,
	 * - has negative priority
	 * - has the highest priority (>=0) among the scheduled `Actor`s
	 *
	 * Executed `Actor`s will be deleted from the queue of this
	 * `ActorScheduler`.
	 *
	 * @method run
	 */
	ActorScheduler.prototype.run = function () {
		var self = this;
		// checks if any actor is scheduled
		if (self.actorQueue.length > 0) {
			// spares the actor queue
			var actorQueue = self.actorQueue;
			self.actorQueue = [];
			// sorts actors by priorities (a higher priority comes earlier)
			actorQueue.sort(Actor.comparePriorities);
			// runs actors which have negative priorities
			// lower bound of priority=0
			// => upper bound of negative priorities
			var upper = Search.lowerBound(actorQueue,
										  { priority: 0 },
										  Actor.comparePriorities);
			// and runs actors which have the highest priority (>= 0)
			if (upper < actorQueue.length) {
				upper = Search.upperBound(actorQueue,
										  actorQueue[upper],
										  Actor.comparePriorities);
			}
			actorQueue.slice(0, upper).forEach(function (a) {
				a.act(self);
			});
			// reschedules actors which have lower priorities
			self.actorQueue = self.actorQueue.concat(actorQueue.slice(upper));
		}
	};

	return ActorScheduler;
})();

/**
 * The interface of a renderable object.
 *
 * Throws an exception if `render` isn't a function.
 *
 * @class Renderable
 * @constructor
 * @param render {function}
 *     The rendering function which performs rendering in a specified context.
 *     Takes a canvas context.
 */
Renderable = (function () {
	function Renderable(render) {
		var self = this;

		// makes sure that render is a function
		if (typeof render !== 'function') {
			throw 'render must be a function';
		}

		/**
		 * Renders this `Renderable`.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which the rendering is to be performed.
		 */
		self.render = render;
	}

	/**
	 * Returns whether a specified object is a `Renderable`.
	 *
	 * A `Renderable` must have the following property.
	 *  - render: function 
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Renderable`. `false` if `obj` is not specified.
	 */
	Renderable.isClassOf = function (obj) {
		return obj != null && typeof obj.render === 'function';
	};

	/**
	 * Returns whether a specified object can be a `Renderable`.
	 *
	 * An object which has the following property can be a `Renderable`.
	 *  - render: function
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `Renderable`.
	 *     `false` if `obj` is not specified.
	 */
	Renderable.canAugment = function (obj) {
		return obj != null && typeof obj.render === 'function';
	};

	/**
	 * Augments a specified object with features of the `Renderable`.
	 *
	 * Never checks if `obj` can actually be a `Renderable` because this method
	 * may be applied to incomplete objects; i.e., prototypes.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Renderable.augment = function (obj) {
		if (obj == null) {
			throw 'obj must be specified';
		}
		return obj;
	};

	return Renderable;
})();

/**
 * A located object which has a location (`x`, `y`).
 *
 * Throws an exception
 *  - if `x` is not a number
 *  - or if `y` is not a number
 *
 * @class Located
 * @constructor
 * @param x {number}
 *     The x-coordinate value of the initial location.
 * @param y {number}
 *     The y-coordinate value of the initial location.
 */
Located = (function () {
	function Located(x, y) {
		var self = this;

		// verifies arguments
		if (typeof x !== 'number') {
			throw 'x must be a number';
		}
		if (typeof y !== 'number') {
			throw 'y must be a number';
		}

		/**
		 * The x-coordinate value of the location.
		 *
		 * Do not set this property to a non-number.
		 *
		 * @property x
		 * @type {number}
		 */
		self.x = x;

		/**
		 * The y-coordinate value of the location.
		 *
		 * Do not set this property to a non-number.
		 *
		 * @property y
		 * @type {number}
		 */
		self.y = y;
	}

	/**
	 * Returns whether a specified object is a `Located`.
	 *
	 * A `Located` must have the following properties.
	 *  - x:         number
	 *  - y:         number
	 *  - locate:    function
	 *  - translate: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Located`. `false` if `obj` is not specified.
	 */
	Located.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.x         === 'number'
			&& typeof obj.y         === 'number'
			&& typeof obj.locate    === 'function'
			&& typeof obj.translate === 'function';
	};

	/**
	 * Returns whether a specified object can be a `Located`.
	 *
	 * An object which has all of the following properties can be a `Located`.
	 *  - x: number
	 *  - y: number
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {Boolean}
	 *     Whether `obj` can be a `Located`. `false` if `obj` is not specified.
	 */
	Located.canAugment = function (obj) {
		return obj != null
			&& typeof obj.x === 'number'
			&& typeof obj.y === 'number';
	};

	/**
	 * Augments a specified object with features of the `Located`.
	 *
	 * The following property of `obj` will be overwritten.
	 *  - locate
	 *  - translate
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * Never checks if `obj` actually can be a `Located` because this method
	 * may be applied to incomplete objects; i.e., prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Located.augment = function (obj) {
		for (prop in Located.prototype) {
			obj[prop] = Located.prototype[prop];
		}
		return obj;
	};

	/**
	 * Locates at another location.
	 *
	 * NOTE: never checks if `x` and `y` is a number because location will
	 *       frequently be updated.
	 *
	 * @method locate
	 * @param x {number}
	 *     The x-coordinate value of the new location.
	 * @param y {number}
	 *     The y-coordinate value of the new location.
	 * @chainable
	 */
	Located.prototype.locate = function (x, y) {
		this.x = x;
		this.y = y;
		return this;
	};

	/**
	 * Translates this location.
	 *
	 * @method translate
	 * @param dX {number}
	 *     The movement along the x-axis.
	 * @param dY {number}
	 *     The movement along the y-axis.
	 * @chainable
	 */
	Located.prototype.translate = function (dX, dY) {
		this.x += dX;
		this.y += dY;
		return this;
	};

	return Located;
})();

/**
 * The interface of an item placed in a `MikanBox`.
 *
 * `damage` will be truncated so that `0 <= damage <= this.maxDamage`.
 *
 * Throws an exception,
 *  - if `typeId` is not a number
 *  - or if `x` is not a number
 *  - or if `y` is not a number
 *  - or if `damage` is not a number
 *
 * @class Item
 * @constructor
 * @extends Located
 * @param typeId {number}
 *     The type ID to set.
 * @param x {number}
 *     The x-coordinate value of the location.
 * @param y {number}
 *     The y-coordinate value of the location.
 * @param damage {number}
 *     The damage to set.
 */
Item = (function () {
	function Item(typeId, x, y, damage) {
		var self = this;

		Located.call(self, x, y);

		if (typeof typeId !== 'number') {
			throw 'typeId must be a number';
		}
		damage = truncateDamage(damage);

		/**
		 * The type ID of this `Item`.
		 *
		 * @property typeId
		 * @type {number}
		 */
		Object.defineProperty(self, 'typeId', { value: typeId });

		/**
		 * The damage of this `Item`.
		 *
		 * To increment the damage, use `spoil`.
		 *
		 * `damage` will be truncated so that `0 <= damage <= this.maxDamage`.
		 *
		 * Throws an exception,
		 *  - if `damage` is to be set unspecified
		 *  - or if `damage` is to be set to a non-number
		 *
		 * @property damage
		 * @type {number}
		 */
		Object.defineProperty(self, 'damage', {
			get: function () { return damage },
			set: function (newDamage) { damage = truncateDamage(newDamage) }
		});

		/**
		 * Truncates a specified damage.
		 *
		 * Throws an exception
		 *  - if `damage` is not specified,
		 *  - or if `damage` is not a number
		 *
		 * @method truncateDamage
		 * @private
		 * @param damage {number}
		 *     The damage to be truncated.
		 * @return {number}
		 *     A truncated damage. `[0, self.maxDamage]`.
		 */
		function truncateDamage(damage) {
			if (typeof damage != 'number') {
				throw 'damage must be a number';
			}
			if (damage < 0) {
				damage = 0;
			} else if (damage > self.maxDamage) {
				damage = self.maxDamage;
			}
			return damage;
		}
	}
	Located.augment(Item.prototype);

	/**
	 * Returns whether a specified object is an `Item`.
	 *
	 * A `Item` must satisfy all of the following conditions,
	 *  - is a `Located`
	 *  - has the following property,
	 *     - typeId:    number
	 *     - damage:    number
	 *     - maxDamage: number
	 *     - spoil:     function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `Item`. `false` if `obj` is not specified.
	 */
	Item.isClassOf = function (obj) {
		return Located.isClassOf(obj)
			&& typeof obj.typeId    === 'number'
			&& typeof obj.damage    === 'number'
			&& typeof obj.maxDamage === 'number'
			&& typeof obj.spoil     === 'function';
	};

	/**
	 * Returns a specified object can be an `Item`.
	 *
	 * An object which satisfies all of the following conditions can be
	 * an `Item`,
	 *  - can be a `Located`
	 *  - has the following properties,
	 *     - typeId:    number
	 *     - damage:    number
	 *     - maxDamage: number
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `Item`. `false` if `obj` is not specified.
	 */
	Item.canAugment = function (obj) {
		return Located.canAugment(obj)
			&& typeof obj.typeId    === 'number'
			&& typeof obj.damage    === 'number'
			&& typeof obj.maxDamage === 'number';
	};

	/**
	 * Augments a specified object with the features of `Item`.
	 *
	 * All of the following properties of `obj` will be overwritten,
	 *  - properties overwritten by `Located.augment`
	 *  - isMaxDamaged
	 *  - spoil
	 *
	 * If `obj` has `maxDamage`, it will be retained. Otherwise the default
	 * value will be set.
	 *
	 * Never checks if `obj` can actually be a `Item`, because this method
	 * may be applied to incomplete instances; i.e., prototypes.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Item.augment = function (obj) {
		Located.augment(obj);
		for (var prop in Item.prototype) {
			obj[prop] = Item.prototype[prop];
		}
		obj['maxDamage'] = obj['maxDamage'] || Item.prototype.maxDamage;
		return obj;
	}

	/**
	 * The maximum damage of this `Item`.
	 *
	 * Default value is `3`.
	 *
	 * @property maxDamage
	 * @type number
	 */
	Object.defineProperty(Item.prototype, 'maxDamage', { value: 3 });

	/**
	 * Spoils this `Item`.
	 *
	 * Increments `this.damage` unless `this.damage >= this.maxDamaged`.
	 * Default implementation evaluates `++this.damage`.
	 *
	 * @method spoil
	 */
	Item.prototype.spoil = function () {
		++this.damage;
	};

	/**
	 * Returns whether a specified item is maximally damaged.
	 *
	 * Throws an exception if `item` is not specified.
	 *
	 * @method isMaxDamaged
	 * @static
	 * @param item {Item}
	 *     The item to be tested.
	 * @return {boolean}
	 *     Whether `item` is maximally damaged.
	 *     `false` if `item` does not have either of `damage` and `maxDamage`.
	 */
	Item.isMaxDamaged = function (item) {
		return item.damage == item.maxDamage;
	};

	/**
	 * The type ID for mikans.
	 *
	 * @property TYPE_MIKAN
	 * @type {number}
	 */
	Object.defineProperty(Item, 'TYPE_MIKAN', { value: 0 });

	/**
	 * The type ID for preservatives.
	 *
	 * @property TYPE_PRESERVATIVE
	 * @type {number}
	 */
	Object.defineProperty(Item, 'TYPE_PRESERVATIVE', { value: 1 });

	return Item;
})();

/**
 * Defines priorities of actors.
 *
 * `SPRAY` < `ABSORB` < `SPOIL` < `DROP` < `FALL` < `ERASE` < `CONTROL` < `SPAWN`
 *
 * @class ActorPriorities
 * @static
 */
const ActorPriorities = {
    /**
     * A priority of actors which spread sprays.
     *
     * @property SPRAY
     * @type number
     * @final
     */
    SPRAY: 0,
	/**
	 * A priority of actors which absorbs sprays.
	 *
	 * @property ABSORB
	 * @type number
	 * @final
	 */
	ABSORB: 1,
    /**
     * A priority of actors which spoil mikans.
     *
     * @property SPOIL
     * @type number
     * @final
     */
    SPOIL: 2,
	/**
	 * A priority of actors which drop mikans.
	 *
	 * @property DROP
	 * @type number
	 * @final
	 */
	DROP: 3,
    /**
     * A priority of falling mikans.
     *
     * @property FALL
     * @type number
     * @final
     */
    FALL: 4,
	/**
	 * A priority of actors which erase mikans.
	 *
	 * @property ERASE
	 * @type number
	 * @final
	 */
	ERASE: 5,
    /**
     * A priority of an actor which controls mikans.
     *
     * @property CONTROL
     * @type number
     * @final
     */
    CONTROL: 6,
    /**
     * A priority of an actor which spawns mikans.
     *
     * @property SPAWN
     * @type number
     * @final
     */
    SPAWN: 7
};

/**
 * A mikan.
 *
 * The initial location of the mikan is (0, 0).
 *
 * `typeId` is `Item.TYPE_MIKAN`.
 *
 * Throws an exception if `damage` is not a number.
 *
 * @class Mikan
 * @constructor
 * @extends Item
 * @uses Renderable
 * @param damage {number}
 *     The degree of damage to set.
 */
Mikan = (function () {
	function Mikan(damage) {
		var self = this;

		Item.call(self, Item.TYPE_MIKAN, 0, 0, damage);

		/**
		 * Renders this mikan.
		 *
		 * Renders a mikan sprite corresponding to the degree of damage.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which this mikan is rendered.
		 */
		Renderable.call(self, function (context) {
			Resources.SPRITES['mikan'][self.damage].render(context,
														   self.x, self.y);
		});
	}
	Item.augment(Mikan.prototype);
	Renderable.augment(Mikan.prototype);

	/**
	 * The maximum damage of a mikan.
	 *
	 *     Mikan.MAX_DAMAGE = 3
	 *
	 * @property MAX_DAMAGE
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(Mikan, 'MAX_DAMAGE', { value: 3 });

	/**
	 * Returns the maximum damage of `Mikan`.
	 *
	 *     Mikan.prototype.maxDamage = Mikan.MAX_DAMAGE
	 *
	 * @property maxDamage
	 * @type {number}
	 * @static
	 */
	Mikan.prototype.maxDamage = Mikan.MAX_DAMAGE;

	return Mikan;
})();

/**
 * A spray.
 *
 * An actor whose a priority is `ActorPriorities.SPRAY`.
 *
 * Throws an exception,
 *  - if `x` is not a number
 *  - or if `y` is not a number
 *  - or if `ttl` is not a number
 *  - if `move` is not a function
 *
 * @class Spray
 * @constructor
 * @uses Located
 * @uses Actor
 * @uses Renderable
 * @param x {number}
 *     The x-coordinate value of the initial location.
 * @param y {number}
 *     The y-coordinate value of the initial location.
 * @param ttl {number}
 *     The time to live.
 * @param move {function}
 *     The function to move the `Spray` everytime `run` is called.
 *     This function will be invoked in the context of the `Spray`.
 */
Spray = (function () {
	function Spray(x, y, ttl, move) {
		var self = this;

		Located.call(self, x, y);

		if (typeof ttl != 'number') {
			throw 'ttl must be a number';
		}
		if (typeof move != 'function') {
			throw 'move must be a function';
		}

		/**
		 * *Spray specific behavior.*
		 *
		 * Behavior
		 * --------
		 *
		 *  1. Decrements `ttl`.
		 *  2. Invokes `move`.
		 *  3. Increments `frameIndex`.
		 *  4. Asks `scheduler` to `schedule` this again.
		 *
		 * ### Derivative
		 *
		 *  - 1 `ttl` expires (<= 0)
		 *     1. END
		 *  - 3 `frameIndex` reaches `Spray.FRAME_COUNT`.
		 *     1. Resets `frameIndex` to 0.
		 *     2. Proceeds to the step 3.
		 *
		 * @method act
		 */
		Actor.call(self, ActorPriorities.SPRAY, function (scheduler) {
			// moves and reschedules if ttl has not expired
			if (ttl > 0) {
				--ttl;
				move.call(this);
				++frameIndex;
				if (frameIndex == Spray.FRAME_COUNT) {
					frameIndex = 0;
				}
				scheduler.schedule(self);
			}
		});

		/**
		 * Renders this spray.
		 *
		 * Renders a spray sprite corresponding to the frame at the location of
		 * this spray.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which this spray is rendered.
		 */
		Renderable.call(self, function (context) {
			Resources.SPRITES['spray'][frameIndex].render(context,
														  self.x, self.y);
		});

		/**
		 * The time to live.
		 *
		 * @property ttl
		 * @type {number}
		 */
		Object.defineProperty(self, 'ttl', {
			get: function () { return ttl; }
		});

		/**
		 * The function which moves everytime `run` is called.
		 *
		 * @property move
		 * @type {function}
		 */
		Object.defineProperty(self, 'move', { value: move });

		/**
		 * The frame index.
		 *
		 * @property frameIndex
		 * @type {number}
		 */
		var frameIndex = 0;
		Object.defineProperty(self, 'frameIndex', {
			get: function () { return frameIndex; }
		});
	};
	Located.augment(Spray.prototype);
	Actor.augment(Spray.prototype);
	Renderable.augment(Spray.prototype);

	/**
	 * The frame count of a spray.
	 *
	 *     FRAME_COUNT = 4
	 *
	 * @property FRAME_COUNT
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(Spray, 'FRAME_COUNT', { value: 4 });

	/**
	 * Returns a simple move function which adds specified speed.
	 *
	 * @method moveLinear
	 * @static
	 * @param dX {number}
	 *     The speed along the x-axis.
	 * @param dY {number}
	 *     The speed along the y-axis.
	 * @return {function}
	 *     A move function which adds `dX` and `dY` to the location of a spray.
	 */
	Spray.moveLinear = function (dX, dY) {
		return function () {
			this.translate(dX, dY);
		};
	};

	return Spray;
})();

/**
 * The class of a preservative.
 *
 * Initially placed at (0, 0) and not damaged (= 0).
 *
 * `typeId` is `Placed.TYPE_PRESERVATIVE`.
 *
 * @class Preservative
 * @constructor
 * @extends Item
 * @uses Renderable
 */
Preservative = (function () {
	function Preservative() {
		var self = this;

		Item.call(self, Item.TYPE_PRESERVATIVE, 0, 0, 0);

		/**
		 * Renders this `Preservative`.
		 *
		 * Renders a preservative sprite at the location of this `Preservative`,
		 * which reflects the damage of it.
		 *
		 * @method render
		 * @param context {Canvas context}
		 *     The canvas context in which this `Preservative` is to be
		 *     rendered.
		 */
		Renderable.call(self, function (context) {
			var sprite = Resources.SPRITES['preservative'][self.damage];
			sprite.render(context, self.x, self.y);
		});
	}
	Item.augment(Preservative.prototype);
	Renderable.augment(Preservative.prototype);

	/**
	 * The maximum damage of a `Preservative`.
	 *
	 *     Preservative.MAX_DAMAGE = 4
	 *
	 * @property MAX_DAMAGE
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(Preservative, 'MAX_DAMAGE', { value: 4 });

	/**
	 * The maximum damage of a `Preservative`.
	 *
	 *     Preservative.prototype.maxDamage = Preservative.MAX_DAMAGE
	 *
	 * @property maxDamage
	 * @type {number}
	 */
	Preservative.prototype.maxDamage = Preservative.MAX_DAMAGE;

	return Preservative;
})();

/**
 * A mikan box.
 *
 * No items are placed initially.
 *
 * NOTE: (column, row)=(0, 0) comes to the bottom-left in the screen
 *       coordinate and (column, row)=(columnCount-1, rowCount-1) comes to
 *       the top-right in the screen coordinate. Rows from `rowCount` to
 *       `rowCount + rowMargin - 1` are not visible in the screen.
 *
 * Throws an exception,
 *  - if `columnCount` is not a number
 *  - or if `rowCount` is not a number
 *  - or if `rowMargin` is not a number
 *  - or if `cellSize` is not a number
 *  - or if `statistics` is not a `Statistics`
 *  - or if `columnCount` <= 0
 *  - or if `rowCount` <= 0
 *  - or if `rowMargin` < 0
 *  - or if `cellSize` <= 0
 *
 * ## Scenarios
 *
 * ### Placing, Dropping and Erasing items
 *
 *  1. A `MikanBox` is given.
 *  2. A user places a `Mikan` or `Preservative` somewhere in the `MikanBox`.
 *  3. The user asks the `MikanBox` to `scheduleToDrop` items in it.
 *  4. The user asks the `MikanBox` to `scheduleToErase` items in it.
 *
 * @class MikanBox
 * @constructor
 * @uses Renderable
 * @param columnCount {number}
 *     The number of columns in the mikan box.
 * @param rowCount {number}
 *     The number of rows in the mikan box.
 * @param rowMargin {number}
 *     The number of extra rows which store items stacked above the mikan box.
 * @param cellSize {number}
 *     The size (in pixels) of each cell in the mikan box.
 * @param statistics {Statistics}
 *     The `Statistics` of the game.
 */
MikanBox = (function () {
	// a table to access surrounding location.
	var SURROUNDINGS = [
		[-1, -1], [0, -1], [1, -1],
		[-1,  0],          [1,  0],
		[-1,  1], [0,  1], [1,  1]
	];

	// a unit velocities of spreading sprays.
	var VELOCITIES = SURROUNDINGS.map(function (v) {
		norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
		return [ v[0] / norm, v[1] / norm ]
	});

	// a marker for a mikan in a chain
	var MARKER_CHAIN = 1;

	// a marker for an item to be spoiled
	var MARKER_SPOIL = 2;

	// the speed of falling mikan
	var FALLING_SPEED = 20;

	// constructor
	function MikanBox(columnCount, rowCount, rowMargin, cellSize, statistics) {
		var self = this;

		// verifies arguments
		if (typeof columnCount !== 'number') {
			throw 'columnCount must be a number';
		}
		if (typeof rowCount !== 'number') {
			throw 'rowCount must be a number';
		}
		if (typeof rowMargin !== 'number') {
			throw 'rowMargin must be a number';
		}
		if (typeof cellSize !== 'number') {
			throw 'cellSize must be a number';
		}
		if (columnCount <= 0) {
			throw 'columnCount must be > 0 but ' + columnCount;
		}
		if (rowCount <= 0) {
			throw 'rowCount must be > 0 but ' + rowCount;
		}
		if (rowMargin < 0) {
			throw 'rowMargin must be >= 0 but ' + rowMargin;
		}
		if (cellSize <= 0) {
			throw 'cellSize must be > 0 but ' + cellSize;
		}
		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}

		// floors the parameters
		columnCount = Math.floor(columnCount);
		rowCount    = Math.floor(rowCount);
		cellSize    = Math.floor(cellSize);

		// creates the cells where items are placed
		var maxRowCount = rowCount + rowMargin;
		var cells = new Array(columnCount * maxRowCount);
		for (var i = 0; i < cells.length; ++i) {
			cells[i] = null;
		}

		/**
		 * Renders this `MikanBox`.
		 *
		 * Renders visible items in this mikan box.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which this mikan box is rendered.
		 */
		Renderable.call(self, function (context) {
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < rowCount; ++r) {
					var item = cells[indexOf(c, r)];
					if (item) {
						item.render(context);
					}
				}
			}
		});

		/**
		 * The number of columns in this `MikanBox`.
		 *
		 * @property columnCount
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'columnCount', { value: columnCount });

		/**
		 * The number of rows in this `MikanBox`.
		 *
		 * @property rowCount
		 * @type {number}
		 */
		Object.defineProperty(self, 'rowCount', { value: rowCount });

		/**
		 * The number of extra rows which stack items above this `MikanBox`.
		 *
		 * @property rowMargin
		 * @type {number}
		 */
		Object.defineProperty(self, 'rowMargin', { value: rowMargin });

		/**
		 * The size (in pixels) of each cell in this `MikanBox`.
		 *
		 * @property cellSize
		 * @type {number}
		 */
		Object.defineProperty(self, 'cellSize', { value: cellSize });

		/**
		 * The width (in pixels) of this `MikanBox`.
		 *
		 * @property width
		 * @type {number}
		 */
		Object.defineProperty(self, 'width', { value: columnCount * cellSize });

		/**
		 * The height (in pixels) of this `MikanBox`.
		 *
		 * @property height
		 * @type {number}
		 */
		Object.defineProperty(self, 'height', { value: rowCount * cellSize });

		/**
		 * The `Statistics` associated with this `MikanBox`.
		 *
		 * @property statistics
		 * @type {Statistics}
		 */
		Object.defineProperty(self, 'statistics', { value: statistics });

		/**
		 * Returns the column which includes a specified x-coordinate value.
		 *
		 * @method columnAt
		 * @param x {number}
		 *     The x-coordinate value included in the requested column.
		 * @return {number}
		 *     The column which includes `x`.
		 *     This number can be less than 0, or equal to or greater than
		 *     the number of columns in this `MikanBox`.
		 */
		self.columnAt = function (x) {
			return Math.floor(x / cellSize);
		};

		/**
		 * Returns the row which includes a specified y-coordinate value.
		 *
		 * @method rowAt
		 * @param y {number}
		 *     The y-coordinate value included in the requested row.
		 * @retrun {number}
		 *     The row which includes `y`.
		 *     This number can be less than 0, or equal to or greater than
		 *     the number of rows in this `MikanBox`.
		 */
		self.rowAt = function (y) {
			return Math.floor((self.height - y - 1) / cellSize);
		};

		/**
		 * Returns the item in the specified cell in this `MikanBox`.
		 *
		 * Throws an exception
		 *  - if `column` < 0 or `column` >= `columnCount`
		 *  - or if `row` < 0 or `row` >= `rowCount + rowMargin`
		 *
		 * @method itemIn
		 * @param column {number}
		 *     The column of the cell from which an item is to be obtained.
		 * @param row {number}
		 *     The row of the cell from which an item is to be obtained.
		 * @return {Mikan}
		 *     The item at (`column`, `row`). `null` if no item is in
		 *     the cell.
		 */
		self.itemIn = function (column, row) {
			checkCell(column, row);
			return cells[indexOf(column, row)];
		};

		/**
		 * Places a specified item in a specified cell of this `MikanBox`.
		 *
		 * If `align` if true, the location of `item` is arranged so that
		 * its top-left corner comes to the top-left corner of the specified
		 * cell in a screen.
		 *
		 * Throws an exception
		 *  - if `item` is not an `Item`
		 *  - or if `column < 0` or `column >= columnCount`
		 *  - or if `row < 0` or `row >= rowCount + rowMargin`
		 *  - or if other item is already in the cell (`column`, `row`)
		 *
		 * @method place
		 * @param item {Item}
		 *     The item to be placed.
		 * @param column {number}
		 *     The column of the cell in which `item` is to be placed.
		 * @param row {number}
		 *     The row of the cell in which `item` is to be placed.
		 * @param align {boolean}
		 *     Whether the location of `item` is to be aligned to the cell.
		 */
		self.place = function (item, column, row, align) {
			if (item.typeId == null) {
				throw 'item must be a Item';
			}
			checkCell(column, row);
			// makes sure that the cell is vacant
			var idx = indexOf(column ,row);
			if (cells[idx] != null) {
				throw 'cell [' + column + ', ' + row + '] is not vacant';
			}
			if (align) {
				item.locate(self.leftXOf(column), self.topYOf(row));
			}
			cells[idx] = item;
		};

		/**
		 * Schedules to drop items in this mikan box.
		 *
		 * Schedules an `Actor` which does the followings,
		 *
		 *  1. For each item in this mikan box, which isn't placed on
		 *     the ground,
		 *      1. Releases the item from this mikan box.
		 *      2. Makes the item an actor which moves toward the ground
		 *         (ActorPriorities.FALL).
		 *      3. Schedules the item in `scheduler`.
		 *
		 * A falling item reschedules itself until it reaches the ground or
		 * a fixed item.
		 *
		 * @method scheduleToDrop
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which the actor is to be scheduled.
		 */
		self.scheduleToDrop = function (scheduler) {
			var dropper = new Actor(ActorPriorities.DROP, function (scheduler) {
				for (var c = 0; c < columnCount; ++c) {
					var height = 0;
					for (var r = 0; r < maxRowCount; ++r) {
						var idx = indexOf(c, r);
						var item = cells[idx];
						if (item != null) {
							// moves the item toward the ground
							// if it's not on the ground
							if (r > height) {
								scheduler.schedule(makeFall(item, height));
								cells[idx] = null;
							}
							++height;
						}
					}
				}
			});
			scheduler.schedule(dropper);
		};

		/**
		 * Schedules to erase chained mikans in this box.
		 *
		 * Schedules an `Actor` which has `ActorPriorities.ERASE` and does
		 * the followings,
		 *  1. Collects chained mikans.
		 *  2. For each mikan chain
		 *      1. Erases mikans composing the chain.
		 *      2. Creates sprays spreading from the chained mikans and
		 *         schedules them in `scheduler`.
		 *  3. Schedules an actor which spoils items surrounding the chained
		 *     mikans (ActorPriorities.SPOIL). The actor also spoils
		 *     preservatives which prevent mikans to be spoiled, and erases
		 *     maximally damaged preservatives.
		 *  4. Schedules an actor which drops items toward the ground
		 *     (ActorPriorities.DROP).
		 *  5. Schedules itself again.
		 *
		 * If no mikans are chained, the `Actor` will stop; i.e., does not
		 * reschedule itself.
		 *
		 * @method scheduleToErase
		 * @param scheduler {ActorScheduler}
		 *     The actor scheduler in which actors are to be scheduled.
		 */
		self.scheduleToErase = function (scheduler) {
			var eraser = new Actor(ActorPriorities.ERASE, function (scheduler) {
				// chains mikans
				var chains = self.chainMikans();
				if (chains.length > 0) {
					// erases the mikans in the chains
					var numErased = 0;
					chains.forEach(function (chain) {
						chain.forEach(function (loc) {
							cells[indexOf(loc[0], loc[1])] = null;
							++numErased;
						});
					});
					statistics.addCombo();
					statistics.addErasedMikans(numErased);
					// sprays
					self.scheduleSprays(chains, scheduler);
					// schedules to spoil items
					self.scheduleToSpoil(chains, scheduler);
					// schedules to drop items
					self.scheduleToDrop(scheduler);
					// schedules itself again
					scheduler.schedule(this);
				} else {
					statistics.resetCombo();
				}
			});
			scheduler.schedule(eraser);
		};

		/**
		 * Chains mikans in this box.
		 *
		 * A chain is composed of at least `MikanBox.CHAIN_LENGTH`
		 * maximally damaged mikans.
		 *
		 * @method chainMikans
		 * @private
		 * @return {array}
		 *     An array of chains. Each chain comprising an array of
		 *     locations (column, row) of chained mikans.
		 */
		self.chainMikans = function () {
			var chainCells = new Array(columnCount * maxRowCount);
			var chains = [];
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < maxRowCount; ++r) {
					// starts chaining from a maximally damaged mikan
					// but avoids chaining already chained mikans
					var idx = indexOf(c, r);
					if (isMaxDamagedMikan(cells[idx])) {
						if (chainCells[idx] == null) {
							// creates a new chain
							var chain = [[c, r]];
							chainCells[idx] = chain;
							propagate(c, r);
							if (chain.length >= MikanBox.CHAIN_LENGTH) {
								chains.push(chain);
							}
							function propagate (c2, r2) {
								tryToChain(c2 - 1, r2);
								tryToChain(c2 + 1, r2);
								tryToChain(c2, r2 - 1);
								tryToChain(c2, r2 + 1);
							}
							function tryToChain (c2, r2) {
								if (isValidCell(c2, r2)) {
									var idx2 = indexOf(c2, r2);
									if (isMaxDamagedMikan(cells[idx2])) {
										if (chainCells[idx2] == null) {
											chain.push([c2, r2]);
											chainCells[idx2] = chain;
											propagate(c2, r2);
										}
									}
								}
							}
						}
					}
				}
			}
			return chains;
		};

		/**
		 * Creates and schedules `Spray`s spreading from specified chains.
		 *
		 * Creates and schedules `Spray`s spreading, toward 8 directions,
		 * from each mikan composing `chains`.
		 *
		 * @method scheduleSprays
		 * @param chains {Array}
		 *     The array of chains from which sprays spread.
		 *     Each element is an array of [column, row] locations.
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which `Spray`s are to be scheduled.
		 */
		self.scheduleSprays = function (chains, scheduler) {
			chains.forEach(function (c) {
				c.forEach(function (loc) {
					VELOCITIES.forEach(function (v) {
						var move = Spray.moveLinear(v[0] * 1.5, v[1] * 1.5);
						scheduler.schedule(new Spray(self.leftXOf(loc[0]),
													 self.topYOf(loc[1]),
													 15,
													 move));
					});
				});
			});
		};

		/**
		 * Schedules to spoil items surrounding specified mikan chains.
		 *
		 * Determines which mikans and preservatives are to be spoiled,
		 * and then schedules the following `Actor`s,
		 *  1. An `Actor` which has `ActorPriorities.ABSORB` and creates
		 *     `Spray`s being absorbed into items to be spoiled.
		 *  2. An `Actor` which has `ActorPriorities.SPOIL` and spoils mikans
		 *     and preservatives. It also erases maximally damaged
		 *     preservatives.
		 *
		 * @method scheduleToSpoil
		 * @private
		 * @param chains {array}
		 *     The array of chains whose surrounding mikans are to be spoiled.
		 *     Each element is an array of [column, row] locations.
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which the actor is to be scheduled.
		 */
		self.scheduleToSpoil = function (chains, scheduler) {
			// marks cells
			var cellMarkers = new Array(columnCount * maxRowCount);
			self.markSpoilingTargets(chains, cellMarkers);
			self.markAbsorbers(cellMarkers);
			// absorbs sprays
			var absorber =
				new Actor(ActorPriorities.ABSORB, function (scheduler) {
					for (var c = 0; c < columnCount; ++c) {
						for (var r = 0; r < maxRowCount; ++r) {
							var idx = indexOf(c, r);
							if (cellMarkers[idx] == MARKER_SPOIL) {
								var x = self.leftXOf(c);
								var y = self.topYOf(r);
								for (var i = 0; i < 4; ++i) {
									var angle = i * Math.PI / 2;
									var move = (function (x, y, angle) {
										return function () {
											angle += Math.PI / 30;
											var r = 1.5 * this.ttl
											this.x = x + r * Math.cos(angle);
											this.y = y + r * Math.sin(angle);
										};
									})(x, y, angle);
									var x2 = x + 15 * Math.cos(angle);
									var y2 = y + 15 * Math.sin(angle);
									var spray = new Spray(x2, y2, 10, move);
									scheduler.schedule(spray);
								}
							}
						}
					}
				});
			scheduler.schedule(absorber);
			// spoils items
			var spoiler =
				new Actor(ActorPriorities.SPOIL, function (scheduler) {
					var erasedPreservativeCount = 0;
					for (var c = 0; c < columnCount; ++c) {
						for (var r = 0; r < maxRowCount; ++r) {
							var idx = indexOf(c, r);
							if (cellMarkers[idx] == MARKER_SPOIL) {
								var item = cells[idx];
								item.spoil();
								if (item.typeId == Item.TYPE_PRESERVATIVE
									&& Item.isMaxDamaged(item))
								{
									++erasedPreservativeCount;
									// destroys the preservative after
									// few frames
									(function (item, ttl) {
										Actor.call(item, ActorPriorities.SPOIL, function (scheduler) {
											--ttl;
											if (ttl > 0) {
												scheduler.schedule(this);
											} else {
												for (var i = 0; i < 3; ++i) {
													var x2 = this.x + Math.random(5) - 2;
													var y2 = this.y + Math.random(5) - 2;
													var spray = new Spray(x2, y2, 5, Spray.moveLinear(0, -1.5));
													scheduler.schedule(spray);
												}

											}

										});
										scheduler.schedule(item);
									})(cells[idx], 3);
									cells[idx] = null;
								}
							}
						}
					}
					// updates the statistics when preservatives have
					// disappeared
					if (erasedPreservativeCount > 0) {
						var timer = (function (ttl) {
							return new Actor(
								ActorPriorities.SPOIL, function (scheduler) {
									--ttl;
									if (ttl > 0) {
										scheduler.schedule(this);
									} else {
										statistics.addErasedPreservatives(erasedPreservativeCount);
									}
								}
							);
						})(3);
						scheduler.schedule(timer);
					}
				});
			scheduler.schedule(spoiler);
		};

		/**
		 * Marks items to be spoiled.
		 *
		 * `cellMarkers` will be modified like the followings,
		 *  - Mikans in `chains` are as `MARKER_CHAIN`.
		 *  - Items to be spoiled as `MARKER_SPOIL`.
		 *
		 * Other cells are retained.
		 *
		 * NOTE: this function does not mark preservatives which prevent mikans
		 *       from being spoiled.
		 *
		 * @method markSpoilingTargets
		 * @private
		 * @param chains {array}
		 *     An array of mikan chains.
		 * @param cellMarkers {array}
		 *     An array similar to `cells`, in which markers are to be stored.
		 */
		self.markSpoilingTargets = function (chains, cellMarkers) {
			chains.forEach(function (chain) {
				chain.forEach(function (loc) {
					cellMarkers[indexOf(loc[0], loc[1])] = MARKER_CHAIN;
				});
			});
			chains.forEach(function (chain) {
				chain.forEach(function (loc) {
					SURROUNDINGS.forEach(function (d) {
						var column = loc[0] + d[0];
						var row    = loc[1] + d[1];
						if (isValidCell(column, row)) {
							var idx = indexOf(column, row);
							var item = cells[idx];
							if (cellMarkers[idx] !== MARKER_CHAIN && item) {
								cellMarkers[idx] = MARKER_SPOIL;
							}
						}
					});
				});
			});
		};

		/**
		 * Marks preservatives which prevent mikans from being spoiled.
		 *
		 * Also clears markers, marks as 0, for mikans which are prevented from
		 * being spoiled.
		 *
		 * @method markAbsorbers
		 * @private
		 * @param cellMarkers {array}
		 *     An array similar to `cells`, which records markers.
		 */
		self.markAbsorbers = function (cellMarkers) {
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < maxRowCount; ++r) {
					var idx = indexOf(c, r);
					if (cellMarkers[idx] == MARKER_SPOIL
					    && cells[idx].typeId == Item.TYPE_MIKAN)
					{
						SURROUNDINGS.forEach(function (d) {
							var c2 = c + d[0];
							var r2 = r + d[1];
							if (isValidCell(c2, r2)) {
								var idx2 = indexOf(c2, r2);
								var item = cells[idx2];
								if (item
									&& item.typeId == Item.TYPE_PRESERVATIVE)
								{
									cellMarkers[idx2] = MARKER_SPOIL;
									cellMarkers[idx]  = 0;
								}
							}
						});
					}
				}
			}
		};

		/**
		 * Returns the index of the specified cell.
		 *
		 * @method indexOf
		 * @private
		 * @param column {number}
		 *     The column of the cell.
		 * @param row {number}
		 *     The row of the cell.
		 * @return {number}
		 *     The index of the cell (`column`, `row`).
		 */
		function indexOf(column, row) {
			return row + (column * maxRowCount);
		}

		/**
		 * Returns whether the specified column and row are valid.
		 *
		 * A valid cell is
		 *  - 0 <= `column` < `columnCount`
		 *  - 0 <= `row` < `maxRowCount`
		 *
		 * @method isValidCell
		 * @private
		 * @param column {number}
		 *     The column to be tested.
		 * @param row {number}
		 *     The row to be tested.
		 * @return {boolean}
		 *     Whether (`column`, `row`) is a valid cell.
		 */
		function isValidCell(column, row) {
			return column >= 0 && column < columnCount
				&& row >= 0 && row < maxRowCount;
		}

		/**
		 * Checks if the specified column and row are valid.
		 *
		 * Throws an exception
		 *  - if `column` < 0 or `column` >= `columnCount`
		 *  - or if `row` < 0 or `row` >= `maxRowCount`
		 *
		 * @method checkCell
		 * @private
		 * @param column {number}
		 *     The column to be tested.
		 * @param row {number}
		 *     The row to be tested.
		 */
		function checkCell(column, row) {
			if (column < 0 || column >= columnCount) {
				throw "column must be in [0, "
					+ (columnCount - 1) + "] but " + column;
			}
			if (row < 0 || row >= maxRowCount) {
				throw "row must be in [0, "
					+ (maxRowCount - 1) + "] but " + row;
			}
		}

		/**
		 * Returns the x-coordinate value of the left edge of a specified
		 * column.
		 *
		 * @method leftXOf
		 * @param column {number}
		 *     The column to be converted.
		 * @return {number}
		 *     The the x-coordinate value of the left edge of `column`.
		 */
		self.leftXOf = function (column) {
			return column * cellSize;
		};

		/**
		 * Returns the y-coordinate value of the top edge of a specified row.
		 *
		 * @method topYOf
		 * @param row {number}
		 *     The row to be converted.
		 * @return {number}
		 *     The the y-coordinate value of the top edge of `row`.
		 */
		self.topYOf = function (row) {
			return (rowCount - row - 1) * cellSize;
		}

		/**
		 * Returns whether the specified item is a maximally damaged mikan.
		 *
		 * @method isMaxDamagedMikan
		 * @private
		 * @param item {Item}
		 *     The item to be tested.
		 * @return {boolean}
		 *     Whether `item` is a `Mikan` and maximally damaged.
		 *     `false` if `item` is not specified.
		 */
		function isMaxDamagedMikan(item) {
			return item
				&& item.typeId == Item.TYPE_MIKAN
				&& Item.isMaxDamaged(item);
		}

		/**
		 * Makes a specified item fall to a specified row.
		 *
		 * @method makeFall
		 * @param item {Item}
		 *     The item to fall.
		 * @param dstRow {number}
		 *     The destination row of the falling item.
		 * @return {Item, Actor}
		 *     `item` as an Actor.
		 */
		function makeFall(item, dstRow) {
			Actor.call(item, ActorPriorities.FALL, function (scheduler) {
				var bottom = item.y + FALLING_SPEED + cellSize - 1;
				var bottomRow = self.rowAt(bottom);
				if (bottomRow >= dstRow) {
					item.y += FALLING_SPEED;
					scheduler.schedule(item);
				} else {
					self.place(item, self.columnAt(item.x), dstRow, true);
				}
			});
			return item;
		}
	}

	/**
	 * The minimum length of a chain.
	 *
	 *     CHAIN_LENGTH = 4
	 *
	 * @property CHAIN_LENGTH
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MikanBox, 'CHAIN_LENGTH', { value: 4 });

	return MikanBox;
})();

/**
 * Records statistics of the game.
 *
 * The following statistics are recorded,
 *  - Current game level
 *  - Current score
 *  - Total number of erased mikans
 *  - Length of the current combo
 *
 * Events
 * ------
 *
 * `Statistics` notifies observers an event when it is changed.
 * An observer function will be invoked with the following arguments,
 *  1. Event ID (string):       The type of the event.
 *  2. Statistics (Statistics): The updated `Statistics`.
 *  3. Optional arguments:      Optional arguments depending on the event ID.
 *
 * An event ID can be one of the followings,
 *  - 'levelUpdated':
 *    Indicates that the current game level has been changed.
 *    No optional arguments.
 *  - 'scoreUpdated':
 *    Indicates that the current score has been changed. No optional arguments.
 *  - 'mikansErased':
 *    Indicates that the total number of erased mikans has increased.
 *    Takes the following additional argument,
 *     1. (number) The number of newly erased mikans.
 *  - 'preservativesErased':
 *    Indicates that the total number of erased preservatives has increased.
 *    Takes the following additional argument,
 *     1. (number) The number of newly erased preservatives.
 *  - 'comboUpdated':
 *    Indicates that the length of the current combo has been changed.
 *    No optional arguments.
 *  - 'statisticsReset':
 *    Indicates that the statistics has been reset. No optional arguments.
 *
 * @class Statistics
 * @constructor
 * @extends Observable
 */
Statistics = (function () {
	function Statistics() {
		var self = this;

		Observable.call(self);

		/**
		 * The current game level.
		 *
		 * Initially 0.
		 *
		 * Changing this property notifies 'levelUpdated' to observers, but
		 * setting this property to the same value notifies nothing.
		 *
		 * Throws an exception,
		 *  - if this property is set unspecified
		 *  - or if this property is set to a non-number value
		 *  - or if this property is set to a negative number
		 *
		 * @property level
		 * @type {number}
		 */
		var level = 0;
		Object.defineProperty(self, 'level', {
			get: function () { return level },
			set: function (newLevel) {
				if (typeof newLevel !== 'number') {
					throw 'level must be a number';
				}
				if (newLevel < 0) {
					throw 'level must be >= 0';
				}
				// updates if necessary
				if (level != newLevel) {
					level = newLevel;
					self.notifyObservers('levelUpdated', self);
				}
			}
		});

		/**
		 * The current score.
		 *
		 * Initially 0.
		 *
		 * Changing this property notifies 'scoreUpdated' to observers, but
		 * setting this property to the same value notifies nothing.
		 *
		 * Throws an exception,
		 *  - if this property is set unspecified
		 *  - or if this property is set to a non-number value
		 *  - or if this property is set to a negative number
		 *
		 * @property score
		 * @type {number}
		 */
		var score = 0;
		Object.defineProperty(self, 'score', {
			get: function () { return score },
			set: function (newScore) {
				if (typeof newScore !== 'number') {
					throw 'score must be a number';
				}
				if (newScore < 0) {
					throw 'score must be >= 0';
				}
				// updates if necessary
				if (score != newScore) {
					score = newScore;
					self.notifyObservers('scoreUpdated', self);
				}
			}
		});

		/**
		 * The total number of erased mikans.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addErasedMikans` or `reset`.
		 *
		 * @property erasedMikanCount
		 * @type {number}
		 */
		var erasedMikanCount = 0;
		Object.defineProperty(self, 'erasedMikanCount', {
			get: function () { return erasedMikanCount }
		});

		/**
		 * The total number of erased preservatives.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addErasedPreservatives` or `reset`.
		 *
		 * @property erasedPreservativeCount
		 * @type {number}
		 */
		var erasedPreservativeCount = 0;
		Object.defineProperty(self, 'erasedPreservativeCount', {
			get: function () { return erasedPreservativeCount }
		});

		/**
		 * The length of the current combo.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addCombo`, `resetCombo` or `reset`.
		 *
		 * @property comboLength
		 * @type {number}
		 */
		var comboLength = 0;
		Object.defineProperty(self, 'comboLength', {
			get: function () { return comboLength }
		});

		/**
		 * Increases the total number of erased mikans.
		 *
		 * Notifies 'mikansErased' to observers unless `count` is 0.
		 *
		 * Throws an exception if `count` is not a number.
		 *
		 * @method addErasedMikans
		 * @param count {number}
		 *     The number to be added to the erased mikan count.
		 */
		self.addErasedMikans = function (count) {
			if (typeof count !== 'number') {
				throw 'count must be a number';
			}
			if (count != 0) {
				erasedMikanCount += count;
				self.notifyObservers('mikansErased', self, count);
			}
		};

		/**
		 * Increases the total number of erased preservatives.
		 *
		 * Notifies 'preservativesErased' to observers unless `count` is 0.
		 *
		 * Throws an exception if `count` is not a number.
		 *
		 * @method addErasedPreservatives
		 * @param count {number}
		 *     The number to be added to the erased preservative count.
		 */
		self.addErasedPreservatives = function (count) {
			if (typeof count !== 'number') {
				throw 'count must be a number';
			}
			if (count != 0) {
				erasedPreservativeCount += count;
				self.notifyObservers('preservativesErased', self, count);
			}
		};

		/**
		 * Increments (+1) the length of the current combo.
		 *
		 * Notifies 'comboUpdated' to observers.
		 *
		 * @method addCombo
		 */
		self.addCombo = function () {
			++comboLength;
			self.notifyObservers('comboUpdated', self);
		};

		/**
		 * Resets the length of the current combo.
		 *
		 * Resets `comboLength` to 0.
		 *
		 * Notifies `comboUpdated` to observers.
		 *
		 * @method resetCombo
		 */
		self.resetCombo = function () {
			comboLength = 0;
			self.notifyObservers('comboUpdated', self);
		};

		/**
		 * Resets this `Statistics`.
		 *
		 * Resets the following properties to 0,
		 *  - `level`
		 *  - `score`
		 *  - `erasedMikanCount`
		 *  - `erasedPreservativeCount`
		 *  - `comboLength`
		 *
		 * Notifies `statisticsReset` to observers.
		 *
		 * @method reset
		 */
		self.reset = function () {
			level                   = 0;
			score                   = 0;
			erasedMikanCount        = 0;
			erasedPreservativeCount = 0;
			comboLength             = 0;
			self.notifyObservers('statisticsReset', self);
		};
	}
	Observable.augment(Statistics.prototype);

	/**
	 * Returns whether a specified object is a `Statistics`.
	 *
	 * A `Statistics` must satisfy all of the following conditions,
	 *  - Is a `Observable`
	 *  - Has all of the following properties,
	 *     - level:                   number
	 *     - score:                   number
	 *     - erasedMikanCount:        number
	 *     - erasedPreservativeCount: number
	 *     - comboLength:             number
	 *     - addErasedMikans:         function
	 *     - addErasedPreservatives:  function
	 *     - addCombo:                function
	 *     - resetCombo:              function
	 *     - reset:                   function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Statistics`. `false` if `obj` is not specified.
	 */
	Statistics.isClassOf = function (obj) {
		return Observable.isClassOf(obj)
			&& typeof obj.level                   === 'number'
			&& typeof obj.score                   === 'number'
			&& typeof obj.erasedMikanCount        === 'number'
			&& typeof obj.erasedPreservativeCount === 'number'
			&& typeof obj.comboLength             === 'number'
			&& typeof obj.addErasedMikans         === 'function'
			&& typeof obj.addErasedPreservatives  === 'function'
			&& typeof obj.addCombo                === 'function'
			&& typeof obj.resetCombo              === 'function'
			&& typeof obj.reset                   === 'function';
	};

	return Statistics;
})();

/**
 * The interface which controls the difficulty of the game.
 *
 * The `Difficulty` will update the score of `statistics` when mikans are
 * erased, and increment the level of `statistics` when a certain number of
 * mikans are erased.
 *
 * Throws an exception if `statistics` is not a `Statistics`.
 *
 * @class Difficulty
 * @constructor
 * @param statistics {Statistics}
 *     The `Statistics` from which the difficulty will be determined.
 */
Difficulty = (function () {
	function Difficulty(statistics) {
		var self = this;

		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}

		// updates parameters when `statistics` is updated
		var toNextLevel;
		var speed;
		var preservativeStock;
		var preservativeCount;
		var preservativeProbability;
		var maxDamageRatio;
		statistics.addObserver(function (id) {
			switch (id) {
			case 'mikansErased':
				// updates the score and level
				var numErased = arguments[2];
				var level = statistics.level;
				statistics.score += (numErased + level)
									* Difficulty.MIKAN_SCORE
									* comboFactorOf(statistics.comboLength);
				while (numErased > toNextLevel) {
					numErased -= toNextLevel;
					++level;
					toNextLevel = 20;
				}
				toNextLevel -= numErased;
				statistics.level = level;
				break;
			case 'preservativesErased':
				// updates the score
				var numErased = arguments[2];
				statistics.score += numErased
									* Difficulty.PRESERVATIVE_SCORE
									* comboFactorOf(statistics.comboLength);
				break;
			case 'levelUpdated':
				// updates the difficulty parameters
				updateParameters();
				break;
			case 'statisticsReset':
				// resets parameters
				resetParameters();
				break;
			}
		});
		function resetParameters() {
			toNextLevel       = 20;
			preservativeCount = 0;
			maxDamageRatio    = 2;
			updateParameters();
		}
		function updateParameters() {
			var level = statistics.level;
			speed = Math.min(2 + level / 4, 15);
			preservativeProbability =
				Math.max(0, Math.min((level - 4) / 250, 0.1));
			preservativeStock = Math.floor((level + 1) * (level + 2) / 10);
		}
		resetParameters();

		/**
		 * The falling speed of grabbed items.
		 *
		 * Speed will be calculated by the following expression,
		 *
		 *     2 + statistics.level / 4
		 *
		 * @property speed
		 * @type {number}
		 */
		Object.defineProperty(self, 'speed', {
			get: function () { return speed }
		});

		/**
		 * Returns the next item to fall.
		 *
		 * @method nextItem
		 * @return {Item}
		 *     The next item to fall.
		 */
		self.nextItem = function () {
			var item;
			if (preservativeCount < preservativeStock
				&& Math.random() < preservativeProbability)
			{
				item = new Preservative();
				++preservativeCount;
			} else {
				// the max damage is `maxDamageRatio` times often
				// compared to any other damage
				// in other words, damages other than max have equal chance
				var chance =
					(Mikan.MAX_DAMAGE + maxDamageRatio) * Math.random();
				var damage = 0;
				while (chance >= 1 && damage < Mikan.MAX_DAMAGE) {
					chance -= 1;
					++damage;
				}
				item = new Mikan(damage);
			}
			return item;
		};

		// Returns the score factor of a specified combo length.
		function comboFactorOf(comboLength) {
			return Math.round(Math.pow(2, (comboLength - 1)));
		}
	}

	/**
	 * Returns whether a specified object is a `Difficulty`.
	 *
	 * A `Difficulty` must have all of the following properties,
	 *  - speed:    number
	 *  - nextItem: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Difficulty`. `false` if `obj` is not specified.
	 */
	Difficulty.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.speed    === 'number'
			&& typeof obj.nextItem === 'function';
	};

	/**
	 * The base score of a single mikan.
	 *
	 * The default value is 10.
	 *
	 * @property MIKAN_SCORE
	 * @type {number}
	 * @static
	 */
	Difficulty.MIKAN_SCORE = 10;

	/**
	 * The base score of a single preservative.
	 *
	 * The default value is 1000.
	 *
	 * @property PRESERVATIVE_SCORE
	 * @type {number}
	 * @static
	 */
	Difficulty.PRESERVATIVE_SCORE = 1000;

	return Difficulty;
})();

/**
 * An entry in a score database.
 *
 * The `date` of the `Score` will be set to the current date.
 *
 * Throws an exception,
 *  - if `value` is not a number,
 *  - or if `level` is not a number,
 *  - or if `player` is not a string,
 *  - or if `value < 0`,
 *  - or if `level < 0`.
 *
 * @class Score
 * @constructor
 * @param value {number}
 *     The value of the score.
 * @param level {number}
 *     The level at which the score was achieved.
 * @param player {string}
 *     The player who achieved the score.
*/
Score = (function () {
	function Score(value, level, player) {
		var self = this;

		// verifies arguments
		if (typeof value !== 'number') {
			throw new Error('value must be a number');
		}
		if (typeof level !== 'number') {
			throw new Error('level must be a number');
		}
		if (typeof player !== 'string') {
			throw new Error('player must be a string');
		}
		if (value < 0) {
			throw new Error('value must be >= 0');
		}
		if (level < 0) {
			throw new Error('level must be >= 0');
		}

		/**
		 * The value of this score.
		 *
		 * @property value
		 * @type number
		 */
		self.value = value;

		/**
		 * The level at which this score was achieved.
		 *
		 * @property level
		 * @type number
		 */
		self.level = level;

		/**
		 * The player who achieved this score.
		 *
		 * @property player
		 * @type string
		 */
		self.player = player;

		/**
		 * The date when this score was achieved.
		 *
		 * The number of seconds since January 1, 1970, 00:00:00 GMT.
		 *
		 * @property date
		 * @type number
		 */
		self.date = Math.floor(new Date().getTime() / 1000.0);
	}

	/**
	 * Returns whether a specified object is a `Score`.
	 *
	 * A `Score` must have all of the following properties,
	 *  - value:      number
	 *  - level:      number
	 *  - player:     string
	 *  - date:       number
	 *  - dateObject: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Score`. `false` if `obj` is not specified.
	 */
	Score.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.value      === 'number'
			&& typeof obj.level      === 'number'
			&& typeof obj.player     === 'string'
			&& typeof obj.date       === 'number'
			&& typeof obj.dateObject === 'function';
	};

	/**
	 * Returns whether a specified object can be a `Score`.
	 *
	 * An object which has all of the following properties can be a `Score`,
	 *  - value:  number
	 *  - level:  number
	 *  - player: string
	 *  - date:   number
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `Score`. `false` if `obj` is not specified.
	 */
	Score.canAugment = function (obj) {
		return obj != null
			&& typeof obj.value  === 'number'
			&& typeof obj.level  === 'number'
			&& typeof obj.player === 'string'
			&& typeof obj.date   === 'number';
	};

	/**
	 * Augments a specified object with the features of the `Score`.
	 *
	 * NOTE: never checks if `obj` can actually be a `Score`, because this
	 *       method may be applied to an incomplete object; i.e., a prototype.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {Score}
	 *     `obj`.
	 */
	Score.augment = function (obj) {
		for (prop in Score.prototype) {
			obj[prop] = Score.prototype[prop];
		}
		return obj;
	};

	/**
	 * Returns the date as a `Date` object.
	 *
	 * @method dateObject
	 * @return {Date}
	 *     A `Date` when this score was achieved.
	 */
	Score.prototype.dateObject = function () {
		return new Date(this.date * 1000);
	};

	return Score;
})();

/**
 * A list of `Score`s.
 *
 * Initializes an empty list.
 *
 * @class ScoreList
 * @constructor
 */
ScoreList = (function () {
	function ScoreList() {
		/**
		 * The array of scores in this `ScoreList`.
		 *
		 * DO NOT manipulate this property.
		 * Use `scoreCount` and `scoreAt` instead.
		 *
		 * @property scores
		 * @type array{Score}
		 * @protected
		 */
		this.scores = [];
	}

	/**
	 * Returns whether a specified object is a `ScoreList`.
	 *
	 * A `ScoreList` must have all of the following properties,
	 *  - scoreCount: function
	 *  - scoreAt:    function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `ScoreList`. `false` if `obj` is not specified.
	 */
	ScoreList.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.scoreCount === 'function'
			&& typeof obj.scoreAt    === 'function';
	};

	/**
	 * Returns whether a specified object can be a `ScoreList`.
	 *
	 * An object which satisfies all of the following conditions can be
	 * a `ScoreList`,
	 *  - Has an array `scores`
	 *  - `scores` is empty or every element in it can be a `Score`
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `ScoreList`.
	 *     `false` is `obj` is not specified.
	 */
	ScoreList.canAugment = function (obj) {
		return obj != null
			&& Array.isArray(obj.scores)
			&& obj.scores.reduce(function (b, e) {
				return b && Score.canAugment(e);
			}, true);
	};

	/**
	 * Augments a specified object with the features of the `ScoreList`.
	 *
	 * If `obj` has an array `scores`, every element in it will be augmented by
	 * the `Score`.
	 *
	 * NOTE: never tests if `obj` can actually be a `ScoreList` because this
	 *       method can be applied to an incomplete object; i.e., a prototype.
	 *
	 * Throws an exception,
	 *  - if `obj` is not specified,
	 *  - or if `obj` has a non-empty array `scores`, but it contains `null` or
	 *    `undefined`.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`
	 */
	ScoreList.augment = function (obj) {
		for (prop in ScoreList.prototype) {
			obj[prop] = ScoreList.prototype[prop];
		}
		if (Array.isArray(obj.scores)) {
			obj.scores.forEach(function (e) {
				Score.augment(e);
			});
		}
		return obj;
	};

	/**
	 * Returns the number of scores in this `ScoreList`.
	 *
	 * @method scoreCount
	 * @return {number}
	 *     The number of scores in this `ScoreList`.
	 */
	ScoreList.prototype.scoreCount = function () {
		return this.scores.length;
	};

	/**
	 * Returns a score at a specified index in this `ScoreList`.
	 *
	 * @method scoreAt
	 * @param index {number}
	 *     The index of score.
	 * @return {Score}
	 *     The score at `index`.
	 *     `undefined` if `index < 0` or `index >= this.scoreCount()`.
	 */
	ScoreList.prototype.scoreAt = function (index) {
		return this.scores[index];
	};

	return ScoreList;
})();

/**
 * Provides connection to a score database.
 *
 * Throws an exception if `baseUri` is not a string.
 *
 * Promise
 * -------
 *
 * {{#crossLink "RecordBase/requestScores:method"}}{{/crossLink}} and
 * {{#crossLink "RecordBase/registerScore:method"}}{{/crossLink}} will be
 * performed asynchronously and return a `Promise`.
 *
 * If the request has succeeded, `done` will be invoked with the following
 * argument,
 *  1. A {{#crossLink "ScoreList"}}{{/crossLink}}
 *
 * If the request has failed, `fail` will be invoked with the following
 * argument,
 *  1. An object which represents an error
 *
 * @class RecordBase
 * @constructor
 * @param baseUri {string}
 *     The URI of the database.
 */
RecordBase = (function () {
	function RecordBase(baseUri) {
		var self = this;

		if (typeof baseUri !== 'string') {
			throw new Error('baseUri must be a string');
		}

		/**
		 * Requests the list of scores in the database.
		 *
		 * The top 10 scores will be requested.
		 *
		 * @method requestScores
		 * @return {Promise}
		 *     A promise object to obtain the results of the request.
		 */
		self.requestScores = function () {
			var request = $.Deferred();
			$.get(baseUri + '/record?from=0&to=10')
				.done(forwardScoreListTo(request))
				.fail(function (_, x, error) {
					request.reject(error);
				});
			return request.promise();
		};

		/**
		 * Registers a specified score to the database.
		 *
		 * Throws an exception if `score` is not
		 * a {{#crossLink "Score"}}{{/crossLink}}.
		 *
		 * @method registerScore
		 * @param score {Score}
		 *     The score to be registered.
		 * @return {Promise}
		 *     A promise object to obtain the results of the request.
		 */
		self.registerScore = function (score) {
			if (!Score.isClassOf(score)) {
				throw new Error('score must be a Score');
			}
			// the request will be resolved in 2 steps; authentication and post
			var request = $.Deferred();
			// an access token will be obtained by authentication
			$.ajax({
				url: baseUri + '/authenticate',
				headers: {
					'Authorization': 'Basic ' + btoa('guest:mikan')
				}
			}).done(function (tokenJson) {
				// posts the score with the access token
				$.ajax({
					url: baseUri + '/record?from=0&to=10',
					type: 'POST',
					headers: {
						'Authorization': 'Bearer ' + tokenJson.token
					},
					contentType: 'application/json',
					data: JSON.stringify({
						value:  score.value,
						level:  score.level,
						player: score.player,
						date:   score.date
					})
				}).done(
					forwardScoreListTo(request)
				).fail(function (_, _, error) {
					request.reject(error);
				});
			}).fail(function (_, _, error) {
				request.reject(error);
			});
			return request.promise();
		};

		/**
		 * Returns a function which forwards a `ScoreList` returned from
		 * the server to a specified `Deferred`.
		 *
		 * @method forwardScoreListTo
		 * @param deferred {Deferred}
		 *     The `Deferred` which processes a `ScoreList`.
		 * @return {function}
		 *     A callback function which accepts a response object.
		 */
		function forwardScoreListTo(deferred) {
			return function (scoresJson) {
				try {
					// scoresJson must be a ScoreList
					if (!ScoreList.canAugment(scoresJson)) {
						throw new Error('Invalid response from server: '
										+ scoreJson);
					}
					deferred.resolve(ScoreList.augment(scoresJson));
				} catch (err) {
					deferred.reject(err);
				}
			};
		}
	}

	return RecordBase;
})();

/**
 * The main scene of the game.
 *
 * `canvas` will be resized so that it fits the `MainScene`.
 *
 * An `Actor` which spawns grabbed items will be scheduled initially.
 *
 * Throws an exception
 *  - if `canvas` is not an `Element`,
 *  - or if `canvas` is not a `GamePad`,
 *  - or if `statistics` is not a `Statistics`,
 *  - or if `difficulty` is not a `Difficulty`
 *
 * Events
 * ------
 *
 * A `MainScene` will notify events to its observers. Observers will receive
 * at least the following arguments,
 *  1. Event ID: A string which tells the event type
 *  2. The instance of `MainScene`
 *
 * An event ID will be one of the following,
 *  - "gameEnded":
 *    Notified when the game has ended.
 *    Observers will receive no additional arguments.
 *
 * @class MainScene
 * @contructor
 * @extends ActorScheduler
 * @uses DirectionListener
 * @uses Observable
 * @param canvas {Element, GamePad}
 *     The canvas element on which the `MainScene` is to be rendered.
 *     This must be a `GamePad` at the same time.
 * @param statistics {Statistics}
 *     The `Statistics` of the game.
 * @param difficulty {Difficulty}
 *     The `Difficulty` of the game.
 */
MainScene = (function () {
	function MainScene(canvas, statistics, difficulty) {
		var self = this;

		ActorScheduler.call(self);
		Observable.call(self);

		// verifies the arguments
		if (!(canvas instanceof Element)) {
			throw 'canvas must be an Element';
		}
		if (!GamePad.isClassOf(canvas)) {
			throw 'canvas must be a GamePad';
		}
		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}
		if (!Difficulty.isClassOf(difficulty)) {
			throw 'difficulty must be a Difficulty';
		}

		/**
		 * The mikan box.
		 *
		 * @property mikanBox
		 * @type {MikanBox}
		 * @private
		 */
		var mikanBox;

		/**
		 * The actor which spawns grabbed items.
		 *
		 * The priority is `ActorPriorities.SPAWN`.
		 *
		 * Items will be determined by `difficulty.nextItem`.
		 * They will be centered and start falling from just above this mikan
		 * box.
		 *
		 * @property spawner
		 * @type {Actor, Renderable}
		 * @private
		 */
		var grabbedItems;
		var rotation;  // please refer to `updateRotation`
		var spawner = new Actor(ActorPriorities.SPAWN, function (scheduler) {
			// makes sure that the center of the mikan box vacant
			var center = Math.floor(mikanBox.columnCount / 2);
			if (!mikanBox.itemIn(center, mikanBox.rowCount - 1)) {
				grabbedItems = new Array(2);
				var x = center * mikanBox.cellSize;
				for (var i = 0; i < 2; ++i) {
					var item = difficulty.nextItem();
					var y = -(mikanBox.cellSize * (i + 1));
					item.locate(x, y);
					grabbedItems[i] = item;
				}
				rotation = 0;
				self.schedule(gravity);
				self.schedule(spawner);
			} else {
				// game over
				self.notifyObservers('gameEnded', self);
			}
		});

		/**
		 * An actor which moves grabbed items downward.
		 *
		 * The priority is `ActorPriorities.CONTROL`.
		 *
		 * Also is a renderable which renders grabbed items.
		 *
		 * @property gravity
		 * @type {Actor, Renderable}
		 * @private
		 */
		var gravity = new Actor(ActorPriorities.CONTROL, function (scheduler) {
			if (grabbedItems) {
				grabbedItems.forEach(function (item) {
					item.y += difficulty.speed;
				});
				// releases grabbed items if they reach the ground
				var bottom = Math.max(grabbedItems[0].y, grabbedItems[1].y);
				bottom += mikanBox.cellSize - 1;
				bottomRow = mikanBox.rowAt(bottom);
				var moved = false;
				if (bottomRow >= 0) {
					// releases grabbed items if they reach the fixed items
					var left  = Math.min(grabbedItems[0].x, grabbedItems[1].x);
					var right = Math.max(grabbedItems[0].x, grabbedItems[1].x);
					var leftColumn  = mikanBox.columnAt(left);
					var rightColumn = mikanBox.columnAt(right);
					if (!mikanBox.itemIn(leftColumn, bottomRow)
						&& !mikanBox.itemIn(rightColumn, bottomRow))
					{
						moved = true;
					}
				}
				if (moved) {
					self.schedule(this);
				} else {
					doReleaseControl(true);
				}
			}
		});
		Renderable.call(gravity, function (context) {
			grabbedItems.forEach(function (item) {
				item.render(context);
			});
		});

		/**
		 * Resets this `MainScene`.
		 *
		 * @method reset
		 */
		self.reset = function () {
			mikanBox = new MikanBox(MainScene.COLUMN_COUNT,
									MainScene.ROW_COUNT,
									MainScene.ROW_MARGIN,
									MainScene.CELL_SIZE,
									statistics);
			grabbedItems = null;
			self.actorQueue = [spawner];
		};
		self.reset();

		// resizes `canvas`
		canvas.width  = mikanBox.width;
		canvas.height = mikanBox.height;

		/**
		 * Renders this scene.
		 *
		 * Renders `Renderable` actors scheduled in this `ActorScheduler`.
		 *
		 * @method render
		 */
		self.render = function () {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			mikanBox.render(context);
			// renders renderable actors
			self.actorQueue.forEach(function (actor) {
				if (Renderable.isClassOf(actor)) {
					actor.render(context);
				}
			});
		};

		/**
		 * Schedules to move grabbed items left.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method moveLeft
		 */
		self.moveLeft = function () {
			scheduleInput(doMoveLeft);
		};

		/**
		 * Schedules to move grabbed items right.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method moveRight
		 */
		self.moveRight = function () {
			scheduleInput(doMoveRight);
		};

		/**
		 * Schedules to rotate grabbed items clockwise.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method rotateClockwise
		 */
		self.rotateClockwise = function () {
			scheduleInput(doRotateClockwise);
		};

		/**
		 * Schedules to rotate grabbed items counter-clockwise.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method rotateCounterClockwise
		 */
		self.rotateCounterClockwise = function () {
			scheduleInput(doRotateCounterClockwise);
		};

		/**
		 * Schedules to frees grabbed items.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method releaseControl
		 */
		self.releaseControl = function () {
			scheduleInput(doReleaseControl);  // align=false
		};

		// receives directions from `canvas`
		canvas.addDirectionListener(self);

		// Schedules a specified function as an input Actor.
		function scheduleInput(input) {
			self.schedule(new Actor(-1, function () {
				try {
					input();
				} catch (err) {
					console.error(err);
				}
			}));
		};

		// Moves grabbed items left.
		function doMoveLeft() {
			if (grabbedItems) {
				// makes sure that the grabbed items are not on the left edge
				var left = Math.min(grabbedItems[0].x, grabbedItems[1].x);
				left -= mikanBox.cellSize;
				var leftColumn = mikanBox.columnAt(left);
				if (leftColumn >= 0) {
					// makes sure that no item is placed at the left of
					// the grabbed items
					var bottom = Math.max(grabbedItems[0].y, grabbedItems[1].y);
					bottom += mikanBox.cellSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.itemIn(leftColumn, bottomRow)) {
						grabbedItems.forEach(function (item) {
							item.translate(-mikanBox.cellSize, 0);
						});
					}
				}
			}
		};

		// Moves grabbed items rights.
		function doMoveRight() {
			if (grabbedItems) {
				// makes sure that the grabbed items are not on the right edge
				var right = Math.max(grabbedItems[0].x, grabbedItems[1].x);
				right += mikanBox.cellSize;
				var rightColumn = mikanBox.columnAt(right);
				if (rightColumn < mikanBox.columnCount) {
					// makes sure that no item is placed at the right of
					// the grabbed items
					var bottom = Math.max(grabbedItems[0].y, grabbedItems[1].y);
					bottom += mikanBox.cellSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.itemIn(rightColumn, bottomRow)) {
						grabbedItems.forEach(function (item) {
							item.translate(mikanBox.cellSize, 0);
						});
					}
				}
			}
		};

		// Rotates grabbed items clockwise.
		function doRotateClockwise() {
			if (grabbedItems) {
				var newRotation = rotation + 1;
				if (newRotation == 4) {
					newRotation = 0;
				}
				updateRotation(newRotation);
			}
		};

		// Rotates grabbed items counter-clockwise.
		function doRotateCounterClockwise() {
			if (grabbedItems) {
				var newRotation = rotation - 1;
				if (newRotation < 0) {
					newRotation = 3;
				}
				updateRotation(newRotation);
			}
		};

		// Updates the rotation of grabbed items.
		function updateRotation(newRotation) {
			var newX0, newY0, newX1, newY1;
			// rotates only grabbedItems[1]
			newX0 = grabbedItems[0].x;
			newY0 = grabbedItems[0].y;
			switch(newRotation) {
			case 0:
				// 1
				// 0
				newX1 = newX0;
				newY1 = newY0 - mikanBox.cellSize;
				break;
			case 1:
				// 0 1
				newX1 = newX0 + mikanBox.cellSize;
				newY1 = newY0;
				break;
			case 2:
				// 0
				// 1
				newX1 = newX0;
				newY1 = newY0 + mikanBox.cellSize;
				break;
			case 3:
				// 1 0
				newX1 = newX0 - mikanBox.cellSize;
				newY1 = newY0;
				break;
			default:
				console.error('invalid rotation: ' + newRotation);
			}
			// adjusts the location so that
			// items are in the box and do not collide with other items
			var left    = mikanBox.columnAt(Math.min(newX0, newX1));
			var right   = mikanBox.columnAt(Math.max(newX0, newX1));
			var bottomY = Math.max(newY0, newY1) + mikanBox.cellSize - 1;
			var row     = mikanBox.rowAt(bottomY);
			if (newRotation == 2) {
				if (row < 0) {
					var dY = mikanBox.height - bottomY;
					newY0 += dY;
					newY1 += dY;
					row = 0;
				} else if (mikanBox.itemIn(left, row)) {
					var dY = mikanBox.topYOf(row) - bottomY;
					newY0 += dY;
					newY1 += dY;
					++row;
				}
			} else {
				if (left < 0 || mikanBox.itemIn(left, row)) {
					newX0 += mikanBox.cellSize;
					newX1 += mikanBox.cellSize;
					++left;
					++right;
				}
				if (right >= mikanBox.columnCount
					|| mikanBox.itemIn(right, row))
				{
					newX0 -= mikanBox.cellSize;
					newX1 -= mikanBox.cellSize;
					--left;
					--right;
				}
			}
			// makes sure that the new location
			// is in the mikan box and do not collide with other items
			if (row >= 0
				&& row < mikanBox.rowCount
				&& left >= 0
				&& right < mikanBox.columnCount
				&& !mikanBox.itemIn(left, row)
				&& !mikanBox.itemIn(right, row))
			{
				// makes sure that no item is placed at the new location
				grabbedItems[0].x = newX0;
				grabbedItems[0].y = newY0;
				grabbedItems[1].x = newX1;
				grabbedItems[1].y = newY1;
				rotation = newRotation;
			}
		}

		/**
		 * Releases control of grabbed items.
		 *
		 * @method doReleaseControl
		 * @private
		 * @param align {boolean}
		 *     Whether items are aligned to cells.
		 */
		function doReleaseControl(align) {
			if (grabbedItems) {
				// places the items
				grabbedItems.forEach(function (item) {
					var column = mikanBox.columnAt(item.x);
					var row    = mikanBox.rowAt(item.y);
					try {
						mikanBox.place(item, column, row, align);
					} catch (err) {
						console.error(err);
					}
				});
				grabbedItems = null;
				// schedules to drop items and erase mikans
				mikanBox.scheduleToDrop(self);
				mikanBox.scheduleToErase(self);
			}
		}
	}
	ActorScheduler.augment(MainScene.prototype);
	Observable.augment(MainScene.prototype);

	/**
	 * The number of columns in a mikan box.
	 *
	 *     MainScene.COLUMN_COUNT = 8
	 *
	 * @property COLUMN_COUNT
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'COLUMN_COUNT', { value: 8 });

	/**
	 * The number of rows in a mikan box.
	 *
	 *     MainScene.ROW_COUNT = 12
	 *
	 * @property ROW_COUNT
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'ROW_COUNT', { value: 12 });

	/**
	 * The number of extra rows.
	 *
	 *     MainScene.ROW_MARGIN = 8
	 *
	 * @property ROW_MARGIN
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'ROW_MARGIN', { value: 8 });

	/**
	 * The size of each cell in a mikan box.
	 *
	 *     MainScene.CELL_SIZE = 32
	 *
	 * @property CELL_SIZE
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'CELL_SIZE', { value: 32 });

	return MainScene;
})();

/**
 * A canvas which renders queued items.
 *
 * `canvas` will be resized so that it fits the `ItemQueue`.
 *
 * `difficulty.nextItem` will be overridden so that `ItemQueue` can look ahead
 * items.
 *
 * Throws an exception
 *  - if `canvas` is not an `Element`,
 *  - or if `rowCount` is not a number,
 *  - or if `difficulty` is not a `Difficulty`
 *
 * @class ItemQueue
 * @constructor
 * @extends ActorScheduler
 * @param canvas {Element}
 *     The canvas to be associated with the `ItemQueue`.
 * @param rowCount {number}
 *     The number of visible items.
 * @param difficulty {Difficulty}
 *     The `Difficulty` which determines items to fall.
 */
ItemQueue = (function () {
	// the falling speed of mikans
	var FALLING_SPEED = 15;

	function ItemQueue(canvas, rowCount, difficulty) {
		var self = this;

		ActorScheduler.call(self);

		if (!(canvas instanceof Element)) {
			throw 'canvas must be an Element';
		}
		if (typeof rowCount !== 'number') {
			throw 'rowCount must be a number';
		}
		if (!Difficulty.isClassOf(difficulty)) {
			throw 'difficulty must be a Difficulty';
		}

		// resizes `canvas`
		canvas.width  = ItemQueue.CELL_SIZE;
		canvas.height = rowCount * ItemQueue.CELL_SIZE;

		// looks ahead items
		var queue = [];
		for (var i = 0; i < rowCount; ++i) {
			pushItem(difficulty.nextItem());
		}

		// overrides `difficulty.nextItem` so that it returns the first item in
		// `queue`
		Properties.override(difficulty, 'nextItem', function () {
			var item = popItem();
			pushItem(this.nextItem._super());
			return item;
		});

		/**
		 * Pushes a specified item into `queue`.
		 *
		 * `item` will be placed above the last item in `queue` unless `queue`
		 * is empty. Otherwise `item` will be placed just above this
		 * `ItemQueue`.
		 *
		 * `item` will become an actor which falls toward the ground and
		 * be scheduled in this `ActorScheduler`.
		 *
		 * @method pushItem
		 * @private
		 * @param item {Item}
		 *     The item to be pushed into `queue`.
		 */
		function pushItem(item) {
			if (queue.length > 0) {
				var lastItem = queue[queue.length - 1];
				item.x = 0;
				item.y = lastItem.y - ItemQueue.CELL_SIZE;
				item.dstY = lastItem.dstY - ItemQueue.CELL_SIZE;
			} else {
				item.x = 0;
				item.y = -ItemQueue.CELL_SIZE;
				item.dstY = (rowCount - 1) * ItemQueue.CELL_SIZE;
			}
			queue.push(item);
			Actor.call(item, 0, function (scheduler) {
				var newY = this.y + FALLING_SPEED;
				if (newY > this.dstY) {
					newY = this.dstY;
				}
				this.y = newY;
				scheduler.schedule(this);
			});
			self.schedule(item);
		}

		/**
		 * Pops the first item in `queue`.
		 *
		 * The popped item will also be removed from this `ActorScheduler`.
		 *
		 * @method popItem
		 * @private
		 * @return {Item}
		 *     The first item in `queue`.
		 */
		function popItem() {
			var item = queue.shift();
			queue.forEach(function (i) {
				i.dstY += ItemQueue.CELL_SIZE;
			});
			var idx = self.actorQueue.indexOf(item);
			self.actorQueue.splice(idx, 1);
			return item;
		}

		/**
		 * Renders this `ItemQueue`.
		 *
		 * Renders `Renderable` actors in this `ActorScheduler`.
		 *
		 * @method render
		 */
		self.render = function () {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			self.actorQueue.forEach(function (actor) {
				if (Renderable.isClassOf(actor)) {
					actor.render(context);
				}
			});
		};
	}
	ActorScheduler.augment(ItemQueue.prototype);

	/**
	 * The size (in pixels) of each cell.
	 *
	 *     ItemQueue.CELL_SIZE = 32
	 *
	 * @property CELL_SIZE
	 * @type {number}
	 */
	ItemQueue.CELL_SIZE = 32;

	return ItemQueue;
})();

/**
 * The instance of the game.
 *
 * Scenarios
 * ---------
 *
 * ### The cycle of the game
 *
 *  1. A `MainScene` is presented.
 *  2. The `MainScene` presents a `MikanBox`.
 *  3. A player can see which items will be dropped in an `ItemQueue`.
 *  4. Two grabbed items appear at the top of the `MikanBox`. They can be any
 *     combination of the followings,
 *      - A randomly damaged mikan
 *      - A preservative
 *  5. The grabbed items fall toward the bottom of the `MikanBox` (ground).
 *     The player can control the grabbed items during they are falling.
 *  6. The grabbed items stop falling when either of them reaches the ground
 *     or a fixed item.
 *  7. The grabbed items become free.
 *  8. The free items fall toward the ground.
 *  9. Each of the free items stops falling and becomes fixed when it reaches
 *     the ground or a fixed item. This steps continues until all of the free
 *     items are fixed.
 *  10. Maximally damaged mikans are chained.
 *  11. Back to the step 3.
 *
 * #### Derivative
 *
 *  - 4 Stacked items have reached the top of the `MikanBox`.
 *       1. The game ends.
 *       2. The player is prompted to enter his/her name and choose if his/her
 *          score is sent to the server.
 *       3. The player can see the rank of his/her score.
 *       4. END
 *
 *  - 10 Some of the chains reaches or exceeds the limit length (active chains).
 *       1. Mikans composing the active chains explode and disappear.
 *       2. The player earns points.
 *       3. If the number of erased mikans reaches the criteria of the current
 *          game level, the game level increases.
 *       4. Mikans surrounding the active chains are spoiled. But if there are
 *          preservatives next to mikans, such mikans are not spoiled and
 *          preservatives next to them are spoiled instead.
 *       5. Maximally damaged preservatives disappear.
 *       6. Items not placed on the ground or fixed items become free.
 *       7. Back to the step 7 of the main scenario.
 *
 * Events
 * ------
 *
 * A `Game` notifies events to its observers. Observers will receive at least
 * the following arguments,
 *  1. Event ID: A string which tells the event type
 *  2. The instance of `Game`
 *
 * An event ID can be one of the following,
 *  - "gameEnded":
 *    Notified when the game has ended.
 *    Observers will receive the following additional argument,
 *     1. Statistics of the last game
 *
 * @class Game
 * @constructor
 * @extends Observable
 */
Game = (function () {
	function Game() {
		var self = this;

		Observable.call(self);
	}
	Observable.augment(Game.prototype);

	/**
	 * Starts the game.
	 *
	 * Throws an exception
	 *  - if `mainScene` is not an `Element`,
	 *  - or if `mainScene` is not a `GamePad`,
	 *  - or if `itemQueue` is not an `Element`,
	 *  - or if `resourceManager` is not a `ResourceManager`,
	 *  - or if `statistics` is not a `Statistics`,
	 *  - or if `difficulty` is not a `Difficulty`
	 *
	 * @method start
	 * @static
	 * @param mainScene {Element, GamePad}
	 *     The canvas element on which the game will be rendered.
	 *     This must be a `GamePad` at the same time.
	 * @param itemQueue {Element}
	 *     The canvas element on which the queued items will be rendered.
	 * @param resourceManager {ResourceManager}
	 *     The `ResouceManager` which resolves resources.
	 * @param statistics {Statisitcs}
	 *     The `Statistics` of the game.
	 * @param difficulty {Difficulty}
	 *     The `Difficulty` of the game.
	 * @return {Game}
	 *     A new instance of `Game`.
	 */
	Game.start = function (mainScene,
						   itemQueue,
						   resourceManager,
						   statistics,
						   difficulty)
	{
		// verifies arguments
		if (!(mainScene instanceof Element)) {
			throw 'mainScene must be an Element';
		}
		if (!GamePad.isClassOf(mainScene)) {
			throw 'mainScene must be a GamePad';
		}
		if (!(itemQueue instanceof Element)) {
			throw 'itemQueue must be an Element';
		}
		if (!ResourceManager.isClassOf(resourceManager)) {
			throw 'resourceManager must be a ResourceManager';
		}
		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statisitcs';
		}
		if (!Difficulty.isClassOf(difficulty)) {
			throw 'difficulty must be a Difficulty';
		}

		var game = new Game();
		// loads the resources
		Resources.loadSprites(resourceManager);
		// creates a MainScene associated with `mainScene`
		game.mainScene = new MainScene(mainScene, statistics, difficulty);
		game.mainScene.addObserver(function (id) {
			if (id == 'gameEnded') {
				game.notifyObservers('gameEnded', game, statistics);
			}
		});
		// creates an ItemQueue associated with `itemQueue`
		game.itemQueue = new ItemQueue(itemQueue, 4, difficulty);
		// runs the game loop
		window.setInterval(function () {
			game.mainScene.run();
			game.itemQueue.run();
			game.mainScene.render();
			game.itemQueue.render();
		}, Game.FRAME_INTERVAL);
		return game;
	};

	/** Restarts the game. */
	Game.prototype.restart = function () {
		this.mainScene.reset();
	};

	/**
	 * The interval between frames (in milliseconds).
	 *
	 *     Game.FRAME_INTERVAL = 40
	 *
	 * @property FRAME_INTERVAL
	 * @type {number}
	 * @static
	 */
	Game.FRAME_INTERVAL = 40;

	return Game;
})();

/**
 * A `GamePad` implemented for touch events.
 *
 * This constructor should be invoked in the context of an `HTMLElement`.
 * You should use `attachTo` function instead of this constructor.
 *
 * Throws an exception if `this` is not an `EventTarget`.
 *
 * @class TouchGamePad
 * @constructor
 * @extends GamePad
 * @param canvas {canvas EventTarget}
 *     The canvas element to attach.
 */
TouchGamePad = (function () {
	function TouchGamePad() {
		var self = this;

		GamePad.call(self);

		// verifies this object
		if (!('addEventListener' in self)) {
			throw 'canvas must be an EventTarget';
		}

		// listens touch events of this canvas
		self.addEventListener('touchstart',  handleTouchStart, false);
		self.addEventListener('touchmove',   handleTouchMove,  false);
		self.addEventListener('touchend',    handleTouchEnd,   false);
		self.addEventListener('touchleave',  handleTouchEnd,   false);
		self.addEventListener('touchcancel', handleTouchEnd,   false);

		// the ID of touch being tracked
		var touchId = -1;
		// the last touched location
		var x, y;
		// when touch started
		var touchTimeStamp = 0;
		// whether touch has moved
		var moved = false;

		// starts tracking touch
		function handleTouchStart(evt) {
			if (touchId === -1) {
				evt.preventDefault();
				// remembers the initial touch information
				var touch = evt.changedTouches[0];
				touchId = touch.identifier;
				x = touch.pageX;
				y = touch.pageY;
				touchTimeStamp = evt.timeStamp;
				moved = false;
			}
		}

		// tracks touch
		function handleTouchMove(evt) {
			var touches = evt.changedTouches;
			for (var i = 0; i < touches.length; ++i) {
				var touch = touches[i];
				if (touch.identifier === touchId) {
					evt.preventDefault();
					// interprets the motion
                    var dX = touch.pageX - x;
                    var dY = touch.pageY - y;
                    var direction;
                    if (Math.abs(dX) > Math.abs(dY)) {
                        if (Math.abs(dX)
							> TouchGamePad.HORIZONTAL_SENSITIVITY)
						{
                            if (dX < 0) {
                                direction = 'moveLeft';
                            } else {
                                direction = 'moveRight';
                            }
                        }
                    } else {
                        if (Math.abs(dY) > TouchGamePad.VERTICAL_SENSITIVITY) {
                            if (dY < 0) {
                                direction = 'rotateCounterClockwise';
                            } else {
                                direction = 'rotateClockwise';
                            }
                        }
                    }
					// notifies `DirectionListener`s
					// and updates the tracking record
					// if there is a direction
                    if (direction) {
						self.sendDirection(direction);
                        moved = true;
                        x = touch.pageX;
                        y = touch.pageY;
                    }
				}
			}
		}

		// ends tracking touch
		function handleTouchEnd(evt) {
			var touches = evt.changedTouches;
			for (var i = 0; i < touches.length; ++i) {
				var touch = touches[i];
				if (touch.identifier === touchId) {
					evt.preventDefault();
					// seizes tracking
					touchId = -1;
					// releases the control if the user has tapped
					if (!moved) {
						var interval = evt.timeStamp - touchTimeStamp;
						if (interval <= TouchGamePad.MAX_TAP_INTERVAL) {
							self.sendDirection('releaseControl');
						}
					}
				}
			}
		}
	}

	/**
	 * Attaches the features of `TouchGamePad` to a specified canvas element.
	 *
	 * The following properties of `canvas` will be overwritten,
	 *  - addDirectionListener
	 *  - removeDirectionListener
	 *
	 * Throws an exception
	 *  - if `canvas` is not specified,
	 *  - or if `canvas` does not have `addEventListener` method
	 *
	 * @method attachTo
	 * @static
	 * @param canvas {HTMLElement}
	 *     The canvas element to attach.
	 * @return {HTMLElement}
	 *     `canvas`.
	 */
	TouchGamePad.attachTo = function (canvas) {
		if (canvas == null) {
			throw 'canvas must be specified';
		}
		TouchGamePad.call(canvas);
		return canvas;
	};

	/**
	 * The sensitivity (in pixels) on a horizontal swipe.
	 *
	 * The default is 15.
	 *
	 * @property HORIZONTAL_SENSITIVITY
	 * @type number
	 */
	TouchGamePad.HORIZONTAL_SENSITIVITY = 15;

	/**
	 * The sensitivity (in pixels) on a vertical swipe.
	 *
	 * The default is 30.
	 *
	 * @property VERTICAL_SENSITIVITY
	 * @type number
	 */
	TouchGamePad.VERTICAL_SENSITIVITY = 30;

	/**
	 * The maximum interval (in milliseconds) between touch start and end,
	 * which is interpreted as a tap.
	 *
	 * The default is 200.
	 *
	 * @property MAX_TAP_INTERVAL
	 * @type number
	 */
	TouchGamePad.MAX_TAP_INTERVAL = 200;

	// the following is only for documentation
	/**
	 * *TouchGamePad specific behavior.*
	 *
	 * `listener` will receive,
	 *  - `moveLeft`:               when a user swiped leftward
	 *  - `moveRight`:              when a user swiped rightward
	 *  - `rotateClockwise`:        when a user swiped downward
	 *  - `rotateCounterClockwise`: when a user swiped upward
	 *  - `releaseControl`:         when a user tapped
	 *
	 * @method addDirectionListener
	 */

	return TouchGamePad;
})();

/**
 * A `GamePad` implemented for key inputs.
 *
 * You should use `attachTo` instead of this constructor.
 *
 * Throws an exception if `target` is not an `EventTarget`.
 *
 * @class KeyGamePad
 * @constructor
 * @extends GamePad
 * @param target {EventTarget}
 *     The `EventTarget` on which key events are interpreted.
 */
KeyGamePad = (function () {
	function KeyGamePad(target) {
		var self = this;

		GamePad.call(self);

		// verifies the argument
		if (!('addEventListener' in target)) {
			throw 'target must be an EventTarget';
		}

		// processes key down events on this canvas
		target.addEventListener('keydown', handleKeyDown, false);

		// handles a key down event
		function handleKeyDown(evt) {
			var direction;
			if ('key' in evt) {
				switch (evt.key) {
				case 'ArrowLeft':
				case 'Left':
					direction = 'moveLeft';
					break;
				case 'ArrowRight':
				case 'Right':
					direction = 'moveRight';
					break;
				case 'ArrowDown':
				case 'Down':
					direction = 'rotateClockwise';
					break;
				case 'ArrowUp':
				case 'Up':
					direction = 'rotateCounterClockwise';
					break;
				case 'Spacebar':
				case ' ':
					direction = 'releaseControl';
					break;
				}
			} else {
				switch (evt.keyCode) {
				case 0x25:
					// arrow left
					direction = 'moveLeft';
					break;
				case 0x27:
					// arrow right
					direction = 'moveRight';
					break;
				case 0x28:
					// arrow down
					direction = 'rotateClockwise';
					break;
				case 0x26:
					// arrow up
					direction = 'rotateCounterClockwise';
					break;
				case 0x20:
					// space
					direction = 'releaseControl';
					break;
				}
			}
			// sends the direction to `DirectionListener`s if it exists
			if (direction) {
				evt.preventDefault();
				self.sendDirection(direction);
			}
		}
	}

	/**
	 * Attaches the features of `KeyGamePad` to a specified canvas.
	 *
	 * The following properties of `canvas` will be overwritten,
	 *  - addDirectionListener
	 *  - removeDirectionListener
	 *
	 * Throws an exception
	 *  - if `obj` is not specified,
	 *  - or if `target` is not an `EventTarget`
	 *
	 * @method attachTo
	 * @static
	 * @param obj {object}
	 *     The object to attach.
	 * @param target {EventTarget}
	 *     The `EventTarget` on which key events are interpreted.
	 * @return {object}
	 *     `obj`.
	 */
	KeyGamePad.attachTo = function (obj, target) {
		if (obj == null) {
			throw 'obj must be specified';
		}
		KeyGamePad.call(obj, target);
		return obj;
	};

	// the following is only for documentation
	/**
	 * *KeyGamePad specific behavior.*
	 *
	 * `listener` will receive,
	 *  - `moveLeft`:               when a user pressed a left arrow key
	 *  - `moveRight`:              when a user pressed a right arrow key
	 *  - `rotateClockwise`:        when a user pressed a down arrow key
	 *  - `rotateCounterClockwise`: when a user pressed a up arrow key
	 *  - `releaseControl`:         when a user pressed a spacebar
	 *
	 * @method addDirectionListener
	 */

	return KeyGamePad;
})();
