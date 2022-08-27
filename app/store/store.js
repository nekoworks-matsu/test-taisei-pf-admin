const store = {
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userid");
    localStorage.removeItem("menu_name");
    localStorage.removeItem("menu_categories");
  },
  clearTablet() {
  	localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("menu_name");
    localStorage.removeItem("menu_categories");
  }
}
export { store }
