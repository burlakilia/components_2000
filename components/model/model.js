(function () {
	'use strict';

	class Model {
		constructor({resource, data = {}}) {
			this.resource = resource;
			this._handlers = {};

			this.setData(data);
		}

		setData (data) {
			this._data = data;
			this.trigger('update', this._data);
		}

		getData () {
			return this._data;
		}

		fetch () {
			this._makeRequset('GET', this.resource, this._onFetch.bind(this));
		}

		save () {
			this._makeRequset('PUT', this.resource, this._onSave.bind(this));
		}

		on (name, callback) {
			if (!this._handlers[name]) {
				this._handlers[name] = [];
			}

			this._handlers[name].push(callback);
		}

		trigger (name, data) {
			if (this._handlers[name]) {
				this._handlers[name].forEach(callback => callback(data));
			}
			
		}

		_onFetch (data, xhr) {
			this.trigger('fetch', xhr);
			this.setData(data);
		}

		_onSave (data, xhr) {
			this.trigger('save');
		}

		_makeRequset (method, resource, callback) {
			let xhr = new XMLHttpRequest();
			xhr.open(method, resource, true);
			xhr.onreadystatechange = () => {
				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200) {
					let data = JSON.parse(xhr.responseText);

					callback(data, xhr);
				}
			}

			let data = null;

			if (method === 'PUT') {
				data = JSON.stringify(this.getData());
			}

			xhr.send(data);
		}
	}


	//export
	window.Model = Model;

})();