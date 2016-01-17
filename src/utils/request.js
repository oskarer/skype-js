import request from 'request';
import CookieStore from 'tough-cookie-filestore';
import { CookieJar as CookieJar } from 'tough-cookie';
import touch from 'touch';

const cookiesFileName = './cookies.json';
touch.sync(cookiesFileName);
// const jar = new CookieJar(new CookieStore(cookiesFileName));
const jar = request.jar();

export default request.defaults({ jar });
