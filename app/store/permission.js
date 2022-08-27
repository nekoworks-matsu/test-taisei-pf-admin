import request from 'superagent'

export const permission = {

    getMenus () {
      const url = process.env.API_SERVER + '/members/menus'
        request
          .get(url)
          .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
          .send()
          .end((err, res) => {
            if (res.ok) {
              console.log('getMenus ok');
              localStorage.setItem('menus', JSON.parse(res.text).menus);
            }
          });
    },

    getItems () {
      const url = process.env.API_SERVER + '/members/items'
        request
          .get(url)
          .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
          .send()
          .end((err, res) => {
            if (res.ok) {
              console.log('getItems ok');
              localStorage.setItem('items', JSON.stringify(JSON.parse(res.text).items));
            }
          });
    },

    hasMenu (key = null) {
      const menus = localStorage.getItem('menus').split(',');
      return key && menus.includes(key);
    },

    hasItem (key = null) {
      const items = JSON.parse(localStorage.getItem('items'));
      return key && items[key];
    },

    init () {
      this.getItems();
      this.getMenus();
    },

    clear () {
      localStorage.removeItem('menus');
      localStorage.removeItem('items');
    }
}