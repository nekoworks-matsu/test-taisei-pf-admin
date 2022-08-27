import request from 'superagent'

export default async ({store, redirect}) => {
  console.log('middleware:available');

  const member_id   = localStorage.getItem('member_id');
  const building_id = localStorage.getItem('buildings_id');
  if (member_id && building_id) {
    const url = process.env.API_SERVER + '/available/' + building_id
    request
      .get(url)
      .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      .send()
      .end((err, res) => {
        if (err) {
          const error = JSON.parse(err.response.text).error;
          console.log('Message: ' + error.message);

          localStorage.removeItem('buildings_id');
          if (localStorage.getItem('is_tablet') == "true"){
            return redirect('/t_login');
          }else{
            return redirect('/login');
          }
        }
        if (res.ok) {
          console.log('available ok');
        }
      });
  }
}