//import
import {Menu} from '../menu/menu';
import {Form} from  '../form/form';
import {Model} from '../model/model';

let menuModel = new Model({
	resource: 'https://javascriptru.firebaseio.com/menu/-KTz9cChFTqkGB2togiq.json',
	data: {}
});

let menu = new Menu({
	el: document.querySelector('.js-menu'),
	onPick (item = '') {},
	onRemove () {}
});

menuModel.on('update', data => {
	menu.setData(data);
	menu.render();
});


let form = new Form({
	el: document.querySelector('.js-form')
});

form.on('add', event => {
	let data = menuModel.getData();
	data.items.push(event.detail);
	menuModel.setData(data);

	menuModel.save();
});


form.disable();
menuModel.fetch().then(() => {
	form.enable();
});


//TODO: Сделать компоненту для нотификации о версии приложения
let xhr = new XMLHttpRequest();
xhr.open('GET', '/package.json', true);

xhr.onreadystatechange = function (event) {
	if (xhr.readyState !== 4) {
		return;
	}

	if (xhr.status === 200) {
		console.log('App vesrion is: ', JSON.parse(xhr.responseText).version);
	}
}

xhr.send();