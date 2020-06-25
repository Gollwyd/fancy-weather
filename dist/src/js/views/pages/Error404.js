const Error404 = {

  render: async () => {
    const view = /* html */`
            <section class="section">
                <h1> 404 Error </h1>
            </section>
        `;
    return view;
  },
  afterRender: async () => {
  },
};
export default Error404;
