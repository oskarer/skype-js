import request from 'request';
const jar = request.jar();
export default request.defaults({ jar });
