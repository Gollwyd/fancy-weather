import '../../../css/layout/footer.scss';

const Footer = {
  render: async () => {
    const view = /* html */`
    <div class="wrapper">
      <div class="footer__content">
        <div class="footer__links">
          <ul class="footer__navList">
            <li class="footer__navItem"><a href="#/games">Games</a></li>
            <li class="footer__navItem"><a href="#/dictionary">Dictionary</a></li>
            <li class="footer__navItem"><a href="#/statistic">Statistic</a></li>
            <li class="footer__navItem"><a href="#/about">About</a></li>
          </ul>
        </div>
        <div class="footer__copyright">
          <span>© 2020 RSSchool Students</span>
        </div>
      </div>
    </div>
        `;
    return view;
  },
  afterRender: async () => { },
};

export default Footer;
