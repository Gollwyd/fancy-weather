import '../../../css/layout/header.scss';

const Header = {
  render: async () => {
    const view = /* html */`
    <div class="wrapper">
        <div class="header__content">
            <h1 class="header__logo"><a href="/#">RS Lang</a></h1>
            <nav class="header__nav">
                <ul class="header__navList">
                    <li class="header__navItem"><a href="#/games">Games</a></li>
                    <li class="header__navItem"><a href="#/dictionary">Dictionary</a></li>
                    <li class="header__navItem"><a href="#/statistic">Statistic</a></li>
                    <li class="header__navItem"><a href="#/about">About</a></li>
                </ul>
            </nav>
        </div>
    </div>
    `;
    return view;
  },
  afterRender: async () => { },

};

export default Header;
