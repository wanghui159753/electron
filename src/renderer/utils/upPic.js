const contextPath = "/tool";
import request from "./request"
import axios from 'axios'
export function getToken(params) {
  return request({
    url: `${contextPath}/oss/qiniu/upToken`,
    method: 'get',
    params: params
  })
}

export function upload(data) {
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: false
  };
  return axios.post('http://upload.qiniu.com/', data, config)
}
export function up(item, dom, fn) {
  const file = item.files[0];
  console.log(file,"获取到的")
  let load;
  if (this.checkUpload.call(dom, file)) {
    load = dom.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    let time=new Date();
    time=time.getTime();
    console.log(time)
    // ?item.files[0].name:time+".png"
    getToken({ "fileName": item.files[0].name?item.files[0].name:time+".png"}).then(response => {
      const url = `${response.data.domain}/${response.data.key}`;
      const formData = new FormData();
      formData.append('token', response.data.upToken);
      formData.append('key', response.data.key);
      formData.append('file', file);
      upload(formData).then(res => {
        fn(res);
        load.close();
      }).catch((res) => {
        fn(res)
        load.close();
      })
    }).catch((res)=>{
      console.log(res)
      load.close();
    })
  } else {
    fn()
  }
}
export function checkUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG && !isPNG) {
    this.$message.error('上传图片只能是jpg/png格式!');
  }
  if (!isLt2M) {
    this.$message.error('上传图片大小不能超过 2MB!');
  }
  return isJPG || isPNG;
}