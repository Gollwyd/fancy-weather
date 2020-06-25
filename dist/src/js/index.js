// import App from '@modules/app';
// import appConfig from '@settings/appConfig';
// import apiConfig from '@settings/apiConfig';

import '../css/style.scss'; // общий файл стилей
import '../css/pages/module.scss';

// Все страницы - по одному импорту на одну страницу
import Home from './views/pages/Home';
import Login from './views/pages/Login';
import Statistics from './views/pages/Statistics';
import Dictionary from './views/pages/Dictionary';
import Games from './views/pages/Games';
import Promo from './views/pages/Promo';
import Team from './views/pages/Team';

import Error404 from './views/pages/Error404';

// Все компоненты - общие элементы, которые могут использоваться на нескольких страницах
import Header from './views/components/Header';
import Footer from './views/components/Footer';

// Файлы-хелперы
import Utils from './services/Utils';

// Импорт модели
import AppModel from './model/AppModel';

const model = new AppModel();

// список всех маршрутов (routes) в формате:
// 'маршрут' : 'файл страницы для этого маршрута'
const routes = {
  '/': Home, // Главная,
  '/login': Login, // Авторизация/Регистрация
  '/stats': Statistics, // Статистика,
  '/dictionary/:id': Dictionary, // Словарь,
  '/games/:id': Games, // Мини-игры,
  '/promo': Promo, // О приложении,
  '/team': Team, // О команде,

};

// роутер - разбирает ссылку из адресной строки, ищет совпадение
// в объекте routes, загружает соответствующий элемент
// header и footer - общие для всех страниц элементы
// content - уникальная разметка/код, которую должна генерировать каждая страница
const router = async () => {
  const header = null || document.querySelector('.header');
  const content = null || document.querySelector('.content');
  const footer = null || document.querySelector('.footer');

  // для каждого элемента вызывается метод render(), чтобы создать html-разметку,
  // а затем - afterRender(), чтобы повесить на разметку обработчики событий
  header.innerHTML = await Header.render();
  await Header.afterRender();
  footer.innerHTML = await Footer.render();
  await Footer.afterRender();

  // парсинг url
  const request = Utils.parseRequestURL();

  // Parse the URL and if it has an id part, change it with the string ":id"
  const resource = request.resource ? `/${request.resource}` : '/';
  const id = request.id ? '/:id' : '';
  const verb = request.verb ? `/${request.verb}` : '';

  const parsedURL = `${resource}${id}${verb}`;

  // Найти совпадение в объекте routes, и загрузить нужную страницу (или 404, если совпадения нет)
  const page = routes[parsedURL] ? routes[parsedURL] : Error404;
  content.innerHTML = await page.render(model);
  await page.afterRender();
};

// слушатель на изменение текста за хэштегом в адресной строке
window.addEventListener('hashchange', router);

// слушатель на загрузку страницы
window.addEventListener('load', router);
window.addEventListener('load', model.loadUserData());

// model.setDefaultUserData('defaultUser); - раскомменть чтобы сбросить данные на стартовые

// сохранение данных пользователя при закрытии страницы
window.addEventListener('beforeunload', model.saveUserData('defaultUser'));
