import request from 'request';
import Promise from 'bluebird';
// import CookieStore from 'tough-cookie-filestore';
// import { CookieJar as CookieJar } from 'tough-cookie';
// import touch from 'touch';
//
// const cookiesFileName = './cookies.json';
// touch.sync(cookiesFileName);
// const jar = new CookieJar(new CookieStore(cookiesFileName));
const jar = request.jar();
const r = request.defaults({ jar });

export const getRequest = Promise.promisify(r.get, {
  multiArgs: true,
});

export const postRequest = Promise.promisify(r.post, {
  multiArgs: true,
});

export default r;
