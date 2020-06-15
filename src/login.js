/* eslint-disable no-alert */
import './login.css';
import start from './start';


async function logSign(form) {
  const aut = form.aut.value;
  try {
    const user = { email: form.name.value, password: form.password.value };
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/${aut}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();

    if (content.id) alert('Регистрация прошла успешно, можно входить');
    if (content.message === 'Authenticated') { start(content); }
  } catch (error) {
    if (aut === 'users') alert('Такой аккаунт уже существует'); else {
      alert('Пароль или email не верны');
    }
  }
}


export default async function login() {
  const promise = new Promise(((resolve) => {
    const loginBlock = document.createElement('div');
    loginBlock.classList.add('login');
    document.body.appendChild(loginBlock);
    const labelName = document.createElement('label');
    labelName.for = 'name';
    labelName.textContent = 'E-mail:';
    const name = document.createElement('input');
    name.type = 'email';
    name.id = 'name';
    name.name = 'name';
    name.tabIndex = 1;
    name.autofocus = true;
    name.required = true;
    const labelPassword = document.createElement('label');
    labelPassword.for = 'password';
    labelPassword.textContent = 'Password:';
    const password = document.createElement('input');
    password.type = 'password';
    password.id = 'password';
    password.name = 'password';
    password.required = true;
    const submit = document.createElement('input');
    const typeOfLog = document.createElement('div');
    typeOfLog.innerHTML = `
    <input type="radio" name="aut" value = "users"> Регистрация
    <input type="radio" name="aut" value="signin" checked>  Авторизация
    `;

    submit.type = 'submit';
    submit.value = 'Submit';
    const form = document.createElement('form');
    loginBlock.appendChild(form);
    form.appendChild(labelName);
    form.appendChild(name);
    form.appendChild(labelPassword);
    form.appendChild(password);
    form.appendChild(typeOfLog);
    form.appendChild(submit);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = form.password.value;
      const len = pass.length;
      if (len > 7) {
        const reg = RegExp(`(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[+-_@$!%*?&#.,;:[\\]{}])[0-9a-zA-Z+-_@$!%*?&#.,;:[\\]{}]{${len}}`);
        if (reg.test(form.password.value)) { resolve(logSign(form)); } else alert('пароль гной');
      } else alert('пароль короткий');
    });
  }));
  return promise;
}
